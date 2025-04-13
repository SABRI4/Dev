<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "depenses"; // A changer dcp

// Création de la connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérification de la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fonction pour récupérer le lien vers la photo de profil d'un utilisateur
function getProfilePhoto($userId) {
    global $conn;
    
    $sql = "SELECT photo FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->bind_result($photo);
        
        $stmt->fetch();
        
        return $photo;
    } else {
        // En cas d'erreur, retourner une chaîne vide
        return "";
    }
}
?>
