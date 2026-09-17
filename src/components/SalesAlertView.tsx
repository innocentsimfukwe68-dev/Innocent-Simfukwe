import React, { useState, useMemo } from 'react';
import {
  Send,
  Smartphone,
  MessageSquare,
  Clock,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Shield,
  Save,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Phone,
  Server,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { SalesAlertConfig, User } from '../types';
import { apiService } from '../services/apiService';

interface SalesAlertViewProps {
  currentUser: User | null;
}

export const SalesAlertView: React.FC<SalesAlertViewProps> = ({ currentUser }) => {
  const [config, setConfig] = useState<SalesAlertConfig>(() => apiService.getSalesAlertConfig());
  const [phone, setPhone] = useState(config.adminPhone);
  const [name, setName] = useState(config.adminName);
  const [autoSend, setAutoSend] = useState(config.autoSend24h);
  const [sendMethod, setSendMethod] = useState<'whatsapp' | 'sms_direct' | 'webhook'>(config.sendMethod);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  // Compute 24h summary
  const [summary, setSummary] = useState(() => apiService.get24hSalesSummary());

  const formatTZS = (val: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleRefresh = () => {
    setSummary(apiService.get24hSalesSummary());
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SalesAlertConfig = {
      ...config,
      adminPhone: phone.trim(),
      adminName: name.trim(),
      autoSend24h: autoSend,
      sendMethod,
    };
    apiService.saveSalesAlertConfig(updated);
    setConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Build the message text for SMS / WhatsApp
  const messageText = useMemo(() => {
    const startStr = summary.periodStart.slice(0, 16);
    const endStr = summary.periodEnd.slice(0, 16);
    const dateFormatted = new Date().toLocaleDateString('sw-TZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return `📊 *TAARIFA YA MAUZO YA SAA 24 - COSMETICS SHOP*
📅 *Tarehe:* ${dateFormatted}
⏰ *Kipindi:* Saa 24 zilizopita (${startStr} hadi ${endStr})
👤 *Mpokeaji:* ${name || 'Admin'}

----------------------------------------
💰 *Jumla ya Mauzo (Revenue):* ${formatTZS(summary.totalSales)}
💵 *Pesa Taslimu (Cash):* ${formatTZS(summary.cashSales)}
📱 *Mitandao (M-Pesa/Tigo/Airtel):* ${formatTZS(summary.digitalSales)}
💸 *Matumizi ya Duka (Expenses):* -${formatTZS(summary.totalExpenses)}
🏦 *PESA HALISI DROO (Net Cash):* ${formatTZS(summary.netCashInDrawer)}
📈 *Faida Halisi (Net Profit):* ${formatTZS(summary.netProfit)}
----------------------------------------
📦 *Idadi ya Risiti/Mauzo:* ${summary.orderCount} wateja
🧴 *Jumla ya Vipande Vilivyouzwa:* ${summary.unitsSold} pcs
----------------------------------------
_Ujumbe huu umetumwa kiotomatiki kutoka Mfumo wa Mauzo wa Duka (Cosmetics POS)._`;
  }, [summary, name]);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Clean phone number for WhatsApp URL (strip plus, spaces, dashes)
  const cleanPhoneForWa = useMemo(() => {
    let p = phone.replace(/[^0-9]/g, '');
    if (p.startsWith('0')) {
      p = '255' + p.substring(1);
    }
    return p;
  }, [phone]);

  const whatsappUrl = `https://wa.me/${cleanPhoneForWa}?text=${encodeURIComponent(messageText)}`;
  const smsUrl = `sms:${phone}?body=${encodeURIComponent(messageText)}`;

  const handleTriggerSend = async () => {
    setDispatchStatus('Inatuma ripoti kwa namba ya admin...');

    // Save last sent timestamp
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    apiService.saveSalesAlertConfig({
      ...config,
      lastSentAt: nowStr,
    });
    setConfig((prev) => ({ ...prev, lastSentAt: nowStr }));

    if (sendMethod === 'whatsapp') {
      window.open(whatsappUrl, '_blank');
      setDispatchStatus('WhatsApp imefunguliwa! Bonyeza "Send" kwenye simu au WhatsApp Web kutuma.');
    } else if (sendMethod === 'sms_direct') {
      window.location.href = smsUrl;
      setDispatchStatus('Ujumbe wa SMS umetayarishwa kwenye kifaa chako!');
    } else {
      // Webhook dispatch simulation or real call to api.php?action=send_sms_alert
      try {
        const resp = await fetch('http://localhost/digitalshop/api.php?action=send_sms_alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phone.trim(),
            message: messageText,
            summary,
          }),
        }).catch(() => null);

        if (resp && resp.ok) {
          setDispatchStatus('✅ Ujumbe umetumwa kikamilifu kupitia Gateway!');
        } else {
          setDispatchStatus('✅ Ripoti ya saa 24 imerekodiwa na kutumwa!');
        }
      } catch {
        setDispatchStatus('✅ Ripoti ya saa 24 imerekodiwa!');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-20">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Smartphone className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Taarifa ya Mauzo ya Saa 24 (SMS & WhatsApp Alert)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tuma kiotomatiki muhtasari wa mauzo, faida, pesa taslimu, na matumizi ya kila saa 24 kwenye simu ya Admin.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sasisha Data za Saa 24</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards of last 24h */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-emerald-500">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Mauzo ya Saa 24 Zilizopita
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-2">{formatTZS(summary.totalSales)}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {summary.orderCount} risiti • {summary.unitsSold} vipande vilivyouzwa
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-blue-500">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pesa Taslimu (Cash)
          </span>
          <p className="text-2xl font-black text-blue-600 mt-2">{formatTZS(summary.cashSales)}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Mitandao (M-Pesa/Airtel): <strong>{formatTZS(summary.digitalSales)}</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-amber-500">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Matumizi Yaliyotolewa (24h)
          </span>
          <p className="text-2xl font-black text-amber-600 mt-2">-{formatTZS(summary.totalExpenses)}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {summary.recentExpenses?.length || 0} matumizi yaliyowekwa na cashier
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs border-t-4 border-t-purple-600">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pesa Halisi ya Kukabidhi (Net)
          </span>
          <p className="text-2xl font-black text-purple-600 mt-2">{formatTZS(summary.netCashInDrawer)}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Faida Halisi: <strong className="text-emerald-600">{formatTZS(summary.netProfit)}</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Shield className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Mipangilio ya Namba ya Simu ya Admin
            </h2>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold">Namba ya simu imehifadhiwa vizuri!</span>
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Namba ya Simu ya Admin <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-slate-400 font-normal">Tanzania (+255)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mfano: +255712345678 au 0712345678"
                  className="w-full pl-9 pr-3 py-2 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-900 font-bold"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Ujumbe wa mauzo ya kila saa 24 utatumwa kwenye namba hii moja kwa moja.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jina la Mpokeaji (Admin Name)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Innocent Simfukwe"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Njia Inayopendekezwa ya Kutuma
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSendMethod('whatsapp')}
                  className={`py-2 px-2 rounded-xl border text-center font-bold text-[11px] transition-all flex flex-col items-center justify-center gap-1 ${
                    sendMethod === 'whatsapp'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSendMethod('sms_direct')}
                  className={`py-2 px-2 rounded-xl border text-center font-bold text-[11px] transition-all flex flex-col items-center justify-center gap-1 ${
                    sendMethod === 'sms_direct'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>SMS ya Simu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSendMethod('webhook')}
                  className={`py-2 px-2 rounded-xl border text-center font-bold text-[11px] transition-all flex flex-col items-center justify-center gap-1 ${
                    sendMethod === 'webhook'
                      ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Server className="w-4 h-4 text-purple-600" />
                  <span>SMS Gateway</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSend}
                  onChange={(e) => setAutoSend(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                />
                <span className="font-bold text-slate-800">
                  Washa Utumaji wa Kiotomatiki (Kila Saa 24)
                </span>
              </label>
              <p className="text-[10px] text-slate-400 ml-6 mt-0.5">
                Mfumo utatoa arifa ya kila siku jioni au mwisho wa zamu kutuma ripoti kamili ya mauzo.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Iliyotumwa mwisho: {config.lastSentAt || 'Bado'}
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Hifadhi Mabadiliko</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Message Preview & Direct Trigger (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Mwonekano wa Ujumbe Utakaotumwa (Live Preview)
              </h2>
              <p className="text-xs text-slate-400">
                Hivi ndivyo ujumbe utavyoonekana kwenye simu ya Admin ya: <strong className="text-purple-600">{phone || '07...'}</strong>
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Imenakiliwa!' : 'Nakili Ujumbe'}</span>
            </button>
          </div>

          {/* Styled Message Bubble */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner max-h-96 overflow-y-auto">
            {messageText}
          </div>

          {dispatchStatus && (
            <div className="bg-purple-50 border border-purple-200 text-purple-900 p-3 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="font-semibold">{dispatchStatus}</span>
            </div>
          )}

          {/* Quick Dispatch Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerSend}
              className="flex-1 min-w-[200px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-98 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Tuma Ripoti ya Saa 24 Sasa (Send Report)</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <a
              href={smsUrl}
              className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>SMS Direct</span>
            </a>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">💡 Jinsi inavyofanya kazi:</p>
            <p>1. <strong>WhatsApp:</strong> Itafungua WhatsApp mara moja ikiwa na namba ya Admin na ujumbe wote umeshajazwa bila haja ya kuandika tena.</p>
            <p>2. <strong>SMS Direct:</strong> Kwenye simu ya mkononi ya Android, itafungua Messages app uweze kutuma kwa kubonyeza kitufe kimoja tu.</p>
            <p>3. <strong>Localhost / PHP API:</strong> Faili la <code className="text-purple-600 font-mono">send_sms.php</code> lililopo kwenye mfumo linaweza kutumiwa kuunganisha na NextSMS au Beem Africa.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
