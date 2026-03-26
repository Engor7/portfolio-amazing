"use client";

import { useCallback, useEffect, useState } from "react";
import { useAnalyser } from "../_hooks/useAnalyser";
import { useAudioEngine } from "../_hooks/useAudioEngine";
import { useExportMp3 } from "../_hooks/useExportMp3";
import { useSequencer } from "../_hooks/useSequencer";
import { useTransport } from "../_hooks/useTransport";
import { COMPACT_MAX_STEPS, MOBILE_MAX_STEPS } from "../_lib/constants";
import { generateRandomPattern } from "../_lib/patterns";
import s from "../music.module.scss";
import { FxPanel } from "./FxPanel";
import { Grid } from "./Grid";
import { ClearIcon, DownloadIcon } from "./icons";
import { RandomButton } from "./RandomButton";
import { TransportBar } from "./TransportBar";
import { Visualizer } from "./Visualizer";

export default function MusicApp() {
   const [isMobile, setIsMobile] = useState(false);
   const [isCompact, setIsCompact] = useState(false);
   const {
      tracks,
      grid,
      noteGrid,
      velocityGrid,
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
   } = useSequencer();

   // Limit to max 10 steps on mobile
   useEffect(() => {
      const checkMobile = () => {
         const mobile = window.innerWidth <= 640;
         setIsMobile(mobile);
         setIsCompact(window.innerHeight <= 480);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
   }, []);

   const visibleStepCount = isMobile
      ? MOBILE_MAX_STEPS
      : isCompact
        ? COMPACT_MAX_STEPS
        : stepCount;

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

   const toggleEffect = useCallback((name: string) => {
      setActiveEffects((prev) => {
         const next = new Set(prev);
         if (next.has(name)) next.delete(name);
         else next.add(name);
         return next;
      });
   }, []);

   const { triggerStep, initAudio, audioError, getTrackLevel } = useAudioEngine(
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
         {audioError && <div className={s.audioError}>{audioError}</div>}
         <div className={s.content}>
            <div className={s.topBar}>
               <TransportBar
                  isPlaying={isPlaying}
                  bpm={bpm}
                  onToggle={toggle}
                  onBpmChange={setBpm}
                  onClear={clearAll}
                  onDownload={exportMp3}
                  isDownloading={exporting}
                  canDownload={hasActiveCells}
                  canClear={hasActiveCells}
               >
                  <FxPanel
                     activeEffects={activeEffects}
                     onToggle={toggleEffect}
                  />
                  <RandomButton onGenerate={handleRandomize} />
               </TransportBar>
            </div>
            <div className={s.visualizerRow}>
               <Visualizer data={analyserData} />
               <div className={s.mobileActions}>
                  <button
                     type="button"
                     className={s.clearBtn}
                     onClick={exportMp3}
                     disabled={!hasActiveCells || exporting}
                     title="Download as MP3"
                  >
                     <DownloadIcon width={12} height={12} />
                     Download
                  </button>
                  <button
                     type="button"
                     className={s.clearBtn}
                     onClick={clearAll}
                     disabled={!hasActiveCells}
                     title="Clear all cells"
                  >
                     <ClearIcon width={12} height={12} />
                     Clear
                  </button>
               </div>
            </div>
            <Grid
               tracks={tracks}
               grid={grid}
               currentStep={currentStep}
               onToggleCell={toggleCell}
               onSetVolume={setTrackVolume}
               onToggleMute={toggleMute}
               visibleStepCount={visibleStepCount}
               getTrackLevel={getTrackLevel}
               isPlaying={isPlaying}
            />
         </div>
      </div>
   );
}
