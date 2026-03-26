"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./LyricCard.module.scss";

const SCROLL_SPEED = 30; // px per second
const REWIND_DURATION = 300; // ms to scroll back

const LYRICS_TEXT =
   "The morning dawn the sun was rising over the land, a white mist covered the fields and the river shimmered in the early light. Birds began their song as the world slowly awakened from its slumber, painting everything in shades of gold and amber. The air was crisp and fresh, carrying the scent of dew-kissed wildflowers across the meadow.";

const LyricCard = () => {
   const textRef = useRef<HTMLDivElement>(null);
   const rafRef = useRef<number>(0);
   const scrollRef = useRef(0);
   const lastTimeRef = useRef(0);
   const isHoveringRef = useRef(false);
   const [scrolled, setScrolled] = useState(false);
   const [, forceRender] = useState(0);

   const getMaxScroll = useCallback(() => {
      const el = textRef.current;
      if (!el) return 0;
      return Math.max(0, el.scrollHeight - el.clientHeight);
   }, []);

   const animateScroll = useCallback(
      (timestamp: number) => {
         if (!isHoveringRef.current) return;

         if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
         const delta = (timestamp - lastTimeRef.current) / 1000;
         lastTimeRef.current = timestamp;

         const maxScroll = getMaxScroll();
         if (maxScroll <= 0) return;

         scrollRef.current = Math.min(
            scrollRef.current + SCROLL_SPEED * delta,
            maxScroll,
         );

         if (textRef.current) {
            textRef.current.scrollTop = scrollRef.current;
            setScrolled(scrollRef.current > 0);
         }

         if (scrollRef.current < maxScroll) {
            rafRef.current = requestAnimationFrame(animateScroll);
         }
      },
      [getMaxScroll],
   );

   const handleMouseEnter = useCallback(() => {
      isHoveringRef.current = true;
      lastTimeRef.current = 0;

      const el = textRef.current;
      if (el) {
         el.style.transition = "none";
      }

      rafRef.current = requestAnimationFrame(animateScroll);
   }, [animateScroll]);

   const handleMouseLeave = useCallback(() => {
      isHoveringRef.current = false;
      cancelAnimationFrame(rafRef.current);

      const el = textRef.current;
      if (!el) return;

      // Quick rewind via CSS transition on scroll-simulating transform
      const current = scrollRef.current;
      scrollRef.current = 0;

      // Use smooth scroll-like animation by stepping
      const start = performance.now();
      const step = (now: number) => {
         const progress = Math.min((now - start) / REWIND_DURATION, 1);
         const eased = 1 - (1 - progress) * (1 - progress); // easeOutQuad
         el.scrollTop = current * (1 - eased);
         if (progress < 1) {
            requestAnimationFrame(step);
         } else {
            setScrolled(false);
         }
      };
      requestAnimationFrame(step);
   }, []);

   useEffect(() => {
      // Force a render after mount so getMaxScroll works
      forceRender(1);
      return () => cancelAnimationFrame(rafRef.current);
   }, []);

   return (
      // biome-ignore lint/a11y/noStaticElementInteractions: decorative hover scroll animation
      <div
         className={styles.card}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
         <div className={styles.header}>
            <h3 className={styles.title}>Morning dawn</h3>
            <span className={styles.artist}>korol i shut</span>
         </div>
         <div className={styles.textWrapper}>
            <div ref={textRef} className={styles.textScroll}>
               <p className={styles.lyrics}>{LYRICS_TEXT}</p>
            </div>
            <div
               className={`${styles.fadeTop} ${scrolled ? styles.visible : ""}`}
            />
            <div className={styles.fadeBottom} />
         </div>
      </div>
   );
};

export default LyricCard;
