import messagesEn from './messages.en.json';
import messagesEs from './messages.es.json';

export const AUTH_LOCALES = ['es', 'en'] as const;

export type AuthLocale = (typeof AUTH_LOCALES)[number];

export interface AuthMessagesFile {
  locale: string;
  translations: Record<string, string>;
}

const MESSAGES: Record<string, AuthMessagesFile> = {
  en: messagesEn as AuthMessagesFile,
  es: messagesEs as AuthMessagesFile,
};

/**
 * Loads auth translation messages for the given locale.
 * Falls back to English when the locale is not available.
 * The app consumer must merge the result into `loadTranslations()` before bootstrap.
 */
export const loadAuthMessages = async (locale: string): Promise<AuthMessagesFile> => {
  return MESSAGES[locale] ?? messagesEn as AuthMessagesFile;
};
