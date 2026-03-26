"use client";

import type { CSSProperties, PointerEvent } from "react";
import { memo, useCallback, useEffect, useRef } from "react";
import s from "../music.module.scss";

interface SliderProps {
   value: number;
   min: number;
   max: number;
   step?: number;
   onChange: (v: number) => void;
   label?: string;
   color?: string;
   getLevel?: () => Float32Array | null;
   isPlaying?: boolean;
}

const LevelIndicator = memo(function LevelIndicator({
   getLevel,
   isPlaying,
}: {
   getLevel: () => Float32Array | null;
   isPlaying: boolean;
}) {
   const ref = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!isPlaying) {
         const el = ref.current;
         if (el) el.style.width = "0%";
         return;
      }

      let raf = 0;
      const tick = () => {
         const el = ref.current;
         if (!el) {
            raf = requestAnimationFrame(tick);
            return;
         }

         const data = getLevel();
         let level = 0;
         if (data && data.length > 0) {
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
               sum += Math.max(0, (data[i] + 100) / 70);
            }
            level = Math.min(1, sum / data.length);
         }

         el.style.width = `${level * 100}%`;
         raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
   }, [getLevel, isPlaying]);

   return <div ref={ref} className={s.sliderLevel} />;
});

export function Slider({
   value,
   min,
   max,
   step = 1,
   onChange,
   label,
   color = "#888",
   getLevel,
   isPlaying = false,
}: SliderProps) {
   const trackRef = useRef<HTMLDivElement>(null);
   const dragging = useRef(false);

   const valueFromPointer = useCallback(
      (clientX: number) => {
         const track = trackRef.current;
         if (!track) return value;
         const rect = track.getBoundingClientRect();
         const ratio = Math.max(
            0,
            Math.min(1, (clientX - rect.left) / rect.width),
         );
         const raw = min + ratio * (max - min);
         return Math.round(raw / step) * step;
      },
      [min, max, step, value],
   );

   const handlePointerDown = useCallback(
      (e: PointerEvent) => {
         e.preventDefault();
         dragging.current = true;
         (e.target as HTMLElement).setPointerCapture(e.pointerId);
         onChange(valueFromPointer(e.clientX));
      },
      [onChange, valueFromPointer],
   );

   const handlePointerMove = useCallback(
      (e: PointerEvent) => {
         if (!dragging.current) return;
         e.preventDefault();
         onChange(valueFromPointer(e.clientX));
      },
      [onChange, valueFromPointer],
   );

   const handlePointerUp = useCallback(() => {
      dragging.current = false;
   }, []);

   const pct = ((value - min) / (max - min)) * 100;

   return (
      <div
         ref={trackRef}
         className={s.slider}
         style={{ "--slider-color": color } as CSSProperties}
         onPointerDown={handlePointerDown}
         onPointerMove={handlePointerMove}
         onPointerUp={handlePointerUp}
         onPointerCancel={handlePointerUp}
      >
         <div className={s.sliderFill} style={{ width: `max(${pct}%, 28px)` }}>
            {getLevel && (
               <LevelIndicator getLevel={getLevel} isPlaying={isPlaying} />
            )}
         </div>
         <span className={s.sliderLabel}>
            {label && <span className={s.sliderLabelText}>{label}</span>}
            <span className={s.sliderValue}>{value}</span>
         </span>
         <span
            className={`${s.sliderLabel} ${s.sliderLabelLight}`}
            style={{ clipPath: `inset(0 calc(100% - max(${pct}%, 28px)) 0 0)` }}
         >
            {label && <span className={s.sliderLabelText}>{label}</span>}
            <span className={s.sliderValue}>{value}</span>
         </span>
      </div>
   );
}
