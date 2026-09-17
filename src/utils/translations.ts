/**
 * Application Translations for Khmer (km) and English (en)
 * Ensures full UI string synchronization when toggling language
 */

export interface UiTranslations {
  // Navigation
  navLessons: string;
  navQuiz: string;
  navFlashcards: string;
  navDictionary: string;
  navRankings: string;
  navAnalytics: string;

  // Direct Menu Shorthands
  lessons: string;
  quiz: string;
  flashcards: string;
  vocabulary: string;
  analytics: string;
  rankings: string;
  tenses: string;
  featuresMenu: string;
  featuresMenuFull: string;
  
  // Roles
  roleStudent: string;
  roleTeacher: string;
  roleDeveloper: string;
  roleAdmin: string;
  switchRole: string;

  // Header & Search
  appTitle: string;
  appSubtitle: string;
  searchPlaceholder: string;
  searchClear: string;
  searchResultsFor: string;
  noResultsFound: string;
  foundMatches: string;

  // Tabs
  tabAll: string;
  tabBeginner: string;
  tabIntermediate: string;
  tabAdvanced: string;
  tabTenses: string;
  tabGrammar: string;

  // Level Cards
  beginnerLevel: string;
  intermediateLevel: string;
  advancedLevel: string;
  unit: string;
  lessonsList: string;
  selectLessons: string;
  collapseLessons: string;
  expandLessons: string;
  studyLesson: string;
  takeQuiz: string;
  completed: string;
  locked: string;
  lockedIntermediateNotice: string;
  lockedAdvancedNotice: string;
  openModal: string;
  completedLessonsCount: string;

  // 12 Tenses
  tensesTitle: string;
  tensesSubtitle: string;
  formula: string;
  studyTense: string;
  tenseQuiz: string;
  tenseCategoryPresent: string;
  tenseCategoryPast: string;
  tenseCategoryFuture: string;

  // Lesson Modal
  tabVocabulary: string;
  tabDialogue: string;
  tabGrammarExplanation: string;
  previous: string;
  next: string;
  finishLesson: string;
  listenAudio: string;
  slowSpeed: string;
  normalSpeed: string;
  standardPhonetics: string;
  pronouncedAs: string;
  exampleSentence: string;
  close: string;
  lessonCompletedNotice: string;
  
  // Certificate Banner
  certBannerTitle: string;
  certBannerDesc: string;
  viewCertificate: string;
}

