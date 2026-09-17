import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ExitConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isEn?: boolean;
  appLanguage?: 'km' | 'en';
  titleKh?: string;
  titleEn?: string;
  messageKh?: string;
  messageEn?: string;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isEn = false,
  appLanguage,
  titleKh = '⚠️ បញ្ជាក់ការចាកចេញ',
  titleEn = '⚠️ Confirm Exit',
  messageKh = 'តើអ្នកពិតជាចង់ចាកចេញពីលំហាត់នេះមែនទេ?',
  messageEn = 'Are you sure you want to leave this exercise?',
}) => {
  const isEnglish = isEn || appLanguage === 'en';

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const displayTitle = isEnglish ? titleEn : titleKh;
  const displayMessage = isEnglish ? messageEn : messageKh;
  const cancelText = isEnglish ? '✕ No' : '✕ ទេ';
  const confirmText = isEnglish ? '✓ Confirm' : '✓ យល់ព្រម';

  return (
    <div
      id="exit-confirmation-dialog-backdrop"
      className="fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        id="exit-confirmation-dialog-card"
        className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Modal Title matching Image 42: "⚠️ បញ្ជាក់ការចាកចេញ" (EN: "⚠️ Confirm Exit") */}
        <h3
          id="exit-modal-title"
          className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-2 font-khmer flex items-center justify-center gap-1.5"
        >
          <span>{displayTitle}</span>
        </h3>

        {/* Modal Message matching Image 42: "តើអ្នកពិតជាចង់ចាកចេញពីលំហាត់នេះមែនទេ?" (EN: "Are you sure you want to leave this exercise?") */}
        <p
          id="exit-modal-message"
          className="text-sm sm:text-base text-slate-600 font-khmer leading-relaxed mb-6"
        >
          {displayMessage}
        </p>

        {/* Action Buttons: Left: "✕ ទេ" (EN: "✕ No"), Right Red Button: "✓ បាទ/ចាស់" (EN: "✓ Yes") */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Left Button: Closes modal & stays in lesson */}
          <button
            type="button"
            id="btn-cancel-exit-stay"
            onClick={onCancel}
            autoFocus
            className="w-full py-3 px-3 sm:px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm font-khmer transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>{cancelText}</span>
          </button>

          {/* Right Red Button: Confirms exit & closes lesson */}
          <button
            type="button"
            id="btn-confirm-exit-close"
            onClick={onConfirm}
            className="w-full py-3 px-3 sm:px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm font-khmer shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
