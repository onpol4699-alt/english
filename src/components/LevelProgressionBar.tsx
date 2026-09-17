import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Zap, 
  Trophy, 
  Compass, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  Crown, 
  Sparkles 
} from 'lucide-react';
import { DifficultyLevel, UserProgress } from '../types';
import { LESSONS } from '../data/curriculum';
import { isLevelUnlocked, calculateLevelProgress } from '../utils/progression';
import { LockedLevelModal } from './LockedLevelModal';

interface LevelProgressionBarProps {
  progress: UserProgress;
  onSelectLevel: (level: DifficultyLevel) => void;
  onTakeLevelExam: (level: DifficultyLevel) => void;
}

export const LevelProgressionBar: React.FC<LevelProgressionBarProps> = ({
  progress,
  onSelectLevel,
}) => {
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [lockedModalLevel, setLockedModalLevel] = useState<DifficultyLevel | null>(null);

  const isEn = progress.appLanguage === 'en';

  const levels: {
    id: DifficultyLevel;
    number: number;
    titleEn: string;
    titleKh: string;
    cefr: string;
    vipBadge: string;
    descriptionKh: string;
    descriptionEn: string;
    prerequisiteKh: string;
    prerequisiteEn: string;
    IconComponent: React.ComponentType<{ className?: string }>;
    emoji3D: string;
    gradient: string;
    glowRing: string;
    accentBg: string;
    accentBorder: string;
    accentText: string;
    cardBg: string;
    activeRing: string;
    badgeClass: string;
    btnClass: string;
  }[] = [
    {
      id: 'beginner',
      number: 1,
      titleEn: 'Beginner',
      titleKh: 'កម្រិតដំបូង',
      cefr: 'A1 - A2',
      vipBadge: 'VIP Tier 1',
      descriptionKh: 'ការស្វាគមន៍ ការសន្ទនាប្រចាំថ្ងៃ ម្ហូបអាហារ និងទម្លាប់ទូទៅ',
      descriptionEn: 'Daily greetings, everyday conversations, dining etiquette, and routines',
      prerequisiteKh: 'បើកដំណើរការស្រាប់សម្រាប់អ្នកចាប់ផ្តើមដំបូង',
      prerequisiteEn: 'Available immediately for all new learners',
      IconComponent: BookOpen,
      emoji3D: '🌱',
      gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      glowRing: 'ring-emerald-400/50 shadow-emerald-500/25',
      accentBg: 'bg-emerald-500',
      accentBorder: 'border-emerald-300 hover:border-emerald-500',
      accentText: 'text-emerald-700',
      cardBg: 'bg-gradient-to-b from-emerald-50/30 to-white',
      activeRing: 'ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25',
    },
    {
      id: 'intermediate',
      number: 2,
      titleEn: 'Intermediate',
      titleKh: 'កម្រិតមធ្យម',
      cefr: 'B1 - B2',
      vipBadge: 'VIP Tier 2',
      descriptionKh: 'ការធ្វើដំណើរ ព្រលានយន្តហោះ កន្លែងធ្វើការ និងការបញ្ចេញមតិ',
      descriptionEn: 'Travel logistics, airport customs, workplace dialogues, and debates',
      prerequisiteKh: 'ត្រូវបញ្ចប់មេរៀន និងប្រឡងជាប់ Quiz កម្រិតទី ១ (Beginner) ជាមុនសិន',
      prerequisiteEn: 'Complete all Beginner lessons and pass the Beginner Quiz to unlock',
      IconComponent: Zap,
      emoji3D: '⚡',
      gradient: 'from-blue-600 via-indigo-600 to-sky-500',
      glowRing: 'ring-blue-400/50 shadow-blue-500/25',
      accentBg: 'bg-blue-600',
      accentBorder: 'border-blue-300 hover:border-blue-500',
      accentText: 'text-blue-700',
      cardBg: 'bg-gradient-to-b from-blue-50/30 to-white',
      activeRing: 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      btnClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25',
    },
    {
      id: 'advanced',
      number: 3,
      titleEn: 'Advanced',
      titleKh: 'កម្រិតខ្ពស់',
      cefr: 'C1 - C2',
      vipBadge: 'VIP Tier 3',
      descriptionKh: 'ការចរចាពាណិជ្ជកម្ម ការវិភាគស្រាវជ្រាវ និងសំនួនវោហារជាន់ខ្ពស់',
      descriptionEn: 'High-stakes negotiations, research analysis, and executive nuance',
      prerequisiteKh: 'ត្រូវបញ្ចប់មេរៀន និងប្រឡងជាប់ Quiz កម្រិតទី ២ (Intermediate) ជាមុនសិន',
      prerequisiteEn: 'Complete all Intermediate lessons and pass the Intermediate Quiz to unlock',
      IconComponent: Crown,
      emoji3D: '👑',
      gradient: 'from-rose-600 via-red-600 to-amber-500',
      glowRing: 'ring-rose-400/50 shadow-rose-500/25',
      accentBg: 'bg-rose-600',
      accentBorder: 'border-rose-300 hover:border-rose-500',
      accentText: 'text-rose-700',
      cardBg: 'bg-gradient-to-b from-rose-50/30 to-white',
      activeRing: 'ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/20',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      btnClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
    },
  ];

  const handleCardClick = (lvlId: DifficultyLevel, unlocked: boolean, prereq: string) => {
    if (!unlocked) {
      setLockedModalLevel(lvlId);
      setLockedNotice(isEn ? `This level is locked! ${prereq}` : `កម្រិតនេះត្រូវបានចាក់សោ (Locked)! ${prereq}`);
      setTimeout(() => setLockedNotice(null), 5000);
      return;
    }
    setLockedNotice(null);
    onSelectLevel(lvlId);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs mb-3 sm:mb-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Sequential Level Progression
            </h2>
            {!isEn && (
              <span className="font-khmer text-xs text-slate-500 font-medium">
                (ដំណើរវិវឌ្ឍន៍រៀនជាលំដាប់)
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-khmer">
            {isEn
              ? 'Learn step-by-step from Beginner to Advanced. Click each level below to study!'
              : 'រៀនជាជំហានៗចាប់ពីកម្រិតដំបូង រហូតដល់កម្រិតខ្ពស់។ ចុចលើកម្រិតនីមួយៗខាងក្រោមដើម្បីចូលរៀន!'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active: {progress.currentLevel.toUpperCase()}</span>
          </span>
        </div>
      </div>

      {/* Locked Level Alert Notification */}
      {lockedNotice && (
        <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-khmer flex items-center gap-2 animate-in fade-in duration-200 shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">{lockedNotice}</span>
        </div>
      )}

      {/* 3 Progression Columns with Animated Glowing Badges and 3D Icons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {levels.map((lvl) => {
          const unlocked = isLevelUnlocked(lvl.id, progress);
          const isCurrent = progress.currentLevel === lvl.id;
          const stats = calculateLevelProgress(lvl.id, progress);
          const isLevelComplete = stats.isFullyComplete || stats.percentage === 100;
          const Icon = lvl.IconComponent;
          const prereqText = isEn ? lvl.prerequisiteEn : lvl.prerequisiteKh;

          return (
            <div
              key={lvl.id}
              onClick={() => handleCardClick(lvl.id, unlocked, prereqText)}
              className={`group relative rounded-2xl p-4 transition-all duration-300 border text-left overflow-hidden ${
                unlocked 
                  ? `cursor-pointer hover:shadow-xl hover:-translate-y-1 ${lvl.cardBg}` 
                  : 'opacity-80 bg-slate-50 border-dashed border-slate-300 cursor-not-allowed'
              } ${
                isCurrent && unlocked
                  ? `${lvl.activeRing} ${lvl.accentBorder} border-2`
                  : `${lvl.accentBorder} border`
              }`}
            >
              {/* Distinct colored top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${lvl.gradient}`} />

              {/* Subtle top background gradient glow for unlocked active cards */}
              {unlocked && (
                <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br ${lvl.gradient} opacity-15 blur-xl pointer-events-none group-hover:opacity-25 transition-opacity`} />
              )}

              {/* Top Row: 3D Icon & Animated Glowing Badge */}
              <div className="flex items-center justify-between gap-2 mb-2.5 pt-0.5">
                <div className="flex items-center gap-2.5">
                  {/* 3D Icon Box */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-md ring-2 transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                    unlocked 
                      ? `bg-gradient-to-br ${lvl.gradient} text-white ${lvl.glowRing}`
                      : 'bg-slate-200 text-slate-400 ring-slate-300 shadow-none'
                  }`}>
                    {unlocked ? (
                      <span className="select-none filter drop-shadow-sm">{lvl.emoji3D}</span>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                        {lvl.titleEn}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border font-mono ${lvl.badgeClass}`}>
                        {lvl.cefr}
                      </span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-300 shadow-2xs">
                        {lvl.vipBadge}
                      </span>
                    </div>
                    {!isEn && (
                      <span className="font-khmer text-xs text-slate-600 font-bold">
                        {lvl.titleKh}
                      </span>
                    )}
                  </div>
                </div>

                {/* Animated Glowing Badge Indicator */}
                {isLevelComplete ? (
                  <span className="relative inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full font-khmer shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute -top-0.5 -right-0.5" />
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{isEn ? 'Completed' : 'បានបញ្ចប់'}</span>
                  </span>
                ) : unlocked ? (
                  <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs transition-all ${
                    isCurrent 
                      ? 'bg-slate-900 text-white shadow-md animate-pulse'
                      : `${lvl.badgeClass} border`
                  }`}>
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    <span>{isCurrent ? (isEn ? 'Studying' : 'កំពុងរៀន') : (isEn ? 'Unlocked' : 'បើកដំណើរការ')}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full font-khmer">
                    <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{isEn ? 'Locked' : 'ចាក់សោ'}</span>
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="font-khmer text-[11px] sm:text-xs text-slate-600 leading-relaxed line-clamp-2 min-h-[28px] mb-1">
                {isEn ? lvl.descriptionEn : lvl.descriptionKh}
              </p>

              {/* Progress bar: Based on BOTH Completed Lessons AND Completed Tests */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/70">
                <div className="flex justify-between items-center text-[11px] sm:text-xs mb-1 font-medium">
                  <span className="text-slate-600 font-khmer flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <Icon className="w-3 h-3 text-slate-400" />
                      <span>{isEn ? 'Lessons:' : 'មេរៀន:'} {stats.completedLessons}/{stats.totalLessons}</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>{isEn ? 'Quizzes:' : 'តេស្ត:'} {stats.completedTests}/{stats.totalTests}</span>
                  </span>
                  <span className="text-slate-900 font-black font-mono">{stats.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80 shadow-inner">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      unlocked ? `bg-gradient-to-r ${lvl.gradient}` : 'bg-slate-300'
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>

              {/* Action Button: Directly Clickable to View Lessons */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/70">
                {unlocked ? (
                  <button
                    type="button"
                    className={`w-full py-2 px-3 rounded-xl flex items-center justify-between transition-all text-xs font-bold cursor-pointer shadow-xs ${
                      isCurrent 
                        ? `${lvl.btnClass} shadow-md` 
                        : 'bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-white animate-ping' : 'bg-emerald-500'}`} />
                      <span>{isCurrent ? (isEn ? 'Active Level' : 'កំពុងរៀន (Active Level)') : (isEn ? '👉 Study Units' : '👉 ចុចចូលរៀន (Study Units)')}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <div className="text-[10px] sm:text-[11px] font-khmer text-slate-500 flex items-start gap-1 py-0.5">
                    <Lock className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{prereqText}</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Polite Locked Level Modal */}
      {lockedModalLevel && (
        <LockedLevelModal
          isOpen={Boolean(lockedModalLevel)}
          level={lockedModalLevel}
          appLanguage={progress.appLanguage}
          onClose={() => setLockedModalLevel(null)}
          onGoToPrerequisite={(prereq) => {
            setLockedModalLevel(null);
            onSelectLevel(prereq);
          }}
        />
      )}
    </div>
  );
};

