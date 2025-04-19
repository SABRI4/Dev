<?php
session_start();
require_once 'connect.php';

// Forcer le type de contenu JSON et gérer les CORS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Gérer uniquement la méthode POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['email']) || !isset($data['password'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Champs requis manquants.'
        ]);
        exit();
    }

    $email = $data['email'];
    $password = $data['password'];

    // Requête sécurisée avec PDO
    $stmt = $pdo->prepare("SELECT id, username, email, password, photo, role, points FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        if (password_verify($password, $user['password'])) {
            // Authentification réussie
            $_SESSION['user_id']   = $user['id'];
            $_SESSION['username']  = $user['username'];
            $_SESSION['photo']     = $user['photo'];
            $_SESSION['role']      = $user['role'];
            $_SESSION['points']    = $user['points'];

            echo json_encode([
                'status' => 'success',
                'message' => 'Connexion réussie.',
                'user' => [
                    'id'       => $user['id'],
                    'username' => $user['username'],
                    'email'    => $user['email'],
                    'photo'    => $user['photo'],
                    'role'     => $user['role'],
                    'points'   => $user['points']
                ]
            ]);
            exit();
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Mot de passe incorrect.'
            ]);
            exit();
        }
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Utilisateur non trouvé.'
        ]);
        exit();
    }
}
?>
