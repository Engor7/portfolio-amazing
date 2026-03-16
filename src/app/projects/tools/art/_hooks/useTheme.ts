"use client";

import { useCallback, useEffect, useState } from "react";
import type { ThemeMode } from "../_lib/types";

const STORAGE_KEY = "art-theme";

export function useTheme() {
   const [theme, setTheme] = useState<ThemeMode>("dark");
   const [resolved, setResolved] = useState(false);

   useEffect(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
         setTheme(stored);
      }
      setResolved(true);
   }, []);

   useEffect(() => {
      document.documentElement.setAttribute("data-art-theme", theme);
      return () => {
         document.documentElement.removeAttribute("data-art-theme");
      };
   }, [theme]);

   const toggleTheme = useCallback(() => {
      setTheme((prev) => {
         const next = prev === "dark" ? "light" : "dark";
         localStorage.setItem(STORAGE_KEY, next);
         return next;
      });
   }, []);

   return { theme, resolved, toggleTheme };
}
