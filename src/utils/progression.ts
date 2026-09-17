import { UserProgress, DifficultyLevel } from '../types';
import { LESSONS } from '../data/curriculum';

export const BEGINNER_LESSONS = LESSONS.filter((l) => l.level === 'beginner');
export const INTERMEDIATE_LESSONS = LESSONS.filter((l) => l.level === 'intermediate');
export const ADVANCED_LESSONS = LESSONS.filter((l) => l.level === 'advanced');

// Check if all lessons of beginner are completed
export function areBeginnerLessonsDone(completedLessonIds: string[]): boolean {
  return BEGINNER_LESSONS.every((l) => completedLessonIds.includes(l.id));
}

// Check if beginner quiz is passed (at least one beginner quiz in quizHistory with >= 20 questions and score >= 80%)
export function isBeginnerQuizPassed(progress: UserProgress): boolean {
  return progress.quizHistory.some((q) => q.level === 'beginner' && (q.total >= 20 ? q.score / q.total >= 0.8 : q.score / q.total >= 0.8));
}

// Beginner level is fully completed if all its lessons are done and beginner quiz is passed
export function isBeginnerLevelFullyCompleted(progress: UserProgress): boolean {
  return areBeginnerLessonsDone(progress.completedLessonIds) && isBeginnerQuizPassed(progress);
}

// Check if all intermediate lessons are completed
export function areIntermediateLessonsDone(completedLessonIds: string[]): boolean {
  return INTERMEDIATE_LESSONS.every((l) => completedLessonIds.includes(l.id));
}

// Check if intermediate quiz is passed (at least one intermediate quiz in quizHistory with >= 20 questions and score >= 80%)
export function isIntermediateQuizPassed(progress: UserProgress): boolean {
  return progress.quizHistory.some((q) => q.level === 'intermediate' && (q.total >= 20 ? q.score / q.total >= 0.8 : q.score / q.total >= 0.8));
}

// Intermediate level is fully completed if all its lessons are done and quiz is passed
export function isIntermediateLevelFullyCompleted(progress: UserProgress): boolean {
  return areIntermediateLessonsDone(progress.completedLessonIds) && isIntermediateQuizPassed(progress);
}

// Check if all advanced lessons are completed
export function areAdvancedLessonsDone(completedLessonIds: string[]): boolean {
  return ADVANCED_LESSONS.every((l) => completedLessonIds.includes(l.id));
}

// Check if advanced quiz is passed (at least one advanced quiz in quizHistory with >= 20 questions and score >= 80%)
export function isAdvancedQuizPassed(progress: UserProgress): boolean {
  return progress.quizHistory.some((q) => q.level === 'advanced' && (q.total >= 20 ? q.score / q.total >= 0.8 : q.score / q.total >= 0.8));
}

// Advanced level is fully completed
export function isAdvancedLevelFullyCompleted(progress: UserProgress): boolean {
  return areAdvancedLessonsDone(progress.completedLessonIds) && isAdvancedQuizPassed(progress);
}

// Sequential level accessibility:
// - Developer Mode: Unlocks ALL levels automatically without restriction
// - Placement Test: Unlocks levels according to placement test assignment
// - Sequential progression: Level 2 unlocked when Level 1 complete; Level 3 unlocked when Level 2 complete
export function isLevelUnlocked(level: DifficultyLevel, progress: UserProgress): boolean {
  const currentRole = progress.activeViewRole || progress.role || 'Student';

  // 1. If actively in Student role: Enforce sequential progression rules so user can test student experience
  if (currentRole === 'Student') {
    if (level === 'beginner') return true;
    if (level === 'intermediate') {
      return (
        progress.placementAssignedLevel === 'intermediate' ||
        progress.placementAssignedLevel === 'advanced' ||
        isBeginnerLevelFullyCompleted(progress)
      );
    }
    if (level === 'advanced') {
      return (
        progress.placementAssignedLevel === 'advanced' ||
        (isBeginnerLevelFullyCompleted(progress) && isIntermediateLevelFullyCompleted(progress))
      );
    }
    return false;
  }

  // 2. Developer, Teacher, or Admin: Automatically unlock ALL levels with zero locks for review
  const isPrivileged = currentRole === 'Developer' || currentRole === 'Teacher' || currentRole === 'Admin';
  if (isPrivileged) {
    return true;
  }

  // 3. Fallback
  if (level === 'beginner') return true;
  return false;
}

