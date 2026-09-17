/**
 * Robust IndexedDB Storage Engine for English Khmer Academy
 * Provides persistent database backing for user accounts, profile data,
 * member directory, and student learning progress to ensure data is never lost.
 */
import { UserAccount, AppMember, UserProgress } from '../types';

const DB_NAME = 'EnglishKhmerAcademy_DB';
const DB_VERSION = 1;

const STORE_ACCOUNTS = 'accounts';
const STORE_MEMBERS = 'members';
const STORE_PROGRESS = 'progress';

let dbInstance: IDBDatabase | null = null;

function getIndexedDB(): IDBFactory | null {
  if (typeof window === 'undefined') return null;
  return window.indexedDB || (window as unknown as { mozIndexedDB?: IDBFactory }).mozIndexedDB || (window as unknown as { webkitIndexedDB?: IDBFactory }).webkitIndexedDB;
}

export function openDatabase(): Promise<IDBDatabase | null> {
  const idb = getIndexedDB();
  if (!idb) return Promise.resolve(null);
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve) => {
    try {
      const request = idb.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_ACCOUNTS)) {
          const accountStore = db.createObjectStore(STORE_ACCOUNTS, { keyPath: 'id' });
          accountStore.createIndex('userIdentifier', 'userIdentifier', { unique: false });
          accountStore.createIndex('email', 'email', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_MEMBERS)) {
          const memberStore = db.createObjectStore(STORE_MEMBERS, { keyPath: 'id' });
          memberStore.createIndex('email', 'email', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
          db.createObjectStore(STORE_PROGRESS, { keyPath: 'identifier' });
        }
      };

      request.onsuccess = (event: Event) => {
        dbInstance = (event.target as IDBOpenDBRequest).result;
        resolve(dbInstance);
      };

      request.onerror = () => {
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * Mirror account to IndexedDB
 */
export async function idbSaveAccount(account: UserAccount): Promise<void> {
  try {
    const db = await openDatabase();
    if (!db) return;
    const tx = db.transaction(STORE_ACCOUNTS, 'readwrite');
    const store = tx.objectStore(STORE_ACCOUNTS);
    store.put(account);
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Mirror all accounts to IndexedDB
 */
export async function idbSaveAllAccounts(accounts: UserAccount[]): Promise<void> {
  try {
    const db = await openDatabase();
    if (!db) return;
    const tx = db.transaction(STORE_ACCOUNTS, 'readwrite');
    const store = tx.objectStore(STORE_ACCOUNTS);
    accounts.forEach((acc) => store.put(acc));
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Get all accounts from IndexedDB
 */
export async function idbGetAllAccounts(): Promise<UserAccount[]> {
  try {
    const db = await openDatabase();
    if (!db) return [];
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_ACCOUNTS, 'readonly');
      const store = tx.objectStore(STORE_ACCOUNTS);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as UserAccount[]) || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Mirror member to IndexedDB
 */
export async function idbSaveMember(member: AppMember): Promise<void> {
  try {
    const db = await openDatabase();
    if (!db) return;
    const tx = db.transaction(STORE_MEMBERS, 'readwrite');
    const store = tx.objectStore(STORE_MEMBERS);
    store.put(member);
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Mirror all members to IndexedDB
 */
export async function idbSaveAllMembers(members: AppMember[]): Promise<void> {
  try {
    const db = await openDatabase();
    if (!db) return;
    const tx = db.transaction(STORE_MEMBERS, 'readwrite');
    const store = tx.objectStore(STORE_MEMBERS);
    members.forEach((m) => store.put(m));
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Get all members from IndexedDB
 */
export async function idbGetAllMembers(): Promise<AppMember[]> {
  try {
    const db = await openDatabase();
    if (!db) return [];
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_MEMBERS, 'readonly');
      const store = tx.objectStore(STORE_MEMBERS);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as AppMember[]) || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Mirror user progress to IndexedDB
 */
export async function idbSaveProgress(identifier: string, progress: UserProgress): Promise<void> {
  try {
    const db = await openDatabase();
    if (!db) return;
    const tx = db.transaction(STORE_PROGRESS, 'readwrite');
    const store = tx.objectStore(STORE_PROGRESS);
    store.put({ identifier: identifier.trim().toLowerCase(), progress, updatedAt: new Date().toISOString() });
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Get progress from IndexedDB
 */
export async function idbGetProgress(identifier: string): Promise<UserProgress | null> {
  try {
    const db = await openDatabase();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PROGRESS, 'readonly');
      const store = tx.objectStore(STORE_PROGRESS);
      const req = store.get(identifier.trim().toLowerCase());
      req.onsuccess = () => {
        const res = req.result;
        resolve(res?.progress || null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}
