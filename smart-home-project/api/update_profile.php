<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3002');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'connect.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Non authentifié']);
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    // Récupération des données du formulaire
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $nom = $_POST['nom'] ?? '';
    $prenom = $_POST['prenom'] ?? '';
    $birthdate = $_POST['birthdate'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $age = $_POST['age'] ?? '';
    $member_type = $_POST['member_type'] ?? '';

    // Validation des données
    if (empty($username) || empty($email) || empty($nom) || empty($prenom) || empty($gender) || empty($age) || empty($member_type)) {
        echo json_encode(['status' => 'error', 'message' => 'Tous les champs sont requis']);
        exit();
    }

    // Vérification de l'unicité de l'email et du username
    $stmt = $pdo->prepare("SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?");
    $stmt->execute([$email, $username, $user_id]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email ou nom d\'utilisateur déjà utilisé']);
        exit();
    }

    // Gestion de la photo de profil
    $photo_path = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $file_type = $_FILES['photo']['type'];
        
        if (!in_array($file_type, $allowed_types)) {
            echo json_encode(['status' => 'error', 'message' => 'Format de fichier non supporté']);
            exit();
        }

        $upload_dir = 'uploads/profiles/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $file_extension = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
        $photo_name = uniqid('profile_') . '.' . $file_extension;
        $photo_path = $upload_dir . $photo_name;

        if (!move_uploaded_file($_FILES['photo']['tmp_name'], $photo_path)) {
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors du téléchargement de la photo']);
            exit();
        }

        // Suppression de l'ancienne photo si elle existe
        $stmt = $pdo->prepare("SELECT photo FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $old_photo = $stmt->fetchColumn();
        if ($old_photo && file_exists($old_photo)) {
            unlink($old_photo);
        }
    }

    // Mise à jour du profil
    $sql = "UPDATE users SET 
            username = ?, 
            email = ?, 
            nom = ?, 
            prenom = ?, 
            birthdate = ?, 
            gender = ?, 
            age = ?, 
            member_type = ?";
    
    $params = [$username, $email, $nom, $prenom, $birthdate, $gender, $age, $member_type];

    if ($photo_path) {
        $sql .= ", photo = ?";
        $params[] = $photo_path;
    }

    $sql .= " WHERE id = ?";
    $params[] = $user_id;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    // Récupération des données mises à jour
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Nettoyage des données sensibles
    unset($user['password']);

    echo json_encode([
        'status' => 'success',
        'message' => 'Profil mis à jour avec succès',
        'user' => $user
    ]);

} catch (PDOException $e) {
    error_log("Erreur de base de données : " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la mise à jour du profil']);
} catch (Exception $e) {
    error_log("Erreur : " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Une erreur est survenue']);
}
?>
