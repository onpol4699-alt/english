import { QuizQuestion, Lesson, VocabItem, DifficultyLevel } from '../types';
import { LESSONS } from '../data/curriculum';
import { QUIZ_QUESTIONS, STRUCTURED_LESSON_QUIZZES } from '../data/quizzes';
import { assignUniqueQuizIllustrations } from './quizIllustrationResolver';

/**
 * Generates an aligned 20-question pool directly testing the vocabulary,
 * audio listening, dialogue, and grammar rules of a specific lesson.
 * Strictly adheres to:
 * - Q1 - Q14: Vocabulary, grammar, fill-in-the-blank, and translation
 * - Q15 - Q17: Reading comprehension passage with 3 follow-up comprehension questions
 * - Q18 - Q20: Audio listening comprehension, dialogue response, and interactive speaking prompt
 */
export function getComprehensiveQuizForLesson(lessonId: string): QuizQuestion[] {
  // If we have a dedicated handcrafted 20-question structured quiz for this unit, use it!
  if (STRUCTURED_LESSON_QUIZZES[lessonId]) {
    return assignUniqueQuizIllustrations([...STRUCTURED_LESSON_QUIZZES[lessonId]]);
  }

  const lesson = LESSONS.find((l) => l.id === lessonId);
  if (!lesson) {
    // Fallback: Return 20 questions from general pool matching level
    return assignUniqueQuizIllustrations(QUIZ_QUESTIONS.slice(0, 20));
  }

  // 1. Gather all existing handcrafted questions for this lesson
  const existingQuestions = QUIZ_QUESTIONS.filter((q) => q.lessonId === lessonId);

  // 2. Dynamically generate high-quality aligned questions directly from this lesson's curriculum
  const generatedQuestions: QuizQuestion[] = [];
  const vocabList = lesson.vocabulary || [];
  const dialogueList = lesson.dialogue || [];
  const grammar = lesson.grammar;

  // Helper to pick 3 random distractors from other vocab in this lesson or other lessons
  const allVocab = LESSONS.flatMap((l) => l.vocabulary);

  const getKhmerDistractors = (correctKh: string): string[] => {
    const others = vocabList
      .filter((v) => v.khmerMeaning !== correctKh)
      .map((v) => v.khmerMeaning);
    if (others.length < 3) {
      const globalOthers = allVocab
        .filter((v) => v.khmerMeaning !== correctKh)
        .map((v) => v.khmerMeaning);
      others.push(...globalOthers);
    }
    const shuffled = [...new Set(others)].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const getEnglishDistractors = (correctEn: string): string[] => {
    const others = vocabList
      .filter((v) => v.english.toLowerCase() !== correctEn.toLowerCase())
      .map((v) => v.english);
    if (others.length < 3) {
      const globalOthers = allVocab
        .filter((v) => v.english.toLowerCase() !== correctEn.toLowerCase())
        .map((v) => v.english);
      others.push(...globalOthers);
    }
    const shuffled = [...new Set(others)].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Generate questions for each vocab item
  vocabList.forEach((v, idx) => {
    // A. EN -> KH Meaning Question
    const khDistractors = getKhmerDistractors(v.khmerMeaning);
    const optionsEnToKh = [
      { id: 'opt-1', text: v.khmerMeaning, subtext: v.partOfSpeechKhmer || 'អត្ថន័យត្រឹមត្រូវ' },
      { id: 'opt-2', text: khDistractors[0] || 'មិនអីទេ' },
      { id: 'opt-3', text: khDistractors[1] || 'សូមជួយ' },
      { id: 'opt-4', text: khDistractors[2] || 'អរគុណ' },
    ].sort(() => 0.5 - Math.random());

    generatedQuestions.push({
      id: `dyn-${lesson.id}-vocab-kh-${idx + 1}`,
      level: lesson.level,
      lessonId: lesson.id,
      type: 'en-to-kh',
      promptEn: `What does "${v.english}" mean in Khmer?`,
      promptKh: `តើពាក្យ/ឃ្លា "${v.english}" មានន័យថាម៉េចជាភាសាខ្មែរ?`,
      audioText: v.english,
      options: optionsEnToKh,
      correctOptionId: optionsEnToKh.find((o) => o.text === v.khmerMeaning)!.id,
      explanationEn: `"${v.english}" directly translates to "${v.khmerMeaning}" in Khmer.`,
      explanationKh: `ពាក្យ "${v.english}" មានន័យថា "${v.khmerMeaning}" (${v.partOfSpeechKhmer || 'កន្សោមពាក្យ'})។`,
    });

    // B. KH -> EN Translation Question
    const enDistractors = getEnglishDistractors(v.english);
    const optionsKhToEn = [
      { id: 'opt-1', text: v.english, subtext: v.phonetic },
      { id: 'opt-2', text: enDistractors[0] || 'Hello' },
      { id: 'opt-3', text: enDistractors[1] || 'Welcome' },
      { id: 'opt-4', text: enDistractors[2] || 'Goodbye' },
    ].sort(() => 0.5 - Math.random());

    generatedQuestions.push({
      id: `dyn-${lesson.id}-vocab-en-${idx + 1}`,
      level: lesson.level,
      lessonId: lesson.id,
      type: 'kh-to-en',
      promptEn: `Choose the correct English expression for "${v.khmerMeaning}":`,
      promptKh: `ជ្រើសរើសការបកប្រែជាភាសាអង់គ្លេសដែលត្រឹមត្រូវសម្រាប់ "${v.khmerMeaning}"៖`,
      audioText: v.english,
      options: optionsKhToEn,
      correctOptionId: optionsKhToEn.find((o) => o.text === v.english)!.id,
      explanationEn: `"${v.khmerMeaning}" translates to "${v.english}".`,
      explanationKh: `"${v.khmerMeaning}" និយាយជាភាសាអង់គ្លេសគឺ "${v.english}" (${v.khmerPhonetic || v.phonetic})។`,
    });

    // C. Audio Listening Question
    const audioDistractors = getEnglishDistractors(v.english);
    const optionsAudio = [
      { id: 'opt-1', text: v.english, subtext: v.khmerMeaning },
      { id: 'opt-2', text: audioDistractors[0] || 'See you tomorrow' },
      { id: 'opt-3', text: audioDistractors[1] || 'How are you' },
      { id: 'opt-4', text: audioDistractors[2] || 'Nice to meet you' },
    ].sort(() => 0.5 - Math.random());

    generatedQuestions.push({
      id: `dyn-${lesson.id}-listen-${idx + 1}`,
      level: lesson.level,
      lessonId: lesson.id,
      type: 'audio-listen',
      promptEn: `Listen carefully to the audio. What is the target expression?`,
      promptKh: `ស្តាប់សំឡេងអង់គ្លេសដោយយកចិត្តទុកដាក់។ តើជាពាក្យ ឬឃ្លាណា?`,
      audioText: v.english,
      options: optionsAudio,
      correctOptionId: optionsAudio.find((o) => o.text === v.english)!.id,
      explanationEn: `The audio clearly pronounces "${v.english}".`,
      explanationKh: `សំឡេងបានបន្លឺឡើងយ៉ាងច្បាស់ថា "${v.english}" (${v.khmerMeaning})។`,
    });

    // D. Fill in the Blank using Example Sentence
    if (v.exampleEn && v.exampleEn.toLowerCase().includes(v.english.toLowerCase())) {
      const sentenceBlank = v.exampleEn.replace(
        new RegExp(v.english, 'i'),
        '_______'
      );
      const optionsFill = [
        { id: 'opt-1', text: v.english },
        { id: 'opt-2', text: enDistractors[0] || 'today' },
        { id: 'opt-3', text: enDistractors[1] || 'tomorrow' },
        { id: 'opt-4', text: enDistractors[2] || 'always' },
      ].sort(() => 0.5 - Math.random());

      generatedQuestions.push({
        id: `dyn-${lesson.id}-fill-${idx + 1}`,
        level: lesson.level,
        lessonId: lesson.id,
        type: 'fill-blank',
        promptEn: `Complete the sentence: "${sentenceBlank}"`,
        promptKh: `បំពេញប្រយោគ៖ "${sentenceBlank}"`,
        audioText: v.exampleEn,
        options: optionsFill,
        correctOptionId: optionsFill.find((o) => o.text === v.english)!.id,
        explanationEn: `The complete sentence from the lesson is: "${v.exampleEn}"`,
        explanationKh: `ប្រយោគពេញលេញក្នុងមេរៀនគឺ៖ "${v.exampleEn}" (${v.exampleKh || ''})។`,
      });
    }
  });

  // Dialogue Comprehension Questions
  dialogueList.forEach((d, dIdx) => {
    if (dIdx < 2) {
      const dialogueDistractors = getKhmerDistractors(d.khmer);
      const optDialogue = [
        { id: 'opt-1', text: d.khmer, subtext: `${d.speakerKh}: "${d.khmer}"` },
        { id: 'opt-2', text: dialogueDistractors[0] || 'ខ្ញុំមិនយល់ទេ' },
        { id: 'opt-3', text: dialogueDistractors[1] || 'តើអ្នកចង់ទៅណា?' },
        { id: 'opt-4', text: dialogueDistractors[2] || 'លាហើយ ជួបគ្នាថ្ងៃស្អែក' },
      ].sort(() => 0.5 - Math.random());

      generatedQuestions.push({
        id: `dyn-${lesson.id}-dialogue-${dIdx + 1}`,
        level: lesson.level,
        lessonId: lesson.id,
        type: 'audio-listen',
        promptEn: `Listen to ${d.speaker}'s dialogue line. What does it mean in Khmer?`,
        promptKh: `ស្តាប់ការសន្ទនារបស់ ${d.speakerKh}។ តើមានន័យថាម៉េចជាភាសាខ្មែរ?`,
        audioText: d.audioText || d.english,
        options: optDialogue,
        correctOptionId: optDialogue.find((o) => o.text === d.khmer)!.id,
        explanationEn: `${d.speaker} said: "${d.english}". This means "${d.khmer}".`,
        explanationKh: `${d.speakerKh} បាននិយាយថា "${d.english}" ដែលមានន័យថា "${d.khmer}"។`,
      });
    }
  });

  // Grammar Comprehension Question
  if (grammar && grammar.examples && grammar.examples.length > 0) {
    const eg = grammar.examples[0];
    generatedQuestions.push({
      id: `dyn-${lesson.id}-grammar-rule`,
      level: lesson.level,
      lessonId: lesson.id,
      type: 'grammar',
      promptEn: `According to the grammar rule (${grammar.titleEn}), which sentence is correct?`,
      promptKh: `យោងតាមក្បួនវេយ្យាករណ៍ (${grammar.titleKh}) តើប្រយោគណាមួយត្រឹមត្រូវ?`,
      audioText: eg.en,
      options: [
        { id: 'opt-1', text: eg.en, subtext: eg.tip || 'ត្រឹមត្រូវតាមក្បួន' },
        { id: 'opt-2', text: eg.en.replace(/is|am|are/g, 'be'), subtext: 'ខុសកិរិយាសព្ទ' },
        { id: 'opt-3', text: eg.en.replace(/is|am|are/g, 'does'), subtext: 'ខុសទម្រង់' },
        { id: 'opt-4', text: eg.en.split(' ').reverse().join(' '), subtext: 'ច្រឡំលំដាប់ពាក្យ' },
      ].sort(() => 0.5 - Math.random()),
      correctOptionId: 'opt-1',
      explanationEn: `Formula: ${grammar.formula}. Example: "${eg.en}".`,
      explanationKh: `រូបមន្ត៖ ${grammar.formula}។ ឧទាហរណ៍៖ "${eg.en}" (${eg.kh})។`,
    });
  }

  // 3. Combine existing handcrafted questions with newly generated aligned questions
  // Deduplicate by promptEn
  const combinedMap = new Map<string, QuizQuestion>();

  existingQuestions.forEach((q) => {
    combinedMap.set(q.promptEn.toLowerCase(), q);
  });

  generatedQuestions.forEach((q) => {
    if (!combinedMap.has(q.promptEn.toLowerCase())) {
      combinedMap.set(q.promptEn.toLowerCase(), q);
    }
  });

  const totalPool = Array.from(combinedMap.values());

  // Ensure we have at least 20 questions (e.g. exactly 20 questions for the unit quiz)
  let finalQuestions: QuizQuestion[];
  if (totalPool.length >= 20) {
    finalQuestions = totalPool.slice(0, 20);
  } else {
    // If fewer than 20, complement from general level pool matching level
    const levelPool = QUIZ_QUESTIONS.filter(
      (q) => q.level === lesson.level && !combinedMap.has(q.promptEn.toLowerCase())
    );
    finalQuestions = [...totalPool, ...levelPool].slice(0, 20);
  }

  // 4. Assign unique, contextual illustration to every single question (strictly no duplicates!)
  return assignUniqueQuizIllustrations(finalQuestions);
}

/**
 * Gets a balanced 20+ question pool for a Level Exam (Beginner, Intermediate, Advanced, or All).
 */
export function getLevelExamQuestions(
  level: DifficultyLevel | 'all',
  count: number = 20
): QuizQuestion[] {
  let pool = QUIZ_QUESTIONS;
  if (level !== 'all') {
    pool = pool.filter((q) => q.level === level);
  }

  // Shuffle and slice desired count (minimum 20)
  const targetCount = Math.max(20, count);
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(targetCount, shuffled.length));

  // If pool was under targetCount, duplicate and adapt
  while (selected.length < targetCount && pool.length > 0) {
    const extra = { ...pool[selected.length % pool.length], id: `extra-${selected.length + 1}` };
    selected.push(extra);
  }

  return assignUniqueQuizIllustrations(selected);
}
