<<<<<<< HEAD
<?php
session_start(); 

// Vider toutes les variables de session
$_SESSION = array();

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

session_destroy();

header("Location: Accueil.php");
exit();
?>
=======
<?php
session_start(); 

// Vider toutes les variables de session
$_SESSION = array();

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

session_destroy();

header("Location: Accueil.php");
exit();
?>
>>>>>>> 58a360e (test)
