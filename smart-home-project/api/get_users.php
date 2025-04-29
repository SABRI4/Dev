<?php
session_start();
include __DIR__ . '/connect.php';

header('Content-Type: application/json');

// Vérification de la session
if (!isset($_SESSION['user_id'])) {
    respond(false, ['message' => 'Non authentifié'], 401);
}

try {
    // Récupération des utilisateurs avec leurs informations de base
    $stmt = $pdo->prepare("
        SELECT 
            id,
            username,
            age,
            gender,
            birthdate,
            member_type,
            photo
        FROM users
        ORDER BY username ASC
    ");
    
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    respond(true, ['users' => $users]);

} catch (PDOException $e) {
    respond(false, ['message' => 'Erreur de base de données: ' . $e->getMessage()], 500);
} catch (Exception $e) {
    respond(false, ['message' => 'Erreur: ' . $e->getMessage()], 500);
}
?>