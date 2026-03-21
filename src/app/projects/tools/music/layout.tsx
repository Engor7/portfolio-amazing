import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { MusicStyles } from "./_components/MusicStyles";

export const metadata: Metadata = {
   title: "Music",
};

export const viewport: Viewport = {
   themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#f5f0eb" },
      { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
   ],
   maximumScale: 1,
   userScalable: false,
   viewportFit: "cover",
};

const LayoutMusic = ({ children }: Readonly<{ children: ReactNode }>) => {
   return (
      <>
         <MusicStyles />
         {children}
      </>
   );
};

export default LayoutMusic;
