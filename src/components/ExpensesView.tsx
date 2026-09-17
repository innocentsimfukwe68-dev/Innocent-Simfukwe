import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  Calendar,
  User as UserIcon,
  Trash2,
  FileText,
  Printer,
  TrendingDown,
  Banknote,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { Expense, User } from '../types';
import { apiService } from '../services/apiService';

interface ExpensesViewProps {
  currentUser: User | null;
  onRefresh?: () => void;
}

const CATEGORIES: Expense['Category'][] = [
  'Mifuko/Vifungashio',
  'Umeme/Maji',
  'Chakula/Posho',
  'Usafiri',
  'Matengenezo',
  'Mawasiliano',
  'Nyinginezo',
];

export const ExpensesView: React.FC<ExpensesViewProps> = ({ currentUser, onRefresh }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => apiService.getExpenses());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('today'); // 'today' | 'this_month' | 'all' | custom YYYY-MM-DD
  const [customDate, setCustomDate] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  const isAdmin = currentUser?.Role === 'Admin';

  // Form State for Recording New Expense
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Expense['Category']>('Mifuko/Vifungashio');
  const [notes, setNotes] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const formatTZS = (val: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const todayStr = useMemo(() => new Date().toISOString().substring(0, 10), []);
  const thisMonthStr = useMemo(() => new Date().toISOString().substring(0, 7), []);

  const refreshExpenses = () => {
    setExpenses(apiService.getExpenses());
    if (onRefresh) onRefresh();
  };

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const q = searchTerm.toLowerCase().trim();
      const matchQuery =
        !q ||
        e.Title.toLowerCase().includes(q) ||
        (e.Notes && e.Notes.toLowerCase().includes(q)) ||
        e.CashierName.toLowerCase().includes(q) ||
        (e.ReceiptNumber && e.ReceiptNumber.toLowerCase().includes(q));

      const matchCategory = filterCategory === 'all' || e.Category === filterCategory;

      let matchDate = true;
      const expDate = e.Date.substring(0, 10);
      if (filterDate === 'today') {
        matchDate = expDate === todayStr;
      } else if (filterDate === 'this_month') {
        matchDate = expDate.startsWith(thisMonthStr);
      } else if (filterDate === 'custom' && customDate) {
        matchDate = expDate === customDate;
      }

      return matchQuery && matchCategory && matchDate;
    });
  }, [expenses, searchTerm, filterCategory, filterDate, customDate, todayStr, thisMonthStr]);

  // Totals calculations
  const totalFilteredExpenses = filteredExpenses.reduce((sum, e) => sum + (e.Amount || 0), 0);

  const todayExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.Date.substring(0, 10) === todayStr)
      .reduce((sum, e) => sum + (e.Amount || 0), 0);
  }, [expenses, todayStr]);

  const thisMonthExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.Date.substring(0, 7) === thisMonthStr)
      .reduce((sum, e) => sum + (e.Amount || 0), 0);
  }, [expenses, thisMonthStr]);

  // Cash drawer comparison for today
  const sales = useMemo(() => apiService.getSales(), []);
  const todaySales = useMemo(() => {
    return sales.filter((s) => s.SaleDate.substring(0, 10) === todayStr);
  }, [sales, todayStr]);

  const todayCashSales = todaySales
    .filter((s) => (s.PaymentMethod || '').toLowerCase().includes('cash') || !s.PaymentMethod)
    .reduce((sum, s) => sum + (s.TotalAmount || 0), 0);

  const netCashInDrawerToday = Math.max(0, todayCashSales - todayExpenses);

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Tafadhali weka kiasi sahihi cha pesa!');
      return;
    }
    if (!title.trim()) {
      alert('Tafadhali taja ulichonunulia au sababu ya matumizi!');
      return;
    }

    const res = apiService.addExpense({
      Amount: numericAmount,
      Title: title.trim(),
      Category: category,
      Notes: notes.trim() || undefined,
      ReceiptNumber: receiptNumber.trim() || `EXP-${Date.now().toString().slice(-6)}`,
      Date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      UserID: currentUser?.UserID || 1,
      CashierName: currentUser?.FullName || 'Cashier',
    });

    if (res.success) {
      refreshExpenses();
      setAmount('');
      setTitle('');
      setNotes('');
      setReceiptNumber('');
      setShowAddModal(false);
      setSuccessMsg('Matumizi yamerekodiwa kikamilifu!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDeleteExpense = (id: number) => {
    if (window.confirm('Una uhakika unataka kufuta rekodi hii ya matumizi?')) {
      apiService.deleteExpense(id);
      refreshExpenses();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Wallet className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Matumizi ya Duka (Petty Cash & Expenses)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sehemu ya Cashier kuweka matumizi madogomadogo na Admin kuona ripoti kamili ya makato ya pesa ya droo.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Chapisha Ripoti</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Weka Matumizi Mapya</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today Expenses */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Matumizi ya Leo
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-1">{formatTZS(todayExpenses)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Yaliyotolewa kwenye droo ya duka leo</p>
        </div>

        {/* Card 2: Cash in Drawer Today (Pesa Halisi ya Droo) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pesa Halisi Droo (Cash)
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-1">{formatTZS(netCashInDrawerToday)}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Mauzo Taslimu ({formatTZS(todayCashSales)}) - Matumizi ({formatTZS(todayExpenses)})
          </p>
        </div>

        {/* Card 3: This Month Expenses */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-rose-500">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Matumizi ya Mwezi Huu
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 mt-1">{formatTZS(thisMonthExpenses)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Jumla ya matumizi mwezi mzima</p>
        </div>

        {/* Card 4: Filtered Sum */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-indigo-500">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jumla ya Orodha Hapa Chini
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-1">{formatTZS(totalFilteredExpenses)}</p>
          <p className="text-[11px] text-slate-400 mt-1">{filteredExpenses.length} rekodi za matumizi</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tafuta alichonunulia, jina la mhudumu, namba ya risiti..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer text-slate-700"
            >
              <option value="all">Makundi Yote ya Matumizi</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date Period Filter */}
          <div>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer text-slate-700"
            >
              <option value="today">Matumizi ya Leo (Today)</option>
              <option value="this_month">Matumizi ya Mwezi Huu</option>
              <option value="all">Matumizi Yote (All Time)</option>
              <option value="custom">Chagua Tarehe Maalum...</option>
            </select>
          </div>

          {/* Custom Date Input if selected */}
          {filterDate === 'custom' ? (
            <div>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
              <span>Zilizopatikana:</span>
              <span className="font-bold text-slate-800">{filteredExpenses.length} rekodi</span>
            </div>
          )}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Orodha ya Matumizi na Risiti (Expense Records)
            </h2>
            <p className="text-xs text-slate-400">
              Maelezo kamili ya kila senti iliyotolewa, kiasi, sababu, na mhudumu aliyeandika.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            Jumla: {formatTZS(totalFilteredExpenses)}
          </span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Wallet className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Hakuna rekodi ya matumizi kwenye kipindi hiki</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Bonyeza kitufe cha "Weka Matumizi Mapya" hapo juu kurekodi ununuzi wowote uliotolewa dukani.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Tarehe na Muda</th>
                  <th className="py-3 px-4">Alichonunulia / Sababu</th>
                  <th className="py-3 px-4">Kundi</th>
                  <th className="py-3 px-4">Mhudumu (Cashier)</th>
                  <th className="py-3 px-4">Ref / Risiti</th>
                  <th className="py-3 px-4 text-right">Kiasi Kilichotumika</th>
                  {isAdmin && <th className="py-3 px-4 text-center">Kitendo</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredExpenses.map((item) => (
                  <tr key={item.ExpenseID} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.Date}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{item.Title}</p>
                      {item.Notes && <p className="text-[11px] text-slate-500 mt-0.5">{item.Notes}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <Tag className="w-2.5 h-2.5 mr-1 text-amber-600" />
                        {item.Category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.CashierName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {item.ReceiptNumber || '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600 whitespace-nowrap">
                      -{formatTZS(item.Amount)}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteExpense(item.ExpenseID)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Futa Rekodi ya Matumizi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Weka Matumizi Mapya */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Wallet className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Weka Matumizi ya Duka (Record Expense)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mhudumu: <strong className="text-slate-700">{currentUser?.FullName || 'Cashier'}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kiasi Kilichotumika (TZS) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">TSh</span>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Mfano: 15,000"
                    className="w-full pl-12 pr-3 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alichonunulia / Sababu ya Matumizi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Mfano: Mifuko ya kubebea, Umeme wa Luku, Maji ya mtungi..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kundi la Matumizi
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Namba ya Risiti / Kumbukumbu (Ukipata)
                  </label>
                  <input
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    placeholder="Mfano: EXP-0045"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Maelezo ya Ziada (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Maelezo yoyote ya kusaidia admin kuelewa..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600"
                >
                  Ghairi (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  Hifadhi Matumizi (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
