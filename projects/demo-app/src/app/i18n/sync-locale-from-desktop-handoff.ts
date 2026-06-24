import { DEMO_LOCALES, LOCALE_STORAGE_KEY } from './locale.storage';

const LOCALE_ALIASES: Record<string, string> = {
  'en-us': 'en',
  en: 'en',
  es: 'es',
};

export const matchLocale = (localeParam: string): string | null => {
  const normalized = localeParam.trim().toLowerCase();
  const mapped = LOCALE_ALIASES[normalized] ?? normalized;

  return DEMO_LOCALES.includes(mapped as (typeof DEMO_LOCALES)[number]) ? mapped : null;
};

export const syncLocaleFromDesktopHandoff = (): void => {
  const params = new URLSearchParams(window.location.search);

  if (params.get('desktop') !== 'true') {
    return;
  }

  const localeParam = params.get('locale');

  if (!localeParam) {
    return;
  }

  const match = matchLocale(localeParam);

  if (!match) {
    return;
  }

  localStorage.setItem(LOCALE_STORAGE_KEY, match);

  params.delete('locale');
  const newSearch = params.toString();
  const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}${window.location.hash}`;
  history.replaceState(null, '', newUrl);
};