export const TRANSLATIONS: Record<'km' | 'en', UiTranslations> = {
  km: {
    navLessons: '📚 រៀន',
    navQuiz: '🎯 តេស្ត',
    navFlashcards: '🎴 ប័ណ្ណពាក្យ',
    navDictionary: '📖 វចនានុក្រម',
    navRankings: '🏆 ចំណាត់ថ្នាក់',
    navAnalytics: '📊 ស្ថិតិសិក្សា',

    lessons: 'មេរៀន',
    quiz: 'តេស្ត',
    flashcards: 'ប័ណ្ណពាក្យ',
    vocabulary: 'វចនានុក្រម',
    analytics: 'ស្ថិតិសិក្សា',
    rankings: 'ចំណាត់ថ្នាក់',
    tenses: 'កាលទាំង ១២',
    featuresMenu: 'បញ្ជីមុខងារ',
    featuresMenuFull: '☰ បញ្ជីមុខងារសិក្សា',

    roleStudent: 'សិស្ស (Student)',
    roleTeacher: 'គ្រូបង្រៀន (Teacher)',
    roleDeveloper: 'អ្នកអភិវឌ្ឍ (Developer)',
    roleAdmin: 'អ្នកគ្រប់គ្រង (Admin)',
    switchRole: 'ប្តូរតួនាទី',

    appTitle: 'សាលារៀនឌីជីថលភាសាអង់គ្លេស',
    appSubtitle: 'រៀនភាសាអង់គ្លេសជាប្រព័ន្ធពីកម្រិតដំបូងដល់កម្រិតខ្ពស់ជាមួយ Angkor English',
    searchPlaceholder: 'ស្វែងរកមេរៀន ពាក្យសព្ទ ឬវេយ្យាករណ៍...',
    searchClear: 'សម្អាត',
    searchResultsFor: 'លទ្ធផលស្វែងរកសម្រាប់',
    noResultsFound: 'មិនមានមេរៀនណាដែលត្រូវនឹងពាក្យស្វែងរកឡើយ',
    foundMatches: 'មេរៀនត្រូវគ្នា',

    tabAll: 'ទាំងអស់',
    tabBeginner: 'កម្រិតដំបូង',
    tabIntermediate: 'កម្រិតមធ្យម',
    tabAdvanced: 'កម្រិតខ្ពស់',
    tabTenses: 'កាលទាំង ១២',
    tabGrammar: 'វេយ្យាករណ៍គ្រឹះ',

    beginnerLevel: 'កម្រិតដំបូង (Beginner)',
    intermediateLevel: 'កម្រិតមធ្យម (Intermediate)',
    advancedLevel: 'កម្រិតខ្ពស់ (Advanced)',
    unit: 'មេរៀនទី',
    lessonsList: 'បញ្ជីមេរៀន',
    selectLessons: 'ចុចជ្រើសរើសមេរៀន',
    collapseLessons: 'បង្រួមបញ្ជីមេរៀន',
    expandLessons: 'ពង្រីកមើលមេរៀន',
    studyLesson: 'រៀន',
    takeQuiz: 'Quiz',
    completed: 'បានរៀនចប់',
    locked: 'បានចាក់សោ',
    lockedIntermediateNotice: 'កម្រិតមធ្យមត្រូវបានចាក់សោ! សូមរៀនចប់កម្រិតដំបូង ឬប្តូរ Role ទៅកាន់ Teacher/Developer ដើម្បីចូលរៀនភ្លាមៗ។',
    lockedAdvancedNotice: 'កម្រិតខ្ពស់ត្រូវបានចាក់សោ! សូមរៀនចប់កម្រិតមធ្យម ឬប្តូរ Role ទៅកាន់ Teacher/Developer ដើម្បីចូលរៀនភ្លាមៗ។',
    openModal: 'បើកផ្ទាំងធំ',
    completedLessonsCount: 'មេរៀនបានរៀនចប់',

    tensesTitle: 'វេយ្យាករណ៍កាលទាំង ១២ (12 English Tenses)',
    tensesSubtitle: 'រូបមន្តកាលស្រប បដិសេធ សំណួរ និងសំឡេងបញ្ចេញសម្លេងគំរូជាក់ស្តែង',
    formula: 'រូបមន្ត',
    studyTense: 'រៀនកាល',
    tenseQuiz: 'តេស្តកាល',
    tenseCategoryPresent: 'បច្ចុប្បន្ន',
    tenseCategoryPast: 'អតីតកាល',
    tenseCategoryFuture: 'អនាគតកាល',

    tabVocabulary: 'ពាក្យសព្ទ (Vocab)',
    tabDialogue: 'ការសន្ទនា (Dialogue)',
    tabGrammarExplanation: 'វេយ្យាករណ៍ (Grammar)',
    previous: 'ថយក្រោយ',
    next: 'បន្ទាប់',
    finishLesson: 'បញ្ចប់មេរៀន (+XP)',
    listenAudio: 'ស្តាប់សំឡេង',
    slowSpeed: 'យឺត',
    normalSpeed: 'ធម្មតា',
    standardPhonetics: 'ការបញ្ចេញសំឡេងបែបស្តង់ដារអន្តរជាតិ (Standard English IPA)',
    pronouncedAs: 'អានថា',
    exampleSentence: 'ឧទាហរណ៍ជាក់ស្តែង',
    close: 'បិទ',
    lessonCompletedNotice: 'រៀនចប់មេរៀននេះដើម្បីទទួលបាន',

    certBannerTitle: 'រៀនចប់កម្រិតដំបូងគ្រប់ ១០០% នឹងទទួលបានវិញ្ញាបនបត្រជូន',
    certBannerDesc: 'រៀនចប់រាល់មេរៀន និងប្រឡងជាប់ Quiz កម្រិតដំបូង (Beginner) ១០០% ដើម្បីទទួលបានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការ',
    viewCertificate: 'មើលវិញ្ញាបនបត្រ',
  },
  en: {
    navLessons: '📚 Lessons',
    navQuiz: '🎯 Quiz',
    navFlashcards: '🎴 Flashcards',
    navDictionary: '📖 Vocabulary',
    navRankings: '🏆 Rankings',
    navAnalytics: '📊 Analytics',

    lessons: 'Lessons',
    quiz: 'Quiz',
    flashcards: 'Flashcards',
    vocabulary: 'Vocabulary',
    analytics: 'Analytics',
    rankings: 'Rankings',
    tenses: '12 Tenses',
    featuresMenu: 'Features',
    featuresMenuFull: '☰ Learning Features',

    roleStudent: 'Student',
    roleTeacher: 'Teacher',
    roleDeveloper: 'Developer',
    roleAdmin: 'Admin',
    switchRole: 'Switch Role',

    appTitle: 'English Learning Academy',
    appSubtitle: 'Master English systematically from beginner to advanced with Angkor English',
    searchPlaceholder: 'Search lessons, vocabulary, grammar topics...',
    searchClear: 'Clear',
    searchResultsFor: 'Search results for',
    noResultsFound: 'No lessons matching your search query',
    foundMatches: 'matching lessons',

    tabAll: 'All Modules',
    tabBeginner: 'Beginner',
    tabIntermediate: 'Intermediate',
    tabAdvanced: 'Advanced',
    tabTenses: '12 Tenses',
    tabGrammar: 'Grammar Foundations',

    beginnerLevel: 'Beginner Foundation',
    intermediateLevel: 'Intermediate Mastery',
    advancedLevel: 'Advanced Fluency',
    unit: 'Unit',
    lessonsList: 'Lessons List',
    selectLessons: 'Select Lessons',
    collapseLessons: 'Collapse Lessons',
    expandLessons: 'Expand Lessons',
    studyLesson: 'Study',
    takeQuiz: 'Quiz',
    completed: 'Completed',
    locked: 'Locked',
    lockedIntermediateNotice: 'Intermediate level is locked. Complete Beginner first or switch to Teacher/Developer role to unlock immediately.',
    lockedAdvancedNotice: 'Advanced level is locked. Complete Intermediate first or switch to Teacher/Developer role to unlock immediately.',
    openModal: 'Full View',
    completedLessonsCount: 'Completed Lessons',

    tensesTitle: '12 English Tenses Master Guide',
    tensesSubtitle: 'Complete active formulas, negative forms, questions, and native audio samples',
    formula: 'Formula',
    studyTense: 'Study Tense',
    tenseQuiz: 'Tense Quiz',
    tenseCategoryPresent: 'Present',
    tenseCategoryPast: 'Past',
    tenseCategoryFuture: 'Future',

    tabVocabulary: 'Vocabulary',
    tabDialogue: 'Dialogue',
    tabGrammarExplanation: 'Grammar',
    previous: 'Previous',
    next: 'Next',
    finishLesson: 'Complete Lesson (+XP)',
    listenAudio: 'Listen',
    slowSpeed: 'Slow',
    normalSpeed: 'Normal',
    standardPhonetics: 'Standard English International Phonetic Alphabet (IPA)',
    pronouncedAs: 'Pronounced as',
    exampleSentence: 'Real-world Example',
    close: 'Close',
    lessonCompletedNotice: 'Complete this lesson to earn',

    certBannerTitle: 'Complete 100% of Beginner Level to Earn Your Official Certificate',
    certBannerDesc: 'Finish all beginner lessons and pass the level quiz to receive your verified completion certificate with honors distinction',
    viewCertificate: 'View Certificate',
  },
};

export function getTranslation(lang?: 'km' | 'en'): UiTranslations {
  return TRANSLATIONS[lang === 'en' ? 'en' : 'km'];
}
