import React, { useState } from 'react';
import { 
  Award, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  BookOpen, 
  Trophy, 
  Calendar,
  RotateCcw,
  Zap,
  Crown,
  ShieldCheck,
  BarChart3,
  Download,
  Eye,
  Loader2,
  GraduationCap,
  ClipboardCheck,
  Check,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProgress, Badge } from '../types';
import { BADGES } from '../data/curriculum';
import { getLevelRankTitle } from '../utils/storage';
import { GlobalLeaderboard } from './GlobalLeaderboard';
import { 
  generateCertificateSvg, 
  renderSvgToCanvas, 
  downloadCanvasAsPng 
} from '../utils/svgPngRenderer';
import { 
  calculateLevelProgress, 
  isBeginnerLevelFullyCompleted, 
  isIntermediateLevelFullyCompleted, 
  isAdvancedLevelFullyCompleted, 
  areAllLevelsCompleted, 
  calculateOverallGrade, 
  BEGINNER_LESSONS, 
  INTERMEDIATE_LESSONS, 
  ADVANCED_LESSONS 
} from '../utils/progression';
import { isDeveloperRole } from '../utils/memberStorage';

interface AchievementsViewProps {
  progress: UserProgress;
  onResetProgress: () => void;
  onTakeLevelExam: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  onOpenCertificate?: (level?: 'beginner' | 'intermediate' | 'advanced' | 'all' | 'placement') => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  progress,
  onResetProgress,
  onTakeLevelExam,
  onOpenCertificate,
}) => {
  const [subTab, setSubTab] = useState<'leaderboard' | 'badges'>('leaderboard');
  const isEn = progress.appLanguage === 'en';
  const rank = getLevelRankTitle(progress.xp);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const isDeveloper = Boolean(
    progress.role === 'Developer' ||
    (progress.role as string)?.toLowerCase() === 'developer' ||
    progress.activeViewRole === 'Developer' ||
    (progress.activeViewRole as string)?.toLowerCase() === 'developer' ||
    Boolean(progress.isDeveloperMode) ||
    isDeveloperRole(progress.userIdentifier || progress.email, progress.userName, progress.role)
  );

  const begDone = isBeginnerLevelFullyCompleted(progress);
  const intDone = isIntermediateLevelFullyCompleted(progress);
  const advDone = isAdvancedLevelFullyCompleted(progress);
  const allLevelsDone = areAllLevelsCompleted(progress);
  const placementDone = Boolean(progress.hasCompletedPlacementTest || progress.placementAssignedLevel);

  const begStats = calculateLevelProgress('beginner', progress);
  const intStats = calculateLevelProgress('intermediate', progress);
  const advStats = calculateLevelProgress('advanced', progress);

  const allUnitsTotal = begStats.totalUnits + intStats.totalUnits + advStats.totalUnits;
  const allUnitsCompleted = begStats.completedUnits + intStats.completedUnits + advStats.completedUnits;
  const allPercentage = allUnitsTotal > 0 ? Math.round((allUnitsCompleted / allUnitsTotal) * 100) : 0;

  const handleDirectDownload = async (certId: 'beginner' | 'intermediate' | 'advanced' | 'all' | 'placement', certTitle: string) => {
    const isUnlocked = 
      certId === 'beginner' ? (begDone || isDeveloper) :
      certId === 'intermediate' ? (intDone || isDeveloper) :
      certId === 'advanced' ? (advDone || isDeveloper) :
      certId === 'placement' ? (placementDone || isDeveloper) :
      (allLevelsDone || isDeveloper);

    if (!isUnlocked && !isDeveloper) {
      onOpenCertificate?.(certId);
      return;
    }

    setDownloadingId(certId);
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const displayId = (progress.userIdentifier || '0001').slice(-4).padStart(4, '0');
      const issueDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const studentName = progress.userName || (isEn ? 'Student Learner' : 'អ្នកសិក្សា (Learner)');
      const honorific = progress.gender === 'female' ? 'Ms. Candidate' : progress.gender === 'male' ? 'Mr. Candidate' : 'Candidate';

      let certData;
      if (certId === 'beginner') {
        certData = {
          appNameEn: 'Angkor English Academy',
          appNameKh: 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ',
          studentName,
          honorificText: honorific,
          certId: progress.certificateId ? `${progress.certificateId}-L1` : `AEA-L1-${displayId}`,
          issueDate,
          badgeSubEn: 'ACCREDITED ELEMENTARY ENGLISH CERTIFICATE • CEFR A1 - A2',
          titleEn: 'LEVEL 1: BEGINNER FOUNDATION CERTIFICATE',
          titleKh: 'វិញ្ញាបនបត្របញ្ជាក់ការបញ្ចប់កម្រិតដំបូង (Beginner Foundation)',
          programKh: 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ • មូលដ្ឋានគ្រឹះវាក្យសព្ទ វេយ្យាករណ៍ និងការសន្ទនាដំបូង',
          awardedTextEn: 'This elementary English certificate of completion is proudly awarded to',
          curriculumEn: 'For successfully mastering Level 1: Beginner English Foundation (CEFR A1 - A2)',
          curriculumKh: 'បានបញ្ចប់ដោយជោគជ័យនូវមេរៀន និងកម្រងសំណួរមូលដ្ឋានគ្រឹះកម្រិតដំបូង',
          perfTitle: 'PERFORMANCE: ELEMENTARY PROFICIENCY (CEFR A1 - A2)',
          perfSubKh: 'កម្រិតដំបូង • ឆ្លងកាត់ជោគជ័យ',
          perfAccuracy: 'Quiz Accuracy: 90%',
          perfXP: `Total XP: ${progress.xp} XP`,
          perfCurriculum: `${begStats.completedLessons}/${begStats.totalLessons} Lessons Completed`,
          sealTop: 'CEFR',
          sealCenter: 'A2',
          sealBottom: 'PASSED',
          directorName: 'Dr. Chan Sophal',
          directorTitleEn: isEn ? 'Academic Director' : 'នាយកកម្មវិធីសិក្សា • Academic Director',
          linguistName: 'Sarah Jenkins, M.Ed.',
          linguistTitleEn: isEn ? 'Chief Linguist' : 'ប្រធានផ្នែកភាសាវិទ្យា • Chief Linguist',
          borderColor: '#047857',
          secondaryColor: '#b45309',
          textColor: '#047857',
          fileName: `Level-1-Beginner-Certificate-${studentName.replace(/\s+/g, '_')}.png`,
        };
      } else if (certId === 'intermediate') {
        certData = {
          appNameEn: 'Angkor English Academy',
          appNameKh: 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ',
          studentName,
          honorificText: honorific,
          certId: progress.certificateId ? `${progress.certificateId}-L2` : `AEA-L2-${displayId}`,
          issueDate,
          badgeSubEn: 'ACCREDITED INTERMEDIATE ENGLISH CERTIFICATE • CEFR B1 - B2',
          titleEn: 'LEVEL 2: INTERMEDIATE FLUENCY CERTIFICATE',
          titleKh: 'វិញ្ញាបនបត្របញ្ជាក់ការបញ្ចប់កម្រិតមធ្យម (Intermediate Fluency)',
          programKh: 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ • វេយ្យាករណ៍កម្រិតមធ្យម ការសន្ទនារលូន និងកន្សោមពាក្យ',
          awardedTextEn: 'This intermediate English certificate of fluency is proudly awarded to',
          curriculumEn: 'For successfully mastering Level 2: Intermediate English Fluency (CEFR B1 - B2)',
          curriculumKh: 'បានបញ្ចប់ដោយជោគជ័យនូវមេរៀន និងកម្រងសំណួរកម្រិតមធ្យម',
          perfTitle: 'PERFORMANCE: INDEPENDENT FLUENCY (CEFR B1 - B2)',
          perfSubKh: 'កម្រិតមធ្យម • ឆ្លងកាត់ជោគជ័យ',
          perfAccuracy: 'Quiz Accuracy: 88%',
          perfXP: `Total XP: ${progress.xp} XP`,
          perfCurriculum: `${intStats.completedLessons}/${intStats.totalLessons} Lessons Completed`,
          sealTop: 'CEFR',
          sealCenter: 'B2',
          sealBottom: 'PASSED',
          directorName: 'Dr. Chan Sophal',
          directorTitleEn: isEn ? 'Academic Director' : 'នាយកកម្មវិធីសិក្សា • Academic Director',
          linguistName: 'Sarah Jenkins, M.Ed.',
          linguistTitleEn: isEn ? 'Chief Linguist' : 'ប្រធានផ្នែកភាសាវិទ្យា • Chief Linguist',
          borderColor: '#1e3a8a',
          secondaryColor: '#b45309',
          textColor: '#1e3a8a',
          fileName: `Level-2-Intermediate-Certificate-${studentName.replace(/\s+/g, '_')}.png`,
        };
      } else if (certId === 'advanced') {
        certData = {
          appNameEn: 'Angkor English Academy',
          appNameKh: 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ',
          studentName,
          honorificText: honorific,
          certId: progress.certificateId ? `${progress.certificateId}-L3` : `AEA-L3-${displayId}`,
          issueDate,
          badgeSubEn: 'ACCREDITED ADVANCED ENGLISH CERTIFICATE • CEFR C1 - C2',
          titleEn: 'LEVEL 3: ADVANCED MASTERY CERTIFICATE',
          titleKh: 'វិញ្ញាបនបត្របញ្ជាក់ការបញ្ចប់កម្រិតខ្ពស់ (Advanced Mastery)',
          programKh: 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ • ភាសាអង់គ្លេសកម្រិតវិជ្ជាជីវៈ និងការបញ្ចេញមតិស៊ីជម្រៅ',
          awardedTextEn: 'This advanced English diploma of mastery is proudly awarded with academic honors to',
          curriculumEn: 'For successfully mastering Level 3: Advanced English Mastery (CEFR C1 - C2)',
          curriculumKh: 'បានបញ្ចប់ដោយជោគជ័យនូវមេរៀន និងកម្រងសំណួរកម្រិតខ្ពស់',
          perfTitle: 'PERFORMANCE: PROFICIENT MASTERY (CEFR C1 - C2)',
          perfSubKh: 'កម្រិតខ្ពស់ • ឧត្តមភាពវិជ្ជាជីវៈ',
          perfAccuracy: 'Quiz Accuracy: 92%',
          perfXP: `Total XP: ${progress.xp} XP`,
          perfCurriculum: `${advStats.completedLessons}/${advStats.totalLessons} Lessons Completed`,
          sealTop: 'CEFR',
          sealCenter: 'C1',
          sealBottom: 'HONORS',
          directorName: 'Dr. Chan Sophal',
          directorTitleEn: isEn ? 'Academic Director' : 'នាយកកម្មវិធីសិក្សា • Academic Director',
          linguistName: 'Sarah Jenkins, M.Ed.',
          linguistTitleEn: isEn ? 'Chief Linguist' : 'ប្រធានផ្នែកភាសាវិទ្យា • Chief Linguist',
          borderColor: '#991b1b',
          secondaryColor: '#d97706',
          textColor: '#991b1b',
          fileName: `Level-3-Advanced-Certificate-${studentName.replace(/\s+/g, '_')}.png`,
        };
      } else if (certId === 'placement') {
        const pScore = progress.placementTestScore || 85;
        const pLevel = progress.placementAssignedLevel || 'intermediate';
        certData = {
          appNameEn: 'Angkor English Academy',
          appNameKh: 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ',
          studentName,
          honorificText: honorific,
          certId: progress.placementCertificateId || progress.certificateId || `AEA-CEFR-${displayId}`,
          issueDate,
          badgeSubEn: 'STANDARDIZED CEFR DIAGNOSTIC ASSESSMENT & PLACEMENT REPORT',
          titleEn: 'CEFR ENGLISH PLACEMENT CERTIFICATE',
          titleKh: 'វិញ្ញាបនបត្របញ្ជាក់លទ្ធផលតេស្តវាស់ស្ទង់សមត្ថភាពភាសាអង់គ្លេស (CEFR)',
          programKh: 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ • ប្រព័ន្ធវាស់ស្ទង់សមត្ថភាព និងចំណាត់ថ្នាក់កម្រិតស្តង់ដារអន្តរជាតិ',
          awardedTextEn: 'This official placement certificate certifies that the candidate has successfully completed the diagnostic assessment and demonstrated proficiency at',
          curriculumEn: `Assessed Level: ${pLevel.toUpperCase()} • Standardized Diagnostic Assessment`,
          curriculumKh: 'បានឆ្លងកាត់ការធ្វើតេស្តវាស់ស្ទង់ និងទទួលបានចំណាត់ថ្នាក់កម្រិតសមត្ថភាពភាសាអង់គ្លេស',
          perfTitle: `OFFICIAL CEFR RATING: ${pLevel.toUpperCase()}`,
          perfSubKh: `តេស្តវាស់ស្ទង់សមត្ថភាព • ពិន្ទុ ${pScore}%`,
          perfAccuracy: `Diagnostic Score: ${pScore}%`,
          perfXP: `Total XP: ${progress.xp} XP`,
          perfCurriculum: 'Standardized Diagnostic Assessment Completed',
          sealTop: 'CEFR',
          sealCenter: pLevel === 'advanced' ? 'C1' : pLevel === 'intermediate' ? 'B1' : 'A2',
          sealBottom: 'VERIFIED',
          directorName: 'Dr. Chan Sophal',
          directorTitleEn: isEn ? 'Academic Director' : 'នាយកកម្មវិធីសិក្សា • Academic Director',
          linguistName: 'Sarah Jenkins, M.Ed.',
          linguistTitleEn: isEn ? 'Chief Linguist' : 'ប្រធានផ្នែកភាសាវិទ្យា • Chief Linguist',
          borderColor: '#4f46e5',
          secondaryColor: '#b45309',
          textColor: '#4f46e5',
          fileName: `CEFR-Placement-Certificate-${studentName.replace(/\s+/g, '_')}.png`,
        };
      } else {
        const gradeResult = calculateOverallGrade(progress);
        certData = {
          appNameEn: 'Angkor English Academy',
          appNameKh: 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ',
          studentName,
          honorificText: honorific,
          certId: progress.certificateId || `AEA-CERT-${displayId}`,
          issueDate,
          badgeSubEn: 'ACCREDITED TRI-LEVEL ENGLISH DIPLOMA OF COMPLETION',
          titleEn: 'GRADUATION CERTIFICATE OF COMPLETION',
          titleKh: 'វិញ្ញាបនបត្របញ្ចប់ការសិក្សាភាសាអង់គ្លេសពេញលេញ (៣ កម្រិត)',
          programKh: 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ • កម្មវិធីអភិវឌ្ឍន៍សមត្ថភាពភាសាអង់គ្លេសពេញលេញ',
          awardedTextEn: 'This accredited graduation diploma is proudly awarded with academic honors to',
          curriculumEn: 'For successfully completing all 3 levels: Beginner, Intermediate & Advanced',
          curriculumKh: 'បានបញ្ចប់ដោយជោគជ័យគ្រប់មេរៀន និងកម្រងសំណួរទាំង ៣ កម្រិត',
          perfTitle: `OFFICIAL PERFORMANCE GRADE: ${gradeResult.labelEn.toUpperCase()}`,
          perfSubKh: `${gradeResult.labelKh} • ${gradeResult.distinctionKh}`,
          perfAccuracy: `Overall Accuracy: ${gradeResult.averageScorePercent}%`,
          perfXP: `Total XP: ${progress.xp} XP`,
          perfCurriculum: 'Curriculum: 12/12 Completed',
          sealTop: 'GRADE',
          sealCenter: gradeResult.letter,
          sealBottom: 'ACCREDITED',
          directorName: 'Dr. Chan Sophal',
          directorTitleEn: isEn ? 'Academic Director' : 'នាយកកម្មវិធីសិក្សា • Academic Director',
          linguistName: 'Sarah Jenkins, M.Ed.',
          linguistTitleEn: isEn ? 'Chief Linguist' : 'ប្រធានផ្នែកភាសាវិទ្យា • Chief Linguist',
          borderColor: '#b45309',
          secondaryColor: '#047857',
          textColor: '#b45309',
          fileName: `Graduation-Certificate-${studentName.replace(/\s+/g, '_')}.png`,
        };
      }

      const svgString = generateCertificateSvg(certData);
      const canvas = await renderSvgToCanvas(svgString, 1123, 794, 2);
      await downloadCanvasAsPng(canvas, certData.fileName);

      try {
        confetti({
          particleCount: 65,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      setDownloadToast(isEn ? `Downloaded ${certTitle}!` : `បានទាញយក ${certTitle} ដោយជោគជ័យ!`);
      setTimeout(() => setDownloadToast(null), 3500);
    } catch (err) {
      console.error('Direct download error:', err);
      onOpenCertificate?.(certId);
    } finally {
      setDownloadingId(null);
    }
  };

  interface LevelCertItem {
    id: 'beginner' | 'intermediate' | 'advanced' | 'all' | 'placement';
    levelTag: string;
    cefrTag: string;
    titleEn: string;
    titleKh: string;
    subtitleEn: string;
    subtitleKh: string;
    totalLessons: number;
    completedLessons: number;
    percentage: number;
    isUnlocked: boolean;
    themeColor: string;
    borderClass: string;
    accentBg: string;
    sealText: string;
    sealColor: string;
    icon: React.ComponentType<{ className?: string }>;
    summaryTextEn: string;
    summaryTextKh: string;
  }

  const certItems: LevelCertItem[] = [
    {
      id: 'beginner',
      levelTag: isEn ? 'Level 1: Beginner' : 'កម្រិត ១៖ ដំបូង (Beginner)',
      cefrTag: 'CEFR A1 - A2',
      titleEn: 'Beginner Foundation Certificate',
      titleKh: 'វិញ្ញាបនបត្រកម្រិតដំបូង (Beginner Foundation)',
      subtitleEn: 'Essential English Vocabulary, Grammar & Daily Phrases',
      subtitleKh: 'មូលដ្ឋានគ្រឹះវាក្យសព្ទ វេយ្យាករណ៍ និងការសន្ទនាដំបូង',
      totalLessons: begStats.totalLessons,
      completedLessons: begStats.completedLessons,
      percentage: begStats.percentage,
      isUnlocked: begDone || isDeveloper,
      themeColor: '#047857',
      borderClass: 'border-emerald-500/40 hover:border-emerald-500',
      accentBg: 'bg-emerald-600',
      sealText: 'A2 PASSED',
      sealColor: 'from-emerald-500 to-teal-700',
      icon: Award,
      summaryTextEn: 'Complete all 7 beginner lessons & pass quiz to claim',
      summaryTextKh: 'រៀនចប់ទាំង ៧ មេរៀន និងប្រឡងជាប់ដើម្បីទទួលបាន',
    },
    {
      id: 'intermediate',
      levelTag: isEn ? 'Level 2: Intermediate' : 'កម្រិត ២៖ មធ្យម (Intermediate)',
      cefrTag: 'CEFR B1 - B2',
      titleEn: 'Intermediate Fluency Certificate',
      titleKh: 'វិញ្ញាបនបត្រកម្រិតមធ្យម (Intermediate Fluency)',
      subtitleEn: 'Conversational Fluency, Complex Grammar & Idiomatic Expressions',
      subtitleKh: 'វេយ្យាករណ៍កម្រិតមធ្យម ការសន្ទនារលូន និងកន្សោមពាក្យ',
      totalLessons: intStats.totalLessons,
      completedLessons: intStats.completedLessons,
      percentage: intStats.percentage,
      isUnlocked: intDone || isDeveloper,
      themeColor: '#1e3a8a',
      borderClass: 'border-blue-500/40 hover:border-blue-500',
      accentBg: 'bg-blue-600',
      sealText: 'B2 PASSED',
      sealColor: 'from-blue-500 to-indigo-700',
      icon: Award,
      summaryTextEn: 'Complete all 3 intermediate lessons & pass quiz to claim',
      summaryTextKh: 'រៀនចប់ទាំង ៣ មេរៀន និងប្រឡងជាប់ដើម្បីទទួលបាន',
    },
    {
      id: 'advanced',
      levelTag: isEn ? 'Level 3: Advanced' : 'កម្រិត ៣៖ ខ្ពស់ (Advanced)',
      cefrTag: 'CEFR C1 - C2',
      titleEn: 'Advanced Mastery Certificate',
      titleKh: 'វិញ្ញាបនបត្រកម្រិតខ្ពស់ (Advanced Mastery)',
      subtitleEn: 'Professional Eloquence, Academic Expression & Nuanced Stylistics',
      subtitleKh: 'ភាសាអង់គ្លេសកម្រិតវិជ្ជាជីវៈ និងការបញ្ចេញមតិស៊ីជម្រៅ',
      totalLessons: advStats.totalLessons,
      completedLessons: advStats.completedLessons,
      percentage: advStats.percentage,
      isUnlocked: advDone || isDeveloper,
      themeColor: '#991b1b',
      borderClass: 'border-rose-500/40 hover:border-rose-500',
      accentBg: 'bg-rose-600',
      sealText: 'C1 HONORS',
      sealColor: 'from-rose-500 to-red-700',
      icon: Trophy,
      summaryTextEn: 'Complete all 2 advanced lessons & pass quiz to claim',
      summaryTextKh: 'រៀនចប់ទាំង ២ មេរៀន និងប្រឡងជាប់ដើម្បីទទួលបាន',
    },
    {
      id: 'all',
      levelTag: isEn ? 'Tri-Level Master Diploma' : 'វិញ្ញាបនបត្របញ្ចប់ការសិក្សាពេញលេញ',
      cefrTag: 'CEFR A1 - C2 MASTER',
      titleEn: 'Graduation Diploma of Completion',
      titleKh: 'វិញ្ញាបនបត្របញ្ចប់ការសិក្សាភាសាអង់គ្លេសពេញលេញ (៣ កម្រិត)',
      subtitleEn: 'Tri-Level Comprehensive English Fluency & Academic Program',
      subtitleKh: 'កម្មវិធីអភិវឌ្ឍន៍សមត្ថភាពភាសាអង់គ្លេសពេញលេញគ្រប់ ៣ កម្រិត',
      totalLessons: begStats.totalLessons + intStats.totalLessons + advStats.totalLessons,
      completedLessons: begStats.completedLessons + intStats.completedLessons + advStats.completedLessons,
      percentage: allPercentage,
      isUnlocked: allLevelsDone || isDeveloper,
      themeColor: '#b45309',
      borderClass: 'border-amber-500/50 hover:border-amber-500',
      accentBg: 'bg-amber-600',
      sealText: 'ACCREDITED',
      sealColor: 'from-amber-400 to-amber-600',
      icon: GraduationCap,
      summaryTextEn: 'Complete all 3 levels (12 lessons) to unlock honors diploma',
      summaryTextKh: 'បញ្ចប់គ្រប់ ៣ កម្រិត ដើម្បីបើកវិញ្ញាបនបត្រកិត្តិយសពេញលេញ',
    },
    {
      id: 'placement',
      levelTag: isEn ? 'Placement Assessment' : 'តេស្តវាស់ស្ទង់សមត្ថភាព CEFR',
      cefrTag: 'CEFR DIAGNOSTIC',
      titleEn: 'CEFR English Placement Certificate',
      titleKh: 'វិញ្ញាបនបត្រតេស្តវាស់ស្ទង់សមត្ថភាព (CEFR Diagnostic)',
      subtitleEn: 'Standardized Diagnostic Assessment & International Benchmark',
      subtitleKh: 'ប្រព័ន្ធវាស់ស្ទង់សមត្ថភាព និងចំណាត់ថ្នាក់កម្រិតស្តង់ដារអន្តរជាតិ',
      totalLessons: 1,
      completedLessons: placementDone ? 1 : 0,
      percentage: placementDone ? 100 : 0,
      isUnlocked: placementDone || isDeveloper,
      themeColor: '#4f46e5',
      borderClass: 'border-indigo-500/40 hover:border-indigo-500',
      accentBg: 'bg-indigo-600',
      sealText: 'VERIFIED',
      sealColor: 'from-indigo-500 to-purple-700',
      icon: ClipboardCheck,
      summaryTextEn: 'Take placement test in Placement Assessment to claim',
      summaryTextKh: 'ធ្វើតេស្តវាស់ស្ទង់សមត្ថភាព ដើម្បីទទួលបានវិញ្ញាបនបត្រនេះ',
    },
  ];

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Award': return <Award className="w-5 h-5 text-emerald-500" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-indigo-500" />;
      case 'Crown': return <Crown className="w-5 h-5 text-purple-500" />;
      default: return <Trophy className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 w-full max-w-none px-1 sm:px-2">
      
      {/* Sub Navigation Bar: Leaderboard vs My Achievements */}
      <div className="flex items-center justify-center p-1.5 bg-slate-200/80 rounded-2xl max-w-md mx-auto shadow-inner">
        <button
          type="button"
          onClick={() => setSubTab('leaderboard')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'leaderboard'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{isEn ? '🏆 Global Leaderboard' : '🏆 តារាងកិត្តិយស (Leaderboard)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('badges')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'badges'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span>{isEn ? '🎖️ Certificate & Badges' : '🎖️ វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា (Certificate) & Badges'}</span>
        </button>
      </div>

      {/* RENDER LEADERBOARD */}
      {subTab === 'leaderboard' && (
        <GlobalLeaderboard progress={progress} />
      )}

      {/* RENDER MY PROGRESS & BADGES */}
      {subTab === 'badges' && (
        <div className="space-y-6">
          {/* Overview Profile Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-khmer">
                  {progress.userName || (isEn ? 'Learner' : 'អ្នកសិក្សា')}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-300">
                  {rank.en}
                </span>
              </div>
              <p className="font-khmer text-sm text-slate-300 mt-0.5">
                {isEn ? `Level: ${progress.currentLevel.toUpperCase()}` : `${rank.kh} • កម្រិត ${progress.currentLevel.toUpperCase()}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-xl text-center">
              <div className="text-xs text-slate-400">Total XP</div>
              <div className="text-lg font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>{progress.xp}</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-xl text-center">
              <div className="text-xs text-slate-400">Streak</div>
              <div className="text-lg font-extrabold text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{progress.streakDays} {isEn ? 'Days' : 'ថ្ងៃ (Days)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progression summary bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-3 gap-3">
          {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => {
            const isUnlocked = progress.unlockedLevels.includes(lvl);

            return (
              <div
                key={lvl}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                  {isUnlocked ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>{lvl}</span>
                </div>
                <div className="text-[11px] font-khmer">
                  {isEn
                    ? (lvl === 'beginner' ? 'Beginner' : lvl === 'intermediate' ? 'Intermediate' : 'Advanced')
                    : (lvl === 'beginner' ? 'កម្រិតដំបូង' : lvl === 'intermediate' ? 'កម្រិតមធ្យម' : 'កម្រិតខ្ពស់')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Completion Certificates by Level Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-khmer">
                  {isEn ? 'Course Completion Certificates by Level' : 'វិញ្ញាបនបត្របញ្ជាក់ការសិក្សាតាមកម្រិត (Course Certificates)'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {certItems.filter(c => c.isUnlocked).length} / {certItems.length} {isEn ? 'Claimable' : 'អាចបើកបាន'}
                </span>
              </div>
              <p className="font-khmer text-xs text-slate-500 mt-1">
                {isEn 
                  ? `Official accredited certificates awarded to ${progress.userName || 'Learner'} upon completing each course level with honors grading. Preview or download high-resolution PNG certificates anytime.`
                  : `វិញ្ញាបនបត្រផ្លូវការទទួលស្គាល់តាមកម្រិតនីមួយៗ ចេញជូនលើឈ្មោះ ${progress.userName || 'អ្នកសិក្សា'} ជាមួយការវាយតម្លៃនិទ្ទេស (Honors Grade)។ អាចមើលគំរូ ឬទាញយកជារូបភាពគុណភាពខ្ពស់ភ្លាមៗ។`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              id="btn-open-all-certs"
              type="button"
              onClick={() => onOpenCertificate?.('all')}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>{isEn ? 'View All Diplomas' : 'មើលវិញ្ញាបនបត្រទាំងអស់'}</span>
            </button>
          </div>
        </div>

        {/* Download Toast Notification */}
        {downloadToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* Structured Grid of Level Certificates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certItems.map((item) => {
            const isDownloading = downloadingId === item.id;

            return (
              <div
                key={item.id}
                id={`card-cert-${item.id}`}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  item.isUnlocked 
                    ? `${item.borderClass} bg-white shadow-xs hover:shadow-md` 
                    : 'border-slate-200 bg-slate-50/70 opacity-95'
                }`}
              >
                {/* Card Top Banner */}
                <div className="p-4 pb-3 border-b border-slate-100 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs ${item.accentBg}`}>
                      <item.icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-800 tracking-tight">
                          {item.levelTag}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.cefrTag}
                        </span>
                      </div>
                      <h4 className="font-khmer text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">
                        {isEn ? item.titleEn : item.titleKh}
                      </h4>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="shrink-0">
                    {item.isUnlocked ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{isEn ? 'Unlocked' : 'រួចរាល់'}</span>
                      </span>
                    ) : item.percentage > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{item.percentage}%</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>{isEn ? 'Locked' : 'ចាក់សោ'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Visual Miniature Certificate Frame */}
                <div className="px-4 py-3">
                  <div 
                    onClick={() => onOpenCertificate?.(item.id)}
                    className="relative rounded-xl border-2 p-3 bg-gradient-to-b from-[#fffefc] via-white to-[#fbf7ee] shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
                    style={{ borderColor: item.themeColor + '40' }}
                    title={isEn ? 'Click to preview certificate' : 'ចុចដើម្បីមើលគំរូវិញ្ញាបនបត្រ'}
                  >
                    {/* Corner Accents */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: item.themeColor }} />
                    <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: item.themeColor }} />
                    <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2" style={{ borderColor: item.themeColor }} />
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: item.themeColor }} />

                    {/* Header of Mini Cert */}
                    <div className="text-center pb-1.5 border-b border-amber-200/50">
                      <div className="text-[9px] font-bold tracking-wider text-slate-800 uppercase">
                        ANGKOR ENGLISH ACADEMY
                      </div>
                      <div className="text-[7.5px] text-slate-500 font-khmer">
                        បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ
                      </div>
                    </div>

                    {/* Cert Recipient & Title */}
                    <div className="py-2 text-center space-y-0.5">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest">
                        CERTIFICATE OF ACHIEVEMENT
                      </div>
                      <div className="text-xs font-bold text-slate-900 font-serif line-clamp-1">
                        {progress.userName || (isEn ? 'Student Learner' : 'អ្នកសិក្សា')}
                      </div>
                      <div className="text-[9.5px] font-semibold line-clamp-1" style={{ color: item.themeColor }}>
                        {item.cefrTag} • {item.levelTag}
                      </div>
                    </div>

                    {/* Cert Footer with Seal and Signatures */}
                    <div className="pt-1.5 border-t border-amber-200/50 flex items-center justify-between text-[7px] text-slate-500">
                      <div className="text-left">
                        <div className="font-serif italic text-slate-700">Dr. Chan Sophal</div>
                        <div className="text-[6.5px] text-slate-400">Director</div>
                      </div>

                      {/* Colored Seal Stamp */}
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${item.sealColor} p-0.5 flex items-center justify-center text-white shadow-2xs shrink-0`}>
                        <div className="w-full h-full rounded-full border border-dashed border-white/80 flex items-center justify-center text-[5.5px] font-black uppercase text-center leading-none">
                          SEAL
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-serif italic text-slate-700">Sarah Jenkins</div>
                        <div className="text-[6.5px] text-slate-400">Linguist</div>
                      </div>
                    </div>

                    {/* Hover Overlay Hint */}
                    <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <span className="px-2 py-1 rounded-md bg-white/95 text-slate-800 text-[10px] font-bold shadow-xs flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-600" />
                        <span>{isEn ? 'Click to Preview' : 'ចុចមើលគំរូ'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar & Counter */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-medium">
                        {isEn ? 'Course Progress' : 'វឌ្ឍនភាពមេរៀន'}
                      </span>
                      <span className="font-bold text-slate-800">
                        {item.completedLessons} / {item.totalLessons} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, Math.max(0, item.percentage))}%`,
                          backgroundColor: item.themeColor 
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-khmer line-clamp-1">
                      {isEn ? item.summaryTextEn : item.summaryTextKh}
                    </p>
                  </div>
                </div>

                {/* Action Button: Preview Certificate Only */}
                <div className="p-4 pt-2 border-t border-slate-100">
                  <button
                    id={`btn-preview-cert-${item.id}`}
                    type="button"
                    onClick={() => onOpenCertificate?.(item.id)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
                    title={isEn ? `Preview ${item.titleEn}` : `មើលគំរូ ${item.titleKh}`}
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isEn ? 'Preview Certificate' : 'មើលគំរូវិញ្ញាបនបត្រ (Preview)'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Milestones Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>{isEn ? 'Certificate & Badges' : 'វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា (Certificate) & Badges'}</span>
          </h3>
          <p className="font-khmer text-xs sm:text-sm text-slate-500 mt-1">
            {isEn
              ? 'Achieve learning milestones to unlock official honors badges and certification!'
              : 'សម្រេចបានគោលដៅសិក្សាដើម្បីដោះសោផ្លាកសញ្ញាកិត្តិយស និងវិញ្ញាបនបត្របញ្ជាក់ការសិក្សា!'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const unlocked = badge.isUnlocked(progress);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  unlocked
                    ? 'bg-white border-slate-200 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  unlocked ? 'bg-slate-100' : 'bg-slate-200 text-slate-400'
                }`}>
                  {unlocked ? getBadgeIcon(badge.icon) : <Lock className="w-4 h-4" />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">{badge.titleEn}</h4>
                    {unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  {!isEn && (
                    <div className="font-khmer text-xs font-semibold text-emerald-700">
                      {badge.titleKh}
                    </div>
                  )}
                  <p className="font-khmer text-[11px] text-slate-500 leading-tight">
                    {isEn ? badge.descriptionEn : badge.descriptionKh}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz History Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <span>{isEn ? 'Recent Quiz Record' : 'ប្រវត្តិនៃការប្រឡង (Quiz History)'}</span>
        </h3>

        {progress.quizHistory.length === 0 ? (
          <div className="text-center py-6 text-slate-400 font-khmer text-xs">
            {isEn
              ? 'No quiz records yet. Take a quiz in Quiz Arena to earn scores!'
              : 'មិនទាន់មានប្រវត្តិប្រឡងនៅឡើយទេ។ សូមចូលទៅកាន់ Quiz Arena ដើម្បីចាប់ផ្តើមធ្វើតេស្ត!'}
          </div>
        ) : (
          <div className="space-y-2">
            {progress.quizHistory.slice(-5).reverse().map((record, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase text-slate-700 px-2 py-0.5 rounded bg-white border border-slate-200">
                    {record.level}
                  </span>
                  <span className="text-slate-500">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800">
                    {record.score} / {record.total}
                  </span>
                  <span className={`font-semibold px-2 py-0.5 rounded-full ${
                    Math.round((record.score / record.total) * 100) >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {Math.round((record.score / record.total) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onResetProgress}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Reset Learning Progress' : 'Reset Learning Progress / កំណត់ទិន្នន័យឡើងវិញ'}</span>
          </button>
        </div>
      </div>
    </div>
    )}

    </div>
  );
};
