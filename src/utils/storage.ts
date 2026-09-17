import { UserProgress, DifficultyLevel, UserAccount, AuthMethod, BackgroundTheme, UserRole } from '../types';
import { isMasterAdmin, isDeveloperRole, isDeveloperIdentifier, DEVELOPER_CREDENTIALS, loadMembers, saveMembers, registerUserAsMember, syncMemberProgress } from './memberStorage';
import { broadcastSyncEvent } from './cloudSync';
import { idbSaveAccount, idbSaveAllAccounts, idbSaveProgress } from './indexedDbStorage';

const SESSION_STORAGE_KEY = 'eng_kh_session_user_v2';
const LEGACY_STORAGE_KEY = 'eng_kh_learn_progress_v1';
const ACCOUNTS_STORAGE_KEY = 'eng_kh_registered_accounts_v2';
const ACCOUNTS_BACKUP_STORAGE_KEY = 'eng_kh_accounts_backup_registry';
const ACTIVE_USER_ID_KEY = 'eng_kh_active_user_identifier';

export const DEFAULT_PROGRESS: UserProgress = {
  userName: '',
  authMethod: 'gmail',
  userIdentifier: '',
  isAuthenticated: false,
  avatarUrl: '',
  gender: 'unspecified',
  learningGoal: 'conversation',
  dailyGoalMinutes: 15,
  hasCompletedOnboarding: false,
  currentLevel: 'beginner',
  unlockedLevels: ['beginner'],
  xp: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalStudySeconds: 0,
  completedLessonIds: [],
  masteredVocabIds: [],
  savedVocabIds: [],
  quizHistory: [],
  speechRate: 0.9,
  khmerFont: 'battambang',
  themeColor: 'emerald',
  themeBrightness: 'light',
  backgroundTheme: 'light',
  khmerFontSize: 'normal',
  appLanguage: 'km',
  failedQuizAttempts: 0,
  quizLockedUntil: undefined,
};

// Seed default verified credentials
function ensureSeedAccounts(): void {
  if (typeof window === 'undefined') return;
  try {
    let raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(ACCOUNTS_BACKUP_STORAGE_KEY);
    }
    let accounts: UserAccount[] = raw ? JSON.parse(raw) : [];

    const initialSeeds: UserAccount[] = [
      {
        id: 'acc-admin-owner',
        userName: 'Phon Phai',
        authMethod: 'gmail',
        userIdentifier: 'phonphaihdvk@gmail.com',
        email: 'phonphaihdvk@gmail.com',
        phoneNumber: '012889900',
        passcode: '123456',
        role: 'Developer',
        qrToken: 'qr_master_admin_phonphai',
        avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin&backgroundColor=c0aede',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'acc-admin-alias',
        userName: 'Admin',
        authMethod: 'gmail',
        userIdentifier: 'admin@gmail.com',
        email: 'admin@gmail.com',
        passcode: '123456',
        role: 'Admin',
        qrToken: 'qr_admin_super_1001',
        avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Master&backgroundColor=ffd5dc',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'acc-gmail-demo',
        userName: 'Dara (Gmail)',
        authMethod: 'gmail',
        userIdentifier: 'khdily52@gmail.com',
        email: 'khdily52@gmail.com',
        passcode: '123456',
        role: 'Student',
        qrToken: 'qr_dara_demo_1042',
        avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dara&backgroundColor=c0aede',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'acc-phone-demo',
        userName: 'Bopha (Phone)',
        authMethod: 'phone',
        userIdentifier: '012888999',
        phoneNumber: '012888999',
        passcode: '123456',
        role: 'Student',
        qrToken: 'qr_bopha_demo_2088',
        avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophea&backgroundColor=ffd5dc',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'acc-teach-demo',
        userName: 'Vannak Heng',
        authMethod: 'gmail',
        userIdentifier: 'vannak.teacher@gmail.com',
        email: 'vannak.teacher@gmail.com',
        passcode: '123456',
        role: 'Teacher',
        qrToken: 'qr_teacher_vannak_5011',
        avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vannak&backgroundColor=b6e3f4',
        createdAt: new Date().toISOString(),
      },
    ];

    if (!Array.isArray(accounts) || accounts.length === 0) {
      accounts = initialSeeds;
    } else {
      // Guarantee Owner/Developer account is ALWAYS present without altering existing accounts
      const hasOwner = accounts.some(a => 
        a.userIdentifier.toLowerCase() === 'phonphaihdvk@gmail.com' || 
        a.email?.toLowerCase() === 'phonphaihdvk@gmail.com'
      );
      if (!hasOwner) {
        accounts.unshift(initialSeeds[0]);
      }
    }

    const serialized = JSON.stringify(accounts);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, serialized);
    localStorage.setItem(ACCOUNTS_BACKUP_STORAGE_KEY, serialized);
    idbSaveAllAccounts(accounts);
  } catch {
    // ignore
  }
}

export function getActiveUserIdentifier(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_USER_ID_KEY);
}

export function setActiveUserIdentifier(identifier: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_USER_ID_KEY, identifier.trim().toLowerCase());
}

