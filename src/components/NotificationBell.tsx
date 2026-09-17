import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Sparkles, Flame, Cloud, Award, HelpCircle, X, RefreshCw } from 'lucide-react';
import { UserProgress } from '../types';
import { broadcastCloudUpdate, subscribeToCloudUpdates } from '../utils/cloudSync';

interface NotificationBellProps {
  progress: UserProgress;
  className?: string;
  iconClassName?: string;
}

interface NotificationItem {
  id: string;
  titleEn: string;
  titleKh: string;
  descriptionKh: string;
  timeAgo: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  isUnread: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ progress, className, iconClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cloud Sync state inside Notification Bell
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasAdminNotification, setHasAdminNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Live');

  useEffect(() => {
    // Listen to real-time cloud updates
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

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications: NotificationItem[] = [
    {
      id: 'notif-sync',
      titleEn: 'Cloud Auto-Sync Active',
      titleKh: 'ប្រព័ន្ធ Cloud Auto-Sync កំពុងដំណើរការ',
      descriptionKh: 'ទិន្នន័យពិន្ទុ និងមេរៀនរបស់អ្នកត្រូវបានរក្សាទុកនៅលើ Cloud ដោយស្វ័យប្រវត្តិ។',
      timeAgo: isSyncing ? 'កំពុង Sync...' : lastSyncedTime,
      icon: Cloud,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      isUnread: !readIds.has('notif-sync'),
    },
    {
      id: 'notif-streak',
      titleEn: 'Daily Study Streak',
      titleKh: `${progress.streakDays || 1} ថ្ងៃបន្តបន្ទាប់ (Streak)!`,
      descriptionKh: 'អ្នកកំពុងរក្សាទម្លាប់សិក្សាបានយ៉ាងល្អប្រសើរ! បន្តរៀនថ្ងៃនេះដើម្បីទទួលបានពិន្ទុបន្ថែម។',
      timeAgo: 'ថ្ងៃនេះ',
      icon: Flame,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      isUnread: !readIds.has('notif-streak'),
    },
    {
      id: 'notif-level',
      titleEn: 'Learning Level Ready',
      titleKh: `កម្រិតបច្ចុប្បន្ន: ${progress.currentLevel.toUpperCase()}`,
      descriptionKh: 'មេរៀន និងកម្រងសំណួរថ្មីៗបានត្រៀមរួចជាស្រេចដើម្បីឱ្យអ្នកអនុវត្ត។',
      timeAgo: 'ថ្មីៗនេះ',
      icon: HelpCircle,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      isUnread: !readIds.has('notif-level'),
    },
    {
      id: 'notif-certificate',
      titleEn: 'Graduation Certificate',
      titleKh: 'វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា',
      descriptionKh: 'បញ្ចប់មេរៀន និងប្រឡងជាប់ដើម្បីទាញយកវិញ្ញាបនបត្រផ្លូវការ។',
      timeAgo: 'ព័ត៌មាន',
      icon: Award,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      isUnread: !readIds.has('notif-certificate'),
    },
  ];

  const currentUnread = notifications.filter((n) => n.isUnread).length;

  const handleMarkAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
    setUnreadCount(0);
  };

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && currentUnread > 0) {
      // Keep unread badges until marked or clicked
    }
  };

  return (
    <div className="relative" ref={dropdownRef} id="notification-bell-container">
      {/* Bell Trigger Button */}
      <button
        id="btn-notification-bell"
        type="button"
        onClick={handleToggleOpen}
        aria-label="Notifications"
        className={className || "relative w-9 h-9 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer shrink-0 border border-slate-200/80 bg-white shadow-2xs group flex items-center justify-center active:scale-95"}
        title="ការជូនដំណឹង (Notifications)"
      >
        <Bell className={iconClassName || "w-4.5 h-4.5 transition-transform group-hover:rotate-12 text-slate-700"} />

        {currentUnread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-4.5 sm:w-4.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 sm:h-4.5 sm:w-4.5 bg-red-600 text-[9px] sm:text-[10px] font-bold text-white items-center justify-center shadow-xs">
              {currentUnread}
            </span>
          </span>
        )}
      </button>

      {/* Floating Notifications Popover */}
      {isOpen && (
        <>
          {/* Mobile Backdrop to catch outside taps and prevent layout clutter */}
          <div 
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-2xs z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            id="notifications-popover-menu"
            className="fixed sm:absolute top-14 sm:top-full right-3 sm:right-0 left-auto mt-0 sm:mt-2 w-[calc(100vw-24px)] sm:w-80 max-w-[310px] sm:max-w-[340px] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[60vh] sm:max-h-[70vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span className="font-bold text-xs sm:text-sm">ការជូនដំណឹង (Notifications)</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {currentUnread > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[10px] sm:text-[11px] font-khmer text-indigo-200 hover:text-white flex items-center gap-1 cursor-pointer transition"
                  >
                    <CheckCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>សម្គាល់ថាបានអាន</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition"
                  aria-label="Close notifications"
                  title="បិទផ្ទាំងជូនដំណឹង"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Relocated Cloud Web-App System Status Bar */}
            <div className="px-3 py-2 sm:px-3 sm:py-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border-b border-slate-700/60 shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30 shrink-0">
                    <Cloud className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-white">Cloud Sync</span>
                      <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active</span>
                      </span>
                    </div>
                    <div className="text-[9px] text-slate-300 font-mono truncate">
                      Synced: {isSyncing ? 'Syncing...' : lastSyncedTime}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerSync}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-semibold transition cursor-pointer active:scale-95 shrink-0"
                  title="Force Sync Cloud (ធ្វើបច្ចុប្បន្នភាព)"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-indigo-400' : 'text-slate-200'}`} />
                  <span>{isSyncing ? 'Syncing' : 'Sync'}</span>
                </button>
              </div>
              {hasAdminNotification && (
                <div className="mt-1.5 p-1.5 rounded-lg bg-indigo-500/30 border border-indigo-400/40 text-[10px] text-indigo-200 flex items-center gap-1.5 font-khmer animate-in fade-in">
                  <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                  <span className="truncate">{notificationText}</span>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {notifications.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setReadIds((prev) => new Set([...prev, item.id]));
                    }}
                    className={`p-2.5 sm:p-3 flex items-start gap-2.5 transition cursor-pointer hover:bg-slate-50 ${
                      item.isUnread ? 'bg-indigo-50/30' : 'bg-white'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${item.iconBg} ${item.iconColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate font-khmer">
                          {item.titleKh}
                        </h4>
                        <span className="text-[9px] text-slate-400 shrink-0 font-khmer">
                          {item.timeAgo}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-khmer leading-relaxed mt-0.5 line-clamp-2">
                        {item.descriptionKh}
                      </p>
                    </div>
                    {item.isUnread && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="py-2 px-3 bg-slate-50 border-t border-slate-100 text-center shrink-0">
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-khmer">
                Angkor English Academy • Cloud Notifier
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
