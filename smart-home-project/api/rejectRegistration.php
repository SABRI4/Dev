<?php
header('Access-Control-Allow-Origin: http://localhost:3002');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once 'connect.php';
session_start();

// Vérifier si l'utilisateur est connecté et est un administrateur
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(['status' => 'error', 'message' => 'Accès non autorisé']);
    exit;
}

// Récupérer les données de la requête
$data = json_decode(file_get_contents('php://input'), true);
$requestId = $data['request_id'];

// Récupérer les informations de la demande
$query = "SELECT * FROM registration_requests WHERE id = ? AND status = 'pending'";
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, "i", $requestId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$request = mysqli_fetch_assoc($result);

if (!$request) {
    echo json_encode(['status' => 'error', 'message' => 'Demande non trouvée ou déjà traitée']);
    exit;
}

// Mettre à jour le statut de la demande
$query = "UPDATE registration_requests SET status = 'rejected', rejected_at = NOW() WHERE id = ?";
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, "i", $requestId);

if (mysqli_stmt_execute($stmt)) {
    // Envoyer l'email de rejet
    $to = $request['email'];
    $subject = "Votre demande d'inscription a été rejetée";
    $message = "Bonjour " . $request['prenom'] . ",\n\n";
    $message .= "Nous regrettons de vous informer que votre demande d'inscription a été rejetée.\n\n";
    $message .= "Cordialement,\nL'équipe de Smart Home";
    $headers = "From: noreply@smarthome.com";

    mail($to, $subject, $message, $headers);

    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors du rejet de l\'inscription']);
}
?> 