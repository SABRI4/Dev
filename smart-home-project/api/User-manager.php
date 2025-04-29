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
      case 'GET':
        if (isset($_GET['history']) && isset($_GET['userId'])) {
            $userId = (int)$_GET['userId'];
            $stmt = $pdo->prepare("
                SELECT date_connexion, succes_connexion
                FROM historique_connexion
                WHERE utilisateur_id = ?
                ORDER BY date_connexion DESC
                LIMIT 100
            ");
            $stmt->execute([$userId]);
            $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
            respond(true, ['history' => $history]);
        }

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
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            respond(true, ['users' => $users]);
        } catch (PDOException $e) {
            respond(false, ['message' => 'Erreur lors de la récupération des utilisateurs.'], 500);
        }
        break;

        case 'POST':
          // Récupération des champs envoyés en form-data
          $username    = $_POST['username']    ?? null;
          $password    = $_POST['password']    ?? null;
          $email       = $_POST['email']       ?? null;
          $role        = $_POST['role']        ?? null;
          $points      = isset($_POST['points']) ? (int)$_POST['points'] : 0;
          $nom         = $_POST['nom']         ?? '';
          $prenom      = $_POST['prenom']      ?? '';
          $niveau      = $_POST['niveau']      ?? null;
          $birthdate   = $_POST['birthdate']   ?? null;
          $gender      = $_POST['gender']      ?? null;
          $age         = isset($_POST['age'])   ? (int)$_POST['age'] : null;
          $member_type = $_POST['memberType']   ?? '';
      
          // Photo (inchangée)
          if (!empty($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
              // … upload …
              $photoPath = "uploads/$filename";
          } else {
              $photoPath = 'uploads/default-avatar.jpg';
          }
      
          // Validation basique (note le $ devant password)
          if (
              !$username ||
              !$password ||
              !$email ||
              !$role ||
              $points === null ||
              !$niveau ||
              !$birthdate ||
              !$gender ||
              $age === null
          ) {
              respond(false, ['message' => 'Merci de remplir tous les champs !'], 400);
          }
      
          try {
              // On hache le mot de passe
              $hashed = password_hash($password, PASSWORD_DEFAULT);
      
              $stmt = $pdo->prepare("
                  INSERT INTO users
                    (username, password, nom, prenom, email, photo, role, points, niveau, birthdate, gender, age, member_type)
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
                  $member_type  
              ]);
      
              respond(true, ['message' => 'Utilisateur ajouté avec succès.']);
          } catch (PDOException $e) {
              respond(false, ['message' => "Erreur lors de l'ajout de l'utilisateur."], 500);
          }
          break;
      

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
        
            // 1) Mise à jour **seulement** du mot de passe
            if (isset($data['id'], $data['newPassword'])) {
              try {
                $hashed = password_hash($data['newPassword'], PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $stmt->execute([$hashed, $data['id']]);
                respond(true, ['message' => 'Mot de passe mis à jour.']);
              } catch (PDOException $e) {
                respond(false, ['message' => 'Erreur lors de la mise à jour du mot de passe.'], 500);
              }
              break;
            }
        
            $id           = $data['id']           ?? null;
            $username     = $data['username']     ?? null;
            $email        = $data['email']        ?? null;
            $role         = $data['role']         ?? null;
            $nom          = $data['nom']          ?? '';
            $prenom       = $data['prenom']       ?? '';
            $points       = isset($data['points']) ? (int)$data['points'] : 0;
            $niveau       = $data['niveau']       ?? null;
            $birthdate    = $data['birthdate']    ?? null;
            $gender       = $data['gender']       ?? null;
            $age          = isset($data['age']) ? (int)$data['age'] : null;
            $member_type  = $data['memberType']   ?? ($data['member_type'] ?? '');
        
            if (!$id || !$username || !$email || !$role) {
              respond(false, ['message' => 'ID, username, email et role sont requis.'], 400);
            }
        
            try {
              $sql = "
                UPDATE users SET
                  username     = ?,
                  email        = ?,
                  role         = ?,
                  nom          = ?,
                  prenom       = ?,
                  points       = ?,
                  niveau       = ?,
                  birthdate    = ?,
                  gender       = ?,
                  age          = ?,
                  member_type  = ?
                WHERE id       = ?
              ";
              $stmt = $pdo->prepare($sql);
              $stmt->execute([
                $username,
                $email,
                $role,
                $nom,
                $prenom,
                $points,
                $niveau,
                $birthdate,
                $gender,
                $age,
                $member_type,
                $id
              ]);
        
              // On renvoie l'utilisateur mis à jour
              $sel = $pdo->prepare("SELECT * FROM users WHERE id = ?");
              $sel->execute([$id]);
              $user = $sel->fetch(PDO::FETCH_ASSOC);
        
              respond(true, [
                'message' => 'Utilisateur mis à jour.',
                'user'    => $user
              ]);
            } catch (PDOException $e) {
              respond(false, ['message' => 'Erreur lors de la mise à jour.'], 500);
            }
            break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $data);
        $id = $data['id'] ?? null;

        if (!$id) {
            respond(false, ['message' => 'ID utilisateur manquant.'], 400);
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            respond(true, ['message' => 'Utilisateur supprimé avec succès.']);
        } catch (PDOException $e) {
            respond(false, ['message' => 'Erreur lors de la suppression de l\'utilisateur.'], 500);
        }
        break;

    default:
        respond(false, ['message' => 'Méthode non autorisée.'], 405);
        break;
}
