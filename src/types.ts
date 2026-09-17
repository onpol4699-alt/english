export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'idiom';

export interface VocabItem {
  id: string;
  english: string;
  phonetic: string;
  khmerPhonetic: string;
  khmerMeaning: string;
  partOfSpeech: PartOfSpeech;
  partOfSpeechKhmer: string;
  exampleEn: string;
  exampleKh: string;
  level: DifficultyLevel;
  topicId: string;
  notes?: string;
  imageUrl?: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  speakerKh: string;
  avatarColor: string;
  english: string;
  khmer: string;
  audioText: string;
}

export interface GrammarPoint {
  titleEn: string;
  titleKh: string;
  explanationKh: string;
  formula?: string;
  examples: {
    en: string;
    kh: string;
    tip?: string;
  }[];
}

export interface ReadingPassage {
  titleEn: string;
  titleKh: string;
  textEn: string;
  textKh: string;
  comprehensionQuestions?: {
    id: string;
    questionEn: string;
    questionKh: string;
    options: QuizOption[];
    correctOptionId: string;
    explanationEn: string;
    explanationKh: string;
  }[];
}

export interface ListeningExercise {
  id: string;
  titleEn: string;
  titleKh: string;
  audioText: string;
  phonetic?: string;
  khmerPhonetic?: string;
  khmerMeaning: string;
  tipKh?: string;
}

export interface Lesson {
  id: string;
  level: DifficultyLevel;
  levelNumber: number;
  order: number;
  titleEn: string;
  titleKh: string;
  descriptionKh: string;
  descriptionEn?: string;
  iconName: string;
  xpReward: number;
  vocabulary: VocabItem[];
  dialogue?: DialogueLine[];
  grammar?: GrammarPoint;
  imageUrl?: string;
  reading?: ReadingPassage;
  listeningExercises?: ListeningExercise[];
}

export type QuizQuestionType = 'en-to-kh' | 'kh-to-en' | 'fill-blank' | 'audio-listen' | 'grammar' | 'reading' | 'speaking';

export interface QuizOption {
  id: string;
  text: string;
  subtext?: string;
}

export interface QuizQuestion {
  id: string;
  level: DifficultyLevel;
  lessonId?: string;
  type: QuizQuestionType;
  promptEn: string;
  promptKh: string;
  audioText?: string;
  imageUrl?: string;
  options: QuizOption[];
  correctOptionId: string;
  explanationEn: string;
  explanationKh: string;
  readingPassage?: {
    titleEn: string;
    titleKh?: string;
    textEn: string;
    textKh?: string;
  };
  speakingPrompt?: {
    targetSentence: string;
    targetPhonetic?: string;
    targetKhmer: string;
    hintEn?: string;
    hintKh?: string;
  };
}

export interface QuizResult {
  score: number;
  total: number;
  xpEarned: number;
  accuracy: number;
  wrongQuestionIds: string[];
  timestamp: string;
}

export type KhmerFontId = 
  | 'modern' 
  | 'rounded' 
  | 'elegant' 
  | 'tech' 
  | 'system' 
  | 'kantumruy' 
  | 'battambang' 
  | 'hanuman' 
  | 'siemreap' 
  | 'nokora' 
  | 'moul' 
  | 'bayon';
export type ThemeColorId = 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';
export type ThemeBrightness = 'light' | 'dark' | 'warm';
export type BackgroundTheme = 'light' | 'dark' | 'modern-blue' | 'nature-green' | 'sunset';
export type KhmerFontSize = 'normal' | 'large' | 'xlarge';

export type UserGender = 'male' | 'female' | 'other' | 'unspecified' | 'prefer-not-to-say';
export type LearningGoal = 'conversation' | 'work' | 'travel' | 'study' | 'general';
export type AuthMethod = 'gmail' | 'phone' | 'telegram' | 'email' | 'student_id';
export type UserRole = 'Developer' | 'Admin' | 'Teacher' | 'Student' | 'Editor';

export interface AppMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  joinedDate: string;
  avatarUrl?: string;
  level?: DifficultyLevel;
  totalStudySeconds?: number;
  status?: 'active' | 'inactive';
  passcode?: string;
  secondaryContact?: string; // Backup email or phone
  backupIdentifiers?: string[];
  gender?: UserGender;
  country?: string;
  province?: string;
  dateOfBirth?: string;
  learningGoal?: LearningGoal;
  dailyGoalMinutes?: number;
  xp?: number;
  completedLessonsCount?: number;
  lastActiveDate?: string;
}

