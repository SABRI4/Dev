<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3002");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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
                case 'restore-latest':
                    error_log("Début de restauration");
                
                    $files = glob($backupDir . '/*.sql');
                    error_log("Fichiers trouvés : " . print_r($files, true));
                
                    if (!$files || count($files) === 0) {
                        error_log("Aucune sauvegarde trouvée !");
                        echo json_encode([
                            'status'  => 'error',
                            'message' => 'Aucune sauvegarde trouvée'
                        ]);
                        exit();
                    }
                
                    usort($files, function($a, $b) {
                        return filemtime($b) - filemtime($a);
                    });
                
                    $latestFile = $files[0];
                    $filePath = realpath($latestFile);
                    error_log("Fichier à restaurer : $filePath");
                
                    if (!$filePath || !file_exists($filePath)) {
                        error_log("Fichier introuvable !");
                        echo json_encode([
                            'status'  => 'error',
                            'message' => 'Fichier introuvable'
                        ]);
                        exit();
                    }
                
                    $cmd = sprintf(
                        '%s --host=%s --user=%s --password=%s --database=%s --execute="source %s"',
                        $mysql,
                        $DB_HOST,
                        $DB_USER,
                        $DB_PASS,
                        $DB_NAME,
                        str_replace('\\', '/', $filePath)
                    );
                    
                    error_log("Commande exécutée : $cmd");
                
                    exec($cmd . ' 2>&1', $out, $ret);
                
                    error_log("Résultat code : $ret");
                    error_log("Sortie commande : " . print_r($out, true));
                
                    if ($ret === 0) {
                        error_log("Restauration réussie !");
                        echo json_encode([
                            'status'  => 'success',
                            'message' => 'Restauration réussie',
                            'file'    => basename($latestFile)
                        ]);
                        exit();
                    } else {
                        error_log("Échec restauration !");
                        echo json_encode([
                            'status'  => 'error',
                            'message' => 'Échec de la restauration',
                            'output'  => $out,
                            'return'  => $ret
                        ]);
                        exit();
                    }
                
        case 'backup':
        $existingFiles = glob($backupDir . '/*.sql');
        if ($existingFiles && count($existingFiles) > 0) {
            usort($existingFiles, function($a, $b) {
                return filemtime($b) - filemtime($a);
            });
        
            $lastBackup = $existingFiles[0];
            if (file_exists($lastBackup)) {
                unlink($lastBackup); 
                error_log("Ancienne sauvegarde supprimée : $lastBackup");
            }
        }
        default:
            $timestamp = date('Ymd_His');
            $filename  = "backup_{$DB_NAME}_{$timestamp}.sql";
            $filepath  = "$backupDir/$filename";

            $cmd = sprintf(
                '%s --host=%s --user=%s --password=%s %s > %s',
                $mysqldump,
                $DB_HOST,
                $DB_USER,
                $DB_PASS,
                $DB_NAME,
                escapeshellarg($filepath)
            );

            exec($cmd, $out, $ret);

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
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Erreur serveur : ' . $e->getMessage()
    ]);
}
