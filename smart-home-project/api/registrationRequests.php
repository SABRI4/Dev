<?php
header('Access-Control-Allow-Origin: http://localhost:3002');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once 'connect.php';
session_start();

// Log pour déboguer
error_log('Session user: ' . print_r($_SESSION['user'], true));

// Vérifier si l'utilisateur est connecté et est un administrateur
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(['status' => 'error', 'message' => 'Accès non autorisé']);
    exit;
}

// Récupérer toutes les demandes d'inscription en attente
$query = "SELECT * FROM registration_requests WHERE status = 'pending' ORDER BY created_at DESC";
$result = mysqli_query($conn, $query);

if ($result) {
    $requests = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $requests[] = $row;
    }
    echo json_encode(['status' => 'success', 'requests' => $requests]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la récupération des demandes']);
}
?> 