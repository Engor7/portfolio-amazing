"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/nav-links";

const IDS = NAV_LINKS.map((l) => l.href.slice(1));

export function useActiveSection() {
   const [active, setActive] = useState<string>(NAV_LINKS[0].href);

   useEffect(() => {
      function update() {
         const center = window.innerHeight / 2;
         let closest: string | null = null;
         let minDist = Infinity;

         for (const id of IDS) {
            const el = document.getElementById(id);
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            const dist = Math.abs(rect.top + rect.height / 2 - center);
            if (dist < minDist) {
               minDist = dist;
               closest = id;
            }
         }

         if (closest) setActive(`#${closest}`);
      }

      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update, { passive: true });
      return () => {
         window.removeEventListener("scroll", update);
         window.removeEventListener("resize", update);
      };
   }, []);

   return active;
}
