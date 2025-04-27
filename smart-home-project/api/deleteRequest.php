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

// Modifier la requête pour joindre les tables et obtenir toutes les informations
$stmt = $pdo->prepare("
    SELECT 
        dr.id,
        dr.user_id,
        dr.item_type,
        dr.item_id,
        dr.requested_at,
        u.username,
        u.nom as user_lastname,
        u.prenom as user_firstname,
        u.role as user_role,
        u.niveau as user_level,
        d.name as item_name,
        d.room as item_room,
        d.type as item_type,
        d.status as item_status,
        d.energyConsumption,
        d.batteryLevel,
        d.lastMaintenance
    FROM delete_requests dr
    JOIN users u ON dr.user_id = u.id
    JOIN devices d ON dr.item_id = d.id
    ORDER BY dr.created_at DESC
");

$stmt->execute();
$requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['status' => 'success', 'requests' => $requests]);
