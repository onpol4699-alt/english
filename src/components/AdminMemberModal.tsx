import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  FileEdit, 
  X, 
  Check, 
  AlertCircle, 
  Phone, 
  Mail, 
  Calendar, 
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Key,
  Copy,
  RefreshCw,
  HelpCircle,
  Flame,
  QrCode,
  Terminal
} from 'lucide-react';
import { DeveloperBackupModal } from './DeveloperBackupModal';
import { PersonalQrModal } from './PersonalQrModal';
import { AppMember, UserRole, UserProgress } from '../types';
import { 
  loadMembers, 
  updateMemberDetails, 
  updateMemberRole, 
  deleteMember,
  addMemberByAdmin,
} from '../utils/memberStorage';
import { 
  saveAccount, 
  updateAccountCredentials, 
  deleteAccountByIdentifier,
  loadAccountProgress
} from '../utils/storage';

interface AdminMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to parse unified contact (Email or Phone)
function parseUnifiedContact(input: string): {
  isEmail: boolean;
  email: string;
  phone: string;
  cleanIdentifier: string;
  isValid: boolean;
  error?: string;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isEmail: false, email: '', phone: '', cleanIdentifier: '', isValid: false, error: 'សូមបញ្ចូលអ៊ីមែល ឬលេខទូរស័ព្ទ (Please enter email or phone)' };
  }
  if (trimmed.includes('@')) {
    const cleanEmail = trimmed.toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { isEmail: true, email: cleanEmail, phone: '', cleanIdentifier: cleanEmail, isValid: false, error: 'ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ (e.g. name@gmail.com)' };
    }
    return { isEmail: true, email: cleanEmail, phone: '', cleanIdentifier: cleanEmail, isValid: true };
  } else {
    const cleanDigits = trimmed.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 8) {
      return { isEmail: false, email: '', phone: cleanDigits, cleanIdentifier: cleanDigits, isValid: false, error: 'លេខទូរស័ព្ទត្រូវមានយ៉ាងតិច ៨ ខ្ទង់ (Phone at least 8 digits)' };
    }
    return { isEmail: false, email: '', phone: cleanDigits, cleanIdentifier: cleanDigits, isValid: true };
  }
}

// Helper to parse multiple backup contacts (comma/semicolon/newline separated)
function parseBackupContacts(input: string): {
  contacts: string[];
  cleanList: string[];
} {
  if (!input) return { contacts: [], cleanList: [] };
  const rawList = input.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
  const cleanList: string[] = [];
  rawList.forEach(item => {
    if (item.includes('@')) {
      cleanList.push(item.toLowerCase());
    } else {
      const cleanDigits = item.replace(/[^0-9]/g, '');
      if (cleanDigits.length >= 8) {
        cleanList.push(cleanDigits);
      } else if (item.length >= 8) {
        cleanList.push(item);
      }
    }
  });
  return { contacts: rawList, cleanList };
}

