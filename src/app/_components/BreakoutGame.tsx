"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/providers/LangProvider";
import s from "./BreakoutGame.module.scss";

// --- 404 pattern: each digit is 5x7, gap columns between digits ---
const CHAR_4 = [
   [1, 0, 0, 1, 0],
   [1, 0, 0, 1, 0],
   [1, 0, 0, 1, 0],
   [1, 1, 1, 1, 1],
   [0, 0, 0, 1, 0],
   [0, 0, 0, 1, 0],
   [0, 0, 0, 1, 0],
];

const CHAR_0 = [
   [0, 1, 1, 1, 0],
   [1, 0, 0, 0, 1],
   [1, 0, 0, 0, 1],
   [1, 0, 0, 0, 1],
   [1, 0, 0, 0, 1],
   [1, 0, 0, 0, 1],
   [0, 1, 1, 1, 0],
];

const ROWS = 7;
const COLS = 17;

function buildPattern(): number[][] {
   const pattern: number[][] = [];
   for (let r = 0; r < ROWS; r++) {
      pattern[r] = [...CHAR_4[r], 0, ...CHAR_0[r], 0, ...CHAR_4[r]];
   }
   return pattern;
}

const PATTERN = buildPattern();

interface Brick {
   x: number;
   y: number;
   w: number;
   h: number;
   col: number;
   row: number;
   alive: boolean;
}

interface Ball {
   x: number;
   y: number;
   dx: number;
   dy: number;
   radius: number;
   launched: boolean;
}

interface Powerup {
   x: number;
   y: number;
   dy: number;
   type: 2 | 3;
   w: number;
   h: number;
}

interface Paddle {
   x: number;
   y: number;
   w: number;
   h: number;
}

type GamePhase = "start" | "playing" | "win";

interface GameState {
   balls: Ball[];
   paddle: Paddle;
   bricks: Brick[];
   powerups: Powerup[];
   phase: GamePhase;
   score: number;
   totalBricks: number;
}

interface Texts {
   title: string;
   description: string;
   start: string;
   win: string;
   restart: string;
}

