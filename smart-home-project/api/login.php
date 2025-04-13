<?php
session_start();
include 'connect.php';

// Forcer le type de contenu JSON et gérer les CORS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Gérer seulement la méthode POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Échapper les entrées pour éviter les injections SQL
    $username = $conn->real_escape_string($_POST['username']);
    $password = $_POST['password'];

    // Sélectionner les informations nécessaires depuis la table users
    $sql = "SELECT id, username, password, photo, role, points FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        // Vérification du mot de passe haché
        if (password_verify($password, $user['password'])) {
            // Stocker les infos utilisateur en session (facultatif)
            $_SESSION['user_id']   = $user['id'];
            $_SESSION['username']  = $user['username'];
            $_SESSION['photo']     = $user['photo'];
            $_SESSION['role']      = $user['role'];
            $_SESSION['points']    = $user['points'];

            // Répondre avec du JSON "success" incluant les données utilisateur
            echo json_encode([
                'status'  => 'success',
                'message' => 'Connexion réussie.',
                'user'    => [
                    'id'       => $user['id'],
                    'username' => $user['username'],
                    'role'     => $user['role'],
                    'photo'    => $user['photo'],
                    'points'   => $user['points']
                ]
            ]);
            exit();
        } else {
            // Mot de passe incorrect
            echo json_encode([
                'status'  => 'error',
                'message' => 'Mot de passe incorrect.'
            ]);
            exit();
        }
    } else {
        // Aucun utilisateur trouvé
        echo json_encode([
            'status'  => 'error',
            'message' => 'Utilisateur non trouvé.'
        ]);
        exit();
    }

    $stmt->close();
    $conn->close();
}
?>
