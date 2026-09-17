import React from 'react';

export type NavFeatureIconType = 'lessons' | 'quiz' | 'flashcards' | 'dictionary' | 'analytics' | 'achievements' | 'tenses';

interface NavFeatureIconProps {
  type: NavFeatureIconType;
  className?: string;
  active?: boolean;
  size?: number;
}

/**
 * Custom, modern, high-quality SVG gradient icons for Angkor English top header navigation menu.
 * Designed with multi-stop linear & radial gradients, crisp vector geometry, and luminous accent highlights.
 */
export const NavFeatureIcon: React.FC<NavFeatureIconProps> = ({
  type,
  className = 'w-5 h-5',
  active = false,
  size = 20,
}) => {
  switch (type) {
    case 'lessons':
      // Vibrant Indigo/Violet Gradient Knowledge Tome with Rose Bookmark & Golden Sparkle
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} shrink-0 transition-transform duration-200 ${active ? 'scale-110 drop-shadow-[0_2px_6px_rgba(99,102,241,0.45)]' : 'group-hover:scale-110'}`}
        >
          <defs>
            <linearGradient id="ae-grad-book-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="ae-grad-book-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="ae-grad-book-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
            <linearGradient id="ae-grad-book-sparkle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Left Page Wing with Gradient */}
          <path
            d="M3 6.5C3 5.12 4.12 4 5.5 4H10C11.1 4 12 4.9 12 6V18.5C12 17.67 11.33 17 10.5 17H5.5C4.12 17 3 17.9 3 19V6.5Z"
            fill="url(#ae-grad-book-left)"
            fillOpacity={active ? "0.95" : "0.75"}
          />

          {/* Right Page Wing with Gradient */}
          <path
            d="M21 6.5C21 5.12 19.88 4 18.5 4H14C12.9 4 12 4.9 12 6V18.5C12 17.67 12.67 17 13.5 17H18.5C19.88 17 21 17.9 21 19V6.5Z"
            fill="url(#ae-grad-book-right)"
            fillOpacity={active ? "0.95" : "0.75"}
          />

          {/* Crisp Book Outer Contours */}
          <path
            d="M12 6V19.5M12 6C11.1 5.06 9.87 4.5 8.5 4.5H4C3.45 4.5 3 4.95 3 5.5V18.5C3 19.33 3.67 20 4.5 20H8.5C10.02 20 11.32 20.73 12 21.84M12 6C12.9 5.06 14.13 4.5 15.5 4.5H20C20.55 4.5 21 4.95 21 5.5V18.5C21 19.33 20.33 20 19.5 20H15.5C13.98 20 12.68 20.73 12 21.84"
            stroke={active ? "#312e81" : "#4338ca"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Golden/Rose Bookmark Ribbon */}
          <path
            d="M8.5 4.5V11.5L10.25 10L12 11.5V4.5"
            fill="url(#ae-grad-book-ribbon)"
            stroke="#e11d48"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Radiant Learning Sparkle on top-right corner */}
          <path
            d="M19 2L19.5 3.5L21 4L19.5 4.5L19 6L18.5 4.5L17 4L18.5 3.5L19 2Z"
            fill="url(#ae-grad-book-sparkle)"
          />
        </svg>
      );

    case 'quiz':
      // Vibrant Fuchsia/Purple Gradient Bullseye Target with Glowing Energy Sparks
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} shrink-0 transition-transform duration-200 ${active ? 'scale-110 drop-shadow-[0_2px_6px_rgba(236,72,153,0.45)]' : 'group-hover:scale-110'}`}
        >
          <defs>
            <linearGradient id="ae-grad-quiz-outer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="ae-grad-quiz-core" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <linearGradient id="ae-grad-quiz-accent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Outer Ring with Gradient Fill & Border */}
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="url(#ae-grad-quiz-outer)"
            fillOpacity={active ? "0.22" : "0.14"}
            stroke="url(#ae-grad-quiz-outer)"
            strokeWidth="1.9"
          />

          {/* Middle Dashed Precision Ring */}
          <circle
            cx="12"
            cy="12"
            r="5.75"
            stroke="#a855f7"
            strokeWidth="1.6"
            strokeDasharray="2.5 1.5"
          />

          {/* Center Target Bullseye Core */}
          <circle
            cx="12"
            cy="12"
            r="3"
            fill="url(#ae-grad-quiz-core)"
            stroke="#ffffff"
            strokeWidth="1"
          />

          {/* Crosshairs */}
          <path
            d="M12 2V4.5M12 19.5V22M2 12H4.5M19.5 12H22"
            stroke="#7c3aed"
            strokeWidth="1.9"
            strokeLinecap="round"
          />

          {/* Energy Spark Badge */}
          <path
            d="M17.5 5L18 6.5L19.5 7L18 7.5L17.5 9L17 7.5L15.5 7L17 6.5L17.5 5Z"
            fill="url(#ae-grad-quiz-accent)"
          />
        </svg>
      );

    case 'flashcards':
      // Vibrant Emerald/Teal Gradient Layered Flashcards with Gold Star
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} shrink-0 transition-transform duration-200 ${active ? 'scale-110 drop-shadow-[0_2px_6px_rgba(16,185,129,0.45)]' : 'group-hover:scale-110'}`}
        >
          <defs>
            <linearGradient id="ae-grad-cards-back" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id="ae-grad-cards-front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="ae-grad-cards-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Back Card (Rotated Angle) */}
          <rect
            x="6"
            y="2.5"
            width="15"
            height="15"
            rx="3.5"
            fill="url(#ae-grad-cards-back)"
            fillOpacity={active ? "0.38" : "0.22"}
            stroke="url(#ae-grad-cards-back)"
            strokeWidth="1.6"
            transform="rotate(6 13.5 10)"
          />

          {/* Front Active Card */}
          <rect
            x="3"
            y="5.5"
            width="15"
            height="15"
            rx="3.5"
            fill={active ? "#ecfdf5" : "#ffffff"}
            stroke="url(#ae-grad-cards-front)"
            strokeWidth="1.9"
          />

          {/* Vocabulary Lines on Card */}
          <path
            d="M6.5 9.5H12.5M6.5 12.5H10.5"
            stroke="#047857"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Active Memory Star Badge */}
          <circle
            cx="14.5"
            cy="16"
            r="2.6"
            fill="url(#ae-grad-cards-gold)"
            stroke="#ffffff"
            strokeWidth="0.8"
          />
          <path
            d="M14.5 14.8L14.9 15.6L15.8 15.7L15.1 16.3L15.3 17.2L14.5 16.7L13.7 17.2L13.9 16.3L13.2 15.7L14.1 15.6L14.5 14.8Z"
            fill="#ffffff"
          />
        </svg>
      );

    case 'dictionary':
      // Vibrant Amber/Orange Gradient Lexicon Book with Lens & 'A' Monogram
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} shrink-0 transition-transform duration-200 ${active ? 'scale-110 drop-shadow-[0_2px_6px_rgba(245,158,11,0.45)]' : 'group-hover:scale-110'}`}
        >
          <defs>
            <linearGradient id="ae-grad-dict-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="ae-grad-dict-lens" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          {/* Lexicon Hardcover Body */}
          <path
            d="M4.5 4C4.5 2.9 5.4 2 6.5 2H18C19.1 2 20 2.9 20 4V19C20 20.1 19.1 21 18 21H6.5C5.4 21 4.5 20.1 4.5 19V4Z"
            fill="url(#ae-grad-dict-body)"
            fillOpacity={active ? "0.32" : "0.2"}
            stroke="url(#ae-grad-dict-body)"
            strokeWidth="1.9"
          />

          {/* Spine Accent Line */}
          <path
            d="M8 2V21"
            stroke="#b45309"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Classic 'A' Letter Monogram */}
          <path
            d="M12.5 12.5L14.5 7.5L16.5 12.5M13.2 11.2H15.8"
            stroke="#92400e"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Search Lens Badge on bottom-right */}
          <circle
            cx="16.5"
            cy="16.5"
            r="3.2"
            fill="#ffffff"
            stroke="url(#ae-grad-dict-lens)"
            strokeWidth="1.7"
          />
          <path
            d="M18.8 18.8L21.2 21.2"
            stroke="url(#ae-grad-dict-lens)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'analytics':
      // Vibrant Electric Blue/Cyan Growth Chart with Upward Trend Arrow
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} shrink-0 transition-transform duration-200 ${active ? 'scale-110 drop-shadow-[0_2px_6px_rgba(59,130,246,0.45)]' : 'group-hover:scale-110'}`}
        >
          <defs>
            <linearGradient id="ae-grad-ana-bar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="ae-grad-ana-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="ae-grad-ana-node" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* Gradient Metric Columns */}
          <rect
            x="4"
            y="13"
            width="3.5"
            height="7"
            rx="1.2"
            fill="url(#ae-grad-ana-bar)"
            fillOpacity={active ? "0.85" : "0.55"}
          />
          <rect
            x="9.5"
            y="9"
            width="3.5"
            height="11"
            rx="1.2"
            fill="url(#ae-grad-ana-bar)"
            fillOpacity={active ? "0.9" : "0.65"}
          />
          <rect
            x="15"
            y="5"
            width="3.5"
            height="15"
            rx="1.2"
            fill="url(#ae-grad-ana-bar)"
            fillOpacity={active ? "0.95" : "0.75"}
          />

          {/* Baseline Axis */}
          <path
            d="M2.5 20.5H21.5"
            stroke="#1d4ed8"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Upward Trajectory Curve Arrow */}
          <path
            d="M4 12L9.5 8L14 10.5L19.5 4"
            stroke="url(#ae-grad-ana-line)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing Target Node */}
          <circle
            cx="19.5"
            cy="4"
            r="2.5"
            fill="url(#ae-grad-ana-node)"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
        </svg>
      );

    case 'achievements':
      // Vibrant Gold/Amber Laurel Championship Trophy with Radiant Diamond Star
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} shrink-0 transition-transform duration-200 ${active ? 'scale-110 drop-shadow-[0_2px_6px_rgba(245,158,11,0.55)]' : 'group-hover:scale-110'}`}
        >
          <defs>
            <linearGradient id="ae-grad-trophy-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="ae-grad-trophy-star" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
          </defs>

          {/* Trophy Cup Body with Gold Gradient */}
          <path
            d="M6 4H18V9C18 12.31 15.31 15 12 15C8.69 15 6 12.31 6 9V4Z"
            fill="url(#ae-grad-trophy-gold)"
            fillOpacity={active ? "0.95" : "0.75"}
            stroke="#b45309"
            strokeWidth="1.8"
          />

          {/* Handles */}
          <path
            d="M6 6H3.5C2.67 6 2 6.67 2 7.5V8.5C2 10.43 3.57 12 5.5 12H6M18 6H20.5C21.33 6 22 6.67 22 7.5V8.5C22 10.43 20.43 12 18.5 12H18"
            stroke="#b45309"
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          {/* Stem & Pedestal */}
          <path
            d="M12 15V19M8 20H16"
            stroke="#b45309"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Radiant Star in Center of Trophy */}
          <path
            d="M12 6.5L12.8 8.2L14.6 8.3L13.2 9.5L13.7 11.2L12 10.1L10.3 11.2L10.8 9.5L9.4 8.3L11.2 8.2L12 6.5Z"
            fill="url(#ae-grad-trophy-star)"
            stroke="#d97706"
            strokeWidth="0.6"
          />
        </svg>
      );

    case 'tenses':
      // Vibrant Purple/Fuchsia Hourglass with Flowing Sands of Time
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} shrink-0 transition-transform duration-200 ${active ? 'scale-110 drop-shadow-[0_2px_6px_rgba(139,92,246,0.45)]' : 'group-hover:scale-110'}`}
        >
          <defs>
            <linearGradient id="ae-grad-tense-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <linearGradient id="ae-grad-tense-sand" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Hourglass Outer Frame */}
          <path
            d="M6 3H18M6 21H18M7 3V7.5L10.5 11L7 14.5V21M17 3V7.5L13.5 11L17 14.5V21"
            stroke="url(#ae-grad-tense-glass)"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Flowing Sand Particles */}
          <path
            d="M8.5 18.5H15.5L13.5 15.5H10.5L8.5 18.5Z"
            fill="url(#ae-grad-tense-sand)"
          />
          <circle cx="12" cy="13.5" r="0.8" fill="#f59e0b" />
          <circle cx="12" cy="11.5" r="0.8" fill="#f59e0b" />
        </svg>
      );

    default:
      return null;
  }
};
