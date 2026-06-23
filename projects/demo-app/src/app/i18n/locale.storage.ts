export const LOCALE_STORAGE_KEY = 'demo-app-locale';

export const DEFAULT_LOCALE = 'en';

export const DEMO_LOCALES = ['es', 'en'] as const;

export const getStoredLocale = (): string => {
  return localStorage.getItem(LOCALE_STORAGE_KEY) ?? DEFAULT_LOCALE;
};

export const setStoredLocale = (locale: string): void => {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  window.location.reload();
};
