"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Dictionary, dictionaries, Language } from "@/utils/i18n/dictionaries";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start with "en" so the server and first client render match.
  // The real language is applied in useEffect (client-only) to avoid hydration mismatch.
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Resolve the actual language from cookie or browser preference
    const storedLang = Cookies.get("language") as Language | undefined;

    let resolved: Language = "en";
    if (storedLang === "en" || storedLang === "ar") {
      resolved = storedLang;
    } else {
      // Fall back to browser language
      const browserLang = navigator.language || (navigator as any).userLanguage || "";
      if (browserLang.startsWith("ar")) resolved = "ar";
    }

    setLanguageState(resolved);
    document.documentElement.lang = resolved;
    document.documentElement.dir = resolved === "ar" ? "rtl" : "ltr";

    // Persist if not already saved
    if (!storedLang) {
      Cookies.set("language", resolved, { expires: 365 });
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    Cookies.set("language", lang, { expires: 365 });
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const t = dictionaries[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
