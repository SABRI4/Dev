<?php
session_start();
require_once 'connect.php';
require_once 'vendor/autoload.php'; // pour se servir PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// En-têtes
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sécurisation des entrées
    $username = $_POST['username'] ?? '';
    $email    = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $nom       = $_POST['nom'] ?? '';
    $prenom    = $_POST['prenom'] ?? '';
    $birthdate = $_POST['birthdate'] ?? '0000-00-00';
    $gender    = $_POST['gender'] ?? '';
    $age       = (int)($_POST['age'] ?? 0);
    $member_type = $_POST['member_type'] ?? 'inconnu';

    // Vérifier que les champs obligatoires sont remplis
    if (empty($username) || empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => "Champs requis manquants."]);
        exit();
    }

    // Vérification si l'email existe déjà
    $checkEmail = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $checkEmail->execute([':email' => $email]);
    if ($checkEmail->rowCount() > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Cet email est déjà utilisé. Veuillez en choisir un autre.'
        ]);
        exit();
    }

    // Génération du token de vérification
    $verification_token = bin2hex(random_bytes(32));

    // Hash du mot de passe
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Role par défaut = "visiteur" et non pas simple
    $role = 'visiteur';
    $points = 0;

    // URL publique par défaut
    $publicURL = "http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg";

    // Gestion de la photo si elle existe
    if (isset($_FILES["photo"]) && $_FILES["photo"]["error"] === UPLOAD_ERR_OK) {
        $photo_name = $_FILES["photo"]["name"];
        $photo_tmp_name = $_FILES["photo"]["tmp_name"];
        $photo_name_clean = time() . "_" . preg_replace("/[^A-Za-z0-9_\.-]/", "_", $photo_name);

        $localPath = __DIR__ . "/uploads/" . $photo_name_clean;
        $publicURL = "http://localhost:3020/plateforme/smart-home-project/api/uploads/" . $photo_name_clean;

        if (!move_uploaded_file($photo_tmp_name, $localPath)) {
            echo json_encode(['status' => 'error', 'message' => "Erreur lors de l'enregistrement de la photo."]);
            exit();
        }
    }

    // Insertion dans la base
    $sql = "INSERT INTO users 
        (username, email, password, nom, prenom, photo, role, points, birthdate, gender, age, member_type, verification_token, is_verified) 
        VALUES 
        (:username, :email, :password, :nom, :prenom, :photo, :role, :points, :birthdate, :gender, :age, :member_type, :verification_token, 0)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':username' => $username,
            ':email' => $email,
            ':password' => $hashedPassword,
            ':nom' => $nom,
            ':prenom' => $prenom,
            ':photo' => $publicURL,
            ':role' => $role,
            ':points' => $points,
            ':birthdate' => $birthdate,
            ':gender' => $gender,
            ':age' => $age,
            ':member_type' => $member_type,
            ':verification_token' => $verification_token
        ]);

        // Envoi du mail de vérification
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'comptedepense205@gmail.com'; // Le Gmail
            $mail->Password   = 'inwf odmx dywi rohj';         // Le mdp de l'admin
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->CharSet = 'UTF-8';

            $mail->setFrom('comptedepense205@gmail.com', 'CYHOME');
            $mail->addAddress($email, $username);

            $mail->isHTML(true);
            $mail->Subject = 'Vérifiez votre compte CYHOME';
            $verificationLink = "http://localhost:3020/plateforme/smart-home-project/api/verify.php?token=" . $verification_token;
            $mail->Body    = "Bonjour $username,<br><br>Merci de vous être inscrit sur CYHOME !<br>Veuillez cliquer sur le lien suivant pour vérifier votre compte :<br><a href='$verificationLink'>$verificationLink</a><br><br>Merci !";

            $mail->send();
        } catch (Exception $e) {
            // En cas d'échec de l'email, l'utilisateur est créé quand même mais non vérifié
            error_log("Erreur envoi email : {$mail->ErrorInfo}");
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Compte créé avec succès. Vérifiez votre email pour activer votre compte.'
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
