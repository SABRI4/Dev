<?php
session_start();
include 'connect.php';

header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Non authentifié.']);
    exit;
}

$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$role = $stmt->fetchColumn();

if ($role !== 'admin') {
    echo json_encode(['status' => 'error', 'message' => 'Accès refusé.']);
    exit;
}

$requestId = $data['request_id'] ?? null;

if (!$requestId) {
    echo json_encode(['status' => 'error', 'message' => 'ID de requête manquant.']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM delete_requests WHERE id = ?");
$stmt->execute([$requestId]);
$request = $stmt->fetch();

if (!$request) {
    echo json_encode(['status' => 'error', 'message' => 'Demande introuvable.']);
    exit;
}

if ($request['item_type'] === 'device') {
    $stmt = $pdo->prepare("DELETE FROM devices WHERE id = ?");
    $stmt->execute([$request['item_id']]);
}

$stmt = $pdo->prepare("DELETE FROM delete_requests WHERE id = ?");
$stmt->execute([$requestId]);

echo json_encode(['status' => 'success', 'message' => 'Demande traitée.']);
