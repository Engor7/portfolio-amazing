"use client";

import { useCallback, useRef, useState } from "react";
import {
   catmullRomSegment,
   hsvToHex,
   pointsToSmoothPath,
   thinPoints,
} from "../_lib/smoothing";
import type { Point, RainbowSegment, Stroke, ToolType } from "../_lib/types";

export function useDrawing(
   screenToSvg: (sx: number, sy: number) => Point,
   tool: ToolType,
   color: string,
   strokeWidth: number,
) {
   const [strokes, setStrokes] = useState<Stroke[]>([]);
   const redoStack = useRef<Stroke[]>([]);
   const rawPoints = useRef<Point[]>([]);
   const isDrawing = useRef(false);
   const nextId = useRef(0);
   const inProgressRef = useRef<SVGGElement>(null);
   const globalHue = useRef(0);
   const currentHue = useRef(0);

   const startDrawing = useCallback(
      (screenX: number, screenY: number) => {
         isDrawing.current = true;
         const pt = screenToSvg(screenX, screenY);
         rawPoints.current = [pt];

         currentHue.current = globalHue.current;
         globalHue.current = (globalHue.current + 0.08) % 1;

         const g = inProgressRef.current;
         if (!g) return;
         g.innerHTML = "";

         if (tool !== "rainbow") {
            const path = document.createElementNS(
               "http://www.w3.org/2000/svg",
               "path",
            );
            path.setAttribute("fill", "none");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            path.setAttribute("stroke-width", String(strokeWidth));
            path.setAttribute("stroke", color);
            path.setAttribute("d", `M ${pt.x},${pt.y}`);
            g.appendChild(path);
         }
      },
      [screenToSvg, tool, color, strokeWidth],
   );

   const continueDrawing = useCallback(
      (screenX: number, screenY: number) => {
         if (!isDrawing.current) return;

         const pt = screenToSvg(screenX, screenY);
         rawPoints.current.push(pt);

         const g = inProgressRef.current;
         if (!g) return;

         if (tool === "rainbow") {
            const thinned = thinPoints(rawPoints.current);
            const existingCount = g.childElementCount;
            const totalSegments = thinned.length - 1;
            for (let i = existingCount; i < totalSegments; i++) {
               const hueT = i * 0.003;
               const c = hsvToHex(currentHue.current + hueT, 1, 1);
               const seg = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "path",
               );
               seg.setAttribute("fill", "none");
               seg.setAttribute("stroke", c);
               seg.setAttribute("stroke-width", String(strokeWidth));
               seg.setAttribute("stroke-linecap", "round");
               seg.setAttribute("stroke-linejoin", "round");
               seg.setAttribute("d", catmullRomSegment(thinned, i));
               g.appendChild(seg);
            }
         } else {
            const path = g.querySelector("path");
            if (path) {
               path.setAttribute("d", pointsToSmoothPath(rawPoints.current));
            }
         }
      },
      [screenToSvg, tool, strokeWidth],
   );

   const endDrawing = useCallback(() => {
      if (!isDrawing.current) return;
      isDrawing.current = false;

      const points = rawPoints.current;
      if (points.length < 2) {
         const g = inProgressRef.current;
         if (g) g.innerHTML = "";
         return;
      }

      const id = nextId.current++;
      let stroke: Stroke;

      if (tool === "rainbow") {
         const thinned = thinPoints(points);
         const segments: RainbowSegment[] = [];
         for (let i = 0; i < thinned.length - 1; i++) {
            const hueT = i * 0.003;
            segments.push({
               d: catmullRomSegment(thinned, i),
               color: hsvToHex(currentHue.current + hueT, 1, 1),
            });
         }
         stroke = {
            id,
            kind: "rainbow",
            color: "",
            width: strokeWidth,
            d: "",
            segments,
         };
      } else {
         stroke = {
            id,
            kind: "color",
            color,
            width: strokeWidth,
            d: pointsToSmoothPath(points),
            segments: [],
         };
      }

      redoStack.current = [];
      setStrokes((prev) => [...prev, stroke]);

      const g = inProgressRef.current;
      if (g) g.innerHTML = "";
      rawPoints.current = [];
   }, [tool, color, strokeWidth]);

   const undo = useCallback(() => {
      setStrokes((prev) => {
         if (prev.length === 0) return prev;
         redoStack.current.push(prev[prev.length - 1]);
         return prev.slice(0, -1);
      });
   }, []);

   const redo = useCallback(() => {
      const stroke = redoStack.current.pop();
      if (!stroke) return;
      if (stroke.id >= nextId.current) {
         nextId.current = stroke.id + 1;
      }
      setStrokes((prev) => [...prev, stroke]);
   }, []);

   const canRedo = redoStack.current.length > 0;

   const clearStrokes = useCallback(() => {
      redoStack.current = [];
      setStrokes([]);
   }, []);

   return {
      strokes,
      inProgressRef,
      startDrawing,
      continueDrawing,
      endDrawing,
      undo,
      redo,
      canRedo,
      clearStrokes,
   };
}
