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
import SpoilerRevealDemo from "./_components/SpoilerRevealDemo/SpoilerRevealDemo";
import StockInfo from "./_components/StockInfo/StockInfo";
import TodoList from "./_components/TodoList/TodoList";
import ToggleSwitch from "./_components/ToggleSwitch/ToggleSwitch";
import WeatherForecast from "./_components/WeatherForecast/WeatherForecast";
import WordPopup from "./_components/WordPopup/WordPopup";
import { ArrowUpIcon, HomeIcon } from "./icons";
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
         <div className={styles.gridWrap}>
            <div className={styles.grid}>
               <div className={styles.toolbar}>
                  <div className={styles.toolbarInner}>
                     <Link href="/" className={styles.homeBtn}>
                        <HomeIcon />
                        <span>Go Home</span>
                     </Link>
                     <div className={styles.toggleWrap}>
                        <ToggleSwitch
                           checked={currentTheme === "dark"}
                           onChange={(checked) =>
                              setTheme(checked ? "dark" : "light")
                           }
                           floating={false}
                        />
                     </div>
                  </div>
               </div>
               <div className={styles.cell}>
                  <AudioPlayer />
               </div>
               <div className={styles.cell}>
                  <WordPopup />
               </div>
               <div className={styles.cell}>
                  <SpoilerRevealDemo />
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
            </div>
         </div>

         <p className={styles.footer}>
            Crafted as a playground for UI ideas — some components built from
            scratch, others inspired by works of other UI/UX designers.
         </p>

         {scrolled && (
            <div className={styles.toolbarFloating}>
               <div className={styles.toolbarInner}>
                  <Link href="/" className={styles.homeBtn}>
                     <HomeIcon />
                     <span>Go Home</span>
                  </Link>
                  <button
                     type="button"
                     className={styles.upBtn}
                     onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                     }
                     aria-label="Scroll to top"
                  >
                     <ArrowUpIcon />
                     <span>Up</span>
                  </button>
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
         )}
      </div>
   );
};

export default UILibraryPage;
