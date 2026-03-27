"use client";

import "./CoinNav.scss";
import Link from "next/dist/client/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import FullNav from "@/app/projects/sites/coin/components/Header/FullNav";
import {
   ChevronDownIcon,
   LogoCoin,
   SearchIcon,
} from "@/app/projects/sites/coin/icons";

interface SearchResult {
   id: number;
   title: string;
   category: string;
}

const MainHeader = () => {
   const [isFullNavigate, setIsFullNavigate] = useState<boolean>(false);
   const [isLanguageOpen, setIsLanguageOpen] = useState<boolean>(false);
   const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
   const [searchQuery, setSearchQuery] = useState<string>("");
   const fullNavRef = useRef<HTMLDivElement>(null);
   const burgerRef = useRef<HTMLButtonElement>(null);
   const languageRef = useRef<HTMLButtonElement>(null);
   const searchRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   const mockResults: SearchResult[] = [
      { id: 1, title: "Bitcoin reaches new high", category: "News" },
      { id: 2, title: "Ethereum 2.0 update", category: "Markets" },
      { id: 3, title: "DeFi trends 2024", category: "Research" },
      { id: 4, title: "NFT marketplace analysis", category: "Magazine" },
   ];

   const filteredResults = mockResults.filter(
      (result) =>
         result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         result.category.toLowerCase().includes(searchQuery.toLowerCase()),
   );

   const handleSearchIconClick = () => {
      setIsSearchOpen(!isSearchOpen);
   };

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      if (e.target.value && !isSearchOpen) {
         setIsSearchOpen(true);
      }
   };

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            fullNavRef.current &&
            !fullNavRef.current.contains(event.target as Node) &&
            burgerRef.current &&
            !burgerRef.current.contains(event.target as Node)
         ) {
            setIsFullNavigate(false);
         }

         if (
            languageRef.current &&
            !languageRef.current.contains(event.target as Node)
         ) {
            setIsLanguageOpen(false);
         }

         if (
            searchRef.current &&
            !searchRef.current.contains(event.target as Node)
         ) {
            setIsSearchOpen(false);
         }
      };

      if (isFullNavigate || isLanguageOpen || isSearchOpen) {
         document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [isFullNavigate, isLanguageOpen, isSearchOpen]);

   useEffect(() => {
      if (isSearchOpen && window.innerWidth <= 730) {
         document.body.style.overflow = "hidden";
         // Focus input after 100ms on mobile
         setTimeout(() => {
            inputRef.current?.focus();
         }, 100);
      } else {
         document.body.style.overflow = "";
      }
      return () => {
         document.body.style.overflow = "";
      };
   }, [isSearchOpen]);

   return (
      <>
         <div className="coin-header">
            <div
               className={`coin-header__top
                  ${isFullNavigate ? "coin-header__top--full-nav-active" : ""}`}
            >
               <div className="coin-header__search-wrapper" ref={searchRef}>
                  <div
                     className={`coin-header__search ${isSearchOpen ? "coin-header__search--active" : ""}`}
                  >
                     <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                     />
                     <button
                        className="coin-header__search-icon"
                        onClick={handleSearchIconClick}
                        onKeyDown={(e) => {
                           if (e.key === "Enter" || e.key === " ") {
                              handleSearchIconClick();
                           }
                        }}
                        type="button"
                     >
                        <SearchIcon />
                     </button>
                  </div>
                  {isSearchOpen && (
                     <div className="coin-header__search-results">
                        {filteredResults.length > 0 ? (
                           filteredResults.map((result) => (
                              <div
                                 key={result.id}
                                 className="coin-header__search-results-item"
                              >
                                 <div className="coin-header__search-results-item-title">
                                    {result.title}
                                 </div>
                                 <div className="coin-header__search-results-item-category">
                                    {result.category}
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="coin-header__search-results-empty">
                              No results found
                           </div>
                        )}
                     </div>
                  )}
                  {isSearchOpen && (
                     <button
                        className="coin-header__search-backdrop"
                        onClick={() => setIsSearchOpen(false)}
                        onKeyDown={(e) => {
                           if (e.key === "Escape") {
                              setIsSearchOpen(false);
                           }
                        }}
                        aria-label="Close search"
                        type="button"
                     />
                  )}
               </div>
               <div className="coin-header__logo">
                  <LogoCoin />
               </div>
               <button
                  className="coin-header__language"
                  ref={languageRef}
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  onKeyDown={(e) => {
                     if (e.key === "Enter" || e.key === " ") {
                        setIsLanguageOpen(!isLanguageOpen);
                     }
                  }}
                  type="button"
               >
                  <span>ENG</span>
                  <div className="coin-header__language-chevron">
                     <ChevronDownIcon />
                  </div>
                  {isLanguageOpen && (
                     <div className="coin-header__language-dropdown">
                        <ul>
                           <li>English</li>
                           <li>Français</li>
                        </ul>
                     </div>
                  )}
               </button>
               <button
                  ref={burgerRef}
                  className={`coin-header__full-navigate
                  ${
                     isFullNavigate ? "coin-header__full-navigate--active" : ""
                  }`}
                  onClick={() => setIsFullNavigate(!isFullNavigate)}
                  onKeyDown={(e) => {
                     if (e.key === "Enter" || e.key === " ") {
                        setIsFullNavigate(!isFullNavigate);
                     }
                  }}
                  type="button"
               >
                  <span></span>
                  <span></span>
                  <span></span>
               </button>
            </div>
            <ul className="coin-header__main-nav">
               <li>
                  <Link href="#">news</Link>
               </li>
               <li>
                  <Link href="#">markets</Link>
               </li>
               <li>
                  <Link href="#">magazine</Link>
               </li>
               <li>
                  <Link href="#">people</Link>
               </li>
               <li>
                  <Link href="#">cryptopedia</Link>
               </li>
               <li>
                  <Link href="#">research</Link>
               </li>
               <li>
                  <Link href="#">video</Link>
               </li>
               <li>
                  <Link href="#">podcasts</Link>
               </li>
               <li>
                  <Link href="#">markets pro</Link>
               </li>
            </ul>
         </div>
         <div ref={fullNavRef}>
            <FullNav isOpen={isFullNavigate} />
         </div>
      </>
   );
};

export default MainHeader;
