import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRevalidator } from "react-router";
import { I18nContext, type I18nContextValue } from "./context";
import { ko } from "./locales/ko";
import { translate, translateList } from "./resolve";
import {
  getDictionary,
  getLanguage,
  initLanguage,
  setLanguage as setStoreLanguage,
  subscribeToLanguage,
} from "./store";
import { DEFAULT_LANGUAGE, type Language } from "./types";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const { revalidate } = useRevalidator();

  // Detection runs in an effect so the first client render matches the
  // prerendered markup, then settles on the stored preference immediately.
  // Route `meta` (the page title) is only recomputed when the router state
  // changes, so it is nudged whenever the language moves.
  useEffect(() => {
    const detected = initLanguage();
    setLanguageState(detected);
    if (detected !== DEFAULT_LANGUAGE) void revalidate();
    return subscribeToLanguage(() => {
      setLanguageState(getLanguage());
      void revalidate();
    });
  }, [revalidate]);

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
