# Cosmetics Shop PHP Backend & Database Integration

This backend is designed specifically for your `cosmetics_shop` MySQL database dump.

## Files
1. `db.php` - MySQL PDO database connection with UTF-8 encoding and automatic table migration for user status.
2. `api.php` - Complete REST API responding to `http://localhost/cosmetics_shop/api.php?action=...`
3. `.htaccess` - Clean routing and CORS support.

## Installation in XAMPP / WAMP / LAMP:
1. Open XAMPP and start **Apache** and **MySQL**.
2. Go to `http://localhost/phpmyadmin/` and import your `cosmetics_shop.sql` file.
3. In your web root directory (e.g. `C:/xampp/htdocs/` or `/var/www/html/`):
   - Create a folder named `cosmetics_shop`:
   - Copy `db.php`, `api.php`, and `.htaccess` into `C:/xampp/htdocs/cosmetics_shop/`
4. Test in browser:
   Open: `http://localhost/cosmetics_shop/api.php?action=ping`
   You should see:
   ```json
   {
     "success": true,
     "message": "Cosmetics Shop API is running",
     "database": "cosmetics_shop",
     "version": "1.0.0"
   }
   ```

## Supported API Actions:
- `POST ?action=login`: Cashier and Admin authentication with token & status check.
- `GET ?action=products`: Retrieve all 371+ cosmetics products with category, shelf location, stock, and margins.
- `POST ?action=sale_create`: Cashier POS transaction with automatic stock deduction, receipt generation, and multi-payment support.
- `GET ?action=sales`: Order and sales transaction history with profit calculation.
- `GET ?action=analytics`: Business metrics: Total Revenue, Gross Profit, Total Inventory Count, Low Stock items, Category charts.
- `GET ?action=users`: Admin user list with Active/Inactive status.
- `POST ?action=user_add`: Admin creates Cashier or Admin accounts.
- `POST ?action=user_status`: Admin locks or activates a user.
- `POST ?action=product_add`: Admin adds products.
- `POST ?action=product_update`: Admin edits prices, shelf locations, or quantities.
- `GET ?action=categories`, `GET ?action=brands`, `GET ?action=locations`, `GET ?action=customers`.
