"use client";

import { useCallback, useEffect, useRef } from "react";
import type * as ToneNs from "tone";
import { INSTRUMENT_CATALOG } from "../_lib/constants";
import {
   createInstrument,
   type SequencerInstrument,
} from "../_lib/instruments";
import { tone } from "../_lib/tone-lazy";
import type { NoteGrid, TrackConfig, VelocityGrid } from "../_lib/types";

interface TrackNode {
   instrument: SequencerInstrument;
   gain: ToneNs.Gain;
}

type WetNode = ToneNs.ToneAudioNode & { wet: ToneNs.Signal<"normalRange"> };

interface FxNode {
   node: WetNode;
   targetWet: number;
}

function asWetNode(
   node: ToneNs.Reverb | ToneNs.PingPongDelay | ToneNs.AutoFilter,
): WetNode {
   return node as WetNode;
}

const FX_CONFIG = {
   Hall: { targetWet: 0.35 },
   Delay: { targetWet: 0.25 },
   Wobble: { targetWet: 0.4 },
} as const;

interface MasterChain {
   masterGain: ToneNs.Gain;
   compressor: ToneNs.Compressor;
   limiter: ToneNs.Limiter;
   hall: ToneNs.Reverb;
   delay: ToneNs.PingPongDelay;
   wobble: ToneNs.AutoFilter;
}

