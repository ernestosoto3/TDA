import { defaultLocale, fallbackLocale, localizationResources } from '@tda/localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    lng: defaultLocale,
    fallbackLng: fallbackLocale,
    supportedLngs: [defaultLocale],
    resources: localizationResources,

    interpolation: {
      escapeValue: false,
    },

    initAsync: false,
    returnNull: false,
    returnEmptyString: false,
    parseMissingKeyHandler: (key) => key,
  });
}

export default i18n;
