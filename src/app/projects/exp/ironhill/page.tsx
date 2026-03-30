"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import Image from "next/image";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shaders";

const CONFIG = {
   color: "#ebf5df",
   spread: 0.5,
   speed: 2,
};

function hexToRgb(hex: string) {
   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   return result
      ? {
           r: parseInt(result[1], 16) / 255,
           g: parseInt(result[2], 16) / 255,
           b: parseInt(result[3], 16) / 255,
        }
      : { r: 0.89, g: 0.89, b: 0.89 };
}

export default function IronhillPage() {
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      gsap.registerPlugin(ScrollTrigger, SplitText);

      const lenis = new Lenis();
      const raf = (time: number) => {
         lenis.raf(time);
         ScrollTrigger.update();
         rafId = requestAnimationFrame(raf);
      };
      let rafId = requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);

      const container = containerRef.current;
      if (!container) return;

      const canvasEl =
         container.querySelector<HTMLCanvasElement>(".hero-canvas");
      const hero = container.querySelector<HTMLElement>(".hero");
      if (!canvasEl || !hero) return;
      const h = hero;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const renderer = new THREE.WebGLRenderer({
         canvas: canvasEl,
         alpha: true,
         antialias: false,
      });

      function resize() {
         renderer.setSize(h.offsetWidth, h.offsetHeight);
         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }

      resize();

      const rgb = hexToRgb(CONFIG.color);
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
         vertexShader,
         fragmentShader,
         uniforms: {
            uProgress: { value: 0 },
            uResolution: {
               value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight),
            },
            uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
            uSpread: { value: CONFIG.spread },
         },
         transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let scrollProgress = 0;

      let threeAnimId: number;
      function animateThree() {
         material.uniforms.uProgress.value = scrollProgress;
         renderer.render(scene, camera);
         threeAnimId = requestAnimationFrame(animateThree);
      }
      animateThree();

      const onLenisScroll = ({ scroll }: { scroll: number }) => {
         const heroHeight = h.offsetHeight;
         const windowHeight = window.innerHeight;
         const maxScroll = heroHeight - windowHeight;
         scrollProgress = Math.min((scroll / maxScroll) * CONFIG.speed, 1.1);
      };
      lenis.on("scroll", onLenisScroll);

      const onResize = () => {
         resize();
         material.uniforms.uResolution.value.set(h.offsetWidth, h.offsetHeight);
      };
      window.addEventListener("resize", onResize);

      const heroH2 = container.querySelector<HTMLElement>(".hero-content h2");
      if (heroH2) {
         const split = new SplitText(heroH2, { type: "words" });
         const words = split.words;

         gsap.set(words, { opacity: 0 });

         ScrollTrigger.create({
            trigger: container.querySelector(".hero-content"),
            start: "top 25%",
            end: "bottom 100%",
            onUpdate: (self) => {
               const progress = self.progress;
               const totalWords = words.length;

               for (const [index, word] of words.entries()) {
                  const wordProgress = index / totalWords;
                  const nextWordProgress = (index + 1) / totalWords;

                  let opacity = 0;

                  if (progress >= nextWordProgress) {
                     opacity = 1;
                  } else if (progress >= wordProgress) {
                     opacity =
                        (progress - wordProgress) /
                        (nextWordProgress - wordProgress);
                  }

                  gsap.to(word, {
                     opacity,
                     duration: 0.1,
                     overwrite: true,
                  });
               }
            },
         });
      }

      return () => {
         cancelAnimationFrame(rafId);
         cancelAnimationFrame(threeAnimId);
         window.removeEventListener("resize", onResize);
         lenis.destroy();
         for (const t of ScrollTrigger.getAll()) t.kill();
         renderer.dispose();
         geometry.dispose();
         material.dispose();
      };
   }, []);

   return (
      <div ref={containerRef}>
         <section className="hero">
            <div className="hero-img">
               <Image src="/exp/ironhill/hero-img.jpg" alt="" fill />
            </div>

            <div className="hero-header">
               <h1>Iron Hill</h1>
               <p>Your body was built to move. Every morning proves it.</p>
            </div>

            <canvas className="hero-canvas"></canvas>

            <div className="hero-content">
               <h2>
                  The first kilometre is always a conversation with the part of
                  you that stayed in bed — by the third, that voice goes quiet,
                  and what remains is just the road, the breath, and the version
                  of yourself you are becoming.
               </h2>
            </div>
         </section>

         <section className="about">
            <p>
               Running in the morning is not a habit — it is a declaration.
               Before the city wakes, before the inbox fills, you have already
               done something hard. That hour belongs to no one but you: heart
               rate climbing, lungs opening, the body remembering what it was
               designed for. Movement is the oldest medicine, and consistency is
               its only dose. Show up tomorrow. Then the day after. The rest
               takes care of itself.
            </p>
         </section>
      </div>
   );
}
