"use client";

import type { ReactNode } from "react";
import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useMemo,
   useState,
} from "react";
import { type Locale, translations } from "@/lib/translations";

const RU_LOCALES = [
   "ru",
   "ru-BY",
   "ru-KG",
   "ru-KZ",
   "ru-MD",
   "ru-RU",
   "ru-UA",
   "be",
   "be-BY",
   "tt-RU",
   "sah-RU",
   "ce",
   "ce-RU",
   "os-RU",
   "uk-UA",
   "uk",
];

type LangContextValue = {
   locale: Locale;
   setLocale: (l: Locale) => void;
   t: (typeof translations)[Locale];
};

const LangContext = createContext<LangContextValue | null>(null);

export function useLang() {
   const ctx = useContext(LangContext);
   if (!ctx) throw new Error("useLang must be used within LangProvider");
   return ctx;
}

export default function LangProvider({ children }: { children: ReactNode }) {
   const [locale, setLocaleState] = useState<Locale>("ru");

   useEffect(() => {
      const stored = localStorage.getItem("lang");
      if (stored === "ru" || stored === "en") {
         setLocaleState(stored);
         document.documentElement.lang = stored;
         return;
      }
      const browserLang = navigator.language;
      const detected = RU_LOCALES.includes(browserLang) ? "ru" : "en";
      setLocaleState(detected);
      document.documentElement.lang = detected;
   }, []);

   const setLocale = useCallback((l: Locale) => {
      setLocaleState(l);
      localStorage.setItem("lang", l);
      document.documentElement.lang = l;
   }, []);

   const t = translations[locale];

   const value = useMemo(
      () => ({ locale, setLocale, t }),
      [locale, setLocale, t],
   );

   return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
