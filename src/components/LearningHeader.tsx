import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getDisplayUserId } from '../utils/storage';

export interface LearningHeaderProps {
  onClose: () => void;
  currentIndex: number; // 0-based
  totalCount: number;
  userIdentifier?: string;
  questionId?: string | number;
  initialSeconds?: number;
  onTimerTick?: (totalSeconds: number) => void;
  onStudyTimeTick?: (totalSeconds: number) => void;
  title?: string;
  streakDays?: number;
  dailyGoalMinutes?: number;
  minimalist?: boolean;
  isEn?: boolean;
  showKhmerTranslation?: boolean;
  onToggleTranslation?: () => void;
}

export const formatDigitalTimer = (sec: number): string => {
  const safeSec = Math.max(0, Math.floor(sec || 0));
  const hours = Math.floor(safeSec / 3600);
  const minutes = Math.floor((safeSec % 3600) / 60);
  const secs = safeSec % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const LearningHeader: React.FC<LearningHeaderProps> = ({
  onClose,
  currentIndex,
  totalCount,
  userIdentifier,
  questionId = '246635',
  initialSeconds = 0,
  onTimerTick,
  onStudyTimeTick,
  isEn = false,
  showKhmerTranslation = true,
  onToggleTranslation,
}) => {
  // Count-Up Stopwatch: ALWAYS starts at 00:00 as soon as a lesson or quiz opens
  const [seconds, setSeconds] = useState<number>(initialSeconds || 0);
  const secondsRef = useRef<number>(initialSeconds || 0);
  const tickHandler = onTimerTick || onStudyTimeTick;
  const tickHandlerRef = useRef(tickHandler);

  const effectiveQuestionId = String(questionId || (userIdentifier ? getDisplayUserId(userIdentifier) : '246635'));

  useEffect(() => {
    tickHandlerRef.current = tickHandler;
  }, [tickHandler]);

  useEffect(() => {
    const startSec = initialSeconds || 0;
    secondsRef.current = startSec;
    setSeconds(startSec);
  }, [initialSeconds]);

  // Live Count-Up Stopwatch incrementing every second from 00:00 without time limit
  useEffect(() => {
    const timer = setInterval(() => {
      secondsRef.current += 1;
      const current = secondsRef.current;
      setSeconds(current);

      if (tickHandlerRef.current) {
        tickHandlerRef.current(1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progressPercentage = Math.min(
    100,
    Math.round(((currentIndex + 1) / Math.max(totalCount, 1)) * 100)
  );

  return (
    <div 
      id="learning-view-top-header"
      className="bg-white border-b border-slate-200/90 px-3 sm:px-6 py-3 rounded-t-2xl sm:rounded-t-3xl shadow-2xs"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-4xl mx-auto w-full">
        
        {/* Left: 'X' Close button that triggers Exit Confirmation dialog */}
        <button
          type="button"
          id="btn-learning-header-close"
          onClick={onClose}
          className="p-2 -ml-1 sm:-ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          title={isEn ? "Exit exercise" : "ចាកចេញពីលំហាត់ (Exit)"}
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Center: Horizontal Progress Bar & Progress Counter (e.g. 1/10 or 1/20) */}
        <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0 max-w-xs sm:max-w-md">
          <div className="flex-1 h-2.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 p-0.5 shadow-inner">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-300 shadow-2xs"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <span 
            id="learning-header-counter"
            className="text-xs sm:text-sm font-black font-mono text-slate-700 bg-slate-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-slate-200 whitespace-nowrap shrink-0"
          >
            {currentIndex + 1}/{totalCount}
          </span>
        </div>

        {/* Right Action & Stats: Flag Toggle + Glowing Timer + Question ID */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Translation Toggle Flag Button (KH/EN) */}
          <button
            type="button"
            id="btn-translation-mode-flag"
            onClick={onToggleTranslation}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
              showKhmerTranslation
                ? 'bg-amber-50/90 border-amber-300/80 text-amber-900 hover:bg-amber-100'
                : 'bg-indigo-50/90 border-indigo-300/80 text-indigo-900 hover:bg-indigo-100'
            }`}
            title={
              showKhmerTranslation
                ? (isEn ? "Translation Mode: Khmer (ON) - Click for English Immersion" : "មុខងារបកប្រែ៖ បើក (មានភាសាខ្មែរ) - ចុចដើម្បីបិទ (English Immersion)")
                : (isEn ? "English Immersion Mode (Khmer OFF) - Click to show Khmer translation" : "មុខងារជ្រមុជភាសាអង់គ្លេសសុទ្ធ (បិទខ្មែរ) - ចុចដើម្បីបង្ហាញការបកប្រែ")
            }
          >
            <span className="text-sm sm:text-base leading-none select-none">
              {showKhmerTranslation ? '🇰🇭' : '🇬🇧'}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase hidden xs:inline">
              {showKhmerTranslation ? 'KH' : 'EN'}
            </span>
          </button>

          {/* Clean White Timer Container with Solid Black Text & Subtle Green Status Dot (Image 49) */}
          <div 
            id="exercise-live-timer-badge"
            className="bg-white border border-gray-200 shadow-sm rounded-full px-3 py-1 flex items-center gap-1.5 sm:gap-2 select-none shrink-0"
            title={isEn ? "Elapsed Exercise Timer" : "នាឡិការាប់ម៉ោងសិក្សាជាក់ស្តែង"}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-gray-900 font-medium font-mono text-xs sm:text-sm tracking-wider">
              {formatDigitalTimer(seconds)}
            </span>
          </div>

          {/* Retained Question ID (Image 46: ID: 246635) */}
          <div 
            id="exercise-question-id-badge"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-xl bg-slate-100 border border-slate-200/90 text-slate-700 font-mono text-xs font-bold shadow-2xs shrink-0"
            title={isEn ? `Question ID: ${effectiveQuestionId}` : `លេខសម្គាល់សំណួរ៖ ${effectiveQuestionId}`}
          >
            <span className="text-slate-400 text-[10px] font-semibold">ID:</span>
            <span className="text-slate-800">{effectiveQuestionId}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
