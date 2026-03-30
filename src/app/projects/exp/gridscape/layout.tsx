import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./styles.scss";

const ibmPlexMono = IBM_Plex_Mono({
   subsets: ["latin"],
   weight: ["400", "500"],
   variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
   title: "Gridscape",
};

const LayoutGridscape = ({ children }: Readonly<{ children: ReactNode }>) => {
   return <div className={ibmPlexMono.variable}>{children}</div>;
};

export default LayoutGridscape;
