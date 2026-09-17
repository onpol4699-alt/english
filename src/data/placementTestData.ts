import { DifficultyLevel } from '../types';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface PlacementQuestion {
  id: string;
  order: number;
  cefr: CefrLevel;
  targetLevel: DifficultyLevel;
  isListening?: boolean;
  listeningScript?: string;
  isReading?: boolean;
  readingPassage?: {
    titleEn: string;
    titleKh?: string;
    textEn: string;
    textKh?: string;
  };
  promptEn: string;
  promptKh: string;
  contextSentence?: string;
  audioText?: string;
  options: {
    id: string;
    textEn: string;
    textKh?: string;
  }[];
  correctOptionId: string;
  explanationKh: string;
}

export const PLACEMENT_TEST_DURATION_SECONDS = 20 * 60; // 20 minutes total countdown (1200 seconds)

export const PLACEMENT_TEST_QUESTIONS: PlacementQuestion[] = [
  // -------------------------------------------------------------
  // PART 1: A1 - Elementary Beginner (កម្រិតដំបូងបង្អស់)
  // -------------------------------------------------------------
  {
    id: 'pt-1',
    order: 1,
    cefr: 'A1',
    targetLevel: 'beginner',
    promptEn: 'Choose the correct form of the verb "to be": "She ______ a student at Angkor Academy."',
    promptKh: 'ជ្រើសរើសកិរិយាសព្ទ "to be" ដែលត្រឹមត្រូវ៖ "She ______ a student at Angkor Academy."',
    contextSentence: 'She ______ a student at Angkor Academy.',
    audioText: 'She is a student at Angkor Academy.',
    options: [
      { id: 'opt-a', textEn: 'is', textKh: 'គឺ / ជា (ប្រើជាមួយ He/She/It)' },
      { id: 'opt-b', textEn: 'are', textKh: 'គឺ / ជា (ប្រើជាមួយ You/We/They)' },
      { id: 'opt-c', textEn: 'am', textKh: 'គឺ / ជា (ប្រើជាមួយ I)' },
      { id: 'opt-d', textEn: 'be', textKh: 'ទម្រង់ដើម' },
    ],
    correctOptionId: 'opt-a',
    explanationKh: 'ប្រធានឯកវចនៈ "She" ត្រូវប្រើប្រាស់ជាមួយកិរិយាសព្ទ "is" ក្នុង Simple Present Tense។',
  },
  {
    id: 'pt-2',
    order: 2,
    cefr: 'A1',
    targetLevel: 'beginner',
    promptEn: 'What does the question "How are you doing today?" mean?',
    promptKh: 'តើសំណួរ "How are you doing today?" មានន័យដូចម្តេច?',
    contextSentence: 'How are you doing today?',
    audioText: 'How are you doing today?',
    options: [
      { id: 'opt-a', textEn: 'How do you do your job?', textKh: 'តើអ្នកធ្វើការងាររបស់អ្នកដោយរបៀបណា?' },
      { id: 'opt-b', textEn: 'How are you feeling / How are you?', textKh: 'តើអ្នកសុខសប្បាយជាទេថ្ងៃនេះ?' },
      { id: 'opt-c', textEn: 'Where are you going?', textKh: 'តើអ្នកកំពុងទៅណា?' },
      { id: 'opt-d', textEn: 'What are you doing now?', textKh: 'តើអ្នកកំពុងធ្វើអ្វីឥឡូវនេះ?' },
    ],
    correctOptionId: 'opt-b',
    explanationKh: '"How are you doing?" គឺជាឃ្លាសួរនាំសុខទុក្ខទូទៅដែលមានន័យស្មើនឹង "តើអ្នកសុខសប្បាយជាទេ?"។',
  },
  {
    id: 'pt-3',
    order: 3,
    cefr: 'A1',
    targetLevel: 'beginner',
    promptEn: 'Select the correct plural form of "child":',
    promptKh: 'ជ្រើសរើសទម្រង់ពហុវចនៈ (Plural) នៃពាក្យ "child" (ក្មេង)៖',
    contextSentence: 'There are five ______ playing in the school garden.',
    audioText: 'There are five children playing in the school garden.',
    options: [
      { id: 'opt-a', textEn: 'childs' },
      { id: 'opt-b', textEn: 'childrens' },
      { id: 'opt-c', textEn: 'children', textKh: 'ក្មេងៗ (ពហុវចនៈមិនទៀងទាត់)' },
      { id: 'opt-d', textEn: 'childes' },
    ],
    correctOptionId: 'opt-c',
    explanationKh: 'ពាក្យ "child" ជា Irregular Noun ដែលទម្រង់ពហុវចនៈរបស់វាគឺ "children" (មិនថែម -s ឡើយ)។',
  },

  // -------------------------------------------------------------
  // PART 2: A2 - High Beginner / Elementary (កម្រិតដំបូងមធ្យម)
  // -------------------------------------------------------------
  {
    id: 'pt-4',
    order: 4,
    cefr: 'A2',
    targetLevel: 'beginner',
    promptEn: 'Fill in the blank with the correct past tense: "Yesterday, Sovan ______ to Siem Reap."',
    promptKh: 'បំពេញចន្លោះដោយប្រើកិរិយាសព្ទអតីតកាលត្រឹមត្រូវ៖ "Yesterday, Sovan ______ to Siem Reap."',
    contextSentence: 'Yesterday, Sovan ______ to Siem Reap.',
    audioText: 'Yesterday, Sovan went to Siem Reap.',
    options: [
      { id: 'opt-a', textEn: 'go' },
      { id: 'opt-b', textEn: 'goes' },
      { id: 'opt-c', textEn: 'went', textKh: 'បានទៅ (អតីតកាលនៃ go)' },
      { id: 'opt-d', textEn: 'gone' },
    ],
    correctOptionId: 'opt-c',
    explanationKh: 'សញ្ញាសម្គាល់ "Yesterday" តម្រូវឱ្យប្រើ Past Simple (V2) ដូច្នេះ "go" ក្លាយជា "went"។',
  },
  {
    id: 'pt-5',
    order: 5,
    cefr: 'A2',
    targetLevel: 'beginner',
    promptEn: 'Choose the correct preposition: "Our English class starts ______ 8:30 AM."',
    promptKh: 'ជ្រើសរើសធ្នាក់ (Preposition) ដែលត្រឹមត្រូវសម្រាប់ម៉ោង៖ "Our English class starts ______ 8:30 AM."',
    contextSentence: 'Our English class starts ______ 8:30 AM.',
    audioText: 'Our English class starts at 8:30 AM.',
    options: [
      { id: 'opt-a', textEn: 'at', textKh: 'at (ប្រើជាមួយពេលវេលាម៉ោងជាក់លាក់)' },
      { id: 'opt-b', textEn: 'on', textKh: 'on (ប្រើជាមួយថ្ងៃ/កាលបរិច្ឆេទ)' },
      { id: 'opt-c', textEn: 'in', textKh: 'in (ប្រើជាមួយខែ/ឆ្នាំ/រដូវ)' },
      { id: 'opt-d', textEn: 'for' },
    ],
    correctOptionId: 'opt-a',
    explanationKh: 'ចំពោះពេលវេលាម៉ោងជាក់លាក់ (Specific time) យើងត្រូវប្រើធ្នាក់ "at" ជានិច្ច (at 8:30 AM)។',
  },
  {
    id: 'pt-6',
    order: 6,
    cefr: 'A2',
    targetLevel: 'beginner',
    promptEn: 'Complete the sentence: "Sreypov doesn\'t have ______ brothers or sisters."',
    promptKh: 'ជ្រើសរើសចម្លើយត្រឹមត្រូវក្នុងប្រយោគបដិសេធ៖ "Sreypov doesn\'t have ______ brothers or sisters."',
    contextSentence: "Sreypov doesn't have ______ brothers or sisters.",
    audioText: "Sreypov doesn't have any brothers or sisters.",
    options: [
      { id: 'opt-a', textEn: 'some', textKh: 'some (ច្រើនប្រើក្នុងប្រយោគស្រប)' },
      { id: 'opt-b', textEn: 'any', textKh: 'any (ប្រើក្នុងប្រយោគបដិសេធ/សំណួរ)' },
      { id: 'opt-c', textEn: 'much' },
      { id: 'opt-d', textEn: 'a' },
    ],
    correctOptionId: 'opt-b',
    explanationKh: 'នៅក្នុងប្រយោគបដិសេធ (Negative sentence) ដែលមានពាក្យ "doesn\'t have" យើងប្រើ "any"។',
  },

  // -------------------------------------------------------------
  // PART 3: B1 - Intermediate (កម្រិតមធ្យម)
  // -------------------------------------------------------------
  {
    id: 'pt-7',
    order: 7,
    cefr: 'B1',
    targetLevel: 'intermediate',
    promptEn: 'Choose the correct tense: "I ______ English for 3 years, and I still love it."',
    promptKh: 'ជ្រើសរើសកាលត្រឹមត្រូវសម្រាប់សកម្មភាពចាប់ពីអតីតកាលរហូតដល់បច្ចុប្បន្ន៖ "I ______ English for 3 years, and I still love it."',
    contextSentence: 'I ______ English for 3 years, and I still love it.',
    audioText: 'I have studied English for 3 years, and I still love it.',
    options: [
      { id: 'opt-a', textEn: 'studied' },
      { id: 'opt-b', textEn: 'have studied', textKh: 'Present Perfect (have + V3)' },
      { id: 'opt-c', textEn: 'study' },
      { id: 'opt-d', textEn: 'was studying' },
    ],
    correctOptionId: 'opt-b',
    explanationKh: 'សញ្ញាសម្គាល់ "for 3 years" បង្ហាញពីសកម្មភាពដែលបានចាប់ផ្តើមក្នុងអតីតកាល ហើយនៅតែបន្តរហូតដល់បច្ចុប្បន្ន (Present Perfect: have/has + V3)។',
  },
  {
    id: 'pt-8',
    order: 8,
    cefr: 'B1',
    targetLevel: 'intermediate',
    promptEn: 'Complete the First Conditional: "If it rains this afternoon, we ______ the meeting indoors."',
    promptKh: 'បំពេញលក្ខខណ្ឌ Conditional Type 1៖ "If it rains this afternoon, we ______ the meeting indoors."',
    contextSentence: 'If it rains this afternoon, we ______ the meeting indoors.',
    audioText: 'If it rains this afternoon, we will hold the meeting indoors.',
    options: [
      { id: 'opt-a', textEn: 'held' },
      { id: 'opt-b', textEn: 'would hold' },
      { id: 'opt-c', textEn: 'will hold', textKh: 'will + V-bare (លទ្ធផលក្នុងពេលអនាគត)' },
      { id: 'opt-d', textEn: 'hold' },
    ],
    correctOptionId: 'opt-c',
    explanationKh: 'រូបមន្ត Conditional 1: If + Present Simple, Future Simple (will + Verb) សម្រាប់បង្ហាញពីលទ្ធផលដែលអាចកើតឡើងពិតប្រាកដ។',
  },
  {
    id: 'pt-9',
    order: 9,
    cefr: 'B1',
    targetLevel: 'intermediate',
    promptEn: 'What is the meaning of the phrasal verb "give up" in: "Never give up on your dreams"?',
    promptKh: 'តើកន្សោម "give up" ក្នុងឃ្លា "Never give up on your dreams" មានន័យថាយ៉ាងណា?',
    contextSentence: 'Never give up on your dreams.',
    audioText: 'Never give up on your dreams.',
    options: [
      { id: 'opt-a', textEn: 'give something to someone', textKh: 'ប្រគល់របស់ឱ្យនរណាម្នាក់' },
      { id: 'opt-b', textEn: 'stop trying / surrender', textKh: 'បោះបង់ចោល / ឈប់ប្រឹងប្រែង' },
      { id: 'opt-c', textEn: 'start a new journey', textKh: 'ចាប់ផ្តើមដំណើរថ្មី' },
      { id: 'opt-d', textEn: 'wake up early', textKh: 'ក្រោកពីព្រលឹម' },
    ],
    correctOptionId: 'opt-b',
    explanationKh: 'Phrasal verb "give up" មានន័យថា បោះបង់ ឬឈប់តស៊ូព្យាយាម (to stop doing or attempting something)។',
  },

  // -------------------------------------------------------------
  // PART 4: B2 - Upper Intermediate (កម្រិតមធ្យមកម្រិតខ្ពស់)
  // -------------------------------------------------------------
  {
    id: 'pt-10',
    order: 10,
    cefr: 'B2',
    targetLevel: 'intermediate',
    promptEn: 'Choose the correct Passive Voice form: "The new bridge across the Mekong ______ by the end of next year."',
    promptKh: 'ជ្រើសរើសទម្រង់ Passive Voice ត្រឹមត្រូវ៖ "The new bridge across the Mekong ______ by the end of next year."',
    contextSentence: 'The new bridge across the Mekong ______ by the end of next year.',
    audioText: 'The new bridge across the Mekong will have been completed by the end of next year.',
    options: [
      { id: 'opt-a', textEn: 'will be completing' },
      { id: 'opt-b', textEn: 'will have been completed', textKh: 'Future Perfect Passive' },
      { id: 'opt-c', textEn: 'is completed' },
      { id: 'opt-d', textEn: 'completed' },
    ],
    correctOptionId: 'opt-b',
    explanationKh: 'សញ្ញា "by the end of next year" ជាមួយប្រធានអកម្ម (The bridge) ត្រូវប្រើ Future Perfect Passive: will have been + V3។',
  },
  {
    id: 'pt-11',
    order: 11,
    cefr: 'B2',
    targetLevel: 'intermediate',
    promptEn: 'Select the sentence with the correct contrast conjunction:',
    promptKh: 'ជ្រើសរើសប្រយោគដែលមានការប្រើប្រាស់ឈ្នាប់ផ្ទុយគ្នា (Contrast) បានត្រឹមត្រូវ៖',
    contextSentence: '______ heavy rain, the students arrived on time for their exam.',
    audioText: 'Despite the heavy rain, the students arrived on time for their exam.',
    options: [
      { id: 'opt-a', textEn: 'Although the heavy rain' },
      { id: 'opt-b', textEn: 'Despite the heavy rain', textKh: 'Despite + Noun phrase (ទោះបីជា)' },
      { id: 'opt-c', textEn: 'Even though the heavy rain' },
      { id: 'opt-d', textEn: 'In spite that heavy rain' },
    ],
    correctOptionId: 'opt-b',
    explanationKh: '"Despite" និង "In spite of" ត្រូវដើរតាមដោយ Noun phrase (The heavy rain) ចំណែក "Although/Even though" ត្រូវតាមដោយ Clause (S + V)។',
  },
  {
    id: 'pt-12',
    order: 12,
    cefr: 'B2',
    targetLevel: 'intermediate',
    promptEn: 'Which word best completes the sentence: "His explanation was so ______ that everyone understood immediately."',
    promptKh: 'ជ្រើសរើសគុណនាមដែលសមស្របបំផុត៖ "His explanation was so ______ that everyone understood immediately."',
    contextSentence: 'His explanation was so ______ that everyone understood immediately.',
    audioText: 'His explanation was so articulate that everyone understood immediately.',
    options: [
      { id: 'opt-a', textEn: 'ambiguous', textKh: 'ស្រពិចស្រពិល' },
      { id: 'opt-b', textEn: 'articulate', textKh: 'ច្បាស់លាស់ ងាយយល់' },
      { id: 'opt-c', textEn: 'tedious', textKh: 'ធុញទ្រាន់' },
      { id: 'opt-d', textEn: 'reluctant', textKh: 'ទាក់ទើរ' },
    ],
    correctOptionId: 'opt-b',
    explanationKh: '"Articulate" មានន័យថា ពូកែពន្យល់ និងបញ្ចេញគំនិតបានច្បាស់លាស់ឥតទាស់ ដែលធ្វើឱ្យអ្នកដទៃយល់បានភ្លាមៗ។',
  },

  // -------------------------------------------------------------
  // PART 5: C1 - Advanced (កម្រិតខ្ពស់)
  // -------------------------------------------------------------
  {
    id: 'pt-13',
    order: 13,
    cefr: 'C1',
    targetLevel: 'advanced',
    promptEn: 'Choose the correct Negative Inversion: "Rarely ______ such unprecedented dedication to public service."',
    promptKh: 'ជ្រើសរើសទម្រង់ Inversion ដែលត្រឹមត្រូវក្រោយពាក្យ Rarely៖ "Rarely ______ such unprecedented dedication to public service."',
    contextSentence: 'Rarely ______ such unprecedented dedication to public service.',
    audioText: 'Rarely have we witnessed such unprecedented dedication to public service.',
    options: [
      { id: 'opt-a', textEn: 'we have witnessed' },
      { id: 'opt-b', textEn: 'have we witnessed', textKh: 'Inversion (Auxiliary + Subject + Verb)' },
      { id: 'opt-c', textEn: 'we witnessed' },
      { id: 'opt-d', textEn: 'witnessed we' },
    ],
    correctOptionId: 'opt-b',
    explanationKh: 'នៅពេលប្រយោគផ្តើមដោយ Negative Adverbial ដូចជា Rarely, Seldom, Never នោះប្រយោគត្រូវតែប្រើ Inversion (Auxiliary + Subject + Verb): "Rarely have we witnessed..."។',
  },
  {
    id: 'pt-14',
    order: 14,
    cefr: 'C1',
    targetLevel: 'advanced',
    promptEn: 'Select the correct Subjunctive form: "The committee demanded that the chairperson ______ a comprehensive report by Monday."',
    promptKh: 'ជ្រើសរើសទម្រង់ Subjunctive Mood ត្រឹមត្រូវ៖ "The committee demanded that the chairperson ______ a comprehensive report by Monday."',
    contextSentence: 'The committee demanded that the chairperson ______ a comprehensive report by Monday.',
    audioText: 'The committee demanded that the chairperson submit a comprehensive report by Monday.',
    options: [
      { id: 'opt-a', textEn: 'submits' },
      { id: 'opt-b', textEn: 'submit', textKh: 'Bare infinitive (Subjunctive form)' },
      { id: 'opt-c', textEn: 'submitted' },
      { id: 'opt-d', textEn: 'would submit' },
    ],
    correctOptionId: 'opt-b',
    explanationKh: 'បន្ទាប់ពីកិរិយាសព្ទបញ្ជា ឬសំណូមពរ (demand, insist, recommend, suggest) ក្នុងទម្រង់ formal subjunctive កិរិយាសព្ទក្នុង that-clause ត្រូវប្រើ Base form (submit) ទោះបីប្រធានជាឯកវចនៈក៏ដោយ។',
  },
  {
    id: 'pt-15',
    order: 15,
    cefr: 'C1',
    targetLevel: 'advanced',
    promptEn: 'Choose the most precise synonym for "ubiquitous" in academic English:',
    promptKh: 'ជ្រើសរើសពាក្យដែលមានន័យដូចនឹង "ubiquitous" (ដែលមានវត្តមាននៅគ្រប់ទិសទី)៖',
    contextSentence: 'Smartphones have become ubiquitous in modern society.',
    audioText: 'Smartphones have become ubiquitous in modern society.',
    options: [
      { id: 'opt-a', textEn: 'pervasive / omnipresent', textKh: 'រីករាលដាលគ្រប់ទីកន្លែង / មាននៅគ្រប់ទីកន្លែង' },
      { id: 'opt-b', textEn: 'obsolete', textKh: 'ហួសសម័យ' },
      { id: 'opt-c', textEn: 'sporadic', textKh: 'ដាច់ដោយអន្លើ' },
      { id: 'opt-d', textEn: 'ephemeral', textKh: 'មានអាយុខ្លី' },
    ],
    correctOptionId: 'opt-a',
    explanationKh: '"Ubiquitous" មានន័យថា ដែលមានវត្តមាននៅគ្រប់ទីកន្លែងក្នុងពេលតែមួយ (present, appearing, or found everywhere) ស្មើនឹង pervasive ឬ omnipresent។',
  },

  // -------------------------------------------------------------
  // PART 6: LISTENING COMPREHENSION (សំណួរជំនាញស្តាប់ និងឆ្លើយ)
  // -------------------------------------------------------------
  {
    id: 'pt-16',
    order: 16,
    cefr: 'A2',
    targetLevel: 'beginner',
    isListening: true,
    listeningScript: 'Hello passengers! The express train to Siem Reap will depart at quarter past three this afternoon from platform number two.',
    promptEn: 'Listen to the announcement: What time will the express train depart?',
    promptKh: 'ស្តាប់ការប្រកាសជាសំឡេង៖ តើរថភ្លើងល្បឿនលឿននឹងចេញដំណើរនៅម៉ោងប៉ុន្មាន?',
    contextSentence: 'Announcement: "The express train to Siem Reap will depart at quarter past three this afternoon from platform number two."',
    audioText: 'The express train to Siem Reap will depart at quarter past three this afternoon from platform number two.',
    options: [
      { id: 'opt-a', textEn: '3:15 PM (Quarter past three)', textKh: 'ម៉ោង ៣ និង ១៥ នាទីរសៀល' },
      { id: 'opt-b', textEn: '2:30 PM (Half past two)', textKh: 'ម៉ោង ២ និង ៣០ នាទីរសៀល' },
      { id: 'opt-c', textEn: '3:45 PM (Quarter to four)', textKh: 'ម៉ោង ៣ និង ៤៥ នាទីរសៀល' },
      { id: 'opt-d', textEn: '2:15 PM (Quarter past two)', textKh: 'ម៉ោង ២ និង ១៥ នាទីរសៀល' },
    ],
    correctOptionId: 'opt-a',
    explanationKh: 'នៅក្នុងសំឡេងប្រកាស អ្នកនិយាយបានបញ្ជាក់ថា "at quarter past three" (quarter past = លើស ១៥ នាទី) ដែលស្មើនឹងម៉ោង 3:15 PM។',
  },
  {
    id: 'pt-17',
    order: 17,
    cefr: 'B1',
    targetLevel: 'intermediate',
    isListening: true,
    listeningScript: 'Attention all staff members. Due to urgent system maintenance, our weekly project review has been rescheduled from Wednesday morning to Friday at two o\'clock in conference room B.',
    promptEn: 'Listen to the voice message: When will the rescheduled meeting take place?',
    promptKh: 'ស្តាប់សារសំឡេង៖ តើការប្រជុំដែលបានពន្យារពេល នឹងប្រព្រឹត្តទៅនៅពេលណា?',
    contextSentence: 'Voice message: "...our weekly project review has been rescheduled from Wednesday morning to Friday at two o\'clock..."',
    audioText: 'Attention all staff members. Due to urgent system maintenance, our weekly project review has been rescheduled from Wednesday morning to Friday at two o\'clock in conference room B.',
    options: [
      { id: 'opt-a', textEn: 'Wednesday morning', textKh: 'ព្រឹកថ្ងៃពុធ (ពេលវេលាចាស់)' },
      { id: 'opt-b', textEn: 'Friday at 2:00 PM', textKh: 'ថ្ងៃសុក្រ វេលាម៉ោង ២:០០ រសៀល' },
      { id: 'opt-c', textEn: 'Thursday afternoon', textKh: 'រសៀលថ្ងៃព្រហស្បតិ៍' },
      { id: 'opt-d', textEn: 'Monday morning', textKh: 'ព្រឹកថ្ងៃច័ន្ទ' },
    ],
    correctOptionId: 'opt-b',
    explanationKh: 'អ្នកនិយាយបានប្រកាសថា "rescheduled from Wednesday morning to Friday at two o\'clock" ដូច្នេះកាលវិភាគថ្មីគឺ ថ្ងៃសុក្រ ម៉ោង ២:០០ រសៀល (Friday at 2:00 PM)។',
  },
  {
    id: 'pt-18',
    order: 18,
    cefr: 'B2',
    targetLevel: 'advanced',
    isListening: true,
    listeningScript: 'Although our initial experimental trials demonstrated encouraging outcomes, we strongly advise against premature public statements until the rigorous peer-review evaluation is completely finalized.',
    promptEn: 'Listen to the scientist\'s statement: What does the speaker recommend?',
    promptKh: 'ស្តាប់ប្រសាសន៍របស់អ្នកវិទ្យាសាស្ត្រ៖ តើអ្នកនិយាយបានផ្តល់អនុសាសន៍អ្វីខ្លះ?',
    contextSentence: 'Statement: "...we strongly advise against premature public statements until the rigorous peer-review evaluation is completely finalized."',
    audioText: 'Although our initial experimental trials demonstrated encouraging outcomes, we strongly advise against premature public statements until the rigorous peer-review evaluation is completely finalized.',
    options: [
      { id: 'opt-a', textEn: 'Immediately publish all preliminary results to the press', textKh: 'ផ្សព្វផ្សាយលទ្ធផលភ្លាមៗទៅកាន់សារព័ត៌មាន' },
      { id: 'opt-b', textEn: 'Wait for the formal peer-review process before making public statements', textKh: 'រង់ចាំដំណើរការ peer-review បញ្ចប់ជាមុនសិន មុននឹងថ្លែងជាសាធារណៈ' },
      { id: 'opt-c', textEn: 'Cancel the scientific research project immediately', textKh: 'លុបចោលគម្រោងស្រាវជ្រាវភ្លាមៗ' },
      { id: 'opt-d', textEn: 'Reject all experimental data and conduct new experiments', textKh: 'បដិសេធទិន្នន័យពិសោធន៍ទាំងអស់' },
    ],
    correctOptionId: 'opt-b',
    explanationKh: 'អ្នកវិទ្យាសាស្ត្របានបញ្ជាក់ថា "strongly advise against premature public statements until the rigorous peer-review evaluation is completely finalized" មានន័យថាត្រូវរង់ចាំការវាយតម្លៃ peer-review ឱ្យចប់សព្វគ្រប់សិន មុននឹងបញ្ចេញព័ត៌មានជាសាធារណៈ។',
  },

  // -------------------------------------------------------------
  // PART 7: Reading Comprehension (ការអាន និងស្វែងយល់អត្ថបទ)
  // -------------------------------------------------------------
  {
    id: 'pt-19',
    order: 19,
    cefr: 'B1',
    targetLevel: 'intermediate',
    isReading: true,
    readingPassage: {
      titleEn: 'The Global Legacy of Angkor Wat',
      titleKh: 'កេរដំណែលពិភពលោកនៃប្រាសាទអង្គរវត្ត',
      textEn: 'Angkor Wat, located in northwestern Cambodia, is the largest religious monument in the world by land area. Originally constructed in the early 12th century as a Hindu temple dedicated to Vishnu for the Khmer Empire, it gradually transformed into a Buddhist temple toward the end of the 12th century. Today, it stands as an enduring symbol of Cambodia, appearing proudly on the national flag. Preserving this ancient architectural marvel requires ongoing international collaboration between Cambodian heritage experts and global scientists to protect its intricate stone bas-reliefs and hydraulic reservoirs from weathering and climate fluctuations.',
      textKh: 'ប្រាសាទអង្គរវត្ត ដែលមានទីតាំងនៅភាគពាយព្យនៃប្រទេសកម្ពុជា គឺជាបូជនីយដ្ឋានសាសនាដ៏ធំបំផុតនៅលើពិភពលោក។ ដើមឡើយត្រូវបានកសាងឡើងនៅដើមសតវត្សរ៍ទី ១២ ជាប្រាសាទព្រហ្មញ្ញសាសនា ឧទ្ទិសថ្វាយព្រះវិស្ណុ សម្រាប់ចក្រភពខ្មែរ ហើយក្រោយមកបានប្រែក្លាយជាវត្តពុទ្ធសាសនានៅចុងសតវត្សរ៍ទី ១២។ សព្វថ្ងៃនេះ ប្រាសាទនេះគឺជានិមិត្តរូបដ៏រឹងមាំនៃប្រទេសកម្ពុជា។ ការអភិរក្សស្នាដៃស្ថាបត្យកម្មបុរាណនេះ ទាមទារឱ្យមានកិច្ចសហប្រតិបត្តិការអន្តរជាតិជាបន្តបន្ទាប់រវាងអ្នកជំនាញបេតិកភណ្ឌកម្ពុជា និងអ្នកវិទ្យាសាស្ត្រពិភពលោក ដើម្បីការពារចម្លាក់ថ្ម និងប្រព័ន្ធធារាសាស្ត្របុរាណពីការប្រែប្រួលអាកាសធាតុ។',
    },
    promptEn: 'According to the passage, why is ongoing international collaboration necessary for Angkor Wat?',
    promptKh: 'យោងតាមអត្ថបទខាងលើ ហេតុអ្វីបានជាចាំបាច់ត្រូវមានកិច្ចសហប្រតិបត្តិការអន្តរជាតិជាបន្តបន្ទាប់សម្រាប់ប្រាសាទអង្គរវត្ត?',
    contextSentence: 'Preserving this ancient architectural marvel requires ongoing international collaboration between Cambodian heritage experts and global scientists to protect its intricate stone bas-reliefs and hydraulic reservoirs...',
    audioText: 'Angkor Wat, located in northwestern Cambodia, is the largest religious monument in the world. Preserving this ancient architectural marvel requires ongoing international collaboration to protect its intricate stone bas-reliefs and hydraulic reservoirs from weathering and climate fluctuations.',
    options: [
      { id: 'opt-a', textEn: 'To convert the monument back into its original 12th-century religious format', textKh: 'ដើម្បីប្តូរប្រាសាទត្រឡប់ទៅជាទម្រង់សាសនាដើមវិញ' },
      { id: 'opt-b', textEn: 'To safeguard stone carvings and hydraulic systems from weathering and climate damage', textKh: 'ដើម្បីការពារចម្លាក់ថ្ម និងប្រព័ន្ធធារាសាស្ត្រពីអាកាសធាតុ និងការខូចខាត' },
      { id: 'opt-c', textEn: 'To construct entirely new modern buildings around the temple perimeter', textKh: 'ដើម្បីសាងសង់អគារទំនើបៗថ្មីជុំវិញបរិវេណប្រាសាទ' },
      { id: 'opt-d', textEn: 'To design a replacement national flag for the Kingdom of Cambodia', textKh: 'ដើម្បីរចនាទង់ជាតិថ្មីសម្រាប់ប្រទេសកម្ពុជា' },
    ],
    correctOptionId: 'opt-b',
    explanationKh: 'ក្នុងអត្ថបទបានបញ្ជាក់យ៉ាងច្បាស់ថា: "...requires ongoing international collaboration between Cambodian heritage experts and global scientists to protect its intricate stone bas-reliefs and hydraulic reservoirs from weathering and climate fluctuations"។ ដូច្នេះចម្លើយត្រឹមត្រូវគឺជម្រើស (B)។',
  },
  {
    id: 'pt-20',
    order: 20,
    cefr: 'B2',
    targetLevel: 'advanced',
    isReading: true,
    readingPassage: {
      titleEn: 'Artificial Intelligence in Modern Language Education',
      titleKh: 'បញ្ញាសិប្បនិម្មិត (AI) ក្នុងការអប់រំភាសាសម័យទំនើប',
      textEn: 'The integration of artificial intelligence into educational platforms is revolutionizing how learners acquire new languages. Adaptive algorithms can dynamically analyze a student\'s linguistic strengths and pinpoint syntactic misconceptions in real time, tailoring personalized practice drills that significantly reduce study fatigue. Nevertheless, cognitive researchers caution that automated feedback should supplement, rather than supplant, human mentorship. Nuanced social empathy, cultural context, and intrinsic motivational guidance remain irreplaceable human attributes that artificial systems cannot replicate.',
      textKh: 'ការបញ្ចូលបញ្ញាសិប្បនិម្មិត (AI) ទៅក្នុងថ្នាលអប់រំកំពុងផ្លាស់ប្តូររបៀបដែលសិស្សរៀនភាសាថ្មីៗ។ ក្បួនដោះស្រាយ (Algorithms) អាចវិភាគចំណុចខ្លាំងផ្នែកភាសា និងកែកំហុសវេយ្យាករណ៍បានភ្លាមៗក្នុងពេលជាក់ស្តែង ដែលជួយកាត់បន្ថយភាពនឿយហត់ក្នុងការរៀន។ ទោះជាយ៉ាងណាក៏ដោយ អ្នកស្រាវជ្រាវបានក្រើនរំលឹកថា ការឆ្លើយតបស្វ័យប្រវត្តិនេះគួរតែជាជំនួយបន្ថែមប៉ុណ្ណោះ មិនមែនជំនួសគ្រូបង្រៀនជាមនុស្សនោះឡើយ ដោយសារតែការយល់ចិត្ត ការយល់ដឹងអំពីបរិបទវប្បធម៌ និងការលើកទឹកចិត្ត គឺជាគុណតម្លៃរបស់មនុស្សដែលប្រព័ន្ធ AI មិនអាចចម្លងតាមបាន។',
    },
    promptEn: 'What is the primary perspective expressed by cognitive researchers regarding AI in education?',
    promptKh: 'តើអ្វីជាទស្សនវិស័យចម្បងរបស់អ្នកស្រាវជ្រាវទាក់ទងនឹងបញ្ញាសិប្បនិម្មិត (AI) ក្នុងវិស័យអប់រំ?',
    contextSentence: 'Nevertheless, cognitive researchers caution that automated feedback should supplement, rather than supplant, human mentorship.',
    audioText: 'Nevertheless, cognitive researchers caution that automated feedback should supplement, rather than supplant, human mentorship. Nuanced social empathy, cultural context, and intrinsic motivational guidance remain irreplaceable human attributes that artificial systems cannot replicate.',
    options: [
      { id: 'opt-a', textEn: 'AI should immediately replace human teachers in all language classrooms', textKh: 'AI គួរតែជំនួសគ្រូបង្រៀនជាមនុស្សភ្លាមៗក្នុងថ្នាក់រៀនភាសា' },
      { id: 'opt-b', textEn: 'AI is completely useless and fails to provide personalized learning assistance', textKh: 'AI គ្មានប្រយោជន៍ទាល់តែសោះក្នុងការជួយដល់ការរៀន' },
      { id: 'opt-c', textEn: 'AI is a valuable complementary tool, but human guidance remains essential for empathy and culture', textKh: 'AI គឺជាឧបករណ៍ជំនួយដ៏មានតម្លៃ ប៉ុន្តែការណែនាំពីមនុស្សនៅតែមិនអាចខ្វះបានសម្រាប់គុណតម្លៃផ្លូវចិត្ត និងវប្បធម៌' },
      { id: 'opt-d', textEn: 'Students should avoid using technology altogether when acquiring foreign languages', textKh: 'សិស្សមិនគួរប្រើបច្ចេកវិទ្យាក្នុងការរៀនភាសាឡើយ' },
    ],
    correctOptionId: 'opt-c',
    explanationKh: 'អ្នកស្រាវជ្រាវបានសង្កត់ធ្ងន់ថា: "automated feedback should supplement, rather than supplant, human mentorship" (supplement = បំពេញបន្ថែម, supplant = ជំនួស) និងបានបញ្ជាក់ថាការយល់ចិត្តនិងវប្បធម៌ជាគុណសម្បត្តិមិនអាចជំនួសបាន។ ដូច្នេះចម្លើយត្រឹមត្រូវគឺជម្រើស (C)។',
  },
];

