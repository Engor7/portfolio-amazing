import type { Metadata } from "next";
import { DM_Sans, Host_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "./styles.scss";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const hostGrotesk = Host_Grotesk({
   subsets: ["latin"],
   variable: "--font-host-grotesk",
});

export const metadata: Metadata = {
   title: "Scroll Reveal",
};

const LayoutNavigateText = ({
   children,
}: Readonly<{ children: ReactNode }>) => {
   return (
      <div className={`${dmSans.variable} ${hostGrotesk.variable}`}>
         {children}
      </div>
   );
};

export default LayoutNavigateText;
