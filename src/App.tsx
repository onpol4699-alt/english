/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DifficultyLevel, UserProgress, QuizResult, AppBrandConfig, UserRole, NavigationTab } from './types';
import { loadUserProgress, saveUserProgress, clearUserSession, getFreshUserProgress, loadAccountProgress } from './utils/storage';
import { isLevelUnlocked, areAllLevelsCompleted, isBeginnerLevelFullyCompleted, isIntermediateLevelFullyCompleted } from './utils/progression';
import { loadBrandConfig, saveBrandConfig } from './utils/brandConfig';
import { saveAndSyncAvatar, getStoredUserAvatar } from './utils/avatarUtils';

import { Navbar } from './components/Navbar';
import { LevelProgressionBar } from './components/LevelProgressionBar';
import { LessonView } from './components/LessonView';
import { QuizArena } from './components/QuizArena';
import { FlashcardsView } from './components/FlashcardsView';
import { VocabDictionary } from './components/VocabDictionary';
import { StudyAnalyticsView } from './components/StudyAnalyticsView';
import { AchievementsView } from './components/AchievementsView';
import { TensesExplorer } from './components/TensesExplorer';
import { ThemeAndFontSettingsModal, KHMER_FONTS, THEME_COLORS } from './components/ThemeAndFontSettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PlacementTestModal } from './components/PlacementTestModal';
import { CertificateModal, CertificateCategory } from './components/CertificateModal';
import { AdminBrandingModal } from './components/AdminBrandingModal';
import { AdminMemberModal } from './components/AdminMemberModal';
import { PersonalQrModal } from './components/PersonalQrModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { BrandLogo } from './components/BrandLogo';
import { onCloudSyncEvent, broadcastSyncEvent } from './utils/cloudSync';
import { getCleanDisplayName, isAuthorizedForRoleSwitching } from './utils/memberStorage';
import { Sparkles, CheckCircle2, LogOut } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());
  const [brand, setBrand] = useState<AppBrandConfig>(() => loadBrandConfig());
  const [activeTab, setActiveTab] = useState<NavigationTab>('lessons');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAdminBrandingOpen, setIsAdminBrandingOpen] = useState<boolean>(false);
  const [isAdminMembersOpen, setIsAdminMembersOpen] = useState<boolean>(false);
  
  // Application Authentication & View State (Requirement 1 & 2)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const p = loadUserProgress();
    return Boolean(p.isAuthenticated && p.hasCompletedOnboarding && p.userIdentifier);
  });
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Certificate Modal state
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [certificateInitialLevel, setCertificateInitialLevel] = useState<CertificateCategory>('all');
  const [isPersonalQrOpen, setIsPersonalQrOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [logoutToast, setLogoutToast] = useState<string>('');
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState<boolean>(false);

  // Placement Test State & Developer Role Switcher (Requirement 1, 2, 3)
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState<boolean>(false);
  const [roleToast, setRoleToast] = useState<string>('');

  const isEn = progress.appLanguage === 'en';
  const activeEffectiveRole = progress.activeViewRole || progress.role;
  const canUserSwitchRole = isAuthorizedForRoleSwitching({
    userIdentifier: progress.userIdentifier,
    email: progress.email,
    phoneNumber: progress.phoneNumber,
    role: progress.role,
    userName: progress.userName,
  });
  const isDevUser = canUserSwitchRole || activeEffectiveRole === 'Developer' || activeEffectiveRole === 'Teacher';

  // Trigger Placement Test immediately on onboarding for regular users if not yet completed
  const shouldTriggerPlacementTest = isLoggedIn && !progress.hasCompletedPlacementTest && !isDevUser;
  const isPlacementModalVisible = isPlacementTestOpen || shouldTriggerPlacementTest;

  // Quiz specific triggers
  const [targetQuizLessonId, setTargetQuizLessonId] = useState<string | undefined>(undefined);
  const [targetQuizLevel, setTargetQuizLevel] = useState<DifficultyLevel | undefined>(undefined);

  // Sync state with sessionStorage
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Real-time Cloud Sync listener (Requirement 1 & 5)
  useEffect(() => {
    const unsubscribe = onCloudSyncEvent((event) => {
      if (event.type === 'SYNC_PROGRESS' || event.type === 'SYNC_ALL' || event.type === 'ACCOUNT_REGISTERED') {
        const refreshed = loadUserProgress();
        setProgress(refreshed);
        if (refreshed.isAuthenticated && refreshed.userIdentifier) {
          setIsLoggedIn(true);
        }
      }
    });
    return unsubscribe;
  }, []);

  // Track active study seconds live from count-up stopwatch
  const handleStudyTimeTick = useCallback((addedSeconds: number = 1) => {
    setProgress((prev) => {
      const increment = typeof addedSeconds === 'number' && addedSeconds > 0 ? addedSeconds : 1;
      const updatedTotal = (prev.totalStudySeconds || 0) + increment;
      const updated = {
        ...prev,
        totalStudySeconds: updatedTotal,
      };
      saveUserProgress(updated);

      // Track daily study seconds in local storage for analytics
      try {
        const todayKey = new Date().toISOString().split('T')[0];
        const storageKey = `eng_kh_daily_study_${prev.userIdentifier || 'guest'}`;
        const raw = localStorage.getItem(storageKey);
        const map = raw ? JSON.parse(raw) : {};
        map[todayKey] = (map[todayKey] || 0) + increment;
        localStorage.setItem(storageKey, JSON.stringify(map));
      } catch {
        // ignore
      }

      return updated;
    });
  }, []);

  // Sync brand settings with localStorage
  const handleSaveBrand = (newConfig: AppBrandConfig) => {
    setBrand(newConfig);
    saveBrandConfig(newConfig);
  };

  // Update specific settings (Font, Theme, Brightness, User Name, Avatar)
  const handleUpdateSettings = (updates: Partial<UserProgress>) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        ...updates,
      };
      saveUserProgress(next);
      if (updates.avatarUrl) {
        saveAndSyncAvatar(updates.avatarUrl, next.userIdentifier, next.userName);
      }
      return next;
    });
  };

  // Complete Onboarding or edit Profile
  const handleCompleteOnboarding = (updatedData: Partial<UserProgress>) => {
    setProgress((prev) => {
      const targetId = updatedData.userIdentifier || prev.userIdentifier;
      const cleanId = (targetId || '').trim().toLowerCase();
      const accountProgress = cleanId ? loadAccountProgress(cleanId) : null;

      const persistentAvatar = 
        updatedData.avatarUrl || 
        (cleanId ? getStoredUserAvatar(cleanId, updatedData.userName || prev.userName) : null) ||
        accountProgress?.avatarUrl || 
        prev.avatarUrl;

      const savedLang = (typeof window !== 'undefined' ? localStorage.getItem('eng_kh_app_language') : null) as ('km' | 'en') | null;
      const effectiveLang = updatedData.appLanguage || savedLang || prev.appLanguage || 'km';

      const merged: UserProgress = {
        ...(accountProgress || prev),
        ...updatedData,
        appLanguage: effectiveLang,
        avatarUrl: persistentAvatar || undefined,
        hasCompletedOnboarding: true,
        isAuthenticated: true,
      };
      saveUserProgress(merged);
      if (persistentAvatar && cleanId) {
        saveAndSyncAvatar(persistentAvatar, cleanId, merged.userName);
      }
      return merged;
    });
    setIsLoggedIn(true);
    setIsEditingProfile(false);
  };

  // Developer/Admin direct bypass of onboarding modal on app update
  const handleSkipToDashboard = () => {
    setProgress((prev) => {
      const devProgress = loadAccountProgress('phonphaihdvk@gmail.com');
      const savedLang = (typeof window !== 'undefined' ? localStorage.getItem('eng_kh_app_language') : null) as ('km' | 'en') | null;
      const effectiveLang = savedLang || prev.appLanguage || 'km';

      const merged: UserProgress = {
        ...(devProgress || prev),
        userName: prev.userName && prev.userName !== 'Dara' ? prev.userName : 'Phon Phai',
        email: prev.email || 'phonphaihdvk@gmail.com',
        phoneNumber: prev.phoneNumber || '012889900',
        role: 'Developer',
        userIdentifier: prev.userIdentifier || 'phonphaihdvk@gmail.com',
        appLanguage: effectiveLang,
        hasCompletedOnboarding: true,
        hasCompletedPlacementTest: true,
        unlockedLevels: ['beginner', 'intermediate', 'advanced'],
        isAuthenticated: true,
      };
      saveUserProgress(merged);
      return merged;
    });
    setIsLoggedIn(true);
    setIsEditingProfile(false);
  };

  // Toggle active view role for Student / Teacher / Developer (Strictly restricted to Master Developer / Backup credentials)
  const handleToggleRole = (newRole: UserRole) => {
    if (!canUserSwitchRole) {
      setRoleToast(isEn ? 'Unauthorized: Role switching is restricted.' : 'មិនអនុញ្ញាត: មុខងារប្ដូរតួនាទីសម្រាប់តែគណនី Developer ប៉ុណ្ណោះ');
      setTimeout(() => setRoleToast(''), 2500);
      return;
    }

    // 1. Immediately persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('eng_kh_selected_role', newRole);
        localStorage.setItem('eng_kh_active_view_role', newRole);
      } catch (err) {
        console.error('Error persisting role:', err);
      }
    }

    // 2. Update React state immediately to force re-render with new role permissions
    setProgress((prev) => {
      const isPrivileged = newRole === 'Developer' || newRole === 'Teacher';
      let computedUnlocked: DifficultyLevel[] = ['beginner'];
      if (isPrivileged) {
        computedUnlocked = ['beginner', 'intermediate', 'advanced'];
      } else {
        if (
          prev.placementAssignedLevel === 'intermediate' ||
          prev.placementAssignedLevel === 'advanced' ||
          isBeginnerLevelFullyCompleted(prev)
        ) {
          computedUnlocked.push('intermediate');
        }
        if (
          prev.placementAssignedLevel === 'advanced' ||
          (isBeginnerLevelFullyCompleted(prev) && isIntermediateLevelFullyCompleted(prev))
        ) {
          computedUnlocked.push('advanced');
        }
      }

      const updated: UserProgress = {
        ...prev,
        role: newRole,
        activeViewRole: newRole,
        isDeveloperMode: newRole === 'Developer',
        unlockedLevels: computedUnlocked,
      };
      saveUserProgress(updated);
      return updated;
    });

    const roleName = newRole === 'Student' 
      ? (isEn ? 'Student' : '🧑‍🎓 សិស្ស (Student)')
      : newRole === 'Teacher' 
      ? (isEn ? 'Teacher' : '👨‍🏫 គ្រូ (Teacher)')
      : (isEn ? 'Developer' : '👨‍💻 អ្នកអភិវឌ្ឍន៍ (Developer)');
    setRoleToast(isEn ? `Switched role: ${roleName}` : `បានប្តូរតួនាទី: ${roleName}`);
    setTimeout(() => {
      setRoleToast('');
    }, 2500);
  };

  // Complete Placement Test and auto-assign level (Requirement 1 & 3)
  const handleCompletePlacementTest = (
    assignedLevel: DifficultyLevel,
    unlockedLevels: DifficultyLevel[],
    scorePercent: number,
    openCertImmediately?: boolean
  ) => {
    const certId = `AEA-CEFR-${Math.floor(100000 + Math.random() * 900000)}`;
    const issueDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    setProgress((prev) => {
      const mergedUnlocked = Array.from(new Set([...(prev.unlockedLevels || ['beginner']), ...unlockedLevels]));
      const updated: UserProgress = {
        ...prev,
        hasCompletedPlacementTest: true,
        placementTestScore: scorePercent,
        placementAssignedLevel: assignedLevel,
        currentLevel: assignedLevel,
        unlockedLevels: mergedUnlocked,
        placementCertificateId: prev.placementCertificateId || certId,
        placementCertificateIssuedDate: prev.placementCertificateIssuedDate || issueDate,
        certificateId: prev.certificateId || certId,
        certificateIssuedDate: prev.certificateIssuedDate || issueDate,
      };
      saveUserProgress(updated);
      return updated;
    });

    setIsPlacementTestOpen(false);

    if (openCertImmediately) {
      setCertificateInitialLevel('placement');
      setIsCertificateOpen(true);
    } else {
      setRoleToast(isEn 
        ? `Placement Complete! Level: ${assignedLevel.toUpperCase()} (${scorePercent}%) • CEFR Certificate Ready!`
        : `ការវាស់ស្ទង់បានជោគជ័យ! កម្រិតរបស់អ្នកគឺ: ${assignedLevel.toUpperCase()} (${scorePercent}%) • វិញ្ញាបនបត្រ CEFR ត្រូវបានបង្កើតជូន!`
      );
      setTimeout(() => {
        setRoleToast('');
      }, 4500);
    }
  };

  // Developer Bypass of Placement Test (Requirement 1)
  const handleBypassPlacementDev = () => {
    setProgress((prev) => {
      const updated: UserProgress = {
        ...prev,
        hasCompletedPlacementTest: true,
        unlockedLevels: ['beginner', 'intermediate', 'advanced'],
        role: 'Developer',
      };
      saveUserProgress(updated);
      return updated;
    });
    setIsPlacementTestOpen(false);
    setRoleToast(isEn ? '⚡ Developer Mode: Bypassed placement test and unlocked all levels!' : '⚡ Developer Mode: បានរំលងការធ្វើតេស្ត និងដោះសោគ្រប់កម្រិតទាំងអស់!');
    setTimeout(() => {
      setRoleToast('');
    }, 3500);
  };

  // Open Certificate Modal (Requirement 3: supports level parameter or smart default)
  const handleOpenCertificate = (level?: CertificateCategory | DifficultyLevel) => {
    if (level) {
      setCertificateInitialLevel(level as CertificateCategory);
    } else {
      const isDev = progress.role === 'Developer';
      if (!isDev && progress.hasCompletedPlacementTest && !areAllLevelsCompleted(progress)) {
        setCertificateInitialLevel('placement');
      } else {
        setCertificateInitialLevel('all');
      }
    }
    setIsCertificateOpen(true);
  };

  // Open Profile Editor
  const handleOpenProfile = () => {
    setIsEditingProfile(true);
  };

  // Open Logout Confirmation Popup (Requirement 5)
  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  // Confirmed Logout execution
  const handleConfirmLogout = () => {
    setIsLogoutConfirmOpen(false);

    try {
      clearUserSession();
    } catch (e) {
      console.error('Error clearing session:', e);
    }

    // 1. Immediately switch Application State to unauthenticated (Login view)
    setIsLoggedIn(false);
    setIsEditingProfile(false);

    // 2. Close all child dialogs
    setIsSettingsOpen(false);
    setIsAdminBrandingOpen(false);
    setIsAdminMembersOpen(false);
    setIsCertificateOpen(false);
    setIsPersonalQrOpen(false);

    // 3. Reset state and ensure no stale data in session
    const fresh = getFreshUserProgress();
    fresh.hasCompletedOnboarding = false;
    fresh.isAuthenticated = false;
    fresh.userName = '';
    fresh.userIdentifier = '';
    fresh.email = '';
    fresh.phoneNumber = '';
    fresh.avatarUrl = '';

    setProgress(fresh);
    saveUserProgress(fresh);

    setActiveTab('lessons');
    const isEn = progress.appLanguage === 'en';
    setLogoutToast(isEn ? 'Logged out successfully!' : 'អ្នកបានចាកចេញពីគណនីដោយជោគជ័យ! (Logged out successfully)');
    setTimeout(() => {
      setLogoutToast('');
    }, 4000);
  };

  // Sequential Level change enforcement
  const handleLevelChange = (level: DifficultyLevel) => {
    if (isLevelUnlocked(level, progress)) {
      setProgress((prev) => ({ ...prev, currentLevel: level }));
    } else {
      const info = level === 'intermediate'
        ? 'សូមរៀនចប់មេរៀន និងប្រឡងជាប់ quiz កម្រិតដំបូង (Beginner) ជាមុនសិន!'
        : 'សូមរៀនចប់មេរៀន និងប្រឡងជាប់ quiz កម្រិតមធ្យម (Intermediate) ជាមុនសិន!';
      alert(`កម្រិតនេះត្រូវបានចាក់សោ (Locked)! ${info}`);
    }
  };

  // Toggle voice speech rate
  const handleToggleSpeechRate = () => {
    setProgress((prev) => ({
      ...prev,
      speechRate: prev.speechRate === 0.75 ? 0.9 : 0.75,
    }));
  };

  // Complete a lesson and update unlocks sequentially
  const handleCompleteLesson = (lessonId: string, xpReward: number) => {
    setProgress((prev) => {
      const isAlreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = isAlreadyCompleted 
        ? prev.completedLessonIds 
        : [...prev.completedLessonIds, lessonId];
      const newXp = isAlreadyCompleted ? prev.xp : prev.xp + xpReward;

      const tempProgress = { ...prev, completedLessonIds: newCompleted, xp: newXp };
      const intermediateUnlocked = isLevelUnlocked('intermediate', tempProgress);
      const advancedUnlocked = isLevelUnlocked('advanced', tempProgress);

      const unlocked: DifficultyLevel[] = ['beginner'];
      if (intermediateUnlocked) unlocked.push('intermediate');
      if (advancedUnlocked) unlocked.push('advanced');

      return {
        ...prev,
        completedLessonIds: newCompleted,
        unlockedLevels: unlocked,
        xp: newXp,
      };
    });
  };

  // Record quiz completion and update unlocks sequentially
  const handleRecordQuizResult = (result: QuizResult, quizLevel: DifficultyLevel) => {
    setProgress((prev) => {
      const updatedHistory = [
        ...prev.quizHistory,
        {
          quizId: `quiz-${Date.now()}`,
          level: quizLevel,
          score: result.score,
          total: result.total,
          date: result.timestamp,
        },
      ];

      // Exam failure tracking (< 50% fails, 3-attempt limit + 24H cooldown)
      const accuracy = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
      let newFailedAttempts = prev.failedQuizAttempts || 0;
      let newQuizLockedUntil = prev.quizLockedUntil;

      if (accuracy < 50) {
        newFailedAttempts += 1;
        if (newFailedAttempts >= 3) {
          // Lock for 24 hours
          newQuizLockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        }
      } else {
        // Successful pass (>= 50%) resets consecutive failure counter
        newFailedAttempts = 0;
        newQuizLockedUntil = undefined;
      }

      const tempProgress = {
        ...prev,
        xp: prev.xp + result.xpEarned,
        quizHistory: updatedHistory,
        failedQuizAttempts: newFailedAttempts,
        quizLockedUntil: newQuizLockedUntil,
      };

      const intermediateUnlocked = isLevelUnlocked('intermediate', tempProgress);
      const advancedUnlocked = isLevelUnlocked('advanced', tempProgress);

      const unlocked: DifficultyLevel[] = ['beginner'];
      if (intermediateUnlocked) unlocked.push('intermediate');
      if (advancedUnlocked) unlocked.push('advanced');

      return {
        ...tempProgress,
        unlockedLevels: unlocked,
      };
    });
  };

  // Toggle saved vocab bookmark
  const handleToggleSaveVocab = (vocabId: string) => {
    setProgress((prev) => {
      const isSaved = prev.savedVocabIds.includes(vocabId);
      return {
        ...prev,
        savedVocabIds: isSaved
          ? prev.savedVocabIds.filter((id) => id !== vocabId)
          : [...prev.savedVocabIds, vocabId],
      };
    });
  };

  // Toggle mastered vocab
  const handleToggleMasterVocab = (vocabId: string) => {
    setProgress((prev) => {
      const isMastered = prev.masteredVocabIds.includes(vocabId);
      return {
        ...prev,
        masteredVocabIds: isMastered
          ? prev.masteredVocabIds.filter((id) => id !== vocabId)
          : [...prev.masteredVocabIds, vocabId],
        xp: isMastered ? prev.xp : prev.xp + 10,
      };
    });
  };

  // Trigger quiz for specific lesson
  const handleStartQuizForLesson = (lessonId: string) => {
    setTargetQuizLessonId(lessonId);
    setTargetQuizLevel(progress.currentLevel);
    setActiveTab('quiz');
  };

  // Trigger level mastery exam
  const handleTakeLevelExam = (level: DifficultyLevel) => {
    setTargetQuizLessonId(undefined);
    setTargetQuizLevel(level);
    setActiveTab('quiz');
  };

  // Reset progress
  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? / តើអ្នកពិតជាចង់កំណត់ទិន្នន័យឡើងវិញមែនទេ?')) {
      clearUserSession();
      const fresh = getFreshUserProgress();
      setProgress(fresh);
      saveUserProgress(fresh);
      setIsLoggedIn(false);
      setIsEditingProfile(false);
    }
  };

  // Find active font and theme objects
  const activeFontObj = KHMER_FONTS.find(f => f.id === progress.khmerFont) || KHMER_FONTS[0];
  const activeColorObj = THEME_COLORS.find(c => c.id === progress.themeColor) || THEME_COLORS[0];

  // Theme brightness and background atmosphere classes (Royal Blue & Deep Purple Theme)
  const bgThemeClass = progress.backgroundTheme ? `theme-${progress.backgroundTheme}` : 'theme-light';
  const brightnessClass = 
    progress.themeBrightness === 'dark' 
      ? 'bg-slate-950 text-slate-100' 
      : progress.themeBrightness === 'warm'
      ? 'bg-amber-50/50 text-stone-900'
      : 'bg-white text-slate-900';

  const allCompleted = areAllLevelsCompleted(progress);

  // Unauthenticated / Logged Out View: Render clean full-screen Login & Registration Portal
  if (!isLoggedIn) {
    return (
      <div 
        className={`min-h-screen w-full ${bgThemeClass} ${brightnessClass} ${activeFontObj.fontClass} khmer-size-${progress.khmerFontSize || 'normal'} flex flex-col font-sans transition-colors duration-200`}
      >
        <OnboardingModal
          key={`auth-portal-screen-${progress.appLanguage}`}
          currentProgress={progress}
          brand={brand}
          initialTab="signin"
          onComplete={handleCompleteOnboarding}
          onSkipToDashboard={handleSkipToDashboard}
          onUpdateSettings={handleUpdateSettings}
          isEditing={false}
        />

        {/* Offline Status Toast */}
        <OfflineIndicator />

        {/* Logout Success Toast */}
        {logoutToast && (
          <div 
            id="toast-logout-success"
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none"
          >
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-600/95 backdrop-blur-md text-white shadow-2xl font-khmer text-sm font-semibold border border-emerald-400/40 ring-4 ring-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <span>{logoutToast}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Authenticated Dashboard View
  return (
    <div 
      className={`min-h-screen w-full ${bgThemeClass} ${brightnessClass} ${activeFontObj.fontClass} khmer-size-${progress.khmerFontSize || 'normal'} flex flex-col font-sans transition-colors duration-200 overflow-visible`}
    >
      
      {/* Primary Sticky Navigation Header */}
      <Navbar
        progress={progress}
        brand={brand}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setTargetQuizLessonId(undefined);
          setActiveTab(tab);
        }}
        onLevelChange={handleLevelChange}
        onOpenLevelSelect={(level) => {
          handleLevelChange(level);
          setActiveTab('lessons');
        }}
        onToggleSpeechRate={handleToggleSpeechRate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCertificate={handleOpenCertificate}
        onOpenProfile={handleOpenProfile}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        onOpenAdmin={() => setIsAdminBrandingOpen(true)}
        onOpenAdminMembers={() => setIsAdminMembersOpen(true)}
        onOpenPersonalQr={() => setIsPersonalQrOpen(true)}
        onOpenPlacementTest={() => setIsPlacementTestOpen(true)}
        onToggleRole={handleToggleRole}
        canSwitchRole={canUserSwitchRole}
        onLogout={handleLogout}
        onUpdateSettings={handleUpdateSettings}
        onStudyTimeTick={handleStudyTimeTick}
      />

      {/* Main Body Container with expanded layout width and balanced margins */}
      <main 
        id="main-app-content"
        className="flex-1 w-full max-w-[1400px] mx-auto px-4 pt-18 sm:pt-20 pb-6 sm:pb-8 space-y-4 overflow-visible"
        style={{ paddingTop: '80px' }}
      >
        
        {/* Welcome Greeting & Personalization Bar (Ultra-compact & Dynamic Photo) */}
        {(() => {
          const isEn = progress.appLanguage === 'en';
          const cleanName = getCleanDisplayName(progress.userName);
          const genderHonorific = progress.gender === 'female' ? 'កញ្ញា ' : progress.gender === 'male' ? 'លោក ' : '';
          return (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-2.5 sm:p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 print:hidden">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleOpenProfile}
                  title={isEn ? "Click to edit profile & photo" : "ចុចដើម្បីកែប្រែព័ត៌មាន & រូបថត"}
                  className="avatar-glowing-ring w-10 h-10 sm:w-11 sm:h-11 shrink-0 hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="avatar-glowing-ring-inner">
                    {progress.avatarUrl ? (
                      <img
                        src={progress.avatarUrl}
                        alt={cleanName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-white font-bold ${activeColorObj.bgClass}`}>
                        {cleanName ? cleanName[0].toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                </button>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-sm sm:text-base font-bold text-slate-900 ${isEn ? 'font-sans' : 'font-khmer'}`}>
                      {isEn ? `Hello, ${cleanName}! 👋` : `សួស្តី ${genderHonorific}${cleanName}! 👋`}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium font-mono">
                      {progress.currentLevel.toUpperCase()}
                    </span>
                    {progress.gender && progress.gender !== 'unspecified' && (
                      <span className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ${isEn ? 'font-sans' : 'font-khmer'}`}>
                        {isEn
                          ? (progress.gender === 'female' ? 'Female' : progress.gender === 'male' ? 'Male' : 'Other')
                          : (progress.gender === 'female' ? 'កញ្ញា / ស្ត្រី' : progress.gender === 'male' ? 'លោក / បុរស' : 'ផ្សេងៗ')}
                      </span>
                    )}
                    {allCompleted && (
                      <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center gap-1 ${isEn ? 'font-sans' : 'font-khmer'}`}>
                        <CheckCircle2 className="w-3 h-3 text-amber-600" />
                        {isEn ? 'All Levels Completed (Graduate)' : 'បញ្ចប់គ្រប់កម្រិត (Graduate)'}
                      </span>
                    )}
                  </div>
                  <p className={`${isEn ? 'font-sans' : 'font-khmer'} text-[11px] text-slate-500 mt-0.5`}>
                    {isEn 
                      ? (brand.taglineEn ? `${brand.taglineEn} • ${brand.appName}` : `Learn & Grow Together • ${brand.appName}`)
                      : `${brand.taglineKh} • ${brand.appName}`}
                  </p>
                </div>
              </div>

              {/* Clean Learning Stats Summary */}
              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-2xs">
                  <span className="text-sm">🔥</span>
                  <span>{progress.streakDays || 1} {isEn ? 'Day Streak' : 'ថ្ងៃបន្តបន្ទាប់ (Streak)'}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{progress.xp || 0} XP</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Tab Views with Smooth Animations */}
        <AnimatePresence mode="wait">
          {activeTab === 'lessons' && (
            <motion.div
              key="tab-lessons"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <LessonView
                progress={progress}
                currentLevel={progress.currentLevel}
                onCompleteLesson={handleCompleteLesson}
                onStartQuizForLesson={handleStartQuizForLesson}
                onToggleSaveVocab={handleToggleSaveVocab}
                onToggleMasterVocab={handleToggleMasterVocab}
                onStudyTimeTick={handleStudyTimeTick}
                onOpenCertificate={handleOpenCertificate}
                onOpenPersonalQr={() => setIsPersonalQrOpen(true)}
                onSelectTenseQuiz={(tenseId) => {
                  setTargetQuizLevel(progress.currentLevel);
                  setActiveTab('quiz');
                }}
              />
            </motion.div>
          )}

          {/* 12 English Tenses Master Guide (Requirement 6) */}
          {activeTab === 'tenses' && (
            <motion.div
              key="tab-tenses"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <TensesExplorer
                progress={progress}
                onStartPracticeQuiz={(tenseId) => {
                  setTargetQuizLevel(progress.currentLevel);
                  setActiveTab('quiz');
                }}
              />
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              key="tab-quiz"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <QuizArena
                progress={progress}
                onRecordQuizResult={handleRecordQuizResult}
                onUpdateProgress={handleUpdateSettings}
                initialLessonId={targetQuizLessonId}
                initialLevel={targetQuizLevel || progress.currentLevel}
                onOpenCertificate={handleOpenCertificate}
                onStudyTimeTick={handleStudyTimeTick}
              />
            </motion.div>
          )}

          {activeTab === 'flashcards' && (
            <motion.div
              key="tab-flashcards"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <FlashcardsView
                progress={progress}
                currentLevel={progress.currentLevel}
                onToggleMasterVocab={handleToggleMasterVocab}
                onToggleSaveVocab={handleToggleSaveVocab}
              />
            </motion.div>
          )}

          {activeTab === 'dictionary' && (
            <motion.div
              key="tab-dictionary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <VocabDictionary
                progress={progress}
                onToggleSaveVocab={handleToggleSaveVocab}
                onToggleMasterVocab={handleToggleMasterVocab}
              />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="tab-analytics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <StudyAnalyticsView
                progress={progress}
                onNavigateToLessons={() => setActiveTab('lessons')}
                onNavigateToQuiz={() => setActiveTab('quiz')}
              />
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="tab-achievements"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <AchievementsView
                progress={progress}
                onResetProgress={handleResetProgress}
                onTakeLevelExam={handleTakeLevelExam}
                onOpenCertificate={handleOpenCertificate}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Dynamic Branded Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/70 py-5 sm:py-6 print:hidden">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrandLogo brand={brand} size="sm" />
            <span className="font-semibold text-slate-800">{brand.appName}</span>
            <span>—</span>
            <span className="font-khmer text-slate-700 font-medium">
              {brand.appNameKh} ({brand.taglineKh})
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-khmer">
            <span>© {new Date().getFullYear()} {brand.appName} • Learn & Grow Together</span>
          </div>
        </div>
      </footer>

      {/* Font, Theme Color, Brightness & Settings Modal */}
      <ThemeAndFontSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        progress={progress}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Admin Branding Modal */}
      <AdminBrandingModal
        isOpen={isAdminBrandingOpen}
        onClose={() => setIsAdminBrandingOpen(false)}
        brand={brand}
        onSaveBrand={handleSaveBrand}
      />

      {/* Profile Edit Dialog Modal (when authenticated) */}
      {isEditingProfile && (
        <OnboardingModal
          key={`modal-edit-profile-${progress.appLanguage}`}
          currentProgress={progress}
          brand={brand}
          initialTab="register"
          onComplete={(updated) => {
            handleCompleteOnboarding(updated);
            setIsEditingProfile(false);
          }}
          onSkipToDashboard={handleSkipToDashboard}
          onUpdateSettings={handleUpdateSettings}
          isEditing={true}
          onClose={() => setIsEditingProfile(false)}
        />
      )}

      {/* Admin Member Management Modal */}
      <AdminMemberModal
        isOpen={isAdminMembersOpen}
        onClose={() => setIsAdminMembersOpen(false)}
      />

      {/* Personal Login QR Code Modal */}
      <PersonalQrModal
        isOpen={isPersonalQrOpen}
        onClose={() => setIsPersonalQrOpen(false)}
        progress={progress}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        progress={progress}
        isEn={progress.appLanguage === 'en'}
      />

      {/* Final 3-Level Graduation Certificate with Grades Modal */}
      {isCertificateOpen && (
        <CertificateModal
          progress={progress}
          brand={brand}
          initialLevel={certificateInitialLevel}
          onClose={() => setIsCertificateOpen(false)}
          onNavigateToLevel={(lvl) => {
            setProgress((prev) => ({ ...prev, currentLevel: lvl }));
            setActiveTab('lessons');
          }}
        />
      )}

      {/* Placement Test Modal (Mandatory first-time entry for Students + On-demand Retake) */}
      {isPlacementModalVisible && (
        <PlacementTestModal
          isOpen={isPlacementModalVisible}
          progress={progress}
          onClose={() => setIsPlacementTestOpen(false)}
          onComplete={handleCompletePlacementTest}
          onBypassDev={handleBypassPlacementDev}
        />
      )}

      {/* Role Switcher Feedback Toast (Requirement 2) */}
      {roleToast && (
        <div 
          id="toast-role-feedback"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10050] animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none"
        >
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-indigo-950/95 backdrop-blur-md text-white shadow-2xl font-khmer text-sm font-semibold border border-purple-400/40 ring-4 ring-purple-500/20">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{roleToast}</span>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal (Requirement 5) */}
      {isLogoutConfirmOpen && (
        <div 
          id="modal-logout-confirm-backdrop"
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLogoutConfirmOpen(false)}
        >
          <div 
            id="modal-logout-confirm-card"
            className={`w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-5 animate-in zoom-in-95 duration-200 ${progress.appLanguage === 'en' ? 'font-sans' : 'font-khmer'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-rose-100 border-4 border-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <LogOut className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {progress.appLanguage === 'en' ? 'Are you sure you want to log out?' : 'តើអ្នកពិតជាប្រាកដចង់ចាកចេញមែនទេ?'}
              </h3>
              <p className={`text-xs text-slate-500 ${progress.appLanguage === 'en' ? 'font-sans' : 'font-khmer'}`}>
                {progress.appLanguage === 'en' ? 'Your active session will be closed safely.' : 'សម័យប្រជុំរបស់អ្នកនឹងត្រូវបិទដោយសុវត្ថិភាព (Are you sure you want to log out?)'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                id="btn-logout-cancel"
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl border-2 border-slate-200 hover:bg-slate-100 active:scale-95 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                {progress.appLanguage === 'en' ? 'Cancel' : 'បោះបង់ (Cancel)'}
              </button>

              <button
                id="btn-logout-confirm"
                type="button"
                onClick={handleConfirmLogout}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-rose-600/25 cursor-pointer"
              >
                {progress.appLanguage === 'en' ? 'Log Out' : 'ចាកចេញ (Log Out)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Logout Success Toast */}
      {logoutToast && (
        <div 
          id="toast-logout-success"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none"
        >
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-600/95 backdrop-blur-md text-white shadow-2xl font-khmer text-sm font-semibold border border-emerald-400/40 ring-4 ring-emerald-500/20">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <span>{logoutToast}</span>
          </div>
        </div>
      )}

    </div>
  );
}
