"use client";

import { memo, useEffect, useRef } from "react";
import s from "../music.module.scss";

const DEFAULT_BAR_COLOR_START = [196, 168, 148];
const DEFAULT_BAR_COLOR_END = [220, 196, 180];

function parseRgbVar(value: string, fallback: number[]): number[] {
   const parts = value.split(",").map((s) => Number(s.trim()));
   return parts.length === 3 && parts.every((n) => !Number.isNaN(n))
      ? parts
      : fallback;
}

interface VisualizerProps {
   data: Float32Array | null;
}

export const Visualizer = memo(function Visualizer({ data }: VisualizerProps) {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
   const colorsRef = useRef({
      start: DEFAULT_BAR_COLOR_START,
      end: DEFAULT_BAR_COLOR_END,
   });

   // Handle canvas sizing via ResizeObserver
   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const observer = new ResizeObserver((entries) => {
         const entry = entries[0];
         if (!entry) return;
         const dpr = window.devicePixelRatio || 1;
         const rect = entry.contentRect;
         canvas.width = rect.width * dpr;
         canvas.height = rect.height * dpr;
         sizeRef.current = { w: rect.width, h: rect.height, dpr };
      });

      // Read theme-aware bar colors from CSS custom properties
      const readColors = () => {
         const cs = getComputedStyle(canvas);
         colorsRef.current = {
            start: parseRgbVar(
               cs.getPropertyValue("--m-viz-from"),
               DEFAULT_BAR_COLOR_START,
            ),
            end: parseRgbVar(
               cs.getPropertyValue("--m-viz-to"),
               DEFAULT_BAR_COLOR_END,
            ),
         };
      };
      readColors();

      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", readColors);

      observer.observe(canvas);
      return () => {
         observer.disconnect();
         mq.removeEventListener("change", readColors);
      };
   }, []);

   // Draw bars
   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { w, h, dpr } = sizeRef.current;
      if (w === 0 || h === 0) return;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (!data || data.length === 0) {
         ctx.restore();
         return;
      }

      const gap = 2;
      const barCount = Math.min(
         data.length,
         Math.max(1, Math.floor((w + gap) / (4 + gap))),
      );
      const barWidth = Math.max(1, (w - gap * (barCount - 1)) / barCount);
      const radius = Math.min(barWidth / 2, 3);

      for (let i = 0; i < barCount; i++) {
         const db = data[i];
         const normalized = Math.max(0, Math.min(1, (db + 100) / 100));
         const barHeight = Math.max(2, normalized * h);

         // Interpolate color based on position
         const { start, end } = colorsRef.current;
         const t = i / (barCount - 1);
         const r = Math.round(start[0] + t * (end[0] - start[0]));
         const g = Math.round(start[1] + t * (end[1] - start[1]));
         const b = Math.round(start[2] + t * (end[2] - start[2]));

         // Uniform opacity across all frequencies
         ctx.globalAlpha = 0.8;
         ctx.fillStyle = `rgb(${r},${g},${b})`;

         const x = i * (barWidth + gap);
         const y = h - barHeight;

         // Rounded top bars
         ctx.beginPath();
         ctx.moveTo(x, h);
         ctx.lineTo(x, y + radius);
         ctx.arcTo(x, y, x + radius, y, radius);
         ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius);
         ctx.lineTo(x + barWidth, h);
         ctx.closePath();
         ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
   }, [data]);

   return (
      <div className={s.visualizerWrap}>
         <canvas ref={canvasRef} className={s.visualizer} />
      </div>
   );
});
