import type { ReactNode } from "react";
import ClickFireworks from "./ClickFireworks";

const LayoutHome = ({ children }: Readonly<{ children: ReactNode }>) => {
   return (
      <div data-site="main">
         <ClickFireworks />
         {children}
      </div>
   );
};

export default LayoutHome;