export function loadAccountProgress(identifier: string): UserProgress {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
  try {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhoneDigits = cleanId.replace(/[^0-9]/g, '');
    const key = `eng_kh_account_progress_${cleanId}`;
    const raw = localStorage.getItem(key);
    let loaded: UserProgress = raw ? JSON.parse(raw) : { ...DEFAULT_PROGRESS };

    // Self-healing: if progress is uninitialized or missing onboarding, inspect registered accounts
    if (!raw || !loaded.hasCompletedOnboarding || !loaded.userName) {
      const accounts = loadSavedAccounts();
      const acc = accounts.find(a => 
        a.id === identifier ||
        a.userIdentifier.trim().toLowerCase() === cleanId || 
        (a.email && a.email.trim().toLowerCase() === cleanId) ||
        (cleanPhoneDigits.length >= 8 && a.phoneNumber && a.phoneNumber.replace(/[^0-9]/g, '') === cleanPhoneDigits)
      );

      if (acc) {
        // Attempt secondary keys tied to this account
        const altKeys = [
          `eng_kh_account_progress_${acc.id}`,
          `eng_kh_account_progress_${acc.userIdentifier.trim().toLowerCase()}`,
          acc.email ? `eng_kh_account_progress_${acc.email.trim().toLowerCase()}` : '',
          acc.phoneNumber ? `eng_kh_account_progress_${acc.phoneNumber.replace(/[^0-9]/g, '')}` : '',
        ].filter(Boolean);

        for (const altKey of altKeys) {
          const altRaw = localStorage.getItem(altKey);
          if (altRaw) {
            try {
              const altLoaded = JSON.parse(altRaw);
              if (altLoaded && altLoaded.hasCompletedOnboarding) {
                loaded = altLoaded;
                break;
              }
            } catch {
              // ignore
            }
          }
        }

        // If still not restored, reconstruct rich progress directly from account record
        if (!loaded.hasCompletedOnboarding || !loaded.userName) {
          loaded = {
            ...DEFAULT_PROGRESS,
            userName: acc.userName || 'Student',
            email: acc.email,
            phoneNumber: acc.phoneNumber,
            role: acc.role || 'Student',
            authMethod: acc.authMethod || (acc.email ? 'gmail' : 'phone'),
            userIdentifier: acc.userIdentifier || identifier,
            gender: acc.gender || 'unspecified',
            country: acc.country || 'កម្ពុជា (Cambodia)',
            province: acc.province || 'រាជធានីភ្នំពេញ (Phnom Penh)',
            dateOfBirth: acc.dateOfBirth,
            avatarUrl: acc.avatarUrl,
            learningGoal: acc.learningGoal || 'conversation',
            dailyGoalMinutes: acc.dailyGoalMinutes || 15,
            currentLevel: acc.level || 'beginner',
            unlockedLevels: acc.level === 'intermediate' ? ['beginner', 'intermediate'] : acc.level === 'advanced' ? ['beginner', 'intermediate', 'advanced'] : ['beginner'],
            xp: acc.xp !== undefined ? acc.xp : 0,
            totalStudySeconds: acc.totalStudySeconds !== undefined ? acc.totalStudySeconds : 0,
            completedLessonIds: acc.completedLessonIds || [],
            masteredVocabIds: acc.masteredVocabIds || [],
            hasCompletedOnboarding: true,
            isAuthenticated: true,
          };
          localStorage.setItem(key, JSON.stringify(loaded));
        }
      } else {
        // Fallback: Check Member Directory
        const members = loadMembers();
        const member = members.find(m => 
          m.id === identifier ||
          m.email.toLowerCase() === cleanId ||
          (cleanPhoneDigits.length >= 8 && m.phone && m.phone.replace(/[^0-9]/g, '') === cleanPhoneDigits) ||
          m.fullName.toLowerCase() === cleanId
        );

        if (member) {
          loaded = {
            ...DEFAULT_PROGRESS,
            userName: member.fullName,
            email: member.email,
            phoneNumber: member.phone !== 'N/A' ? member.phone : undefined,
            role: member.role || 'Student',
            userIdentifier: identifier,
            avatarUrl: member.avatarUrl,
            currentLevel: member.level || 'beginner',
            unlockedLevels: member.level === 'intermediate' ? ['beginner', 'intermediate'] : member.level === 'advanced' ? ['beginner', 'intermediate', 'advanced'] : ['beginner'],
            xp: member.xp || 0,
            totalStudySeconds: member.totalStudySeconds || 0,
            gender: member.gender || 'unspecified',
            country: member.country,
            province: member.province,
            dateOfBirth: member.dateOfBirth,
            learningGoal: member.learningGoal || 'conversation',
            dailyGoalMinutes: member.dailyGoalMinutes || 15,
            hasCompletedOnboarding: true,
            isAuthenticated: true,
          };
          localStorage.setItem(key, JSON.stringify(loaded));
        }
      }
    }

    // Strict Developer & Admin role resolution
    const isDev = isDeveloperRole(identifier, loaded.userName, loaded.role);
    const isAdmin = isMasterAdmin(identifier, loaded.userName);
    if (isDev) {
      loaded.role = 'Developer';
    } else if (isAdmin) {
      loaded.role = 'Admin';
    } else if (!loaded.role) {
      const members = loadMembers();
      const found = members.find(m => m.email.toLowerCase() === identifier.toLowerCase());
      loaded.role = found ? found.role : 'Student';
    }

    // Retain custom uploaded avatar from persistent keys
    const customAvatar = localStorage.getItem(`eng_kh_user_avatar_${cleanId}`);
    if (customAvatar && (!loaded.avatarUrl || loaded.avatarUrl.includes('dicebear'))) {
      loaded.avatarUrl = customAvatar;
    } else if (!loaded.avatarUrl) {
      const accounts = loadSavedAccounts();
      const acc = accounts.find(a => 
        a.userIdentifier.trim().toLowerCase() === cleanId || 
        (a.email && a.email.trim().toLowerCase() === cleanId)
      );
      if (acc?.avatarUrl) {
        loaded.avatarUrl = acc.avatarUrl;
      }
    }

    const preferredFont = localStorage.getItem('aea_preferred_font') as any;

    return {
      ...DEFAULT_PROGRESS,
      ...loaded,
      khmerFont: (loaded.khmerFont && loaded.khmerFont !== 'system' ? loaded.khmerFont : null) || (preferredFont && preferredFont !== 'system' ? preferredFont : null) || 'battambang',
      isAuthenticated: true,
      userIdentifier: identifier,
    };
  } catch (err) {
    console.error('Error loading account progress:', err);
  }
  return {
    ...DEFAULT_PROGRESS,
    userIdentifier: identifier,
    isAuthenticated: true,
    role: isMasterAdmin(identifier) ? 'Admin' : 'Student',
  };
}

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
  ensureSeedAccounts();

  try {
    if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    const activeId = getActiveUserIdentifier();
    const savedLang = (typeof window !== 'undefined' ? localStorage.getItem('eng_kh_app_language') : null) as ('km' | 'en') | null;

    if (!activeId) {
      // Unauthenticated user - strictly enforce login, while preserving selected language
      return { 
        ...DEFAULT_PROGRESS, 
        appLanguage: savedLang || 'km',
        isAuthenticated: false, 
        hasCompletedOnboarding: false 
      };
    }

    // Check session first
    const rawSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
    const savedRole = localStorage.getItem('eng_kh_selected_role') as UserRole | null;
    const savedViewRole = localStorage.getItem('eng_kh_active_view_role') as UserRole | null;

    if (rawSession) {
      const parsed = JSON.parse(rawSession);
      if (parsed.isAuthenticated && parsed.userIdentifier) {
        // Enforce Master Admin role default if none selected
        if (!savedRole && !savedViewRole && isMasterAdmin(parsed.userIdentifier, parsed.userName)) {
          parsed.role = 'Admin';
        }
        if (savedRole) {
          parsed.role = savedRole;
        }
        if (savedViewRole) {
          parsed.activeViewRole = savedViewRole;
        }
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          appLanguage: savedLang || parsed.appLanguage || 'km',
          isAuthenticated: true,
          unlockedLevels: parsed.unlockedLevels || ['beginner'],
          totalStudySeconds: parsed.totalStudySeconds || 0,
          backgroundTheme: parsed.backgroundTheme || 'light',
        };
      }
    }

    // Otherwise load from account storage
    const accProgress = loadAccountProgress(activeId);
    if (savedLang) {
      accProgress.appLanguage = savedLang;
    }
    if (savedRole) {
      accProgress.role = savedRole;
    }
    if (savedViewRole) {
      accProgress.activeViewRole = savedViewRole;
    }
    return accProgress;
  } catch (err) {
    console.error('Error loading session progress:', err);
    return { ...DEFAULT_PROGRESS, isAuthenticated: false, hasCompletedOnboarding: false };
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    if (progress.khmerFont) {
      localStorage.setItem('aea_preferred_font', progress.khmerFont);
    }

    // Always persist selected role to local storage so role switching works immediately in all states
    if (progress.role) {
      localStorage.setItem('eng_kh_selected_role', progress.role);
    }
    if (progress.activeViewRole) {
      localStorage.setItem('eng_kh_active_view_role', progress.activeViewRole);
    }

    // Always persist user language choice immediately
    if (progress.appLanguage) {
      localStorage.setItem('eng_kh_app_language', progress.appLanguage);
    }

    // If unauthenticated or no user identifier, do not persist session
    if (!progress.isAuthenticated || !progress.userIdentifier) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_USER_ID_KEY);
      return;
    }

    // Save in sessionStorage for authenticated users
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(progress));

    // Also persist permanently tied to account if user is identified
    const cleanId = progress.userIdentifier.trim().toLowerCase();
    const cleanDigits = cleanId.replace(/[^0-9]/g, '');
    const accountKey = `eng_kh_account_progress_${cleanId}`;
    const progressJson = JSON.stringify(progress);

    localStorage.setItem(accountKey, progressJson);
    setActiveUserIdentifier(cleanId);

    // Persist under alias keys (email and phone number) so lookups never fail
    if (progress.email) {
      const emailKey = `eng_kh_account_progress_${progress.email.trim().toLowerCase()}`;
      localStorage.setItem(emailKey, progressJson);
    }
    if (progress.phoneNumber) {
      const phoneDigits = progress.phoneNumber.replace(/[^0-9]/g, '');
      if (phoneDigits) {
        const phoneKey = `eng_kh_account_progress_${phoneDigits}`;
        localStorage.setItem(phoneKey, progressJson);
      }
    }

    // Asynchronous IndexedDB mirror
    idbSaveProgress(cleanId, progress);

    // Retain custom avatar in persistent storage
    if (progress.avatarUrl) {
      localStorage.setItem(`eng_kh_user_avatar_${cleanId}`, progress.avatarUrl);
      localStorage.setItem('currentUser.avatarUrl', progress.avatarUrl);
    }

    // Update matching account in Accounts Database
    try {
      const accounts = loadSavedAccounts();
      let changed = false;
      for (const acc of accounts) {
        const matchesId = acc.userIdentifier?.toLowerCase() === cleanId || 
          acc.email?.toLowerCase() === cleanId ||
          (cleanDigits.length >= 8 && acc.phoneNumber && acc.phoneNumber.replace(/[^0-9]/g, '') === cleanDigits);
        const matchesName = progress.userName && acc.userName?.toLowerCase() === progress.userName.toLowerCase();

        if (matchesId || matchesName) {
          acc.xp = progress.xp !== undefined ? progress.xp : acc.xp;
          acc.totalStudySeconds = progress.totalStudySeconds !== undefined ? progress.totalStudySeconds : acc.totalStudySeconds;
          acc.level = progress.currentLevel || acc.level;
          acc.completedLessonIds = progress.completedLessonIds || acc.completedLessonIds;
          acc.masteredVocabIds = progress.masteredVocabIds || acc.masteredVocabIds;
          acc.lastActiveDate = progress.lastActiveDate || new Date().toISOString().split('T')[0];
          if (progress.avatarUrl) acc.avatarUrl = progress.avatarUrl;
          if (progress.userName) acc.userName = progress.userName;
          if (progress.gender) acc.gender = progress.gender;
          if (progress.country) acc.country = progress.country;
          if (progress.province) acc.province = progress.province;
          if (progress.dateOfBirth) acc.dateOfBirth = progress.dateOfBirth;
          if (progress.learningGoal) acc.learningGoal = progress.learningGoal;
          if (progress.dailyGoalMinutes) acc.dailyGoalMinutes = progress.dailyGoalMinutes;
          changed = true;
        }
      }
      if (changed) {
        saveAllAccounts(accounts);
      }
    } catch (accErr) {
      console.error('Error updating account from progress:', accErr);
    }

    // Synchronize to Member Directory
    try {
      syncMemberProgress(cleanId, progress);
    } catch {
      // ignore
    }
  } catch (err) {
    console.error('Error saving session progress:', err);
  }
}

