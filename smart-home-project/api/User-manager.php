<?php
// User-manager.php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
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
                    username AS name,
                    nom,
                    prenom,
                    email,
                    photo,
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
        // On attend un formulaire multipart/form-data
        $username  = $_POST['username']  ?? null;
        $password  = $_POST['password']  ?? null;
        $email     = $_POST['email']     ?? null;
        $role      = $_POST['role']      ?? null;
        $points    = $_POST['points']    ?? 0;
        // On déclare nom/prenom même s'ils ne sont pas envoyés pour éviter le warning
        $nom       = $_POST['nom']       ?? '';
        $prenom    = $_POST['prenom']    ?? '';
        $niveau    = $_POST['niveau']    ?? null;
        $birthdate = $_POST['birthdate'] ?? null;
        $gender    = $_POST['gender']    ?? null;
        $age       = $_POST['age']       ?? null;

        // Photo de profil (optionnelle)
        if (!empty($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $uploadDir   = __DIR__ . '/uploads/';
            $tmpName     = $_FILES['photo']['tmp_name'];
            $filename    = uniqid('avatar_') . '-' . basename($_FILES['photo']['name']);
            $destination = $uploadDir . $filename;
            move_uploaded_file($tmpName, $destination);
            $photoPath   = "uploads/$filename";
        } else {
            // Image par défaut
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
            // Hash du mot de passe
            $hashed = password_hash($password, PASSWORD_DEFAULT);

            // Requête d’insertion
            $stmt = $pdo->prepare("
                INSERT INTO users
                  (username, password, nom, prenom, email, photo, role, points, niveau, birthdate, gender, age)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                $age
            ]);

            respond(true, ['message' => 'Utilisateur ajouté avec succès.']);
        } catch (PDOException $e) {
            respond(false, ['message' => 'Erreur lors de l\'ajout de l\'utilisateur.'], 500);
        }
        break;

    case 'PUT':
        // Modifier un utilisateur
        $data = json_decode(file_get_contents("php://input"), true);

        if (
            !isset(
                $data['id'],
                $data['username'],
                $data['role'],
                $data['email'],
                $data['photo']
            )
        ) {
            respond(false, ['message' => 'Paramètres requis manquants.'], 400);
        }

        try {
            $sql = "
                UPDATE users
                SET
                    username = ?,
                    role     = ?,
                    nom      = ?,
                    prenom   = ?,
                    email    = ?,
                    photo    = ?
                WHERE id = ?
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['username'],
                $data['role'],
                $data['nom']    ?? '',
                $data['prenom'] ?? '',
                $data['email'],
                $data['photo'],
                $data['id']
            ]);

            respond(true, ['message' => 'Utilisateur mis à jour avec succès.']);
        } catch (PDOException $e) {
            respond(false, ['message' => 'Erreur lors de la mise à jour de l\'utilisateur.'], 500);
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
