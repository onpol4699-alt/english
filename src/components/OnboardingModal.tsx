import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  Plane, 
  GraduationCap, 
  Check, 
  Heart, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Camera, 
  Upload, 
  AlertCircle,
  LogIn,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  QrCode,
  KeyRound,
  MapPin,
  Globe,
  Calendar,
  X,
  HelpCircle,
  Star,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  UserProgress, 
  LearningGoal, 
  DifficultyLevel, 
  AppBrandConfig, 
  UserAccount, 
  AuthMethod, 
  UserRole, 
  UserGender 
} from '../types';
import { BrandLogo } from './BrandLogo';
import { AngkorLogo } from './AngkorLogo';
import { saveAccount, findAccountByCredentials, setActiveUserIdentifier, resetAccountPasswordWithDob } from '../utils/storage';
import { registerUserAsMember, isMasterAdmin, isDeveloperIdentifier } from '../utils/memberStorage';
import { getStoredUserAvatar, saveAndSyncAvatar, compressImageFile } from '../utils/avatarUtils';
import { QrLoginScanner } from './QrLoginScanner';
import { playCorrectSound, playFanfareSound, playIncorrectSound } from '../utils/audio';

export const CAMBODIAN_PROVINCES = [
  'រាជធានីភ្នំពេញ (Phnom Penh)',
  'ខេត្តសៀមរាប (Siem Reap)',
  'ខេត្តបាត់ដំបង (Battambang)',
  'ខេត្តកណ្តាល (Kandal)',
  'ខេត្តកំពង់ចាម (Kampong Cham)',
  'ខេត្តព្រះសីហនុ (Preah Sihanouk)',
  'ខេត្តកំពត (Kampot)',
  'ខេត្តតាកែវ (Takeo)',
  'ខេត្តកំពង់ស្ពឺ (Kampong Speu)',
  'ខេត្តកំពង់ធំ (Kampong Thom)',
  'ខេត្តកំពង់ឆ្នាំង (Kampong Chhnang)',
  'ខេត្តបន្ទាយមានជ័យ (Banteay Meanchey)',
  'ខេត្តពោធិ៍សាត់ (Pursat)',
  'ខេត្តព្រៃវែង (Prey Veng)',
  'ខេត្តស្វាយរៀង (Svay Rieng)',
  'ខេត្តរតនគិរី (Ratanakiri)',
  'ខេត្តមណ្ឌលគិរី (Mondulkiri)',
  'ខេត្តស្ទឹងត្រែង (Stung Treng)',
  'ខេត្តក្រចេះ (Kratie)',
  'ខេត្តព្រះវិហារ (Preah Vihear)',
  'ខេត្តកែប (Kep)',
  'ខេត្តប៉ៃលិន (Pailin)',
  'ខេត្តកោះកុង (Koh Kong)',
  'ខេត្តឧត្តរមានជ័យ (Oddar Meanchey)',
  'ខេត្តត្បូងឃ្មុំ (Tboung Khmum)',
];

export const CAMBODIAN_PROVINCES_EN = [
  'Phnom Penh',
  'Siem Reap',
  'Battambang',
  'Kandal',
  'Kampong Cham',
  'Preah Sihanouk',
  'Kampot',
  'Takeo',
  'Kampong Speu',
  'Kampong Thom',
  'Kampong Chhnang',
  'Banteay Meanchey',
  'Pursat',
  'Prey Veng',
  'Svay Rieng',
  'Ratanakiri',
  'Mondulkiri',
  'Stung Treng',
  'Kratie',
  'Preah Vihear',
  'Kep',
  'Pailin',
  'Koh Kong',
  'Oddar Meanchey',
  'Tboung Khmum',
];

export const COUNTRIES_LIST = [
  'កម្ពុជា (Cambodia)',
  'ថៃ (Thailand)',
  'វៀតណាម (Vietnam)',
  'ឡាវ (Laos)',
  'សហរដ្ឋអាមេរិក (USA)',
  'បារាំង (France)',
  'កូរ៉េខាងត្បូង (South Korea)',
  'ជប៉ុន (Japan)',
  'អូស្ត្រាលី (Australia)',
  'ផ្សេងៗ (Other)',
];

export const COUNTRIES_LIST_EN = [
  'Cambodia',
  'Thailand',
  'Vietnam',
  'Laos',
  'USA',
  'France',
  'South Korea',
  'Japan',
  'Australia',
  'Other',
];