export function clearUserSession(): UserProgress {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.clear();
      localStorage.removeItem(ACTIVE_USER_ID_KEY);
      localStorage.removeItem('eng_kh_session_user_v2');
      localStorage.removeItem('currentUser.avatarUrl');
    } catch {
      // ignore
    }
  }
  const savedLang = (typeof window !== 'undefined' ? localStorage.getItem('eng_kh_app_language') : null) as ('km' | 'en') | null;
  return { ...DEFAULT_PROGRESS, appLanguage: savedLang || 'km', isAuthenticated: false, hasCompletedOnboarding: false };
}

export function getFreshUserProgress(): UserProgress {
  const savedLang = (typeof window !== 'undefined' ? localStorage.getItem('eng_kh_app_language') : null) as ('km' | 'en') | null;
  return {
    ...DEFAULT_PROGRESS,
    appLanguage: savedLang || 'km',
    lastActiveDate: new Date().toISOString().split('T')[0],
  };
}

// User Accounts Storage & Auth helpers
export function loadSavedAccounts(): UserAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    let raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(ACCOUNTS_BACKUP_STORAGE_KEY);
    }
    if (!raw) {
      ensureSeedAccounts();
      raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    }
    const accounts: UserAccount[] = raw ? JSON.parse(raw) : [];
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

