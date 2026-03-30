import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./styles.scss";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
   title: "Scroll Expand",
};

const LayoutScrollExpand = ({
   children,
}: Readonly<{ children: ReactNode }>) => {
   return <div className={inter.variable}>{children}</div>;
};

export default LayoutScrollExpand;
