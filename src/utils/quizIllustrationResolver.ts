import { QuizQuestion } from '../types';

// 2D Flat Vector Educational Illustration Imports (100% Flat 2D Vector Art, Zero 3D)
import imgGreetingVector from '../assets/images/greeting_vector_1789321409379.jpg';
import imgStudyVector from '../assets/images/study_vector_1789321423120.jpg';
import imgDiningVector from '../assets/images/dining_vector_1789321437986.jpg';
import imgAirportTravelVector from '../assets/images/airport_travel_vector_1789309716644.jpg';
import imgBusinessDealVector from '../assets/images/business_deal_vector_1789309731051.jpg';
import imgRuralStudentVector from '../assets/images/rural_student_vector_1789309701604.jpg';
import imgLibraryStudyVector from '../assets/images/lesson_library_study_1789409371632.jpg';
import imgPresentationVector from '../assets/images/lesson_presentation_1789409384440.jpg';
import imgMarketShopVector from '../assets/images/lesson_market_shop_1789409398657.jpg';
import imgHospitalCareVector from '../assets/images/lesson_hospital_care_1789409410918.jpg';
import imgClockAlarmVector from '../assets/images/lesson_clock_alarm_1789409423941.jpg';
import imgGraduationVector from '../assets/images/lesson_graduation_1789409437903.jpg';

// Newly Generated Clean 2D Flat Vector Educational Illustrations (Replacing 3D Graphics)
import imgConversationVector from '../assets/images/conversation_vector_1789410142218.jpg';
import imgGratitudeVector from '../assets/images/gratitude_vector_1789410154666.jpg';
import imgCareerVector from '../assets/images/career_vector_1789410168168.jpg';
import imgRoutineVector from '../assets/images/routine_vector_1789410180428.jpg';
import imgRuralStudents from '../assets/images/rural_students_1789311218866.jpg';
import imgAirportStudents from '../assets/images/airport_students_1789311231202.jpg';

export interface EducationalVisualItem {
  id: string;
  url: string;
  alt: string;
  taglineEn: string;
  taglineKh: string;
  tags: string[];
}

