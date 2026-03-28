"use client";

import { useEffect, useRef, useState } from "react";
import { EMOJI_ICONS } from "./icons";
import s from "./page.module.scss";

const HOLD_MIN = 5000;
const HOLD_MAX = 9000;
const FAST_INTERVAL = 12;
const TOTAL_TICKS = 14;

function easeOutExpo(t: number) {
   return 1 - (1 - t) ** 4;
}

export default function EmojiSlot() {
   const [index, setIndex] = useState(0);
   const [phase, setPhase] = useState<"spinning" | "landing" | "idle">(
      "spinning",
   );
   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   useEffect(() => {
      let cancelled = false;

      function startSpin() {
         if (cancelled) return;
         setPhase("spinning");
         let tick = 0;

         const step = () => {
            if (cancelled) return;
            tick++;
            const progress = tick / TOTAL_TICKS;
            const interval = FAST_INTERVAL + easeOutExpo(progress) * 300;

            setIndex(Math.floor(Math.random() * EMOJI_ICONS.length));

            if (tick < TOTAL_TICKS) {
               timerRef.current = setTimeout(step, interval);
            } else {
               // Landing — pick final and bounce
               const final = Math.floor(Math.random() * EMOJI_ICONS.length);
               setIndex(final);
               setPhase("landing");

               timerRef.current = setTimeout(() => {
                  if (cancelled) return;
                  setPhase("idle");

                  const hold = HOLD_MIN + Math.random() * (HOLD_MAX - HOLD_MIN);
                  timerRef.current = setTimeout(startSpin, hold);
               }, 500);
            }
         };

         step();
      }

      startSpin();

      return () => {
         cancelled = true;
         if (timerRef.current) clearTimeout(timerRef.current);
      };
   }, []);

   const Icon = EMOJI_ICONS[index];

   return (
      <div
         className={[
            s.emojiSlot,
            phase === "landing" ? s.emojiLanding : "",
            phase === "idle" ? s.emojiIdle : "",
         ].join(" ")}
      >
         <Icon />
      </div>
   );
}
