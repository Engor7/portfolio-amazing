"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import AudioPlayer from "./_components/AudioPlayer/AudioPlayer";
import CardStack from "./_components/CardStack/CardStack";
import ClockRound from "./_components/ClockRound/ClockRound";
import ContextMenu from "./_components/ContextMenu/ContextMenu";
import DesignerDeck from "./_components/DesignerDeck/DesignerDeck";
import EyesButton from "./_components/EyesButton/EyesButton";
import FitnessTracker from "./_components/FitnessTracker/FitnessTracker";
import GalleryUsers from "./_components/GalleryUsers/GalleryUsers";
import LyricCard from "./_components/LyricCard/LyricCard";
import Schedule from "./_components/Schedule/Schedule";
import StockInfo from "./_components/StockInfo/StockInfo";
import TodoList from "./_components/TodoList/TodoList";
import ToggleSwitch from "./_components/ToggleSwitch/ToggleSwitch";
import WeatherForecast from "./_components/WeatherForecast/WeatherForecast";
import WordPopup from "./_components/WordPopup/WordPopup";
import styles from "./ui-library.module.scss";

const UILibraryPage = () => {
   const { resolvedTheme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);
   const [scrolled, setScrolled] = useState(false);
   const lastScrollY = useRef(0);

   useEffect(() => {
      setMounted(true);
      if (window.scrollY > 80) setScrolled(true);
   }, []);

   const handleScroll = useCallback(() => {
      const y = window.scrollY;
      setScrolled(y > 80);
      lastScrollY.current = y;
   }, []);

   useEffect(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
   }, [handleScroll]);

   const currentTheme: "light" | "dark" =
      mounted && resolvedTheme === "dark" ? "dark" : "light";

   return (
      <div className={styles.page}>
         <div
            className={`${styles.toolbar} ${scrolled ? styles.toolbarFloating : ""}`}
         >
            <div className={styles.toolbarInner}>
               <Link href="/" className={styles.homeBtn}>
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     aria-hidden="true"
                  >
                     <path
                        fill="currentColor"
                        d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1"
                     />
                  </svg>
                  <span>Go Home</span>
               </Link>
               {scrolled && (
                  <button
                     type="button"
                     className={styles.upBtn}
                     onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                     }
                     aria-label="Scroll to top"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                     >
                        <path
                           fill="currentColor"
                           d="m11 8.8l-2.9 2.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275L13 8.8V17q0 .425-.288.713T12 18t-.712-.288T11 17z"
                        />
                     </svg>
                     <span>Up</span>
                  </button>
               )}
               <div className={styles.toggleWrap}>
                  <ToggleSwitch
                     checked={currentTheme === "dark"}
                     onChange={(checked) =>
                        setTheme(checked ? "dark" : "light")
                     }
                     floating={scrolled}
                  />
               </div>
            </div>
         </div>

         <div className={styles.grid}>
            <div className={styles.cell}>
               <AudioPlayer />
            </div>
            <div className={styles.cell}>
               <WordPopup />
            </div>
            <div className={styles.cell}>
               <CardStack />
            </div>
            <div className={styles.hideOnMobile}>
               <EyesButton />
            </div>
            <div className={styles.cell}>
               <TodoList />
            </div>
            <div className={styles.cell}>
               <StockInfo />
            </div>
            <div className={styles.cell}>
               <ClockRound />
            </div>
            <div className={styles.cell}>
               <WeatherForecast />
            </div>
            <div className={styles.cell}>
               <FitnessTracker />
            </div>
            <div className={`${styles.cell} ${styles.contextMenuCell}`}>
               <ContextMenu />
            </div>
            <div className={styles.cell}>
               <DesignerDeck />
            </div>
            <div className={styles.cell}>
               <GalleryUsers />
            </div>
            <div className={styles.cell}>
               <Schedule />
            </div>
            <div className={styles.cell}>
               <LyricCard />
            </div>
            <div className={styles.emptyCell} />
         </div>

         <p className={styles.footer}>
            Crafted as a playground for UI ideas — some components built from
            scratch, others inspired by works of other UI/UX designers.
         </p>
      </div>
   );
};

export default UILibraryPage;
