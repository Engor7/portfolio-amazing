"use client";

import "./SectionHeader.scss";
import Link from "next/link";
import { ArrowRightIcon } from "@/app/projects/sites/coin/icons";

interface SectionHeaderProps {
   title: string;
   href?: string;
   showLine?: boolean;
}

const SectionHeader = ({
   title,
   href = "#",
   showLine = true,
}: SectionHeaderProps) => {
   return (
      <div className="section-header">
         <div className="section-header__top">
            <h2 className="section-header__title">{title}</h2>
            <Link href={href} className="section-header__see-all">
               <span>see all</span>
               <ArrowRightIcon />
            </Link>
         </div>
         {showLine && <div className="section-header__line" />}
      </div>
   );
};

export default SectionHeader;
