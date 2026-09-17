import { QuizQuestion } from '../types';
import {
  BEGINNER_LESSON_1_QUIZ,
  BEGINNER_LESSON_2_QUIZ,
  BEGINNER_LESSON_3_QUIZ,
} from './quiz/beginnerQuizzes';
import {
  INTERMEDIATE_LESSON_1_QUIZ,
  INTERMEDIATE_LESSON_2_QUIZ,
} from './quiz/intermediateQuizzes';
import {
  ADVANCED_LESSON_1_QUIZ,
  ADVANCED_LESSON_2_QUIZ,
} from './quiz/advancedQuizzes';

// Aggregated full comprehensive question bank across all curriculum units
// Each unit contains 20 rigorously handcrafted questions without duplicates:
// - Q1 to Q14: Core vocabulary, translation (EN->KH, KH->EN), fill-in-the-blank, and grammar
// - Q15 to Q17: Reading comprehension passage with 3 follow-up comprehension questions
// - Q18 to Q20: Audio listening comprehension, dialogue response, and interactive speaking prompt
const ALL_RAW_QUESTIONS: QuizQuestion[] = [
  ...BEGINNER_LESSON_1_QUIZ,
  ...BEGINNER_LESSON_2_QUIZ,
  ...BEGINNER_LESSON_3_QUIZ,
  ...INTERMEDIATE_LESSON_1_QUIZ,
  ...INTERMEDIATE_LESSON_2_QUIZ,
  ...ADVANCED_LESSON_1_QUIZ,
  ...ADVANCED_LESSON_2_QUIZ,
];

// Strictly remove any duplicate questions across lessons/quizzes by ID and prompt
function deduplicateQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  const seenIds = new Set<string>();
  const seenPrompts = new Set<string>();
  const unique: QuizQuestion[] = [];

  for (const q of questions) {
    const promptKey = `${q.lessonId || ''}_${q.promptEn.toLowerCase().trim()}`;
    if (!seenIds.has(q.id) && !seenPrompts.has(promptKey)) {
      seenIds.add(q.id);
      seenPrompts.add(promptKey);
      unique.push(q);
    }
  }
  return unique;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = deduplicateQuestions(ALL_RAW_QUESTIONS);

// Helper to get structured questions by lesson
export const STRUCTURED_LESSON_QUIZZES: Record<string, QuizQuestion[]> = {
  'beg-1': BEGINNER_LESSON_1_QUIZ,
  'beg-2': BEGINNER_LESSON_2_QUIZ,
  'beg-3': BEGINNER_LESSON_3_QUIZ,
  'int-1': INTERMEDIATE_LESSON_1_QUIZ,
  'int-2': INTERMEDIATE_LESSON_2_QUIZ,
  'adv-1': ADVANCED_LESSON_1_QUIZ,
  'adv-2': ADVANCED_LESSON_2_QUIZ,
};
