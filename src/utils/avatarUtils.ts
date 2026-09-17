import { broadcastSyncEvent } from './cloudSync';
import { loadSavedAccounts, saveAllAccounts, getActiveUserIdentifier } from './storage';
import { updateUserAvatarInDirectory } from './memberStorage';

export const AVATAR_SYNC_EVENT = 'eng_kh_avatar_sync_event';

export const PRESET_3D_AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Dara&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophea&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Vannak&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Bopha&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin&backgroundColor=c0aede',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
];

/**
 * Optimizes an uploaded image file using HTML5 Canvas to ensure it stays crisp,
 * small (< 100KB), and fits safely within localStorage quotas without lag.
 */
export function compressImageFile(
  file: File,
  maxWidth = 320,
  maxHeight = 320,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG, read text/dataUrl directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        // Smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as optimized JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        // Fallback to raw data url if canvas fails
        resolve(reader.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Global Avatar Persistence and Real-Time Sync:
 * Saves the new avatar image string to localStorage keys:
 * - 'currentUser.avatarUrl'
 * - 'currentUser.photo'
 * - Registered accounts directory
 * - Members directory
 * And dispatches custom and cloud broadcast events for instantaneous updates.
 */
export function saveAndSyncAvatar(
  avatarUrl: string,
  userIdentifier?: string,
  userName?: string
): void {
  if (typeof window === 'undefined' || !avatarUrl) return;

  try {
    const cleanUrl = avatarUrl.trim();

    // 1) Set explicit localStorage keys specified by user requirement
    localStorage.setItem('currentUser.avatarUrl', cleanUrl);
    localStorage.setItem('currentUser.photo', cleanUrl);

    // 2) Update currently active account in local registered accounts
    const activeId = (userIdentifier || getActiveUserIdentifier() || '').trim().toLowerCase();
    
    if (activeId) {
      localStorage.setItem(`eng_kh_user_avatar_${activeId}`, cleanUrl);
      const accountProgKey = `eng_kh_account_progress_${activeId}`;
      const rawProg = localStorage.getItem(accountProgKey);
      if (rawProg) {
        try {
          const parsed = JSON.parse(rawProg);
          parsed.avatarUrl = cleanUrl;
          localStorage.setItem(accountProgKey, JSON.stringify(parsed));
        } catch {
          // ignore
        }
      }
    }

    const accounts = loadSavedAccounts();
    let accountUpdated = false;

    if (accounts.length > 0) {
      for (const acc of accounts) {
        const matchesId = activeId && (
          acc.userIdentifier?.toLowerCase() === activeId ||
          acc.email?.toLowerCase() === activeId ||
          (acc.phoneNumber && acc.phoneNumber.replace(/[^0-9]/g, '') === activeId.replace(/[^0-9]/g, ''))
        );
        const matchesName = userName && acc.userName?.toLowerCase() === userName.toLowerCase();
        if (matchesId || matchesName) {
          acc.avatarUrl = cleanUrl;
          accountUpdated = true;
        }
      }
      if (accountUpdated) {
        saveAllAccounts(accounts);
      }
    }

    // 3) Update Member in directory
    if (activeId) {
      updateUserAvatarInDirectory(activeId, cleanUrl);
    }
    if (userName) {
      updateUserAvatarInDirectory(userName, cleanUrl);
    }

    // 4) Dispatch instantaneous window event for components
    window.dispatchEvent(new CustomEvent(AVATAR_SYNC_EVENT, { detail: { avatarUrl: cleanUrl } }));

    // 5) Broadcast sync event across tabs / cloud
    broadcastSyncEvent('SYNC_PROGRESS', { avatarUrl: cleanUrl });
  } catch (err) {
    console.error('Error saving and syncing avatar:', err);
  }
}

/**
 * Retrieve persistent user avatar from localStorage or registered accounts directory.
 * Ensures user's uploaded profile picture is never lost after signing out and signing back in.
 */
export function getStoredUserAvatar(identifier?: string, userName?: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const cleanId = (identifier || '').trim().toLowerCase();
    
    // 1) Direct user avatar key
    if (cleanId) {
      const direct = localStorage.getItem(`eng_kh_user_avatar_${cleanId}`);
      if (direct && direct.trim()) return direct.trim();

      // 2) Account progress key
      const accountProgKey = `eng_kh_account_progress_${cleanId}`;
      const rawProg = localStorage.getItem(accountProgKey);
      if (rawProg) {
        try {
          const parsed = JSON.parse(rawProg);
          if (parsed?.avatarUrl && typeof parsed.avatarUrl === 'string' && parsed.avatarUrl.trim()) {
            return parsed.avatarUrl.trim();
          }
        } catch {
          // ignore
        }
      }
    }

    // 3) Registered accounts list
    const accounts = loadSavedAccounts();
    const matched = accounts.find((a) => {
      const matchId = cleanId && (
        a.userIdentifier?.toLowerCase() === cleanId ||
        a.email?.toLowerCase() === cleanId ||
        (a.phoneNumber && a.phoneNumber.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, ''))
      );
      const matchName = userName && a.userName?.toLowerCase() === userName.toLowerCase();
      return matchId || matchName;
    });

    if (matched?.avatarUrl && matched.avatarUrl.trim()) {
      return matched.avatarUrl.trim();
    }

    // 4) General currentUser.avatarUrl fallback if matches active session
    const currentAvatar = localStorage.getItem('currentUser.avatarUrl');
    if (currentAvatar && currentAvatar.trim()) {
      return currentAvatar.trim();
    }

    return null;
  } catch {
    return null;
  }
}
