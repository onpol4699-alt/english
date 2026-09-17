import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, Share, PlusSquare, CheckCircle, X } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner' | 'settings' | 'compact' | 'action' | 'full' | 'header-icon';
  className?: string;
  isEn?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
  className = '',
  isEn = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  // Responsive device detection: Mobile vs Desktop
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
    const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
    return mobileRegex.test(ua) || (window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
  });

  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
      const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
      setIsMobileDevice(mobileRegex.test(ua) || (window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0)));
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const installLabel = isMobileDevice 
    ? 'ដំឡើងលើទូរស័ព្ទ' 
    : 'ដំឡើងលើកុំព្យូទ័រ';

  // If already running standalone
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">Installed as Standalone App / បានតម្លើងលើឧបករណ៍រួចរាល់</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowAndroidGuide(true);
    }
  };

  return (
    <>
      {variant === 'header-icon' && (
        <button
          id="btn-dropdown-header-install"
          type="button"
          onClick={handleInstallClick}
          className={`relative p-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white shadow-md shadow-amber-500/20 flex items-center justify-center cursor-pointer border border-white/50 active:scale-95 transition-all animate-border-shimmer group ${className}`}
          title={isEn ? (isMobileDevice ? 'Install App on Phone' : 'Install App on PC') : (isMobileDevice ? 'ដំឡើងលើទូរស័ព្ទ (Install App)' : 'ដំឡើងលើកុំព្យូទ័រ (Install App)')}
          aria-label="Install App"
        >
          <Download className="w-4 h-4 text-white group-hover:scale-105 transition-transform" />
        </button>
      )}

      {(variant === 'action' || variant === 'full') && (
        <button
          id="btn-install-app-action"
          onClick={handleInstallClick}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-200/50 flex items-center justify-between transition-all cursor-pointer group ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs text-white group-hover:scale-110 transition-transform">
              <Download className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-khmer font-bold flex items-center gap-1.5">
                <span>📥 ដំឡើងកម្មវិធី (Install App)</span>
              </div>
              <div className="text-[10px] text-indigo-100 font-normal">
                {isMobileDevice ? 'ដំឡើងលើទូរស័ព្ទដៃ (Mobile App)' : 'ដំឡើងលើកុំព្យូទ័រ (Desktop App)'}
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/20 text-white font-bold shrink-0">
            {isMobileDevice ? 'Mobile' : 'PC'}
          </span>
        </button>
      )}

      {variant === 'compact' && (
        <button
          id="btn-install-app-compact"
          onClick={handleInstallClick}
          className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-400/40 ring-2 ring-emerald-500/20 shrink-0 ${className}`}
          title={installLabel}
        >
          {isMobileDevice ? (
            <Smartphone className="w-3.5 h-3.5 text-emerald-100 shrink-0 animate-pulse" />
          ) : (
            <Monitor className="w-3.5 h-3.5 text-emerald-100 shrink-0 animate-pulse" />
          )}
          <span className="font-khmer text-xs font-bold whitespace-nowrap">
            {installLabel}
          </span>
        </button>
      )}

      {variant === 'navbar' && (
        <button
          id="btn-install-pwa-nav"
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold shadow-xs transition-all ${className}`}
          title={installLabel}
        >
          {isMobileDevice ? (
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Monitor className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          )}
          <span className="font-khmer text-xs whitespace-nowrap">{installLabel}</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-emerald-600/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <span>Install on Mobile or Desktop</span>
              </h3>
              <p className="font-khmer text-xs text-emerald-100/90 mt-0.5">
                ដំឡើងលើអេក្រង់ដើម (Home Screen) ដើម្បីរៀនបានលឿន ងាយស្រួលបើកប្រើប្រាស់ និងរៀនពេលគ្មានអ៊ីនធឺណិត
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Install App / ដំឡើងកម្មវិធី</span>
            </button>
          </div>
        </div>
      )}

      {variant === 'settings' && (
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Standalone App Installation / ដំឡើងកម្មវិធី PWA</span>
            </div>
            <p className="font-khmer text-xs text-slate-500 mt-0.5">
              ដំឡើងកម្មវិធីលើទូរស័ព្ទ iPhone, Android ឬកុំព្យូទ័រ PC/Mac ដើម្បីប្រើប្រាស់ដូចកម្មវិធីទូរស័ព្ទពិតៗ
            </p>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install / ដំឡើង</span>
          </button>
        </div>
      )}

      {/* iOS Safari Installation Instruction Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Install on iPhone / iPad</span>
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-khmer">
              <p className="text-slate-700">របៀបដំឡើងលើទូរស័ព្ទ iPhone / iPad (Safari Browser)៖</p>
              
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <p className="font-medium text-slate-900">ចុចប៊ូតុង "Share" <Share className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> នៅបាតក្រោមនៃ Safari</p>
                  <span className="text-[11px] text-slate-400 font-sans">Tap the Share icon in Safari toolbar</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <p className="font-medium text-slate-900">អូសចុះក្រោម ហើយចុច "Add to Home Screen" <PlusSquare className="w-3.5 h-3.5 inline text-slate-700 mx-0.5" /></p>
                  <span className="text-[11px] text-slate-400 font-sans">Scroll down and tap "Add to Home Screen"</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <p className="font-medium text-slate-900">ចុច "Add" នៅជ្រុងខាងស្តាំខាងលើ</p>
                  <span className="text-[11px] text-slate-400 font-sans">Tap "Add" in top right corner</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Close / បានយល់ហើយ
            </button>
          </div>
        </div>
      )}

      {/* Android / Desktop Manual Guide Modal */}
      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Install App / ដំឡើងកម្មវិធី</span>
              </h3>
              <button
                onClick={() => setShowAndroidGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-khmer">
              <p className="text-slate-700">របៀបដំឡើងលើ Android ឬកុំព្យូទ័រ (Chrome/Edge)៖</p>
              
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <p className="font-medium text-slate-900">ចុចលើសញ្ញាចុចបី (⋮) នៅជ្រុងលើស្តាំនៃ Browser</p>
                  <span className="text-[11px] text-slate-400 font-sans">Tap the three dots menu (⋮)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <p className="font-medium text-slate-900">ជ្រើសរើស "Install app" ឬ "Add to Home screen"</p>
                  <span className="text-[11px] text-slate-400 font-sans">Select "Install app" or "Add to Home screen"</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAndroidGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Close / បានយល់ហើយ
            </button>
          </div>
        </div>
      )}
    </>
  );
};
