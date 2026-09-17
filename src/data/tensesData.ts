import { EnglishTense } from '../types';

export const ENGLISH_TENSES: EnglishTense[] = [
  // 1. PRESENT SIMPLE
  {
    id: 'tense-present-simple',
    number: 1,
    tenseNameEn: 'Present Simple Tense',
    tenseNameKh: 'បច្ចុប្បន្នកាលធម្មតា',
    category: 'present',
    formulaPositive: 'S + V1 (s / es) + Object',
    formulaNegative: 'S + do / does + not + V(base) + Object',
    formulaQuestion: 'Do / Does + S + V(base) + Object?',
    signalWords: ['always', 'usually', 'often', 'sometimes', 'never', 'every day', 'every week', 'on Mondays'],
    explanationKh: 'ប្រើដើម្បីរៀបរាប់អំពីសកម្មភាពជាទម្លាប់ប្រចាំថ្ងៃ (Habits), ការពិតទូទៅតាមធម្មជាតិ ឬវិទ្យាសាស្ត្រ (General Truths), និងកាលវិភាគកំណត់ច្បាស់លាស់ (Timetables)។ បើប្រធានជា He / She / It កិរិយាសព្ទត្រូវថែម s ឬ es។',
    explanationEn: 'Used for regular habits, repeated routines, universal facts, and fixed scheduled events.',
    examples: [
      {
        en: 'I drink warm water every morning.',
        kh: 'ខ្ញុំផឹកទឹកក្តៅឧណ្ហៗជារៀងរាល់ព្រឹក។',
        note: 'ទម្លាប់ប្រចាំថ្ងៃ (Daily Habit)'
      },
      {
        en: 'The sun rises in the east.',
        kh: 'ព្រះអាទិត្យរះពីទិសខាងកើត។',
        note: 'ការពិតតាមធម្មជាតិ (Scientific Fact)'
      },
      {
        en: 'She works at an international school in Phnom Penh.',
        kh: 'នាងធ្វើការនៅសាលាអន្តរជាតិមួយក្នុងរាជធានីភ្នំពេញ។',
        note: 'ស្ថានភាពអចិន្ត្រៃយ៍ (Permanent Situation - works មាន s)'
      },
      {
        en: 'The bus leaves at 8:00 AM.',
        kh: 'រថយន្តក្រុងចេញដំណើរនៅម៉ោង ៨:០០ ព្រឹក។',
        note: 'កាលវិភាគកំណត់ (Timetable)'
      }
    ],
    commonMistake: {
      wrong: 'She work hard every day. / He does not works here.',
      right: 'She works hard every day. / He does not work here.',
      explanationKh: 'ពេលមាន does ក្នុងប្រយោគបដិសេធ ឬសំណួរ កិរិយាសព្ទមេត្រូវត្រឡប់មកទម្រង់ដើម (base form) ដោយមិនថែម s ទៀតឡើយ។'
    },
    illustrationTag: 'Habits & Facts',
    iconName: 'Clock'
  },

  // 2. PRESENT CONTINUOUS
  {
    id: 'tense-present-continuous',
    number: 2,
    tenseNameEn: 'Present Continuous Tense',
    tenseNameKh: 'បច្ចុប្បន្នកាលកំពុងបន្ត',
    category: 'present',
    formulaPositive: 'S + am / is / are + V-ing + Object',
    formulaNegative: 'S + am / is / are + not + V-ing + Object',
    formulaQuestion: 'Am / Is / Are + S + V-ing + Object?',
    signalWords: ['now', 'right now', 'at the moment', 'currently', 'Look!', 'Listen!', 'today', 'this week'],
    explanationKh: 'ប្រើដើម្បីនិយាយអំពីសកម្មភាពដែលកំពុងកើតឡើងនៅពេលនិយាយ (Right now), សកម្មភាពបណ្ដោះអាសន្ន (Temporary events), ឬគម្រោងការណ៍ក្នុងអនាគតជិតដែលមានការរៀបចំរួចរាល់ (Arrangements)។',
    explanationEn: 'Used for actions happening right at the moment of speaking, temporary trends, or fixed near-future plans.',
    examples: [
      {
        en: 'I am studying English grammar right now.',
        kh: 'ខ្ញុំកំពុងរៀនវេយ្យាករណ៍ភាសាអង់គ្លេសនៅពេលនេះ។',
        note: 'កំពុងកើតឡើងជាក់ស្តែង'
      },
      {
        en: 'Look! It is raining outside.',
        kh: 'មើលហ្ន៎! នៅខាងក្រៅកំពុងតែភ្លៀង។',
        note: 'សញ្ញាដាស់តឿន Look!'
      },
      {
        en: 'We are meeting the manager tomorrow morning.',
        kh: 'ពួកយើងនឹងជួបអ្នកគ្រប់គ្រងនៅព្រឹកស្អែក។',
        note: 'ការរៀបចំគម្រោងទុកជាមុន (Fixed Plan)'
      }
    ],
    commonMistake: {
      wrong: 'I am understanding this lesson. / She is wanting some water.',
      right: 'I understand this lesson. / She wants some water.',
      explanationKh: 'កិរិយាសព្ទបញ្ញា ឬអារម្មណ៍ (Stative Verbs ដូចជា know, understand, want, love, like, believe) ជាទូទៅមិនប្រើក្នុង Continuous (V-ing) ឡើយ។'
    },
    illustrationTag: 'Action in Progress',
    iconName: 'PlayCircle'
  },

  // 3. PRESENT PERFECT
  {
    id: 'tense-present-perfect',
    number: 3,
    tenseNameEn: 'Present Perfect Tense',
    tenseNameKh: 'បច្ចុប្បន្នកាលពេញលេញ (បានធ្វើ)',
    category: 'present',
    formulaPositive: 'S + have / has + V3 (Past Participle) + Object',
    formulaNegative: 'S + have / has + not + V3 + Object',
    formulaQuestion: 'Have / Has + S + V3 + Object?',
    signalWords: ['already', 'yet', 'just', 'ever', 'never', 'since', 'for', 'recently', 'so far'],
    explanationKh: 'ប្រើដើម្បីនិយាយពីបទពិសោធន៍ក្នុងជីវិត (Life experience), សកម្មភាពដែលបានកើតឡើងក្នុងអតីតកាលប៉ុន្តែលទ្ធផលនៅមានឥទ្ធិពលដល់បច្ចុប្បន្ន, ឬសកម្មភាពដែលបានចាប់ផ្តើមតាំងពីអតីតកាលហើយបន្តរហូតដល់ពេលនេះ (ប្រើជាមួយ since/for)។',
    explanationEn: 'Connects past events with the present: life experiences, recent actions with present impact, and actions continuing up to now.',
    examples: [
      {
        en: 'I have visited Angkor Wat three times.',
        kh: 'ខ្ញុំធ្លាប់បានទៅលេងប្រាសាទអង្គរវត្តចំនួនបីដងមកហើយ។',
        note: 'បទពិសោធន៍ជីវិត (Experience)'
      },
      {
        en: 'She has lived in Siem Reap since 2018.',
        kh: 'នាងបានរស់នៅក្នុងខេត្តសៀមរាបតាំងពីឆ្នាំ ២០១៨ មកម្ល៉េះ។',
        note: 'ចាប់ផ្តើមពីអតីតកាល បន្តដល់ពេលនេះ (since + ចំណុចពេល)'
      },
      {
        en: 'I have just finished my homework.',
        kh: 'ខ្ញុំទើបតែធ្វើកិច្ចការផ្ទះរបស់ខ្ញុំរួចរាល់។',
        note: 'ទើបតែកើតឡើងថ្មីៗ (just)'
      }
    ],
    commonMistake: {
      wrong: 'I have seen him yesterday. / She has went home.',
      right: 'I saw him yesterday. / She has gone home.',
      explanationKh: 'បើមានពេលវេលាអតីតកាលជាក់លាក់ដូចជា yesterday, last night, 2 days ago ត្រូវប្រើ Past Simple (V2) មិនត្រូវប្រើ Present Perfect ឡើយ។ ម្យ៉ាងទៀត Present Perfect ត្រូវប្រើ V3 (gone) មិនមែន V2 (went) ទេ។'
    },
    illustrationTag: 'Past to Present Link',
    iconName: 'CheckCircle2'
  },

  // 4. PRESENT PERFECT CONTINUOUS
  {
    id: 'tense-present-perfect-continuous',
    number: 4,
    tenseNameEn: 'Present Perfect Continuous Tense',
    tenseNameKh: 'បច្ចុប្បន្នកាលពេញលេញកំពុងបន្ត',
    category: 'present',
    formulaPositive: 'S + have / has + been + V-ing + Object',
    formulaNegative: 'S + have / has + not + been + V-ing + Object',
    formulaQuestion: 'Have / Has + S + been + V-ing + Object?',
    signalWords: ['for two hours', 'since morning', 'all day', 'how long', 'lately', 'recently'],
    explanationKh: 'សង្កត់ធ្ងន់លើរយៈពេល (Duration) នៃសកម្មភាពដែលបានចាប់ផ្តើមពីអតីតកាល ហើយកំពុងតែបន្តធ្វើឥតដាច់រហូតដល់ពេលនេះ ឬទើបតែឈប់ធ្វើដែលបន្សល់ភស្តុតាងឃើញជាក់ស្តែង។',
    explanationEn: 'Emphasizes the continuous duration of an activity that started in the past and is still ongoing or just stopped.',
    examples: [
      {
        en: 'I have been waiting for you for two hours!',
        kh: 'ខ្ញុំបាននិងកំពុងរង់ចាំអ្នកអស់រយៈពេល ២ ម៉ោងហើយណា!',
        note: 'សង្កត់ធ្ងន់លើរយៈពេលរង់ចាំដ៏យូរ'
      },
      {
        en: 'It has been raining all morning.',
        kh: 'មេឃបាននិងកំពុងតែភ្លៀងពេញមួយព្រឹកនេះហើយ។',
        note: 'បន្តជាប់ឥតដាច់'
      }
    ],
    commonMistake: {
      wrong: 'How long are you living here?',
      right: 'How long have you been living here?',
      explanationKh: 'សំណួរសួរពីប្រវែងពេលវេលាដែលបានធ្វើរហូតមកដល់បច្ចុប្បន្នត្រូវប្រើ Present Perfect Continuous (How long have you been living...)'
    },
    illustrationTag: 'Duration Focus',
    iconName: 'Timer'
  },

  // 5. PAST SIMPLE
  {
    id: 'tense-past-simple',
    number: 5,
    tenseNameEn: 'Past Simple Tense',
    tenseNameKh: 'អតីតកាលធម្មតា',
    category: 'past',
    formulaPositive: 'S + V2 (ed / irregular) + Object',
    formulaNegative: 'S + did + not + V(base) + Object',
    formulaQuestion: 'Did + S + V(base) + Object?',
    signalWords: ['yesterday', 'last night', 'last year', 'ago', 'in 1995', 'when I was young'],
    explanationKh: 'ប្រើដើម្បីនិយាយអំពីសកម្មភាពដែលបានចាប់ផ្តើម និងបានបញ្ចប់ទាំងស្រុងក្នុងអតីតកាល ជាមួយនឹងពេលវេលាកំណត់ច្បាស់លាស់។ ក្នុងប្រយោគបដិសេធ ឬសំណួរ ប្រើ "did" ហើយកិរិយាសព្ទត្រឡប់មក V(base)។',
    explanationEn: 'Describes completed actions that occurred at a specific, definite point in past time.',
    examples: [
      {
        en: 'I graduated from university last year.',
        kh: 'ខ្ញុំបានបញ្ចប់ការសិក្សាពីសាកលវិទ្យាល័យកាលពីឆ្នាំមុន។',
        note: 'បញ្ចប់រួចរាល់ទាំងស្រុង'
      },
      {
        en: 'Did you travel to Kampot last weekend?',
        kh: 'តើអ្នកបានទៅកម្សាន្តនៅកំពតកាលពីចុងសប្តាហ៍មុនទេ?',
        note: 'ទម្រង់សំណួរប្រើ Did + V(base)'
      },
      {
        en: 'She bought a new laptop yesterday.',
        kh: 'នាងបានទិញកុំព្យូទ័រយួរដៃថ្មីមួយកាលពីម្សិលមិញ។',
        note: 'Bought គឺជា V2 នៃ Buy'
      }
    ],
    commonMistake: {
      wrong: 'I didn’t went to school yesterday.',
      right: 'I didn’t go to school yesterday.',
      explanationKh: 'នៅពេលមាន did ឬ didn\'t រួចហើយ កិរិយាសព្ទបន្ទាប់ត្រូវតែជាទម្រង់ដើម go មិនមែន went ឡើយ។'
    },
    illustrationTag: 'Completed Past',
    iconName: 'History'
  },

  // 6. PAST CONTINUOUS
  {
    id: 'tense-past-continuous',
    number: 6,
    tenseNameEn: 'Past Continuous Tense',
    tenseNameKh: 'អតីតកាលកំពុងបន្ត',
    category: 'past',
    formulaPositive: 'S + was / were + V-ing + Object',
    formulaNegative: 'S + was / were + not + V-ing + Object',
    formulaQuestion: 'Was / Were + S + V-ing + Object?',
    signalWords: ['at 8 PM last night', 'while', 'when', 'as', 'all yesterday evening'],
    explanationKh: 'ប្រើដើម្បីរៀបរាប់ពីសកម្មភាពដែលកំពុងតែកើតឡើងនៅចំណុចពេលណាមួយជាក់លាក់ក្នុងអតីតកាល ឬសកម្មភាពមួយកំពុងកើតឡើងស្រាប់តែមានសកម្មភាពមួយទៀតចូលមកកាត់ផ្តាច់ (Past Continuous + Past Simple)។',
    explanationEn: 'Actions that were in progress at a specific past moment, or an ongoing background action interrupted by another.',
    examples: [
      {
        en: 'At 9 PM yesterday, I was reading a book.',
        kh: 'នៅម៉ោង ៩ យប់កាលពីម្សិលមិញ ខ្ញុំកំពុងតែអានសៀវភៅ។',
        note: 'ម៉ោងជាក់លាក់ក្នុងអតីតកាល'
      },
      {
        en: 'While I was cooking, the telephone rang.',
        kh: 'ខណៈពេលដែលខ្ញុំកំពុងតែធ្វើម្ហូប ស្រាប់តែទូរស័ព្ទរោទ៍ឡើង។',
        note: 'សកម្មភាពកំពុងធ្វើ (was cooking) ត្រូវកាត់ដោយ (rang)'
      }
    ],
    commonMistake: {
      wrong: 'When I called him, he cooked.',
      right: 'When I called him, he was cooking.',
      explanationKh: 'ពេលយើងខលទៅ គាត់កំពុងតែស្ថិតក្នុងសកម្មភាពធ្វើម្ហូប ដូច្នេះត្រូវប្រើ was cooking (Past Continuous)។'
    },
    illustrationTag: 'Past in Progress',
    iconName: 'FastForward'
  },

  // 7. PAST PERFECT
  {
    id: 'tense-past-perfect',
    number: 7,
    tenseNameEn: 'Past Perfect Tense',
    tenseNameKh: 'អតីតកាលពេញលេញ',
    category: 'past',
    formulaPositive: 'S + had + V3 (Past Participle) + Object',
    formulaNegative: 'S + had + not + V3 + Object',
    formulaQuestion: 'Had + S + V3 + Object?',
    signalWords: ['before', 'after', 'by the time', 'already', 'when', 'until then'],
    explanationKh: 'ប្រើដើម្បីបញ្ជាក់ពីសកម្មភាពមួយដែលបានកើតឡើង និងបានបញ្ចប់រួចរាល់ មុនពេលសកម្មភាពមួយទៀតក្នុងអតីតកាលបានចាប់ផ្តើម។ (សកម្មភាពមុន = Past Perfect / សកម្មភាពក្រោយ = Past Simple)។',
    explanationEn: 'Expresses an action that was completely finished BEFORE another past event took place.',
    examples: [
      {
        en: 'When we arrived at the cinema, the movie had already started.',
        kh: 'នៅពេលពួកយើងទៅដល់រោងកុន ខ្សែភាពយន្តបានចាប់ផ្តើមបាត់ទៅហើយ។',
        note: 'កុនបញ្ចាំងមុន (had started) -> ពួកយើងទៅដល់ក្រោយ (arrived)'
      },
      {
        en: 'She had finished her dinner before her father returned home.',
        kh: 'នាងបានញ៉ាំអាហារពេលល្ងាចរួចរាល់ មុនពេលឪពុករបស់នាងត្រឡប់មកដល់ផ្ទះ។',
        note: 'ញ៉ាំរួចមុន (had finished)'
      }
    ],
    commonMistake: {
      wrong: 'The train left before I reached the station. (Ambiguous)',
      right: 'The train had left before I reached the station.',
      explanationKh: 'ប្រើ Past Perfect "had left" ដើម្បីបញ្ជាក់ច្បាស់ថារថភ្លើងបានចេញដំណើរទៅមុនពេលខ្ញុំទៅដល់។'
    },
    illustrationTag: 'Earlier Past Action',
    iconName: 'ArrowLeftCircle'
  },

  // 8. PAST PERFECT CONTINUOUS
  {
    id: 'tense-past-perfect-continuous',
    number: 8,
    tenseNameEn: 'Past Perfect Continuous Tense',
    tenseNameKh: 'អតីតកាលពេញលេញកំពុងបន្ត',
    category: 'past',
    formulaPositive: 'S + had + been + V-ing + Object',
    formulaNegative: 'S + had + not + been + V-ing + Object',
    formulaQuestion: 'Had + S + been + V-ing + Object?',
    signalWords: ['for hours before', 'since morning', 'how long', 'all day before'],
    explanationKh: 'សង្កត់ធ្ងន់លើរយៈពេលនៃសកម្មភាពដែលបាននិងកំពុងកើតឡើងជាបន្តបន្ទាប់ រហូតដល់ចំណុចពេលជាក់លាក់មួយផ្សេងទៀតក្នុងអតីតកាល។',
    explanationEn: 'Emphasizes the duration of continuous past activity leading up to another specific past moment.',
    examples: [
      {
        en: 'He was exhausted because he had been driving for eight hours.',
        kh: 'គាត់អស់កម្លាំងខ្លាំងណាស់ ពីព្រោះគាត់បានបើកបរជាប់គ្នារយៈពេល ៨ ម៉ោងមុននោះ។',
        note: 'សង្កត់ធ្ងន់លើការបើកបរជាប់គ្នា ៨ ម៉ោង'
      }
    ],
    commonMistake: {
      wrong: 'She was tired because she was running for 2 hours.',
      right: 'She was tired because she had been running for 2 hours.',
      explanationKh: 'សកម្មភាពរត់ ២ ម៉ោងបានកើតឡើងមុន និងជាមូលហេតុធ្វើឱ្យគាត់ហត់ក្នុងអតីតកាល ដូច្នេះត្រូវប្រើ had been running។'
    },
    illustrationTag: 'Past Duration Prior',
    iconName: 'RotateCcw'
  },

  // 9. FUTURE SIMPLE
  {
    id: 'tense-future-simple',
    number: 9,
    tenseNameEn: 'Future Simple Tense',
    tenseNameKh: 'អនាគតកាលធម្មតា',
    category: 'future',
    formulaPositive: 'S + will + V(base)  OR  S + am/is/are + going to + V(base)',
    formulaNegative: 'S + will not (won\'t) + V(base)',
    formulaQuestion: 'Will + S + V(base)?',
    signalWords: ['tomorrow', 'next week', 'next month', 'soon', 'in the future', 'in 2030'],
    explanationKh: 'ប្រើ "will" សម្រាប់ការសម្រេចចិត្តភ្លាមៗ (Instant decisions), ការទស្សន៍ទាយ (Predictions), ការសន្យា (Promises)។ ប្រើ "be going to" សម្រាប់គម្រោងទុកជាមុន (Prior intentions) ឬការទស្សន៍ទាយដែលមានភស្តុតាងជាក់ស្តែង។',
    explanationEn: 'Used for instant decisions, promises, and predictions (will) or planned intentions (going to).',
    examples: [
      {
        en: 'I will help you carry those heavy bags.',
        kh: 'ខ្ញុំនឹងជួយអ្នកយួរកាបូបធ្ងន់ៗទាំងនោះ។',
        note: 'ការសម្រេចចិត្តភ្លាមៗ (Instant offer)'
      },
      {
        en: 'I am going to visit my grandparents next Sunday.',
        kh: 'ខ្ញុំនឹងទៅលេងជីដូនជីតារបស់ខ្ញុំនៅថ្ងៃអាទិត្យក្រោយ។',
        note: 'គម្រោងដែលបានគិតទុកជាមុន (Prior intention)'
      },
      {
        en: 'Look at those dark clouds! It is going to rain.',
        kh: 'មើលពពកខ្មៅទាំងនោះចុះ! មេឃនឹងធ្លាក់ភ្លៀងហើយ។',
        note: 'ការទស្សន៍ទាយមានភស្តុតាងជាក់ស្តែង (Dark clouds)'
      }
    ],
    commonMistake: {
      wrong: 'I will to call you later. / I will calling you.',
      right: 'I will call you later.',
      explanationKh: 'ក្រោយពាក្យ modal verb "will" ត្រូវប្រើប្រាស់កិរិយាសព្ទដើម V(base) សុទ្ធ ដោយគ្មាន "to" ឬ "-ing" ឡើយ។'
    },
    illustrationTag: 'Predictions & Decisions',
    iconName: 'Compass'
  },

  // 10. FUTURE CONTINUOUS
  {
    id: 'tense-future-continuous',
    number: 10,
    tenseNameEn: 'Future Continuous Tense',
    tenseNameKh: 'អនាគតកាលកំពុងបន្ត',
    category: 'future',
    formulaPositive: 'S + will be + V-ing + Object',
    formulaNegative: 'S + will not be + V-ing + Object',
    formulaQuestion: 'Will + S + be + V-ing + Object?',
    signalWords: ['at 10 AM tomorrow', 'this time next week', 'during the meeting tomorrow'],
    explanationKh: 'ប្រើដើម្បីពិពណ៌នាអំពីសកម្មភាពដែលនឹងកំពុងតែកើតឡើងនៅចំណុចពេលវេលាជាក់លាក់ណាមួយក្នុងពេលអនាគត។',
    explanationEn: 'Actions that will be ongoing and in progress at a specific exact time in the future.',
    examples: [
      {
        en: 'At 10 AM tomorrow, I will be flying to Bangkok.',
        kh: 'នៅម៉ោង ១០ ព្រឹកថ្ងៃស្អែក ខ្ញុំនឹងកំពុងតែជិះយន្តហោះទៅកាន់ទីក្រុងបាងកក។',
        note: 'ម៉ោងជាក់លាក់ក្នុងអនាគត'
      },
      {
        en: 'This time next week, we will be relaxing on Koh Rong beach.',
        kh: 'ពេលនេះនៅសប្តាហ៍ក្រោយ ពួកយើងនឹងកំពុងលម្ហែកាយនៅលើឆ្នេរកោះរ៉ុង។',
        note: 'សកម្មភាពកំពុងកើតឡើងនៅពេលកំណត់'
      }
    ],
    commonMistake: {
      wrong: 'Tomorrow at 3 PM I will work.',
      right: 'Tomorrow at 3 PM I will be working.',
      explanationKh: 'នៅពេលមានម៉ោងជាក់លាក់ក្នុងអនាគត (At 3 PM tomorrow) យើងប្រើ Future Continuous ដើម្បីបង្ហាញថាសកម្មភាពកំពុងប្រព្រឹត្តទៅ។'
    },
    illustrationTag: 'Future in Progress',
    iconName: 'Calendar'
  },

  // 11. FUTURE PERFECT
  {
    id: 'tense-future-perfect',
    number: 11,
    tenseNameEn: 'Future Perfect Tense',
    tenseNameKh: 'អនាគតកាលពេញលេញ',
    category: 'future',
    formulaPositive: 'S + will have + V3 (Past Participle) + Object',
    formulaNegative: 'S + will not have + V3 + Object',
    formulaQuestion: 'Will + S + have + V3 + Object?',
    signalWords: ['by tomorrow', 'by next year', 'by the time', 'by 5 PM'],
    explanationKh: 'ប្រើដើម្បីនិយាយពីសកម្មភាពដែលនឹងត្រូវបញ្ចប់រួចរាល់ ត្រឹម ឬមុនពេលណាមួយជាក់លាក់ក្នុងអនាគត (ប្រើច្រើនជាមួយពាក្យ "by ...")។',
    explanationEn: 'Actions that will be completed before or by a certain target deadline in the future.',
    examples: [
      {
        en: 'By 2027, I will have graduated from university.',
        kh: 'ត្រឹមឆ្នាំ ២០២៧ ខ្ញុំនឹងបានបញ្ចប់ការសិក្សាពីសាកលវិទ្យាល័យរួចរាល់។',
        note: 'បញ្ចប់រួចមុន ឬត្រឹមឆ្នាំ ២០២៧'
      },
      {
        en: 'By the time you wake up, I will have prepared breakfast.',
        kh: 'ត្រឹមពេលដែលអ្នកភ្ញាក់ពីគេង ខ្ញុំនឹងបានរៀបចំអាហារពេលព្រឹករួចជាស្រេច។',
        note: 'រៀបចំចប់សព្វគ្រប់មុនពេលគេភ្ញាក់'
      }
    ],
    commonMistake: {
      wrong: 'By next week, I will finish this report.',
      right: 'By next week, I will have finished this report.',
      explanationKh: 'ពាក្យគន្លឹះ "By next week" (ត្រឹមសប្តាហ៍ក្រោយ) បង្ហាញពីគោលដៅបញ្ចប់ ដូច្នេះត្រូវប្រើ Future Perfect (will have finished)។'
    },
    illustrationTag: 'Future Deadline',
    iconName: 'Award'
  },

  // 12. FUTURE PERFECT CONTINUOUS
  {
    id: 'tense-future-perfect-continuous',
    number: 12,
    tenseNameEn: 'Future Perfect Continuous Tense',
    tenseNameKh: 'អនាគតកាលពេញលេញកំពុងបន្ត',
    category: 'future',
    formulaPositive: 'S + will have been + V-ing + Object',
    formulaNegative: 'S + will not have been + V-ing + Object',
    formulaQuestion: 'Will + S + have been + V-ing + Object?',
    signalWords: ['by next month, for 5 years', 'by 2030, for a decade'],
    explanationKh: 'ប្រើដើម្បីសង្កត់ធ្ងន់លើរយៈពេលនៃសកម្មភាពដែលបាននិងកំពុងកើតឡើងជាបន្តបន្ទាប់ រហូតទៅដល់ចំណុចពេលណាមួយក្នុងអនាគត។',
    explanationEn: 'Emphasizes the duration of an ongoing action up to a specific time marker in the future.',
    examples: [
      {
        en: 'By next December, I will have been working at this company for five years.',
        kh: 'ត្រឹមខែធ្នូខាងមុខនេះ ខ្ញុំនឹងបានធ្វើការនៅក្រុមហ៊ុននេះអស់រយៈពេល ៥ ឆ្នាំគត់ហើយ។',
        note: 'រាប់រយៈពេល ៥ ឆ្នាំគិតត្រឹមពេលកំណត់'
      }
    ],
    commonMistake: {
      wrong: 'By next year, I will work here for 5 years.',
      right: 'By next year, I will have been working here for 5 years.',
      explanationKh: 'ដើម្បីបង្ហាញពីការបន្តធ្វើ និងរយៈពេលគិតត្រឹមចំណុចពេលអនាគត ត្រូវប្រើ Future Perfect Continuous។'
    },
    illustrationTag: 'Future Milestone Duration',
    iconName: 'TrendingUp'
  }
];
