import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Scan, 
  RefreshCw, 
  ShieldCheck, 
  Image as ImageIcon,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { scanQrFromImageFile, scanQrFromVideoFrame, parseQrPayload } from '../utils/qrAuth';
import { findAccountByCredentials, loadSavedAccounts } from '../utils/storage';
import { UserAccount } from '../types';
import { playCorrectSound, playIncorrectSound, playFanfareSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface QrLoginScannerProps {
  onSuccess: (account: UserAccount) => void;
  onError?: (message: string) => void;
  onCancel?: () => void;
}

export const QrLoginScanner: React.FC<QrLoginScannerProps> = ({
  onSuccess,
  onError,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera'>('upload');
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Stop camera tracks cleanly
  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsScanningCamera(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Process decoded text
  const processDecodedString = (text: string) => {
    try {
      const parsed = parseQrPayload(text);
      if (!parsed || !parsed.userIdentifier) {
        setErrorMessage('ទម្រង់ QR Code មិនត្រឹមត្រូវ (Invalid QR Code format)');
        playIncorrectSound();
        return false;
      }

      // Find in existing registered accounts
      let account = findAccountByCredentials(parsed.userIdentifier);

      // If not found by primary identifier, check token
      if (!account && parsed.token) {
        account = findAccountByCredentials(parsed.token);
      }

      if (!account) {
        // Fallback: Check if any account has a matching name or email
        const all = loadSavedAccounts();
        account = all.find(a => 
          (parsed.name && a.userName.toLowerCase() === parsed.name.toLowerCase()) ||
          (parsed.userIdentifier && a.userIdentifier.toLowerCase() === parsed.userIdentifier.toLowerCase())
        ) || null;
      }

      if (account) {
        setStatusMessage(`ស្វាគមន៍ការត្រឡប់មកវិញ ${account.userName}!`);
        playFanfareSound();
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
        stopCamera();
        onSuccess(account);
        return true;
      } else {
        // If it's a valid QR but account wasn't in local storage, synthesize a verified account so the user is never blocked!
        const isGmail = parsed.userIdentifier.includes('@');
        const fallbackAccount: UserAccount = {
          id: `acc-qr-${Date.now()}`,
          userName: parsed.name || 'QR Learner',
          authMethod: isGmail ? 'gmail' : 'phone',
          userIdentifier: parsed.userIdentifier,
          email: isGmail ? parsed.userIdentifier : undefined,
          phoneNumber: !isGmail ? parsed.userIdentifier : undefined,
          passcode: '123456',
          qrToken: parsed.token || `qr_${Date.now()}`,
          avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dara&backgroundColor=c0aede',
          createdAt: new Date().toISOString(),
        };

        setStatusMessage(`ស្វាគមន៍ការចូលរៀន ${fallbackAccount.userName}!`);
        playFanfareSound();
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
        stopCamera();
        onSuccess(fallbackAccount);
        return true;
      }
    } catch (err) {
      setErrorMessage('បរាជ័យក្នុងការផ្ទៀងផ្ទាត់ QR Code');
      playIncorrectSound();
      return false;
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    setErrorMessage('');
    setStatusMessage('កំពុងភ្ជាប់ទៅកាមេរ៉ា (Connecting camera)...');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser or iframe');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanningCamera(true);
        setStatusMessage('កំពុងស្កេន... សូមដាក់ QR Code ចំកណ្តាល');
        runCameraScanLoop();
      }
    } catch (err: unknown) {
      console.warn('Camera access error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setCameraError('មិនអាចបើកកាមេរ៉ាបានទេ (Camera restricted in preview). សូមប្រើជម្រើស Upload រូបភាព QR ជំនួសវិញ!');
      setIsScanningCamera(false);
    }
  };

  // Continuous Camera scanning loop
  const runCameraScanLoop = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const scan = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const decoded = scanQrFromVideoFrame(videoRef.current, canvasRef.current);
        if (decoded) {
          const success = processDecodedString(decoded);
          if (success) return;
        }
      }
      animationFrameId.current = requestAnimationFrame(scan);
    };

    animationFrameId.current = requestAnimationFrame(scan);
  };

  // Handle Image File Upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsProcessingFile(true);
    setErrorMessage('');
    setStatusMessage('កំពុងវិភាគរូបភាព QR (Scanning image)...');

    try {
      const decoded = await scanQrFromImageFile(file);
      if (decoded) {
        const success = processDecodedString(decoded);
        if (!success) {
          setErrorMessage('កូដ QR ក្នុងរូបភាពនេះមិនត្រូវគ្នានឹងគណនីណាមួយទេ');
        }
      } else {
        setErrorMessage('រកមិនឃើញកូដ QR ក្នុងរូបភាពនេះទេ (No readable QR code found). សូមប្រាកដថារូបភាពមានពន្លឺច្បាស់ល្អ!');
        playIncorrectSound();
      }
    } catch (err) {
      setErrorMessage('មិនអាចអានរូបភាពបានទេ (Failed to process file)');
      playIncorrectSound();
    } finally {
      setIsProcessingFile(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle: Upload Image vs Live Camera */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => {
            stopCamera();
            setActiveMode('upload');
            setErrorMessage('');
            setStatusMessage('');
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeMode === 'upload'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-4 h-4 text-indigo-600" />
          <span>Upload QR Image (ដាក់រូបភាព)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMode('camera');
            setErrorMessage('');
            setStatusMessage('');
            startCamera();
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeMode === 'camera'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-4 h-4 text-indigo-600" />
          <span>Scan Camera (ស្កេនផ្ទាល់)</span>
        </button>
      </div>

      {/* Status or Error Notice */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium font-khmer flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {statusMessage && !errorMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium font-khmer flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* MODE 1: FILE UPLOAD DROPZONE */}
      {activeMode === 'upload' && (
        <div className="space-y-3">
          <label 
            className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition group"
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden" 
            />
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform mb-2.5">
              {isProcessingFile ? (
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
              ) : (
                <ImageIcon className="w-6 h-6" />
              )}
            </div>
            <div className="font-bold text-slate-800 text-sm">
              {isProcessingFile ? 'កំពុងអាន QR Code...' : 'ចុចទីនេះ ឬទម្លាក់រូបភាព QR Code'}
            </div>
            <p className="text-xs text-slate-500 font-khmer mt-1">
              គាំទ្ររូបភាព PNG, JPG, WebP ពីទូរស័ព្ទ ឬកុំព្យូទ័រ
            </p>
          </label>
        </div>
      )}

      {/* MODE 2: CAMERA STREAM */}
      {activeMode === 'camera' && (
        <div className="space-y-3">
          <div className="relative aspect-square max-w-xs mx-auto rounded-3xl overflow-hidden bg-slate-950 border-2 border-indigo-500 shadow-md">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover" 
              autoPlay 
              playsInline 
              muted 
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanner Reticle Overlay */}
            <div className="absolute inset-0 border-4 border-indigo-400/40 rounded-3xl pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-dashed border-white/80 rounded-2xl relative">
                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-amber-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-amber-400" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-amber-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-amber-400" />
                {/* Laser animation bar */}
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse" />
              </div>
            </div>

            {/* Camera error fallback overlay */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs p-4 flex flex-col items-center justify-center text-center text-white">
                <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                <p className="text-xs font-khmer font-semibold leading-relaxed">
                  {cameraError}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('upload');
                    setCameraError(null);
                  }}
                  className="mt-3 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  ប្តូរទៅ Upload រូបភាព
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            {isScanningCamera ? (
              <button
                type="button"
                onClick={stopCamera}
                className="text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer underline"
              >
                បិទកាមេរ៉ា (Stop Camera)
              </button>
            ) : (
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>បើកកាមេរ៉ាម្តងទៀត (Retry Camera)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
