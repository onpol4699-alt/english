import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Volume2, Square, Sparkles, Box, X } from 'lucide-react';
import { getKhmerPhonetic } from '../utils/phonetics';
import { speakEnglish, stopSpeaking } from '../utils/audio';

// 2D Flat Vector Educational Illustration Imports (Matching Level Card Vector Art)
import imgGreetingVector from '../assets/images/greeting_vector_1789321409379.jpg';
import imgStudyVector from '../assets/images/study_vector_1789321423120.jpg';
import imgDiningVector from '../assets/images/dining_vector_1789321437986.jpg';
import imgAirportTravelVector from '../assets/images/airport_travel_vector_1789309716644.jpg';
import imgBusinessDealVector from '../assets/images/business_deal_vector_1789309731051.jpg';
import imgRuralStudentVector from '../assets/images/rural_student_vector_1789309701604.jpg';
import imgClockAlarmVector from '../assets/images/lesson_clock_alarm_1789409423941.jpg';
import imgLibraryStudyVector from '../assets/images/lesson_library_study_1789409371632.jpg';
import imgPresentationVector from '../assets/images/lesson_presentation_1789409384440.jpg';
import imgMarketShopVector from '../assets/images/lesson_market_shop_1789409398657.jpg';
import imgHospitalCareVector from '../assets/images/lesson_hospital_care_1789409410918.jpg';
import imgGraduationVector from '../assets/images/lesson_graduation_1789409437903.jpg';

// New Flat 2D Educational Illustrations (Replacing 3D Graphics)
import imgConversationVector from '../assets/images/conversation_vector_1789410142218.jpg';
import imgGratitudeVector from '../assets/images/gratitude_vector_1789410154666.jpg';
import imgCareerVector from '../assets/images/career_vector_1789410168168.jpg';
import imgRoutineVector from '../assets/images/routine_vector_1789410180428.jpg';

interface IllustrationCardProps {
  englishWord?: string;
  khmerWord?: string;
  topicId?: string;
  category?: string;
  imageUrl?: string;
  className?: string;
  showPhoneticsBanner?: boolean;
  titleEn?: string;
  titleKh?: string;
}

interface SceneVisual {
  url: string;
  alt: string;
  taglineEn: string;
  taglineKh: string;
}

