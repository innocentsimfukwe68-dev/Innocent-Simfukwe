<?php
/**
 * Database Connection for Cosmetics Shop
 * File: db.php
 * Path: /cosmetics_shop/db.php
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'cosmetics_shop');
define('DB_PORT', '3306');
define('DB_CHARSET', 'utf8mb4');

function getDBConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            // Ensure status column exists in users table for account locking / active status
            try {
                $check = $pdo->query("SHOW COLUMNS FROM `users` LIKE 'Status'");
                if ($check->rowCount() === 0) {
                    $pdo->exec("ALTER TABLE `users` ADD COLUMN `Status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active' AFTER `Role`");
                }
            } catch (Exception $e) {
                // Column might already exist or permission limited
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . $e->getMessage()
            ]);
            exit();
        }
    }
    return $pdo;
}
