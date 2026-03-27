import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./view-scroll.scss";

export const metadata: Metadata = {
   title: "Live Channels",
};

export const viewport: Viewport = {
   themeColor: "#000000",
};

const LayoutViewScroll = ({ children }: Readonly<{ children: ReactNode }>) => {
   return <div className="view-scroll">{children}</div>;
};

export default LayoutViewScroll;
