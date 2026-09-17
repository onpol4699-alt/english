import React, { useState } from 'react';
import { 
  KeyRound, 
  X, 
  Eye, 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { UserProgress } from '../types';
import { changePasswordForAccount } from '../utils/storage';
import { getCleanDisplayName } from '../utils/memberStorage';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  isEn?: boolean;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  progress,
  isEn = false,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState<{ kh: string; en: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<{ kh: string; en: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const displayName = getCleanDisplayName(progress.userName);
  const identifier = progress.userIdentifier || progress.email || displayName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.trim().length < 4) {
      setErrorMessage({
        kh: 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៤ ខ្ទង់ (New password must be at least 4 characters)',
        en: 'New password must have at least 4 characters.'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage({
        kh: 'ការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ (Passwords do not match)',
        en: 'Password confirmation does not match.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = changePasswordForAccount(
        identifier,
        newPassword.trim(),
        currentPassword.trim() ? currentPassword.trim() : undefined
      );

      if (result.success) {
        setSuccessMessage({
          kh: result.messageKh,
          en: result.messageEn
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
        }, 1500);
      } else {
        setIsSubmitting(false);
        setErrorMessage({
          kh: result.messageKh,
          en: result.messageEn
        });
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage({
        kh: 'មានបញ្ហាបច្ចេកទេស សូមព្យាយាមម្តងទៀត',
        en: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="modal-change-password-overlay"
    >
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        id="modal-change-password"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {isEn ? 'Change Password' : 'ប្តូរពាក្យសម្ងាត់'}
              </h2>
              <p className="text-xs text-slate-500 font-khmer truncate">
                {isEn ? 'Update your account login password' : 'កំណត់ពាក្យសម្ងាត់ថ្មីសម្រាប់គណនីរបស់អ្នក'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-change-password-modal"
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account Pill Banner */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-600 font-medium truncate font-khmer">
              {isEn ? 'Account:' : 'គណនី:'} <strong className="text-slate-800 font-semibold">{displayName}</strong>
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0 truncate max-w-[140px]">
            {identifier}
          </span>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-khmer leading-relaxed">
                <div>{errorMessage.kh}</div>
                {isEn && <div className="text-[11px] text-rose-600">{errorMessage.en}</div>}
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-khmer leading-relaxed">
                <div>{successMessage.kh}</div>
                {isEn && <div className="text-[11px] text-emerald-600">{successMessage.en}</div>}
              </div>
            </div>
          )}

          {/* Input 1: Current Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-khmer">
              {isEn ? 'Current Password' : 'ពាក្យសម្ងាត់បច្ចុប្បន្ន'}
              <span className="text-slate-400 font-normal ml-1">(ប្រសិនបើមាន / if set)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-current-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-sans text-slate-900 transition-colors bg-white outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Input 2: New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-khmer">
              {isEn ? 'New Password' : 'ពាក្យសម្ងាត់ថ្មី'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="input-new-password"
                type={showNew ? 'text' : 'password'}
                required
                minLength={4}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={isEn ? 'At least 4 characters' : 'យ៉ាងតិច ៤ ខ្ទង់'}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-sans text-slate-900 transition-colors bg-white outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-khmer">
              {isEn ? 'Must be at least 4 characters long' : 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៤ ខ្ទង់'}
            </p>
          </div>

          {/* Input 3: Confirm New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-khmer">
              {isEn ? 'Confirm New Password' : 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-confirm-password"
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={4}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={isEn ? 'Repeat new password' : 'វាយពាក្យសម្ងាត់ថ្មីម្តងទៀត'}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-sans text-slate-900 transition-colors bg-white outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPassword && confirmPassword && (
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-khmer">
                {newPassword === confirmPassword ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isEn ? 'Passwords match' : 'ពាក្យសម្ងាត់ត្រូវគ្នា'}
                  </span>
                ) : (
                  <span className="text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {isEn ? 'Passwords do not match' : 'ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              id="btn-cancel-change-password"
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              {isEn ? 'Cancel' : 'បោះបង់'}
            </button>
            
            <button
              id="btn-submit-change-password"
              type="submit"
              disabled={isSubmitting || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-500/20 transition cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isEn ? 'Saving...' : 'កំពុងរក្សាទុក...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Save Password' : 'រក្សាទុកពាក្យសម្ងាត់'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
