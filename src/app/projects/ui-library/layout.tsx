import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
   title: "UI Library",
};

const LayoutRedWeb = ({ children }: Readonly<{ children: ReactNode }>) => {
   return <>{children}</>;
};

export default LayoutRedWeb;
