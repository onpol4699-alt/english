import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatStudyTime } from '../utils/storage';

interface ActiveStudyTimerProps {
  onTimeUpdate?: (secondsLearned: number) => void;
  dailyGoalMinutes?: number;
  variant?: 'compact' | 'full';
}

export const ActiveStudyTimer: React.FC<ActiveStudyTimerProps> = ({
  onTimeUpdate,
  dailyGoalMinutes = 15,
  variant = 'compact',
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Interval timer tracking active study time
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          // Notify parent every 5 seconds to minimize re-renders
          if (next % 5 === 0 && onTimeUpdate) {
            onTimeUpdate(5);
          }
          return next;
        });
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, onTimeUpdate]);

  const timeData = formatStudyTime(seconds);
  const goalSeconds = dailyGoalMinutes * 60;
  const progressPercent = Math.min(100, Math.round((seconds / goalSeconds) * 100));

  if (variant === 'compact') {
    return (
      <div 
        id="active-study-timer-compact"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-slate-800 border border-slate-200 shadow-xs"
        title="Live Study Timer: Tracks your active study session in real-time"
      >
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
        </div>

        <span className="font-mono text-xs font-black tracking-wider animate-rainbow-timer">
          {timeData.formatted}
        </span>

        <button
          onClick={() => setIsActive(!isActive)}
          title={isActive ? 'Pause timer' : 'Resume study timer'}
          className="p-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-600" />}
        </button>

        <button
          onClick={() => setSeconds(0)}
          title="Reset session timer"
          className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <RotateCcw className="w-2.5 h-2.5" />
        </button>
      </div>
    );
  }

  return (
    <div 
      id="active-study-timer-full"
      className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
          <Clock className={`w-6 h-6 ${isActive ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm sm:text-base">
              Active Study Stopwatch
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {isActive ? 'Tracking' : 'Paused'}
            </span>
          </div>
          <p className="font-khmer text-xs text-slate-500 mt-0.5">
            នាឡិកាវាស់ស្ទង់រយៈពេលសិក្សាជាក់ស្តែងក្នុងមេរៀន • គោលដៅប្រចាំថ្ងៃ៖ {dailyGoalMinutes} នាទី
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="text-right">
          <div className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {timeData.formatted}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1 font-khmer">
            <span>បាន {progressPercent}% នៃគោលដៅ</span>
            {progressPercent >= 100 && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`p-2 rounded-lg font-bold transition flex items-center justify-center cursor-pointer ${
              isActive 
                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
            title={isActive ? 'Pause' : 'Resume'}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setSeconds(0)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