interface OnboardingModalProps {
  currentProgress: UserProgress;
  onComplete: (updatedProgress: Partial<UserProgress>) => void;
  brand?: AppBrandConfig;
  isEditing?: boolean;
  onClose?: () => void;
  initialTab?: 'register' | 'signin';
  onSkipToDashboard?: () => void;
  onUpdateSettings?: (updatedSettings: Partial<UserProgress>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  currentProgress,
  onComplete,
  brand,
  isEditing = false,
  onClose,
  initialTab,
  onSkipToDashboard,
  onUpdateSettings,
}) => {
  // Mode: Sign In vs Register (Profile Edit uses Register mode)
  const [localLang, setLocalLang] = useState<'km' | 'en'>(currentProgress.appLanguage || 'km');

  React.useEffect(() => {
    if (currentProgress.appLanguage) {
      setLocalLang(currentProgress.appLanguage);
    }
  }, [currentProgress.appLanguage]);

  const isEn = localLang === 'en';

  const handleToggleLanguage = () => {
    const nextLang = isEn ? 'km' : 'en';
    setLocalLang(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eng_kh_app_language', nextLang);
    }
    if (onUpdateSettings) {
      onUpdateSettings({ appLanguage: nextLang });
    }
  };

  const [tabMode, setTabMode] = useState<'register' | 'signin'>(
    isEditing ? 'register' : (initialTab || 'signin')
  );

  React.useEffect(() => {
    if (!isEditing) {
      setTabMode(initialTab || 'signin');
      setErrorMsg('');
      setShowForgotModal(false);
    }
  }, [isEditing, initialTab]);
  
  // Dual Login System Mode: 'credentials' or 'qr'
  const [signInSubTab, setSignInSubTab] = useState<'credentials' | 'qr'>('credentials');

  // Registration form fields (strictly empty on initial load, no auto-fill)
  const [fullName, setFullName] = useState(isEditing ? (currentProgress.userName || '') : '');
  const [contactInput, setContactInput] = useState(
    isEditing ? (currentProgress.email || currentProgress.phoneNumber || currentProgress.userIdentifier || '') : ''
  );
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [gender, setGender] = useState<UserGender>(currentProgress.gender || 'unspecified');
  const [country, setCountry] = useState<string>(currentProgress.country || 'កម្ពុជា (Cambodia)');
  const [province, setProvince] = useState<string>(currentProgress.province || 'រាជធានីភ្នំពេញ (Phnom Penh)');
  const [dateOfBirth, setDateOfBirth] = useState<string>(
    isEditing ? (currentProgress.dateOfBirth || '') : ''
  );
  const [isoDate, setIsoDate] = useState<string>(() => {
    if (isEditing && currentProgress.dateOfBirth) {
      const parts = currentProgress.dateOfBirth.split('/');
      if (parts.length === 3 && parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return '';
  });
  const [dobMode, setDobMode] = useState<'picker' | 'manual'>('picker');
  const datePickerRef = React.useRef<HTMLInputElement>(null);

  const [toastAlert, setToastAlert] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return (
      currentProgress.avatarUrl ||
      getStoredUserAvatar(currentProgress.userIdentifier, currentProgress.userName) ||
      'https://api.dicebear.com/7.x/adventurer/svg?seed=Dara&backgroundColor=c0aede'
    );
  });
  const [goal, setGoal] = useState<LearningGoal>(currentProgress.learningGoal || 'conversation');
  const [level, setLevel] = useState<DifficultyLevel>(currentProgress.currentLevel || 'beginner');
  const [dailyMinutes, setDailyMinutes] = useState<number>(currentProgress.dailyGoalMinutes || 15);

  // Traditional Credentials Sign In fields
  const [signInInput, setSignInInput] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot Password Dialog State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotDob, setForgotDob] = useState('');
  const [forgotIsoDate, setForgotIsoDate] = useState('');
  const [forgotDobMode, setForgotDobMode] = useState<'text' | 'picker'>('text');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Forgot Password DOB Handlers
  const handleForgotManualDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForgotDob(val);

    if (val.includes('/')) {
      const parts = val.split('/');
      if (parts.length === 3 && parts[2].length === 4) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        setForgotIsoDate(`${year}-${month}-${day}`);
      }
    } else if (val.includes('-')) {
      const parts = val.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        setForgotIsoDate(val);
        setForgotDob(`${parts[2]}/${parts[1]}/${parts[0]}`);
      }
    }
  };

  const handleForgotNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoVal = e.target.value;
    setForgotIsoDate(isoVal);
    if (isoVal) {
      const [y, m, d] = isoVal.split('-');
      setForgotDob(`${d}/${m}/${y}`);
    }
  };

  // Submit Password Reset via Date of Birth Verification
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const targetId = forgotIdentifier.trim();
    if (!targetId) {
      setForgotError(isEn ? 'Please enter your Name, Email (@gmail.com) or Phone Number' : 'សូមបញ្ចូលឈ្មោះ, Email (@gmail.com) ឬ លេខទូរស័ព្ទ');
      playIncorrectSound();
      return;
    }

    const targetDob = forgotDob.trim();
    if (!targetDob) {
      setForgotError(isEn ? 'Please enter your Date of Birth for verification' : 'សូមបញ្ចូលថ្ងៃ ខែ ឆ្នាំកំណើត (Date of Birth) សម្រាប់ផ្ទៀងផ្ទាត់');
      playIncorrectSound();
      return;
    }

    const newPass = forgotNewPassword.trim();
    if (!newPass || newPass.length < 4) {
      setForgotError(isEn ? 'New password must be at least 4 characters' : 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៤ ខ្ទង់');
      playIncorrectSound();
      return;
    }

    if (newPass !== forgotConfirmPassword.trim()) {
      setForgotError(isEn ? 'Passwords do not match! Please verify again.' : 'ពាក្យសម្ងាត់ទាំងពីរមិនដូចគ្នាទេ! សូមផ្ទៀងផ្ទាត់ឡើងវិញ');
      playIncorrectSound();
      return;
    }

    setIsResetting(true);
    const res = resetAccountPasswordWithDob(targetId, targetDob, newPass);
    setIsResetting(false);

    if (!res.success) {
      setForgotError(isEn ? (res.messageEn || res.messageKh) : res.messageKh);
      playIncorrectSound();
      return;
    }

    playCorrectSound();
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    } catch {
      // ignore
    }

    setForgotSuccess(isEn ? (res.messageEn || 'Password updated successfully!') : res.messageKh);
    setSignInInput(targetId);
    setSignInPassword(newPass);

    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess('');
      setForgotError('');
    }, 1800);
  };

  // Handle manual typing in DD/MM/YYYY format
  const handleManualDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateOfBirth(val);

    // Sync with native date picker
    if (val.includes('/')) {
      const parts = val.split('/');
      if (parts.length === 3 && parts[2].length === 4) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        setIsoDate(`${year}-${month}-${day}`);
      }
    } else if (val.includes('-')) {
      const parts = val.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        setIsoDate(val);
        setDateOfBirth(`${parts[2]}/${parts[1]}/${parts[0]}`);
      }
    }
  };

  // Handle native picker change (triggered when clicking the calendar icon/button)
  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoVal = e.target.value; // e.g. "2000-08-15"
    setIsoDate(isoVal);
    if (isoVal) {
      const [y, m, d] = isoVal.split('-');
      setDateOfBirth(`${d}/${m}/${y}`);
    }
  };

  // Direct Bypass to Dashboard for Developer / Admin
  const handleSkipToDashboard = () => {
    if (onSkipToDashboard) {
      onSkipToDashboard();
      return;
    }
    const masterAccount = findAccountByCredentials('phonphaihdvk@gmail.com', '123456');
    if (masterAccount) {
      setActiveUserIdentifier(masterAccount.userIdentifier);
      onComplete({
        userName: masterAccount.userName,
        email: masterAccount.email,
        phoneNumber: masterAccount.phoneNumber,
        role: 'Developer',
        authMethod: 'gmail',
        userIdentifier: masterAccount.userIdentifier,
        qrToken: masterAccount.qrToken,
        avatarUrl: masterAccount.avatarUrl,
        appLanguage: localLang,
        hasCompletedOnboarding: true,
        isAuthenticated: true,
      });
    } else {
      onComplete({
        userName: 'Phon Phai',
        email: 'phonphaihdvk@gmail.com',
        phoneNumber: '012889900',
        role: 'Developer',
        authMethod: 'gmail',
        userIdentifier: 'phonphaihdvk@gmail.com',
        appLanguage: localLang,
        hasCompletedOnboarding: true,
        isAuthenticated: true,
      });
    }
  };

  // 3D Stylized Adventurer Presets
  const presetAvatars = [
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Dara&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophea&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Lucky&backgroundColor=d1d4f9',
  ];

  // Avatar file upload handler
  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(isEn ? 'Image must be under 5MB' : 'រូបភាពត្រូវមានទំហំតូចជាង ៥MB (Image must be under 5MB)');
      return;
    }

    try {
      const compressed = await compressImageFile(file);
      setAvatarUrl(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Registration Form
  const showToastAlert = (msg: string) => {
    setToastAlert(msg);
    playIncorrectSound();
    setTimeout(() => setToastAlert(null), 4500);
  };

  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setToastAlert(null);
    setErrorMsg('');

    // 1) Full Name (ឈ្មោះ និងត្រកូល) Validation
    const cleanName = fullName.trim();
    if (!cleanName) {
      showToastAlert(isEn ? 'Please enter your full name (First & Last)' : 'សូមបញ្ចូលឈ្មោះ និងត្រកូលរបស់អ្នក (Full Name is required)');
      return;
    }

    // 2) Flexible Contact Validation (Email ending in @gmail.com OR phone number with >= 9 digits)
    const cleanContact = contactInput.trim();
    if (!cleanContact) {
      showToastAlert(isEn ? 'Please enter your Email (@gmail.com) or Phone Number' : 'សូមបញ្ចូល Email (@gmail.com) ឬ លេខទូរស័ព្ទ (Contact is required)');
      return;
    }

    // Sign Up Lock: Block standard users from signing up using Developer Master Credentials
    if (!isEditing && isDeveloperIdentifier(cleanContact)) {
      showToastAlert(isEn 
        ? '⚠️ This master credential is reserved for Developer/Admin. Please Sign In instead.' 
        : '⚠️ គណនីនេះត្រូវបានរក្សាទុកសម្រាប់ Master Developer/Admin ប៉ុណ្ណោះ! សូមចូលគណនី (Sign In) ជំនួសវិញ។ (This master credential is reserved for Developer/Admin. Please Sign In instead.)');
      playIncorrectSound();
      return;
    }

    const digitsOnly = cleanContact.replace(/[^0-9]/g, '');
    const isPhoneCandidate = !cleanContact.includes('@');

    if (isPhoneCandidate) {
      // Must be at least 9 digits
      if (digitsOnly.length < 9) {
        showToastAlert(isEn ? 'Phone number must have at least 9 digits' : 'លេខទូរស័ព្ទត្រូវមានយ៉ាងតិច ៩ ខ្ទង់ (Phone number must have at least 9 digits)');
        return;
      }
    } else {
      // Must be a valid Gmail ending with @gmail.com
      if (!cleanContact.toLowerCase().endsWith('@gmail.com')) {
        showToastAlert(isEn ? 'Email must end with @gmail.com' : 'អ៊ីមែលត្រូវតែបញ្ចប់ដោយ @gmail.com (Email must end with @gmail.com)');
        return;
      }
    }

    // 3) Password validation
    if (!regPassword || regPassword.length < 4) {
      showToastAlert(isEn ? 'Password must be at least 4 characters' : 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៤ តួអក្សរ (Password must be at least 4 characters)');
      return;
    }

    // 4) Duplicate registration check for new accounts
    if (!isEditing) {
      const existingAccount = findAccountByCredentials(cleanContact);
      if (existingAccount) {
        showToastAlert(isEn 
          ? 'An account with this email or phone is already registered. Please sign in instead.' 
          : 'គណនីនេះបានចុះឈ្មោះរួចហើយ! សូមចុច "ចូលគណនី" (Sign In) ជំនួសវិញ');
        setSignInInput(cleanContact);
        setTabMode('signin');
        return;
      }
    }

    const isGmail = !isPhoneCandidate;
    const userEmail = isGmail ? cleanContact.toLowerCase() : '';
    const userPhone = isPhoneCandidate ? cleanContact : '';
    const authMethod: AuthMethod = isGmail ? 'gmail' : 'phone';
    const qrToken = `qr_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const isMaster = isMasterAdmin(cleanContact, cleanName);
    const assignedRole: UserRole = isMaster ? 'Admin' : 'Student';

    // Register into Member Storage Directory with full profile details
    registerUserAsMember(
      cleanName, 
      userEmail || `${digitsOnly}@student.app`, 
      userPhone || 'N/A', 
      avatarUrl,
      regPassword,
      {
        gender,
        country,
        province,
        dateOfBirth: dateOfBirth.trim() || undefined,
        learningGoal: goal,
        dailyGoalMinutes: dailyMinutes,
        level,
        role: assignedRole,
        xp: currentProgress.xp || 0,
        totalStudySeconds: currentProgress.totalStudySeconds || 0,
      }
    );

    // Save user account for local credential lookup & QR authentication
    const account: UserAccount = {
      id: `acc-${Date.now()}`,
      userName: cleanName,
      authMethod,
      userIdentifier: cleanContact,
      email: userEmail || undefined,
      phoneNumber: userPhone || undefined,
      passcode: regPassword,
      role: assignedRole,
      gender,
      country,
      province,
      dateOfBirth: dateOfBirth.trim() || undefined,
      avatarUrl,
      qrToken,
      learningGoal: goal,
      dailyGoalMinutes: dailyMinutes,
      level,
      xp: currentProgress.xp || 0,
      totalStudySeconds: currentProgress.totalStudySeconds || 0,
      completedLessonIds: currentProgress.completedLessonIds || [],
      masteredVocabIds: currentProgress.masteredVocabIds || [],
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    saveAccount(account);
    setActiveUserIdentifier(cleanContact);
    if (avatarUrl) {
      saveAndSyncAvatar(avatarUrl, cleanContact, cleanName);
    }

    playFanfareSound();
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    const updated: Partial<UserProgress> = {
      userName: cleanName,
      email: userEmail || undefined,
      phoneNumber: userPhone || undefined,
      role: assignedRole,
      authMethod,
      userIdentifier: cleanContact,
      gender,
      country,
      province,
      dateOfBirth: dateOfBirth.trim() || undefined,
      qrToken,
      avatarUrl,
      learningGoal: goal,
      currentLevel: level,
      unlockedLevels: Array.from(new Set([...currentProgress.unlockedLevels, level])),
      dailyGoalMinutes: dailyMinutes,
      appLanguage: localLang,
      hasCompletedOnboarding: true,
      isAuthenticated: true,
    };

    onComplete(updated);
  };

  // Submit Traditional Credentials Login
  const handleSubmitCredentialsSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const target = signInInput.trim();
    if (!target) {
      setErrorMsg(isEn ? 'Please enter your Name, Email (@gmail.com) or Phone Number' : 'សូមបញ្ចូលឈ្មោះ, Email (@gmail.com) ឬ លេខទូរស័ព្ទ');
      return;
    }

    if (!signInPassword) {
      setErrorMsg(isEn ? 'Password is required' : 'សូមបញ្ចូលពាក្យសម្ងាត់ (Password is required)');
      return;
    }

    const existingAccount = findAccountByCredentials(target, signInPassword);
    if (!existingAccount) {
      if (isDeveloperIdentifier(target)) {
        setErrorMsg(isEn 
          ? 'Incorrect password for Developer credential!' 
          : 'ពាក្យសម្ងាត់អ្នកអភិវឌ្ឍន៍ (Developer Password) មិនត្រឹមត្រូវទេ! (Incorrect password for Developer credential)');
      } else {
        setErrorMsg(isEn ? 'Incorrect name, email, or password. Please try again.' : 'ឈ្មោះ គណនី ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ (Invalid credentials)');
      }
      playIncorrectSound();
      return;
    }

    const cleanId = existingAccount.userIdentifier.trim().toLowerCase();
    setActiveUserIdentifier(cleanId);
    playFanfareSound();
    try {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    const userRole: UserRole = existingAccount.role || (isMasterAdmin(existingAccount.userIdentifier, existingAccount.userName) ? 'Admin' : 'Student');

    const persistentAvatar = 
      existingAccount.avatarUrl || 
      getStoredUserAvatar(cleanId, existingAccount.userName) || 
      avatarUrl;

    if (persistentAvatar) {
      saveAndSyncAvatar(persistentAvatar, cleanId, existingAccount.userName);
    }

    const updated: Partial<UserProgress> = {
      userName: existingAccount.userName,
      email: existingAccount.email || (existingAccount.userIdentifier.includes('@') ? existingAccount.userIdentifier : undefined),
      phoneNumber: existingAccount.phoneNumber,
      authMethod: existingAccount.authMethod,
      userIdentifier: existingAccount.userIdentifier,
      dateOfBirth: existingAccount.dateOfBirth || currentProgress.dateOfBirth,
      role: userRole,
      qrToken: existingAccount.qrToken,
      avatarUrl: persistentAvatar,
      appLanguage: localLang,
      hasCompletedOnboarding: true,
      isAuthenticated: true,
    };

    onComplete(updated);
  };

  // Handle QR Code Login Success
  const handleQrSuccess = (account: UserAccount) => {
    const cleanId = account.userIdentifier.trim().toLowerCase();
    setActiveUserIdentifier(cleanId);
    const userRole: UserRole = account.role || (isMasterAdmin(account.userIdentifier, account.userName) ? 'Admin' : 'Student');

    const persistentAvatar = 
      account.avatarUrl || 
      getStoredUserAvatar(cleanId, account.userName) || 
      avatarUrl;

    if (persistentAvatar) {
      saveAndSyncAvatar(persistentAvatar, cleanId, account.userName);
    }

    const updated: Partial<UserProgress> = {
      userName: account.userName,
      email: account.email || (account.userIdentifier.includes('@') ? account.userIdentifier : undefined),
      phoneNumber: account.phoneNumber,
      authMethod: account.authMethod,
      userIdentifier: account.userIdentifier,
      role: userRole,
      qrToken: account.qrToken,
      avatarUrl: persistentAvatar,
      appLanguage: localLang,
      hasCompletedOnboarding: true,
      isAuthenticated: true,
    };
    onComplete(updated);
  };

  const goalsList: { id: LearningGoal; titleKh: string; titleEn: string; icon: React.ReactNode }[] = [
    { id: 'conversation', titleKh: 'សន្ទនាទូទៅប្រចាំថ្ងៃ', titleEn: 'Daily Conversation', icon: <Heart className="w-4 h-4 text-rose-500" /> },
    { id: 'work', titleKh: 'ការងារ និងអាជីវកម្ម', titleEn: 'Career & Workplace', icon: <Briefcase className="w-4 h-4 text-blue-500" /> },
    { id: 'travel', titleKh: 'ធ្វើដំណើរ និងទេសចរណ៍', titleEn: 'Travel & Tourism', icon: <Plane className="w-4 h-4 text-emerald-500" /> },
    { id: 'study', titleKh: 'ការសិក្សា និងប្រឡង', titleEn: 'Academic & Exams', icon: <GraduationCap className="w-4 h-4 text-purple-500" /> },
  ];

  const FALLING_ICONS = [
    { icon: GraduationCap, left: '5%', duration: '13s', delay: '0s', size: 26, opacity: 0.75, color: 'text-sky-300' },
    { icon: Sparkles, left: '16%', duration: '16s', delay: '3.2s', size: 20, opacity: 0.85, color: 'text-amber-300' },
    { icon: BookOpen, left: '28%', duration: '14s', delay: '1.5s', size: 24, opacity: 0.7, color: 'text-blue-300' },
    { icon: Star, left: '42%', duration: '17s', delay: '5s', size: 18, opacity: 0.85, color: 'text-amber-200' },
    { icon: GraduationCap, left: '55%', duration: '12s', delay: '2s', size: 28, opacity: 0.75, color: 'text-sky-400' },
    { icon: Sparkles, left: '67%', duration: '15s', delay: '4s', size: 22, opacity: 0.9, color: 'text-cyan-300' },
    { icon: BookOpen, left: '79%', duration: '13.5s', delay: '0.8s', size: 24, opacity: 0.7, color: 'text-indigo-300' },
    { icon: Award, left: '91%', duration: '18s', delay: '2.5s', size: 22, opacity: 0.8, color: 'text-amber-300' },
    { icon: Sparkles, left: '10%', duration: '15s', delay: '7s', size: 18, opacity: 0.8, color: 'text-sky-200' },
    { icon: GraduationCap, left: '85%', duration: '14s', delay: '8s', size: 24, opacity: 0.75, color: 'text-blue-200' },
    { icon: Star, left: '35%', duration: '16.5s', delay: '9s', size: 19, opacity: 0.85, color: 'text-amber-300' },
  ];

  return (
    <div className="fixed inset-0 z-[100] h-full w-full min-h-screen min-h-[100dvh] overflow-y-auto overscroll-y-contain flex flex-col items-center justify-start sm:justify-center p-2 xs:p-3 sm:p-5 md:p-6 bg-modern-blue-mesh">
      {/* Floating / Falling Animated Icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {FALLING_ICONS.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className={`absolute top-0 animate-falling-icon ${item.color}`}
              style={{
                left: item.left,
                '--falling-duration': item.duration,
                '--falling-delay': item.delay,
                '--falling-opacity': item.opacity,
              } as React.CSSProperties}
            >
              <IconComp style={{ width: item.size, height: item.size }} />
            </div>
          );
        })}
      </div>

      <div 
        className="w-full max-w-lg md:max-w-xl bg-slate-50/75 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col relative z-10 my-2 sm:my-auto max-h-[92dvh] sm:max-h-[88vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="onboarding-modal-card"
      >
        {/* Header Bar with Modern Textured/Grid Header & Pill-Shaped Angkor English Logo */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-4 sm:p-5 relative overflow-hidden border-b border-indigo-400/30 shrink-0 shadow-lg">
          {/* Grid pattern overlay & ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none opacity-40" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-fuchsia-600/15 rounded-full blur-xl pointer-events-none" />

          {/* Header Action Buttons (Language Switcher & Close) */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
            <button
              type="button"
              id="btn-login-lang-toggle"
              onClick={handleToggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold transition border border-white/25 backdrop-blur-md cursor-pointer shadow-xs"
              title={isEn ? "Switch to Khmer / ប្តូរជាភាសាខ្មែរ" : "Switch to Full English / ប្តូរជាភាសាអង់គ្លេសសុទ្ធ"}
            >
              <Globe className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{isEn ? 'English' : 'ខ្មែរ'}</span>
            </button>

            {onClose && isEditing && (
              <button
                onClick={onClose}
                className="text-slate-300 hover:text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer border border-white/20"
              >
                {isEn ? '✕ Close' : '✕ បិទ'}
              </button>
            )}
          </div>

          {/* Centered Pill-Shaped Angkor English Logo Component */}
          <div className="flex flex-col items-center justify-center pt-1 pb-2 relative z-10">
            <AngkorLogo 
              className="h-11 sm:h-13 w-auto max-w-[270px] sm:max-w-[310px] drop-shadow-md" 
              id="login-modal-angkor-logo" 
            />
          </div>

          {/* Subtitle / Portal description */}
          <div className="text-center relative z-10 mt-1">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-white drop-shadow-xs">
                {isEditing 
                  ? (isEn ? 'Profile Settings' : 'កែសម្រួលគណនី (Profile Settings)') 
                  : (isEn ? 'Angkor English Portal' : 'ចុះឈ្មោះ និងចូលរៀន (EdTech Portal)')}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/40 border border-indigo-300/40 text-indigo-200 text-[10px] font-bold backdrop-blur-xs">
                {!isEditing ? 'Portal' : 'Active'}
              </span>
            </div>
            <p className={`text-xs text-indigo-100/90 mt-1 max-w-sm mx-auto ${isEn ? 'font-sans' : 'font-khmer'}`}>
              {tabMode === 'register' 
                ? (isEn ? 'Please complete the form below to begin your English learning journey.' : 'សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីចាប់ផ្តើមរៀនភាសាអង់គ្លេស') 
                : (isEn ? 'Choose login method: Enter passcode or scan personal QR Code.' : 'ជ្រើសរើសវិធីចូលគណនី៖ វាយលេខសម្ងាត់ ឬ ស្កេន QR Code')}
            </p>
          </div>

          {/* Mode Switcher Tabs (Sign in vs Register) */}
          {!isEditing && (
            <div className="flex items-center gap-1.5 mt-3.5 p-1 bg-slate-950/70 backdrop-blur-xs rounded-xl border border-indigo-400/30 relative z-10">
              <button
                type="button"
                onClick={() => {
                  setTabMode('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  tabMode === 'register' ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/40' : 'text-slate-300 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isEn ? 'Register Member' : 'ចុះឈ្មោះសមាជិក (Register)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTabMode('signin');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  tabMode === 'signin' ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/40' : 'text-slate-300 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isEn ? 'Sign In' : 'ចូលគណនីចាស់ (Sign In)'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto overscroll-y-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>

        {/* Dynamic Toast / Pop-up Alert Message for Validation */}
        {toastAlert && (
          <div className="mx-4 sm:mx-6 mt-3 p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{toastAlert}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastAlert(null)}
              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer shrink-0"
              title="Close alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs font-semibold text-center font-khmer flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ================= FORM 1: REGISTER / EDIT PROFILE ================= */}
        {tabMode === 'register' && (
          <form onSubmit={handleSubmitRegister} className="p-4 sm:p-6 space-y-4 pb-10 sm:pb-8">
            
            {/* 3D Avatar Selection & Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isEn ? '3D Profile Avatar' : 'រូបតំណាង 3D Profile (Avatar Image)'}</span>
              </label>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-indigo-500/30 flex items-center justify-center text-slate-400 shadow-xs shrink-0">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-7 h-7 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isEn ? 'Upload Photo' : 'Upload Photo (បញ្ចូលរូប)'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarFileUpload}
                        className="hidden" 
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[11px] text-slate-500 ${isEn ? 'font-sans' : 'font-khmer'}`}>
                      {isEn ? '3D Presets:' : '3D Avatars:'}
                    </span>
                    {presetAvatars.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition cursor-pointer ${
                          avatarUrl === url ? 'border-indigo-600 scale-110 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="Preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Field 1: Full Name (ឈ្មោះ និងត្រកូល) - REQUIRED */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                {isEn ? '1) Full Name (First & Last)' : '1) ឈ្មោះ និងត្រកូល (Full Name)'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isEn ? 'e.g. Phon Sophai or Dara Sok' : 'ឧទាហរណ៍: ផុន សុផៃ ឬ Phon Sophai'}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-indigo-600 bg-white text-sm text-slate-900 font-medium placeholder:text-slate-600 placeholder:opacity-100 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/15 shadow-xs transition-all"
                />
              </div>
            </div>

            {/* Field 2: Flexible Contact Input (Email or Phone) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                {isEn ? '2) Email (@gmail.com) or Phone Number' : '2) បញ្ចូល Email (@gmail.com) ឬ លេខទូរស័ព្ទ'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                {contactInput.includes('@') ? (
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                ) : (
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  placeholder={isEn ? 'e.g. learner@gmail.com or 012888999' : 'ឧទាហរណ៍៖ learner@gmail.com ឬ 012888999'}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-indigo-600 bg-white text-sm text-slate-900 font-mono font-medium placeholder:text-slate-600 placeholder:opacity-100 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/15 shadow-xs transition-all"
                />
              </div>
            </div>

            {/* Compact Gender Selection */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  {isEn ? 'Gender Selection' : 'ជ្រើសរើសភេទ (Gender Selection)'}
                </label>
                {gender !== 'unspecified' && (
                  <button
                    type="button"
                    onClick={() => setGender('unspecified')}
                    className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                  >
                    {isEn ? 'Clear' : 'លុបជម្រើស'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Male Option */}
                <button
                  type="button"
                  onClick={() => {
                    setGender('male');
                    if (!avatarUrl || avatarUrl.includes('dicebear')) {
                      setAvatarUrl('https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4');
                    }
                  }}
                  className={`py-2 px-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer text-center ${
                    gender === 'male'
                      ? 'border-blue-500 bg-blue-50/80 shadow-xs ring-2 ring-blue-500/20 text-blue-950 font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-lg">👨‍🎓</span>
                  <span className="text-xs font-bold">{isEn ? 'Male' : 'ប្រុស (Male)'}</span>
                </button>

                {/* Female Option */}
                <button
                  type="button"
                  onClick={() => {
                    setGender('female');
                    if (!avatarUrl || avatarUrl.includes('dicebear')) {
                      setAvatarUrl('https://api.dicebear.com/7.x/adventurer/svg?seed=Aria&backgroundColor=ffd5dc');
                    }
                  }}
                  className={`py-2 px-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer text-center ${
                    gender === 'female'
                      ? 'border-pink-500 bg-pink-50/80 shadow-xs ring-2 ring-pink-500/20 text-pink-950 font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-lg">👩‍🎓</span>
                  <span className="text-xs font-bold">{isEn ? 'Female' : 'ស្រី (Female)'}</span>
                </button>

                {/* Other Option */}
                <button
                  type="button"
                  onClick={() => setGender('prefer-not-to-say')}
                  className={`py-2 px-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer text-center ${
                    gender === 'prefer-not-to-say' || gender === 'other'
                      ? 'border-purple-500 bg-purple-50/80 shadow-xs ring-2 ring-purple-500/20 text-purple-950 font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-lg">✨</span>
                  <span className="text-xs font-bold">{isEn ? 'Other' : 'ផ្សេងៗ (Other)'}</span>
                </button>
              </div>
            </div>

            {/* Location Selectors: Country & Province/City directly below Gender Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
              {/* Country Selection */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isEn ? 'Country' : 'ជ្រើសរើសប្រទេស (Country)'}</span>
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-indigo-600 text-xs sm:text-sm font-semibold text-slate-900 bg-white focus:outline-hidden focus:ring-4 focus:ring-indigo-500/15 shadow-xs transition-all cursor-pointer"
                  >
                    {(isEn ? COUNTRIES_LIST_EN : COUNTRIES_LIST).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Province / City Selection */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isEn ? 'Province / City' : 'ជ្រើសរើសខេត្ត/ក្រុង (Province/City)'}</span>
                </label>
                <div className="relative">
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-indigo-600 text-xs sm:text-sm font-semibold text-slate-900 bg-white focus:outline-hidden focus:ring-4 focus:ring-indigo-500/15 shadow-xs transition-all cursor-pointer"
                  >
                    {(isEn ? CAMBODIAN_PROVINCES_EN : CAMBODIAN_PROVINCES).map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Field 3: Date of Birth (ថ្ងៃខែឆ្នាំកំណើត) - Interactive Calendar Picker & Manual Entry */}
            <div className="space-y-1.5 pt-0.5" id="field-date-of-birth-container">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isEn ? '3) Date of Birth' : '3) ថ្ងៃខែឆ្នាំកំណើត (Date of Birth)'}</span>
                </label>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setDobMode('picker')}
                    className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                      dobMode === 'picker' ? 'bg-white text-indigo-700 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {isEn ? '📅 Calendar' : '📅 ប្រតិទិន (Calendar)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDobMode('manual')}
                    className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                      dobMode === 'manual' ? 'bg-white text-indigo-700 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {isEn ? '⌨️ Manual (DD/MM/YYYY)' : '⌨️ វាយផ្ទាល់ (DD/MM/YYYY)'}
                  </button>
                </div>
              </div>

              {dobMode === 'picker' ? (
                <div className="relative flex items-center">
                  <input
                    type="date"
                    id="input-date-of-birth-native"
                    min="1940-01-01"
                    max="2026-12-31"
                    value={isoDate}
                    onChange={handleNativePickerChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-indigo-600 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-4 focus:ring-indigo-500/15 font-mono font-medium shadow-xs transition-all cursor-pointer"
                  />
                  {dateOfBirth && (
                    <div className="absolute right-3 pointer-events-none text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {dateOfBirth}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="input-date-of-birth-text"
                    autoComplete="bday"
                    value={dateOfBirth}
                    onChange={handleManualDobChange}
                    placeholder={isEn ? 'DD/MM/YYYY (e.g. 15/08/2000)' : 'DD/MM/YYYY (ឧ. 15/08/2000)'}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-indigo-600 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/15 font-mono font-medium placeholder:text-slate-600 placeholder:opacity-100 shadow-xs transition-all"
                  />
                </div>
              )}
            </div>

            {/* Field 4: Set Password (ពាក្យសម្ងាត់) - REQUIRED */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                {isEn ? '4) Set Password' : '4) កំណត់ពាក្យសម្ងាត់ (Set Password)'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  name="user_reg_password"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder={isEn ? 'At least 4 characters (e.g. 123456)' : 'យ៉ាងតិច ៤ ខ្ទង់ (e.g. 123456)'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-indigo-600 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/15 font-mono font-medium placeholder:text-slate-600 placeholder:opacity-100 shadow-xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Learning Goal Selection */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-slate-800">
                {isEn ? 'Learning Goal' : 'គោលដៅរៀនភាសាអង់គ្លេស (Learning Goal)'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {goalsList.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                      goal === g.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold ring-1 ring-indigo-500/30'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                    }`}
                  >
                    <span className="shrink-0">{g.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{g.titleEn}</div>
                      {!isEn && <div className="text-[10px] text-slate-500 font-khmer truncate">{g.titleKh}</div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                id="btn-complete-onboarding"
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {isEditing 
                    ? (isEn ? 'Save Changes' : 'រក្សាទុកការកែសម្រួល (Save Changes)') 
                    : (isEn ? 'Register & Start Learning' : 'ចុះឈ្មោះ និងចាប់ផ្តើមរៀន (Register & Start)')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ================= FORM 2: DUAL LOGIN SYSTEM (SIGN IN) ================= */}
        {tabMode === 'signin' && (
          <div className="p-4 sm:p-6 space-y-4 pb-10 sm:pb-8">
            
            {/* Dual Login Sub-tab Switcher: Credentials vs QR Code */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setSignInSubTab('credentials');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  signInSubTab === 'credentials'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>{isEn ? 'Credentials (Name / Password)' : 'Credentials Login (ឈ្មោះ/លេខសម្ងាត់)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSignInSubTab('qr');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  signInSubTab === 'qr'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>{isEn ? 'QR Code (Instant Scan)' : 'QR Code Login (ស្កេនកូដ)'}</span>
              </button>
            </div>

            {/* DUAL LOGIN OPTION 1: TRADITIONAL CREDENTIALS */}
            {signInSubTab === 'credentials' && (
              <form onSubmit={handleSubmitCredentialsSignIn} className="space-y-4 pt-1">
                <div className="text-center pb-1">
                  <h3 className="font-bold text-slate-900 text-base">
                    {isEn ? 'Sign In with Name, Email, or Phone' : 'ចូលគណនីដោយឈ្មោះ Email ឬលេខទូរស័ព្ទ'}
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    {isEn ? 'Name, Email, or Phone Number' : 'ឈ្មោះ, Email ឬ លេខទូរស័ព្ទ'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={signInInput}
                      onChange={(e) => setSignInInput(e.target.value)}
                      placeholder={isEn ? 'e.g. example@gmail.com or 012345678' : 'ឧទាហរណ៍: example@gmail.com ឬ 012345678'}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-indigo-600 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/15 font-medium placeholder:text-slate-600 placeholder:opacity-100 shadow-xs transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    {isEn ? 'Password' : 'ពាក្យសម្ងាត់ (Password)'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSignInPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      name="current-password"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder={isEn ? 'Enter your password' : 'បញ្ចូលពាក្យសម្ងាត់របស់អ្នក'}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-indigo-600 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/15 font-mono font-medium placeholder:text-slate-600 placeholder:opacity-100 shadow-xs transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                    >
                      {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Forgot Password Link Button */}
                  <div className="flex items-center justify-end pt-0.5">
                    <button
                      type="button"
                      id="btn-forgot-password-link"
                      onClick={() => {
                        setForgotIdentifier(signInInput.trim());
                        setShowForgotModal(true);
                        setForgotError('');
                        setForgotSuccess('');
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-1.5 py-0.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{isEn ? 'Forgot Password?' : 'ភ្លេចពាក្យសម្ងាត់? (Forgot Password?)'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isEn ? 'Sign In' : 'ចូលគណនី (Sign In With Password)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* DUAL LOGIN OPTION 2: DYNAMIC QR CODE LOGIN */}
            {signInSubTab === 'qr' && (
              <div className="space-y-3 pt-1">
                <div className="text-center pb-1">
                  <h3 className="font-bold text-slate-900 text-base flex items-center justify-center gap-1.5">
                    <span>{isEn ? 'Instant Scan-to-Sign-In with QR Code' : 'ចូលរៀនភ្លាមៗដោយស្កេនកូដ QR'}</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </h3>
                </div>

                <QrLoginScanner 
                  onSuccess={handleQrSuccess}
                  onError={(err) => setErrorMsg(err)}
                />
              </div>
            )}

          </div>
        )}

        </div>
      </div>

      {/* FORGOT / RESET PASSWORD MODAL DIALOG */}
      {showForgotModal && (
        <div 
          className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForgotModal(false);
            }
          }}
        >
          <div 
            className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            id="forgot-password-modal"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 text-white p-4 sm:p-5 relative border-b border-blue-400/30 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-700/70 border border-blue-300/40 flex items-center justify-center shadow-inner">
                    <KeyRound className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white drop-shadow-xs">
                      {isEn ? 'Forgot Password?' : 'ភ្លេចពាក្យសម្ងាត់? (Forgot Password)'}
                    </h3>
                    <p className={`text-[11px] text-blue-200 ${isEn ? 'font-sans' : 'font-khmer'}`}>
                      {isEn ? 'Verify with Date of Birth' : 'ផ្ទៀងផ្ទាត់ជាមួយថ្ងៃ ខែ ឆ្នាំកំណើត (Verify with Date of Birth)'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotError('');
                    setForgotSuccess('');
                  }}
                  className="text-blue-200 hover:text-white text-xs p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleResetPasswordSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
              {/* Guidance Banner */}
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <p className="font-semibold">{isEn ? 'Secure Password Reset' : 'កំណត់ពាក្យសម្ងាត់ថ្មីដោយសុវត្ថិភាព'}</p>
                  <p className="text-[11px] text-blue-700">
                    {isEn 
                      ? 'Please enter your Name/Email/Phone and Date of Birth accurately to verify your account and set a new password.'
                      : 'សូមបំពេញ ឈ្មោះ/អ៊ីមែល/លេខទូរស័ព្ទ និង ថ្ងៃ ខែ ឆ្នាំកំណើត របស់អ្នកឱ្យបានត្រឹមត្រូវដើម្បីផ្ទៀងផ្ទាត់ និងកំណត់ពាក្យសម្ងាត់ថ្មី។'}
                  </p>
                </div>
              </div>

              {/* Error Notification */}
              {forgotError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="flex-1">{forgotError}</span>
                </div>
              )}

              {/* Success Notification */}
              {forgotSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="flex-1">{forgotSuccess}</span>
                </div>
              )}

              {/* 1. Account Identifier */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  {isEn ? '1) Name, Email, or Phone Number' : '១) ឈ្មោះ, Email ឬ លេខទូរស័ព្ទ'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder={isEn ? 'e.g. 012889900 or phonphaihdvk@gmail.com' : 'ឧ. 012889900 ឬ phonphaihdvk@gmail.com'}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-blue-600 bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-blue-500/15 font-medium placeholder:text-slate-600 placeholder:opacity-100 shadow-xs transition-all"
                  />
                </div>
              </div>

              {/* 2. Date of Birth (Verification) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    {isEn ? '2) Date of Birth (Verification)' : '២) ថ្ងៃ ខែ ឆ្នាំកំណើត (Date of Birth)'} <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotDobMode(forgotDobMode === 'text' ? 'picker' : 'text')}
                    className="text-[10px] text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    {isEn 
                      ? (forgotDobMode === 'text' ? '📅 Calendar' : '✏️ Manual Entry') 
                      : (forgotDobMode === 'text' ? '📅 បើកប្រតិទិន (Calendar)' : '✏️ វាយបញ្ចូលផ្ទាល់ (Type)')}
                  </button>
                </div>

                {forgotDobMode === 'picker' ? (
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      min="1940-01-01"
                      max="2026-12-31"
                      value={forgotIsoDate}
                      onChange={handleForgotNativePickerChange}
                      className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-blue-600 text-xs sm:text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-500/15 font-mono font-medium shadow-xs transition-all cursor-pointer"
                    />
                    {forgotDob && (
                      <div className="absolute right-3 pointer-events-none text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {forgotDob}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative flex items-center">
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={forgotDob}
                      onChange={handleForgotManualDobChange}
                      placeholder={isEn ? 'DD/MM/YYYY (e.g. 15/08/2000)' : 'DD/MM/YYYY (ឧ. 15/08/2000)'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-blue-600 bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-blue-500/15 font-mono font-medium placeholder:text-slate-600 placeholder:opacity-100 shadow-xs transition-all"
                    />
                  </div>
                )}
                <p className={`text-[10px] text-slate-500 ${isEn ? 'font-sans' : 'font-khmer'}`}>
                  {isEn 
                    ? '💡 Date of birth must match your registered account record (e.g. 01/01/2000)' 
                    : '💡 ទម្រង់ថ្ងៃខែឆ្នាំកំណើតត្រូវគ្នានឹងទិន្នន័យគណនី (ឧ. 01/01/2000)'}
                </p>
              </div>

              {/* 3. New Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  {isEn ? '3) New Password' : '៣) ពាក្យសម្ងាត់ថ្មី (New Password)'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showForgotNewPassword ? 'text' : 'password'}
                    required
                    autoComplete="off"
                    name="new_password_reset"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder={isEn ? 'At least 4 characters (e.g. 123456)' : 'យ៉ាងតិច ៤ ខ្ទង់ (e.g. 123456)'}
                    className="w-full pl-9 pr-9 py-2 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-blue-600 bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-blue-500/15 font-mono font-medium placeholder:text-slate-600 placeholder:opacity-100 shadow-xs transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                  >
                    {showForgotNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 4. Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  {isEn ? '4) Confirm New Password' : '៤) បញ្ជាក់ពាក្យសម្ងាត់ថ្មី (Confirm New Password)'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showForgotConfirmPassword ? 'text' : 'password'}
                    required
                    autoComplete="off"
                    name="confirm_password_reset"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder={isEn ? 'Re-enter your new password' : 'វាយពាក្យសម្ងាត់ថ្មីម្តងទៀត'}
                    className="w-full pl-9 pr-9 py-2 rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-blue-600 bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-blue-500/15 font-mono font-medium placeholder:text-slate-600 placeholder:opacity-100 shadow-xs transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                  >
                    {showForgotConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'បោះបង់ (Cancel)'}
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="flex-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isResetting ? (
                    <span>{isEn ? 'Verifying...' : 'កំពុងផ្ទៀងផ្ទាត់...'}</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Save New Password' : 'កំណត់ពាក្យសម្ងាត់ថ្មី (Save)'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
