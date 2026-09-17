import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Search,
  Calendar,
  User as UserIcon,
  TrendingUp,
  Eye,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  Building2,
  Package,
} from 'lucide-react';
import { Sale, User } from '../types';
import { ReceiptModal } from './ReceiptModal';
import { useLanguage } from '../i18n';

interface SalesHistoryViewProps {
  sales: Sale[];
  currentUser?: User | null;
}

export const SalesHistoryView: React.FC<SalesHistoryViewProps> = ({ sales, currentUser }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const isAdmin = currentUser?.Role === 'Admin';

  const formatTZS = (val: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Enhanced search: searches by Receipt ID, Customer name, Cashier name, AND product names inside the receipt!
  const filteredSales = useMemo(() => {
    if (!searchTerm.trim()) return sales;
    const q = searchTerm.toLowerCase().trim();

    return sales.filter((s) => {
      const matchId = s.SaleID.toString().includes(q) || (s.ReceiptNumber && s.ReceiptNumber.toLowerCase().includes(q));
      const matchCashier = s.CashierName && s.CashierName.toLowerCase().includes(q);
      const matchCustomer = s.CustomerName && s.CustomerName.toLowerCase().includes(q);
      const matchPayment = s.PaymentMethod && s.PaymentMethod.toLowerCase().includes(q);
      const matchProduct = s.Items?.some((item) =>
        item.ProductName?.toLowerCase().includes(q)
      );

      return matchId || matchCashier || matchCustomer || matchPayment || matchProduct;
    });
  }, [sales, searchTerm]);

  const totalRevenue = sales.reduce((acc, s) => acc + (s.TotalAmount || 0), 0);
  const totalProfit = sales.reduce((acc, s) => acc + (s.TotalProfit || 0), 0);

  const getPaymentBadge = (method: string) => {
    const m = (method || '').toLowerCase();
    if (m.includes('m-pesa') || m.includes('vodacom')) {
      return { bg: 'bg-red-50 text-red-700 border-red-200', icon: Smartphone, label: 'M-Pesa' };
    }
    if (m.includes('tigo')) {
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Smartphone, label: 'Tigo Pesa' };
    }
    if (m.includes('airtel')) {
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: Smartphone, label: 'Airtel' };
    }
    if (m.includes('halo')) {
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Smartphone, label: 'HaloPesa' };
    }
    if (m.includes('crdb')) {
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Building2, label: 'CRDB' };
    }
    if (m.includes('nmb')) {
      return { bg: 'bg-sky-50 text-sky-700 border-sky-200', icon: Building2, label: 'NMB' };
    }
    if (m.includes('card')) {
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: CreditCard, label: 'Card' };
    }
    return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: Banknote, label: 'Cash' };
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-100 text-purple-600">
              <Receipt className="w-5 h-5" />
            </span>
            <span>{t.salesHistory}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Historia kamili ya mauzo, risiti za wateja, mifumo ya pesa na namba za miamala.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-2xl shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Jumla ya Mauzo</span>
            <span className="text-sm sm:text-base font-black text-slate-900 font-mono">
              {formatTZS(totalRevenue)}
            </span>
          </div>

          {isAdmin && (
            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                {t.realizedProfit} (Admin)
              </span>
              <span className="text-sm sm:text-base font-black text-emerald-700 font-mono">
                +{formatTZS(totalProfit)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH BAR (Product, Receipt, Customer, Payment) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tafuta kwa jina la bidhaa, namba ya risiti, mteja, au namba ya muamala..."
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Inaonyesha risiti <strong className="text-slate-700">{filteredSales.length}</strong> kati ya {sales.length} zilizorekodiwa
        </p>
      </div>

      {/* Sales Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Risiti / ID</th>
                <th className="py-3 px-4">{t.date}</th>
                <th className="py-3 px-4">{t.cashier}</th>
                <th className="py-3 px-4">Mteja</th>
                <th className="py-3 px-4">Bidhaa Zilizouzwa</th>
                <th className="py-3 px-4">{t.paymentType}</th>
                <th className="py-3 px-4 text-right">Kiasi (TZS)</th>
                {isAdmin && <th className="py-3 px-4 text-right">Faida (Admin)</th>}
                <th className="py-3 px-4 text-center">Risiti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => {
                const badge = getPaymentBadge(sale.PaymentMethod);
                const BadgeIcon = badge.icon;
                return (
                  <tr key={sale.SaleID} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {sale.ReceiptNumber || `#${sale.SaleID}`}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {sale.SaleDate}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {sale.CashierName || `User #${sale.UserID}`}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {sale.CustomerName || 'Mteja wa Kawaida'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-[200px] truncate text-[11px] text-slate-600">
                        {sale.Items && sale.Items.length > 0
                          ? sale.Items.map((i) => `${i.ProductName} (${i.Quantity})`).join(', ')
                          : 'Mzigo'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{sale.PaymentMethod}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-slate-900">
                      {formatTZS(sale.TotalAmount)}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                        +{formatTZS(sale.TotalProfit || 0)}
                      </td>
                    )}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-600 transition-colors inline-flex items-center justify-center"
                        title={t.viewReceipt}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">{t.noResultsFound}</p>
                    <p className="text-[11px] text-slate-400 mt-1">"{searchTerm}"</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedSale && (
        <ReceiptModal
          sale={selectedSale}
          isAdmin={isAdmin}
          onClose={() => setSelectedSale(null)}
        />
      )}
    </div>
  );
};
