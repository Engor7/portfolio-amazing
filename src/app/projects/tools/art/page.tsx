"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Canvas from "./_components/Canvas";
import ColorPanel from "./_components/ColorPanel";
import ConfirmPanel from "./_components/ConfirmPanel";
import Toolbar from "./_components/Toolbar";
import { useCanvasTransform } from "./_hooks/useCanvasTransform";
import { useDrawing } from "./_hooks/useDrawing";
import { useTheme } from "./_hooks/useTheme";
import { downloadSvg } from "./_lib/svgExport";
import type { ToolType } from "./_lib/types";
import styles from "./art.module.scss";

const ArtPage = () => {
   const { theme, resolved, toggleTheme } = useTheme();
   const {
      transform,
      wrapperRef,
      svgRef,
      screenToSvg,
      isPanning,
      isPanningState,
      startPan,
      updatePan,
      endPan,
   } = useCanvasTransform();

   const [tool, setTool] = useState<ToolType>("rainbow");
   const [color, setColor] = useState("#ffffff");
   const [strokeWidth, setStrokeWidth] = useState(170);
   const [showClear, setShowClear] = useState(false);
   const userPickedColor = useRef(false);

   const {
      strokes,
      inProgressRef,
      startDrawing,
      continueDrawing,
      endDrawing,
      undo,
      redo,
      canRedo,
      clearStrokes,
   } = useDrawing(screenToSvg, tool, color, strokeWidth);

   useEffect(() => {
      if (theme === "dark" && color === "#000000") {
         setColor("#ffffff");
      } else if (theme === "light" && color === "#ffffff") {
         setColor("#000000");
      }
   }, [theme, color]);

   const handleToolChange = useCallback(
      (newTool: ToolType) => {
         setTool(newTool);
         if (newTool === "color" && !userPickedColor.current) {
            setColor(theme === "dark" ? "#ffffff" : "#000000");
         }
      },
      [theme],
   );

   const handleColorChange = useCallback((c: string) => {
      userPickedColor.current = true;
      setColor(c);
   }, []);

   const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
         if (e.button === 1 || e.metaKey || e.ctrlKey) {
            startPan(e.clientX, e.clientY);
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            return;
         }
         if (e.button === 0) {
            startDrawing(e.clientX, e.clientY);
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
         }
      },
      [startPan, startDrawing],
   );

   const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
         if (isPanning.current) {
            updatePan(e.clientX, e.clientY);
            return;
         }
         continueDrawing(e.clientX, e.clientY);
      },
      [isPanning, updatePan, continueDrawing],
   );

   const handlePointerUp = useCallback(() => {
      if (isPanning.current) {
         endPan();
         return;
      }
      endDrawing();
   }, [isPanning, endPan, endDrawing]);

   const handleDownload = useCallback(() => {
      downloadSvg(strokes);
   }, [strokes]);

   const handleClearRequest = useCallback(() => {
      setShowClear(true);
   }, []);

   const handleClearConfirm = useCallback(() => {
      clearStrokes();
      setShowClear(false);
   }, [clearStrokes]);

   const handleClearCancel = useCallback(() => {
      setShowClear(false);
   }, []);

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         const mod = e.metaKey || e.ctrlKey;
         if (mod && e.key === "z" && !e.shiftKey) {
            e.preventDefault();
            undo();
         } else if (mod && e.key === "z" && e.shiftKey) {
            e.preventDefault();
            redo();
         }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [undo, redo]);

   const wrapperClass = [
      styles.canvasWrapper,
      isPanningState ? styles.panningActive : "",
   ]
      .filter(Boolean)
      .join(" ");

   return (
      <div
         className={styles.artPage}
         style={resolved ? undefined : { visibility: "hidden" }}
      >
         <div
            ref={wrapperRef}
            className={wrapperClass}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
         >
            <Canvas
               transform={transform}
               strokes={strokes}
               inProgressRef={inProgressRef}
               svgRef={svgRef}
            />
         </div>
         <Toolbar
            tool={tool}
            onToolChange={handleToolChange}
            theme={theme}
            onToggleTheme={toggleTheme}
            onDownload={handleDownload}
            onClearRequest={handleClearRequest}
            strokeWidth={strokeWidth}
            onStrokeWidthChange={setStrokeWidth}
            hasStrokes={strokes.length > 0}
            onUndo={undo}
            onRedo={redo}
            canRedo={canRedo}
         />
         {tool === "color" && (
            <ColorPanel
               activeColor={color}
               onSelect={handleColorChange}
               theme={theme}
            />
         )}
         {showClear && (
            <ConfirmPanel
               onConfirm={handleClearConfirm}
               onCancel={handleClearCancel}
            />
         )}
      </div>
   );
};

export default ArtPage;
