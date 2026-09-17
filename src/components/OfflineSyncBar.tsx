import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  CloudOff,
  CloudUpload,
  Smartphone,
  Download,
} from 'lucide-react';

interface OfflineSyncBarProps {
  onOpenDownloadModal: () => void;
}

export const OfflineSyncBar: React.FC<OfflineSyncBarProps> = ({ onOpenDownloadModal }) => {
  const [isOnline, setIsOnline] = useState<boolean>(apiService.isConnectedToDatabase());
  const [pendingCount, setPendingCount] = useState<number>(apiService.getPendingSyncCount());
  const [isSyncing, setIsSyncing] = useState<boolean>(apiService.isCurrentlySyncing());
  const [lastSync, setLastSync] = useState<string | null>(apiService.getLastSyncTime());
  const [syncFeedback, setSyncFeedback] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const unsubConn = apiService.subscribeConnection((online) => {
      setIsOnline(online);
    });

    const unsubSync = apiService.subscribeSync((count) => {
      setPendingCount(count);
      setIsSyncing(apiService.isCurrentlySyncing());
      setLastSync(apiService.getLastSyncTime());
    });

    return () => {
      unsubConn();
      unsubSync();
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await apiService.syncPendingQueue(true);
      setSyncFeedback({
        show: true,
        success: res.success,
        message: res.message,
      });
      setTimeout(() => {
        setSyncFeedback(null);
      }, 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncFeedback({
        show: true,
        success: false,
        message: msg,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = (iso: string | null) => {
    if (!iso) return 'Bado haijasawazishwa';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="bg-slate-900 text-white px-3 sm:px-6 py-2 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 transition-all">
      {/* Left: Connection and Offline indicator */}
      <div className="flex items-center space-x-2.5 flex-wrap">
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] ${
            isOnline
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}
        >
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mtandaoni (Database Imeunganishwa)</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Nje ya Mtandao (Offline POS Inafanya Kazi)</span>
            </>
          )}
        </div>

        {/* Pending Offline Items Badge */}
        {pendingCount > 0 ? (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-[11px] animate-pulse">
            <CloudUpload className="w-3.5 h-3.5" />
            <span>
              {pendingCount} {pendingCount === 1 ? 'Taarifa inasubiri' : 'Taarifa zinasubiri'} kutumwa kwenye MySQL
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 hidden md:inline-flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Data yote imehifadhiwa salama</span>
          </span>
        )}

        {lastSync && (
          <span className="text-[10px] text-slate-400 hidden xl:inline">
            Sawazisho la mwisho: {formatLastSync(lastSync)}
          </span>
        )}
      </div>

      {/* Right: Actions (Sync Now + Direct Download Button) */}
      <div className="flex items-center space-x-2">
        {/* Sync Button */}
        <button
          onClick={handleManualSync}
          disabled={isSyncing || pendingCount === 0}
          className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1.5 transition-all ${
            pendingCount > 0
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 disabled:opacity-50'
          }`}
          title="Tuma mauzo na matumizi yote yaliyorekodiwa offline kwenye database ya MySQL"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-white' : ''}`} />
          <span>{isSyncing ? 'Inatuma...' : pendingCount > 0 ? `Sawazisha Sasa (${pendingCount})` : 'Sawazisha Data'}</span>
        </button>

        {/* Direct Install & Download Button (No 3 dots!) */}
        <button
          onClick={onOpenDownloadModal}
          className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-[11px] font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
          title="Pakua na Sakinisha App bila kwenda kwenye doto tatu za kivinjari"
        >
          <Download className="w-3 h-3" />
          <span>Sakinisha / Pakua App</span>
        </button>
      </div>

      {/* Sync Feedback Alert */}
      {syncFeedback && syncFeedback.show && (
        <div
          className={`w-full mt-1 p-2 rounded-lg text-xs flex items-center justify-between transition-all ${
            syncFeedback.success
              ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-200'
              : 'bg-amber-950/80 border border-amber-600 text-amber-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {syncFeedback.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            )}
            <span>{syncFeedback.message}</span>
          </div>
          <button
            onClick={() => setSyncFeedback(null)}
            className="text-slate-400 hover:text-white text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
