<?php
session_start();
include __DIR__ . '/connect.php'; // Assure-toi que le chemin est correct

header('Content-Type: application/json');

// Gérer uniquement les requêtes POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupération des données
    $user_id   = $_SESSION['user_id'] ?? null;
    $item_type = $_POST['item_type'] ?? '';
    $item_id   = $_POST['item_id'] ?? '';

    // Vérifie les champs
    if (!$user_id || !$item_type || !$item_id) {
        respond(false, ['message' => 'Données manquantes.'], 400);
    }

    try {
        // Préparer et exécuter l'insertion dans delete_requests
        $stmt = $pdo->prepare("INSERT INTO delete_requests (user_id, item_type, item_id) VALUES (?, ?, ?)");
        $stmt->execute([$user_id, $item_type, $item_id]);

        // Réponse JSON de succès
        respond(true, ['message' => 'Demande de suppression envoyée.']);
    } catch (PDOException $e) {
        // En cas d'erreur SQL
        respond(false, ['message' => 'Erreur serveur : '.$e->getMessage()], 500);
    }
} else {
    // Si la méthode HTTP n’est pas POST
    respond(false, ['message' => 'Méthode non autorisée.'], 405);
}
