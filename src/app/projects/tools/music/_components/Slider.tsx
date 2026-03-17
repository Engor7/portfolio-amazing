"use client";

import { useCallback, useRef } from "react";
import s from "../music.module.scss";

interface SliderProps {
   value: number;
   min: number;
   max: number;
   step?: number;
   onChange: (v: number) => void;
   label?: string;
   color?: string;
}

export function Slider({
   value,
   min,
   max,
   step = 1,
   onChange,
   label,
   color = "#888",
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
      (e: React.PointerEvent) => {
         e.preventDefault();
         dragging.current = true;
         (e.target as HTMLElement).setPointerCapture(e.pointerId);
         onChange(valueFromPointer(e.clientX));
      },
      [onChange, valueFromPointer],
   );

   const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
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
         style={{ "--slider-color": color } as React.CSSProperties}
         onPointerDown={handlePointerDown}
         onPointerMove={handlePointerMove}
         onPointerUp={handlePointerUp}
         onPointerCancel={handlePointerUp}
      >
         <div className={s.sliderFill} style={{ width: `${pct}%` }} />
         <span className={s.sliderLabel}>
            {label && <span className={s.sliderLabelText}>{label}</span>}
            {value}
         </span>
      </div>
   );
}
