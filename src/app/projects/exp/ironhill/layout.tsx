import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./styles.scss";

export const metadata: Metadata = {
   title: "IronHill",
};

const LayoutIronhill = ({
   children,
}: Readonly<{ children: ReactNode }>) => {
   return <>{children}</>;
};

export default LayoutIronhill;
