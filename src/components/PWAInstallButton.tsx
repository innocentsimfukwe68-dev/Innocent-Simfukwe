import React, { useState } from 'react';
import { Download, Smartphone, Monitor, X, Share } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';
import { useLanguage } from '../i18n';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { t } = useLanguage();

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    if (isIOS) {
      setShowIOSGuide(true);
    } else {
      install();
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title={t.installAppDesc}
        className={
          compact
            ? 'px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all'
            : 'px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs font-semibold flex items-center space-x-2 shadow-sm transition-all'
        }
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span>{compact ? t.installApp : t.installOnPhoneOrPc}</span>
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900">
                <Smartphone className="w-5 h-5 text-pink-600" />
                <h3 className="font-bold text-sm">Weka Kwenye iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start space-x-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                  1
                </span>
                <p>
                  Bofya kitufe cha <strong>Share <Share className="w-3.5 h-3.5 inline mx-1 text-blue-600" /></strong> kilichopo chini ya skrini kwenye kivinjari cha Safari.
                </p>
              </div>

              <div className="flex items-start space-x-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                  2
                </span>
                <p>
                  Sogeza chini kisha bofya <strong>"Add to Home Screen" (Weka kwenye Skrini Kuu)</strong>.
                </p>
              </div>

              <div className="flex items-start space-x-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                  3
                </span>
                <p>
                  Mfumo utatokea kama <strong>App halisi</strong> kwenye simu yako yenye nembo ya duka la vipodozi!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Nimeelewa (Close)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
