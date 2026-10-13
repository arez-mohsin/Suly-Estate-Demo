import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './resources/en.js';
import { ckb } from './resources/ckb.js';
import { ar } from './resources/ar.js';

export const LANGUAGE_STORAGE_KEY = 'suly-estates-language';
export const SUPPORTED_LANGUAGES = ['en', 'ckb', 'ar'];
export const DEFAULT_LANGUAGE = 'en';

export const LANGUAGE_CONFIG = {
  en: {
    code: 'en',
    dir: 'ltr',
    name: 'English',
    shortLabel: 'EN',
  },
  ckb: {
    code: 'ckb',
    dir: 'rtl',
    name: 'کوردی',
    shortLabel: 'کوردی',
  },
  ar: {
    code: 'ar',
    dir: 'rtl',
    name: 'العربية',
    shortLabel: 'العربية',
  },
};

// Language resolution: Saved valid preference or default to English (never auto-switch based on browser locale alone)
export function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_LANGUAGE;
}

export function updateDocumentDirectionAndLang(lng) {
  const config = LANGUAGE_CONFIG[lng] || LANGUAGE_CONFIG.en;
  const root = document.documentElement;
  root.setAttribute('lang', config.code);
  root.setAttribute('dir', config.dir);
  root.setAttribute('data-locale', config.code);

  // Set default document title if currently on generic title
  const currentTitle = i18n.t('meta.titleDefault');
  if (currentTitle) {
    document.title = currentTitle;
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ckb: { translation: ckb },
      ar: { translation: ar },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: false,
    },
  });

// Apply document attributes on initialization
updateDocumentDirectionAndLang(i18n.language);

// Apply document attributes whenever language changes
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  } catch {
    // Ignore storage errors
  }
  updateDocumentDirectionAndLang(lng);
});

export default i18n;
