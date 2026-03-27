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

const ParticlesCanvas = () => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const particlesRef = useRef<Particle[]>([]);
   const animationRef = useRef<number>(0);
   const timeRef = useRef<number>(0);
   const mouseRef = useRef<MousePos>({ x: 0, y: 0, active: false });

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const getCanvasSize = () => {
         const rect = canvas.getBoundingClientRect();
         return { width: rect.width, height: rect.height };
      };

      const isMobile = () => {
         const { width } = getCanvasSize();
         return width < 768;
      };

      const resizeCanvas = () => {
         const dpr = window.devicePixelRatio || 1;
         const rect = canvas.getBoundingClientRect();
         canvas.width = rect.width * dpr;
         canvas.height = rect.height * dpr;
         ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      // Обработка движения мыши
      const handleMouseMove = (e: MouseEvent) => {
         const rect = canvas.getBoundingClientRect();
         mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            active: true,
         };
      };

      const handleMouseLeave = () => {
         mouseRef.current.active = false;
      };

      // Слушаем события на родительском элементе (footer)
      const footer = canvas.parentElement;
      if (footer) {
         footer.addEventListener("mousemove", handleMouseMove);
         footer.addEventListener("mouseleave", handleMouseLeave);
      }

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

         const centerX = width / 2;
         const centerY = height / 2;
         const dx = centerX - x;
         const dy = centerY - y;
         const dist = Math.sqrt(dx * dx + dy * dy);

         const baseSpeed = mobile ? 0.15 : 0.2;
         const speed = baseSpeed + Math.random() * 0.1;

         const travelTime = dist / speed;
         const maxLife = travelTime * (1.2 + Math.random() * 0.3);

         return {
            x,
            y,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed,
            size: mobile ? 0.8 + Math.random() * 1.2 : 1 + Math.random() * 2,
            alpha: 0.15 + Math.random() * 0.35,
            life: 0,
            maxLife,
            initialDist: dist,
         };
      };

      const initParticles = () => {
         const { width } = getCanvasSize();
         const mobile = width < 768;
         const particleCount = mobile ? 150 : 300;

         particlesRef.current = [];
         for (let i = 0; i < particleCount; i++) {
            const particle = createParticle();
            particle.life = (i / particleCount) * particle.maxLife * 0.8;
            const { width: w, height: h } = getCanvasSize();
            const centerX = w / 2;
            const centerY = h / 2;
            const progress = particle.life / particle.maxLife;
            const dx = centerX - particle.x;
            const dy = centerY - particle.y;
            particle.x = particle.x + dx * progress * 0.6;
            particle.y = particle.y + dy * progress * 0.6;
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

      window.removeEventListener("resize", resizeCanvas);
      window.addEventListener("resize", handleResize);

      const animate = () => {
         const { width, height } = getCanvasSize();
         const mobile = isMobile();
         timeRef.current += 0.01;
         ctx.clearRect(0, 0, width, height);

         const centerX = width / 2;
         const centerY = height / 2;

         const CENTER_FORCE = mobile ? 0.00015 : 0.0002;
         const WIND_STRENGTH = mobile ? 0.08 : 0.12;
         const TURBULENCE = mobile ? 0.04 : 0.06;
         const FRICTION = 0.995;

         // Параметры влияния мыши
         const MOUSE_RADIUS = mobile ? 80 : 120;
         const MOUSE_FORCE = mobile ? 0.3 : 0.5;

         const mouse = mouseRef.current;

         particlesRef.current.forEach((particle, index) => {
            const dx = centerX - particle.x;
            const dy = centerY - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Сила притяжения к центру
            particle.vx += (dx / dist) * CENTER_FORCE * (dist * 0.01);
            particle.vy += (dy / dist) * CENTER_FORCE * (dist * 0.01);

            // Влияние мыши - отталкивание
            if (mouse.active) {
               const mouseDx = particle.x - mouse.x;
               const mouseDy = particle.y - mouse.y;
               const mouseDist = Math.sqrt(
                  mouseDx * mouseDx + mouseDy * mouseDy,
               );

               if (mouseDist < MOUSE_RADIUS && mouseDist > 0) {
                  const force = (1 - mouseDist / MOUSE_RADIUS) * MOUSE_FORCE;
                  particle.vx += (mouseDx / mouseDist) * force;
                  particle.vy += (mouseDy / mouseDist) * force;
               }
            }

            // Ветер
            const windX =
               Math.sin(timeRef.current * 0.5 + particle.y * 0.005) *
               WIND_STRENGTH;
            const windY =
               Math.cos(timeRef.current * 0.3 + particle.x * 0.005) *
               WIND_STRENGTH *
               0.5;
            particle.vx += windX * 0.01;
            particle.vy += windY * 0.01;

            // Завихрения
            const turbX =
               Math.sin(particle.x * 0.01 + timeRef.current) * TURBULENCE;
            const turbY =
               Math.cos(particle.y * 0.01 + timeRef.current) * TURBULENCE;
            particle.vx += turbX * 0.01;
            particle.vy += turbY * 0.01;

            // Трение
            particle.vx *= FRICTION;
            particle.vy *= FRICTION;

            particle.x += particle.vx;
            particle.y += particle.vy;

            particle.life++;

            // Прозрачность
            let alpha = particle.alpha;

            const fadeInDuration = 80;
            if (particle.life < fadeInDuration) {
               alpha *= particle.life / fadeInDuration;
            }

            const fadeOutDuration = 150;
            if (particle.life > particle.maxLife - fadeOutDuration) {
               alpha *= (particle.maxLife - particle.life) / fadeOutDuration;
            }

            const centerFadeRadius = mobile ? 100 : 150;
            if (dist < centerFadeRadius) {
               alpha *= dist / centerFadeRadius;
            }

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 140, 50, ${alpha})`;
            ctx.fill();

            const respawnRadius = mobile ? 60 : 80;
            if (particle.life >= particle.maxLife || dist < respawnRadius) {
               particlesRef.current[index] = createParticle();
            }
         });

         animationRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
         window.removeEventListener("resize", handleResize);
         cancelAnimationFrame(animationRef.current);
         if (footer) {
            footer.removeEventListener("mousemove", handleMouseMove);
            footer.removeEventListener("mouseleave", handleMouseLeave);
         }
      };
   }, []);

   return (
      <canvas
         ref={canvasRef}
         style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
         }}
      />
   );
};

export default ParticlesCanvas;
