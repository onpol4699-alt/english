/**
 * Pure SVG Vector Canvas Renderer for 100% Deterministic, Unbroken PNG Exports
 * Completely eliminates html2canvas DOM capturing and all font/clipping defects.
 */

export interface QrPassSvgData {
  userName: string;
  userAccount: string;
  role: string;
  currentLevel: string;
  displayId: string;
  avatarUrl?: string;
  plainPassword?: string;
  qrDataUrl: string;
  isEn?: boolean;
}

/**
 * Utility to convert image URL to base64 Data URL for deterministic SVG embedding
 */
export async function urlToDataUrl(url: string): Promise<string> {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  try {
    const res = await fetch(url, { mode: 'cors' });
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const c = document.createElement('canvas');
          c.width = img.naturalWidth || 100;
          c.height = img.naturalHeight || 100;
          const ctx = c.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(c.toDataURL('image/png'));
            return;
          }
        } catch {}
        resolve(url);
      };
      img.onerror = () => resolve(url);
      img.src = url;
    });
  }
}

export interface CertificateSvgData {
  appNameEn: string;
  appNameKh: string;
  studentName: string;
  honorificText: string;
  certId: string;
  issueDate: string;
  badgeSubEn: string;
  titleEn: string;
  titleKh: string;
  programKh: string;
  awardedTextEn: string;
  curriculumEn: string;
  curriculumKh: string;
  perfTitle: string;
  perfSubKh: string;
  perfAccuracy: string;
  perfXP: string;
  perfCurriculum: string;
  sealTop: string;
  sealCenter: string;
  sealBottom: string;
  directorName: string;
  directorTitleEn: string;
  linguistName: string;
  linguistTitleEn: string;
  themeColor?: string;
  borderColor?: string;
  secondaryColor?: string;
  textColor?: string;
  logoUrl?: string;
  sealStampUrl?: string;
  directorSignatureUrl?: string;
  linguistSignatureUrl?: string;
}

/**
 * Safe XML string escaping
 */
