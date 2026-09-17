import React, { useState, useEffect } from 'react';
import { Cloud, CheckCircle2, RefreshCw, Zap, Sparkles } from 'lucide-react';
import { broadcastCloudUpdate, subscribeToCloudUpdates } from '../utils/cloudSync';

interface CloudSyncBannerProps {
  onManualSync?: () => void;
  variant?: 'compact' | 'full';
  className?: string;
}

export const CloudSyncBanner: React.FC<CloudSyncBannerProps> = ({ 
  onManualSync,
  variant = 'compact',
  className = '',
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasAdminNotification, setHasAdminNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Live');

  useEffect(() => {
    // Listen to real-time cloud updates from Admin / other tabs
    const unsubscribe = subscribeToCloudUpdates((msg) => {
      setHasAdminNotification(true);
      if (msg.type === 'BRAND_UPDATE') {
        setNotificationText('Admin updated branding & logo! ✨');
      } else if (msg.type === 'FORCE_SYNC' || msg.type === 'SYNC_ALL') {
        setNotificationText('Admin synced system updates! 🚀');
      } else {
        setNotificationText('System update received! ✨');
      }

      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Reset glowing notification after 6 seconds
      const timer = setTimeout(() => {
        setHasAdminNotification(false);
      }, 6000);

      return () => clearTimeout(timer);
    });

    return () => unsubscribe();
  }, []);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    broadcastCloudUpdate('FORCE_SYNC');
    if (onManualSync) onManualSync();

    setTimeout(() => {
      setIsSyncing(false);
      setHasAdminNotification(true);
      setNotificationText('Cloud Synced 100% Up to Date! ✨');
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      setTimeout(() => {
        setHasAdminNotification(false);
      }, 5000);
    }, 600);
  };

  // Compact Top-Right Corner Indicator (Requirement 4)
  if (variant === 'compact') {
    return (
      <div 
        id="cloud-webapp-sync-bar"
        className={`inline-flex items-center gap-2 transition-all duration-300 shrink-0 ${className}`}
      >
        <button
          type="button"
          onClick={handleTriggerSync}
          disabled={isSyncing}
          title={hasAdminNotification ? notificationText : 'Cloud Web-App System: Auto-Update Active (ចុចដើម្បីធ្វើបច្ចុប្បន្នភាព)'}
          className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95 border ${
            hasAdminNotification
              ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md ring-2 ring-purple-400/50 animate-pulse border-purple-400'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs'
          }`}
        >
          {hasAdminNotification ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span className="font-bold text-white tracking-tight">
                {notificationText || 'Admin Synced! ✨'}
              </span>
            </>
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <Cloud className="w-3.5 h-3.5 text-indigo-600" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="font-medium text-slate-700 text-xs hidden sm:inline">
                Cloud Sync:
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60">
                {isSyncing ? 'Syncing...' : lastSyncedTime}
              </span>
              <RefreshCw className={`w-3 h-3 text-slate-400 hover:text-indigo-600 ml-0.5 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
            </>
          )}
        </button>
      </div>
    );
  }

  // Full-width variant (legacy/alternate)
  return (
    <div 
      id="cloud-webapp-sync-bar"
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white px-4 py-2.5 rounded-2xl border border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30 shrink-0">
          <Cloud className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-100 tracking-wide">
              Cloud Web-App System
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Auto-Update Active</span>
            </span>
          </div>
          <p className="font-khmer text-[11px] text-slate-400">
            បច្ចុប្បន្នភាពទាំងអស់ពី Admin ត្រូវបានអាប់ដេតស្វ័យប្រវត្តិតាម Cloud ដោយមិនតម្រូវឱ្យដំឡើងឡើងវិញឡើយ
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleTriggerSync}
          disabled={isSyncing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition cursor-pointer active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-400' : 'text-slate-300'}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
        </button>
      </div>
    </div>
  );
};
