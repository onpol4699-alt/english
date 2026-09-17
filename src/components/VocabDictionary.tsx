import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Check, 
  Filter, 
  BookOpen, 
  ArrowUpDown 
} from 'lucide-react';
import { VocabItem, DifficultyLevel, UserProgress } from '../types';
import { LESSONS } from '../data/curriculum';
import { speakEnglish } from '../utils/audio';

interface VocabDictionaryProps {
  progress: UserProgress;
  onToggleSaveVocab: (vocabId: string) => void;
  onToggleMasterVocab: (vocabId: string) => void;
}

export const VocabDictionary: React.FC<VocabDictionaryProps> = ({
  progress,
  onToggleSaveVocab,
  onToggleMasterVocab,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | 'all'>('all');
  const [selectedPos, setSelectedPos] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

  const allVocab = useMemo(() => {
    return LESSONS.flatMap((l) => l.vocabulary);
  }, []);

  const filteredVocab = useMemo(() => {
    return allVocab.filter((item) => {
      // Saved tab filter
      if (activeTab === 'saved' && !progress.savedVocabIds.includes(item.id)) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && item.level !== selectedLevel) {
        return false;
      }

      // Part of speech filter
      if (selectedPos !== 'all' && item.partOfSpeech !== selectedPos) {
        return false;
      }

      // Search query (matches English, Khmer meaning, or Khmer phonetic)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchEn = item.english.toLowerCase().includes(q);
        const matchKh = item.khmerMeaning.includes(q);
        const matchKhPhone = item.khmerPhonetic.includes(q);
        const matchExEn = item.exampleEn.toLowerCase().includes(q);
        if (!matchEn && !matchKh && !matchKhPhone && !matchExEn) {
          return false;
        }
      }

      return true;
    });
  }, [allVocab, activeTab, selectedLevel, selectedPos, searchQuery, progress.savedVocabIds]);

  const handleAudio = (text: string) => {
    speakEnglish(text, progress.speechRate);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Search & Tab */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>English - Khmer Vocabulary Bank</span>
            </h2>
            <p className="font-khmer text-xs sm:text-sm text-slate-500 mt-0.5">
              វចនានុក្រមពាក្យគន្លឹះ ស្វែងរកជាភាសាអង់គ្លេស ឬភាសាខ្មែរ រួមទាំងការបញ្ចេញសំឡេងស្តង់ដារ
            </p>
          </div>

          {/* All vs Saved Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Words ({allVocab.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Saved ({progress.savedVocabIds.length})</span>
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="vocab-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search English or Khmer words (e.g. Hello, Delicious, ឆ្ងាញ់, វ៉ាលី)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Level and POS Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-400 font-medium">Filter by:</span>

          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200/80">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2 py-0.5 rounded capitalize font-medium ${
                  selectedLevel === lvl
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Part of Speech */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200/80">
            {[
              { id: 'all', label: 'All POS' },
              { id: 'noun', label: 'Noun (នាម)' },
              { id: 'verb', label: 'Verb (កិរិយា)' },
              { id: 'adjective', label: 'Adj (គុណនាម)' },
              { id: 'phrase', label: 'Phrase (ឃ្លា)' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPos(p.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  selectedPos === p.id
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <span className="ml-auto text-slate-400">
            Found: <strong className="text-slate-700">{filteredVocab.length}</strong> words
          </span>
        </div>

      </div>

      {/* Vocabulary List Grid */}
      {filteredVocab.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900">No Words Found</h3>
          <p className="font-khmer text-xs text-slate-500">
            មិនមានពាក្យដែលត្រូវនឹងពាក្យគន្លឹះដែលអ្នកបានស្វែងរកទេ។
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVocab.map((item) => {
            const isSaved = progress.savedVocabIds.includes(item.id);
            const isMastered = progress.masteredVocabIds.includes(item.id);

            const levelBadgeColor: Record<DifficultyLevel, string> = {
              beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
              advanced: 'bg-purple-50 text-purple-700 border-purple-200',
            };

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between hover:shadow-xs space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-slate-900">
                          {item.english}
                        </span>
                        <span className="text-xs font-mono text-slate-500 px-1.5 py-0.5 bg-slate-50 rounded border border-slate-200">
                          {item.phonetic}
                        </span>
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${levelBadgeColor[item.level]}`}>
                          {item.level}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-khmer text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          អានថា: {item.khmerPhonetic}
                        </span>
                        <span className="font-khmer text-xs text-slate-500 italic">
                          ({item.partOfSpeechKhmer})
                        </span>
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleAudio(item.english)}
                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                        title="Pronounce English word"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onToggleSaveVocab(item.id)}
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
                        onClick={() => onToggleMasterVocab(item.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isMastered
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                            : 'border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title="Mark as Mastered"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Khmer Meaning */}
                  <div className="font-khmer font-bold text-base text-slate-800 mt-2">
                    {item.khmerMeaning}
                  </div>
                </div>

                {/* Example sentence */}
                <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-700 font-medium">
                    <span>"{item.exampleEn}"</span>
                    <button
                      onClick={() => handleAudio(item.exampleEn)}
                      className="text-slate-400 hover:text-emerald-600 p-0.5"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-khmer text-slate-500">
                    "{item.exampleKh}"
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
