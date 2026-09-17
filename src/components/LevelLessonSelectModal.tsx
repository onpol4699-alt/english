import React from 'react';
import { 
  X, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Trophy, 
  Zap, 
  Crown, 
  ArrowRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { DifficultyLevel, Lesson, UserProgress } from '../types';
import { LESSONS } from '../data/curriculum';
import { calculateLevelProgress, isLevelUnlocked } from '../utils/progression';

interface LevelLessonSelectModalProps {
  isOpen: boolean;
  level: DifficultyLevel | null;
  progress: UserProgress;
  onClose: () => void;
  onSelectLesson: (lesson: Lesson) => void;
  onStartQuizForLesson: (lessonId: string) => void;
}

export const LevelLessonSelectModal: React.FC<LevelLessonSelectModalProps> = ({
  isOpen,
  level,
  progress,
  onClose,
  onSelectLesson,
  onStartQuizForLesson,
}) => {
  if (!isOpen || !level || !isLevelUnlocked(level, progress)) return null;

  // Filter lessons for selected level
  const lessons = LESSONS.filter((l) => l.level === level).sort((a, b) => a.order - b.order);
  const stats = calculateLevelProgress(level, progress);
  const isEn = progress.appLanguage === 'en';

  const LESSON_EN_DESCRIPTIONS: Record<string, string> = {
    'beg-1': 'Master essential daily greetings, self-introductions, and polite everyday expressions.',
    'beg-2': 'Build practical vocabulary for common household items, room objects, and personal belongings.',
    'beg-3': 'Learn dining etiquette, ordering food and drinks, and restaurant dialogues.',
    'int-1': 'Navigate international airports, boarding gates, customs, and travel logistics.',
    'int-2': 'Communicate professionally at work, participate in meetings, and discuss projects.',
    'int-3': 'Express personal viewpoints, debate politely, and structure convincing arguments.',
    'adv-1': 'Master high-level commercial negotiations, formal agreements, and deal-closing.',
    'adv-2': 'Deliver executive presentations and interpret complex business data reports.',
    'adv-3': 'Explore advanced idiomatic phrases, metaphors, and cultural language nuances.',
  };

  const levelMeta = {
    beginner: {
      nameEn: 'Beginner Foundation',
      nameKh: isEn ? 'Beginner Foundation' : 'កម្រិតដំបូង (Beginner)',
      cefr: 'CEFR A1 - A2',
      vipBadge: 'VIP Tier 1',
      emoji: '🌱',
      accentColor: 'emerald',
      bgGradient: 'from-emerald-600 via-teal-600 to-emerald-700',
      lightBg: 'bg-emerald-50',
      borderClass: 'border-emerald-200',
      textAccent: 'text-emerald-700',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      descriptionKh: 'ការស្វាគមន៍ ការណែនាំខ្លួន ទម្លាប់ប្រចាំថ្ងៃ ម្ហូបអាហារ និងការបញ្ជាទិញទូទៅ',
      descriptionEn: 'Greetings, personal introductions, daily routines, food, and everyday dining conversations',
    },
    intermediate: {
      nameEn: 'Intermediate Fluency',
      nameKh: isEn ? 'Intermediate Fluency' : 'កម្រិតមធ្យម (Intermediate)',
      cefr: 'CEFR B1 - B2',
      vipBadge: 'VIP Tier 2',
      emoji: '⚡',
      accentColor: 'blue',
      bgGradient: 'from-blue-600 via-indigo-600 to-sky-600',
      lightBg: 'bg-blue-50',
      borderClass: 'border-blue-200',
      textAccent: 'text-blue-700',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      descriptionKh: 'ការធ្វើដំណើរ ព្រលានយន្តហោះ កន្លែងធ្វើការ ការចរចា និងការបញ្ចេញមតិយោបល់',
      descriptionEn: 'Travel logistics, airports, workplace discussions, professional negotiations, and opinion sharing',
    },
    advanced: {
      nameEn: 'Advanced Mastery',
      nameKh: isEn ? 'Advanced Mastery' : 'កម្រិតខ្ពស់ (Advanced)',
      cefr: 'CEFR C1 - C2',
      vipBadge: 'VIP Tier 3',
      emoji: '👑',
      accentColor: 'rose',
      bgGradient: 'from-rose-600 via-red-600 to-amber-600',
      lightBg: 'bg-rose-50',
      borderClass: 'border-rose-200',
      textAccent: 'text-rose-700',
      buttonClass: 'bg-rose-600 hover:bg-rose-700 text-white',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      descriptionKh: 'ការចរចាពាណិជ្ជកម្មកម្រិតខ្ពស់ ការវិភាគស្រាវជ្រាវ និងសំនួនវោហារសាស្រ្ត',
      descriptionEn: 'High-stakes executive negotiations, academic research analysis, and advanced idiomatic nuances',
    },
  }[level];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className={`relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 ${isEn ? 'font-sans' : 'font-khmer'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className={`relative px-5 py-4 sm:px-6 sm:py-5 bg-gradient-to-r ${levelMeta.bgGradient} text-white shrink-0`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
                {levelMeta.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-white/90">
                    {levelMeta.nameEn}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/25 border border-white/30 text-white font-mono">
                    {levelMeta.cefr}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-xs">
                    {levelMeta.vipBadge}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  {isEn ? levelMeta.nameEn : levelMeta.nameKh}
                </h2>
                <p className="text-xs text-white/85 mt-0.5">
                  {isEn ? levelMeta.descriptionEn : levelMeta.descriptionKh}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer shrink-0"
              title={isEn ? 'Close' : 'បិទ (Close)'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar inside Header */}
          <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-white/90">{isEn ? 'Study Progress:' : 'ដំណើរការរៀន៖'}</span>
              <strong className="text-amber-300 font-bold">
                {stats.completedLessons} / {stats.totalLessons} {isEn ? 'Lessons' : 'មេរៀន'} ({stats.percentage}%)
              </strong>
            </div>
            <div className="w-36 sm:w-48 h-2.5 bg-black/25 rounded-full overflow-hidden border border-white/20">
              <div 
                className="h-full bg-gradient-to-r from-amber-300 to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Structure Notice Banner (Requirement 5: 1 Lesson includes 1 Quiz) */}
        <div className="px-5 py-2.5 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-700">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>{isEn ? 'Study Structure:' : 'រចនាសម្ព័ន្ធសិក្សា៖'}</strong>{' '}
              {isEn 
                ? '1 Lesson includes 1 Quiz • Click "Open Lesson" or "Take Quiz"' 
                : 'មេរៀន ១ មាន Quiz ១ • សូមចុច «បើកមើលមេរៀន» ឬ «ធ្វើ Quiz»'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {isEn ? `Total ${lessons.length} Lessons` : `សរុប ${lessons.length} មេរៀន`}
          </span>
        </div>

        {/* Lessons List Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5 divide-y-0">
          {lessons.map((lesson) => {
            const isCompleted = progress.completedLessonIds.includes(lesson.id);

            return (
              <div 
                key={lesson.id}
                className={`group rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                  isCompleted 
                    ? 'bg-emerald-50/40 border-emerald-200 shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Info & Title */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold">
                        {isEn ? `Lesson ${lesson.order}` : `មេរៀនទី ${lesson.order}`}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold">
                        +{lesson.xpReward} XP
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {lesson.vocabulary.length} {isEn ? 'Key Vocab' : 'ពាក្យគន្លឹះ'}
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{isEn ? 'Completed' : 'បានរៀនចប់'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{isEn ? 'In Progress' : 'កំពុងរៀន'}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>{lesson.titleEn}</span>
                    </h3>
                    
                    {!isEn && (
                      <p className="text-xs sm:text-sm font-semibold text-emerald-700 font-khmer">
                        {lesson.titleKh}
                      </p>
                    )}

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {isEn ? (LESSON_EN_DESCRIPTIONS[lesson.id] || lesson.titleEn) : lesson.descriptionKh}
                    </p>
                  </div>

                  {/* Right: Explicit 2 Actions (Study Lesson & Take Quiz) */}
                  <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Action 1: Open Lesson File */}
                    <button
                      onClick={() => {
                        onClose();
                        onSelectLesson(lesson);
                      }}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                      title={isEn ? 'Open lesson file to study' : 'បើកឯកសារមេរៀនដើម្បីរៀន'}
                    >
                      <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{isEn ? 'Open Lesson' : 'បើកមើលមេរៀន'}</span>
                    </button>

                    {/* Action 2: Take Quiz for this Lesson */}
                    <button
                      onClick={() => {
                        onClose();
                        onStartQuizForLesson(lesson.id);
                      }}
                      className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                      title={isEn ? `Take Quiz for Lesson ${lesson.order}` : `ធ្វើ Quiz មេរៀនទី ${lesson.order}`}
                    >
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{isEn ? `Quiz ${lesson.order}` : `Quiz ទី ${lesson.order}`}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>
              {isEn 
                ? 'Complete all lessons and pass all quizzes to advance to the next level!' 
                : 'រៀនចប់មេរៀន និងប្រឡងជាប់ Quiz ទាំងអស់ដើម្បីឡើងទៅកម្រិតបន្ទាប់!'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer transition"
          >
            {isEn ? 'Close' : 'បិទ'}
          </button>
        </div>
      </div>
    </div>
  );
};
