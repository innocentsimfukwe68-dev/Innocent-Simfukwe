import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Database,
  CheckCircle,
  X,
  Copy,
  Check,
  Server,
  Zap,
  ShieldCheck,
  ExternalLink,
  Laptop,
  AlertTriangle,
  FileCode,
  FileDown,
} from 'lucide-react';

import { getPublicShareUrl } from '../utils/urlHelper';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onTriggerInstall?: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [fileDownloaded, setFileDownloaded] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  const publicAppUrl = getPublicShareUrl();

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstalledSuccess(true);
        }
      } catch (err) {
        console.error('PWA prompt error:', err);
      }
    } else if (onTriggerInstall) {
      onTriggerInstall();
    }
  };

  // Direct download of an offline HTML launcher for users on any OS/phone
  const handleDownloadLauncherFile = () => {
    const targetUrl = publicAppUrl;
    const htmlContent = `<!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cosmetics Shop POS - Kizinduzi cha App</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .card {
      background: #1e293b;
      padding: 30px;
      border-radius: 20px;
      border: 1px solid #334155;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }
    .icon {
      font-size: 50px;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 8px 0;
      color: #ffffff;
    }
    p {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 14px 20px;
      background: #e11d48;
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: bold;
      font-size: 14px;
      box-sizing: border-box;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #be123c;
    }
    .note {
      margin-top: 16px;
      font-size: 11px;
      color: #64748b;
    }
  </style>
  <script>
    window.location.href = "${targetUrl}";
  </script>
</head>
<body>
  <div class="card">
    <div class="icon">💄</div>
    <h1>Cosmetics Shop POS</h1>
    <p>Inafungua mfumo wako wa mauzo, stoo na fedha moja kwa moja...</p>
    <a class="btn" href="${targetUrl}">Bofya Hapa Kufungua Mfumo</a>
    <div class="note">Unaweza kuhifadhi faili hili kwenye skrini au kompyuta yako kama njia ya mkato.</div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Cosmetics_Shop_POS.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setFileDownloaded(true);
    setTimeout(() => setFileDownloaded(false), 5000);
  };

  const copyAppUrl = () => {
    navigator.clipboard.writeText(publicAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              💄
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Pakua & Sakinisha Mfumo (Download & Install POS)
              </h2>
              <p className="text-xs text-slate-400">
                Weka App kwenye simu au kompyuta yako ili ifanye kazi hata bila bando (Offline)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm">
          {/* NOTICE IF RUNNING INSIDE AN IFRAME (AI Studio Preview) */}
          {isInIframe && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-950 text-sm">
                    Kwanini Inagoma Unapobonyeza &quot;Sakinisha App&quot; Hapa?
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Hivi sasa uko ndani ya <strong>dirisha la ndani la majaribio (Preview Frame)</strong>. Vivinjari vyote vya Google Chrome, Android na Apple <strong>haviruhusu</strong> usakinishaji wa App (PWA) ndani ya fremu ya ndani kwa sababu za usalama wa mfumo.
                  </p>
                </div>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-amber-200 text-xs space-y-2">
                <p className="font-bold text-slate-900">
                  Suluhisho la Papo Hapo: Fungua kwenye Tab Mpya ya Kivinjari:
                </p>
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all group"
                >
                  <span>1. Bofya Hapa Kufungua Kwenye Tab Mpya (Dirisha Kamili)</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <p className="text-[11px] text-slate-500">
                  Ukishafungua kwenye tab mpya, kitufe cha <strong>&quot;Sakinisha App&quot;</strong> kitatokea na kufanya kazi papo hapo kwenye simu au kompyuta yako!
                </p>
              </div>
            </div>
          )}

          {/* Section 1: In-App PWA Install Action */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-600 text-white uppercase tracking-wider">
                  Njia ya 1 • Sakinisha Moja kwa Moja
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-pink-600" />
                  <span>Sakinisha kama App Kwenye Skrini ya Simu au PC</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bofya kitufe hiki ili kuweka App kwenye kifaa chako. Itakaa kama programu kamili yenye ikoni yake ya 💄 na inafanya kazi <strong>nje ya mtandao (offline)</strong> hata bila bando!
                </p>
              </div>
            </div>

            {installedSuccess ? (
              <div className="p-3.5 bg-emerald-100 text-emerald-800 rounded-xl font-semibold flex items-center space-x-2 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Hongera! App imewekwa kikamilifu kwenye kifaa chako.</span>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
              >
                <Download className="w-4 h-4" />
                <span>
                  {deferredPrompt
                    ? 'Sakinisha App Sasa (Bofya Hapa)'
                    : 'Sakinisha App Kwenye Kifaa Hiki (Install App)'}
                </span>
              </button>
            )}

            {/* Quick Tips for Device Types */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Inafanya kazi bila internet (Offline POS)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Inatuma data kiotomatiki mtandao ukirudi</span>
              </div>
            </div>
          </div>

          {/* Section 2: Direct File Download (Offline Launcher) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-800 text-white uppercase tracking-wider">
              Njia ya 2 • Pakua Faili la Kizinduzi (Direct File)
            </span>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center space-x-2">
                  <FileDown className="w-5 h-5 text-indigo-600" />
                  <span>Pakua Faili la App Moja kwa Moja (Offline Launcher)</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Kama unataka faili halisi lishuke kwenye Downloads ya simu au kompyuta yako, bofya hapa chini. Ukilibofya popote litafungua duka lako moja kwa moja:
                </p>
              </div>
            </div>

            {fileDownloaded ? (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl font-semibold flex items-center space-x-2 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Faili la &quot;Cosmetics_Shop_POS.html&quot; limepakuliwa kwenye kifaa chako!</span>
              </div>
            ) : (
              <button
                onClick={handleDownloadLauncherFile}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Pakua Faili la Kizinduzi Sasa (Cosmetics_Shop_POS.html)</span>
              </button>
            )}
          </div>

          {/* Section 3: Direct Download for PHP & MySQL Database */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-800 text-white uppercase tracking-wider">
              Njia ya 3 • Pakua Faili za XAMPP & MySQL Database
            </span>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center space-x-2">
              <Server className="w-5 h-5 text-emerald-600" />
              <span>Pakua Faili za PHP & Database ya MySQL (ZIP)</span>
            </h3>
            <p className="text-xs text-slate-600">
              Kama unataka kuweka mfumo kwenye kompyuta yako ukitumia XAMPP (Apache + MySQL), pakua faili hizi zote hapa chini:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Standalone Production Web App ZIP */}
              <a
                href="/duka_la_vipodozi_web.zip"
                download="duka_la_vipodozi_web.zip"
                className="p-3 bg-white border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/40 rounded-xl flex items-center space-x-3 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Laptop className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-xs truncate">duka_la_vipodozi_web.zip</p>
                  <p className="text-[11px] text-indigo-700 font-medium">App Yote ya Mtandao (Bila Google Auth)</p>
                </div>
              </a>

              {/* ZIP for cosmetics_shop backend */}
              <a
                href="/cosmetics_shop_php_system.zip"
                download="cosmetics_shop_php_system.zip"
                className="p-3 bg-white border border-slate-200 hover:border-pink-300 hover:bg-pink-50/30 rounded-xl flex items-center space-x-3 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-xs truncate">cosmetics_shop_php.zip</p>
                  <p className="text-[11px] text-slate-500">api.php, db.php & SQL</p>
                </div>
              </a>

              {/* Direct SQL Dump */}
              <a
                href="/cosmetics_shop.sql"
                download="cosmetics_shop.sql"
                className="p-3 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 rounded-xl flex items-center space-x-3 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Database className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-xs truncate">cosmetics_shop.sql</p>
                  <p className="text-[11px] text-slate-500">Database Schema & Data</p>
                </div>
              </a>
            </div>
          </div>

          {/* Section 4: Copy App Link for Other Phones */}
          <div className="p-3.5 bg-indigo-50/60 border border-indigo-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-indigo-900">Kiungo cha Simu Nyingine (Bila Email Password):</span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 text-[10px] font-semibold">Umma / Public</span>
              </div>
              <p className="text-[11px] text-indigo-700 font-mono truncate">{publicAppUrl}</p>
              <p className="text-[10px] text-slate-500">
                Tuma link hii kwa mtu yeyote; inafunguka moja kwa moja bila kudai password ya Google au email!
              </p>
            </div>
            <button
              onClick={copyAppUrl}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center space-x-1.5 flex-shrink-0 transition-colors shadow-xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Imenakiliwa!' : 'Nakili Kiungo'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
          >
            Funga
          </button>
        </div>
      </div>
    </div>
  );
};
