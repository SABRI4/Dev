<?php
require_once 'connect.php';
require_once 'levelManager.php'; // pour calculer le niveau automatiquement

function ajouterPoints($userId, $pointsAjoutes) {
    global $pdo; 
    if (!$userId || $pointsAjoutes <= 0) {
        return false;
    }

    // Récupérer les points et le niveau actuels
    $stmt = $pdo->prepare("SELECT points, niveau FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        return false;
    }

    $nouveauxPoints = $user['points'] + $pointsAjoutes;
    $nouveauNiveau = calculerNiveau($nouveauxPoints);
    $nouveauRole = determinerRole($nouveauNiveau);

    // Mettre à jour points + les roles
    $stmt = $pdo->prepare("UPDATE users SET points = ?, niveau = ?, role = ? WHERE id = ?");
    return $stmt->execute([$nouveauxPoints, $nouveauNiveau, $nouveauRole, $userId]);
}

// Fonction pour déterminer le rôle selon le niveau
function determinerRole($niveau) {
    if ($niveau === 'expert') {
        return 'admin';
    } elseif ($niveau === 'avance') {
        return 'complexe';
    } else {
        return 'simple';
    }
}
?>
