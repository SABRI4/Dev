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

// Commencer une transaction
mysqli_begin_transaction($conn);

try {
    // Créer l'utilisateur
    $query = "INSERT INTO users (username, email, password, nom, prenom, birthdate, gender, age, member_type, role, points, niveau) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'user', 0, 'débutant')";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "sssssssss", 
        $request['username'],
        $request['email'],
        $request['password'],
        $request['nom'],
        $request['prenom'],
        $request['birthdate'],
        $request['gender'],
        $request['age'],
        $request['member_type']
    );
    mysqli_stmt_execute($stmt);

    // Mettre à jour le statut de la demande
    $query = "UPDATE registration_requests SET status = 'approved', approved_at = NOW() WHERE id = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $requestId);
    mysqli_stmt_execute($stmt);

    // Envoyer l'email de confirmation
    $to = $request['email'];
    $subject = "Votre inscription a été validée";
    $message = "Bonjour " . $request['prenom'] . ",\n\n";
    $message .= "Votre inscription a été validée par un administrateur. Vous pouvez maintenant vous connecter à votre compte.\n\n";
    $message .= "Cordialement,\nL'équipe de Smart Home";
    $headers = "From: noreply@smarthome.com";

    mail($to, $subject, $message, $headers);

    // Valider la transaction
    mysqli_commit($conn);
    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    // Annuler la transaction en cas d'erreur
    mysqli_rollback($conn);
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la validation de l\'inscription']);
}
?> 