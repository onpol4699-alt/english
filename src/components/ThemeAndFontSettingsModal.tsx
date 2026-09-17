import React, { useState } from 'react';
import { 
  X, 
  Type, 
  Palette, 
  Sun, 
  Moon, 
  Sunrise, 
  User, 
  Check, 
  Sparkles,
  Sliders,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { UserProgress, KhmerFontId, ThemeColorId, ThemeBrightness, KhmerFontSize, BackgroundTheme } from '../types';

interface ThemeAndFontSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateSettings: (updates: Partial<UserProgress>) => void;
}

export const KHMER_FONTS: {
  id: KhmerFontId;
  nameEn: string;
  nameKh: string;
  pairEn: string;
  pairKh: string;
  fontClass: string;
  descriptionKh: string;
  previewEn: string;
  previewKh: string;
  isDualPair?: boolean;
}[] = [
  {
    id: 'battambang',
    nameEn: 'Option 1: Battambang (Default)',
    nameKh: 'បាត់ដំបង (Battambang - ស្តង់ដារ)',
    pairEn: "'Plus Jakarta Sans' / 'Inter'",
    pairKh: "'Battambang'",
    fontClass: 'khmer-font-battambang',
    descriptionKh: 'ពុម្ពអក្សរខ្មែរពេញនិយមទូទាំងប្រទេស ច្បាស់ ស្រួលអាន និងស្អាតស្តង់ដារ',
    previewEn: 'Master English with Angkor English Academy',
    previewKh: 'សួស្តី! ខ្ញុំរៀនភាសាអង់គ្លេសប្រចាំថ្ងៃជាមួយ Angkor English',
    isDualPair: true,
  },
  {
    id: 'modern',
    nameEn: 'Option 2: Modern UI',
    nameKh: 'ទាន់សម័យ (Modern UI)',
    pairEn: "'Inter' / 'Poppins'",
    pairKh: "'Kantumruy Pro'",
    fontClass: 'font-pair-modern',
    descriptionKh: 'Clean, modern UI and supreme readability (ស្អាត ច្បាស់ ងាយស្រួលអានបំផុត)',
    previewEn: 'Master English with Angkor English Academy',
    previewKh: 'សួស្តី! ខ្ញុំរៀនភាសាអង់គ្លេសប្រចាំថ្ងៃ',
    isDualPair: true,
  },
  {
    id: 'rounded',
    nameEn: 'Option 3: Friendly Rounded',
    nameKh: 'មូលស្រទន់ (Friendly Rounded)',
    pairEn: "'Nunito' / 'Quicksand'",
    pairKh: "'Khmer Rounded'",
    fontClass: 'font-pair-rounded',
    descriptionKh: 'Warm, engaging style for modern learners (រាងមូលស្រទន់ ទាក់ទាញ)',
    previewEn: 'Friendly, warm & engaging learning experience',
    previewKh: 'សួស្តី! ខ្ញុំរៀនភាសាអង់គ្លេសប្រចាំថ្ងៃ',
    isDualPair: true,
  },
  {
    id: 'elegant',
    nameEn: 'Option 4: Classic Elegant',
    nameKh: 'បុរាណប្រណិត (Classic Elegant)',
    pairEn: "'Playfair Display' / 'Merriweather'",
    pairKh: "'Moul'",
    fontClass: 'font-pair-elegant',
    descriptionKh: 'Sophisticated, traditional typography (រចនាបថអក្សរបុរាណប្រណិត និងរាជវង្ស)',
    previewEn: 'Academic excellence & historic prestige',
    previewKh: 'សួស្តី! វិទ្យាស្ថានភាសាអង់គ្លេសអង្គរ',
    isDualPair: true,
  },
  {
    id: 'system',
    nameEn: 'Option 5: Standard Clean',
    nameKh: 'អក្សរស្តង់ដារ (Standard Clean)',
    pairEn: 'Plus Jakarta Sans / System',
    pairKh: "'Battambang' / 'Koh Santepheap'",
    fontClass: 'font-pair-system',
    descriptionKh: 'ស្ទីលហ្វុនស្អាតច្បាស់ស្តង់ដារ រលូន និងស្រស់ស្អាតក្នុងការអាន',
    previewEn: 'Master English with Angkor English Academy',
    previewKh: 'សួស្តី! ខ្ញុំរៀនភាសាអង់គ្លេសប្រចាំថ្ងៃ',
    isDualPair: true,
  },
];

