import React, { useState } from 'react';
import { 
  X, 
  Settings2, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Landmark, 
  GraduationCap, 
  BookOpen, 
  Globe, 
  ShieldCheck, 
  Crown,
  Smile,
  Image as ImageIcon,
  HelpCircle
} from 'lucide-react';
import { AppBrandConfig, AppLogoIconKey, AppLogoType } from '../types';
import { DEFAULT_BRAND_CONFIG } from '../utils/brandConfig';
import { BrandLogo } from './BrandLogo';

interface AdminBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: AppBrandConfig;
  onSaveBrand: (config: AppBrandConfig) => void;
}

export const AdminBrandingModal: React.FC<AdminBrandingModalProps> = ({
  isOpen,
  onClose,
  brand,
  onSaveBrand,
}) => {
  const [appName, setAppName] = useState(brand.appName);
  const [appNameKh, setAppNameKh] = useState(brand.appNameKh);
  const [taglineEn, setTaglineEn] = useState(brand.taglineEn);
  const [taglineKh, setTaglineKh] = useState(brand.taglineKh);
  const [logoType, setLogoType] = useState<AppLogoType>(brand.logoType);
  const [logoIconName, setLogoIconName] = useState<AppLogoIconKey>(brand.logoIconName);
  const [logoEmoji, setLogoEmoji] = useState(brand.logoEmoji);
  const [logoImageUrl, setLogoImageUrl] = useState(brand.logoImageUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPreviewConfig: AppBrandConfig = {
    appName: appName.trim() || DEFAULT_BRAND_CONFIG.appName,
    appNameKh: appNameKh.trim() || DEFAULT_BRAND_CONFIG.appNameKh,
    taglineEn: taglineEn.trim() || DEFAULT_BRAND_CONFIG.taglineEn,
    taglineKh: taglineKh.trim() || DEFAULT_BRAND_CONFIG.taglineKh,
    logoType,
    logoIconName,
    logoEmoji: logoEmoji.trim() || '🇰🇭',
    logoImageUrl: logoImageUrl.trim(),
  };

  const iconOptions: { key: AppLogoIconKey; labelEn: string; labelKh: string; icon: React.ReactNode }[] = [
    { key: 'temple', labelEn: 'Angkor Temple', labelKh: 'ប្រាសាទអង្គរ', icon: <Landmark className="w-5 h-5" /> },
    { key: 'graduation', labelEn: 'Graduation Cap', labelKh: 'មួកបរិញ្ញាបត្រ', icon: <GraduationCap className="w-5 h-5" /> },
    { key: 'book', labelEn: 'Open Book', labelKh: 'សៀវភៅចំណេះដឹង', icon: <BookOpen className="w-5 h-5" /> },
    { key: 'globe', labelEn: 'Global World', labelKh: 'ពិភពលោក', icon: <Globe className="w-5 h-5" /> },
    { key: 'shield', labelEn: 'Shield of Honor', labelKh: 'ខែលកិត្តិយស', icon: <ShieldCheck className="w-5 h-5" /> },
    { key: 'crown', labelEn: 'Royal Crown', labelKh: 'មកុដរាជ្យ', icon: <Crown className="w-5 h-5" /> },
    { key: 'sparkles', labelEn: 'Wisdom Sparkles', labelKh: 'ពន្លឺបញ្ញា', icon: <Sparkles className="w-5 h-5" /> },
  ];

  const handleSave = () => {
    onSaveBrand(currentPreviewConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    if (window.confirm('Reset app name and logo back to default? / កំណត់ឈ្មោះ និងរូបតំណាងត្រឡប់ទៅលំនាំដើមវិញ?')) {
      setAppName(DEFAULT_BRAND_CONFIG.appName);
      setAppNameKh(DEFAULT_BRAND_CONFIG.appNameKh);
      setTaglineEn(DEFAULT_BRAND_CONFIG.taglineEn);
      setTaglineKh(DEFAULT_BRAND_CONFIG.taglineKh);
      setLogoType(DEFAULT_BRAND_CONFIG.logoType);
      setLogoIconName(DEFAULT_BRAND_CONFIG.logoIconName);
      setLogoEmoji(DEFAULT_BRAND_CONFIG.logoEmoji);
      setLogoImageUrl('');
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Admin Branding Controls</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-khmer">
                  កែសម្រួល Logo & ឈ្មោះកម្មវិធី
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-khmer">
                ផ្លាស់ប្តូរឈ្មោះសាលា/កម្មវិធី និងរូប Logo បានយ៉ាងងាយស្រួល
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Live Preview Card */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Live Preview / ទិដ្ឋភាពជាក់ស្តែងក្នុង Header & Certificate
            </span>
            <div className="flex items-center gap-3 pt-1">
              <BrandLogo brand={currentPreviewConfig} size="lg" />
              <div>
                <div className="text-base font-bold text-slate-900 leading-tight">
                  {currentPreviewConfig.appName}
                </div>
                <div className="font-khmer text-xs text-emerald-700 font-semibold mt-0.5">
                  {currentPreviewConfig.appNameKh}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {currentPreviewConfig.taglineKh} • {currentPreviewConfig.taglineEn}
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: App Names */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Application Titles / ឈ្មោះកម្មវិធី
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex justify-between">
                <span>App Name (English)</span>
                <span className="text-slate-400 text-[11px]">e.g. Angkor English Academy</span>
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="Angkor English Academy"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 font-khmer flex justify-between">
                <span>ឈ្មោះកម្មវិធីជាភាសាខ្មែរ (Khmer App Name)</span>
                <span className="text-slate-400 text-[11px]">ឧ. បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ</span>
              </label>
              <input
                type="text"
                value={appNameKh}
                onChange={(e) => setAppNameKh(e.target.value)}
                placeholder="បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-khmer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 font-khmer">
                  ពាក្យស្លោកជាភាសាខ្មែរ (Khmer Motto)
                </label>
                <input
                  type="text"
                  value={taglineKh}
                  onChange={(e) => setTaglineKh(e.target.value)}
                  placeholder="រៀនភាសាអង់គ្លេសប្រកបដោយទំនុកចិត្ត"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-khmer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Tagline (English)
                </label>
                <input
                  type="text"
                  value={taglineEn}
                  onChange={(e) => setTaglineEn(e.target.value)}
                  placeholder="Learn English Confidently"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Logo Selection */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. App Logo & Icon / រូបតំណាង Logo
            </h3>

            {/* Logo Type Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLogoType('icon')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  logoType === 'icon' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>Icons (រូបតំណាង)</span>
              </button>

              <button
                type="button"
                onClick={() => setLogoType('emoji')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  logoType === 'emoji' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
                <span>Emoji</span>
              </button>

              <button
                type="button"
                onClick={() => setLogoType('image')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  logoType === 'image' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Custom URL</span>
              </button>
            </div>

            {/* Option A: Preset Icons */}
            {logoType === 'icon' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {iconOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setLogoIconName(opt.key)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition cursor-pointer ${
                      logoIconName === opt.key
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${logoIconName === opt.key ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {opt.icon}
                    </div>
                    <span className="text-xs font-semibold">{opt.labelEn}</span>
                    <span className="text-[10px] font-khmer text-slate-500">{opt.labelKh}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Option B: Custom Emoji */}
            {logoType === 'emoji' && (
              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Input Emoji or Flag / ជ្រើសរើស ឬវាយបញ្ចូល Emoji
                  </label>
                  <input
                    type="text"
                    value={logoEmoji}
                    onChange={(e) => setLogoEmoji(e.target.value)}
                    placeholder="🇰🇭"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xl text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500">Quick picks:</span>
                  {['🇰🇭', '🏛️', '🎓', '📚', '🌟', '🏆', '💎', '🚀'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setLogoEmoji(em)}
                      className="px-2.5 py-1 text-lg rounded-lg border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50 transition cursor-pointer"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Option C: Image URL */}
            {logoType === 'image' && (
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-700">
                  Logo Image URL (PNG, SVG, JPG)
                </label>
                <input
                  type="url"
                  value={logoImageUrl}
                  onChange={(e) => setLogoImageUrl(e.target.value)}
                  placeholder="https://example.com/school-logo.png"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 font-khmer">
                  បញ្ចូលតំណភ្ជាប់រូបភាព Logo របស់អ្នកដើម្បីបង្ហាញលើគេហទំព័រ និងវិញ្ញាបនបត្រ
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults / កំណត់ឡើងវិញ</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Save Branding / រក្សាទុក</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