export const AdminMemberModal: React.FC<AdminMemberModalProps> = ({ isOpen, onClose }) => {
  const [members, setMembers] = useState<AppMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | UserRole>('All');
  
  // Edit dialog state
  const [editingMember, setEditingMember] = useState<AppMember | null>(null);
  const [editName, setEditName] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editBackupContact, setEditBackupContact] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('Student');
  const [editPasscode, setEditPasscode] = useState('123456');
  const [showEditPasscode, setShowEditPasscode] = useState(false);
  const [editError, setEditError] = useState('');

  // Add dialog state
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isDevBackupModalOpen, setIsDevBackupModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newBackupContact, setNewBackupContact] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Student');
  const [newPasscode, setNewPasscode] = useState('123456');
  const [showNewPasscode, setShowNewPasscode] = useState(false);
  const [addError, setAddError] = useState('');

  // Delete confirmation state
  const [memberToDelete, setMemberToDelete] = useState<AppMember | null>(null);

  // Member QR Code / Digital ID Badge state
  const [selectedMemberForQr, setSelectedMemberForQr] = useState<AppMember | null>(null);

  const handleOpenMemberQr = (member: AppMember) => {
    setSelectedMemberForQr(member);
  };

  // Success toast
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  useEffect(() => {
    if (isOpen) {
      setMembers(loadMembers());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const query = searchQuery.toLowerCase().trim();
    const cleanDigits = query.replace(/[^0-9]/g, '');
    const matchQuery = 
      m.fullName.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.phone.includes(query) ||
      (m.secondaryContact && m.secondaryContact.toLowerCase().includes(query)) ||
      (m.backupIdentifiers && m.backupIdentifiers.some(b => b.toLowerCase().includes(query) || (cleanDigits && b.includes(cleanDigits))));

    const matchRole = roleFilter === 'All' || m.role === roleFilter;
    return matchQuery && matchRole;
  });

  // Role stats
  const devCount = members.filter(m => m.role === 'Developer').length;
  const adminCount = members.filter(m => m.role === 'Admin').length;
  const teacherCount = members.filter(m => m.role === 'Teacher').length;
  const studentCount = members.filter(m => m.role === 'Student').length;
  const editorCount = members.filter(m => m.role === 'Editor').length;

  // Generate random password helper
  const handleGeneratePassword = (setter: (pass: string) => void) => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setter(result);
  };

  // Open edit modal
  const handleStartEdit = (member: AppMember) => {
    setEditingMember(member);
    setEditName(member.fullName);
    setEditContact(member.email || member.phone || '');
    setEditBackupContact(
      member.secondaryContact || 
      (member.backupIdentifiers ? member.backupIdentifiers.filter(b => b !== member.email && b !== member.phone).join(', ') : '')
    );
    setEditRole(member.role);
    setEditPasscode(member.passcode || '123456');
    setShowEditPasscode(false);
    setEditError('');
  };

  // Submit edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');

    if (!editName.trim()) {
      setEditError('សូមបញ្ចូលឈ្មោះពេញ (Full name is required)');
      return;
    }

    const contactCheck = parseUnifiedContact(editContact);
    if (!contactCheck.isValid) {
      setEditError(contactCheck.error || 'សូមបញ្ចូលអ៊ីមែល ឬលេខទូរស័ព្ទឱ្យបានត្រឹមត្រូវ');
      return;
    }

    const finalPass = editPasscode.trim() || '123456';
    if (finalPass.length < 4) {
      setEditError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៤ ខ្ទង់ (Password at least 4 characters)');
      return;
    }

    if (!editingMember) return;

    const { cleanList: backupCleanList } = parseBackupContacts(editBackupContact);
    const primaryEmail = contactCheck.isEmail ? contactCheck.email : (editingMember.email.includes('@') ? editingMember.email : `${contactCheck.phone}@englishacademy.edu`);
    const primaryPhone = !contactCheck.isEmail ? contactCheck.phone : (editingMember.phone || '');

    const allBackups = Array.from(new Set([
      contactCheck.cleanIdentifier,
      ...backupCleanList
    ]));

    const updated = updateMemberDetails(editingMember.id, {
      fullName: editName.trim(),
      email: primaryEmail,
      phone: primaryPhone,
      role: editRole,
      passcode: finalPass,
      secondaryContact: editBackupContact.trim() || undefined,
      backupIdentifiers: allBackups,
    });

    // Synchronize accounts storage so member can login with primary or backup credentials immediately
    updateAccountCredentials(editingMember.email, {
      userName: editName.trim(),
      email: primaryEmail,
      phoneNumber: primaryPhone,
      secondaryContact: editBackupContact.trim() || undefined,
      backupIdentifiers: allBackups,
      role: editRole,
      passcode: finalPass,
    });
    if (editingMember.phone) {
      updateAccountCredentials(editingMember.phone, {
        userName: editName.trim(),
        email: primaryEmail,
        phoneNumber: primaryPhone,
        secondaryContact: editBackupContact.trim() || undefined,
        backupIdentifiers: allBackups,
        role: editRole,
        passcode: finalPass,
      });
    }

    // Also register backup contacts in account storage with the shared passcode
    backupCleanList.forEach(backupId => {
      saveAccount({
        id: `${editingMember.id}-bk-${backupId.replace(/[^a-zA-Z0-9]/g, '')}`,
        userName: editName.trim(),
        authMethod: backupId.includes('@') ? 'gmail' : 'phone',
        userIdentifier: backupId,
        email: backupId.includes('@') ? backupId : primaryEmail,
        phoneNumber: !backupId.includes('@') ? backupId : primaryPhone,
        secondaryContact: contactCheck.cleanIdentifier,
        backupIdentifiers: allBackups,
        passcode: finalPass,
        role: editRole,
        qrToken: `qr_${editingMember.id}_auth`,
        createdAt: new Date().toISOString(),
      });
    });

    setMembers(updated);
    setEditingMember(null);
    showToast('ព័ត៌មាន និងពាក្យសម្ងាត់សមាជិកត្រូវបានកែប្រែដោយជោគជ័យ! (Member updated)');
  };

  // Quick role change
  const handleQuickRoleChange = (memberId: string, role: UserRole) => {
    const member = members.find(m => m.id === memberId);
    if (member && member.email.toLowerCase() === 'phonphaihdvk@gmail.com' && role !== 'Admin') {
      showToast('គណនី Master Admin មិនអាចប្តូរតួនាទីបានឡើយ (Master Admin must remain Admin)');
      return;
    }

    const updated = updateMemberRole(memberId, role);
    if (member) {
      updateAccountCredentials(member.email, { role });
    }
    setMembers(updated);
    showToast(`បានផ្ទេរតួនាទីជា ${role} ដោយជោគជ័យ!`);
  };

  // Submit Add Member
  const handleSaveNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!newName.trim()) {
      setAddError('សូមបញ្ចូលឈ្មោះពេញ (Full name is required)');
      return;
    }

    const contactCheck = parseUnifiedContact(newContact);
    if (!contactCheck.isValid) {
      setAddError(contactCheck.error || 'សូមបញ្ចូលអ៊ីមែល ឬលេខទូរស័ព្ទឱ្យបានត្រឹមត្រូវ');
      return;
    }

    const finalPass = newPasscode.trim() || '123456';
    if (finalPass.length < 4) {
      setAddError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៤ ខ្ទង់ (Password at least 4 characters)');
      return;
    }

    const { cleanList: backupCleanList } = parseBackupContacts(newBackupContact);
    const primaryEmail = contactCheck.isEmail 
      ? contactCheck.email 
      : (backupCleanList.find(b => b.includes('@')) || `${contactCheck.phone}@englishacademy.edu`);
    const primaryPhone = !contactCheck.isEmail 
      ? contactCheck.phone 
      : (backupCleanList.find(b => !b.includes('@')) || '');

    const allBackups = Array.from(new Set([
      contactCheck.cleanIdentifier,
      ...backupCleanList
    ]));

    const newMem = addMemberByAdmin({
      fullName: newName.trim(),
      email: primaryEmail,
      phone: primaryPhone,
      role: newRole,
      passcode: finalPass,
      secondaryContact: newBackupContact.trim() || undefined,
      backupIdentifiers: allBackups,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(newName.trim())}&backgroundColor=c0aede`,
    });

    // Save primary account for instant login
    saveAccount({
      id: newMem.id,
      userName: newMem.fullName,
      authMethod: contactCheck.isEmail ? 'gmail' : 'phone',
      userIdentifier: contactCheck.cleanIdentifier,
      email: primaryEmail,
      phoneNumber: primaryPhone,
      secondaryContact: newBackupContact.trim() || undefined,
      backupIdentifiers: allBackups,
      passcode: finalPass,
      role: newRole,
      qrToken: `qr_${newMem.id}_auth`,
      createdAt: new Date().toISOString(),
    });

    // Also bind backup contacts as secondary logins linked with the same shared password
    backupCleanList.forEach(backupId => {
      saveAccount({
        id: `${newMem.id}-bk-${backupId.replace(/[^a-zA-Z0-9]/g, '')}`,
        userName: newMem.fullName,
        authMethod: backupId.includes('@') ? 'gmail' : 'phone',
        userIdentifier: backupId,
        email: backupId.includes('@') ? backupId : primaryEmail,
        phoneNumber: !backupId.includes('@') ? backupId : primaryPhone,
        secondaryContact: contactCheck.cleanIdentifier,
        backupIdentifiers: allBackups,
        passcode: finalPass,
        role: newRole,
        qrToken: `qr_${newMem.id}_auth`,
        createdAt: new Date().toISOString(),
      });
    });

    setMembers(loadMembers());
    setIsAddingMember(false);
    setNewName('');
    setNewContact('');
    setNewBackupContact('');
    setNewPasscode('123456');
    showToast('សមាជិកថ្មីត្រូវបានបន្ថែមដោយជោគជ័យ! (New member added)');
  };

  // Confirm delete member
  const handleConfirmDelete = () => {
    if (!memberToDelete) return;
    if (memberToDelete.email.toLowerCase() === 'phonphaihdvk@gmail.com') {
      showToast('គណនី Master Admin មិនអាចលុបបានឡើយ (Master Admin cannot be deleted)');
      setMemberToDelete(null);
      return;
    }

    const updated = deleteMember(memberToDelete.id);
    deleteAccountByIdentifier(memberToDelete.email);
    if (memberToDelete.phone) {
      deleteAccountByIdentifier(memberToDelete.phone);
    }
    if (memberToDelete.backupIdentifiers) {
      memberToDelete.backupIdentifiers.forEach(b => deleteAccountByIdentifier(b));
    }
    setMembers(updated);
    setMemberToDelete(null);
    showToast('គណនីត្រូវបានលុបចេញពីប្រព័ន្ធដោយជោគជ័យ! (Account deleted)');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Developer':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Teacher':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Editor':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Student':
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Developer':
        return <Terminal className="w-3.5 h-3.5 text-indigo-700" />;
      case 'Admin':
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />;
      case 'Teacher':
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />;
      case 'Editor':
        return <FileEdit className="w-3.5 h-3.5 text-amber-700" />;
      case 'Student':
      default:
        return <BookOpen className="w-3.5 h-3.5 text-blue-700" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        id="admin-member-modal-card"
        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col h-[94vh] sm:h-auto sm:max-h-[90vh] my-auto"
      >
        {/* Top Header - Modern Clean Light Design */}
        <div className="p-4 sm:p-5 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
              <Users className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  <span className="text-slate-900 font-bold">Admin Portal</span>
                  <span className="text-slate-300 mx-1 font-normal">•</span>
                  <span className="text-blue-600 font-extrabold">Member Management</span>
                </h2>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                  Admin Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 font-khmer mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <span>គ្រប់គ្រងសមាជិក កែប្រែព័ត៌មាន ផ្ទេរតួនាទី និងពាក្យសម្ងាត់ (Real-time)</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer active:scale-95 border border-slate-200"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bar (Ultra-compact & responsive on mobile) */}
        <div className="px-3 py-2 sm:p-3 bg-slate-50/90 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 flex items-center gap-2">
            <span className="text-slate-500 font-medium">សរុប (Total):</span>
            <span className="font-bold text-slate-900">{members.length} នាក់</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 shadow-2xs shrink-0 flex items-center gap-1.5 text-indigo-700">
            <Terminal className="w-3.5 h-3.5" />
            <span className="font-medium">Dev:</span>
            <span className="font-bold">{devCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 shadow-2xs shrink-0 flex items-center gap-1.5 text-purple-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">Admin:</span>
            <span className="font-bold">{adminCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 shadow-2xs shrink-0 flex items-center gap-1.5 text-emerald-700">
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="font-medium">Teacher:</span>
            <span className="font-bold">{teacherCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 shadow-2xs shrink-0 flex items-center gap-1.5 text-amber-700">
            <FileEdit className="w-3.5 h-3.5" />
            <span className="font-medium">Editor:</span>
            <span className="font-bold">{editorCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 shadow-2xs shrink-0 flex items-center gap-1.5 text-blue-700">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-medium">Student:</span>
            <span className="font-bold">{studentCount}</span>
          </div>
        </div>

        {/* Filter & Action Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 bg-white shrink-0">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ស្វែងរកតាមឈ្មោះ, អ៊ីមែល, ឬលេខទូរស័ព្ទ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Role Filter Tabs & Add Member Button */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {(['All', 'Developer', 'Admin', 'Teacher', 'Editor', 'Student'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  roleFilter === role
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {role === 'All' ? 'ទាំងអស់ (All)' : role}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              {/* Developer Failover Backup Modal Button */}
              <button
                type="button"
                onClick={() => setIsDevBackupModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer whitespace-nowrap"
                title="កំណត់ Gmail ឬលេខទូរស័ព្ទបម្រុងទុក ៣ ជម្រើសសម្រាប់ Developer"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>⚡ គណនីបម្រុងទុក Developer</span>
              </button>

              {/* Add Member Button */}
              <button
                type="button"
                onClick={() => {
                  setIsAddingMember(true);
                  setAddError('');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ បន្ថែមសមាជិក</span>
              </button>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {toastMsg && (
          <div className="mx-3 mt-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in shrink-0">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Members List Container - Enhanced with touch-pan-y and smooth scrolling for mobile */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 touch-pan-y overscroll-contain">
          {filteredMembers.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">មិនមានសមាជិកត្រូវនឹងការស្វែងរកឡើយ</p>
              <p className="text-xs text-slate-400 font-khmer mt-0.5">
                សូមសាកល្បងវាយឈ្មោះ អ៊ីមែល ឬលេខទូរស័ព្ទម្តងទៀត
              </p>
            </div>
          ) : (
            <>
              {/* MOBILE VIEW: Touch-Friendly Card List (No getting stuck on phones) */}
              <div className="block sm:hidden space-y-3">
                {filteredMembers.map((member) => (
                  <div 
                    key={`mobile-${member.id}`} 
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5 hover:border-indigo-200 transition"
                  >
                    {/* Header: Avatar, Name, Role */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={member.fullName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm truncate">
                            {member.fullName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            ID: {member.id.replace('mem-', '')} • {member.joinedDate}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold border ${getRoleBadge(member.role)}`}>
                          {getRoleIcon(member.role)}
                          <span>{member.role}</span>
                        </span>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="bg-slate-50 rounded-xl p-2.5 space-y-1.5 text-xs font-mono">
                      {/* Primary Contact */}
                      <div className="flex items-center gap-2 text-slate-800 truncate">
                        {member.email?.includes('@') ? (
                          <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        ) : (
                          <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        )}
                        <span className="font-semibold truncate">
                          {member.email || member.phone || 'N/A'}
                        </span>
                      </div>

                      {/* Phone if different from primary */}
                      {member.phone && member.email && member.phone !== member.email && (
                        <div className="flex items-center gap-2 text-slate-600 truncate">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}

                      {/* Backup Contacts (Developer feature) */}
                      {member.secondaryContact && (
                        <div className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50/80 px-2 py-1 rounded-lg text-[11px] truncate">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="font-khmer font-bold shrink-0">បម្រុងទុក:</span>
                          <span className="truncate">{member.secondaryContact}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom: Password pill & Action buttons */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span className="font-bold">{member.passcode || '123456'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Dedicated QR Code / Digital ID Badge Button for all roles */}
                        <button
                          type="button"
                          id={`member-qr-btn-mobile-${member.id}`}
                          onClick={() => handleOpenMemberQr(member)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs"
                          title={`View & Download Digital ID Badge / Login QR Code for ${member.fullName} (${member.role})`}
                        >
                          <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                          <span>📱 QR</span>
                        </button>

                        {/* Quick Role Dropdown */}
                        <select
                          value={member.role}
                          onChange={(e) => handleQuickRoleChange(member.id, e.target.value as UserRole)}
                          className="text-[11px] bg-slate-100 border border-slate-200 rounded-lg py-1 px-1.5 text-slate-700 font-medium focus:outline-none cursor-pointer"
                        >
                          <option value="Developer">Developer</option>
                          <option value="Admin">Admin</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Editor">Editor</option>
                          <option value="Student">Student</option>
                        </select>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleStartEdit(member)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>កែ</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setMemberToDelete(member)}
                          className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP VIEW: Full Scrollable Table */}
              <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Member / ឈ្មោះសមាជិក</th>
                      <th className="py-3 px-3">Role / តួនាទី</th>
                      <th className="py-3 px-3">Contact / អ៊ីមែល ឬទូរស័ព្ទ</th>
                      <th className="py-3 px-3">Backup / បម្រុងទុក</th>
                      <th className="py-3 px-3">Passcode / ពាក្យសម្ងាត់</th>
                      <th className="py-3 px-3">Joined / កាលបរិច្ឆេទ</th>
                      <th className="py-3 px-4 text-right">Actions / សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredMembers.map((member) => (
                      <tr key={`desktop-${member.id}`} className="hover:bg-slate-50/80 transition-colors">
                        {/* Name & Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                              alt={member.fullName}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-sm">
                                {member.fullName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                ID: {member.id.replace('mem-', '')}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Pill & Quick Transfer */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${getRoleBadge(member.role)}`}>
                              {getRoleIcon(member.role)}
                              <span>{member.role}</span>
                            </span>

                            <select
                              value={member.role}
                              onChange={(e) => handleQuickRoleChange(member.id, e.target.value as UserRole)}
                              className="text-[11px] bg-slate-50 border border-slate-200 rounded-md py-0.5 px-1 text-slate-600 focus:outline-none hover:bg-slate-100 cursor-pointer"
                              title="Quick change role"
                            >
                              <option value="Developer">Developer</option>
                              <option value="Admin">Admin</option>
                              <option value="Teacher">Teacher</option>
                              <option value="Editor">Editor</option>
                              <option value="Student">Student</option>
                            </select>
                          </div>
                        </td>

                        {/* Primary Contact (Email or Phone) */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[11px]">
                            {member.email?.includes('@') ? (
                              <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            ) : (
                              <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            )}
                            <span className="font-semibold text-slate-900">
                              {member.email || member.phone || 'N/A'}
                            </span>
                          </div>
                          {member.phone && member.email && member.phone !== member.email && (
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              Phone: {member.phone}
                            </div>
                          )}
                        </td>

                        {/* Backup Contacts */}
                        <td className="py-3 px-3">
                          {member.secondaryContact ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-medium max-w-[150px] truncate" title={member.secondaryContact}>
                              <ShieldCheck className="w-3 h-3 text-indigo-600 shrink-0" />
                              <span className="truncate">{member.secondaryContact}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Passcode preview */}
                        <td className="py-3 px-3">
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px]">
                            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="font-semibold">{member.passcode || '123456'}</span>
                          </div>
                        </td>

                        {/* Joined Date */}
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{member.joinedDate}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Dedicated QR Code / Digital ID Badge Button for all roles */}
                            <button
                              type="button"
                              id={`member-qr-btn-${member.id}`}
                              onClick={() => handleOpenMemberQr(member)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition flex items-center gap-1.5 font-bold text-xs cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                              title={`View & Download Digital ID Badge / Login QR Code for ${member.fullName} (${member.role})`}
                            >
                              <QrCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-semibold text-xs">📱 QR</span>
                            </button>

                            <button
                              onClick={() => handleStartEdit(member)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition cursor-pointer"
                              title="Edit member details (កែប្រែព័ត៌មាន)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setMemberToDelete(member)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition cursor-pointer"
                              title="Delete member (លុបសមាជិក)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="font-khmer">
            បញ្ជាក់៖ ការផ្លាស់ប្តូរតួនាទី ឬការកែប្រែទិន្នន័យ ត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិក្នុងប្រព័ន្ធ (Persistent Storage)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition cursor-pointer"
          >
            បិទ (Close)
          </button>
        </div>
      </div>

      {/* Edit Member Sub-Dialog */}
      {editingMember && (
        <div className="fixed inset-0 z-[10010] bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-5 sm:p-6 my-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  កែប្រែព័ត៌មានសមាជិក (Edit Member)
                </h3>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5">
              {editError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (ឈ្មោះពេញ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Heng Vannak"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              {/* Unified Contact: Email or Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  អ៊ីមែល ឬ លេខទូរស័ព្ទ (Email or Phone Number) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  placeholder="e.g. vannak@gmail.com ឬ 012889900"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                />
              </div>

              {/* Specific Password Setup */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    កំណត់ពាក្យសម្ងាត់ជាក់លាក់ (Specific Password) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleGeneratePassword(setEditPasscode)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>បង្កើតកូដចៃដន្យ</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showEditPasscode ? 'text' : 'password'}
                    required
                    value={editPasscode}
                    onChange={(e) => setEditPasscode(e.target.value)}
                    placeholder="បញ្ចូលពាក្យសម្ងាត់ជាក់លាក់ (e.g. 123456)"
                    className="w-full pl-3.5 pr-10 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPasscode(!showEditPasscode)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    title={showEditPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showEditPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Transfer */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role Assignment (កំណត់តួនាទី)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Developer', 'Admin', 'Teacher', 'Editor', 'Student'] as UserRole[]).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setEditRole(r)}
                      className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-between cursor-pointer ${
                        editRole === r
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{r}</span>
                      {editRole === r && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  រក្សាទុក (Save Changes)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Member Sub-Dialog */}
      {isAddingMember && (
        <div className="fixed inset-0 z-[10010] bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-5 sm:p-6 my-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  បន្ថែមសមាជិកថ្មី (Add New Member)
                </h3>
              </div>
              <button
                onClick={() => setIsAddingMember(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewMember} className="mt-4 space-y-3.5">
              {addError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (ឈ្មោះពេញ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Heng Vannak"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              {/* Unified Contact Input: "អ៊ីមែល ឬ លេខទូរស័ព្ទ" */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  អ៊ីមែល ឬ លេខទូរស័ព្ទ (Email or Phone Number) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder="e.g. vannak.student@gmail.com ឬ 012889900"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                />
              </div>

              {/* Specific Password Setup by Developer */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    កំណត់ពាក្យសម្ងាត់ជាក់លាក់ (Specific Password) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleGeneratePassword(setNewPasscode)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>បង្កើតកូដចៃដន្យ</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewPasscode ? 'text' : 'password'}
                    required
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="បញ្ចូលពាក្យសម្ងាត់ជាក់លាក់ (e.g. 123456)"
                    className="w-full pl-3.5 pr-10 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPasscode(!showNewPasscode)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    title={showNewPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showNewPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role Assignment (កំណត់តួនាទី)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Developer', 'Admin', 'Teacher', 'Editor', 'Student'] as UserRole[]).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setNewRole(r)}
                      className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-between cursor-pointer ${
                        newRole === r
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{r}</span>
                      {newRole === r && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  បន្ថែមសមាជិក (Add Member)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {memberToDelete && (
        <div className="fixed inset-0 z-[10020] bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-rose-100 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center mb-4">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="font-bold text-slate-900 text-lg font-khmer">
              តើអ្នកពិតជាចង់លុបគណនីនេះមែនទេ?
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              តើអ្នកប្រាកដជាចង់លុបគណនី <strong className="text-slate-900 font-bold">{memberToDelete.fullName}</strong> ({memberToDelete.email}) មែនឬទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានឡើយ។
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                ទេ បោះបង់ (Cancel)
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                បាទ/ចាស លុបគណនី (Yes, Delete)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Developer Failover Backup Contacts Modal */}
      <DeveloperBackupModal
        isOpen={isDevBackupModalOpen}
        onClose={() => {
          setIsDevBackupModalOpen(false);
          setMembers(loadMembers());
        }}
        onSuccessToast={showToast}
      />

      {/* Member Digital ID Badge / Login QR Code Modal */}
      {selectedMemberForQr && (
        <PersonalQrModal
          isOpen={Boolean(selectedMemberForQr)}
          onClose={() => setSelectedMemberForQr(null)}
          progress={{
            ...loadAccountProgress(selectedMemberForQr.email || selectedMemberForQr.phone || selectedMemberForQr.id),
            userName: selectedMemberForQr.fullName,
            email: selectedMemberForQr.email,
            phoneNumber: selectedMemberForQr.phone,
            role: selectedMemberForQr.role,
            userIdentifier: selectedMemberForQr.email || selectedMemberForQr.phone || selectedMemberForQr.id,
            avatarUrl: selectedMemberForQr.avatarUrl,
            secondaryContact: selectedMemberForQr.secondaryContact,
            backupIdentifiers: selectedMemberForQr.backupIdentifiers,
            passcode: selectedMemberForQr.passcode,
          } as UserProgress}
        />
      )}
    </div>
  );
};
