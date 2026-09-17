import { AppMember, UserRole, UserGender, LearningGoal, DifficultyLevel, UserProgress } from '../types';
import { broadcastSyncEvent } from './cloudSync';
import { idbSaveAllMembers } from './indexedDbStorage';

const MEMBERS_STORAGE_KEY = 'eng_kh_members_directory_v2';
const MEMBERS_BACKUP_STORAGE_KEY = 'eng_kh_members_backup_v1';

export const MASTER_ADMIN_EMAILS = [
  'khdily52@gmail.com',
  'phonphaihdvk@gmail.com',
  'sadfree130@gmail.com',
  'sophea.chan@gmail.com',
  'admin@gmail.com',
];

export const DEVELOPER_CREDENTIALS = {
  email: 'phonphaihdvk@gmail.com',
  backupEmail: 'sadfree130@gmail.com',
  primaryPhone: '012889900',
  secondaryPhone: '012889977',
  backupPhone: '012888999',
};

/**
 * Checks whether an identifier strictly matches the Master Developer Credentials:
 * 1) phonphaihdvk@gmail.com & sadfree130@gmail.com
 * 2) Primary Developer Phone: 012889900
 * 3) Secondary / Backup Developer Phone: 012889977 (and 012888999)
 */
export function isDeveloperIdentifier(input?: string): boolean {
  if (!input) return false;
  const clean = input.trim().toLowerCase();
  const digits = input.replace(/[^0-9]/g, '');

  // Master Developer Emails
  if (
    clean === 'phonphaihdvk@gmail.com' || 
    clean.includes('phonphaihdvk@gmail.com') ||
    clean === 'sadfree130@gmail.com' ||
    clean.includes('sadfree130@gmail.com')
  ) {
    return true;
  }
  // Identifier 2: Developer Primary Phone (012889900)
  if (digits === '012889900' || digits === '85512889900' || digits === '12889900') {
    return true;
  }
  // Identifier 3: Developer Secondary Phone (012889977)
  if (digits === '012889977' || digits === '85512889977' || digits === '12889977') {
    return true;
  }
  // Backup Developer Phone (012888999)
  if (digits === '012888999' || digits === '85512888999' || digits === '12888999') {
    return true;
  }
  return false;
}

/**
 * Strictly controls who is authorized to use the Role Switcher:
 * "មុខងារប្ដូរតួនាទីបានតែខ្ញុំទេ ហាមអ្នកចុះឈ្មោះធម្មតា កហរៅពីខ្ញុំនិងលេខឬgmailបម្រុងខ្ញុំ ទើបមានមុខងារនេះ"
 * Ordinary registered users are forbidden from switching roles.
 */
export function isAuthorizedForRoleSwitching(user?: { 
  userIdentifier?: string; 
  email?: string; 
  phoneNumber?: string; 
  role?: UserRole; 
  userName?: string 
}): boolean {
  if (!user) return false;
  if (isDeveloperIdentifier(user.userIdentifier)) return true;
  if (isDeveloperIdentifier(user.email)) return true;
  if (isDeveloperIdentifier(user.phoneNumber)) return true;
  if (user.role === 'Developer') return true;
  if (user.userName && (user.userName.toLowerCase().includes('phon phai') || user.userName.includes('ផុន ផៃ'))) return true;
  return false;
}

/**
 * Check if the user is a top-tier Developer (អ្នកអភិវឌ្ឍន៍)
 */
