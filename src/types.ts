export type UserRole = 'Admin' | 'Cashier' | 'Manager' | 'StoreKeeper';
export type UserStatus = 'Active' | 'Inactive';

export const canViewProfit = (role?: UserRole | null): boolean => {
  return role === 'Admin';
};

export const canAddProduct = (role?: UserRole | null): boolean => {
  return Boolean(role && ['Admin', 'Cashier', 'Manager', 'StoreKeeper'].includes(role));
};

export const canManageUsers = (role?: UserRole | null): boolean => {
  return role === 'Admin';
};

export const canAdjustStock = (role?: UserRole | null): boolean => {
  return Boolean(role && ['Admin', 'Manager', 'StoreKeeper'].includes(role));
};

export interface User {
  UserID: number;
  FullName: string;
  Username: string;
  Password?: string;
  Role: UserRole;
  Status: UserStatus;
  LastLogin?: string;
}

export interface Category {
  CategoryID: number;
  CategoryName: string;
}

export interface Brand {
  BrandID: number;
  BrandName: string;
}

export interface Location {
  LocationID: number;
  LocationName: string;
  Description?: string;
}

export interface Supplier {
  SupplierID: number;
  SupplierName: string;
  Phone: string;
  Address: string;
}

export interface Customer {
  CustomerID: number;
  CustomerName: string;
  Phone: string;
}

export interface Product {
  ProductID: number;
  ProductName: string;
  Barcode: string | null;
  CategoryID: number;
  BrandID: number | null;
  LocationID: number | null;
  SupplierID: number;
  BuyingPrice: number;
  SellingPrice: number;
  CostPrice: number;
  Quantity: number;
  ReorderLevel: number;
  ExpiryDate: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customPrice?: number;
}

export interface SaleItem {
  ItemID?: number;
  SaleDetailID?: number;
  SaleID: number;
  ProductID: number;
  ProductName?: string;
  Quantity: number;
  UnitPrice: number;
  BuyingPrice?: number;
}

export interface Sale {
  SaleID: number;
  ReceiptNumber?: string;
  SaleDate: string;
  CustomerID: number | null;
  CustomerName?: string;
  UserID: number;
  CashierName?: string;
  TotalAmount: number;
  PaymentMethod: string;
  Items: SaleItem[];
  TotalProfit?: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  totalProductsCount: number;
  totalStockUnits: number;
  inventoryWholesaleValue: number;
  inventoryRetailValue: number;
  potentialProfit: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalSalesCount: number;
}

export interface Expense {
  ExpenseID: number;
  Amount: number;
  Title: string; // Alichonunulia / Sababu ya matumizi
  Category: 'Mifuko/Vifungashio' | 'Umeme/Maji' | 'Chakula/Posho' | 'Usafiri' | 'Matengenezo' | 'Mawasiliano' | 'Nyinginezo';
  Notes?: string;
  Date: string; // YYYY-MM-DD HH:mm:ss
  ReceiptNumber?: string;
  UserID: number;
  CashierName: string;
}

export interface SalesAlertConfig {
  adminPhone: string; // e.g. "+255712345678"
  adminName: string;
  autoSend24h: boolean;
  sendMethod: 'whatsapp' | 'sms_direct' | 'webhook';
  webhookUrl?: string;
  lastSentAt?: string;
}

export type ProfitFilterPeriod = 'day' | 'month' | 'year' | 'all';

export interface SyncQueueItem {
  id: string;
  type: 'sale' | 'expense';
  data: any;
  createdAt: string;
  status: 'pending' | 'syncing' | 'failed' | 'synced';
  attempts: number;
  lastError?: string;
}

export interface SyncResult {
  success: boolean;
  syncedSales: number;
  syncedExpenses: number;
  failedCount: number;
  message: string;
}
