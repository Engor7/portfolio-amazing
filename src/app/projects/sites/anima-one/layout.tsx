import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
   title: "Anima One",
};

const LayoutAnimaOne = ({ children }: Readonly<{ children: ReactNode }>) => {
   return <>{children}</>;
};

export default LayoutAnimaOne;
