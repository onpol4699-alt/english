import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Save, 
  LogOut, 
  HelpCircle, 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  Award,
  ChevronDown,
  ChevronUp,
  Volume2,
  Info,
  Check
} from 'lucide-react';
import { UserProgress, DifficultyLevel, QuizQuestion } from '../types';
import { speakEnglish } from '../utils/audio';

export interface CompletionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  lessonTitle?: string;
  level: DifficultyLevel | 'all';
  activityTitle?: string;
  durationSeconds?: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount?: number;
  scorePercent?: number;
  xpEarned?: number;
  onRetry: () => void;
  onSaveResult?: () => void;
  questions?: QuizQuestion[];
  userAnswers?: Record<string, string>;
  onOpenCertificate?: (level: DifficultyLevel | 'all') => void;
}

export const CompletionResultModal: React.FC<CompletionResultModalProps> = ({
  isOpen,
  onClose,
  progress,
  lessonTitle = 'មេរៀនទូទៅ (General Curriculum)',
  level,
  activityTitle = 'ធ្វើតេស្តសាកល្បង (Quiz Examination)',
  durationSeconds = 0,
  totalQuestions,
  correctCount,
  incorrectCount,
  skippedCount = 0,
  scorePercent,
  xpEarned,
  onRetry,
  onSaveResult,
  questions = [],
  userAnswers = {},
  onOpenCertificate,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  if (!isOpen) return null;

  // Format current date & time
  const now = new Date();
  const dateFormatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // Format duration
  const mins = Math.floor(durationSeconds / 60);
  const secs = durationSeconds % 60;
  const durationFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Determine user role
  const isDev = Boolean(progress.isDeveloperMode) || (progress.email?.toLowerCase().includes('dev') ?? false) || progress.role === 'Developer';
  const isAdmin = progress.role === 'Admin' || (progress.email?.toLowerCase().includes('admin') ?? false);
  const roleDisplay = isDev ? 'Developer' : isAdmin ? 'Admin' : (progress.role ? progress.role.charAt(0).toUpperCase() + progress.role.slice(1) : 'Student');

  // Level label
  const levelDisplay = level === 'all' 
    ? 'All Levels (គ្រប់កម្រិត)' 
    : level === 'beginner' 
    ? 'Level 1 - BEGINNER (A1-A2)' 
    : level === 'intermediate' 
    ? 'Level 2 - INTERMEDIATE (B1-B2)' 
    : 'Level 3 - ADVANCED (C1-C2)';

  // Calculate percentage
  const calculatedPercent = scorePercent !== undefined 
    ? scorePercent 
    : totalQuestions > 0 
    ? Math.round((correctCount / totalQuestions) * 100) 
    : 0;

  const handleSave = () => {
    setIsSaved(true);
    if (onSaveResult) {
      onSaveResult();
    }
    setTimeout(() => {
      setIsSaved(false);
    }, 3500);
  };

  const filteredQuestions = questions.filter(q => {
    const isUserCorrect = userAnswers[q.id] === q.correctOptionId;
    if (reviewFilter === 'incorrect') return !isUserCorrect;
    if (reviewFilter === 'correct') return isUserCorrect;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        id="completion-result-modal-box"
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        
        {/* Top Header: Clear Title "លទ្ធផលរបស់អ្នក" (Image 4 Requirement) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white text-center relative border-b border-slate-700/60">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl">🏆</span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-khmer text-amber-300">
              លទ្ធផលរបស់អ្នក
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-khmer">
            ការវាយតម្លៃលទ្ធផលការសិក្សា និងពិន្ទុជាក់ស្តែង (Your Academic Results)
          </p>

          {/* Quick Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          
          {/* Save Success Toast Banner */}
          {isSaved && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-khmer font-bold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>លទ្ធផលត្រូវបានរក្សាទុកដោយជោគជ័យ! (Result Saved Successfully!)</span>
              </div>
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                SAVED
              </span>
            </div>
          )}

          {/* Student & Context Info Box (Grey Background - Image 4 Matching) */}
          <div className="bg-slate-100/90 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-xs text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
              
              {/* Left Column: ឈ្មោះ, តួនាទី, កាលបរិច្ឆេទ */}
              <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-khmer font-medium">ឈ្មោះ (Name):</span>
                  <span className="font-bold text-slate-900 font-khmer">
                    {progress.userName || 'អ្នកសិក្សា'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-khmer font-medium">តួនាទី (Role):</span>
                  <span className="font-bold font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800">
                    {roleDisplay}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-khmer font-medium">កាលបរិច្ឆេទ (Date/Time):</span>
                  <span className="font-semibold text-slate-800 font-mono text-[11px]">
                    {dateFormatted}
                  </span>
                </div>
              </div>

              {/* Right Column: ថ្នាក់/កម្រិត, មេរៀន, សកម្មភាព, រយៈពេល */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-khmer font-medium">ថ្នាក់/កម្រិត (Level):</span>
                  <span className="font-bold text-slate-900 font-khmer">
                    {levelDisplay}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-khmer font-medium">មេរៀន (Lesson):</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px] text-right font-khmer" title={lessonTitle}>
                    {lessonTitle}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-khmer font-medium">សកម្មភាព (Activity):</span>
                  <span className="font-medium text-slate-800 font-khmer">
                    {activityTitle}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-khmer font-medium">រយៈពេល (Duration):</span>
                  <span className="font-bold text-indigo-700 font-mono">
                    {durationFormatted}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Stat Summary Cards (Grid Layout with Icons - Image 4 Matching) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
            
            {/* 1. ⭐ ពិន្ទុសរុប (Total Score) */}
            <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-3 text-center flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] font-bold font-khmer">ពិន្ទុសរុប</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-amber-900 font-mono">
                {calculatedPercent}%
              </div>
              <span className="text-[10px] text-amber-700 font-semibold mt-0.5">
                {xpEarned ? `+${xpEarned} XP` : `${correctCount}/${totalQuestions}`}
              </span>
            </div>

            {/* 2. 📋 សំណួរសរុប (Total Questions) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span className="text-[11px] font-bold font-khmer">សំណួរសរុប</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                {totalQuestions}/{totalQuestions}
              </div>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 font-khmer">
                {totalQuestions} សំណួរ
              </span>
            </div>

            {/* 3. 🟢 ត្រឹមត្រូវ (Correct) */}
            <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-3 text-center flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-emerald-700 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-bold font-khmer">ត្រឹមត្រូវ</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-emerald-800 font-mono">
                {correctCount}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                {totalQuestions > 0 ? `${Math.round((correctCount / totalQuestions) * 100)}%` : '0%'}
              </span>
            </div>

            {/* 4. 🔴 ខុស (Incorrect) */}
            <div className="bg-rose-50/70 border border-rose-200/90 rounded-2xl p-3 text-center flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-rose-700 mb-1">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span className="text-[11px] font-bold font-khmer">ខុស</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-rose-800 font-mono">
                {incorrectCount}
              </div>
              <span className="text-[10px] text-rose-700 font-semibold mt-0.5">
                {totalQuestions > 0 ? `${Math.round((incorrectCount / totalQuestions) * 100)}%` : '0%'}
              </span>
            </div>

            {/* 5. 🟣 រំលង (Skipped) */}
            <div className="col-span-2 sm:col-span-1 bg-purple-50/70 border border-purple-200/90 rounded-2xl p-3 text-center flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-purple-700 mb-1">
                <RotateCcw className="w-4 h-4 text-purple-600" />
                <span className="text-[11px] font-bold font-khmer">រំលង</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-purple-800 font-mono">
                {skippedCount}
              </div>
              <span className="text-[10px] text-purple-700 font-semibold mt-0.5 font-khmer">
                {skippedCount === 0 ? 'គ្មានរំលង' : `${skippedCount} ដង`}
              </span>
            </div>

          </div>

          {/* Certificate Claim Banner: Enforces >= 80% passing score on 20+ questions */}
          {onOpenCertificate && (
            calculatedPercent >= 80 && totalQuestions >= 20 ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100/70 border-2 border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-amber-950 font-khmer flex items-center gap-1.5">
                      <span>🎓 អបអរសាទរ! ជាប់លក្ខខណ្ឌវិញ្ញាបនបត្រ ({calculatedPercent}%)</span>
                    </div>
                    <div className="text-[11px] text-amber-900 font-khmer mt-0.5">
                      អ្នកបានប្រឡងជាប់ {totalQuestions} សំណួរពេញលេញ ដោយទទួលបានពិន្ទុលើស 80%។
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-view-earned-certificate"
                  onClick={() => {
                    onClose();
                    onOpenCertificate(level);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>មើលវិញ្ញាបនបត្រផ្លូវការ</span>
                </button>
              </div>
            ) : totalQuestions >= 20 && calculatedPercent < 80 ? (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-600 font-khmer">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      លក្ខខណ្ឌវិញ្ញាបនបត្រ៖ ត្រូវការយ៉ាងតិច 80% (បច្ចុប្បន្ន {calculatedPercent}%)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      សូមព្យាយាមប្រឡងម្តងទៀត ដើម្បីទទួលបានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការ។
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition shrink-0 cursor-pointer"
                >
                  ប្រឡងឡើងវិញ
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-khmer flex items-center gap-2">
                <Award className="w-4 h-4 text-slate-400 shrink-0" />
                <span>ចំណាំ៖ វិញ្ញាបនបត្រផ្លូវការនឹងត្រូវចេញជូននៅពេលអ្នកប្រឡងជាប់កម្រងសំណួរ 20+ សំណួរ ទទួលបានពិន្ទុ ≥ 80%។</span>
              </div>
            )
          )}

          {/* Collapsible Question Review Accordion */}
          {questions.length > 0 && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setIsReviewOpen(!isReviewOpen)}
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-xs sm:text-sm text-slate-900 font-khmer">
                    ពិនិត្យចម្លើយឡើងវិញ និងការពន្យល់លម្អិត ({questions.length} សំណួរ)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>{isReviewOpen ? 'បង្រួម' : 'ពង្រីក'}</span>
                  {isReviewOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isReviewOpen && (
                <div className="p-4 bg-white border-t border-slate-200 space-y-4">
                  {/* Filters */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-sm">
                    <button
                      type="button"
                      onClick={() => setReviewFilter('all')}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        reviewFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      All ({questions.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('incorrect')}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1 ${
                        reviewFilter === 'incorrect' ? 'bg-rose-500 text-white shadow-2xs' : 'text-rose-700'
                      }`}
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Wrong ({incorrectCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('correct')}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1 ${
                        reviewFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Right ({correctCount})</span>
                    </button>
                  </div>

                  {/* List */}
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {filteredQuestions.map((q, idx) => {
                      const userAnsId = userAnswers[q.id];
                      const isUserCorrect = userAnsId === q.correctOptionId;
                      const correctOpt = q.options.find(o => o.id === q.correctOptionId);

                      return (
                        <div 
                          key={q.id}
                          className={`p-3 rounded-xl border text-xs ${
                            isUserCorrect ? 'bg-emerald-50/30 border-emerald-200' : 'bg-rose-50/30 border-rose-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isUserCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                              }`}>
                                {isUserCorrect ? '✓' : '✗'}
                              </span>
                              <span className="font-bold text-slate-800">
                                Question #{idx + 1}
                              </span>
                            </div>
                            {q.audioText && (
                              <button
                                type="button"
                                onClick={() => speakEnglish(q.audioText!, progress.speechRate)}
                                className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="font-semibold text-slate-900 mb-1 pl-6">
                            {q.promptEn}
                          </div>
                          <div className="font-khmer text-[11px] text-slate-600 mb-2 pl-6">
                            {q.promptKh}
                          </div>

                          <div className="ml-6 p-2 rounded-lg bg-white border border-slate-200 text-[11px] space-y-1">
                            <div className="text-emerald-800 font-semibold">
                              ✅ ចម្លើយត្រឹមត្រូវ៖ {correctOpt?.text}
                            </div>
                            {q.explanationKh && (
                              <div className="font-khmer text-slate-600 text-[10px] leading-relaxed pt-0.5">
                                {q.explanationKh}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Bottom Action Buttons (Image 4 Requirement: Green Save, Yellow Retry, Dark Grey Exit) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/90 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          
          {/* Green Button: "💾 រក្សាទុក" (Save) */}
          <button
            type="button"
            id="btn-result-modal-save"
            onClick={handleSave}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer font-khmer"
          >
            <span>💾</span>
            <span>រក្សាទុក (Save)</span>
          </button>

          {/* Yellow/Orange Button: "🔄 ព្យាយាម" (Retry) */}
          <button
            type="button"
            id="btn-result-modal-retry"
            onClick={onRetry}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer font-khmer"
          >
            <span>🔄</span>
            <span>ព្យាយាម (Retry)</span>
          </button>

          {/* Dark Grey Button: "🚪 ចាកចេញ" (Exit) */}
          <button
            type="button"
            id="btn-result-modal-exit"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer font-khmer"
          >
            <span>🚪</span>
            <span>ចាកចេញ (Exit)</span>
          </button>

        </div>

      </div>
    </div>
  );
};
