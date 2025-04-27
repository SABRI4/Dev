<?php

header('Access-Control-Allow-Origin: http://localhost:3002');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // réponse immédiate au preflight
    http_response_code(200);
    exit();
}

$DB_HOST = '127.0.0.1';
$DB_NAME = 'depenses';
$DB_USER = 'root';
$DB_PASS = '';

try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'status'  => 'error',
        'message' => 'Connexion BD impossible : '.$e->getMessage(),
    ]);
    exit();
}

function respond(bool $success, array $data = [], int $code = 200): never
{
    http_response_code($code);
    header('Content-Type: application/json');

    // ➔ Si l'utilisateur est connecté, injecter ses infos à chaque réponse
    if (isset($_SESSION['user_id'])) {
        $data['user'] = [
            'id'       => $_SESSION['user_id'],
            'username' => $_SESSION['username'] ?? '',
            'photo'    => $_SESSION['photo'] ?? '',
            'role'     => $_SESSION['role'] ?? 'simple',
            'points'   => $_SESSION['points'] ?? 0,
            'niveau'   => $_SESSION['niveau'] ?? 'debutant',
            'email'    => $_SESSION['email'] ?? '',
            'nom'      => $_SESSION['nom'] ?? '',
            'prenom'   => $_SESSION['prenom'] ?? '',
            'birthdate'=> $_SESSION['birthdate'] ?? '',
        ];
    }
    

    echo json_encode(
        $success
          ? ['status' => 'success'] + $data
          : ['status' => 'error'] + $data
    );
    exit();
}

function getProfilePhoto(int $userId): string
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT photo FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    return $stmt->fetchColumn() ?: '';
}