export const getRegisteredAccounts = loadSavedAccounts;

export function saveAccount(account: UserAccount): void {
  if (typeof window === 'undefined') return;
  try {
    const accounts = loadSavedAccounts();
    const cleanId = account.userIdentifier.trim().toLowerCase();
    const cleanEmail = account.email ? account.email.trim().toLowerCase() : '';
    const cleanPhone = account.phoneNumber ? account.phoneNumber.replace(/[^0-9]/g, '') : '';

    const existingIndex = accounts.findIndex(a => 
      (account.id && a.id === account.id) ||
      a.userIdentifier.trim().toLowerCase() === cleanId ||
      (cleanEmail && a.email && a.email.trim().toLowerCase() === cleanEmail) ||
      (cleanPhone.length >= 8 && a.phoneNumber && a.phoneNumber.replace(/[^0-9]/g, '') === cleanPhone)
    );

    let savedAccount: UserAccount;
    if (existingIndex >= 0) {
      savedAccount = {
        ...accounts[existingIndex],
        ...account,
        xp: account.xp !== undefined ? account.xp : accounts[existingIndex].xp,
        totalStudySeconds: account.totalStudySeconds !== undefined ? account.totalStudySeconds : accounts[existingIndex].totalStudySeconds,
        level: account.level || accounts[existingIndex].level,
        completedLessonIds: account.completedLessonIds || accounts[existingIndex].completedLessonIds,
        masteredVocabIds: account.masteredVocabIds || accounts[existingIndex].masteredVocabIds,
      };
      accounts[existingIndex] = savedAccount;
    } else {
      savedAccount = account;
      accounts.push(savedAccount);
    }

    const serialized = JSON.stringify(accounts);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, serialized);
    localStorage.setItem(ACCOUNTS_BACKUP_STORAGE_KEY, serialized);
    
    // Mirror to IndexedDB
    idbSaveAccount(savedAccount);

    // Keep Member Directory synchronized
    try {
      registerUserAsMember(
        savedAccount.userName,
        savedAccount.email || `${cleanPhone || 'student'}@student.app`,
        savedAccount.phoneNumber || 'N/A',
        savedAccount.avatarUrl,
        savedAccount.passcode,
        {
          gender: savedAccount.gender,
          country: savedAccount.country,
          province: savedAccount.province,
          dateOfBirth: savedAccount.dateOfBirth,
          learningGoal: savedAccount.learningGoal,
          dailyGoalMinutes: savedAccount.dailyGoalMinutes,
          level: savedAccount.level,
          role: savedAccount.role,
          xp: savedAccount.xp,
          totalStudySeconds: savedAccount.totalStudySeconds,
        }
      );
    } catch {
      // ignore
    }

    broadcastSyncEvent('SYNC_ALL', { accountsCount: accounts.length });
  } catch (err) {
    console.error('Error saving account:', err);
  }
}

