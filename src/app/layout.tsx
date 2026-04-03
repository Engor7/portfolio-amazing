import type { Metadata, Viewport } from "next";
import { Open_Sans, Raleway } from "next/font/google";
import type { ReactNode } from "react";
import AppThemeProvider from "@/providers/ThemeProvider";
import "@/style/global.scss";

const raleway = Raleway({
   subsets: ["latin", "cyrillic"],
   display: "swap",
   variable: "--font-raleway",
});

const openSans = Open_Sans({
   subsets: ["latin", "cyrillic"],
   display: "swap",
   variable: "--font-open-sans",
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
      <html
         lang="ru"
         className={`${raleway.variable} ${openSans.variable}`}
         suppressHydrationWarning
      >
         <body>
            <AppThemeProvider>{children}</AppThemeProvider>
         </body>
      </html>
   );
}
