import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Compass, 
  History, 
  HelpCircle, 
  Search, 
  Layers,
  Calendar,
  Zap,
  ArrowRight
} from 'lucide-react';
import { EnglishTense, UserProgress } from '../types';
import { ENGLISH_TENSES } from '../data/tensesData';
import { speakEnglish } from '../utils/audio';

interface TensesExplorerProps {
  progress: UserProgress;
  onPracticeTenseQuiz?: (tenseId: string) => void;
  onStartPracticeQuiz?: (tenseId: string) => void;
}

export const TensesExplorer: React.FC<TensesExplorerProps> = ({
  progress,
  onPracticeTenseQuiz,
  onStartPracticeQuiz,
}) => {
  const handleQuiz = onPracticeTenseQuiz || onStartPracticeQuiz || (() => {});
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'present' | 'past' | 'future'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTenseId, setExpandedTenseId] = useState<string | null>('tense-present-simple');
  const [showFormulaTable, setShowFormulaTable] = useState(false);

  const filteredTenses = ENGLISH_TENSES.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = 
      t.tenseNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tenseNameKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.formulaPositive.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.signalWords.some(w => w.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSpeak = async (text: string) => {
    await speakEnglish(text, progress.speechRate);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Comprehensive Master Guide • គ្រប់ទាំង ១២ កាល</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              All 12 English Tenses (វេយ្យាករណ៍កាលទាំង ១២)
            </h1>
            <p className="font-khmer text-sm sm:text-base text-slate-300 leading-relaxed">
              ស្វែងយល់អំពីរូបមន្ត សញ្ញាសម្គាល់ (Signal Words) របៀបប្រើប្រាស់ជាក់ស្តែង ឧទាហរណ៍អមសំឡេង និងកំហុសទូទៅដែលគួរជៀសវាង។
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFormulaTable(!showFormulaTable)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition backdrop-blur-xs flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-blue-300" />
              <span>{showFormulaTable ? 'Hide Formula Chart' : 'View 12 Tenses Summary Table'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Formula Quick Chart (Collapsible) */}
      {showFormulaTable && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                12 English Tenses Formulas At A Glance (តារាងរូបមន្តសង្ខេប)
              </h2>
            </div>
            <button
              onClick={() => setShowFormulaTable(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Close
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Tense (ភាសាអង់គ្លេស)</th>
                  <th className="py-2.5 px-3 font-khmer">ឈ្មោះខ្មែរ</th>
                  <th className="py-2.5 px-3">Positive Formula (+)</th>
                  <th className="py-2.5 px-3">Key Signal Words</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {ENGLISH_TENSES.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-400">{t.number}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{t.tenseNameEn}</td>
                    <td className="py-2.5 px-3 font-khmer text-slate-800">{t.tenseNameKh}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-indigo-700 font-semibold">{t.formulaPositive}</td>
                    <td className="py-2.5 px-3 text-slate-500">{t.signalWords.slice(0, 3).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'all', label: 'All 12 Tenses (ទាំង ១២)' },
            { id: 'present', label: 'Present (បច្ចុប្បន្ន)' },
            { id: 'past', label: 'Past (អតីតកាល)' },
            { id: 'future', label: 'Future (អនាគតកាល)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-indigo-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tense or formula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Tenses List */}
      <div className="space-y-4">
        {filteredTenses.map((tense) => {
          const isExpanded = expandedTenseId === tense.id;

          const categoryColors = {
            present: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            past: 'bg-amber-50 text-amber-800 border-amber-200',
            future: 'bg-blue-50 text-blue-800 border-blue-200',
          }[tense.category];

          return (
            <div
              key={tense.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                isExpanded ? 'border-indigo-300 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header Accordion Trigger */}
              <div
                onClick={() => setExpandedTenseId(isExpanded ? null : tense.id)}
                className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-100">
                    {tense.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        {tense.tenseNameEn}
                      </h2>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${categoryColors}`}>
                        {tense.category}
                      </span>
                    </div>
                    <p className="font-khmer text-xs sm:text-sm text-slate-600 mt-0.5">
                      {tense.tenseNameKh} • {tense.illustrationTag}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden md:inline-block font-mono text-xs bg-slate-100 px-3 py-1 rounded-lg text-slate-700">
                    {tense.formulaPositive}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <span className="text-xs font-bold">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>
              </div>

              {/* Expanded Detailed Lesson Content */}
              {isExpanded && (
                <div className="p-4 sm:p-6 border-t border-slate-100 space-y-5 bg-slate-50/30 animate-in fade-in duration-200">
                  
                  {/* Detailed Explanation in Khmer */}
                  <div className="bg-indigo-50/70 rounded-xl p-4 border border-indigo-100">
                    <div className="flex items-center gap-2 font-bold text-xs text-indigo-900 mb-1">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>របៀបប្រើប្រាស់ និងអត្ថន័យ (How & When to Use)</span>
                    </div>
                    <p className="font-khmer text-xs sm:text-sm text-indigo-950 leading-relaxed">
                      {tense.explanationKh}
                    </p>
                    <p className="text-xs text-indigo-800/80 mt-1 font-sans italic">
                      {tense.explanationEn}
                    </p>
                  </div>

                  {/* 3 Formulas: +, -, ? */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-[11px] font-bold text-emerald-700 mb-1 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">+</span>
                        <span>Affirmative (ស្រប)</span>
                      </div>
                      <div className="font-mono text-xs text-slate-800 font-semibold bg-emerald-50/40 p-2 rounded-lg border border-emerald-100">
                        {tense.formulaPositive}
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-[11px] font-bold text-rose-700 mb-1 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">-</span>
                        <span>Negative (បដិសេធ)</span>
                      </div>
                      <div className="font-mono text-xs text-slate-800 font-semibold bg-rose-50/40 p-2 rounded-lg border border-rose-100">
                        {tense.formulaNegative}
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="text-[11px] font-bold text-blue-700 mb-1 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">?</span>
                        <span>Interrogative (សំណួរ)</span>
                      </div>
                      <div className="font-mono text-xs text-slate-800 font-semibold bg-blue-50/40 p-2 rounded-lg border border-blue-100">
                        {tense.formulaQuestion}
                      </div>
                    </div>
                  </div>

                  {/* Signal Words */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>សញ្ញាសម្គាល់កាល (Signal Words / Time Markers)</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tense.signalWords.map((word, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-700"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Real-World Examples with Audio */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-emerald-600" />
                        <span>ប្រយោគគំរូជាក់ស្តែង (Real-world Examples with Audio)</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-khmer">ចុចរូបសំឡេងដើម្បីស្តាប់</span>
                    </div>

                    <div className="space-y-2">
                      {tense.examples.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 flex items-start justify-between gap-3 transition-colors"
                        >
                          <div>
                            <div className="text-xs sm:text-sm font-semibold text-slate-900">
                              {ex.en}
                            </div>
                            <div className="font-khmer text-xs text-slate-600 mt-0.5">
                              {ex.kh}
                            </div>
                            {ex.note && (
                              <span className="inline-block font-khmer text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1">
                                {ex.note}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleSpeak(ex.en)}
                            title="Listen to native pronunciation"
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition cursor-pointer shrink-0 shadow-2xs"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Mistake Warning */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>កំហុសទូទៅដែលគួរប្រយ័ត្ន (Common Learner Mistakes)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-mono">
                        ❌ {tense.commonMistake.wrong}
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono">
                        ✅ {tense.commonMistake.right}
                      </div>
                    </div>
                    <p className="font-khmer text-xs text-amber-950 mt-1">
                      {tense.commonMistake.explanationKh}
                    </p>
                  </div>

                  {/* Practice Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleQuiz(tense.id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Practice Quiz for {tense.tenseNameEn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
