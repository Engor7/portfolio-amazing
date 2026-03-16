"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../art.module.scss";

interface SizeSliderProps {
   value: number;
   min: number;
   max: number;
   onChange: (v: number) => void;
}

const SizeSlider = ({ value, min, max, onChange }: SizeSliderProps) => {
   const trackRef = useRef<HTMLDivElement>(null);
   const dragging = useRef(false);
   const [displayValue, setDisplayValue] = useState(0);
   const mounted = useRef(false);

   useEffect(() => {
      if (mounted.current) {
         setDisplayValue(value);
         return;
      }
      mounted.current = true;
      const target = value;
      const delay = 750;
      const duration = 600;
      const timer = setTimeout(() => {
         const start = performance.now();
         const animate = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - (1 - t) ** 3;
            setDisplayValue(Math.round(eased * target));
            if (t < 1) requestAnimationFrame(animate);
         };
         requestAnimationFrame(animate);
      }, delay);
      return () => clearTimeout(timer);
   }, [value]);

   const valueFromPointer = useCallback(
      (clientX: number) => {
         const track = trackRef.current;
         if (!track) return value;
         const rect = track.getBoundingClientRect();
         const ratio = (clientX - rect.left) / rect.width;
         const clamped = Math.max(0, Math.min(1, ratio));
         return Math.round(min + clamped * (max - min));
      },
      [min, max, value],
   );

   const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
         e.preventDefault();
         e.stopPropagation();
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
         e.stopPropagation();
         onChange(valueFromPointer(e.clientX));
      },
      [onChange, valueFromPointer],
   );

   const handlePointerUp = useCallback((e: React.PointerEvent) => {
      if (!dragging.current) return;
      e.stopPropagation();
      dragging.current = false;
   }, []);

   const pct = ((displayValue - min) / (max - min)) * 100;
   const minWidth = 36;

   return (
      <div
         ref={trackRef}
         className={styles.sizeSlider}
         onPointerDown={handlePointerDown}
         onPointerMove={handlePointerMove}
         onPointerUp={handlePointerUp}
         onPointerCancel={handlePointerUp}
      >
         <div
            className={styles.sizeSliderFill}
            style={{ width: `max(${minWidth}px, calc(${pct}% - 8px))` }}
         >
            <span className={styles.sizeSliderLabel}>{displayValue}</span>
         </div>
      </div>
   );
};

export default SizeSlider;
