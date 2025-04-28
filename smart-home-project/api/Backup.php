<?php
// Génère un dump de la base de données MySQL et renvoie le chemin du fichier JSON

header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if (
    $_SERVER['REQUEST_METHOD'] === 'OPTIONS'
) {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/connect.php';

$backupDir = __DIR__ . '/backups';
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}

$timestamp = date('Ymd_His');
$filename  = "backup_{$DB_NAME}_{$timestamp}.sql";
$filepath  = "{$backupDir}/{$filename}";

$mysqldumpPath = '"C:\\wamp64\\bin\\mysql\\mysql8.3.0\\bin\\mysqldump.exe"';

$command = sprintf(
    "%s --host=%s --user=%s --password=%s %s > %s",
    $mysqldumpPath,
    escapeshellarg($DB_HOST),
    escapeshellarg($DB_USER),
    escapeshellarg($DB_PASS),
    escapeshellarg($DB_NAME),
    escapeshellarg($filepath)
);

exec($command . ' 2>&1', $output, $returnVar);

header('Content-Type: application/json');
if ($returnVar === 0 && file_exists($filepath)) {
    echo json_encode([
        'status'  => 'success',
        'message' => 'Sauvegarde réussie',
        'file'    => "backups/{$filename}"  
    ]);
} else {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Échec de la sauvegarde',
        'output'  => $output,
        'return'  => $returnVar
    ]);
}
