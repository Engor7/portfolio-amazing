"use client";

import type { ReactNode } from "react";
import s from "../music.module.scss";
import { ClearIcon, DownloadIcon, PauseIcon, PlayIcon } from "./icons";
import { Slider } from "./Slider";

interface TransportBarProps {
   isPlaying: boolean;
   bpm: number;
   onToggle: () => void;
   onBpmChange: (bpm: number) => void;
   onClear: () => void;
   onDownload?: () => void;
   isDownloading?: boolean;
   canDownload?: boolean;
   canClear?: boolean;
   children?: ReactNode;
}

export function TransportBar({
   isPlaying,
   bpm,
   onToggle,
   onBpmChange,
   onClear,
   onDownload,
   isDownloading = false,
   canDownload = true,
   canClear = true,
   children,
}: TransportBarProps) {
   return (
      <div className={s.transport}>
         <button
            type="button"
            className={`${s.playBtn} ${isPlaying ? s.playBtnActive : ""}`}
            onClick={onToggle}
            title={isPlaying ? "Stop playback" : "Start playback"}
         >
            {isPlaying ? <PauseIcon width={16} height={16} /> : <PlayIcon width={16} height={16} />}
         </button>

         <div className={s.transportGroup}>
            <Slider
               min={60}
               max={200}
               value={bpm}
               onChange={onBpmChange}
               label="BPM"
               color="#7ab88c"
            />
         </div>

         {children}

         <div className={s.transportActions}>
            {onDownload && (
               <button
                  type="button"
                  className={s.clearBtn}
                  onClick={onDownload}
                  disabled={!canDownload || isDownloading}
                  title="Download as MP3"
               >
                  <DownloadIcon width={16} height={16} />
                  <span className={s.btnLabel}>Download</span>
               </button>
            )}
            <button
               type="button"
               className={s.clearBtn}
               onClick={onClear}
               disabled={!canClear}
               title="Clear all cells"
            >
               <ClearIcon width={16} height={16} />
               <span className={s.btnLabel}>Clear</span>
            </button>
         </div>
      </div>
   );
}
