import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Timer, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  Sparkles, 
  GraduationCap, 
  Award, 
  Lock, 
  Unlock, 
  Check, 
  X,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  SkipForward,
  Headphones,
  Play,
  Square,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { DifficultyLevel, UserProgress } from '../types';
import { 
  PLACEMENT_TEST_QUESTIONS, 
  PLACEMENT_TEST_DURATION_SECONDS, 
  calculateAssignedLevel, 
  CefrLevel 
} from '../data/placementTestData';
import { speakEnglish, playCorrectSound, playFanfareSound } from '../utils/audio';

interface PlacementTestModalProps {
  isOpen: boolean;
  progress?: UserProgress;
  userProgress?: UserProgress;
  onClose?: () => void;
  onComplete: (assignedLevel: DifficultyLevel, unlockedLevels: DifficultyLevel[], scorePercent: number, openCertificate?: boolean) => void;
  onBypassDev?: () => void;
}

export const PlacementTestModal: React.FC<PlacementTestModalProps> = ({
  isOpen,
  progress,
  userProgress: userProgressProp,
  onClose,
  onComplete,
  onBypassDev,
}) => {
  const activeUser = progress || userProgressProp;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState<boolean>(false);
  const [skippedQuestions, setSkippedQuestions] = useState<Record<string, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.9);
  const [playCount, setPlayCount] = useState<Record<string, number>>({});
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questions = PLACEMENT_TEST_QUESTIONS;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const isEn = activeUser?.appLanguage === 'en';

  const isDev = activeUser?.role === 'Developer' || 
                (activeUser?.userIdentifier && activeUser.userIdentifier.toLowerCase() === 'phonphaihdvk@gmail.com') ||
                (activeUser?.email && activeUser.email.toLowerCase() === 'phonphaihdvk@gmail.com');

  // Cancel any active speech when switching questions
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [currentIndex]);

  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const handleAgreeStartBeginner = () => {
    setShowExitConfirm(false);
    onComplete('beginner', ['beginner'], 0);
  };

  const handleDismissExitModal = () => {
    setShowExitConfirm(false);
  };

  // Start Count-Up Stopwatch (ALWAYS starting from 00:00 without cap or time limits)
  useEffect(() => {
    if (!isOpen || isSubmitted) return;

    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isSubmitted]);

  // Format stopwatch MM:SS (or HH:MM:SS if >= 1 hour)
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).filter((k) => !!selectedAnswers[k]).length;
  const skippedCount = Object.keys(skippedQuestions).filter((k) => skippedQuestions[k]).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Sound pronunciation helper for general text
  const handlePronounce = async (text: string) => {
    if (isSpeaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    await speakEnglish(text, activeUser?.speechRate || audioSpeed);
    setIsSpeaking(false);
  };

  // Dedicated Play Audio for Listening questions
  const handlePlayAudio = async (text: string) => {
    if (isSpeaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    setPlayCount((prev) => ({
      ...prev,
      [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1,
    }));
    await speakEnglish(text, audioSpeed);
    setIsSpeaking(false);
  };

  // Select Option (Supports toggle deselect to unselect and return card to default state)
  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => {
      if (prev[currentQuestion.id] === optionId) {
        // Toggle deselect: remove answer and revert to unselected state
        const updated = { ...prev };
        delete updated[currentQuestion.id];
        return updated;
      }
      return {
        ...prev,
        [currentQuestion.id]: optionId,
      };
    });
  };

  // Skip Question Handler
  const handleSkipQuestion = () => {
    setSkippedQuestions((prev) => ({ ...prev, [currentQuestion.id]: true }));
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowConfirmSubmit(true);
    }
  };

  // Submit test and evaluate
  const handleSubmitTest = () => {
    setShowConfirmSubmit(false);
    setIsSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    playFanfareSound();
  };

  // Calculate score and evaluation
  const evaluation = useMemo(() => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correct++;
      }
    });
    return calculateAssignedLevel(correct, totalQuestions);
  }, [questions, selectedAnswers, totalQuestions]);

  const correctCount = useMemo(() => {
    return questions.filter((q) => selectedAnswers[q.id] === q.correctOptionId).length;
  }, [questions, selectedAnswers]);

  if (!isOpen) return null;

  // CEFR Badge Color Mapping
  const getCefrBadgeStyle = (cefr: CefrLevel) => {
    switch (cefr) {
      case 'A1':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'A2':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'B1':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'B2':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'C1':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div 
      id="placement-test-modal"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto overscroll-y-contain"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden my-auto max-h-[95dvh]">
        
        {/* ========================================================
            VIEW A: RESULT & LEVEL ASSIGNMENT SCREEN
           ======================================================== */}
        {isSubmitted ? (
          <div className="p-5 sm:p-8 flex flex-col items-center text-center overflow-y-auto">
            {/* Celebration Icon Header */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xl shadow-indigo-500/25 mb-4 animate-bounce">
              <Award className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-indigo-600 font-khmer bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              លទ្ធផលតេស្តវាស់ស្ទង់សមត្ថភាព (Placement Test Result)
            </span>

            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 font-khmer">
              អ្នកត្រូវបានចាត់ថ្នាក់ក្នុង {evaluation.levelTitleKh}
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              Assigned Level: {evaluation.levelTitleEn} • CEFR: {evaluation.cefrEquiv}
            </p>

            {/* Score Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg mt-5">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col items-center">
                <span className="text-xs text-indigo-700 font-khmer font-medium">ពិន្ទុសរុប (Score)</span>
                <span className="text-2xl sm:text-3xl font-black text-indigo-700">{evaluation.scorePercent}%</span>
                <span className="text-[11px] text-slate-500">{correctCount} / {totalQuestions} ត្រូវ</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex flex-col items-center">
                <span className="text-xs text-purple-700 font-khmer font-medium">កម្រិត CEFR</span>
                <span className="text-2xl sm:text-3xl font-black text-purple-700">{evaluation.cefrEquiv}</span>
                <span className="text-[11px] text-slate-500 font-khmer">សមត្ថភាពជាក់ស្តែង</span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col items-center">
                <span className="text-xs text-emerald-700 font-khmer font-medium">ស្ថានភាពដោះសោ</span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-700 font-khmer mt-1">
                  ដោះសោជោគជ័យ
                </span>
                <span className="text-[11px] text-slate-500 font-khmer">តាមកម្រិតពិន្ទុ</span>
              </div>
            </div>

            {/* Level Unlock Status Breakdown */}
            <div className="w-full max-w-lg mt-5 bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider font-khmer mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                ស្ថានភាពការដោះសោរសិក្សា (Level Unlock Status)
              </h4>
              <div className="space-y-2">
                {/* Level 1: Beginner */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-800">កម្រិតដំបូង (Beginner)</span>
                      <span className="block text-[10px] text-slate-500">A1 - A2 Elementary</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <Unlock className="w-3.5 h-3.5" /> បានដោះសោ (Unlocked)
                  </span>
                </div>

                {/* Level 2: Intermediate */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-800">កម្រិតមធ្យម (Intermediate)</span>
                      <span className="block text-[10px] text-slate-500">B1 - B2 Intermediate</span>
                    </div>
                  </div>
                  {evaluation.unlockedLevels.includes('intermediate') ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <Unlock className="w-3.5 h-3.5" /> បានដោះសោ (Unlocked)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <Lock className="w-3.5 h-3.5" /> ចាក់សោ (Locked)
                    </span>
                  )}
                </div>

                {/* Level 3: Advanced */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-800">កម្រិតខ្ពស់ (Advanced)</span>
                      <span className="block text-[10px] text-slate-500">C1 Proficiency</span>
                    </div>
                  </div>
                  {evaluation.unlockedLevels.includes('advanced') ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <Unlock className="w-3.5 h-3.5" /> បានដោះសោ (Unlocked)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <Lock className="w-3.5 h-3.5" /> ចាក់សោ (Locked)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description advice */}
            <p className="text-xs sm:text-sm text-slate-600 font-khmer mt-4 max-w-lg leading-relaxed">
              {evaluation.descriptionKh}
            </p>

            {/* Action Buttons: Start Learning or View CEFR Certificate */}
            <div className="mt-6 w-full max-w-md space-y-2.5">
              <button
                type="button"
                id="btn-claim-placement-certificate"
                onClick={() => onComplete(evaluation.assignedLevel, evaluation.unlockedLevels, evaluation.scorePercent, true)}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-khmer font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Award className="w-5 h-5 text-amber-300 shrink-0" />
                <span>🎓 មើល និងទាញយកវិញ្ញាបនបត្រ CEFR (View CEFR Certificate)</span>
              </button>

              <button
                type="button"
                id="btn-start-learning-after-placement"
                onClick={() => onComplete(evaluation.assignedLevel, evaluation.unlockedLevels, evaluation.scorePercent, false)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-khmer font-bold text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.99]"
              >
                <span>ចាប់ផ្តើមរៀនឥឡូវនេះ (Start Learning Now)</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
             VIEW B: ACTIVE TEST TAKING VIEW
             ======================================================== */
          <>
            {/* Header with Title & Countdown Timer */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-3.5 sm:p-5 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-khmer leading-tight">
                    តេស្តវាស់ស្ទង់សមត្ថភាព (Placement Test)
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    កំណត់កម្រិតសិក្សា (Beginner, Intermediate, Advanced)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Developer Bypass Button */}
                {isDev && onBypassDev && (
                  <button
                    type="button"
                    onClick={onBypassDev}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-400 text-amber-950 text-xs font-bold hover:bg-amber-300 transition-all cursor-pointer shadow-xs"
                    title="រំលងការធ្វើតេស្តសម្រាប់ Developer"
                  >
                    <span>⚡ Bypass (Dev)</span>
                  </button>
                )}

                {/* Live Count-Up Stopwatch (No time limits, starts from 00:00) */}
                <div 
                  id="placement-test-timer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs font-mono text-sm sm:text-base font-black tracking-tight"
                  title="នាឡិការាប់ម៉ោងធ្វើតេស្តជាក់ស្តែង (Elapsed Test Stopwatch)"
                >
                  <Clock className="w-4 h-4 shrink-0 text-indigo-600" />
                  <span className="text-indigo-900 font-bold select-none">{formatTime(elapsedSeconds)}</span>
                </div>

                {/* Exit / Close (X) button with Smart Confirmation Modal */}
                <button
                  id="btn-placement-test-exit"
                  type="button"
                  onClick={handleExitClick}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 flex items-center justify-center text-white hover:text-rose-200 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                  aria-label="Exit Placement Test"
                  title={isEn ? "Exit Placement Test" : "ចាកចេញពីការធ្វើតេស្ត"}
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar & Question Step Indicator */}
            <div className="bg-slate-50 border-b border-slate-200/80 px-3 sm:px-6 py-2.5 flex flex-col gap-1.5 shrink-0">
              <div className="flex items-center justify-between text-xs text-slate-600 font-khmer">
                <span className="font-bold text-indigo-700 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getCefrBadgeStyle(currentQuestion.cefr)}`}>
                    CEFR {currentQuestion.cefr}
                  </span>
                  សំណួរទី {currentIndex + 1} នៃ {totalQuestions}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  ឆ្លើយបាន: <strong className="text-emerald-700">{answeredCount}</strong>/{totalQuestions}
                  {skippedCount > 0 && (
                    <span className="ml-1.5 text-rose-600 font-semibold">(រំលង: {skippedCount})</span>
                  )}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Horizontal Question Ribbon Navigation */}
              <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
                {questions.map((q, idx) => {
                  const ans = selectedAnswers[q.id];
                  const isSkipped = ans === '__SKIPPED__';
                  const isAnswered = Boolean(ans && !isSkipped);
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`min-w-6 h-6 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center shrink-0 relative ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow-xs scale-110 ring-2 ring-indigo-300'
                          : isSkipped
                          ? 'bg-rose-100 text-rose-700 border border-rose-300'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
                      }`}
                      title={`សំណួរទី ${idx + 1} (${q.cefr})${q.isListening ? ' [Listen & Answer]' : q.isReading ? ' [Reading]' : ''}${isSkipped ? ' - បានរំលង (Skipped)' : isAnswered ? ' - បានឆ្លើយ (Answered)' : ''}`}
                    >
                      {q.isListening && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 border border-white" />
                      )}
                      {q.isReading && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                      )}
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Body (Multiple Choice UI - Requirement 3) */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              
              {/* Question Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/90 shadow-xs">
                {currentQuestion.isListening && (
                  <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold font-khmer">
                    <Headphones className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                    <span>{isEn ? 'Listening Question (Listen & Answer)' : 'សំណួរផ្នែកស្តាប់ និងឆ្លើយ (Listen & Answer)'}</span>
                  </div>
                )}

                {currentQuestion.isReading && (
                  <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold font-khmer">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isEn ? 'Reading Comprehension (Read & Answer)' : 'សំណួរផ្នែកអានស្វែងយល់ (Reading Comprehension)'}</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {currentQuestion.promptEn}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 font-khmer leading-relaxed">
                      {currentQuestion.promptKh}
                    </p>
                  </div>
                  {!currentQuestion.isListening && currentQuestion.audioText && (
                    <button
                      type="button"
                      onClick={() => handlePronounce(currentQuestion.audioText!)}
                      disabled={isSpeaking}
                      className="p-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
                      title="ស្តាប់ការបញ្ចេញសំឡេង (Listen Audio)"
                    >
                      <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce text-indigo-700' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Dedicated Reading Passage Box for Reading Questions */}
                {currentQuestion.isReading && currentQuestion.readingPassage && (
                  <div className="mt-3.5 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-amber-200/70 text-amber-900 flex items-center justify-center text-sm shadow-2xs">
                          📖
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-amber-950 font-serif">
                            {currentQuestion.readingPassage.titleEn}
                          </h4>
                          {currentQuestion.readingPassage.titleKh && (
                            <p className="text-[11px] text-amber-800 font-khmer">
                              {currentQuestion.readingPassage.titleKh}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Listen to Passage audio button */}
                      <button
                        type="button"
                        onClick={() => handlePronounce(currentQuestion.readingPassage!.textEn)}
                        disabled={isSpeaking}
                        className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/70 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                        title={isEn ? "Listen to Reading Passage" : "ស្តាប់ការអានអត្ថបទ"}
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-amber-700' : 'text-amber-600'}`} />
                        <span className="hidden sm:inline">{isEn ? 'Listen Passage' : 'ស្តាប់អត្ថបទ'}</span>
                      </button>
                    </div>

                    {/* Passage English text */}
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif bg-white/95 p-3.5 sm:p-4 rounded-xl border border-amber-200/60 shadow-2xs">
                      {currentQuestion.readingPassage.textEn}
                    </div>

                    {/* Khmer Translation Accordion / Helper */}
                    {currentQuestion.readingPassage.textKh && (
                      <details className="group text-xs">
                        <summary className="cursor-pointer font-khmer text-amber-800 font-semibold hover:text-amber-950 select-none flex items-center gap-1.5 pt-0.5">
                          <span className="underline underline-offset-2">🔍 ចុចទីនេះដើម្បីមើលអត្ថបទបកប្រែជាភាសាខ្មែរ (Khmer Translation)</span>
                        </summary>
                        <p className="mt-2 p-3 rounded-xl bg-white/70 border border-amber-200/50 text-slate-700 font-khmer leading-relaxed">
                          {currentQuestion.readingPassage.textKh}
                        </p>
                      </details>
                    )}
                  </div>
                )}

                {/* Dedicated Inline Audio Player for Listening Questions */}
                {currentQuestion.isListening && (
                  <div className="mt-3.5 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-400/30 shadow-md">
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center">
                          <Headphones className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-indigo-200 block font-khmer">
                            {isEn ? 'Audio Player (Listen carefully)' : 'ឧបករណ៍ចាក់សំឡេង (ស្តាប់ដោយយកចិត្តទុកដាក់)'}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-khmer">
                            {isEn ? 'Listen to the audio and select the best answer below' : 'ចុចស្តាប់សំឡេង រួចជ្រើសរើសចម្លើយត្រឹមត្រូវខាងក្រោម'}
                          </span>
                        </div>
                      </div>

                      {/* Speech Rate Toggle */}
                      <button
                        type="button"
                        onClick={() => setAudioSpeed((prev) => (prev <= 0.8 ? 0.9 : 0.75))}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                        title={isEn ? "Toggle Audio Speed" : "ប្តូរល្បឿនសំឡេង"}
                      >
                        <span>{audioSpeed <= 0.8 ? '0.75x (យឺត)' : '0.9x (ធម្មតា)'}</span>
                      </button>
                    </div>

                    {/* Audio Player Controls */}
                    <div className="pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(currentQuestion.listeningScript || currentQuestion.audioText || currentQuestion.promptEn)}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 shrink-0 ${
                            isSpeaking
                              ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 ring-4 ring-amber-400/30 animate-pulse'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white ring-4 ring-indigo-500/25'
                          }`}
                          title={isSpeaking ? 'បញ្ឈប់សំឡេង (Stop)' : 'ចាក់សំឡេង (Play)'}
                        >
                          {isSpeaking ? (
                            <Square className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white font-khmer">
                              {isSpeaking 
                                ? (isEn ? 'Playing audio...' : 'កំពុងចាក់សំឡេង...') 
                                : (isEn ? 'Press Play to Listen' : 'ចុច Play ដើម្បីស្តាប់')}
                            </span>
                            {(playCount[currentQuestion.id] || 0) > 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-indigo-200 font-mono">
                                ស្តាប់: {playCount[currentQuestion.id]}x
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-khmer">
                            {isSpeaking
                              ? (isEn ? 'Listening in progress...' : 'កំពុងចាក់សំឡេង... សូមស្តាប់')
                              : (isEn ? 'You can replay as many times as needed' : 'អ្នកអាចចាក់ស្តាប់ឡើងវិញបានច្រើនដងតាមចិត្ត')}
                          </p>
                        </div>
                      </div>

                      {/* Equalizer Waveform animation */}
                      <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 w-full sm:w-auto justify-center">
                        {[35, 65, 90, 55, 80, 45, 95, 70, 40, 75].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-200 ${
                              isSpeaking 
                                ? 'bg-gradient-to-t from-indigo-400 to-amber-300 animate-pulse' 
                                : 'bg-white/25'
                            }`}
                            style={{
                              height: isSpeaking ? `${Math.max(10, Math.min(24, h * 0.25))}px` : '8px',
                              animationDelay: `${i * 65}ms`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Context Sentence Preview if available */}
                {currentQuestion.contextSentence && !currentQuestion.isListening && !currentQuestion.isReading && (
                  <div className="mt-3 p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-sm text-indigo-950">
                    "{currentQuestion.contextSentence}"
                  </div>
                )}
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectOption(option.id)}
                      className={`w-full p-3.5 sm:p-4 rounded-xl text-left border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 shadow-md shadow-indigo-100'
                          : 'border-slate-200 hover:border-indigo-200 bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected 
                            ? 'border-indigo-600 bg-indigo-600 text-white' 
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <span className="text-sm sm:text-base font-bold text-slate-900 block">
                            {option.textEn}
                          </span>
                          {option.textKh && (
                            <span className="text-xs text-slate-500 font-khmer block mt-0.5">
                              {option.textKh}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dedicated Subtle Soft Red Skip Question Area (Requirement 1) */}
              <div className="pt-2 border-t border-slate-100">
                <div className="p-3 sm:p-3.5 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 shadow-2xs">
                  <div className="flex items-start sm:items-center gap-2.5 text-red-900 text-xs flex-1">
                    <HelpCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5 sm:mt-0" />
                    <span className="font-khmer text-red-800 text-xs sm:text-[13px] leading-relaxed font-medium">
                      {isEn 
                        ? 'If you do not know or understand, you can skip this question to accurately measure your true proficiency.' 
                        : 'ប្រសិនបើមិនចេះ ឬមិនយល់ អ្នកអាចចុចរំលងសំណួរនេះបាន ដើម្បីវាស់ស្ទង់សមត្ថភាពពិតប្រាកដរបស់អ្នក។'}
                    </span>
                  </div>

                  <button
                    type="button"
                    id="btn-skip-question-placement"
                    onClick={() => setShowSkipConfirm(true)}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 active:scale-95 text-xs font-bold font-khmer transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    title={isEn ? 'Skip Question' : 'រំលងសំណួរ'}
                  >
                    <SkipForward className="w-3.5 h-3.5 text-red-500" />
                    <span>{isEn ? 'Skip Question' : 'រំលងសំណួរ'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Footer Navigation Bar */}
            <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-khmer flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ថយក្រោយ (Previous)</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Next Button (Visible on all questions before the final question) */}
                {currentIndex < totalQuestions - 1 && (
                  <button
                    type="button"
                    disabled={!selectedAnswers[currentQuestion.id]}
                    onClick={() => {
                      if (selectedAnswers[currentQuestion.id]) {
                        setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
                      }
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-khmer flex items-center gap-1.5 transition-all ${
                      !selectedAnswers[currentQuestion.id]
                        ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-400 border border-slate-300'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md cursor-pointer active:scale-95'
                    }`}
                    title={!selectedAnswers[currentQuestion.id] ? 'សូមជ្រើសរើសចម្លើយ ឬចុចរំលង (Please select or skip)' : 'ទៅសំណួរបន្ទាប់ (Next)'}
                  >
                    <span>បន្ទាប់ (Next)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* Submit Test Trigger (ONLY visible on the final question) */}
                {currentIndex === totalQuestions - 1 && (
                  <button
                    type="button"
                    disabled={!selectedAnswers[currentQuestion.id]}
                    onClick={() => {
                      if (selectedAnswers[currentQuestion.id]) {
                        setShowConfirmSubmit(true);
                      }
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-khmer flex items-center gap-1.5 transition-all ${
                      !selectedAnswers[currentQuestion.id]
                        ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-400 border border-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md cursor-pointer active:scale-95'
                    }`}
                    title={!selectedAnswers[currentQuestion.id] ? 'សូមឆ្លើយ ឬរំលងសំណួរចុងក្រោយនេះ' : 'បញ្ចប់ និងបញ្ជូនតេស្ត'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>បញ្ចប់ និងបញ្ជូន (Submit {currentIndex + 1}/{totalQuestions})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Confirm Submit Confirmation Dialog */}
            {showConfirmSubmit && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 font-khmer">
                    តើអ្នកពិតជាចង់បញ្ជូនចម្លើយមែនទេ?
                  </h4>
                  <p className="text-xs text-slate-500 font-khmer">
                    អ្នកបានឆ្លើយចំនួន {answeredCount} ក្នុងចំណោម {totalQuestions} សំណួរ {skippedCount > 0 ? `(រំលងចំនួន ${skippedCount})` : ''}។ ប្រព័ន្ធនឹងគណនាពិន្ទុ និងកំណត់កម្រិត (Level) ជូនអ្នកដោយស្វ័យប្រវត្តិ។
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirmSubmit(false)}
                      className="flex-1 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 font-khmer cursor-pointer"
                    >
                      បន្តធ្វើតេស្តទៀត
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitTest}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-khmer shadow-sm cursor-pointer"
                    >
                      បញ្ជូនឥឡូវនេះ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================
            SMART EXIT CONFIRMATION MODAL
            - Option 1 (Agree & Start from Beginner): Skip test and set learning path to Beginner
            - Option 2 (Continue Test): Dismiss modal & continue active test
           ======================================================== */}
        {showExitConfirm && (
          <div 
            id="placement-exit-confirm-modal"
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4 z-[10010] animate-in fade-in duration-150"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-200 relative overflow-hidden">
              {/* Decorative top gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-600" />
              
              {/* Central Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center shadow-xs">
                <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              {/* Headings & Description */}
              <div className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-black text-slate-900 font-khmer leading-snug">
                  {isEn 
                    ? 'Skip Placement Test and start from Beginner level?' 
                    : 'តើអ្នកចង់រំលងការធ្វើតេស្ត ហើយចាប់ផ្តើមពីរៀនកម្រិតដំបូង (Beginner) ដែរឬទេ?'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-khmer leading-relaxed">
                  {isEn
                    ? 'If you exit now, your learning path will be automatically configured to start from the Beginner level (A1-A2 Foundation). You can retake this placement test at any time.'
                    : 'ប្រសិនបើអ្នកយល់ព្រមចាកចេញ ប្រព័ន្ធនឹងកំណត់ផ្លូវសិក្សាជូនអ្នកដោយចាប់ផ្តើមពីកម្រិតដំបូង (Beginner A1-A2 Foundation)។ អ្នកអាចធ្វើតេស្តវាស់ស្ទង់សមត្ថភាពឡើងវិញបានគ្រប់ពេល។'}
                </p>
              </div>

              {/* Action Choices */}
              <div className="pt-2 space-y-2.5">
                {/* Option 1: Agree & Start from Beginner */}
                <button
                  id="btn-exit-agree-beginner"
                  type="button"
                  onClick={handleAgreeStartBeginner}
                  className="w-full py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm font-khmer shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {isEn 
                      ? 'Agree & Start from Beginner' 
                      : 'យល់ព្រម & ចាប់ផ្តើមពីកម្រិតដំបូង (Beginner)'}
                  </span>
                </button>

                {/* Option 2: Continue Test */}
                <button
                  id="btn-exit-continue-test"
                  type="button"
                  onClick={handleDismissExitModal}
                  className="w-full py-2.5 px-4 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs sm:text-sm font-khmer border border-slate-300 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <span>
                    {isEn 
                      ? 'Continue Test' 
                      : 'បន្តធ្វើតេស្តទៀត (Continue Test)'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SKIP QUESTION CONFIRMATION MODAL
           ======================================================== */}
        {showSkipConfirm && (
          <div 
            id="skip-question-confirm-modal"
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 z-[10020] animate-in fade-in duration-150"
            onClick={() => setShowSkipConfirm(false)}
          >
            <div 
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-150 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 mx-auto flex items-center justify-center shadow-xs">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 font-khmer leading-snug">
                  {isEn ? 'Are you sure you want to skip this question?' : 'តើអ្នកពិតជាចង់រំលងសំណួរនេះមែនទេ?'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-khmer leading-relaxed">
                  {isEn 
                    ? 'If you skip this question, you will not receive any points.' 
                    : 'ប្រសិនបើអ្នករំលងសំណួរនេះ អ្នកនឹងមិនទទួលបានពិន្ទុឡើយ។'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  id="btn-skip-cancel"
                  onClick={() => setShowSkipConfirm(false)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold font-khmer transition cursor-pointer"
                >
                  {isEn ? 'Continue Question' : 'បន្តធ្វើសំណួរ'}
                </button>
                <button
                  type="button"
                  id="btn-skip-confirm"
                  onClick={() => {
                    setShowSkipConfirm(false);
                    handleSkipQuestion();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold font-khmer transition cursor-pointer shadow-xs active:scale-95"
                >
                  {isEn ? 'Skip Question' : 'រំលងសំណួរ'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PlacementTestModal;
