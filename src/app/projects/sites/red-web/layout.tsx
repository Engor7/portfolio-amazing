import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
   title: "Red Web",
};

export const viewport: Viewport = {
   themeColor: "#f55",
};

const LayoutRedWeb = ({ children }: Readonly<{ children: ReactNode }>) => {
   return <>{children}</>;
};

export default LayoutRedWeb;
