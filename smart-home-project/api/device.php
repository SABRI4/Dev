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
global $pdo;


$method  = $_SERVER['REQUEST_METHOD'];
$id      = $_GET['id']   ?? null;


if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM devices WHERE id = ?");
        $stmt->execute([$id]);
        $device = $stmt->fetch(PDO::FETCH_ASSOC);
        $device ? respond(true, ['device'=>$device])
                : respond(false,['message'=>'Not found'],404);
    } else {
        $devices = $pdo->query("SELECT * FROM devices ORDER BY id")->fetchAll(PDO::FETCH_ASSOC);
        respond(true, ['devices'=>$devices]);
    }
}


if ($method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true) ?: [];
    if (!isset($payload['name'],$payload['type'],$payload['room'])) {
        respond(false, ['message'=>'Champs manquants'], 422);
    }

    $sql = "INSERT INTO devices 
              (name,type,status,room,data,energyConsumption,batteryLevel,lastMaintenance) 
            VALUES 
              (:name,:type,:status,:room,:data,:e,:b,:lm)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name'   => $payload['name'],
        ':type'   => $payload['type'],
        ':status' => $payload['status']      ?? 'actif',
        ':room'   => $payload['room'],
        ':data'   => $payload['data']        ?? null,
        ':e'      => $payload['energyConsumption'] ?? 0,
        ':b'      => $payload['batteryLevel'] ?? 100,
        ':lm'     => $payload['lastMaintenance'] ?? date('Y-m-d')
    ]);

    respond(true, ['id'=>$pdo->lastInsertId()], 201);
}


if ($method === 'PUT' && $id) {
    $payload = json_decode(file_get_contents('php://input'), true) ?: [];
    if (!$payload) respond(false, ['message'=>'Rien à mettre à jour'],422);

    /* on prépare dynamiquement le SET xxx=?, yyy=? ...         */
    $cols = [];
    $vals = [];
    foreach ($payload as $k=>$v) {
        $cols[]   = "`$k` = ?";
        $vals[]   = $v;
    }
    $vals[] = $id;
    $sql = "UPDATE devices SET ".implode(',',$cols)." WHERE id=?";
    $pdo->prepare($sql)->execute($vals);

    respond(true);
}


if ($method === 'DELETE' && $id) {
    $pdo->prepare("DELETE FROM devices WHERE id = ?")->execute([$id]);
    respond(true);
}

respond(false, ['message'=>'Méthode non autorisée'], 405);
