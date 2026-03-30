import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "./styles.scss";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
   title: "Prism Veil",
};

const LayoutPrismVeil = ({ children }: Readonly<{ children: ReactNode }>) => {
   return <div className={manrope.variable}>{children}</div>;
};

export default LayoutPrismVeil;
