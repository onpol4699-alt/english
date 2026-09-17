import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Camera, 
  Upload, 
  Award, 
  Settings2, 
  BookOpen, 
  LogOut, 
  ShieldCheck, 
  Flame,
  Users,
  GraduationCap,
  KeyRound,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  CreditCard,
  Languages,
  BarChart3,
  ArrowRightLeft
} from 'lucide-react';
import { UserProgress, ThemeColorId, UserRole } from '../types';
import { getLevelRankTitle } from '../utils/storage';
import { THEME_COLORS } from './ThemeAndFontSettingsModal';
import { isMasterAdmin, isDeveloperRole, hasAdminPrivilege, getCleanDisplayName } from '../utils/memberStorage';
import { saveAndSyncAvatar, compressImageFile } from '../utils/avatarUtils';
import { PWAInstallButton } from './PWAInstallButton';

interface ProfileDropdownProps {
  progress: UserProgress;
  onUpdateSettings: (updates: Partial<UserProgress>) => void;
  onOpenProfile: () => void;
  onOpenChangePassword?: () => void;
  onOpenSettings: () => void;
  onOpenCertificate: () => void;
  onOpenAdmin: () => void;
  onOpenAdminMembers?: () => void;
  onOpenDeveloperBackup?: () => void;
  onSelectTenses: () => void;
  onSelectLessons?: () => void;
  onOpenLevelSelect?: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  onSelectTab?: (tab: any) => void;
  onLogout: () => void;
  onToggleSpeechRate?: () => void;
  onOpenPersonalQr?: () => void;
  onOpenPlacementTest?: () => void;
  onToggleRole?: (role: UserRole) => void;
  canSwitchRole?: boolean;
  isMobile?: boolean;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  progress,
  onUpdateSettings,
  onOpenProfile,
  onOpenChangePassword,
  onOpenSettings,
  onOpenCertificate,
  onOpenAdmin,
  onOpenAdminMembers,
  onOpenDeveloperBackup,
  onSelectTenses,
  onSelectLessons,
  onOpenLevelSelect,
  onSelectTab,
  onLogout,
  onToggleSpeechRate,
  onOpenPlacementTest,
  onToggleRole,
  canSwitchRole,
  isMobile = false,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const rank = getLevelRankTitle(progress.xp);
  const activeColorObj = THEME_COLORS.find((c) => c.id === progress.themeColor) || THEME_COLORS[0];

  // Dynamic role determination: activeViewRole takes precedence
  const effectiveRole: UserRole = progress.activeViewRole || progress.role || 'Student';
  const isDev = effectiveRole === 'Developer';
  const isTeacher = effectiveRole === 'Teacher';
  const isAdmin = effectiveRole === 'Admin' || effectiveRole === 'Developer';
  const cleanName = getCleanDisplayName(progress.userName);
  const roleBadgeText = effectiveRole;
  const isEn = progress.appLanguage === 'en';

  // Role switching authorization & handler
  const userCanSwitchRole = canSwitchRole ?? (isMasterAdmin(progress.userName, progress.userIdentifier) || isDeveloperRole(progress.role) || progress.role === 'Admin');
  
  const handleCycleRole = () => {
    let nextRole: UserRole = 'Student';
    if (effectiveRole === 'Student') {
      nextRole = 'Teacher';
    } else if (effectiveRole === 'Teacher') {
      nextRole = 'Developer';
    } else {
      nextRole = 'Student';
    }
    if (onToggleRole) {
      onToggleRole(nextRole);
    } else {
      onUpdateSettings({ activeViewRole: nextRole });
    }
  };

