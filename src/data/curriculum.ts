import { Lesson, VocabItem, Badge } from '../types';

export const LESSONS: Lesson[] = [
  // ==========================================
  // BEGINNER LEVEL (កម្រិតដំបូង)
  // ==========================================
  {
    id: 'beg-1',
    level: 'beginner',
    levelNumber: 1,
    order: 1,
    titleEn: 'Greetings & Basic Introductions',
    titleKh: 'ការស្វាគមន៍ និងការណែនាំខ្លួន',
    descriptionKh: 'រៀនពាក្យស្វាគមន៍ ការសួរសុខទុក្ខ និងរបៀបណែនាំខ្លួនជាភាសាអង់គ្លេសយ៉ាងត្រឹមត្រូវ។',
    iconName: 'HandMetal',
    xpReward: 50,
    vocabulary: [
      {
        id: 'v-b1-1',
        english: 'Hello',
        phonetic: '/həˈloʊ/',
        khmerPhonetic: 'ហេឡូ',
        khmerMeaning: 'សួស្តី / ជំរាបសួរ',
        partOfSpeech: 'phrase',
        partOfSpeechKhmer: 'កន្សោមពាក្យ',
        exampleEn: 'Hello, my name is Dara.',
        exampleKh: 'សួស្តី ខ្ញុំឈ្មោះតារា។',
        level: 'beginner',
        topicId: 'greetings',
        notes: 'ប្រើសម្រាប់ស្វាគមន៍ជាទូទៅ ទាំងផ្លូវការ និងក្រៅផ្លូវការ។'
      },
      {
        id: 'v-b1-2',
        english: 'Nice to meet you',
        phonetic: '/naɪs tuː miːt juː/',
        khmerPhonetic: 'ណាយស៍ ធូ មីត យូ',
        khmerMeaning: 'រីករាយដែលបានជួបអ្នក',
        partOfSpeech: 'phrase',
        partOfSpeechKhmer: 'កន្សោមពាក្យ',
        exampleEn: 'Nice to meet you, Mr. John.',
        exampleKh: 'រីករាយណាស់ដែលបានជួបលោក ចន។',
        level: 'beginner',
        topicId: 'greetings'
      },
      {
        id: 'v-b1-3',
        english: 'How are you?',
        phonetic: '/haʊ ɑːr juː/',
        khmerPhonetic: 'ហៅ អា យូ?',
        khmerMeaning: 'តើអ្នកសុខសប្បាយជាទេ?',
        partOfSpeech: 'phrase',
        partOfSpeechKhmer: 'កន្សោមពាក្យ',
        exampleEn: 'Good morning! How are you today?',
        exampleKh: 'អរុណសួស្តី! តើថ្ងៃនេះអ្នកសុខសប្បាយជាទេ?',
        level: 'beginner',
        topicId: 'greetings'
      },
      {
        id: 'v-b1-4',
        english: 'Thank you',
        phonetic: '/θæŋk juː/',
        khmerPhonetic: 'ថេងឃ្យូ',
        khmerMeaning: 'អរគុណ',
        partOfSpeech: 'phrase',
        partOfSpeechKhmer: 'កន្សោមពាក្យ',
        exampleEn: 'Thank you very much for your help.',
        exampleKh: 'អរគុណខ្លាំងណាស់សម្រាប់ជំនួយរបស់អ្នក។',
        level: 'beginner',
        topicId: 'greetings'
      },
      {
        id: 'v-b1-5',
        english: 'Goodbye',
        phonetic: '/ɡʊdˈbaɪ/',
        khmerPhonetic: 'ហ្គូដបាយ',
        khmerMeaning: 'លាហើយ / ជំរាបលា',
        partOfSpeech: 'phrase',
        partOfSpeechKhmer: 'កន្សោមពាក្យ',
        exampleEn: 'Goodbye, see you tomorrow!',
        exampleKh: 'លាហើយ ជួបគ្នាថ្ងៃស្អែក!',
        level: 'beginner',
        topicId: 'greetings'
      },
      {
        id: 'v-b1-6',
        english: 'Where are you from?',
        phonetic: '/wɛər ɑːr juː frʌm/',
        khmerPhonetic: 'វែរ អា យូ ហ្វ្រាំ?',
        khmerMeaning: 'តើអ្នកមកពីប្រទេសណា?',
        partOfSpeech: 'phrase',
        partOfSpeechKhmer: 'កន្សោមពាក្យ',
        exampleEn: 'Where are you from? - I am from Cambodia.',
        exampleKh: 'តើអ្នកមកពីណា? - ខ្ញុំមកពីប្រទេសកម្ពុជា។',
        level: 'beginner',
        topicId: 'greetings'
      }
    ],
    dialogue: [
      {
        id: 'd-b1-1',
        speaker: 'Sophea',
        speakerKh: 'សុភា',
        avatarColor: 'bg-emerald-500',
        english: 'Hello! My name is Sophea. What is your name?',
        khmer: 'សួស្តី! ខ្ញុំឈ្មោះសុភា។ តើអ្នកឈ្មោះអ្វីដែរ?',
        audioText: 'Hello! My name is Sophea. What is your name?'
      },
      {
        id: 'd-b1-2',
        speaker: 'Alex',
        speakerKh: 'អាឡិច',
        avatarColor: 'bg-blue-500',
        english: 'Hi Sophea! I am Alex. Nice to meet you.',
        khmer: 'សួស្តីសុភា! ខ្ញុំឈ្មោះអាឡិច។ រីករាយណាស់ដែលបានស្គាល់។',
        audioText: 'Hi Sophea! I am Alex. Nice to meet you.'
      },
      {
        id: 'd-b1-3',
        speaker: 'Sophea',
        speakerKh: 'សុភា',
        avatarColor: 'bg-emerald-500',
        english: 'Nice to meet you too! Where are you from?',
        khmer: 'រីករាយដូចគ្នា! តើអ្នកមកពីប្រទេសណាដែរ?',
        audioText: 'Nice to meet you too! Where are you from?'
      },
      {
        id: 'd-b1-4',
        speaker: 'Alex',
        speakerKh: 'អាឡិច',
        avatarColor: 'bg-blue-500',
        english: 'I am from Canada, but I live in Phnom Penh now.',
        khmer: 'ខ្ញុំមកពីប្រទេសកាណាដា ប៉ុន្តែឥឡូវនេះខ្ញុំរស់នៅភ្នំពេញ។',
        audioText: 'I am from Canada, but I live in Phnom Penh now.'
      }
    ],
    grammar: {
      titleEn: 'Verb "To Be" (am / is / are)',
      titleKh: 'កិរិយាសព្ទ "To Be" (ជា, គឺ, នៅ)',
      explanationKh: 'កិរិយាសព្ទ "To Be" ត្រូវបានប្រើដើម្បីបញ្ជាក់ពីអត្តសញ្ញាណ ទីតាំង ឬលក្ខណៈ។',
      formula: 'Subject + am/is/are + Complement',
      examples: [
        { en: 'I am a student.', kh: 'ខ្ញុំគឺជាសិស្ស។', tip: 'I ប្រើជាមួយ am' },
        { en: 'He is from Cambodia.', kh: 'គាត់មកពីប្រទេសកម្ពុជា។', tip: 'He/She/It ប្រើជាមួយ is' },
        { en: 'They are friendly.', kh: 'ពួកគេរួសរាយរាក់ទាក់ណាស់។', tip: 'We/They/You ប្រើជាមួយ are' }
      ]
    }
  },
  {
    id: 'beg-2',
    level: 'beginner',
    levelNumber: 1,
    order: 2,
    titleEn: 'Daily Routine & Time',
    titleKh: 'សកម្មភាពប្រចាំថ្ងៃ និងពេលវេលា',
    descriptionKh: 'រៀនពាក្យសម្គាល់ពេលវេលា ម៉ោង និងសកម្មភាពធម្មតាដែលយើងធ្វើរាល់ថ្ងៃ។',
    iconName: 'Clock',
    xpReward: 60,
    vocabulary: [
      {
        id: 'v-b2-1',
        english: 'Wake up',
        phonetic: '/weɪk ʌp/',
        khmerPhonetic: 'វេក អាប',
        khmerMeaning: 'ភ្ញាក់ពីគេង',
        partOfSpeech: 'verb',
        partOfSpeechKhmer: 'កិរិយាសព្ទ',
        exampleEn: 'I wake up at 6:00 AM every morning.',
        exampleKh: 'ខ្ញុំភ្ញាក់ពីគេងនៅម៉ោង ៦ ព្រឹកជារៀងរាល់ថ្ងៃ។',
        level: 'beginner',
        topicId: 'routine'
      },
      {
        id: 'v-b2-2',
        english: 'Breakfast',
        phonetic: '/ˈbrɛkfəst/',
        khmerPhonetic: 'ប្រេកហ្វឹស្ត',
        khmerMeaning: 'អាហារពេលព្រឹក',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'Do you want to eat breakfast with me?',
        exampleKh: 'តើអ្នកចង់ញ៉ាំអាហារពេលព្រឹកជាមួយខ្ញុំទេ?',
        level: 'beginner',
        topicId: 'routine'
      },
      {
        id: 'v-b2-3',
        english: 'Go to work',
        phonetic: '/ɡoʊ tuː wɜːrk/',
        khmerPhonetic: 'ហ្គូ ធូ វើក',
        khmerMeaning: 'ទៅធ្វើការ',
        partOfSpeech: 'phrase',
        partOfSpeechKhmer: 'កន្សោមពាក្យ',
        exampleEn: 'She goes to work by motorcycle.',
        exampleKh: 'នាងជិះម៉ូតូទៅធ្វើការ។',
        level: 'beginner',
        topicId: 'routine'
      },
      {
        id: 'v-b2-4',
        english: 'What time is it?',
        phonetic: '/wʌt taɪm ɪz ɪt/',
        khmerPhonetic: 'វ៉ាត់ ថាម អ៊ីស អ៊ីត?',
        khmerMeaning: 'តើម៉ោងប៉ុន្មានហើយ?',
        partOfSpeech: 'phrase',
        partOfSpeechKhmer: 'កន្សោមពាក្យ',
        exampleEn: 'Excuse me, what time is it now?',
        exampleKh: 'សូមទោស តើឥឡូវនេះម៉ោងប៉ុន្មានហើយ?',
        level: 'beginner',
        topicId: 'routine'
      },
      {
        id: 'v-b2-5',
        english: 'Go to sleep',
        phonetic: '/ɡoʊ tuː sliːp/',
        khmerPhonetic: 'ហ្គូ ធូ ស្លីប',
        khmerMeaning: 'ចូលគេង',
        partOfSpeech: 'phrase',
        partOfSpeechKhmer: 'កន្សោមពាក្យ',
        exampleEn: 'I usually go to sleep at 10 PM.',
        exampleKh: 'ខ្ញុំតែងតែចូលគេងនៅម៉ោង ១០ យប់។',
        level: 'beginner',
        topicId: 'routine'
      }
    ],
    grammar: {
      titleEn: 'Present Simple Tense (បច្ចុប្បន្នកាលធម្មតា)',
      titleKh: 'កាលបច្ចុប្បន្នធម្មតា សម្រាប់ទម្លាប់',
      explanationKh: 'ប្រើដើម្បីនិយាយពីទម្លាប់ ឬការពិតទូទៅ។ បើប្រធានជា He/She/It កិរិយាសព្ទត្រូវថែម s ឬ es។',
      formula: 'Subject + Verb (s/es) + Object',
      examples: [
        { en: 'I drink coffee every morning.', kh: 'ខ្ញុំផឹកកាហ្វេជារៀងរាល់ព្រឹក។' },
        { en: 'He works at a bank.', kh: 'គាត់ធ្វើការនៅធនាគារមួយ។', tip: 'ថែម s លើ work -> works' }
      ]
    }
  },
  {
    id: 'beg-3',
    level: 'beginner',
    levelNumber: 1,
    order: 3,
    titleEn: 'Food, Dining & Ordering',
    titleKh: 'ម្ហូបអាហារ និងការកុម្ម៉ង់',
    descriptionKh: 'រៀនពាក្យសម្គាល់មុខម្ហូប ភេសជ្ជៈ និងប្រយោគប្រើពេលទៅញ៉ាំអីនៅហាងបាយ។',
    iconName: 'Utensils',
    xpReward: 60,
    vocabulary: [
      {
        id: 'v-b3-1',
        english: 'Delicious',
        phonetic: '/dɪˈlɪʃəs/',
        khmerPhonetic: 'ឌីលីសសឹស',
        khmerMeaning: 'ឆ្ងាញ់ណាស់',
        partOfSpeech: 'adjective',
        partOfSpeechKhmer: 'គុណនាម',
        exampleEn: 'This Khmer noodle soup is delicious!',
        exampleKh: 'នំបញ្ចុកនេះពិតជាឆ្ងាញ់ណាស់!',
        level: 'beginner',
        topicId: 'food'
      },
      {
        id: 'v-b3-2',
        english: 'Menu',
        phonetic: '/ˈmɛnjuː/',
        khmerPhonetic: 'ម៉ឺនុយ / មេនយូ',
        khmerMeaning: 'បញ្ជីរាយមុខម្ហូប',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'Could we please see the menu?',
        exampleKh: 'តើខ្ញុំអាចសុំមើលបញ្ជីមុខម្ហូបបានទេ?',
        level: 'beginner',
        topicId: 'food'
      },
      {
        id: 'v-b3-3',
        english: 'The bill / The check',
        phonetic: '/ðə bɪl/',
        khmerPhonetic: 'ដឹ ប៊ីល',
        khmerMeaning: 'គិតលុយ / វិក្កយបត្រ',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'Can I have the bill, please?',
        exampleKh: 'សូមគិតលុយ!',
        level: 'beginner',
        topicId: 'food'
      },
      {
        id: 'v-b3-4',
        english: 'Water',
        phonetic: '/ˈwɔːtər/',
        khmerPhonetic: 'វ៉តថឺ',
        khmerMeaning: 'ទឹកផឹក',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'A bottle of cold water, please.',
        exampleKh: 'សូមទឹកត្រជាក់មួយដប។',
        level: 'beginner',
        topicId: 'food'
      },
      {
        id: 'v-b3-5',
        english: 'Vegetables',
        phonetic: '/ˈvɛdʒtəbəlz/',
        khmerPhonetic: 'វេចថឺបល់ស៍',
        khmerMeaning: 'បន្លែបង្ការ',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'I like fresh vegetables with rice.',
        exampleKh: 'ខ្ញុំចូលចិត្តបន្លែស្រស់ៗជាមួយបាយ។',
        level: 'beginner',
        topicId: 'food'
      }
    ]
  },

  // ==========================================
  // INTERMEDIATE LEVEL (កម្រិតមធ្យម)
  // ==========================================
  {
    id: 'int-1',
    level: 'intermediate',
    levelNumber: 2,
    order: 1,
    titleEn: 'Travel, Airports & Navigation',
    titleKh: 'ការធ្វើដំណើរ ព្រលានយន្តហោះ និងការសួរផ្លូវ',
    descriptionKh: 'រៀបចំពាក្យគន្លឹះសម្រាប់ការធ្វើដំណើរ ជិះយន្តហោះ និងការស្នាក់នៅសណ្ឋាគារ។',
    iconName: 'Plane',
    xpReward: 80,
    vocabulary: [
      {
        id: 'v-i1-1',
        english: 'Boarding pass',
        phonetic: '/ˈbɔːrdɪŋ pæs/',
        khmerPhonetic: 'ប៊័រឌីង ផាស',
        khmerMeaning: 'សំបុត្រឡើងលើយន្តហោះ',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'Please show your passport and boarding pass at the gate.',
        exampleKh: 'សូមបង្ហាញលិខិតឆ្លងដែន និងសំបុត្រឡើងយន្តហោះរបស់អ្នកនៅច្រកទ្វារ។',
        level: 'intermediate',
        topicId: 'travel'
      },
      {
        id: 'v-i1-2',
        english: 'Delay',
        phonetic: '/dɪˈleɪ/',
        khmerPhonetic: 'ឌីឡេ',
        khmerMeaning: 'ការពន្យារពេល / យឺតយ៉ាវ',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម/កិរិយាសព្ទ',
        exampleEn: 'Our flight has a two-hour delay due to bad weather.',
        exampleKh: 'ជើងហោះហើររបស់យើងត្រូវបានពន្យារពេលពីរម៉ោងដោយសារអាកាសធាតុអាក្រក់។',
        level: 'intermediate',
        topicId: 'travel'
      },
      {
        id: 'v-i1-3',
        english: 'Luggage / Baggage',
        phonetic: '/ˈlʌɡɪdʒ/',
        khmerPhonetic: 'ឡាហ្គិច',
        khmerMeaning: 'វ៉ាលី ឬអីវ៉ាន់ធ្វើដំណើរ',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'You can pick up your luggage at Carousel 4.',
        exampleKh: 'អ្នកអាចទទួលយកវ៉ាលីរបស់អ្នកនៅខ្សែក្រវ៉ាត់លេខ ៤។',
        level: 'intermediate',
        topicId: 'travel'
      },
      {
        id: 'v-i1-4',
        english: 'Reservation',
        phonetic: '/ˌrɛzərˈveɪʃən/',
        khmerPhonetic: 'រ៉េសឺវ៉េសិន',
        khmerMeaning: 'ការកក់ទុកជាមុន',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'I have a hotel reservation under the name Sokha.',
        exampleKh: 'ខ្ញុំមានការកក់សណ្ឋាគារក្រោមឈ្មោះ សុខា។',
        level: 'intermediate',
        topicId: 'travel'
      },
      {
        id: 'v-i1-5',
        english: 'Destination',
        phonetic: '/ˌdɛstɪˈneɪʃən/',
        khmerPhonetic: 'ដេសស្ទីណេសិន',
        khmerMeaning: 'គោលដៅធ្វើដំណើរ',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'Siem Reap is our final destination.',
        exampleKh: 'សៀមរាប គឺជាគោលដៅចុងក្រោយរបស់យើង។',
        level: 'intermediate',
        topicId: 'travel'
      }
    ],
    dialogue: [
      {
        id: 'd-i1-1',
        speaker: 'Officer',
        speakerKh: 'មន្ត្រីព្រលានយន្តហោះ',
        avatarColor: 'bg-indigo-600',
        english: 'Good afternoon. May I see your passport and declaration form?',
        khmer: 'ទិវាសួស្តី! តើខ្ញុំអាចសុំមើលលិខិតឆ្លងដែន និងទម្រង់ប្រកាសរបស់អ្នកបានទេ?',
        audioText: 'Good afternoon. May I see your passport and declaration form?'
      },
      {
        id: 'd-i1-2',
        speaker: 'Traveler',
        speakerKh: 'អ្នកដំណើរ',
        avatarColor: 'bg-emerald-600',
        english: 'Sure, here they are. How long does the transit take?',
        khmer: 'បាទ/ចាស បាន! នេះឯង។ តើការឆ្លងកាត់ចំណាយពេលប៉ុន្មានដែរ?',
        audioText: 'Sure, here they are. How long does the transit take?'
      },
      {
        id: 'd-i1-3',
        speaker: 'Officer',
        speakerKh: 'មន្ត្រីព្រលានយន្តហោះ',
        avatarColor: 'bg-indigo-600',
        english: 'Your connecting flight departs in 90 minutes from Terminal B.',
        khmer: 'ជើងហោះហើរបន្តរបស់អ្នកនឹងចេញដំណើរក្នុងរយៈពេល ៩០ នាទីទៀតពីស្ថានីយ B។',
        audioText: 'Your connecting flight departs in 90 minutes from Terminal B.'
      }
    ],
    grammar: {
      titleEn: 'Modal Verbs for Politeness (Could / Would / May)',
      titleKh: 'កិរិយាសព្ទជំនួយសម្រាប់សុជីវធម៌',
      explanationKh: 'នៅពេលសុំជំនួយ ឬសួរព័ត៌មានក្នុងការធ្វើដំណើរ ការប្រើ Could ឬ Would គឺមានភាពគួរសមជាង Can។',
      formula: 'Could / Would you please + Verb base + ?',
      examples: [
        { en: 'Could you please help me with this bag?', kh: 'តើអ្នកអាចជួយយួរកាបូបនេះបន្តិចបានទេ?' },
        { en: 'Would you like some water?', kh: 'តើអ្នកចង់ពិសាទឹកទេ?' }
      ]
    }
  },
  {
    id: 'int-2',
    level: 'intermediate',
    levelNumber: 2,
    order: 2,
    titleEn: 'Workplace, Careers & Interviews',
    titleKh: 'កន្លែងធ្វើការ អាជីព និងការសម្ភាសន៍',
    descriptionKh: 'ស្វែងយល់ពីភាសាអង់គ្លេសទំនាក់ទំនងនៅការិយាល័យ ការសរសេរអ៊ីមែល និងឆ្លើយសម្ភាសន៍ការងារ។',
    iconName: 'Briefcase',
    xpReward: 85,
    vocabulary: [
      {
        id: 'v-i2-1',
        english: 'Deadline',
        phonetic: '/ˈdɛdlaɪn/',
        khmerPhonetic: 'ដែដឡាញ',
        khmerMeaning: 'កាលបរិច្ឆេទកំណត់បញ្ចប់ការងារ',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'We need to submit the final report before the deadline tomorrow.',
        exampleKh: 'ពួកយើងត្រូវតែបញ្ជូនរបាយការណ៍ចុងក្រោយមុនថ្ងៃកំណត់ថ្ងៃស្អែក។',
        level: 'intermediate',
        topicId: 'work'
      },
      {
        id: 'v-i2-2',
        english: 'Colleague',
        phonetic: '/ˈkɒliːɡ/',
        khmerPhonetic: 'ខលីក',
        khmerMeaning: 'មិត្តរួមការងារ',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'My colleagues are very supportive and hardworking.',
        exampleKh: 'មិត្តរួមការងាររបស់ខ្ញុំពិតជាគាំទ្រ និងខិតខំធ្វើការណាស់។',
        level: 'intermediate',
        topicId: 'work'
      },
      {
        id: 'v-i2-3',
        english: 'Experience',
        phonetic: '/ɪkˈspɪəriəns/',
        khmerPhonetic: 'អ៊ិកស្ពៀរៀនស៍',
        khmerMeaning: 'បទពិសោធន៍',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'I have three years of experience in software development.',
        exampleKh: 'ខ្ញុំមានបទពិសោធន៍ ៣ ឆ្នាំក្នុងការអភិវឌ្ឍកម្មវិធីកុំព្យូទ័រ។',
        level: 'intermediate',
        topicId: 'work'
      },
      {
        id: 'v-i2-4',
        english: 'Schedule',
        phonetic: '/ˈskɛdʒuːl/',
        khmerPhonetic: 'ស្កេជូល',
        khmerMeaning: 'កាលវិភាគ / កាលវិភាគប្រជុំ',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'Let me check my schedule for next Monday.',
        exampleKh: 'ចាំខ្ញុំឆែកមើលកាលវិភាគរបស់ខ្ញុំសម្រាប់ថ្ងៃច័ន្ទក្រោយសិន។',
        level: 'intermediate',
        topicId: 'work'
      },
      {
        id: 'v-i2-5',
        english: 'Responsible for',
        phonetic: '/rɪˈspɒnsəbl fɔːr/',
        khmerPhonetic: 'រីស្ពនស៊ីបល ហ្វ័រ',
        khmerMeaning: 'ទទួលខុសត្រូវលើ...',
        partOfSpeech: 'phrase',
        partOfSpeechKhmer: 'កន្សោមពាក្យ',
        exampleEn: 'She is responsible for marketing and client communications.',
        exampleKh: 'នាងទទួលខុសត្រូវលើផ្នែកទីផ្សារ និងការទំនាក់ទំនងអតិថិជន។',
        level: 'intermediate',
        topicId: 'work'
      }
    ],
    grammar: {
      titleEn: 'Present Perfect Tense (have / has + past participle)',
      titleKh: 'កាលបច្ចុប្បន្នបរិបូណ៌ សម្រាប់បទពិសោធន៍',
      explanationKh: 'ប្រើដើម្បីរៀបរាប់អំពីបទពិសោធន៍ការងារ ឬសកម្មភាពដែលបានកើតឡើងក្នុងអតីតកាល ហើយនៅមានផលប៉ះពាល់ដល់បច្ចុប្បន្ន។',
      formula: 'Subject + have / has + Past Participle (V3)',
      examples: [
        { en: 'I have worked here for five years.', kh: 'ខ្ញុំបានធ្វើការនៅទីនេះអស់រយៈពេល ៥ ឆ្នាំហើយ។' },
        { en: 'Have you ever managed a team?', kh: 'តើអ្នកធ្លាប់គ្រប់គ្រងក្រុមការងារពីមុនមកដែរឬទេ?' }
      ]
    }
  },

  // ==========================================
  // ADVANCED LEVEL (កម្រិតខ្ពស់)
  // ==========================================
  {
    id: 'adv-1',
    level: 'advanced',
    levelNumber: 3,
    order: 1,
    titleEn: 'Business Negotiations & Strategy',
    titleKh: 'ការចរចាពាណិជ្ជកម្ម និងយុទ្ធសាស្ត្រ',
    descriptionKh: 'ស្វែងយល់ពីវាក្យសព្ទជាន់ខ្ពស់សម្រាប់ការចរចាកិច្ចសន្យា ភាពជាដៃគូ និងយុទ្ធសាស្ត្រពាណិជ្ជកម្មអន្តរជាតិ។',
    iconName: 'TrendingUp',
    xpReward: 100,
    vocabulary: [
      {
        id: 'v-a1-1',
        english: 'Compromise',
        phonetic: '/ˈkɒmprəmaɪz/',
        khmerPhonetic: 'ខមប្រូម៉ាយស៍',
        khmerMeaning: 'ការសម្រុះសម្រួល / ការយោគយល់គ្នាទៅវិញទៅមក',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម/កិរិយាសព្ទ',
        exampleEn: 'Both parties agreed to a mutual compromise regarding the delivery schedule.',
        exampleKh: 'ភាគីទាំងពីរបានយល់ព្រមលើការសម្រុះសម្រួលគ្នាទៅវិញទៅមកទាក់ទងនឹងកាលវិភាគចែកចាយ។',
        level: 'advanced',
        topicId: 'business'
      },
      {
        id: 'v-a1-2',
        english: 'Leverage',
        phonetic: '/ˈlɛvərɪdʒ/',
        khmerPhonetic: 'លេវើរីច',
        khmerMeaning: 'ទាញយកប្រយោជន៍ ឬអត្ថប្រយោជន៍ប្រកួតប្រជែង',
        partOfSpeech: 'verb',
        partOfSpeechKhmer: 'កិរិយាសព្ទ/នាម',
        exampleEn: 'We can leverage our advanced technology to expand into emerging markets.',
        exampleKh: 'ពួកយើងអាចទាញយកប្រយោជន៍ពីបច្ចេកវិទ្យាទំនើបរបស់យើង ដើម្បីពង្រីកទៅកាន់ទីផ្សារដែលកំពុងរីកចម្រើន។',
        level: 'advanced',
        topicId: 'business'
      },
      {
        id: 'v-a1-3',
        english: 'Viable',
        phonetic: '/ˈvaɪəbl/',
        khmerPhonetic: 'វ៉ាយអាប់បល',
        khmerMeaning: 'ដែលអាចដំណើរការទៅបាន / មានប្រសិទ្ធភាពសេដ្ឋកិច្ច',
        partOfSpeech: 'adjective',
        partOfSpeechKhmer: 'គុណនាម',
        exampleEn: 'The board concluded that the investment was not financially viable.',
        exampleKh: 'ក្រុមប្រឹក្សាភិបាលបានសន្និដ្ឋានថាការវិនិយោគនោះមិនអាចដំណើរការបានផ្នែកហិរញ្ញវត្ថុនោះទេ។',
        level: 'advanced',
        topicId: 'business'
      },
      {
        id: 'v-a1-4',
        english: 'Counterpart',
        phonetic: '/ˈkaʊntərpɑːrt/',
        khmerPhonetic: 'ខោនធឺផាត',
        khmerMeaning: 'ដៃគូដែលមានតួនាទីស្មើគ្នា (ក្នុងស្ថាប័នផ្សេង)',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'Our CEO met with her Cambodian counterpart to discuss sustainable trade.',
        exampleKh: 'នាយកប្រតិបត្តិរបស់យើងបានជួបជាមួយសមភាគីកម្ពុជារបស់លោកស្រី ដើម្បីពិភាក្សាអំពីពាណិជ្ជកម្មប្រកបដោយនិរន្តរភាព។',
        level: 'advanced',
        topicId: 'business'
      },
      {
        id: 'v-a1-5',
        english: 'Discrepancy',
        phonetic: '/dɪˈskrɛpənsi/',
        khmerPhonetic: 'ឌីស្គ្រីផិនស៊ី',
        khmerMeaning: 'ភាពមិនស៊ីគ្នា / ភាពខុសគ្នាមិនប្រក្រតី',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'The auditor discovered a significant discrepancy between the invoices and bank records.',
        exampleKh: 'សវនករបានរកឃើញភាពមិនស៊ីគ្នាគួរឱ្យកត់សម្គាល់រវាងវិក្កយបត្រ និងកំណត់ត្រាធនាគារ។',
        level: 'advanced',
        topicId: 'business'
      }
    ],
    dialogue: [
      {
        id: 'd-a1-1',
        speaker: 'Dara',
        speakerKh: 'តារា',
        avatarColor: 'bg-amber-600',
        english: 'We appreciate your proposal, but we must address the pricing structure before proceeding.',
        khmer: 'ពួកយើងកោតសរសើរចំពោះសំណើរបស់អ្នក ប៉ុន្តែយើងត្រូវតែដោះស្រាយរចនាសម្ព័ន្ធតម្លៃសិន មុននឹងបន្ត។',
        audioText: 'We appreciate your proposal, but we must address the pricing structure before proceeding.'
      },
      {
        id: 'd-a1-2',
        speaker: 'Rachel',
        speakerKh: 'រ៉ាឆែល',
        avatarColor: 'bg-purple-600',
        english: 'Understood. What if we offer an tiered discount contingent on annual volume?',
        khmer: 'យល់ហើយ។ ចុះបើពួកយើងផ្តល់ការបញ្ចុះតម្លៃតាមកម្រិត ដោយផ្អែកលើបរិមាណប្រចាំឆ្នាំវិញ?',
        audioText: 'Understood. What if we offer an tiered discount contingent on annual volume?'
      },
      {
        id: 'd-a1-3',
        speaker: 'Dara',
        speakerKh: 'តារា',
        avatarColor: 'bg-amber-600',
        english: 'That sounds like a viable compromise. Let us formalize the memorandum of understanding.',
        khmer: 'នោះហាក់ដូចជាការសម្រុះសម្រួលដែលអាចទៅរួច។ ចូរសរសេរជាអនុស្សរណៈនៃការយោគយល់គ្នាជាផ្លូវការចុះ។',
        audioText: 'That sounds like a viable compromise. Let us formalize the memorandum of understanding.'
      }
    ],
    grammar: {
      titleEn: 'Conditional Sentences (Type 3 & Mixed Conditionals)',
      titleKh: 'លក្ខខណ្ឌកាល (សន្មតពីអតីតកាលដែលមិនបានកើតឡើង)',
      explanationKh: 'ប្រើសម្រាប់ការសោកស្តាយ ឬពិចារណាលើលទ្ធផលអតីតកាលដែលមិនអាចត្រឡប់វិញបាន (Unreal past situations)។',
      formula: 'If + had + past participle, would have + past participle',
      examples: [
        { en: 'If we had signed the contract earlier, we would have secured better rates.', kh: 'ប្រសិនបើយើងបានចុះកិច្ចសន្យាតាំងពីមុន នោះយើងនឹងទទួលបានអត្រាតម្លៃល្អជាងនេះ។' }
      ]
    }
  },
  {
    id: 'adv-2',
    level: 'advanced',
    levelNumber: 3,
    order: 2,
    titleEn: 'Academic & Critical Discourse',
    titleKh: 'ការសិក្សាស្រាវជ្រាវ និងការវិភាគរិះគន់',
    descriptionKh: 'ពាក្យ និងឃ្លាសម្រាប់សរសេរអត្ថបទស្រាវជ្រាវ ការជជែកដេញដោល និងការបញ្ជាក់អំណះអំណាងបែបវិទ្យាសាស្ត្រ។',
    iconName: 'GraduationCap',
    xpReward: 110,
    vocabulary: [
      {
        id: 'v-a2-1',
        english: 'Pragmatic',
        phonetic: '/præɡˈmætɪk/',
        khmerPhonetic: 'ប្រាក់ម៉ាទិក',
        khmerMeaning: 'ជាក់ស្តែងនិយម / ផ្អែកលើការអនុវត្តជាក់ស្តែង',
        partOfSpeech: 'adjective',
        partOfSpeechKhmer: 'គុណនាម',
        exampleEn: 'We must adopt a pragmatic approach rather than adhering strictly to rigid dogma.',
        exampleKh: 'យើងត្រូវតែប្រកាន់យកវិធីសាស្រ្តជាក់ស្តែងនិយម ជាជាងការប្រកាន់ខ្ជាប់នូវគោលការណ៍រឹងត្អឹង។',
        level: 'advanced',
        topicId: 'academic'
      },
      {
        id: 'v-a2-2',
        english: 'Ambiguity',
        phonetic: '/ˌæmbɪˈɡjuːəti/',
        khmerPhonetic: 'អែមប៊ីហ្គ្យូអ៊ីធី',
        khmerMeaning: 'ភាពស្រពិចស្រពិល / ន័យកាត់បានច្រើនផ្លូវ',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'Clear definitions in the policy eliminate any ambiguity for the public.',
        exampleKh: 'និយមន័យច្បាស់លាស់នៅក្នុងគោលនយោបាយ នឹងលុបបំបាត់នូវភាពស្រពិចស្រពិលសម្រាប់សាធារណជន។',
        level: 'advanced',
        topicId: 'academic'
      },
      {
        id: 'v-a2-3',
        english: 'Corroborate',
        phonetic: '/kəˈrɒbəreɪt/',
        khmerPhonetic: 'ខូរ៉ូបូរ៉េត',
        khmerMeaning: 'បញ្ជាក់អំណះអំណាងបន្ថែម / ផ្តល់ភស្តុតាងគាំទ្រ',
        partOfSpeech: 'verb',
        partOfSpeechKhmer: 'កិរិយាសព្ទ',
        exampleEn: 'Recent empirical studies corroborate the researcher’s original hypothesis.',
        exampleKh: 'ការសិក្សាជាក់ស្តែងថ្មីៗនេះបានផ្តល់ភស្តុតាងគាំទ្រដល់សម្មតិកម្មដើមរបស់អ្នកស្រាវជ្រាវ។',
        level: 'advanced',
        topicId: 'academic'
      },
      {
        id: 'v-a2-4',
        english: 'Pervasive',
        phonetic: '/pərˈveɪsɪv/',
        khmerPhonetic: 'ភឺវ៉េស៊ីវ',
        khmerMeaning: 'ដែលរីករាលដាលជ្រួតជ្រាបពាសពេញ',
        partOfSpeech: 'adjective',
        partOfSpeechKhmer: 'គុណនាម',
        exampleEn: 'Smartphones have a pervasive influence on modern childhood development.',
        exampleKh: 'ទូរស័ព្ទឆ្លាតវៃមានឥទ្ធិពលរីករាលដាលយ៉ាងខ្លាំងលើការលូតលាស់របស់កុមារសម័យទំនើប។',
        level: 'advanced',
        topicId: 'academic'
      },
      {
        id: 'v-a2-5',
        english: 'Nuance',
        phonetic: '/ˈnjuːɑːns/',
        khmerPhonetic: 'នូអានស៍',
        khmerMeaning: 'ភាពលម្អិតខុសគ្នាបន្តិចបន្តួចនៃអត្ថន័យ ឬអារម្មណ៍',
        partOfSpeech: 'noun',
        partOfSpeechKhmer: 'នាម',
        exampleEn: 'Translating poetry requires an intimate understanding of cultural nuance.',
        exampleKh: 'ការបកប្រែកំណាព្យទាមទារការយល់ដឹងស៊ីជម្រៅអំពីភាពខុសគ្នានៃវប្បធម៌។',
        level: 'advanced',
        topicId: 'academic'
      }
    ]
  }
];