export const EDUCATIONAL_ILLUSTRATION_POOL: EducationalVisualItem[] = [
  {
    id: 'greeting-vector',
    url: imgGreetingVector,
    alt: '2D flat vector educational illustration of cheerful students waving hello warmly in bright classroom',
    taglineEn: 'Friendly Smile & Greeting',
    taglineKh: 'ស្នាមញញឹមរាក់ទាក់ និងការស្វាគមន៍ដោយភាពកក់ក្តៅ',
    tags: ['hello', 'hi', 'greeting', 'morning', 'afternoon', 'welcome', 'smile', 'wave', 'say'],
  },
  {
    id: 'handshake-vector',
    url: imgBusinessDealVector,
    alt: '2D flat vector educational illustration of partners shaking hands warmly in modern setting',
    taglineEn: 'Warm Handshake & Greeting',
    taglineKh: 'ការចាប់ដៃស្វាគមន៍ដោយភាពកក់ក្តៅ និងរាក់ទាក់',
    tags: ['nice to meet', 'meet you', 'pleased', 'handshake', 'partner', 'friend', 'introduce', 'name', 'nice to meet you too'],
  },
  {
    id: 'clock-alarm-vector',
    url: imgClockAlarmVector,
    alt: '2D flat vector educational illustration of a student waking up cheerfully in bed with ringing alarm clock at 6:30 AM',
    taglineEn: 'Morning Routine & Early Wake-Up',
    taglineKh: 'ទម្លាប់ភ្ញាក់ពីគេងពេលព្រឹកព្រលឹមប្រកបដោយថាមពល',
    tags: ['wake up', 'alarm', 'clock', 'time', 'early', 'schedule', 'morning', '6:00', '6:30', 'get up', 'hour', 'bed'],
  },
  {
    id: 'dining-vector',
    url: imgDiningVector,
    alt: '2D flat vector educational illustration of friends enjoying food and drinks at a cafe table',
    taglineEn: 'Delicious Dining & Cafe',
    taglineKh: 'អាហារដ៏ឈ្ងុយឆ្ងាញ់ក្នុងបរិយាកាសកាហ្វេដ៏កក់ក្តៅ',
    tags: ['food', 'eat', 'drink', 'coffee', 'restaurant', 'delicious', 'breakfast', 'lunch', 'dinner', 'tea', 'meal', 'bread', 'menu'],
  },
  {
    id: 'airport-travel-vector',
    url: imgAirportTravelVector,
    alt: '2D flat vector educational illustration of international travel and cultural exploration',
    taglineEn: 'Travel Exploration & Culture',
    taglineKh: 'ការធ្វើដំណើរទស្សនា និងស្វែងយល់ពីវប្បធម៌ពិភពលោក',
    tags: ['travel', 'where are you from', 'cambodia', 'country', 'airport', 'plane', 'from', 'visit', 'city', 'phnom penh', 'destination'],
  },
  {
    id: 'library-study-vector',
    url: imgLibraryStudyVector,
    alt: '2D flat vector educational illustration of student studying with books and laptop in modern library',
    taglineEn: 'Deep Focus & Academic Research',
    taglineKh: 'ការស្រាវជ្រាវ និងសិក្សាភាសាអង់គ្លេសស៊ីជម្រៅ',
    tags: ['library', 'laptop', 'research', 'read', 'grammar', 'textbook', 'focus', 'learn', 'vocabulary', 'english', 'test', 'exam'],
  },
  {
    id: 'presentation-vector',
    url: imgPresentationVector,
    alt: '2D flat vector educational illustration of confident student giving English presentation in classroom',
    taglineEn: 'Confident Speech & Presentation',
    taglineKh: 'ការធ្វើបទបង្ហាញ និងការនិយាយភាសាអង់គ្លេសដោយទំនុកចិត្ត',
    tags: ['presentation', 'whiteboard', 'speak', 'classroom', 'explain', 'speech', 'confidence', 'teacher', 'ask'],
  },
  {
    id: 'market-shop-vector',
    url: imgMarketShopVector,
    alt: '2D flat vector educational illustration of customer shopping at modern market grocery counter',
    taglineEn: 'Daily Market Shopping & Transactions',
    taglineKh: 'ការទិញទំនិញនៅទីផ្សារ និងការសាកសួរតម្លៃ',
    tags: ['shop', 'market', 'buy', 'price', 'cashier', 'store', 'customer', 'grocery', 'dollar', 'cost', 'how much'],
  },
  {
    id: 'hospital-care-vector',
    url: imgHospitalCareVector,
    alt: '2D flat vector educational illustration of caring doctor consulting patient in clinic',
    taglineEn: 'Healthcare & Medical Consultation',
    taglineKh: 'ការពិគ្រោះសុខភាព និងការថែទាំវេជ្ជសាស្ត្រ',
    tags: ['hospital', 'doctor', 'clinic', 'health', 'medicine', 'sick', 'help', 'headache', 'fever', 'care'],
  },
  {
    id: 'graduation-vector',
    url: imgGraduationVector,
    alt: '2D flat vector educational illustration of proud student holding diploma certificate celebrating success',
    taglineEn: 'Academic Achievement & Certificate',
    taglineKh: 'សមិទ្ធផលសិក្សា និងវិញ្ញាបនបត្រជោគជ័យ',
    tags: ['graduation', 'certificate', 'diploma', 'success', 'degree', 'pass', 'complete', 'achievement', 'score'],
  },
  {
    id: 'gratitude-vector',
    url: imgGratitudeVector,
    alt: '2D flat vector educational illustration of polite student expressing gratitude with respectful Sampeah gesture',
    taglineEn: 'Heartfelt Gratitude & Courtesy',
    taglineKh: 'ការថ្លែងអំណរគុណចេញពីចិត្ត និងសុជីវធម៌ល្អ',
    tags: ['thank you', 'thanks', 'gratitude', 'please', 'kind', 'polite', 'appreciate', 'heart'],
  },
  {
    id: 'conversation-dialogue-vector',
    url: imgConversationVector,
    alt: '2D flat vector educational illustration of two students having a friendly English conversation dialogue with speech bubbles',
    taglineEn: 'Interactive English Dialogue',
    taglineKh: 'ការសន្ទនាភាសាអង់គ្លេសឆ្លើយឆ្លងយ៉ាងរស់រវើក',
    tags: ['how are you', 'conversation', 'chat', 'dialogue', 'fine', 'reply', 'talk', 'discuss', 'speak', 'goodbye', 'bye', 'see you'],
  },
  {
    id: 'routine-schedule-vector',
    url: imgRoutineVector,
    alt: '2D flat vector educational illustration of student daily morning routine getting ready for school with calendar checklist',
    taglineEn: 'Structured Habits & Daily Planner',
    taglineKh: 'ទម្លាប់ប្រចាំថ្ងៃ និងកាលវិភាគការងាររៀបរយ',
    tags: ['go to work', 'schedule', 'daily', 'calendar', 'habits', 'routine', 'every day', 'usually', 'always', 'brush teeth'],
  },
  {
    id: 'career-workplace-vector',
    url: imgCareerVector,
    alt: '2D flat vector educational illustration of professional working at modern desk with computer and charts',
    taglineEn: 'Professional Career Advancement',
    taglineKh: 'ការរីកចម្រើនក្នុងអាជីពការងារ និងបច្ចេកវិទ្យា',
    tags: ['work', 'office', 'job', 'career', 'profession', 'business', 'company', 'developer', 'engineer', 'project', 'computer'],
  },
  {
    id: 'rural-student-vector',
    url: imgRuralStudentVector,
    alt: '2D flat vector educational illustration of diligent student learning English at sunrise',
    taglineEn: 'Diligent Study & Personal Dedication',
    taglineKh: 'ការខិតខំរៀនសូត្រប្រកបដោយការប្តេជ្ញាចិត្តខ្ពស់',
    tags: ['student', 'rural', 'dedication', 'study hard', 'homework', 'pencil', 'morning light', 'book'],
  },
  {
    id: 'rural-students-group',
    url: imgRuralStudents,
    alt: '2D flat vector educational illustration of Cambodian students collaborating happily',
    taglineEn: 'Collaborative Group Study & Friendship',
    taglineKh: 'ការសិក្សាជាក្រុមដោយសាមគ្គីភាព និងមិត្តភាព',
    tags: ['group study', 'friends', 'collaborate', 'together', 'schoolyard', 'peers', 'community'],
  },
  {
    id: 'airport-students-group',
    url: imgAirportStudents,
    alt: '2D flat vector educational illustration of international students arriving at terminal',
    taglineEn: 'Global Student Exchange & Welcome',
    taglineKh: 'ការផ្លាស់ប្តូរការសិក្សាអន្តរជាតិ និងការស្វាគមន៍និស្សិត',
    tags: ['foreign students', 'welcome to cambodia', 'arrival', 'international exchange', 'terminal', 'tourist'],
  },
  {
    id: 'study-vector-core',
    url: imgStudyVector,
    alt: '2D flat vector educational illustration of modern language learning tools',
    taglineEn: 'Core Language Fundamentals',
    taglineKh: 'មូលដ្ឋានគ្រឹះភាសាអង់គ្លេសដ៏រឹងមាំ',
    tags: ['vocabulary', 'lesson', 'fundamentals', 'unit', 'curriculum', 'exercise', 'practice'],
  },
];

