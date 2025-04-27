<?php
session_start();
require_once 'connect.php';
require_once 'pointsManager.php'; 

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
    $stmt = $pdo->prepare("SELECT id, username, nom, prenom, email, password, niveau, birthdate, photo, role, points FROM users WHERE email = ?");
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
            $_SESSION['niveau']    = $user['niveau'];
            $_SESSION['email']     = $user['email'];
            $_SESSION['nom']       = $user['nom'];
            $_SESSION['prenom']    = $user['prenom'];
            $_SESSION['birthdate'] = $user['birthdate'];

            // ✅ Ajouter 0.25 points pour connexion
            ajouterPoints($user['id'], 0.25);

            // Recharger les nouveaux points et niveau après ajout
            $stmt = $pdo->prepare("SELECT points, niveau FROM users WHERE id = ?");
            $stmt->execute([$user['id']]);
            $updated = $stmt->fetch();

            // Mettre à jour la session
            $_SESSION['points'] = $updated['points'];
            $_SESSION['niveau'] = $updated['niveau'];

            echo json_encode([
                'status' => 'success',
                'message' => 'Connexion réussie.',
                'user' => [
                    'id'       => $user['id'],
                    'username' => $user['username'],
                    'email'    => $user['email'],
                    'photo'    => $user['photo'],
                    'role'     => $user['role'],
                    'niveau'   => $updated['niveau'], // on envoie le nouveau niveau
                    'points'   => $updated['points'], // on envoie les points mis à jour
                    'nom'      => $user['nom'],
                    'prenom'   => $user['prenom'],
                    'birthdate'=> $user['birthdate']
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
