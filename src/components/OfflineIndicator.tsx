import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../utils/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900/90 backdrop-blur-xs px-3.5 py-2 text-xs font-medium text-white shadow-xl border border-slate-700">
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span className="font-khmer">កំពុងដំណើរការ Offline — ទិន្នន័យមេរៀនត្រូវបានរក្សាទុកស្រាប់</span>
    </div>
  );
};
