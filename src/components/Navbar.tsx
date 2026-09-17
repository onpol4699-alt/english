import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  QrCode, 
  Sun, 
  Moon,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { UserProgress, DifficultyLevel, AppBrandConfig, UserRole, NavigationTab } from '../types';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationBell } from './NotificationBell';
import { getCleanDisplayName } from '../utils/memberStorage';
import { NavFeatureIcon, NavFeatureIconType } from './NavFeatureIcons';

interface NavbarProps {
  progress: UserProgress;
  brand: AppBrandConfig;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onLevelChange?: (level: DifficultyLevel) => void;
  onOpenLevelSelect?: (level: DifficultyLevel) => void;
  onToggleSpeechRate?: () => void;
  onOpenSettings: () => void;
  onOpenCertificate: () => void;
  onOpenProfile: () => void;
  onOpenChangePassword?: () => void;
  onOpenAdmin: () => void;
  onOpenAdminMembers?: () => void;
  onOpenDeveloperBackup?: () => void;
  onLogout: () => void;
  onUpdateSettings: (updates: Partial<UserProgress>) => void;
  onStudyTimeTick?: (secondsLearned: number) => void;
  onOpenPersonalQr?: () => void;
  onToggleRole?: (newRole: UserRole) => void;
  canSwitchRole?: boolean;
  onOpenPlacementTest?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  brand,
  activeTab,
  setActiveTab,
  onLevelChange,
  onOpenLevelSelect,
  onToggleSpeechRate,
  onOpenSettings,
  onOpenCertificate,
  onOpenProfile,
  onOpenChangePassword,
  onOpenAdmin,
  onOpenAdminMembers,
  onOpenDeveloperBackup,
  onLogout,
  onUpdateSettings,
  onOpenPersonalQr,
  onToggleRole,
  canSwitchRole = false,
  onOpenPlacementTest,
}) => {
  const handleTriggerLogout = () => {
    onLogout();
  };

  const cleanName = getCleanDisplayName(progress.userName);

  // Active role for switcher (Student -> Teacher -> Developer -> Student)
  const activeRole: UserRole = progress.activeViewRole || progress.role || 'Student';
  const isDev = activeRole === 'Developer';
  const isAdmin = activeRole === 'Admin';
  const isEn = progress.appLanguage === 'en';

  const handleCycleRole = () => {
    let nextRole: UserRole = 'Student';
    if (activeRole === 'Student') {
      nextRole = 'Teacher';
    } else if (activeRole === 'Teacher') {
      nextRole = 'Developer';
    } else {
      nextRole = 'Student';
    }
    if (onToggleRole) {
      onToggleRole(nextRole);
    }
  };

  const handleToggleLanguage = () => {
    const nextLang = isEn ? 'km' : 'en';
    try {
      localStorage.setItem('eng_kh_app_language', nextLang);
    } catch {
      // ignore
    }
    onUpdateSettings({ appLanguage: nextLang });
  };

  const isCurrentlyDark = progress.themeBrightness === 'dark' || progress.backgroundTheme === 'dark';
  const handleToggleTheme = () => {
    const nextTheme = isCurrentlyDark ? 'light' : 'dark';
    onUpdateSettings({ 
      themeBrightness: nextTheme, 
      backgroundTheme: nextTheme 
    });
  };

  // Lessons Dropdown Menu State (showLessonsDropdown)
  const [showLessonsDropdown, setShowLessonsDropdown] = useState(false);
  const lessonsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (lessonsDropdownRef.current && !lessonsDropdownRef.current.contains(event.target as Node)) {
        setShowLessonsDropdown(false);
      }
    };
    if (showLessonsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLessonsDropdown]);

  // Main navigation items: bilingual format when Khmer; pure English format when English
  const navItems: {
    id: NavigationTab;
    labelKh: string;
    labelEn: string;
    labelEnText: string;
    iconType: NavFeatureIconType;
    hasDropdown?: boolean;
  }[] = [
    {
      id: 'lessons',
      labelKh: 'មេរៀន',
      labelEn: '(Lessons)',
      labelEnText: 'Lessons',
      iconType: 'lessons',
      hasDropdown: true,
    },
    {
      id: 'quiz',
      labelKh: 'កម្រងសំណួរ',
      labelEn: '(Quiz)',
      labelEnText: 'Quiz',
      iconType: 'quiz',
    },
    {
      id: 'flashcards',
      labelKh: 'ប័ណ្ណពាក្យ',
      labelEn: '(Flashcards)',
      labelEnText: 'Flashcards',
      iconType: 'flashcards',
    },
    {
      id: 'dictionary',
      labelKh: 'វចនានុក្រម',
      labelEn: '(Vocabulary)',
      labelEnText: 'Vocabulary',
      iconType: 'dictionary',
    },
    {
      id: 'analytics',
      labelKh: 'កាលវិភាគសិក្សា',
      labelEn: '(Analytics)',
      labelEnText: 'Analytics',
      iconType: 'analytics',
    },
    {
      id: 'achievements',
      labelKh: 'ចំណាត់ថ្នាក់',
      labelEn: '(Rank & Certificate)',
      labelEnText: 'Rank & Certificate',
      iconType: 'achievements',
    },
  ];

  return (
    <>
      <header 
        id="main-top-navbar"
        className="fixed top-0 left-0 right-0 w-full min-h-16 z-50 bg-white border-b border-slate-200/90 shadow-2xs print:hidden overflow-visible"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          overflow: 'visible',
        }}
      >
        <div 
          id="top-navbar-container"
          className="relative z-50 w-full max-w-[1400px] mx-auto min-h-16 px-4 flex flex-nowrap items-center justify-between gap-1.5 sm:gap-3 overflow-visible"
        >
          
          {/* ========================================================
              LEFT SIDE: App Logo & Desktop Navigation Bar
             ======================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 min-w-0 flex-nowrap shrink-0 overflow-visible">
            {/* App Header Logo - Always 'Angkor English' in English only */}
            <div 
              id="nav-brand-container"
              onClick={() => setActiveTab('lessons')}
              className="my-1 sm:my-1.5 flex items-center gap-1 sm:gap-2 bg-white rounded-xl sm:rounded-2xl px-1.5 sm:px-3 py-1 sm:py-1.5 border border-slate-200/80 shadow-xs cursor-pointer select-none shrink-0 transition-all hover:border-slate-300 hover:shadow active:scale-[0.98]"
              title="Angkor English - Learn & Grow Together"
            >
              {/* Distinct App Icon for 'π' */}
              <div className="relative p-[1.5px] sm:p-[2.5px] rounded-[10px] sm:rounded-[16px] overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.35)]">
                {/* Outer Effect: Vibrant 7-color rainbow rotating border */}
                <div className="absolute inset-[-60%] bg-[conic-gradient(#ff0000,#ff7300,#fffb00,#48ff00,#00ffd5,#002bfb,#7a00ff,#ff0000)] animate-[spin_8s_linear_infinite]" />
                
                {/* Shape: Premium squircle shape & deep gradient */}
                <div className="relative w-6.5 h-6.5 sm:w-9 sm:h-9 rounded-[8px] sm:rounded-[14px] bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center shadow-xs z-10">
                  <span className="text-white font-serif font-bold text-sm sm:text-xl leading-none select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                    π
                  </span>
                </div>
              </div>
              
              {/* App Name: Strictly "Angkor English" in English only */}
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight tracking-tight select-none whitespace-nowrap">
                  Angkor English
                </span>
                <span className="hidden sm:inline-block text-[9px] sm:text-[10px] font-medium text-slate-500 leading-tight tracking-tight select-none whitespace-nowrap">
                  Learn & Grow Together *
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs: Bilingual Khmer on top / English below in parentheses; Pure English when EN */}
            <nav 
              id="main-nav-tabs-desktop"
              className="hidden md:flex items-center gap-1 lg:gap-1.5 flex-nowrap overflow-visible"
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <div 
                    key={item.id} 
                    className="relative flex items-center"
                    ref={item.hasDropdown ? lessonsDropdownRef : undefined}
                  >
                    {isActive ? (
                      /* Active Tab with Dynamic 7-Color Animated Glowing Rainbow Border */
                      <div className="nav-rainbow-active-wrapper">
                        <div className="nav-rainbow-active-spinner" aria-hidden="true" />
                        <div className="nav-rainbow-active-inner">
                          <button
                            id={`desktop-tab-${item.id}`}
                            onClick={() => {
                              setActiveTab(item.id);
                              setShowLessonsDropdown(false);
                              const mainContent = document.getElementById('main-app-content');
                              if (mainContent) {
                                mainContent.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className={`px-2 lg:px-2.5 py-1.5 ${item.hasDropdown ? 'rounded-l-[10.5px] pr-1.5' : 'rounded-[10.5px]'} flex items-center gap-1.5 cursor-pointer select-none bg-indigo-50/90 text-indigo-700 group`}
                          >
                            <NavFeatureIcon type={item.iconType} active={true} size={18} className="w-4 h-4 shrink-0" />
                            <div className="flex flex-col text-left justify-center leading-none">
                              <span className={`text-xs lg:text-[13px] font-bold leading-tight text-indigo-950 ${isEn ? 'font-sans' : 'font-khmer'}`}>
                                {isEn ? item.labelEnText : item.labelKh}
                              </span>
                              {!isEn && (
                                <span className="text-[9.5px] leading-tight text-indigo-600 font-semibold font-sans">
                                  {item.labelEn}
                                </span>
                              )}
                            </div>
                          </button>

                          {item.hasDropdown && (
                            <button
                              id="desktop-tab-lessons-arrow-toggle"
                              type="button"
                              aria-label={isEn ? "Toggle Lessons Menu" : "បើកបញ្ជីកម្រិតមេរៀន"}
                              title={isEn ? "Select Lesson Level (A1-C2, Tenses, Quiz)" : "ជ្រើសរើសកម្រិតមេរៀន (A1-C2, Tenses, Quiz)"}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowLessonsDropdown((prev) => !prev);
                              }}
                              className={`py-2 px-1 lg:px-1.5 rounded-r-[10.5px] transition-all cursor-pointer select-none text-indigo-700 hover:bg-indigo-100/70 ${
                                showLessonsDropdown ? 'bg-indigo-100 text-indigo-800' : ''
                              }`}
                            >
                              <ChevronDown 
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  showLessonsDropdown ? 'rotate-180 text-indigo-600' : ''
                                }`} 
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Inactive Tab */
                      <div className="flex items-center rounded-xl">
                        <button
                          id={`desktop-tab-${item.id}`}
                          onClick={() => {
                            setActiveTab(item.id);
                            setShowLessonsDropdown(false);
                            const mainContent = document.getElementById('main-app-content');
                            if (mainContent) {
                              mainContent.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className={`px-2 lg:px-2.5 py-1.5 ${item.hasDropdown ? 'rounded-l-xl pr-1.5' : 'rounded-xl'} flex items-center gap-1.5 transition-all cursor-pointer select-none border border-transparent text-slate-800 hover:text-indigo-600 hover:bg-slate-100/80 group`}
                        >
                          <NavFeatureIcon type={item.iconType} active={false} size={18} className="w-4 h-4 shrink-0" />
                          <div className="flex flex-col text-left justify-center leading-none">
                            <span className={`text-xs lg:text-[13px] font-bold leading-tight text-slate-800 group-hover:text-indigo-600 ${isEn ? 'font-sans' : 'font-khmer'}`}>
                              {isEn ? item.labelEnText : item.labelKh}
                            </span>
                            {!isEn && (
                              <span className="text-[9.5px] leading-tight text-slate-500 font-medium font-sans">
                                {item.labelEn}
                              </span>
                            )}
                          </div>
                        </button>

                        {item.hasDropdown && (
                          <button
                            id="desktop-tab-lessons-arrow-toggle"
                            type="button"
                            aria-label={isEn ? "Toggle Lessons Menu" : "បើកបញ្ជីកម្រិតមេរៀន"}
                            title={isEn ? "Select Lesson Level (A1-C2, Tenses, Quiz)" : "ជ្រើសរើសកម្រិតមេរៀន (A1-C2, Tenses, Quiz)"}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowLessonsDropdown((prev) => !prev);
                            }}
                            className={`py-2 px-1 lg:px-1.5 rounded-r-xl border border-l-0 border-transparent transition-all cursor-pointer select-none text-slate-400 hover:text-indigo-600 hover:bg-slate-100/80 ${
                              showLessonsDropdown ? 'bg-indigo-100/90 text-indigo-700 border-indigo-300' : ''
                            }`}
                          >
                            <ChevronDown 
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                showLessonsDropdown ? 'rotate-180 text-indigo-600' : ''
                              }`} 
                            />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Lessons Dropdown Menu Popover (📖 មេរៀន ▼) */}
                    {item.hasDropdown && showLessonsDropdown && (
                      <div
                        id="popover-lessons-dropdown"
                        className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-white/98 backdrop-blur-md border border-slate-200/90 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      >
                        {/* Header with QUICK SELECT badge */}
                        <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                          <span className={`text-xs font-bold text-slate-800 ${isEn ? 'font-sans' : 'font-khmer'}`}>
                            {isEn ? 'SELECT LESSON / QUIZ' : 'ជ្រើសរើសមេរៀន / QUIZ'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-sans">
                            {isEn ? 'QUICK SELECT' : 'រហ័ស'}
                          </span>
                        </div>

                        {/* Dropdown Options */}
                        <div className="space-y-1">
                          {/* 1. Beginner */}
                          <button
                            id="dropdown-opt-beginner"
                            type="button"
                            onClick={() => {
                              setShowLessonsDropdown(false);
                              setActiveTab('lessons');
                              onLevelChange?.('beginner');
                              onOpenLevelSelect?.('beginner');
                              const mainContent = document.getElementById('main-app-content');
                              if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">🌱</span>
                              <div>
                                <div className={`text-xs font-bold leading-snug ${isEn ? 'font-sans' : 'font-khmer'}`}>
                                  {isEn ? 'Beginner Level' : 'កម្រិតដំបូង'}
                                </div>
                                <div className="text-[10px] text-slate-500 group-hover:text-emerald-700 font-sans">
                                  {isEn ? 'Beginner • A1-A2 Foundation' : 'Beginner • A1-A2'}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform" />
                          </button>

                          {/* 2. Intermediate */}
                          <button
                            id="dropdown-opt-intermediate"
                            type="button"
                            onClick={() => {
                              setShowLessonsDropdown(false);
                              setActiveTab('lessons');
                              onLevelChange?.('intermediate');
                              onOpenLevelSelect?.('intermediate');
                              const mainContent = document.getElementById('main-app-content');
                              if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-blue-50 text-slate-800 hover:text-blue-900 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">⚡</span>
                              <div>
                                <div className={`text-xs font-bold leading-snug ${isEn ? 'font-sans' : 'font-khmer'}`}>
                                  {isEn ? 'Intermediate Level' : 'កម្រិតមធ្យម'}
                                </div>
                                <div className="text-[10px] text-slate-500 group-hover:text-blue-700 font-sans">
                                  {isEn ? 'Intermediate • B1-B2 Fluency' : 'Intermediate • B1-B2'}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform" />
                          </button>

                          {/* 3. Advanced */}
                          <button
                            id="dropdown-opt-advanced"
                            type="button"
                            onClick={() => {
                              setShowLessonsDropdown(false);
                              setActiveTab('lessons');
                              onLevelChange?.('advanced');
                              onOpenLevelSelect?.('advanced');
                              const mainContent = document.getElementById('main-app-content');
                              if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-rose-50 text-slate-800 hover:text-rose-900 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">👑</span>
                              <div>
                                <div className={`text-xs font-bold leading-snug ${isEn ? 'font-sans' : 'font-khmer'}`}>
                                  {isEn ? 'Advanced Level' : 'កម្រិតខ្ពស់'}
                                </div>
                                <div className="text-[10px] text-slate-500 group-hover:text-rose-700 font-sans">
                                  {isEn ? 'Advanced • C1-C2 Mastery' : 'Advanced • C1-C2'}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-transform" />
                          </button>

                          {/* 4. 12 English Tenses */}
                          <button
                            id="dropdown-opt-tenses"
                            type="button"
                            onClick={() => {
                              setShowLessonsDropdown(false);
                              setActiveTab('tenses');
                              const mainContent = document.getElementById('main-app-content');
                              if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-purple-50 text-slate-800 hover:text-purple-900 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">⏳</span>
                              <div>
                                <div className={`text-xs font-bold leading-snug ${isEn ? 'font-sans' : 'font-khmer'}`}>
                                  {isEn ? '12 English Tenses' : 'កាលទាំង ១២'}
                                </div>
                                <div className="text-[10px] text-slate-500 group-hover:text-purple-700 font-sans">
                                  {isEn ? 'Master All 12 English Tenses' : '12 English Tenses'}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-transform" />
                          </button>

                          {/* 5. Quiz Arena */}
                          <button
                            id="dropdown-opt-quiz-arena"
                            type="button"
                            onClick={() => {
                              setShowLessonsDropdown(false);
                              setActiveTab('quiz');
                              const mainContent = document.getElementById('main-app-content');
                              if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-amber-50 text-slate-800 hover:text-amber-900 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">🎯</span>
                              <div>
                                <div className={`text-xs font-bold leading-snug ${isEn ? 'font-sans' : 'font-khmer'}`}>
                                  {isEn ? 'Quiz Arena' : 'កម្រង Quiz ទាំងអស់'}
                                </div>
                                <div className="text-[10px] text-slate-500 group-hover:text-amber-700 font-sans">
                                  {isEn ? 'Interactive Practice & Quizzes' : 'Quiz Arena'}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-transform" />
                          </button>

                          {/* 6. Placement Test */}
                          <button
                            id="dropdown-opt-placement-test"
                            type="button"
                            onClick={() => {
                              setShowLessonsDropdown(false);
                              onOpenPlacementTest?.();
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-indigo-50 text-slate-800 hover:text-indigo-900 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">🎓</span>
                              <div>
                                <div className={`text-xs font-bold leading-snug ${isEn ? 'font-sans' : 'font-khmer'}`}>
                                  {isEn ? 'Placement Test' : 'តេស្តវាស់ស្ទង់'}
                                </div>
                                <div className="text-[10px] text-slate-500 group-hover:text-indigo-700 font-sans">
                                  {isEn ? 'Assess English Level (15-20 mins)' : 'Placement Test • វាស់កម្រិតភាសា'}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* ========================================================
              RIGHT SIDE: Utility icons cleanly on far right
              (Theme, Language EN, Notifications, Profile)
             ======================================================== */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0 ml-auto z-50 flex-nowrap overflow-visible">
            {/* Role Switcher Toggle (Developer/Admin strictly authorized only) */}
            {canSwitchRole && (
              <button
                id="btn-desktop-role-switcher"
                type="button"
                onClick={handleCycleRole}
                className="w-9 h-9 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 group shrink-0"
                aria-label={`Switch Role (Current: ${activeRole})`}
                title={isEn ? `Switch Role (Current: ${activeRole})` : `ប្ដូរតួនាទី (បច្ចុប្បន្ន: ${activeRole})`}
              >
                <ArrowRightLeft className="w-4 h-4 text-indigo-600 group-hover:rotate-180 transition-transform duration-300 shrink-0" />
              </button>
            )}

            {/* Prominent Personal QR Code Button */}
            {onOpenPersonalQr && (
              <button
                id="btn-desktop-personal-qr"
                type="button"
                onClick={onOpenPersonalQr}
                className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 text-blue-600 border border-slate-200 shadow-sm hover:shadow-xs transition-all flex items-center justify-center cursor-pointer shrink-0 active:scale-95 group"
                aria-label={isEn ? "Personal Digital QR ID Badge" : "ប័ណ្ណសម្គាល់ QR (Personal QR)"}
                title={isEn ? "Personal Digital QR ID Badge" : "ប័ណ្ណសម្គាល់ QR (Personal QR)"}
              >
                <QrCode className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </button>
            )}

            {/* Compact Theme Toggle Button (Sun / Moon) */}
            <button
              id="btn-desktop-theme-toggle"
              type="button"
              onClick={handleToggleTheme}
              className="w-9 h-9 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors flex items-center justify-center cursor-pointer shrink-0 active:scale-95"
              aria-label={isCurrentlyDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={isCurrentlyDark ? (isEn ? 'Switch to Light Mode' : 'ប្តូរទៅផ្ទាំងភ្លឺ (Light Mode)') : (isEn ? 'Switch to Dark Mode' : 'ប្តូរទៅផ្ទាំងងងឹត (Dark Mode)')}
            >
              {isCurrentlyDark ? (
                <Sun className="w-4.5 h-4.5 text-amber-500 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-indigo-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Compact Header Language Toggle */}
            <button
              id="btn-desktop-lang-toggle"
              type="button"
              onClick={handleToggleLanguage}
              className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs transition-all flex items-center justify-center cursor-pointer shrink-0 active:scale-95 font-bold text-xs tracking-wider"
              title={isEn ? "Current: English (Click for Khmer)" : "បច្ចុប្បន្ន: ភាសាខ្មែរ (ចុចប្តូរទៅ English)"}
              aria-label={isEn ? "Current: English. Click to switch to Khmer" : "បច្ចុប្បន្ន: ភាសាខ្មែរ។ ចុចដើម្បីប្ដូរទៅ English"}
            >
              <span>{isEn ? 'EN' : 'KH'}</span>
            </button>

            {/* Notification Bell */}
            <NotificationBell progress={progress} />

            {/* Desktop Profile Widget with Dropdown (Phon Phai + Avatar) */}
            <ProfileDropdown
              progress={progress}
              onUpdateSettings={onUpdateSettings}
              onOpenProfile={onOpenProfile}
              onOpenChangePassword={onOpenChangePassword}
              onOpenSettings={onOpenSettings}
              onOpenCertificate={onOpenCertificate}
              onOpenAdmin={onOpenAdmin}
              onOpenAdminMembers={onOpenAdminMembers}
              onOpenDeveloperBackup={onOpenDeveloperBackup}
              onSelectTenses={() => setActiveTab('tenses')}
              onSelectLessons={() => setActiveTab('lessons')}
              onOpenLevelSelect={onOpenLevelSelect}
              onSelectTab={setActiveTab}
              onLogout={handleTriggerLogout}
              onToggleSpeechRate={onToggleSpeechRate}
              onOpenPersonalQr={onOpenPersonalQr}
              onOpenPlacementTest={onOpenPlacementTest}
            />
          </div>

          {/* ========================================================
              MOBILE VIEW: Clean Actions + Single Unified Profile Trigger
              (Role switcher moved inside profile dropdown menu)
             ======================================================== */}
          <div className="flex md:hidden items-center gap-1 sm:gap-1.5 shrink-0 ml-auto z-50 flex-nowrap overflow-visible">
            {/* 1. Personal Digital QR ID Button */}
            {onOpenPersonalQr && (
              <button
                id="btn-mobile-personal-qr"
                type="button"
                onClick={onOpenPersonalQr}
                className="w-7.5 h-7.5 rounded-lg bg-white hover:bg-slate-50 text-blue-600 border border-slate-200 shadow-2xs transition-all flex items-center justify-center cursor-pointer shrink-0 active:scale-95 group"
                aria-label={isEn ? "Personal Digital QR ID Badge" : "ប័ណ្ណសម្គាល់ QR (Personal QR)"}
                title={isEn ? "Personal Digital QR ID Badge" : "ប័ណ្ណសម្គាល់ QR (Personal QR)"}
              >
                <QrCode className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              </button>
            )}

            {/* 3. Dark/Light Mode Toggle */}
            <button
              id="btn-mobile-theme-toggle"
              type="button"
              onClick={handleToggleTheme}
              className="w-7.5 h-7.5 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors flex items-center justify-center cursor-pointer shrink-0 active:scale-95"
              aria-label={isCurrentlyDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={isCurrentlyDark ? (isEn ? 'Switch to Light Mode' : 'ប្តូរទៅផ្ទាំងភ្លឺ') : (isEn ? 'Switch to Dark Mode' : 'ប្តូរទៅផ្ទាំងងងឹត')}
            >
              {isCurrentlyDark ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* 4. Language Switcher (EN / KH) */}
            <button
              id="btn-mobile-lang-toggle"
              type="button"
              onClick={handleToggleLanguage}
              className="w-7.5 h-7.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs transition-all flex items-center justify-center cursor-pointer shrink-0 active:scale-95 font-bold text-[10px] tracking-wider"
              title={isEn ? "Current: English" : "បច្ចុប្បន្ន: ភាសាខ្មែរ"}
              aria-label={isEn ? "Current: English" : "បច្ចុប្បន្ន: ភាសាខ្មែរ"}
            >
              <span>{isEn ? 'EN' : 'KH'}</span>
            </button>

            {/* 5. Notification Bell */}
            <NotificationBell 
              progress={progress} 
              className="relative w-7.5 h-7.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer shrink-0 border border-slate-200/80 bg-white shadow-2xs group flex items-center justify-center active:scale-95"
              iconClassName="w-4 h-4 transition-transform group-hover:rotate-12 text-slate-700"
            />

            {/* 6. Single Unified Profile Trigger on Mobile (Tapping opens unified menu with both features & profile) */}
            <div className="relative z-50 overflow-visible shrink-0">
              <ProfileDropdown
                progress={progress}
                onUpdateSettings={onUpdateSettings}
                onOpenProfile={onOpenProfile}
                onOpenChangePassword={onOpenChangePassword}
                onOpenSettings={onOpenSettings}
                onOpenCertificate={onOpenCertificate}
                onOpenAdmin={onOpenAdmin}
                onOpenAdminMembers={onOpenAdminMembers}
                onOpenDeveloperBackup={onOpenDeveloperBackup}
                onSelectTenses={() => setActiveTab('tenses')}
                onSelectLessons={() => setActiveTab('lessons')}
                onOpenLevelSelect={onOpenLevelSelect}
                onSelectTab={setActiveTab}
                onLogout={handleTriggerLogout}
                onToggleSpeechRate={onToggleSpeechRate}
                onOpenPersonalQr={onOpenPersonalQr}
                onOpenPlacementTest={onOpenPlacementTest}
                onToggleRole={onToggleRole}
                canSwitchRole={canSwitchRole}
                isMobile={true}
              />
            </div>
          </div>

        </div>
      </header>
    </>
  );
};

