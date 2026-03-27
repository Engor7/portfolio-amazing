import Link from "next/dist/client/link";
import "./FullNav.scss";
import type { FC } from "react";

interface FullNavProps {
   isOpen: boolean;
}

const FullNav: FC<FullNavProps> = ({ isOpen }) => {
   if (!isOpen) return null;

   return (
      <div className="coin-full-nav">
         <div className="coin-full-nav__block">
            <b>News</b>
            <ul>
               <li>
                  <Link href="#">Breaking News</Link>
               </li>
               <li>
                  <Link href="#">Market Updates</Link>
               </li>
               <li>
                  <Link href="#">Regulation</Link>
               </li>
               <li>
                  <Link href="#">Exchanges</Link>
               </li>
            </ul>
         </div>

         <div className="coin-full-nav__block">
            <b>Markets</b>
            <ul>
               <li>
                  <Link href="#">Bitcoin (BTC)</Link>
               </li>
               <li>
                  <Link href="#">Ethereum (ETH)</Link>
               </li>
               <li>
                  <Link href="#">Altcoins</Link>
               </li>
               <li>
                  <Link href="#">Stablecoins</Link>
               </li>
            </ul>
         </div>

         <div className="coin-full-nav__block">
            <b>Research</b>
            <ul>
               <li>
                  <Link href="#">Price Analysis</Link>
               </li>
               <li>
                  <Link href="#">On-chain Data</Link>
               </li>
               <li>
                  <Link href="#">Market Reports</Link>
               </li>
            </ul>
         </div>
      </div>
   );
};

export default FullNav;
