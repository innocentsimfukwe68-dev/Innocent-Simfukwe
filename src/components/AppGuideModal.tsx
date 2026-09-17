import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  Share2,
  HelpCircle,
  X,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Copy,
  Check,
  Server,
  KeyRound,
  DollarSign,
  Package,
  TrendingUp,
  Receipt,
  FileCode2,
  FileDown,
  AlertTriangle,
} from 'lucide-react';

import { getPublicShareUrl } from '../utils/urlHelper';

interface AppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onTriggerInstall?: () => void;
}

export const AppGuideModal: React.FC<AppGuideModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall,
}) => {
  const [activeTab, setActiveTab] = useState<'install' | 'php' | 'share' | 'usage'>('install');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedDevUrl, setCopiedDevUrl] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [launcherDownloaded, setLauncherDownloaded] = useState(false);

  const publicAppUrl = getPublicShareUrl();
  const devAppUrl = 'https://ais-dev-4nt55l2sw6ts2x4weub6d2-712811788743.europe-west2.run.app';

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleDownloadLauncher = () => {
    const a = document.createElement('a');
    a.href = '/Cosmetics_Shop_POS.html';
    a.download = 'Cosmetics_Shop_POS.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setLauncherDownloaded(true);
    setTimeout(() => setLauncherDownloaded(false), 5000);
  };

  const handleInstallButtonClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          // Installed
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else if (isInIframe) {
      // In preview iframe, prompt is blocked by browser security. Open in new tab where Chrome triggers the install dialog
      window.open(window.location.href, '_blank');
    } else {
      // Direct file download for immediate offline use
      handleDownloadLauncher();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              💄
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Mwongozo wa Kutumia & Kupakua Mfumo (App & PHP)
              </h2>
              <p className="text-xs text-slate-300">
                Jinsi ya kuisakinisha kwenye simu, kupakua faili za PHP, na kutumia mfumo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-slate-100 p-2 border-b border-slate-200 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'install'
                ? 'bg-white text-pink-700 shadow-xs border border-pink-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>1. Sakinisha kwenye Simu (Android/iOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('share')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'share'
                ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>2. Mtu Mwingine Kuipata (Share)</span>
          </button>

          <button
            onClick={() => setActiveTab('php')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'php'
                ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>3. Pakua PHP & Database (ZIP)</span>
          </button>

          <button
            onClick={() => setActiveTab('usage')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'usage'
                ? 'bg-white text-amber-700 shadow-xs border border-amber-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>4. Jinsi ya Kuitumia (POS & Stoo)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* TAB 1: INSTALL ON PHONE */}
          {activeTab === 'install' && (
            <div className="space-y-5">
              {/* Notice if inside iframe */}
              {isInIframe && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-amber-950 flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Kwanini Usakinishaji Unazuiliwa Ukiwa Hapa:</span>
                    </p>
                    <p className="text-amber-900 text-[11px] leading-relaxed">
                      Vivinjari vya Google Chrome na Android <strong>haviruhusu</strong> usakinishaji wa App ukiwa ndani ya fremu ya majaribio (Preview Frame). Fungua kwenye Tab Mpya (Dirisha Kamili) ili kusakinisha App mara moja:
                    </p>
                  </div>
                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 flex-shrink-0 transition-all"
                  >
                    <span>Fungua Tab Mpya 🚀</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-pink-900 text-sm sm:text-base flex items-center space-x-2">
                    <Smartphone className="w-5 h-5 text-pink-600" />
                    <span>Sakinisha Moja kwa Moja kama App ya Simu (PWA)</span>
                  </h3>
                  <p className="text-xs text-pink-800">
                    Mfumo huu umetengenezwa ukiwa tayari kama Progressive Web App (PWA). Unafunguka kama programu rasmi ya simu yenye icon yake bila kuhitaji Google Play Store na inafanya kazi <strong>bila bando (Offline)</strong>.
                  </p>
                </div>
                <button
                  onClick={handleInstallButtonClick}
                  className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Sakinisha Sasa Hivi</span>
                </button>
              </div>

              {/* Instructions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Android Steps */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
                    <span className="text-xl">🤖</span>
                    <span>Kwa Simu za Android (Samsung, TECNO, Infinix, n.k.)</span>
                  </div>
                  <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                    <p>
                      Bofya kitufe cha moja kwa moja hapa chini kusakinisha App:
                    </p>
                    <button
                      onClick={handleInstallButtonClick}
                      className="w-full py-2.5 px-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-colors active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Sakinisha App Moja kwa Moja Sasa (Install App)</span>
                    </button>

                    {/* Direct Offline Launcher Download Alternative */}
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-[11px] text-slate-600 mb-1.5">
                        Au pakua faili la kizinduzi (Offline File) kwenye simu yako:
                      </p>
                      {launcherDownloaded ? (
                        <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-semibold flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Faili limepakuliwa (Cosmetics_Shop_POS.html)!</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleDownloadLauncher}
                          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-colors"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>Pakua Faili la App (Cosmetics_Shop_POS.html)</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 pt-1">
                      Ikoni ya 💄 itawekwa papo hapo kwenye skrini ya simu yako na itafanya kazi <strong>bila mtandao (offline)</strong> wakati wote.
                    </p>
                  </div>
                </div>

                {/* iPhone Steps */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
                    <span className="text-xl">🍏</span>
                    <span>Kwa Simu za iPhone & iPad (Apple iOS)</span>
                  </div>
                  <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                    <li>Fungua kiungo cha mfumo huu kwenye browser ya <strong>Safari</strong>.</li>
                    <li>
                      Bofya kitufe cha <strong>Kushare</strong> (ikoni ya kisanduku chenye mshale unaoelekea juu 📤 chini ya skrini).
                    </li>
                    <li>
                      Sogeza orodha ya chini na uchague: <br />
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-pink-100 text-pink-800 font-bold">
                        ➕ &quot;Add to Home Screen&quot; (Ongeza kwenye Skrini ya Nyumbani)
                      </span>
                    </li>
                    <li>Bofya <strong>&quot;Add&quot;</strong> juu kulia. App itakuwa tayari kwenye iPhone yako.</li>
                  </ol>
                </div>
              </div>

              {/* PC / Laptop */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-blue-50/50 flex items-center space-x-3 text-xs text-slate-700">
                <Laptop className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p>
                  <strong>Kwenye Laptop / Desktop:</strong> Kwenye Google Chrome au Edge, bofya alama ya kompyuta ndogo (Install icon) iliyopo mwishoni mwa uwanja wa anwani (URL bar) juu kulia ili kufungua mfumo kama Window tofauti.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SHARE WITH OTHERS */}
          {activeTab === 'share' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Viungo (Links) vya Kufungulia na Kushare Mfumo
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kuna viungo viwili unavyoweza kutumia kufungua mfumo wako:
                </p>
              </div>

              {/* Link 1: Public Shared Link (No Google Email Password Required) */}
              <div className="border-2 border-emerald-500 bg-emerald-50/70 rounded-xl p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider">
                    Link ya Umma (Kwa Simu na Mtu Yeyote)
                  </span>
                  <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    ✅ Haidai Password ya Email wala Google!
                  </span>
                </div>

                <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-emerald-300 shadow-2xs">
                  <input
                    type="text"
                    readOnly
                    value={publicAppUrl}
                    className="flex-1 bg-transparent text-xs font-mono text-slate-800 outline-none px-1 select-all"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedUrl ? 'Imenakiliwa!' : 'Nakili Link'}</span>
                  </button>
                </div>

                <div className="text-xs text-emerald-950 space-y-1 leading-relaxed">
                  <p className="font-semibold text-emerald-900">
                    💡 Hii ndiyo link ya kutuma kwenye WhatsApp au kufungua kwenye simu nyingine zote za wahudumu.
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    Mhudumu yeyote akifungua kiungo hiki ataingia moja kwa moja kwenye duka na kuweka jina lake la mtumiaji (Username) na Password ya duka bila kuulizwa email ya Google.
                  </p>
                </div>
              </div>

              {/* Notice regarding Developer Link vs Public Link */}
              <div className="border border-amber-300 bg-amber-50/80 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-amber-900 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Kwanini simu nyingine ilikuomba uweke password ya email?</span>
                </div>
                <div className="text-slate-700 text-[11px] space-y-1.5 leading-relaxed">
                  <p>
                    Ulituma link ya msanidi programu yenye <code className="bg-white px-1 py-0.5 rounded border font-mono text-amber-900">ais-dev-...</code>. Kampuni ya Google inalinda link hiyo ili iweze kufunguliwa na mmiliki pekee (<span className="font-mono text-slate-800">innocentsimfukwe68@gmail.com</span>).
                  </p>
                  <p className="bg-white p-2.5 rounded-lg border border-amber-200 text-slate-800">
                    👉 <strong>Suluhisho:</strong> Tumia kiungo cha kijani cha <strong>Link ya Umma (ais-pre-...)</strong> kilicho hapo juu. Kinafunguka kwenye simu yoyote, kivinjari chochote, na mtandao wowote bila akaunti ya Google!
                  </p>
                  <p className="text-slate-500">
                    (Ili kuhakikisha link ya umma inasasishwa na mabadiliko ya hivi karibuni, bofya kitufe cha <strong>&quot;Share&quot;</strong> kilichopo juu kulia mwa skrini ya AI Studio).
                  </p>
                </div>
              </div>

              {/* User Roles Details */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Madaraja ya Watumiaji na Mamlaka (User Access & Security Roles):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                      ADMIN (Msimamizi / Mmiliki)
                    </span>
                    <p className="font-semibold text-slate-800">Mamlaka Kamili ya Uongozi</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Kuona faida yote, mtaji, kurekebisha bei, kuongeza/kubadili watumiaji na nenosiri, kufungua matawi na kuona ripoti za fedha.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      CASHIER (Mhudumu / Keshia)
                    </span>
                    <p className="font-semibold text-slate-800">Mamlaka ya Uendeshaji wa Mauzo</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Kufanya mauzo, kukata risiti, kuangalia stoo ya bidhaa, na kurekodi matumizi ya siku (hawezi kuona faida ya jumla ya duka au kubadili bei za mtaji).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHP & SQL DOWNLOAD */}
          {activeTab === 'php' && (
            <div className="space-y-4">
              {/* Standalone Web App Download */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <div>
                  <h3 className="font-bold text-indigo-950 text-sm sm:text-base flex items-center space-x-2">
                    <Laptop className="w-5 h-5 text-indigo-600" />
                    <span>Pakua Web App Nzima (Bila Google Authentication)</span>
                  </h3>
                  <p className="text-xs text-indigo-900 mt-1">
                    Faili lililokamilika la mfumo mzima (HTML, JS, CSS). Unaweza kuliweka kwenye cPanel, Vercel, au Netlify na likafunguka kwa mtu yeyote bila kuuliza email ya Google!
                  </p>
                </div>
                <a
                  href="/duka_la_vipodozi_web.zip"
                  download="duka_la_vipodozi_web.zip"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 flex-shrink-0 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Pakua Web App (ZIP)</span>
                </a>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div>
                  <h3 className="font-bold text-emerald-900 text-sm sm:text-base flex items-center space-x-2">
                    <FileCode2 className="w-5 h-5 text-emerald-600" />
                    <span>Pakua Faili Zote za PHP & MySQL (ZIP Archive)</span>
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1">
                    Inajumuisha <code className="font-mono">api.php</code>, <code className="font-mono">db.php</code>, na <code className="font-mono">cosmetics_shop.sql</code> (Database: <strong>cosmetics_shop</strong>).
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="/cosmetics_shop_php_system.zip"
                    download="cosmetics_shop_php_system.zip"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 flex-shrink-0 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Pakua ZIP Sasa</span>
                  </a>
                  <a
                    href="/cosmetics_shop.sql"
                    download="cosmetics_shop.sql"
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100/50 text-emerald-900 font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 flex-shrink-0 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    <span>cosmetics_shop.sql</span>
                  </a>
                </div>
              </div>

              {/* Database info card */}
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider block">Jina la Database MySQL:</span>
                  <span className="text-base font-black font-mono text-slate-900">cosmetics_shop</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-500 block">Host & Mtumiaji:</span>
                  <span className="text-xs font-mono font-semibold text-slate-700">localhost | root</span>
                </div>
              </div>

              {/* XAMPP Setup steps */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Jinsi ya Kuziweka Kwenye Kompyuta Yako (XAMPP / WAMP):
                </p>
                <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                  <li>Pakua faili la <strong>cosmetics_shop_php_system.zip</strong> hapo juu.</li>
                  <li>Litoe (Extract) kwenye folda ya: <br /><code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-pink-700">C:/xampp/htdocs/cosmetics_shop/</code> (au <code>digitalshop</code>)</li>
                  <li>Fungua browser na uingie kwenye <strong>http://localhost/phpmyadmin/</strong></li>
                  <li>Tengeneza database mpya iitwayo: <code className="font-mono font-bold text-slate-900">cosmetics_shop</code></li>
                  <li>Bofya kichupo cha <strong>Import</strong>, chagua faili la <code className="font-mono font-bold text-slate-900">cosmetics_shop.sql</code>, kisha bofya <strong>Go / Import</strong>.</li>
                  <li>API yako itakuwa hewani moja kwa moja kwenye: <br /><code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-emerald-700">http://localhost/cosmetics_shop/api.php</code></li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: USAGE GUIDE */}
          {activeTab === 'usage' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Jinsi ya Kutumia Mfumo (Hatua kwa Hatua)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                    <Receipt className="w-4 h-4" />
                    <span>1. Kufanya Mauzo (POS)</span>
                  </div>
                  <p className="text-slate-600">
                    Bofya <strong>&quot;Fanya Mauzo (POS)&quot;</strong>, chagua bidhaa unazotaka kuuza (unaweza kutafuta kwa jina au barcode), weka idadi, bofya &quot;Kamilisha Mauzo&quot;, chagua njia ya malipo (Pesa Taslimu, M-Pesa, Tigo Pesa, Airtel Money), kisha bofya <strong>Kamilisha & Chapisha Risiti</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-700 font-bold">
                    <Package className="w-4 h-4" />
                    <span>2. Kusimamia Stoo (Inventory)</span>
                  </div>
                  <p className="text-slate-600">
                    Kadi ya juu inaonyesha <strong>Idadi ya Stock Zima Stoo</strong> (vipande vyote vya bidhaa moja moja). Unaweza kuongeza bidhaa mpya, kubadilisha bei ya kununua na bei ya kuuzia, kuweka kiasi cha tahadhari (low stock alert), na kuhamisha bidhaa kati ya matawi.
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-700 font-bold">
                    <DollarSign className="w-4 h-4" />
                    <span>3. Kurekodi Matumizi (Expenses)</span>
                  </div>
                  <p className="text-slate-600">
                    Kwenye sehemu ya Matumizi, ingiza gharama za uendeshaji kama umeme, usafiri, chai/chakula, kodi, au ununuzi wa mifuko. Mfumo unayatoa moja kwa moja kwenye faida ya siku ili uone <strong>Faida Halisi (Net Profit)</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-rose-700 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>4. Kuangalia Faida (Tarehe/Mwezi/Mwaka)</span>
                  </div>
                  <p className="text-slate-600">
                    Kwenye <strong>&quot;Ripoti za Faida&quot;</strong>, unaweza kuchagua Tarehe Maalum (Leo, Jana au tarehe yoyote), Mwezi wowote, au Mwaka wowote. Mfumo utakupa hesabu kamili: Mauzo, Mtaji, Faida Ghafi, Matumizi, na Faida Halisi.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Cosmetics Shop POS System • Ready for Mobile & Localhost
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Funga (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
