"use client";

import { useCallback, useEffect, useState } from "react";
import { MOBILE_MAX_STEPS } from "../_lib/constants";
import { useAnalyser } from "../_hooks/useAnalyser";
import { useAudioEngine } from "../_hooks/useAudioEngine";
import { useExportMp3 } from "../_hooks/useExportMp3";
import { useSequencer } from "../_hooks/useSequencer";
import { useTransport } from "../_hooks/useTransport";
import { generateRandomPattern, mutatePattern } from "../_lib/patterns";
import s from "../music.module.scss";
import { AddTrackPanel } from "./AddTrackPanel";
import { FxPanel } from "./FxPanel";
import { Grid } from "./Grid";
import { RandomButton } from "./RandomButton";
import { TransportBar } from "./TransportBar";
import { Visualizer } from "./Visualizer";

export default function MusicApp() {
   const [isMobile, setIsMobile] = useState(false);
   const {
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
   } = useSequencer();

   // Limit to max 10 steps on mobile
   useEffect(() => {
      const checkMobile = () => {
         const mobile = window.innerWidth <= 640;
         setIsMobile(mobile);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
   }, []);

   const visibleStepCount = isMobile ? MOBILE_MAX_STEPS : stepCount;

   const [activeEffects, setActiveEffects] = useState<Set<string>>(new Set());

   const handleRandomize = useCallback(() => {
      const {
         grid: newGrid,
         effects,
         noteGrid: newNoteGrid,
         harmonicContext: newContext,
         velocityGrid: newVelocityGrid,
         suggestedBpm,
      } = generateRandomPattern(tracks, visibleStepCount);
      applyGrid(newGrid);
      applyNoteGrid(newNoteGrid);
      applyVelocityGrid(newVelocityGrid);
      setHarmonicContext(newContext);
      setActiveEffects(effects);
      setBpm(suggestedBpm);
   }, [
      tracks,
      visibleStepCount,
      applyGrid,
      applyNoteGrid,
      applyVelocityGrid,
      setHarmonicContext,
      setBpm,
   ]);

   const handleMutate = useCallback(() => {
      const {
         grid: newGrid,
         noteGrid: newNoteGrid,
         velocityGrid: newVelocityGrid,
      } = mutatePattern(
         tracks,
         grid,
         noteGrid,
         velocityGrid,
         harmonicContext,
         visibleStepCount,
      );
      applyGrid(newGrid);
      applyNoteGrid(newNoteGrid);
      applyVelocityGrid(newVelocityGrid);
   }, [
      tracks,
      grid,
      noteGrid,
      velocityGrid,
      harmonicContext,
      visibleStepCount,
      applyGrid,
      applyNoteGrid,
      applyVelocityGrid,
   ]);

   const toggleEffect = useCallback((name: string) => {
      setActiveEffects((prev) => {
         const next = new Set(prev);
         if (next.has(name)) next.delete(name);
         else next.add(name);
         return next;
      });
   }, []);

   const { triggerStep, initAudio, audioError } = useAudioEngine(
      tracks,
      grid,
      activeEffects,
      noteGrid,
      velocityGrid,
   );
   const { isPlaying, currentStep, toggle } = useTransport(
      visibleStepCount,
      bpm,
      triggerStep,
      initAudio,
   );

   const analyserData = useAnalyser(isPlaying);
   const { exporting, exportMp3 } = useExportMp3(
      tracks,
      grid,
      activeEffects,
      noteGrid,
      velocityGrid,
      visibleStepCount,
      bpm,
   );

   return (
      <div className={s.page}>
         {audioError && (
            <div
               style={{
                  padding: "12px 16px",
                  backgroundColor: "#fee",
                  color: "#c33",
                  fontSize: "14px",
                  marginBottom: "12px",
                  borderRadius: "4px",
                  border: "1px solid #fcc",
               }}
            >
               {audioError}
            </div>
         )}
         <TransportBar
            isPlaying={isPlaying}
            bpm={bpm}
            stepCount={stepCount}
            onToggle={toggle}
            onBpmChange={setBpm}
            onStepChange={changeStepCount}
            onClear={clearAll}
            isMobile={isMobile}
         >
            <FxPanel activeEffects={activeEffects} onToggle={toggleEffect} />
            <RandomButton onGenerate={handleRandomize} />
            <button
               type="button"
               className={s.mutateBtn}
               onClick={handleMutate}
               title="Slightly mutate the current pattern"
            >
               Evolve
            </button>
            <button
               type="button"
               className={s.downloadBtn}
               onClick={exportMp3}
               disabled={exporting || tracks.length === 0}
               title="Download as MP3"
            >
               {exporting ? "Rendering..." : "Download"}
            </button>
         </TransportBar>
         {!isMobile && (
            <AddTrackPanel
               trackCount={tracks.length}
               onAdd={addTrack}
               onAddAll={addAllTracks}
            />
         )}
         <Visualizer data={analyserData} />
         <Grid
            tracks={tracks}
            grid={grid}
            currentStep={currentStep}
            onToggleCell={toggleCell}
            onSetVolume={setTrackVolume}
            onToggleMute={toggleMute}
            onRemove={removeTrack}
            visibleStepCount={visibleStepCount}
            isMobile={isMobile}
         />
      </div>
   );
}
