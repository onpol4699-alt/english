import { CloudSyncMessage, subscribeToCloudUpdates, broadcastCloudUpdate } from './cloudSync';

export interface AppNotification {
  id: string;
  type: 'admin_update' | 'system' | 'streak' | 'achievement' | 'cloud_sync';
  titleEn: string;
  titleKh: string;
  descriptionKh: string;
  timestamp: string; // ISO string
  timeLabelKh?: string;
  isUnread: boolean;
  actionType?: 'sync_app' | 'view_announcement' | 'open_link';
  actionLabelKh?: string;
  badgeTag?: string;
  version?: string;
}

const NOTIFICATIONS_STORAGE_KEY = 'angkor_english_notifications_v3';
const NOTIFICATIONS_UPDATE_EVENT = 'angkor-notifications-updated';

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-admin-v24',
    type: 'admin_update',
    titleEn: 'Admin System Update: Version 2.4.0 Active',
    titleKh: '🔄 កំណែអាប់ដេតប្រព័ន្ធ Version 2.4.0 (Latest Release)',
    descriptionKh: 'ប្រព័ន្ធ Cloud Auto-Sync និង Dynamic Profile Picture ត្រូវបានដាក់ឱ្យដំណើរការ។ គ្រប់ទិន្នន័យត្រូវបានធ្វើសមកាលកម្មដោយស្វ័យប្រវត្តិ។',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    timeLabelKh: '៥ នាទីមុន',
    isUnread: true,
    actionType: 'sync_app',
    actionLabelKh: '🔄 ធ្វើបច្ចុប្បន្នភាពកម្មវិធី',
    badgeTag: '📢 ការជូនដំណឹងថ្មី',
    version: '2.4.0',
  },
  {
    id: 'notif-admin-cloud',
    type: 'admin_update',
    titleEn: 'Cloud Auto-Sync Active',
    titleKh: '☁️ ប្រព័ន្ធ Cloud Auto-Sync ដំណើរការលើគណនីរបស់អ្នក',
    descriptionKh: 'ការកែប្រែស្លាកសញ្ញា ព័ត៌មាន និងមេរៀនពី Admin នឹងធ្វើបច្ចុប្បន្នភាពភ្លាមៗដោយមិនបាច់ដំឡើងឡើងវិញ។',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    timeLabelKh: '៣០ នាទីមុន',
    isUnread: true,
    actionType: 'sync_app',
    actionLabelKh: '🔄 ពិនិត្យការធ្វើបច្ចុប្បន្នភាព',
    badgeTag: '⚡ Cloud Sync',
  },
  {
    id: 'notif-study-streak',
    type: 'streak',
    titleEn: 'Daily Study Habit',
    titleKh: '🔥 រក្សាទម្លាប់សិក្សាប្រចាំថ្ងៃ (Daily Habit)',
    descriptionKh: 'បន្តសិក្សា និងអនុវត្តលំហាត់កម្រងសំណួរដើម្បីបង្កើនកម្រិត XP របស់អ្នក!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    timeLabelKh: '២ ម៉ោងមុន',
    isUnread: false,
    badgeTag: '🎯 សិក្សា',
  },
  {
    id: 'notif-cert-ready',
    type: 'achievement',
    titleEn: 'Official Graduation Certificate',
    titleKh: '🎓 វិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការ',
    descriptionKh: 'បញ្ចប់មេរៀនគ្រប់កម្រិត និងប្រឡងជាប់ដើម្បីទាញយកវិញ្ញាបនបត្រមានហត្ថលេខា និងត្រាស្របច្បាប់។',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    timeLabelKh: 'ម្សិលមិញ',
    isUnread: false,
    badgeTag: '📜 វិញ្ញាបនបត្រ',
  },
];

/**
 * Load notifications from localStorage or fallback to defaults
 */
export function loadNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_NOTIFICATIONS;
  } catch (err) {
    console.error('Error loading notifications:', err);
    return DEFAULT_NOTIFICATIONS;
  }
}

/**
 * Save notifications list to localStorage and dispatch custom event
 */
export function saveNotifications(notifications: AppNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATE_EVENT, { detail: notifications }));
  } catch (err) {
    console.error('Error saving notifications:', err);
  }
}

/**
 * Add a new notification (e.g. from real-time admin push or cloud sync)
 */
export function addAdminNotification(
  data: {
    titleKh: string;
    titleEn?: string;
    descriptionKh: string;
    actionLabelKh?: string;
    badgeTag?: string;
    actionType?: 'sync_app' | 'view_announcement' | 'open_link';
    version?: string;
  }
): AppNotification {
  const current = loadNotifications();
  const newNotif: AppNotification = {
    id: `notif-admin-${Date.now()}`,
    type: 'admin_update',
    titleEn: data.titleEn || 'Admin System Announcement',
    titleKh: data.titleKh,
    descriptionKh: data.descriptionKh,
    timestamp: new Date().toISOString(),
    timeLabelKh: 'ទើបតែឥឡូវនេះ',
    isUnread: true,
    actionType: data.actionType || 'sync_app',
    actionLabelKh: data.actionLabelKh || '🔄 ធ្វើបច្ចុប្បន្នភាពកម្មវិធី',
    badgeTag: data.badgeTag || '📢 ការជូនដំណឹងថ្មី',
    version: data.version,
  };

  const updated = [newNotif, ...current];
  saveNotifications(updated);
  return newNotif;
}

/**
 * Mark a single notification as read
 */
export function markNotificationAsRead(id: string): void {
  const current = loadNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, isUnread: false } : n));
  saveNotifications(updated);
}

/**
 * Mark all notifications as read
 */
export function markAllNotificationsAsRead(): void {
  const current = loadNotifications();
  const updated = current.map((n) => ({ ...n, isUnread: false }));
  saveNotifications(updated);
}

/**
 * Count unread notifications
 */
export function getUnreadCount(): number {
  const current = loadNotifications();
  return current.filter((n) => n.isUnread).length;
}

/**
 * Listen for notification updates (cross-component or cross-tab)
 */
export function subscribeToNotificationUpdates(callback: (notifications: AppNotification[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<AppNotification[]>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(loadNotifications());
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === NOTIFICATIONS_STORAGE_KEY) {
      callback(loadNotifications());
    }
  };

  window.addEventListener(NOTIFICATIONS_UPDATE_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(NOTIFICATIONS_UPDATE_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorage);
  };
}