export const THEME_COLORS: {
  id: ThemeColorId;
  nameEn: string;
  nameKh: string;
  colorHex: string;
  bgClass: string;
  ringClass: string;
}[] = [
  {
    id: 'emerald',
    nameEn: 'Emerald Green',
    nameKh: 'ត្បូងមរកត',
    colorHex: '#059669',
    bgClass: 'bg-emerald-600',
    ringClass: 'ring-emerald-500',
  },
  {
    id: 'blue',
    nameEn: 'Ocean Blue',
    nameKh: 'ខៀវសមុទ្រ',
    colorHex: '#2563eb',
    bgClass: 'bg-blue-600',
    ringClass: 'ring-blue-500',
  },
  {
    id: 'purple',
    nameEn: 'Purple Dusk',
    nameKh: 'ស្វាយរាជវង្ស',
    colorHex: '#7c3aed',
    bgClass: 'bg-purple-600',
    ringClass: 'ring-purple-500',
  },
  {
    id: 'amber',
    nameEn: 'Sunset Amber',
    nameKh: 'ទឹកក្រូចមាស',
    colorHex: '#d97706',
    bgClass: 'bg-amber-600',
    ringClass: 'ring-amber-500',
  },
  {
    id: 'rose',
    nameEn: 'Coral Rose',
    nameKh: 'ផ្កាឈូកផ្កាថ្ម',
    colorHex: '#e11d48',
    bgClass: 'bg-rose-600',
    ringClass: 'ring-rose-500',
  },
];

export const BACKGROUND_THEMES: {
  id: BackgroundTheme;
  nameEn: string;
  nameKh: string;
  descriptionKh: string;
  badgeBg: string;
  badgeBorder: string;
}[] = [
  {
    id: 'light',
    nameEn: 'Clean Light',
    nameKh: 'សភ្លឺស្អាត',
    descriptionKh: 'ផ្ទាំងពណ៌សស្អាត ស្រស់ថ្លា និងងាយស្រួលមើល',
    badgeBg: 'bg-white',
    badgeBorder: 'border-slate-300',
  },
  {
    id: 'dark',
    nameEn: 'Dark Slate',
    nameKh: 'រាត្រីងងឹត',
    descriptionKh: 'ផ្ទាំងពណ៌ងងឹត ការពារភ្នែកពេលយប់',
    badgeBg: 'bg-slate-900',
    badgeBorder: 'border-slate-700',
  },
  {
    id: 'modern-blue',
    nameEn: 'Ocean Blue',
    nameKh: 'ខៀវសមុទ្រ',
    descriptionKh: 'ផ្ទាំងពណ៌ខៀវទំនើប ស្រស់ស្រាយ ផ្តោតអារម្មណ៍ខ្ពស់',
    badgeBg: 'bg-sky-900',
    badgeBorder: 'border-sky-600',
  },
  {
    id: 'nature-green',
    nameEn: 'Nature Green',
    nameKh: 'បៃតងធម្មជាតិ',
    descriptionKh: 'ផ្ទាំងពណ៌បៃតងធម្មជាតិ ស្រទន់ និងមានសន្តិភាពផ្លូវចិត្ត',
    badgeBg: 'bg-emerald-900',
    badgeBorder: 'border-emerald-600',
  },
  {
    id: 'sunset',
    nameEn: 'Golden Sunset',
    nameKh: 'ថ្ងៃលិចពណ៌មាស',
    descriptionKh: 'ផ្ទាំងពណ៌មាសទន់ភ្លន់ ផ្តល់កម្លាំងចិត្ត និងភាពកក់ក្តៅ',
    badgeBg: 'bg-amber-900',
    badgeBorder: 'border-amber-600',
  },
];

