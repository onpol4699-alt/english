import React, { useRef } from 'react';
import { 
  X, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Search, 
  Award, 
  User, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Users, 
  Settings2, 
  QrCode, 
  Flame, 
  Camera, 
  Upload, 
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  GraduationCap,
  KeyRound,
  BarChart3
} from 'lucide-react';
import { UserProgress, DifficultyLevel, UserRole, NavigationTab } from '../types';
import { isDeveloperRole, hasAdminPrivilege, getCleanDisplayName } from '../utils/memberStorage';
import { THEME_COLORS } from './ThemeAndFontSettingsModal';
import { PWAInstallButton } from './PWAInstallButton';
import { saveAndSyncAvatar, compressImageFile } from '../utils/avatarUtils';
import { NavFeatureIcon, NavFeatureIconType } from './NavFeatureIcons';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenLevelSelect?: (level: DifficultyLevel) => void;
  onOpenProfile: () => void;
  onOpenChangePassword?: () => void;
  onOpenSettings: () => void;
  onOpenCertificate: () => void;
  onOpenPersonalQr?: () => void;
  onOpenPlacementTest?: () => void;
  onOpenAdmin: () => void;
  onOpenAdminMembers?: () => void;
  onOpenDeveloperBackup?: () => void;
  onLogout: () => void;
  onUpdateSettings: (updates: Partial<UserProgress>) => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  progress,
  activeTab,
  onSelectTab,
  onOpenLevelSelect,
  onOpenProfile,
  onOpenChangePassword,
  onOpenSettings,
  onOpenCertificate,
  onOpenPersonalQr,
  onOpenPlacementTest,
  onOpenAdmin,
  onOpenAdminMembers,
  onOpenDeveloperBackup,
  onLogout,
  onUpdateSettings,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const effectiveRole: UserRole = progress.activeViewRole || progress.role || 'Student';
  const isDev = effectiveRole === 'Developer';
  const isTeacher = effectiveRole === 'Teacher';
  const isAdmin = effectiveRole === 'Admin' || effectiveRole === 'Developer';
  const cleanName = getCleanDisplayName(progress.userName);
  const activeColorObj = THEME_COLORS.find((c) => c.id === progress.themeColor) || THEME_COLORS[0];

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('រូបភាពត្រូវមានទំហំតូចជាង ៥MB (Image must be under 5MB)');
      return;
    }

    try {
      const compressed = await compressImageFile(file);
      onUpdateSettings({ avatarUrl: compressed });
      saveAndSyncAvatar(compressed, progress.userIdentifier, progress.userName);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateSettings({ avatarUrl: reader.result });
          saveAndSyncAvatar(reader.result, progress.userIdentifier, progress.userName);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isEn = progress.appLanguage === 'en';

  const navItems: {
    id: NavigationTab;
    labelKh: string;
    labelEn: string;
    iconType: NavFeatureIconType;
  }[] = [
    {
      id: 'lessons',
      labelKh: isEn ? 'Lessons & 12 Tenses' : 'រៀនភាសាអង់គ្លេស & 12 Tenses',
      labelEn: isEn ? '' : '(Lessons & 12 Tenses)',
      iconType: 'lessons',
    },
    {
      id: 'quiz',
      labelKh: isEn ? 'Quiz Arena & Practice' : 'តេស្តសមត្ថភាព & សំណួរចម្លើយ',
      labelEn: isEn ? '' : '(Quiz Arena)',
      iconType: 'quiz',
    },
    {
      id: 'flashcards',
      labelKh: isEn ? 'Smart Flashcards' : 'ប័ណ្ណពាក្យឆ្លាតវៃ',
      labelEn: isEn ? '' : '(Smart Flashcards)',
      iconType: 'flashcards',
    },
    {
      id: 'dictionary',
      labelKh: isEn ? 'Vocabulary Dictionary' : 'វចនានុក្រមពាក្យគន្លឹះ',
      labelEn: isEn ? '' : '(Vocab Dictionary)',
      iconType: 'dictionary',
    },
    {
      id: 'analytics',
      labelKh: isEn ? 'Study Analytics' : 'ការវិភាគការរៀន',
      labelEn: isEn ? '' : '(Study Analytics)',
      iconType: 'analytics',
    },
    {
      id: 'achievements',
      labelKh: isEn ? 'Rank & Certificate' : 'ចំណាត់ថ្នាក់ & មេដាយ',
      labelEn: isEn ? '' : '(Rank & Certificate)',
      iconType: 'achievements',
    },
  ];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-end p-2 sm:p-4 pointer-events-auto" id="mobile-navigation-modal">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleAvatarUpload} 
        className="hidden" 
      />

      {/* Responsive Drawer Container */}
      <div className="relative w-[82vw] max-w-[290px] sm:max-w-[340px] bg-white shadow-2xl rounded-2xl sm:rounded-3xl border border-slate-200/80 max-h-[82vh] sm:max-h-[88vh] flex flex-col z-50 overflow-hidden animate-in slide-in-from-right duration-250">
        
        {/* Drawer Top Header */}
        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-indigo-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-xs shadow-indigo-500/30">
              <span className="text-lg sm:text-xl font-black bg-gradient-to-tr from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent select-none">
                π
              </span>
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 font-khmer leading-tight">
                {isEn ? 'Navigation Menu' : 'បញ្ជីមុខងារ (Menu)'}
              </h2>
              <p className="text-[9px] sm:text-[10px] text-indigo-600 font-medium leading-tight">
                Angkor English Academy
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-3.5">

          {/* 1) Top Section: User Profile Card with Stylish Textured/Grid Header */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-md border border-indigo-400/30 overflow-hidden relative">
            {/* Grid pattern overlay & ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none opacity-40" />
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-indigo-500/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-fuchsia-600/20 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-2.5 sm:gap-3 relative z-10">
              <div 
                className="relative group cursor-pointer shrink-0"
                onClick={() => fileInputRef.current?.click()}
                title={isEn ? "Click to update photo" : "ចុចដើម្បីប្តូររូបថតថ្មី"}
              >
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl overflow-hidden bg-white/20 border-2 border-white/60 shadow-md flex items-center justify-center backdrop-blur-md">
                  {progress.avatarUrl ? (
                    <img 
                      src={progress.avatarUrl} 
                      alt={cleanName} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-white text-base font-bold ${activeColorObj.bgClass}`}>
                      {cleanName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-gradient-to-tr from-amber-400 to-pink-500 rounded-full text-white border border-purple-900 shadow-xs">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm truncate drop-shadow-xs">
                  {cleanName}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-indigo-100 font-mono truncate mt-0.5">
                  {progress.email || progress.userIdentifier || 'learner@gmail.com'}
                </p>

                {/* Role Badge */}
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  {isDev ? (
                    <div className="relative p-[1.5px] rounded-full overflow-hidden inline-flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)] shrink-0 select-none">
                      <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#f59e0b,#ef4444,#dc2626,#f59e0b,#ea580c,#b91c1c,#f59e0b)] animate-[spin_3s_linear_infinite]" />
                      <div className="relative z-10 inline-flex items-center gap-1 bg-slate-950 text-amber-400 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-tight whitespace-nowrap">
                        <span className="text-[10px] leading-none inline-block animate-bounce origin-bottom">🔥</span>
                        <span>Developer</span>
                      </div>
                    </div>
                  ) : isTeacher ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold shadow-2xs">
                      📚 Teacher
                    </span>
                  ) : isAdmin ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/50 text-indigo-100 font-bold border border-indigo-300/40 backdrop-blur-xs">
                      🛡️ Admin
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-semibold shadow-2xs">
                      🎓 Student
                    </span>
                  )}

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-indigo-100 font-mono border border-white/25 backdrop-blur-xs">
                    {progress.currentLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Micro Stats Bar */}
            <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-center">
              <div className="bg-white/10 rounded-xl p-1.5 border border-white/10 backdrop-blur-xs">
                <div className="text-[10px] text-indigo-200 font-khmer">{isEn ? 'Streak' : 'ការរៀនជាប់គ្នា'}</div>
                <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{progress.streakDays || 1} {isEn ? 'Days' : 'ថ្ងៃ'}</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-1.5 border border-white/10 backdrop-blur-xs">
                <div className="text-[10px] text-indigo-200 font-khmer">{isEn ? 'XP Score' : 'ពិន្ទុ (XP)'}</div>
                <div className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{progress.xp || 0} XP</span>
                </div>
              </div>
            </div>

            {/* Relocated Install App Action Item */}
            <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-white/15">
              <PWAInstallButton variant="action" />
            </div>
          </div>

          {/* 2) Navigation Items List */}
          <div className="space-y-1.5">
            <div className="text-[10px] sm:text-[10.5px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1 font-khmer">
              {isEn ? 'Main Navigation' : 'ផ្នែកសិក្សា (Main Navigation)'}
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isLessons = item.id === 'lessons';
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    id={`mobile-nav-${item.id}`}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className={`w-full p-[2px] rounded-xl transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-sm shadow-indigo-100'
                        : 'bg-transparent'
                    }`}
                  >
                    <div className={`w-full px-2.5 py-1.5 sm:py-2 rounded-[10px] flex items-center justify-between transition ${
                      isActive 
                        ? 'bg-slate-100/90 text-indigo-700 font-bold' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium'
                    }`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <NavFeatureIcon type={item.iconType} active={isActive} size={20} className="shrink-0" />
                        <div className="flex flex-col text-left truncate">
                          <span className="font-khmer font-bold text-[10.5px] sm:text-[11px] text-slate-800 truncate leading-tight">
                            {item.labelKh}
                          </span>
                          {item.labelEn && (
                            <span className="text-[8.5px] sm:text-[9px] text-slate-500 font-medium truncate leading-tight">
                              {item.labelEn}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                  </button>

                  {/* Quick Select Sub-buttons for Lessons */}
                  {isLessons && (
                    <div className="grid grid-cols-3 gap-1 px-1 font-khmer">
                      <button
                        onClick={() => {
                          onSelectTab('lessons');
                          onClose();
                          onOpenLevelSelect?.('beginner');
                        }}
                        className="py-1 px-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold text-center transition cursor-pointer"
                      >
                        {isEn ? '🌱 Beg (A1)' : '🌱 ដំបូង (A1)'}
                      </button>
                      <button
                        onClick={() => {
                          onSelectTab('lessons');
                          onClose();
                          onOpenLevelSelect?.('intermediate');
                        }}
                        className="py-1 px-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-[10px] font-bold text-center transition cursor-pointer"
                      >
                        {isEn ? '⚡ Int (B1)' : '⚡ មធ្យម (B1)'}
                      </button>
                      <button
                        onClick={() => {
                          onSelectTab('lessons');
                          onClose();
                          onOpenLevelSelect?.('advanced');
                        }}
                        className="py-1 px-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[10px] font-bold text-center transition cursor-pointer"
                      >
                        {isEn ? '👑 Adv (C1)' : '👑 ខ្ពស់ (C1)'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Divider line */}
          <div className="border-t border-slate-200/80 pt-2" />

          {/* 3) Tools & Profile Actions */}
          <div className="space-y-1.5">
            {/* Framed Section Header with distinct, attractive border and standout colors */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-sky-50/90 border border-blue-200/90 shadow-2xs flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1 rounded-lg bg-blue-600 text-white shadow-xs shrink-0 flex items-center justify-center">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-khmer font-bold text-[11px] sm:text-[11.5px] text-blue-950 leading-tight truncate">
                    {isEn ? 'Account & Settings' : 'គណនី និងការកំណត់'}
                  </span>
                  {!isEn && (
                    <span className="text-[9px] sm:text-[9.5px] text-blue-600 font-semibold tracking-tight leading-tight truncate">
                      (Account & Settings)
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[8.5px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold bg-blue-100/90 text-blue-800 border border-blue-200/80 shrink-0 select-none shadow-3xs">
                Preferences
              </span>
            </div>

            {/* My Profile Settings */}
            <button
              onClick={() => {
                onClose();
                onOpenProfile();
              }}
              className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-blue-50/40 border border-slate-200/90 shadow-2xs hover:border-blue-300 text-slate-700 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="font-khmer font-bold text-[10.5px] sm:text-[11px] text-slate-800 leading-tight group-hover:text-blue-900 transition-colors">
                  {isEn ? 'Profile & Account Info' : 'គណនី និងព័ត៌មានផ្ទាល់ខ្លួន'}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </button>

            {/* Change Password */}
            {onOpenChangePassword && (
              <button
                onClick={() => {
                  onClose();
                  onOpenChangePassword();
                }}
                className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-indigo-50/40 border border-slate-200/90 shadow-2xs hover:border-indigo-300 text-slate-700 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200 transition-colors">
                    <KeyRound className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-khmer font-bold text-[10.5px] sm:text-[11px] text-slate-800 leading-tight group-hover:text-indigo-950 transition-colors">
                    {isEn ? 'Change Password' : 'ប្តូរពាក្យសម្ងាត់'}
                  </span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>
            )}

            {/* Settings */}
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-blue-50/40 border border-slate-200/90 shadow-2xs hover:border-blue-300 text-slate-700 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                  <Settings className="w-3.5 h-3.5" />
                </div>
                <span className="font-khmer font-bold text-[10.5px] sm:text-[11px] text-slate-800 leading-tight group-hover:text-blue-900 transition-colors">
                  {isEn ? 'Display & Font Styles' : 'ការកំណត់ & ពុម្ពអក្សរ'}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </button>

            {/* Placement Test */}
            {onOpenPlacementTest && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPlacementTest();
                }}
                className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-indigo-50/60 border border-slate-200/90 shadow-2xs hover:border-indigo-300 text-slate-700 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200 transition-colors">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-khmer font-bold text-[10.5px] sm:text-[11px] text-slate-800 leading-tight group-hover:text-indigo-950 transition-colors">
                    {isEn ? 'Proficiency Placement Test' : 'តេស្តវាស់ស្ទង់សមត្ថភាព'}
                  </span>
                </div>
                <span className="text-[8.5px] px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold font-khmer">
                  {isEn 
                    ? (progress.hasCompletedPlacementTest ? 'Retake' : 'Start') 
                    : (progress.hasCompletedPlacementTest ? 'ធ្វើឡើងវិញ' : 'ចាប់ផ្តើម')}
                </span>
              </button>
            )}

            {/* Graduation Certificate */}
            <button
              onClick={() => {
                onClose();
                onOpenCertificate();
              }}
              className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-amber-50/60 border border-slate-200/90 shadow-2xs hover:border-amber-300 text-slate-700 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-200 transition-colors">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span className="font-khmer font-bold text-[10.5px] sm:text-[11px] text-slate-800 leading-tight group-hover:text-amber-950 transition-colors">
                  {isEn ? 'Certificate of Completion' : 'វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា'}
                </span>
              </div>
              <span className="text-[8.5px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                {isEn ? 'Certificate' : 'វិញ្ញាបនបត្រ'}
              </span>
            </button>

            {/* Personal Login QR */}
            {onOpenPersonalQr && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPersonalQr();
                }}
                className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-indigo-50/60 border border-slate-200/90 shadow-2xs hover:border-indigo-300 text-slate-700 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200 transition-colors">
                    <QrCode className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-khmer font-bold text-[10.5px] sm:text-[11px] text-slate-800 leading-tight group-hover:text-indigo-950 transition-colors">
                    {isEn ? 'Personal Login QR Pass' : 'កាតសម្គាល់ QR ផ្ទាល់ខ្លួន'}
                  </span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>
            )}
          </div>

          {/* 4) Developer / Admin Panel (if Admin or Developer) */}
          {isAdmin && (
            <>
              <div className="border-t border-slate-200/80 pt-2" />
              <div className="space-y-1.5">
                <div className="text-[9.5px] sm:text-[10px] font-bold text-purple-700 uppercase tracking-wider px-2 mb-1 font-khmer flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-purple-600" />
                  <span>{isEn ? '🛠️ Admin & Developer Portal' : '🛠️ Developer / Admin Panel'}</span>
                </div>

                {onOpenAdminMembers && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminMembers();
                    }}
                    className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-purple-50/50 hover:bg-purple-100/70 text-purple-900 border border-purple-200/90 shadow-2xs hover:border-purple-300 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-200/80 text-purple-800">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-khmer font-bold text-[10.5px] sm:text-[11px] text-purple-950 leading-tight">
                        {isEn ? 'Member Management' : 'គ្រប់គ្រងសមាជិក'}
                      </span>
                    </div>
                    <span className="text-[8.5px] px-1.5 py-0.5 rounded-md bg-purple-200 text-purple-900 font-bold">
                      {isDev ? 'Dev 👑' : 'Admin'}
                    </span>
                  </button>
                )}

                {isDev && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-amber-50/50 hover:bg-amber-100/70 text-amber-950 border border-amber-200/90 shadow-2xs hover:border-amber-300 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-200/80 text-amber-800">
                        <Settings2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-khmer font-bold text-[10.5px] sm:text-[11px] text-amber-950 leading-tight">
                        {isEn ? 'App Branding & Settings' : 'រៀបចំប្រព័ន្ធ & ឡូហ្គោ'}
                      </span>
                    </div>
                    <span className="text-[8.5px] px-1.5 py-0.5 rounded-md bg-amber-500 text-white font-bold">
                      Exclusive
                    </span>
                  </button>
                )}

                {/* Developer Failover Backups */}
                {isDev && onOpenDeveloperBackup && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDeveloperBackup();
                    }}
                    className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-purple-50/50 hover:bg-purple-100/70 text-purple-900 border border-purple-200/90 shadow-2xs hover:border-purple-300 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-2xs">
                        <Flame className="w-3.5 h-3.5 text-amber-300" />
                      </div>
                      <span className="font-khmer font-bold text-[10.5px] sm:text-[11px] text-purple-950 leading-tight">
                        {isEn ? 'Developer Failover Backups' : 'សុវត្ថិភាព Developer ហ្វុនថៃ'}
                      </span>
                    </div>
                    <span className="text-[8.5px] px-1.5 py-0.5 rounded-md bg-purple-200 text-purple-900 font-bold">
                      {isEn ? '3 Options' : '3 ជម្រើស'}
                    </span>
                  </button>
                )}
              </div>
            </>
          )}

          {/* Divider line */}
          <div className="border-t border-slate-200/80 pt-2" />

          {/* 5) Logout Button */}
          <button
            id="mobile-menu-btn-logout"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
              onLogout();
            }}
            className="w-full py-2 sm:py-2.5 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <div className="flex items-center gap-1.5">
              <span className="font-khmer font-bold text-[11px] sm:text-xs">{isEn ? 'Sign Out' : 'ចាកចេញពីគណនី'}</span>
              {!isEn && <span className="text-[9px] sm:text-[9.5px] text-rose-600/80 font-medium">(Sign Out)</span>}
            </div>
          </button>

        </div>

      </div>
    </div>
  );
};