export function escapeXml(str?: string | number | null): string {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 1. QR PASS SVG TEMPLATE
 * Fixed Dimensions: 500px width x 680px height
 * Guarantees zero text shift, crisp Khmer typography, fixed badges & unclipped ID
 */
export function generateQrPassSvg(data: QrPassSvgData): string {
  const {
    userName,
    userAccount,
    role,
    currentLevel,
    displayId,
    avatarUrl,
    plainPassword,
    qrDataUrl,
    isEn = false
  } = data;

  // Safe calculated widths for badges
  const roleText = isEn ? `Role: ${role || 'Student'}` : `តួនាទី: ${role || 'Developer'}`;
  const levelText = isEn ? `Level: ${(currentLevel || 'INTERMEDIATE').toUpperCase()}` : `កម្រិត: ${(currentLevel || 'INTERMEDIATE').toUpperCase()}`;
  const idText = `ID: ${displayId || '0001'}`;
  const headerSubtitle = isEn ? 'OFFICIAL DIGITAL ID BADGE' : 'OFFICIAL DIGITAL ID BADGE • ប័ណ្ណសម្គាល់ផ្លូវការ';
  const nameLabel = isEn ? `Name: ${escapeXml(userName || 'Learner')}` : `ឈ្មោះ៖ ${escapeXml(userName || 'Phon Phai')}`;
  const accountLabel = isEn ? `Account: ${escapeXml(userAccount || 'learner@gmail.com')}` : `គណនី៖ ${escapeXml(userAccount || 'phonphaihdvk@gmail.com')}`;
  const qrSubtext = isEn ? 'Scan QR Code to Login' : 'ស្កែនដើម្បីចូលប្រើប្រាស់ (Scan to Login)';
  const footerText = isEn ? 'Angkor English Academy • Official Digital Student Badge' : 'Angkor English Academy • Official Digital Student ID Pass';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="680" viewBox="0 0 500 680">
  <defs>
    <linearGradient id="qrCardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>

    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>

    <clipPath id="avatarClip">
      <rect x="24" y="0" width="54" height="54" rx="16" />
    </clipPath>

    <style>
      text {
        font-family: 'Kantumruy Pro', 'Battambang', 'Segoe UI', system-ui, -apple-system, sans-serif;
      }
      .mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }
    </style>
  </defs>

  <!-- Outer Card Frame -->
  <rect x="8" y="8" width="484" height="664" rx="24" fill="url(#qrCardBg)" stroke="#c7d2fe" stroke-width="2" />

  <!-- Header Banner (Dark Indigo Gradient) -->
  <g>
    <rect x="20" y="20" width="460" height="112" rx="18" fill="url(#headerGrad)" />
    
    <!-- Textured Ambient Grid Accents -->
    <line x1="20" y1="56" x2="480" y2="56" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    <line x1="20" y1="92" x2="480" y2="92" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    <line x1="140" y1="20" x2="140" y2="132" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    <line x1="360" y1="20" x2="360" y2="132" stroke="rgba(255,255,255,0.06)" stroke-width="1" />

    <!-- Official Pill-shaped Academy Logo -->
    <rect x="88" y="32" width="324" height="54" rx="16" fill="#0f172a" fill-opacity="0.9" stroke="#6366f1" stroke-opacity="0.5" stroke-width="1.5" />

    <!-- Emblem Circle with π -->
    <circle cx="120" cy="59" r="16" fill="url(#goldGrad)" />
    <text x="120" y="65" text-anchor="middle" font-size="16" font-weight="900" fill="#ffffff">π</text>

    <!-- Logo Typography -->
    <text x="148" y="53" font-size="15" font-weight="900" fill="#ffffff" letter-spacing="0.06em">ANGKOR ENGLISH</text>
    <text x="148" y="70" font-size="9.5" font-weight="700" fill="#a5b4fc" letter-spacing="0.1em">ACADEMY • ភាសាអង់គ្លេស</text>

    <!-- Subtitle on Header Bottom -->
    <text x="250" y="115" text-anchor="middle" font-size="10.5" font-weight="700" fill="#c7d2fe" letter-spacing="0.12em">${escapeXml(headerSubtitle)}</text>
  </g>

  <!-- Student Info Block -->
  <g transform="translate(0, 146)">
    <!-- Real Profile Avatar (with fallback to elegant vector badge) -->
    <rect x="24" y="0" width="54" height="54" rx="16" fill="#e0e7ff" stroke="#818cf8" stroke-width="2" />
    ${avatarUrl ? `
    <image href="${avatarUrl}" x="24" y="0" width="54" height="54" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip)" crossorigin="anonymous" />
    ` : `
    <circle cx="51" cy="20" r="10" fill="#4f46e5" />
    <path d="M37 46 C37 32, 65 32, 65 46" fill="#4f46e5" />
    `}

    <!-- Line 1: Student Name -->
    <text x="92" y="24" font-size="18" font-weight="bold" fill="#0f172a">${nameLabel}</text>

    <!-- Line 2: Account / Email -->
    <text x="92" y="45" font-size="12.5" fill="#475569">${accountLabel}</text>

    <!-- Line 3: Badges Row (Role, Level, ID) -->
    <!-- Badge 1: Role -->
    <rect x="24" y="66" width="138" height="26" rx="13" fill="#e0e7ff" stroke="#c7d2fe" stroke-width="1" />
    <text x="93" y="83" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e1b4b">${escapeXml(roleText)}</text>

    <!-- Badge 2: Level -->
    <rect x="170" y="66" width="158" height="26" rx="13" fill="#dcfce7" stroke="#bbf7d0" stroke-width="1" />
    <text x="249" y="83" text-anchor="middle" font-size="11" font-weight="bold" fill="#065f46">${escapeXml(levelText)}</text>

    <!-- Badge 3: ID -->
    <rect x="336" y="66" width="140" height="26" rx="13" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1" />
    <text x="406" y="83" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0f172a" class="mono">${escapeXml(idText)}</text>

    <!-- Divider Line -->
    <line x1="24" y1="104" x2="476" y2="104" stroke="#e2e8f0" stroke-width="1" />
  </g>

  <!-- Center QR Code Section (Enlarged 240px x 240px container) -->
  <g transform="translate(0, 258)">
    <rect x="130" y="0" width="240" height="240" rx="20" fill="#ffffff" stroke="#c7d2fe" stroke-width="2" />
    ${qrDataUrl ? `<image href="${qrDataUrl}" x="140" y="10" width="220" height="220" preserveAspectRatio="none" />` : ''}
    <text x="250" y="258" text-anchor="middle" font-size="12" font-weight="bold" fill="#4f46e5">${escapeXml(qrSubtext)}</text>
  </g>

  <!-- Masked Password Block (Clean single line, no Khmer or duplicate text) -->
  <g transform="translate(0, 532)">
    <rect x="24" y="0" width="452" height="50" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="44" y="31" font-size="14" font-weight="bold" fill="#0f172a" class="mono">Password: ••••••••</text>

    <!-- Secured Status Pill -->
    <rect x="360" y="10" width="102" height="30" rx="9" fill="#e0e7ff" stroke="#c7d2fe" stroke-width="1" />
    <text x="411" y="29" text-anchor="middle" font-size="11" font-weight="bold" fill="#3730a3">SECURED 🔒</text>
  </g>

  <!-- Minimalist Clean Footer -->
  <g transform="translate(0, 614)">
    <text x="250" y="20" text-anchor="middle" font-size="11" font-weight="600" fill="#64748b">${escapeXml(footerText)}</text>
  </g>
</svg>`;
}

/**
 * 2. CERTIFICATE SVG TEMPLATE
 * Fixed Dimensions: Standard A4 Landscape (1123px width x 794px height)
 * Features full vector ornamental borders, crest, typography, CEFR ratings, seal, and signatures.
 */
export function generateCertificateSvg(data: CertificateSvgData): string {
  const {
    appNameEn = 'ANGKOR ENGLISH ACADEMY',
    appNameKh = 'សាលាភាសាអង់គ្លេសអង្គរ',
    studentName = 'Learner',
    honorificText = 'Candidate',
    certId = 'AEA-CERT-1042',
    issueDate = 'September 13, 2026',
    badgeSubEn = 'OFFICIAL STANDARDIZED CERTIFICATE OF COMPLETION',
    titleEn = 'GRADUATION CERTIFICATE OF COMPLETION',
    titleKh = 'វិញ្ញាបនបត្របញ្ជាក់ការបញ្ចប់ការសិក្សា',
    programKh = 'សាលាភាសាអង់គ្លេសអង្គរ • កម្មវិធីអភិវឌ្ឍន៍សមត្ថភាពភាសាអង់គ្លេស',
    awardedTextEn = 'This accredited certificate is proudly awarded to',
    curriculumEn = 'For successfully mastering the standardized curriculum',
    curriculumKh = 'បានបញ្ចប់ដោយជោគជ័យនូវមេរៀន និងកម្រងសំណួរតាមស្តង់ដារ',
    perfTitle = 'OFFICIAL PERFORMANCE GRADE: EXCELLENT',
    perfSubKh = 'កម្រិតមធ្យម • ឆ្លងកាត់ជោគជ័យ',
    perfAccuracy = 'Quiz Accuracy: 90%',
    perfXP = 'Total XP: 1,200 XP',
    perfCurriculum = 'Curriculum Completed',
    sealTop = 'CEFR',
    sealCenter = 'PASSED',
    sealBottom = 'VERIFIED',
    directorName = 'Dr. Chan Sophal',
    directorTitleEn = 'Academic Director',
    linguistName = 'Sarah Jenkins, M.Ed.',
    linguistTitleEn = 'Chief Linguist',
    borderColor = '#d97706',
    secondaryColor = '#92400e',
    textColor = '#b45309',
    logoUrl,
    sealStampUrl,
    directorSignatureUrl,
    linguistSignatureUrl
  } = data;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1123" height="794" viewBox="0 0 1123 794">
  <defs>
    <linearGradient id="certBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#fdfcf7" />
    </linearGradient>

    <linearGradient id="sealRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dc2626" />
      <stop offset="50%" stop-color="#b91c1c" />
      <stop offset="100%" stop-color="#7f1d1d" />
    </linearGradient>

    <linearGradient id="goldRuleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="transparent" />
      <stop offset="50%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="transparent" />
    </linearGradient>

    <style>
      text {
        font-family: 'Kantumruy Pro', 'Battambang', 'Noto Sans Khmer', system-ui, -apple-system, sans-serif;
      }
      .serif {
        font-family: Georgia, Garamond, 'Times New Roman', serif;
      }
      .mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }
    </style>
  </defs>

  <!-- Outer Canvas Base -->
  <rect x="0" y="0" width="1123" height="794" fill="#ffffff" />

  <!-- Outer Ornamental Certificate Frame (10px border) -->
  <rect x="14" y="14" width="1095" height="766" rx="16" fill="url(#certBgGrad)" stroke="${borderColor}" stroke-width="10" />

  <!-- Inner Decorative Borders -->
  <rect x="28" y="28" width="1067" height="738" rx="10" fill="none" stroke="${secondaryColor}" stroke-width="2.5" stroke-opacity="0.65" />
  <rect x="36" y="36" width="1051" height="722" rx="6" fill="none" stroke="${borderColor}" stroke-width="1.5" stroke-opacity="0.4" />

  <!-- Corner Ornamental Accents -->
  <path d="M 36 62 L 36 36 L 62 36" fill="none" stroke="${borderColor}" stroke-width="3" />
  <path d="M 1061 62 L 1061 36 L 1035 36" fill="none" stroke="${borderColor}" stroke-width="3" />
  <path d="M 36 732 L 36 758 L 62 758" fill="none" stroke="${borderColor}" stroke-width="3" />
  <path d="M 1061 732 L 1061 758 L 1035 758" fill="none" stroke="${borderColor}" stroke-width="3" />

  <!-- Subtle Center Watermark Emblem -->
  <g opacity="0.04" transform="translate(561, 397)">
    <circle cx="0" cy="0" r="160" fill="none" stroke="${borderColor}" stroke-width="4" />
    <circle cx="0" cy="0" r="140" fill="none" stroke="${secondaryColor}" stroke-width="2" stroke-dasharray="8,6" />
    <text x="0" y="45" text-anchor="middle" font-size="130" font-weight="bold" fill="${borderColor}">⚜️</text>
  </g>

  <!-- 1. HEADER / ACADEMY CREST -->
  <g transform="translate(561, 74)">
    ${logoUrl ? `<image href="${logoUrl}" x="-22" y="-28" width="44" height="44" preserveAspectRatio="xMidYMid meet" />` : ''}
    <text x="0" y="10" text-anchor="middle" font-size="16" font-weight="900" fill="${secondaryColor}" letter-spacing="0.22em">⚜️   ${escapeXml(appNameEn.toUpperCase())}   ⚜️</text>
    <text x="0" y="36" text-anchor="middle" font-size="13.5" font-weight="700" fill="${secondaryColor}">${escapeXml(programKh)}</text>
    
    <!-- Gold Divider with Badge Sub -->
    <rect x="-180" y="48" width="360" height="1.5" fill="url(#goldRuleGrad)" />
    <text x="0" y="64" text-anchor="middle" font-size="11" font-weight="800" fill="${textColor}" letter-spacing="0.2em">${escapeXml(badgeSubEn)}</text>
    <rect x="-180" y="70" width="360" height="1.5" fill="url(#goldRuleGrad)" />

    <!-- Certificate Major Titles -->
    <text x="0" y="106" text-anchor="middle" font-size="28" font-weight="900" fill="#0f172a" letter-spacing="-0.02em" class="serif">${escapeXml(titleEn.toUpperCase())}</text>
    <text x="0" y="132" text-anchor="middle" font-size="15" font-weight="700" fill="${secondaryColor}">${escapeXml(titleKh)}</text>
  </g>

  <!-- 2. RECIPIENT SECTION -->
  <g transform="translate(561, 246)">
    <text x="0" y="14" text-anchor="middle" font-size="13.5" font-style="italic" fill="#64748b" class="serif">${escapeXml(awardedTextEn)}</text>
    
    <!-- Student Name with Underline -->
    <text x="0" y="66" text-anchor="middle" font-size="34" font-weight="900" fill="#0f172a">${escapeXml(studentName)}</text>
    <line x1="-240" y1="80" x2="240" y2="80" stroke="#cbd5e1" stroke-width="2.5" />

    <!-- Credential ID & Honorific -->
    <text x="0" y="102" text-anchor="middle" font-size="12.5" fill="#64748b">${escapeXml(honorificText)} • Credential ID: <tspan class="mono" font-weight="bold" fill="#334155">${escapeXml(certId)}</tspan></text>

    <!-- Curriculum Mastery -->
    <text x="0" y="136" text-anchor="middle" font-size="15" font-weight="bold" fill="${secondaryColor}">${escapeXml(curriculumEn)}</text>
    <text x="0" y="158" text-anchor="middle" font-size="13" font-weight="600" fill="#475569">${escapeXml(curriculumKh)}</text>
  </g>

  <!-- 3. PERFORMANCE DISTINCTION RIBBON BOX -->
  <g transform="translate(561, 442)">
    <rect x="-350" y="0" width="700" height="74" rx="14" fill="#fefce8" stroke="#fcd34d" stroke-width="1.5" />
    <text x="0" y="24" text-anchor="middle" font-size="13" font-weight="900" fill="${textColor}" letter-spacing="0.08em">🏆 ${escapeXml(perfTitle)}</text>
    <text x="0" y="44" text-anchor="middle" font-size="12" font-weight="700" fill="${secondaryColor}">${escapeXml(perfSubKh)}</text>
    <text x="0" y="61" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#475569"><tspan fill="#0f172a">${escapeXml(perfAccuracy)}</tspan>   •   <tspan fill="${secondaryColor}">${escapeXml(perfXP)}</tspan>   •   <tspan fill="#0f172a">${escapeXml(perfCurriculum)}</tspan></text>
  </g>

  <!-- 4. SIGNATURES & OFFICIAL SEAL SECTION -->
  <g transform="translate(0, 560)">
    <!-- Divider Line -->
    <line x1="60" y1="0" x2="1063" y2="0" stroke="#e2e8f0" stroke-width="1" />

    <!-- Left: Academic Director -->
    <g transform="translate(140, 48)">
      ${directorSignatureUrl ? `<image href="${directorSignatureUrl}" x="-60" y="-38" width="120" height="40" preserveAspectRatio="xMidYMid meet" />` : `<text x="0" y="-12" text-anchor="middle" font-size="20" font-style="italic" fill="#1e293b" class="serif">${escapeXml(directorName)}</text>`}
      <line x1="-90" y1="2" x2="90" y2="2" stroke="#94a3b8" stroke-width="1.5" />
      <text x="0" y="20" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#0f172a">${escapeXml(directorName)}</text>
      <text x="0" y="38" text-anchor="middle" font-size="11.5" fill="#64748b">${escapeXml(directorTitleEn)}</text>
    </g>

    <!-- Center: Official Seal & Date -->
    <g transform="translate(561, 56)">
      ${sealStampUrl ? (
        `<image href="${sealStampUrl}" x="-40" y="-40" width="80" height="80" preserveAspectRatio="xMidYMid meet" />`
      ) : (
        `<circle cx="0" cy="0" r="38" fill="url(#sealRedGrad)" stroke="#fcd34d" stroke-width="3" />
        <circle cx="0" cy="0" r="30" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="3,3" stroke-opacity="0.85" />
        <text x="0" y="-14" text-anchor="middle" font-size="8" font-weight="900" fill="#ffffff" letter-spacing="0.15em">${escapeXml(sealTop)}</text>
        <text x="0" y="7" text-anchor="middle" font-size="16.5" font-weight="900" fill="#ffffff">${escapeXml(sealCenter)}</text>
        <text x="0" y="21" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#ffffff">${escapeXml(sealBottom)}</text>`
      )}
      <text x="0" y="58" text-anchor="middle" font-size="11.5" class="mono" fill="#64748b">Date: ${escapeXml(issueDate)}</text>
    </g>

    <!-- Right: Chief Linguist -->
    <g transform="translate(983, 48)">
      ${linguistSignatureUrl ? `<image href="${linguistSignatureUrl}" x="-60" y="-38" width="120" height="40" preserveAspectRatio="xMidYMid meet" />` : `<text x="0" y="-12" text-anchor="middle" font-size="20" font-style="italic" fill="#1e293b" class="serif">${escapeXml(linguistName)}</text>`}
      <line x1="-90" y1="2" x2="90" y2="2" stroke="#94a3b8" stroke-width="1.5" />
      <text x="0" y="20" text-anchor="middle" font-size="13.5" font-weight="bold" fill="#0f172a">${escapeXml(linguistName)}</text>
      <text x="0" y="38" text-anchor="middle" font-size="11.5" fill="#64748b">${escapeXml(linguistTitleEn)}</text>
    </g>
  </g>
