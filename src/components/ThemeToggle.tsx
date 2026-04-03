"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import s from "./ThemeToggle.module.scss";

function SunIcon() {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="14"
         height="14"
         viewBox="0 0 24 24"
         aria-hidden="true"
      >
         <path
            fill="currentColor"
            d="M12 5q-.425 0-.712-.288T11 4V2q0-.425.288-.712T12 1t.713.288T13 2v2q0 .425-.288.713T12 5m4.95 2.05q-.275-.275-.275-.687t.275-.713l1.4-1.425q.3-.3.712-.3t.713.3q.275.275.275.7t-.275.7L18.35 7.05q-.275.275-.7.275t-.7-.275M20 13q-.425 0-.713-.288T19 12t.288-.712T20 11h2q.425 0 .713.288T23 12t-.288.713T22 13zm-8 10q-.425 0-.712-.288T11 22v-2q0-.425.288-.712T12 19t.713.288T13 20v2q0 .425-.288.713T12 23M5.65 7.05l-1.425-1.4q-.3-.3-.3-.725t.3-.7q.275-.275.7-.275t.7.275L7.05 5.65q.275.275.275.7t-.275.7q-.3.275-.7.275t-.7-.275m12.7 12.725l-1.4-1.425q-.275-.3-.275-.712t.275-.688t.688-.275t.712.275l1.425 1.4q.3.275.288.7t-.288.725q-.3.3-.725.3t-.7-.3M2 13q-.425 0-.712-.288T1 12t.288-.712T2 11h2q.425 0 .713.288T5 12t-.288.713T4 13zm2.225 6.775q-.275-.275-.275-.7t.275-.7L5.65 16.95q.275-.275.687-.275t.713.275q.3.3.3.713t-.3.712l-1.4 1.4q-.3.3-.725.3t-.7-.3M12 18q-2.5 0-4.25-1.75T6 12t1.75-4.25T12 6t4.25 1.75T18 12t-1.75 4.25T12 18"
         />
      </svg>
   );
}

function MoonIcon() {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="14"
         height="14"
         viewBox="0 0 24 25"
         aria-hidden="true"
      >
         <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M23.923 17.2382C24.0829 16.8498 23.9888 16.4015 23.6867 16.1131C23.3846 15.8247 22.938 15.7569 22.5661 15.9429C21.3101 16.5709 19.8961 16.9241 18.3981 16.9241C13.1801 16.9241 8.95016 12.6295 8.95016 7.33176C8.95016 5.18705 9.64225 3.20939 10.8124 1.61247C11.0597 1.27493 11.075 0.81707 10.8508 0.46331C10.6265 0.109549 10.2097 -0.0659724 9.80466 0.0227794C4.2002 1.25082 2.60834e-07 6.31085 0 12.3692C-3.00331e-07 19.345 5.56986 25 12.4406 25C17.6133 25 22.0464 21.795 23.923 17.2382Z"
         />
      </svg>
   );
}

export default function ThemeToggle({
   inverted,
   className,
}: {
   inverted?: boolean;
   className?: string;
} = {}) {
   const { resolvedTheme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);

   useEffect(() => setMounted(true), []);

   if (!mounted) {
      return (
         <button type="button" className={s.toggle} aria-label="Toggle theme" />
      );
   }

   const isDark = resolvedTheme === "dark";

   return (
      <button
         type="button"
         className={`${s.toggle} ${isDark ? s.dark : ""} ${inverted ? s.inverted : ""} ${className ?? ""}`}
         onClick={() => setTheme(isDark ? "light" : "dark")}
         aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      >
         <div className={`${s.cylinder} ${isDark ? s.showMoon : s.showSun}`}>
            <div className={s.cell}>
               <SunIcon />
            </div>
            <div className={s.cell}>
               <MoonIcon />
            </div>
         </div>
      </button>
   );
}
