import React, { useId } from 'react';

interface AngkorLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  id?: string;
  titleEn?: string;
  subtitleEn?: string;
}

export const AngkorLogo: React.FC<AngkorLogoProps> = ({
  className = 'h-10 sm:h-12 w-auto',
  width,
  height,
  id = 'angkor-english-header-logo',
  titleEn = 'Angkor English',
  subtitleEn = 'Learn & Grow Together *',
}) => {
  const instanceId = useId().replace(/:/g, '_');
  const rainbowRingId = `rainbowRing_${instanceId}`;
  const badgeGradId = `badgeGrad_${instanceId}`;
  const glowFilterId = `glowFilter_${instanceId}`;
  const textShadowFilterId = `textShadow_${instanceId}`;

  return (
    <svg 
      id={id}
      width={width || 230} 
      height={height || 48} 
      viewBox="0 0 230 48" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none transition-transform hover:scale-[1.02] duration-200`}
      aria-label={`${titleEn} - ${subtitleEn}`}
    >
      <defs>
        {/* 7-Color Rainbow Gradient for Enclosing Ring */}
        <linearGradient id={rainbowRingId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0000" />
          <stop offset="16%" stopColor="#ff7300" />
          <stop offset="33%" stopColor="#fffb00" />
          <stop offset="50%" stopColor="#48ff00" />
          <stop offset="66%" stopColor="#00ffd5" />
          <stop offset="83%" stopColor="#002bfb" />
          <stop offset="100%" stopColor="#7a00ff" />
        </linearGradient>

        {/* Deep indigo/purple-to-pink gradient: from-indigo-700 via-purple-600 to-pink-500 */}
        <linearGradient id={badgeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="50%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>

        {/* Soft Glowing Aura: shadow-[0_0_12px_rgba(168,85,247,0.35)] */}
        <filter id={glowFilterId} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#a855f7" floodOpacity="0.35" />
        </filter>

        {/* Drop shadow on bold white π */}
        <filter id={textShadowFilterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* 1. CONTAINER: Clean white background (bg-white rounded-2xl px-3.5 py-1.5 border border-slate-200/80 shadow-sm) */}
      <rect 
        x="1.5" 
        y="1.5" 
        width="227" 
        height="45" 
        rx="16" 
        fill="#ffffff" 
        stroke="#e2e8f0" 
        strokeOpacity="0.8"
        strokeWidth="1.5"
      />

      {/* 2. DISTINCT APP ICON FOR 'π':
          - Shape: Premium squircle shape (w-9 h-9 rounded-[14px])
          - Background: Deep indigo/purple-to-pink gradient
          - Inner Icon: Bold white 'π' symbol with slight drop shadow
          - Enclosing 7-color rainbow rotating border with soft glowing aura */}
      <g transform="translate(8, 6)" filter={`url(#${glowFilterId})`}>
        {/* Enclosing 7-Color Rainbow Ring */}
        <rect 
          x="0" 
          y="0" 
          width="36" 
          height="36" 
          rx="16" 
          fill="none" 
          stroke={`url(#${rainbowRingId})`} 
          strokeWidth="2.5" 
        />

        {/* Squircle Badge */}
        <rect 
          x="2" 
          y="2" 
          width="32" 
          height="32" 
          rx="12" 
          fill={`url(#${badgeGradId})`} 
        />

        {/* Bold white 'π' symbol with slight drop shadow */}
        <text 
          x="18" 
          y="24" 
          fontFamily="Georgia, 'Times New Roman', serif" 
          fontSize="20" 
          fill="#ffffff" 
          textAnchor="middle" 
          fontWeight="bold"
          filter={`url(#${textShadowFilterId})`}
        >
          π
        </text>
      </g>

      {/* 3. TYPOGRAPHY:
          - "Angkor English" (Bold title) + "Learn & Grow Together *" (Subtitle) */}
      <g transform="translate(54, 0)">
        <text 
          x="0" 
          y="22" 
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" 
          fontSize="14" 
          fontWeight="700" 
          fill="#0f172a"
          letterSpacing="-0.02em"
        >
          {titleEn}
        </text>
        <text 
          x="0" 
          y="35" 
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" 
          fontSize="10" 
          fontWeight="500" 
          fill="#64748b"
          letterSpacing="-0.01em"
        >
          {subtitleEn}
        </text>
      </g>
    </svg>
  );
};

export default AngkorLogo;