export function useAudioEngine(
   tracks: TrackConfig[],
   grid: Record<string, boolean[][]>,
   activeEffects: Set<string>,
   noteGrid: NoteGrid = {},
   velocityGrid: VelocityGrid = {},
) {
   const nodesRef = useRef<Map<string, TrackNode>>(new Map());
   const gridRef = useRef(grid);
   const tracksRef = useRef(tracks);
   const noteGridRef = useRef(noteGrid);
   const velocityGridRef = useRef(velocityGrid);
   const masterGainRef = useRef<ToneNs.Gain | null>(null);
   const fxRef = useRef<Map<string, FxNode>>(new Map());
   const chainRef = useRef<MasterChain | null>(null);
   const initializedRef = useRef(false);
   const audioErrorRef = useRef<string | null>(null);

   gridRef.current = grid;
   tracksRef.current = tracks;
   noteGridRef.current = noteGrid;
   velocityGridRef.current = velocityGrid;

   // Lazy init — called after Tone.start() from a user gesture
   const initAudio = useCallback(async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
         const Tone = tone();

         const masterGain = new Tone.Gain(0.55);

         const compressor = new Tone.Compressor({
            threshold: -12,
            ratio: 2.5,
            attack: 0.01,
            release: 0.15,
            knee: 10,
         });

         const limiter = new Tone.Limiter(-3);

         const hall = new Tone.Reverb({ decay: 1.5, preDelay: 0.03, wet: 0 });
         await hall.ready;
         const delay = new Tone.PingPongDelay({
            delayTime: "8n",
            feedback: 0.2,
            wet: 0,
         });
         const wobble = new Tone.AutoFilter({
            frequency: 1.5,
            baseFrequency: 200,
            octaves: 3,
         }).start();
         wobble.wet.value = 0;

         masterGain.chain(
            compressor,
            hall,
            delay,
            wobble,
            limiter,
            Tone.getDestination(),
         );

         masterGainRef.current = masterGain;
         chainRef.current = {
            masterGain,
            compressor,
            limiter,
            hall,
            delay,
            wobble,
         };
         fxRef.current = new Map([
            [
               "Hall",
               {
                  node: asWetNode(hall),
                  targetWet: FX_CONFIG.Hall.targetWet,
               },
            ],
            [
               "Delay",
               {
                  node: asWetNode(delay),
                  targetWet: FX_CONFIG.Delay.targetWet,
               },
            ],
            [
               "Wobble",
               {
                  node: asWetNode(wobble),
                  targetWet: FX_CONFIG.Wobble.targetWet,
               },
            ],
         ]);

         // Apply current active effects
         for (const [name, fx] of fxRef.current) {
            fx.node.wet.value = activeEffects.has(name) ? fx.targetWet : 0;
         }

         // Create initial instruments for current tracks
         const Tone2 = tone();
         for (const track of tracksRef.current) {
            if (!nodesRef.current.has(track.id)) {
               const gain = new Tone2.Gain(Tone2.dbToGain(track.volume));
               gain.connect(masterGain);
               try {
                  const instrument = createInstrument(track.instrumentId, gain);
                  nodesRef.current.set(track.id, { instrument, gain });
               } catch (error) {
                  // AudioWorkletNode not available — create silent fallback
                  const fallback: SequencerInstrument = {
                     trigger: () => {},
                     dispose: () => gain.dispose(),
                  };
                  nodesRef.current.set(track.id, { instrument: fallback, gain });
               }
            }
         }
      } catch (error) {
         // Audio context initialization failed (insecure context)
         audioErrorRef.current =
            "Audio not available. Use HTTPS or localhost.";
         initializedRef.current = false;
      }
   }, [activeEffects]);

   // Sync active effects (only when initialized)
   useEffect(() => {
      if (!initializedRef.current) return;
      for (const [name, fx] of fxRef.current) {
         fx.node.wet.value = activeEffects.has(name) ? fx.targetWet : 0;
      }
   }, [activeEffects]);

   // Sync instruments with tracks (only when initialized)
   useEffect(() => {
      if (!initializedRef.current) return;
      const Tone = tone();
      const master = masterGainRef.current;
      if (!master) return;

      const nodes = nodesRef.current;
      const currentIds = new Set(tracks.map((t) => t.id));

      // Remove old
      for (const [id, node] of nodes) {
         if (!currentIds.has(id)) {
            node.instrument.dispose();
            node.gain.dispose();
            nodes.delete(id);
         }
      }

      // Add new
      for (const track of tracks) {
         if (!nodes.has(track.id)) {
            const gain = new Tone.Gain(Tone.dbToGain(track.volume));
            gain.connect(master);
            try {
               const instrument = createInstrument(track.instrumentId, gain);
               nodes.set(track.id, { instrument, gain });
            } catch {
               // AudioWorkletNode not available — create silent fallback
               const fallback: SequencerInstrument = {
                  trigger: () => {},
                  dispose: () => gain.dispose(),
               };
               nodes.set(track.id, { instrument: fallback, gain });
            }
         }
      }
   }, [tracks]);

   // Sync volume/mute (only when initialized)
   useEffect(() => {
      if (!initializedRef.current) return;
      const Tone = tone();
      const nodes = nodesRef.current;
      for (const track of tracks) {
         const node = nodes.get(track.id);
         if (node) {
            node.gain.gain.value = track.muted
               ? 0
               : Tone.dbToGain(track.volume);
         }
      }
   }, [tracks]);

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         for (const node of nodesRef.current.values()) {
            node.instrument.dispose();
            node.gain.dispose();
         }
         nodesRef.current.clear();

         const chain = chainRef.current;
         if (chain) {
            chain.masterGain.dispose();
            chain.compressor.dispose();
            chain.limiter.dispose();
            chain.hall.dispose();
            chain.delay.dispose();
            chain.wobble.stop();
            chain.wobble.dispose();
            chainRef.current = null;
         }
         initializedRef.current = false;
      };
   }, []);

   const triggerStep = useCallback((step: number, time?: number) => {
      if (!initializedRef.current) return;

      const currentGrid = gridRef.current;
      const currentTracks = tracksRef.current;
      const currentNoteGrid = noteGridRef.current;
      const currentVelocityGrid = velocityGridRef.current;

      for (const track of currentTracks) {
         const trackGrid = currentGrid[track.id];
         if (!trackGrid) continue;

         const node = nodesRef.current.get(track.id);
         if (!node) continue;

         const preset = INSTRUMENT_CATALOG.find(
            (p) => p.id === track.instrumentId,
         );
         if (!preset) continue;

         // Single row per track — check row 0
         if (trackGrid[0]?.[step]) {
            const velocity = currentVelocityGrid[track.id]?.[step] ?? 1;
            // Use noteGrid note if available, otherwise fall back to preset
            const ngNote = currentNoteGrid[track.id]?.[step];
            if (ngNote) {
               node.instrument.trigger(ngNote, time, velocity);
            } else {
               const note = preset.note;
               if (typeof note === "string" && note.includes(",")) {
                  node.instrument.trigger(note.split(","), time, velocity);
               } else {
                  node.instrument.trigger(note, time, velocity);
               }
            }
         }
      }
   }, []);

   return { triggerStep, initAudio, audioError: audioErrorRef.current };
}
