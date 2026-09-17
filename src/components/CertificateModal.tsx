import React, { useRef, useState, useEffect, useMemo } from 'react';
import { 
  Award, 
  Download, 
  Printer, 
  Share2, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Lock,
  Unlock,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Trophy,
  GraduationCap,
  ClipboardCheck,
  Check,
  Sliders,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Trash2,
  Palette,
  ShieldCheck,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateCertificateSvg, renderSvgToCanvas, downloadCanvasAsPng, urlToDataUrl } from '../utils/svgPngRenderer';
import { UserProgress, DifficultyLevel, AppBrandConfig } from '../types';
import { 
  areAllLevelsCompleted, 
  calculateOverallGrade, 
  isBeginnerLevelFullyCompleted, 
  isIntermediateLevelFullyCompleted, 
  isAdvancedLevelFullyCompleted,
  BEGINNER_LESSONS,
  INTERMEDIATE_LESSONS,
  ADVANCED_LESSONS
} from '../utils/progression';
import { isDeveloperRole } from '../utils/memberStorage';

export type CertificateCategory = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'placement';

export type CertificateThemeColor = 'gold' | 'emerald' | 'navy' | 'purple' | 'ruby';

export interface DevCertificateConfig {
  logoUrl?: string;
  sealStampUrl?: string;
  directorSignatureUrl?: string;
  linguistSignatureUrl?: string;
  watermarkUrl?: string;
  themeColor: CertificateThemeColor;
  customTitleEn?: string;
  customAcademyEn?: string;
  customAcademyKh?: string;
  directorName?: string;
  directorTitleEn?: string;
  linguistName?: string;
  linguistTitleEn?: string;
}

const DEFAULT_DEV_CONFIG: DevCertificateConfig = {
  themeColor: 'gold',
  directorName: 'Dr. Chan Sophal',
  directorTitleEn: 'Academic Director',
  linguistName: 'Sarah Jenkins, M.Ed.',
  linguistTitleEn: 'Chief Linguist',
};

const THEME_PALETTES: Record<CertificateThemeColor, {
  name: string;
  borderColor: string;
  textColor: string;
  secondaryColor: string;
  sealGradient: string;
  borderClass: string;
  accentBg: string;
}> = {
  gold: {
    name: 'Royal Gold',
    borderColor: '#b45309',
    textColor: '#b45309',
    secondaryColor: '#047857',
    sealGradient: 'from-amber-400 via-amber-500 to-amber-600',
    borderClass: 'border-amber-600',
    accentBg: 'bg-amber-500',
  },
  emerald: {
    name: 'Imperial Emerald',
    borderColor: '#047857',
    textColor: '#047857',
    secondaryColor: '#b45309',
    sealGradient: 'from-emerald-500 via-emerald-600 to-teal-700',
    borderClass: 'border-emerald-600',
    accentBg: 'bg-emerald-600',
  },
  navy: {
    name: 'Sapphire Navy',
    borderColor: '#1e3a8a',
    textColor: '#1e3a8a',
    secondaryColor: '#b45309',
    sealGradient: 'from-blue-500 via-indigo-600 to-blue-800',
    borderClass: 'border-blue-700',
    accentBg: 'bg-blue-700',
  },
  purple: {
    name: 'Majestic Purple',
    borderColor: '#6b21a8',
    textColor: '#6b21a8',
    secondaryColor: '#d97706',
    sealGradient: 'from-purple-500 via-fuchsia-600 to-purple-800',
    borderClass: 'border-purple-700',
    accentBg: 'bg-purple-700',
  },
  ruby: {
    name: 'Crimson Ruby',
    borderColor: '#991b1b',
    textColor: '#991b1b',
    secondaryColor: '#d97706',
    sealGradient: 'from-rose-500 via-red-600 to-rose-800',
    borderClass: 'border-rose-700',
    accentBg: 'bg-rose-700',
  },
};

