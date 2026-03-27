"use client";

import { useEffect, useRef } from "react";

interface Particle {
   x: number;
   y: number;
   vx: number;
   vy: number;
   size: number;
   alpha: number;
   life: number;
   maxLife: number;
   initialDist: number;
}

interface MousePos {
   x: number;
   y: number;
   active: boolean;
}

// Extract vibrant color from image
const extractColor = (
   imageSrc: string,
): Promise<{ r: number; g: number; b: number }> => {
   return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
         const canvas = document.createElement("canvas");
         const ctx = canvas.getContext("2d");
         if (!ctx) {
            resolve({ r: 255, g: 140, b: 50 });
            return;
         }

         const size = 60;
         canvas.width = size;
         canvas.height = size;
         ctx.drawImage(img, 0, 0, size, size);

         const imageData = ctx.getImageData(0, 0, size, size);
         const data = imageData.data;

         let totalR = 0;
         let totalG = 0;
         let totalB = 0;
         let count = 0;

         // Sample pixels to find dominant color
         for (let y = 0; y < size; y += 2) {
            for (let x = 0; x < size; x += 2) {
               const i = (y * size + x) * 4;
               const r = data[i];
               const g = data[i + 1];
               const b = data[i + 2];

               // Skip very dark or very light pixels
               const brightness = (r + g + b) / 3;
               if (brightness > 30 && brightness < 220) {
                  totalR += r;
                  totalG += g;
                  totalB += b;
                  count++;
               }
            }
         }

         if (count > 0) {
            resolve({
               r: Math.floor(totalR / count),
               g: Math.floor(totalG / count),
               b: Math.floor(totalB / count),
            });
         } else {
            resolve({ r: 255, g: 140, b: 50 });
         }
      };
      img.onerror = () => resolve({ r: 255, g: 140, b: 50 });
      img.src = imageSrc;
   });
};

interface ParticlesBackgroundProps {
   imageSrc?: string;
}

