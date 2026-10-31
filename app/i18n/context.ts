import { createContext } from "react";
import type { TranslationVars } from "./resolve";
import type { Language } from "./types";

export interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  /** Translate a key to a string, with optional `{{var}}` interpolation. */
  t: (key: string, vars?: TranslationVars) => string;
  /** Translate a key that holds a list of strings (paragraphs, bullets). */
  tList: (key: string, vars?: TranslationVars) => string[];
}

/**
 * Kept apart from the provider, which imports the dictionaries: editing a
 * locale reloads that module in development, and a context recreated with it
 * would no longer match the provider already on the page.
 */
export const I18nContext = createContext<I18nContextValue | null>(null);
