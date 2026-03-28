"use client";

import { useRef, useState } from "react";
import "./MarketsNews.scss";
import Image, { type StaticImageData } from "next/image";
import SectionHeader from "@/app/projects/sites/coin/components/SectionHeader/SectionHeader";
import { ArrowRightIcon, EyeIcon } from "@/app/projects/sites/coin/icons";
import newsImg1 from "@/app/projects/sites/coin/images/img_m1.png";
import newsImg2 from "@/app/projects/sites/coin/images/img_m2.png";
import newsImg3 from "@/app/projects/sites/coin/images/img_m3.png";
import newsImg4 from "@/app/projects/sites/coin/images/img_m4.png";
import newsImg5 from "@/app/projects/sites/coin/images/img_m5.png";

interface Article {
   id: number;
   img: StaticImageData;
   title: string;
   description: string;
   time: string;
   views?: string;
}

const articles: Article[] = [
   {
      id: 1,
      img: newsImg1,
      title: "WHY HA... TIME HIGH XRP, SOL, AND ARG...",
      description:
         "Bitcoin is proving its value by hitting new highs, validating long-term investors.",
      time: "1 hour ago",
      views: "3.2K",
   },
   {
      id: 2,
      img: newsImg2,
      title: "PRICE A... XRP, SOL, DAYS AS B...",
      description:
         "BTC price weakness saw single-day selling pressure collapse.",
      time: "3 hour ago",
      views: "7.8K",
   },
   {
      id: 3,
      img: newsImg3,
      title: "BITCOIN DAYS AS B... COLLAPSE",
      description:
         "BTC price weakness saw single-day selling pressure collapse.",
      time: "7 hour ago",
      views: "4.5K",
   },
   {
      id: 4,
      img: newsImg4,
      title: "BTC PRICE BOUNCES 5% AS INVESTOR SAYS BITCOIN ETF '99.9% DONE DEAL'",
      description:
         "New updates to BlackRock's spot Bitcoin ETF filing come as BTC price strength narrowly retains $40,000 as support.",
      time: "9 hour ago",
      views: "11.9K",
   },
   {
      id: 5,
      img: newsImg5,
      title: "'NO EXCU... ARTHUR HA... BET",
      description:
         "Bitcoin and altcoins are affected by the Fed interest rate decision.",
      time: "14 hour ago",
      views: "2.1K",
   },
];

const MarketsNews = () => {
   const [activeIndex, setActiveIndex] = useState(3);
   const listRef = useRef<HTMLDivElement>(null);
   const cardRefs = useRef<(HTMLElement | null)[]>([]);

   return (
      <div className="markets-news">
         <SectionHeader title="Markets news" showLine={false} />
         <div className="markets-news__content">
            <div className="markets-news__list" ref={listRef}>
               {articles.map((article, index) => (
                  <article
                     key={article.id}
                     ref={(el) => {
                        cardRefs.current[index] = el;
                     }}
                     className={`markets-news__card ${
                        activeIndex === index
                           ? "markets-news__card--active"
                           : ""
                     }`}
                     onMouseEnter={() => setActiveIndex(index)}
                  >
                     <div className="markets-news__card-image-wrapper">
                        <Image
                           src={article.img}
                           alt={article.title}
                           fill
                           sizes="(max-width: 768px) 280px, (max-width: 1200px) 33vw, 20vw"
                           className="markets-news__card-image"
                        />
                        <div className="markets-news__card-arrow">
                           <ArrowRightIcon />
                        </div>
                     </div>
                     <div className="markets-news__card-body">
                        <h3 className="markets-news__card-title">
                           <span className="markets-news__card-bullet">•</span>
                           {article.title}
                        </h3>
                        <p className="markets-news__card-description">
                           {article.description}
                        </p>
                     </div>
                     <div className="markets-news__card-meta">
                        <span className="markets-news__card-time">
                           {article.time}
                        </span>
                        {article.views && (
                           <span className="markets-news__card-views">
                              <EyeIcon />
                              {article.views}
                           </span>
                        )}
                     </div>
                  </article>
               ))}
            </div>
         </div>
      </div>
   );
};

export default MarketsNews;
