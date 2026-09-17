import React, { useState } from 'react';
import { 
  Volume2, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { VocabItem, DifficultyLevel, UserProgress } from '../types';
import { LESSONS } from '../data/curriculum';
import { speakEnglish } from '../utils/audio';

interface FlashcardsViewProps {
  progress: UserProgress;
  currentLevel: DifficultyLevel;
  onToggleMasterVocab: (vocabId: string) => void;
  onToggleSaveVocab: (vocabId: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  progress,
  currentLevel,
  onToggleMasterVocab,
  onToggleSaveVocab,
}) => {
  // Extract all vocabulary
  const allVocab = LESSONS.flatMap((l) => l.vocabulary);
  const [levelFilter, setLevelFilter] = useState<DifficultyLevel | 'all'>(currentLevel);
  const [activeFilter, setActiveFilter] = useState<'all' | 'saved' | 'unmastered'>('all');
  
  const filteredVocab = allVocab.filter((v) => {
    if (levelFilter !== 'all' && v.level !== levelFilter) return false;
    if (activeFilter === 'saved' && !progress.savedVocabIds.includes(v.id)) return false;
    if (activeFilter === 'unmastered' && progress.masteredVocabIds.includes(v.id)) return false;
    return true;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Safe item access
  const safeIndex = Math.min(currentIndex, Math.max(0, filteredVocab.length - 1));
  const currentItem: VocabItem | undefined = filteredVocab[safeIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (safeIndex < filteredVocab.length - 1) {
      setCurrentIndex(safeIndex + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    } else {
      setCurrentIndex(filteredVocab.length - 1);
    }
  };

  const handleAudio = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakEnglish(text, progress.speechRate);
  };

  if (filteredVocab.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto space-y-4">
        <Layers className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-bold text-slate-900 text-lg">No Flashcards Match Filters</h3>
        <p className="font-khmer text-xs text-slate-500">
          មិនមានពាក្យនៅក្នុងតម្រងនេះទេ។ សូមផ្លាស់ប្តូរតម្រងខាងលើ។
        </p>
        <button
          onClick={() => {
            setLevelFilter('all');
            setActiveFilter('all');
          }}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
        >
          Reset Filters / មើលពាក្យទាំងអស់
        </button>
      </div>
    );
  }

  const isMastered = currentItem ? progress.masteredVocabIds.includes(currentItem.id) : false;
  const isSaved = currentItem ? progress.savedVocabIds.includes(currentItem.id) : false;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* Top Filter Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setLevelFilter(lvl);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all capitalize ${
                  levelFilter === lvl
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => {
                setActiveFilter('all');
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                activeFilter === 'all'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              All ({filteredVocab.length})
            </button>
            <button
              onClick={() => {
                setActiveFilter('saved');
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                activeFilter === 'saved'
                  ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              Saved
            </button>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
          <span>Card {safeIndex + 1} of {filteredVocab.length}</span>
          <span className="font-khmer">ចុចលើប័ណ្ណដើម្បីត្រឡប់មើលអត្ថន័យ</span>
        </div>
      </div>

      {/* 3D Flashcard Container */}
      {currentItem && (
        <div 
          id="interactive-flashcard"
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative min-h-[320px] sm:min-h-[360px] bg-white rounded-3xl border-2 border-slate-200/80 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
        >
          {/* Top Row: Level Pill & Action Icons */}
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
              {currentItem.level}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleAudio(e, currentItem.english)}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                title="Listen to pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSaveVocab(currentItem.id);
                }}
                className={`p-2 rounded-xl border transition-colors ${
                  isSaved
                    ? 'border-amber-300 bg-amber-50 text-amber-600'
                    : 'border-slate-200 text-slate-400 hover:text-slate-600'
                }`}
                title="Save word"
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMasterVocab(currentItem.id);
                }}
                className={`p-2 rounded-xl border transition-colors ${
                  isMastered
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                    : 'border-slate-200 text-slate-400 hover:text-slate-600'
                }`}
                title="Mark as Mastered"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Middle: Front vs Back */}
          {!isFlipped ? (
            /* FRONT: English Word & Phonetics */
            <div className="text-center my-auto space-y-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {currentItem.english}
              </div>
              <div className="font-mono text-sm sm:text-base text-slate-500 font-medium">
                {currentItem.phonetic}
              </div>
              <div className="font-khmer text-xs font-semibold text-emerald-700 bg-emerald-50 inline-block px-3 py-1 rounded-full border border-emerald-100">
                អានថា: {currentItem.khmerPhonetic}
              </div>
              <div className="text-xs text-slate-400 font-khmer pt-2">
                (ចុចលើកាតដើម្បីមើលការបកប្រែជាភាសាខ្មែរ)
              </div>
            </div>
          ) : (
            /* BACK: Khmer Meaning & Example */
            <div className="text-center my-auto space-y-4 animate-in fade-in duration-200">
              <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-khmer font-semibold bg-emerald-100 text-emerald-800">
                {currentItem.partOfSpeechKhmer} ({currentItem.partOfSpeech})
              </div>
              <div className="font-khmer text-2xl sm:text-3xl font-extrabold text-slate-900">
                {currentItem.khmerMeaning}
              </div>

              {/* Example sentence */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-left space-y-1">
                <div className="flex items-center justify-between text-slate-800 font-semibold">
                  <span>"{currentItem.exampleEn}"</span>
                  <button
                    onClick={(e) => handleAudio(e, currentItem.exampleEn)}
                    className="text-slate-400 hover:text-emerald-600 p-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="font-khmer text-slate-600 text-xs">
                  "{currentItem.exampleKh}"
                </div>
              </div>
            </div>
          )}

          {/* Bottom Row: Flip prompt */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium pt-4 border-t border-slate-100">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click card to flip / ត្រឡប់ប័ណ្ណ</span>
          </div>
        </div>
      )}

      {/* Prev / Next Controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="btn-flashcard-prev"
          onClick={handlePrev}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous / ថយក្រោយ</span>
        </button>

        <button
          id="btn-flashcard-next"
          onClick={handleNext}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
        >
          <span>Next / បន្ទាប់</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
