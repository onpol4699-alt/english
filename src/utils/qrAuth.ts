import QRCode from 'qrcode';
import jsQR from 'jsqr';

export interface QrLoginPayload {
  v: number;
  type: 'ENG_KH_LOGIN';
  uid: string;
  name: string;
  token: string;
  ts: number;
}

/**
 * Generate a standardized, encrypted or structured QR payload string for a user
 */
export function generateQrPayload(account: {
  id: string;
  userIdentifier: string;
  userName: string;
  qrToken?: string;
}): string {
  const token = account.qrToken || `qr_${account.id}_${Date.now()}`;
  const payload: QrLoginPayload = {
    v: 1,
    type: 'ENG_KH_LOGIN',
    uid: account.userIdentifier.trim(),
    name: account.userName.trim(),
    token,
    ts: Date.now(),
  };
  return JSON.stringify(payload);
}

/**
 * Parse and validate QR payload from decoded QR scanner text
 */
export function parseQrPayload(text: string): {
  userIdentifier: string;
  token?: string;
  name?: string;
} | null {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();

  // 1. Try parsing JSON payload
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object') {
      if (parsed.uid) {
        return {
          userIdentifier: String(parsed.uid).trim(),
          token: parsed.token ? String(parsed.token) : undefined,
          name: parsed.name ? String(parsed.name) : undefined,
        };
      }
      if (parsed.userIdentifier) {
        return {
          userIdentifier: String(parsed.userIdentifier).trim(),
          token: parsed.token ? String(parsed.token) : undefined,
          name: parsed.name ? String(parsed.name) : undefined,
        };
      }
    }
  } catch {
    // Not JSON, continue to fallback parsing
  }

  // 2. Direct match fallback (if user scanned a QR containing their email or phone or custom token)
  if (trimmed.includes('@gmail.com') || /^[0-9+ ]{8,15}$/.test(trimmed) || trimmed.startsWith('acc-') || trimmed.startsWith('qr_')) {
    return {
      userIdentifier: trimmed,
    };
  }

  return null;
}

/**
 * Render crisp QR Code Data URL
 */
export async function generateQrCodeDataUrl(content: string): Promise<string> {
  try {
    return await QRCode.toDataURL(content, {
      width: 500, // High-definition 500px resolution for ultra-crisp display and export
      margin: 2,
      errorCorrectionLevel: 'H', // High error correction level for maximum clarity and scan reliability
      color: {
        dark: '#1e1b4b', // rich deep indigo
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    throw err;
  }
}

/**
 * Decode QR Code from an uploaded image file (PNG, JPG, WebP)
 */
export async function scanQrFromImageFile(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            resolve(null);
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data) {
            resolve(code.data);
          } else {
            resolve(null);
          }
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Scan a single frame from an active video element
 */
export function scanQrFromVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): string | null {
  if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
    return null;
  }

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  });

  if (code && code.data) {
    return code.data;
  }
  return null;
}
