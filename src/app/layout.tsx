import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import AppThemeProvider from "@/providers/ThemeProvider";
import "@/style/global.scss";

const inter = Inter({
   subsets: ["latin", "cyrillic"],
   display: "swap",
   variable: "--font-inter",
});

export const metadata: Metadata = {
   title: "Portfolio",
   description: "Portfolio site by Egor",
};

export const viewport: Viewport = {
   width: "device-width",
   initialScale: 1,
};

export default function RootLayout({
   children,
}: Readonly<{
   children: ReactNode;
}>) {
   return (
      <html lang="ru" className={inter.variable} suppressHydrationWarning>
         <body>
            <AppThemeProvider>{children}</AppThemeProvider>
         </body>
      </html>
   );
}
