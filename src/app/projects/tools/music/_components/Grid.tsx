"use client";

import type { PointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { INSTRUMENT_MAP } from "../_lib/constants";
import type { TrackConfig } from "../_lib/types";
import s from "../music.module.scss";
import { TrackRow } from "./TrackRow";

interface GridProps {
   tracks: TrackConfig[];
   grid: Record<string, boolean[][]>;
   currentStep: number;
   onToggleCell: (trackId: string, pitchRow: number, step: number) => void;
   onSetVolume: (trackId: string, volume: number) => void;
   onToggleMute: (trackId: string) => void;
   visibleStepCount: number;
   getTrackLevel: (trackId: string) => Float32Array | null;
   isPlaying: boolean;
}

function parseCellAttr(
   el: Element | null,
): { trackId: string; step: number } | null {
   const attr = el?.getAttribute("data-cell");
   if (!attr) return null;
   const [trackId, stepStr] = attr.split(":");
   const step = Number(stepStr);
   if (!trackId || Number.isNaN(step)) return null;
   return { trackId, step };
}

export function Grid({
   tracks,
   grid,
   currentStep,
   onToggleCell,
   onSetVolume,
   onToggleMute,
   visibleStepCount,
   getTrackLevel,
   isPlaying,
}: GridProps) {
   const { drumTracks, melodicTracks } = useMemo(() => {
      const drums: TrackConfig[] = [];
      const melodic: TrackConfig[] = [];
      for (const track of tracks) {
         const preset = INSTRUMENT_MAP.get(track.instrumentId);
         if (preset?.kind === "drum") drums.push(track);
         else melodic.push(track);
      }
      return { drumTracks: drums, melodicTracks: melodic };
   }, [tracks]);

   const containerRef = useRef<HTMLDivElement>(null);
   const paintRef = useRef<{
      active: boolean;
      // true = painting ON, false = painting OFF (erasing)
      mode: boolean;
      visited: Set<string>;
   }>({ active: false, mode: true, visited: new Set() });
   const gridRef = useRef(grid);
   gridRef.current = grid;

   const handleCellFromPointer = useCallback(
      (el: Element | null, isStart: boolean) => {
         const cell = parseCellAttr(el);
         if (!cell) return;

         const paint = paintRef.current;
         const key = `${cell.trackId}:${cell.step}`;

         if (isStart) {
            const isActive =
               gridRef.current[cell.trackId]?.[0]?.[cell.step] ?? false;
            paint.active = true;
            paint.mode = !isActive; // if was off → paint on, if was on → erase
            paint.visited = new Set([key]);
            onToggleCell(cell.trackId, 0, cell.step);
            return;
         }

         if (!paint.active) return;
         if (paint.visited.has(key)) return;

         const isActive =
            gridRef.current[cell.trackId]?.[0]?.[cell.step] ?? false;
         // Only toggle if the cell state differs from our paint mode
         if (isActive !== paint.mode) {
            paint.visited.add(key);
            onToggleCell(cell.trackId, 0, cell.step);
         }
      },
      [onToggleCell],
   );

   const onPointerDown = useCallback(
      (e: PointerEvent) => {
         const target = (e.target as Element).closest("[data-cell]");
         if (!target) return;
         e.preventDefault();
         handleCellFromPointer(target, true);
      },
      [handleCellFromPointer],
   );

   const onPointerMove = useCallback(
      (e: PointerEvent) => {
         if (!paintRef.current.active) return;
         e.preventDefault();
         // Use elementFromPoint so it works across different cells
         const el = document.elementFromPoint(e.clientX, e.clientY);
         const target = el?.closest("[data-cell]") ?? null;
         handleCellFromPointer(target, false);
      },
      [handleCellFromPointer],
   );

   const stopPaint = useCallback(() => {
      paintRef.current.active = false;
   }, []);

   // Global pointerup to catch release outside the grid
   useEffect(() => {
      const handler = () => {
         paintRef.current.active = false;
      };
      window.addEventListener("pointerup", handler);
      window.addEventListener("pointercancel", handler);
      return () => {
         window.removeEventListener("pointerup", handler);
         window.removeEventListener("pointercancel", handler);
      };
   }, []);

   return (
      <div
         ref={containerRef}
         className={s.grid}
         onPointerDown={onPointerDown}
         onPointerMove={onPointerMove}
         onPointerUp={stopPaint}
         onPointerCancel={stopPaint}
         style={{ touchAction: "none" }}
      >
         {drumTracks.map((track) => (
            <TrackRow
               key={track.id}
               track={track}
               cells={grid[track.id] ?? []}
               currentStep={currentStep}
               onSetVolume={onSetVolume}
               onToggleMute={onToggleMute}
               visibleStepCount={visibleStepCount}
               getTrackLevel={getTrackLevel}
               isPlaying={isPlaying}
            />
         ))}
         {melodicTracks.map((track) => (
            <TrackRow
               key={track.id}
               track={track}
               cells={grid[track.id] ?? []}
               currentStep={currentStep}
               onSetVolume={onSetVolume}
               onToggleMute={onToggleMute}
               visibleStepCount={visibleStepCount}
               getTrackLevel={getTrackLevel}
               isPlaying={isPlaying}
            />
         ))}
      </div>
   );
}
