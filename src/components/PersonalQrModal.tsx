import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Lock,
  Eye,
  EyeOff,
  User,
  KeyRound,
  Printer
} from 'lucide-react';
import { AngkorLogo } from './AngkorLogo';
import { UserProgress } from '../types';
import { generateQrPayload, generateQrCodeDataUrl } from '../utils/qrAuth';
import { getDisplayUserId, loadSavedAccounts } from '../utils/storage';
import { getStoredUserAvatar } from '../utils/avatarUtils';
import { generateQrPassSvg, renderSvgToCanvas, downloadCanvasAsPng, urlToDataUrl } from '../utils/svgPngRenderer';

interface PersonalQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export const PersonalQrModal: React.FC<PersonalQrModalProps> = ({
  isOpen,
  onClose,
  progress,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [iosPreviewUrl, setIosPreviewUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isIOS = typeof navigator !== 'undefined' && (
    /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );

  const displayId = getDisplayUserId(progress.userIdentifier || progress.email || progress.phoneNumber);
  const isEn = progress.appLanguage === 'en';

  // Retrieve real user avatar
  const userAvatar = 
    progress.avatarUrl || 
    (progress as any).avatar || 
    (progress as any).photoURL || 
    getStoredUserAvatar(progress.userIdentifier, progress.userName) || 
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Dara&backgroundColor=c0aede';

  // Retrieve user password from saved accounts (masked display only)
  const savedAccounts = loadSavedAccounts();
  const matchedAcc = savedAccounts.find(a => 
    a.userIdentifier.trim().toLowerCase() === (progress.userIdentifier || '').trim().toLowerCase() ||
    (progress.email && a.email?.trim().toLowerCase() === progress.email.trim().toLowerCase()) ||
    a.userName === progress.userName
  );
  const userPassword = (progress as any).passcode || matchedAcc?.passcode || '123456';

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsGenerating(true);

    const identifier = progress.userIdentifier || progress.email || progress.phoneNumber || progress.userName || 'learner@gmail.com';
    const payload = generateQrPayload({
      id: `acc-${displayId}`,
      userIdentifier: identifier,
      userName: progress.userName || 'English Learner',
      qrToken: progress.qrToken,
    });

    generateQrCodeDataUrl(payload)
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, progress, displayId]);

  if (!isOpen) return null;

  const handleCopyIdentifier = () => {
    const text = progress.userIdentifier || progress.email || progress.phoneNumber || progress.userName || '';
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper to handle iOS Safari vs Desktop/Android downloads via Blob URL
  const processBlobDownloadOrShare = async (blob: Blob, fileName: string, blobUrl: string) => {
    // Detect iOS / iPhone / iPad
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
      const file = new File([blob], fileName, { type: 'image/png' });
      // If Web Share API is available with file support, give user native "Save Image" to Photos
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Angkor English Pass',
            text: 'Angkor English Academy Digital Student ID Pass',
          });
          return;
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') return; // User cancelled share sheet
          console.warn('Native Web Share API dismissed or failed, opening blob in new tab:', shareErr);
        }
      }
      // Safari fallback: Open Blob image URL directly in a new tab so user can long-press to save to Photos
      window.open(blobUrl, '_blank');
    } else {
      // Standard download for desktop & Android using Blob URL
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 300);
    }
  };

  // High-Resolution 2D Canvas Generator (Blob URL based)
  const executeDirectCanvasFallback = async (fileName: string) => {
    if (!qrDataUrl) return;

    try {
      const canvas = document.createElement('canvas');
      const width = 720;
      const height = 960;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        const a = document.createElement('a');
        a.href = qrDataUrl;
        a.download = `Login_QR_${(progress.userName || 'Student').replace(/\s+/g, '_')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // Base card background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Card inner container
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(24, 24, width - 48, height - 48, 28);
      } else {
        ctx.rect(24, 24, width - 48, height - 48);
      }
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Top Header with Textured Grid Background & Official Pill-shaped Academy Logo
      const headerY = 24;
      const headerH = 160;
      ctx.save();
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(24, headerY, width - 48, headerH, [28, 28, 0, 0]);
      } else {
        ctx.fillRect(24, headerY, width - 48, headerH);
      }
      ctx.clip();

      // Dark slate textured background with dark indigo gradient
      const headerGrad = ctx.createLinearGradient(24, headerY, width - 24, headerY);
      headerGrad.addColorStop(0, '#0f172a');
      headerGrad.addColorStop(0.5, '#1e1b4b');
      headerGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = headerGrad;
      ctx.fillRect(24, headerY, width - 48, headerH);

      // Draw Textured Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = 24; x <= width - 24; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, headerY);
        ctx.lineTo(x, headerY + headerH);
        ctx.stroke();
      }
      for (let y = headerY; y <= headerY + headerH; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(24, y);
        ctx.lineTo(width - 24, y);
        ctx.stroke();
      }

      // Ambient radial glow behind logo
      const radialGlow = ctx.createRadialGradient(width / 2, headerY + headerH / 2, 10, width / 2, headerY + headerH / 2, 180);
      radialGlow.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
      radialGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(24, headerY, width - 48, headerH);

      // Official Pill-shaped Academy Logo Container (Matching AngkorLogo)
      const pillW = 340;
      const pillH = 74;
      const pillX = (width - pillW) / 2;
      const pillY = headerY + (headerH - pillH) / 2;

      // Pill background
      const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY + pillH);
      pillGrad.addColorStop(0, '#ffffff');
      pillGrad.addColorStop(0.5, '#f8faff');
      pillGrad.addColorStop(1, '#ede9fe');
      ctx.fillStyle = pillGrad;
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(pillX, pillY, pillW, pillH, 24);
      } else {
        ctx.rect(pillX, pillY, pillW, pillH);
      }
      ctx.fill();
      ctx.stroke();

      // Emblem Circle with π
      const embCenterX = pillX + 44;
      const embCenterY = pillY + pillH / 2;
      const embR = 25;
      const embGrad = ctx.createLinearGradient(embCenterX - embR, embCenterY - embR, embCenterX + embR, embCenterY + embR);
      embGrad.addColorStop(0, '#6366f1');
      embGrad.addColorStop(0.5, '#8b5cf6');
      embGrad.addColorStop(1, '#3b82f6');
      ctx.fillStyle = embGrad;
      ctx.beginPath();
      ctx.arc(embCenterX, embCenterY, embR, 0, Math.PI * 2);
      ctx.fill();

      // Glowing outer ring around emblem
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(embCenterX, embCenterY, embR + 4, 0, Math.PI * 2);
      ctx.stroke();

      // π symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('π', embCenterX, embCenterY);

      // Text "Angkor English"
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#1e1b4b';
      ctx.font = '900 22px sans-serif';
      ctx.fillText('Angkor English', pillX + 84, pillY + 36);

      // Subtitle "Learn & Grow Together"
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('Learn & Grow Together', pillX + 85, pillY + 56);

      ctx.restore();

      // User Name & Info Header
      const userName = progress.userName || 'Student Learner';
      const userIdentifier = progress.email || progress.phoneNumber || progress.userIdentifier || 'student@gmail.com';
      const userRole = progress.role || 'Student';

      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`ឈ្មោះ៖ ${userName}`, width / 2, 230);

      ctx.fillStyle = '#4b5563';
      ctx.font = '17px sans-serif';
      ctx.fillText(`គណនី៖ ${userIdentifier}`, width / 2, 265);

      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`តួនាទី៖ ${userRole}   •   កម្រិត៖ ${progress.currentLevel.toUpperCase()}   •   ID: #${displayId}`, width / 2, 298);

      // Divider
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, 320);
      ctx.lineTo(width - 60, 320);
      ctx.stroke();

      // Center QR Code Frame
      const qrBoxX = (width - 390) / 2;
      const qrBoxY = 345;
      const qrBoxSize = 390;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 24);
      } else {
        ctx.rect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
      }
      ctx.fill();
      ctx.stroke();

      // Load and draw QR image inside
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.onload = () => {
        const padding = 20;
        ctx.drawImage(qrImg, qrBoxX + padding, qrBoxY + padding, qrBoxSize - (padding * 2), qrBoxSize - (padding * 2));

        // Bottom Section: strictly masked password
        const passBoxY = 760;
        const passBoxH = 95;
        const passBoxW = width - 120;
        const passBoxX = 60;

        ctx.fillStyle = '#f1f5f9';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(passBoxX, passBoxY, passBoxW, passBoxH, 18);
        } else {
          ctx.rect(passBoxX, passBoxY, passBoxW, passBoxH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('ពាក្យសម្ងាត់៖ ••••••••', width / 2, passBoxY + 42);

        ctx.fillStyle = '#334155';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('ស្កែនដើម្បីចូលប្រើប្រាស់ (Scan to Login)', width / 2, passBoxY + 75);

        // Footer note
        ctx.fillStyle = '#64748b';
        ctx.font = '13px sans-serif';
        ctx.fillText('Angkor English Academy - Secure Educational System', width / 2, 905);

        // Convert canvas to Blob (Fix for iOS Safari base64/data URL block)
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const blobUrl = URL.createObjectURL(blob);
          setIosPreviewUrl(blobUrl);
          await processBlobDownloadOrShare(blob, fileName, blobUrl);
        }, 'image/png');
      };

      qrImg.onerror = () => {
        console.error('Failed to load QR image in canvas fallback');
      };

      qrImg.src = qrDataUrl;
    } catch (err) {
      console.error('Direct canvas fallback failed:', err);
    }
  };

  // Primary Download Handler using pure SVG Vector Canvas conversion (500px x 680px)
  const handleDownloadQrImage = async () => {
    if (!qrDataUrl || isExporting) return;
    setIsExporting(true);

    const safeName = (progress.userName || 'Student').replace(/\s+/g, '_');
    const fileName = `Login_Pass_QR_${safeName}.png`;

    try {
      // 1. Ensure custom Khmer fonts are ready for vector rasterization
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Convert user profile avatar to base64 Data URL so SVG canvas rasterization never fails or taints
      let embeddedAvatar = '';
      try {
        embeddedAvatar = await urlToDataUrl(userAvatar);
      } catch (err) {
        console.warn('Avatar conversion fallback:', err);
      }

      // 2. Generate clean, fixed-dimension pure SVG template (500px x 680px)
      const svgString = generateQrPassSvg({
        userName: progress.userName || 'Phon Phai',
        userAccount: progress.email || progress.phoneNumber || progress.userIdentifier || 'phonphaihdvk@gmail.com',
        role: progress.role || 'Developer',
        currentLevel: progress.currentLevel || 'INTERMEDIATE',
        displayId: displayId,
        avatarUrl: embeddedAvatar || userAvatar,
        plainPassword: '••••••••',
        qrDataUrl: qrDataUrl,
        isEn: isEn,
      });

      // 3. Convert SVG directly to Canvas at 2x crisp HD resolution (1000px x 1360px)
      const canvas = await renderSvgToCanvas(svgString, 500, 680, 2);

      // 4. Download / Share directly as PNG
      const resultUrl = await downloadCanvasAsPng(canvas, fileName);
      setIosPreviewUrl(resultUrl);
    } catch (err) {
      console.error('Pure SVG Canvas export failed, executing fallback:', err);
      await executeDirectCanvasFallback(fileName);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const text = progress.userIdentifier || progress.email || progress.phoneNumber || progress.userName || '';
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('user', text);
    navigator.clipboard.writeText(currentUrl.toString());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const roleLabel = progress.role === 'Developer' 
    ? 'Developer 🛠️' 
    : progress.role === 'Admin' 
    ? 'Admin 🛡️' 
    : progress.role === 'Teacher' 
    ? 'Teacher 📚' 
    : progress.role === 'Editor'
    ? 'Editor ✍️'
    : 'Student 🎓';

  const badgeTitleText = isEn 
    ? (progress.role === 'Student' ? 'Digital Student Badge' : 'Digital Member Badge') 
    : (progress.role === 'Student' ? 'ប័ណ្ណសម្គាល់សិស្ស (Digital ID)' : 'ប័ណ្ណសម្គាល់សមាជិក (Digital ID)');

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Prominent floating Close button (X) at the top-right corner of the modal overlay */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-3 right-3 sm:top-5 sm:right-5 z-[10001] p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-all cursor-pointer shadow-xl backdrop-blur-md border border-white/20 active:scale-95 flex items-center justify-center"
        title={isEn ? "Close" : "បិទ (Close)"}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Responsive container wrapping the ID card and action buttons */}
      <div 
        className="relative max-h-[90vh] w-full max-w-[360px] sm:max-w-[385px] my-auto flex flex-col items-center justify-center gap-2.5 sm:gap-3 overflow-y-auto py-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header bar with quick close button directly above the ID card */}
        <div className="w-full flex items-center justify-between px-1">
          <span className={`text-[11px] font-bold text-white/80 ${isEn ? 'font-sans' : 'font-khmer'} flex items-center gap-1.5`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{badgeTitleText}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className={`px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer flex items-center gap-1 text-xs ${isEn ? 'font-sans' : 'font-khmer'} shadow-sm active:scale-95`}
            title={isEn ? "Close" : "បិទ (Close)"}
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
            <span>{isEn ? 'Close' : 'បិទ'}</span>
          </button>
        </div>

        {/* Card Frame with Angkor English Academy Branding */}
        <div 
          ref={cardRef}
          id="digital-student-id-card"
          style={{ 
            backgroundColor: '#ffffff', 
            fontFamily: "'Kantumruy Pro', 'Battambang', 'Noto Sans Khmer', sans-serif" 
          }}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border-2 border-indigo-200 shadow-2xl text-center relative overflow-hidden shrink-0"
        >
          {/* Refined Card Header with sleek dark indigo gradient */}
          <div 
            className="relative py-2.5 px-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 overflow-hidden border-b border-indigo-900/60 flex flex-col items-center justify-center"
          >
            {/* Exact Textured Grid Background */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none" 
              style={{ 
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
                `,
                backgroundSize: '16px 16px'
              }} 
            />
            
            {/* Ambient glow behind logo */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 via-slate-900/60 to-purple-950/70 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25)_0%,transparent_75%)] pointer-events-none" />

            {/* Subtle glow/border around Angkor English logo badge */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
              <div className="p-1 rounded-xl bg-slate-900/60 backdrop-blur-xs border border-indigo-400/30 shadow-[0_0_12px_rgba(99,102,241,0.25)] flex items-center justify-center">
                <AngkorLogo 
                  className="h-8 sm:h-9 w-auto max-w-[220px] sm:max-w-[250px] drop-shadow-md" 
                  id="qr-card-angkor-pill-logo"
                />
              </div>
              <div className="mt-1 flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-indigo-200/90 tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {isEn ? (
                  <span>Official Digital ID Badge</span>
                ) : (
                  <>
                    <span>Official Digital ID Badge</span>
                    <span className="text-indigo-400/60">•</span>
                    <span className="font-khmer font-medium text-indigo-300">ប័ណ្ណសម្គាល់ផ្លូវការ</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Student Profile Info Section */}
          <div className="px-3.5 py-2.5 sm:px-4 sm:py-3">
            <div className="space-y-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center justify-center gap-2.5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-indigo-300 shadow-xs bg-indigo-50 shrink-0">
                  <img 
                    src={userAvatar} 
                    alt={progress.userName || 'Student Learner'} 
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left min-w-0">
                  <h2 className="text-xs sm:text-sm font-black text-[#1f2937] tracking-tight truncate leading-tight">
                    {progress.userName || 'Student Learner'}
                  </h2>
                  <div className="text-[10px] font-mono text-[#4b5563] font-semibold truncate max-w-[170px] sm:max-w-[200px]">
                    {progress.email || progress.phoneNumber || progress.userIdentifier || 'learner@gmail.com'}
                  </div>
                </div>
              </div>

              {/* Student Info Badges with Responsive Wrapping (Never truncates or clips ID) */}
              <div className="flex flex-wrap items-center justify-between gap-1 w-full pt-0.5">
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 border border-indigo-300 text-[#0f172a] text-[9px] sm:text-[10px] font-bold shadow-2xs whitespace-nowrap overflow-visible flex-1 text-center">
                  {roleLabel}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-[#0f172a] text-[9px] sm:text-[10px] font-bold uppercase shadow-2xs whitespace-nowrap overflow-visible flex-1 text-center">
                  Level: {progress.currentLevel}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-[#0f172a] font-mono text-[9px] sm:text-[10px] font-bold shadow-2xs whitespace-nowrap overflow-visible flex-1 text-center">
                  ID: {displayId}
                </span>
              </div>
            </div>

            {/* Center Section: Enlarged QR Code */}
            <div className="py-2.5 flex justify-center">
              <div className="p-2 bg-white rounded-2xl border-2 border-indigo-200 shadow-xs inline-block relative">
                {isGenerating ? (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 flex flex-col items-center justify-center text-slate-400 gap-1.5">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className={`text-[10px] ${isEn ? 'font-sans' : 'font-khmer'}`}>
                      {isEn ? 'Generating QR...' : 'កំពុងបង្កើត QR...'}
                    </span>
                  </div>
                ) : qrDataUrl ? (
                  <div className="relative">
                    <img 
                      src={qrDataUrl} 
                      alt="Personal Login QR" 
                      className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-xl"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-black/5" />
                  </div>
                ) : (
                  <div className={`w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-rose-500 text-xs ${isEn ? 'font-sans' : 'font-khmer'}`}>
                    {isEn ? 'Failed to generate QR Code' : 'បរាជ័យក្នុងការបង្កើត QR Code'}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Password with Live Show/Hide Toggle */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                  <Lock className="w-2.5 h-2.5 text-slate-700" />
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#0f172a] tracking-wider truncate">
                    Password: {showPassword ? userPassword : '••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPassword(!showPassword);
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-200/60 rounded-md transition cursor-pointer"
                    title={showPassword ? (isEn ? 'Hide password' : 'លាក់ពាក្យសម្ងាត់') : (isEn ? 'Show password' : 'បង្ហាញពាក្យសម្ងាត់')}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-slate-500 hover:text-indigo-600" />
                    )}
                  </button>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[9px] font-bold text-indigo-700 tracking-wider shrink-0 font-mono">
                {showPassword ? 'VISIBLE 👁️' : 'SECURED 🔒'}
              </span>
            </div>

            {/* Clean & Minimalist Helper Subtext */}
            <div className="pt-2 text-center">
              <p 
                data-qr-subtext="true"
                style={{ color: '#475569', fontSize: '12px', fontWeight: 600 }}
                className={`${isEn ? 'font-sans' : 'font-khmer'} tracking-normal leading-tight`}
              >
                {isEn ? 'Scan QR Code to Login' : 'ស្កែនដើម្បីចូលប្រើប្រាស់ (Scan to Login)'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Visible directly right below the card without cutting off */}
        <div className="w-full flex flex-col gap-2 shrink-0">
          <button
            type="button"
            id="btn-save-qr-image"
            onClick={handleDownloadQrImage}
            disabled={!qrDataUrl || isGenerating || isExporting}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className={isEn ? 'font-sans' : 'font-khmer'}>
                  {isEn ? 'Saving QR Code...' : 'កំពុងរក្សាទុក QR code...'}
                </span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className={isEn ? 'font-sans' : 'font-khmer'}>
                  {isEn ? 'Save QR Code' : 'រក្សាទុក QR code'}
                </span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className={isEn ? 'font-sans' : 'font-khmer'}>
                {isEn ? 'Print Badge' : 'បោះពុម្ព'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 shadow-xs transition-all cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className={`text-emerald-700 ${isEn ? 'font-sans' : 'font-khmer'}`}>
                    {isEn ? 'Copied!' : 'បានចម្លង!'}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span className={isEn ? 'font-sans' : 'font-khmer'}>
                    {isEn ? 'Copy Link' : 'ចម្លង Link'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* CONDITIONAL SHOW FOR iOS SAFARI SECTION (Hide on PC/Desktop/Windows) */}
          {isIOS && iosPreviewUrl && (
            <div className="p-2 bg-indigo-50/95 border border-indigo-200 rounded-xl text-center text-indigo-950 text-[10px] sm:text-[11px] font-khmer space-y-1">
              <p className="font-bold flex items-center justify-center gap-1 text-indigo-900">
                <span>📱 សម្រាប់ iOS Safari (iPhone/iPad)៖</span>
              </p>
              <p className="text-slate-600 text-[10px]">ប្រសិនបើ Safari មិនទាញយកដោយស្វ័យប្រវត្តិ សូមចុចប៊ូតុងខាងក្រោមដើម្បីបើក រួចចុចសង្កត់ (Long-press) &gt; "Save Image"៖</p>
              <a
                href={iosPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition shadow-xs"
              >
                <Eye className="w-3 h-3" />
                <span>បើកមើលរូបភាព (Open Image)</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* DEDICATED HIDDEN HTML EXPORT WRAPPER (#qr-pass-export-element) */}
      <div 
        id="qr-pass-export-element"
        style={{
          position: 'fixed',
          left: '0px',
          top: '0px',
          zIndex: -9999,
          pointerEvents: 'none',
          opacity: 0.001,
          width: '480px',
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '20px',
          boxSizing: 'border-box',
          fontFamily: "'Kantumruy Pro', 'Battambang', system-ui, -apple-system, sans-serif",
          border: '2px solid #c7d2fe'
        }}
        aria-hidden="true"
      >
        {/* Header with Dark Indigo Gradient & Official Pill Logo */}
        <div
          style={{
            width: '100%',
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            borderRadius: '16px',
            marginBottom: '18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              padding: '6px 14px',
              borderRadius: '14px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AngkorLogo
              width={260}
              height={64}
              id="qr-export-angkor-pill-logo"
            />
          </div>
          <div
            style={{
              marginTop: '8px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#c7d2fe',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isEn ? (
              <span>Official Digital ID Badge</span>
            ) : (
              <>
                <span>Official Digital ID Badge</span>
                <span style={{ color: '#818cf8' }}>•</span>
                <span style={{ color: '#a5b4fc' }}>ប័ណ្ណសម្គាល់ផ្លូវការ</span>
              </>
            )}
          </div>
        </div>

        {/* Student Info Block: Use vertical stack (display: flex; flex-direction: column; gap: 6px; align-items: flex-start;) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'flex-start',
            width: '100%',
            boxSizing: 'border-box',
            marginBottom: '14px',
            paddingBottom: '14px',
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '2px solid #818cf8',
                backgroundColor: '#e0e7ff',
                flexShrink: 0
              }}
            >
              <img
                src={userAvatar}
                alt={progress.userName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                crossOrigin="anonymous"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
              {/* Line 1: Student Name */}
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#0f172a',
                  lineHeight: 1.3,
                  wordBreak: 'break-word'
                }}
              >
                {isEn ? `Name: ${progress.userName || 'Learner'}` : `ឈ្មោះ៖ ${progress.userName || 'Phon Phai'}`}
              </div>
              {/* Line 2: Account / Email */}
              <div
                style={{
                  fontSize: '13px',
                  color: '#475569',
                  wordBreak: 'break-all',
                  lineHeight: 1.3
                }}
              >
                {isEn ? `Account: ${progress.email || progress.phoneNumber || progress.userIdentifier || 'learner@gmail.com'}` : `គណនី៖ ${progress.email || progress.phoneNumber || progress.userIdentifier || 'phonphaihdvk@gmail.com'}`}
              </div>
            </div>
          </div>

          {/* Line 3 (Badges Row): Wrap in a responsive flex row (display: flex; flex-wrap: wrap; gap: 8px; width: 100%;) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              width: '100%',
              boxSizing: 'border-box',
              marginTop: '4px'
            }}
          >
            {/* Badge 1: តួនាទី: Developer */}
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: '#e0e7ff',
                border: '1px solid #c7d2fe',
                color: '#0f172a',
                fontSize: '12px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}
            >
              តួនាទី: {progress.role || 'Developer'}
            </span>
            {/* Badge 2: កម្រិត: INTERMEDIATE */}
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: '#dcfce7',
                border: '1px solid #bbf7d0',
                color: '#0f172a',
                fontSize: '12px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase'
              }}
            >
              កម្រិត: {(progress.currentLevel || 'INTERMEDIATE').toUpperCase()}
            </span>
            {/* Badge 3: ID: 0001 (Ensure ID never breaks bounds or gets clipped at the right margin) */}
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '12px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap'
              }}
            >
              ID: {displayId}
            </span>
          </div>
        </div>

        {/* Center Section: Responsive QR Code */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0', width: '100%' }}>
          <div
            style={{
              padding: '14px',
              backgroundColor: '#ffffff',
              border: '2px solid #c7d2fe',
              borderRadius: '18px',
              display: 'inline-block',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
            }}
          >
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Personal Login QR"
                style={{
                  width: '230px',
                  height: '230px',
                  display: 'block',
                  borderRadius: '12px'
                }}
                crossOrigin="anonymous"
              />
            )}
          </div>
        </div>

        {/* Single Clean English Line: Password: •••••••• */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            boxSizing: 'border-box',
            marginTop: '10px'
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#0f172a',
              fontFamily: 'monospace',
              letterSpacing: '0.08em'
            }}
          >
            Password: ••••••••
          </div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#3730a3',
              backgroundColor: '#e0e7ff',
              border: '1px solid #c7d2fe',
              padding: '4px 10px',
              borderRadius: '8px',
              fontFamily: 'monospace'
            }}
          >
            SECURED 🔒
          </div>
        </div>

        {/* Subtext Scan QR Code to Login */}
        <div
          style={{
            color: '#475569',
            fontSize: '12px',
            fontWeight: 600,
            marginTop: '12px',
            textAlign: 'center',
            width: '100%'
          }}
        >
          {isEn ? 'Scan QR Code to Login' : 'ស្កែនដើម្បីចូលប្រើប្រាស់ (Scan to Login)'}
        </div>

        {/* Clean & Minimalist Footer */}
        <div
          style={{
            color: '#64748b',
            fontSize: '11px',
            fontWeight: 500,
            marginTop: '6px',
            textAlign: 'center',
            width: '100%'
          }}
        >
          {isEn ? 'Angkor English Academy • Official Digital Student Badge' : 'Angkor English Academy • Official Digital Student ID'}
        </div>
      </div>
    </div>
  );
};

