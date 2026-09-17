import React from 'react';
import { Lock, ShieldAlert, ArrowRight, X, BookOpen, Sparkles } from 'lucide-react';
import { DifficultyLevel } from '../types';

interface LockedLevelModalProps {
  isOpen: boolean;
  level: DifficultyLevel | null;
  appLanguage?: 'km' | 'en';
  onClose: () => void;
  onGoToPrerequisite?: (prereqLevel: DifficultyLevel) => void;
}

export const LockedLevelModal: React.FC<LockedLevelModalProps> = ({
  isOpen,
  level,
  appLanguage = 'km',
  onClose,
  onGoToPrerequisite,
}) => {
  if (!isOpen || !level || level === 'beginner') return null;

  const isEn = appLanguage === 'en';

  const details = {
    intermediate: {
      titleEn: 'Intermediate Level Locked',
      titleKh: 'កម្រិតមធ្យមត្រូវបានចាក់សោ (Intermediate Locked)',
      cefr: 'CEFR B1 - B2',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      prereqLevel: 'beginner' as DifficultyLevel,
      prereqNameEn: 'Beginner Level',
      prereqNameKh: 'កម្រិតដំបូង (Beginner)',
      msgEn: 'This level is locked. You must complete all Beginner lessons and pass the Beginner Quiz first before unlocking Intermediate lessons, study triggers, or quizzes.',
      msgKh: 'កម្រិតមធ្យម (CEFR B1 - B2) ត្រូវបានចាក់សោ! អ្នកត្រូវតែបញ្ចប់មេរៀនទាំងអស់ និងប្រឡងជាប់ Quiz កម្រិតដំបូង (Beginner) ជាមុនសិន ទើបអាចដោះសោចូលរៀន និងប្រឡងកម្រិតនេះបាន។',
      actionEn: '👉 Study Beginner Level (Prerequisite)',
      actionKh: '👉 ចូលរៀនកម្រិតដំបូង (Beginner) ជាមុនសិន',
      roleTipEn: 'Note: Teachers and Developers have instant access to all levels without restrictions.',
      roleTipKh: 'សម្គាល់ ៖ អ្នកក៏អាចប្តូរតួនាទី (Role) ទៅកាន់ Teacher ឬ Developer នៅរបារខាងលើ ដើម្បីបើកមើលគ្រប់កម្រិតបានភ្លាមៗ។',
    },
    advanced: {
      titleEn: 'Advanced Level Locked',
      titleKh: 'កម្រិតខ្ពស់ត្រូវបានចាក់សោ (Advanced Locked)',
      cefr: 'CEFR C1 - C2',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      prereqLevel: 'intermediate' as DifficultyLevel,
      prereqNameEn: 'Intermediate Level',
      prereqNameKh: 'កម្រិតមធ្យម (Intermediate)',
      msgEn: 'This level is locked. You must complete all Intermediate lessons and pass the Intermediate Quiz first before unlocking Advanced lessons, study triggers, or quizzes.',
      msgKh: 'កម្រិតខ្ពស់ (CEFR C1 - C2) ត្រូវបានចាក់សោ! អ្នកត្រូវតែបញ្ចប់មេរៀនទាំងអស់ និងប្រឡងជាប់ Quiz កម្រិតមធ្យម (Intermediate) ជាមុនសិន ទើបអាចដោះសោចូលរៀន និងប្រឡងកម្រិតនេះបាន។',
      actionEn: '👉 Study Intermediate Level (Prerequisite)',
      actionKh: '👉 ចូលរៀនកម្រិតមធ្យម (Intermediate) ជាមុនសិន',
      roleTipEn: 'Note: Teachers and Developers have instant access to all levels without restrictions.',
      roleTipKh: 'សម្គាល់ ៖ អ្នកក៏អាចប្តូរតួនាទី (Role) ទៅកាន់ Teacher ឬ Developer នៅរបារខាងលើ ដើម្បីបើកមើលគ្រប់កម្រិតបានភ្លាមៗ។',
    },
  }[level];

  if (!details) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 text-center overflow-hidden animate-in zoom-in-95 duration-200 ${isEn ? 'font-sans' : 'font-khmer'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Amber Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon Emblem */}
        <div className="relative mx-auto w-16 h-16 rounded-3xl bg-amber-100/90 text-amber-600 border-2 border-amber-300 flex items-center justify-center shadow-inner mb-4 mt-2">
          <Lock className="w-8 h-8 drop-shadow-xs" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 animate-ping opacity-75" />
        </div>

        {/* Badge & Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border mb-2.5 bg-amber-50 border-amber-200 text-amber-800">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>{details.cefr}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-2">
          {isEn ? details.titleEn : details.titleKh}
        </h3>

        {/* Polite Message */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 px-1 font-normal">
          {isEn ? details.msgEn : details.msgKh}
        </p>

        {/* Role Tip */}
        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 text-left mb-6 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>{isEn ? details.roleTipEn : details.roleTipKh}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {onGoToPrerequisite && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToPrerequisite(details.prereqLevel);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isEn ? details.actionEn : details.actionKh}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            {isEn ? 'Understood' : 'យល់ព្រម (Understood)'}
          </button>
        </div>

      </div>
    </div>
  );
};
