import { AppBrandConfig } from '../types';

const BRAND_STORAGE_KEY = 'aea_brand_config_v1';

export const DEFAULT_BRAND_CONFIG: AppBrandConfig = {
  appName: 'Angkor English Academy',
  appNameKh: 'បណ្ឌិតសភាភាសាអង់គ្លេសអង្គរ',
  taglineEn: 'Learn English Confidently with Khmer Explanations',
  taglineKh: 'រៀនភាសាអង់គ្លេសប្រកបដោយទំនុកចិត្ត',
  logoType: 'icon',
  logoIconName: 'temple',
  logoEmoji: '🇰🇭',
  logoImageUrl: '',
};

export function loadBrandConfig(): AppBrandConfig {
  if (typeof window === 'undefined') return DEFAULT_BRAND_CONFIG;
  try {
    const stored = localStorage.getItem(BRAND_STORAGE_KEY);
    if (!stored) return DEFAULT_BRAND_CONFIG;
    return { ...DEFAULT_BRAND_CONFIG, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_BRAND_CONFIG;
  }
}

export function saveBrandConfig(config: AppBrandConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save brand config', e);
  }
}
