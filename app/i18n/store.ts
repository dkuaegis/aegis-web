import { en } from "./locales/en";
import { ko } from "./locales/ko";
import { translate, translateList, type TranslationVars } from "./resolve";
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  LANGUAGE_HTML_LANG,
  LANGUAGE_STORAGE_KEY,
  type Dictionary,
  type Language,
} from "./types";

const DICTIONARIES: Record<Language, Dictionary> = { ko, en };

/**
 * The selected language lives in a tiny module-level store rather than only in
 * React state, because a fair amount of copy is produced outside the component
 * tree: zod validation messages, API error mapping, toast helpers. Those call
 * `t()` from this module; the provider keeps this store and React in sync.
 */
let currentLanguage: Language = DEFAULT_LANGUAGE;

const listeners = new Set<() => void>();

function detectInitialLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
    // Private mode or blocked storage: fall through to browser detection.
  }

  // First visit: a browser that is not asking for Korean is most likely an
  // international visitor, so start them in English. Their first explicit
  // choice is remembered from then on.
  const preferred = window.navigator.languages?.[0] ?? window.navigator.language;
  if (preferred && !preferred.toLowerCase().startsWith("ko")) return "en";

  return DEFAULT_LANGUAGE;
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function getDictionary(language: Language = currentLanguage): Dictionary {
  return DICTIONARIES[language];
}

export function setLanguage(language: Language) {
  if (language === currentLanguage) return;

  currentLanguage = language;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Preference simply will not persist; the session still works.
    }
    document.documentElement.lang = LANGUAGE_HTML_LANG[language];
  }

  for (const listener of listeners) listener();
}

/** Called once by the provider so detection does not run during module import. */
export function initLanguage(): Language {
  const detected = detectInitialLanguage();
  currentLanguage = detected;

  if (typeof document !== "undefined") {
    document.documentElement.lang = LANGUAGE_HTML_LANG[detected];
  }

  return detected;
}

export function subscribeToLanguage(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Translate outside of React. Inside components prefer `useI18n()`, which
 * re-renders on change; this reads the language at call time, so it is meant
 * for values produced on demand (validation, error mapping, toasts).
 */
export function t(key: string, vars?: TranslationVars): string {
  return translate(getDictionary(), ko, key, vars);
}

export function tList(key: string, vars?: TranslationVars): string[] {
  return translateList(getDictionary(), ko, key, vars);
}