const ParticlesBackground = ({ imageSrc }: ParticlesBackgroundProps) => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const particlesRef = useRef<Particle[]>([]);
   const animationRef = useRef<number>(0);
   const timeRef = useRef<number>(0);
   const mouseRef = useRef<MousePos>({ x: 0, y: 0, active: false });
   const currentColorRef = useRef({ r: 255, g: 140, b: 50 });
   const targetColorRef = useRef({ r: 255, g: 140, b: 50 });

   // Update target color when imageSrc changes
   useEffect(() => {
      if (imageSrc) {
         extractColor(imageSrc).then((color) => {
            targetColorRef.current = color;
         });
      }
   }, [imageSrc]);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const getCanvasSize = () => {
         return { width: window.innerWidth, height: window.innerHeight };
      };

      const isMobile = () => getCanvasSize().width < 768;

      const getCenter = () => {
         const { width, height } = getCanvasSize();
         return { centerX: width / 2, centerY: height / 2 };
      };

      const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
         const dx = x2 - x1;
         const dy = y2 - y1;
         return { dx, dy, dist: Math.sqrt(dx * dx + dy * dy) };
      };

      const resizeCanvas = () => {
         const dpr = window.devicePixelRatio || 1;
         const { width, height } = getCanvasSize();
         canvas.width = width * dpr;
         canvas.height = height * dpr;
         canvas.style.width = `${width}px`;
         canvas.style.height = `${height}px`;
         ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      resizeCanvas();

      const handleMouseMove = (e: MouseEvent) => {
         mouseRef.current = {
            x: e.clientX,
            y: e.clientY,
            active: true,
         };
      };

      const handleMouseLeave = () => {
         mouseRef.current.active = false;
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);

      const createParticle = (): Particle => {
         const { width, height } = getCanvasSize();
         const mobile = isMobile();
         const isHorizontal = Math.random() < 0.7;

         let x: number, y: number;

         if (isHorizontal) {
            const side = Math.random() < 0.5 ? 0 : width;
            x = side + (Math.random() - 0.5) * 20;
            y = Math.random() * height;
         } else {
            x = Math.random() * width;
            const side = Math.random() < 0.5 ? 0 : height;
            y = side + (Math.random() - 0.5) * 20;
         }

         const { centerX, centerY } = getCenter();
         const { dx, dy, dist } = getDistance(x, y, centerX, centerY);

         const baseSpeed = mobile ? 0.25 : 0.35;
         const speed = baseSpeed + Math.random() * 0.15;

         const travelTime = dist / speed;
         const maxLife = travelTime * (0.9 + Math.random() * 0.2);

         return {
            x,
            y,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed,
            size: mobile ? 0.6 + Math.random() : 0.8 + Math.random() * 1.5,
            alpha: 0.12 + Math.random() * 0.9,
            life: 0,
            maxLife,
            initialDist: dist,
         };
      };

      const initParticles = () => {
         const { width } = getCanvasSize();
         const mobile = width < 768;
         const particleCount = mobile ? 350 : 700;

         particlesRef.current = [];
         for (let i = 0; i < particleCount; i++) {
            const particle = createParticle();
            particle.life = (i / particleCount) * particle.maxLife * 0.8;
            const { centerX, centerY } = getCenter();
            const progress = particle.life / particle.maxLife;
            const { dx, dy } = getDistance(
               particle.x,
               particle.y,
               centerX,
               centerY,
            );
            particle.x += dx * progress * 0.6;
            particle.y += dy * progress * 0.6;
            particlesRef.current.push(particle);
         }
      };

      initParticles();

      let lastWidth = getCanvasSize().width;
      const handleResize = () => {
         resizeCanvas();
         const newWidth = getCanvasSize().width;
         if (lastWidth < 768 !== newWidth < 768) {
            initParticles();
         }
         lastWidth = newWidth;
      };

      window.addEventListener("resize", handleResize);

      const animate = () => {
         const { width, height } = getCanvasSize();
         const mobile = isMobile();
         const { centerX, centerY } = getCenter();
         timeRef.current += 0.01;
         ctx.clearRect(0, 0, width, height);

         // Smoothly interpolate color
         const lerpSpeed = 0.02;
         currentColorRef.current.r +=
            (targetColorRef.current.r - currentColorRef.current.r) * lerpSpeed;
         currentColorRef.current.g +=
            (targetColorRef.current.g - currentColorRef.current.g) * lerpSpeed;
         currentColorRef.current.b +=
            (targetColorRef.current.b - currentColorRef.current.b) * lerpSpeed;

         const { r, g, b } = currentColorRef.current;

         const CENTER_FORCE = mobile ? 0.0002 : 0.00025;
         const WIND_STRENGTH = mobile ? 0.08 : 0.12;
         const TURBULENCE = mobile ? 0.04 : 0.06;
         const FRICTION = 0.995;

         const MOUSE_RADIUS = mobile ? 60 : 100;
         const MOUSE_FORCE = mobile ? 0.2 : 0.4;

         const mouse = mouseRef.current;

         particlesRef.current.forEach((particle, index) => {
            const { dx, dy, dist } = getDistance(
               particle.x,
               particle.y,
               centerX,
               centerY,
            );

            particle.vx += (dx / dist) * CENTER_FORCE * (dist * 0.01);
            particle.vy += (dy / dist) * CENTER_FORCE * (dist * 0.01);

            if (mouse.active) {
               const {
                  dx: mouseDx,
                  dy: mouseDy,
                  dist: mouseDist,
               } = getDistance(mouse.x, mouse.y, particle.x, particle.y);

               if (mouseDist < MOUSE_RADIUS && mouseDist > 0) {
                  const force = (1 - mouseDist / MOUSE_RADIUS) * MOUSE_FORCE;
                  particle.vx += (mouseDx / mouseDist) * force;
                  particle.vy += (mouseDy / mouseDist) * force;
               }
            }

            const time = timeRef.current;
            particle.vx +=
               Math.sin(time * 0.5 + particle.y * 0.003) * WIND_STRENGTH * 0.01;
            particle.vy +=
               Math.cos(time * 0.3 + particle.x * 0.003) *
               WIND_STRENGTH *
               0.5 *
               0.01;
            particle.vx +=
               Math.sin(particle.x * 0.008 + time) * TURBULENCE * 0.01;
            particle.vy +=
               Math.cos(particle.y * 0.008 + time) * TURBULENCE * 0.01;

            particle.vx *= FRICTION;
            particle.vy *= FRICTION;

            particle.x += particle.vx;
            particle.y += particle.vy;

            particle.life++;

            let alpha = particle.alpha;

            const fadeInDuration = 50;
            if (particle.life < fadeInDuration) {
               alpha *= particle.life / fadeInDuration;
            }

            const fadeOutDuration = 100;
            if (particle.life > particle.maxLife - fadeOutDuration) {
               alpha *= (particle.maxLife - particle.life) / fadeOutDuration;
            }

            const centerFadeRadius = mobile ? 80 : 120;
            if (dist < centerFadeRadius) {
               alpha *= dist / centerFadeRadius;
            }

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
            ctx.fill();

            const respawnRadius = mobile ? 70 : 100;
            if (particle.life >= particle.maxLife || dist < respawnRadius) {
               particlesRef.current[index] = createParticle();
            }
         });

         animationRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
         window.removeEventListener("resize", handleResize);
         window.removeEventListener("mousemove", handleMouseMove);
         window.removeEventListener("mouseleave", handleMouseLeave);
         cancelAnimationFrame(animationRef.current);
      };
   }, []);

   return (
      <canvas
         ref={canvasRef}
         style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: -1,
         }}
      />
   );
};

export default ParticlesBackground;
