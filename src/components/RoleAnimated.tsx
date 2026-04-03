"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef } from "react";
import { useLang } from "@/providers/LangProvider";
import s from "./Header.module.scss";

gsap.registerPlugin(useGSAP, SplitText);

export default function RoleAnimated({ className }: { className?: string }) {
   const textRef = useRef<HTMLSpanElement>(null);
   const indexRef = useRef(0);
   const { t } = useLang();
   const rolesRef = useRef(t.roles);

   useEffect(() => {
      rolesRef.current = t.roles;
   }, [t.roles]);

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
                     indexRef.current =
                        (indexRef.current + 1) % rolesRef.current.length;
                     textRef.current.textContent =
                        rolesRef.current[indexRef.current];
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
         {t.roles[0]}
      </span>
   );
}
