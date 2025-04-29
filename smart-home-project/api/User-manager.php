<?php
// User-manager.php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Liste tous les utilisateurs
        try {
            $sql = "
                SELECT
                    id,
                    username,
                    username AS name,
                    nom,
                    prenom,
                    email,
                    niveau,
                    birthdate,
                    photo,
                    member_type,
                    role,
                    points,
                    gender,
                    age
                FROM users
            ";
            $stmt  = $pdo->query($sql);
            $users = $stmt->fetchAll();
            respond(true, ['users' => $users]);
        } catch (PDOException $e) {
            respond(false, ['message' => 'Erreur lors de la récupération des utilisateurs.'], 500);
        }
        break;

    case 'POST':
        $username  = $_POST['username']  ?? null;
        $password  = $_POST['password']  ?? null;
        $email     = $_POST['email']     ?? null;
        $role      = $_POST['role']      ?? null;
        $points    = $_POST['points']    ?? 0;
        $nom       = $_POST['nom']       ?? '';
        $prenom    = $_POST['prenom']    ?? '';
        $niveau    = $_POST['niveau']    ?? null;
        $birthdate = $_POST['birthdate'] ?? null;
        $gender    = $_POST['gender']    ?? null;
        $age       = $_POST['age']       ?? null;

        if (!empty($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $uploadDir   = __DIR__ . '/uploads/';
            $tmpName     = $_FILES['photo']['tmp_name'];
            $filename    = uniqid('avatar_') . '-' . basename($_FILES['photo']['name']);
            $destination = $uploadDir . $filename;
            move_uploaded_file($tmpName, $destination);
            $photoPath   = "uploads/$filename";
        } else {
            $photoPath = 'uploads/default-avatar.jpg';
        }

        // Validation basique
        if (
            !$username  ||
            !$password  ||
            !$email     ||
            !$role      ||
            $points === null ||
            !$niveau    ||
            !$birthdate ||
            !$gender    ||
            $age === null
        ) {
            respond(false, ['message' => 'Merci de remplir tous les champs !'], 400);
        }

        try {
            $hashed = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("
                INSERT INTO users
                  (username, password, nom, prenom, email, photo, role, points, niveau, birthdate, gender, age,  memberType)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $username,
                $hashed,
                $nom,
                $prenom,
                $email,
                $photoPath,
                $role,
                $points,
                $niveau,
                $birthdate,
                $gender,
                $age,
                $memberType
            ]);

            respond(true, ['message' => 'Utilisateur ajouté avec succès.']);
        } catch (PDOException $e) {
            respond(false, ['message' => 'Erreur lors de l\'ajout de l\'utilisateur.'], 500);
        }
        break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
        
            // On ne force plus 'niveau' ni 'age' ici
            if (
                !isset($data['username'], $data['email'], $data['role'])
            ) {
                respond(false, ['message' => 'ID, username, email et role sont requis.'], 400);
            }
        
            // Puis dans l'UPDATE, on ne touche que ce qu'on a vraiment
            try {
                $sql = "
                    UPDATE users
                       SET username  = ?,
                           email     = ?,
                           role      = ?
                     WHERE id        = ?
                ";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    $data['username'],
                    $data['email'],
                    $data['role'],
                    $data['id']
                ]);
                respond(true, ['message' => 'Utilisateur mis à jour.']);
            } catch (PDOException $e) {
                respond(false, ['message' => 'Erreur à la mise à jour.'], 500);
            }
            break;
        

    case 'DELETE':
        // Supprimer un utilisateur
        parse_str(file_get_contents("php://input"), $data);

        if (!isset($data['id'])) {
            respond(false, ['message' => 'ID utilisateur manquant.'], 400);
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$data['id']]);
            respond(true, ['message' => 'Utilisateur supprimé avec succès.']);
        } catch (PDOException $e) {
            respond(false, ['message' => 'Erreur lors de la suppression de l\'utilisateur.'], 500);
        }
        break;

    default:
        respond(false, ['message' => 'Méthode non autorisée.'], 405);
        break;
}
