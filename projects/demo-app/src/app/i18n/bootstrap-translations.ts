import { loadTranslations } from '@angular/localize';
import { loadAuthMessages } from '@dotted-labs/ngx-supabase-auth/i18n';
import { DEFAULT_LOCALE, getStoredLocale } from './locale.storage';

export const bootstrapTranslations = async (): Promise<string> => {
  const locale = getStoredLocale();

  try {
    const authMessages = await loadAuthMessages(locale);
    loadTranslations(authMessages.translations);
  } catch (error) {
    console.warn('[demo-app] Failed to load auth translations, falling back to English.', error);
    const fallbackMessages = await loadAuthMessages(DEFAULT_LOCALE);
    loadTranslations(fallbackMessages.translations);
  }

  return locale;
};
