<?php
session_start();
include 'connect.php';

header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

$stmt = $pdo->prepare("SELECT * FROM delete_requests ORDER BY created_at DESC");
$stmt->execute();
$requests = $stmt->fetchAll();

echo json_encode(['status' => 'success', 'requests' => $requests]);