export interface UserAccount {
  id: string;
  userName: string;
  authMethod: AuthMethod;
  userIdentifier: string; // Gmail address, Phone Number, or Telegram handle
  email?: string;
  phoneNumber?: string;
  secondaryContact?: string;
  backupIdentifiers?: string[];
  passcode: string;
  role?: UserRole;
  gender?: UserGender;
  avatarUrl?: string;
  country?: string;
  province?: string;
  dateOfBirth?: string;
  qrToken?: string;
  createdAt: string;
  learningGoal?: LearningGoal;
  dailyGoalMinutes?: number;
  level?: DifficultyLevel;
  xp?: number;
  totalStudySeconds?: number;
  lastActiveDate?: string;
  completedLessonIds?: string[];
  masteredVocabIds?: string[];
}

export interface UserProgress {
  userName: string;
  email?: string;
  phoneNumber?: string;
  secondaryContact?: string;
  backupIdentifiers?: string[];
  role?: UserRole;
  authMethod?: AuthMethod;
  userIdentifier?: string;
  qrToken?: string;
  passcode?: string;
  isAuthenticated?: boolean;
  avatarUrl?: string;
  gender: UserGender;
  country?: string;
  province?: string;
  dateOfBirth?: string;
  learningGoal: LearningGoal;
  dailyGoalMinutes: number;
  hasCompletedOnboarding: boolean;
  currentLevel: DifficultyLevel;
  unlockedLevels: DifficultyLevel[];
  xp: number;
  totalPoints?: number;
  isDeveloperMode?: boolean;
  streakDays: number;
  lastActiveDate: string;
  totalStudySeconds: number;
  completedLessonIds: string[];
  masteredVocabIds: string[];
  savedVocabIds: string[];
  quizHistory: {
    quizId: string;
    level: DifficultyLevel;
    score: number;
    total: number;
    date: string;
    lessonId?: string;
  }[];
  speechRate: number; // 0.8 or 1.0
  khmerFont: KhmerFontId;
  themeColor: ThemeColorId;
  themeBrightness: ThemeBrightness;
  backgroundTheme: BackgroundTheme;
  khmerFontSize: KhmerFontSize;
  appLanguage?: 'km' | 'en';
  certificateId?: string;
  certificateIssuedDate?: string;
  placementCertificateId?: string;
  placementCertificateIssuedDate?: string;
  failedQuizAttempts?: number;
  quizLockedUntil?: string;
  hasCompletedPlacementTest?: boolean;
  placementTestScore?: number;
  placementAssignedLevel?: DifficultyLevel;
  activeViewRole?: UserRole;
}

export interface EnglishTense {
  id: string;
  number: number;
  tenseNameEn: string;
  tenseNameKh: string;
  category: 'present' | 'past' | 'future';
  formulaPositive: string;
  formulaNegative: string;
  formulaQuestion: string;
  signalWords: string[];
  explanationKh: string;
  explanationEn: string;
  examples: {
    en: string;
    kh: string;
    note?: string;
  }[];
  commonMistake: {
    wrong: string;
    right: string;
    explanationKh: string;
  };
  illustrationTag: string;
  iconName: string;
  imageUrl?: string;
}

export interface Badge {
  id: string;
  titleEn: string;
  titleKh: string;
  descriptionEn: string;
  descriptionKh: string;
  icon: string;
  isUnlocked: (progress: UserProgress) => boolean;
}

export type AppLogoIconKey = 'temple' | 'graduation' | 'book' | 'globe' | 'shield' | 'crown' | 'sparkles';
export type AppLogoType = 'icon' | 'emoji' | 'image';

export interface AppBrandConfig {
  appName: string;
  appNameKh: string;
  taglineEn: string;
  taglineKh: string;
  logoType: AppLogoType;
  logoIconName: AppLogoIconKey;
  logoEmoji: string;
  logoImageUrl: string;
}

export type NavigationTab = 'lessons' | 'quiz' | 'tenses' | 'flashcards' | 'dictionary' | 'analytics' | 'achievements';