export function saveAllAccounts(accounts: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(accounts);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, serialized);
    localStorage.setItem(ACCOUNTS_BACKUP_STORAGE_KEY, serialized);
    idbSaveAllAccounts(accounts);
    broadcastSyncEvent('SYNC_ALL', { accountsCount: accounts.length });
  } catch (err) {
    console.error('Error saving all accounts:', err);
  }
}

export function updateAccountCredentials(
  oldIdentifier: string, 
  updates: Partial<UserAccount>
): void {
  if (typeof window === 'undefined') return;
  try {
    const accounts = loadSavedAccounts();
    const cleanOld = oldIdentifier.trim().toLowerCase();
    const cleanDigits = cleanOld.replace(/[^0-9]/g, '');

    const updated = accounts.map(a => {
      if (
        a.userIdentifier.trim().toLowerCase() === cleanOld ||
        (a.email && a.email.trim().toLowerCase() === cleanOld) ||
        (cleanDigits.length >= 8 && a.phoneNumber && a.phoneNumber.replace(/[^0-9]/g, '') === cleanDigits)
      ) {
        return { ...a, ...updates };
      }
      return a;
    });

    saveAllAccounts(updated);
  } catch (err) {
    console.error('Error updating account credentials:', err);
  }
}

/**
 * Normalizes date strings (DD/MM/YYYY or YYYY-MM-DD or D/M/YYYY) to compare dates of birth reliably
 */
export function normalizeDateString(dateStr?: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  // If YYYY-MM-DD
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(trimmed)) {
    const parts = trimmed.split(/[-/]/);
    return `${parseInt(parts[2], 10)}/${parseInt(parts[1], 10)}/${parseInt(parts[0], 10)}`;
  }
  // If DD/MM/YYYY or D/M/YYYY
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(trimmed)) {
    const parts = trimmed.split(/[-/]/);
    return `${parseInt(parts[0], 10)}/${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}`;
  }
  return trimmed.toLowerCase();
}

/**
 * Resets user password by verifying their Date of Birth (DOB)
 */
export function resetAccountPasswordWithDob(
  loginInput: string,
  dobInput: string,
  newPassword: string
): { success: boolean; messageKh: string; messageEn: string; account?: UserAccount } {
  const cleanInput = loginInput.trim().toLowerCase();
  const cleanDigits = loginInput.replace(/[^0-9]/g, '');
  const isDevTarget = isDeveloperIdentifier(loginInput);

  if (!cleanInput) {
    return {
      success: false,
      messageKh: 'សូមបញ្ចូលឈ្មោះ, Email (@gmail.com) ឬ លេខទូរស័ព្ទ',
      messageEn: 'Please enter your username, email, or phone number.'
    };
  }

  if (!dobInput.trim()) {
    return {
      success: false,
      messageKh: 'សូមបញ្ចូលថ្ងៃ ខែ ឆ្នាំកំណើត (Date of Birth) របស់អ្នក',
      messageEn: 'Please enter your Date of Birth for verification.'
    };
  }

  const cleanPass = newPassword.trim();
  if (cleanPass.length < 4) {
    return {
      success: false,
      messageKh: 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៤ ខ្ទង់ (New password must have at least 4 characters)',
      messageEn: 'New password must be at least 4 characters.'
    };
  }

  const accounts = loadSavedAccounts();
  let targetAccount = accounts.find(a => {
    if (isDevTarget && (
      isDeveloperIdentifier(a.userIdentifier) || 
      isDeveloperIdentifier(a.email) || 
      isDeveloperIdentifier(a.phoneNumber) ||
      a.role === 'Developer'
    )) {
      return true;
    }

    const matchId = a.id.toLowerCase() === cleanInput;
    const matchIdentifier = a.userIdentifier.trim().toLowerCase() === cleanInput;
    const matchName = a.userName.trim().toLowerCase() === cleanInput;
    const matchEmail = a.email ? a.email.trim().toLowerCase() === cleanInput : false;
    const matchPhone = a.phoneNumber ? (cleanDigits.length >= 8 && a.phoneNumber.replace(/[^0-9]/g, '') === cleanDigits) : false;
    const matchSecondary = a.secondaryContact ? (
      a.secondaryContact.trim().toLowerCase() === cleanInput ||
      (cleanDigits.length >= 8 && a.secondaryContact.replace(/[^0-9]/g, '') === cleanDigits)
    ) : false;
    const matchBackup = a.backupIdentifiers ? a.backupIdentifiers.some(b => 
      b.trim().toLowerCase() === cleanInput ||
      (cleanDigits.length >= 8 && b.replace(/[^0-9]/g, '') === cleanDigits)
    ) : false;

    return matchId || matchIdentifier || matchName || matchEmail || matchPhone || matchSecondary || matchBackup;
  });

  // If developer target not yet in accounts, establish it
  if (!targetAccount && isDevTarget) {
    targetAccount = {
      id: 'acc-admin-owner',
      userName: 'Phon Phai',
      authMethod: 'gmail',
      userIdentifier: 'phonphaihdvk@gmail.com',
      email: 'phonphaihdvk@gmail.com',
      phoneNumber: '012889900',
      secondaryContact: '012889977',
      backupIdentifiers: ['012889900', '012889977', 'phonphaihdvk@gmail.com'],
      passcode: '123456',
      role: 'Developer',
      dateOfBirth: '01/01/2000',
      createdAt: new Date().toISOString(),
    };
    saveAccount(targetAccount);
  }

  // Fallback to member directory
  if (!targetAccount) {
    const members = loadMembers();
    const matchedMember = members.find(m => 
      m.email.toLowerCase() === cleanInput ||
      m.fullName.toLowerCase() === cleanInput ||
      (cleanDigits.length >= 8 && m.phone.replace(/[^0-9]/g, '') === cleanDigits)
    );
    if (matchedMember) {
      targetAccount = {
        id: matchedMember.id,
        userName: matchedMember.fullName,
        authMethod: matchedMember.email.includes('@gmail.com') ? 'gmail' : 'phone',
        userIdentifier: matchedMember.email,
        email: matchedMember.email,
        phoneNumber: matchedMember.phone,
        passcode: matchedMember.passcode || '123456',
        role: matchedMember.role,
        createdAt: matchedMember.joinedDate,
      };
      saveAccount(targetAccount);
    }
  }

  if (!targetAccount) {
    return {
      success: false,
      messageKh: 'រកមិនឃើញគណនីនេះទេ! សូមពិនិត្យមើលឈ្មោះ អ៊ីមែល ឬលេខទូរស័ព្ទឡើងវិញ',
      messageEn: 'Account not found. Please verify your username, email, or phone number.'
    };
  }

  // Verify Date of Birth
  const normInput = normalizeDateString(dobInput);
  const normAccount = normalizeDateString(targetAccount.dateOfBirth);

  if (normAccount) {
    if (normInput !== normAccount) {
      return {
        success: false,
        messageKh: 'ថ្ងៃ ខែ ឆ្នាំកំណើត មិនត្រឹមត្រូវជាមួយគណនីនេះទេ! សូមពិនិត្យឡើងវិញ',
        messageEn: 'Date of Birth does not match the account record. Please check again.'
      };
    }
  }

  // Update passcode & record date of birth
  const updatedAccount: UserAccount = {
    ...targetAccount,
    passcode: cleanPass,
    dateOfBirth: targetAccount.dateOfBirth || dobInput.trim(),
  };

  saveAccount(updatedAccount);
  updateAccountCredentials(targetAccount.userIdentifier, {
    passcode: cleanPass,
    dateOfBirth: updatedAccount.dateOfBirth
  });

  return {
    success: true,
    messageKh: 'កំណត់ពាក្យសម្ងាត់ថ្មីបានជោគជ័យ! អ្នកអាចចូលគណនីបានឥឡូវនេះ',
    messageEn: 'Password reset successfully! You can now sign in with your new password.',
    account: updatedAccount
  };
}

