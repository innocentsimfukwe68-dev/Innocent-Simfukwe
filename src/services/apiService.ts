import {
  Product,
  Category,
  Brand,
  Location,
  Customer,
  Supplier,
  User,
  Sale,
  AnalyticsSummary,
  CartItem,
  Expense,
  SalesAlertConfig,
  SyncQueueItem,
  SyncResult,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_LOCATIONS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_USERS,
  INITIAL_SALES,
  INITIAL_EXPENSES,
  DEFAULT_ALERT_CONFIG,
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'cs_products_v1',
  CATEGORIES: 'cs_categories_v1',
  BRANDS: 'cs_brands_v1',
  LOCATIONS: 'cs_locations_v1',
  CUSTOMERS: 'cs_customers_v1',
  SUPPLIERS: 'cs_suppliers_v1',
  USERS: 'cs_users_v1',
  SALES: 'cs_sales_v1',
  EXPENSES: 'cs_expenses_v1',
  SALES_ALERT_CONFIG: 'cs_sales_alert_config_v1',
  CURRENT_USER: 'cs_current_user_v1',
  API_URL: 'cs_api_url_v1',
  USE_REMOTE_API: 'cs_use_remote_api_v1',
  SYNC_QUEUE: 'cs_offline_sync_queue_v1',
  LAST_SYNC: 'cs_last_sync_time_v1',
};

export const DEFAULT_API_URL = 'http://localhost/digitalshop/api.php';

