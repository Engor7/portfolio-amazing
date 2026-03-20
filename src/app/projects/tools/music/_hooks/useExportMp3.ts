"use client";

import lamejs from "@breezystack/lamejs";
import { useCallback, useRef, useState } from "react";
import type * as ToneNs from "tone";
import { INSTRUMENT_MAP } from "../_lib/constants";
import { createInstrument } from "../_lib/instruments";
import { createMasterChainSync } from "../_lib/masterChain";
import { ensureTone } from "../_lib/tone-lazy";
import type { NoteGrid, TrackConfig, VelocityGrid } from "../_lib/types";

function encodeMp3(buffer: AudioBuffer, kbps = 192): Blob {
   const numChannels = buffer.numberOfChannels;
   const sampleRate = buffer.sampleRate;
   const encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, kbps);
   const mp3Data: ArrayBuffer[] = [];
   const blockSize = 1152;

   const floatToInt16 = (f32: Float32Array): Int16Array => {
      const i16 = new Int16Array(f32.length);
      for (let i = 0; i < f32.length; i++) {
         const s = Math.max(-1, Math.min(1, f32[i]));
         i16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      return i16;
   };

   const left = floatToInt16(buffer.getChannelData(0));
   const right =
      numChannels > 1 ? floatToInt16(buffer.getChannelData(1)) : undefined;

   for (let i = 0; i < left.length; i += blockSize) {
      const leftChunk = left.subarray(i, i + blockSize);
      const mp3buf = right
         ? encoder.encodeBuffer(leftChunk, right.subarray(i, i + blockSize))
         : encoder.encodeBuffer(leftChunk);
      if (mp3buf.length > 0) mp3Data.push(mp3buf.buffer as ArrayBuffer);
   }

   const tail = encoder.flush();
   if (tail.length > 0) mp3Data.push(tail.buffer as ArrayBuffer);

   return new Blob(mp3Data, { type: "audio/mpeg" });
}

export function useExportMp3(
   tracks: TrackConfig[],
   grid: Record<string, boolean[][]>,
   activeEffects: Set<string>,
   noteGrid: NoteGrid,
   velocityGrid: VelocityGrid,
   stepCount: number,
   bpm: number,
) {
   const [exporting, setExporting] = useState(false);
   const exportingRef = useRef(false);
   const abortRef = useRef(false);

   const exportMp3 = useCallback(async () => {
      if (exportingRef.current) return;
      exportingRef.current = true;
      setExporting(true);
      abortRef.current = false;

      try {
         const Tone = await ensureTone();
         await Tone.start();

         const secondsPerStep = 60 / bpm / 4;
         const loops = 2;
         const totalSteps = stepCount * loops;
         const duration = totalSteps * secondsPerStep + 1;

         const buffer = await Tone.Offline(({ transport }) => {
            const { masterGain, hall, delay, wobble } = createMasterChainSync(
               Tone,
               Tone.getDestination(),
            );

            if (activeEffects.has("Hall")) {
               (
                  hall as unknown as { wet: ToneNs.Signal<"normalRange"> }
               ).wet.value = 0.35;
            }
            if (activeEffects.has("Delay")) {
               (
                  delay as unknown as { wet: ToneNs.Signal<"normalRange"> }
               ).wet.value = 0.25;
            }
            if (activeEffects.has("Wobble")) {
               wobble.wet.value = 0.4;
            }

            const nodes = new Map<
               string,
               {
                  instrument: ReturnType<typeof createInstrument>;
                  gain: ToneNs.Gain;
               }
            >();
            for (const track of tracks) {
               const gain = new Tone.Gain(
                  track.muted ? 0 : Tone.dbToGain(track.volume),
               );
               gain.connect(masterGain);
               const instrument = createInstrument(track.instrumentId, gain);
               nodes.set(track.id, { instrument, gain });
            }

            transport.bpm.value = bpm;
            for (let loopIdx = 0; loopIdx < loops; loopIdx++) {
               for (let step = 0; step < stepCount; step++) {
                  const absoluteStep = loopIdx * stepCount + step;
                  const time = absoluteStep * secondsPerStep;

                  transport.schedule((t) => {
                     for (const track of tracks) {
                        const trackGrid = grid[track.id];
                        if (!trackGrid?.[0]?.[step]) continue;

                        const node = nodes.get(track.id);
                        if (!node) continue;

                        const preset = INSTRUMENT_MAP.get(track.instrumentId);
                        if (!preset) continue;

                        const velocity = velocityGrid[track.id]?.[step] ?? 1;
                        const ngNote = noteGrid[track.id]?.[step];

                        if (ngNote) {
                           node.instrument.trigger(ngNote, t, velocity);
                        } else {
                           const note = preset.note;
                           if (typeof note === "string" && note.includes(",")) {
                              node.instrument.trigger(
                                 note.split(","),
                                 t,
                                 velocity,
                              );
                           } else {
                              node.instrument.trigger(note, t, velocity);
                           }
                        }
                     }
                  }, time);
               }
            }

            transport.start(0);
         }, duration);

         if (abortRef.current) return;

         const audioBuffer = (
            buffer as unknown as { get(): AudioBuffer }
         ).get();
         const mp3Blob = encodeMp3(audioBuffer);
         const url = URL.createObjectURL(mp3Blob);
         try {
            const a = document.createElement("a");
            a.href = url;
            a.download = "sequencer.mp3";
            a.click();
         } finally {
            setTimeout(() => URL.revokeObjectURL(url), 1000);
         }
      } finally {
         exportingRef.current = false;
         setExporting(false);
      }
   }, [tracks, grid, activeEffects, noteGrid, velocityGrid, stepCount, bpm]);

   return { exporting, exportMp3 };
}