interface CertificateModalProps {
  progress: UserProgress;
  onClose: () => void;
  brand?: AppBrandConfig;
  onNavigateToLevel?: (level: DifficultyLevel) => void;
  initialLevel?: CertificateCategory;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  progress,
  onClose,
  brand,
  onNavigateToLevel,
  initialLevel,
}) => {
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Hidden File Input Refs for Developer Customization
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sealInputRef = useRef<HTMLInputElement>(null);
  const dirSigInputRef = useRef<HTMLInputElement>(null);
  const lingSigInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  // Developer Customization State (Persistent via localStorage)
  const [devConfig, setDevConfig] = useState<DevCertificateConfig>(() => {
    try {
      const saved = localStorage.getItem('aea_dev_cert_customization');
      if (saved) {
        return { ...DEFAULT_DEV_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_DEV_CONFIG;
  });

  const updateDevConfig = (updater: (prev: DevCertificateConfig) => DevCertificateConfig) => {
    setDevConfig(prev => {
      const updated = updater(prev);
      try {
        localStorage.setItem('aea_dev_cert_customization', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleImageFileChange = (field: keyof DevCertificateConfig, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateDevConfig(prev => ({ ...prev, [field]: dataUrl }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = (field: keyof DevCertificateConfig) => {
    updateDevConfig(prev => ({ ...prev, [field]: undefined }));
  };

  const handleResetDevDefaults = () => {
    setDevConfig(DEFAULT_DEV_CONFIG);
    try {
      localStorage.removeItem('aea_dev_cert_customization');
    } catch {
      // ignore
    }
  };

  // DEVELOPER ROLE CHECK: Only users with user.role === 'developer' (or Developer Mode)
  const isDeveloper = Boolean(
    progress.role === 'Developer' ||
    (progress.role as string)?.toLowerCase() === 'developer' ||
    progress.activeViewRole === 'Developer' ||
    (progress.activeViewRole as string)?.toLowerCase() === 'developer' ||
    Boolean(progress.isDeveloperMode) ||
    isDeveloperRole(progress.userIdentifier || progress.email, progress.userName, progress.role)
  );

  const gradeResult = calculateOverallGrade(progress);
  const isEn = progress.appLanguage === 'en';

  // Completion status for learning levels
  // Condition 1: 100% of that learning level's lessons
  const begDone = isBeginnerLevelFullyCompleted(progress);
  const intDone = isIntermediateLevelFullyCompleted(progress);
  const advDone = isAdvancedLevelFullyCompleted(progress);
  const allLevelsDone = areAllLevelsCompleted(progress);
  // Condition 2: Placement test completed and submitted
  const placementDone = !!progress.hasCompletedPlacementTest || !!progress.placementAssignedLevel;

  const begLessonsDoneCount = BEGINNER_LESSONS.filter(l => progress.completedLessonIds.includes(l.id)).length;
  const intLessonsDoneCount = INTERMEDIATE_LESSONS.filter(l => progress.completedLessonIds.includes(l.id)).length;
  const advLessonsDoneCount = ADVANCED_LESSONS.filter(l => progress.completedLessonIds.includes(l.id)).length;

  const appNameEn = devConfig.customAcademyEn || brand?.appName || 'Angkor English Academy';
  const appNameKh = devConfig.customAcademyKh || brand?.appNameKh || 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ';

  // STRICT ACCESS CONTROL & UNLOCKING RULES:
  // DEVELOPER: Unrestricted access to view, preview, switch tabs & download certificates for all levels.
  // STUDENTS / TEACHERS: Locked by default unless specific completion criteria are met.
  const isCategoryUnlocked = (category: CertificateCategory): boolean => {
    if (isDeveloper) return true; // Developer Override for ALL levels
    switch (category) {
      case 'placement':
        // Condition 2: Unlock Placement CEFR certificate immediately after placement test completion
        return placementDone;
      case 'beginner':
        // Condition 1: Unlock Level 1 certificate only after completing 100% of beginner lessons
        return begDone;
      case 'intermediate':
        // Condition 1: Unlock Level 2 certificate only after completing 100% of intermediate lessons
        return intDone;
      case 'advanced':
        // Condition 1: Unlock Level 3 certificate only after completing 100% of advanced lessons
        return advDone;
      case 'all':
        // Tri-Level diploma only if all 3 levels are completed
        return allLevelsDone;
      default:
        return false;
    }
  };

  // Default active category tab
  const [selectedCategory, setSelectedCategory] = useState<CertificateCategory>(() => {
    if (initialLevel && (isDeveloper || isCategoryUnlocked(initialLevel))) {
      return initialLevel;
    }
    if (isDeveloper) return initialLevel || 'all';
    if (allLevelsDone) return 'all';
    if (placementDone) return 'placement';
    if (begDone) return 'beginner';
    if (intDone) return 'intermediate';
    if (advDone) return 'advanced';
    return initialLevel || 'placement';
  });

  const isCurrentEligible = isCategoryUnlocked(selectedCategory);
  const currentTheme = THEME_PALETTES[devConfig.themeColor || 'gold'];

  // Direct Certificate Image Preview Mode State
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  // Default to 'overview' so users see structured details first instead of jumping to raw canvas
  const [unlockedViewMode, setUnlockedViewMode] = useState<'preview' | 'overview'>('overview');
  const inTabCanvasRef = useRef<HTMLDivElement>(null);
  const [inTabScale, setInTabScale] = useState<number>(0.55);

  // Sync initial level when passed from parent and reset to overview tab
  useEffect(() => {
    if (initialLevel) {
      setSelectedCategory(initialLevel);
      setUnlockedViewMode('overview');
    }
  }, [initialLevel]);

  // Reset cached preview image when category or dev customization changes
  useEffect(() => {
    setPreviewImageSrc(null);
  }, [selectedCategory, devConfig]);

  // Handle escape key to close preview modal
  useEffect(() => {
    if (!isPreviewMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPreviewMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode]);

  // Dynamic responsive scaling for in-tab preview
  useEffect(() => {
    if (unlockedViewMode !== 'preview') return;
    const calculateInTabScale = () => {
      if (!inTabCanvasRef.current) return;
      const { clientWidth } = inTabCanvasRef.current;
      if (clientWidth > 0) {
        const pad = 24;
        const usableW = Math.max(120, clientWidth - pad);
        const scaleW = usableW / 640;
        setInTabScale(Math.min(1.0, Math.max(0.25, scaleW)));
      }
    };

    calculateInTabScale();
    const ro = new ResizeObserver(calculateInTabScale);
    if (inTabCanvasRef.current) {
      ro.observe(inTabCanvasRef.current);
    }
    window.addEventListener('resize', calculateInTabScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calculateInTabScale);
    };
  }, [unlockedViewMode, selectedCategory, isDevToolsOpen]);

  // Generate or retrieve persistent IDs
  const displayId = (progress.userIdentifier || progress.email || '1042').replace(/[^a-zA-Z0-9]/g, '').slice(-4) || '1042';
  const genericCertId = progress.certificateId || `AEA-KH-${displayId}`;
  const issueDate = progress.certificateIssuedDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // CEFR labels & metrics for placement test
  const placementScore = progress.placementTestScore ?? 85;
  const placementLevel = progress.placementAssignedLevel || 'beginner';
  const cefrInfo = useMemo(() => {
    if (placementLevel === 'advanced') {
      return {
        cefrLabel: 'CEFR C1 (Advanced)',
        cefrShort: 'C1',
        levelTitle: 'Advanced Mastery',
        levelTitleKh: 'កម្រិតខ្ពស់ (Advanced C1)',
        letter: placementScore >= 80 ? 'A' : 'B',
      };
    }
    if (placementLevel === 'intermediate') {
      return {
        cefrLabel: 'CEFR B1 - B2 (Intermediate)',
        cefrShort: 'B1/B2',
        levelTitle: 'Intermediate Fluency',
        levelTitleKh: 'កម្រិតមធ្យម (Intermediate B1)',
        letter: placementScore >= 80 ? 'A' : 'B',
      };
    }
    return {
      cefrLabel: 'CEFR A1 - A2 (Beginner Foundation)',
      cefrShort: 'A2',
      levelTitle: 'Beginner Foundation',
      levelTitleKh: 'កម្រិតដំបូង (Beginner A1/A2)',
      letter: placementScore >= 80 ? 'A' : placementScore >= 60 ? 'B' : 'C',
    };
  }, [placementLevel, placementScore]);

  // Certificate specifications for current category
  const certDetails = useMemo(() => {
    const studentName = progress.userName || (isEn ? 'Student Learner' : 'អ្នកសិក្សា (Learner)');

    switch (selectedCategory) {
      case 'placement':
        return {
          id: progress.placementCertificateId || progress.certificateId || `AEA-CEFR-${displayId}`,
          issueDate: progress.placementCertificateIssuedDate || issueDate,
          badgeSubEn: 'STANDARDIZED CEFR DIAGNOSTIC ASSESSMENT & PLACEMENT REPORT',
          titleEn: devConfig.customTitleEn || 'CEFR ENGLISH PLACEMENT CERTIFICATE',
          titleKh: 'វិញ្ញាបនបត្របញ្ជាក់លទ្ធផលតេស្តវាស់ស្ទង់សមត្ថភាពភាសាអង់គ្លេស (CEFR)',
          programEn: 'Standardized CEFR Diagnostic Assessment & Diagnostic Placement',
          programKh: `${appNameKh} • ប្រព័ន្ធវាស់ស្ទង់សមត្ថភាព និងចំណាត់ថ្នាក់កម្រិតស្តង់ដារអន្តរជាតិ`,
          awardedTextEn: 'This official placement certificate certifies that the candidate has successfully completed the diagnostic assessment and demonstrated proficiency at',
          curriculumEn: `Assessed Level: ${placementLevel.toUpperCase()} • ${cefrInfo.cefrLabel}`,
          curriculumKh: `បានឆ្លងកាត់ការធ្វើតេស្តវាស់ស្ទង់ និងទទួលបានចំណាត់ថ្នាក់កម្រិត: ${cefrInfo.levelTitleKh}`,
          perfTitle: `OFFICIAL CEFR RATING: ${cefrInfo.cefrLabel.toUpperCase()}`,
          perfSubKh: `កម្រិតចំណាត់ថ្នាក់: ${cefrInfo.levelTitleKh} • ពិន្ទុវាស់ស្ទង់: ${placementScore}%`,
          perfAccuracy: `Diagnostic Score: ${placementScore}%`,
          perfXP: `Total XP: ${progress.xp} XP`,
          perfCurriculum: 'Standardized Diagnostic Assessment Completed',
          distinctionEn: `Demonstrated solid competency matching international CEFR standards with a diagnostic accuracy of ${placementScore}%.`,
          distinctionKh: `បានបង្ហាញសមត្ថភាពឆ្លើយតបតាមស្តង់ដារអន្តរជាតិ CEFR យ៉ាងត្រឹមត្រូវ ជាមួយនឹងពិន្ទុតេស្តវាស់ស្ទង់ ${placementScore}%។`,
          sealTop: 'CEFR',
          sealCenter: cefrInfo.cefrShort,
          sealBottom: 'VERIFIED',
          fileName: `CEFR-Placement-Certificate-${studentName.replace(/\s+/g, '_')}.png`,
        };

      case 'beginner':
        return {
          id: progress.certificateId ? `${progress.certificateId}-L1` : `AEA-L1-${displayId}`,
          issueDate: issueDate,
          badgeSubEn: 'ACCREDITED ELEMENTARY ENGLISH CERTIFICATE • CEFR A1 - A2',
          titleEn: devConfig.customTitleEn || 'LEVEL 1: BEGINNER FOUNDATION CERTIFICATE',
          titleKh: 'វិញ្ញាបនបត្របញ្ជាក់ការបញ្ចប់កម្រិតដំបូង (Beginner Foundation)',
          programEn: 'Level 1: Essential English Vocabulary, Grammar & Daily Communication',
          programKh: `${appNameKh} • មូលដ្ឋានគ្រឹះវាក្យសព្ទ វេយ្យាករណ៍ និងការសន្ទនាដំបូង`,
          awardedTextEn: 'This elementary English certificate of completion is proudly awarded to',
          curriculumEn: 'For successfully mastering Level 1: Beginner English Foundation (CEFR A1 - A2)',
          curriculumKh: 'បានបញ្ចប់ដោយជោគជ័យនូវមេរៀន និងកម្រងសំណួរមូលដ្ឋានគ្រឹះកម្រិតដំបូង',
          perfTitle: 'PERFORMANCE: ELEMENTARY PROFICIENCY (CEFR A1 - A2)',
          perfSubKh: 'កម្រិតដំបូង • ឆ្លងកាត់ជោគជ័យ',
          perfAccuracy: 'Quiz Accuracy: 90%',
          perfXP: `Total XP: ${progress.xp} XP`,
          perfCurriculum: `${begLessonsDoneCount}/${BEGINNER_LESSONS.length} Lessons Completed`,
          distinctionEn: 'Demonstrated solid grasp of essential vocabulary, grammatical foundations, and everyday phrases.',
          distinctionKh: 'បានបង្ហាញការយល់ដឹងច្បាស់លាស់លើវាក្យសព្ទគ្រឹះ វេយ្យាករណ៍ដំបូង និងការសន្ទនាប្រចាំថ្ងៃ។',
          sealTop: 'CEFR',
          sealCenter: 'A2',
          sealBottom: 'PASSED',
          fileName: `Level-1-Beginner-Certificate-${studentName.replace(/\s+/g, '_')}.png`,
        };

      case 'intermediate':
        return {
          id: progress.certificateId ? `${progress.certificateId}-L2` : `AEA-L2-${displayId}`,
          issueDate: issueDate,
          badgeSubEn: 'ACCREDITED INTERMEDIATE ENGLISH CERTIFICATE • CEFR B1 - B2',
          titleEn: devConfig.customTitleEn || 'LEVEL 2: INTERMEDIATE FLUENCY CERTIFICATE',
          titleKh: 'វិញ្ញាបនបត្របញ្ជាក់ការបញ្ចប់កម្រិតមធ្យម (Intermediate Fluency)',
          programEn: 'Level 2: Intermediate Grammar, Conversational Fluency & Idiomatic Usage',
          programKh: `${appNameKh} • វេយ្យាករណ៍កម្រិតមធ្យម ការសន្ទនារលូន និងកន្សោមពាក្យ`,
          awardedTextEn: 'This intermediate English certificate of fluency is proudly awarded to',
          curriculumEn: 'For successfully mastering Level 2: Intermediate English Fluency (CEFR B1 - B2)',
          curriculumKh: 'បានបញ្ចប់ដោយជោគជ័យនូវមេរៀន និងកម្រងសំណួរកម្រិតមធ្យម',
          perfTitle: 'PERFORMANCE: INDEPENDENT FLUENCY (CEFR B1 - B2)',
          perfSubKh: 'កម្រិតមធ្យម • ឆ្លងកាត់ជោគជ័យ',
          perfAccuracy: 'Quiz Accuracy: 88%',
          perfXP: `Total XP: ${progress.xp} XP`,
          perfCurriculum: `${intLessonsDoneCount}/${INTERMEDIATE_LESSONS.length} Lessons Completed`,
          distinctionEn: 'Demonstrated independent communication skills, nuanced tenses, and complex conversation.',
          distinctionKh: 'បានបង្ហាញសមត្ថភាពប្រាស្រ័យទាក់ទងឯករាជ្យ ការប្រើប្រាស់កាលស្មុគស្មាញ និងការសន្ទនារលូន។',
          sealTop: 'CEFR',
          sealCenter: 'B2',
          sealBottom: 'PASSED',
          fileName: `Level-2-Intermediate-Certificate-${studentName.replace(/\s+/g, '_')}.png`,
        };

      case 'advanced':
        return {
          id: progress.certificateId ? `${progress.certificateId}-L3` : `AEA-L3-${displayId}`,
          issueDate: issueDate,
          badgeSubEn: 'ACCREDITED ADVANCED ENGLISH CERTIFICATE • CEFR C1 - C2',
          titleEn: devConfig.customTitleEn || 'LEVEL 3: ADVANCED MASTERY CERTIFICATE',
          titleKh: 'វិញ្ញាបនបត្របញ្ជាក់ការបញ្ចប់កម្រិតខ្ពស់ (Advanced Mastery)',
          programEn: 'Level 3: Professional English, Academic Expression & Stylistic Mastery',
          programKh: `${appNameKh} • ភាសាអង់គ្លេសកម្រិតវិជ្ជាជីវៈ និងការបញ្ចេញមតិស៊ីជម្រៅ`,
          awardedTextEn: 'This advanced English diploma of mastery is proudly awarded with academic honors to',
          curriculumEn: 'For successfully mastering Level 3: Advanced English Mastery (CEFR C1 - C2)',
          curriculumKh: 'បានបញ្ចប់ដោយជោគជ័យនូវមេរៀន និងកម្រងសំណួរកម្រិតខ្ពស់',
          perfTitle: 'PERFORMANCE: PROFICIENT MASTERY (CEFR C1 - C2)',
          perfSubKh: 'កម្រិតខ្ពស់ • ឧត្តមភាពវិជ្ជាជីវៈ',
          perfAccuracy: 'Quiz Accuracy: 92%',
          perfXP: `Total XP: ${progress.xp} XP`,
          perfCurriculum: `${advLessonsDoneCount}/${ADVANCED_LESSONS.length} Lessons Completed`,
          distinctionEn: 'Demonstrated exceptional command of advanced academic vocabulary, nuance, and professional eloquence.',
          distinctionKh: 'បានបង្ហាញសមត្ថភាពខ្ពស់លើវាក្យសព្ទសិក្សាស្រាវជ្រាវ ការប្រើប្រាស់ភាសាកម្រិតខ្ពស់ និងការបញ្ចេញមតិស៊ីជម្រៅ។',
          sealTop: 'CEFR',
          sealCenter: 'C1',
          sealBottom: 'HONORS',
          fileName: `Level-3-Advanced-Certificate-${studentName.replace(/\s+/g, '_')}.png`,
        };

      case 'all':
      default:
        return {
          id: genericCertId,
          issueDate: issueDate,
          badgeSubEn: 'ACCREDITED TRI-LEVEL ENGLISH DIPLOMA OF COMPLETION',
          titleEn: devConfig.customTitleEn || 'GRADUATION CERTIFICATE OF COMPLETION',
          titleKh: 'វិញ្ញាបនបត្របញ្ចប់ការសិក្សាភាសាអង់គ្លេសពេញលេញ (៣ កម្រិត)',
          programEn: 'Comprehensive English Fluency & Academic Program (CEFR A1 - C2)',
          programKh: `${appNameKh} • កម្មវិធីអភិវឌ្ឍន៍សមត្ថភាពភាសាអង់គ្លេសពេញលេញ`,
          awardedTextEn: 'This accredited graduation diploma is proudly awarded with academic honors to',
          curriculumEn: 'For successfully completing all 3 levels: Beginner, Intermediate & Advanced',
          curriculumKh: 'បានបញ្ចប់ដោយជោគជ័យគ្រប់មេរៀន និងកម្រងសំណួរទាំង ៣ កម្រិត (ដំបូង មធ្យម និងកម្រិតខ្ពស់)',
          perfTitle: `OFFICIAL PERFORMANCE GRADE: ${gradeResult.labelEn.toUpperCase()}`,
          perfSubKh: `${gradeResult.labelKh} • ${gradeResult.distinctionKh}`,
          perfAccuracy: `Overall Accuracy: ${gradeResult.averageScorePercent}%`,
          perfXP: `Total XP: ${progress.xp} XP`,
          perfCurriculum: 'Curriculum: 7/7 Completed',
          distinctionEn: gradeResult.distinctionEn,
          distinctionKh: gradeResult.distinctionKh,
          sealTop: 'GRADE',
          sealCenter: gradeResult.letter,
          sealBottom: 'ACCREDITED',
          fileName: `Graduation-Certificate-${studentName.replace(/\s+/g, '_')}.png`,
        };
    }
  }, [selectedCategory, progress, genericCertId, issueDate, isEn, appNameKh, cefrInfo, placementLevel, placementScore, gradeResult, begLessonsDoneCount, intLessonsDoneCount, advLessonsDoneCount, displayId, devConfig.customTitleEn]);

  useEffect(() => {
    if (isCurrentEligible) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    }
  }, [selectedCategory, isCurrentEligible]);

  const honorific = progress.gender === 'male' ? 'Mr. / លោក' : progress.gender === 'female' ? 'Ms. / កញ្ញា' : 'Learner / សិក្ខាកាម';

  const handlePrint = () => {
    window.print();
  };

  // Fallback 2D Canvas Export in case canvas rendering encounters an issue
  const fallbackDownloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#fdfcf7';
    ctx.fillRect(0, 0, 1200, 850);

    ctx.strokeStyle = currentTheme.borderColor;
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, 1140, 790);

    ctx.strokeStyle = currentTheme.secondaryColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 45, 1110, 760);

    ctx.textAlign = 'center';
    ctx.fillStyle = currentTheme.secondaryColor;
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`${appNameEn.toUpperCase()} • ${appNameKh}`, 600, 105);

    ctx.fillStyle = currentTheme.textColor;
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(certDetails.badgeSubEn, 600, 132);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px serif';
    ctx.fillText(certDetails.titleEn, 600, 195);

    ctx.fillStyle = currentTheme.secondaryColor;
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(certDetails.titleKh, 600, 228);

    ctx.fillStyle = '#64748b';
    ctx.font = '15px sans-serif';
    ctx.fillText(certDetails.awardedTextEn, 600, 272);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 42px sans-serif';
    const studentName = progress.userName || 'Dara / អ្នកសិក្សា';
    ctx.fillText(studentName, 600, 332);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(certDetails.curriculumEn, 600, 390);

    const link = document.createElement('a');
    link.download = certDetails.fileName;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 500);
  };

  // High-Resolution PNG Export using pure SVG Vector Canvas conversion (1123px x 794px A4 Landscape)
  const handleDownloadPng = async () => {
    if (!isCurrentEligible) return;
    setIsGeneratingPng(true);
    try {
      // 1. Await fonts to settle before rendering
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // 2. Generate pure vector SVG according to exact standard A4 dimensions (1123px x 794px)
      const svgString = generateCertificateSvg({
        appNameEn: appNameEn,
        appNameKh: appNameKh,
        studentName: progress.userName || (isEn ? 'Student Learner' : 'អ្នកសិក្សា (Learner)'),
        honorificText: isEn ? (progress.gender === 'female' ? 'Ms. Candidate' : progress.gender === 'male' ? 'Mr. Candidate' : 'Candidate') : honorific,
        certId: certDetails.id,
        issueDate: certDetails.issueDate,
        badgeSubEn: certDetails.badgeSubEn,
        titleEn: certDetails.titleEn,
        titleKh: certDetails.titleKh,
        programKh: certDetails.programKh,
        awardedTextEn: certDetails.awardedTextEn,
        curriculumEn: certDetails.curriculumEn,
        curriculumKh: certDetails.curriculumKh,
        perfTitle: certDetails.perfTitle,
        perfSubKh: certDetails.perfSubKh,
        perfAccuracy: certDetails.perfAccuracy,
        perfXP: certDetails.perfXP,
        perfCurriculum: certDetails.perfCurriculum,
        sealTop: certDetails.sealTop,
        sealCenter: certDetails.sealCenter,
        sealBottom: certDetails.sealBottom,
        directorName: devConfig.directorName || 'Dr. Chan Sophal',
        directorTitleEn: devConfig.directorTitleEn || (isEn ? 'Academic Director' : 'នាយកកម្មវិធីសិក្សា • Academic Director'),
        linguistName: devConfig.linguistName || 'Sarah Jenkins, M.Ed.',
        linguistTitleEn: devConfig.linguistTitleEn || (isEn ? 'Chief Linguist' : 'ប្រធានផ្នែកភាសាវិទ្យា • Chief Linguist'),
        borderColor: currentTheme.borderColor,
        secondaryColor: currentTheme.secondaryColor,
        textColor: currentTheme.textColor,
        logoUrl: devConfig.logoUrl,
        sealStampUrl: devConfig.sealStampUrl,
        directorSignatureUrl: devConfig.directorSignatureUrl,
        linguistSignatureUrl: devConfig.linguistSignatureUrl,
      });

      // 3. Render pure vector SVG directly to Canvas at 2x scale (2246px x 1588px ultra HD)
      const canvas = await renderSvgToCanvas(svgString, 1123, 794, 2);

      // 4. Download canvas directly as PNG
      await downloadCanvasAsPng(canvas, certDetails.fileName);
    } catch (err) {
      console.warn('Pure SVG to Canvas export failed, falling back to manual canvas draw:', err);
      fallbackDownloadPng();
    } finally {
      setIsGeneratingPng(false);
    }
  };

  const handleShare = () => {
    const text = `🎓 ${certDetails.titleEn} (${certDetails.perfTitle}) at ${appNameEn}! (Certificate ID: ${certDetails.id}) 🇰🇭✨`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Calculated accredited / earned study hours for display in the overview card
  const earnedHoursDisplay = useMemo(() => {
    const totalSecs = progress.totalStudySeconds || 0;
    if (totalSecs >= 60) {
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      if (h > 0) {
        return isEn 
          ? `${h}h ${m > 0 ? `${m}m` : ''}`.trim() 
          : `${h} ម៉ោង ${m > 0 ? `${m} នាទី` : ''}`.trim();
      }
      return isEn ? `${m} mins` : `${m} នាទី`;
    }
    // Standard estimated course hours based on completed lessons
    const completedCount = progress.completedLessonIds?.length || 0;
    if (completedCount > 0) {
      const estimatedHours = Math.max(1, Math.round((completedCount * 20) / 60));
      return isEn ? `${estimatedHours} hours` : `${estimatedHours} ម៉ោង`;
    }
    return isEn ? '1 hour' : '1 ម៉ោង';
  }, [progress.totalStudySeconds, progress.completedLessonIds, isEn]);

  // Clean direct preview handler that generates high-res certificate image without DOM scaling bugs
  const handleOpenPreview = async () => {
    setIsPreviewMode(true);
    if (previewImageSrc) return;

    setIsLoadingPreview(true);
    try {
      const logoBase64 = devConfig.logoUrl ? await urlToDataUrl(devConfig.logoUrl) : '';
      const sealStampBase64 = devConfig.sealStampUrl ? await urlToDataUrl(devConfig.sealStampUrl) : '';
      const dirSigBase64 = devConfig.directorSignatureUrl ? await urlToDataUrl(devConfig.directorSignatureUrl) : '';
      const lingSigBase64 = devConfig.linguistSignatureUrl ? await urlToDataUrl(devConfig.linguistSignatureUrl) : '';

      const svgString = generateCertificateSvg({
        appNameEn,
        appNameKh,
        studentName: progress.userName || (isEn ? 'Learner' : 'អ្នកសិក្សា (Learner)'),
        honorificText: isEn ? (progress.gender === 'female' ? 'Ms. Candidate' : progress.gender === 'male' ? 'Mr. Candidate' : 'Candidate') : honorific,
        certId: certDetails.id,
        issueDate: certDetails.issueDate,
        badgeSubEn: certDetails.badgeSubEn,
        titleEn: certDetails.titleEn,
        titleKh: certDetails.titleKh,
        programKh: certDetails.programKh,
        awardedTextEn: certDetails.awardedTextEn,
        curriculumEn: certDetails.curriculumEn,
        curriculumKh: certDetails.curriculumKh,
        perfTitle: certDetails.perfTitle,
        perfSubKh: certDetails.perfSubKh,
        perfAccuracy: certDetails.perfAccuracy,
        perfXP: certDetails.perfXP,
        perfCurriculum: certDetails.perfCurriculum,
        sealTop: certDetails.sealTop,
        sealCenter: certDetails.sealCenter,
        sealBottom: certDetails.sealBottom,
        directorName: devConfig.directorName || 'Dr. Chan Sophal',
        directorTitleEn: devConfig.directorTitleEn || (isEn ? 'Academic Director' : 'នាយកកម្មវិធីសិក្សា • Academic Director'),
        linguistName: devConfig.linguistName || 'Sarah Jenkins, M.Ed.',
        linguistTitleEn: devConfig.linguistTitleEn || (isEn ? 'Chief Linguist' : 'ប្រធានផ្នែកភាសាវិទ្យា • Chief Linguist'),
        borderColor: currentTheme.borderColor,
        secondaryColor: currentTheme.secondaryColor,
        textColor: currentTheme.textColor,
        logoUrl: logoBase64 || devConfig.logoUrl,
        sealStampUrl: sealStampBase64 || devConfig.sealStampUrl,
        directorSignatureUrl: dirSigBase64 || devConfig.directorSignatureUrl,
        linguistSignatureUrl: lingSigBase64 || devConfig.linguistSignatureUrl,
      });

      const canvas = await renderSvgToCanvas(svgString, 1123, 794, 2);
      const dataUrl = canvas.toDataURL('image/png');
      setPreviewImageSrc(dataUrl);
    } catch (err) {
      console.warn('Preview canvas render failed, using SVG blob:', err);
      try {
        const svgString = generateCertificateSvg({
          appNameEn,
          appNameKh,
          studentName: progress.userName || (isEn ? 'Learner' : 'អ្នកសិក្សា (Learner)'),
          honorificText: isEn ? (progress.gender === 'female' ? 'Ms. Candidate' : progress.gender === 'male' ? 'Mr. Candidate' : 'Candidate') : honorific,
          certId: certDetails.id,
          issueDate: certDetails.issueDate,
          badgeSubEn: certDetails.badgeSubEn,
          titleEn: certDetails.titleEn,
          titleKh: certDetails.titleKh,
          programKh: certDetails.programKh,
          awardedTextEn: certDetails.awardedTextEn,
          curriculumEn: certDetails.curriculumEn,
          curriculumKh: certDetails.curriculumKh,
          perfTitle: certDetails.perfTitle,
          perfSubKh: certDetails.perfSubKh,
          perfAccuracy: certDetails.perfAccuracy,
          perfXP: certDetails.perfXP,
          perfCurriculum: certDetails.perfCurriculum,
          sealTop: certDetails.sealTop,
          sealCenter: certDetails.sealCenter,
          sealBottom: certDetails.sealBottom,
          directorName: devConfig.directorName || 'Dr. Chan Sophal',
          directorTitleEn: devConfig.directorTitleEn || (isEn ? 'Academic Director' : 'នាយកកម្មវិធីសិក្សា • Academic Director'),
          linguistName: devConfig.linguistName || 'Sarah Jenkins, M.Ed.',
          linguistTitleEn: devConfig.linguistTitleEn || (isEn ? 'Chief Linguist' : 'ប្រធានផ្នែកភាសាវិទ្យា • Chief Linguist'),
          borderColor: currentTheme.borderColor,
          secondaryColor: currentTheme.secondaryColor,
          textColor: currentTheme.textColor,
          logoUrl: devConfig.logoUrl,
          sealStampUrl: devConfig.sealStampUrl,
          directorSignatureUrl: devConfig.directorSignatureUrl,
          linguistSignatureUrl: devConfig.linguistSignatureUrl,
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        setPreviewImageSrc(blobUrl);
      } catch (e2) {
        console.error('All preview fallbacks failed:', e2);
      }
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Category Selector Tabs definition
  const CATEGORIES: Array<{
    id: CertificateCategory;
    labelEn: string;
    labelKh: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
  }> = [
    {
      id: 'all',
      labelEn: 'Tri-Level Diploma',
      labelKh: 'វិញ្ញាបនបត្រពេញលេញ',
      icon: GraduationCap,
      badge: 'All 3 Levels',
    },
    {
      id: 'beginner',
      labelEn: 'Level 1: Beginner',
      labelKh: 'កម្រិតទី ១ (Beginner)',
      icon: Award,
      badge: 'A1 - A2',
    },
    {
      id: 'intermediate',
      labelEn: 'Level 2: Intermediate',
      labelKh: 'កម្រិតទី ២ (Intermediate)',
      icon: Award,
      badge: 'B1 - B2',
    },
    {
      id: 'advanced',
      labelEn: 'Level 3: Advanced',
      labelKh: 'កម្រិតទី ៣ (Advanced)',
      icon: Trophy,
      badge: 'C1 - C2',
    },
    {
      id: 'placement',
      labelEn: 'Placement Test (CEFR)',
      labelKh: 'តេស្តវាស់ស្ទង់សមត្ថភាព CEFR',
      icon: ClipboardCheck,
      badge: 'Diagnostic',
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 pt-3 sm:pt-4 overflow-y-auto overflow-x-hidden print:p-0 print:bg-white print:static print:inset-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Container Card */}
      <div 
        className="max-w-full w-[95vw] sm:max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-auto max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Hidden File Inputs for Developer Customization */}
        <input 
          ref={logoInputRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => handleImageFileChange('logoUrl', e)} 
        />
        <input 
          ref={sealInputRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => handleImageFileChange('sealStampUrl', e)} 
        />
        <input 
          ref={dirSigInputRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => handleImageFileChange('directorSignatureUrl', e)} 
        />
        <input 
          ref={lingSigInputRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => handleImageFileChange('linguistSignatureUrl', e)} 
        />
        <input 
          ref={watermarkInputRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => handleImageFileChange('watermarkUrl', e)} 
        />

        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-white border-b border-slate-200 px-3 sm:px-6 pt-4 pb-3 sm:py-3.5 flex items-center justify-between gap-2 shrink-0 print:hidden top-0 z-50 sticky">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs sm:text-base text-slate-900 font-khmer truncate">
                  {isEn ? 'Official Certificates' : 'វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា'}
                </span>
                {isDeveloper && (
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-300 flex items-center gap-1 shrink-0">
                    <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                    <span className="hidden xs:inline">Developer Override</span>
                    <span className="xs:hidden">DEV</span>
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-khmer truncate hidden xs:block">
                {isEn ? 'Angkor English Academy Verified Credentials' : 'វិញ្ញាបនបត្រផ្លូវការទទួលស្គាល់ដោយ Angkor English Academy'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Sleek Compact Share Button */}
            <button
              id="btn-cert-header-share"
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-2xs active:scale-95 shrink-0"
              title={isEn ? "Share Certificate" : "ចែករំលែកវិញ្ញាបនបត្រ (Share)"}
              aria-label="Share Certificate"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="hidden xs:inline">{copied ? (isEn ? 'Copied!' : 'បានចម្លង!') : (isEn ? 'Share' : 'ចែករំលែក')}</span>
            </button>

            {/* Close Button - ALWAYS pinned on top-right, never hidden */}
            <button
              id="btn-cert-header-close"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200 active:scale-95 shrink-0"
              title={isEn ? "Close" : "បិទ (Close)"}
              aria-label="Close"
            >
              <X className="w-5 h-5 shrink-0" />
            </button>
          </div>
        </div>

        {/* Level / Certificate Selection Bar with Vibrant Pill Tabs */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center gap-2 sm:gap-2.5 overflow-x-auto shrink-0 print:hidden no-scrollbar">
          {CATEGORIES.map((cat) => {
            const unlocked = isCategoryUnlocked(cat.id);
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md rounded-xl ring-2 ring-indigo-400/40'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : unlocked ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="font-semibold tracking-tight">{isEn ? cat.labelEn : cat.labelKh}</span>
                {unlocked ? (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {cat.badge}
                  </span>
                ) : (
                  <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-500 font-medium'
                  }`}>
                    <Lock className="w-2.5 h-2.5" />
                    <span>Locked</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Developer Studio Bar & Expandable Control Panel */}
        {isDeveloper && (
          <div className="bg-slate-900 border-b border-amber-500/30 shrink-0 print:hidden">
            <div className="px-4 py-2 text-xs text-amber-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40 text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  DEV ACCESS UNRESTRICTED
                </span>
                <span className="font-khmer text-slate-300 text-xs hidden sm:inline">
                  មើល ពិនិត្យ កែសម្រួល និងទាញយកវិញ្ញាបនបត្រគ្រប់កម្រិតដោយគ្មានដែនកំណត់
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsDevToolsOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isDevToolsOpen ? 'Close Studio' : 'Edit Design & Upload Images 🎨'}</span>
              </button>
            </div>

            {/* Expandable Developer Studio Panel */}
            {isDevToolsOpen && (
              <div className="p-4 bg-slate-950 border-t border-amber-500/20 text-slate-200 text-xs space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm text-white">Developer Certificate Customization Studio</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetDevDefaults}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Defaults</span>
                  </button>
                </div>

                {/* 1. Theme Color Palette Picker */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Border & Accent Palette
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(THEME_PALETTES) as CertificateThemeColor[]).map((themeKey) => {
                      const palette = THEME_PALETTES[themeKey];
                      const isSelected = devConfig.themeColor === themeKey;
                      return (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={() => updateDevConfig(prev => ({ ...prev, themeColor: themeKey }))}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                            isSelected 
                              ? 'border-amber-400 bg-amber-400/20 text-white font-bold ring-2 ring-amber-400/30' 
                              : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${palette.accentBg} shrink-0`} />
                          <span>{palette.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Image Uploads Grid (Logos, Seals, Signatures, Watermarks) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Insert Custom Images (Logos, Official Rubber Stamps & Signatures)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    
                    {/* Header Logo */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-300 text-[11px]">Header Logo / Crest</span>
                        {devConfig.logoUrl && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('logoUrl')}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/20"
                            title="Remove Logo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {devConfig.logoUrl ? (
                        <div className="h-12 flex items-center justify-center bg-slate-950 rounded-lg p-1 border border-slate-800">
                          <img src={devConfig.logoUrl} alt="Logo Preview" className="h-full object-contain" />
                        </div>
                      ) : (
                        <div className="h-12 flex items-center justify-center bg-slate-950 rounded-lg text-slate-600 text-[10px] border border-dashed border-slate-800">
                          Default ⚜️ Emblem
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Upload className="w-3 h-3 text-amber-400" />
                        <span>Upload Logo</span>
                      </button>
                    </div>

                    {/* Official Seal / Rubber Stamp */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-300 text-[11px]">Official Seal / Stamp</span>
                        {devConfig.sealStampUrl && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('sealStampUrl')}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/20"
                            title="Remove Seal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {devConfig.sealStampUrl ? (
                        <div className="h-12 flex items-center justify-center bg-slate-950 rounded-lg p-1 border border-slate-800">
                          <img src={devConfig.sealStampUrl} alt="Seal Preview" className="h-full object-contain" />
                        </div>
                      ) : (
                        <div className="h-12 flex items-center justify-center bg-slate-950 rounded-lg text-slate-600 text-[10px] border border-dashed border-slate-800">
                          Default Gold Seal
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => sealInputRef.current?.click()}
                        className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Upload className="w-3 h-3 text-amber-400" />
                        <span>Upload Stamp</span>
                      </button>
                    </div>

                    {/* Director Signature */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-300 text-[11px]">Director Signature</span>
                        {devConfig.directorSignatureUrl && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('directorSignatureUrl')}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/20"
                            title="Remove Signature"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {devConfig.directorSignatureUrl ? (
                        <div className="h-12 flex items-center justify-center bg-slate-950 rounded-lg p-1 border border-slate-800">
                          <img src={devConfig.directorSignatureUrl} alt="Signature Preview" className="h-full object-contain" />
                        </div>
                      ) : (
                        <div className="h-12 flex items-center justify-center bg-slate-950 rounded-lg text-slate-600 text-[10px] border border-dashed border-slate-800 italic">
                          Cursive Script Font
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => dirSigInputRef.current?.click()}
                        className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Upload className="w-3 h-3 text-amber-400" />
                        <span>Upload Signature</span>
                      </button>
                    </div>

                    {/* Chief Linguist Signature */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-300 text-[11px]">Linguist Signature</span>
                        {devConfig.linguistSignatureUrl && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('linguistSignatureUrl')}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/20"
                            title="Remove Signature"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {devConfig.linguistSignatureUrl ? (
                        <div className="h-12 flex items-center justify-center bg-slate-950 rounded-lg p-1 border border-slate-800">
                          <img src={devConfig.linguistSignatureUrl} alt="Signature Preview" className="h-full object-contain" />
                        </div>
                      ) : (
                        <div className="h-12 flex items-center justify-center bg-slate-950 rounded-lg text-slate-600 text-[10px] border border-dashed border-slate-800 italic">
                          Cursive Script Font
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => lingSigInputRef.current?.click()}
                        className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Upload className="w-3 h-3 text-amber-400" />
                        <span>Upload Signature</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* 3. Text Overrides */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Custom Academy Name (EN)</label>
                    <input
                      type="text"
                      value={devConfig.customAcademyEn || ''}
                      onChange={(e) => updateDevConfig(prev => ({ ...prev, customAcademyEn: e.target.value }))}
                      placeholder="Angkor English Academy"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Custom Certificate Title Override</label>
                    <input
                      type="text"
                      value={devConfig.customTitleEn || ''}
                      onChange={(e) => updateDevConfig(prev => ({ ...prev, customTitleEn: e.target.value }))}
                      placeholder="Leave empty for level default"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Director Signatory Name</label>
                    <input
                      type="text"
                      value={devConfig.directorName || ''}
                      onChange={(e) => updateDevConfig(prev => ({ ...prev, directorName: e.target.value }))}
                      placeholder="Dr. Chan Sophal"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* RESPONSIVE INNER CONTAINER */}
        <div className={`flex-1 ${isCurrentEligible ? 'overflow-hidden' : 'overflow-y-auto max-h-[85vh]'} p-3 sm:p-4 bg-slate-100/70 print:p-0 print:bg-white print:max-h-none print:overflow-visible flex flex-col justify-center items-center min-h-0`}>
          
          {/* LOCKED STATE: Clean Lock Badge & Requirements for non-developer users */}
          {!isCurrentEligible ? (
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 space-y-5 my-auto">
              
              {/* Requested Clean Lock Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold font-khmer shadow-2xs text-center">
                <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>បញ្ចប់ការសិក្សាកម្រិតនេះ ឬធ្វើ Placement Test ដើម្បីទទួលបានវិញ្ញាបនបត្រ</span>
              </div>

              {/* Locked Explanation Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-amber-200/90 text-center max-w-xl mx-auto shadow-sm space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200 shadow-2xs">
                  <Lock className="w-7 h-7" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {isEn ? 'Certificate Locked' : 'វិញ្ញាបនបត្រនេះត្រូវបានចាក់សោ'}
                  </h3>
                  <p className="font-khmer text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedCategory === 'placement' ? (
                      isEn 
                        ? 'You have not completed the CEFR Placement Diagnostic Test yet. Take the 20-minute placement test to earn your official CEFR Placement Certificate!'
                        : 'អ្នកមិនទាន់បានធ្វើតេស្តវាស់ស្ទង់សមត្ថភាព CEFR (Placement Test) នៅឡើយទេ។ សូមធ្វើតេស្តរយៈពេល ២០ នាទី ដើម្បីទទួលបានវិញ្ញាបនបត្រ CEFR ផ្លូវការនេះ!'
                    ) : selectedCategory === 'all' ? (
                      isEn 
                        ? 'The official Graduation Diploma requires completing 100% of lessons across all 3 levels (Beginner, Intermediate, Advanced).'
                        : 'វិញ្ញាបនបត្របញ្ចប់ការសិក្សាពេញលេញ តម្រូវឱ្យអ្នកបញ្ចប់ ១០០% នៃមេរៀនគ្រប់កម្រិតទាំង ៣ (Beginner, Intermediate, Advanced)។'
                    ) : (
                      isEn 
                        ? `To unlock this certificate, you must complete 100% of lessons for Level: ${selectedCategory.toUpperCase()}.`
                        : `ដើម្បីដោះសោវិញ្ញាបនបត្រនេះ អ្នកត្រូវតែបញ្ចប់ ១០០% នៃមេរៀនទាំងអស់សម្រាប់កម្រិត ${selectedCategory.toUpperCase()}។`
                    )}
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="pt-2">
                  {selectedCategory === 'beginner' && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Level 1: Beginner Foundation</span>
                        <span className="font-bold">{begLessonsDoneCount}/{BEGINNER_LESSONS.length} Lessons</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.round((begLessonsDoneCount / BEGINNER_LESSONS.length) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  )}

                  {selectedCategory === 'intermediate' && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Level 2: Intermediate Fluency</span>
                        <span className="font-bold">{intLessonsDoneCount}/{INTERMEDIATE_LESSONS.length} Lessons</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.round((intLessonsDoneCount / INTERMEDIATE_LESSONS.length) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  )}

                  {selectedCategory === 'advanced' && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Level 3: Advanced Mastery</span>
                        <span className="font-bold">{advLessonsDoneCount}/{ADVANCED_LESSONS.length} Lessons</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.round((advLessonsDoneCount / ADVANCED_LESSONS.length) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Call to Action Button */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  {selectedCategory === 'placement' ? (
                    <button
                      onClick={() => {
                        onClose();
                      }}
                      className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-khmer font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      <span>ចាប់ផ្តើមធ្វើតេស្តវាស់ស្ទង់សមត្ថភាព (Start Placement Test)</span>
                    </button>
                  ) : onNavigateToLevel && (
                    <button
                      onClick={() => {
                        const targetLevel: DifficultyLevel = selectedCategory === 'all' ? 'beginner' : (selectedCategory as DifficultyLevel);
                        onNavigateToLevel(targetLevel);
                        onClose();
                      }}
                      className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-khmer font-bold text-xs shadow-md flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>{isEn ? 'Start Learning Now' : 'ចាប់ផ្តើមរៀនឥឡូវនេះ (Start Learning)'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3-Level Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                <div className={`p-3 rounded-xl border transition ${
                  begDone ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Level 1
                    </span>
                    {begDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Beginner</h4>
                  <p className="font-khmer text-[11px] text-slate-500">
                    {begLessonsDoneCount}/{BEGINNER_LESSONS.length} មេរៀន
                  </p>
                </div>

                <div className={`p-3 rounded-xl border transition ${
                  intDone ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Level 2
                    </span>
                    {intDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Intermediate</h4>
                  <p className="font-khmer text-[11px] text-slate-500">
                    {intLessonsDoneCount}/{INTERMEDIATE_LESSONS.length} មេរៀន
                  </p>
                </div>

                <div className={`p-3 rounded-xl border transition ${
                  advDone ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Level 3
                    </span>
                    {advDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Advanced</h4>
                  <p className="font-khmer text-[11px] text-slate-500">
                    {advLessonsDoneCount}/{ADVANCED_LESSONS.length} មេរៀន
                  </p>
                </div>
              </div>

            </div>
          ) : (
            /* UNLOCKED STATE: Structured Certificate Overview Card + Live Canvas Preview */
            <div className="w-full flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto my-auto print:hidden">
              {/* View Switcher Tabs: Canvas Preview vs Structured Details */}
              <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-xs w-full mx-auto mb-3 shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setUnlockedViewMode('preview')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    unlockedViewMode === 'preview'
                      ? 'bg-white text-indigo-700 shadow-2xs font-khmer'
                      : 'text-slate-600 hover:text-slate-900 font-khmer'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isEn ? 'Preview Canvas' : 'គំរូវិញ្ញាបនបត្រ'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUnlockedViewMode('overview')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    unlockedViewMode === 'overview'
                      ? 'bg-white text-indigo-700 shadow-2xs font-khmer'
                      : 'text-slate-600 hover:text-slate-900 font-khmer'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isEn ? 'Overview Details' : 'ព័ត៌មានលម្អិត'}</span>
                </button>
              </div>

              {unlockedViewMode === 'preview' ? (
                /* RESPONSIVE LIVE CANVAS PREVIEW */
                <div 
                  ref={inTabCanvasRef}
                  className="w-full max-w-2xl flex flex-col items-center justify-center space-y-3"
                >
                  {/* Outer Scaler Wrapper constrained with aspect-[1.414/1] */}
                  <div 
                    style={{
                      width: `${Math.round(640 * inTabScale)}px`,
                      height: `${Math.round(452 * inTabScale)}px`,
                    }}
                    className="aspect-[1.414/1] w-full max-w-full object-contain relative shrink-0 transition-all duration-150 flex items-center justify-center shadow-lg rounded-2xl overflow-hidden mx-auto"
                  >
                    <div 
                      style={{
                        transform: `scale(${inTabScale})`,
                        transformOrigin: 'top left',
                        width: '640px',
                        height: '452px',
                        borderColor: currentTheme.borderColor,
                        backgroundColor: '#fdfcf7',
                      }}
                      className="absolute top-0 left-0 shrink-0 rounded-2xl shadow-xl overflow-hidden border-6 relative flex flex-col justify-between p-4 sm:p-5 bg-[#fdfcf7] text-slate-800 select-none"
                    >
                        {/* Custom Watermark (if uploaded) */}
                        {devConfig.watermarkUrl && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
                            <img src={devConfig.watermarkUrl} alt="Watermark" className="max-w-[40%] max-h-[40%] object-contain" />
                          </div>
                        )}

                        {/* Inner Decorative Borders */}
                        <div 
                          className="absolute inset-2 border-2 rounded-xl pointer-events-none opacity-60"
                          style={{ borderColor: currentTheme.secondaryColor }}
                        />
                        <div 
                          className="absolute inset-3 border rounded-lg pointer-events-none opacity-40"
                          style={{ borderColor: currentTheme.borderColor }}
                        />

                        {/* Corner Decorative Ornaments */}
                        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: currentTheme.borderColor }} />
                        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: currentTheme.borderColor }} />
                        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: currentTheme.borderColor }} />
                        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: currentTheme.borderColor }} />

                        {/* Header / Academy Crest */}
                        <div className="text-center relative z-10 shrink-0">
                          <div className="flex items-center justify-center gap-2 mb-0.5">
                            {devConfig.logoUrl ? (
                              <img src={devConfig.logoUrl} alt="Academy Logo" className="h-7 w-auto object-contain max-w-[80px]" />
                            ) : (
                              <span className="text-base" style={{ color: currentTheme.textColor }}>⚜️</span>
                            )}
                            <span 
                              className="text-xs uppercase tracking-[0.2em] font-extrabold"
                              style={{ color: currentTheme.secondaryColor }}
                            >
                              {appNameEn}
                            </span>
                            {devConfig.logoUrl ? (
                              <img src={devConfig.logoUrl} alt="Academy Logo" className="h-7 w-auto object-contain max-w-[80px]" />
                            ) : (
                              <span className="text-base" style={{ color: currentTheme.textColor }}>⚜️</span>
                            )}
                          </div>
                          
                          <p className="font-khmer text-[10px] font-bold tracking-wider" style={{ color: currentTheme.secondaryColor }}>
                            {certDetails.programKh}
                          </p>
                          
                          <div className="my-1 flex items-center justify-center gap-2">
                            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-20" />
                            <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: currentTheme.textColor }}>
                              {certDetails.badgeSubEn}
                            </span>
                            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-20" />
                          </div>

                          <h1 className="font-serif text-lg sm:text-xl font-black tracking-tight text-slate-900 uppercase leading-tight">
                            {certDetails.titleEn}
                          </h1>
                          <p className="font-khmer text-xs font-bold mt-0.5 leading-tight" style={{ color: currentTheme.secondaryColor }}>
                            {certDetails.titleKh}
                          </p>
                        </div>

                        {/* Center Recipient Section */}
                        <div className="text-center my-0.5 relative z-10 shrink-0">
                          <p className="text-[10px] text-slate-500 italic tracking-wider font-serif">
                            {certDetails.awardedTextEn}
                          </p>

                          <div className="my-0.5">
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-khmer tracking-tight border-b border-slate-300 inline-block pb-0.5 px-6 leading-snug">
                              {progress.userName || (isEn ? 'Learner' : 'អ្នកសិក្សា (Learner)')}
                            </h2>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {isEn ? (progress.gender === 'female' ? 'Ms. Candidate' : progress.gender === 'male' ? 'Mr. Candidate' : 'Candidate') : honorific} • Credential ID: <span className="font-mono font-bold text-slate-700">{certDetails.id}</span>
                            </p>
                          </div>

                          <div className="max-w-md mx-auto">
                            <p className="text-[10px] sm:text-xs font-bold font-khmer text-emerald-950 truncate">
                              <span className="underline underline-offset-2" style={{ color: currentTheme.secondaryColor }}>
                                {certDetails.curriculumEn}
                              </span>
                            </p>
                            <p className="text-[9px] font-semibold text-slate-600 mt-0.5 font-khmer truncate">
                              {certDetails.curriculumKh}
                            </p>
                          </div>
                        </div>

                        {/* Performance Grade & Distinction Box */}
                        <div className="max-w-lg mx-auto my-0.5 p-2 rounded-xl bg-amber-50/85 border border-amber-300 shadow-2xs text-center relative z-10 shrink-0">
                          <div className="flex items-center justify-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5" style={{ color: currentTheme.textColor }} />
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textColor }}>
                              {certDetails.perfTitle}
                            </span>
                          </div>
                          <div className="font-khmer text-[10px] font-bold mt-0.5" style={{ color: currentTheme.secondaryColor }}>
                            {certDetails.perfSubKh}
                          </div>
                          <div className="flex items-center justify-center gap-3 text-[10px] text-slate-600 font-medium mt-0.5">
                            <span><strong className="text-slate-900">{certDetails.perfAccuracy}</strong></span>
                            <span>•</span>
                            <span><strong style={{ color: currentTheme.secondaryColor }}>{certDetails.perfXP}</strong></span>
                            <span>•</span>
                            <span><strong className="text-slate-900">{certDetails.perfCurriculum}</strong></span>
                          </div>
                        </div>

                        {/* Signatures & Verification Seal */}
                        <div className="grid grid-cols-3 items-end pt-2 border-t border-slate-200/80 relative z-10 shrink-0">
                          {/* Left Signature: Director */}
                          <div className="text-left pl-1">
                            <div className="h-6 flex items-end justify-start">
                              {devConfig.directorSignatureUrl ? (
                                <img src={devConfig.directorSignatureUrl} alt="Director Signature" className="h-6 w-auto object-contain max-w-[100px]" />
                              ) : (
                                <span className="font-serif italic text-sm text-slate-800">
                                  {devConfig.directorName || 'Chan Sophal'}
                                </span>
                              )}
                            </div>
                            <div className="w-24 h-px bg-slate-400 my-0.5" />
                            <p className="text-[10px] font-bold text-slate-900 leading-tight">
                              {devConfig.directorName || 'Dr. Chan Sophal'}
                            </p>
                            <p className="text-[9px] text-slate-500 font-khmer leading-tight">
                              {devConfig.directorTitleEn || (isEn ? 'Academic Director' : 'នាយកកម្មវិធីសិក្សា')}
                            </p>
                          </div>

                          {/* Center Verification Seal / Custom Stamp */}
                          <div className="flex flex-col items-center justify-center">
                            {devConfig.sealStampUrl ? (
                              <div className="relative flex items-center justify-center">
                                <img src={devConfig.sealStampUrl} alt="Official Seal" className="w-11 h-11 object-contain drop-shadow-sm" />
                              </div>
                            ) : (
                              <div 
                                className={`w-11 h-11 rounded-full bg-gradient-to-br ${currentTheme.sealGradient} border-2 border-amber-300 shadow-sm flex flex-col items-center justify-center text-white relative`}
                              >
                                <div className="w-8.5 h-8.5 rounded-full border border-dashed border-white/60 flex flex-col items-center justify-center p-0.5">
                                  <span className="text-[6px] font-black tracking-widest uppercase">{certDetails.sealTop}</span>
                                  <span className="text-xs font-black leading-none">{certDetails.sealCenter}</span>
                                  <span className="text-[5px] font-bold">{certDetails.sealBottom}</span>
                                </div>
                              </div>
                            )}
                            <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                              {certDetails.issueDate}
                            </span>
                          </div>

                          {/* Right Signature: Chief Linguist */}
                          <div className="text-right pr-1">
                            <div className="h-6 flex items-end justify-end">
                              {devConfig.linguistSignatureUrl ? (
                                <img src={devConfig.linguistSignatureUrl} alt="Linguist Signature" className="h-6 w-auto object-contain max-w-[100px] ml-auto" />
                              ) : (
                                <span className="font-serif italic text-sm text-slate-800">
                                  {devConfig.linguistName || 'Sarah Jenkins'}
                                </span>
                              )}
                            </div>
                            <div className="w-24 h-px bg-slate-400 my-0.5 ml-auto" />
                            <p className="text-[10px] font-bold text-slate-900 leading-tight">
                              {devConfig.linguistName || 'Sarah Jenkins, M.Ed.'}
                            </p>
                            <p className="text-[9px] text-slate-500 font-khmer leading-tight">
                              {devConfig.linguistTitleEn || (isEn ? 'Chief Linguist' : 'ប្រធានផ្នែកភាសាវិទ្យា')}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>

                  {/* Action Buttons: Responsive & Nicely Wrapped */}
                  <div className="w-full max-w-xl flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      id="btn-cert-preview-expand"
                      type="button"
                      onClick={handleOpenPreview}
                      className="flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer font-khmer"
                      title="ពង្រីកមើលទំហំធំ (Fullscreen Certificate Preview)"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{isEn ? 'Preview Certificate' : 'មើលវិញ្ញាបនបត្រ'}</span>
                    </button>

                    <button
                      id="btn-cert-preview-download"
                      type="button"
                      onClick={handleDownloadPng}
                      disabled={isGeneratingPng}
                      className="flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer font-khmer disabled:opacity-50"
                      title="ទាញយកវិញ្ញាបនបត្រ PNG"
                    >
                      {isGeneratingPng ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{isEn ? 'Exporting...' : 'កំពុងទាញយក...'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>{isEn ? 'Download PNG' : 'ទាញយក PNG'}</span>
                        </>
                      )}
                    </button>

                    <button
                      id="btn-cert-preview-print"
                      type="button"
                      onClick={handlePrint}
                      className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-slate-100 active:scale-98 text-slate-700 border border-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer font-khmer shrink-0"
                      title="បោះពុម្ព A4 File (Print)"
                    >
                      <Printer className="w-4 h-4 text-slate-600" />
                      <span>{isEn ? 'Print A4' : 'បោះពុម្ព A4'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* STRUCTURED OVERVIEW CARD */
                <div 
                  id="certificate-overview-card"
                  className="w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-lg p-5 sm:p-6 space-y-4 sm:space-y-5 print:hidden transition-all"
                >
                  {/* 1. Card Header with Title, Program & Status Badge */}
                  <div className="flex items-start justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-khmer shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isEn ? 'Certificate Available' : 'មានវិញ្ញាបនបត្រ'}</span>
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80 uppercase tracking-wider">
                          {certDetails.sealCenter || 'VERIFIED'}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 font-khmer leading-snug pt-0.5">
                        {isEn ? (certDetails.titleEn || certDetails.titleKh) : certDetails.titleKh}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {isEn ? (appNameEn || 'Angkor English Academy') : appNameKh} • {isEn ? (certDetails.programEn || certDetails.titleEn) : (certDetails.programKh || certDetails.programEn || certDetails.titleEn)}
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-200/90 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
                      <Award className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>

                  {/* 2. Information Rows with Icons (Compact 2-Column Mobile Grid) */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* 📅 Date */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 font-khmer truncate">
                          {isEn ? 'Issue Date' : 'កាលបរិច្ឆេទចេញ'}
                        </p>
                        <p className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">{certDetails.issueDate}</p>
                      </div>
                    </div>

                    {/* ⏱️ Earned Study Hours (ចំនួនម៉ោងសិក្សាដែលទទួលបាន) */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 font-khmer truncate" title={isEn ? 'Earned Study Hours' : 'ចំនួនម៉ោងសិក្សាដែលទទួលបាន'}>
                          {isEn ? 'Earned Study Hours' : 'ចំនួនម៉ោងសិក្សាដែលទទួលបាន'}
                        </p>
                        <p className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">{earnedHoursDisplay}</p>
                      </div>
                    </div>

                    {/* 🕒 Course Progress / Lesson Completion */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 font-khmer truncate">
                          {isEn ? 'Course Progress' : 'លទ្ធផលការសិក្សា'}
                        </p>
                        <p className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">
                          {isEn ? 'Completed 100%' : 'បញ្ចប់មេរៀន 100%'}
                        </p>
                      </div>
                    </div>

                    {/* 🎓 Learner / Recipient */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 font-khmer truncate">
                          {isEn ? 'Learner Name' : 'ឈ្មោះអ្នកទទួល'}
                        </p>
                        <p className="text-[11px] sm:text-xs font-bold text-slate-800 truncate font-khmer">{progress.userName || (isEn ? 'Learner' : 'អ្នកសិក្សា')}</p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Description Note */}
                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-950 font-khmer leading-relaxed">
                      {isEn 
                        ? 'Your official accredited certificate is issued and ready to view, download, or print.' 
                        : 'វិញ្ញាបនបត្ររបស់អ្នកបានចេញរួចរាល់ — អាចមើល និងទាញយកបាន។'}
                    </p>
                  </div>

                  {/* 4. Bottom Action Buttons (All 3 actions fully available and functional) */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    {/* 👁️ មើលវិញ្ញាបនបត្រ */}
                    <button
                      id="btn-cert-overview-preview"
                      type="button"
                      onClick={handleOpenPreview}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer font-khmer"
                      title={isEn ? "View Certificate" : "មើលវិញ្ញាបនបត្រ"}
                    >
                      <Eye className="w-4 h-4" />
                      <span>{isEn ? 'View Certificate' : 'មើលវិញ្ញាបនបត្រ'}</span>
                    </button>

                    {/* 📥 ទាញយក */}
                    <button
                      id="btn-cert-overview-download"
                      type="button"
                      onClick={handleDownloadPng}
                      disabled={isGeneratingPng}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer font-khmer disabled:opacity-50"
                      title={isEn ? "Download Certificate PNG" : "ទាញយកវិញ្ញាបនបត្រ PNG"}
                    >
                      {isGeneratingPng ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{isEn ? 'Exporting...' : 'កំពុងទាញយក...'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>{isEn ? 'Download' : 'ទាញយក'}</span>
                        </>
                      )}
                    </button>

                    {/* 🖨️ បោះពុម្ព A4 File */}
                    <button
                      id="btn-cert-overview-print"
                      type="button"
                      onClick={handlePrint}
                      className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 active:scale-98 text-slate-700 border border-slate-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer font-khmer shrink-0"
                      title={isEn ? "Print A4 Certificate" : "បោះពុម្ព A4 File"}
                    >
                      <Printer className="w-4 h-4 text-slate-600" />
                      <span>{isEn ? 'Print A4' : 'បោះពុម្ព A4 File'}</span>
                    </button>
                  </div>

                </div>
              )}

              {/* Hidden Printable A4 Certificate (Rendered strictly on print media) */}
              <div className="hidden print:block print:w-full">
                <div 
                  ref={certificateRef}
                  id="printable-certificate"
                  style={{
                    width: '100%',
                    minHeight: '700px',
                    borderColor: currentTheme.borderColor,
                    backgroundColor: '#fdfcf7'
                  }}
                  className="rounded-2xl border-8 flex flex-col justify-between text-slate-800 select-none p-8 overflow-hidden print:shadow-none print:border-8 print:w-full print:h-auto print:static print:transform-none print:p-8"
                >
                  {/* Custom Watermark (if uploaded) */}
                  {devConfig.watermarkUrl && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
                      <img src={devConfig.watermarkUrl} alt="Watermark" className="max-w-[40%] max-h-[40%] object-contain" />
                    </div>
                  )}

                  {/* Inner Decorative Borders */}
                  <div 
                    className="absolute inset-2 border-2 rounded-xl pointer-events-none opacity-60"
                    style={{ borderColor: currentTheme.secondaryColor }}
                  />
                  <div 
                    className="absolute inset-3.5 border rounded-lg pointer-events-none opacity-40"
                    style={{ borderColor: currentTheme.borderColor }}
                  />

                  {/* Corner Decorative Ornaments */}
                  <div className="absolute top-3.5 left-3.5 w-5 h-5 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: currentTheme.borderColor }} />
                  <div className="absolute top-3.5 right-3.5 w-5 h-5 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: currentTheme.borderColor }} />
                  <div className="absolute bottom-3.5 left-3.5 w-5 h-5 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: currentTheme.borderColor }} />
                  <div className="absolute bottom-3.5 right-3.5 w-5 h-5 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: currentTheme.borderColor }} />

                  {/* Header / Academy Crest */}
                  <div className="text-center relative z-10 shrink-0">
                    <div className="flex items-center justify-center gap-2 mb-0.5">
                      {devConfig.logoUrl ? (
                        <img src={devConfig.logoUrl} alt="Academy Logo" className="h-7 w-auto object-contain max-w-[80px]" />
                      ) : (
                        <span className="text-base" style={{ color: currentTheme.textColor }}>⚜️</span>
                      )}
                      <span 
                        className="text-xs sm:text-sm uppercase tracking-[0.2em] font-extrabold"
                        style={{ color: currentTheme.secondaryColor }}
                      >
                        {appNameEn}
                      </span>
                      {devConfig.logoUrl ? (
                        <img src={devConfig.logoUrl} alt="Academy Logo" className="h-7 w-auto object-contain max-w-[80px]" />
                      ) : (
                        <span className="text-base" style={{ color: currentTheme.textColor }}>⚜️</span>
                      )}
                    </div>
                    
                    <p className="font-khmer text-[11px] font-bold tracking-wider" style={{ color: currentTheme.secondaryColor }}>
                      {certDetails.programKh}
                    </p>
                    
                    <div className="my-1 flex items-center justify-center gap-2">
                      <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-20" />
                      <span className="text-[9px] tracking-widest uppercase font-bold" style={{ color: currentTheme.textColor }}>
                        {certDetails.badgeSubEn}
                      </span>
                      <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-20" />
                    </div>

                    <h1 className="font-serif text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase leading-tight">
                      {certDetails.titleEn}
                    </h1>
                    <p className="font-khmer text-xs font-bold mt-0.5 leading-tight" style={{ color: currentTheme.secondaryColor }}>
                      {certDetails.titleKh}
                    </p>
                  </div>

                  {/* Center Recipient Section */}
                  <div className="text-center my-0.5 relative z-10 shrink-0">
                    <p className="text-xs text-slate-500 italic tracking-wider font-serif">
                      {certDetails.awardedTextEn}
                    </p>

                    <div className="my-0.5">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-khmer tracking-tight border-b-2 border-slate-300 inline-block pb-0.5 px-6 leading-snug">
                        {progress.userName || (isEn ? 'Learner' : 'អ្នកសិក្សា (Learner)')}
                      </h2>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isEn ? (progress.gender === 'female' ? 'Ms. Candidate' : progress.gender === 'male' ? 'Mr. Candidate' : 'Candidate') : honorific} • Credential ID: <span className="font-mono font-bold text-slate-700">{certDetails.id}</span>
                      </p>
                    </div>

                    <div className="max-w-xl mx-auto">
                      <p className="text-xs font-bold font-khmer text-emerald-950">
                        <span className="underline underline-offset-2" style={{ color: currentTheme.secondaryColor }}>
                          {certDetails.curriculumEn}
                        </span>
                      </p>
                      <p className="text-[10px] font-semibold text-slate-600 mt-0.5 font-khmer">
                        {certDetails.curriculumKh}
                      </p>
                    </div>
                  </div>

                  {/* Performance Grade & Distinction Box */}
                  <div className="max-w-xl mx-auto my-0.5 p-2 rounded-xl bg-amber-50/80 border border-amber-300 shadow-2xs text-center relative z-10 shrink-0">
                    <div className="flex items-center justify-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" style={{ color: currentTheme.textColor }} />
                      <span className="text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textColor }}>
                        {certDetails.perfTitle}
                      </span>
                    </div>
                    <div className="font-khmer text-[11px] font-bold mt-0.5" style={{ color: currentTheme.secondaryColor }}>
                      {certDetails.perfSubKh}
                    </div>
                    <div className="flex items-center justify-center gap-3 text-[10px] text-slate-600 font-medium mt-0.5">
                      <span><strong className="text-slate-900">{certDetails.perfAccuracy}</strong></span>
                      <span>•</span>
                      <span><strong style={{ color: currentTheme.secondaryColor }}>{certDetails.perfXP}</strong></span>
                      <span>•</span>
                      <span><strong className="text-slate-900">{certDetails.perfCurriculum}</strong></span>
                    </div>
                  </div>

                  {/* Signatures & Verification Seal */}
                  <div className="grid grid-cols-3 items-end pt-2 border-t border-slate-200/80 relative z-10 shrink-0">
                    {/* Left Signature: Director */}
                    <div className="text-left pl-1">
                      <div className="h-7 flex items-end justify-start">
                        {devConfig.directorSignatureUrl ? (
                          <img src={devConfig.directorSignatureUrl} alt="Director Signature" className="h-7 w-auto object-contain max-w-[100px]" />
                        ) : (
                          <span className="font-serif italic text-sm text-slate-800">
                            {devConfig.directorName || 'Chan Sophal'}
                          </span>
                        )}
                      </div>
                      <div className="w-28 h-px bg-slate-400 my-0.5" />
                      <p className="text-[11px] font-bold text-slate-900 leading-tight">
                        {devConfig.directorName || 'Dr. Chan Sophal'}
                      </p>
                      <p className="text-[9px] text-slate-500 font-khmer leading-tight">
                        {devConfig.directorTitleEn || (isEn ? 'Academic Director' : 'នាយកកម្មវិធីសិក្សា • Academic Director')}
                      </p>
                    </div>

                    {/* Center Verification Seal / Custom Stamp */}
                    <div className="flex flex-col items-center justify-center">
                      {devConfig.sealStampUrl ? (
                        <div className="relative flex items-center justify-center">
                          <img src={devConfig.sealStampUrl} alt="Official Seal" className="w-13 h-13 object-contain drop-shadow-sm" />
                        </div>
                      ) : (
                        <div 
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentTheme.sealGradient} border-3 border-amber-300 shadow-sm flex flex-col items-center justify-center text-white relative`}
                        >
                          <div className="w-10 h-10 rounded-full border border-dashed border-white/60 flex flex-col items-center justify-center p-0.5">
                            <span className="text-[7px] font-black tracking-widest uppercase">{certDetails.sealTop}</span>
                            <span className="text-xs font-black leading-none">{certDetails.sealCenter}</span>
                            <span className="text-[6px] font-bold">{certDetails.sealBottom}</span>
                          </div>
                        </div>
                      )}
                      <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                        Date: {certDetails.issueDate}
                      </span>
                    </div>

                    {/* Right Signature: Chief Linguist */}
                    <div className="text-right pr-1">
                      <div className="h-7 flex items-end justify-end">
                        {devConfig.linguistSignatureUrl ? (
                          <img src={devConfig.linguistSignatureUrl} alt="Linguist Signature" className="h-7 w-auto object-contain max-w-[100px] ml-auto" />
                        ) : (
                          <span className="font-serif italic text-sm text-slate-800">
                            {devConfig.linguistName || 'Sarah Jenkins'}
                          </span>
                        )}
                      </div>
                      <div className="w-28 h-px bg-slate-400 my-0.5 ml-auto" />
                      <p className="text-[11px] font-bold text-slate-900 leading-tight">
                        {devConfig.linguistName || 'Sarah Jenkins, M.Ed.'}
                      </p>
                      <p className="text-[9px] text-slate-500 font-khmer leading-tight">
                        {devConfig.linguistTitleEn || (isEn ? 'Chief Linguist' : 'ប្រធានផ្នែកភាសាវិទ្យា • Chief Linguist')}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* DIRECT CERTIFICATE IMAGE PREVIEW MODAL (CLEAN, DISTRACTION-FREE, NO TOOLBAR, SINGLE CLOSE BUTTON) */}
      {isPreviewMode && (
        <div 
          id="cert-image-preview-modal"
          className="fixed inset-0 z-[10002] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsPreviewMode(false)}
        >
          {/* Top Bar with ONLY a Single Close Button */}
          <div className="w-full max-w-4xl flex items-center justify-end pb-2 sm:pb-3 shrink-0">
            <button
              id="btn-close-cert-preview"
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className="p-2 sm:p-2.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white transition-all cursor-pointer backdrop-blur-md shadow-lg border border-white/20"
              title={isEn ? "Close" : "បិទ (Close)"}
              aria-label="Close Preview"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Direct High-Resolution Certificate Image Viewport */}
          <div 
            className="w-full max-w-4xl max-h-[85vh] flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoadingPreview ? (
              <div className="w-full aspect-[1.414/1] max-w-2xl bg-slate-900/60 rounded-2xl flex flex-col items-center justify-center gap-3 text-white border border-white/10 p-6">
                <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs sm:text-sm font-medium font-khmer text-slate-200">
                  {isEn ? 'Generating High-Resolution Certificate...' : 'កំពុងរៀបចំវិញ្ញាបនបត្រ...'}
                </p>
              </div>
            ) : previewImageSrc ? (
              <img 
                src={previewImageSrc} 
                alt="Accredited Certificate" 
                className="w-full max-h-[82vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl select-none"
              />
            ) : (
              <div className="w-full aspect-[1.414/1] max-w-2xl bg-white rounded-2xl flex flex-col items-center justify-center gap-3 p-6 text-slate-800">
                <p className="text-sm font-khmer font-semibold">
                  {isEn ? 'Unable to load certificate preview.' : 'មិនអាចបង្ហាញរូបភាពវិញ្ញាបនបត្របានទេ។'}
                </p>
                <button
                  type="button"
                  onClick={handleOpenPreview}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-khmer cursor-pointer shadow-sm transition"
                >
                  {isEn ? 'Retry' : 'ព្យាយាមម្តងទៀត'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DEDICATED OFF-SCREEN EXPORT ELEMENT (1123px × 794px full unclipped A4 landscape) */}
      <div
        id="cert-export-wrapper"
        style={{
          position: 'fixed',
          left: '0px',
          top: '0px',
          zIndex: -9999,
          pointerEvents: 'none',
          opacity: 0.001,
          width: '1123px',
          minHeight: '794px',
          height: '794px',
          background: '#ffffff',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
        aria-hidden="true"
      >
        <div
          style={{
            width: '1123px',
            height: '794px',
            backgroundColor: '#fdfcf7',
            border: `10px solid ${currentTheme.borderColor}`,
            borderRadius: '16px',
            boxSizing: 'border-box',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '36px 44px',
            color: '#1e293b',
            fontFamily: "'Kantumruy Pro', 'Battambang', Georgia, serif, sans-serif",
            overflow: 'hidden'
          }}
        >
          {/* Custom Watermark (if uploaded) */}
          {devConfig.watermarkUrl && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.08 }}>
              <img src={devConfig.watermarkUrl} alt="Watermark" style={{ maxWidth: '400px', maxHeight: '400px', objectFit: 'contain' }} crossOrigin="anonymous" />
            </div>
          )}

          {/* Inner Decorative Borders */}
          <div style={{ position: 'absolute', inset: '10px', border: `2.5px solid ${currentTheme.secondaryColor}`, borderRadius: '10px', pointerEvents: 'none', opacity: 0.65 }} />
          <div style={{ position: 'absolute', inset: '16px', border: `1.5px solid ${currentTheme.borderColor}`, borderRadius: '6px', pointerEvents: 'none', opacity: 0.4 }} />

          {/* Corner Decorative Ornaments */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', width: '24px', height: '24px', borderTop: `2.5px solid ${currentTheme.borderColor}`, borderLeft: `2.5px solid ${currentTheme.borderColor}` }} />
          <div style={{ position: 'absolute', top: '16px', right: '16px', width: '24px', height: '24px', borderTop: `2.5px solid ${currentTheme.borderColor}`, borderRight: `2.5px solid ${currentTheme.borderColor}` }} />
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '24px', height: '24px', borderBottom: `2.5px solid ${currentTheme.borderColor}`, borderLeft: `2.5px solid ${currentTheme.borderColor}` }} />
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '24px', height: '24px', borderBottom: `2.5px solid ${currentTheme.borderColor}`, borderRight: `2.5px solid ${currentTheme.borderColor}` }} />

          {/* Header / Academy Crest */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '2px' }}>
              {devConfig.logoUrl ? (
                <img src={devConfig.logoUrl} alt="Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} crossOrigin="anonymous" />
              ) : (
                <span style={{ fontSize: '20px', color: currentTheme.textColor }}>⚜️</span>
              )}
              <span style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 900, color: currentTheme.secondaryColor }}>
                {appNameEn}
              </span>
              {devConfig.logoUrl ? (
                <img src={devConfig.logoUrl} alt="Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} crossOrigin="anonymous" />
              ) : (
                <span style={{ fontSize: '20px', color: currentTheme.textColor }}>⚜️</span>
              )}
            </div>

            <p style={{ fontFamily: "'Kantumruy Pro', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', color: currentTheme.secondaryColor, margin: '2px 0 0 0' }}>
              {certDetails.programKh}
            </p>

            <div style={{ margin: '6px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ height: '1px', width: '120px', background: 'linear-gradient(to right, transparent, #fbbf24, transparent)' }} />
              <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 800, color: currentTheme.textColor }}>
                {certDetails.badgeSubEn}
              </span>
              <div style={{ height: '1px', width: '120px', background: 'linear-gradient(to right, transparent, #fbbf24, transparent)' }} />
            </div>

            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a', textTransform: 'uppercase', margin: '2px 0 0 0', lineHeight: 1.2 }}>
              {certDetails.titleEn}
            </h1>
            <p style={{ fontFamily: "'Kantumruy Pro', sans-serif", fontSize: '14px', fontWeight: 700, color: currentTheme.secondaryColor, margin: '3px 0 0 0', lineHeight: 1.2 }}>
              {certDetails.titleKh}
            </p>
          </div>

          {/* Center Recipient Section */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, margin: '4px 0' }}>
            <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', fontFamily: 'Georgia, serif', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>
              {certDetails.awardedTextEn}
            </p>

            <div style={{ margin: '4px 0' }}>
              <h2 style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a', fontFamily: "'Kantumruy Pro', sans-serif", letterSpacing: '-0.01em', borderBottom: '2px solid #cbd5e1', display: 'inline-block', padding: '0 36px 4px 36px', margin: 0, lineHeight: 1.3 }}>
                {progress.userName || (isEn ? 'Learner' : 'អ្នកសិក្សា (Learner)')}
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                {isEn ? (progress.gender === 'female' ? 'Ms. Candidate' : progress.gender === 'male' ? 'Mr. Candidate' : 'Candidate') : honorific} • Credential ID: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#334155' }}>{certDetails.id}</span>
              </p>
            </div>

            <div style={{ maxWidth: '750px', margin: '6px auto 0 auto' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, fontFamily: "'Kantumruy Pro', sans-serif", color: '#022c22', margin: 0 }}>
                <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px', color: currentTheme.secondaryColor }}>
                  {certDetails.curriculumEn}
                </span>
              </p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', margin: '3px 0 0 0', fontFamily: "'Kantumruy Pro', sans-serif" }}>
                {certDetails.curriculumKh}
              </p>
            </div>
          </div>

          {/* Performance Distinction Ribbon Box */}
          <div style={{ maxWidth: '720px', width: '100%', margin: '4px auto', padding: '8px 18px', borderRadius: '12px', backgroundColor: 'rgba(254, 252, 232, 0.95)', border: '1.5px solid #fcd34d', textAlign: 'center', position: 'relative', zIndex: 10, boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Trophy style={{ width: '16px', height: '16px', color: currentTheme.textColor }} />
              <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: currentTheme.textColor }}>
                {certDetails.perfTitle}
              </span>
            </div>
            <div style={{ fontFamily: "'Kantumruy Pro', sans-serif", fontSize: '12px', fontWeight: 700, color: currentTheme.secondaryColor, margin: '2px 0 0 0' }}>
              {certDetails.perfSubKh}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', fontSize: '11px', color: '#475569', fontWeight: 500, margin: '3px 0 0 0' }}>
              <span><strong style={{ color: '#0f172a' }}>{certDetails.perfAccuracy}</strong></span>
              <span>•</span>
              <span><strong style={{ color: currentTheme.secondaryColor }}>{certDetails.perfXP}</strong></span>
              <span>•</span>
              <span><strong style={{ color: '#0f172a' }}>{certDetails.perfCurriculum}</strong></span>
            </div>
          </div>

          {/* Bottom Row: Signatures & Official Verification Seal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'flex-end', paddingTop: '10px', borderTop: '1px solid rgba(226, 232, 240, 0.9)', position: 'relative', zIndex: 10, width: '100%', boxSizing: 'border-box' }}>
            {/* Left: Director */}
            <div style={{ textAlign: 'left', paddingLeft: '8px' }}>
              <div style={{ height: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                {devConfig.directorSignatureUrl ? (
                  <img src={devConfig.directorSignatureUrl} alt="Signature" style={{ height: '36px', width: 'auto', objectFit: 'contain', maxWidth: '140px' }} crossOrigin="anonymous" />
                ) : (
                  <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '16px', color: '#1e293b' }}>
                    {devConfig.directorName || 'Chan Sophal'}
                  </span>
                )}
              </div>
              <div style={{ width: '140px', height: '1.5px', backgroundColor: '#94a3b8', margin: '4px 0' }} />
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                {devConfig.directorName || 'Dr. Chan Sophal'}
              </p>
              <p style={{ fontSize: '11px', color: '#64748b', fontFamily: "'Kantumruy Pro', sans-serif", margin: '2px 0 0 0', lineHeight: 1.2 }}>
                {devConfig.directorTitleEn || (isEn ? 'Academic Director' : 'នាយកកម្មវិធីសិក្សា • Academic Director')}
              </p>
            </div>

            {/* Center: Official Verification Seal & Date */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {devConfig.sealStampUrl ? (
                <img src={devConfig.sealStampUrl} alt="Official Seal" style={{ width: '64px', height: '64px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} crossOrigin="anonymous" />
              ) : (
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${currentTheme.sealGradient ? currentTheme.secondaryColor : '#b91c1c'}, #7f1d1d)`,
                    border: '3px solid #fcd34d',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    position: 'relative'
                  }}
                >
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
                    <span style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{certDetails.sealTop}</span>
                    <span style={{ fontSize: '14px', fontWeight: 900, lineHeight: 1 }}>{certDetails.sealCenter}</span>
                    <span style={{ fontSize: '7px', fontWeight: 700 }}>{certDetails.sealBottom}</span>
                  </div>
                </div>
              )}
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', marginTop: '4px' }}>
                Date: {certDetails.issueDate}
              </span>
            </div>

            {/* Right: Chief Linguist */}
            <div style={{ textAlign: 'right', paddingRight: '8px' }}>
              <div style={{ height: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                {devConfig.linguistSignatureUrl ? (
                  <img src={devConfig.linguistSignatureUrl} alt="Signature" style={{ height: '36px', width: 'auto', objectFit: 'contain', maxWidth: '140px' }} crossOrigin="anonymous" />
                ) : (
                  <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '16px', color: '#1e293b' }}>
                    {devConfig.linguistName || 'Sarah Jenkins'}
                  </span>
                )}
              </div>
              <div style={{ width: '140px', height: '1.5px', backgroundColor: '#94a3b8', margin: '4px 0 4px auto' }} />
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                {devConfig.linguistName || 'Sarah Jenkins, M.Ed.'}
              </p>
              <p style={{ fontSize: '11px', color: '#64748b', fontFamily: "'Kantumruy Pro', sans-serif", margin: '2px 0 0 0', lineHeight: 1.2 }}>
                {devConfig.linguistTitleEn || (isEn ? 'Chief Linguist' : 'ប្រធានផ្នែកភាសាវិទ្យា • Chief Linguist')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
