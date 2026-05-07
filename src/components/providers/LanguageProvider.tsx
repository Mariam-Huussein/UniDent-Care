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
  // دالة للحصول على اللغة من المتصفح
  const getBrowserLanguage = (): Language => {
    if (typeof window === "undefined") return "en";
    
    // الحصول على لغة المتصفح
    const browserLang = navigator.language || (navigator as any).userLanguage;
    
    // التحقق إذا كانت اللغة عربية
    if (browserLang.startsWith("ar")) {
      return "ar";
    }
    
    // افتراضياً الإنجليزية
    return "en";
  };

  const [language, setLanguageState] = useState<Language>(() => {
    // محاولة الحصول على اللغة من Cookies أولاً
    const storedLang = Cookies.get("language") as Language | undefined;
    if (storedLang && (storedLang === "en" || storedLang === "ar")) {
      return storedLang;
    }
    // إذا لم توجد في Cookies، استخدم لغة المتصفح
    return getBrowserLanguage();
  });

  useEffect(() => {
    // تطبيق اللغة على المستند
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    
    // حفظ اللغة في Cookies إذا لم تكن محفوظة
    const storedLang = Cookies.get("language");
    if (!storedLang) {
      Cookies.set("language", language, { expires: 365 });
    }
  }, [language]);

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
