import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Boxes,
  PieChart as PieIcon,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Percent,
  Layers,
  Award,
  Calendar,
  Clock,
  Wallet,
  Banknote,
  Receipt,
  FileSpreadsheet,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Printer,
  Package,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { Product, Category, Sale, AnalyticsSummary, User, Expense } from '../types';
import { apiService } from '../services/apiService';
import { useLanguage } from '../i18n';

interface AnalyticsViewProps {
  products: Product[];
  categories: Category[];
  sales: Sale[];
  currentUser?: User | null;
  onSwitchToAdmin?: () => void;
}

const COLORS = ['#e11d48', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  products,
  categories,
  sales,
  currentUser,
  onSwitchToAdmin,
}) => {
  const { t } = useLanguage();

  // Date / Month / Year filter states for Profit analysis
  const todayStr = useMemo(() => new Date().toISOString().substring(0, 10), []);
  const thisMonthStr = useMemo(() => new Date().toISOString().substring(0, 7), []);
  const thisYearStr = useMemo(() => new Date().getFullYear().toString(), []);

  const [periodType, setPeriodType] = useState<'day' | 'month' | 'year' | 'all'>('day');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedMonth, setSelectedMonth] = useState<string>(thisMonthStr);
  const [selectedYear, setSelectedYear] = useState<string>(thisYearStr);
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);

  const analytics: AnalyticsSummary = useMemo(() => {
    return apiService.getAnalytics();
  }, [products, sales]);

  const allExpenses = useMemo(() => apiService.getExpenses(), []);

  const formatTZS = (val: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const validProducts = useMemo(() => {
    return products.filter((p) => p.ProductName.toLowerCase() !== 'total');
  }, [products]);

  // Current filter value based on periodType
  const currentFilterValue = useMemo(() => {
    if (periodType === 'day') return selectedDate;
    if (periodType === 'month') return selectedMonth;
    if (periodType === 'year') return selectedYear;
    return 'all';
  }, [periodType, selectedDate, selectedMonth, selectedYear]);

  // Detailed report for the selected Date / Month / Year
  const periodReport = useMemo(() => {
    return apiService.getProfitReportByPeriod(periodType, currentFilterValue);
  }, [periodType, currentFilterValue, sales, allExpenses]);

  // Category Distribution for Pie Chart
  const categoryData = useMemo(() => {
    return categories.map((cat) => {
      const prods = validProducts.filter((p) => p.CategoryID === cat.CategoryID);
      const totalUnits = prods.reduce((acc, p) => acc + (p.Quantity || 0), 0);
      const retailVal = prods.reduce((acc, p) => acc + (p.SellingPrice || 0) * (p.Quantity || 0), 0);
      const costVal = prods.reduce((acc, p) => acc + (p.BuyingPrice || 0) * (p.Quantity || 0), 0);

      return {
        name: cat.CategoryName,
        productsCount: prods.length,
        stockUnits: totalUnits,
        retailValue: retailVal,
        profitPotential: retailVal - costVal,
      };
    });
  }, [categories, validProducts]);

  // Top Selling Products
  const topSellersData = useMemo(() => {
    const productSoldMap: Record<string, { name: string; units: number; revenue: number; profit: number }> = {};

    sales.forEach((s) => {
      s.Items?.forEach((item) => {
        const key = item.ProductName || `Prod #${item.ProductID}`;
        if (!productSoldMap[key]) {
          productSoldMap[key] = {
            name: key,
            units: 0,
            revenue: 0,
            profit: 0,
          };
        }
        productSoldMap[key].units += item.Quantity;
        productSoldMap[key].revenue += item.UnitPrice * item.Quantity;
        const buyPrice = item.BuyingPrice || 0;
        productSoldMap[key].profit += (item.UnitPrice - buyPrice) * item.Quantity;
      });
    });

    return Object.values(productSoldMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [sales]);

  // Restrict to Admin
  if (currentUser && currentUser.Role !== 'Admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              Uchambuzi wa Faida na Data za Biashara (Admin Only)
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Kulingana na sera ya usalama ya duka, ripoti za <strong>Faida Halisi (Profit)</strong>, 
              <strong>Mtaji wa Stoo</strong>, na <strong>Uchambuzi wa Mauzo</strong> zinaweza kutazamwa 
              na Msimamizi Mkuu (Admin) pekee.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 text-left max-w-md mx-auto space-y-1.5">
            <p className="font-semibold text-slate-800">
              Akaunti ya sasa: <span className="text-pink-600 font-mono font-bold">{currentUser.FullName} ({currentUser.Role})</span>
            </p>
            <p>• <strong>Cashier:</strong> Ana uwezo wa kuuza, kukata risiti, na kuongeza matumizi madogomadogo.</p>
            <p>• <strong>Admin:</strong> Ana mamlaka ya kutazama faida, kusimamia watumiaji, na kuona tathmini kamili ya siku, mwezi na mwaka.</p>
          </div>
          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Badilisha Kwenda Akaunti ya Admin (Switch to Admin)
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ripoti ya Faida na Mauzo (Profit & Sales Analytics)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tazama faida ghafi na halisi kwa kuchagua Tarehe Maalum, Mwezi, au Mwaka mzima.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Chapisha Ripoti (Print)</span>
          </button>

          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800">
              Faida ya Jumla: {analytics.profitMargin.toFixed(1)}% Margin
            </span>
          </div>
        </div>
      </div>

      {/* 5 Core Metrics Cards - Prominently showing TOTAL STOCK UNITS (Vipande vyote stoo) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-rose-500">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase text-slate-500">Mauzo Yote (Revenue)</span>
            <DollarSign className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl font-black text-slate-900">{formatTZS(analytics.totalRevenue)}</p>
          <p className="text-[11px] text-slate-500 mt-1">{analytics.totalSalesCount} risiti zilizokatwa</p>
        </div>

        {/* Card 2: Realized Profit */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-emerald-500">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase text-slate-500">Faida Yote (Profit)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-emerald-600">+{formatTZS(analytics.totalProfit)}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Wastani: <strong className="text-emerald-700">{analytics.profitMargin.toFixed(1)}%</strong>
          </p>
        </div>

        {/* Card 3: TOTAL STOCK UNITS (Vipande vya stock zima bila kujali aina) - Exact user request */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-purple-600">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase text-purple-700">
              Vipande Vyote Stoo (Stock Zima)
            </span>
            <Boxes className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-700 tracking-tight">
            {analytics.totalStockUnits.toLocaleString()} Pcs
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Jumla ya vitu vyote stoo • <span className="font-semibold text-slate-700">{analytics.totalProductsCount} Aina (SKUs)</span>
          </p>
        </div>

        {/* Card 4: Store Valuation */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-blue-500">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase text-slate-500">Thamani ya Mauzo Stoo</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-base font-black text-slate-900">{formatTZS(analytics.inventoryRetailValue)}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Mtaji: {formatTZS(analytics.inventoryWholesaleValue)}
          </p>
        </div>

        {/* Card 5: Potential Profit */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-amber-500">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase text-slate-500">Faida Inayotarajiwa</span>
            <ArrowUpRight className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-base font-black text-amber-600">+{formatTZS(analytics.potentialProfit)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Vipande vyote stoo vikiuzwa</p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION YA KUANGALIA FAIDA NA MAUZO KWA TAREHE, MWEZI NA MWAKA */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-pink-100 text-pink-700">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Uchambuzi wa Faida: Tarehe, Mwezi na Mwaka
                </h2>
                <p className="text-xs text-slate-500">
                  Chagua tarehe maalum, mwezi au mwaka ili kuhesabu mauzo, mtaji, matumizi ya duka na faida halisi.
                </p>
              </div>
            </div>
          </div>

          {/* Period Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setPeriodType('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodType === 'day'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📅 Siku / Tarehe Maalum
            </button>
            <button
              onClick={() => setPeriodType('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodType === 'month'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🗓️ Mwezi
            </button>
            <button
              onClick={() => setPeriodType('year')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodType === 'year'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📆 Mwaka
            </button>
            <button
              onClick={() => setPeriodType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✨ Yote (All Time)
            </button>
          </div>
        </div>

        {/* Input selectors for the chosen period type */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          {periodType === 'day' && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">Chagua Tarehe:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={() => setSelectedDate(todayStr)}
                className={`px-2.5 py-1.5 rounded-lg border font-semibold ${
                  selectedDate === todayStr ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Leo (Today)
              </button>
              <button
                onClick={() => {
                  const y = new Date();
                  y.setDate(y.getDate() - 1);
                  setSelectedDate(y.toISOString().substring(0, 10));
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Jana (Yesterday)
              </button>
            </div>
          )}

          {periodType === 'month' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">Chagua Mwezi:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={() => setSelectedMonth(thisMonthStr)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Mwezi Huu
              </button>
            </div>
          )}

          {periodType === 'year' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">Chagua Mwaka:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
              >
                <option value="2026">Mwaka 2026</option>
                <option value="2025">Mwaka 2025</option>
                <option value="2024">Mwaka 2024</option>
                <option value="2023">Mwaka 2023</option>
              </select>
            </div>
          )}

          {periodType === 'all' && (
            <span className="text-xs text-slate-600 font-semibold">
              Inaonyesha hesabu ya biashara tangu duka lilipoanza kufanya kazi.
            </span>
          )}

          <div className="ml-auto text-xs text-slate-500 font-medium">
            Kipindi kilichochaguliwa: <strong className="text-pink-700 font-bold">{periodReport.dateValue}</strong>
          </div>
        </div>

        {/* 5 Period Performance Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Revenue in period */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              1. Jumla ya Mauzo
            </span>
            <p className="text-xl font-black text-slate-900 mt-1">
              {formatTZS(periodReport.totalRevenue)}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              {periodReport.salesCount} risiti • {periodReport.unitsSold} pcs
            </p>
          </div>

          {/* Card 2: Cost of Goods (Mtaji) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              2. Mtaji wa Bidhaa (Cost)
            </span>
            <p className="text-xl font-black text-slate-700 mt-1">
              {formatTZS(periodReport.totalBuyingCost)}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Gharama ya ununuzi wa bidhaa</p>
          </div>

          {/* Card 3: Faida Ghafi */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              3. Faida Ghafi (Gross)
            </span>
            <p className="text-xl font-black text-emerald-700 mt-1">
              +{formatTZS(periodReport.grossProfit)}
            </p>
            <p className="text-[10px] text-emerald-600 mt-1">
              Margin: <strong>{periodReport.profitMargin.toFixed(1)}%</strong>
            </p>
          </div>

          {/* Card 4: Matumizi ya Duka (Shop Expenses) */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              4. Matumizi ya Duka
            </span>
            <p className="text-xl font-black text-amber-700 mt-1">
              -{formatTZS(periodReport.totalExpenses)}
            </p>
            <p className="text-[10px] text-amber-700 mt-1">
              {periodReport.expensesCount} matumizi yaliyowekwa
            </p>
          </div>

          {/* Card 5: FAIDA HALISI (Net Profit after Expenses) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
              5. FAIDA HALISI (NET)
            </span>
            <p className="text-2xl font-black mt-1">
              +{formatTZS(periodReport.netProfit)}
            </p>
            <p className="text-[10px] text-emerald-100 mt-1">
              Baada ya kutoa matumizi ya duka
            </p>
          </div>
        </div>

        {/* Sales List Table for Selected Period */}
        <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-800">
                Risiti na Mauzo ya Kipindi Hiki ({periodReport.sales.length} Mauzo)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">
              Pesa Taslimu: <strong>{formatTZS(periodReport.cashSales)}</strong> • Mitandao: <strong>{formatTZS(periodReport.digitalSales)}</strong>
            </span>
          </div>

          {periodReport.sales.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Hakuna mauzo yaliyofanyika katika kipindi hiki ({periodReport.dateValue}).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/75 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Risiti #</th>
                    <th className="py-2.5 px-3">Tarehe na Muda</th>
                    <th className="py-2.5 px-3">Mteja & Mhudumu</th>
                    <th className="py-2.5 px-3">Malipo</th>
                    <th className="py-2.5 px-3 text-right">Mauzo (TZS)</th>
                    <th className="py-2.5 px-3 text-right">Faida (Profit)</th>
                    <th className="py-2.5 px-3 text-center">Maelezo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {periodReport.sales.map((sale) => {
                    const isExpanded = expandedSaleId === sale.SaleID;
                    return (
                      <React.Fragment key={sale.SaleID}>
                        <tr className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            #{sale.SaleID}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                            {sale.SaleDate}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-900">{sale.CustomerName || 'Walk-in'}</span>
                            <span className="text-[10px] text-slate-400 block">{sale.CashierName}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {sale.PaymentMethod || 'Cash'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                            {formatTZS(sale.TotalAmount)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-600 font-mono">
                            +{formatTZS(sale.TotalProfit || sale.TotalAmount * 0.25)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => setExpandedSaleId(isExpanded ? null : sale.SaleID)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Tazama bidhaa zilizouzwa"
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Item Level Profit Breakdown */}
                        {isExpanded && sale.Items && (
                          <tr className="bg-slate-50/70 border-b border-slate-100">
                            <td colSpan={7} className="p-3">
                              <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-2">
                                <p className="text-[11px] font-bold text-slate-800">
                                  Bidhaa Zilizouzwa Kwenye Risiti Hii na Faida ya Kila Moja:
                                </p>
                                <div className="space-y-1">
                                  {sale.Items.map((item, idx) => {
                                    const itemRev = item.UnitPrice * item.Quantity;
                                    const itemCost = (item.BuyingPrice || 0) * item.Quantity;
                                    const itemProfit = itemRev - itemCost;
                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between text-[11px] border-b border-slate-50 pb-1"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Package className="w-3.5 h-3.5 text-slate-400" />
                                          <span className="font-semibold text-slate-800">
                                            {item.ProductName} ({item.Quantity} pcs @ {formatTZS(item.UnitPrice)})
                                          </span>
                                        </div>
                                        <div className="font-mono text-right space-x-3">
                                          <span className="text-slate-500">Mtaji: {formatTZS(itemCost)}</span>
                                          <span className="text-slate-800">Mauzo: {formatTZS(itemRev)}</span>
                                          <span className="font-bold text-emerald-600">
                                            Faida: +{formatTZS(itemProfit)}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Top 8 Selling Products Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Bidhaa Zinazoongoza kwa Mauzo na Faida (Top-Sellers)</span>
            </h3>
            <p className="text-xs text-slate-500">Bidhaa za vipodozi zinazoingiza pesa nyingi zaidi dukani</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSellersData.length ? topSellersData : [{ name: 'Eggyskin', revenue: 25000, profit: 7000 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" height={45} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(val: any) => formatTZS(Number(val))} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="revenue" name="Total Sales (TZS)" fill="#e11d48" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Gross Profit (TZS)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category In-Depth Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-sm text-slate-900">Uchambuzi wa Makundi ya Bidhaa (Category Valuation)</h3>
          <p className="text-xs text-slate-500">Thamani ya stoo na faida inayotarajiwa kwa kila idara ya vipodozi</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Kundi (Category)</th>
                <th className="px-4 py-3 text-center">Aina za Bidhaa (SKUs)</th>
                <th className="px-4 py-3 text-center">Vipande Vilivyopo Stoo</th>
                <th className="px-4 py-3 text-right">Thamani ya Mauzo</th>
                <th className="px-4 py-3 text-right">Faida Inayotarajiwa</th>
                <th className="px-4 py-3 text-right">Asilimia ya Faida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {categoryData.map((cat, idx) => {
                const marginPct =
                  cat.retailValue > 0
                    ? ((cat.profitPotential / cat.retailValue) * 100).toFixed(0)
                    : '0';

                return (
                  <tr key={cat.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span>{cat.name}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono">{cat.productsCount}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-purple-700">
                      {cat.stockUnits.toLocaleString()} pcs
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900">
                      {formatTZS(cat.retailValue)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                      +{formatTZS(cat.profitPotential)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                        {marginPct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
