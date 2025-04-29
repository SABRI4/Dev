<?php
// backup.php
// Gère : liste des backups, création (backup) et restauration (restore)

// Autorisations CORS pour React
header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Réponse rapide aux requêtes OPTIONS (préflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/connect.php';

// Chemins vers les exécutables sous Wamp
$mysqldump = '"C:\\wamp64\\bin\\mysql\\mysql8.3.0\\bin\\mysqldump.exe"';
$mysql     = '"C:\\wamp64\\bin\\mysql\\mysql8.3.0\\bin\\mysql.exe"';

// Dossier où stocker les sauvegardes
$backupDir = __DIR__ . '/backups';
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}

// Détermine l’action demandée
$action = $_GET['action'] ?? 'backup';

// Réponse toujours en JSON
header('Content-Type: application/json');

try {
    switch ($action) {

        case 'list':
            $files = glob($backupDir . '/*.sql');
            usort($files, function($a, $b) {
                return filemtime($b) - filemtime($a);
            });
            $names = array_map('basename', $files);
        
            echo json_encode([
                'status' => 'success',
                'files'  => $names
            ]);
            exit(); 

            case 'restore':
                $file = $_GET['file'] ?? '';
                $filePath = realpath($backupDir . '/' . basename($file));
            
                if (!$filePath || !file_exists($filePath)) {
                    echo json_encode([
                        'status'  => 'error',
                        'message' => 'Fichier introuvable'
                    ]);
                    exit();  // <-- AJOUTER ÇA !
                }
            
                $cmd = sprintf(
                    'cmd /c "%s --host=%s --user=%s --password=%s %s < %s"',
                    $mysql,
                    escapeshellarg($DB_HOST),
                    escapeshellarg($DB_USER),
                    escapeshellarg($DB_PASS),
                    escapeshellarg($DB_NAME),
                    $filePath
                );
                
            
                exec($cmd . ' 2>&1', $out, $ret);
            
                if ($ret === 0) {
                    echo json_encode([
                        'status'  => 'success',
                        'message' => 'Restauration réussie'
                    ]);
                    exit();  
                } else {
                    echo json_encode([
                        'status'  => 'error',
                        'message' => 'Échec de la restauration',
                        'output'  => $out,
                        'return'  => $ret
                    ]);
                    exit();  
                }
            
        case 'backup':
        default:
            // CRÉER UNE NOUVELLE SAUVEGARDE
            $timestamp = date('Ymd_His');
            $filename  = "backup_{$DB_NAME}_{$timestamp}.sql";
            $filepath  = "$backupDir/$filename";

            $cmd = sprintf(
                '%s --host=%s --user=%s --password=%s %s > %s',
                $mysqldump,
                escapeshellarg($DB_HOST),
                escapeshellarg($DB_USER),
                escapeshellarg($DB_PASS),
                escapeshellarg($DB_NAME),
                escapeshellarg($filepath)
            );

            exec($cmd . ' 2>&1', $out, $ret);

            if ($ret === 0 && file_exists($filepath)) {
                echo json_encode([
                    'status'  => 'success',
                    'message' => 'Sauvegarde réussie',
                    'file'    => "backups/$filename"
                ]);
            } else {
                echo json_encode([
                    'status'  => 'error',
                    'message' => 'Échec de la sauvegarde',
                    'output'  => $out,
                    'return'  => $ret
                ]);
            }
            break;
    }
} catch (Throwable $e) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Erreur serveur : ' . $e->getMessage()
    ]);
}
