<?php
session_start();
require_once 'connect.php';
require_once 'pointsManager.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$email    = $data['email']    ?? '';
$password = $data['password'] ?? '';

// Requête sécurisée
$stmt = $pdo->prepare("
    SELECT id, username, nom, prenom, email, password, niveau, birthdate, photo, role, points 
    FROM users 
    WHERE email = ?
");
$stmt->execute([$email]);
$user = $stmt->fetch();

$ip       = $_SERVER['REMOTE_ADDR'];
$now      = date('Y-m-d H:i:s');
$success  = false;

if ($user && password_verify($password, $user['password'])) {
    // Auth OK
    $success = true;

    // Remplissage session + points…
    $_SESSION['user_id']   = $user['id'];

    // donner 0.25 pt
    ajouterPoints($user['id'], 0.25);
    $stmt = $pdo->prepare("SELECT points, niveau FROM users WHERE id = ?");
    $stmt->execute([$user['id']]);
    $updated = $stmt->fetch();
    $_SESSION['points'] = $updated['points'];
    $_SESSION['niveau'] = $updated['niveau'];

    $response = [
        'status'  => 'success',
        'message' => 'Connexion réussie.',
        'user'    => [
            'id'       => $user['id'],
            'username' => $user['username'],
            'email'    => $user['email'],
            'photo'    => $user['photo'],
            'role'     => $user['role'],
            'niveau'   => $updated['niveau'],
            'points'   => $updated['points'],
            'nom'      => $user['nom'],
            'prenom'   => $user['prenom'],
            'birthdate'=> $user['birthdate'],
        ]
    ];
} else {
    // Échec de l’auth
    $response = [
        'status'  => 'error',
        'message' => $user ? 'Mot de passe incorrect.' : 'Utilisateur non trouvé.'
    ];
}

$insert = $pdo->prepare("
    INSERT INTO historique_connexion
      (utilisateur_id, date_connexion, succes_connexion)
    VALUES (?, ?, ?)
");
$insert->execute([
    $user['id']  ?? null,
    $now,
    (int) $success
]);

echo json_encode($response);
exit();