export function isDeveloperRole(identifierOrEmail?: string, userName?: string, role?: UserRole): boolean {
  if (role === 'Developer') return true;
  if (!identifierOrEmail && !userName) return false;
  const cleanId = (identifierOrEmail || '').trim().toLowerCase();
  const cleanName = (userName || '').trim().toLowerCase();

  // Strict 3-Way Developer Master Credential check
  if (isDeveloperIdentifier(cleanId)) return true;
  if (cleanName.includes('phon phai') || cleanName.includes('ផុន ផៃ')) return true;
  if (cleanId === 'developer' || cleanId === 'dev' || cleanName.includes('developer') || cleanName.includes('អ្នកអភិវឌ្ឍន៍')) return true;

  try {
    const members = loadMembers();
    const found = members.find(m => 
      m.email.toLowerCase() === cleanId || 
      (cleanId.length >= 8 && m.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')) ||
      m.fullName.toLowerCase() === cleanName
    );
    if (found && found.role === 'Developer') {
      return true;
    }
  } catch {
    // fallback
  }

  return false;
}

/**
 * Strict Super Admin / Master Admin check
 */
export function isMasterAdmin(identifierOrEmail?: string, userName?: string): boolean {
  if (!identifierOrEmail && !userName) return false;
  const cleanId = (identifierOrEmail || '').trim().toLowerCase();
  const cleanName = (userName || '').trim().toLowerCase();

  // Strict 3-Way Developer Master Credential check
  if (isDeveloperIdentifier(cleanId)) return true;

  // Direct designated admin/dev email matching (including App Owner email from metadata)
  if (MASTER_ADMIN_EMAILS.some(e => cleanId === e || cleanId.includes(e))) return true;

  // Admin / Developer keywords / usernames
  if (cleanId === 'admin' || cleanName === 'admin' || cleanId === 'developer' || cleanName.includes('master admin') || cleanName.includes('app owner') || cleanName.includes('developer')) {
    return true;
  }

  // Check in loaded members list
  try {
    const members = loadMembers();
    const found = members.find(m => 
      m.email.toLowerCase() === cleanId || 
      (cleanId.length >= 8 && m.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')) ||
      m.fullName.toLowerCase() === cleanName
    );
    if (found && (found.role === 'Admin' || found.role === 'Developer')) {
      return true;
    }
  } catch {
    // fallback
  }

  return false;
}

/**
 * Check if the user has administrative or developer privileges
 */
export function hasAdminPrivilege(identifierOrEmail?: string, userName?: string, role?: UserRole): boolean {
  if (role === 'Developer' || role === 'Admin') return true;
  return isMasterAdmin(identifierOrEmail, userName);
}

/**
 * Strips out bracketed role text like "(Master Developer)", "(Developer)", "(Admin)", "(Student)"
 * and returns purely the clean display name (e.g., "Phon Phai" or "ផុន ផៃ").
 */
export function getCleanDisplayName(userName?: string): string {
  if (!userName) return 'Phon Phai';
  // Strip bracketed text such as (Master Developer), (Developer), (Admin), (Teacher), etc.
  const cleaned = userName.replace(/\s*\([^)]*\)/g, '').trim();
  return cleaned || 'Phon Phai';
}

export const SEED_MEMBERS: AppMember[] = [
  {
    id: 'mem-admin-owner',
    fullName: 'Phon Phai',
    email: 'phonphaihdvk@gmail.com',
    phone: '012889900',
    role: 'Developer',
    joinedDate: '2024-01-01',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    level: 'advanced',
    totalStudySeconds: 25000,
    status: 'active',
    passcode: '123456',
  },
  {
    id: 'mem-admin-01',
    fullName: 'Sophea Chan (ចាន់ សុភា)',
    email: 'sophea.chan@gmail.com',
    phone: '012889977',
    role: 'Admin',
    joinedDate: '2024-01-15',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    level: 'advanced',
    totalStudySeconds: 14500,
    status: 'active',
    passcode: '123456',
  },
  {
    id: 'mem-teach-02',
    fullName: 'Vannak Heng (ហេង វណ្ណៈ)',
    email: 'vannak.teacher@gmail.com',
    phone: '098765432',
    role: 'Teacher',
    joinedDate: '2024-02-10',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    level: 'advanced',
    totalStudySeconds: 18200,
    status: 'active',
    passcode: '123456',
  },
  {
    id: 'mem-edit-03',
    fullName: 'Bopha Pich (ពេជ្រ បុប្ផា)',
    email: 'bopha.editor@gmail.com',
    phone: '085223344',
    role: 'Editor',
    joinedDate: '2024-03-01',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    level: 'intermediate',
    totalStudySeconds: 9800,
    status: 'active',
    passcode: '123456',
  },
  {
    id: 'mem-stud-04',
    fullName: 'Dara Sok (សុខ ដារ៉ា)',
    email: 'khdily52@gmail.com',
    phone: '011234567',
    role: 'Student',
    joinedDate: '2024-04-18',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    level: 'beginner',
    totalStudySeconds: 4200,
    status: 'active',
    passcode: '123456',
  },
  {
    id: 'mem-stud-05',
    fullName: 'Kosal Chea (ជា កុសល)',
    email: 'kosal.chea@gmail.com',
    phone: '077998877',
    role: 'Student',
    joinedDate: '2024-05-02',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    level: 'beginner',
    totalStudySeconds: 3100,
    status: 'active',
    passcode: '123456',
  },
];

/**
 * Load members directory from localStorage, backup storage, or fallback to seeds
 */
export function loadMembers(): AppMember[] {
  if (typeof window === 'undefined') return SEED_MEMBERS;
  try {
    let raw = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (!raw) {
      // Fallback to redundant backup storage
      raw = localStorage.getItem(MEMBERS_BACKUP_STORAGE_KEY);
    }

    if (!raw) {
      saveMembers(SEED_MEMBERS);
      return SEED_MEMBERS;
    }
    const parsed: AppMember[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveMembers(SEED_MEMBERS);
      return SEED_MEMBERS;
    }

    // Always ensure Master Admin (phonphaihdvk@gmail.com) exists with Admin role
    const hasOwner = parsed.some(m => m.email.toLowerCase() === 'phonphaihdvk@gmail.com');
    if (!hasOwner) {
      parsed.unshift(SEED_MEMBERS[0]);
      saveMembers(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load members:', err);
    try {
      const backupRaw = localStorage.getItem(MEMBERS_BACKUP_STORAGE_KEY);
      if (backupRaw) {
        return JSON.parse(backupRaw);
      }
    } catch {
      // ignore
    }
    return SEED_MEMBERS;
  }
}

/**
 * Save members directory to localStorage, backup registry, and IndexedDB
 */
export function saveMembers(members: AppMember[]): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(members);
    localStorage.setItem(MEMBERS_STORAGE_KEY, serialized);
    // Redundant persistent backup
    localStorage.setItem(MEMBERS_BACKUP_STORAGE_KEY, serialized);
    // Asynchronous IndexedDB mirror
    idbSaveAllMembers(members);
    broadcastSyncEvent('SYNC_ALL', { membersCount: members.length });
  } catch (err) {
    console.error('Failed to save members:', err);
  }
}

/**
 * Register or update member in the directory from Onboarding / Auth
 * Includes comprehensive profile details and initial learning parameters.
 */
export function registerUserAsMember(
  fullName: string,
  email: string,
  phone: string,
  avatarUrl?: string,
  passcode: string = '123456',
  extraProfile?: {
    gender?: UserGender;
    country?: string;
    province?: string;
    dateOfBirth?: string;
    learningGoal?: LearningGoal;
    dailyGoalMinutes?: number;
    level?: DifficultyLevel;
    role?: UserRole;
    xp?: number;
    totalStudySeconds?: number;
  }
): AppMember {
  const members = loadMembers();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();
  const cleanDigits = cleanPhone.replace(/[^0-9]/g, '');

  const existingIdx = members.findIndex(m => 
    m.email.toLowerCase() === cleanEmail ||
    (cleanDigits.length >= 8 && m.phone && m.phone.replace(/[^0-9]/g, '') === cleanDigits)
  );

  // Auto-detect role
  const isMaster = isMasterAdmin(cleanEmail, fullName) || isDeveloperIdentifier(cleanEmail) || isDeveloperIdentifier(cleanPhone);
  const defaultRole: UserRole = isMaster ? 'Admin' : (extraProfile?.role || 'Student');

  let member: AppMember;
  if (existingIdx >= 0) {
    const prev = members[existingIdx];
    member = {
      ...prev,
      fullName: fullName.trim() || prev.fullName,
      email: cleanEmail.includes('@') ? cleanEmail : prev.email,
      phone: cleanPhone || prev.phone,
      role: prev.role === 'Admin' || prev.role === 'Developer' ? prev.role : (extraProfile?.role || prev.role || defaultRole),
      avatarUrl: avatarUrl || prev.avatarUrl,
      passcode: passcode || prev.passcode || '123456',
      gender: extraProfile?.gender || prev.gender,
      country: extraProfile?.country || prev.country,
      province: extraProfile?.province || prev.province,
      dateOfBirth: extraProfile?.dateOfBirth || prev.dateOfBirth,
      learningGoal: extraProfile?.learningGoal || prev.learningGoal,
      dailyGoalMinutes: extraProfile?.dailyGoalMinutes || prev.dailyGoalMinutes,
      level: extraProfile?.level || prev.level || 'beginner',
      xp: extraProfile?.xp !== undefined ? extraProfile.xp : (prev.xp || 0),
      totalStudySeconds: extraProfile?.totalStudySeconds !== undefined ? extraProfile.totalStudySeconds : (prev.totalStudySeconds || 0),
      lastActiveDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    members[existingIdx] = member;
  } else {
    member = {
      id: `mem-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      role: defaultRole,
      joinedDate: new Date().toISOString().split('T')[0],
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      level: extraProfile?.level || 'beginner',
      totalStudySeconds: extraProfile?.totalStudySeconds || 0,
      xp: extraProfile?.xp || 0,
      status: 'active',
      passcode: passcode || '123456',
      gender: extraProfile?.gender,
      country: extraProfile?.country,
      province: extraProfile?.province,
      dateOfBirth: extraProfile?.dateOfBirth,
      learningGoal: extraProfile?.learningGoal,
      dailyGoalMinutes: extraProfile?.dailyGoalMinutes,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    members.unshift(member);
  }

  saveMembers(members);
  return member;
}

/**
 * Synchronize live learning progress and profile updates into member directory
 */
export function syncMemberProgress(identifier: string, updates: Partial<UserProgress>): void {
  if (!identifier) return;
  const members = loadMembers();
  const clean = identifier.trim().toLowerCase();
  const cleanDigits = identifier.replace(/[^0-9]/g, '');

  let modified = false;
  const nextMembers = members.map((m) => {
    const matchEmail = m.email.toLowerCase() === clean;
    const matchPhone = cleanDigits.length >= 8 && m.phone.replace(/[^0-9]/g, '') === cleanDigits;
    const matchName = m.fullName.toLowerCase() === clean;
    const matchId = m.id === identifier;

    if (matchEmail || matchPhone || matchName || matchId) {
      modified = true;
      return {
        ...m,
        fullName: updates.userName || m.fullName,
        avatarUrl: updates.avatarUrl || m.avatarUrl,
        level: updates.currentLevel || m.level,
        totalStudySeconds: updates.totalStudySeconds !== undefined ? updates.totalStudySeconds : m.totalStudySeconds,
        xp: updates.xp !== undefined ? updates.xp : m.xp,
        completedLessonsCount: updates.completedLessonIds ? updates.completedLessonIds.length : m.completedLessonsCount,
        gender: updates.gender || m.gender,
        country: updates.country || m.country,
        province: updates.province || m.province,
        dateOfBirth: updates.dateOfBirth || m.dateOfBirth,
        learningGoal: updates.learningGoal || m.learningGoal,
        dailyGoalMinutes: updates.dailyGoalMinutes || m.dailyGoalMinutes,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
    }
    return m;
  });

  if (modified) {
    saveMembers(nextMembers);
  }
}

/**
 * Admin: Add brand new member manually
 */
export function addMemberByAdmin(memberData: {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  passcode?: string;
  avatarUrl?: string;
  secondaryContact?: string;
  backupIdentifiers?: string[];
}): AppMember {
  const members = loadMembers();
  const cleanEmail = memberData.email.trim().toLowerCase();

  const newMem: AppMember = {
    id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    fullName: memberData.fullName.trim(),
    email: cleanEmail,
    phone: memberData.phone.trim(),
    role: memberData.role,
    passcode: memberData.passcode?.trim() || '123456',
    secondaryContact: memberData.secondaryContact?.trim() || undefined,
    backupIdentifiers: memberData.backupIdentifiers || (memberData.secondaryContact ? [memberData.secondaryContact.trim()] : undefined),
    joinedDate: new Date().toISOString().split('T')[0],
    avatarUrl: memberData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    level: 'beginner',
    totalStudySeconds: 0,
    status: 'active',
  };

  const nextList = [newMem, ...members.filter(m => m.email.toLowerCase() !== cleanEmail)];
  saveMembers(nextList);
  return newMem;
}

/**
 * Update member details (Name, Email, Phone, Role, Passcode, Backup Contact)
 */
export function updateMemberDetails(
  id: string,
  updates: { 
    fullName: string; 
    email: string; 
    phone: string; 
    role?: UserRole; 
    passcode?: string;
    secondaryContact?: string;
    backupIdentifiers?: string[];
  }
): AppMember[] {
  const members = loadMembers();
  const updated = members.map(m => {
    if (m.id === id) {
      return {
        ...m,
        fullName: updates.fullName.trim(),
        email: updates.email.trim().toLowerCase(),
        phone: updates.phone.trim(),
        role: updates.role || m.role,
        passcode: updates.passcode !== undefined ? updates.passcode.trim() : m.passcode,
        secondaryContact: updates.secondaryContact !== undefined ? updates.secondaryContact.trim() : m.secondaryContact,
        backupIdentifiers: updates.backupIdentifiers !== undefined ? updates.backupIdentifiers : m.backupIdentifiers,
      };
    }
    return m;
  });
  saveMembers(updated);
  return updated;
}

/**
 * Transfer / assign role to member
 */
export function updateMemberRole(id: string, newRole: UserRole): AppMember[] {
  const members = loadMembers();
  const updated = members.map(m => (m.id === id ? { ...m, role: newRole } : m));
  saveMembers(updated);
  return updated;
}

/**
 * Delete member
 */
export function deleteMember(id: string): AppMember[] {
  const members = loadMembers();
  const updated = members.filter(m => m.id !== id);
  saveMembers(updated);
  return updated;
}

/**
 * Update member avatar in directory by email, identifier or full name
 */
export function updateUserAvatarInDirectory(identifier: string, avatarUrl: string): void {
  if (!identifier || !avatarUrl) return;
  const members = loadMembers();
  const clean = identifier.trim().toLowerCase();
  let modified = false;
  for (let i = 0; i < members.length; i++) {
    if (
      members[i].email.toLowerCase() === clean || 
      members[i].fullName.toLowerCase() === clean ||
      members[i].phone === clean ||
      clean.includes(members[i].email.toLowerCase())
    ) {
      members[i].avatarUrl = avatarUrl;
      modified = true;
    }
  }
  if (modified) {
    saveMembers(members);
  }
}

export interface DeveloperBackupConfig {
  slot1: string; // Primary e.g. phonphaihdvk@gmail.com
  slot2: string; // Backup 2 e.g. 012889900
  slot3: string; // Backup 3 e.g. 012889977
  sharedPasscode: string;
  updatedAt: string;
}

const DEVELOPER_BACKUP_STORAGE_KEY = 'eng_kh_developer_backup_config_v1';

export const DEFAULT_DEVELOPER_BACKUPS: DeveloperBackupConfig = {
  slot1: 'phonphaihdvk@gmail.com',
  slot2: '012889900',
  slot3: '012889977',
  sharedPasscode: '123456',
  updatedAt: new Date().toISOString(),
};

/**
 * Load Developer (ហ្វុនថៃ / Phon Phai) backup contacts configuration
 */
export function loadDeveloperBackupConfig(): DeveloperBackupConfig {
  if (typeof window === 'undefined') return DEFAULT_DEVELOPER_BACKUPS;
  try {
    const raw = localStorage.getItem(DEVELOPER_BACKUP_STORAGE_KEY);
    if (!raw) return DEFAULT_DEVELOPER_BACKUPS;
    const parsed = JSON.parse(raw);
    return {
      slot1: parsed.slot1 || DEFAULT_DEVELOPER_BACKUPS.slot1,
      slot2: parsed.slot2 || DEFAULT_DEVELOPER_BACKUPS.slot2,
      slot3: parsed.slot3 || DEFAULT_DEVELOPER_BACKUPS.slot3,
      sharedPasscode: parsed.sharedPasscode || '123456',
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return DEFAULT_DEVELOPER_BACKUPS;
  }
}

/**
 * Save Developer backup contacts and sync into account directory with shared passcode
 */
export function saveDeveloperBackupConfig(config: DeveloperBackupConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEVELOPER_BACKUP_STORAGE_KEY, JSON.stringify(config));
    
    // Update Developer member in Member Directory
    const members = loadMembers();
    const updated = members.map(m => {
      if (
        m.role === 'Developer' || 
        m.email.toLowerCase() === 'phonphaihdvk@gmail.com' ||
        m.fullName.toLowerCase().includes('phon phai') ||
        m.fullName.toLowerCase().includes('ផុន ផៃ')
      ) {
        const primaryIsEmail = config.slot1.includes('@');
        return {
          ...m,
          role: 'Developer' as UserRole,
          email: primaryIsEmail ? config.slot1 : (config.slot2.includes('@') ? config.slot2 : 'phonphaihdvk@gmail.com'),
          phone: !primaryIsEmail ? config.slot1 : (config.slot2 || config.slot3),
          secondaryContact: [config.slot2, config.slot3].filter(Boolean).join(', '),
          backupIdentifiers: [config.slot1, config.slot2, config.slot3].filter(Boolean),
          passcode: config.sharedPasscode,
        };
      }
      return m;
    });
    saveMembers(updated);
  } catch (err) {
    console.error('Error saving developer backup config:', err);
  }
}

