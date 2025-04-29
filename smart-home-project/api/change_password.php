<?php
session_start();
include __DIR__ . '/connect.php';

header('Content-Type: application/json');

// Vérification de la session
if (!isset($_SESSION['user_id'])) {
    respond(false, ['message' => 'Non authentifié'], 401);
}

// Vérification de la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, ['message' => 'Méthode non autorisée'], 405);
}

// Récupération des données
$data = json_decode(file_get_contents('php://input'), true);
$currentPassword = $data['currentPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';
$confirmPassword = $data['confirmPassword'] ?? '';

// Validation des données
if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
    respond(false, ['message' => 'Tous les champs sont requis'], 400);
}

if ($newPassword !== $confirmPassword) {
    respond(false, ['message' => 'Les nouveaux mots de passe ne correspondent pas'], 400);
}

if (strlen($newPassword) < 8) {
    respond(false, ['message' => 'Le nouveau mot de passe doit contenir au moins 8 caractères'], 400);
}

try {
    // Vérification du mot de passe actuel
    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($currentPassword, $user['password'])) {
        respond(false, ['message' => 'Mot de passe actuel incorrect'], 400);
    }

    // Mise à jour du mot de passe
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->execute([$hashedPassword, $_SESSION['user_id']]);

    respond(true, ['message' => 'Mot de passe modifié avec succès']);

} catch (PDOException $e) {
    respond(false, ['message' => 'Erreur lors de la modification du mot de passe'], 500);
}
?> 