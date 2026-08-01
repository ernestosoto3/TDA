import { esPR } from './locales/es-PR';

export const defaultLocale = 'es-PR' as const;
export const fallbackLocale = defaultLocale;

export const localizationResources = {
  [defaultLocale]: {
    translation: esPR,
  },
} as const;

export { esPR };
export { requiredTranslationKeys } from './required-translation-keys';
export { findMissingTranslationKeys } from './translation-utils';
