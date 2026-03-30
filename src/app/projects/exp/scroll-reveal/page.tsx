"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";

export default function NavigateTextPage() {
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);
      const tickerCallback = (time: number) => {
         lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      const container = containerRef.current;
      if (!container) return;

      const animeTextParagraphs = container.querySelectorAll(".anime-text p");
      const wordHighlightBgColor = "220, 215, 205";
      const keywords = [
         "fluid",
         "seamless",
         "precision",
         "rhythm",
         "structure",
         "adaptive",
         "dynamic",
         "responsive",
         "craft",
      ];

      animeTextParagraphs.forEach((paragraph) => {
         const text = paragraph.textContent || "";
         const words = text.split(/\s+/);
         paragraph.innerHTML = "";

         words.forEach((word) => {
            if (word.trim()) {
               const wordContainer = document.createElement("div");
               wordContainer.className = "word";

               const wordText = document.createElement("span");
               wordText.textContent = word;

               const normalizedWord = word
                  .toLowerCase()
                  .replace(/[.,!?;:"]/g, "");
               if (keywords.includes(normalizedWord)) {
                  wordContainer.classList.add("keyword-wrapper");
                  wordText.classList.add("keyword", normalizedWord);
               }

               wordContainer.appendChild(wordText);
               paragraph.appendChild(wordContainer);
            }
         });
      });

      const animeTextContainers = container.querySelectorAll(
         ".anime-text-container",
      );

      animeTextContainers.forEach((section) => {
         ScrollTrigger.create({
            trigger: section,
            pin: section,
            start: "top top",
            end: `+=${window.innerHeight * 2.5}`,
            pinSpacing: true,
            onUpdate: (self) => {
               const progress = self.progress;
               const words = Array.from(
                  section.querySelectorAll(".anime-text .word"),
               ) as HTMLElement[];
               const totalWords = words.length;

               words.forEach((word, index) => {
                  const wordText = word.querySelector("span") as HTMLElement;

                  if (progress <= 0.7) {
                     const progressTarget = 0.7;
                     const revealProgress = Math.min(
                        1,
                        progress / progressTarget,
                     );

                     const overlapWords = 15;
                     const totalAnimationLength = 1 + overlapWords / totalWords;

                     const wordStart = index / totalWords;
                     const wordEnd = wordStart + overlapWords / totalWords;

                     const timelineScale =
                        1 /
                        Math.min(
                           totalAnimationLength,
                           1 +
                              (totalWords - 1) / totalWords +
                              overlapWords / totalWords,
                        );

                     const adjustedStart = wordStart * timelineScale;
                     const adjustedEnd = wordEnd * timelineScale;
                     const duration = adjustedEnd - adjustedStart;

                     const wordProgress =
                        revealProgress <= adjustedStart
                           ? 0
                           : revealProgress >= adjustedEnd
                             ? 1
                             : (revealProgress - adjustedStart) / duration;

                     word.style.opacity = String(wordProgress);

                     const backgroundFadeStart =
                        wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
                     const backgroundOpacity = Math.max(
                        0,
                        1 - backgroundFadeStart,
                     );
                     word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;

                     const textRevealThreshold = 0.9;
                     const textRevealProgress =
                        wordProgress >= textRevealThreshold
                           ? (wordProgress - textRevealThreshold) /
                             (1 - textRevealThreshold)
                           : 0;
                     wordText.style.opacity = String(textRevealProgress ** 0.5);
                  } else {
                     const reverseProgress = (progress - 0.7) / 0.3;
                     word.style.opacity = "1";
                     const targetTextOpacity = 1;

                     const reverseOverlapWords = 5;
                     const reverseWordStart = index / totalWords;
                     const reverseWordEnd =
                        reverseWordStart + reverseOverlapWords / totalWords;

                     const reverseTimelineScale =
                        1 /
                        Math.max(
                           1,
                           (totalWords - 1) / totalWords +
                              reverseOverlapWords / totalWords,
                        );

                     const reverseAdjustedStart =
                        reverseWordStart * reverseTimelineScale;
                     const reverseAdjustedEnd =
                        reverseWordEnd * reverseTimelineScale;
                     const reverseDuration =
                        reverseAdjustedEnd - reverseAdjustedStart;

                     const reverseWordProgress =
                        reverseProgress <= reverseAdjustedStart
                           ? 0
                           : reverseProgress >= reverseAdjustedEnd
                             ? 1
                             : (reverseProgress - reverseAdjustedStart) /
                               reverseDuration;

                     if (reverseWordProgress > 0) {
                        wordText.style.opacity = String(
                           targetTextOpacity * (1 - reverseWordProgress),
                        );
                        word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${reverseWordProgress})`;
                     } else {
                        wordText.style.opacity = String(targetTextOpacity);
                        word.style.backgroundColor = `rgba(${wordHighlightBgColor}, 0)`;
                     }
                  }
               });
            },
         });
      });

      return () => {
         lenis.destroy();
         ScrollTrigger.getAll().forEach((t) => { t.kill(); });
         gsap.ticker.remove(tickerCallback);
      };
   }, []);

   return (
      <div ref={containerRef}>
         <section className="hero">
            <div className="copy-container">
               <h1>Where every layout finds its natural rhythm.</h1>
            </div>
         </section>

         <section className="about anime-text-container">
            <div className="copy-container">
               <div className="anime-text">
                  <p>
                     Formflow is a fluid environment for teams that craft
                     interfaces with precision and purpose. It goes beyond
                     static mockups — giving you seamless control over spacing,
                     hierarchy, and the rhythm of every component on the page.
                  </p>
                  <p>
                     Good structure is invisible but essential. Formflow helps
                     you align grids, balance whitespace, and define the
                     adaptive rules that make layouts feel right at any
                     breakpoint. From wireframe to production, your designs take
                     shape with confidence.
                  </p>
               </div>
            </div>
         </section>

         <section className="cta">
            <div className="copy-container">
               <h1>Start building layouts that breathe.</h1>
            </div>
         </section>

         <section className="features anime-text-container">
            <div className="copy-container">
               <div className="anime-text">
                  <p>
                     Formflow unites structure, motion, and responsive logic in
                     one dynamic workspace. Build grid systems, define fluid
                     type scales, and preview every breakpoint live — all
                     without switching tools or context.
                  </p>
                  <p>
                     With native support for responsive tokens, spacing presets,
                     and real-time constraint editing, Formflow turns layout
                     craft into a precise and creative process. It&apos;s the
                     most direct path from concept to a polished,
                     production-ready interface.
                  </p>
               </div>
            </div>
         </section>

         <section className="outro">
            <div className="copy-container">
               <h1>Designed for those who think in grids.</h1>
            </div>
         </section>
      </div>
   );
}
