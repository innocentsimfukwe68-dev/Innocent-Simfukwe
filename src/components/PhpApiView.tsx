import React, { useState } from 'react';
import {
  Code2,
  Download,
  Copy,
  Check,
  Server,
  Play,
  CheckCircle,
  AlertCircle,
  FolderCode,
  FileText,
  ExternalLink,
  Shield,
  Layers,
  Database,
  Archive,
} from 'lucide-react';
import { apiService, DEFAULT_API_URL } from '../services/apiService';

const SQL_SCHEMA_CODE = `-- ==========================================================
-- COSMETICS SHOP POS & MANAGEMENT SYSTEM
-- Database Schema & Initial Data for MySQL / MariaDB (phpMyAdmin)
-- Database Name: cosmetics_shop
-- ==========================================================

CREATE DATABASE IF NOT EXISTS \`cosmetics_shop\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`cosmetics_shop\`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table: users
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`UserID\` INT(11) NOT NULL AUTO_INCREMENT,
  \`FullName\` VARCHAR(150) NOT NULL,
  \`Username\` VARCHAR(80) NOT NULL UNIQUE,
  \`Password\` VARCHAR(255) NOT NULL,
  \`Role\` ENUM('Admin', 'Cashier') NOT NULL DEFAULT 'Cashier',
  \`Status\` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  \`CreatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`UserID\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`users\` (\`UserID\`, \`FullName\`, \`Username\`, \`Password\`, \`Role\`, \`Status\`) VALUES
(1, 'Innocent Simfukwe (Admin)', 'admin', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'Admin', 'Active'),
(2, 'Innocent Cashier', 'innocent', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'Cashier', 'Active'),
(3, 'Grace Mrema (Cashier)', 'grace', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'Cashier', 'Active');

-- 2. Table: categories
DROP TABLE IF EXISTS \`categories\`;
CREATE TABLE \`categories\` (
  \`CategoryID\` INT(11) NOT NULL AUTO_INCREMENT,
  \`CategoryName\` VARCHAR(100) NOT NULL UNIQUE,
  \`Description\` VARCHAR(255) NULL,
  PRIMARY KEY (\`CategoryID\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`categories\` (\`CategoryID\`, \`CategoryName\`, \`Description\`) VALUES
(1, 'Mafuta & Losheni (Lotions & Creams)', 'Body creams, serums, and hydrating lotions'),
(2, 'Lipstick & Gloss', 'Matte, velvet, and shiny lip glosses'),
(3, 'Foundation & Poda (Powders)', 'Facial powders, foundations, and primers'),
(4, 'Perfume & Spray', 'Luxury perfumes, body mists, and deodorants'),
(5, 'Nywele & Wigi (Hair & Wigs)', 'Hair sprays, relaxers, treatments, and wigs'),
(6, 'Macho & Kope (Eyes & Lashes)', 'Mascaras, eyeliners, and false eyelashes'),
(7, 'Nail Polish & Manicure', 'Gel polishes, nail removers, and nail art');

-- 3. Table: brands
DROP TABLE IF EXISTS \`brands\`;
CREATE TABLE \`brands\` (
  \`BrandID\` INT(11) NOT NULL AUTO_INCREMENT,
  \`BrandName\` VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (\`BrandID\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`brands\` (\`BrandID\`, \`BrandName\`) VALUES
(1, 'Nivea'), (2, 'Maybelline New York'), (3, 'Huda Beauty'), (4, 'Fenty Beauty'),
(5, 'L\\'Oreal Paris'), (6, 'MAC Cosmetics'), (7, 'Garnier'), (8, 'Vaseline'),
(9, 'Kylie Cosmetics'), (10, 'Zara Fragrances');

-- 4. Table: locations
DROP TABLE IF EXISTS \`locations\`;
CREATE TABLE \`locations\` (
  \`LocationID\` INT(11) NOT NULL AUTO_INCREMENT,
  \`LocationName\` VARCHAR(120) NOT NULL,
  \`Address\` VARCHAR(200) NULL,
  \`Phone\` VARCHAR(50) NULL,
  PRIMARY KEY (\`LocationID\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`locations\` (\`LocationID\`, \`LocationName\`, \`Address\`, \`Phone\`) VALUES
(1, 'Duka Kuu (Main Branch)', 'Kariakoo Msimbazi, Dar es Salaam', '+255 712 345 678'),
(2, 'Tawi la Posta (City Mall)', 'City Mall, Posta, Dar es Salaam', '+255 754 998 877');

-- 5. Table: products
DROP TABLE IF EXISTS \`products\`;
CREATE TABLE \`products\` (
  \`ProductID\` INT(11) NOT NULL AUTO_INCREMENT,
  \`ProductCode\` VARCHAR(50) NOT NULL UNIQUE,
  \`Barcode\` VARCHAR(80) NULL,
  \`ProductName\` VARCHAR(200) NOT NULL,
  \`CategoryID\` INT(11) NULL,
  \`BrandID\` INT(11) NULL,
  \`LocationID\` INT(11) NULL DEFAULT 1,
  \`SupplierID\` INT(11) NULL,
  \`BuyingPrice\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`SellingPrice\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`Quantity\` INT(11) NOT NULL DEFAULT 0,
  \`AlertQuantity\` INT(11) NOT NULL DEFAULT 5,
  \`Unit\` VARCHAR(30) NOT NULL DEFAULT 'Pcs',
  \`Description\` TEXT NULL,
  \`IsActive\` TINYINT(1) NOT NULL DEFAULT 1,
  \`CreatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`ProductID\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`products\` (\`ProductID\`, \`ProductCode\`, \`Barcode\`, \`ProductName\`, \`CategoryID\`, \`BrandID\`, \`LocationID\`, \`BuyingPrice\`, \`SellingPrice\`, \`Quantity\`, \`AlertQuantity\`, \`Unit\`) VALUES
(1, 'COS-001', '6901234567891', 'Nivea Body Lotion Cocoa Butter 400ml', 1, 1, 1, 14000.00, 18000.00, 35, 5, 'Chupa'),
(2, 'COS-002', '6901234567892', 'Maybelline Fit Me Matte Foundation #330', 3, 2, 1, 22000.00, 32000.00, 18, 4, 'Pcs'),
(3, 'COS-003', '6901234567893', 'Huda Beauty Liquid Matte Lipstick (Red)', 2, 3, 1, 15000.00, 25000.00, 42, 8, 'Pcs'),
(4, 'COS-004', '6901234567894', 'Fenty Beauty Gloss Bomb Universal', 2, 4, 1, 35000.00, 50000.00, 12, 3, 'Pcs'),
(5, 'COS-005', '6901234567895', 'Garnier Micellar Cleansing Water 400ml', 1, 7, 1, 16000.00, 24000.00, 20, 5, 'Chupa'),
(6, 'COS-006', '6901234567896', 'Zara Red Vanilla Perfume EDP 100ml', 4, 10, 1, 45000.00, 65000.00, 14, 3, 'Chupa'),
(7, 'COS-007', '6901234567897', 'Vaseline Intensive Care Aloe Soothe 400ml', 1, 8, 1, 11000.00, 15000.00, 28, 6, 'Chupa'),
(8, 'COS-008', '6901234567898', 'MAC Studio Fix Powder Plus Foundation', 3, 6, 1, 38000.00, 55000.00, 9, 3, 'Pcs'),
(9, 'COS-009', '6901234567899', 'Maybelline Lash Sensational Sky High Mascara', 6, 2, 1, 18000.00, 28000.00, 24, 5, 'Pcs'),
(10, 'COS-010', '6901234567810', 'L\\'Oreal Paris Elvive Hair Serum 100ml', 5, 5, 1, 20000.00, 29000.00, 16, 4, 'Chupa');

-- 6. Table: sales & saledetails
DROP TABLE IF EXISTS \`saledetails\`;
DROP TABLE IF EXISTS \`sales\`;
CREATE TABLE \`sales\` (
  \`SaleID\` INT(11) NOT NULL AUTO_INCREMENT,
  \`InvoiceNumber\` VARCHAR(60) NOT NULL UNIQUE,
  \`UserID\` INT(11) NOT NULL,
  \`CustomerID\` INT(11) NULL DEFAULT 1,
  \`LocationID\` INT(11) NOT NULL DEFAULT 1,
  \`SaleDate\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`TotalAmount\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`PaymentMethod\` ENUM('Cash', 'M-Pesa', 'Tigo Pesa', 'Airtel Money', 'Card', 'Credit') NOT NULL DEFAULT 'Cash',
  \`CashReceived\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`ChangeGiven\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`Status\` ENUM('Completed', 'Refunded', 'Cancelled') NOT NULL DEFAULT 'Completed',
  PRIMARY KEY (\`SaleID\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`saledetails\` (
  \`DetailID\` INT(11) NOT NULL AUTO_INCREMENT,
  \`SaleID\` INT(11) NOT NULL,
  \`ProductID\` INT(11) NOT NULL,
  \`Quantity\` INT(11) NOT NULL DEFAULT 1,
  \`UnitPrice\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`SubTotal\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (\`DetailID\`),
  KEY \`fk_sd_sale\` (\`SaleID\`),
  CONSTRAINT \`fk_sd_sale\` FOREIGN KEY (\`SaleID\`) REFERENCES \`sales\` (\`SaleID\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Table: expenses
DROP TABLE IF EXISTS \`expenses\`;
CREATE TABLE \`expenses\` (
  \`ExpenseID\` INT(11) NOT NULL AUTO_INCREMENT,
  \`ExpenseDate\` DATE NOT NULL,
  \`Category\` VARCHAR(100) NOT NULL,
  \`Amount\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`Description\` VARCHAR(255) NULL,
  \`RecordedBy\` VARCHAR(100) NOT NULL DEFAULT 'Admin',
  \`LocationID\` INT(11) NOT NULL DEFAULT 1,
  \`CreatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`ExpenseID\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`expenses\` (\`ExpenseID\`, \`ExpenseDate\`, \`Category\`, \`Amount\`, \`Description\`, \`RecordedBy\`, \`LocationID\`) VALUES
(1, CURDATE(), 'Umeme (LUKU)', 15000.00, 'Malipo ya Umeme wa Duka LUKU', 'admin', 1),
(2, CURDATE(), 'Mifuko ya Kufungia Bidhaa', 8000.00, 'Mifuko ya nailoni na karatasi', 'innocent', 1),
(3, CURDATE(), 'Usafi na Maji', 5000.00, 'Dawa ya usafi na maji ya kunywa', 'innocent', 1);

-- 8. Table: sales_alert_config
DROP TABLE IF EXISTS \`sales_alert_config\`;
CREATE TABLE \`sales_alert_config\` (
  \`ConfigID\` INT(11) NOT NULL AUTO_INCREMENT,
  \`Enabled\` TINYINT(1) NOT NULL DEFAULT 1,
  \`TargetAmount\` DECIMAL(12,2) NOT NULL DEFAULT 200000.00,
  \`TimeWindowHours\` INT(11) NOT NULL DEFAULT 24,
  \`CheckIntervalMinutes\` INT(11) NOT NULL DEFAULT 60,
  \`LastTriggered\` DATETIME NULL,
  \`NotificationMessage\` VARCHAR(255) DEFAULT 'Tahadhari: Mauzo hayajafikia lengo la saa 24 zilizopita.',
  PRIMARY KEY (\`ConfigID\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`sales_alert_config\` (\`ConfigID\`, \`Enabled\`, \`TargetAmount\`, \`TimeWindowHours\`, \`CheckIntervalMinutes\`, \`NotificationMessage\`) VALUES
(1, 1, 200000.00, 24, 60, 'Tahadhari: Mauzo hayajafikia lengo la TZS 200,000 ndani ya saa 24 zilizopita.');

SET FOREIGN_KEY_CHECKS = 1;
`;

const PHP_DB_CODE = `<?php
/**
 * Database Connection for Cosmetics Shop
 * File: db.php
 * Path: /cosmetics_shop/db.php
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if (\$_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
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
    static \$pdo = null;
    if (\$pdo === null) {
        \$dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        \$options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            \$pdo = new PDO(\$dsn, DB_USER, DB_PASS, \$options);
            // Ensure status column exists in users table for account locking
            try {
                \$check = \$pdo->query("SHOW COLUMNS FROM \`users\` LIKE 'Status'");
                if (\$check->rowCount() === 0) {
                    \$pdo->exec("ALTER TABLE \`users\` ADD COLUMN \`Status\` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active' AFTER \`Role\`");
                }
            } catch (Exception \$e) {}
        } catch (PDOException \$e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . \$e->getMessage()
            ]);
            exit();
        }
    }
    return \$pdo;
}
`;

const PHP_API_CODE = `<?php
/**
 * REST API for Cosmetics Shop POS & Business Management
 * File: api.php
 * Path: http://localhost/cosmetics_shop/api.php
 */

require_once __DIR__ . '/db.php';

header("Content-Type: application/json; charset=UTF-8");

\$pdo = getDBConnection();
\$method = \$_SERVER['REQUEST_METHOD'];
\$action = isset(\$_GET['action']) ? trim(\$_GET['action']) : '';

function getJsonInput() {
    \$raw = file_get_contents('php://input');
    return json_decode(\$raw, true) ?: [];
}

try {
    switch (\$action) {
        case 'ping':
        case '':
            echo json_encode([
                'success' => true,
                'message' => 'Cosmetics Shop API is running',
                'database' => DB_NAME,
                'version' => '1.0.0',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            break;

        // 1. Authentication
        case 'login':
            \$data = getJsonInput();
            \$username = trim(\$data['username'] ?? '');
            \$password = trim(\$data['password'] ?? '');

            \$stmt = \$pdo->prepare("SELECT * FROM users WHERE Username = ? LIMIT 1");
            \$stmt->execute([\$username]);
            \$user = \$stmt->fetch();

            if (!\$user || (\$user['Password'] !== \$password && !password_verify(\$password, \$user['Password']))) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
                exit();
            }

            if ((\$user['Status'] ?? 'Active') === 'Inactive') {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Account is deactivated']);
                exit();
            }

            \$token = base64_encode(\$user['UserID'] . ':' . time());
            echo json_encode([
                'success' => true,
                'token' => \$token,
                'user' => [
                    'UserID' => (int)\$user['UserID'],
                    'FullName' => \$user['FullName'],
                    'Username' => \$user['Username'],
                    'Role' => \$user['Role'],
                    'Status' => \$user['Status'] ?? 'Active'
                ]
            ]);
            break;

        // 2. Fetch Products with Shelf Locations & Details
        case 'products':
            \$sql = "SELECT p.*, c.CategoryName, b.BrandName, l.LocationName, 
                           (p.SellingPrice - p.BuyingPrice) AS UnitProfit
                    FROM products p
                    LEFT JOIN categories c ON p.CategoryID = c.CategoryID
                    LEFT JOIN brands b ON p.BrandID = b.BrandID
                    LEFT JOIN locations l ON p.LocationID = l.LocationID
                    WHERE LOWER(p.ProductName) != 'total'
                    ORDER BY p.ProductID ASC";
            \$stmt = \$pdo->query(\$sql);
            echo json_encode(['success' => true, 'data' => \$stmt->fetchAll()]);
            break;

        // 3. Cashier Sale Checkout & Stock Deduction (Transaction Safe)
        case 'sale_create':
            \$data = getJsonInput();
            \$customerId = !empty(\$data['CustomerID']) ? (int)\$data['CustomerID'] : null;
            \$items = \$data['items'] ?? [];

            if (empty(\$items)) throw new Exception('Cart is empty');

            \$pdo->beginTransaction();
            \$totalAmount = 0;
            
            // Insert Sale Master
            \$stmt = \$pdo->prepare("INSERT INTO sales (SaleDate, CustomerID, UserID, TotalAmount) VALUES (NOW(), ?, ?, ?)");
            \$stmt->execute([\$customerId, 1, 0]);
            \$saleId = (int)\$pdo->lastInsertId();

            \$itemStmt = \$pdo->prepare("INSERT INTO saledetails (SaleID, ProductID, Quantity, UnitPrice) VALUES (?, ?, ?, ?)");
            \$stockStmt = \$pdo->prepare("UPDATE products SET Quantity = Quantity - ? WHERE ProductID = ?");

            foreach (\$items as \$item) {
                \$pid = (int)\$item['ProductID'];
                \$qty = (int)\$item['Quantity'];
                \$price = (float)\$item['UnitPrice'];

                \$totalAmount += (\$price * \$qty);
                \$itemStmt->execute([\$saleId, \$pid, \$qty, \$price]);
                \$stockStmt->execute([\$qty, \$pid]);
            }

            \$updateSale = \$pdo->prepare("UPDATE sales SET TotalAmount = ? WHERE SaleID = ?");
            \$updateSale->execute([\$totalAmount, \$saleId]);

            \$pdo->commit();
            echo json_encode(['success' => true, 'SaleID' => \$saleId, 'TotalAmount' => \$totalAmount]);
            break;

        // 4. Profit & Inventory Analytics
        case 'analytics':
            \$prodStat = \$pdo->query("SELECT COUNT(*) AS TotalSKUs, SUM(Quantity) AS TotalUnits,
                                      SUM(BuyingPrice * Quantity) AS WholesaleVal,
                                      SUM(SellingPrice * Quantity) AS RetailVal FROM products")->fetch();
            \$salesStat = \$pdo->query("SELECT COUNT(*) AS TotalSales, SUM(TotalAmount) AS Revenue FROM sales")->fetch();
            \$profitStat = \$pdo->query("SELECT SUM((sd.UnitPrice - p.BuyingPrice) * sd.Quantity) AS RealizedProfit 
                                       FROM saledetails sd JOIN products p ON sd.ProductID = p.ProductID")->fetch();

            echo json_encode([
                'success' => true,
                'summary' => [
                    'totalRevenue' => (float)\$salesStat['Revenue'],
                    'totalProfit' => (float)\$profitStat['RealizedProfit'],
                    'totalProductsCount' => (int)\$prodStat['TotalSKUs'],
                    'totalStockUnits' => (int)\$prodStat['TotalUnits'],
                    'inventoryRetailValue' => (float)\$prodStat['RetailVal']
                ]
            ]);
            break;

        // 5. Users Management
        case 'users':
            \$stmt = \$pdo->query("SELECT UserID, FullName, Username, Role, Status FROM users");
            echo json_encode(['success' => true, 'data' => \$stmt->fetchAll()]);
            break;

        case 'user_add':
            \$data = getJsonInput();
            \$stmt = \$pdo->prepare("INSERT INTO users (FullName, Username, Password, Role, Status) VALUES (?, ?, ?, ?, ?)");
            \$stmt->execute([\$data['FullName'], \$data['Username'], \$data['Password'], \$data['Role'], \$data['Status'] ?? 'Active']);
            echo json_encode(['success' => true, 'UserID' => (int)\$pdo->lastInsertId()]);
            break;
    }
} catch (Exception \$e) {
    if (\$pdo->inTransaction()) \$pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => \$e->getMessage()]);
}
`;

export const PhpApiView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'api' | 'db' | 'sql' | 'guide'>('sql');
  const [apiUrlInput, setApiUrlInput] = useState(apiService.getApiUrl());
  const [sqlContent, setSqlContent] = useState<string>('-- Inapakia cosmetics_shop.sql...');
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success?: boolean;
    message?: string;
    data?: unknown;
  }>({ tested: false });
  const [isTesting, setIsTesting] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    fetch('/cosmetics_shop.sql')
      .then((res) => res.text())
      .then((text) => {
        if (text && text.includes('cosmetics_shop')) {
          setSqlContent(text);
        } else {
          setSqlContent(SQL_SCHEMA_CODE);
        }
      })
      .catch(() => setSqlContent(SQL_SCHEMA_CODE));
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult({ tested: false });
    apiService.setApiUrl(apiUrlInput);
    const res = await apiService.testConnection(apiUrlInput);
    setTestResult({
      tested: true,
      success: res.success,
      message: res.message,
      data: res.data,
    });
    setIsTesting(false);
  };

  const getCurrentCode = () => {
    if (activeCodeTab === 'api') return PHP_API_CODE;
    if (activeCodeTab === 'db') return PHP_DB_CODE;
    if (activeCodeTab === 'sql') return sqlContent;
    return '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">PHP Backend & Database Center</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 text-xs font-bold border border-pink-200">
              Database: cosmetics_shop
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Imewekwa mahususi kwa database ya <strong className="text-slate-900 font-mono">cosmetics_shop</strong> na endpoint ya <code className="text-rose-600 font-mono">http://localhost/cosmetics_shop/api.php</code>
          </p>
        </div>

        {/* Download Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/cosmetics_shop_php_system.zip"
            download="cosmetics_shop_php_system.zip"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Archive className="w-4 h-4 text-emerald-200" />
            <span>Pakua ZIP Yote (XAMPP)</span>
          </a>
          <a
            href="/cosmetics_shop.sql"
            download="cosmetics_shop.sql"
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 shadow-2xs bg-white"
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>cosmetics_shop.sql</span>
          </a>
          <button
            onClick={() => handleDownload('api.php', PHP_API_CODE)}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 shadow-2xs bg-white"
          >
            <Download className="w-3.5 h-3.5" />
            <span>api.php</span>
          </button>
          <button
            onClick={() => handleDownload('db.php', PHP_DB_CODE)}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 shadow-2xs bg-white"
          >
            <Download className="w-3.5 h-3.5" />
            <span>db.php</span>
          </button>
        </div>
      </div>

      {/* Database Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-xl">
          <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wider block">Jina la Database (MySQL)</span>
          <span className="text-base font-black text-slate-900 font-mono">cosmetics_shop</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Imeunganishwa kwenye db.php</p>
        </div>
        <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Host & Mtumiaji (XAMPP)</span>
          <span className="text-base font-black text-slate-900 font-mono">localhost (root)</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Password: blank (wazi)</p>
        </div>
        <div className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Folder la XAMPP htdocs</span>
          <span className="text-sm font-bold text-slate-900 font-mono">C:/xampp/htdocs/cosmetics_shop/</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Au digitalshop</p>
        </div>
      </div>

      {/* Live Connection Tester Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-rose-600" />
            <h2 className="font-bold text-sm text-slate-900">Jaribu Mawasiliano ya PHP Backend (Live Test)</h2>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500">Chagua Anwani ya Haraka:</span>
            <button
              onClick={() => {
                setApiUrlInput('http://localhost/digitalshop/api.php');
                apiService.setApiUrl('http://localhost/digitalshop/api.php');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border transition-colors ${
                apiUrlInput === 'http://localhost/digitalshop/api.php'
                  ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              /digitalshop/api.php
            </button>
            <button
              onClick={() => {
                setApiUrlInput('http://localhost/cosmetics_shop/api.php');
                apiService.setApiUrl('http://localhost/cosmetics_shop/api.php');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border transition-colors ${
                apiUrlInput === 'http://localhost/cosmetics_shop/api.php'
                  ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              /cosmetics_shop/api.php
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={apiUrlInput}
              onChange={(e) => setApiUrlInput(e.target.value)}
              placeholder="http://localhost/cosmetics_shop/api.php"
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <button
            id="test-connection-btn"
            disabled={isTesting}
            onClick={handleTestConnection}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isTesting ? 'Inajaribu Server...' : 'Jaribu Kupiga Ping (?action=ping)'}</span>
          </button>
        </div>

        {testResult.tested && (
          <div
            className={`p-4 rounded-xl text-xs border ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-start space-x-2">
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-2 flex-1">
                <p className="font-bold text-sm">{testResult.message}</p>

                {!testResult.success && (
                  <div className="mt-2 p-3 bg-white/80 rounded-lg border border-amber-200 text-slate-800 space-y-2 text-[11px] leading-relaxed">
                    <p className="font-bold text-amber-900 flex items-center space-x-1">
                      <span>💡 Jinsi ya Kutatua &quot;Page Not Found&quot; (404 Error):</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-700">
                      <li>
                        <strong>Kama folda yako kwenye kompyuta inaitwa &quot;digitalshop&quot;:</strong> Bofya kitufe cha juu cha <code>/digitalshop/api.php</code> kisha bofya <em>Jaribu Kupiga Ping</em>.
                      </li>
                      <li>
                        <strong>Kama unataka itumie &quot;cosmetics_shop&quot;:</strong> Fungua <code>C:\xampp\htdocs\</code>, tengeneza folda inayoitwa <code>cosmetics_shop</code> na uweke <code>api.php</code> na <code>db.php</code> ndani yake.
                      </li>
                      <li>
                        <strong>Hakikisha Apache imewashwa:</strong> Kwenye XAMPP Control Panel, bonyeza kitufe cha <strong>Start</strong> pembeni ya Apache na MySQL.
                      </li>
                    </ol>
                  </div>
                )}

                {testResult.data && (
                  <pre className="mt-2 p-2 rounded bg-black/5 font-mono text-[10px] overflow-x-auto">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Viewer Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 flex items-center justify-between overflow-x-auto">
          <div className="flex space-x-2 py-2">
            <button
              onClick={() => setActiveCodeTab('sql')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
                activeCodeTab === 'sql'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>cosmetics_shop.sql (Database Dump)</span>
            </button>
            <button
              onClick={() => setActiveCodeTab('api')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
                activeCodeTab === 'api'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>api.php (Main REST API)</span>
            </button>
            <button
              onClick={() => setActiveCodeTab('db')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
                activeCodeTab === 'db'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderCode className="w-3.5 h-3.5" />
              <span>db.php (PDO Connection)</span>
            </button>
            <button
              onClick={() => setActiveCodeTab('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
                activeCodeTab === 'guide'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mwongozo wa XAMPP</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {activeCodeTab !== 'guide' && (
              <button
                onClick={() => handleCopy(getCurrentCode())}
                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 flex items-center space-x-1 rounded hover:bg-slate-200 transition-colors flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-[500px]">
          {activeCodeTab === 'sql' && <pre>{sqlContent}</pre>}
          {activeCodeTab === 'api' && <pre>{PHP_API_CODE}</pre>}
          {activeCodeTab === 'db' && <pre>{PHP_DB_CODE}</pre>}
          {activeCodeTab === 'guide' && (
            <div className="text-slate-300 font-sans space-y-4 py-2">
              <h3 className="text-sm font-bold text-white">Hatua za kuweka database ya cosmetics_shop kwenye Localhost (XAMPP):</h3>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-300 leading-relaxed">
                <li>
                  Fungua <strong>XAMPP Control Panel</strong> kisha ubonyeze <strong className="text-emerald-400">Start</strong> kwenye <strong>Apache</strong> na <strong>MySQL</strong>.
                </li>
                <li>
                  Fungua browser yako (Chrome au Edge) na uandike: <code className="text-rose-400">http://localhost/phpmyadmin/</code>
                </li>
                <li>
                  Bofya <strong>&quot;New&quot;</strong> upande wa kushoto, kisha andika jina la database kuwa: <strong className="text-white bg-pink-900/60 px-1.5 py-0.5 rounded font-mono">cosmetics_shop</strong> na bonyeza <strong>Create</strong>.
                </li>
                <li>
                  Ukiwa ndani ya database hiyo ya <strong className="text-white font-mono">cosmetics_shop</strong>, bofya kichupo cha <strong>&quot;Import&quot;</strong> juu.
                </li>
                <li>
                  Bofya <strong>&quot;Choose File&quot;</strong>, chagua faili la <strong className="text-emerald-400 font-mono">cosmetics_shop.sql</strong> (ambalo unaweza kulidownload hapo juu), kisha shuka chini na ubonyeze <strong>Import / Go</strong>.
                </li>
                <li>
                  Tengeneza folda iitwayo <strong className="text-white font-mono">cosmetics_shop</strong> ndani ya <code className="text-rose-400 font-mono">C:\xampp\htdocs\</code>.
                </li>
                <li>
                  Weka faili za <code className="text-rose-400">api.php</code> na <code className="text-rose-400">db.php</code> ndani ya <code className="text-white font-mono">C:\xampp\htdocs\cosmetics_shop\</code>.
                </li>
                <li>
                  Jaribu kufungua: <code className="text-emerald-400 font-bold">http://localhost/cosmetics_shop/api.php?action=ping</code> itakupa jibu la JSON lenye <code>&quot;database&quot;: &quot;cosmetics_shop&quot;</code>!
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
