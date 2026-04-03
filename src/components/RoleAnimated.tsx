"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import s from "./Header.module.scss";

gsap.registerPlugin(useGSAP, SplitText);

const ROLES = ["Frontend developer", "UX/UI designer", "Small details matter"];

export default function RoleAnimated({ className }: { className?: string }) {
   const textRef = useRef<HTMLSpanElement>(null);
   const indexRef = useRef(0);

   useGSAP(
      () => {
         if (!textRef.current) return;

         let split = SplitText.create(textRef.current, { type: "chars" });

         gsap.from(split.chars, {
            scale: 0,
            y: 10,
            rotation: () => gsap.utils.random(-15, 15),
            stagger: { each: 0.025, from: "random" },
            duration: 0.25,
            ease: "back.out(2)",
         });

         const interval = setInterval(() => {
            if (!textRef.current) return;

            const exitChars = split.chars;

            gsap
               .timeline({
                  onComplete() {
                     if (!textRef.current) return;
                     split.revert();
                     indexRef.current = (indexRef.current + 1) % ROLES.length;
                     textRef.current.textContent = ROLES[indexRef.current];
                     split = SplitText.create(textRef.current, {
                        type: "chars",
                     });
                     gsap.from(split.chars, {
                        scale: 0,
                        y: 10,
                        rotation: () => gsap.utils.random(-15, 15),
                        stagger: { each: 0.025, from: "random" },
                        duration: 0.25,
                        ease: "back.out(2)",
                     });
                  },
               })
               .to(exitChars, {
                  scale: 0,
                  y: -10,
                  rotation: () => gsap.utils.random(-15, 15),
                  stagger: { each: 0.02, from: "random" },
                  duration: 0.15,
                  ease: "back.in(2)",
               });
         }, 5000);

         return () => clearInterval(interval);
      },
      { scope: textRef },
   );

   return (
      <span
         className={`${s.role}${className ? ` ${className}` : ""}`}
         ref={textRef}
      >
         {ROLES[0]}
      </span>
   );
}
