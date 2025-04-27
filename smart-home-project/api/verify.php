<?php
require_once 'connect.php';

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE verification_token = :token AND is_verified = 0");
    $stmt->execute([':token' => $token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $updateStmt = $pdo->prepare("UPDATE users SET is_verified = 1, role = 'simple' WHERE id = :id");
        $stmtUpdate->execute([':token' => $token]);

        echo "✅ Votre compte a été vérifié avec succès ! Vous pouvez maintenant vous connecter.";
    } else {
        echo "❌ Token invalide ou compte déjà vérifié.";
    }
} else {
    echo "❌ Aucune clé de vérification fournie.";
}
?>
