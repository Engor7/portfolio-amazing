"use client";

import { useCallback, useEffect, useRef } from "react";
import styles from "./DesignerDeck.module.scss";

const CARDS = [
   {
      logo: "iFlm",
      title: "Designer Soul.\nDeveloper Brain.",
      tag: "IDENTITY",
      cmd: "READY TO EXECUTE _",
   },
   {
      logo: "iFlm",
      title: "Think in Systems.\nFeel in Pixels.",
      tag: "PROCESS",
      cmd: "MAPPING THE FLOW _",
   },
   {
      logo: "iFlm",
      title: "Ship Fast.\nLeave Nothing Ugly.",
      tag: "PRINCIPLES",
      cmd: "DEPLOYING NOW _",
   },
   {
      logo: "iFlm",
      title: "Code Is the\nNew Canvas.",
      tag: "CRAFT",
      cmd: "RENDERING VISION _",
   },
   {
      logo: "iFlm",
      title: "Details Are\nthe Design.",
      tag: "QUALITY",
      cmd: "REFINING EVERYTHING _",
   },
];

const STACK = [
   { tx: -72, ty: 24, rot: -7, scale: 0.88, blur: 5, opacity: 0.65, z: 1 },
   { tx: -48, ty: 16, rot: -5, scale: 0.92, blur: 3, opacity: 0.78, z: 2 },
   { tx: -24, ty: 8, rot: -2.5, scale: 0.96, blur: 1.2, opacity: 0.9, z: 3 },
   { tx: 0, ty: 0, rot: 0, scale: 1, blur: 0, opacity: 1, z: 4 },
];

function applyState(
   el: HTMLDivElement,
   s: (typeof STACK)[number],
   instant: boolean,
) {
   el.style.transition = instant
      ? "none"
      : "transform 0.45s cubic-bezier(.22,.68,0,1.1),filter 0.45s ease,opacity 0.45s ease";
   el.style.transform = `rotate(${s.rot}deg) translate(${s.tx}px,${s.ty}px) scale(${s.scale})`;
   el.style.filter = `blur(${s.blur}px)`;
   el.style.opacity = String(s.opacity);
   el.style.zIndex = String(s.z);
}

function mkCard(data: (typeof CARDS)[number]): HTMLDivElement {
   const el = document.createElement("div");
   el.className = styles.card;
   el.innerHTML = `
      <div class="${styles.cardLogo}">${data.logo}</div>
      <div class="${styles.cardTitle}">${data.title}</div>
      <div class="${styles.cardFooter}">
         <span class="${styles.cardTag}">${data.tag}</span>
         <span class="${styles.cardCmd}">${data.cmd}</span>
      </div>`;
   return el;
}

