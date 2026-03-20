"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
   DEFAULT_BPM,
   DEFAULT_STEPS,
   DEFAULT_TRACKS,
   INSTRUMENT_CATALOG,
} from "../_lib/constants";
import {
   generateHarmonicContext,
   generateNoteGrid,
   generateVelocityGrid,
   getNoteForCell,
} from "../_lib/musicTheory";
import type {
   HarmonicContext,
   InstrumentId,
   NoteGrid,
   TrackConfig,
   VelocityGrid,
} from "../_lib/types";

// Per-role volume offsets so instruments sit better in the mix
const ROLE_VOLUMES: Record<string, number> = {
   bass: -6,
   lead: -12,
   arpeggio: -18,
   pad: -22,
   chord: -16,
   bell: -20,
   drum: -8,
};

function makeTrack(
   instrumentId: InstrumentId,
   counterRef: { current: number },
): TrackConfig {
   const preset = INSTRUMENT_CATALOG.find((p) => p.id === instrumentId);
   if (!preset) throw new Error(`Unknown instrument: ${instrumentId}`);
   counterRef.current += 1;
   const role = preset.kind === "drum" ? "drum" : (preset.role ?? "lead");
   return {
      id: `track-${counterRef.current}`,
      instrumentId,
      label: preset.label,
      note: preset.note,
      volume: ROLE_VOLUMES[role] ?? -10,
      muted: false,
   };
}

function makeGrid(
   tracks: TrackConfig[],
   stepCount: number,
   prevGrid: Record<string, boolean[][]>,
): Record<string, boolean[][]> {
   const grid: Record<string, boolean[][]> = {};
   for (const t of tracks) {
      const prev = prevGrid[t.id];
      if (prev) {
         const prevRow = prev[0];
         if (prevRow) {
            if (prevRow.length === stepCount) {
               grid[t.id] = [prevRow];
            } else if (prevRow.length < stepCount) {
               grid[t.id] = [
                  [
                     ...prevRow,
                     ...Array(stepCount - prevRow.length).fill(false),
                  ],
               ];
            } else {
               grid[t.id] = [prevRow.slice(0, stepCount)];
            }
         } else {
            grid[t.id] = [Array(stepCount).fill(false)];
         }
      } else {
         grid[t.id] = [Array(stepCount).fill(false)];
      }
   }
   return grid;
}

export function useSequencer() {
   const trackIdCounter = useRef(0);
   const [bpm, setBpm] = useState(DEFAULT_BPM);
   const stepCount = DEFAULT_STEPS;

   // Compute all initial state together so tracks/grids are consistent
   const [initialState] = useState(() => {
      const hc = generateHarmonicContext();
      const t = DEFAULT_TRACKS.map((id) => makeTrack(id, trackIdCounter));
      const g = makeGrid(t, DEFAULT_STEPS, {});
      const ng = generateNoteGrid(hc, t, DEFAULT_STEPS);
      const vg = generateVelocityGrid(t, DEFAULT_STEPS);
      return { hc, t, g, ng, vg };
   });

   const [harmonicContext, setHarmonicContext] = useState<HarmonicContext>(
      initialState.hc,
   );
   const [tracks, setTracks] = useState<TrackConfig[]>(initialState.t);
   const [grid, setGrid] = useState<Record<string, boolean[][]>>(
      initialState.g,
   );
   const [noteGrid, setNoteGrid] = useState<NoteGrid>(initialState.ng);
   const [velocityGrid, setVelocityGrid] = useState<VelocityGrid>(
      initialState.vg,
   );

   const toggleCell = useCallback(
      (trackId: string, pitchRow: number, step: number) => {
         setGrid((prev) => {
            const trackGrid = prev[trackId];
            if (!trackGrid) return prev;
            const wasActive = trackGrid[pitchRow]?.[step] ?? false;
            const willBeActive = !wasActive;

            // When toggling ON, compute a note for this cell
            if (willBeActive) {
               const track = tracks.find((t) => t.id === trackId);
               if (track) {
                  const note = getNoteForCell(
                     harmonicContext,
                     track,
                     step,
                     stepCount,
                  );
                  if (note !== null) {
                     setNoteGrid((prevNg) => {
                        const row = prevNg[trackId]
                           ? [...prevNg[trackId]]
                           : Array(stepCount).fill(null);
                        row[step] = note;
                        return { ...prevNg, [trackId]: row };
                     });
                  }
               }
            }

            return {
               ...prev,
               [trackId]: trackGrid.map((row, r) =>
                  r === pitchRow
                     ? row.map((v, i) => (i === step ? !v : v))
                     : row,
               ),
            };
         });
      },
      [tracks, harmonicContext, stepCount],
   );

   const setTrackVolume = useCallback((trackId: string, volume: number) => {
      setTracks((prev) =>
         prev.map((t) => (t.id === trackId ? { ...t, volume } : t)),
      );
   }, []);

   const toggleMute = useCallback((trackId: string) => {
      setTracks((prev) =>
         prev.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t)),
      );
   }, []);

   const clearAll = useCallback(() => {
      setGrid((prev) => {
         const next: Record<string, boolean[][]> = {};
         for (const key of Object.keys(prev)) {
            next[key] = prev[key].map((row) => Array(row.length).fill(false));
         }
         return next;
      });
      setNoteGrid({});
   }, []);

   const applyGrid = useCallback((newGrid: Record<string, boolean[][]>) => {
      setGrid(newGrid);
   }, []);

   const applyNoteGrid = useCallback((newNoteGrid: NoteGrid) => {
      setNoteGrid(newNoteGrid);
   }, []);

   const applyVelocityGrid = useCallback((newVelocityGrid: VelocityGrid) => {
      setVelocityGrid(newVelocityGrid);
   }, []);

   const hasActiveCells = useMemo(
      () =>
         Object.values(grid).some((rows) =>
            rows.some((row) => row.some(Boolean)),
         ),
      [grid],
   );

   return {
      tracks,
      grid,
      noteGrid,
      velocityGrid,
      harmonicContext,
      stepCount,
      bpm,
      setBpm,
      toggleCell,
      setTrackVolume,
      toggleMute,
      hasActiveCells,
      clearAll,
      applyGrid,
      applyNoteGrid,
      applyVelocityGrid,
      setHarmonicContext,
   };
}