  return (
    <div className="relative z-50 overflow-visible" ref={dropdownRef} id="profile-dropdown-container">
      {/* Hidden File Input for Avatar Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleAvatarUpload} 
        className="hidden" 
      />

      {/* Header Profile Trigger Button (Click avatar, name, or arrow to toggle) */}
      {isMobile ? (
        /* Mobile View Trigger: Strict container using relative flex items-center gap-1.5 */
        <button
          id="btn-mobile-avatar-trigger"
          data-testid="profile-button"
          aria-label="Profile Menu"
          aria-haspopup="true"
          aria-expanded={showProfileMenu}
          onClick={() => setShowProfileMenu((prev) => !prev)}
          className="relative flex items-center gap-1.5 py-0.5 px-1 rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer focus:outline-none shrink-0 select-none border border-transparent hover:border-slate-200/80"
          title={`${cleanName} (${roleBadgeText}) - Menu & Settings`}
        >
          {/* 1) Profile Avatar Circle with Rotating Rainbow Gradient Border */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="p-[2px] rounded-full bg-gradient-to-r from-pink-500 via-red-500 via-yellow-500 via-green-500 to-blue-500 animate-spin-slow shadow-xs flex items-center justify-center">
              <div className="rounded-full overflow-hidden bg-white flex items-center justify-center animate-[spin_4s_linear_infinite_reverse]">
                {progress.avatarUrl ? (
                  <img 
                    src={progress.avatarUrl} 
                    alt={cleanName} 
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${activeColorObj.bgClass}`}>
                    {cleanName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2) Mobile Username "Phon Phai" & Glowing Flame Developer Badge */}
          <div className="flex flex-col items-start gap-0.5 text-left justify-center min-w-0 pr-0.5 shrink-0 leading-tight">
            <span className="text-[11px] font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[85px] block leading-tight">
              {cleanName}
            </span>
            <div className="flex items-center shrink-0">
              {isDev ? (
                <span 
                  id="header-dev-badge-pill-mobile"
                  className="bg-slate-900 text-amber-400 font-bold px-2 py-0.5 text-[9px] rounded-full border border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] relative overflow-hidden leading-none whitespace-nowrap select-none shrink-0 inline-flex items-center"
                >
                  Developer
                </span>
              ) : isTeacher ? (
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full border border-blue-400 bg-blue-50 text-blue-600 leading-none whitespace-nowrap">
                  Teacher
                </span>
              ) : isAdmin ? (
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full border border-indigo-400 bg-indigo-50 text-indigo-600 leading-none whitespace-nowrap">
                  Admin
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full border border-emerald-400 bg-emerald-50 text-emerald-600 leading-none whitespace-nowrap">
                  Student
                </span>
              )}
            </div>
          </div>
        </button>
      ) : (
        /* Desktop View Trigger: Unchanged Desktop Layout */
        <button
          id="btn-user-avatar-trigger"
          data-testid="profile-button"
          aria-label="Profile Menu"
          aria-haspopup="true"
          aria-expanded={showProfileMenu}
          onClick={() => setShowProfileMenu((prev) => !prev)}
          className="group flex items-center gap-2.5 py-1 px-2.5 rounded-2xl hover:bg-slate-100/80 transition-colors cursor-pointer focus:outline-none shrink-0 select-none border border-transparent hover:border-slate-200/80"
          title={`${cleanName} (${roleBadgeText}) - Menu & Settings`}
        >
          {/* 1. Avatar Size & Display - Large (w-11 h-11) on desktop */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="avatar-glowing-ring w-11 h-11 rounded-full shrink-0">
              <div className="avatar-glowing-ring-inner rounded-full overflow-hidden">
                {progress.avatarUrl ? (
                  <img 
                    src={progress.avatarUrl} 
                    alt={cleanName} 
                    className="w-full h-full rounded-full shrink-0 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm ${activeColorObj.bgClass}`}>
                    {cleanName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Text Layout: Vertical flex column with gap-0.5, text-sm font-bold on desktop */}
          <div className="flex flex-col items-start gap-0.5 text-left justify-center min-w-0 pr-0.5 shrink-0">
            <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate leading-tight max-w-[160px] block">
              {cleanName}
            </span>
            <div className="flex items-center shrink-0">
              {isDev ? (
                <span 
                  id="header-dev-badge-pill"
                  className="developer-fire-badge shadow-xs select-none shrink-0 inline-flex"
                >
                  <span className="developer-fire-badge-inner bg-slate-950 text-amber-400 font-bold text-[9.5px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 tracking-tight whitespace-nowrap leading-none border border-amber-400/30">
                    <span className="flame-flicker-icon text-[9px] leading-none">🔥</span>
                    <span>Developer</span>
                  </span>
                </span>
              ) : isTeacher ? (
                <span className="bg-blue-600 text-white font-bold text-[9.5px] px-2 py-0.5 rounded-full shadow-xs inline-flex items-center gap-0.5 tracking-tight whitespace-nowrap leading-none shrink-0">
                  <span>Teacher</span>
                </span>
              ) : isAdmin ? (
                <span className="bg-indigo-600 text-white font-bold text-[9.5px] px-2 py-0.5 rounded-full shadow-xs inline-flex items-center gap-0.5 tracking-tight whitespace-nowrap leading-none shrink-0">
                  <span>Admin</span>
                </span>
              ) : (
                <span className="bg-emerald-600 text-white font-bold text-[9.5px] px-2 py-0.5 rounded-full shadow-xs inline-flex items-center gap-0.5 tracking-tight whitespace-nowrap leading-none shrink-0">
                  <span>Student</span>
                </span>
              )}
            </div>
          </div>

          {/* 3. Dropdown Indicator: Downward arrow dropdown icon (▼) next to name/role */}
          <ChevronDown 
            className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ml-0.5 ${
              showProfileMenu ? 'rotate-180 text-indigo-600' : ''
            }`} 
            aria-hidden="true"
          />
        </button>
      )}

      {/* Clean Vertical Dropdown Menu */}
      {showProfileMenu && (
        <div 
          id="profile-dropdown-menu"
          className={
            isMobile
              ? "absolute right-0 top-full mt-2 z-50 w-[85vw] max-w-[270px] bg-white shadow-2xl border border-slate-200 rounded-2xl origin-top-right animate-in fade-in slide-in-from-top-2 duration-150 max-h-[80vh] overflow-y-auto"
              : "absolute right-2 top-full mt-2 z-50 w-[320px] max-h-[85vh] overflow-y-auto bg-white shadow-2xl border border-slate-200 rounded-2xl origin-top-right animate-in fade-in slide-in-from-top-2 duration-150"
          }
        >
          {/* Top Profile Summary Card with Stylish Textured/Grid Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white relative overflow-hidden border-b border-indigo-400/30 shadow-lg">
            {/* Grid pattern overlay & ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none opacity-40" />
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-indigo-500/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-fuchsia-600/20 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-start gap-3 relative z-10">
              {/* Avatar with Camera Overlay */}
              <div 
                className="relative group cursor-pointer shrink-0 mt-0.5" 
                onClick={() => fileInputRef.current?.click()}
                title={isEn ? "Click to upload new photo" : "ចុចដើម្បីប្តូររូបថតថ្មី"}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 border-2 border-white/60 shadow-lg flex items-center justify-center backdrop-blur-md shrink-0">
                  {progress.avatarUrl ? (
                    <img 
                      src={progress.avatarUrl} 
                      alt={cleanName} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-white text-base font-black ${activeColorObj.bgClass}`}>
                      {cleanName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div 
                  className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <Camera className="w-4 h-4" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-gradient-to-tr from-amber-400 to-pink-500 rounded-full text-white border-2 border-purple-900 shadow-xs">
                  <Upload className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* User Meta & Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <h3 className="font-bold text-white text-sm truncate drop-shadow-xs">
                    {cleanName}
                  </h3>
                  <div className="text-[11px] text-indigo-100/90 font-mono truncate mt-0.5">
                    {progress.email || progress.userIdentifier || 'learner@gmail.com'}
                  </div>
                </div>
                
                {/* Developer Badge / Role cleanly positioned with proper spacing so it never covers anything */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {isDev ? (
                    <div className="developer-fire-badge shadow-[0_0_10px_rgba(255,69,0,0.5)] shrink-0 select-none">
                      <div className="developer-fire-badge-inner bg-slate-950 text-amber-400 rounded-full px-2.5 py-0.5 text-xs font-bold tracking-tight whitespace-nowrap inline-flex items-center gap-1 border border-amber-400/30">
                        <span className="flame-flicker-icon text-xs leading-none">🔥</span>
                        <span>Developer</span>
                        {!isEn && <span className="text-[10px] text-amber-300 font-khmer hidden sm:inline">(អ្នកអភិវឌ្ឍន៍)</span>}
                      </div>
                    </div>
                  ) : isTeacher ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold shadow-xs flex items-center gap-1">
                      <span>📚 Teacher</span>
                      {!isEn && <span className="text-[9px] opacity-90 hidden sm:inline">(គ្រូបង្រៀន)</span>}
                    </span>
                  ) : isAdmin ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/50 text-indigo-100 font-bold border border-indigo-300/40 flex items-center gap-1 backdrop-blur-xs">
                      <span>🛡️ Admin</span>
                      {!isEn && <span className="text-[9px] opacity-90 hidden sm:inline">(អ្នកគ្រប់គ្រង)</span>}
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/80 text-white font-bold shadow-xs flex items-center gap-1">
                      <span>🎓 Student</span>
                      {!isEn && <span className="text-[9px] opacity-90 hidden sm:inline">(សិស្ស)</span>}
                    </span>
                  )}

                  {/* Role Switch Button (⇄) inside the dropdown top header with glowing animated border - Mobile Only */}
                  {userCanSwitchRole && isMobile && (
                    <button
                      id="btn-dropdown-role-switcher"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCycleRole();
                      }}
                      className="md:hidden relative inline-flex items-center justify-center p-[1.5px] rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)] hover:scale-105 transition-transform cursor-pointer active:scale-95 group shrink-0"
                      aria-label={`Switch Role (Current: ${effectiveRole})`}
                      title={isEn ? `Switch Role (Current: ${effectiveRole})` : `ប្ដូរតួនាទី (បច្ចុប្បន្ន: ${effectiveRole})`}
                    >
                      <span className="bg-slate-900 text-amber-400 text-xs font-bold px-2 py-1 rounded-[6px] flex items-center gap-1 leading-none whitespace-nowrap">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-180 transition-transform duration-300 shrink-0" />
                        <span>⇄</span>
                      </span>
                    </button>
                  )}
                </div>

                {/* Level / Rank Label */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-indigo-100 font-semibold border border-white/25 backdrop-blur-xs">
                    {rank.en}
                  </span>
                </div>
              </div>

              {/* Compact Animated Install App Icon Button in Top Header */}
              <div className="shrink-0 flex items-center pl-1">
                <PWAInstallButton variant="header-icon" isEn={isEn} />
              </div>
            </div>
          </div>

          {/* ========================================================
              UNIFIED MOBILE LEARNING MODULES (Shown on Mobile)
              (Lessons, Quiz, Flashcards, Vocabulary, Analytics, Rankings)
             ======================================================== */}
          <div className="p-2.5 sm:p-3 bg-slate-50/90 border-b border-slate-200 md:hidden">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1 py-0.5 flex items-center justify-between">
              <span className={isEn ? 'font-sans' : 'font-khmer'}>
                {isEn ? 'Learning Features' : 'មុខងារសិក្សា (Learning Features)'}
              </span>
              <span className="text-[9.5px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full font-sans">
                6 Modules
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
              <button
                id="mobile-menu-item-lessons"
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onSelectTab) onSelectTab('lessons');
                  if (onSelectLessons) onSelectLessons();
                  const mainContent = document.getElementById('main-app-content');
                  if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-emerald-50/70 border border-slate-200 text-left transition cursor-pointer group shadow-2xs"
              >
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold text-slate-900 leading-tight ${isEn ? 'font-sans' : 'font-khmer'}`}>
                    {isEn ? 'Lessons' : 'មេរៀន'}
                  </div>
                  {!isEn && <div className="text-[9.5px] text-slate-500 font-sans leading-none">(Lessons)</div>}
                </div>
              </button>

              <button
                id="mobile-menu-item-quiz"
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onSelectTab) onSelectTab('quiz');
                  const mainContent = document.getElementById('main-app-content');
                  if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-amber-50/70 border border-slate-200 text-left transition cursor-pointer group shadow-2xs"
              >
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold text-slate-900 leading-tight ${isEn ? 'font-sans' : 'font-khmer'}`}>
                    {isEn ? 'Quiz Arena' : 'កម្រងសំណួរ'}
                  </div>
                  {!isEn && <div className="text-[9.5px] text-slate-500 font-sans leading-none">(Quiz)</div>}
                </div>
              </button>

              <button
                id="mobile-menu-item-flashcards"
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onSelectTab) onSelectTab('flashcards');
                  const mainContent = document.getElementById('main-app-content');
                  if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-purple-50/70 border border-slate-200 text-left transition cursor-pointer group shadow-2xs"
              >
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700 shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold text-slate-900 leading-tight ${isEn ? 'font-sans' : 'font-khmer'}`}>
                    {isEn ? 'Flashcards' : 'ប័ណ្ណពាក្យ'}
                  </div>
                  {!isEn && <div className="text-[9.5px] text-slate-500 font-sans leading-none">(Flashcards)</div>}
                </div>
              </button>

              <button
                id="mobile-menu-item-dictionary"
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onSelectTab) onSelectTab('dictionary');
                  const mainContent = document.getElementById('main-app-content');
                  if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-blue-50/70 border border-slate-200 text-left transition cursor-pointer group shadow-2xs"
              >
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                  <Languages className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold text-slate-900 leading-tight ${isEn ? 'font-sans' : 'font-khmer'}`}>
                    {isEn ? 'Vocabulary' : 'វចនានុក្រម'}
                  </div>
                  {!isEn && <div className="text-[9.5px] text-slate-500 font-sans leading-none">(Vocabulary)</div>}
                </div>
              </button>

              <button
                id="mobile-menu-item-analytics"
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onSelectTab) onSelectTab('analytics');
                  const mainContent = document.getElementById('main-app-content');
                  if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-teal-50/70 border border-slate-200 text-left transition cursor-pointer group shadow-2xs"
              >
                <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700 shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold text-slate-900 leading-tight ${isEn ? 'font-sans' : 'font-khmer'}`}>
                    {isEn ? 'Analytics' : 'កាលវិភាគសិក្សា'}
                  </div>
                  {!isEn && <div className="text-[9.5px] text-slate-500 font-sans leading-none">(Analytics)</div>}
                </div>
              </button>

              <button
                id="mobile-menu-item-achievements"
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onSelectTab) onSelectTab('achievements');
                  const mainContent = document.getElementById('main-app-content');
                  if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-rose-50/70 border border-slate-200 text-left transition cursor-pointer group shadow-2xs"
              >
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold text-slate-900 leading-tight ${isEn ? 'font-sans' : 'font-khmer'}`}>
                    {isEn ? 'Rank & Certificate' : 'ចំណាត់ថ្នាក់'}
                  </div>
                  {!isEn && <div className="text-[9.5px] text-slate-500 font-sans leading-none">(Rank & Certificate)</div>}
                </div>
              </button>
            </div>
          </div>

          {/* SECTION: MY ACCOUNT */}
          <div className="p-3 bg-white space-y-1 border-b border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>{isEn ? 'My Account' : 'គណនីខ្ញុំ (My Account)'}</span>
            </div>

            {/* Profile Settings (Edit Name, Avatar, Personal Info) */}
            <button
              id="dropdown-btn-profile-settings"
              onClick={() => {
                setShowProfileMenu(false);
                onOpenProfile();
              }}
              className="w-full px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-900 flex items-center justify-between transition cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-200 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-800 group-hover:text-blue-950 text-xs leading-tight font-khmer">
                  {isEn ? 'Profile Settings' : 'គណនីខ្ញុំ / Profile Settings'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </button>

            {/* Change Password */}
            <button
              id="dropdown-btn-change-password"
              onClick={() => {
                setShowProfileMenu(false);
                onOpenChangePassword?.();
              }}
              className="w-full px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-900 flex items-center justify-between transition cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200 transition-colors">
                  <KeyRound className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-800 group-hover:text-blue-950 text-xs leading-tight font-khmer">
                  {isEn ? 'Change Password' : 'ប្តូរពាក្យសម្ងាត់ / Change Password'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>
          </div>

          {/* 3. SECTION: LEARNING TOOLS */}
          <div className="p-3 bg-white space-y-1 border-b border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isEn ? 'Learning Tools' : 'ឧបករណ៍សិក្សា (Learning Tools)'}</span>
            </div>

            {/* Placement Test */}
            <button
              id="dropdown-btn-placement-test"
              onClick={() => {
                setShowProfileMenu(false);
                onOpenPlacementTest?.();
              }}
              className="w-full px-3 py-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-900 flex items-center justify-between transition cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200 transition-colors">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-800 text-xs leading-tight font-khmer">
                  {isEn ? 'Proficiency Placement Test' : 'តេស្តវាស់ស្ទង់សមត្ថភាព'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold font-khmer">
                {isEn 
                  ? (progress.hasCompletedPlacementTest ? 'Retake' : 'Start') 
                  : (progress.hasCompletedPlacementTest ? 'ធ្វើឡើងវិញ' : 'ចាប់ផ្តើម')}
              </span>
            </button>

            {/* Certificate */}
            <button
              id="dropdown-btn-certificate"
              onClick={() => {
                setShowProfileMenu(false);
                onOpenCertificate();
              }}
              className="w-full px-3 py-2 rounded-xl hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between transition cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-200 transition-colors">
                  <Award className="w-4 h-4" />
                </div>
                <span className={`font-bold text-slate-800 text-xs leading-tight ${isEn ? 'font-sans' : 'font-khmer'}`}>
                  {isEn ? 'Certificate of Completion' : 'វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold whitespace-nowrap font-khmer">
                {isEn ? 'View' : 'មើល'}
              </span>
            </button>
          </div>

          {/* Section: Administration & Member Management (if Admin/Developer) */}
          {isAdmin && (
            <div className="p-3 bg-white space-y-1 border-b border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>{isEn ? 'Admin Portal' : 'ផ្ទាំងគ្រប់គ្រង Admin'}</span>
              </div>

              {/* Member Management Portal */}
              <button
                id="dropdown-btn-admin-members"
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenAdminMembers?.();
                }}
                className="w-full px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-950 flex items-center justify-between transition cursor-pointer text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-200 transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-purple-950 text-xs leading-tight font-khmer">
                    {isEn ? 'Member Management' : 'គ្រប់គ្រងសមាជិក'}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-200 text-purple-900 font-bold">
                  {isDev ? 'Developer' : 'Admin'}
                </span>
              </button>

              {/* App Logo & Name Branding - Strictly Developer Exclusive */}
              {isDev && (
                <button
                  id="dropdown-btn-dev-brand"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenAdmin();
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-amber-50 text-amber-950 flex items-center justify-between transition cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 group-hover:bg-amber-200 transition-colors">
                      <Settings2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5 leading-tight font-khmer">
                      <span>{isEn ? 'App Branding & Settings' : 'រៀបចំប្រព័ន្ធ & ឡូហ្គោ'}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500 text-white font-mono font-bold">Dev 👑</span>
                    </span>
                  </div>
                </button>
              )}

              {/* Developer Failover Backups - 3-Way Passcode & Credential Management */}
              {isDev && onOpenDeveloperBackup && (
                <button
                  id="dropdown-btn-dev-backup"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenDeveloperBackup();
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-purple-50 text-purple-950 flex items-center justify-between transition cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white group-hover:from-purple-600 group-hover:to-indigo-700 shadow-2xs">
                      <Flame className="w-4 h-4 text-amber-300" />
                    </div>
                    <span className="font-bold text-purple-950 text-xs flex items-center gap-1.5 leading-tight font-khmer">
                      <span>{isEn ? 'Developer Failover Backups' : 'សុវត្ថិភាព Developer ហ្វុនថៃ'}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-purple-600 text-white font-mono font-bold">3-Way</span>
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-200 text-purple-900 font-bold">
                    {isEn ? '3 Options' : '3 ជម្រើស'}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* 4. CONSOLIDATED SINGLE COMPACT SETTINGS ENTRY (⚙️ ការកំណត់ / App Settings) */}
          <div className="p-3 bg-white">
            <button
              id="dropdown-btn-app-settings"
              onClick={() => {
                setShowProfileMenu(false);
                onOpenSettings();
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 flex items-center justify-between transition cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition shadow-2xs">
                  <Settings2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-800 group-hover:text-indigo-950 text-xs leading-tight font-khmer">
                  {isEn ? 'App Settings' : 'ការកំណត់ / App Settings'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* 5. LOGOUT BUTTON (🚪 ចាកចេញ / Logout) */}
          <div className="p-3 bg-slate-50">
            <button
              id="dropdown-btn-logout"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowProfileMenu(false);
                onLogout();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-800 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs active:scale-95"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <div className="flex items-center gap-1.5 font-khmer">
                <span className="font-bold text-xs">{isEn ? 'Sign Out' : 'ចាកចេញពីគណនី'}</span>
                {!isEn && <span className="text-[10px] text-rose-600/80 font-medium">(Sign Out)</span>}
              </div>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
