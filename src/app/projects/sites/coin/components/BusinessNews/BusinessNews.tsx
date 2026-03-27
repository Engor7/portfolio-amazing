"use client";

import "./BusinessNews.scss";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SectionHeader from "@/app/projects/sites/coin/components/SectionHeader/SectionHeader";
import { ArrowRightIcon, EyeIcon } from "@/app/projects/sites/coin/icons";
import newsImg1 from "../../images/b_1.png";
import newsImg2 from "../../images/b_2.png";
import newsImg3 from "../../images/b_3.png";
import newsImg4 from "../../images/b_4.png";
import newsImg5 from "../../images/b_5.png";

const articles = [
   {
      id: 1,
      img: newsImg1,
      tag: "business",
      title: "Bitcoin Miner Core Scientific to Exit Bankruptcy in January 2024",
      description:
         'The global settlement removes key hurdles to our anticipated emergence from Chapter 11 in January," wrote Core Scientific CEO Adam Sullivan.',
      time: "3 hours ago",
      views: "5.2K",
   },
   {
      id: 2,
      img: newsImg2,
      tag: "business",
      title: "Elon Musk Says X Will Launch Payment Services by Mid-2024",
      description:
         "Elon Musk, the owner of X, expects to launch payment services as early as the middle of 2024.",
      time: "6 hours ago",
      views: "12.4K",
   },
   {
      id: 3,
      img: newsImg3,
      tag: "technology",
      title: "UK Top Court Rejects Patents for Two Inventions Birthed by AI",
      description:
         "Computer scientist Dr. Stephen Thaler attempted to file two patent applications in the name of an AI model he created.",
      time: "9 hours ago",
      views: "8.1K",
   },
   {
      id: 4,
      img: newsImg4,
      tag: "crypto",
      title: "Ripple Gets Approval to Operate as Digital Asset Service Operator in Ireland",
      description:
         "Other companies in the CBI VASP register include Coinbase and Gemini exchanges, the payment processor MoonPay, Zodia Custody and others.",
      time: "12 hours ago",
      views: "6.7K",
   },
   {
      id: 5,
      img: newsImg5,
      tag: "crypto",
      title: "Shiba Inu Announces Plans to Launch '.shib' Domain for SHIB Holders",
      description:
         'While ".crypto" and ".eth" don\'t work natively on the internet\'s domain name system, Shiba Inu plans to launch a ".shib" domain that will…',
      time: "18 hours ago",
      views: "9.3K",
   },
];

const BusinessNews = () => {
   const [activeIndex, setActiveIndex] = useState(0);
   const [showAll, setShowAll] = useState(false);

   return (
      <div
         className={`business-news ${showAll ? "business-news--expanded" : ""}`}
      >
         <SectionHeader title="Business news" />
         <div className="business-news__list">
            {articles.map((article, index) => (
               <article
                  key={article.id}
                  className={`business-news__item ${activeIndex === index ? "business-news__item--active" : ""}`}
                  onMouseEnter={() => setActiveIndex(index)}
               >
                  <Link
                     href="#"
                     className="business-news__item-overlay"
                     aria-label={article.title}
                  />
                  <div className="business-news__item-image">
                     <Image
                        src={article.img}
                        alt={article.title}
                        sizes="(max-width: 768px) 100vw, (max-width: 960px) 30vw, (max-width: 1200px) 25vw, 20vw"
                     />
                     <span className="business-news__item-tag">
                        {article.tag}
                     </span>
                     <div className="business-news__item-meta">
                        <span className="business-news__item-time">
                           {article.time}
                        </span>
                        <span className="business-news__item-views">
                           <EyeIcon />
                           <span>{article.views}</span>
                        </span>
                     </div>
                  </div>
                  <div className="business-news__item-content">
                     <h3 className="business-news__item-title">
                        {article.title}
                     </h3>
                     <p className="business-news__item-description">
                        {article.description}
                     </p>
                  </div>
                  <span className="business-news__item-arrow">
                     <ArrowRightIcon />
                  </span>
               </article>
            ))}
         </div>
         <button
            type="button"
            className="business-news__show-all"
            onClick={() => setShowAll(true)}
         >
            Show all
         </button>
      </div>
   );
};

export default BusinessNews;
