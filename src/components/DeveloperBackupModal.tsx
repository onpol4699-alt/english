import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Check, 
  Mail, 
  Phone, 
  Flame, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { 
  loadDeveloperBackupConfig, 
  saveDeveloperBackupConfig, 
  DeveloperBackupConfig 
} from '../utils/memberStorage';
import { saveAccount } from '../utils/storage';

interface DeveloperBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const DeveloperBackupModal: React.FC<DeveloperBackupModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const [slot1, setSlot1] = useState('');
  const [slot2, setSlot2] = useState('');
  const [slot3, setSlot3] = useState('');
  const [sharedPasscode, setSharedPasscode] = useState('123456');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const config = loadDeveloperBackupConfig();
      setSlot1(config.slot1);
      setSlot2(config.slot2);
      setSlot3(config.slot3);
      setSharedPasscode(config.sharedPasscode || '123456');
      setIsSaved(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    const chars = '0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSharedPasscode(code);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const clean1 = slot1.trim();
    const clean2 = slot2.trim();
    const clean3 = slot3.trim();
    const cleanPass = sharedPasscode.trim() || '123456';

    if (!clean1 && !clean2 && !clean3) {
      setError('សូមបញ្ចូលយ៉ាងហោចណាស់ ១ ជម្រើស (Email ឬ Phone)');
      return;
    }

    if (cleanPass.length < 4) {
      setError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៤ ខ្ទង់');
      return;
    }

    const config: DeveloperBackupConfig = {
      slot1: clean1 || 'phonphaihdvk@gmail.com',
      slot2: clean2 || '012889900',
      slot3: clean3 || '012889977',
      sharedPasscode: cleanPass,
      updatedAt: new Date().toISOString(),
    };

    saveDeveloperBackupConfig(config);

    // Sync all 3 slots into Account storage so any of them can be used to log in
    const activeSlots = [config.slot1, config.slot2, config.slot3].filter(Boolean);
    activeSlots.forEach((id, index) => {
      const isEmail = id.includes('@');
      saveAccount({
        id: `acc-dev-slot-${index + 1}`,
        userName: 'Phon Phai',
        authMethod: isEmail ? 'gmail' : 'phone',
        userIdentifier: id,
        email: isEmail ? id : 'phonphaihdvk@gmail.com',
        phoneNumber: !isEmail ? id : (config.slot2 || '012889900'),
        secondaryContact: activeSlots.filter(s => s !== id).join(', '),
        backupIdentifiers: activeSlots,
        passcode: cleanPass,
        role: 'Developer',
        qrToken: 'qr_master_admin_phonphai',
        createdAt: new Date().toISOString(),
      });
    });

    setIsSaved(true);
    if (onSuccessToast) {
      onSuccessToast('គណនីបម្រុងទុក Developer (៣ ជម្រើស) ត្រូវបានរក្សាទុកដោយជោគជ័យ!');
    }
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full my-auto overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Developer Flaming Badge - Clean Modern Light Design */}
        <div className="p-4 sm:p-5 bg-white/95 backdrop-blur-md border-b border-slate-200 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer border border-slate-200"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs shrink-0">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-200">
                  Developer • Phon Phai
                </span>
                <span className="text-[10px] font-mono text-purple-700 font-semibold">
                  Failover Security
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1 flex items-center gap-1.5">
                <span>សុវត្ថិភាព Developer & ទំនាក់ទំនងបម្រុងទុក</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </h3>
            </div>
          </div>
          <p className="font-khmer text-xs text-slate-500 mt-2 leading-relaxed">
            បន្ថែម Gmail ឬលេខទូរស័ព្ទបម្រុងទុក (រហូតដល់ ៣ ជម្រើស) ជាមួយពាក្យសម្ងាត់រួមតែមួយ ដើម្បីងាយស្រួល Login ករណីបាត់បង់ណាមួយ។
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSaved && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-khmer">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>បានរក្សាទុកជោគជ័យ! អ្នកអាចប្រើប្រាស់ជម្រើសទាំង ៣ នេះដើម្បី Login ជាមួយពាក្យសម្ងាត់រួម។</span>
            </div>
          )}

          {/* Slot 1: Primary Contact */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-4.5 h-4.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-mono font-bold flex items-center justify-center">1</span>
                <span>ជម្រើសទី ១ (Primary Gmail ឬ Phone) <span className="text-rose-500">*</span></span>
              </span>
            </label>
            <div className="relative">
              {slot1.includes('@') ? (
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              ) : (
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              )}
              <input
                type="text"
                required
                value={slot1}
                onChange={(e) => setSlot1(e.target.value)}
                placeholder="e.g. phonphaihdvk@gmail.com ឬ 012889900"
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
              />
            </div>
          </div>

          {/* Slot 2: Backup 2 Contact */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-4.5 h-4.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-mono font-bold flex items-center justify-center">2</span>
                <span>ជម្រើសទី ២ (Backup Phone ឬ Gmail)</span>
              </span>
            </label>
            <div className="relative">
              {slot2.includes('@') ? (
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              ) : (
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              )}
              <input
                type="text"
                value={slot2}
                onChange={(e) => setSlot2(e.target.value)}
                placeholder="e.g. 012889900 ឬ phonphai.backup@gmail.com"
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
              />
            </div>
          </div>

          {/* Slot 3: Backup 3 Contact */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-4.5 h-4.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-mono font-bold flex items-center justify-center">3</span>
                <span>ជម្រើសទី ៣ (Backup Phone ឬ Gmail បម្រុង)</span>
              </span>
            </label>
            <div className="relative">
              {slot3.includes('@') ? (
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              ) : (
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              )}
              <input
                type="text"
                value={slot3}
                onChange={(e) => setSlot3(e.target.value)}
                placeholder="e.g. 012889977 ឬ 012888999"
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
              />
            </div>
          </div>

          {/* Shared Master Password */}
          <div className="bg-slate-50 rounded-2xl p-3 sm:p-3.5 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>ពាក្យសម្ងាត់រួមតែមួយ (Shared Master Passcode)</span>
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>បង្កើតលេខកូដចៃដន្យ</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                value={sharedPasscode}
                onChange={(e) => setSharedPasscode(e.target.value)}
                placeholder="e.g. 123456"
                className="w-full pl-3.5 pr-10 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showPasscode ? 'Hide' : 'Show'}
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[10px] text-slate-500 font-khmer">
              💡 ទាំង ៣ ជម្រើសខាងលើ នឹងប្រើប្រាស់លេខកូដសម្ងាត់រួមនេះសម្រាប់ Login ចូលប្រព័ន្ធ។ ករណីបាត់បង់ ឬភ្លេចលេខណាមួយ លោកអ្នកអាចប្រើប្រាស់លេខមួយទៀតដើម្បី Login បានភ្លាមៗ។
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
            >
              បិទ (Close)
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>រក្សាទុកទិន្នន័យ (Save Backups)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
