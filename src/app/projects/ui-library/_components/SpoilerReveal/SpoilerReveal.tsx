"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./SpoilerReveal.module.scss";

type Phase = "idle" | "reveal" | "done";

interface Particle {
   x0: number; // home — spring pulls toward this
   y0: number;
   x: number;
   y: number;
   vx: number;
   vy: number;
   color: string;
   alpha: number;
}

interface SpoilerRevealProps {
   children: React.ReactNode;
   colors?: string[];
   gap?: number;
   block?: boolean;
   className?: string;
}

// Canvas is extended by PAD px on every side so dispersing particles
// can fly outside the container without being clipped.
const PAD = 12;
// Edge-fade zone from canvas boundary during idle (soft cloud look)
const EDGE = 10;
// Particle radius
const SIZE = 1.4;
// Max speed during idle
const MAX_SPD = 0.8;

const COLORS_LIGHT = [
   "rgba(20,20,30,1)",
   "rgba(35,35,48,1)",
   "rgba(50,50,62,1)",
   "rgba(15,15,28,1)",
];
const COLORS_DARK = [
   "rgba(210,210,230,1)",
   "rgba(222,222,242,1)",
   "rgba(192,192,214,1)",
   "rgba(236,236,255,1)",
];

function buildParticles(
   // full canvas dimensions including PAD
   cw: number,
   ch: number,
   gap: number,
   isDark: boolean,
   customColors?: string[],
): Particle[] {
   const palette = customColors ?? (isDark ? COLORS_DARK : COLORS_LIGHT);
   const particles: Particle[] = [];

   // Home positions are in the inner (content) area only
   for (let x0 = PAD + gap / 2; x0 < cw - PAD; x0 += gap) {
      for (let y0 = PAD + gap / 2; y0 < ch - PAD; y0 += gap) {
         particles.push({
            x0,
            y0,
            x: x0,
            y: y0,
            // Start with some velocity so motion is immediate
            vx: (Math.random() - 0.5) * 1.6,
            vy: (Math.random() - 0.5) * 1.6,
            color: palette[Math.floor(Math.random() * palette.length)],
            alpha: 0.3 + Math.random() * 0.7,
         });
      }
   }
   return particles;
}

// Smooth fade-to-zero within EDGE px of any canvas boundary (idle only)
function ef(x: number, y: number, cw: number, ch: number): number {
   const fx = Math.min(x, cw - x) / EDGE;
   const fy = Math.min(y, ch - y) / EDGE;
   return Math.min(1, Math.max(0, fx)) * Math.min(1, Math.max(0, fy));
}

