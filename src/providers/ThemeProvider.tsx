"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import ProjectExitReload from "./ProjectExitReload";

export default function AppThemeProvider({
   children,
}: {
   children: ReactNode;
}) {
   return (
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
         <ProjectExitReload />
         {children}
      </ThemeProvider>
   );
}
