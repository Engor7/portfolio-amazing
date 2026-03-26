"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./TodoList.module.scss";

type TodoItem = { id: number; text: string; emoji: string };

const items: TodoItem[] = [
   { id: 1, text: "Read 5 pages of a book", emoji: "📚" },
   { id: 2, text: "Feed the cats", emoji: "🐈" },
   { id: 3, text: "Water the plants", emoji: "🌱" },
];

function generateWavyPath(width: number): string {
   const pad = 8;
   const totalW = width + pad * 2;
   const waves = 3 + Math.floor(Math.random() * 2);
   const baseHalfWaveW = totalW / (waves * 2);
   const slope = 8;
   const startY = -slope / 2;
   const baseAmp = 7;
   const lean = 4;
   const cpRatio = 0.45;
   let dir = Math.random() > 0.5 ? 1 : -1;
   let x = -pad;
   let y = startY;
   let d = `M${x},${y}`;

   for (let i = 0; i < waves * 2; i++) {
      const halfWaveW = baseHalfWaveW * (0.7 + Math.random() * 0.6);
      const amp = baseAmp * (0.6 + Math.random() * 0.8);
      const nextX = x + halfWaveW;
      const nextY = startY + slope * ((i + 1) / (waves * 2));
      const peakY = (y + nextY) / 2 + dir * amp;
      const leanX = -dir * lean;

      const cp1x = x + halfWaveW * cpRatio + leanX;
      const cp1y = y + (peakY - y) * 0.9;
      const cp2x = nextX - halfWaveW * cpRatio + leanX;
      const cp2y = nextY + (peakY - nextY) * 0.9;

      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${nextX},${nextY}`;

      x = nextX;
      y = nextY;
      dir *= -1;
   }

   return d;
}

const WavyStrike = ({ width }: { width: number }) => {
   const [path] = useState(() => generateWavyPath(width));
   const pathRef = useRef<SVGPathElement>(null);
   const [len, setLen] = useState(0);

   useEffect(() => {
      if (pathRef.current) {
         setLen(pathRef.current.getTotalLength());
      }
   }, []);

   return (
      <svg
         className={styles.wavyStrike}
         width={width + 16}
         height={28}
         viewBox={`-8 -14 ${width + 16} 28`}
         fill="none"
         aria-hidden="true"
      >
         <path
            ref={pathRef}
            d={path}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={len || 999}
            strokeDashoffset={len || 999}
            className={styles.wavyPath}
            style={
               len ? ({ "--wave-len": len } as React.CSSProperties) : undefined
            }
         />
      </svg>
   );
};

const CheckIcon = ({ animKey }: { animKey: number }) => (
   <svg
      key={animKey}
      className={styles.checkIcon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
   >
      <path
         fill="none"
         stroke="currentColor"
         strokeDasharray="24"
         strokeDashoffset="24"
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth="3"
         d="M5 11l6 6l10 -10"
      >
         <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.4s"
            values="24;0"
         />
      </path>
   </svg>
);

const TodoList = () => {
   const [checked, setChecked] = useState<Set<number>>(() => new Set([1]));
   const [animKeys, setAnimKeys] = useState<Record<number, number>>({ 1: 1 });
   const textRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
   const [textWidths, setTextWidths] = useState<Record<number, number>>({});

   useEffect(() => {
      const widths: Record<number, number> = {};
      textRefs.current.forEach((el, id) => {
         widths[id] = el.offsetWidth;
      });
      setTextWidths(widths);
   }, []);

   const toggle = useCallback((id: number) => {
      setChecked((prev) => {
         const next = new Set(prev);
         if (next.has(id)) {
            next.delete(id);
         } else {
            next.add(id);
            setAnimKeys((ak) => ({ ...ak, [id]: (ak[id] || 0) + 1 }));
         }
         return next;
      });
   }, []);

   return (
      <div className={styles.root}>
         {items.map((item, i) => {
            const done = checked.has(item.id);
            return (
               <button
                  key={item.id}
                  type="button"
                  className={`${styles.row} ${done ? styles.done : ""}`}
                  style={{ "--i": i } as React.CSSProperties}
                  onClick={() => toggle(item.id)}
               >
                  <span
                     className={`${styles.checkbox} ${done ? styles.checked : ""}`}
                  >
                     {done && <CheckIcon animKey={animKeys[item.id] || 0} />}
                  </span>
                  <span className={styles.textWrap}>
                     <span
                        ref={(el) => {
                           if (el) textRefs.current.set(item.id, el);
                        }}
                        className={styles.text}
                     >
                        {item.text} {item.emoji}
                     </span>
                     {done && textWidths[item.id] && (
                        <WavyStrike
                           key={animKeys[item.id] || 0}
                           width={textWidths[item.id]}
                        />
                     )}
                  </span>
               </button>
            );
         })}
      </div>
   );
};

export default TodoList;
