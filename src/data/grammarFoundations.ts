export interface GrammarFoundationItem {
  id: string;
  number: number;
  titleEn: string;
  titleKh: string;
  category: 'core' | 'structure' | 'mechanics';
  level: 'beginner' | 'intermediate' | 'advanced';
  summaryKh: string;
  ruleFormula?: string;
  keyPoints: {
    title: string;
    descriptionKh: string;
  }[];
  examples: {
    en: string;
    kh: string;
    breakdown?: string;
  }[];
  proTipKh: string;
  commonMistakeKh: {
    wrong: string;
    right: string;
    reasonKh: string;
  };
}

export const GRAMMAR_FOUNDATIONS: GrammarFoundationItem[] = [
  {
    id: 'gf-parts-of-speech',
    number: 1,
    titleEn: '8 Parts of Speech in English',
    titleKh: 'ថ្នាក់ពាក្យទាំង ៨ ក្នុងភាសាអង់គ្លេស',
    category: 'core',
    level: 'beginner',
    summaryKh: 'ថ្នាក់ពាក្យគឺជាគ្រឹះដំបូងបំផុតដើម្បីយល់ដឹងពីតួនាទីរបស់ពាក្យនីមួយៗនៅក្នុងប្រយោគ។',
    ruleFormula: 'Sentence = Subject (Noun/Pronoun) + Verb + Object / Complement',
    keyPoints: [
      {
        title: '1. Noun (នាម)',
        descriptionKh: 'សម្គាល់ឈ្មោះមនុស្ស សត្វ ទីកន្លែង ឬវត្ថុ (ឧ. teacher, Cambodia, book, water)'
      },
      {
        title: '2. Pronoun (សព្វនាម)',
        descriptionKh: 'ប្រើជំនួសនាមដើម្បីកុំឱ្យច្រំដែល (ឧ. I, you, he, she, it, we, they)'
      },
      {
        title: '3. Verb (កិរិយាសព្ទ)',
        descriptionKh: 'បង្ហាញសកម្មភាព ឬស្ថានភាព (ឧ. run, study, speak, is, become)'
      },
      {
        title: '4. Adjective (គុណនាម)',
        descriptionKh: 'ពិពណ៌នាលក្ខណៈរបស់នាម ឬសព្វនាម (ឧ. beautiful, smart, fast, delicious)'
      },
      {
        title: '5. Adverb (គុណកិរិយា)',
        descriptionKh: 'បញ្ជាក់ន័យបន្ថែមដល់កិរិយាសព្ទ គុណនាម ឬគុណកិរិយាដទៃ (ឧ. quickly, very, carefully)'
      },
      {
        title: '6. Preposition (ធ្នាក់)',
        descriptionKh: 'បង្ហាញទីតាំង ពេលវេលា ឬទិសដៅ (ឧ. in, on, at, under, to, from)'
      },
      {
        title: '7. Conjunction (ឈ្នាប់)',
        descriptionKh: 'តភ្ជាប់ពាក្យ ឃ្លា ឬល្បះចូលគ្នា (ឧ. and, but, because, although, or)'
      },
      {
        title: '8. Interjection (ឧទានសព្ទ)',
        descriptionKh: 'បង្ហាញអារម្មណ៍ភ្ញាក់ផ្អើល ឬរំភើប (ឧ. Wow!, Oh!, Ouch!, Hey!)'
      }
    ],
    examples: [
      {
        en: 'The diligent student speaks English very fluently.',
        kh: 'សិស្សដ៏ឧស្សាហ៍នោះនិយាយភាសាអង់គ្លេសបានយ៉ាងរលូនល្អណាស់។',
        breakdown: 'diligent (Adj), student (Noun), speaks (Verb), English (Noun), very (Adverb), fluently (Adverb)'
      },
      {
        en: 'She lives in Phnom Penh and studies business.',
        kh: 'នាងរស់នៅក្នុងរាជធានីភ្នំពេញ ហើយរៀនមុខវិជ្ជាពាណិជ្ជកម្ម។',
        breakdown: 'She (Pronoun), in (Preposition), and (Conjunction)'
      }
    ],
    proTipKh: 'រាល់ប្រយោគពេញលេញជាភាសាអង់គ្លេស ត្រូវតែមានយ៉ាងហោចណាស់ប្រធាន (Subject) មួយ និងកិរិយាសព្ទ (Verb) មួយ។',
    commonMistakeKh: {
      wrong: 'She speaks English fluent.',
      right: 'She speaks English fluently.',
      reasonKh: 'ត្រូវប្រើគុណកិរិយា (Adverb: fluently) ដើម្បីបញ្ជាក់ន័យដល់កិរិយាសព្ទ speaks មិនមែនប្រើគុណនាម fluent ឡើយ។'
    }
  },
  {
    id: 'gf-subject-verb-agreement',
    number: 2,
    titleEn: 'Subject-Verb Agreement Rules',
    titleKh: 'ក្បួនស្របគ្នារវាងប្រធាន និងកិរិយាសព្ទ',
    category: 'structure',
    level: 'beginner',
    summaryKh: 'ប្រធានឯកវចនៈត្រូវដើរជាមួយកិរិយាសព្ទឯកវចនៈ (He/She/It + V-s/es) ហើយប្រធានពហុវចនៈត្រូវដើរជាមួយកិរិយាសព្ទពហុវចនៈ (They/We + V1)។',
    ruleFormula: 'Singular Subject → Verb + s/es | Plural Subject → Base Verb',
    keyPoints: [
      {
        title: 'ប្រធានឯកវចនៈ (He, She, It, John, A cat)',
        descriptionKh: 'កិរិយាសព្ទក្នុង Present Simple ត្រូវថែម s ឬ es (ឧ. works, studies, watches, goes)'
      },
      {
        title: 'ប្រធានពហុវចនៈ (I, You, We, They, Students)',
        descriptionKh: 'កិរិយាសព្ទរក្សាទម្រង់ដើមដោយមិនថែម s ឡើយ (ឧ. work, study, watch, go)'
      },
      {
        title: 'ពាក្យពិសេស Everybody / Everyone / Someone',
        descriptionKh: 'ទោះបីមានន័យដល់មនុស្សច្រើន តែតាមវេយ្យាករណ៍ត្រូវបានចាត់ទុកជាឯកវចនៈ (Everyone is here, Someone knows)'
      }
    ],
    examples: [
      {
        en: 'My brother works at an international hospital.',
        kh: 'បងប្រុសរបស់ខ្ញុំធ្វើការនៅមន្ទីរពេទ្យអន្តរជាតិមួយ។',
        breakdown: 'brother (ឯកវចនៈ) → works (ថែម s)'
      },
      {
        en: 'My brothers work at an international hospital.',
        kh: 'បងប្អូនប្រុសៗរបស់ខ្ញុំធ្វើការនៅមន្ទីរពេទ្យអន្តរជាតិមួយ។',
        breakdown: 'brothers (ពហុវចនៈ) → work (មិនថែម s)'
      },
      {
        en: 'Everyone wants to succeed in life.',
        kh: 'មនុស្សគ្រប់គ្នាសុទ្ធតែចង់ទទួលបានជោគជ័យក្នុងជីវិត។',
        breakdown: 'Everyone ចាត់ទុកជាឯកវចនៈ → wants'
      }
    ],
    proTipKh: 'កុំច្រឡំ: នាមថែម s ក្លាយជាពហុវចនៈ (books, cars) ប៉ុន្តែកិរិយាសព្ទថែម s ជាឯកវចនៈសម្រាប់ He/She/It (eats, walks)។',
    commonMistakeKh: {
      wrong: 'He don’t know the answer. / One of my friends live in Siem Reap.',
      right: 'He doesn’t know the answer. / One of my friends lives in Siem Reap.',
      reasonKh: 'He ត្រូវប្រើ does not (doesn’t)។ ក្នុងឃ្លា "One of my friends" ប្រធានពិតប្រាកដគឺ "One" (ឯកវចនៈ) ដូច្នេះប្រើ lives។'
    }
  },
  {
    id: 'gf-articles-a-an-the',
    number: 3,
    titleEn: 'Articles: A, An, and The Master Guide',
    titleKh: 'ការប្រើប្រាស់ A, An, The ឱ្យបានត្រឹមត្រូវ',
    category: 'mechanics',
    level: 'beginner',
    summaryKh: 'A និង An ប្រើសម្រាប់នាមរាប់បានឯកវចនៈមិនទាន់ជាក់លាក់ (Indefinite) រីឯ The ប្រើសម្រាប់នាមជាក់លាក់ដែលអ្នកនិយាយ និងអ្នកស្តាប់ស្គាល់ច្បាស់ (Definite)។',
    ruleFormula: 'A + ព្យញ្ជនៈសូរ | An + ស្រៈសូរ (a, e, i, o, u) | The + នាមជាក់លាក់',
    keyPoints: [
      {
        title: 'A ប្រើមុខសូរស័ព្ទព្យញ្ជនៈ (Consonant Sound)',
        descriptionKh: 'ឧ. a book, a university (សូរ យូ), a European country, a hospital'
      },
      {
        title: 'An ប្រើមុខសូរស័ព្ទស្រៈ (Vowel Sound: អា អ៊ែ អូ...)',
        descriptionKh: 'ឧ. an apple, an hour (អក្សរ h មិនបន្លឺសំឡេង), an honest person, an umbrella'
      },
      {
        title: 'The ប្រើពេលអ្នកស្តាប់ដឹងថាជាអ្វី ឬមានតែមួយគត់',
        descriptionKh: 'ឧ. The sun, The moon, The Mekong River, The capital of Cambodia'
      }
    ],
    examples: [
      {
        en: 'I bought a new phone yesterday. The phone has a great camera.',
        kh: 'ខ្ញុំបានទិញទូរស័ព្ទថ្មីមួយកាលពីម្សិលមិញ។ ទូរស័ព្ទនោះមានកាមេរ៉ាល្អណាស់។',
        breakdown: 'លើកទី១ ប្រើ a phone (មិនទាន់ស្គាល់), លើកទី២ ប្រើ the phone (ស្គាល់ច្បាស់)'
      },
      {
        en: 'It takes an hour to drive from Phnom Penh to Kandal.',
        kh: 'វាចំណាយពេលមួយម៉ោងដើម្បីបើកបរពីរាជធានីភ្នំពេញទៅកណ្តាល។',
        breakdown: 'hour បន្លឺសូរ /aʊər/ ដូចស្រៈ ដូច្នេះប្រើ an'
      }
    ],
    proTipKh: 'សំខាន់គឺ "សម្លេង" មិនមែនតួអក្សរឡើយ: a university (សូរ /j/) ប៉ុន្តែ an uncle (សូរ /ʌ/)។',
    commonMistakeKh: {
      wrong: 'I have an university degree. / She is a honest woman.',
      right: 'I have a university degree. / She is an honest woman.',
      reasonKh: 'University ចាប់ផ្តើមដោយសូរព្យញ្ជនៈ /j/ (យូ) ត្រូវប្រើ a។ ចំណែក honest អក្សរ h ស្ងាត់ បន្លឺសូរស្រៈ /ɒ/ ត្រូវប្រើ an។'
    }
  },
  {
    id: 'gf-modal-verbs',
    number: 4,
    titleEn: 'Modal Auxiliary Verbs (Can, Could, Must, Should)',
    titleKh: 'កិរិយាសព្ទជំនួយពិសេស (Modals)',
    category: 'structure',
    level: 'intermediate',
    summaryKh: 'Modal verbs បង្ហាញសមត្ថភាព ការអនុញ្ញាត ដំបូន្មាន កាតព្វកិច្ច ឬលទ្ធភាព។ ក្រោយ Modal verbs កិរិយាសព្ទបន្ទាប់ត្រូវតែជា Base Verb (V1 គ្មាន s/es/ed/ing) ជានិច្ច។',
    ruleFormula: 'Subject + Modal (Can/Could/Must/Should/May/Might) + Base Verb (V1)',
    keyPoints: [
      {
        title: 'Can / Could (សមត្ថភាព & សំណើគួរសម)',
        descriptionKh: 'I can swim. (ខ្ញុំចេះហែលទឹក) | Could you please help me? (តើលោកអាចមេត្តាជួយខ្ញុំបានទេ?)'
      },
      {
        title: 'Should (ដំបូន្មានល្អ)',
        descriptionKh: 'You should practice speaking English every day. (អ្នកគួរតែហាត់និយាយភាសាអង់គ្លេសរាល់ថ្ងៃ)'
      },
      {
        title: 'Must / Have to (កាតព្វកិច្ចចាំបាច់បំផុត)',
        descriptionKh: 'Drivers must stop at a red traffic light. (អ្នកបើកបរត្រូវតែឈប់នៅស្តុបក្រហម)'
      },
      {
        title: 'May / Might (លទ្ធភាពអាចកើតឡើង ៥០%)',
        descriptionKh: 'It might rain this evening. (វាអាចនឹងភ្លៀងនៅល្ងាចនេះ)'
      }
    ],
    examples: [
      {
        en: 'You should review the vocabulary words before sleeping.',
        kh: 'អ្នកគួរតែរំលឹកពាក្យវាក្យសព្ទមុនពេលចូលគេង។',
        breakdown: 'should + review (base verb គ្មាន to, គ្មាន s)'
      },
      {
        en: 'Students can speak with native English teachers online.',
        kh: 'សិស្សានុសិស្សអាចសន្ទនាជាមួយគ្រូបង្រៀនបរទេសតាមអនឡាញបាន។',
        breakdown: 'can + speak'
      }
    ],
    proTipKh: 'កុំថែម "to" នៅចន្លោះ modal និង verb ឡើយ: ហាមនិយាយថា "can to go" ត្រូវនិយាយថា "can go"។',
    commonMistakeKh: {
      wrong: 'She can speaks three languages. / I must to go now.',
      right: 'She can speak three languages. / I must go now.',
      reasonKh: 'ក្រោយ can, must, should កិរិយាសព្ទត្រូវតែជាទម្រង់ដើមសុទ្ធសាធ (speak, go) មិនថែម s ឬ to ឡើយ។'
    }
  },
  {
    id: 'gf-wh-questions',
    number: 5,
    titleEn: 'Question Formations (WH- & Yes/No Questions)',
    titleKh: 'ទម្រង់សំណួរ WH- និង Yes/No Questions',
    category: 'structure',
    level: 'intermediate',
    summaryKh: 'ការបង្កើតសំណួរជាភាសាអង់គ្លេសតម្រូវឱ្យដាក់កិរិយាសព្ទជំនួយ (Auxiliary Verb: do, does, did, is, are, can...) នៅមុខប្រធាន។',
    ruleFormula: 'WH-Word + Auxiliary (do/does/did/be) + Subject + Main Verb + Object?',
    keyPoints: [
      {
        title: 'WH-Words សំខាន់ៗទាំង ៦',
        descriptionKh: 'Who (នរណា), What (អ្វី), Where (ឯណា), When (ពេលណា), Why (ហេតុអ្វី), How (យ៉ាងដូចម្តេច)'
      },
      {
        title: 'Yes/No Questions',
        descriptionKh: 'ចាប់ផ្តើមដោយ Auxiliary Verb: Do you like tea? Are you a student? Did you finish the quiz?'
      },
      {
        title: 'WH- Questions',
        descriptionKh: 'Where do you live? How long have you studied English? Why do you want to learn?'
      }
    ],
    examples: [
      {
        en: 'Where do you work in Phnom Penh?',
        kh: 'តើអ្នកធ្វើការនៅឯណាក្នុងរាជធានីភ្នំពេញ?',
        breakdown: 'Where + do (Aux) + you (Subject) + work (Verb)?'
      },
      {
        en: 'How often do you practice speaking English?',
        kh: 'តើអ្នកហាត់និយាយភាសាអង់គ្លេសញឹកញាប់កម្រិតណា?',
        breakdown: 'How often + do + you + practice?'
      }
    ],
    proTipKh: 'ចងចាំក្បួន Q-A-S-V (Question word - Auxiliary - Subject - Verb) សម្រាប់សំណួរស្ទើរតែ ៩០% នៃភាសាអង់គ្លេស។',
    commonMistakeKh: {
      wrong: 'Where you live? / Why she is crying?',
      right: 'Where do you live? / Why is she crying?',
      reasonKh: 'ភាសាអង់គ្លេសត្រូវតែមាន Auxiliary Verb (do, is) នៅមុខប្រធាន (you, she) ក្នុងទម្រង់សំណួរ។'
    }
  },
  {
    id: 'gf-passive-voice',
    number: 6,
    titleEn: 'Passive Voice Fundamentals',
    titleKh: 'អំពើទទួល (Passive Voice) គ្រឹះសំខាន់',
    category: 'structure',
    level: 'advanced',
    summaryKh: 'ប្រើនៅពេលសកម្មភាព ឬលទ្ធផលមានសារៈសំខាន់ជាងអ្នកធ្វើ ឬនៅពេលដែលយើងមិនដឹងច្បាស់ថាអ្នកណាជាអ្នកធ្វើសកម្មភាពនោះ។',
    ruleFormula: 'Subject (Receiver) + Be (is/are/was/were/been) + V3 (Past Participle)',
    keyPoints: [
      {
        title: 'Active Voice (សកម្ម)',
        descriptionKh: 'ប្រធានជាអ្នកធ្វើសកម្មភាព: Angkor Wat attracts millions of tourists every year.'
      },
      {
        title: 'Passive Voice (អកម្ម / ទទួល)',
        descriptionKh: 'ប្រធានជាអ្នកទទួលសកម្មភាព: Millions of tourists are attracted by Angkor Wat.'
      },
      {
        title: 'ប្រើក្នុងរបាយការណ៍ និងព័ត៌មានផ្លូវការ',
        descriptionKh: 'The new international airport was built in 2024.'
      }
    ],
    examples: [
      {
        en: 'English is spoken by over 1.5 billion people worldwide.',
        kh: 'ភាសាអង់គ្លេសត្រូវបាននិយាយដោយមនុស្សជាង ១.៥ ពាន់លាននាក់នៅទូទាំងពិភពលោក។',
        breakdown: 'is + spoken (V3 របស់ speak)'
      },
      {
        en: 'The email has been sent to all team members.',
        kh: 'អ៊ីមែលត្រូវបានផ្ញើជូនសមាជិកក្រុមទាំងអស់រួចរាល់ហើយ។',
        breakdown: 'has been + sent (V3 របស់ send)'
      }
    ],
    proTipKh: 'កិរិយាសព្ទក្នុង Passive Voice ត្រូវតែជា Past Participle (V3) ជានិច្ច មិនអាចប្រើ V1 ឬ V2 ឡើយ។',
    commonMistakeKh: {
      wrong: 'The car was repair yesterday.',
      right: 'The car was repaired yesterday.',
      reasonKh: 'ក្នុង Passive Voice ត្រូវប្រើ V3 (repaired) មិនមែន V1 (repair) ឡើយ។'
    }
  }
];