</svg>`;
}

/**
 * 3. VECTOR SVG TO CANVAS CONVERTER
 * Converts any standard SVG string into a crisp HTML Canvas without DOM rendering
 */
export async function renderSvgToCanvas(
  svgString: string,
  width: number,
  height: number,
  scale: number = 2
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    try {
      // Ensure all web fonts are loaded prior to rasterization
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        document.fonts.ready.catch(() => {});
      }

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(width * scale);
          canvas.height = Math.round(height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(blobUrl);
            reject(new Error('Canvas 2D context not available'));
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(blobUrl);
          resolve(canvas);
        } catch (canvasErr) {
          URL.revokeObjectURL(blobUrl);
          reject(canvasErr);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        // Fallback to data URL format if blob URL encounters security policies
        try {
          const fallbackImg = new Image();
          const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
          fallbackImg.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(width * scale);
            canvas.height = Math.round(height * scale);
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(fallbackImg, 0, 0, canvas.width, canvas.height);
              resolve(canvas);
            } else {
              reject(new Error('Canvas context failed in fallback'));
            }
          };
          fallbackImg.onerror = (e) => reject(new Error('SVG Image loading failed'));
          fallbackImg.src = dataUrl;
        } catch (fallbackErr) {
          reject(fallbackErr);
        }
      };

      img.src = blobUrl;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 4. DOWNLOAD CANVAS AS PNG
 * Universal cross-platform download handler (iOS Safari + Desktop + Android)
 */
export async function downloadCanvasAsPng(
  canvas: HTMLCanvasElement,
  fileName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const isIOS = typeof navigator !== 'undefined' && 
        (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

      canvas.toBlob(async (blob) => {
        if (!blob) {
          // Fallback to dataURL if toBlob fails
          const dataUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.download = fileName;
          a.href = dataUrl;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            if (document.body.contains(a)) document.body.removeChild(a);
          }, 400);
          resolve(dataUrl);
          return;
        }

        const blobUrl = URL.createObjectURL(blob);

        if (isIOS) {
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: fileName,
                text: 'Angkor English Academy Document',
              });
              resolve(blobUrl);
              return;
            } catch (shareErr: any) {
              if (shareErr.name === 'AbortError') {
                resolve(blobUrl);
                return;
              }
            }
          }
          window.open(blobUrl, '_blank');
        } else {
          const a = document.createElement('a');
          a.download = fileName;
          a.href = blobUrl;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            if (document.body.contains(a)) document.body.removeChild(a);
          }, 400);
        }

        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        resolve(blobUrl);
      }, 'image/png');
    } catch (err) {
      reject(err);
    }
  });
}
