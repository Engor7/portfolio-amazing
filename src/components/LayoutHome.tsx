import type { ReactNode } from "react";

const LayoutHome = ({ children }: Readonly<{ children: ReactNode }>) => {
   return <div data-site="main">{children}</div>;
};

export default LayoutHome;
