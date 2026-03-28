"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import s from "./page.module.scss";

export default function ThemeToggle() {
   const { resolvedTheme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);

   useEffect(() => setMounted(true), []);

   if (!mounted) return null;

   const isDark = resolvedTheme === "dark";

   return (
      <button
         type="button"
         className={s.toggle}
         onClick={() => setTheme(isDark ? "light" : "dark")}
      >
         {isDark ? "light" : "dark"}
      </button>
   );
}
