"use client";

import { useEffect, useRef, useState } from "react";
import type * as ToneNs from "tone";
import { tone } from "../_lib/tone-lazy";

const FFT_SIZE = 64;

export function useAnalyser(isPlaying: boolean) {
   const analyserRef = useRef<ToneNs.Analyser | null>(null);
   const rafRef = useRef<number>(0);
   const [data, setData] = useState<Float32Array | null>(null);

   useEffect(() => {
      if (!isPlaying) {
         cancelAnimationFrame(rafRef.current);
         setData(null);
         return;
      }

      // Create analyser lazily — Tone is already loaded when isPlaying is true
      if (!analyserRef.current) {
         try {
            const Tone = tone();
            const analyser = new Tone.Analyser("fft", FFT_SIZE);
            Tone.getDestination().connect(analyser);
            analyserRef.current = analyser;
         } catch {
            return;
         }
      }

      const tick = () => {
         const analyser = analyserRef.current;
         if (analyser) {
            const values = analyser.getValue();
            if (values instanceof Float32Array) {
               setData(new Float32Array(values));
            }
         }
         rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
   }, [isPlaying]);

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         analyserRef.current?.dispose();
         analyserRef.current = null;
      };
   }, []);

   return data;
}
