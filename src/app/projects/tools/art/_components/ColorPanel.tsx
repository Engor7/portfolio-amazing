"use client";

import { useEffect, useRef, useState } from "react";
import type { ThemeMode } from "../_lib/types";
import styles from "../art.module.scss";

const COLORS = [
   "#000000",
   "#ffffff",
   "#2d3436",
   "#ff6b6b",
   "#e17055",
   "#fdcb6e",
   "#00b894",
   "#00cec9",
   "#0984e3",
   "#6c5ce7",
   "#e84393",
   "#fab1a0",
   "#a29bfe",
];

interface ColorPanelProps {
   activeColor: string;
   onSelect: (color: string) => void;
   theme: ThemeMode;
}

const ColorPanel = ({ activeColor, onSelect, theme }: ColorPanelProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const wrapperRef = useRef<HTMLDivElement>(null);

   const filtered = COLORS.filter((c) =>
      theme === "dark" ? c !== "#000000" : c !== "#ffffff",
   );

   useEffect(() => {
      if (!isOpen) return;
      const handleClick = (e: MouseEvent) => {
         if (
            wrapperRef.current &&
            !wrapperRef.current.contains(e.target as Node)
         ) {
            setIsOpen(false);
         }
      };
      document.addEventListener("pointerdown", handleClick);
      return () => document.removeEventListener("pointerdown", handleClick);
   }, [isOpen]);

   const handleSelect = (color: string) => {
      onSelect(color);
      setIsOpen(false);
   };

   return (
      <div ref={wrapperRef} className={styles.colorPanelWrapper}>
         <button
            type="button"
            className={styles.colorPreview}
            onClick={() => setIsOpen((o) => !o)}
         >
            <div
               className={`${styles.colorPreviewInner} ${activeColor === "#000000" || activeColor === "#ffffff" ? styles.swatchBordered : ""}`}
               style={{ backgroundColor: activeColor }}
            />
         </button>
         <div
            className={`${styles.colorPanel} ${isOpen ? styles.colorPanelOpen : ""}`}
         >
            {filtered.map((color, index) => (
               <button
                  key={color}
                  type="button"
                  className={`${styles.swatch} ${color === "#000000" || color === "#ffffff" ? styles.swatchBordered : ""} ${activeColor === color ? styles.swatchActive : ""}`}
                  style={{
                     backgroundColor: color,
                     animationDelay: `${index * 50}ms`,
                  }}
                  onClick={() => handleSelect(color)}
               />
            ))}
         </div>
      </div>
   );
};

export default ColorPanel;