export const IllustrationCard: React.FC<IllustrationCardProps> = ({
  englishWord = 'hello',
  khmerWord = 'ជម្រាបសួរ',
  imageUrl,
  className = '',
  showPhoneticsBanner = true,
}) => {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingSpeed, setPlayingSpeed] = useState<number | null>(null);

  const safeEn = (englishWord || 'hello').trim();
  const cleanEn = safeEn.toLowerCase();
  const phoneticGuide = getKhmerPhonetic(safeEn);

  const handlePlaySound = async (rate: number = 0.9) => {
    if (isPlayingAudio && playingSpeed === rate) {
      stopSpeaking();
      setIsPlayingAudio(false);
      setPlayingSpeed(null);
      return;
    }
    stopSpeaking();
    setIsPlayingAudio(true);
    setPlayingSpeed(rate);
    try {
      await speakEnglish(safeEn, rate);
    } finally {
      setIsPlayingAudio(false);
      setPlayingSpeed(null);
    }
  };

  // Select clean 2D flat vector educational illustration scene matching the learning concept
  const getVisualScene = (): SceneVisual => {
    // 1. Wake up & Morning Alarm in bed ("wake up", "alarm", "clock", "bed", "early", "6:00", "6:30")
    if (cleanEn.includes('wake up') || cleanEn.includes('alarm') || cleanEn.includes('bed') || cleanEn.includes('get up')) {
      return {
        url: imgClockAlarmVector,
        alt: '2D flat vector educational illustration of a student waking up cheerfully in bed with ringing alarm clock at 6:30 AM',
        taglineEn: 'Morning Routine & Early Wake-Up',
        taglineKh: 'ទម្លាប់ភ្ញាក់ពីគេងពេលព្រឹកព្រលឹមប្រកបដោយថាមពល',
      };
    }

    // 2. Gratitude & Courtesy ("thank you", "thanks", "please", "kind", "heart", "appreciate")
    if (cleanEn.includes('thank') || cleanEn.includes('please') || cleanEn.includes('appreciate') || cleanEn.includes('gratitude')) {
      return {
        url: imgGratitudeVector,
        alt: '2D flat vector educational illustration of polite student expressing gratitude with respectful Sampeah gesture',
        taglineEn: 'Heartfelt Gratitude & Courtesy',
        taglineKh: 'ការថ្លែងអំណរគុណចេញពីចិត្ត និងសុជីវធម៌ល្អ',
      };
    }

    // 3. Dialogue & English Conversation ("how are you", "fine", "dialogue", "conversation", "chat", "goodbye", "bye")
    if (cleanEn.includes('how are you') || cleanEn.includes('dialogue') || cleanEn.includes('conversation') || cleanEn.includes('chat') || cleanEn.includes('goodbye') || cleanEn.includes('bye') || cleanEn.includes('see you')) {
      return {
        url: imgConversationVector,
        alt: '2D flat vector educational illustration of two students having a friendly English conversation dialogue with speech bubbles',
        taglineEn: 'Interactive English Dialogue',
        taglineKh: 'ការសន្ទនាភាសាអង់គ្លេសឆ្លើយឆ្លងយ៉ាងរស់រវើក',
      };
    }

    // 4. Meeting & Handshakes ("nice to meet you", "pleased to meet", "friend", "partner")
    if (cleanEn.includes('nice to meet') || cleanEn.includes('meet you') || cleanEn.includes('pleased') || cleanEn.includes('handshake')) {
      return {
        url: imgBusinessDealVector,
        alt: '2D flat vector educational illustration of partners shaking hands warmly in modern setting',
        taglineEn: 'Warm Handshake & Greeting',
        taglineKh: 'ការចាប់ដៃស្វាគមន៍ដោយភាពកក់ក្តៅ និងរាក់ទាក់',
      };
    }

    // 5. Greeting & Welcome ("hello", "hi", "good morning", "welcome")
    if (cleanEn.includes('hello') || cleanEn.includes('hi') || cleanEn.includes('morning') || cleanEn.includes('afternoon') || cleanEn.includes('welcome')) {
      return {
        url: imgGreetingVector,
        alt: '2D flat vector educational illustration of cheerful students waving hello warmly in bright classroom',
        taglineEn: 'Friendly Smile & Greeting',
        taglineKh: 'ស្នាមញញឹមរាក់ទាក់ និងការស្វាគមន៍ដោយភាពកក់ក្តៅ',
      };
    }

    // 6. Routine & Habits ("routine", "schedule", "planner", "habits", "daily", "brush teeth", "go to work")
    if (cleanEn.includes('routine') || cleanEn.includes('schedule') || cleanEn.includes('habits') || cleanEn.includes('daily') || cleanEn.includes('brush')) {
      return {
        url: imgRoutineVector,
        alt: '2D flat vector educational illustration of student daily morning routine getting ready for school with calendar checklist',
        taglineEn: 'Structured Habits & Daily Planner',
        taglineKh: 'ទម្លាប់ប្រចាំថ្ងៃ និងកាលវិភាគការងាររៀបរយ',
      };
    }

    // 7. Travel & Origins ("travel", "where", "cambodia", "from", "country", "airport", "plane", "visit")
    if (cleanEn.includes('travel') || cleanEn.includes('where') || cleanEn.includes('from') || cleanEn.includes('cambodia') || cleanEn.includes('country') || cleanEn.includes('airport') || cleanEn.includes('plane')) {
      return {
        url: imgAirportTravelVector,
        alt: '2D flat vector educational illustration of international travel and cultural exploration',
        taglineEn: 'Travel Exploration & Culture',
        taglineKh: 'ការធ្វើដំណើរទស្សនា និងស្វែងយល់ពីវប្បធម៌ពិភពលោក',
      };
    }

    // 8. Food & Dining ("food", "eat", "drink", "coffee", "restaurant", "delicious", "bill", "tea", "menu")
    if (cleanEn.includes('food') || cleanEn.includes('eat') || cleanEn.includes('drink') || cleanEn.includes('coffee') || cleanEn.includes('restaurant') || cleanEn.includes('delicious') || cleanEn.includes('menu')) {
      return {
        url: imgDiningVector,
        alt: '2D flat vector educational illustration of friends enjoying food and drinks at a cafe table',
        taglineEn: 'Delicious Dining & Cafe',
        taglineKh: 'អាហារដ៏ឈ្ងុយឆ្ងាញ់ក្នុងបរិយាកាសកាហ្វេដ៏កក់ក្តៅ',
      };
    }

    // 9. Workplace & Career ("work", "office", "job", "career", "computer", "laptop", "project", "developer", "engineer")
    if (cleanEn.includes('work') || cleanEn.includes('office') || cleanEn.includes('job') || cleanEn.includes('career') || cleanEn.includes('business') || cleanEn.includes('project')) {
      return {
        url: imgCareerVector,
        alt: '2D flat vector educational illustration of professional working at modern desk with computer and charts',
        taglineEn: 'Professional Career Advancement',
        taglineKh: 'ការរីកចម្រើនក្នុងអាជីពការងារ និងបច្ចេកវិទ្យា',
      };
    }

    // 10. Presentation & Public Speaking ("presentation", "speak", "speech", "explain")
    if (cleanEn.includes('presentation') || cleanEn.includes('speech') || cleanEn.includes('speak') || cleanEn.includes('explain')) {
      return {
        url: imgPresentationVector,
        alt: '2D flat vector educational illustration of confident student giving English presentation in classroom',
        taglineEn: 'Confident Speech & Presentation',
        taglineKh: 'ការធ្វើបទបង្ហាញ និងការនិយាយភាសាអង់គ្លេសដោយទំនុកចិត្ត',
      };
    }

    // 11. Shopping & Market ("market", "shop", "buy", "price", "store", "cashier")
    if (cleanEn.includes('market') || cleanEn.includes('shop') || cleanEn.includes('buy') || cleanEn.includes('price') || cleanEn.includes('cost')) {
      return {
        url: imgMarketShopVector,
        alt: '2D flat vector educational illustration of customer shopping at modern market grocery counter',
        taglineEn: 'Daily Market Shopping & Transactions',
        taglineKh: 'ការទិញទំនិញនៅទីផ្សារ និងការសាកសួរតម្លៃ',
      };
    }

    // 12. Health & Hospital ("hospital", "doctor", "health", "medicine", "sick")
    if (cleanEn.includes('hospital') || cleanEn.includes('doctor') || cleanEn.includes('health') || cleanEn.includes('medicine') || cleanEn.includes('sick')) {
      return {
        url: imgHospitalCareVector,
        alt: '2D flat vector educational illustration of caring doctor consulting patient in clinic',
        taglineEn: 'Healthcare & Medical Consultation',
        taglineKh: 'ការពិគ្រោះសុខភាព និងការថែទាំវេជ្ជសាស្ត្រ',
      };
    }

    // 13. Graduation & Certificate ("graduation", "certificate", "diploma", "success")
    if (cleanEn.includes('graduation') || cleanEn.includes('certificate') || cleanEn.includes('diploma') || cleanEn.includes('success')) {
      return {
        url: imgGraduationVector,
        alt: '2D flat vector educational illustration of proud student holding diploma certificate celebrating success',
        taglineEn: 'Academic Achievement & Certificate',
        taglineKh: 'សមិទ្ធផលសិក្សា និងវិញ្ញាបនបត្រជោគជ័យ',
      };
    }

    // 14. Library & Academic Research ("library", "research", "grammar", "read")
    if (cleanEn.includes('library') || cleanEn.includes('research') || cleanEn.includes('grammar') || cleanEn.includes('read')) {
      return {
        url: imgLibraryStudyVector,
        alt: '2D flat vector educational illustration of student studying with books and laptop in modern library',
        taglineEn: 'Deep Focus & Academic Research',
        taglineKh: 'ការស្រាវជ្រាវ និងសិក្សាភាសាអង់គ្លេសស៊ីជម្រៅ',
      };
    }

    // Default: Academic & Study ("study", "learn", "english", "exam", "school", "book", "vocabulary", etc.)
    return {
      url: imgStudyVector,
      alt: '2D flat vector educational illustration of students studying English with textbooks and stationery',
      taglineEn: 'Interactive Study & Mastery',
      taglineKh: 'ការសិក្សាភាសាអង់គ្លេសស្ទាត់ជំនាញប្រកបដោយភាពរីករាយ',
    };
  };

  const scene = getVisualScene();
  const displayImage = imageUrl || scene.url;

  return (
    <div className={`relative flex flex-col items-center w-full ${className}`}>
      
      {/* Visual Card Container */}
      <div 
        id="illustration-media-card"
        className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-50/80 flex items-center justify-center group transition-all duration-300"
      >
        {/* Photorealistic & 3D-styled image with max-h-60 object-contain */}
        <img
          src={displayImage}
          alt={scene.alt}
          className="w-full max-h-60 object-contain mx-auto group-hover:scale-[1.02] transition-transform duration-300 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Ambient Overlay for contrast when needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none opacity-60" />

        {/* Bottom-Right Subtle Zoom Button (+) matching Image 41 */}
        <button
          type="button"
          id="btn-illustration-zoom-plus"
          onClick={() => {
            setZoomScale(1);
            setIsZoomModalOpen(true);
          }}
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/95 hover:bg-white text-slate-700 shadow-sm border border-slate-200/80 backdrop-blur-xs transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
          title="Zoom image full screen / ពង្រីករូបភាព"
        >
          <ZoomIn className="w-4 h-4 text-slate-700" />
        </button>

        {/* Top-Left Audio Quick Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={() => handlePlaySound(0.9)}
            className={`px-2.5 py-1 rounded-xl shadow-xs backdrop-blur-xs border text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isPlayingAudio && playingSpeed === 0.9
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-white/90 hover:bg-white text-slate-800 border-slate-200'
            }`}
            title={isPlayingAudio && playingSpeed === 0.9 ? 'Stop playback' : 'Listen pronunciation (1.0x)'}
          >
            {isPlayingAudio && playingSpeed === 0.9 ? (
              <Square className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-slate-600" />
            )}
            <span className="font-mono text-[11px]">1.0x</span>
          </button>

          <button
            type="button"
            onClick={() => handlePlaySound(0.7)}
            className={`px-2 py-1 rounded-xl shadow-xs backdrop-blur-xs border text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isPlayingAudio && playingSpeed === 0.7
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
            }`}
            title={isPlayingAudio && playingSpeed === 0.7 ? 'Stop playback' : 'Slow pronunciation (0.7x)'}
          >
            {isPlayingAudio && playingSpeed === 0.7 ? (
              <Square className="w-3 h-3 fill-current inline-block mr-1" />
            ) : null}
            <span className="font-mono text-[10px]">0.7x</span>
          </button>
        </div>

        {/* Bottom Left Ambient Caption */}
        <div className="absolute bottom-3 left-3 right-14 flex items-end justify-between gap-2 z-10 text-white">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-white drop-shadow truncate">
              {scene.taglineEn}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-100 font-khmer font-medium drop-shadow truncate">
              {scene.taglineKh}
            </p>
          </div>
        </div>
      </div>

      {/* Phonetic Pronunciation Guide Card */}
      {showPhoneticsBanner && (
        <div className="mt-2.5 max-w-lg w-full bg-white/95 backdrop-blur-xs border border-slate-200 rounded-2xl p-2.5 sm:p-3 shadow-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-700 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-slate-900">
                  {phoneticGuide.ipa}
                </span>
                <span className="font-khmer text-xs font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100">
                  អានថា: [{phoneticGuide.khmerPhonetic}]
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-khmer truncate mt-0.5">
                ការបញ្ចេញសំឡេងបែបស្តង់ដារអន្តរជាតិ (Standard English IPA)
              </div>
            </div>
          </div>

          {/* Quick Repeat Audio Speaker */}
          <button
            type="button"
            onClick={() => handlePlaySound(0.9)}
            className={`p-2 rounded-xl text-white shadow-xs transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer ${
              isPlayingAudio && playingSpeed === 0.9
                ? 'bg-rose-600 hover:bg-rose-700 animate-pulse ring-2 ring-rose-300'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            title={isPlayingAudio && playingSpeed === 0.9 ? 'Stop pronunciation' : 'Listen to pronunciation'}
          >
            {isPlayingAudio && playingSpeed === 0.9 ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* Full-Screen Zoom Lightbox Modal */}
      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsZoomModalOpen(false)}
        >
          {/* Zoom Modal Header & Controls */}
          <div 
            className="w-full max-w-3xl flex items-center justify-between text-white mb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {englishWord} <span className="font-khmer font-semibold text-slate-300">({khmerWord})</span>
              </h3>
              <p className="text-xs text-slate-400 font-khmer">
                {scene.taglineKh} • អានថា: [{phoneticGuide.khmerPhonetic}]
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.min(prev + 0.25, 2.5))}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.max(prev - 0.25, 0.75))}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setZoomScale(1)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer ml-2"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Large Image Box */}
          <div 
            className="relative max-w-3xl w-full aspect-16/10 bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displayImage}
              alt={scene.alt}
              style={{ transform: `scale(${zoomScale})` }}
              className="w-full h-full object-cover transition-transform duration-200"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Audio Pronunciation Bar in Zoom Modal */}
          <div 
            className="mt-4 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => handlePlaySound(0.9)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen Pronunciation (1.0x)</span>
            </button>

            <button
              type="button"
              onClick={() => handlePlaySound(0.7)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer"
            >
              <span>Slow Audio (0.7x)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
