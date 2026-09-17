import React from 'react';
import { UserProgress } from '../types';
import { WeeklyStudyPlanTable } from './WeeklyStudyPlanTable';

interface StudyAnalyticsViewProps {
  progress: UserProgress;
  onNavigateToLessons?: () => void;
  onNavigateToQuiz?: () => void;
}

export const StudyAnalyticsView: React.FC<StudyAnalyticsViewProps> = ({
  progress,
}) => {
  const isEn = progress.appLanguage === 'en';

  return (
    <div className="w-full max-w-none px-2 sm:px-4 py-2 sm:py-3 space-y-3 animate-in fade-in duration-200">
      {/* 
        Weekly English Study Plan Grid (ផែនការសិក្សាភាសាអង់គ្លេសប្រចាំសប្តាហ៍)
        Contains:
        - Compact container layout (p-4 space-y-3)
        - Navy Title Typography: "ផែនការសិក្សាភាសាអង់គ្លេសប្រចាំសប្ដាហ៍ (WEEKLY ENGLISH TIMETABLE GRID)"
        - Left: Weekly History Log Dropdown
        - Far-Right: [💾 រក្សាទុក] & [🖨️ បោះពុម្ព] compact buttons
        - Mobile Responsive Stacking & No-Clipping Layout (Image 44 Fix)
        - Full localStorage Save logic & A4 Printable Sheet
      */}
      <WeeklyStudyPlanTable progress={progress} isEn={isEn} />
    </div>
  );
};
