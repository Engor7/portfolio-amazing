import type { ReactNode } from "react";
import "./coin_global.scss";
import Header from "@/app/projects/sites/coin/components/Header";

const LayoutCoin = ({ children }: Readonly<{ children: ReactNode }>) => {
   return (
      <>
         <Header />
         {children}
      </>
   );
};

export default LayoutCoin;