const DesignerDeck = () => {
   const deckRef = useRef<HTMLDivElement>(null);
   const lblRef = useRef<HTMLSpanElement>(null);
   const arcRef = useRef<SVGCircleElement>(null);
   const stateRef = useRef({
      cur: 0,
      busy: false,
      els: [] as HTMLDivElement[],
      timer: 0,
   });

   const updateNav = useCallback((cur: number) => {
      if (lblRef.current)
         lblRef.current.textContent = `${cur + 1} / ${CARDS.length}`;
      if (arcRef.current)
         arcRef.current.setAttribute(
            "stroke-dasharray",
            `${(((cur + 1) / CARDS.length) * 100.5).toFixed(1)} 100.5`,
         );
   }, []);

   useEffect(() => {
      const deck = deckRef.current;
      if (!deck) return;

      const s = stateRef.current;
      s.cur = 0;
      s.busy = false;
      deck.innerHTML = "";
      const els: HTMLDivElement[] = [];

      const INTRO = {
         tx: 60,
         ty: 80,
         rot: 12,
         scale: 0.7,
         blur: 8,
         opacity: 0,
         z: 0,
      };

      for (let i = 0; i < 4; i++) {
         const idx = (s.cur - (3 - i) + CARDS.length * 10) % CARDS.length;
         const el = mkCard(CARDS[idx]);
         applyState(el, { ...INTRO, z: STACK[i].z }, true);
         deck.appendChild(el);
         els.push(el);
      }
      s.els = els;
      updateNav(s.cur);

      const spring = "cubic-bezier(.175,.885,.32,1.275)";
      const timers: number[] = [];

      els.forEach((el, i) => {
         const delay = 200 + i * 120;
         const t = window.setTimeout(() => {
            const st = STACK[i];
            el.style.transition = `transform 0.7s ${spring}, filter 0.6s ease, opacity 0.5s ease`;
            el.style.transform = `rotate(${st.rot}deg) translate(${st.tx}px,${st.ty}px) scale(${st.scale})`;
            el.style.filter = `blur(${st.blur}px)`;
            el.style.opacity = String(st.opacity);
            el.style.zIndex = String(st.z);
         }, delay);
         timers.push(t);
      });

      return () => {
         clearTimeout(s.timer);
         for (const t of timers) clearTimeout(t);
         s.busy = false;
      };
   }, [updateNav]);

   const next = () => {
      const s = stateRef.current;
      const deck = deckRef.current;
      if (s.busy || !deck) return;
      s.busy = true;

      const front = s.els[3];
      front.style.transition =
         "transform 0.38s cubic-bezier(.4,0,1,1),opacity 0.32s ease";
      front.style.transform = "rotate(10deg) translate(130%,-20px) scale(0.92)";
      front.style.opacity = "0";

      applyState(s.els[0], STACK[1], false);
      applyState(s.els[1], STACK[2], false);
      applyState(s.els[2], STACK[3], false);

      s.cur = (s.cur + 1) % CARDS.length;
      updateNav(s.cur);

      s.timer = window.setTimeout(() => {
         if (!front.parentNode) {
            s.busy = false;
            return;
         }
         const newIdx = (s.cur - 3 + CARDS.length * 10) % CARDS.length;
         const newEl = mkCard(CARDS[newIdx]);
         applyState(
            newEl,
            {
               tx: -96,
               ty: 30,
               rot: -10,
               scale: 0.84,
               blur: 7,
               opacity: 0,
               z: 1,
            },
            true,
         );
         deck.insertBefore(newEl, s.els[0]);
         front.parentNode.removeChild(front);
         s.els = [newEl, s.els[0], s.els[1], s.els[2]];

         requestAnimationFrame(() =>
            requestAnimationFrame(() => {
               applyState(newEl, STACK[0], false);
               s.busy = false;
            }),
         );
      }, 400);
   };

   return (
      <div className={styles.wrap}>
         <div className={styles.nav}>
            <div className={styles.navLeft}>
               <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  aria-hidden="true"
               >
                  <title>Progress</title>
                  <circle
                     cx="20"
                     cy="20"
                     r="16"
                     fill="none"
                     stroke="var(--dd-border-secondary)"
                     strokeWidth="3"
                  />
                  <circle
                     ref={arcRef}
                     cx="20"
                     cy="20"
                     r="16"
                     fill="none"
                     stroke="var(--dd-text-primary)"
                     strokeWidth="3"
                     strokeDasharray="20.1 100.5"
                     strokeLinecap="round"
                     style={{
                        transform: "rotate(-90deg)",
                        transformOrigin: "center",
                     }}
                  />
               </svg>
               <span className={styles.pageLabel} ref={lblRef}>
                  1 / {CARDS.length}
               </span>
            </div>
            <button className={styles.circleBtn} onClick={next} type="button">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
               >
                  <title>Next</title>
                  <path
                     fill="currentColor"
                     d="M9.575 12L5.7 8.1q-.275-.275-.288-.687T5.7 6.7q.275-.275.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.687.288T5.7 17.3q-.275-.275-.275-.7t.275-.7zm6.6 0L12.3 8.1q-.275-.275-.288-.687T12.3 6.7q.275-.275.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.687.288T12.3 17.3q-.275-.275-.275-.7t.275-.7z"
                  />
               </svg>
            </button>
         </div>
         <div className={styles.deckOuter}>
            <div className={styles.deck} ref={deckRef} />
         </div>
      </div>
   );
};

export default DesignerDeck;
