"use client";

import { memo, useEffect, useRef } from "react";
import s from "../music.module.scss";

const BAR_COLOR_START = [212, 168, 140]; // #d4a88c
const BAR_COLOR_END = [232, 196, 176]; // #e8c4b0

interface VisualizerProps {
   data: Float32Array | null;
}

export const Visualizer = memo(function Visualizer({ data }: VisualizerProps) {
   const canvasRef = useRef<HTMLCanvasElement>(null);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      if (!data || data.length === 0) return;

      const barCount = Math.min(data.length, 64);
      const gap = 3;
      const barWidth = (w - gap * (barCount - 1)) / barCount;
      const radius = Math.min(barWidth / 2, 3);

      for (let i = 0; i < barCount; i++) {
         const db = data[i];
         const normalized = Math.max(0, Math.min(1, (db + 100) / 100));
         const barHeight = Math.max(2, normalized * h);

         // Interpolate color based on position
         const t = i / (barCount - 1);
         const r = Math.round(
            BAR_COLOR_START[0] + t * (BAR_COLOR_END[0] - BAR_COLOR_START[0]),
         );
         const g = Math.round(
            BAR_COLOR_START[1] + t * (BAR_COLOR_END[1] - BAR_COLOR_START[1]),
         );
         const b = Math.round(
            BAR_COLOR_START[2] + t * (BAR_COLOR_END[2] - BAR_COLOR_START[2]),
         );

         // Opacity fades for lower frequencies (lower normalized = more transparent)
         ctx.globalAlpha = 0.35 + normalized * 0.65;
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
   }, [data]);

   return <canvas ref={canvasRef} className={s.visualizer} />;
});
