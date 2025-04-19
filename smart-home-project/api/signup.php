<?php
session_start();
require_once 'connect.php';

// On indique qu'on renvoie du JSON et on gère CORS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sécurisation des entrées
    $username = $_POST['username'] ?? '';
    $email    = $_POST['email'] ?? '';
    $password = password_hash($_POST['password'] ?? '', PASSWORD_DEFAULT);
    $role     = 'simple';
    $points   = 0;

    $birthdate   = $_POST['birthdate'] ?? '0000-00-00';
    $gender      = $_POST['gender'] ?? '';
    $age         = (int)($_POST['age'] ?? 0);
    $member_type = $_POST['member_type'] ?? 'inconnu';

    // URL publique par défaut
    $publicURL = "http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg";

    // Gestion du fichier uploadé
    if (isset($_FILES["photo"]) && $_FILES["photo"]["error"] === UPLOAD_ERR_OK) {
        $photo_name     = $_FILES["photo"]["name"];
        $photo_tmp_name = $_FILES["photo"]["tmp_name"];
        $photo_name_clean = time() . "_" . preg_replace("/[^A-Za-z0-9_\.-]/", "_", $photo_name);

        $localPath = __DIR__ . "/uploads/" . $photo_name_clean;
        $publicURL = "http://localhost:3020/plateforme/smart-home-project/api/uploads/" . $photo_name_clean;

        if (!move_uploaded_file($photo_tmp_name, $localPath)) {
            echo json_encode([
                'status' => 'error',
                'message' => "Erreur lors de l'enregistrement de la photo."
            ]);
            exit();
        }
    }

    // Requête avec PDO
    $sql = "INSERT INTO users 
        (username, email, password, photo, role, points, birthdate, gender, age, member_type) 
        VALUES (:username, :email, :password, :photo, :role, :points, :birthdate, :gender, :age, :member_type)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':username'    => $username,
            ':email'       => $email,
            ':password'    => $password,
            ':photo'       => $publicURL,
            ':role'        => $role,
            ':points'      => $points,
            ':birthdate'   => $birthdate,
            ':gender'      => $gender,
            ':age'         => $age,
            ':member_type' => $member_type
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Compte créé avec succès.'
        ]);
        exit();
    } catch (PDOException $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Erreur SQL : ' . $e->getMessage()
        ]);
        exit();
    }
}
?>
