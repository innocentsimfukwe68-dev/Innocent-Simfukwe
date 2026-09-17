import { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'sw' | 'en';

export interface Translations {
  // Common & Nav
  appName: string;
  appSubtitle: string;
  dashboard: string;
  posSales: string;
  inventory: string;
  salesHistory: string;
  analytics: string;
  users: string;
  phpBackend: string;
  language: string;
  english: string;
  swahili: string;
  installApp: string;
  installAppDesc: string;
  installOnPhoneOrPc: string;
  onlineStatus: string;
  offlineStatus: string;
  searchPlaceholder: string;
  searchProduct: string;
  quickSearch: string;
  searchResults: string;
  noResultsFound: string;
  role: string;
  user: string;
  switchUser: string;
  active: string;
  inactive: string;

  // Dashboard
  welcomeTitle: string;
  welcomeDesc: string;
  totalSkus: string;
  totalSkusDesc: string;
  totalStockUnits: string;
  totalStockUnitsDesc: string;
  todaySales: string;
  todaySalesDesc: string;
  quickActions: string;
  startPosSale: string;
  manageInventory: string;
  addNewProduct: string;
  viewSales: string;
  lowStockAlert: string;
  allStockSafe: string;
  recentSales: string;
  noSalesYet: string;
  quickStockLookup: string;
  quickStockLookupDesc: string;
  itemsRemaining: string;
  shelfLocation: string;

  // POS
  posTitle: string;
  posDesc: string;
  searchProductBarcodeOrName: string;
  scanBarcode: string;
  allCategories: string;
  allBrands: string;
  cart: string;
  itemsInCart: string;
  emptyCart: string;
  emptyCartPrompt: string;
  clearCart: string;
  subtotal: string;
  discount: string;
  totalToPay: string;
  customerNameOptional: string;
  selectPaymentMethod: string;
  paymentDetails: string;
  cashTendered: string;
  changeReturn: string;
  transactionRefOptional: string;
  phoneNumberOptional: string;
  completeSale: string;
  saleCompletedSuccess: string;
  viewReceipt: string;
  printReceipt: string;
  productDetailsPanel: string;
  productDetailsPrompt: string;
  selectedProduct: string;
  sellingPrice: string;
  inStock: string;
  units: string;
  addToCart: string;
  itemOutOfStock: string;

  // Payment Providers
  paymentCash: string;
  paymentMpesa: string;
  paymentTigoPesa: string;
  paymentAirtelMoney: string;
  paymentHaloPesa: string;
  paymentCrdb: string;
  paymentNmb: string;
  paymentNbc: string;
  paymentCard: string;
  paymentBank: string;
  paymentMobile: string;

  // Inventory
  inventoryTitle: string;
  inventoryDesc: string;
  searchStore: string;
  addNewProductBtn: string;
  productName: string;
  barcode: string;
  category: string;
  brand: string;
  buyingPriceAdmin: string;
  profitMarginAdmin: string;
  stockCount: string;
  stockStatus: string;
  reorderLevel: string;
  actions: string;
  editProduct: string;
  adjustStock: string;
  adjustStockQty: string;
  increaseStock: string;
  decreaseStock: string;

  // Analytics & Profit
  analyticsTitle: string;
  analyticsDesc: string;
  adminOnlyNotice: string;
  adminOnlyDesc: string;
  realizedProfit: string;
  profitMargin: string;
  storeValuation: string;
  wholesaleCost: string;
  printReport: string;
  topProfitableCosmetics: string;
  salesGrowthTrend: string;

  // Receipt
  receiptTitle: string;
  receiptNumber: string;
  date: string;
  cashier: string;
  paymentType: string;
  thankYouMessage: string;
  goodSoldNotReturnable: string;
}

const translations: Record<Language, Translations> = {
  sw: {
    appName: 'Dashbodi ya Vipodozi',
    appSubtitle: 'Mfumo Salama wa Mauzo (POS), Stoo na Data',
    dashboard: 'Dashibodi',
    posSales: 'Mauzo (POS)',
    inventory: 'Stoo ya Bidhaa',
    salesHistory: 'Historia ya Mauzo',
    analytics: 'Uchambuzi & Faida',
    users: 'Wafanyakazi & Majukumu',
    phpBackend: 'PHP Backend API',
    language: 'Lugha',
    english: 'English',
    swahili: 'Kiswahili',
    installApp: 'Sakinisha App',
    installAppDesc: 'Tumia mfumo huu kama App kwenye simu au computer yako',
    installOnPhoneOrPc: 'Weka Kwenye Simu / PC',
    onlineStatus: 'Mfumo Uko Mkondoni',
    offlineStatus: 'Hali ya Nje ya Mtandao (Offline)',
    searchPlaceholder: 'Tafuta bidhaa kwa jina au barcode...',
    searchProduct: 'Tafuta Bidhaa',
    quickSearch: 'Utafutaji wa Haraka',
    searchResults: 'Matokeo ya Utafutaji',
    noResultsFound: 'Hakuna bidhaa iliyopatikana',
    role: 'Wadhifa (Role)',
    user: 'Mtumiaji',
    switchUser: 'Badili Mtumiaji',
    active: 'Inafanya kazi',
    inactive: 'Imezimwa',

    welcomeTitle: 'Karibu Kwenye Mfumo wa Duka la Vipodozi',
    welcomeDesc: 'Usimamizi wa Stoo, Mauzo ya Papo Hapo (POS), na Uchambuzi wa Biashara.',
    totalSkus: 'JUMLA YA AINA ZA BIDHAA',
    totalSkusDesc: 'Aina tofauti za vipodozi kwenye mfumo',
    totalStockUnits: 'JUMLA YA BIDHAA STOO',
    totalStockUnitsDesc: 'Jumla ya chupa, makopo na vifaa vilivyopo stoo',
    todaySales: 'MAUZO YA LEO (TSH)',
    todaySalesDesc: 'Mauzo yaliyofanyika kuanzia asubuhi ya leo',
    quickActions: 'Vifungo vya Haraka',
    startPosSale: 'Fanya Mauzo (POS)',
    manageInventory: 'Angalia Stoo',
    addNewProduct: 'Sajili Bidhaa Mpya',
    viewSales: 'Historia ya Mauzo',
    lowStockAlert: 'Tahadhari ya Bidhaa Zinazoisha Stooni',
    allStockSafe: 'Bidhaa zote zipo katika kiwango salama!',
    recentSales: 'Mauzo ya Hivi Karibuni',
    noSalesYet: 'Bado hakuna mauzo yaliyofanyika leo',
    quickStockLookup: 'Tafuta Bidhaa / Angalia Mzigo Uliopo',
    quickStockLookupDesc: 'Andika jina au scan barcode kujua bei, eneo la rafu, na idadi stooni',
    itemsRemaining: 'zimebaki',
    shelfLocation: 'Rafu / Eneo',

    posTitle: 'Sehemu ya Mauzo (POS)',
    posDesc: 'Chagua bidhaa, kagua taarifa zake za bei na eneo la stoo, kisha pokea malipo kwa Fedha Taslimu, M-Pesa, Tigo Pesa, Airtel au Benki.',
    searchProductBarcodeOrName: 'Tafuta bidhaa kwa jina au scan barcode...',
    scanBarcode: 'Scan Barcode',
    allCategories: 'Kategoria Zote',
    allBrands: 'Chapa Zote (Brands)',
    cart: 'Mkokoteni wa Mauzo (Cart)',
    itemsInCart: 'Bidhaa zilizoingizwa',
    emptyCart: 'Mkokoteni hauna bidhaa',
    emptyCartPrompt: 'Chagua bidhaa kutoka upande wa kushoto kuiongeza hapa',
    clearCart: 'Futa Yote',
    subtotal: 'Jumla Ndogo',
    discount: 'Punguzo',
    totalToPay: 'Jumla ya Kulipa',
    customerNameOptional: 'Jina la Mteja (Sio lazima)',
    selectPaymentMethod: 'Chagua Mfumo wa Malipo',
    paymentDetails: 'Maelezo ya Malipo',
    cashTendered: 'Pesa Aliyotoa Mteja (TZS)',
    changeReturn: 'Pesa ya Kurudisha (Chenji)',
    transactionRefOptional: 'Namba ya Muamala / Kumbukumbu',
    phoneNumberOptional: 'Namba ya Simu ya Mteja',
    completeSale: 'Kamilisha Mauzo na Kata Risiti',
    saleCompletedSuccess: 'Mauzo yamekamilika kikamilifu!',
    viewReceipt: 'Angalia Risiti',
    printReceipt: 'Chapisha Risiti',
    productDetailsPanel: 'Taarifa za Kina za Bidhaa',
    productDetailsPrompt: 'Gusa bidhaa yoyote kuona taarifa zake za kina, eneo la rafu stooni, na bei kabla ya kuiuza.',
    selectedProduct: 'Bidhaa Iliyochaguliwa',
    sellingPrice: 'Bei ya Kuuzia',
    inStock: 'Iliyopo Stooni',
    units: 'vipande',
    addToCart: 'Weka Kwenye Mkokoteni (+)',
    itemOutOfStock: 'Bidhaa Hii Imeisha Stooni',

    paymentCash: 'Pesa Taslimu (Cash)',
    paymentMpesa: 'Vodacom M-Pesa',
    paymentTigoPesa: 'Tigo Pesa (Mixx)',
    paymentAirtelMoney: 'Airtel Money',
    paymentHaloPesa: 'HaloPesa',
    paymentCrdb: 'CRDB Bank (SimBanking)',
    paymentNmb: 'NMB Bank (Mkononi)',
    paymentNbc: 'NBC Bank',
    paymentCard: 'Kadi ya Benki (Visa/Mastercard)',
    paymentBank: 'Malipo ya Benki',
    paymentMobile: 'Laini za Simu (Tanzania)',

    inventoryTitle: 'Usimamizi wa Stoo ya Vipodozi',
    inventoryDesc: 'Orodha ya bidhaa zote, idadi stooni, marekebisho ya mzigo na usajili wa bidhaa mpya.',
    searchStore: 'Tafuta kwa jina, barcode au kategoria...',
    addNewProductBtn: 'Ongeza Bidhaa Mpya',
    productName: 'Jina la Bidhaa',
    barcode: 'Barcode',
    category: 'Kategoria',
    brand: 'Chapa (Brand)',
    buyingPriceAdmin: 'Bei ya Kununua (Wholesale)',
    profitMarginAdmin: 'Faida / Margin',
    stockCount: 'Idadi Stoo',
    stockStatus: 'Hali ya Mzigo',
    reorderLevel: 'Kiwango cha Tahadhari',
    actions: 'Vitendo',
    editProduct: 'Rekebisha Bidhaa',
    adjustStock: 'Ongeza / Punguza Mzigo',
    adjustStockQty: 'Kiasi cha Mzigo',
    increaseStock: 'Ongeza Mzigo (+)',
    decreaseStock: 'Punguza Mzigo (-)',

    analyticsTitle: 'Uchambuzi wa Biashara na Faida',
    analyticsDesc: 'Ripoti ya faida halisi, mzunguko wa mauzo, thamani ya stoo na takwimu za mapato.',
    adminOnlyNotice: 'Sehemu Hii Ni Siri ya Msimamizi Mkuu (Admin Only)',
    adminOnlyDesc: 'Kulingana na sera ya usalama, faida halisi na mtaji wa stoo zinaweza kutazamwa na Admin pekee.',
    realizedProfit: 'Faida Halisi Iliyopatikana',
    profitMargin: 'Wastani wa Faida (%)',
    storeValuation: 'Thamani ya Bidhaa Stooni',
    wholesaleCost: 'Gharama ya Jumla (Wholesale)',
    printReport: 'Chapisha Ripoti (Print)',
    topProfitableCosmetics: 'Vipodozi Vinavyoingiza Faida Kubwa Zaidi',
    salesGrowthTrend: 'Mwenendo wa Mauzo na Faida',

    receiptTitle: 'Duka la Vipodozi - Risiti Rasmi',
    receiptNumber: 'Namba ya Risiti',
    date: 'Tarehe',
    cashier: 'Mhudumu / Cashier',
    paymentType: 'Njia ya Malipo',
    thankYouMessage: 'Asante kwa kufanya manunuzi nasi! Karibu tena.',
    goodSoldNotReturnable: 'Bidhaa zikishanunuliwa hazirudishwi.',
  },

  en: {
    appName: 'Cosmetics Store Dashboard',
    appSubtitle: 'Secure Point of Sale, Inventory & Business Analytics',
    dashboard: 'Dashboard',
    posSales: 'Sales (POS)',
    inventory: 'Store Inventory',
    salesHistory: 'Sales History',
    analytics: 'Analytics & Profit',
    users: 'Staff & Roles',
    phpBackend: 'PHP Backend API',
    language: 'Language',
    english: 'English',
    swahili: 'Kiswahili',
    installApp: 'Install App',
    installAppDesc: 'Use this system as an app on your phone or computer',
    installOnPhoneOrPc: 'Install on Phone / PC',
    onlineStatus: 'System Online',
    offlineStatus: 'Offline Mode',
    searchPlaceholder: 'Search product by name or barcode...',
    searchProduct: 'Search Product',
    quickSearch: 'Quick Search',
    searchResults: 'Search Results',
    noResultsFound: 'No products matching your query',
    role: 'Role',
    user: 'User',
    switchUser: 'Switch User',
    active: 'Active',
    inactive: 'Inactive',

    welcomeTitle: 'Welcome to Cosmetics Store Management',
    welcomeDesc: 'Store Inventory Control, Instant POS Checkout, and Realized Profit Analytics.',
    totalSkus: 'TOTAL PRODUCT VARIETIES (SKUs)',
    totalSkusDesc: 'Distinct cosmetic items registered in the database',
    totalStockUnits: 'TOTAL STORE INVENTORY UNITS',
    totalStockUnitsDesc: 'Total count of bottles, containers, and cosmetic units',
    todaySales: "TODAY'S SALES (TSH)",
    todaySalesDesc: 'Total sales registered since this morning',
    quickActions: 'Quick Navigation',
    startPosSale: 'New POS Sale',
    manageInventory: 'View Inventory',
    addNewProduct: 'Add New Product',
    viewSales: 'Sales History',
    lowStockAlert: 'Low Stock Inventory Alerts',
    allStockSafe: 'All products are at safe inventory levels!',
    recentSales: 'Recent Completed Sales',
    noSalesYet: 'No transactions recorded yet today',
    quickStockLookup: 'Quick Product Search & Stock Lookup',
    quickStockLookupDesc: 'Type name or scan barcode to view price, shelf location, and remaining units',
    itemsRemaining: 'units left',
    shelfLocation: 'Shelf / Location',

    posTitle: 'Point of Sale (POS) Terminal',
    posDesc: 'Select items, inspect unit details and shelf location, then accept payment via Cash, Tanzanian Mobile Money (M-Pesa, Tigo Pesa, Airtel, HaloPesa) or Banks.',
    searchProductBarcodeOrName: 'Search product by name or scan barcode...',
    scanBarcode: 'Scan Barcode',
    allCategories: 'All Categories',
    allBrands: 'All Brands',
    cart: 'Sales Cart',
    itemsInCart: 'Cart Items',
    emptyCart: 'Cart is empty',
    emptyCartPrompt: 'Tap or select any cosmetic from the left list to add it here',
    clearCart: 'Clear All',
    subtotal: 'Subtotal',
    discount: 'Discount',
    totalToPay: 'Total to Pay',
    customerNameOptional: 'Customer Name (Optional)',
    selectPaymentMethod: 'Select Payment Channel',
    paymentDetails: 'Payment Details',
    cashTendered: 'Cash Tendered (TZS)',
    changeReturn: 'Change to Return',
    transactionRefOptional: 'Transaction Reference / Till / Lipa Ref',
    phoneNumberOptional: 'Customer Phone Number',
    completeSale: 'Complete Sale & Issue Receipt',
    saleCompletedSuccess: 'Sale completed successfully!',
    viewReceipt: 'View Receipt',
    printReceipt: 'Print Receipt',
    productDetailsPanel: 'Product Specifications & Details',
    productDetailsPrompt: 'Select any product to view its category, brand, shelf placement in store, and retail price before selling.',
    selectedProduct: 'Selected Product',
    sellingPrice: 'Retail Selling Price',
    inStock: 'Available in Stock',
    units: 'units',
    addToCart: 'Add to Cart (+)',
    itemOutOfStock: 'Item is Out of Stock',

    paymentCash: 'Cash (Pesa Taslimu)',
    paymentMpesa: 'Vodacom M-Pesa',
    paymentTigoPesa: 'Tigo Pesa (Mixx by Yas)',
    paymentAirtelMoney: 'Airtel Money',
    paymentHaloPesa: 'HaloPesa (Halotel)',
    paymentCrdb: 'CRDB Bank (SimBanking)',
    paymentNmb: 'NMB Bank (NMB Mkononi)',
    paymentNbc: 'NBC Bank',
    paymentCard: 'Credit / Debit Card',
    paymentBank: 'Tanzanian Bank Transfer',
    paymentMobile: 'Tanzanian Mobile Money',

    inventoryTitle: 'Cosmetics Store Inventory',
    inventoryDesc: 'Full database catalog, stock adjustments, wholesale valuation, and new product creation.',
    searchStore: 'Search by product name, barcode, or category...',
    addNewProductBtn: 'Add New Product',
    productName: 'Product Name',
    barcode: 'Barcode',
    category: 'Category',
    brand: 'Brand',
    buyingPriceAdmin: 'Buying Price (Wholesale)',
    profitMarginAdmin: 'Profit / Margin',
    stockCount: 'Units in Stock',
    stockStatus: 'Stock Status',
    reorderLevel: 'Reorder Alert Level',
    actions: 'Actions',
    editProduct: 'Edit Product',
    adjustStock: 'Adjust Stock Units',
    adjustStockQty: 'Quantity Delta',
    increaseStock: 'Increase Stock (+)',
    decreaseStock: 'Decrease Stock (-)',

    analyticsTitle: 'Business Data & Profit Analytics',
    analyticsDesc: 'Realized gross margins, sales velocity, wholesale store valuation, and business audit metrics.',
    adminOnlyNotice: 'Restricted to Administrator (Admin Only)',
    adminOnlyDesc: 'Under store security policy, realized profit, wholesale capital, and gross margin analytics are restricted to Admin accounts.',
    realizedProfit: 'Realized Net Profit',
    profitMargin: 'Gross Profit Margin (%)',
    storeValuation: 'Store Retail Inventory Value',
    wholesaleCost: 'Wholesale Capital Cost',
    printReport: 'Print Audit Report',
    topProfitableCosmetics: 'Top Profitable Cosmetic Items',
    salesGrowthTrend: 'Daily Sales & Profit Growth Trend',

    receiptTitle: 'Cosmetics Shop - Official Sales Receipt',
    receiptNumber: 'Receipt No',
    date: 'Date',
    cashier: 'Cashier / Staff',
    paymentType: 'Payment Method',
    thankYouMessage: 'Thank you for shopping with us! Welcome again.',
    goodSoldNotReturnable: 'Goods once sold are not returnable.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'sw',
  setLanguage: () => {},
  t: translations.sw,
});

export const useLanguage = () => useContext(LanguageContext);

export { translations };
