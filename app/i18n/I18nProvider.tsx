import { useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { I18nContext, type I18nContextValue } from "./context";
import { ko } from "./locales/ko";
import { translate, translateList } from "./resolve";
import {
  getDictionary,
  getLanguage,
  initLanguage,
  revealLanguage,
  setLanguage,
  subscribeToLanguage,
} from "./store";
import { DEFAULT_LANGUAGE, type Language } from "./types";

/** The selected language; the prerendered markup is always the default. */
export function useLanguage(): Language {
  return useSyncExternalStore(
    subscribeToLanguage,
    getLanguage,
    () => DEFAULT_LANGUAGE
  );
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const language = useLanguage();

  // Detection runs in an effect so the first client render matches the
  // prerendered markup, then settles on the stored preference immediately.
  useEffect(initLanguage, []);

  // Runs after the effect above, so on the first pass it still sees the
  // prerendered Korean and waits for the re-render in the detected language.
  useEffect(() => {
    if (language === getLanguage()) revealLanguage();
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    const dictionary = getDictionary(language);

    return {
      language,
      setLanguage,
      t: (key, vars) => translate(dictionary, ko, key, vars),
      tList: (key, vars) => translateList(dictionary, ko, key, vars),
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside an I18nProvider");
  }

  return context;
}
