<?php

header('Access-Control-Allow-Origin: http://localhost:3002');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once 'connect.php';
require_once 'pointsManager.php'; // Pour ajouter des points et gérer niveau/role
global $pdo;

$method  = $_SERVER['REQUEST_METHOD'];
$id      = $_GET['id'] ?? null;


if ($_SERVER['REQUEST_METHOD']==='GET' && ($_GET['action'] ?? '')==='categories') {
    // on récupère tous les types de façon unique
    $cats = $pdo
      ->query("SELECT DISTINCT `type` FROM devices ORDER BY `type`")
      ->fetchAll(PDO::FETCH_COLUMN);
    respond(true, ['categories' => $cats]);
}

if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM devices WHERE id = ?");
        $stmt->execute([$id]);
        $device = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($device) {
            // Ajouter 0.5 points pour consultation d'un device
            if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) {
                ajouterPoints($_SESSION['user_id'], 0.5);
                updateSession($_SESSION['user_id']);
            }
            respond(true, ['device' => $device]);
        } else {
            respond(false, ['message' => 'Not found'], 404);
        }
    } else {
        $devices = $pdo->query("SELECT * FROM devices ORDER BY id")->fetchAll(PDO::FETCH_ASSOC);

        // Ajouter 0.5 points pour consultation liste
        if (isset($_SESSION['user_id'])) {
            ajouterPoints($_SESSION['user_id'], 0.5);
            updateSession($_SESSION['user_id']);
        }
        respond(true, ['devices' => $devices]);
    }
}

if ($method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true) ?: [];
    if (!isset($payload['name'], $payload['type'], $payload['room'])) {
        respond(false, ['message' => 'Champs manquants'], 422);
    }

    $sql = "INSERT INTO devices 
              (name, type, status, room, data, energyConsumption, batteryLevel, lastMaintenance) 
            VALUES 
              (:name, :type, :status, :room, :data, :e, :b, :lm)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name'   => $payload['name'],
        ':type'   => $payload['type'],
        ':status' => $payload['status'] ?? 'actif',
        ':room'   => $payload['room'],
        ':data'   => $payload['data'] ?? null,
        ':e'      => $payload['energyConsumption'] ?? 0,
        ':b'      => $payload['batteryLevel'] ?? 100,
        ':lm'     => $payload['lastMaintenance'] ?? date('Y-m-d')
    ]);

    // Ajouter 1 point pour ajout
    if (isset($_SESSION['user_id'])) {
        ajouterPoints($_SESSION['user_id'], 1);
        updateSession($_SESSION['user_id']);
    }

    respond(true, ['id' => $pdo->lastInsertId()], 201);
}

if ($method === 'PUT' && $id) {
    $payload = json_decode(file_get_contents('php://input'), true) ?: [];
    if (!$payload) respond(false, ['message' => 'Rien à mettre à jour'], 422);

    $cols = [];
    $vals = [];
    foreach ($payload as $k => $v) {
        $cols[] = "`$k` = ?";
        $vals[] = $v;
    }
    $vals[] = $id;
    $sql = "UPDATE devices SET " . implode(',', $cols) . " WHERE id=?";
    $pdo->prepare($sql)->execute($vals);

    // Ajouter 1 point pour modification
    if (isset($_SESSION['user_id'])) {
        ajouterPoints($_SESSION['user_id'], 1);
        updateSession($_SESSION['user_id']);
    }

    respond(true);
}

if ($method === 'DELETE' && $id) {
    $pdo->prepare("DELETE FROM devices WHERE id = ?")->execute([$id]);
    respond(true);
}

respond(false, ['message' => 'Méthode non autorisée'], 405);


//Fonction pour mettre à jour la session (points, niveau, role)
function updateSession($userId) {
    if (empty($userId)) return;
    global $pdo;
    $stmt = $pdo->prepare("SELECT points, niveau, role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $_SESSION['points'] = $user['points'];
        $_SESSION['niveau'] = $user['niveau'];
        $_SESSION['role']   = $user['role'];
    }
}

if ($method === 'GET' && ($_GET['action'] ?? '') === 'categories') {
    $cats = $pdo->query("SELECT * FROM categories ORDER BY name")->fetchAll(PDO::FETCH_ASSOC);
    respond(true, ['categories' => $cats]);
}

if ($method === 'POST' && ($_GET['action'] ?? '') === 'addCategory') {
    $payload = json_decode(file_get_contents('php://input'), true) ?: [];

    if (!isset($payload['name']) || empty(trim($payload['name']))) {
        respond(false, ['message' => 'Nom de catégorie manquant'], 422);
    }

    $stmt = $pdo->prepare("INSERT INTO categories (name) VALUES (?)");
    try {
        $stmt->execute([trim($payload['name'])]);
        respond(true, ['id' => $pdo->lastInsertId(), 'name' => trim($payload['name'])], 201);
    } catch (PDOException $e) {
        respond(false, ['message' => 'Erreur lors de l\'ajout: ' . $e->getMessage()], 500);
    }
}

if ($method === 'DELETE' && ($_GET['action'] ?? '') === 'deleteCategory' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    respond(true, ['message' => 'Catégorie supprimée']);
}
?>
