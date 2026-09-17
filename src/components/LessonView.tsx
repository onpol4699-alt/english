import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Play, 
  Volume2, 
  Square,
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  HelpCircle, 
  X, 
  ChevronRight,
  ChevronDown,
  Bookmark,
  BookmarkCheck,
  Check,
  RotateCcw,
  Zap,
  Clock,
  Layers,
  Search,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  Lock,
  ShieldCheck,
  Crown,
  QrCode,
  Headphones,
  Mic,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson, VocabItem, DifficultyLevel, UserProgress, EnglishTense } from '../types';
import { LESSONS } from '../data/curriculum';
import { ENGLISH_TENSES } from '../data/tensesData';
import { GRAMMAR_FOUNDATIONS, GrammarFoundationItem } from '../data/grammarFoundations';
import { speakEnglish, stopSpeaking, subscribeAudioState, playFanfareSound } from '../utils/audio';
import { isLevelUnlocked, calculateLevelProgress } from '../utils/progression';
import { LearningHeader } from './LearningHeader';
import { IllustrationCard } from './IllustrationCard';
import { LevelLessonSelectModal } from './LevelLessonSelectModal';
import { LockedLevelModal } from './LockedLevelModal';
import { ErrorBoundary } from './ErrorBoundary';
import { ExitConfirmationModal } from './ExitConfirmationModal';
import { getTranslation } from '../utils/translations';
import imgRuralStudentVector from '../assets/images/rural_students_1789311218866.jpg';
import imgAirportTravelVector from '../assets/images/airport_students_1789311231202.jpg';
import imgBusinessDealVector from '../assets/images/business_deal_vector_1789309731051.jpg';

interface LessonViewProps {
  progress: UserProgress;
  currentLevel: DifficultyLevel;
  onCompleteLesson: (lessonId: string, xpReward: number) => void;
  onStartQuizForLesson: (lessonId: string) => void;
  onToggleSaveVocab: (vocabId: string) => void;
  onToggleMasterVocab: (vocabId: string) => void;
  onStudyTimeTick?: (seconds: number) => void;
  onSelectTenseQuiz?: (tenseId: string) => void;
  onOpenCertificate?: () => void;
  onOpenPersonalQr?: () => void;
  requestedLevelModal?: DifficultyLevel | null;
  onClearRequestedLevelModal?: () => void;
  onNavigateToTab?: (tab: 'lessons' | 'quiz' | 'tenses' | 'flashcards' | 'dictionary' | 'achievements') => void;
}

type HubCategory = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'tenses' | 'grammar';

const LESSON_TOPIC_METADATA: Record<
  string,
  {
    topicKh: string;
    topicEn: string;
    icon: string;
    badgeClass: string;
    borderClass: string;
    btnClass: string;
    quizBtnClass: string;
  }
> = {
  'beg-1': {
    topicKh: 'ការស្វាគមន៍ & ណែនាំខ្លួន',
    topicEn: 'Greetings & Introductions',
    icon: '👋',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderClass: 'border-emerald-200 hover:border-emerald-500',
    btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
    quizBtnClass: 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800',
  },
  'beg-2': {
    topicKh: 'ទម្លាប់ប្រចាំថ្ងៃ & ម៉ោង',
    topicEn: 'Daily Routines & Time',
    icon: '⏰',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    borderClass: 'border-teal-200 hover:border-teal-500',
    btnClass: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20',
    quizBtnClass: 'border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-800',
  },
  'beg-3': {
    topicKh: 'ម្ហូបអាហារ & ភេសជ្ជៈ',
    topicEn: 'Food & Dining Out',
    icon: '🍜',
    badgeClass: 'bg-lime-50 text-lime-800 border-lime-300',
    borderClass: 'border-lime-200 hover:border-lime-500',
    btnClass: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20',
    quizBtnClass: 'border-lime-300 bg-lime-50 hover:bg-lime-100 text-lime-800',
  },
  'int-1': {
    topicKh: 'ការធ្វើដំណើរ & ព្រលានយន្តហោះ',
    topicEn: 'Travel & Airport English',
    icon: '✈️',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    borderClass: 'border-sky-200 hover:border-sky-500',
    btnClass: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20',
    quizBtnClass: 'border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800',
  },
  'int-2': {
    topicKh: 'កន្លែងធ្វើការ & សម្ភាសន៍',
    topicEn: 'Workplace & Job Interview',
    icon: '💼',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    borderClass: 'border-blue-200 hover:border-blue-500',
    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
    quizBtnClass: 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800',
  },
  'int-3': {
    topicKh: 'ការបញ្ចេញមតិ & ជីវិតសង្គម',
    topicEn: 'Opinions & Social Networking',
    icon: '🗣️',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    borderClass: 'border-indigo-200 hover:border-indigo-500',
    btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20',
    quizBtnClass: 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-800',
  },
  'adv-1': {
    topicKh: 'ការចរចាពាណិជ្ជកម្ម & កិច្ចសន្យា',
    topicEn: 'Business Negotiations & Deals',
    icon: '🤝',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    borderClass: 'border-rose-200 hover:border-rose-500',
    btnClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
    quizBtnClass: 'border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800',
  },
  'adv-2': {
    topicKh: 'ការស្រាវជ្រាវ & តស៊ូមតិ',
    topicEn: 'Academic Research & Debates',
    icon: '🔬',
    badgeClass: 'bg-red-50 text-red-800 border-red-200',
    borderClass: 'border-red-200 hover:border-red-500',
    btnClass: 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20',
    quizBtnClass: 'border-red-300 bg-red-50 hover:bg-red-100 text-red-800',
  },
  'adv-3': {
    topicKh: 'សំនួនវោហារ & វប្បធម៌ជាន់ខ្ពស់',
    topicEn: 'Advanced Idioms & Nuance',
    icon: '🎭',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
    borderClass: 'border-amber-200 hover:border-amber-500',
    btnClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
    quizBtnClass: 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800',
  },
};