export default function BreakoutGame() {
   const { t } = useLang();
   const textsRef = useRef<Texts>(t.notFound);
   textsRef.current = t.notFound;

   const canvasRef = useRef<HTMLCanvasElement>(null);
   const stateRef = useRef<GameState | null>(null);
   const keysRef = useRef<Set<string>>(new Set());
   const rafRef = useRef<number>(0);
   const touchRef = useRef<number | null>(null);
   const mouseActiveRef = useRef(false);

   useEffect(() => {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      const ctx = canvasEl.getContext("2d");
      if (!ctx) return;

      // Non-null aliases for use in nested closures
      const canvas = canvasEl;
      const cx = ctx;

      let W = 0;
      let H = 0;

      function clamp(v: number, min: number, max: number) {
         return Math.max(min, Math.min(max, v));
      }

      function resize() {
         const dpr = window.devicePixelRatio || 1;
         W = window.innerWidth;
         H = window.innerHeight;
         canvas.width = W * dpr;
         canvas.height = H * dpr;
         canvas.style.width = `${W}px`;
         canvas.style.height = `${H}px`;
         cx.setTransform(dpr, 0, 0, dpr, 0, 0);

         const gs = stateRef.current;
         if (gs) {
            rebuildBrickPositions(gs);
            gs.paddle.w = clamp(W * 0.15, 80, 200);
            gs.paddle.h = clamp(H * 0.012, 6, 12);
            gs.paddle.y = H - gs.paddle.h - 30;
            gs.paddle.x = clamp(gs.paddle.x, 0, W - gs.paddle.w);
            for (const ball of gs.balls) {
               ball.radius = clamp(W * 0.008, 5, 12);
               if (!ball.launched) {
                  ball.x = gs.paddle.x + gs.paddle.w / 2;
                  ball.y = gs.paddle.y - ball.radius;
               }
            }
         }
      }

      function rebuildBrickPositions(gs: GameState) {
         const brickAreaW = W * 0.8;
         const brickAreaH = H * 0.3;
         const offsetX = (W - brickAreaW) / 2;
         const offsetY = H * 0.08;
         const gap = 3;
         const bw = (brickAreaW - (COLS - 1) * gap) / COLS;
         const bh = (brickAreaH - (ROWS - 1) * gap) / ROWS;

         for (const brick of gs.bricks) {
            brick.x = offsetX + brick.col * (bw + gap);
            brick.y = offsetY + brick.row * (bh + gap);
            brick.w = bw;
            brick.h = bh;
         }
      }

      function createBricks(): Brick[] {
         const bricks: Brick[] = [];
         for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
               if (PATTERN[r][c]) {
                  bricks.push({
                     x: 0,
                     y: 0,
                     w: 0,
                     h: 0,
                     col: c,
                     row: r,
                     alive: true,
                  });
               }
            }
         }
         return bricks;
      }

      function makeBall(paddle: Paddle): Ball {
         const radius = clamp(W * 0.008, 5, 12);
         return {
            x: paddle.x + paddle.w / 2,
            y: paddle.y - radius,
            dx: 0,
            dy: 0,
            radius,
            launched: false,
         };
      }

      function initState(): GameState {
         const paddleW = clamp(W * 0.15, 80, 200);
         const paddleH = clamp(H * 0.012, 6, 12);
         const paddle: Paddle = {
            x: W / 2 - paddleW / 2,
            y: H - paddleH - 30,
            w: paddleW,
            h: paddleH,
         };

         const bricks = createBricks();
         const gs: GameState = {
            balls: [makeBall(paddle)],
            paddle,
            bricks,
            powerups: [],
            phase: "start",
            score: 0,
            totalBricks: bricks.length,
         };
         rebuildBrickPositions(gs);
         return gs;
      }

      function launchBall(gs: GameState) {
         const ball = gs.balls[0];
         if (!ball || ball.launched) return;
         const speed = clamp(W * 0.005, 5, 8);
         const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
         ball.dx = Math.cos(angle) * speed;
         ball.dy = Math.sin(angle) * speed;
         ball.launched = true;
         gs.phase = "playing";
      }

      function resetBalls(gs: GameState) {
         const ball = makeBall(gs.paddle);
         gs.balls = [ball];
         gs.powerups = [];
      }

      function movePaddleTo(gs: GameState, targetX: number) {
         gs.paddle.x = clamp(targetX - gs.paddle.w / 2, 0, W - gs.paddle.w);
         const unlaunched = gs.balls.find((b) => !b.launched);
         if (unlaunched) {
            unlaunched.x = gs.paddle.x + gs.paddle.w / 2;
         }
      }

      function spawnPowerup(brickX: number, brickY: number, brickW: number) {
         const roll = Math.random();
         if (roll > 0.15) return null;
         const type: 2 | 3 = roll < 0.05 ? 3 : 2;
         const pw = clamp(W * 0.04, 28, 48);
         const ph = clamp(H * 0.025, 16, 28);
         return {
            x: brickX + brickW / 2 - pw / 2,
            y: brickY,
            dy: clamp(H * 0.003, 1.5, 3),
            type,
            w: pw,
            h: ph,
         } as Powerup;
      }

      function multiplyBalls(gs: GameState, factor: number) {
         const newBalls: Ball[] = [];
         for (const ball of gs.balls) {
            newBalls.push(ball);
            if (!ball.launched) continue;
            for (let i = 1; i < factor; i++) {
               const spread = (i * 0.4) / (factor - 1) - 0.2;
               const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
               const angle = Math.atan2(ball.dy, ball.dx) + spread;
               newBalls.push({
                  x: ball.x,
                  y: ball.y,
                  dx: Math.cos(angle) * speed,
                  dy: Math.sin(angle) * speed,
                  radius: ball.radius,
                  launched: true,
               });
            }
         }
         gs.balls = newBalls;
      }

      function update(gs: GameState) {
         if (gs.phase !== "playing") return;

         const { paddle, bricks } = gs;
         const speed = clamp(W * 0.007, 4, 10);
         const keys = keysRef.current;

         if (keys.has("ArrowLeft") || keys.has("a")) {
            paddle.x -= speed;
         }
         if (keys.has("ArrowRight") || keys.has("d")) {
            paddle.x += speed;
         }
         paddle.x = clamp(paddle.x, 0, W - paddle.w);

         // update each ball
         const survivingBalls: Ball[] = [];
         for (const ball of gs.balls) {
            if (!ball.launched) {
               ball.x = paddle.x + paddle.w / 2;
               ball.y = paddle.y - ball.radius;
               survivingBalls.push(ball);
               continue;
            }

            ball.x += ball.dx;
            ball.y += ball.dy;

            // wall collisions
            if (ball.x - ball.radius < 0) {
               ball.x = ball.radius;
               ball.dx = Math.abs(ball.dx);
            }
            if (ball.x + ball.radius > W) {
               ball.x = W - ball.radius;
               ball.dx = -Math.abs(ball.dx);
            }
            if (ball.y - ball.radius < 0) {
               ball.y = ball.radius;
               ball.dy = Math.abs(ball.dy);
            }

            // ball fell below
            if (ball.y - ball.radius > H) {
               continue; // remove this ball
            }

            // paddle collision
            if (
               ball.dy > 0 &&
               ball.y + ball.radius >= paddle.y &&
               ball.y + ball.radius <= paddle.y + paddle.h + ball.dy &&
               ball.x >= paddle.x &&
               ball.x <= paddle.x + paddle.w
            ) {
               ball.y = paddle.y - ball.radius;
               const hitPos = (ball.x - paddle.x) / paddle.w;
               const angle = -Math.PI / 2 + (hitPos - 0.5) * 1.2;
               const currentSpeed = Math.sqrt(
                  ball.dx * ball.dx + ball.dy * ball.dy,
               );
               ball.dx = Math.cos(angle) * currentSpeed;
               ball.dy = Math.sin(angle) * currentSpeed;
            }

            // brick collisions
            for (const brick of bricks) {
               if (!brick.alive) continue;

               if (
                  ball.x + ball.radius > brick.x &&
                  ball.x - ball.radius < brick.x + brick.w &&
                  ball.y + ball.radius > brick.y &&
                  ball.y - ball.radius < brick.y + brick.h
               ) {
                  brick.alive = false;
                  gs.score++;

                  const overlapLeft = ball.x + ball.radius - brick.x;
                  const overlapRight =
                     brick.x + brick.w - (ball.x - ball.radius);
                  const overlapTop = ball.y + ball.radius - brick.y;
                  const overlapBottom =
                     brick.y + brick.h - (ball.y - ball.radius);
                  const minOverlapX = Math.min(overlapLeft, overlapRight);
                  const minOverlapY = Math.min(overlapTop, overlapBottom);

                  if (minOverlapX < minOverlapY) {
                     ball.dx = -ball.dx;
                  } else {
                     ball.dy = -ball.dy;
                  }

                  const p = spawnPowerup(brick.x, brick.y, brick.w);
                  if (p) gs.powerups.push(p);

                  break;
               }
            }

            survivingBalls.push(ball);
         }

         // if all balls lost, reset
         if (survivingBalls.length === 0) {
            resetBalls(gs);
            return;
         }
         gs.balls = survivingBalls;

         // update powerups
         const activePowerups: Powerup[] = [];
         for (const p of gs.powerups) {
            p.y += p.dy;

            // paddle catch
            if (
               p.y + p.h >= paddle.y &&
               p.y <= paddle.y + paddle.h &&
               p.x + p.w >= paddle.x &&
               p.x <= paddle.x + paddle.w
            ) {
               multiplyBalls(gs, p.type);
               continue;
            }

            // fell off screen
            if (p.y > H) continue;

            activePowerups.push(p);
         }
         gs.powerups = activePowerups;

         if (gs.score >= gs.totalBricks) {
            gs.phase = "win";
         }
      }

      function brickColor(col: number): string {
         const hue = (col / COLS) * 300;
         return `hsl(${hue}, 70%, 55%)`;
      }

      function wrapText(
         text: string,
         _x: number,
         maxWidth: number,
         lineHeight: number,
      ): { lines: string[]; totalHeight: number } {
         const words = text.split(" ");
         const lines: string[] = [];
         let current = "";
         for (const word of words) {
            const test = current ? `${current} ${word}` : word;
            if (cx.measureText(test).width > maxWidth && current) {
               lines.push(current);
               current = word;
            } else {
               current = test;
            }
         }
         if (current) lines.push(current);
         return { lines, totalHeight: lines.length * lineHeight };
      }

      function draw(gs: GameState) {
         cx.clearRect(0, 0, W, H);

         const { paddle, bricks } = gs;
         const font = '"Open Sans", sans-serif';
         const texts = textsRef.current;

         // bricks
         for (const brick of bricks) {
            if (!brick.alive) continue;
            cx.fillStyle = brickColor(brick.col);
            cx.beginPath();
            cx.roundRect(brick.x, brick.y, brick.w, brick.h, 4);
            cx.fill();
         }

         // powerups
         for (const p of gs.powerups) {
            cx.fillStyle =
               p.type === 3
                  ? "rgba(255, 200, 50, 0.85)"
                  : "rgba(80, 220, 100, 0.85)";
            cx.beginPath();
            cx.roundRect(p.x, p.y, p.w, p.h, p.h / 2);
            cx.fill();
            cx.fillStyle = "#fff";
            cx.font = `bold ${p.h * 0.65}px ${font}`;
            cx.textAlign = "center";
            cx.fillText(`×${p.type}`, p.x + p.w / 2, p.y + p.h * 0.72);
         }

         // paddle
         cx.fillStyle = "#fff";
         cx.beginPath();
         cx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, paddle.h / 2);
         cx.fill();

         // balls
         cx.fillStyle = "#fff";
         for (const ball of gs.balls) {
            cx.beginPath();
            cx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            cx.fill();
         }

         // UI
         if (gs.phase === "start") {
            const titleSize = clamp(W * 0.03, 18, 36);
            const descSize = clamp(W * 0.016, 12, 20);
            const hintSize = clamp(W * 0.014, 11, 18);
            const maxTextW = Math.min(W * 0.7, 500);
            const lineHeight = descSize * 1.5;

            cx.textAlign = "center";

            // title
            cx.fillStyle = "rgba(255,255,255,0.9)";
            cx.font = `bold ${titleSize}px ${font}`;
            const titleY = H * 0.5;
            cx.fillText(texts.title, W / 2, titleY);

            // description (wrapped)
            cx.fillStyle = "rgba(255,255,255,0.5)";
            cx.font = `${descSize}px ${font}`;
            const { lines } = wrapText(
               texts.description,
               W / 2,
               maxTextW,
               lineHeight,
            );
            let descY = titleY + titleSize * 1.2;
            for (const line of lines) {
               cx.fillText(line, W / 2, descY);
               descY += lineHeight;
            }

            // hint
            cx.fillStyle = "rgba(255,255,255,0.35)";
            cx.font = `${hintSize}px ${font}`;
            cx.fillText(texts.start, W / 2, descY + hintSize * 1.2);
         }

         if (gs.phase === "playing") {
            cx.fillStyle = "rgba(255,255,255,0.3)";
            cx.font = `${clamp(W * 0.015, 12, 18)}px ${font}`;
            cx.textAlign = "left";
            cx.fillText(`${gs.score} / ${gs.totalBricks}`, 16, 30);
         }

         if (gs.phase === "win") {
            cx.textAlign = "center";
            cx.fillStyle = "rgba(255,255,255,0.9)";
            cx.font = `bold ${clamp(W * 0.03, 20, 40)}px ${font}`;
            cx.fillText(texts.win, W / 2, H * 0.55);
            cx.font = `${clamp(W * 0.018, 13, 22)}px ${font}`;
            cx.fillStyle = "rgba(255,255,255,0.5)";
            cx.fillText(texts.restart, W / 2, H * 0.62);
         }
      }

      function tick() {
         const gs = stateRef.current;
         if (gs) {
            update(gs);
            draw(gs);
         }
         rafRef.current = requestAnimationFrame(tick);
      }

      // --- Interaction helpers ---
      function handleStart(gs: GameState) {
         if (gs.phase === "start") {
            launchBall(gs);
         } else if (
            gs.phase === "playing" &&
            gs.balls[0] &&
            !gs.balls[0].launched
         ) {
            launchBall(gs);
         } else if (gs.phase === "win") {
            stateRef.current = initState();
            stateRef.current.phase = "start";
         }
      }

      // --- Input handlers ---
      function onKeyDown(e: KeyboardEvent) {
         keysRef.current.add(e.key);
         const gs = stateRef.current;
         if (!gs) return;
         if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleStart(gs);
         }
      }

      function onKeyUp(e: KeyboardEvent) {
         keysRef.current.delete(e.key);
      }

      function onMouseMove(e: MouseEvent) {
         const gs = stateRef.current;
         if (!gs) return;
         mouseActiveRef.current = true;
         movePaddleTo(gs, e.clientX);
      }

      function onClick() {
         const gs = stateRef.current;
         if (!gs) return;
         handleStart(gs);
      }

      function onTouchStart(e: TouchEvent) {
         e.preventDefault();
         const touch = e.touches[0];
         touchRef.current = touch.clientX;
         const gs = stateRef.current;
         if (!gs) return;
         handleStart(gs);
      }

      function onTouchMove(e: TouchEvent) {
         e.preventDefault();
         const gs = stateRef.current;
         if (!gs || touchRef.current === null) return;
         const touch = e.touches[0];
         const delta = touch.clientX - touchRef.current;
         touchRef.current = touch.clientX;
         gs.paddle.x = clamp(gs.paddle.x + delta, 0, W - gs.paddle.w);
         const unlaunched = gs.balls.find((b) => !b.launched);
         if (unlaunched) {
            unlaunched.x = gs.paddle.x + gs.paddle.w / 2;
         }
      }

      function onTouchEnd() {
         touchRef.current = null;
      }

      // --- Init ---
      resize();
      stateRef.current = initState();

      window.addEventListener("resize", resize);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      window.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("click", onClick);
      canvas.addEventListener("touchstart", onTouchStart, { passive: false });
      canvas.addEventListener("touchmove", onTouchMove, { passive: false });
      canvas.addEventListener("touchend", onTouchEnd);

      rafRef.current = requestAnimationFrame(tick);

      return () => {
         cancelAnimationFrame(rafRef.current);
         window.removeEventListener("resize", resize);
         window.removeEventListener("keydown", onKeyDown);
         window.removeEventListener("keyup", onKeyUp);
         window.removeEventListener("mousemove", onMouseMove);
         canvas.removeEventListener("click", onClick);
         canvas.removeEventListener("touchstart", onTouchStart);
         canvas.removeEventListener("touchmove", onTouchMove);
         canvas.removeEventListener("touchend", onTouchEnd);
      };
   }, []);

   return (
      <div className={s.wrapper}>
         <canvas ref={canvasRef} className={s.canvas} />
      </div>
   );
}
