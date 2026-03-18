"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
   const { theme, setTheme } = useTheme();
   return (
      <button
         className="theme-toggle"
         onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
         {theme === "dark" ? "light" : "dark"}
      </button>
   );
}
