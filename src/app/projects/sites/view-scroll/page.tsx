"use client";

import { useState } from "react";
import Carousel from "./components/Carousel";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { SearchButtonIcon, SettingsIcon } from "./components/icons";
import ParticlesBackground from "./components/ParticlesBackground";

const ViewScroll = () => {
   const [activeImageSrc, setActiveImageSrc] = useState<string | undefined>();
   const today = new Date();
   const formattedDate = today.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
   });

   return (
      <>
         <ParticlesBackground imageSrc={activeImageSrc} />
         <Header />
         <main className="view-scroll__main">
            <div className="view-scroll__section-header">
               <div className="view-scroll__section-header-left">
                  <h1>
                     <span className="view-scroll__live-dot"></span>
                     Trending Now <span>(21)</span>
                  </h1>
                  <p>{formattedDate}</p>
               </div>
               <div className="view-scroll__section-header-right">
                  <div className="view-scroll__section-header-search">
                     <SearchButtonIcon />
                     <input
                        type="text"
                        placeholder="Find streams, creators..."
                     />
                  </div>
                  <button
                     className="view-scroll__section-header-settings"
                     type="button"
                     aria-label="Search"
                  >
                     <SearchButtonIcon />
                  </button>
                  <button
                     className="view-scroll__section-header-settings"
                     type="button"
                     aria-label="Settings"
                  >
                     <SettingsIcon />
                  </button>
               </div>
            </div>
            <div className="view-scroll__carousel-container">
               <Carousel
                  onIndexChange={(_, imageSrc) => {
                     setActiveImageSrc(imageSrc);
                  }}
               />
            </div>
         </main>
         <Footer />
      </>
   );
};

export default ViewScroll;