class ApiService {
  private apiUrl: string = (() => {
    const saved = localStorage.getItem(STORAGE_KEYS.API_URL);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.API_URL, DEFAULT_API_URL);
      return DEFAULT_API_URL;
    }
    return saved;
  })();
  private useRemoteApi: boolean = localStorage.getItem(STORAGE_KEYS.USE_REMOTE_API) === 'true';
  private isServerOnline: boolean = false;
  private isSyncing: boolean = false;
  private syncListeners: Array<(pendingCount: number) => void> = [];
  private connectionListeners: Array<(isOnline: boolean) => void> = [];

  constructor() {
    this.initStorage();
    this.setupNetworkWatchers();
  }

  private setupNetworkWatchers() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.checkServerConnection();
    });

    window.addEventListener('offline', () => {
      this.isServerOnline = false;
      this.notifyConnectionListeners();
    });

    // Initial connection check
    setTimeout(() => {
      this.checkServerConnection();
    }, 1200);

    // Periodic heartbeat check every 25 seconds
    setInterval(() => {
      this.checkServerConnection();
    }, 25000);
  }

  public async checkServerConnection(): Promise<boolean> {
    if (typeof window !== 'undefined' && !navigator.onLine) {
      this.isServerOnline = false;
      this.notifyConnectionListeners();
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const resp = await fetch(`${this.apiUrl}?action=ping`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const wasOnline = this.isServerOnline;
      this.isServerOnline = resp.ok;

      // If just reconnected and we have pending offline sync queue items, trigger auto-sync!
      if (!wasOnline && this.isServerOnline && this.getPendingSyncCount() > 0) {
        this.syncPendingQueue(false);
      }

      this.notifyConnectionListeners();
      return this.isServerOnline;
    } catch {
      this.isServerOnline = false;
      this.notifyConnectionListeners();
      return false;
    }
  }

  public isConnectedToDatabase(): boolean {
    return this.isServerOnline;
  }

  public isCurrentlySyncing(): boolean {
    return this.isSyncing;
  }

  public subscribeConnection(cb: (isOnline: boolean) => void): () => void {
    this.connectionListeners.push(cb);
    cb(this.isServerOnline);
    return () => {
      this.connectionListeners = this.connectionListeners.filter((l) => l !== cb);
    };
  }

  private notifyConnectionListeners() {
    this.connectionListeners.forEach((cb) => cb(this.isServerOnline));
  }

  public subscribeSync(cb: (pendingCount: number) => void): () => void {
    this.syncListeners.push(cb);
    cb(this.getPendingSyncCount());
    return () => {
      this.syncListeners = this.syncListeners.filter((l) => l !== cb);
    };
  }

  private notifySyncListeners() {
    const count = this.getPendingSyncCount();
    this.syncListeners.forEach((cb) => cb(count));
  }

  // --- Offline Sync Queue ---
  public getSyncQueue(): SyncQueueItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public saveSyncQueue(queue: SyncQueueItem[]) {
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    this.notifySyncListeners();
  }

  public getPendingSyncCount(): number {
    const queue = this.getSyncQueue();
    return queue.filter((item) => item.status === 'pending' || item.status === 'failed').length;
  }

  public getLastSyncTime(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  }

  public addToSyncQueue(type: 'sale' | 'expense', data: unknown) {
    const queue = this.getSyncQueue();
    const item: SyncQueueItem = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      data,
      createdAt: new Date().toISOString(),
      status: 'pending',
      attempts: 0,
    };
    queue.push(item);
    this.saveSyncQueue(queue);

    // If online, attempt background sync right away
    if (this.isServerOnline) {
      setTimeout(() => this.syncPendingQueue(false), 300);
    }
  }

  public async syncPendingQueue(manual: boolean = false): Promise<SyncResult> {
    if (this.isSyncing) {
      return {
        success: false,
        syncedSales: 0,
        syncedExpenses: 0,
        failedCount: this.getPendingSyncCount(),
        message: 'Usawazishaji unaendelea hivi sasa...',
      };
    }

    const queue = this.getSyncQueue();
    const pending = queue.filter((it) => it.status === 'pending' || it.status === 'failed');

    if (pending.length === 0) {
      return {
        success: true,
        syncedSales: 0,
        syncedExpenses: 0,
        failedCount: 0,
        message: 'Hakuna taarifa zilizosubiri kutumwa. Mauzo na matumizi yote yapo salama kwenye database.',
      };
    }

    this.isSyncing = true;
    this.notifySyncListeners();

    // Verify connection first
    const isConn = await this.checkServerConnection();
    if (!isConn) {
      this.isSyncing = false;
      this.notifySyncListeners();
      return {
        success: false,
        syncedSales: 0,
        syncedExpenses: 0,
        failedCount: pending.length,
        message: `Mawasiliano na database ya XAMPP hayajapatikana kwa anwani ya ${this.apiUrl}. Taarifa ${pending.length} zimehifadhiwa salama kwenye kifaa hiki na zitatumwa kiotomatiki mtandao ukipatikana.`,
      };
    }

    const salesToSync = pending.filter((it) => it.type === 'sale').map((it) => it.data);
    const expensesToSync = pending.filter((it) => it.type === 'expense').map((it) => it.data);

    try {
      const resp = await fetch(`${this.apiUrl}?action=sync_batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sales: salesToSync,
          expenses: expensesToSync,
        }),
      });

      if (!resp.ok) {
        throw new Error(`Server ilijibu kwa msimbo wa HTTP ${resp.status}`);
      }

      const result = await resp.json();
      if (result.success) {
        const pendingIds = new Set(pending.map((p) => p.id));
        const updatedQueue = queue.filter((it) => !pendingIds.has(it.id));
        this.saveSyncQueue(updatedQueue);

        const nowIso = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, nowIso);

        this.isSyncing = false;
        this.notifySyncListeners();

        return {
          success: true,
          syncedSales: result.syncedSales !== undefined ? result.syncedSales : salesToSync.length,
          syncedExpenses: result.syncedExpenses !== undefined ? result.syncedExpenses : expensesToSync.length,
          failedCount: 0,
          message: `Imefanikiwa! Mauzo ${result.syncedSales || salesToSync.length} na Matumizi ${result.syncedExpenses || expensesToSync.length} yametumwa kwenye database ya MySQL.`,
        };
      } else {
        throw new Error(result.message || 'Hitilafu wakati wa kutuma taarifa kwenye database');
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const updated = queue.map((it) => {
        if (it.status === 'pending' || it.status === 'failed') {
          return {
            ...it,
            status: 'failed' as const,
            attempts: it.attempts + 1,
            lastError: errMsg,
          };
        }
        return it;
      });
      this.saveSyncQueue(updated);

      this.isSyncing = false;
      this.notifySyncListeners();

      return {
        success: false,
        syncedSales: 0,
        syncedExpenses: 0,
        failedCount: pending.length,
        message: `Mawasiliano na database yamefeli: ${errMsg}. Taarifa zote ${pending.length} hazijapotea, zitatumwa kiotomatiki mtandao ukirejea.`,
      };
    }
  }

  private initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BRANDS)) {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(INITIAL_BRANDS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(INITIAL_LOCATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUPPLIERS)) {
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SALES_ALERT_CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.SALES_ALERT_CONFIG, JSON.stringify(DEFAULT_ALERT_CONFIG));
    }
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }

  public setApiUrl(url: string) {
    this.apiUrl = url;
    localStorage.setItem(STORAGE_KEYS.API_URL, url);
    this.checkServerConnection();
  }

  public isUsingRemoteApi(): boolean {
    return this.useRemoteApi;
  }

  public setUseRemoteApi(val: boolean) {
    this.useRemoteApi = val;
    localStorage.setItem(STORAGE_KEYS.USE_REMOTE_API, String(val));
  }

  // Ping PHP Backend with clear diagnostics
  public async testConnection(customUrl?: string): Promise<{ success: boolean; message: string; data?: unknown; is404?: boolean }> {
    const url = customUrl || this.apiUrl;
    try {
      const resp = await fetch(`${url}?action=ping`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (resp.status === 404) {
        return {
          success: false,
          is404: true,
          message: `Hitilafu ya 404 (Page Not Found): Apache inafanya kazi lakini faili halipo kwenye njia ya '${url}'. Hii inamaanisha folda ndani ya 'C:/xampp/htdocs/' haijaitwa hilo jina (k.m. inaweza kuwa 'digitalshop' badala ya 'cosmetics_shop'), au faili la api.php halijawekwa ndani ya folda hiyo.`,
        };
      }
      if (!resp.ok) {
        return { success: false, message: `Server ya Apache ilijibu kwa msimbo wa HTTP ${resp.status}` };
      }
      const data = await resp.json();
      this.isServerOnline = true;
      this.notifyConnectionListeners();
      return { success: true, message: data.message || 'Mawasiliano na database yamethibitishwa vizuri!', data };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      this.isServerOnline = false;
      this.notifyConnectionListeners();
      return {
        success: false,
        message: `Haikuweza kufikia ${url}: ${errMsg}. Hakikisha Apache na MySQL zimebofya 'Start' kwenye XAMPP Control Panel.`,
      };
    }
  }

  // Current logged in user
  public getCurrentUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userStr) return null;
    try {
      const parsed: User = JSON.parse(userStr);
      const allUsers = this.getUsers();
      const matched = allUsers.find((u) => u.UserID === parsed.UserID);
      if (!matched || matched.Status === 'Inactive') {
        this.logout();
        return null;
      }
      return matched;
    } catch {
      this.logout();
      return null;
    }
  }

  public setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // Authentication
  public async login(username: string, password: string): Promise<{ success: boolean; user?: User; message: string }> {
    // If remote API is enabled, attempt remote first
    if (this.useRemoteApi) {
      try {
        const resp = await fetch(`${this.apiUrl}?action=login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const result = await resp.json();
        if (result.success && result.user) {
          this.setCurrentUser(result.user);
          return { success: true, user: result.user, message: result.message };
        }
        return { success: false, message: result.message || 'Login failed' };
      } catch (e: unknown) {
        console.warn('Remote API failed, checking local database:', e);
      }
    }

    // Local authentication against database dump users
    const users = this.getUsers();
    const user = users.find(
      (u) => u.Username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }

    if (user.Password !== password.trim()) {
      return { success: false, message: 'Invalid username or password' };
    }

    if (user.Status === 'Inactive') {
      return { success: false, message: 'Your account has been deactivated by the Administrator' };
    }

    user.LastLogin = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.saveUsers(users);
    this.setCurrentUser(user);

    return { success: true, user, message: 'Login successful' };
  }

  public logout() {
    this.setCurrentUser(null);
  }

  // Products
  public getProducts(): Product[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  }

  public saveProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  public addProduct(product: Omit<Product, 'ProductID'>): Product {
    const products = this.getProducts();
    const maxId = products.reduce((max, p) => Math.max(max, p.ProductID), 0);
    const newProduct: Product = {
      ...product,
      ProductID: maxId + 1,
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  public updateProduct(product: Product): Product {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.ProductID === product.ProductID);
    if (index !== -1) {
      products[index] = product;
      this.saveProducts(products);
    }
    return product;
  }

  public adjustStock(productId: number, delta: number): Product | null {
    const products = this.getProducts();
    const product = products.find((p) => p.ProductID === productId);
    if (product) {
      product.Quantity = Math.max(0, product.Quantity + delta);
      this.saveProducts(products);
      return product;
    }
    return null;
  }

  // Categories, Brands, Locations
  public getCategories(): Category[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  }

  public getBrands(): Brand[] {
    const data = localStorage.getItem(STORAGE_KEYS.BRANDS);
    return data ? JSON.parse(data) : [];
  }

  public getLocations(): Location[] {
    const data = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    return data ? JSON.parse(data) : [];
  }

  public getCustomers(): Customer[] {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  }

  public addCustomer(name: string, phone: string): Customer {
    const customers = this.getCustomers();
    const maxId = customers.reduce((max, c) => Math.max(max, c.CustomerID), 0);
    const newCust: Customer = {
      CustomerID: maxId + 1,
      CustomerName: name,
      Phone: phone,
    };
    customers.push(newCust);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    return newCust;
  }

  // Users Management
  public getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  public saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  public addUser(userData: Omit<User, 'UserID'>): User {
    const users = this.getUsers();
    const maxId = users.reduce((max, u) => Math.max(max, u.UserID), 0);
    const newUser: User = {
      ...userData,
      UserID: maxId + 1,
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  public updateUser(updatedUser: User): boolean {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.UserID === updatedUser.UserID);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
      const current = this.getCurrentUser();
      if (current && current.UserID === updatedUser.UserID) {
        this.setCurrentUser(updatedUser);
      }
      return true;
    }
    return false;
  }

  public deleteUser(userId: number): boolean {
    const users = this.getUsers();
    const filtered = users.filter((u) => u.UserID !== userId);
    if (filtered.length !== users.length) {
      this.saveUsers(filtered);
      return true;
    }
    return false;
  }

  public updateUserStatus(userId: number, status: 'Active' | 'Inactive'): boolean {
    const users = this.getUsers();
    const user = users.find((u) => u.UserID === userId);
    if (user) {
      user.Status = status;
      this.saveUsers(users);
      // If updating current user, refresh storage
      const current = this.getCurrentUser();
      if (current && current.UserID === userId) {
        current.Status = status;
        this.setCurrentUser(current);
      }
      return true;
    }
    return false;
  }

  // Sales and Cashier Checkout
  public getSales(): Sale[] {
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    return data ? JSON.parse(data) : [];
  }

  public saveSales(sales: Sale[]) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }

  public createSale(
    cartItems: CartItem[],
    customerId: number | null,
    paymentMethod: string = 'Cash'
  ): { success: boolean; sale?: Sale; message: string } {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'Please log in to make a sale' };
    }
    if (currentUser.Status === 'Inactive') {
      return { success: false, message: 'Cannot process sale: User account is inactive' };
    }

    if (!cartItems.length) {
      return { success: false, message: 'Cart is empty' };
    }

    const products = this.getProducts();

    // Verify stock availability
    for (const item of cartItems) {
      const prod = products.find((p) => p.ProductID === item.product.ProductID);
      if (!prod) {
        return { success: false, message: `Product ${item.product.ProductName} not found` };
      }
      if (prod.Quantity < item.quantity) {
        return {
          success: false,
          message: `Not enough stock for ${prod.ProductName}. In stock: ${prod.Quantity}, requested: ${item.quantity}`,
        };
      }
    }

    // Deduct stock and assemble sale items
    let totalAmount = 0;
    let totalProfit = 0;

    const customers = this.getCustomers();
    const customer = customers.find((c) => c.CustomerID === customerId);

    const sales = this.getSales();
    const maxSaleId = sales.reduce((max, s) => Math.max(max, s.SaleID), 0);
    const newSaleId = maxSaleId + 1;

    const saleItems = cartItems.map((item, index) => {
      const prod = products.find((p) => p.ProductID === item.product.ProductID)!;
      prod.Quantity -= item.quantity;

      const unitPrice = item.customPrice ?? prod.SellingPrice;
      const buyingPrice = prod.BuyingPrice;
      const lineTotal = unitPrice * item.quantity;
      const lineProfit = (unitPrice - buyingPrice) * item.quantity;

      totalAmount += lineTotal;
      totalProfit += lineProfit;

      return {
        ItemID: index + 1,
        SaleID: newSaleId,
        ProductID: prod.ProductID,
        ProductName: prod.ProductName,
        Quantity: item.quantity,
        UnitPrice: unitPrice,
        BuyingPrice: buyingPrice,
      };
    });

    // Save updated products stock
    this.saveProducts(products);

    const newSale: Sale = {
      SaleID: newSaleId,
      SaleDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      CustomerID: customerId,
      CustomerName: customer ? customer.CustomerName : 'Walk-in Customer',
      UserID: currentUser.UserID,
      CashierName: currentUser.FullName,
      TotalAmount: totalAmount,
      PaymentMethod: paymentMethod,
      Items: saleItems,
      TotalProfit: totalProfit,
    };

    sales.unshift(newSale);
    this.saveSales(sales);

    // Queue for sync to remote/local MySQL database
    this.addToSyncQueue('sale', newSale);

    return {
      success: true,
      sale: newSale,
      message: 'Sale completed successfully and stock deducted!',
    };
  }

  // Analytics Computation
  public getAnalytics(): AnalyticsSummary {
    const products = this.getProducts().filter(
      (p) => p.ProductName.toLowerCase() !== 'total'
    );
    const sales = this.getSales();

    const totalProductsCount = products.length;
    const totalStockUnits = products.reduce((acc, p) => acc + (p.Quantity || 0), 0);
    const inventoryWholesaleValue = products.reduce(
      (acc, p) => acc + (p.BuyingPrice || 0) * (p.Quantity || 0),
      0
    );
    const inventoryRetailValue = products.reduce(
      (acc, p) => acc + (p.SellingPrice || 0) * (p.Quantity || 0),
      0
    );
    const potentialProfit = inventoryRetailValue - inventoryWholesaleValue;

    const lowStockCount = products.filter(
      (p) => p.Quantity > 0 && p.Quantity <= p.ReorderLevel
    ).length;
    const outOfStockCount = products.filter((p) => p.Quantity === 0).length;

    const totalRevenue = sales.reduce((acc, s) => acc + (s.TotalAmount || 0), 0);
    const totalProfit = sales.reduce((acc, s) => {
      if (s.TotalProfit !== undefined) {
        return acc + s.TotalProfit;
      }
      // If profit not precomputed, estimate ~25% margin
      return acc + (s.TotalAmount || 0) * 0.25;
    }, 0);

    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalProfit,
      profitMargin,
      totalProductsCount,
      totalStockUnits,
      inventoryWholesaleValue,
      inventoryRetailValue,
      potentialProfit,
      lowStockCount,
      outOfStockCount,
      totalSalesCount: sales.length,
    };
  }

  // --- Expenses (Matumizi ya Duka) ---
  public getExpenses(): Expense[] {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!data) return [];
    try {
      const parsed: Expense[] = JSON.parse(data);
      return parsed.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
    } catch {
      return [];
    }
  }

  public saveExpenses(expenses: Expense[]) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }

  public addExpense(data: Omit<Expense, 'ExpenseID'>): { success: boolean; expense: Expense; message: string } {
    const expenses = this.getExpenses();
    const maxId = expenses.reduce((max, e) => Math.max(max, e.ExpenseID || 0), 0);
    const newExpense: Expense = {
      ...data,
      ExpenseID: maxId + 1,
      Date: data.Date || new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    expenses.unshift(newExpense);
    this.saveExpenses(expenses);

    // Queue for sync to remote/local MySQL database
    this.addToSyncQueue('expense', newExpense);

    return {
      success: true,
      expense: newExpense,
      message: 'Matumizi yamerekodiwa kikamilifu!',
    };
  }

  public deleteExpense(id: number): boolean {
    const expenses = this.getExpenses().filter((e) => e.ExpenseID !== id);
    this.saveExpenses(expenses);
    return true;
  }

  // --- 24-Hour Sales Alert Notification to Admin Phone ---
  public getSalesAlertConfig(): SalesAlertConfig {
    const data = localStorage.getItem(STORAGE_KEYS.SALES_ALERT_CONFIG);
    if (!data) return DEFAULT_ALERT_CONFIG;
    try {
      return { ...DEFAULT_ALERT_CONFIG, ...JSON.parse(data) };
    } catch {
      return DEFAULT_ALERT_CONFIG;
    }
  }

  public saveSalesAlertConfig(config: SalesAlertConfig) {
    localStorage.setItem(STORAGE_KEYS.SALES_ALERT_CONFIG, JSON.stringify(config));
  }

  // Computes exact 24-Hour period summary (or specific date window)
  public get24hSalesSummary(refDate?: Date) {
    const now = refDate ? new Date(refDate) : new Date();
    const past24hTime = now.getTime() - 24 * 60 * 60 * 1000;

    const allSales = this.getSales();
    const allExpenses = this.getExpenses();

    // Filter sales in last 24h
    const recentSales = allSales.filter((s) => {
      const saleTime = new Date(s.SaleDate.replace(' ', 'T')).getTime();
      return !isNaN(saleTime) && saleTime >= past24hTime && saleTime <= now.getTime();
    });

    // Filter expenses in last 24h
    const recentExpenses = allExpenses.filter((e) => {
      const expTime = new Date(e.Date.replace(' ', 'T')).getTime();
      return !isNaN(expTime) && expTime >= past24hTime && expTime <= now.getTime();
    });

    const totalSales = recentSales.reduce((acc, s) => acc + (s.TotalAmount || 0), 0);
    const totalProfit = recentSales.reduce((acc, s) => acc + (s.TotalProfit || 0), 0);

    let cashSales = 0;
    let digitalSales = 0;

    recentSales.forEach((s) => {
      const m = (s.PaymentMethod || '').toLowerCase();
      if (m.includes('cash') || m === '') {
        cashSales += s.TotalAmount || 0;
      } else {
        digitalSales += s.TotalAmount || 0;
      }
    });

    const totalExpenses = recentExpenses.reduce((acc, e) => acc + (e.Amount || 0), 0);
    const netCashInDrawer = Math.max(0, cashSales - totalExpenses);
    const netProfit = totalProfit - totalExpenses;

    const unitsSold = recentSales.reduce((acc, s) => {
      return acc + (s.Items?.reduce((itemAcc, item) => itemAcc + (item.Quantity || 0), 0) || 0);
    }, 0);

    return {
      periodStart: new Date(past24hTime).toISOString().replace('T', ' ').substring(0, 19),
      periodEnd: now.toISOString().replace('T', ' ').substring(0, 19),
      totalSales,
      totalProfit,
      totalExpenses,
      cashSales,
      digitalSales,
      netCashInDrawer,
      netProfit,
      orderCount: recentSales.length,
      unitsSold,
      recentSales,
      recentExpenses,
    };
  }

  // --- Granular Profit & Sales Reporting (Day / Month / Year / All) ---
  public getProfitReportByPeriod(periodType: 'day' | 'month' | 'year' | 'all', dateValue: string) {
    const allSales = this.getSales();
    const allExpenses = this.getExpenses();

    const filteredSales = allSales.filter((s) => {
      if (!s.SaleDate) return false;
      const dateStr = s.SaleDate.substring(0, 10); // YYYY-MM-DD
      if (periodType === 'all') return true;
      if (periodType === 'day') return dateStr === dateValue;
      if (periodType === 'month') return dateStr.startsWith(dateValue); // e.g. "2026-09"
      if (periodType === 'year') return dateStr.startsWith(dateValue); // e.g. "2026"
      return true;
    });

    const filteredExpenses = allExpenses.filter((e) => {
      if (!e.Date) return false;
      const dateStr = e.Date.substring(0, 10);
      if (periodType === 'all') return true;
      if (periodType === 'day') return dateStr === dateValue;
      if (periodType === 'month') return dateStr.startsWith(dateValue);
      if (periodType === 'year') return dateStr.startsWith(dateValue);
      return true;
    });

    const totalRevenue = filteredSales.reduce((acc, s) => acc + (s.TotalAmount || 0), 0);
    
    // Buying cost = Revenue - Gross Profit
    const grossProfit = filteredSales.reduce((acc, s) => {
      if (s.TotalProfit !== undefined) return acc + s.TotalProfit;
      return acc + (s.TotalAmount || 0) * 0.25;
    }, 0);

    const totalBuyingCost = Math.max(0, totalRevenue - grossProfit);
    const totalExpenses = filteredExpenses.reduce((acc, e) => acc + (e.Amount || 0), 0);
    const netProfit = grossProfit - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    let cashSales = 0;
    let digitalSales = 0;
    filteredSales.forEach((s) => {
      const m = (s.PaymentMethod || '').toLowerCase();
      if (m.includes('cash') || m === '') {
        cashSales += s.TotalAmount || 0;
      } else {
        digitalSales += s.TotalAmount || 0;
      }
    });

    const unitsSold = filteredSales.reduce((acc, s) => {
      return acc + (s.Items?.reduce((iAcc, item) => iAcc + (item.Quantity || 0), 0) || 0);
    }, 0);

    return {
      periodType,
      dateValue,
      totalRevenue,
      totalBuyingCost,
      grossProfit,
      totalExpenses,
      netProfit,
      profitMargin,
      netMargin,
      cashSales,
      digitalSales,
      unitsSold,
      salesCount: filteredSales.length,
      expensesCount: filteredExpenses.length,
      sales: filteredSales,
      expenses: filteredExpenses,
    };
  }

  // Reset to original SQL Dump
  public resetToDump() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(INITIAL_BRANDS));
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(INITIAL_LOCATIONS));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    localStorage.setItem(STORAGE_KEYS.SALES_ALERT_CONFIG, JSON.stringify(DEFAULT_ALERT_CONFIG));
  }
}

export const apiService = new ApiService();
