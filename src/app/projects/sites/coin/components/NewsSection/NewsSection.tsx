"use client";

import "./NewsSection.scss";
import Link from "next/dist/client/link";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { ArrowRightIcon, EyeIcon } from "@/app/projects/sites/coin/icons";
import newsImg from "../../images/img_2.png";
import newsImg1 from "../../images/img_g1.png";
import newsImg2 from "../../images/img_g2.png";
import newsImg3 from "../../images/img_g3.png";
import newsImg4 from "../../images/img_g4.png";

const newsItems = [
   {
      id: 1,
      img: newsImg1,
      title: "Marathon gears up for Bitcoin halving, buys two mining sites for $179M",
      time: "9 hours ago",
      views: "8.7K",
   },
   {
      id: 2,
      img: newsImg2,
      title: "Cardano Foundation teams up with Brazil's oil giant Petrobras for blockchain education",
      time: "21 hours ago",
      views: "10.4K",
   },
   {
      id: 3,
      img: newsImg3,
      title: "Ledger crypto wallet vows to reimburse users after Connect kit exploit",
      time: "3 hours ago",
      views: "7.1K",
   },
   {
      id: 4,
      img: newsImg4,
      title: "Bitcoin ETF in 3 weeks? BTC traders aren't acting like it's happening",
      time: "18 hours ago",
      views: "9.3K",
   },
];

const NewsSection = () => {
   const listRef = useRef<HTMLDivElement>(null);
   const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
   const itemWidth = 228; // 220px width + 8px gap
   const singleSetWidth = newsItems.length * itemWidth;
   const totalSets = 5; // More sets for smoother infinite feel

   const resetPosition = useCallback(() => {
      const list = listRef.current;
      if (!list) return;

      const scrollLeft = list.scrollLeft;
      const middleSetStart = singleSetWidth * 2;
      const middleSetEnd = singleSetWidth * 3;

      // If scrolled past middle set, jump back
      if (scrollLeft >= middleSetEnd) {
         list.style.scrollBehavior = "auto";
         list.scrollLeft = scrollLeft - singleSetWidth;
         list.style.scrollBehavior = "";
      }
      // If scrolled before middle set, jump forward
      else if (scrollLeft < middleSetStart) {
         list.style.scrollBehavior = "auto";
         list.scrollLeft = scrollLeft + singleSetWidth;
         list.style.scrollBehavior = "";
      }
   }, [singleSetWidth]);

   const handleScrollEnd = useCallback(() => {
      if (scrollTimeout.current) {
         clearTimeout(scrollTimeout.current);
      }
      // Wait for snap animation to complete
      scrollTimeout.current = setTimeout(resetPosition, 100);
   }, [resetPosition]);

   useEffect(() => {
      const list = listRef.current;
      if (!list) return;

      const initAndSetup = () => {
         if (window.innerWidth <= 1200) {
            // Start in the middle set
            list.style.scrollBehavior = "auto";
            list.scrollLeft = singleSetWidth * 2;
            list.style.scrollBehavior = "";
            list.addEventListener("scroll", handleScrollEnd);
         } else {
            list.removeEventListener("scroll", handleScrollEnd);
            // Reset scroll position when switching to desktop
            list.style.scrollBehavior = "auto";
            list.scrollLeft = 0;
            list.style.scrollBehavior = "";
         }
      };

      initAndSetup();
      window.addEventListener("resize", initAndSetup);

      return () => {
         list.removeEventListener("scroll", handleScrollEnd);
         window.removeEventListener("resize", initAndSetup);
         if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
         }
      };
   }, [handleScrollEnd, singleSetWidth]);

   // 5 copies for smooth infinite scroll
   const duplicatedItems = Array(totalSets).fill(newsItems).flat();

   return (
      <div className="news-section">
         <div className="news-section__main-news">
            <Link
               href="#"
               className="news-section__main-news-overlay"
               aria-label="Read article"
            />
            <div className="news-section__main-news-cover">
               <span className="news-section__main-news-badge">NEW</span>
               <span className="news-section__main-news-img">
                  <Image
                     src={newsImg}
                     alt="News"
                     fill
                     sizes="(max-width: 960px) 100vw, 50vw"
                     priority
                  />
               </span>
               <div className="news-section__main-news-meta">
                  <span className="news-section__main-news-category">
                     CRYPTO
                  </span>
                  <span className="news-section__main-news-read-time">
                     5 MIN READ
                  </span>
               </div>
            </div>
            <div className="news-section__main-news-body">
               <div className="news-section__main-news-header">
                  <div className="news-section__main-news-time">
                     13 hours add
                  </div>
                  <div className="news-section__main-news-views">
                     <EyeIcon />
                     <span>5.4K</span>
                  </div>
                  <span className="news-section__main-news-link">
                     <ArrowRightIcon />
                  </span>
               </div>
               <h2>
                  EL SALVADOR TOPS BITCOIN INTEREST CHARTS AS BRAZIL OVERTAKES
                  NIGERIA
               </h2>
               <p>
                  In Nigeria, stablecoins have become the favored cryptocurrency
                  because they're tied to a widely accepted asset, the U.S.
                  dollar, providing a hedge against inflation and the
                  devaluation of the naira.
               </p>
               <span className="news-section__read-article">READ ARTICLE</span>
            </div>
         </div>
         <div className="news-section__list" ref={listRef}>
            {duplicatedItems.map((item, index) => (
               <div className="news-section__item" key={`${item.id}-${index}`}>
                  <Link
                     href="#"
                     className="news-section__item-overlay"
                     aria-label={item.title}
                  />
                  <span className="news-section__item-img">
                     <Image
                        src={item.img}
                        alt="News"
                        fill
                        sizes="(max-width: 1200px) 220px, 180px"
                     />
                  </span>
                  <h3 className="news-section__item-title">{item.title}</h3>
                  <div className="news-section__item-info">
                     <span className="news-section__item-time">
                        {item.time}
                     </span>
                     <span className="news-section__item-views">
                        <EyeIcon />
                        <span>{item.views}</span>
                     </span>
                  </div>
                  <span className="news-section__item-link">
                     <ArrowRightIcon />
                  </span>
               </div>
            ))}
         </div>
      </div>
   );
};

export default NewsSection;
