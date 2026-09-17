import React from 'react';
import { Printer, X, Receipt, CheckCircle, Smartphone, CreditCard, Banknote, Building2 } from 'lucide-react';
import { Sale } from '../types';
import { useLanguage } from '../i18n';

interface ReceiptModalProps {
  sale: Sale;
  onClose: () => void;
  isAdmin?: boolean;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose, isAdmin = false }) => {
  const { t } = useLanguage();

  const formatTZS = (val: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getPaymentBadge = (method: string) => {
    const m = (method || '').toLowerCase();
    if (m.includes('m-pesa') || m.includes('vodacom')) {
      return { bg: 'bg-red-50 text-red-700 border-red-200', label: 'Vodacom M-Pesa' };
    }
    if (m.includes('tigo')) {
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Tigo Pesa' };
    }
    if (m.includes('airtel')) {
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Airtel Money' };
    }
    if (m.includes('halo')) {
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'HaloPesa' };
    }
    if (m.includes('crdb')) {
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'CRDB Bank' };
    }
    if (m.includes('nmb')) {
      return { bg: 'bg-sky-50 text-sky-700 border-sky-200', label: 'NMB Bank' };
    }
    if (m.includes('bank') || m.includes('nbc')) {
      return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Bank Transfer' };
    }
    return { bg: 'bg-slate-100 text-slate-800 border-slate-200', label: method || 'Cash' };
  };

  const badge = getPaymentBadge(sale.PaymentMethod);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{t.receiptTitle}</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {t.receiptNumber}: {sale.ReceiptNumber || `#${sale.SaleID}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 pr-1">
          {/* Metadata */}
          <div className="py-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">{t.date}:</span>
              <span className="font-medium text-slate-800 font-mono">{sale.SaleDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.cashier}:</span>
              <span className="font-semibold text-slate-800">
                {sale.CashierName || `Staff #${sale.UserID}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mteja:</span>
              <span className="font-semibold text-slate-800">
                {sale.CustomerName || 'Mteja wa Kawaida'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500">{t.paymentType}:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}
              >
                {sale.PaymentMethod || 'Cash'}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="py-3 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.itemsInCart} ({sale.Items?.length || 0})
            </p>
            {sale.Items && sale.Items.length > 0 ? (
              sale.Items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start p-2 rounded-xl bg-slate-50 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-800 truncate">
                      {item.ProductName || `Product #${item.ProductID}`}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {item.Quantity} x {formatTZS(item.UnitPrice)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-slate-900 font-mono">
                      {formatTZS(item.UnitPrice * item.Quantity)}
                    </p>
                    {isAdmin && item.BuyingPrice && (
                      <p className="text-[10px] text-emerald-600 font-semibold font-mono">
                        Faida: +{formatTZS((item.UnitPrice - item.BuyingPrice) * item.Quantity)}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Hakuna orodha ya bidhaa.</p>
            )}
          </div>

          {/* Totals */}
          <div className="py-3 space-y-1.5">
            <div className="flex justify-between text-base font-black text-slate-900">
              <span>{t.totalToPay}:</span>
              <span className="text-rose-600">{formatTZS(sale.TotalAmount)}</span>
            </div>
            {isAdmin && sale.TotalProfit !== undefined && (
              <div className="flex justify-between text-xs text-emerald-600 font-bold">
                <span>{t.realizedProfit} (Admin):</span>
                <span className="font-mono">+{formatTZS(sale.TotalProfit)}</span>
              </div>
            )}
            <p className="text-[10px] text-center text-slate-400 italic pt-2">
              {t.thankYouMessage}
              <br />
              {t.goodSoldNotReturnable}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex space-x-2 flex-shrink-0">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printReceipt}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Funga (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