export const BADGES: Badge[] = [
  {
    id: 'first-step',
    titleEn: 'First Steps',
    titleKh: 'ជំហានដំបូង',
    descriptionEn: 'Complete your very first lesson',
    descriptionKh: 'បញ្ចប់មេរៀនដំបូងរបស់អ្នកដោយជោគជ័យ',
    icon: 'Sparkles',
    isUnlocked: (p) => p.completedLessonIds.length >= 1
  },
  {
    id: 'quiz-master',
    titleEn: 'Quiz Ace',
    titleKh: 'អ្នកពូកែឆ្លើយសំណួរ',
    descriptionEn: 'Score 100% on any multiple-choice quiz',
    descriptionKh: 'ទទួលបានពិន្ទុ ១០០% លើកម្រងសំណួរណាមួយ',
    icon: 'Award',
    isUnlocked: (p) => p.quizHistory.some(q => q.score === q.total && q.total > 0)
  },
  {
    id: 'streak-star',
    titleEn: 'Consistent Learner',
    titleKh: 'អ្នករៀនខ្ជាប់ខ្ជួន',
    descriptionEn: 'Reach a 3-day learning streak',
    descriptionKh: 'រក្សាការសិក្សាជាប់គ្នាបាន ៣ ថ្ងៃ',
    icon: 'Flame',
    isUnlocked: (p) => p.streakDays >= 3
  },
  {
    id: 'vocab-collector',
    titleEn: 'Word Master',
    titleKh: 'ម្ចាស់វាក្យសព្ទ',
    descriptionEn: 'Master at least 15 vocabulary items',
    descriptionKh: 'ចងចាំពាក្យបានយ៉ាងតិច ១៥ ពាក្យ',
    icon: 'BookOpen',
    isUnlocked: (p) => p.masteredVocabIds.length >= 15
  },
  {
    id: 'intermediate-pioneer',
    titleEn: 'Intermediate Pioneer',
    titleKh: 'ឈានដល់កម្រិតមធ្យម',
    descriptionEn: 'Unlock Intermediate level lessons',
    descriptionKh: 'ដោះសោចូលរៀនកម្រិតមធ្យម',
    icon: 'Zap',
    isUnlocked: (p) => p.unlockedLevels.includes('intermediate')
  },
  {
    id: 'advanced-scholar',
    titleEn: 'Advanced Scholar',
    titleKh: 'បណ្ឌិតកម្រិតខ្ពស់',
    descriptionEn: 'Unlock and excel at Advanced level',
    descriptionKh: 'ដោះសោចូលរៀនកម្រិតខ្ពស់',
    icon: 'Crown',
    isUnlocked: (p) => p.unlockedLevels.includes('advanced')
  }
];
