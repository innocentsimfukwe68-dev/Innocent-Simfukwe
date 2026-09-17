<?php
/**
 * REST API for Cosmetics Shop POS & Business Management
 * File: api.php
 * Path: http://localhost/cosmetics_shop/api.php
 */

require_once __DIR__ . '/db.php';

header("Content-Type: application/json; charset=UTF-8");

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? trim($_GET['action']) : '';

// Helper to get raw JSON payload
function getJsonInput() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}

// Token helper for simple secure bearer token simulation
function getCurrentUser($pdo) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        $parts = explode(':', base64_decode($token));
        if (count($parts) === 2) {
            $userId = (int)$parts[0];
            $stmt = $pdo->prepare("SELECT UserID, FullName, Username, Role, Status FROM users WHERE UserID = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();
            if ($user && ($user['Status'] ?? 'Active') === 'Active') {
                return $user;
            }
        }
    }
    return null;
}

function requireAuth($pdo) {
    $user = getCurrentUser($pdo);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized: Invalid token or account is inactive']);
        exit();
    }
    return $user;
}

function requireAdmin($pdo) {
    $user = requireAuth($pdo);
    if ($user['Role'] !== 'Admin') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Forbidden: Admin access required']);
        exit();
    }
    return $user;
}

try {
    switch ($action) {
        // Ping / Health Check
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

        // 1. User Authentication (Login)
        case 'login':
            if ($method !== 'POST') {
                throw new Exception('POST method required');
            }
            $data = getJsonInput();
            $username = trim($data['username'] ?? '');
            $password = trim($data['password'] ?? '');

            if (empty($username) || empty($password)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Username and password are required']);
                exit();
            }

            $stmt = $pdo->prepare("SELECT * FROM users WHERE Username = ? LIMIT 1");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if (!$user) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
                exit();
            }

            // Verify password (supports plain-text legacy import and password_hash)
            $passwordValid = false;
            if (password_verify($password, $user['Password'])) {
                $passwordValid = true;
            } else if ($user['Password'] === $password) {
                $passwordValid = true;
            }

            if (!$passwordValid) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
                exit();
            }

            $userStatus = $user['Status'] ?? 'Active';
            if ($userStatus === 'Inactive') {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'This account has been deactivated. Please contact an Administrator.']);
                exit();
            }

            // Create simple secure token
            $token = base64_encode($user['UserID'] . ':' . time());

            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'UserID' => (int)$user['UserID'],
                    'FullName' => $user['FullName'],
                    'Username' => $user['Username'],
                    'Role' => $user['Role'],
                    'Status' => $userStatus
                ]
            ]);
            break;

        // 2. Fetch All Products with Details
        case 'products':
            $sql = "SELECT 
                        p.ProductID,
                        p.ProductName,
                        p.Barcode,
                        p.CategoryID,
                        c.CategoryName,
                        p.BrandID,
                        b.BrandName,
                        p.LocationID,
                        l.LocationName,
                        l.Description AS LocationDescription,
                        p.SupplierID,
                        s.SupplierName,
                        p.BuyingPrice,
                        p.SellingPrice,
                        p.CostPrice,
                        p.Quantity,
                        p.ReorderLevel,
                        p.ExpiryDate,
                        (p.SellingPrice - p.BuyingPrice) AS UnitProfit
                    FROM products p
                    LEFT JOIN categories c ON p.CategoryID = c.CategoryID
                    LEFT JOIN brands b ON p.BrandID = b.BrandID
                    LEFT JOIN locations l ON p.LocationID = l.LocationID
                    LEFT JOIN suppliers s ON p.SupplierID = s.SupplierID
                    WHERE LOWER(p.ProductName) != 'total'
                    ORDER BY p.ProductID ASC";
            $stmt = $pdo->query($sql);
            $products = $stmt->fetchAll();

            // Format numbers
            foreach ($products as &$p) {
                $p['ProductID'] = (int)$p['ProductID'];
                $p['CategoryID'] = (int)$p['CategoryID'];
                $p['BrandID'] = $p['BrandID'] !== null ? (int)$p['BrandID'] : null;
                $p['LocationID'] = $p['LocationID'] !== null ? (int)$p['LocationID'] : null;
                $p['SupplierID'] = (int)$p['SupplierID'];
                $p['BuyingPrice'] = (float)$p['BuyingPrice'];
                $p['SellingPrice'] = (float)$p['SellingPrice'];
                $p['CostPrice'] = (float)$p['CostPrice'];
                $p['Quantity'] = (int)$p['Quantity'];
                $p['ReorderLevel'] = (int)$p['ReorderLevel'];
                $p['UnitProfit'] = (float)$p['UnitProfit'];
            }

            echo json_encode(['success' => true, 'count' => count($products), 'data' => $products]);
            break;

        // 3. Add Product (Admin Only)
        case 'product_add':
            $user = requireAdmin($pdo);
            $data = getJsonInput();
            
            $productName = trim($data['ProductName'] ?? '');
            if (empty($productName)) {
                throw new Exception('Product name is required');
            }

            $stmt = $pdo->prepare("
                INSERT INTO products (
                    ProductName, Barcode, CategoryID, BrandID, LocationID, 
                    SupplierID, BuyingPrice, SellingPrice, CostPrice, Quantity, 
                    ReorderLevel, ExpiryDate
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $productName,
                !empty($data['Barcode']) ? trim($data['Barcode']) : null,
                (int)($data['CategoryID'] ?? 1),
                !empty($data['BrandID']) ? (int)$data['BrandID'] : null,
                isset($data['LocationID']) ? (int)$data['LocationID'] : null,
                (int)($data['SupplierID'] ?? 1),
                (float)($data['BuyingPrice'] ?? 0),
                (float)($data['SellingPrice'] ?? 0),
                (float)($data['CostPrice'] ?? 0),
                (int)($data['Quantity'] ?? 0),
                (int)($data['ReorderLevel'] ?? 3),
                !empty($data['ExpiryDate']) ? $data['ExpiryDate'] : null
            ]);

            $newId = (int)$pdo->lastInsertId();
            echo json_encode(['success' => true, 'message' => 'Product added successfully', 'ProductID' => $newId]);
            break;

        // 4. Update Product
        case 'product_update':
            $user = requireAdmin($pdo);
            $data = getJsonInput();
            $productId = (int)($data['ProductID'] ?? 0);
            if ($productId <= 0) {
                throw new Exception('Valid ProductID is required');
            }

            $stmt = $pdo->prepare("
                UPDATE products SET
                    ProductName = ?,
                    Barcode = ?,
                    CategoryID = ?,
                    BrandID = ?,
                    LocationID = ?,
                    SupplierID = ?,
                    BuyingPrice = ?,
                    SellingPrice = ?,
                    Quantity = ?,
                    ReorderLevel = ?,
                    ExpiryDate = ?
                WHERE ProductID = ?
            ");
            $stmt->execute([
                trim($data['ProductName']),
                !empty($data['Barcode']) ? trim($data['Barcode']) : null,
                (int)($data['CategoryID']),
                !empty($data['BrandID']) ? (int)$data['BrandID'] : null,
                isset($data['LocationID']) ? (int)$data['LocationID'] : null,
                (int)($data['SupplierID'] ?? 1),
                (float)($data['BuyingPrice'] ?? 0),
                (float)($data['SellingPrice'] ?? 0),
                (int)($data['Quantity'] ?? 0),
                (int)($data['ReorderLevel'] ?? 3),
                !empty($data['ExpiryDate']) ? $data['ExpiryDate'] : null,
                $productId
            ]);

            echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
            break;

        // 5. Cashier Checkout / Create Sale (Crucial feature)
        case 'sale_create':
            $user = requireAuth($pdo);
            $data = getJsonInput();

            $customerId = !empty($data['CustomerID']) ? (int)$data['CustomerID'] : null;
            $items = $data['items'] ?? [];
            $paymentMethod = $data['PaymentMethod'] ?? 'Cash';

            if (empty($items) || !is_array($items)) {
                throw new Exception('Cart is empty. Please select products to sell.');
            }

            $pdo->beginTransaction();

            $totalAmount = 0.0;
            $preparedItems = [];

            // Check stock and compute total
            foreach ($items as $item) {
                $pid = (int)($item['ProductID'] ?? 0);
                $qty = (int)($item['Quantity'] ?? 1);
                $customPrice = isset($item['UnitPrice']) ? (float)$item['UnitPrice'] : null;

                if ($qty <= 0) continue;

                $stmt = $pdo->prepare("SELECT ProductID, ProductName, SellingPrice, BuyingPrice, Quantity FROM products WHERE ProductID = ? FOR UPDATE");
                $stmt->execute([$pid]);
                $prod = $stmt->fetch();

                if (!$prod) {
                    throw new Exception("Product ID {$pid} not found");
                }

                if ($prod['Quantity'] < $qty) {
                    throw new Exception("Insufficient stock for {$prod['ProductName']}. Available: {$prod['Quantity']}, Requested: {$qty}");
                }

                $price = $customPrice !== null ? $customPrice : (float)$prod['SellingPrice'];
                $lineTotal = $price * $qty;
                $totalAmount += $lineTotal;

                $preparedItems[] = [
                    'ProductID' => $pid,
                    'ProductName' => $prod['ProductName'],
                    'Quantity' => $qty,
                    'UnitPrice' => $price,
                    'BuyingPrice' => (float)$prod['BuyingPrice'],
                    'LineTotal' => $lineTotal
                ];
            }

            if (empty($preparedItems)) {
                throw new Exception('No valid items found to checkout.');
            }

            // Insert into sales table
            $stmt = $pdo->prepare("INSERT INTO sales (SaleDate, CustomerID, UserID, TotalAmount) VALUES (NOW(), ?, ?, ?)");
            $stmt->execute([$customerId, $user['UserID'], $totalAmount]);
            $saleId = (int)$pdo->lastInsertId();

            // Insert into saledetails / sale_items and update stock
            $itemStmt = $pdo->prepare("INSERT INTO saledetails (SaleID, ProductID, Quantity, UnitPrice) VALUES (?, ?, ?, ?)");
            $stockStmt = $pdo->prepare("UPDATE products SET Quantity = Quantity - ? WHERE ProductID = ?");

            foreach ($preparedItems as $pItem) {
                $itemStmt->execute([$saleId, $pItem['ProductID'], $pItem['Quantity'], $pItem['UnitPrice']]);
                $stockStmt->execute([$pItem['Quantity'], $pItem['ProductID']]);
            }

            $pdo->commit();

            echo json_encode([
                'success' => true,
                'message' => 'Sale completed successfully',
                'SaleID' => $saleId,
                'TotalAmount' => $totalAmount,
                'ItemsCount' => count($preparedItems),
                'Cashier' => $user['FullName'],
                'SaleDate' => date('Y-m-d H:i:s')
            ]);
            break;

        // 6. Sales History & Invoices
        case 'sales':
            $stmt = $pdo->query("
                SELECT 
                    s.SaleID,
                    s.SaleDate,
                    s.CustomerID,
                    c.CustomerName,
                    s.UserID,
                    u.FullName AS CashierName,
                    s.TotalAmount
                FROM sales s
                LEFT JOIN customers c ON s.CustomerID = c.CustomerID
                LEFT JOIN users u ON s.UserID = u.UserID
                ORDER BY s.SaleID DESC
                LIMIT 100
            ");
            $sales = $stmt->fetchAll();

            // Fetch details for recent sales
            foreach ($sales as &$s) {
                $s['SaleID'] = (int)$s['SaleID'];
                $s['TotalAmount'] = (float)$s['TotalAmount'];
                $s['CustomerID'] = $s['CustomerID'] ? (int)$s['CustomerID'] : null;
                $s['UserID'] = (int)$s['UserID'];

                // Get items
                $detailStmt = $pdo->prepare("
                    SELECT 
                        sd.ProductID,
                        p.ProductName,
                        sd.Quantity,
                        sd.UnitPrice,
                        p.BuyingPrice,
                        ((sd.UnitPrice - p.BuyingPrice) * sd.Quantity) AS ItemProfit
                    FROM saledetails sd
                    LEFT JOIN products p ON sd.ProductID = p.ProductID
                    WHERE sd.SaleID = ?
                ");
                $detailStmt->execute([$s['SaleID']]);
                $s['Items'] = $detailStmt->fetchAll();

                $saleProfit = 0;
                foreach ($s['Items'] as $item) {
                    $saleProfit += (float)($item['ItemProfit'] ?? 0);
                }
                $s['TotalProfit'] = $saleProfit;
            }

            echo json_encode(['success' => true, 'data' => $sales]);
            break;

        // 7. Business Data Analysis & Metrics
        case 'analytics':
            // 7.1 Products counts & inventory valuation
            $prodStat = $pdo->query("
                SELECT 
                    COUNT(ProductID) AS TotalSKUs,
                    SUM(Quantity) AS TotalStockUnits,
                    SUM(BuyingPrice * Quantity) AS TotalCostValue,
                    SUM(SellingPrice * Quantity) AS TotalRetailValue,
                    SUM(CASE WHEN Quantity <= ReorderLevel AND Quantity > 0 THEN 1 ELSE 0 END) AS LowStockCount,
                    SUM(CASE WHEN Quantity = 0 THEN 1 ELSE 0 END) AS OutOfStockCount
                FROM products
                WHERE LOWER(ProductName) != 'total'
            ")->fetch();

            // 7.2 Sales & Realized Profit
            $salesStat = $pdo->query("
                SELECT 
                    COUNT(SaleID) AS TotalSalesCount,
                    COALESCE(SUM(TotalAmount), 0) AS TotalRevenue
                FROM sales
            ")->fetch();

            // Realized profit calculation based on saledetails vs buying price
            $profitStat = $pdo->query("
                SELECT 
                    COALESCE(SUM((sd.UnitPrice - p.BuyingPrice) * sd.Quantity), 0) AS RealizedProfit
                FROM saledetails sd
                JOIN products p ON sd.ProductID = p.ProductID
            ")->fetch();

            // Category breakdown
            $catStat = $pdo->query("
                SELECT 
                    c.CategoryName,
                    COUNT(p.ProductID) AS ProductCount,
                    SUM(p.Quantity) AS TotalUnits,
                    SUM(p.SellingPrice * p.Quantity) AS StockValue
                FROM categories c
                LEFT JOIN products p ON c.CategoryID = p.CategoryID AND LOWER(p.ProductName) != 'total'
                GROUP BY c.CategoryID, c.CategoryName
                ORDER BY StockValue DESC
            ")->fetchAll();

            // Top selling products
            $topSellers = $pdo->query("
                SELECT 
                    p.ProductName,
                    SUM(sd.Quantity) AS UnitsSold,
                    SUM(sd.Quantity * sd.UnitPrice) AS TotalSales,
                    SUM((sd.UnitPrice - p.BuyingPrice) * sd.Quantity) AS TotalProfit
                FROM saledetails sd
                JOIN products p ON sd.ProductID = p.ProductID
                GROUP BY sd.ProductID, p.ProductName
                ORDER BY UnitsSold DESC
                LIMIT 8
            ")->fetchAll();

            echo json_encode([
                'success' => true,
                'summary' => [
                    'totalRevenue' => (float)$salesStat['TotalRevenue'],
                    'totalProfit' => (float)$profitStat['RealizedProfit'],
                    'totalProductsCount' => (int)$prodStat['TotalSKUs'],
                    'totalStockUnits' => (int)$prodStat['TotalStockUnits'],
                    'inventoryWholesaleValue' => (float)$prodStat['TotalCostValue'],
                    'inventoryRetailValue' => (float)$prodStat['TotalRetailValue'],
                    'potentialProfit' => (float)($prodStat['TotalRetailValue'] - $prodStat['TotalCostValue']),
                    'lowStockCount' => (int)$prodStat['LowStockCount'],
                    'outOfStockCount' => (int)$prodStat['OutOfStockCount'],
                    'totalSalesCount' => (int)$salesStat['TotalSalesCount'],
                ],
                'categories' => $catStat,
                'topSellers' => $topSellers
            ]);
            break;

        // 8. Users Management (Admin)
        case 'users':
            $user = requireAdmin($pdo);
            $stmt = $pdo->query("SELECT UserID, FullName, Username, Role, Status FROM users ORDER BY UserID ASC");
            $users = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $users]);
            break;

        // 9. Admin Add User
        case 'user_add':
            $admin = requireAdmin($pdo);
            $data = getJsonInput();

            $fullName = trim($data['FullName'] ?? '');
            $username = trim($data['Username'] ?? '');
            $password = trim($data['Password'] ?? '');
            $role = trim($data['Role'] ?? 'Cashier');
            $status = trim($data['Status'] ?? 'Active');

            if (empty($fullName) || empty($username) || empty($password)) {
                throw new Exception('Full name, username, and password are required');
            }

            if (!in_array($role, ['Admin', 'Cashier'])) {
                throw new Exception('Invalid role specified');
            }

            // Check if username taken
            $chk = $pdo->prepare("SELECT UserID FROM users WHERE Username = ?");
            $chk->execute([$username]);
            if ($chk->fetch()) {
                throw new Exception('Username is already taken');
            }

            // Secure hash
            $hash = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("INSERT INTO users (FullName, Username, Password, Role, Status) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$fullName, $username, $hash, $role, $status]);

            echo json_encode([
                'success' => true,
                'message' => "User {$username} created successfully",
                'UserID' => (int)$pdo->lastInsertId()
            ]);
            break;

        // 10. Update User Status (Admin Can lock/activate cashier)
        case 'user_status':
            $admin = requireAdmin($pdo);
            $data = getJsonInput();
            $targetUserId = (int)($data['UserID'] ?? 0);
            $newStatus = trim($data['Status'] ?? 'Active');

            if (!in_array($newStatus, ['Active', 'Inactive'])) {
                throw new Exception('Invalid status value');
            }

            if ($targetUserId === (int)$admin['UserID'] && $newStatus === 'Inactive') {
                throw new Exception('You cannot deactivate your own admin account');
            }

            $stmt = $pdo->prepare("UPDATE users SET Status = ? WHERE UserID = ?");
            $stmt->execute([$newStatus, $targetUserId]);

            echo json_encode(['success' => true, 'message' => "User status updated to {$newStatus}"]);
            break;

        // 11. Helper master tables
        case 'categories':
            $stmt = $pdo->query("SELECT * FROM categories ORDER BY CategoryName ASC");
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'brands':
            $stmt = $pdo->query("SELECT * FROM brands ORDER BY BrandName ASC");
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'locations':
            $stmt = $pdo->query("SELECT * FROM locations ORDER BY LocationName ASC");
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'customers':
            $stmt = $pdo->query("SELECT * FROM customers ORDER BY CustomerName ASC");
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'customer_add':
            $data = getJsonInput();
            $name = trim($data['CustomerName'] ?? '');
            $phone = trim($data['Phone'] ?? '');
            if (empty($name)) throw new Exception('Customer name is required');
            $stmt = $pdo->prepare("INSERT INTO customers (CustomerName, Phone) VALUES (?, ?)");
            $stmt->execute([$name, $phone]);
            echo json_encode(['success' => true, 'CustomerID' => (int)$pdo->lastInsertId()]);
            break;

        // 12. Batch Synchronization for Offline POS Data
        case 'sync_batch':
        case 'sync_offline':
            $data = getJsonInput();
            $salesList = $data['sales'] ?? [];
            $expensesList = $data['expenses'] ?? [];

            $syncedSales = 0;
            $syncedExpenses = 0;
            $errors = [];

            // 1. Process Offline Sales
            if (!empty($salesList) && is_array($salesList)) {
                foreach ($salesList as $saleItem) {
                    try {
                        $pdo->beginTransaction();

                        $saleDate = !empty($saleItem['SaleDate']) ? $saleItem['SaleDate'] : date('Y-m-d H:i:s');
                        $customerId = !empty($saleItem['CustomerID']) ? (int)$saleItem['CustomerID'] : null;
                        $userId = !empty($saleItem['UserID']) ? (int)$saleItem['UserID'] : 1;
                        $totalAmount = (float)($saleItem['TotalAmount'] ?? 0);
                        $items = $saleItem['Items'] ?? $saleItem['items'] ?? [];

                        $stmt = $pdo->prepare("INSERT INTO sales (SaleDate, CustomerID, UserID, TotalAmount) VALUES (?, ?, ?, ?)");
                        $stmt->execute([$saleDate, $customerId, $userId, $totalAmount]);
                        $newSaleId = (int)$pdo->lastInsertId();

                        $itemStmt = $pdo->prepare("INSERT INTO saledetails (SaleID, ProductID, Quantity, UnitPrice) VALUES (?, ?, ?, ?)");
                        $stockStmt = $pdo->prepare("UPDATE products SET Quantity = GREATEST(0, Quantity - ?) WHERE ProductID = ?");

                        foreach ($items as $it) {
                            $pId = (int)($it['ProductID'] ?? 0);
                            $qty = (int)($it['Quantity'] ?? 1);
                            $price = (float)($it['UnitPrice'] ?? 0);
                            if ($pId > 0 && $qty > 0) {
                                $itemStmt->execute([$newSaleId, $pId, $qty, $price]);
                                $stockStmt->execute([$qty, $pId]);
                            }
                        }

                        $pdo->commit();
                        $syncedSales++;
                    } catch (Exception $ex) {
                        if ($pdo->inTransaction()) {
                            $pdo->rollBack();
                        }
                        $errors[] = "Sale error: " . $ex->getMessage();
                    }
                }
            }

            // 2. Process Offline Expenses
            if (!empty($expensesList) && is_array($expensesList)) {
                $pdo->exec("
                    CREATE TABLE IF NOT EXISTS expenses (
                        ExpenseID INT AUTO_INCREMENT PRIMARY KEY,
                        Date DATE NOT NULL,
                        Title VARCHAR(150) NOT NULL,
                        Amount DECIMAL(12,2) NOT NULL,
                        Notes TEXT,
                        RecordedBy VARCHAR(100) DEFAULT 'cashier',
                        LocationID INT DEFAULT 1
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                ");

                $expStmt = $pdo->prepare("INSERT INTO expenses (Date, Title, Amount, Notes, RecordedBy, LocationID) VALUES (?, ?, ?, ?, ?, ?)");
                foreach ($expensesList as $exp) {
                    try {
                        $date = !empty($exp['Date']) ? substr($exp['Date'], 0, 10) : date('Y-m-d');
                        $title = trim($exp['Title'] ?? 'Matumizi');
                        $amount = (float)($exp['Amount'] ?? 0);
                        $notes = trim($exp['Notes'] ?? '');
                        $recordedBy = trim($exp['RecordedBy'] ?? 'cashier');
                        $locId = (int)($exp['LocationID'] ?? 1);

                        if ($amount > 0) {
                            $expStmt->execute([$date, $title, $amount, $notes, $recordedBy, $locId]);
                            $syncedExpenses++;
                        }
                    } catch (Exception $ex) {
                        $errors[] = "Expense error: " . $ex->getMessage();
                    }
                }
            }

            echo json_encode([
                'success' => true,
                'message' => "Usawazishaji umekamilika: Mauzo {$syncedSales}, Matumizi {$syncedExpenses} yametumwa kwenye database.",
                'syncedSales' => $syncedSales,
                'syncedExpenses' => $syncedExpenses,
                'errors' => $errors
            ]);
            break;

        // 13. Expenses list & add
        case 'expenses':
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS expenses (
                    ExpenseID INT AUTO_INCREMENT PRIMARY KEY,
                    Date DATE NOT NULL,
                    Title VARCHAR(150) NOT NULL,
                    Amount DECIMAL(12,2) NOT NULL,
                    Notes TEXT,
                    RecordedBy VARCHAR(100) DEFAULT 'cashier',
                    LocationID INT DEFAULT 1
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");
            $stmt = $pdo->query("SELECT * FROM expenses ORDER BY ExpenseID DESC LIMIT 100");
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'expense_add':
            $data = getJsonInput();
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS expenses (
                    ExpenseID INT AUTO_INCREMENT PRIMARY KEY,
                    Date DATE NOT NULL,
                    Title VARCHAR(150) NOT NULL,
                    Amount DECIMAL(12,2) NOT NULL,
                    Notes TEXT,
                    RecordedBy VARCHAR(100) DEFAULT 'cashier',
                    LocationID INT DEFAULT 1
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");
            $stmt = $pdo->prepare("INSERT INTO expenses (Date, Title, Amount, Notes, RecordedBy, LocationID) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                !empty($data['Date']) ? substr($data['Date'], 0, 10) : date('Y-m-d'),
                trim($data['Title'] ?? 'Matumizi'),
                (float)($data['Amount'] ?? 0),
                trim($data['Notes'] ?? ''),
                trim($data['RecordedBy'] ?? 'cashier'),
                (int)($data['LocationID'] ?? 1)
            ]);
            echo json_encode(['success' => true, 'ExpenseID' => (int)$pdo->lastInsertId(), 'message' => 'Matumizi yamerekodiwa']);
            break;

        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => "Unknown action '{$action}'"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
