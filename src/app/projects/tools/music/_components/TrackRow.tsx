"use client";

import { memo, useCallback, useState } from "react";
import { INSTRUMENT_CATALOG } from "../_lib/constants";
import type { TrackConfig } from "../_lib/types";
import s from "../music.module.scss";
import { Cell } from "./Cell";
import { Slider } from "./Slider";
import { TrackSettingsModal } from "./TrackSettingsModal";

interface TrackRowProps {
   track: TrackConfig;
   cells: boolean[][];
   currentStep: number;
   onSetVolume: (trackId: string, volume: number) => void;
   onToggleMute: (trackId: string) => void;
   onRemove: (trackId: string) => void;
   visibleStepCount: number;
   isMobile: boolean;
}

export const TrackRow = memo(function TrackRow({
   track,
   cells,
   currentStep,
   onSetVolume,
   onToggleMute,
   onRemove,
   visibleStepCount,
   isMobile,
}: TrackRowProps) {
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   const preset = INSTRUMENT_CATALOG.find((p) => p.id === track.instrumentId);
   const color = preset?.color ?? "#888";

   const handleVolumeChange = useCallback(
      (v: number) => {
         onSetVolume(track.id, v);
      },
      [track.id, onSetVolume],
   );

   const row = cells[0] ?? [];
   const visibleRow = row.slice(0, visibleStepCount);

   return (
      <>
         <div
            className={s.trackRow}
            style={{ "--track-color": color } as React.CSSProperties}
         >
            <div className={s.trackLabel}>
               <span className={s.trackDot} style={{ background: color }} />
               <span className={s.trackName}>{track.label}</span>
               {isMobile && (
                  <button
                     type="button"
                     className={s.trackSettingsBtn}
                     onClick={() => setIsSettingsOpen(true)}
                     title="Track settings"
                  >
                     ⚙️
                  </button>
               )}
            </div>
            <div className={s.trackCells}>
               {visibleRow.map((active, i) => (
                  <Cell
                     key={`${track.id}-0-${i}`}
                     active={active}
                     isCurrent={currentStep === i}
                     color={color}
                     groupStart={i % 4 === 0 && i !== 0}
                     trackId={track.id}
                     step={i}
                  />
               ))}
            </div>
            <div className={s.trackControls}>
               <Slider
                  min={-24}
                  max={6}
                  value={track.volume}
                  onChange={handleVolumeChange}
                  color={color}
               />
               <button
                  type="button"
                  className={`${s.muteBtn} ${track.muted ? s.muteBtnActive : ""}`}
                  onClick={() => onToggleMute(track.id)}
                  title={track.muted ? "Unmute" : "Mute"}
               >
                  M
               </button>
               <button
                  type="button"
                  className={s.removeBtn}
                  onClick={() => onRemove(track.id)}
                  title="Remove track"
               >
                  ✕
               </button>
            </div>
         </div>
         {isMobile && (
            <TrackSettingsModal
               track={track}
               isOpen={isSettingsOpen}
               onClose={() => setIsSettingsOpen(false)}
               onSetVolume={onSetVolume}
               onToggleMute={onToggleMute}
               onRemove={onRemove}
               color={color}
            />
         )}
      </>
   );
});
