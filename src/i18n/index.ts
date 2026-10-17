import { getLocales } from 'expo-localization';

import { he, type TranslationKeys } from '@/i18n/locales/he';

const translations = {
  he,
} as const;

export type AppLocale = keyof typeof translations;

const HEBREW_LOCALE: AppLocale = 'he';

/** Hebrew-first: default to Hebrew; extend with more locales later. */
export function getAppLocale(): AppLocale {
  const languageCode = getLocales()[0]?.languageCode;
  if (languageCode && languageCode in translations) {
    return languageCode as AppLocale;
  }
  return HEBREW_LOCALE;
}

export function getStrings(): TranslationKeys {
  return translations[getAppLocale()];
}
