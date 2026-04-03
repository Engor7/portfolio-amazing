"use client";

import { useEffect } from "react";

const STICKS = 7;

export default function ClickFireworks() {
   useEffect(() => {
      const handleClick = (e: MouseEvent) => {
         const target = e.target as HTMLElement;
         if (
            target.closest(
               "a, button, input, select, textarea, label, [role='button']",
            )
         )
            return;

         const x = e.clientX;
         const y = e.clientY;

         for (let i = 0; i < STICKS; i++) {
            const angle = (360 / STICKS) * i + (Math.random() * 20 - 10);
            const startOffset = 8 + Math.random() * 8;
            const endOffset = 18 + Math.random() * 20;
            const stick = document.createElement("div");
            stick.className = "click-stick";
            stick.style.cssText = `
               position: fixed;
               left: ${x}px;
               top: ${y}px;
               width: 2px;
               height: 10px;
               background: white;
               mix-blend-mode: difference;
               border-radius: 1px;
               pointer-events: none;
               transform-origin: 50% 0%;
               transform: rotate(${angle}deg) translateY(-${startOffset}px);
               animation: stick-fly 0.45s ease-out forwards;
               --angle: ${angle}deg;
               --start-offset: -${startOffset}px;
               --end-offset: -${endOffset}px;
               z-index: 9999;
            `;
            document.body.appendChild(stick);
            stick.addEventListener("animationend", () => stick.remove());
            setTimeout(() => stick.remove(), 500);
         }
      };

      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
   }, []);

   return null;
}
