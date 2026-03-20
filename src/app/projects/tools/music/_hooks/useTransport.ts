"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type * as ToneNs from "tone";
import { ensureTone, tone } from "../_lib/tone-lazy";

export function useTransport(
   stepCount: number,
   bpm: number,
   onStep: (step: number, time: number) => void,
   onBeforeStart?: () => void | Promise<void>,
) {
   const [isPlaying, setIsPlaying] = useState(false);
   const [currentStep, setCurrentStep] = useState(-1);
   const stepRef = useRef(0);
   const onStepRef = useRef(onStep);
   const stepCountRef = useRef(stepCount);
   const eventIdRef = useRef<number | null>(null);
   const onBeforeStartRef = useRef(onBeforeStart);

   onStepRef.current = onStep;
   onBeforeStartRef.current = onBeforeStart;
   stepCountRef.current = stepCount;

   const bpmRef = useRef(bpm);
   bpmRef.current = bpm;
   useEffect(() => {
      try {
         const Tone = tone();
         Tone.getTransport().bpm.value = bpm;
      } catch {
         // Tone not loaded yet — bpm will be set on play()
      }
   }, [bpm]);

   useEffect(() => {
      return () => {
         try {
            const Tone = tone();
            if (eventIdRef.current !== null) {
               Tone.getTransport().clear(eventIdRef.current);
            }
            Tone.getTransport().stop();
         } catch {
            // Tone not loaded — nothing to clean up
         }
      };
   }, []);

   const play = useCallback(async () => {
      let Tone: typeof ToneNs;
      try {
         Tone = await ensureTone();
         await Tone.start();
      } catch {
         return;
      }
      await onBeforeStartRef.current?.();
      const transport = Tone.getTransport();
      transport.seconds = 0;

      stepRef.current = 0;
      transport.bpm.value = bpmRef.current;

      if (eventIdRef.current !== null) {
         transport.clear(eventIdRef.current);
      }

      eventIdRef.current = transport.scheduleRepeat((time) => {
         const step = stepRef.current % stepCountRef.current;
         onStepRef.current(step, time);
         Tone.getDraw().schedule(() => {
            setCurrentStep(step);
         }, time);
         stepRef.current = (stepRef.current + 1) % stepCountRef.current;
      }, "16n");

      transport.start();
      setIsPlaying(true);
   }, []);

   const stop = useCallback(() => {
      try {
         const Tone = tone();
         const transport = Tone.getTransport();
         transport.stop();
         if (eventIdRef.current !== null) {
            transport.clear(eventIdRef.current);
            eventIdRef.current = null;
         }
      } catch {
         // Tone not loaded — nothing to stop
      }
      setIsPlaying(false);
      setCurrentStep(-1);
   }, []);

   const toggle = useCallback(async () => {
      if (isPlaying) {
         stop();
      } else {
         await play();
      }
   }, [isPlaying, play, stop]);

   return { isPlaying, currentStep, toggle };
}
