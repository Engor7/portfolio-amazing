"use client";

import { useCallback, useRef, useState } from "react";
import {
   DEFAULT_BPM,
   DEFAULT_STEPS,
   DEFAULT_TRACKS,
   INSTRUMENT_CATALOG,
   MAX_STEPS,
   MAX_TRACKS,
   MIN_STEPS,
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
   const [stepCount, setStepCount] = useState(DEFAULT_STEPS);

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

   const addTrack = useCallback(
      (instrumentId: InstrumentId) => {
         setTracks((prev) => {
            if (prev.length >= MAX_TRACKS) return prev;
            const track = makeTrack(instrumentId, trackIdCounter);
            setGrid((prevGrid) => ({
               ...prevGrid,
               [track.id]: [Array(stepCount).fill(false)],
            }));
            return [...prev, track];
         });
      },
      [stepCount],
   );

   const addAllTracks = useCallback(() => {
      setTracks((prev) => {
         const existing = new Set(prev.map((t) => t.instrumentId));
         const missing = INSTRUMENT_CATALOG.filter((p) => !existing.has(p.id));
         const toAdd = missing.slice(0, MAX_TRACKS - prev.length);
         if (toAdd.length === 0) return prev;
         const newTracks = toAdd.map((p) => makeTrack(p.id, trackIdCounter));
         setGrid((prevGrid) => {
            const additions: Record<string, boolean[][]> = {};
            for (const t of newTracks) {
               additions[t.id] = [Array(stepCount).fill(false)];
            }
            return { ...prevGrid, ...additions };
         });
         return [...prev, ...newTracks];
      });
   }, [stepCount]);

   const removeTrack = useCallback((trackId: string) => {
      setTracks((prev) => prev.filter((t) => t.id !== trackId));
      setGrid((prev) => {
         const next = { ...prev };
         delete next[trackId];
         return next;
      });
   }, []);

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

   const changeStepCount = useCallback(
      (delta: number) => {
         setStepCount((prev) => {
            const next = Math.max(MIN_STEPS, Math.min(MAX_STEPS, prev + delta));
            if (next !== prev) {
               setGrid((prevGrid) => makeGrid(tracks, next, prevGrid));
               setNoteGrid((prevNg) => {
                  const resized: NoteGrid = {};
                  for (const [key, row] of Object.entries(prevNg)) {
                     if (row.length >= next) {
                        resized[key] = row.slice(0, next);
                     } else {
                        resized[key] = [
                           ...row,
                           ...Array(next - row.length).fill(null),
                        ];
                     }
                  }
                  return resized;
               });
            }
            return next;
         });
      },
      [tracks],
   );

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
      addTrack,
      addAllTracks,
      removeTrack,
      setTrackVolume,
      toggleMute,
      changeStepCount,
      clearAll,
      applyGrid,
      applyNoteGrid,
      applyVelocityGrid,
      setHarmonicContext,
   };
}