/**
 * Level Assignment Logic based on Placement Score Percentage:
 * - 0% - 30%   => Beginner (កម្រិតដំបូង)
 * - 31% - 70%  => Intermediate (កម្រិតមធ្យម)
 * - 71% - 100% => Advanced (កម្រិតខ្ពស់)
 */
export function calculateAssignedLevel(correctCount: number, totalQuestions: number): {
  scorePercent: number;
  assignedLevel: DifficultyLevel;
  levelTitleEn: string;
  levelTitleKh: string;
  cefrEquiv: string;
  unlockedLevels: DifficultyLevel[];
  descriptionKh: string;
} {
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  if (scorePercent >= 71) {
    return {
      scorePercent,
      assignedLevel: 'advanced',
      levelTitleEn: 'Advanced Level',
      levelTitleKh: 'កម្រិតខ្ពស់ (Advanced C1)',
      cefrEquiv: 'B2 - C1',
      unlockedLevels: ['beginner', 'intermediate', 'advanced'],
      descriptionKh: 'អបអរសាទរ! អ្នកទទួលបានពិន្ទុខ្ពស់ និងត្រូវបានចាត់ថ្នាក់ចូលក្នុង "កម្រិតខ្ពស់ (Advanced)"។ គ្រប់កម្រិតទាំងអស់ (Beginner, Intermediate, Advanced) ត្រូវបានដោះសោជូនអ្នកដើម្បីរៀនដោយសេរី!',
    };
  }

  if (scorePercent >= 31) {
    return {
      scorePercent,
      assignedLevel: 'intermediate',
      levelTitleEn: 'Intermediate Level',
      levelTitleKh: 'កម្រិតមធ្យម (Intermediate B1/B2)',
      cefrEquiv: 'A2 - B1',
      unlockedLevels: ['beginner', 'intermediate'],
      descriptionKh: 'អបអរសាទរ! សមត្ថភាពភាសាអង់គ្លេសរបស់អ្នកស្ថិតក្នុង "កម្រិតមធ្យម (Intermediate)"។ យើងបានដោះសោមេរៀនកម្រិតដំបូង និងកម្រិតមធ្យមជូនអ្នកដើម្បីបន្តពង្រឹងចំណេះដឹង!',
    };
  }

  return {
    scorePercent,
    assignedLevel: 'beginner',
    levelTitleEn: 'Beginner Level',
    levelTitleKh: 'កម្រិតដំបូង (Beginner A1/A2)',
    cefrEquiv: 'A1 - A2',
    unlockedLevels: ['beginner'],
    descriptionKh: 'ស្វាគមន៍មកកាន់ដំណើរការសិក្សា! អ្នកត្រូវបានចាត់ថ្នាក់ក្នុង "កម្រិតដំបូង (Beginner)"។ មេរៀនកម្រិតដំបូងត្រូវបានដោះសោដើម្បីឱ្យអ្នកចាប់ផ្តើមកសាងគ្រឹះភាសាអង់គ្លេសឱ្យកាន់តែរឹងមាំ!',
  };
}
