"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);

   useEffect(() => setMounted(true), []);

   if (!mounted)
      return (
         <button type="button" className="theme-toggle" aria-label="Toggle theme" />
      );

   return (
      <button
         type="button"
         className="theme-toggle"
         onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
         {theme === "dark" ? "light" : "dark"}
      </button>
   );
}
