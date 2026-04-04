import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import type { ReactNode } from "react";
import LangProvider from "@/providers/LangProvider";
import AppThemeProvider from "@/providers/ThemeProvider";
import "@/style/global.scss";

const openSans = Open_Sans({
   subsets: ["latin", "cyrillic"],
   weight: ["300", "400", "500", "600", "700"],
   display: "swap",
   variable: "--font-open-sans",
});

export const metadata: Metadata = {
   title: "Portfolio",
   description: "Portfolio site by Egor",
   icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: "/apple-touch-icon.png",
   },
   manifest: "/site.webmanifest",
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
      <html lang="ru" className={openSans.variable} suppressHydrationWarning>
         <body>
            <AppThemeProvider>
               <LangProvider>{children}</LangProvider>
            </AppThemeProvider>
         </body>
      </html>
   );
}