const SpoilerReveal = ({
   children,
   colors,
   gap = 3,
   block = false,
   className,
}: SpoilerRevealProps) => {
   const [mounted, setMounted] = useState(false);
   const [phase, setPhase] = useState<Phase>("idle");

   const containerRef = useRef<HTMLDivElement>(null);
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const rafRef = useRef<number>(0);
   const resetTimer = useRef<number>(0);
   const phaseRef = useRef<Phase>("idle");
   const particlesRef = useRef<Particle[]>([]);
   const timeRef = useRef<number>(0);

   useEffect(() => {
      setMounted(true);
   }, []);

   useEffect(() => {
      if (!mounted || phase === "done") return;

      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const sync = () => {
         const { width: w, height: h } = container.getBoundingClientRect();
         const cw = Math.floor(w) + PAD * 2;
         const ch = Math.floor(h) + PAD * 2;
         const dpr = window.devicePixelRatio || 1;
         const pw = Math.round(cw * dpr);
         const ph = Math.round(ch * dpr);

         if (canvas.width !== pw || canvas.height !== ph) {
            canvas.width = pw;
            canvas.height = ph;
            canvas.style.width = `${cw}px`;
            canvas.style.height = `${ch}px`;
         }

         if (phaseRef.current === "idle") {
            const isDark = document.documentElement.dataset.theme === "dark";
            particlesRef.current = buildParticles(cw, ch, gap, isDark, colors);
         }
      };

      const ro = new ResizeObserver(sync);
      ro.observe(container);
      sync();

      // React to theme changes — recolor particles
      const mo = new MutationObserver(() => {
         if (phaseRef.current !== "idle") return;
         const isDark = document.documentElement.dataset.theme === "dark";
         const palette = colors ?? (isDark ? COLORS_DARK : COLORS_LIGHT);
         for (const p of particlesRef.current) {
            p.color = palette[Math.floor(Math.random() * palette.length)];
         }
      });
      mo.observe(document.documentElement, {
         attributes: true,
         attributeFilter: ["data-theme"],
      });

      return () => {
         ro.disconnect();
         mo.disconnect();
      };
   }, [mounted, phase, gap, colors]);

   useEffect(() => {
      if (!mounted || phase === "done") return;

      let prevTs = -1;

      const tick = (ts: number) => {
         const canvas = canvasRef.current;
         if (!canvas) return;
         const ctx = canvas.getContext("2d");
         if (!ctx) return;

         const dpr = window.devicePixelRatio || 1;
         const cw = canvas.width / dpr;
         const ch = canvas.height / dpr;

         const dt = prevTs < 0 ? 16 : Math.min(ts - prevTs, 50);
         prevTs = ts;
         timeRef.current += dt * 0.001;

         ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
         ctx.clearRect(0, 0, cw, ch);

         const currentPhase = phaseRef.current;
         const particles = particlesRef.current;
         let allGone = currentPhase === "reveal";

         for (const p of particles) {
            if (p.alpha <= 0) continue;

            if (currentPhase === "idle") {
               const t1 = timeRef.current;

               // Each particle randomly changes direction
               p.vx += (Math.random() - 0.5) * 0.08;
               p.vy += (Math.random() - 0.5) * 0.08;

               // Gentle gusts — soft breeze-like pushes that sweep through
               for (let g = 0; g < 3; g++) {
                  const life = (Math.sin(t1 * 0.18 + g * 2.5) + 1) * 0.5;
                  if (life < 0.2) continue;
                  // Gust center drifts slowly
                  const gx = cw * (0.25 + 0.5 * Math.sin(t1 * 0.07 + g * 4.1));
                  const gy = ch * (0.25 + 0.5 * Math.cos(t1 * 0.06 + g * 2.8));
                  const dx = p.x - gx;
                  const dy = p.y - gy;
                  const dist = Math.hypot(dx, dy);
                  const radius = 55;
                  if (dist > radius) continue;
                  // Smooth falloff
                  const f = life * (1 - dist / radius) ** 2 * 0.015;
                  // Each gust blows in its own slowly rotating direction
                  const angle = t1 * 0.3 + g * 2.09;
                  p.vx += Math.cos(angle) * f;
                  p.vy += Math.sin(angle) * f;
               }

               // Very soft spring — lets particles roam the whole area
               p.vx += (p.x0 - p.x) * 0.001;
               p.vy += (p.y0 - p.y) * 0.001;

               p.vx *= 0.985;
               p.vy *= 0.985;

               const spd = Math.hypot(p.vx, p.vy);
               if (spd > MAX_SPD) {
                  p.vx = (p.vx / spd) * MAX_SPD;
                  p.vy = (p.vy / spd) * MAX_SPD;
               }
               p.x += p.vx;
               p.y += p.vy;

               // Soft cloud edges — fade in the PAD zone, invisible at canvas boundary
               const edgeAlpha = p.alpha * ef(p.x, p.y, cw, ch);
               if (edgeAlpha < 0.01) continue;
               ctx.globalAlpha = edgeAlpha;
            } else {
               // Reveal — no spring, just drift + fade
               p.x += p.vx;
               p.y += p.vy;
               p.vx *= 0.91;
               p.vy *= 0.91;
               p.alpha -= 0.025;
               if (p.alpha > 0) allGone = false;
               if (p.alpha <= 0) continue;
               // No edge fade during reveal — let them fly naturally past the border
               ctx.globalAlpha = Math.max(0, p.alpha);
            }

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
         }

         ctx.globalAlpha = 1;

         if (currentPhase === "reveal" && allGone) {
            phaseRef.current = "done";
            setPhase("done");
            return;
         }

         rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
   }, [mounted, phase]);

   // Auto-reset: return to idle 3s after done
   useEffect(() => {
      if (phase !== "done") return;
      resetTimer.current = window.setTimeout(() => {
         phaseRef.current = "idle";
         timeRef.current = 0;
         setPhase("idle");
      }, 3000);
      return () => clearTimeout(resetTimer.current);
   }, [phase]);

   const disperse = useCallback((cx: number, cy: number) => {
      // cx/cy are in container coords — offset by PAD for canvas coords
      const ccx = cx + PAD;
      const ccy = cy + PAD;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.width / dpr;
      const ch = canvas.height / dpr;

      for (const p of particlesRef.current) {
         const dx = p.x - ccx;
         const dy = p.y - ccy;
         const dist = Math.hypot(dx, dy) || 1;
         const radius = Math.max(cw, ch) * 0.6;
         const falloff = Math.max(0, 1 - dist / radius);
         const speed = falloff * 3.0 + Math.random() * 0.5;
         const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.9;
         p.vx += Math.cos(angle) * speed;
         p.vy += Math.sin(angle) * speed;
      }

      phaseRef.current = "reveal";
      setPhase("reveal");
   }, []);

   const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
         if (phaseRef.current !== "idle") return;
         const container = containerRef.current;
         if (!container) return;
         const rect = container.getBoundingClientRect();
         disperse(e.clientX - rect.left, e.clientY - rect.top);
      },
      [disperse],
   );

   const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
         if (e.key !== "Enter" && e.key !== " ") return;
         if (phaseRef.current !== "idle") return;
         const canvas = canvasRef.current;
         if (!canvas) return;
         const dpr = window.devicePixelRatio || 1;
         // Center of the inner content area
         disperse(
            (canvas.width / dpr - PAD * 2) / 2,
            (canvas.height / dpr - PAD * 2) / 2,
         );
      },
      [disperse],
   );

   if (!mounted) return null;

   const cls = [
      styles.container,
      block ? styles.block : "",
      phase === "done" ? styles.done : "",
      className ?? "",
   ]
      .filter(Boolean)
      .join(" ");

   const contentCls = [
      styles.content,
      phase === "idle" ? styles.contentIdle : "",
      phase === "reveal" || phase === "done" ? styles.contentReveal : "",
   ]
      .filter(Boolean)
      .join(" ");

   const isIdle = phase === "idle";

   return (
      // biome-ignore lint/a11y/noStaticElementInteractions: interactive only during idle phase, role applied conditionally
      // biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-label pairs with conditional role="button"
      <div
         ref={containerRef}
         className={cls}
         onClick={isIdle ? handleClick : undefined}
         role={isIdle ? "button" : undefined}
         tabIndex={isIdle ? 0 : undefined}
         onKeyDown={isIdle ? handleKeyDown : undefined}
         aria-label={isIdle ? "Click to reveal" : undefined}
      >
         <div className={contentCls}>{children}</div>
         <canvas
            ref={canvasRef}
            className={styles.canvas}
            aria-hidden={!isIdle || undefined}
            tabIndex={-1}
         />
      </div>
   );
};

export default SpoilerReveal;
