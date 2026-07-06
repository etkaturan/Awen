import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AppLanguage, LearningLanguage, Translation } from "../i18n/translations";
import { TRANSLATIONS, t } from "../i18n/translations";

interface LanguageContextType {
  appLang: AppLanguage;
  learnLang: LearningLanguage;
  setAppLang: (l: AppLanguage) => void;
  setLearnLang: (l: LearningLanguage) => void;
  t: (key: keyof Translation) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  appLang: "en",
  learnLang: "de",
  setAppLang: () => {},
  setLearnLang: () => {},
  t: (key) => TRANSLATIONS["en"][key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [appLang, setAppLangState] = useState<AppLanguage>(
    () => (localStorage.getItem("awen_app_lang") as AppLanguage) || "en"
  );
  const [learnLang, setLearnLangState] = useState<LearningLanguage>(
    () => (localStorage.getItem("awen_learn_lang") as LearningLanguage) || "de"
  );

  const setAppLang = (l: AppLanguage) => {
    localStorage.setItem("awen_app_lang", l);
    setAppLangState(l);
  };

  const setLearnLang = (l: LearningLanguage) => {
    localStorage.setItem("awen_learn_lang", l);
    setLearnLangState(l);
  };

  return (
    <LanguageContext.Provider value={{
      appLang, learnLang, setAppLang, setLearnLang,
      t: (key) => t(appLang, key),
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);