"use client";

import { useEffect } from "react";
import {
   DARK_THEME,
   LIGHT_THEME,
   type MusicTheme,
   setActiveTheme,
} from "../_lib/themes";

function applyTheme(theme: MusicTheme) {
   const html = document.documentElement;

   const vars: Record<string, string> = {
      "--m-bg": theme.bg,
      "--m-surface": theme.surface,
      "--m-border": theme.border,
      "--m-text-primary": theme.textPrimary,
      "--m-text-secondary": theme.textSecondary,
      "--m-text-muted": theme.textMuted,
      "--m-inactive": theme.inactive,
      "--m-play": theme.play,
      "--m-play-hover": theme.playHover,
      "--m-stop": theme.stop,
      "--m-stop-hover": theme.stopHover,
      "--m-random": theme.random,
      "--m-evolve": theme.evolve,
      "--m-fx-active": theme.fxActive,
      "--m-fx-reverb": theme.fxReverb,
      "--m-fx-delay": theme.fxDelay,
      "--m-fx-filter": theme.fxFilter,
   };

   for (const [key, value] of Object.entries(vars)) {
      html.style.setProperty(key, value);
   }
   html.style.setProperty("--bg", theme.bg);
   html.style.setProperty("--fg", theme.textPrimary);
   html.style.backgroundColor = theme.bg;
   html.style.colorScheme = theme.isDark ? "dark" : "light";
   document.body.style.backgroundColor = theme.bg;

   const oldMeta = document.querySelector('meta[name="theme-color"]');
   if (oldMeta) {
      oldMeta.setAttribute("content", theme.bg);
   }

   setActiveTheme(theme);
}

export function MusicStyles() {
   useEffect(() => {
      const html = document.documentElement;
      const body = document.body;

      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "none";
      body.style.position = "fixed";
      body.style.width = "100%";
      body.style.height = "100%";
      html.style.overflow = "hidden";

      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const apply = () => applyTheme(mq.matches ? DARK_THEME : LIGHT_THEME);
      apply();
      mq.addEventListener("change", apply);

      return () => {
         mq.removeEventListener("change", apply);
         const varNames = [
            "--bg",
            "--fg",
            "--m-bg",
            "--m-surface",
            "--m-border",
            "--m-text-primary",
            "--m-text-secondary",
            "--m-text-muted",
            "--m-inactive",
            "--m-play",
            "--m-play-hover",
            "--m-stop",
            "--m-stop-hover",
            "--m-random",
            "--m-evolve",
            "--m-fx-active",
            "--m-fx-reverb",
            "--m-fx-delay",
            "--m-fx-filter",
         ];
         for (const v of varNames) html.style.removeProperty(v);
         html.style.backgroundColor = "";
         html.style.colorScheme = "";
         body.style.backgroundColor = "";
         body.style.overflow = "";
         body.style.overscrollBehavior = "";
         body.style.position = "";
         body.style.width = "";
         body.style.height = "";
         html.style.overflow = "";
      };
   }, []);

   return null;
}
