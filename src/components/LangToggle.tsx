"use client";

import { useLang } from "@/providers/LangProvider";

export default function LangToggle({ className }: { className?: string }) {
   const { locale, setLocale } = useLang();

   return (
      <button
         type="button"
         className={className}
         onClick={() => setLocale(locale === "ru" ? "en" : "ru")}
      >
         <span style={{ opacity: locale === "ru" ? 1 : 0.5 }}>RU</span>{" "}
         <span style={{ opacity: locale === "en" ? 1 : 0.5 }}>ENG</span>
      </button>
   );
}
