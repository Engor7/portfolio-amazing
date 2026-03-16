"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Transform } from "../_lib/types";

const MIN_SCALE = 0.2;
const MAX_SCALE = 5.0;

export function useCanvasTransform() {
   const [transform, setTransform] = useState<Transform>({
      x: 0,
      y: 0,
      scale: 1,
   });
   const transformRef = useRef(transform);
   transformRef.current = transform;

   const isPanning = useRef(false);
   const [isPanningState, setIsPanningState] = useState(false);
   const panStart = useRef({ x: 0, y: 0 });
   const wrapperRef = useRef<HTMLDivElement>(null);
   const svgRef = useRef<SVGSVGElement>(null);

   const screenToSvg = useCallback((screenX: number, screenY: number) => {
      const svg = svgRef.current;
      if (!svg) {
         // Fallback if SVG not mounted yet
         const t = transformRef.current;
         const w = window.innerWidth;
         const h = window.innerHeight;
         return {
            x: ((screenX - t.x) / t.scale / w) * 8000,
            y: ((screenY - t.y) / t.scale / h) * 6000,
         };
      }
      const ctm = svg.getScreenCTM();
      if (!ctm) {
         return { x: screenX, y: screenY };
      }
      const pt = new DOMPoint(screenX, screenY).matrixTransform(ctm.inverse());
      return { x: pt.x, y: pt.y };
   }, []);

   const startPan = useCallback((screenX: number, screenY: number) => {
      isPanning.current = true;
      setIsPanningState(true);
      panStart.current = {
         x: screenX - transformRef.current.x,
         y: screenY - transformRef.current.y,
      };
   }, []);

   const updatePan = useCallback((screenX: number, screenY: number) => {
      if (!isPanning.current) return;
      setTransform((prev) => ({
         ...prev,
         x: screenX - panStart.current.x,
         y: screenY - panStart.current.y,
      }));
   }, []);

   const endPan = useCallback(() => {
      isPanning.current = false;
      setIsPanningState(false);
   }, []);

   const zoom = useCallback(
      (delta: number, cursorX: number, cursorY: number) => {
         setTransform((prev) => {
            const factor = delta > 0 ? 0.9 : 1.1;
            const newScale = Math.min(
               MAX_SCALE,
               Math.max(MIN_SCALE, prev.scale * factor),
            );
            const newX = cursorX - (cursorX - prev.x) * (newScale / prev.scale);
            const newY = cursorY - (cursorY - prev.y) * (newScale / prev.scale);
            return { x: newX, y: newY, scale: newScale };
         });
      },
      [],
   );

   useEffect(() => {
      const el = wrapperRef.current;
      if (!el) return;

      const onWheel = (e: WheelEvent) => {
         e.preventDefault();
         zoom(e.deltaY, e.clientX, e.clientY);
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
   }, [zoom]);

   return {
      transform,
      wrapperRef,
      svgRef,
      screenToSvg,
      isPanning,
      isPanningState,
      startPan,
      updatePan,
      endPan,
   };
}
