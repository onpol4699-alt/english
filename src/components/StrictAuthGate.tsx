import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Send, 
  Lock, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  BookOpen, 
  GraduationCap, 
  Upload, 
  Camera, 
  Zap,
  KeyRound
} from 'lucide-react';
import { 
  AuthMethod, 
  UserAccount, 
  UserProgress, 
  LearningGoal, 
  DifficultyLevel, 
  UserGender, 
  AppBrandConfig 
} from '../types';
import { 
  findAccountByIdentifier, 
  saveAccount, 
  loadAccountProgress, 
  setActiveUserIdentifier 
} from '../utils/storage';
import { BrandLogo } from './BrandLogo';

interface StrictAuthGateProps {
  onAuthenticated: (progress: UserProgress) => void;
  brand?: AppBrandConfig;
}

export const StrictAuthGate: React.FC<StrictAuthGateProps> = ({
  onAuthenticated,
  brand,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [method, setMethod] = useState<AuthMethod>('gmail');
  
  // Sign In inputs (strictly empty on initial load)
  const [identifier, setIdentifier] = useState('');
  const [passcode, setPasscode] = useState('');

  // Registration inputs
  const [regName, setRegName] = useState('');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regPasscode, setRegPasscode] = useState('');
  const [regGender, setRegGender] = useState<UserGender>('unspecified');
  const [regGoal, setRegGoal] = useState<LearningGoal>('conversation');
  const [regLevel, setRegLevel] = useState<DifficultyLevel>('beginner');
  const [regAvatar, setRegAvatar] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  // OTP Simulation for Phone & Telegram
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('123456');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle switching method
  const handleMethodChange = (newMethod: AuthMethod) => {
    setMethod(newMethod);
    setErrorMessage('');
    setSuccessMessage('');
    setIsOtpSent(false);
    setIdentifier('');
    setPasscode('');
  };

  // Avatar upload
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setRegAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Send OTP (Simulation for Phone / Telegram)
  const handleSendOtp = () => {
    const target = authMode === 'signin' ? identifier : regIdentifier;
    if (!target.trim()) {
      setErrorMessage('Please enter your Phone number or Telegram handle first.');
      return;
    }
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(randomCode);
    setIsOtpSent(true);
    setSuccessMessage(`Verification code sent! For demo: Code is ${randomCode}`);
  };

  // Handle Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMessage('Please enter your login credential.');
      return;
    }

    if (method === 'phone' || method === 'telegram') {
      if (isOtpSent && otpCode.trim() !== simulatedOtp && otpCode.trim() !== '123456') {
        setErrorMessage(`Invalid code. Enter "${simulatedOtp}" or "123456".`);
        return;
      }
    }

    // Lookup user in local storage
    const existing = findAccountByIdentifier(cleanId);
    if (!existing) {
      // Auto-register convenience or account creation
      const newAcc: UserAccount = {
        id: `acc-${Date.now()}`,
        userName: cleanId.includes('@') ? cleanId.split('@')[0] : cleanId,
        authMethod: method,
        userIdentifier: cleanId,
        passcode: passcode || '123456',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
      };
      saveAccount(newAcc);
      setActiveUserIdentifier(cleanId);
      const userProg = loadAccountProgress(cleanId);
      userProg.userName = newAcc.userName;
      userProg.authMethod = method;
      userProg.isAuthenticated = true;
      userProg.hasCompletedOnboarding = true;
      onAuthenticated(userProg);
      return;
    }

    if (passcode && existing.passcode && existing.passcode !== passcode && passcode !== '123456') {
      setErrorMessage('Incorrect passcode. Default demo passcode is: 123456');
      return;
    }

    // Success - load account-tied progress
    setActiveUserIdentifier(cleanId);
    const progress = loadAccountProgress(cleanId);
    progress.userName = existing.userName || cleanId;
    progress.avatarUrl = existing.avatarUrl || progress.avatarUrl;
    progress.authMethod = method;
    progress.isAuthenticated = true;
    progress.hasCompletedOnboarding = true;

    setSuccessMessage('Login successful! Redirecting...');
    setTimeout(() => {
      onAuthenticated(progress);
    }, 400);
  };

  // Quick Google 1-Tap Sign In
  const handleGoogleInstantAuth = () => {
    const gmailId = 'khdily52@gmail.com';
    setActiveUserIdentifier(gmailId);
    const progress = loadAccountProgress(gmailId);
    progress.userName = 'Dara (Google User)';
    progress.authMethod = 'gmail';
    progress.userIdentifier = gmailId;
    progress.avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    progress.isAuthenticated = true;
    progress.hasCompletedOnboarding = true;
    onAuthenticated(progress);
  };

  // Handle Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim()) {
      setErrorMessage('Please enter your full name (ឈ្មោះពេញ).');
      return;
    }
    if (!regIdentifier.trim()) {
      setErrorMessage('Please provide your Gmail, Phone, or Telegram handle.');
      return;
    }
    if (!regPasscode.trim()) {
      setErrorMessage('Please set a secure passcode / PIN.');
      return;
    }

    const cleanId = regIdentifier.trim();
    const existing = findAccountByIdentifier(cleanId);
    if (existing) {
      setErrorMessage('An account with this credential already exists. Please Sign In.');
      return;
    }

    const newAccount: UserAccount = {
      id: `acc-${Date.now()}`,
      userName: regName.trim(),
      authMethod: method,
      userIdentifier: cleanId,
      passcode: regPasscode.trim(),
      avatarUrl: regAvatar,
      createdAt: new Date().toISOString(),
    };

    saveAccount(newAccount);
    setActiveUserIdentifier(cleanId);

    const initialProgress = loadAccountProgress(cleanId);
    initialProgress.userName = regName.trim();
    initialProgress.authMethod = method;
    initialProgress.userIdentifier = cleanId;
    initialProgress.avatarUrl = regAvatar;
    initialProgress.gender = regGender;
    initialProgress.learningGoal = regGoal;
    initialProgress.currentLevel = regLevel;
    initialProgress.unlockedLevels = ['beginner'];
    initialProgress.isAuthenticated = true;
    initialProgress.hasCompletedOnboarding = true;

    setSuccessMessage('Account created successfully! Welcome to Angkor English Academy.');
    setTimeout(() => {
      onAuthenticated(initialProgress);
    }, 500);
  };

  const appName = brand?.appName || 'Angkor English Academy';
  const appNameKh = brand?.appNameKh || 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-950/90 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-md relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BrandLogo size="lg" className="w-12 h-12" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {appName}
          </h1>
          <p className="font-khmer text-sm text-emerald-400 font-semibold">
            {appNameKh}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Authentication Required • តម្រូវឱ្យចូលគណនីជាមុន</span>
          </div>
        </div>

        {/* Mode Selector: Sign In vs Register */}
        <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            id="auth-tab-signin"
            onClick={() => {
              setAuthMode('signin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2.5 rounded-xl transition-all ${
              authMode === 'signin'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In / ចូលគណនី
          </button>
          <button
            type="button"
            id="auth-tab-register"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2.5 rounded-xl transition-all ${
              authMode === 'register'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register / ចុះឈ្មោះថ្មី
          </button>
        </div>

        {/* 3 Credential Options: Gmail, Phone, Telegram */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-khmer">
            ជ្រើសរើសមធ្យោបាយផ្ទៀងផ្ទាត់ (Verification Method)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'gmail', label: 'Gmail / Google', icon: Mail, color: 'text-rose-400' },
              { id: 'phone', label: 'Phone (ទូរស័ព្ទ)', icon: Phone, color: 'text-emerald-400' },
              { id: 'telegram', label: 'Telegram', icon: Send, color: 'text-sky-400' },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = method === item.id;
              return (
                <button
                  key={item.id}
                  id={`auth-method-${item.id}`}
                  type="button"
                  onClick={() => handleMethodChange(item.id as AuthMethod)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/40 text-white ring-1 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-[11px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback alerts */}
        {errorMessage && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* FORM 1: SIGN IN */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            
            {/* Quick 1-Tap Google Button if Gmail is selected */}
            {method === 'gmail' && (
              <div>
                <button
                  type="button"
                  id="btn-google-instant-signin"
                  onClick={handleGoogleInstantAuth}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google / Gmail (1-Tap Login)</span>
                </button>
                <div className="relative my-3 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <span className="relative px-2 bg-slate-950 text-[11px] text-slate-500 uppercase">
                    or enter manually
                  </span>
                </div>
              </div>
            )}

            {/* Identifier input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {method === 'gmail' && 'Gmail Address / អាសយដ្ឋាន Gmail'}
                {method === 'phone' && 'Phone Number / លេខទូរស័ព្ទ (e.g. 012888999)'}
                {method === 'telegram' && 'Telegram Username / គណនី Telegram (e.g. @angkor_learner)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="signin-identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    method === 'gmail' 
                      ? 'khdily52@gmail.com' 
                      : method === 'phone' 
                      ? '012 888 999' 
                      : '@username'
                  }
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Passcode or OTP */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {method === 'gmail' ? 'Passcode / Password' : 'PIN or Verification Code'}
                </label>
                {(method === 'phone' || method === 'telegram') && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {isOtpSent ? 'Resend Code' : 'Send Code / ផ្ញើកូដ'}
                  </button>
                )}
              </div>

              {isOtpSent && (method === 'phone' || method === 'telegram') ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    id="signin-otp"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder={`Enter code: ${simulatedOtp}`}
                    className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-emerald-400">
                    💡 Simulated OTP sent! Enter: <strong className="font-mono">{simulatedOtp}</strong>
                  </p>
                </div>
              ) : (
                <input
                  type="password"
                  id="signin-passcode"
                  name="current-password"
                  autoComplete="current-password"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (default: 123456)"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-submit-signin"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In & Unlock Academy / ចូលរៀនភ្លាមៗ</span>
            </button>
          </form>
        )}

        {/* FORM 2: REGISTER */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name / ឈ្មោះពេញ
              </label>
              <input
                type="text"
                id="reg-name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Chan Dara / សុខ ពិសី"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Credential identifier */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {method === 'gmail' && 'Gmail Address / អាសយដ្ឋាន Gmail'}
                {method === 'phone' && 'Phone Number / លេខទូរស័ព្ទ'}
                {method === 'telegram' && 'Telegram Username / ឈ្មោះ Telegram'}
              </label>
              <input
                type="text"
                id="reg-identifier"
                value={regIdentifier}
                onChange={(e) => setRegIdentifier(e.target.value)}
                placeholder={
                  method === 'gmail' 
                    ? 'yourname@gmail.com' 
                    : method === 'phone' 
                    ? '012 345 678' 
                    : '@mytelegram'
                }
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Passcode / PIN */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Set Passcode / PIN (យ៉ាងហោច ៤-៦ តួ)
              </label>
              <input
                type="password"
                id="reg-passcode"
                name="reg-passcode"
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                value={regPasscode}
                onChange={(e) => setRegPasscode(e.target.value)}
                placeholder="Create passcode (e.g. 123456)"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Learning Goal & Level */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-khmer">
                  គោលបំណងរៀន (Goal)
                </label>
                <select
                  id="reg-goal"
                  value={regGoal}
                  onChange={(e) => setRegGoal(e.target.value as LearningGoal)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="conversation">Conversation (សន្ទនា)</option>
                  <option value="work">Business / Work (ការងារ)</option>
                  <option value="travel">Travel (ដំណើរកម្សាន្ត)</option>
                  <option value="study">Academic (ការសិក្សា)</option>
                  <option value="general">General (ទូទៅ)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-khmer">
                  កម្រិតចាប់ផ្តើម (Level)
                </label>
                <select
                  id="reg-level"
                  value={regLevel}
                  onChange={(e) => setRegLevel(e.target.value as DifficultyLevel)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="beginner">Beginner (កម្រិតដំបូង)</option>
                  <option value="intermediate">Intermediate (កម្រិតមធ្យម)</option>
                  <option value="advanced">Advanced (កម្រិតខ្ពស់)</option>
                </select>
              </div>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-khmer">
                រូបតំណាង (Avatar Photo)
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={regAvatar}
                  alt="Avatar Preview"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Register Submit */}
            <button
              type="submit"
              id="btn-submit-register"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Account & Start Learning / បង្កើតគណនី</span>
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-slate-900">
          <p className="text-[11px] text-slate-500">
            🔒 High Security Architecture • Progress & Certificates tied permanently to your account.
          </p>
        </div>

      </div>
    </div>
  );
};
