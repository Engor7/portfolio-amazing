"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shaders";

const config = {
   lerpFactor: 0.035,
   parallaxStrength: 0.1,
   distortionMultiplier: 10,
   glassStrength: 2.0,
   glassSmoothness: 0.0001,
   stripesFrequency: 22,
   edgePadding: 0.1,
};

export default function PrismVeilPage() {
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const heroSection = container.querySelector<HTMLElement>(".hero");
      if (!heroSection) return;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      heroSection.appendChild(renderer.domElement);

      const mouse = { x: 0.5, y: 0.5 };
      const targetMouse = { x: 0.5, y: 0.5 };

      const lerp = (start: number, end: number, factor: number) =>
         start + (end - start) * factor;

      const textureSize = { x: 1, y: 1 };
      const material = new THREE.ShaderMaterial({
         uniforms: {
            uTexture: { value: null },
            uResolution: {
               value: new THREE.Vector2(window.innerWidth, window.innerHeight),
            },
            uTextureSize: {
               value: new THREE.Vector2(textureSize.x, textureSize.y),
            },
            uMouse: { value: new THREE.Vector2(mouse.x, mouse.y) },
            uParallaxStrength: { value: config.parallaxStrength },
            uDistortionMultiplier: { value: config.distortionMultiplier },
            uGlassStrength: { value: config.glassStrength },
            ustripesFrequency: { value: config.stripesFrequency },
            uglassSmoothness: { value: config.glassSmoothness },
            uEdgePadding: { value: config.edgePadding },
         },
         vertexShader,
         fragmentShader,
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let loadedTexture: THREE.Texture | null = null;
      let disposed = false;

      const loader = new THREE.TextureLoader();
      loader.load("/exp/prism-veil/hero.jpg", (texture) => {
         if (disposed) {
            texture.dispose();
            return;
         }
         loadedTexture = texture;
         textureSize.x = texture.image.naturalWidth || texture.image.width;
         textureSize.y = texture.image.naturalHeight || texture.image.height;
         material.uniforms.uTexture.value = texture;
         material.uniforms.uTextureSize.value.set(textureSize.x, textureSize.y);
      });

      let lastMouseMove = 0;
      let hasMouseMoved = false;

      const onMouseMove = (e: MouseEvent) => {
         hasMouseMoved = true;
         lastMouseMove = performance.now();
         targetMouse.x = e.clientX / window.innerWidth;
         targetMouse.y = 1.0 - e.clientY / window.innerHeight;
      };

      const onResize = () => {
         renderer.setSize(window.innerWidth, window.innerHeight);
         material.uniforms.uResolution.value.set(
            window.innerWidth,
            window.innerHeight,
         );
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("resize", onResize);

      let animId: number;
      function animate() {
         animId = requestAnimationFrame(animate);

         const idle =
            !hasMouseMoved || performance.now() - lastMouseMove > 2000;
         if (idle) {
            const time = performance.now() * 0.0008;
            targetMouse.x = 0.5 + 0.45 * Math.sin(time);
            targetMouse.y = 0.5 + 0.35 * Math.cos(time * 0.7);
         }

         mouse.x = lerp(mouse.x, targetMouse.x, config.lerpFactor);
         mouse.y = lerp(mouse.y, targetMouse.y, config.lerpFactor);
         material.uniforms.uMouse.value.set(mouse.x, mouse.y);

         renderer.render(scene, camera);
      }

      animate();

      return () => {
         disposed = true;
         cancelAnimationFrame(animId);
         window.removeEventListener("mousemove", onMouseMove);
         window.removeEventListener("resize", onResize);
         heroSection.removeChild(renderer.domElement);
         renderer.dispose();
         geometry.dispose();
         material.dispose();
         loadedTexture?.dispose();
      };
   }, []);

   return (
      <div ref={containerRef}>
         <nav>
            <div className="logo">
               <a href="/">&#8486; Prism Veil</a>
            </div>
            <div className="nav-links">
               <a href="/">Experiments</a>
               <a href="/">Objects</a>
               <a href="/">Exhibits</a>
            </div>
         </nav>

         <section className="hero">
            <div className="hero-content">
               <h1>Designed for the space between silence and noise.</h1>
               <p>Developed by Codegrid</p>
            </div>
         </section>
      </div>
   );
}
