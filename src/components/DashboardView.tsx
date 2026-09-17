import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Package,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  X,
  MapPin,
  Barcode,
  Sparkles,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import { Product, Sale, User, Location } from '../types';
import { ReceiptModal } from './ReceiptModal';
import { useLanguage } from '../i18n';

interface DashboardViewProps {
  products: Product[];
  sales: Sale[];
  currentUser: User | null;
  locations: Location[];
  onNavigate: (tab: string) => void;
  onSelectProductForPos?: (product: Product) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  sales,
  currentUser,
  locations,
  onNavigate,
  onSelectProductForPos,
}) => {
  const { t, language } = useLanguage();
  const [selectedReceiptSale, setSelectedReceiptSale] = useState<Sale | null>(null);
  const [dashboardSearch, setDashboardSearch] = useState('');

  // Exclude 'Total' summary product row
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.ProductName.toLowerCase() !== 'total');
  }, [products]);

  // Total SKUs (Aina za Bidhaa)
  const totalProductsCount = activeProducts.length;

  // Total units in stock (Jumla ya Bidhaa Stoo)
  const totalStockUnits = useMemo(() => {
    return activeProducts.reduce((sum, p) => sum + (Number(p.Quantity) || 0), 0);
  }, [activeProducts]);

  // Today's sales calculation
  const todaySalesTotal = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter((s) => s.SaleDate && s.SaleDate.startsWith(todayStr));
    return todaySales.reduce((sum, s) => sum + (Number(s.TotalAmount) || 0), 0);
  }, [sales]);

  // Low stock products (Quantity <= ReorderLevel)
  const lowStockProducts = useMemo(() => {
    return activeProducts
      .filter((p) => p.Quantity <= p.ReorderLevel)
      .sort((a, b) => a.Quantity - b.Quantity)
      .slice(0, 5);
  }, [activeProducts]);

  // Filtered search results on Dashboard
  const searchResults = useMemo(() => {
    if (!dashboardSearch.trim()) return [];
    const query = dashboardSearch.toLowerCase().trim();
    return activeProducts
      .filter((p) => {
        return (
          p.ProductName.toLowerCase().includes(query) ||
          (p.Barcode && p.Barcode.toLowerCase().includes(query)) ||
          p.ProductID.toString() === query
        );
      })
      .slice(0, 6);
  }, [activeProducts, dashboardSearch]);

  // Recent 5 sales
  const recentSales = sales.slice(0, 5);

  const getLocationName = (locId: number | null) => {
    if (!locId) return 'Stoo Kuu';
    const loc = locations.find((l) => l.LocationID === locId);
    return loc ? `${loc.LocationName} (${loc.ShelfCode})` : 'Stoo Kuu';
  };

  const formatTZS = (val: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-10">
      {/* Welcome Heading Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t.welcomeTitle}</span>
            <span className="text-xl">✨</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.welcomeDesc}</p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            {t.onlineStatus}
          </span>
          <span className="text-xs text-slate-400 font-mono hidden md:inline-block">
            {new Date().toLocaleDateString(language === 'sw' ? 'sw-TZ' : 'en-US', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* The 3 Top Cards with distinct vivid color identity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: JUMLA YA AINA ZA BIDHAA (Blue Top Border) */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 border-t-4 border-t-blue-600 p-5 sm:p-6 transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
              {t.totalSkus}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
              {totalProductsCount.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{t.totalSkusDesc}</p>
        </div>

        {/* Card 2: JUMLA YA BIDHAA STOO (Emerald Green Top Border) */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 border-t-4 border-t-emerald-500 p-5 sm:p-6 transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
              {t.totalStockUnits}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
              {totalStockUnits.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{t.totalStockUnitsDesc}</p>
        </div>

        {/* Card 3: MAUZO YA LEO (Orange Top Border) */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 border-t-4 border-t-orange-500 p-5 sm:p-6 transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase flex items-center space-x-1">
              <span>{t.todaySales}</span>
              <span className="text-sm">📋</span>
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-black text-orange-600 tracking-tight">
              TSh {todaySalesTotal.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{t.todaySalesDesc}</p>
        </div>
      </div>

      {/* QUICK PRODUCT SEARCH & STOCK LOOKUP (New Feature requested by user: "weka sehemu za kusearch bidhaa kila sehemu ambayo ineitajika") */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-yellow-300" />
              <h2 className="text-base sm:text-lg font-bold">{t.quickStockLookup}</h2>
            </div>
            <p className="text-xs text-violet-100 mt-0.5">{t.quickStockLookupDesc}</p>
          </div>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium self-start md:self-auto">
            {activeProducts.length} {t.totalSkus.toLowerCase()}
          </span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={dashboardSearch}
            onChange={(e) => setDashboardSearch(e.target.value)}
            placeholder={t.searchProductBarcodeOrName}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
          />
          {dashboardSearch && (
            <button
              onClick={() => setDashboardSearch('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Search Results on Dashboard */}
        {dashboardSearch.trim() !== '' && (
          <div className="mt-3 bg-white text-slate-900 rounded-xl p-3 shadow-lg max-h-72 overflow-y-auto divide-y divide-slate-100">
            {searchResults.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                {t.noResultsFound} "{dashboardSearch}"
              </p>
            ) : (
              searchResults.map((product) => (
                <div
                  key={product.ProductID}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {product.ProductName}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="font-mono text-pink-600 font-semibold">
                        {formatTZS(product.SellingPrice)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-indigo-500" />
                        {getLocationName(product.LocationID)}
                      </span>
                      {product.Barcode && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-slate-400 flex items-center gap-0.5">
                            <Barcode className="w-3 h-3" />
                            {product.Barcode}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                        product.Quantity === 0
                          ? 'bg-rose-100 text-rose-700'
                          : product.Quantity <= product.ReorderLevel
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {product.Quantity} {t.itemsRemaining}
                    </span>

                    <button
                      onClick={() => {
                        if (onSelectProductForPos) {
                          onSelectProductForPos(product);
                        }
                        onNavigate('pos');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold flex items-center space-x-1 shadow-xs transition-colors"
                      title="Uza bidhaa hii kwenye POS"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Uza</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          {t.quickActions}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('pos')}
            className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-xs transition-all"
          >
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>{t.startPosSale}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigate('inventory')}
            className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-xs shadow-xs transition-all"
          >
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>{t.manageInventory}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigate('sales')}
            className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-xs shadow-xs transition-all"
          >
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{t.viewSales}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigate('inventory')}
            className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs shadow-xs transition-all"
          >
            <div className="flex items-center space-x-2">
              <PlusCircle className="w-4 h-4" />
              <span>{t.addNewProduct}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recent Sales & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Completed Sales */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-slate-800 text-sm">{t.recentSales}</h3>
            </div>
            <button
              onClick={() => onNavigate('sales')}
              className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center space-x-1"
            >
              <span>{t.viewSales}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentSales.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">{t.noSalesYet}</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentSales.map((sale) => (
                <div
                  key={sale.SaleID}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      {sale.ReceiptNumber} • {sale.CustomerName || 'Mteja'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {sale.SaleDate} • {sale.PaymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      TSh {sale.TotalAmount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => setSelectedReceiptSale(sale)}
                      className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                      title={t.viewReceipt}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-800 text-sm">{t.lowStockAlert}</h3>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
            >
              <span>{t.manageInventory}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8 text-emerald-600 text-xs flex flex-col items-center justify-center">
              <CheckCircle2 className="w-6 h-6 mb-1 text-emerald-500" />
              <span>{t.allStockSafe}</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {lowStockProducts.map((prod) => (
                <div
                  key={prod.ProductID}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {prod.ProductName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Bei: TSh {prod.SellingPrice.toLocaleString()} • Tahadhari: {prod.ReorderLevel}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono flex-shrink-0 ${
                      prod.Quantity === 0
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {prod.Quantity === 0 ? 'Imeisha (0)' : `${prod.Quantity} ${t.itemsRemaining}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Receipt Modal if selected */}
      {selectedReceiptSale && (
        <ReceiptModal
          sale={selectedReceiptSale}
          isAdmin={currentUser?.Role === 'Admin'}
          onClose={() => setSelectedReceiptSale(null)}
        />
      )}
    </div>
  );
};
