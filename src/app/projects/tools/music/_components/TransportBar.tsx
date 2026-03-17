"use client";

import type { ReactNode } from "react";
import s from "../music.module.scss";
import { Slider } from "./Slider";

interface TransportBarProps {
   isPlaying: boolean;
   bpm: number;
   stepCount: number;
   onToggle: () => void;
   onBpmChange: (bpm: number) => void;
   onStepChange: (delta: number) => void;
   onClear: () => void;
   children?: ReactNode;
   isMobile?: boolean;
}

export function TransportBar({
   isPlaying,
   bpm,
   stepCount,
   onToggle,
   onBpmChange,
   onStepChange,
   onClear,
   children,
   isMobile = false,
}: TransportBarProps) {
   return (
      <div className={s.transport}>
         <button
            type="button"
            className={`${s.playBtn} ${isPlaying ? s.playBtnActive : ""}`}
            onClick={onToggle}
            title={isPlaying ? "Stop playback" : "Start playback"}
         >
            {isPlaying ? "⏹" : "▶"}
         </button>

         {!isMobile && (
            <>
               <div className={s.transportGroup}>
                  <Slider
                     min={60}
                     max={200}
                     value={bpm}
                     onChange={onBpmChange}
                     label="BPM"
                     color="#22c55e"
                  />
               </div>

               <div className={s.transportGroup}>
                  <span className={s.transportLabel}>
                     Steps
                     <span className={s.transportValue}>{stepCount}</span>
                  </span>
                  <div className={s.stepBtns}>
                     <button
                        type="button"
                        className={s.stepBtn}
                        onClick={() => onStepChange(-4)}
                        title="Remove 4 steps"
                     >
                        −
                     </button>
                     <button
                        type="button"
                        className={s.stepBtn}
                        onClick={() => onStepChange(4)}
                        title="Add 4 steps"
                     >
                        +
                     </button>
                  </div>
               </div>
            </>
         )}

         {children}

         {!isMobile && (
            <button
               type="button"
               className={s.clearBtn}
               onClick={onClear}
               title="Clear all cells"
            >
               Clear
            </button>
         )}
      </div>
   );
}
