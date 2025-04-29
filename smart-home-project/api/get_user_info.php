<?php

header('Access-Control-Allow-Origin: http://localhost:3002');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');


session_start();
require_once 'connect.php';

// Vérifie si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    respond(false, ['message' => 'Utilisateur non connecté'], 401);
}

$userId = $_SESSION['user_id'];

// Requête pour récupérer les infos utilisateur
$stmt = $pdo->prepare("SELECT id, username, email, nom, prenom, birthdate, gender, age, member_type, photo FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch();

if ($user) {
    respond(true, ['user' => $user]);
} else {
    respond(false, ['message' => 'Utilisateur introuvable'], 404);
}
