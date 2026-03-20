"use client";

import type { CSSProperties } from "react";
import { memo, useCallback, useMemo } from "react";
import { getTrackColor } from "../_lib/themes";
import type { TrackConfig } from "../_lib/types";
import s from "../music.module.scss";
import { Cell } from "./Cell";
import { Slider } from "./Slider";

interface TrackRowProps {
   track: TrackConfig;
   cells: boolean[][];
   currentStep: number;
   onSetVolume: (trackId: string, volume: number) => void;
   onToggleMute: (trackId: string) => void;
   visibleStepCount: number;
   getTrackLevel: (trackId: string) => Float32Array | null;
   isPlaying: boolean;
}

export const TrackRow = memo(function TrackRow({
   track,
   cells,
   currentStep,
   onSetVolume,
   onToggleMute,
   visibleStepCount,
   getTrackLevel,
   isPlaying,
}: TrackRowProps) {
   const color = getTrackColor(track.instrumentId);

   const row = cells[0] ?? [];
   const visibleRow = row.slice(0, visibleStepCount);

   const handleVolume = useCallback(
      (v: number) => onSetVolume(track.id, v),
      [onSetVolume, track.id],
   );

   const getLevel = useMemo(
      () => () => getTrackLevel(track.id),
      [getTrackLevel, track.id],
   );

   return (
      <div
         className={s.trackRow}
         style={{ "--track-color": color } as CSSProperties}
      >
         <div className={s.trackLabel}>
            <Slider
               value={track.volume}
               min={-24}
               max={6}
               onChange={handleVolume}
               label={track.label}
               color={color}
               getLevel={getLevel}
               isPlaying={isPlaying}
            />
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
         <button
            type="button"
            className={`${s.muteBtn} ${track.muted ? s.muteBtnActive : ""}`}
            onClick={() => onToggleMute(track.id)}
            title="Mute"
         >
            M
         </button>
      </div>
   );
});