export const LessonView: React.FC<LessonViewProps> = ({
  progress,
  currentLevel,
  onCompleteLesson,
  onStartQuizForLesson,
  onToggleSaveVocab,
  onToggleMasterVocab,
  onStudyTimeTick,
  onSelectTenseQuiz,
  onOpenCertificate,
  onOpenPersonalQr,
  requestedLevelModal,
  onClearRequestedLevelModal,
  onNavigateToTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<HubCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedTense, setSelectedTense] = useState<EnglishTense | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarFoundationItem | null>(null);
  const [selectedLevelForModal, setSelectedLevelForModal] = useState<DifficultyLevel | null>(null);
  const [showAllLessonsCatalog, setShowAllLessonsCatalog] = useState(false);
  const [hasFinishedReading, setHasFinishedReading] = useState(false);
  const [lockedNotice, setLockedNotice] = useState<{ [key: string]: string | null }>({});
  
  const [lessonViewMode, setLessonViewMode] = useState<'interactive' | 'reference'>('interactive');
  const [activeVocabIndex, setActiveVocabIndex] = useState<number>(0);
  const [activeModalTab, setActiveModalTab] = useState<'vocab' | 'listening' | 'reading' | 'dialogue' | 'grammar'>('vocab');
  const [playingDialogueIndex, setPlayingDialogueIndex] = useState<number | null>(null);
  const [showExitConfirmation, setShowExitConfirmation] = useState<boolean>(false);
  const [showKhmerTranslation, setShowKhmerTranslation] = useState<boolean>(true);
  const [comprehensionAnswers, setComprehensionAnswers] = useState<{ [qId: string]: string }>({});
  const [showKhmerReading, setShowKhmerReading] = useState<boolean>(false);
  const [speechFeedback, setSpeechFeedback] = useState<{ [key: string]: 'speaking' | 'success' }>({});
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeAudioState((isSpeaking) => {
      if (!isSpeaking) {
        setPlayingAudioId(null);
      }
    });
    return () => {
      unsub();
      stopSpeaking();
    };
  }, []);

  const handleToggleAudio = async (audioId: string, text: string, rate?: number) => {
    if (playingAudioId === audioId) {
      stopSpeaking();
      setPlayingAudioId(null);
      return;
    }
    stopSpeaking();
    setPlayingAudioId(audioId);
    await speakEnglish(text, rate ?? progress.speechRate);
    setPlayingAudioId(null);
  };

  const toKhmerNumber = (num: number | string): string => {
    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return String(num).replace(/[0-9]/g, (d) => khmerDigits[parseInt(d, 10)]);
  };

  const t = getTranslation(progress.appLanguage);
  const isEn = progress.appLanguage === 'en';

  useEffect(() => {
    if (requestedLevelModal) {
      setSelectedLevelForModal(requestedLevelModal);
      onClearRequestedLevelModal?.();
    }
  }, [requestedLevelModal, onClearRequestedLevelModal]);

  const handleOpenLesson = (lesson: Lesson) => {
    try {
      if (!lesson || !lesson.id) {
        console.warn('Attempted to open null or invalid lesson');
        alert(isEn ? 'This lesson could not be loaded.' : 'មេរៀននេះមិនអាចផ្ទុកបានឡើយ។');
        return;
      }
      setSelectedLesson(lesson);
      setActiveVocabIndex(0);
      setLessonViewMode('interactive');
      setActiveModalTab('vocab');
      setHasFinishedReading(false);
      setComprehensionAnswers({});
      setShowKhmerReading(false);
      setShowExitConfirmation(false);
    } catch (err) {
      console.error('Error opening lesson:', err);
      alert(isEn ? 'Failed to open lesson. Please try again.' : 'មានបញ្ហាក្នុងការបើកមេរៀន។ សូមព្យាយាមម្តងទៀត។');
    }
  };

  const beginnerLessons = LESSONS.filter((l) => l.level === 'beginner');
  const intermediateLessons = LESSONS.filter((l) => l.level === 'intermediate');
  const advancedLessons = LESSONS.filter((l) => l.level === 'advanced');

  const searchLower = searchQuery.trim().toLowerCase();
  const filterLesson = (l: Lesson) => {
    if (!searchLower) return true;
    return (
      (l.titleEn && l.titleEn.toLowerCase().includes(searchLower)) ||
      (l.titleKh && l.titleKh.toLowerCase().includes(searchLower)) ||
      (l.descriptionKh && l.descriptionKh.toLowerCase().includes(searchLower)) ||
      (l.vocabulary &&
        l.vocabulary.some(
          (v) =>
            (v.english && v.english.toLowerCase().includes(searchLower)) ||
            (v.khmerMeaning && v.khmerMeaning.toLowerCase().includes(searchLower))
        )) ||
      (l.dialogue &&
        l.dialogue.some(
          (d) =>
            (d.english && d.english.toLowerCase().includes(searchLower)) ||
            (d.khmer && d.khmer.toLowerCase().includes(searchLower))
        )) ||
      (l.grammar &&
        ((l.grammar.titleEn && l.grammar.titleEn.toLowerCase().includes(searchLower)) ||
          (l.grammar.titleKh && l.grammar.titleKh.toLowerCase().includes(searchLower)) ||
          (l.grammar.explanationKh && l.grammar.explanationKh.toLowerCase().includes(searchLower))))
    );
  };

  const filteredBeginner = beginnerLessons.filter(filterLesson);
  const filteredIntermediate = intermediateLessons.filter(filterLesson);
  const filteredAdvanced = advancedLessons.filter(filterLesson);

  const filteredTenses = ENGLISH_TENSES.filter(
    (t) =>
      !searchQuery ||
      t.tenseNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tenseNameKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.formulaPositive.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGrammar = GRAMMAR_FOUNDATIONS.filter(
    (g) =>
      !searchQuery ||
      g.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.titleKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summaryKh.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const begUnlocked = isLevelUnlocked('beginner', progress);
  const begStats = calculateLevelProgress('beginner', progress);

  const intUnlocked = isLevelUnlocked('intermediate', progress);
  const intStats = calculateLevelProgress('intermediate', progress);

  const advUnlocked = isLevelUnlocked('advanced', progress);
  const advStats = calculateLevelProgress('advanced', progress);

  // Hide certificate reminder/banner completely until at least one level reaches 100% completion
  const hasLevelCompleted100 = (begStats.percentage >= 100) || (intStats.percentage >= 100) || (advStats.percentage >= 100);

  // Expandable dropdown state for the 3 Level Cards (Requirement 6)
  const [expandedLevels, setExpandedLevels] = useState<{
    beginner: boolean;
    intermediate: boolean;
    advanced: boolean;
  }>({
    beginner: false,
    intermediate: false,
    advanced: false,
  });

  const [lockedModalLevel, setLockedModalLevel] = useState<DifficultyLevel | null>(null);

  const handleShowLockedModal = (level: DifficultyLevel) => {
    setLockedModalLevel(level);
  };

  const toggleLevelDropdown = (level: DifficultyLevel, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (level === 'intermediate' && !intUnlocked) {
      handleShowLockedModal('intermediate');
      return;
    }
    if (level === 'advanced' && !advUnlocked) {
      handleShowLockedModal('advanced');
      return;
    }
    setExpandedLevels((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  // Card click navigation logic (seamlessly expands lesson selection in the card)
  const handleCardSelect = (level: DifficultyLevel) => {
    if (level === 'intermediate' && !intUnlocked) {
      handleShowLockedModal('intermediate');
      return;
    }
    if (level === 'advanced' && !advUnlocked) {
      handleShowLockedModal('advanced');
      return;
    }
    toggleLevelDropdown(level);
  };

  const handlePlayAudio = async (text: string) => {
    await speakEnglish(text, progress.speechRate);
  };

  const handlePlayAllDialogue = async (lesson: Lesson) => {
    if (!lesson.dialogue || lesson.dialogue.length === 0) return;
    for (let i = 0; i < lesson.dialogue.length; i++) {
      setPlayingDialogueIndex(i);
      await speakEnglish(lesson.dialogue[i].english, progress.speechRate);
      await new Promise((res) => setTimeout(res, 600));
    }
    setPlayingDialogueIndex(null);
  };

  const totalLessonsCount = LESSONS.length + ENGLISH_TENSES.length + GRAMMAR_FOUNDATIONS.length;

  const renderSubjectCard = (
    lesson: Lesson,
    fallbackTheme: {
      badgeClass: string;
      borderClass: string;
      btnClass: string;
      quizBtnClass: string;
    }
  ) => {
    const isCompleted = progress.completedLessonIds.includes(lesson.id);
    const meta = LESSON_TOPIC_METADATA[lesson.id] || {
      topicKh: lesson.titleKh,
      topicEn: lesson.titleEn,
      icon: '📖',
      badgeClass: fallbackTheme.badgeClass,
      borderClass: fallbackTheme.borderClass,
      btnClass: fallbackTheme.btnClass,
      quizBtnClass: fallbackTheme.quizBtnClass,
    };

    return (
      <motion.div
        key={lesson.id}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.15 }}
        className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4.5 lg:p-5 border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-lg ${
          isCompleted
            ? 'border-emerald-300/80 bg-emerald-50/10 ring-1 ring-emerald-500/20'
            : `${meta.borderClass}`
        }`}
      >
        <div>
          {/* Top Bar: Topic Badge & XP Tag */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className={`inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border ${isEn ? 'font-sans' : 'font-khmer'} ${meta.badgeClass}`}>
              <span>{meta.icon}</span>
              <span className="line-clamp-1">{isEn ? meta.topicEn : meta.topicKh}</span>
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 sm:px-2 py-0.5 rounded-md">
                +{lesson.xpReward} XP
              </span>
              {isCompleted && (
                <span className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-1.5 sm:px-2 py-0.5 rounded-md ${isEn ? 'font-sans' : 'font-khmer'}`}>
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                  <span>{isEn ? 'Completed' : 'បានរៀនចប់'}</span>
                </span>
              )}
            </div>
          </div>

          {/* Lesson Order Index */}
          <div className={`text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1 ${isEn ? 'font-sans' : 'font-khmer'}`}>
            {isEn ? `Unit 0${lesson.order}` : `មេរៀនទី ០${lesson.order} (Unit ${lesson.order})`}
          </div>

          {/* Title in English & Khmer */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base lg:text-lg mb-0.5 sm:mb-1 leading-snug">
            {lesson.titleEn}
          </h3>
          {!isEn && (
            <h4 className="font-khmer text-xs sm:text-sm font-bold text-slate-700 mb-1 sm:mb-2 leading-relaxed">
              {lesson.titleKh}
            </h4>
          )}

          <p className={`text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2.5 sm:mb-4 ${isEn ? 'font-sans' : 'font-khmer'}`}>
            {isEn ? (lesson.descriptionEn || lesson.titleEn) : lesson.descriptionKh}
          </p>

          {/* Content Breakdown Chips */}
          <div className={`flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-5 text-[10px] sm:text-[11px] text-slate-600 ${isEn ? 'font-sans' : 'font-khmer'}`}>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.8 rounded-md bg-slate-100/80 text-slate-700 border border-slate-200/70 font-medium">
              <BookOpen className="w-3 h-3 text-slate-500" />
              <span>{lesson.vocabulary.length} {isEn ? 'Vocabulary' : 'ពាក្យគន្លឹះ'}</span>
            </span>
            {lesson.dialogue && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.8 rounded-md bg-slate-100/80 text-slate-700 border border-slate-200/70 font-medium">
                <MessageSquare className="w-3 h-3 text-slate-500" />
                <span>{isEn ? 'Dialogue' : 'ការសន្ទនា'}</span>
              </span>
            )}
            {lesson.grammar && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.8 rounded-md bg-slate-100/80 text-slate-700 border border-slate-200/70 font-medium">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{isEn ? 'Grammar' : 'វេយ្យាករណ៍'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Dual VIP Action Buttons */}
        <div className="pt-2.5 sm:pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-1.5 sm:gap-2">
          <button
            id={`btn-open-lesson-${lesson.id}`}
            onClick={() => handleOpenLesson(lesson)}
            className={`w-full inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl ${meta.btnClass} text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow-md font-khmer`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>{t.studyLesson}</span>
          </button>

          <button
            id={`btn-quiz-lesson-${lesson.id}`}
            onClick={() => onStartQuizForLesson(lesson.id)}
            className={`w-full inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl border ${meta.quizBtnClass} text-[11px] sm:text-xs font-bold transition-all cursor-pointer hover:shadow-xs font-khmer`}
          >
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{t.takeQuiz}</span>
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Spacious Non-cramped Header: Search Bar & Total Completed Lessons Statistics */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5 font-khmer">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
              📚
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                {t.appTitle}
              </h1>
              <p className="text-xs text-slate-500">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Clean Non-cramped Completed Lessons Statistics */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="text-slate-500 font-normal">{t.completedLessonsCount}: </span>
                <span className="font-extrabold text-emerald-800 font-mono">
                  {progress.completedLessonIds.length} / {LESSONS.length}
                </span>
                <span className="ml-1 text-[11px] font-bold text-emerald-700">
                  ({Math.round((progress.completedLessonIds.length / LESSONS.length) * 100)}%)
                </span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center gap-2 shadow-2xs">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="text-xs">
                <span className="text-slate-500 font-normal">{isEn ? 'Points' : 'ពិន្ទុសរុប'}: </span>
                <span className="font-extrabold text-indigo-900 font-mono">{progress.xp || progress.totalPoints || 0} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean, Fully Functional Search Bar with Clear (X) Button */}
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="lesson-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-khmer shadow-2xs transition"
            />
            {searchQuery && (
              <button
                type="button"
                id="btn-search-clear-inline"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer transition shadow-2xs"
                title={t.searchClear}
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <button
              type="button"
              id="btn-search-clear-dedicated"
              onClick={() => setSearchQuery('')}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
              title={t.searchClear}
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.searchClear}</span>
            </button>
          )}
        </div>

        {/* Search Results Summary Box */}
        {searchQuery.trim() !== '' && (
          <div className="p-3 sm:p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {t.searchResultsFor} "{searchQuery}"
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900 font-mono font-bold">
                  {filteredBeginner.length + filteredIntermediate.length + filteredAdvanced.length + filteredTenses.length} {t.foundMatches}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-indigo-700 hover:text-indigo-900 font-bold hover:underline cursor-pointer"
              >
                {t.searchClear} (X)
              </button>
            </div>

            {filteredBeginner.length + filteredIntermediate.length + filteredAdvanced.length + filteredTenses.length === 0 ? (
              <div className="text-center py-4 text-slate-500 text-xs sm:text-sm font-khmer">
                {t.noResultsFound} "{searchQuery}"
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {[...filteredBeginner, ...filteredIntermediate, ...filteredAdvanced].slice(0, 9).map((l) => {
                  const unlocked = isLevelUnlocked(l.level, progress);
                  return (
                    <div
                      key={l.id}
                      className="p-2.5 rounded-xl border border-indigo-100 bg-white hover:border-indigo-300 hover:shadow-xs transition flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                            l.level === 'beginner' ? 'bg-emerald-100 text-emerald-800' :
                            l.level === 'intermediate' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {l.level}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {l.titleEn}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-khmer truncate">
                          {l.titleKh}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={!unlocked}
                          onClick={() => {
                            if (unlocked) {
                              handleOpenLesson(l);
                            } else {
                              handleShowLockedModal(l.level as DifficultyLevel);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-white text-xs font-bold transition shadow-2xs ${
                            unlocked ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {unlocked ? t.studyLesson : (isEn ? 'Locked' : 'ចាក់សោ')}
                        </button>
                        <button
                          type="button"
                          disabled={!unlocked}
                          onClick={() => {
                            if (unlocked) {
                              onStartQuizForLesson(l.id);
                            } else {
                              handleShowLockedModal(l.level as DifficultyLevel);
                            }
                          }}
                          className={`px-2 py-1 rounded-lg border text-xs font-bold transition ${
                            unlocked 
                              ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer' 
                              : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {t.takeQuiz}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Graduation Certificate Notice - Hidden completely until at least one level reaches 100% */}
      {hasLevelCompleted100 && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-50/80 to-emerald-50/60 border border-amber-300 sm:flex sm:items-center sm:justify-between gap-4 shadow-2xs font-khmer">
          <div className="flex items-center gap-3 mb-2.5 sm:mb-0">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs text-xl">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {t.certBannerTitle}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300 font-mono">
                  100% Certificate
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {t.certBannerDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenCertificate?.()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold font-khmer shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t.viewCertificate}</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN 3 LEVEL CARDS (កាតកម្រិតទាំង ៣ - Beginner, Intermediate, Advanced) */}
      {/* ========================================================================= */}
      <div className="space-y-4 sm:space-y-5">
        {/* 3 Level Modular Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4.5">
            {/* 1. Beginner Level Card */}
            <div 
              onClick={() => handleCardSelect('beginner')}
              className="rounded-2xl sm:rounded-3xl border-2 border-emerald-300 bg-gradient-to-b from-emerald-50/40 via-white to-white shadow-xs flex flex-col justify-between hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group animate-glow-study overflow-hidden"
            >
              <div>
                {/* 2D Vector Illustration Header - Full width across the top of card (Requirement 2) */}
                <div className="relative w-full h-[180px] overflow-hidden bg-slate-900">
                  <img 
                    src={imgRuralStudentVector} 
                    alt="Cambodian rural student with backpack walking along village path" 
                    className="w-full h-[180px] object-cover rounded-t-2xl sm:rounded-t-3xl group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Top overlay badges: CEFR & Lessons Count */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600/80 text-white text-[10px] font-medium font-mono border border-emerald-300/30 backdrop-blur-sm shadow-sm">
                      CEFR A1 - A2
                    </span>
                    <span className="text-[10px] font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 animate-gradient-x shadow-md backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full font-khmer shrink-0">
                      {begStats.completedLessons}/{begStats.totalLessons} {isEn ? 'Lessons' : 'មេរៀន'}
                    </span>
                  </div>

                  {/* Bottom overlay badge */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] pointer-events-none">
                    <span className="font-bold font-khmer text-white drop-shadow-md text-[11px] truncate max-w-[170px]">
                      {isEn ? 'Rural Student Foundation' : 'មូលដ្ឋានភាសាអង់គ្លេសដំបូង'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 text-white text-[10px] font-medium shadow-sm animate-shimmer border border-teal-200/30 shrink-0">
                      VIP Tier 1
                    </span>
                  </div>
                </div>

                {/* Card Inner Body */}
                <div className="p-4 sm:p-5">
                  {/* Green Theme Header */}
                  <div className="rounded-xl p-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xs flex items-center mb-3">
                    <span className="text-xs font-bold font-khmer text-emerald-50">
                      {isEn ? 'Beginner Level' : 'កម្រិតដំបូង'}
                    </span>
                  </div>

                  {/* Animated Floating Study Icon + Title */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-500/30 animate-float-study border border-emerald-300/40">
                        <BookOpen className="w-5 h-5 text-white animate-downward-arrow" />
                      </div>
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base font-khmer group-hover:text-emerald-700 transition-colors">
                        {isEn ? 'Green Card: Beginner Level' : 'កាតបៃតង ៖ កម្រិតដំបូង'}
                      </h3>
                      <div className="text-[11px] font-medium text-emerald-700 font-sans">
                        Beginner Foundation (VIP Tier 1)
                      </div>
                    </div>
                  </div>

                  <p className="font-khmer text-xs text-slate-600 line-clamp-2 mb-2.5">
                    {isEn ? 'Greetings, everyday routines, dining out, numbers, and fundamental English.' : 'ការស្វាគមន៍ ការសួរសុខទុក្ខ ទម្លាប់ប្រចាំថ្ងៃ ម្ហូបអាហារ និងការបញ្ជាទិញទូទៅ'}
                  </p>

                  {/* Topic Tags */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Key topics
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Aboundon topics
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Greetings & Routines
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Dining & Numbers
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                      <span>Progress</span>
                      <span className="font-bold text-emerald-700">{begStats.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-emerald-100">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${begStats.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Animated Downward-Moving Icon Invitation (Requirement 6) */}
                  <div 
                    onClick={(e) => toggleLevelDropdown('beginner', e)}
                    className="my-2.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/90 flex items-center justify-between transition-colors cursor-pointer group/down"
                    title={isEn ? "Click to view Beginner lessons" : "ចុចជ្រើសរើសមេរៀនកម្រិតដំបូង"}
                  >
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 font-khmer">
                    <span>{isEn ? (expandedLevels.beginner ? 'Collapse Lessons' : 'Select Lessons') : (expandedLevels.beginner ? 'បង្រួមបញ្ជីមេរៀន' : 'ចុចជ្រើសរើសមេរៀន (Select Lessons)')}</span>
                    <span className="text-[10px] text-emerald-700 font-mono">({filteredBeginner.length} {isEn ? 'Lessons' : 'មេរៀន'})</span>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center shrink-0 shadow-2xs group-hover/down:bg-emerald-300 transition-colors animate-downward-arrow"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedLevels.beginner ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Smooth Expandable Lessons List */}
                <AnimatePresence>
                  {expandedLevels.beginner && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mt-2 pt-3 border-t border-emerald-200/80 space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        <div className="text-[11px] font-bold text-emerald-900 px-1 font-khmer mb-1">
                          <span>{isEn ? `Lesson Catalog (${filteredBeginner.length}):` : `បញ្ជីមេរៀន (${filteredBeginner.length})៖`}</span>
                        </div>
                        {filteredBeginner.map((lesson, idx) => {
                          const isCompleted = progress.completedLessonIds.includes(lesson.id);
                          return (
                            <div
                              key={lesson.id}
                              onClick={() => handleOpenLesson(lesson)}
                              className={`p-2 rounded-xl border bg-white hover:border-emerald-400 hover:shadow-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                                isCompleted ? 'border-emerald-300 bg-emerald-50/40' : 'border-emerald-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-900 truncate">
                                    {lesson.titleEn}
                                  </div>
                                  {!isEn && (
                                    <div className="text-[10px] text-slate-500 font-khmer truncate">
                                      {lesson.titleKh}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                {isCompleted && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                                <button
                                  type="button"
                                  id={`btn-dropdown-study-${lesson.id}`}
                                  onClick={() => handleOpenLesson(lesson)}
                                  className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition font-khmer cursor-pointer shadow-2xs"
                                >
                                  {t.studyLesson}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onStartQuizForLesson(lesson.id)}
                                  className="px-2 py-1 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold transition font-khmer cursor-pointer"
                                >
                                  Quiz
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

              {/* Action Buttons */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2.5 mt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 font-khmer" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLevelForModal('beginner');
                    setExpandedLevels((p) => ({ ...p, beginner: true }));
                  }}
                  className="w-full py-2.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Select Lessons' : 'ជ្រើសរើសមេរៀន'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onStartQuizForLesson(beginnerLessons[0]?.id || 'beg-1')}
                  className="w-full py-2.5 px-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isEn ? 'Beginner Quiz' : 'Quiz ដំបូង'}</span>
                </button>
              </div>
            </div>

            {/* 2. Intermediate Level Card */}
            <div 
              onClick={() => handleCardSelect('intermediate')}
              className={`rounded-2xl sm:rounded-3xl border-2 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group overflow-hidden ${
                intUnlocked 
                  ? 'border-blue-300 bg-gradient-to-b from-blue-50/40 via-white to-white hover:border-blue-500 animate-glow-study cursor-pointer' 
                  : 'border-slate-200 bg-slate-50/80 opacity-85 cursor-not-allowed'
              }`}
            >
              <div>
                {/* 2D Vector Illustration Header - Full width across the top of card (Requirement 2) */}
                <div className="relative w-full h-[180px] overflow-hidden bg-slate-900">
                  <img 
                    src={imgAirportTravelVector} 
                    alt="Male and female students with suitcases walking together inside modern airport terminal" 
                    className="w-full h-[180px] object-cover rounded-t-2xl sm:rounded-t-3xl group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Top overlay badges: CEFR & Lessons Count */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full bg-blue-600/80 text-white text-[10px] font-medium font-mono border border-blue-300/30 backdrop-blur-sm shadow-sm">
                      CEFR B1 - B2
                    </span>
                    <span className="text-[10px] font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 animate-gradient-x shadow-md backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full font-khmer shrink-0">
                      {intStats.completedLessons}/{intStats.totalLessons} {isEn ? 'Lessons' : 'មេរៀន'}
                    </span>
                  </div>

                  {/* Bottom overlay badge */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] pointer-events-none">
                    <span className="font-bold font-khmer text-white drop-shadow-md text-[11px] truncate max-w-[170px]">
                      {isEn ? 'Travel & Daily Dialogues' : 'ការធ្វើដំណើរ & ការសន្ទនា'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-medium shadow-sm animate-shimmer border border-blue-200/30 shrink-0">
                      VIP Tier 2
                    </span>
                  </div>
                </div>

                {/* Card Inner Body */}
                <div className="p-4 sm:p-5">
                  {/* Blue Theme Header */}
                  <div className={`rounded-xl p-2.5 text-white shadow-xs flex items-center mb-3 ${
                    intUnlocked ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700' : 'bg-slate-600'
                  }`}>
                    <span className="text-xs font-bold font-khmer text-blue-50">
                      {isEn ? 'Intermediate Level' : 'កម្រិតមធ្យម'}
                    </span>
                  </div>

                  {/* Animated Floating Study Icon + Title */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md border animate-float-study ${
                        intUnlocked 
                          ? 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-blue-500/30 border-blue-300/40' 
                          : 'bg-slate-200 text-slate-500 border-slate-300'
                      }`}>
                        {intUnlocked ? (
                          <BookOpen className="w-5 h-5 text-white animate-downward-arrow" />
                        ) : (
                          <Lock className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      {intUnlocked && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border border-white"></span>
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base font-khmer group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                        <span>{isEn ? 'Blue Card: Intermediate Level' : 'កាតខៀវ ៖ កម្រិតមធ្យម'}</span>
                        {!intUnlocked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                      </h3>
                      <div className="text-[11px] font-medium text-blue-700 font-sans">
                        Intermediate Fluency (VIP Tier 2)
                      </div>
                    </div>
                  </div>

                  <p className="font-khmer text-xs text-slate-600 line-clamp-2 mb-2.5">
                    {isEn ? 'Travel, airport communications, workplace dialogues, and social discussions.' : 'ការធ្វើដំណើរ ព្រលានយន្តហោះ កន្លែងធ្វើការ និងការពិភាក្សាផ្លូវការ'}
                  </p>

                  {/* Topic Tags */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      Travel topics
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      Conversation topics
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Airport Customs
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Workplace Dialogues
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                      <span>Progress</span>
                      <span className="font-bold text-blue-700">{intStats.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-blue-100">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${intStats.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Inline Locked Notice for Intermediate */}
                  {lockedNotice.intermediate && (
                    <div className="mb-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-khmer flex items-start gap-1.5 animate-in fade-in" onClick={(e) => e.stopPropagation()}>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{lockedNotice.intermediate}</span>
                    </div>
                  )}

                  {/* Animated Downward-Moving Icon Invitation (Requirement 6) */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!intUnlocked) {
                        handleShowLockedModal('intermediate');
                        return;
                      }
                      toggleLevelDropdown('intermediate', e);
                    }}
                  className={`my-2.5 py-2 px-3 rounded-xl border flex items-center justify-between transition-colors ${
                    intUnlocked 
                      ? 'bg-blue-50 hover:bg-blue-100/80 border-blue-200/90 cursor-pointer group/down' 
                      : 'bg-slate-100/90 border-slate-300 cursor-not-allowed'
                  }`}
                  title={isEn ? (intUnlocked ? "Click to view Intermediate lessons" : "Intermediate is locked") : (intUnlocked ? "ចុចជ្រើសរើសមេរៀនកម្រិតមធ្យម" : "កម្រិតមធ្យមត្រូវបានចាក់សោ")}
                >
                  <div className="flex items-center gap-2 text-xs font-bold font-khmer">
                    {!intUnlocked && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                    <span className={intUnlocked ? 'text-blue-900' : 'text-slate-600'}>
                      {isEn 
                        ? (intUnlocked ? (expandedLevels.intermediate ? 'Collapse Lessons' : 'Select Lessons') : 'Locked (Complete Beginner First)') 
                        : (intUnlocked ? (expandedLevels.intermediate ? 'បង្រួមបញ្ជីមេរៀន' : 'ចុចជ្រើសរើសមេរៀន (Select Lessons)') : 'ចាក់សោ (ត្រូវរៀនកម្រិតដំបូងជាមុន)')}
                    </span>
                    <span className="text-[10px] text-blue-700 font-mono">({filteredIntermediate.length} {isEn ? 'Lessons' : 'មេរៀន'})</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-2xs transition-colors ${
                      intUnlocked ? 'bg-blue-200 text-blue-900 group-hover/down:bg-blue-300 animate-downward-arrow' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {intUnlocked ? (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedLevels.intermediate ? 'rotate-180' : ''}`} />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-600" />
                    )}
                  </div>
                </div>

                {/* Smooth Expandable Lessons List */}
                <AnimatePresence>
                  {expandedLevels.intermediate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mt-2 pt-3 border-t border-blue-200/80 space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        <div className="text-[11px] font-bold text-blue-900 px-1 font-khmer mb-1">
                          <span>{isEn ? `Lesson Catalog (${filteredIntermediate.length}):` : `បញ្ជីមេរៀន (${filteredIntermediate.length})៖`}</span>
                        </div>
                        {filteredIntermediate.map((lesson, idx) => {
                          const isCompleted = progress.completedLessonIds.includes(lesson.id);
                          return (
                            <div
                              key={lesson.id}
                              onClick={() => handleOpenLesson(lesson)}
                              className={`p-2 rounded-xl border bg-white hover:border-blue-400 hover:shadow-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                                isCompleted ? 'border-blue-300 bg-blue-50/40' : 'border-blue-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-900 truncate">
                                    {lesson.titleEn}
                                  </div>
                                  {!isEn && (
                                    <div className="text-[10px] text-slate-500 font-khmer truncate">
                                      {lesson.titleKh}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                {isCompleted && (
                                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                )}
                                <button
                                  type="button"
                                  id={`btn-dropdown-study-${lesson.id}`}
                                  disabled={!intUnlocked}
                                  onClick={() => {
                                    if (intUnlocked) {
                                      handleOpenLesson(lesson);
                                    } else {
                                      handleShowLockedModal('intermediate');
                                    }
                                  }}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition font-khmer shadow-2xs ${
                                    intUnlocked 
                                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                                      : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                  }`}
                                >
                                  {t.studyLesson}
                                </button>
                                <button
                                  type="button"
                                  disabled={!intUnlocked}
                                  onClick={() => {
                                    if (intUnlocked) {
                                      onStartQuizForLesson(lesson.id);
                                    } else {
                                      handleShowLockedModal('intermediate');
                                    }
                                  }}
                                  className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition font-khmer ${
                                    intUnlocked 
                                      ? 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 cursor-pointer' 
                                      : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                                  }`}
                                >
                                  Quiz
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

              {/* Action Buttons */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2.5 mt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 font-khmer" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  id="btn-select-lessons-intermediate"
                  disabled={!intUnlocked}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!intUnlocked) {
                      handleShowLockedModal('intermediate');
                      return;
                    }
                    setSelectedLevelForModal('intermediate');
                    toggleLevelDropdown('intermediate');
                  }}
                  className={`w-full py-2.5 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm ${
                    intUnlocked
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95'
                      : 'bg-slate-200 hover:bg-slate-300/80 text-slate-400 border border-slate-300 cursor-not-allowed'
                  }`}
                >
                  {intUnlocked ? <BookOpen className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{isEn ? 'Select Lessons' : 'ជ្រើសរើសមេរៀន'}</span>
                </button>
                <button
                  type="button"
                  id="btn-quiz-intermediate"
                  disabled={!intUnlocked}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!intUnlocked) {
                      handleShowLockedModal('intermediate');
                      return;
                    }
                    onStartQuizForLesson(intermediateLessons[0]?.id || 'inter-1');
                  }}
                  className={`w-full py-2.5 px-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    intUnlocked
                      ? 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 cursor-pointer active:scale-95'
                      : 'border-slate-200 bg-slate-100 hover:bg-slate-200/70 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {intUnlocked ? <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{isEn ? 'Intermediate Quiz' : 'Quiz មធ្យម'}</span>
                </button>
              </div>
            </div>

            {/* 3. Advanced Level Card */}
            <div 
              onClick={() => handleCardSelect('advanced')}
              className={`rounded-2xl sm:rounded-3xl border-2 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group overflow-hidden ${
                advUnlocked 
                  ? 'border-rose-300 bg-gradient-to-b from-rose-50/40 via-white to-white hover:border-rose-500 animate-glow-study cursor-pointer' 
                  : 'border-slate-200 bg-slate-50/80 opacity-85 cursor-not-allowed'
              }`}
            >
              <div>
                {/* 2D Vector Illustration Header - Full width across the top of card (Requirement 2) */}
                <div className="relative w-full h-[180px] overflow-hidden bg-slate-900">
                  <img 
                    src={imgBusinessDealVector} 
                    alt="Business professionals in suits shaking hands during corporate meeting presentation" 
                    className="w-full h-[180px] object-cover rounded-t-2xl sm:rounded-t-3xl group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Top overlay badges: CEFR & Lessons Count */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full bg-rose-600/80 text-white text-[10px] font-medium font-mono border border-rose-300/30 backdrop-blur-sm shadow-sm">
                      CEFR C1 - C2
                    </span>
                    <span className="text-[10px] font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 animate-gradient-x shadow-md backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full font-khmer shrink-0">
                      {advStats.completedLessons}/{advStats.totalLessons} {isEn ? 'Lessons' : 'មេរៀន'}
                    </span>
                  </div>

                  {/* Bottom overlay badge */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] pointer-events-none">
                    <span className="font-bold font-khmer text-white drop-shadow-md text-[11px] truncate max-w-[170px]">
                      {isEn ? 'Executive Negotiation' : 'ការចរចាពាណិជ្ជកម្មកម្រិតខ្ពស់'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-medium shadow-sm animate-shimmer border border-rose-200/30 shrink-0">
                      VIP Tier 3
                    </span>
                  </div>
                </div>

                {/* Card Inner Body */}
                <div className="p-4 sm:p-5">
                  {/* Red Theme Header */}
                  <div className={`rounded-xl p-2.5 text-white shadow-xs flex items-center mb-3 ${
                    advUnlocked ? 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600' : 'bg-slate-600'
                  }`}>
                    <span className="text-xs font-bold font-khmer text-rose-50">
                      {isEn ? 'Advanced Level' : 'កម្រិតខ្ពស់'}
                    </span>
                  </div>

                  {/* Animated Floating Study Icon + Title */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md border animate-float-study ${
                        advUnlocked 
                          ? 'bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-rose-500/30 border-rose-300/40' 
                          : 'bg-slate-200 text-slate-500 border-slate-300'
                      }`}>
                        {advUnlocked ? (
                          <BookOpen className="w-5 h-5 text-white animate-downward-arrow" />
                        ) : (
                          <Lock className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      {advUnlocked && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-white"></span>
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base font-khmer group-hover:text-rose-700 transition-colors flex items-center gap-1.5">
                        <span>{isEn ? 'Red Card: Advanced Level' : 'កាតក្រហម ៖ កម្រិតខ្ពស់'}</span>
                        {!advUnlocked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                      </h3>
                      <div className="text-[11px] font-medium text-rose-700 font-sans">
                        Advanced Mastery (VIP Tier 3)
                      </div>
                    </div>
                  </div>

                  <p className="font-khmer text-xs text-slate-600 line-clamp-2 mb-2.5">
                    {isEn ? 'Business negotiations, professional deals, academic debates, and nuanced idioms.' : 'ការចរចាពាណិជ្ជកម្ម កិច្ចសន្យា ការវិភាគស្រាវជ្រាវ និងសំនួនវោហារជាន់ខ្ពស់'}
                  </p>

                  {/* Topic Tags */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Negotiation topics
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Executive Debate
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Academic Research
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Idioms & Nuance
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                      <span>Progress</span>
                      <span className="font-bold text-rose-700">{advStats.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-rose-100">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${advStats.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Inline Locked Notice for Advanced */}
                  {lockedNotice.advanced && (
                    <div className="mb-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-khmer flex items-start gap-1.5 animate-in fade-in" onClick={(e) => e.stopPropagation()}>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{lockedNotice.advanced}</span>
                    </div>
                  )}

                  {/* Animated Downward-Moving Icon Invitation (Requirement 6) */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!advUnlocked) {
                        handleShowLockedModal('advanced');
                        return;
                      }
                      toggleLevelDropdown('advanced', e);
                    }}
                  className={`my-2.5 py-2 px-3 rounded-xl border flex items-center justify-between transition-colors ${
                    advUnlocked 
                      ? 'bg-rose-50 hover:bg-rose-100/80 border-rose-200/90 cursor-pointer group/down' 
                      : 'bg-slate-100/90 border-slate-300 cursor-not-allowed'
                  }`}
                  title={isEn ? (advUnlocked ? "Click to view Advanced lessons" : "Advanced is locked") : (advUnlocked ? "ចុចជ្រើសរើសមេរៀនកម្រិតខ្ពស់" : "កម្រិតខ្ពស់ត្រូវបានចាក់សោ")}
                >
                  <div className="flex items-center gap-2 text-xs font-bold font-khmer">
                    {!advUnlocked && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                    <span className={advUnlocked ? 'text-rose-900' : 'text-slate-600'}>
                      {isEn 
                        ? (advUnlocked ? (expandedLevels.advanced ? 'Collapse Lessons' : 'Select Lessons') : 'Locked (Complete Intermediate First)') 
                        : (advUnlocked ? (expandedLevels.advanced ? 'បង្រួមបញ្ជីមេរៀន' : 'ចុចជ្រើសរើសមេរៀន (Select Lessons)') : 'ចាក់សោ (ត្រូវរៀនកម្រិតមធ្យមជាមុន)')}
                    </span>
                    <span className="text-[10px] text-rose-700 font-mono">({filteredAdvanced.length} {isEn ? 'Lessons' : 'មេរៀន'})</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-2xs transition-colors ${
                      advUnlocked ? 'bg-rose-200 text-rose-900 group-hover/down:bg-rose-300 animate-downward-arrow' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {advUnlocked ? (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedLevels.advanced ? 'rotate-180' : ''}`} />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-600" />
                    )}
                  </div>
                </div>

                {/* Smooth Expandable Lessons List */}
                <AnimatePresence>
                  {expandedLevels.advanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mt-2 pt-3 border-t border-rose-200/80 space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        <div className="text-[11px] font-bold text-rose-900 px-1 font-khmer mb-1">
                          <span>{isEn ? `Lesson Catalog (${filteredAdvanced.length}):` : `បញ្ជីមេរៀន (${filteredAdvanced.length})៖`}</span>
                        </div>
                        {filteredAdvanced.map((lesson, idx) => {
                          const isCompleted = progress.completedLessonIds.includes(lesson.id);
                          return (
                            <div
                              key={lesson.id}
                              onClick={() => handleOpenLesson(lesson)}
                              className={`p-2 rounded-xl border bg-white hover:border-rose-400 hover:shadow-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                                isCompleted ? 'border-rose-300 bg-rose-50/40' : 'border-rose-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-900 truncate">
                                    {lesson.titleEn}
                                  </div>
                                  {!isEn && (
                                    <div className="text-[10px] text-slate-500 font-khmer truncate">
                                      {lesson.titleKh}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                {isCompleted && (
                                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                                )}
                                <button
                                  type="button"
                                  id={`btn-dropdown-study-${lesson.id}`}
                                  disabled={!advUnlocked}
                                  onClick={() => {
                                    if (advUnlocked) {
                                      handleOpenLesson(lesson);
                                    } else {
                                      handleShowLockedModal('advanced');
                                    }
                                  }}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition font-khmer shadow-2xs ${
                                    advUnlocked 
                                      ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer' 
                                      : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                  }`}
                                >
                                  {t.studyLesson}
                                </button>
                                <button
                                  type="button"
                                  disabled={!advUnlocked}
                                  onClick={() => {
                                    if (advUnlocked) {
                                      onStartQuizForLesson(lesson.id);
                                    } else {
                                      handleShowLockedModal('advanced');
                                    }
                                  }}
                                  className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition font-khmer ${
                                    advUnlocked 
                                      ? 'border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 cursor-pointer' 
                                      : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                                  }`}
                                >
                                  Quiz
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

              {/* Action Buttons */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2.5 mt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 font-khmer" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  id="btn-select-lessons-advanced"
                  disabled={!advUnlocked}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!advUnlocked) {
                      handleShowLockedModal('advanced');
                      return;
                    }
                    setSelectedLevelForModal('advanced');
                    toggleLevelDropdown('advanced');
                  }}
                  className={`w-full py-2.5 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm ${
                    advUnlocked
                      ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer active:scale-95'
                      : 'bg-slate-200 hover:bg-slate-300/80 text-slate-400 border border-slate-300 cursor-not-allowed'
                  }`}
                >
                  {advUnlocked ? <BookOpen className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{isEn ? 'Select Lessons' : 'ជ្រើសរើសមេរៀន'}</span>
                </button>
                <button
                  type="button"
                  id="btn-quiz-advanced"
                  disabled={!advUnlocked}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!advUnlocked) {
                      handleShowLockedModal('advanced');
                      return;
                    }
                    onStartQuizForLesson(advancedLessons[0]?.id || 'adv-1');
                  }}
                  className={`w-full py-2.5 px-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    advUnlocked
                      ? 'border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 cursor-pointer active:scale-95'
                      : 'border-slate-200 bg-slate-100 hover:bg-slate-200/70 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {advUnlocked ? <HelpCircle className="w-3.5 h-3.5 text-rose-600" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{isEn ? 'Advanced Quiz' : 'Quiz ខ្ពស់'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts: 12 Tenses & Quiz Arena */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-khmer">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 text-white border border-indigo-400/80 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-bold text-sm">{t.tensesTitle}</h4>
                  <p className="text-[11px] text-indigo-100">12 English Tenses Master Guide</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToTab) {
                    onNavigateToTab('tenses');
                  } else {
                    setActiveCategory('tenses');
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold transition shrink-0 cursor-pointer shadow-xs"
              >
                {t.studyTense}
              </button>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-950 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-bold text-sm">កម្រង Quiz សាកល្បងសមត្ថភាព</h4>
                  <p className="text-[11px] text-amber-700">Quiz Arena • Collect XP & Medals</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onNavigateToTab) {
                    onNavigateToTab('quiz');
                  } else {
                    onStartQuizForLesson(beginnerLessons[0]?.id || 'beg-1');
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-xs"
              >
                ចូលធ្វើ Quiz
              </button>
            </div>
          </div>
        </div>

      {/* ========================================================================= */}
      {/* 1. GREEN LEVEL CARD: BEGINNER FOUNDATION (កាតបៃតង - កម្រិតដំបូង) */}
      {/* ========================================================================= */}
      {(activeCategory === 'beginner' || (Boolean(searchQuery) && filteredBeginner.length > 0)) && (
        <div className="rounded-2xl sm:rounded-3xl border sm:border-2 border-emerald-300/90 bg-gradient-to-b from-emerald-50/20 via-white to-white shadow-sm overflow-hidden transition-all duration-300">
          
          {/* Distinct Emerald Header Ribbon */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 sm:p-5 lg:p-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-3.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0">
                  🌱
                </div>
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5 sm:mb-1">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-100">
                      LEVEL 1 • BEGINNER FOUNDATION
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-900/50 border border-emerald-400/40 text-emerald-200 font-mono">
                      CEFR A1 - A2
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-xs">
                      VIP TIER 1
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight font-khmer">
                    កាតបៃតង ៖ កម្រិតដំបូង (Beginner Lessons)
                  </h2>
                  <p className="font-khmer text-[11px] sm:text-xs md:text-sm text-emerald-100/90 mt-0.5">
                    ការស្វាគមន៍ ការសួរសុខទុក្ខ ទម្លាប់ប្រចាំថ្ងៃ ម្ហូបអាហារ និងការបញ្ជាទិញទូទៅ
                  </p>
                </div>
              </div>

              {/* Progress & Status Pill */}
              <div className="flex items-center gap-2 self-start md:self-auto bg-black/20 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/10 shrink-0 font-khmer">
                <div className="text-right">
                  <div className="text-[10px] sm:text-[11px] text-emerald-200 font-bold">
                    {begStats.percentage}%
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-white flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>បើកដំណើរការ (Active)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inside Card: Subject Modules Grid */}
          <div className="p-3 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-emerald-100 font-khmer">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                  បញ្ជីមុខវិជ្ជា និងមេរៀនប្រចាំកម្រិតដំបូង (Beginner Subject Modules)
                </h3>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {filteredBeginner.length} មុខវិជ្ជា
              </span>
            </div>

            {filteredBeginner.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-slate-400 font-khmer text-xs">
                មិនមានមេរៀនណាដែលត្រូវនឹងពាក្យស្វែងរក "{searchQuery}" ឡើយ
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4.5">
                {filteredBeginner.map((lesson) =>
                  renderSubjectCard(lesson, {
                    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    borderClass: 'border-emerald-200 hover:border-emerald-500',
                    btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
                    quizBtnClass: 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800',
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BLUE LEVEL CARD: INTERMEDIATE REAL-WORLD (កាតខៀវ - កម្រិតមធ្យម) */}
      {/* ========================================================================= */}
      {(activeCategory === 'intermediate' || (Boolean(searchQuery) && filteredIntermediate.length > 0)) && (
        <div className="rounded-2xl sm:rounded-3xl border sm:border-2 border-blue-300/90 bg-gradient-to-b from-blue-50/20 via-white to-white shadow-sm overflow-hidden transition-all duration-300">
          
          {/* Distinct Sapphire Blue Header Ribbon */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white p-4 sm:p-5 lg:p-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-3.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5 sm:mb-1">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-100">
                      LEVEL 2 • INTERMEDIATE REAL-WORLD
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-900/50 border border-blue-400/40 text-blue-200 font-mono">
                      CEFR B1 - B2
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-xs">
                      VIP TIER 2
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight font-khmer">
                    កាតខៀវ ៖ កម្រិតមធ្យម (Intermediate Lessons)
                  </h2>
                  <p className="font-khmer text-[11px] sm:text-xs md:text-sm text-blue-100/90 mt-0.5">
                    ការធ្វើដំណើរ ព្រលានយន្តហោះ កន្លែងធ្វើការ ការសម្ភាសន៍ និងការបញ្ចេញមតិក្នុងសង្គម
                  </p>
                </div>
              </div>

              {/* Progress & Status Pill */}
              <div className="flex items-center gap-2 self-start md:self-auto bg-black/20 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/10 shrink-0 font-khmer">
                <div className="text-right">
                  <div className="text-[10px] sm:text-[11px] text-blue-200 font-bold">
                    {intStats.percentage}%
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-white flex items-center gap-1 justify-end">
                    {intUnlocked ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                        <span>បើកដំណើរការ (Unlocked)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                        <span>ត្រូវការបញ្ចប់ Level 1</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prerequisite banner if locked */}
          {!intUnlocked && (
            <div className="bg-amber-50 border-b border-amber-200 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center gap-2 text-xs text-amber-800 font-khmer">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
              <span className="text-[11px] sm:text-xs">
                <strong>កំណត់សម្គាល់ ៖</strong> កម្រិតមធ្យមនេះនឹងបើកដំណើរការពេញលេញ នៅពេលអ្នករៀនចប់មេរៀន និងប្រឡងជាប់ Quiz កម្រិតទី ១ (Beginner)។ អ្នកអាចមើលមុខវិជ្ជា និងសាកល្បងរៀនទុកជាមុនបាន!
              </span>
            </div>
          )}

          {/* Inside Card: Subject Modules Grid */}
          <div className="p-3 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-blue-100 font-khmer">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                  បញ្ជីមុខវិជ្ជា និងមេរៀនប្រចាំកម្រិតមធ្យម (Intermediate Subject Modules)
                </h3>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {filteredIntermediate.length} មុខវិជ្ជា
              </span>
            </div>

            {filteredIntermediate.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-slate-400 font-khmer text-xs">
                មិនមានមេរៀនណាដែលត្រូវនឹងពាក្យស្វែងរក "{searchQuery}" ឡើយ
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4.5">
                {filteredIntermediate.map((lesson) =>
                  renderSubjectCard(lesson, {
                    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
                    borderClass: 'border-blue-200 hover:border-blue-500',
                    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
                    quizBtnClass: 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800',
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RED LEVEL CARD: ADVANCED FLUENCY & MASTERY (កាតក្រហម - កម្រិតខ្ពស់) */}
      {/* ========================================================================= */}
      {(activeCategory === 'advanced' || (Boolean(searchQuery) && filteredAdvanced.length > 0)) && (
        <div className="rounded-2xl sm:rounded-3xl border sm:border-2 border-rose-300/90 bg-gradient-to-b from-rose-50/20 via-white to-white shadow-sm overflow-hidden transition-all duration-300">
          
          {/* Distinct Crimson Ruby Header Ribbon */}
          <div className="relative overflow-hidden bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white p-4 sm:p-5 lg:p-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-3.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5 sm:mb-1">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-100">
                      LEVEL 3 • ADVANCED FLUENCY & MASTERY
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-red-950/50 border border-rose-400/40 text-rose-200 font-mono">
                      CEFR C1 - C2
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-xs">
                      VIP TIER 3
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight font-khmer">
                    កាតក្រហម ៖ កម្រិតខ្ពស់ (Advanced Lessons)
                  </h2>
                  <p className="font-khmer text-[11px] sm:text-xs md:text-sm text-rose-100/90 mt-0.5">
                    ការចរចាពាណិជ្ជកម្ម កិច្ចសន្យា ការវិភាគស្រាវជ្រាវ ការតស៊ូមតិ និងសំនួនវោហារជាន់ខ្ពស់
                  </p>
                </div>
              </div>

              {/* Progress & Status Pill */}
              <div className="flex items-center gap-2 self-start md:self-auto bg-black/20 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/10 shrink-0 font-khmer">
                <div className="text-right">
                  <div className="text-[10px] sm:text-[11px] text-rose-200 font-bold">
                    {advStats.percentage}%
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-white flex items-center gap-1 justify-end">
                    {advUnlocked ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
                        <span>បើកដំណើរការ (Unlocked)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                        <span>ត្រូវការបញ្ចប់ Level 2</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prerequisite banner if locked */}
          {!advUnlocked && (
            <div className="bg-amber-50 border-b border-amber-200 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center gap-2 text-xs text-amber-800 font-khmer">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
              <span className="text-[11px] sm:text-xs">
                <strong>កំណត់សម្គាល់ ៖</strong> កម្រិតខ្ពស់នេះនឹងបើកដំណើរការពេញលេញ នៅពេលអ្នករៀនចប់មេរៀន និងប្រឡងជាប់ Quiz កម្រិតទី ២ (Intermediate)។ អ្នកអាចមើលមុខវិជ្ជា និងសាកល្បងរៀនទុកជាមុនបាន!
              </span>
            </div>
          )}

          {/* Inside Card: Subject Modules Grid */}
          <div className="p-3 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-rose-100 font-khmer">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                  បញ្ជីមុខវិជ្ជា និងមេរៀនប្រចាំកម្រិតខ្ពស់ (Advanced Subject Modules)
                </h3>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {filteredAdvanced.length} មុខវិជ្ជា
              </span>
            </div>

            {filteredAdvanced.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-slate-400 font-khmer text-xs">
                មិនមានមេរៀនណាដែលត្រូវនឹងពាក្យស្វែងរក "{searchQuery}" ឡើយ
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4.5">
                {filteredAdvanced.map((lesson) =>
                  renderSubjectCard(lesson, {
                    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
                    borderClass: 'border-rose-200 hover:border-rose-500',
                    btnClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
                    quizBtnClass: 'border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800',
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. 12 ENGLISH TENSES COMPREHENSIVE VIP CARD (វេយ្យាករណ៍កាលទាំង ១២) */}
      {/* ========================================================================= */}
      {(activeCategory === 'tenses' || (Boolean(searchQuery) && filteredTenses.length > 0)) && (
        <div className="rounded-2xl sm:rounded-3xl border sm:border-2 border-indigo-200/90 bg-gradient-to-b from-indigo-50/40 via-white to-white shadow-xs overflow-hidden transition-all duration-300">
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-indigo-600 to-sky-600 text-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-3.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5 sm:mb-1">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-indigo-100">
                      GRAMMAR MASTERY
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-xs">
                      12 TENSES
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight font-khmer">
                    {t.tensesTitle}
                  </h2>
                  <p className="font-khmer text-[11px] sm:text-xs md:text-sm text-indigo-100 mt-0.5">
                    {t.tensesSubtitle}
                  </p>
                </div>
              </div>
              <span className="text-[11px] sm:text-xs text-indigo-100 font-khmer px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/15 border border-white/20 self-start md:self-auto">
                {filteredTenses.length} {isEn ? 'Full Tenses' : 'កាលពេញលេញ'}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-5 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4.5">
              {filteredTenses.map((tense) => {
                const catBadge =
                  tense.category === 'present'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : tense.category === 'past'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200';

                return (
                  <motion.div
                    key={tense.id}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.15 }}
                    className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4.5 lg:p-5 border border-indigo-100 hover:border-indigo-400 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Header: Number & Category */}
                      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center">
                          {tense.number}
                        </span>
                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catBadge}`}>
                          {tense.category}
                        </span>
                      </div>

                      {/* Tense Names */}
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base lg:text-lg mb-0.5">
                        {tense.tenseNameEn}
                      </h3>
                      <h4 className="font-khmer text-xs sm:text-sm font-medium text-blue-700 mb-2 sm:mb-3">
                        {tense.tenseNameKh}
                      </h4>

                      {/* Formula Pill Box */}
                      <div className="bg-slate-50 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200/80 mb-2.5 sm:mb-3">
                        <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5 sm:mb-1">
                          Formula (រូបមន្តស្រប):
                        </div>
                        <div className="font-mono text-[11px] sm:text-xs text-slate-800 font-bold break-words">
                          {tense.formulaPositive}
                        </div>
                      </div>

                      {/* Key Audio Example */}
                      {tense.examples[0] && (
                        <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-blue-50/50 border border-blue-100 text-xs mb-2.5 sm:mb-3">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-900 line-clamp-1 text-[11px] sm:text-xs">
                              "{tense.examples[0].en}"
                            </span>
                            <span className="font-khmer text-[10px] sm:text-[11px] text-slate-500 line-clamp-1">
                              {tense.examples[0].kh}
                            </span>
                          </div>
                          <button
                            onClick={() => handlePlayAudio(tense.examples[0].en)}
                            className="p-1 text-blue-600 hover:text-blue-800 cursor-pointer shrink-0"
                            title="Listen Pronunciation"
                          >
                            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Footer CTAs */}
                    <div className="pt-2.5 sm:pt-3 border-t border-slate-100 grid grid-cols-2 gap-1.5 sm:gap-2 font-khmer">
                      <button
                        onClick={() => setSelectedTense(tense)}
                        className="w-full inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>រៀនកាល</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onSelectTenseQuiz) {
                            onSelectTenseQuiz(tense.id);
                          } else {
                            onStartQuizForLesson(beginnerLessons[0]?.id || 'beg-1');
                          }
                        }}
                        className="w-full inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                        <span>តេស្តកាល</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. GRAMMAR FOUNDATIONS COMPREHENSIVE VIP CARD (វេយ្យាករណ៍គ្រឹះ) */}
      {/* ========================================================================= */}
      {(activeCategory === 'grammar' || (Boolean(searchQuery) && filteredGrammar.length > 0)) && (
        <div className="rounded-2xl sm:rounded-3xl border sm:border-2 border-purple-200/90 bg-gradient-to-b from-purple-50/20 via-white to-white shadow-sm overflow-hidden transition-all duration-300">
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-4 sm:p-5 lg:p-6">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-3.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0">
                  📚
                </div>
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5 sm:mb-1">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-purple-200">
                      GRAMMAR FOUNDATIONS
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-xs">
                      CORE RULES
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight font-khmer">
                    ក្បួនវេយ្យាករណ៍គ្រឹះសំខាន់ៗ (Grammar Foundations)
                  </h2>
                  <p className="font-khmer text-[11px] sm:text-xs md:text-sm text-purple-200/90 mt-0.5">
                    ថ្នាក់នៃពាក្យ (Parts of Speech) ធ្នាក់ កន្សោមប្រយោគ និងទម្រង់ប្រយោគសំខាន់ៗ
                  </p>
                </div>
              </div>
              <span className="text-[11px] sm:text-xs text-purple-200 font-khmer px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/10 self-start md:self-auto">
                {filteredGrammar.length} ក្បួនគ្រឹះ
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-5 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4.5">
              {filteredGrammar.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.15 }}
                  className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4.5 lg:p-5 border border-purple-100 hover:border-purple-400 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold bg-purple-100 text-purple-800 uppercase">
                        Grammar {item.number}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.level}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-0.5 sm:mb-1">
                      {item.titleEn}
                    </h3>
                    <h4 className="font-khmer text-xs sm:text-sm font-medium text-purple-800 mb-1.5 sm:mb-2">
                      {item.titleKh}
                    </h4>

                    <p className="font-khmer text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2.5 sm:mb-3">
                      {item.summaryKh}
                    </p>

                    {item.ruleFormula && (
                      <div className="bg-slate-900 text-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-mono font-semibold mb-2.5 sm:mb-3 break-words">
                        {item.ruleFormula}
                      </div>
                    )}

                    {/* Sample Example with Audio */}
                    {item.examples[0] && (
                      <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-purple-50/50 border border-purple-100 text-xs mb-2.5 sm:mb-3">
                        <div className="space-y-0.5 line-clamp-1">
                          <span className="font-semibold text-slate-900 text-[11px] sm:text-xs">"{item.examples[0].en}"</span>
                        </div>
                        <button
                          onClick={() => handlePlayAudio(item.examples[0].en)}
                          className="p-1 text-purple-600 hover:text-purple-800 cursor-pointer shrink-0"
                          title="Pronounce"
                        >
                          <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-2.5 sm:pt-3 border-t border-slate-100 font-khmer">
                    <button
                      onClick={() => setSelectedGrammar(item)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>មើលក្បួនវេយ្យាករណ៍</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: TENSE STUDY DETAIL STUDIO */}
      {selectedTense && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
            {/* Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-300 text-xs font-bold uppercase">
                    Tense #{selectedTense.number} • {selectedTense.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">{selectedTense.tenseNameEn}</h2>
                <p className="font-khmer text-sm text-blue-200">{selectedTense.tenseNameKh}</p>
              </div>
              <button
                onClick={() => setSelectedTense(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              {/* Formula Table */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Grammar Formulas (រូបមន្តកាលទាំង ៣ ទម្រង់)
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm font-mono">
                  <div className="p-2.5 bg-slate-800 rounded-xl flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">Positive (+):</span>
                    <span className="text-slate-100 font-bold">{selectedTense.formulaPositive}</span>
                  </div>
                  <div className="p-2.5 bg-slate-800 rounded-xl flex items-center justify-between">
                    <span className="text-rose-400 font-bold">Negative (-):</span>
                    <span className="text-slate-100 font-bold">{selectedTense.formulaNegative}</span>
                  </div>
                  <div className="p-2.5 bg-slate-800 rounded-xl flex items-center justify-between">
                    <span className="text-blue-400 font-bold">Question (?):</span>
                    <span className="text-slate-100 font-bold">{selectedTense.formulaQuestion}</span>
                  </div>
                </div>
              </div>

              {/* Khmer Explanation */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 font-khmer">
                  ការពន្យល់ និងរបៀបប្រើប្រាស់ (Khmer Explanation):
                </h4>
                <p className="font-khmer text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedTense.explanationKh}
                </p>
              </div>

              {/* Signal Words */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Signal Words / ពាក្យសម្គាល់កាល:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTense.signalWords.map((word, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium font-mono">
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Examples with Audio */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 font-khmer">
                  ឧទាហរណ៍ជាក់ស្តែង (Audio Examples):
                </div>
                {selectedTense.examples.map((ex, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-900">{ex.en}</div>
                      <div className="font-khmer text-xs text-slate-600">{ex.kh}</div>
                      {ex.note && (
                        <div className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block font-khmer">
                          {ex.note}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handlePlayAudio(ex.en)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Common Mistake Alert */}
              {selectedTense.commonMistake && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>កំហុសទូទៅដែលគួរជៀសវាង (Common Mistakes)</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="text-rose-700 font-medium">❌ ខុស: {selectedTense.commonMistake.wrong}</div>
                    <div className="text-emerald-800 font-bold">✅ ត្រូវ: {selectedTense.commonMistake.right}</div>
                    <div className="font-khmer text-slate-700 pt-1">
                      {selectedTense.commonMistake.explanationKh}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedTense(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Close (បិទ)
              </button>
              <button
                onClick={() => {
                  setSelectedTense(null);
                  if (onSelectTenseQuiz) {
                    onSelectTenseQuiz(selectedTense.id);
                  } else {
                    onStartQuizForLesson(beginnerLessons[0]?.id || 'beg-1');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Take Practice Quiz for this Tense</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GRAMMAR FOUNDATION DETAIL STUDIO */}
      {selectedGrammar && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-300 text-xs font-bold uppercase">
                  Grammar #{selectedGrammar.number} • {selectedGrammar.level}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold mt-1">{selectedGrammar.titleEn}</h2>
                <p className="font-khmer text-sm text-purple-200">{selectedGrammar.titleKh}</p>
              </div>
              <button
                onClick={() => setSelectedGrammar(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              {/* Summary */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <p className="font-khmer text-xs sm:text-sm text-purple-950 leading-relaxed font-medium">
                  {selectedGrammar.summaryKh}
                </p>
              </div>

              {/* Rule formula */}
              {selectedGrammar.ruleFormula && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                    Key Pattern / ទម្រង់ក្បួន:
                  </div>
                  <div className="font-mono text-sm sm:text-base text-purple-400 font-bold">
                    {selectedGrammar.ruleFormula}
                  </div>
                </div>
              )}

              {/* Key points */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 font-khmer">
                  ចំណុចសំខាន់ៗដែលត្រូវដឹង (Key Points):
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedGrammar.keyPoints.map((pt, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                      <div className="font-bold text-slate-900 text-xs">{pt.title}</div>
                      <div className="font-khmer text-xs text-slate-600 leading-relaxed">{pt.descriptionKh}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Examples */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 font-khmer">
                  ឧទាហរណ៍ជាក់ស្តែង (Practical Examples):
                </div>
                {selectedGrammar.examples.map((ex, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-900">{ex.en}</div>
                      <div className="font-khmer text-xs text-slate-600">{ex.kh}</div>
                      {ex.breakdown && (
                        <div className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded inline-block font-mono">
                          {ex.breakdown}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handlePlayAudio(ex.en)}
                      className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 cursor-pointer shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Common Mistakes */}
              {selectedGrammar.commonMistakeKh && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5 text-xs">
                  <div className="font-bold text-rose-900 uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>កំហុសទូទៅ (Common Mistake):</span>
                  </div>
                  <div className="text-rose-700 font-semibold">❌ {selectedGrammar.commonMistakeKh.wrong}</div>
                  <div className="text-emerald-800 font-bold">✅ {selectedGrammar.commonMistakeKh.right}</div>
                  <div className="font-khmer text-slate-700 pt-1 leading-relaxed">
                    {selectedGrammar.commonMistakeKh.reasonKh}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedGrammar(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
              >
                Close Guide (បិទ)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Interactive Lesson Detail Modal / Dedicated Fullscreen Study Studio */}
      {selectedLesson && (
        <ErrorBoundary fallbackTitle="Lesson Viewer Error" onReset={() => setSelectedLesson(null)}>
          <div className="fixed inset-0 z-50 bg-white w-screen h-screen overflow-y-auto flex flex-col animate-in fade-in duration-200">
            <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col pb-10">
              
              {/* Top Bar: Close (X) with confirmation, Horizontal Progress Bar, Counter, Translation Toggle Flag, Live Timer, Question ID */}
              <LearningHeader
                onClose={() => setShowExitConfirmation(true)}
                currentIndex={activeVocabIndex}
                totalCount={selectedLesson.vocabulary?.length || 0}
                userIdentifier={progress.userIdentifier}
                questionId="246635"
                initialSeconds={0}
                onStudyTimeTick={onStudyTimeTick}
                onTimerTick={onStudyTimeTick}
                title={selectedLesson.titleEn}
                streakDays={progress.streakDays}
                dailyGoalMinutes={progress.dailyGoalMinutes}
                minimalist={true}
                isEn={isEn}
                showKhmerTranslation={showKhmerTranslation}
                onToggleTranslation={() => setShowKhmerTranslation((prev) => !prev)}
              />

              {/* Horizontal Lesson Label Bar (Image 45: [មេរៀនទី ១] Greetings & Basic Introductions) - No category pills, single clean horizontal row */}
              <div 
                id="lesson-horizontal-badge-bar"
                className="px-4 sm:px-6 py-2.5 border-b border-slate-200/90 bg-slate-50/80 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span className="text-emerald-800 font-bold font-khmer px-2 py-0.5 rounded-md bg-emerald-100/70 border border-emerald-200">
                      [មេរៀនទី {toKhmerNumber(selectedLesson.order)}]
                    </span>
                    <span className="text-slate-900 font-sans font-bold">
                      {selectedLesson.titleEn}
                    </span>
                    {showKhmerTranslation && selectedLesson.titleKh && (
                      <span className="text-slate-500 font-khmer text-xs font-medium">
                        ({selectedLesson.titleKh})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Body: Active Tab Content (Based on Image 41) */}
              {activeModalTab === 'vocab' && (
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-start space-y-4 max-w-2xl mx-auto w-full">
                  {selectedLesson.vocabulary && selectedLesson.vocabulary[activeVocabIndex] && (() => {
                    const item = selectedLesson.vocabulary[activeVocabIndex];
                    const isSaved = progress.savedVocabIds.includes(item.id);
                    const isMastered = progress.masteredVocabIds.includes(item.id);

                    return (
                      <div className="w-full space-y-4 animate-in fade-in duration-200">
                        
                        {/* 1. Instruction with Audio Speaker Button (Image 41: '🔊 Listen and repeat.') */}
                        <div className="flex items-center justify-center gap-2 text-slate-700 py-1">
                          <button
                            type="button"
                            id="btn-lesson-instruction-speaker"
                            onClick={() => speakEnglish("Listen and repeat.", progress.speechRate)}
                            className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                            title="Listen to instruction / ស្តាប់ការណែនាំ"
                          >
                            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <span className="text-sm sm:text-base font-bold tracking-tight text-slate-800">
                            {showKhmerTranslation ? (isEn ? "Listen and repeat." : "ស្តាប់ ហើយនិយាយតាម (Listen and repeat)") : "Listen and repeat."}
                          </span>
                        </div>

                        {/* 2. Large clear English vocabulary with Khmer translation (Image 41: "hello (ជម្រាបសួរ)") */}
                        <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap text-center py-1">
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            {item.english}
                          </h2>
                          {showKhmerTranslation && item.khmerMeaning && (
                            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-700 font-khmer">
                              ({item.khmerMeaning})
                            </span>
                          )}
                          <button
                            type="button"
                            id="btn-lesson-word-speaker"
                            onClick={() => handlePlayAudio(item.english)}
                            className="p-2 sm:p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                            title="Listen to native pronunciation / ស្តាប់ការបញ្ចេញសំឡេង"
                          >
                            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>

                        {/* Phonetics Guide */}
                        <div className="flex items-center justify-center gap-2 font-mono text-xs sm:text-sm text-slate-500 pb-1">
                          <span>{item.phonetic}</span>
                          {showKhmerTranslation && item.khmerPhonetic && (
                            <span className="font-khmer text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-medium">
                              {item.khmerPhonetic}
                            </span>
                          )}
                        </div>

                        {/* 3. Centered Illustration Card: Rounded-corner image card (rounded-2xl max-h-60 object-contain shadow-sm) with subtle zoom icon at bottom-right */}
                        <div className="w-full flex justify-center py-1">
                          <IllustrationCard
                            topicId={item.topicId || selectedLesson.id}
                            englishWord={item.english}
                            khmerWord={showKhmerTranslation ? item.khmerMeaning : ''}
                            titleEn={selectedLesson.titleEn}
                            titleKh={showKhmerTranslation ? selectedLesson.titleKh : ''}
                            showPhoneticsBanner={false}
                          />
                        </div>

                        {/* Subtle Context / Example Sentence & Quick Actions */}
                        <div className="w-full max-w-lg mx-auto p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                          <div className="min-w-0 flex-1">
                            {item.exampleEn ? (
                              <div>
                                <p className="text-xs sm:text-sm font-semibold text-slate-800">{item.exampleEn}</p>
                                {showKhmerTranslation && item.exampleKh && (
                                  <p className="font-khmer text-xs text-slate-500 mt-0.5">{item.exampleKh}</p>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs font-semibold text-slate-500 font-khmer">
                                {showKhmerTranslation ? (isEn ? (item.partOfSpeech || 'Key Vocabulary') : (item.partOfSpeechKhmer || 'ពាក្យគន្លឹះក្នុងមេរៀន')) : (item.partOfSpeech || 'Key Vocabulary')}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.exampleEn && (
                              <button
                                type="button"
                                onClick={() => handlePlayAudio(item.exampleEn!)}
                                className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-white rounded-lg transition cursor-pointer"
                                title="Listen to example sentence"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onToggleSaveVocab(item.id)}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                isSaved
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-200'
                              }`}
                              title={isEn ? "Save for Later" : "រក្សាទុកពាក្យ"}
                            >
                              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggleMasterVocab(item.id)}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                isMastered
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-200'
                              }`}
                              title={isEn ? "Mark as Mastered" : "ចងចាំច្បាស់"}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Modal Body: Listening Tab */}
              {activeModalTab === 'listening' && (
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {isEn ? 'Listen & Repeat Audio Exercises' : 'ការអនុវត្តស្តាប់ និងបញ្ចេញសំឡេង (Listen & Repeat)'}
                      </h4>
                      <p className="font-khmer text-xs text-slate-600 mt-0.5">
                        {isEn
                          ? 'Listen carefully to native speaker audio at normal or slow speed, check Khmer phonetics, and practice speaking aloud.'
                          : 'ស្តាប់ការបញ្ចេញសំឡេងតាមល្បឿនធម្មតា ឬយឺតៗ រៀនតាមការប្រកបអក្សរខ្មែរ និងហាត់និយាយតាមឱ្យបានច្បាស់លាស់។'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(!selectedLesson.listeningExercises || selectedLesson.listeningExercises.length === 0) ? (
                      <div className="text-center py-8 text-slate-400 font-khmer text-sm">
                        មិនទាន់មានលំហាត់ស្តាប់បន្ថែមសម្រាប់មេរៀននេះនៅឡើយទេ
                      </div>
                    ) : (
                      selectedLesson.listeningExercises.map((ex, idx) => (
                        <div
                          key={ex.id || idx}
                          className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-5 shadow-xs transition space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                              Exercise {idx + 1}: {ex.titleEn}
                            </span>
                            <span className="text-xs font-khmer text-slate-500 font-medium">
                              {ex.titleKh}
                            </span>
                          </div>

                          {/* Audio phrase text */}
                          <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            "{ex.audioText}"
                          </div>

                          {/* Phonetics & Khmer pronunciation */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                            <span className="font-mono text-indigo-800 bg-indigo-50/70 border border-indigo-100 px-2.5 py-1 rounded-lg font-medium">
                              {ex.phonetic}
                            </span>
                            <span className="font-khmer text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                              🗣️ សំឡេងអាន៖ {ex.khmerPhonetic}
                            </span>
                          </div>

                          {/* Khmer Meaning */}
                          <div className="text-xs sm:text-sm font-khmer text-emerald-800 font-semibold bg-emerald-50/70 border border-emerald-200/60 p-2.5 rounded-xl">
                            🇰🇭 អត្ថន័យ៖ {ex.khmerMeaning}
                          </div>

                          {/* Pronunciation Tip */}
                          {ex.tipKh && (
                            <div className="flex items-start gap-2 text-xs font-khmer text-amber-900 bg-amber-50/80 border border-amber-200/70 p-2.5 rounded-xl">
                              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <span>គន្លឹះបញ្ចេញសំឡេង៖ {ex.tipKh}</span>
                            </div>
                          )}

                          {/* Action Buttons: Standard Audio, Slow Audio, Speak Practice with Play/Stop Toggle */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleToggleAudio(`ex-normal-${ex.id}`, ex.audioText, 1.0)}
                              className={`px-3 py-2 rounded-xl text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                                playingAudioId === `ex-normal-${ex.id}`
                                  ? 'bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-300 animate-pulse'
                                  : 'bg-indigo-600 hover:bg-indigo-700'
                              }`}
                              title={playingAudioId === `ex-normal-${ex.id}` ? 'Stop playback / បញ្ឈប់' : 'Listen standard speed / ស្តាប់ធម្មតា'}
                            >
                              {playingAudioId === `ex-normal-${ex.id}` ? (
                                <>
                                  <Square className="w-4 h-4 fill-current" />
                                  <span>បញ្ឈប់ (Stop)</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-4 h-4" />
                                  <span>ស្តាប់ធម្មតា (1.0x)</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleAudio(`ex-slow-${ex.id}`, ex.audioText, 0.75)}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                                playingAudioId === `ex-slow-${ex.id}`
                                  ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-300 animate-pulse border-rose-600'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                              }`}
                              title={playingAudioId === `ex-slow-${ex.id}` ? 'Stop playback / បញ្ឈប់' : 'Listen slow speed / ស្តាប់មួយៗ'}
                            >
                              {playingAudioId === `ex-slow-${ex.id}` ? (
                                <>
                                  <Square className="w-4 h-4 fill-current" />
                                  <span>បញ្ឈប់ (Stop)</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-4 h-4 text-indigo-600" />
                                  <span>ស្តាប់មួយៗ (0.75x)</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSpeechFeedback(prev => ({ ...prev, [ex.id]: 'speaking' }));
                                speakEnglish(ex.audioText, 0.9);
                                setTimeout(() => {
                                  setSpeechFeedback(prev => ({ ...prev, [ex.id]: 'success' }));
                                }, 1800);
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                                speechFeedback[ex.id] === 'success'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : speechFeedback[ex.id] === 'speaking'
                                  ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              <Mic className="w-4 h-4 text-rose-500" />
                              <span>
                                {speechFeedback[ex.id] === 'success'
                                  ? '✅ បញ្ចេញសំឡេងបានល្អ!'
                                  : speechFeedback[ex.id] === 'speaking'
                                  ? 'កំពុងស្តាប់ & ហាត់និយាយ...'
                                  : 'ហាត់និយាយតាម (Speak & Check)'}
                              </span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Modal Body: Reading Tab */}
              {activeModalTab === 'reading' && (
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
                  {(!selectedLesson.reading) ? (
                    <div className="text-center py-8 text-slate-400 font-khmer text-sm">
                      មិនទាន់មានអត្ថបទអានសម្រាប់មេរៀននេះនៅឡើយទេ
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Reading Passage Card */}
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                        {/* Header */}
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-1">
                              <BookOpen className="w-4 h-4" />
                              <span>Reading Comprehension Passage</span>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">
                              {selectedLesson.reading.titleEn}
                            </h3>
                            <p className="font-khmer text-xs sm:text-sm text-slate-600 mt-0.5">
                              {selectedLesson.reading.titleKh}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleAudio('reading-passage-all', selectedLesson.reading!.textEn, 0.95)}
                              className={`px-3 py-2 rounded-xl text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                                playingAudioId === 'reading-passage-all'
                                  ? 'bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-300 animate-pulse'
                                  : 'bg-emerald-600 hover:bg-emerald-700'
                              }`}
                              title={playingAudioId === 'reading-passage-all' ? 'Stop audio / បញ្ឈប់' : 'Listen to passage / ស្តាប់អត្ថបទទាំងមូល'}
                            >
                              {playingAudioId === 'reading-passage-all' ? (
                                <>
                                  <Square className="w-4 h-4 fill-current" />
                                  <span>បញ្ឈប់ (Stop)</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-4 h-4" />
                                  <span>ស្តាប់អត្ថបទទាំងមូល</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => setShowKhmerReading(!showKhmerReading)}
                              className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                showKhmerReading
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              <Languages className="w-4 h-4 text-emerald-600" />
                              <span>{showKhmerReading ? 'លាក់ការបកប្រែ' : 'បង្ហាញការបកប្រែខ្មែរ'}</span>
                            </button>
                          </div>
                        </div>

                        {/* English Passage */}
                        <div className="p-5 sm:p-6 text-sm sm:text-base leading-relaxed text-slate-800 font-serif">
                          {selectedLesson.reading.textEn}
                        </div>

                        {/* Khmer Translation (Collapsible) */}
                        {showKhmerReading && (
                          <div className="p-5 sm:p-6 bg-slate-50/90 border-t border-slate-100 text-xs sm:text-sm leading-relaxed text-slate-700 font-khmer">
                            <div className="font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
                              <span>🇰🇭 ការបកប្រែជាភាសាខ្មែរ៖</span>
                            </div>
                            {selectedLesson.reading.textKh}
                          </div>
                        )}
                      </div>

                      {/* Comprehension Questions */}
                      {selectedLesson.reading.comprehensionQuestions && selectedLesson.reading.comprehensionQuestions.length > 0 && (
                        <div className="space-y-4 pt-2">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>សំណួរវាស់ការយល់ដឹង (Comprehension Questions)</span>
                          </h4>

                          {selectedLesson.reading.comprehensionQuestions.map((q, qIdx) => {
                            const selectedOptId = comprehensionAnswers[q.id];
                            const isAnswered = Boolean(selectedOptId);
                            const isCorrect = selectedOptId === q.correctOptionId;

                            return (
                              <div
                                key={q.id}
                                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1">
                                      Question {qIdx + 1}
                                    </span>
                                    <div className="text-sm sm:text-base font-bold text-slate-900">
                                      {q.questionEn}
                                    </div>
                                    <div className="text-xs sm:text-sm font-khmer text-slate-500 mt-0.5">
                                      {q.questionKh}
                                    </div>
                                  </div>
                                </div>

                                {/* Options */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                  {q.options.map((opt) => {
                                    const isThisSelected = selectedOptId === opt.id;
                                    const isThisCorrect = opt.id === q.correctOptionId;
                                    let btnStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';
                                    if (isAnswered) {
                                      if (isThisCorrect) {
                                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20';
                                      } else if (isThisSelected) {
                                        btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                                      } else {
                                        btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                                      }
                                    } else if (isThisSelected) {
                                      btnStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900';
                                    }

                                    return (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        disabled={isAnswered}
                                        onClick={() => {
                                          setComprehensionAnswers(prev => ({ ...prev, [q.id]: opt.id }));
                                          if (isThisCorrect) {
                                            playFanfareSound();
                                          }
                                        }}
                                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-center cursor-pointer ${btnStyle}`}
                                      >
                                        <span className="text-xs sm:text-sm font-semibold">{opt.text}</span>
                                        {opt.subtext && (
                                          <span className="text-[11px] font-khmer text-slate-500 mt-0.5">{opt.subtext}</span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Explanation feedback */}
                                {isAnswered && (
                                  <div className={`p-3 rounded-xl text-xs font-khmer space-y-1 ${
                                    isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'
                                  }`}>
                                    <div className="font-bold">
                                      {isCorrect ? '✅ ត្រឹមត្រូវ! (Correct!)' : '❌ មិនទាន់ត្រឹមត្រូវទេ (Incorrect)'}
                                    </div>
                                    <div>{q.explanationKh}</div>
                                    <div className="font-serif italic text-slate-600">{q.explanationEn}</div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Modal Body: Dialogue Tab */}
              {activeModalTab === 'dialogue' && selectedLesson.dialogue && (
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="font-khmer text-xs text-slate-500">
                      {isEn ? "Click each sentence to listen to audio, or click 'Listen All':" : 'ចុចលើប្រយោគនីមួយៗដើម្បីស្តាប់សំឡេង ឬចុចប៊ូតុង "ស្តាប់ទាំងអស់"'}
                    </div>
                    <button
                      onClick={() => handlePlayAllDialogue(selectedLesson)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isEn ? "Listen All Dialogue" : "ស្តាប់ការសន្ទនាទាំងអស់"}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedLesson.dialogue.map((line, idx) => (
                      <div
                        key={idx}
                        onClick={() => handlePlayAudio(line.english)}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                          playingDialogueIndex === idx
                            ? 'border-indigo-500 bg-indigo-50/70 shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-indigo-700 font-mono">
                            {line.speaker}:
                          </span>
                          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{line.english}</p>
                        <p className="font-khmer text-xs text-slate-500 mt-1">{line.khmer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Body: Grammar Tab */}
              {activeModalTab === 'grammar' && selectedLesson.grammar && (
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
                    <h4 className="font-bold text-emerald-950 text-base">
                      {selectedLesson.grammar.titleEn || selectedLesson.grammar.titleKh || 'Grammar Point'}
                    </h4>
                    <p className="font-khmer text-xs sm:text-sm text-emerald-900 leading-relaxed">
                      {selectedLesson.grammar.explanationKh}
                    </p>
                  </div>

                  {selectedLesson.grammar.formula && (
                    <div className="bg-slate-900 text-white rounded-2xl p-4">
                      <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        {t.formula}:
                      </div>
                      <div className="font-mono text-sm sm:text-base text-emerald-400 font-bold">
                        {selectedLesson.grammar.formula}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-khmer">
                      {isEn ? "Practical Examples" : "ឧទាហរណ៍ជាក់ស្តែង (Practical Examples)"}
                    </h4>
                    {selectedLesson.grammar.examples && selectedLesson.grammar.examples.map((ex, i) => (
                      <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                          <span>{ex.en}</span>
                          <button
                            onClick={() => handlePlayAudio(ex.en)}
                            className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="font-khmer text-xs text-slate-600">{ex.kh}</div>
                        {ex.tip && (
                          <div className="text-[11px] font-khmer text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                            {isEn ? `Tip: ${ex.tip}` : `គន្លឹះ៖ ${ex.tip}`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FOOTER NAVIGATION (Based on Image 41): Simple bottom bar featuring '‹ បកក្រោយ' (Back) and primary-colored 'បន្ទាប់ ›' (Next) button without extra skip/shortcut buttons */}
              <div 
                id="lesson-exercise-footer"
                className="px-4 sm:px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-4 mt-auto shadow-2xs"
              >
                {/* Left: '‹ បកក្រោយ' (Back) */}
                <button
                  type="button"
                  id="btn-lesson-nav-back"
                  disabled={activeVocabIndex === 0}
                  onClick={() => setActiveVocabIndex((prev) => Math.max(0, prev - 1))}
                  className={`px-5 sm:px-6 py-2.5 rounded-xl border text-xs sm:text-sm font-bold font-khmer transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeVocabIndex === 0
                      ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                      : 'border-slate-300 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs'
                  }`}
                >
                  <span>{isEn ? '‹ Back' : '‹ បកក្រោយ'}</span>
                </button>

                {/* Right: Primary-colored 'បន្ទាប់ ›' (Next) */}
                {activeVocabIndex < (selectedLesson.vocabulary?.length || 1) - 1 ? (
                  <button
                    type="button"
                    id="btn-lesson-nav-next"
                    onClick={() => setActiveVocabIndex((prev) => prev + 1)}
                    className="px-6 sm:px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm font-khmer shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{isEn ? 'Next ›' : 'បន្ទាប់ ›'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="btn-lesson-nav-finish"
                    onClick={() => {
                      const finishedLessonId = selectedLesson.id;
                      onCompleteLesson(finishedLessonId, selectedLesson.xpReward);
                      playFanfareSound();
                      setSelectedLesson(null);
                      // Seamless Flow: Completing a "Listen & Repeat" lesson immediately unlocks/launches the corresponding Unit Quiz
                      onStartQuizForLesson(finishedLessonId);
                    }}
                    className="px-6 sm:px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm font-khmer shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{isEn ? 'Complete & Start Quiz ›' : 'បញ្ចប់ និងចាប់ផ្ដើម Quiz ›'}</span>
                  </button>
                )}
              </div>

            </div>

            <ExitConfirmationModal
              isOpen={showExitConfirmation}
              isEn={isEn}
              appLanguage={progress.appLanguage}
              onConfirm={() => {
                setSelectedLesson(null);
                setShowExitConfirmation(false);
              }}
              onCancel={() => setShowExitConfirmation(false)}
            />
          </div>
        </ErrorBoundary>
      )}

      {/* Level Lessons & Quiz Selection Modal (Requirement 4) */}
      {selectedLevelForModal && (
        <LevelLessonSelectModal
          isOpen={selectedLevelForModal !== null}
          level={selectedLevelForModal}
          progress={progress}
          onClose={() => setSelectedLevelForModal(null)}
          onSelectLesson={(lesson) => {
            setSelectedLevelForModal(null);
            handleOpenLesson(lesson);
          }}
          onStartQuizForLesson={(lessonId) => {
            setSelectedLevelForModal(null);
            onStartQuizForLesson(lessonId);
          }}
        />
      )}

      {/* Polite Locked Level Modal */}
      {lockedModalLevel && (
        <LockedLevelModal
          isOpen={Boolean(lockedModalLevel)}
          level={lockedModalLevel}
          appLanguage={progress.appLanguage}
          onClose={() => setLockedModalLevel(null)}
          onGoToPrerequisite={(prereq) => {
            setLockedModalLevel(null);
            setExpandedLevels((prev) => ({
              ...prev,
              [prereq]: true,
            }));
            setSelectedLevelForModal(prereq);
          }}
        />
      )}

    </div>
  );
};

