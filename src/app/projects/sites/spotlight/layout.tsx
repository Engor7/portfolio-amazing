import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
   title: "Spotlight",
};

export const viewport: Viewport = {
   themeColor: "#f55",
};

const LayoutSpotlight = ({ children }: Readonly<{ children: ReactNode }>) => {
   return <>{children}</>;
};

export default LayoutSpotlight;
