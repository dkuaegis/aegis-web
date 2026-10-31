import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ko } from "./locales/ko";
import { type TranslationVars, translate, translateList } from "./resolve";
import {
  getDictionary,
  getLanguage,
  initLanguage,
  setLanguage as setStoreLanguage,
  subscribeToLanguage,
} from "./store";
import { DEFAULT_LANGUAGE, type Language } from "./types";

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  /** Translate a key to a string, with optional `{{var}}` interpolation. */
  t: (key: string, vars?: TranslationVars) => string;
  /** Translate a key that holds a list of strings (paragraphs, bullets). */
  tList: (key: string, vars?: TranslationVars) => string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  // Detection runs in an effect so the first client render matches the
  // prerendered markup, then settles on the stored preference immediately.
  useEffect(() => {
    setLanguageState(initLanguage());
    return subscribeToLanguage(() => setLanguageState(getLanguage()));
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setStoreLanguage(next);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const dictionary = getDictionary(language);

    return {
      language,
      setLanguage,
      toggleLanguage: () => setLanguage(language === "ko" ? "en" : "ko"),
      t: (key, vars) => translate(dictionary, ko, key, vars),
      tList: (key, vars) => translateList(dictionary, ko, key, vars),
    };
  }, [language, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside an I18nProvider");
  }

  return context;
}
