import React from 'react';
import { 
  Landmark, 
  GraduationCap, 
  BookOpen, 
  Globe, 
  ShieldCheck, 
  Crown, 
  Sparkles 
} from 'lucide-react';
import { AppBrandConfig, AppLogoIconKey } from '../types';

interface BrandLogoProps {
  brand?: AppBrandConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brand,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  }[size];

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }[size];

  if (brand && brand.logoType === 'image' && brand.logoImageUrl) {
    return (
      <img
        src={brand.logoImageUrl}
        alt={brand.appName || 'Logo'}
        className={`${sizeClasses} rounded-xl object-contain border border-slate-200 bg-white shadow-xs ${className}`}
        onError={(e) => {
          // Fallback to temple icon if image fails to load
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  if (brand && brand.logoType === 'emoji' && brand.logoEmoji) {
    return (
      <div 
        className={`${sizeClasses} rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-xs select-none ${className}`}
      >
        <span className="text-base sm:text-lg">{brand.logoEmoji}</span>
      </div>
    );
  }

  // Render SVG Lucide icon
  const renderIcon = (key: AppLogoIconKey) => {
    switch (key) {
      case 'graduation':
        return <GraduationCap className={iconSize} />;
      case 'book':
        return <BookOpen className={iconSize} />;
      case 'globe':
        return <Globe className={iconSize} />;
      case 'shield':
        return <ShieldCheck className={iconSize} />;
      case 'crown':
        return <Crown className={iconSize} />;
      case 'sparkles':
        return <Sparkles className={iconSize} />;
      case 'temple':
      default:
        return <Landmark className={iconSize} />;
    }
  };

  return (
    <div 
      className={`${sizeClasses} rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] text-white flex items-center justify-center shadow-xs select-none ${className}`}
    >
      <span className="font-serif font-bold leading-none text-white text-base sm:text-lg">π</span>
    </div>
  );
};