export const ThemeAndFontSettingsModal: React.FC<ThemeAndFontSettingsModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateSettings,
}) => {
  const isEn = progress.appLanguage === 'en';
  const [activeTab, setActiveTab] = useState<'theme' | 'font'>('theme');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Compact Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-khmer">
                {isEn ? 'Settings' : 'ការកំណត់'}
              </h2>
            </div>
          </div>

          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-xl transition cursor-pointer"
            title={isEn ? "Close" : "បិទ"}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Setting Navigation Tabs (Theme & Language, Fonts) */}
        <div className="flex border-b border-slate-200 px-4 sm:px-5 gap-1 bg-white">
          <button
            id="tab-settings-theme"
            onClick={() => setActiveTab('theme')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'theme'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isEn ? 'Theme & Language' : 'រូបរាង និងភាសា'}</span>
          </button>

          <button
            id="tab-settings-font"
            onClick={() => setActiveTab('font')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'font'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>{isEn ? 'Fonts' : 'ពុម្ពអក្សរ'}</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: KHMER FONTS */}
          {activeTab === 'font' && (
            <div className="space-y-4">
              {/* Font Size Scaling */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isEn ? 'Text Size' : 'ទំហំអក្សរ'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: isEn ? 'Standard (100%)' : 'ធម្មតា (100%)' },
                    { id: 'large', label: isEn ? 'Large (112%)' : 'ធំ (112%)' },
                    { id: 'xlarge', label: isEn ? 'Extra Large (125%)' : 'ធំពិសេស (125%)' },
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => onUpdateSettings({ khmerFontSize: size.id as KhmerFontSize })}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer active:scale-95 ${
                        progress.khmerFontSize === size.id
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20 text-indigo-900 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{size.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isEn ? 'Font Family' : 'ពុម្ពអក្សរ'}
                </label>

                <div className="grid grid-cols-1 gap-2.5">
                  {KHMER_FONTS.map((font) => {
                    const isSelected = progress.khmerFont === font.id;

                    return (
                      <div
                        key={font.id}
                        id={`font-opt-${font.id}`}
                        onClick={() => {
                          onUpdateSettings({ khmerFont: font.id });
                          if (typeof window !== 'undefined') {
                            try {
                              localStorage.setItem('aea_preferred_font', font.id);
                            } catch {
                              // ignore
                            }
                          }
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition active:scale-[0.99] ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20 shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs">{font.nameEn}</span>
                            {!isEn && (
                              <span className="font-khmer text-xs text-indigo-700 font-semibold">
                                ({font.nameKh})
                              </span>
                            )}
                          </div>

                          {isSelected ? (
                            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                          )}
                        </div>

                        {/* Compact Preview */}
                        <div className={`p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-800 ${font.fontClass}`}>
                          {isEn ? font.previewEn : font.previewKh}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 (Default): THEME & LANGUAGE */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              {/* 1. Language: Language / ភាសា */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isEn ? 'Language' : 'ភាសា'}</span>
                  </label>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {progress.appLanguage === 'en' ? 'EN' : 'KH'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ appLanguage: 'km' })}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition cursor-pointer active:scale-95 text-left ${
                      progress.appLanguage !== 'en'
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-2xs font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-lg shrink-0">🇰🇭</span>
                    <span className="text-xs font-bold text-slate-900 font-khmer">
                      {isEn ? 'Khmer' : 'ភាសាខ្មែរ (Khmer)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ appLanguage: 'en' })}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition cursor-pointer active:scale-95 text-left ${
                      progress.appLanguage === 'en'
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-2xs font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-lg shrink-0">🇬🇧</span>
                    <span className="text-xs font-bold text-slate-900 font-khmer">
                      {isEn ? 'English' : 'អង់គ្លេស (English)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 2. Theme: Theme / រូបរាង */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isEn ? 'Theme' : 'រូបរាង'}</span>
                  </label>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {progress.themeBrightness === 'dark' || progress.backgroundTheme === 'dark' 
                      ? (isEn ? 'Dark' : 'ងងឹត') 
                      : (isEn ? 'Light' : 'ពន្លឺ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ themeBrightness: 'light', backgroundTheme: 'light' })}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition cursor-pointer active:scale-95 text-left ${
                      progress.themeBrightness !== 'dark' && progress.backgroundTheme !== 'dark'
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20 shadow-2xs font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 font-khmer">
                      {isEn ? 'Light' : 'ពន្លឺ (Light)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ themeBrightness: 'dark', backgroundTheme: 'dark' })}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition cursor-pointer active:scale-95 text-left ${
                      progress.themeBrightness === 'dark' || progress.backgroundTheme === 'dark'
                        ? 'border-indigo-600 bg-slate-900 ring-2 ring-indigo-600/20 text-white shadow-2xs font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-800 text-amber-300 flex items-center justify-center shrink-0">
                      <Moon className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-xs font-bold font-khmer ${progress.themeBrightness === 'dark' || progress.backgroundTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {isEn ? 'Dark' : 'ងងឹត (Dark)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. Brightness: Brightness / កម្រិតពន្លឺ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isEn ? 'Brightness' : 'កម្រិតពន្លឺ'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'light', label: isEn ? 'Standard Light' : 'ពន្លឺធម្មតា', icon: Sun },
                    { id: 'dark', label: isEn ? 'Eye Care Dark' : 'ងងឹតថ្នមភ្នែក', icon: Moon },
                    { id: 'warm', label: isEn ? 'Warm Glow' : 'កក់ក្តៅ', icon: Sunrise },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = progress.themeBrightness === mode.id;

                    return (
                      <button
                        key={mode.id}
                        id={`brightness-opt-${mode.id}`}
                        onClick={() => onUpdateSettings({ themeBrightness: mode.id as ThemeBrightness })}
                        className={`p-2 rounded-xl border text-center transition cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20 font-bold text-slate-900'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs font-bold">{mode.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Theme Color Accents: Accent Color / ពណ៌ចម្បង */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isEn ? 'Accent Color' : 'ពណ៌ចម្បង'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {THEME_COLORS.map((color) => {
                    const isSelected = progress.themeColor === color.id;

                    return (
                      <button
                        key={color.id}
                        id={`color-opt-${color.id}`}
                        onClick={() => onUpdateSettings({ themeColor: color.id })}
                        className={`p-2 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'border-slate-900 ring-2 ring-slate-900/10 bg-slate-50 font-bold'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div 
                          className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-white shadow-2xs ${color.bgClass}`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {isEn ? color.nameEn : color.nameKh}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Background Themes: Background / ផ្ទៃខាងក្រោយ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isEn ? 'Background' : 'ផ្ទៃខាងក្រោយ'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BACKGROUND_THEMES.map((bTheme) => {
                    const isSelected = progress.backgroundTheme === bTheme.id;

                    return (
                      <button
                        key={bTheme.id}
                        id={`bg-theme-opt-${bTheme.id}`}
                        onClick={() => onUpdateSettings({ backgroundTheme: bTheme.id })}
                        className={`p-2 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20 font-bold'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border shadow-2xs shrink-0 flex items-center justify-center ${bTheme.badgeBg} ${bTheme.badgeBorder}`}>
                          {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {isEn ? bTheme.nameEn : bTheme.nameKh}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Compact Footer */}
        <div className="p-3 sm:p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-khmer">
            {isEn ? 'Saved automatically' : 'រក្សាទុកដោយស្វ័យប្រវត្តិ'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
          >
            {isEn ? 'Done' : 'រួចរាល់'}
          </button>
        </div>

      </div>
    </div>
  );
};