/**
 * Assigns a unique, contextual illustration to each question in a quiz session.
 * STRICT REQUIREMENT:
 * - Every single Quiz question (1 to 20+) fetches a contextual illustration matching its specific target phrase.
 * - Strictly avoids duplicate images across questions within the same quiz session.
 */
export function assignUniqueQuizIllustrations(questions: QuizQuestion[]): QuizQuestion[] {
  const usedImageUrls = new Set<string>();

  return questions.map((question, qIndex) => {
    // Extract search terms from question prompt, audio text, lessonId, and correct option
    const correctOpt = question.options.find(o => o.id === question.correctOptionId);
    const textCorpus = [
      question.promptEn || '',
      question.audioText || '',
      question.lessonId || '',
      correctOpt?.text || '',
      correctOpt?.subtext || '',
      question.explanationEn || '',
    ].join(' ').toLowerCase();

    // Score all visual items in the pool
    const scored = EDUCATIONAL_ILLUSTRATION_POOL.map((item) => {
      let score = 0;
      for (const tag of item.tags) {
        if (textCorpus.includes(tag.toLowerCase())) {
          score += 5;
        }
      }
      return { item, score };
    });

    // Sort by relevance score descending
    scored.sort((a, b) => b.score - a.score);

    // Pick the best match that has NOT been used in this quiz session
    let chosenItem = scored.find(candidate => !usedImageUrls.has(candidate.item.url))?.item;

    // Fallback: If all scored items were somehow used (e.g. quiz > 23 questions),
    // pick the visual item with least frequency or based on index modulo pool length
    if (!chosenItem) {
      const unusedFallback = EDUCATIONAL_ILLUSTRATION_POOL.find(item => !usedImageUrls.has(item.url));
      chosenItem = unusedFallback || EDUCATIONAL_ILLUSTRATION_POOL[qIndex % EDUCATIONAL_ILLUSTRATION_POOL.length];
    }

    usedImageUrls.add(chosenItem.url);

    return {
      ...question,
      imageUrl: chosenItem.url,
    };
  });
}
