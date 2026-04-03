"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LangToggle from "@/components/LangToggle";
import Nav from "@/components/Nav";
import NavBurger from "@/components/NavBurger";
import RoleAnimated from "@/components/RoleAnimated";
import ThemeToggle from "@/components/ThemeToggle";
import s from "./StickyHeader.module.scss";

gsap.registerPlugin(useGSAP);

export default function StickyHeader() {
   const [visible, setVisible] = useState(false);
   const [atTop, setAtTop] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);
   const isAnimating = useRef(false);

   useEffect(() => {
      const header = document.getElementById("main-header");
      const footer = document.getElementById("main-footer");

      const headerObs = new IntersectionObserver(
         ([entry]) => setVisible(!entry.isIntersecting),
         { threshold: 0 },
      );

      const footerObs = new IntersectionObserver(
         ([entry]) => {
            if (!containerRef.current || isAnimating.current) return;
            const blocks = containerRef.current.querySelectorAll(
               `.${s.identity}, .${s.nav}, .${s.controls}, .${s.burger}`,
            );
            if (!blocks.length) return;

            isAnimating.current = true;

            if (entry.isIntersecting) {
               // Footer visible → animate out downward, reposition to top, animate in
               gsap.to(blocks, {
                  y: 40,
                  opacity: 0,
                  duration: 0.3,
                  stagger: 0.03,
                  onComplete: () => {
                     setAtTop(true);
                     gsap.fromTo(
                        blocks,
                        { y: -40, opacity: 0 },
                        {
                           y: 0,
                           opacity: 1,
                           duration: 0.4,
                           stagger: 0.05,
                           ease: "back.out(1.7)",
                           onComplete: () => {
                              isAnimating.current = false;
                           },
                        },
                     );
                  },
               });
            } else {
               // Footer hidden → animate out upward, reposition to bottom, animate in
               gsap.to(blocks, {
                  y: -40,
                  opacity: 0,
                  duration: 0.3,
                  stagger: 0.03,
                  onComplete: () => {
                     setAtTop(false);
                     gsap.fromTo(
                        blocks,
                        { y: 40, opacity: 0 },
                        {
                           y: 0,
                           opacity: 1,
                           duration: 0.4,
                           stagger: 0.05,
                           ease: "back.out(1.7)",
                           onComplete: () => {
                              isAnimating.current = false;
                           },
                        },
                     );
                  },
               });
            }
         },
         { threshold: 0 },
      );

      if (header) headerObs.observe(header);
      if (footer) footerObs.observe(footer);

      return () => {
         headerObs.disconnect();
         footerObs.disconnect();
      };
   }, []);

   useGSAP(
      () => {
         if (!containerRef.current) return;
         const blocks = containerRef.current.querySelectorAll(
            `.${s.identity}, .${s.nav}, .${s.controls}, .${s.burger}`,
         );
         if (!blocks.length) return;

         if (visible) {
            gsap.fromTo(
               blocks,
               { y: 40, opacity: 0 },
               {
                  y: 0,
                  opacity: 1,
                  duration: 0.45,
                  stagger: 0.06,
                  ease: "back.out(1.7)",
               },
            );
         } else {
            gsap.set(blocks, { opacity: 0, y: 0 });
         }
      },
      { dependencies: [visible], scope: containerRef },
   );

   const className = [s.sticky, visible ? s.visible : "", atTop ? s.atTop : ""]
      .filter(Boolean)
      .join(" ");

   return (
      <div ref={containerRef} className={className} aria-hidden={!visible}>
         <div className={s.identity}>
            <Image
               src="/avatar.png"
               alt="Egor"
               width={38}
               height={38}
               className={s.avatar}
            />
            <div className={s.info}>
               <span className={s.name}>Egor</span>
               <RoleAnimated className={s.role} />
            </div>
         </div>

         <Nav className={s.nav} />

         <div className={s.right}>
            <div className={s.controls}>
               <LangToggle className={s.langToggle} />
               <ThemeToggle inverted className={s.themeToggle} />
            </div>

            <NavBurger
               dropdownDir={atTop ? "down" : "up"}
               className={s.burger}
            />
         </div>
      </div>
   );
}