/**
 * Changes current logged in user's password with verification
 */
export function changePasswordForAccount(
  identifierOrName: string,
  newPasscode: string,
  currentPasscode?: string
): { success: boolean; messageKh: string; messageEn: string; account?: UserAccount } {
  const cleanInput = (identifierOrName || '').trim().toLowerCase();
  const cleanDigits = (identifierOrName || '').replace(/[^0-9]/g, '');
  const isDevTarget = isDeveloperIdentifier(identifierOrName);

  if (!cleanInput) {
    return {
      success: false,
      messageKh: 'មិនមានព័ត៌មានគណនីត្រឹមត្រូវ (Invalid account identifier)',
      messageEn: 'Invalid account identifier.'
    };
  }

  const cleanNew = newPasscode.trim();
  if (cleanNew.length < 4) {
    return {
      success: false,
      messageKh: 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៤ ខ្ទង់ (New password must be at least 4 characters)',
      messageEn: 'New password must have at least 4 characters.'
    };
  }

  const accounts = loadSavedAccounts();
  let targetAccount = accounts.find(a => {
    if (isDevTarget && (
      isDeveloperIdentifier(a.userIdentifier) || 
      isDeveloperIdentifier(a.email) || 
      isDeveloperIdentifier(a.phoneNumber) ||
      a.role === 'Developer'
    )) {
      return true;
    }

    const matchId = a.id?.toLowerCase() === cleanInput;
    const matchIdentifier = a.userIdentifier.trim().toLowerCase() === cleanInput;
    const matchName = a.userName.trim().toLowerCase() === cleanInput;
    const matchEmail = a.email ? a.email.trim().toLowerCase() === cleanInput : false;
    const matchPhone = a.phoneNumber ? (cleanDigits.length >= 8 && a.phoneNumber.replace(/[^0-9]/g, '') === cleanDigits) : false;

    return matchId || matchIdentifier || matchName || matchEmail || matchPhone;
  });

  // If developer target not yet in accounts, establish it
  if (!targetAccount && isDevTarget) {
    targetAccount = {
      id: 'acc-admin-owner',
      userName: 'Phon Phai',
      authMethod: 'gmail',
      userIdentifier: 'phonphaihdvk@gmail.com',
      email: 'phonphaihdvk@gmail.com',
      phoneNumber: '012889900',
      secondaryContact: '012889977',
      backupIdentifiers: ['012889900', '012889977', 'phonphaihdvk@gmail.com'],
      passcode: '123456',
      role: 'Developer',
      dateOfBirth: '01/01/2000',
      createdAt: new Date().toISOString(),
    };
    saveAccount(targetAccount);
  }

  // Fallback to member directory
  if (!targetAccount) {
    const members = loadMembers();
    const matchedMember = members.find(m => 
      m.email.toLowerCase() === cleanInput ||
      m.fullName.toLowerCase() === cleanInput ||
      (cleanDigits.length >= 8 && m.phone.replace(/[^0-9]/g, '') === cleanDigits)
    );
    if (matchedMember) {
      targetAccount = {
        id: matchedMember.id,
        userName: matchedMember.fullName,
        authMethod: matchedMember.email.includes('@gmail.com') ? 'gmail' : 'phone',
        userIdentifier: matchedMember.email,
        email: matchedMember.email,
        phoneNumber: matchedMember.phone,
        passcode: matchedMember.passcode || '123456',
        role: matchedMember.role,
        createdAt: matchedMember.joinedDate,
      };
      saveAccount(targetAccount);
    }
  }

  if (!targetAccount) {
    targetAccount = {
      id: `acc-${Date.now()}`,
      userName: identifierOrName,
      authMethod: identifierOrName.includes('@') ? 'gmail' : 'phone',
      userIdentifier: identifierOrName,
      email: identifierOrName.includes('@') ? identifierOrName : undefined,
      phoneNumber: !identifierOrName.includes('@') ? identifierOrName : undefined,
      passcode: cleanNew,
      createdAt: new Date().toISOString(),
    };
    saveAccount(targetAccount);
    return {
      success: true,
      messageKh: 'បានបង្កើត និងផ្លាស់ប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ!',
      messageEn: 'Password created and updated successfully!',
      account: targetAccount
    };
  }

  // Check current password if provided and user has existing passcode
  if (currentPasscode !== undefined && targetAccount.passcode) {
    if (targetAccount.passcode !== currentPasscode.trim()) {
      return {
        success: false,
        messageKh: 'ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវទេ! (Current password is incorrect)',
        messageEn: 'Current password is incorrect. Please check and try again.'
      };
    }
  }

  // Update passcode
  const updatedAccount: UserAccount = {
    ...targetAccount,
    passcode: cleanNew,
  };

  saveAccount(updatedAccount);
  updateAccountCredentials(targetAccount.userIdentifier, {
    passcode: cleanNew,
  });

  // Sync with members directory
  try {
    const members = loadMembers();
    const updatedMembers = members.map(m => {
      if (
        m.email.toLowerCase() === cleanInput ||
        m.fullName.toLowerCase() === cleanInput ||
        (cleanDigits.length >= 8 && m.phone.replace(/[^0-9]/g, '') === cleanDigits) ||
        (targetAccount?.userIdentifier && m.email.toLowerCase() === targetAccount.userIdentifier.toLowerCase())
      ) {
        return { ...m, passcode: cleanNew };
      }
      return m;
    });
    saveMembers(updatedMembers);
  } catch {
    // ignore
  }

  return {
    success: true,
    messageKh: 'បានផ្លាស់ប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ! (Password changed successfully!)',
    messageEn: 'Password updated successfully!',
    account: updatedAccount
  };
}

