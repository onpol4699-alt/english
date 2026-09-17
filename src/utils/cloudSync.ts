import { AppBrandConfig } from '../types';

const CLOUD_CHANNEL_NAME = 'angkor_english_cloud_sync_v2';
const LAST_CLOUD_UPDATE_KEY = 'angkor_english_last_cloud_sync';

export interface CloudSyncMessage {
  type: 'BRAND_UPDATE' | 'CURRICULUM_UPDATE' | 'FORCE_SYNC' | 'SYNC_PROGRESS' | 'SYNC_ALL' | 'ACCOUNT_REGISTERED';
  timestamp: string;
  payload?: any;
}

let broadcastChannel: BroadcastChannel | null = null;

export function getCloudBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
    return null;
  }
  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(CLOUD_CHANNEL_NAME);
    } catch {
      broadcastChannel = null;
    }
  }
  return broadcastChannel;
}

export function broadcastCloudUpdate(type: CloudSyncMessage['type'], payload?: any): void {
  const channel = getCloudBroadcastChannel();
  const timestamp = new Date().toISOString();
  const message: CloudSyncMessage = { type, timestamp, payload };

  if (channel) {
    try {
      channel.postMessage(message);
    } catch (e) {
      console.warn('Broadcast channel postMessage error:', e);
    }
  }

  // Also update localStorage timestamp for cross-tab or storage event listener fallback
  try {
    localStorage.setItem(LAST_CLOUD_UPDATE_KEY, JSON.stringify(message));
  } catch {
    // ignore
  }
}

export function subscribeToCloudUpdates(onUpdate: (msg: CloudSyncMessage) => void): () => void {
  const channel = getCloudBroadcastChannel();

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === LAST_CLOUD_UPDATE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue) as CloudSyncMessage;
        onUpdate(parsed);
      } catch {
        // ignore
      }
    }
  };

  const handleBroadcastMessage = (event: MessageEvent) => {
    if (event.data) {
      onUpdate(event.data);
    }
  };

  if (channel) {
    channel.addEventListener('message', handleBroadcastMessage);
  }
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleBroadcastMessage);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
}

// Aliases for convenience
export const onCloudSyncEvent = subscribeToCloudUpdates;
export const broadcastSyncEvent = broadcastCloudUpdate;

