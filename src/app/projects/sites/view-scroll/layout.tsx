import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./view-scroll.scss";

export const metadata: Metadata = {
   title: "Live Channels",
};

export const viewport: Viewport = {
   themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
      { media: "(prefers-color-scheme: dark)", color: "#000000" },
   ],
};

const LayoutViewScroll = ({ children }: Readonly<{ children: ReactNode }>) => {
   return <div className="view-scroll">{children}</div>;
};

export default LayoutViewScroll;