// Compute unlocked levels array dynamically based on progress
export function getUnlockedLevelsList(progress: UserProgress): DifficultyLevel[] {
  const currentRole = progress.activeViewRole || progress.role || 'Student';

  if (currentRole === 'Student') {
    const list: DifficultyLevel[] = ['beginner'];
    if (
      progress.placementAssignedLevel === 'intermediate' ||
      progress.placementAssignedLevel === 'advanced' ||
      isBeginnerLevelFullyCompleted(progress)
    ) {
      list.push('intermediate');
    }
    if (
      progress.placementAssignedLevel === 'advanced' ||
      (isBeginnerLevelFullyCompleted(progress) && isIntermediateLevelFullyCompleted(progress))
    ) {
      list.push('advanced');
    }
    return list;
  }

  return ['beginner', 'intermediate', 'advanced'];
}

// Has user successfully finished all 3 levels?
export function areAllLevelsCompleted(progress: UserProgress): boolean {
  return isBeginnerLevelFullyCompleted(progress) &&
         isIntermediateLevelFullyCompleted(progress) &&
         isAdvancedLevelFullyCompleted(progress);
}

// Grade calculation interface
export interface GradeResult {
  grade: 'A' | 'B' | 'C' | 'D';
  letter: string;
  labelEn: string;
  labelKh: string;
  distinctionEn: string;
  distinctionKh: string;
  averageScorePercent: number;
  totalQuizzesTaken: number;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export function calculateOverallGrade(progress: UserProgress): GradeResult {
  if (!progress.quizHistory || progress.quizHistory.length === 0) {
    return {
      grade: 'D',
      letter: 'D',
      labelEn: 'Grade D (Pass)',
      labelKh: 'និទ្ទេស D (ជាប់)',
      distinctionEn: 'Satisfactory Passing Standard',
      distinctionKh: 'ឆ្លងកាត់កម្រិតស្តង់ដារបឋម',
      averageScorePercent: 0,
      totalQuizzesTaken: 0,
      badgeBg: 'bg-slate-100',
      badgeBorder: 'border-slate-300',
      badgeText: 'text-slate-700',
    };
  }

  const totalScore = progress.quizHistory.reduce((acc, q) => acc + q.score, 0);
  const totalQuestions = progress.quizHistory.reduce((acc, q) => acc + q.total, 0);
  const averageScorePercent = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  if (averageScorePercent >= 90) {
    return {
      grade: 'A',
      letter: 'A',
      labelEn: 'Grade A (High Distinction / Excellent)',
      labelKh: 'និទ្ទេស A (ល្អប្រសើរឥតខ្ចោះ)',
      distinctionEn: 'Graduated with Highest Academic Honors & Excellence',
      distinctionKh: 'បញ្ចប់ការសិក្សាដោយទទួលបានកិត្តិយស និងនិទ្ទេសល្អប្រសើរខ្ពស់បំផុត',
      averageScorePercent,
      totalQuizzesTaken: progress.quizHistory.length,
      badgeBg: 'bg-amber-50',
      badgeBorder: 'border-amber-400',
      badgeText: 'text-amber-800',
    };
  } else if (averageScorePercent >= 80) {
    return {
      grade: 'B',
      letter: 'B',
      labelEn: 'Grade B (Distinction / Very Good)',
      labelKh: 'និទ្ទេស B (ល្អណាស់)',
      distinctionEn: 'Graduated with Distinction & High Competency',
      distinctionKh: 'បញ្ចប់ការសិក្សាដោយទទួលបាននិទ្ទេសល្អណាស់ និងសមត្ថភាពខ្ពស់',
      averageScorePercent,
      totalQuizzesTaken: progress.quizHistory.length,
      badgeBg: 'bg-emerald-50',
      badgeBorder: 'border-emerald-400',
      badgeText: 'text-emerald-800',
    };
  } else if (averageScorePercent >= 70) {
    return {
      grade: 'C',
      letter: 'C',
      labelEn: 'Grade C (Merit / Good)',
      labelKh: 'និទ្ទេស C (ល្អ)',
      distinctionEn: 'Graduated with Commendable Merit',
      distinctionKh: 'បញ្ចប់ការសិក្សាដោយទទួលបាននិទ្ទេសល្អគួរឱ្យកោតសរសើរ',
      averageScorePercent,
      totalQuizzesTaken: progress.quizHistory.length,
      badgeBg: 'bg-blue-50',
      badgeBorder: 'border-blue-400',
      badgeText: 'text-blue-800',
    };
  } else {
    return {
      grade: 'D',
      letter: 'D',
      labelEn: 'Grade D (Pass)',
      labelKh: 'និទ្ទេស D (ជាប់)',
      distinctionEn: 'Graduated with Passing Competence',
      distinctionKh: 'បញ្ចប់ការសិក្សាដោយទទួលបានលទ្ធផលជាប់ជាស្ថាពរ',
      averageScorePercent,
      totalQuizzesTaken: progress.quizHistory.length,
      badgeBg: 'bg-stone-100',
      badgeBorder: 'border-stone-300',
      badgeText: 'text-stone-800',
    };
  }
}

export interface LevelProgressStats {
  totalLessons: number;
  completedLessons: number;
  totalTests: number;
  completedTests: number;
  totalUnits: number;
  completedUnits: number;
  percentage: number;
  isFullyComplete: boolean;
}

/**
 * Calculates comprehensive level progress based on BOTH completed lessons AND completed tests/quizzes:
 * Total Progress % = ((Completed Lessons + Completed Tests) / (Total Lessons + Total Tests)) * 100
 */
export function calculateLevelProgress(level: DifficultyLevel, progress: UserProgress): LevelProgressStats {
  const levelLessons = LESSONS.filter((l) => l.level === level);
  const totalLessons = levelLessons.length;
  const completedLessons = levelLessons.filter((l) =>
    (progress.completedLessonIds || []).includes(l.id)
  ).length;

  // Each curriculum lesson is accompanied by a mastery quiz/test
  const totalTests = levelLessons.length;

  // Passed tests for this level (accuracy >= 50%)
  const passedQuizzes = (progress.quizHistory || []).filter(
    (q) => q.level === level && (q.score / Math.max(q.total, 1)) >= 0.5
  );

  // Lesson IDs that have a passed quiz
  const lessonsWithPassedTest = new Set(
    passedQuizzes.map((q) => q.lessonId).filter(Boolean)
  );

  // Completed tests count (takes maximum of lessons with test passed or passed quizzes count, capped at totalTests)
  const completedTests = Math.min(
    totalTests,
    Math.max(lessonsWithPassedTest.size, passedQuizzes.length)
  );

  const totalUnits = totalLessons + totalTests;
  const completedUnits = completedLessons + completedTests;
  const percentage = totalUnits > 0 ? Math.min(100, Math.round((completedUnits / totalUnits) * 100)) : 0;
  const isFullyComplete = completedLessons === totalLessons && completedTests >= 1 && percentage === 100;

  return {
    totalLessons,
    completedLessons,
    totalTests,
    completedTests,
    totalUnits,
    completedUnits,
    percentage,
    isFullyComplete,
  };
}
