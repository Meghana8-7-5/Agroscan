import React, { createContext, useContext, useEffect, useState } from "react";
import { LANGUAGES, Language, TranslationKeys, translate } from "../lib/i18n";
import { useAuth } from "./AuthContext";
import { authApi } from "../lib/api";

interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
  currentLangObj: Language;
  t: (key: TranslationKeys, params?: Record<string, string>) => string;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem("agroscan_preferred_language") || user?.preferredLanguage || "en";
  });

  useEffect(() => {
    if (user?.preferredLanguage && !localStorage.getItem("agroscan_preferred_language")) {
      setLanguageState(user.preferredLanguage);
    }
  }, [user]);

  const setLanguage = (code: string) => {
    setLanguageState(code);
    localStorage.setItem("agroscan_preferred_language", code);
    document.documentElement.lang = code;
    // Sync to backend profile (fire-and-forget)
    authApi.syncLanguage(code);
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const t = (key: TranslationKeys, params?: Record<string, string>) => {
    return translate(language, key, params);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLangObj,
        t,
        languages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