export function deleteAccountByIdentifier(identifier: string): void {
  if (typeof window === 'undefined') return;
  try {
    const accounts = loadSavedAccounts();
    const cleanId = identifier.trim().toLowerCase();
    const filtered = accounts.filter(a => 
      a.userIdentifier.trim().toLowerCase() !== cleanId &&
      (!a.email || a.email.trim().toLowerCase() !== cleanId) &&
      (!a.phoneNumber || a.phoneNumber.replace(/[^0-9]/g, '') !== cleanId.replace(/[^0-9]/g, ''))
    );
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(filtered));
    localStorage.removeItem(`eng_kh_account_progress_${cleanId}`);
  } catch (err) {
    console.error('Error deleting account:', err);
  }
}

export function findAccountByCredentials(loginInput: string, passcode?: string): UserAccount | null {
  const accounts = loadSavedAccounts();
  const trimmed = loginInput.trim().toLowerCase();
  const cleanDigits = loginInput.replace(/[^0-9]/g, '');
  const isDevTarget = isDeveloperIdentifier(loginInput);

  let found = accounts.find(a => {
    // If logging in as developer via any of the 3 identifiers
    if (isDevTarget && (
      isDeveloperIdentifier(a.userIdentifier) || 
      isDeveloperIdentifier(a.email) || 
      isDeveloperIdentifier(a.phoneNumber) ||
      a.role === 'Developer'
    )) {
      return true;
    }

    const matchId = a.id.toLowerCase() === trimmed;
    const matchIdentifier = a.userIdentifier.trim().toLowerCase() === trimmed;
    const matchName = a.userName.trim().toLowerCase() === trimmed;
    const matchEmail = a.email ? a.email.trim().toLowerCase() === trimmed : false;
    const matchPhone = a.phoneNumber ? (cleanDigits.length >= 8 && a.phoneNumber.replace(/[^0-9]/g, '') === cleanDigits) : false;
    const matchSecondary = a.secondaryContact ? (
      a.secondaryContact.trim().toLowerCase() === trimmed ||
      (cleanDigits.length >= 8 && a.secondaryContact.replace(/[^0-9]/g, '') === cleanDigits)
    ) : false;
    const matchBackup = a.backupIdentifiers ? a.backupIdentifiers.some(b => 
      b.trim().toLowerCase() === trimmed ||
      (cleanDigits.length >= 8 && b.replace(/[^0-9]/g, '') === cleanDigits)
    ) : false;
    const matchQrToken = a.qrToken ? a.qrToken === loginInput.trim() : false;

    // Special quick shortcut for admin
    const matchAdminKeyword = (trimmed === 'admin' && (a.role === 'Admin' || a.role === 'Developer' || a.email?.includes('admin') || a.email?.includes('phonphai')));

    return matchId || matchIdentifier || matchName || matchEmail || matchPhone || matchSecondary || matchBackup || matchQrToken || matchAdminKeyword;
  });

  // If developer target and not found yet, create the canonical master developer account
  if (!found && isDevTarget) {
    found = {
      id: 'acc-admin-owner',
      userName: 'Phon Phai',
      authMethod: 'gmail',
      userIdentifier: 'phonphaihdvk@gmail.com',
      email: 'phonphaihdvk@gmail.com',
      phoneNumber: '012889900',
      secondaryContact: '012889977',
      backupIdentifiers: ['012889900', '012889977', 'phonphaihdvk@gmail.com'],
      passcode: '123456',
      role: 'Developer',
      qrToken: 'qr_master_admin_phonphai',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin&backgroundColor=c0aede',
      createdAt: new Date().toISOString(),
    };
    saveAccount(found);
  }

  // If not found in accounts, check Member Directory as fallback
  if (!found) {
    const members = loadMembers();
    const matchedMember = members.find(m => 
      m.email.toLowerCase() === trimmed ||
      m.fullName.toLowerCase() === trimmed ||
      (cleanDigits.length >= 8 && m.phone.replace(/[^0-9]/g, '') === cleanDigits) ||
      (m.secondaryContact && (
        m.secondaryContact.toLowerCase() === trimmed ||
        (cleanDigits.length >= 8 && m.secondaryContact.replace(/[^0-9]/g, '') === cleanDigits)
      )) ||
      (m.backupIdentifiers && m.backupIdentifiers.some(b => 
        b.toLowerCase() === trimmed ||
        (cleanDigits.length >= 8 && b.replace(/[^0-9]/g, '') === cleanDigits)
      ))
    );

    if (matchedMember) {
      found = {
        id: matchedMember.id,
        userName: matchedMember.fullName,
        authMethod: matchedMember.email.includes('@gmail.com') ? 'gmail' : 'phone',
        userIdentifier: matchedMember.email,
        email: matchedMember.email,
        phoneNumber: matchedMember.phone,
        secondaryContact: matchedMember.secondaryContact,
        backupIdentifiers: matchedMember.backupIdentifiers,
        passcode: matchedMember.passcode || '123456',
        role: matchedMember.role,
        avatarUrl: matchedMember.avatarUrl,
        qrToken: `qr_${matchedMember.id}_auth`,
        createdAt: matchedMember.joinedDate,
      };
      saveAccount(found);
    }
  }

  if (!found) return null;

  // Strict 3-Way Developer Master Credential verification & privilege binding
  const isDeveloperUser = 
    isDeveloperIdentifier(found.email || found.userIdentifier || found.phoneNumber) || 
    (found.secondaryContact && isDeveloperIdentifier(found.secondaryContact)) ||
    (found.backupIdentifiers && found.backupIdentifiers.some(isDeveloperIdentifier)) ||
    found.role === 'Developer' ||
    isDevTarget;
  if (isDeveloperUser) {
    found.role = 'Developer';
    
    // MANDATORY PASSWORD REQUIREMENT FOR DEVELOPER MASTER CREDENTIALS:
    // Any attempt to log in using these 3 credentials MUST strictly require correct password verification!
    const expectedMasterPasscode = found.passcode || '123456';
    if (!passcode || passcode.trim() !== expectedMasterPasscode) {
      return null;
    }
  } else if (isMasterAdmin(found.email || found.userIdentifier, found.userName)) {
    found.role = 'Admin';
  }

  if (passcode !== undefined && passcode !== '') {
    if (found.passcode && found.passcode !== passcode) {
      return null;
    }
  }
  return found;
}

