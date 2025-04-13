<?php
session_start();
include 'connect.php';

// On indique qu'on renvoie du JSON et on gère CORS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer les champs de base
    $username = $conn->real_escape_string($_POST['username']);
    $email    = $conn->real_escape_string($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $role     = 'simple'; // Par défaut
    $points   = 0;        // Par défaut

    // Récupérer la date, le genre, l'âge et le type de membre
    $birthdate   = $conn->real_escape_string($_POST['birthdate'] ?? '0000-00-00');
    $gender      = $conn->real_escape_string($_POST['gender'] ?? '');
    $age         = (int)($_POST['age'] ?? 0);
    $member_type = $conn->real_escape_string($_POST['member_type'] ?? 'inconnu');

    // Par défaut, l'URL publique de l'avatar
    $publicURL = "http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg";

    // Gestion de l'upload
    if (isset($_FILES["photo"]) && $_FILES["photo"]["error"] == UPLOAD_ERR_OK) {
        $photo_name     = $_FILES["photo"]["name"];
        $photo_tmp_name = $_FILES["photo"]["tmp_name"];
        // Nettoyage du nom (caractères spéciaux) + préfixe par time()
        $photo_name_clean = time() . "_" . preg_replace("/[^A-Za-z0-9_\.-]/", "_", $photo_name);

        // Chemin local sur le disque pour move_uploaded_file
        $localPath = __DIR__ . "/uploads/" . $photo_name_clean;
        // URL publique pour l'affichage
        $publicURL = "http://localhost:3020/plateforme/smart-home-project/api/uploads/" . $photo_name_clean;

        if (!move_uploaded_file($photo_tmp_name, $localPath)) {
            echo json_encode([
                'status'  => 'error',
                'message' => "Une erreur s'est produite lors de l'enregistrement de la photo."
            ]);
            exit();
        }
    }

    // Préparer la requête d'insertion
    $sql = "INSERT INTO users
    (username, email, password, photo, role, points, birthdate, gender, age, member_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if ($stmt) {
        // 1) username = s
        // 2) email = s
        // 3) password = s
        // 4) photo (publicURL) = s
        // 5) role = s
        // 6) points = i
        // 7) birthdate = s
        // 8) gender = s
        // 9) age = i
        // 10) member_type = s
        $stmt->bind_param(
            "sssssisiss",
            $username,    // s
            $email,       // s
            $password,    // s
            $publicURL,   // s
            $role,        // s
            $points,      // i
            $birthdate,   // s (car MySQL attend une chaîne pour la date)
            $gender,      // s
            $age,         // i
            $member_type  // s
        );

        if ($stmt->execute()) {
            echo json_encode([
                'status'  => 'success',
                'message' => 'Compte créé avec succès.'
            ]);
            exit();
        } else {
            echo json_encode([
                'status'  => 'error',
                'message' => 'Erreur: ' . $stmt->error
            ]);
        }
        $stmt->close();
    } else {
        echo json_encode([
            'status'  => 'error',
            'message' => 'Erreur: ' . $conn->error
        ]);
    }

    $conn->close();
}
?>
