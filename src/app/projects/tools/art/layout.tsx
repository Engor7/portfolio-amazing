import type { Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import type { ReactNode } from "react";

export const viewport: Viewport = {
   maximumScale: 1,
   userScalable: false,
   viewportFit: "cover",
   themeColor: "#000000",
};

const ibmPlexMono = IBM_Plex_Mono({
   subsets: ["latin", "cyrillic"],
   weight: ["400", "500", "700"],
});

const LayoutArt = ({ children }: Readonly<{ children: ReactNode }>) => {
   return <div className={ibmPlexMono.className}>{children}</div>;
};

export default LayoutArt;
