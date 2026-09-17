import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  User as UserIcon,
  Tag,
  MapPin,
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  Sparkles,
  Barcode,
  Package,
  Layers,
  Building2,
  Phone,
  Hash,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Product, Category, Brand, Location, Customer, CartItem, Sale, User } from '../types';
import { apiService } from '../services/apiService';
import { ReceiptModal } from './ReceiptModal';
import { useLanguage } from '../i18n';

interface PosViewProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  locations: Location[];
  customers: Customer[];
  currentUser: User | null;
  onSaleCompleted: (sale: Sale) => void;
  onRefreshProducts: () => void;
  preselectedProduct?: Product | null;
}

export type PaymentChannel =
  | 'Cash'
  | 'Vodacom M-Pesa'
  | 'Tigo Pesa'
  | 'Airtel Money'
  | 'HaloPesa'
  | 'CRDB Bank'
  | 'NMB Bank'
  | 'NBC Bank'
  | 'Card';

export const PosView: React.FC<PosViewProps> = ({
  products,
  categories,
  brands,
  locations,
  customers,
  currentUser,
  onSaleCompleted,
  onRefreshProducts,
  preselectedProduct,
}) => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedBrand, setSelectedBrand] = useState<number | 'all'>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  // Selected product for the "Detail ya Bidhaa" panel
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(() => {
    return preselectedProduct || products.find((p) => p.ProductName.toLowerCase() !== 'total') || null;
  });

  // Tanzanian Payment Options
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>('Cash');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Modals & State
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Add new product state
  const [posNewProduct, setPosNewProduct] = useState({
    ProductName: '',
    Barcode: '',
    CategoryID: categories[0]?.CategoryID || 1,
    BrandID: null as number | null,
    LocationID: locations[0]?.LocationID || null,
    BuyingPrice: 0,
    SellingPrice: 0,
    Quantity: 5,
  });

  const isAdmin = currentUser?.Role === 'Admin';

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.ProductName.toLowerCase() === 'total') return false;

      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.ProductName.toLowerCase().includes(q) ||
        (p.Barcode && p.Barcode.toLowerCase().includes(q)) ||
        p.ProductID.toString() === q;

      const matchesCat = selectedCategory === 'all' || p.CategoryID === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || p.BrandID === selectedBrand;

      return matchesSearch && matchesCat && matchesBrand;
    });
  }, [products, searchTerm, selectedCategory, selectedBrand]);

  // Cart operations
  const addToCart = (product: Product, quantityToAdd = 1) => {
    if (product.Quantity <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.ProductID === product.ProductID);
      if (existing) {
        if (existing.quantity + quantityToAdd > product.Quantity) {
          return prev; // stock limit reached
        }
        return prev.map((item) =>
          item.product.ProductID === product.ProductID
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantityToAdd, product.Quantity) }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.ProductID === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.Quantity) return item; // stock limit
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.ProductID !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCheckoutError(null);
  };

  // Calculations
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.customPrice ?? item.product.SellingPrice;
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  const estimatedProfit = useMemo(() => {
    return cart.reduce((sum, item) => {
      const sell = item.customPrice ?? item.product.SellingPrice;
      const buy = item.product.BuyingPrice ?? 0;
      return sum + (sell - buy) * item.quantity;
    }, 0);
  }, [cart]);

  const changeDue = useMemo(() => {
    if (paymentChannel !== 'Cash') return 0;
    const paid = parseFloat(amountPaid);
    if (isNaN(paid) || paid <= totalAmount) return 0;
    return paid - totalAmount;
  }, [amountPaid, totalAmount, paymentChannel]);

  const formatTZS = (val: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getLocationName = (locId: number | null) => {
    if (!locId) return 'Stoo Kuu';
    const loc = locations.find((l) => l.LocationID === locId);
    return loc ? `${loc.LocationName} (${loc.ShelfCode})` : 'Stoo Kuu';
  };

  const getCategoryName = (id: number) => {
    const cat = categories.find((c) => c.CategoryID === id);
    return cat ? cat.CategoryName : 'Cosmetics';
  };

  const getBrandName = (id: number | null) => {
    if (!id) return 'General';
    const b = brands.find((br) => br.BrandID === id);
    return b ? b.BrandName : 'General';
  };

  // Checkout handler
  const handleCheckout = () => {
    if (cart.length === 0) {
      setCheckoutError('Mkokoteni hauna bidhaa (Cart is empty)');
      return;
    }

    if (paymentChannel === 'Cash') {
      const paid = parseFloat(amountPaid || '0');
      if (paid < totalAmount) {
        setCheckoutError(
          `Pesa aliyotoa mteja (${formatTZS(paid)}) haitoshi kulipa jumla ya ${formatTZS(totalAmount)}`
        );
        return;
      }
    }

    setCheckoutError(null);

    // Format payment string with channel and reference
    let paymentRecord = paymentChannel as string;
    if (transactionRef.trim()) {
      paymentRecord += ` (Ref: ${transactionRef.trim()})`;
    }
    if (customerPhone.trim()) {
      paymentRecord += ` [Simu: ${customerPhone.trim()}]`;
    }

    const saleResult = apiService.createSale(cart, selectedCustomerId, paymentRecord);

    if (saleResult.success && saleResult.sale) {
      onSaleCompleted(saleResult.sale);
      setCompletedSale(saleResult.sale);
      setShowReceipt(true);
      clearCart();
      setAmountPaid('');
      setTransactionRef('');
      setCustomerPhone('');
    } else {
      setCheckoutError(saleResult.message || 'Hitilafu wakati wa kutengeneza mauzo');
    }
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    const created = apiService.addCustomer(
      newCustomerName.trim(),
      newCustomerPhone.trim() || 'N/A'
    );

    setSelectedCustomerId(created.CustomerID);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setShowNewCustomerModal(false);
  };

  const handleAddProductFromPos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posNewProduct.ProductName.trim() || posNewProduct.SellingPrice <= 0) return;

    const created = apiService.addProduct({
      ProductName: posNewProduct.ProductName.trim(),
      Barcode: posNewProduct.Barcode.trim(),
      CategoryID: Number(posNewProduct.CategoryID),
      BrandID: posNewProduct.BrandID ? Number(posNewProduct.BrandID) : null,
      LocationID: posNewProduct.LocationID ? Number(posNewProduct.LocationID) : null,
      SupplierID: 1,
      BuyingPrice: Number(posNewProduct.BuyingPrice),
      CostPrice: Number(posNewProduct.BuyingPrice),
      SellingPrice: Number(posNewProduct.SellingPrice),
      Quantity: Number(posNewProduct.Quantity),
      ReorderLevel: 3,
      ExpiryDate: null,
    });

    onRefreshProducts();
    setInspectedProduct(created);
    addToCart(created);
    setShowAddProductModal(false);
    setPosNewProduct({
      ProductName: '',
      Barcode: '',
      CategoryID: categories[0]?.CategoryID || 1,
      BrandID: null,
      LocationID: locations[0]?.LocationID || null,
      BuyingPrice: 0,
      SellingPrice: 0,
      Quantity: 5,
    });
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pb-16">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-pink-100 text-pink-600">
              <ShoppingCart className="w-5 h-5" />
            </span>
            <span>{t.posTitle}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t.posDesc}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Customer Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
            <UserIcon className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCustomerId || ''}
              onChange={(e) => setSelectedCustomerId(e.target.value ? Number(e.target.value) : null)}
              className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none"
            >
              <option value="">{t.customerNameOptional} (Walk-in)</option>
              {customers.map((c) => (
                <option key={c.CustomerID} value={c.CustomerID}>
                  {c.CustomerName} ({c.Phone})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowNewCustomerModal(true)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-pink-600" />
            <span className="hidden sm:inline">Mteja</span>
          </button>

          {/* Add Product Button (Available to Cashier & Admin) */}
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-xs font-bold text-white flex items-center space-x-1.5 shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addNewProduct}</span>
          </button>
        </div>
      </div>

      {/* DEDICATED PRODUCT DETAILS PANEL (Requested by user: "sehemu ya mauzo iwe na sehemu yake iwe inaonyesha detail ya bidhaa inayouzwa na bei") */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t.productDetailsPanel}
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            {inspectedProduct ? 'Gusa kuona bidhaa nyingine' : t.productDetailsPrompt}
          </span>
        </div>

        {inspectedProduct ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Left Info */}
            <div className="md:col-span-6 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {getCategoryName(inspectedProduct.CategoryID)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-700 text-slate-200">
                  {getBrandName(inspectedProduct.BrandID)}
                </span>
                {inspectedProduct.Barcode && (
                  <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                    <Barcode className="w-3 h-3" />
                    {inspectedProduct.Barcode}
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {inspectedProduct.ProductName}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.shelfLocation}:</span>
                  <strong className="text-white">{getLocationName(inspectedProduct.LocationID)}</strong>
                </span>

                <span>•</span>

                <span className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.inStock}:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                      inspectedProduct.Quantity === 0
                        ? 'bg-rose-500/30 text-rose-300'
                        : inspectedProduct.Quantity <= inspectedProduct.ReorderLevel
                        ? 'bg-amber-500/30 text-amber-300'
                        : 'bg-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    {inspectedProduct.Quantity} {t.units}
                  </span>
                </span>
              </div>
            </div>

            {/* Right: Price & Quick Add */}
            <div className="md:col-span-6 flex flex-col sm:flex-row sm:items-center justify-end gap-4 bg-white/5 p-3.5 rounded-xl border border-white/10">
              <div>
                <p className="text-[11px] text-slate-400">{t.sellingPrice}</p>
                <p className="text-2xl sm:text-3xl font-black text-pink-400 font-mono tracking-tight">
                  {formatTZS(inspectedProduct.SellingPrice)}
                </p>
                {isAdmin && inspectedProduct.BuyingPrice && (
                  <p className="text-[11px] text-emerald-400 font-medium">
                    Wholesale (Admin): {formatTZS(inspectedProduct.BuyingPrice)} • Faida:{' '}
                    +{formatTZS(inspectedProduct.SellingPrice - inspectedProduct.BuyingPrice)}
                  </p>
                )}
              </div>

              <button
                disabled={inspectedProduct.Quantity <= 0}
                onClick={() => addToCart(inspectedProduct, 1)}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-md transition-all self-stretch sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {inspectedProduct.Quantity <= 0 ? t.itemOutOfStock : t.addToCart}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
            <Info className="w-4 h-4 text-slate-500" />
            <span>{t.productDetailsPrompt}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Left Catalog & Right Checkout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Product Search & Grid (7 or 8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          {/* Search Box & Category Filters */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchProductBarcodeOrName}
                className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills with lively colors */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.allCategories}
              </button>
              {categories.map((cat, idx) => {
                const colors = [
                  'hover:bg-pink-100 text-pink-700 active:bg-pink-600',
                  'hover:bg-purple-100 text-purple-700 active:bg-purple-600',
                  'hover:bg-blue-100 text-blue-700 active:bg-blue-600',
                  'hover:bg-emerald-100 text-emerald-700 active:bg-emerald-600',
                  'hover:bg-amber-100 text-amber-700 active:bg-amber-600',
                ];
                const activeColor = selectedCategory === cat.CategoryID;
                return (
                  <button
                    key={cat.CategoryID}
                    onClick={() => setSelectedCategory(cat.CategoryID)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                      activeColor
                        ? 'bg-pink-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.CategoryName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const inStock = p.Quantity > 0;
              const cartItem = cart.find((c) => c.product.ProductID === p.ProductID);
              const isSelected = inspectedProduct?.ProductID === p.ProductID;

              return (
                <div
                  key={p.ProductID}
                  onClick={() => setInspectedProduct(p)}
                  className={`group relative bg-white rounded-2xl border p-3 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-pink-500 ring-2 ring-pink-500/20 shadow-md'
                      : 'border-slate-200/90 hover:border-pink-300 hover:shadow-sm'
                  } ${!inStock ? 'opacity-60 bg-slate-50' : ''}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 truncate max-w-[110px]">
                        {getCategoryName(p.CategoryID)}
                      </span>
                      <span
                        className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
                          !inStock
                            ? 'bg-rose-100 text-rose-700'
                            : p.Quantity <= p.ReorderLevel
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.Quantity}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-pink-600 line-clamp-2 leading-snug">
                      {p.ProductName}
                    </h4>

                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-slate-400" />
                      <span className="truncate">{getLocationName(p.LocationID)}</span>
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-pink-600 font-mono">
                        {formatTZS(p.SellingPrice)}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!inStock}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (inStock) {
                          setInspectedProduct(p);
                          addToCart(p, 1);
                        }
                      }}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                        !inStock
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : cartItem
                          ? 'bg-pink-600 text-white shadow-xs scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-pink-600 hover:text-white'
                      }`}
                    >
                      {cartItem ? (
                        <span className="text-xs font-black">{cartItem.quantity}</span>
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">{t.noResultsFound}</p>
                <p className="text-[11px] text-slate-400 mt-1">"{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Cart & Tanzanian Payment Checkout (4 or 5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col max-h-[820px] sticky top-4">
            {/* Cart Header */}
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4 text-pink-600" />
                <h3 className="font-bold text-slate-900 text-sm">{t.cart}</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)} {t.units}
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-rose-600 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.clearCart}</span>
                </button>
              )}
            </div>

            {/* Error Message */}
            {checkoutError && (
              <div className="mx-3 mt-2 p-2 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{checkoutError}</span>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100 max-h-56">
              {cart.map((item) => {
                const linePrice = (item.customPrice ?? item.product.SellingPrice) * item.quantity;
                return (
                  <div
                    key={item.product.ProductID}
                    className="pt-2 first:pt-0 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {item.product.ProductName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {formatTZS(item.customPrice ?? item.product.SellingPrice)} x {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.ProductID, -1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-rose-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.ProductID, 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-emerald-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-slate-900 font-mono w-16 text-right">
                        {formatTZS(linePrice)}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.product.ProductID)}
                        className="text-slate-300 hover:text-rose-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {cart.length === 0 && (
                <div className="py-8 text-center text-slate-400">
                  <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">{t.emptyCart}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.emptyCartPrompt}</p>
                </div>
              )}
            </div>

            {/* TANZANIAN PAYMENT SECTION (Requested by user: "haina ya mfumo wa pesa unaotumika kuuza kma benk,laini za cm za tanzania") */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50/80 space-y-3 rounded-b-2xl">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  {t.selectPaymentMethod}
                </label>

                {/* Grid of Tanzanian Providers with Authentic Brand Colors */}
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('Cash')}
                    className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                      paymentChannel === 'Cash'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span className="text-[11px]">Cash</span>
                  </button>

                  {/* Vodacom M-Pesa */}
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('Vodacom M-Pesa')}
                    className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                      paymentChannel === 'Vodacom M-Pesa'
                        ? 'bg-[#e60000] text-white border-[#e60000] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-red-50 hover:border-red-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                    <span className="text-[11px]">M-Pesa</span>
                  </button>

                  {/* Tigo Pesa */}
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('Tigo Pesa')}
                    className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                      paymentChannel === 'Tigo Pesa'
                        ? 'bg-[#0033a0] text-white border-[#0033a0] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span className="text-[11px]">Tigo Pesa</span>
                  </button>

                  {/* Airtel Money */}
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('Airtel Money')}
                    className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                      paymentChannel === 'Airtel Money'
                        ? 'bg-[#e20613] text-white border-[#e20613] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50 hover:border-rose-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-rose-600" />
                    <span className="text-[11px]">Airtel</span>
                  </button>

                  {/* CRDB Bank */}
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('CRDB Bank')}
                    className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                      paymentChannel === 'CRDB Bank'
                        ? 'bg-[#00843d] text-white border-[#00843d] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">CRDB</span>
                  </button>

                  {/* NMB Bank */}
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('NMB Bank')}
                    className={`p-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                      paymentChannel === 'NMB Bank'
                        ? 'bg-[#002f6c] text-white border-[#002f6c] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-sky-700" />
                    <span className="text-[11px]">NMB</span>
                  </button>
                </div>
              </div>

              {/* Conditional Inputs based on Payment Method */}
              {paymentChannel === 'Cash' ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{t.cashTendered}:</span>
                    {changeDue > 0 && (
                      <span className="text-emerald-600 font-bold font-mono">
                        Chenji: {formatTZS(changeDue)}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder={`Mfano: ${totalAmount}`}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono font-bold"
                  />
                  {/* Quick Shilling denomination buttons */}
                  <div className="flex gap-1.5 text-[10px]">
                    {[totalAmount, 10000, 20000, 50000].map((amt) => {
                      if (amt <= 0) return null;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAmountPaid(amt.toString())}
                          className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-mono text-slate-600"
                        >
                          {amt.toLocaleString()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Mobile / Bank Reference Inputs */
                <div className="space-y-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">
                      Lipa kupitia {paymentChannel}
                    </span>
                    <span className="text-pink-600 font-semibold font-mono">
                      {paymentChannel.includes('Bank') ? 'A/C: 01523456789' : 'Lipa Namba: 543210'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">
                        {t.transactionRefOptional}
                      </label>
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. 9X29A10K"
                        className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">
                        {t.phoneNumberOptional}
                      </label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="07XX-XXXXXX"
                        className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Total & Checkout Button */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {t.totalToPay}:
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono">
                    {formatTZS(totalAmount)}
                  </span>
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{t.completeSale}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Customer Modal */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Sajili Mteja Mpya</h3>
              <button
                onClick={() => setShowNewCustomerModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer} className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Jina Kamili la Mteja
                </label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="e.g. Mary Mgaya"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Namba ya Simu
                </label>
                <input
                  type="tel"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="0754 000 000"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold"
              >
                Hifadhi Mteja
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal (Available directly from POS) */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-pink-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {t.addNewProduct} (Direct POS)
                </h3>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProductFromPos} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.productName} *
                </label>
                <input
                  type="text"
                  required
                  value={posNewProduct.ProductName}
                  onChange={(e) =>
                    setPosNewProduct((prev) => ({ ...prev, ProductName: e.target.value }))
                  }
                  placeholder="e.g. CeraVe Moisturizing Lotion 250ml"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.barcode}
                  </label>
                  <input
                    type="text"
                    value={posNewProduct.Barcode}
                    onChange={(e) =>
                      setPosNewProduct((prev) => ({ ...prev, Barcode: e.target.value }))
                    }
                    placeholder="Scan or type barcode"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.category} *
                  </label>
                  <select
                    value={posNewProduct.CategoryID}
                    onChange={(e) =>
                      setPosNewProduct((prev) => ({ ...prev, CategoryID: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                  >
                    {categories.map((c) => (
                      <option key={c.CategoryID} value={c.CategoryID}>
                        {c.CategoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.sellingPrice} (TZS) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={posNewProduct.SellingPrice || ''}
                    onChange={(e) =>
                      setPosNewProduct((prev) => ({
                        ...prev,
                        SellingPrice: Number(e.target.value),
                      }))
                    }
                    placeholder="e.g. 15000"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.stockCount} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={posNewProduct.Quantity}
                    onChange={(e) =>
                      setPosNewProduct((prev) => ({ ...prev, Quantity: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              {isAdmin && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.buyingPriceAdmin} (Admin)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={posNewProduct.BuyingPrice || ''}
                    onChange={(e) =>
                      setPosNewProduct((prev) => ({ ...prev, BuyingPrice: Number(e.target.value) }))
                    }
                    placeholder="Bei ya jumla"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                Hifadhi na Ongeza Kwenye POS
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Completed Sale Receipt Modal */}
      {showReceipt && completedSale && (
        <ReceiptModal
          sale={completedSale}
          isAdmin={isAdmin}
          onClose={() => {
            setShowReceipt(false);
            setCompletedSale(null);
          }}
        />
      )}
    </div>
  );
};
