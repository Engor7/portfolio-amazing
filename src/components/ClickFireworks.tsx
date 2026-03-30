"use client";

import { useEffect } from "react";

const STICKS = 7;

export default function ClickFireworks() {
   useEffect(() => {
      const handleClick = (e: MouseEvent) => {
         const x = e.clientX;
         const y = e.clientY;

         for (let i = 0; i < STICKS; i++) {
            const angle = (360 / STICKS) * i;
            const stick = document.createElement("div");
            stick.className = "click-stick";
            stick.style.cssText = `
               position: fixed;
               left: ${x}px;
               top: ${y}px;
               width: 2px;
               height: 10px;
               background: currentColor;
               border-radius: 1px;
               pointer-events: none;
               transform-origin: 50% 0%;
               transform: rotate(${angle}deg) translateY(-5px);
               animation: stick-fly 0.45s ease-out forwards;
               --angle: ${angle}deg;
               z-index: 9999;
            `;
            document.body.appendChild(stick);
            stick.addEventListener("animationend", () => stick.remove());
         }
      };

      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
   }, []);

   return null;
}
