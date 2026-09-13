export const LANGUAGES = ["ko", "en"] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "ko";

export const LANGUAGE_STORAGE_KEY = "aegis.language";

/** Label shown on the toggle for each language, in that language. */
export const LANGUAGE_LABELS: Record<Language, string> = {
  ko: "KO",
  en: "EN",
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  ko: "한국어",
  en: "English",
};

/** BCP 47 tag written to <html lang> so screen readers pick the right voice. */
export const LANGUAGE_HTML_LANG: Record<Language, string> = {
  ko: "ko",
  en: "en",
};

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && LANGUAGES.includes(value as Language);
}

/**
 * A dictionary is an arbitrarily nested tree of strings or string lists. Lists
 * are used for paragraph and bullet copy so a block of prose stays together in
 * one place instead of being split across numbered keys.
 *
 * Everything is `readonly` because the locale files are declared `as const`,
 * which both freezes them and lets editors autocomplete real keys.
 */
export type DictionaryValue =
  | string
  | readonly string[]
  | Dictionary;

export interface Dictionary {
  readonly [key: string]: DictionaryValue;
}
