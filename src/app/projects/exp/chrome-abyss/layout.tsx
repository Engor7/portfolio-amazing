import type { Metadata } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./styles.scss";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const dmMono = DM_Mono({
   subsets: ["latin"],
   weight: ["300", "400", "500"],
   variable: "--font-dm-mono",
});

export const metadata: Metadata = {
   title: "Chrome Abyss",
};

const LayoutChromeAbyss = ({ children }: Readonly<{ children: ReactNode }>) => {
   return (
      <div className={`${dmSans.variable} ${dmMono.variable}`}>{children}</div>
   );
};

export default LayoutChromeAbyss;