export function findAccountByIdentifier(identifier: string, passcode?: string): UserAccount | null {
  return findAccountByCredentials(identifier, passcode);
}

export function generateStudentId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `AEA-${randomNum}`;
}

export function formatStudyTime(seconds: number): { formatted: string; minutes: number; hours: number } {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return {
      formatted: `${hours}h ${minutes}m ${secs}s`,
      minutes: Math.floor(seconds / 60),
      hours,
    };
  }
  return {
    formatted: `${minutes}m ${secs < 10 ? '0' : ''}${secs}s`,
    minutes,
    hours: 0,
  };
}

/**
 * Format live timer according to Khmer specification: "00ម៉ោង:00នាទី:07វិនាទី"
 */
export function formatKhmerStudyTimer(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}ម៉ោង:${pad(minutes)}នាទី:${pad(seconds)}វិនាទី`;
}

/**
 * Cleanly format user ID for display (e.g. 1042)
 */
export function getDisplayUserId(identifier?: string): string {
  if (!identifier) return '1042';
  const trimmed = identifier.trim();
  if (/^\d{3,6}$/.test(trimmed)) return trimmed;
  if (trimmed.startsWith('AEA-')) return trimmed.replace('AEA-', '');
  const digits = trimmed.replace(/[^0-9]/g, '');
  if (digits.length >= 2) return digits.slice(-4);
  // Derive a deterministic 4-digit ID from the string if no digits exist
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash << 5) - hash + trimmed.charCodeAt(i);
    hash |= 0;
  }
  return String(Math.abs(hash) % 9000 + 1000);
}

export function getLevelRankTitle(xp: number): { en: string; kh: string } {
  if (xp < 100) return { en: 'Beginner Explorer', kh: 'អ្នកចាប់ផ្តើមដំបូង' };
  if (xp < 300) return { en: 'Junior Communicator', kh: 'អ្នកទំនាក់ទំនងបឋម' };
  if (xp < 600) return { en: 'Intermediate Scholar', kh: 'អ្នកសិក្សាកម្រិតមធ្យម' };
  if (xp < 1000) return { en: 'Advanced Conversationalist', kh: 'អ្នកសន្ទនាស្ទាត់ជំនាញ' };
  return { en: 'Fluent English Master', kh: 'អ្នកចេះភាសាអង់គ្លេសស្ទាត់ជំនាញ' };
}
