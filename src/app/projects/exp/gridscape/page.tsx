"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { projects } from "./data";
import { fragmentShader, vertexShader } from "./shaders";

const config = {
   cellSize: 0.75,
   zoomLevel: 1.25,
   lerpFactor: 0.075,
   borderColor: "rgba(255, 255, 255, 0.15)",
   backgroundColor: "rgba(0, 0, 0, 1)",
   textColor: "rgba(128, 128, 128, 1)",
   hoverColor: "rgba(255, 255, 255, 0)",
};

const rgbaToArray = (rgba: string): [number, number, number, number] => {
   const match = rgba.match(/rgba?\(([^)]+)\)/);
   if (!match) return [1, 1, 1, 1];
   const parts = match[1]
      .split(",")
      .map((v, i) =>
         i < 3 ? parseFloat(v.trim()) / 255 : parseFloat(v.trim() || "1"),
      );
   return [parts[0], parts[1], parts[2], parts[3]] as [
      number,
      number,
      number,
      number,
   ];
};

export default function PhantomPage() {
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const galleryEl = container.querySelector<HTMLElement>("#gallery");
      if (!galleryEl) return;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const renderer = new THREE.WebGLRenderer({
         antialias: true,
         alpha: false,
      });
      renderer.setSize(galleryEl.offsetWidth, galleryEl.offsetHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      const bgColor = rgbaToArray(config.backgroundColor);
      renderer.setClearColor(
         new THREE.Color(bgColor[0], bgColor[1], bgColor[2]),
         bgColor[3],
      );
      galleryEl.appendChild(renderer.domElement);

      let plane: THREE.Mesh | null = null;

      let isDragging = false;
      const previousMouse = { x: 0, y: 0 };
      const offset = { x: 1.125, y: 1.125 };
      const targetOffset = { x: 1.125, y: 1.125 };
      const mousePosition = { x: -1, y: -1 };
      let zoomLevel = 1.0;
      let targetZoom = 1.0;

      const createTextTexture = (title: string, year: number) => {
         const canvas = document.createElement("canvas");
         canvas.width = 2048;
         canvas.height = 256;
         const ctx = canvas.getContext("2d");
         if (!ctx) return new THREE.CanvasTexture(canvas);

         ctx.clearRect(0, 0, 2048, 256);
         ctx.font = "80px IBM Plex Mono";
         ctx.fillStyle = config.textColor;
         ctx.textBaseline = "middle";
         ctx.imageSmoothingEnabled = false;

         ctx.textAlign = "left";
         ctx.fillText(title.toUpperCase(), 30, 128);
         ctx.textAlign = "right";
         ctx.fillText(year.toString().toUpperCase(), 2048 - 30, 128);

         const texture = new THREE.CanvasTexture(canvas);
         Object.assign(texture, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            flipY: false,
            generateMipmaps: false,
            format: THREE.RGBAFormat,
         });

         return texture;
      };

      const createTextureAtlas = (
         textures: THREE.Texture[],
         isText = false,
      ) => {
         const atlasSize = Math.ceil(Math.sqrt(textures.length));
         const textureSize = 512;
         const canvas = document.createElement("canvas");
         canvas.width = canvas.height = atlasSize * textureSize;
         const ctx = canvas.getContext("2d");
         if (!ctx) return new THREE.CanvasTexture(canvas);

         if (isText) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
         } else {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
         }

         textures.forEach((texture, index) => {
            const x = (index % atlasSize) * textureSize;
            const y = Math.floor(index / atlasSize) * textureSize;

            if (isText && texture.source?.data) {
               ctx.drawImage(
                  texture.source.data as HTMLCanvasElement,
                  x,
                  y,
                  textureSize,
                  textureSize,
               );
            } else if (
               !isText &&
               (texture.image as HTMLImageElement)?.complete
            ) {
               const img = texture.image as HTMLImageElement;
               const imgW = img.naturalWidth || img.width;
               const imgH = img.naturalHeight || img.height;
               const scale = Math.max(textureSize / imgW, textureSize / imgH);
               const srcW = textureSize / scale;
               const srcH = textureSize / scale;
               const sx = (imgW - srcW) / 2;
               const sy = (imgH - srcH) / 2;
               ctx.drawImage(img, sx, sy, srcW, srcH, x, y, textureSize, textureSize);
            }
         });

         const atlasTexture = new THREE.CanvasTexture(canvas);
         Object.assign(atlasTexture, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            flipY: false,
         });

         return atlasTexture;
      };

      const textTextures = projects.map((p) =>
         createTextTexture(p.title, p.year),
      );

      const loadTextures = (): Promise<THREE.Texture[]> => {
         const textureLoader = new THREE.TextureLoader();
         const imageTextures: THREE.Texture[] = [];
         let loadedCount = 0;

         return new Promise((resolve) => {
            projects.forEach((project) => {
               const texture = textureLoader.load(project.image, () => {
                  if (++loadedCount === projects.length) resolve(imageTextures);
               });

               Object.assign(texture, {
                  wrapS: THREE.ClampToEdgeWrapping,
                  wrapT: THREE.ClampToEdgeWrapping,
                  minFilter: THREE.LinearFilter,
                  magFilter: THREE.LinearFilter,
               });

               imageTextures.push(texture);
            });
         });
      };

      const startDrag = (x: number, y: number) => {
         isDragging = true;
         document.body.classList.add("dragging");
         previousMouse.x = x;
         previousMouse.y = y;
         setTimeout(() => {
            if (isDragging) targetZoom = config.zoomLevel;
         }, 150);
      };

      const handleMove = (currentX: number, currentY: number) => {
         if (!isDragging) return;

         const deltaX = currentX - previousMouse.x;
         const deltaY = currentY - previousMouse.y;

         if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
            if (targetZoom === 1.0) targetZoom = config.zoomLevel;
         }

         targetOffset.x -= deltaX * 0.003;
         targetOffset.y += deltaY * 0.003;
         previousMouse.x = currentX;
         previousMouse.y = currentY;
      };

      const onMouseDown = (e: MouseEvent) => startDrag(e.clientX, e.clientY);
      const onTouchStart = (e: TouchEvent) => {
         e.preventDefault();
         startDrag(e.touches[0].clientX, e.touches[0].clientY);
      };
      const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
      const onTouchMove = (e: TouchEvent) => {
         e.preventDefault();
         handleMove(e.touches[0].clientX, e.touches[0].clientY);
      };

      const onPointerUp = () => {
         isDragging = false;
         document.body.classList.remove("dragging");
         targetZoom = 1.0;
      };

      const updateMousePosition = (event: MouseEvent) => {
         const rect = renderer.domElement.getBoundingClientRect();
         mousePosition.x = event.clientX - rect.left;
         mousePosition.y = event.clientY - rect.top;
         if (plane) {
            (
               plane.material as THREE.ShaderMaterial
            ).uniforms.uMousePos.value.set(mousePosition.x, mousePosition.y);
         }
      };

      const onMouseLeaveCanvas = () => {
         mousePosition.x = mousePosition.y = -1;
         if (plane) {
            (
               plane.material as THREE.ShaderMaterial
            ).uniforms.uMousePos.value.set(-1, -1);
         }
      };

      const onResize = () => {
         const { offsetWidth: width, offsetHeight: height } = galleryEl;
         camera.updateProjectionMatrix();
         renderer.setSize(width, height);
         renderer.setPixelRatio(window.devicePixelRatio);
         if (plane) {
            (
               plane.material as THREE.ShaderMaterial
            ).uniforms.uResolution.value.set(width, height);
         }
      };

      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onPointerUp);
      document.addEventListener("mouseleave", onPointerUp);
      document.addEventListener("touchstart", onTouchStart, { passive: false });
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", onPointerUp);
      window.addEventListener("resize", onResize);
      document.addEventListener("contextmenu", (e) => e.preventDefault());
      renderer.domElement.addEventListener("mousemove", updateMousePosition);
      renderer.domElement.addEventListener("mouseleave", onMouseLeaveCanvas);

      let animId: number;
      const animate = () => {
         animId = requestAnimationFrame(animate);

         offset.x += (targetOffset.x - offset.x) * config.lerpFactor;
         offset.y += (targetOffset.y - offset.y) * config.lerpFactor;
         zoomLevel += (targetZoom - zoomLevel) * config.lerpFactor;

         if (plane) {
            const mat = plane.material as THREE.ShaderMaterial;
            mat.uniforms.uOffset.value.set(offset.x, offset.y);
            mat.uniforms.uZoom.value = zoomLevel;
         }

         renderer.render(scene, camera);
      };

      loadTextures().then((imageTextures) => {
         const imageAtlas = createTextureAtlas(imageTextures, false);
         const textAtlas = createTextureAtlas(textTextures, true);

         const uniforms = {
            uOffset: { value: new THREE.Vector2(0, 0) },
            uResolution: {
               value: new THREE.Vector2(
                  galleryEl.offsetWidth,
                  galleryEl.offsetHeight,
               ),
            },
            uBorderColor: {
               value: new THREE.Vector4(...rgbaToArray(config.borderColor)),
            },
            uHoverColor: {
               value: new THREE.Vector4(...rgbaToArray(config.hoverColor)),
            },
            uBackgroundColor: {
               value: new THREE.Vector4(...rgbaToArray(config.backgroundColor)),
            },
            uMousePos: { value: new THREE.Vector2(-1, -1) },
            uZoom: { value: 1.0 },
            uCellSize: { value: config.cellSize },
            uTextureCount: { value: projects.length },
            uImageAtlas: { value: imageAtlas },
            uTextAtlas: { value: textAtlas },
         };

         const geometry = new THREE.PlaneGeometry(2, 2);
         const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
         });

         plane = new THREE.Mesh(geometry, material);
         scene.add(plane);
      });

      animate();

      return () => {
         cancelAnimationFrame(animId);
         document.removeEventListener("mousedown", onMouseDown);
         document.removeEventListener("mousemove", onMouseMove);
         document.removeEventListener("mouseup", onPointerUp);
         document.removeEventListener("mouseleave", onPointerUp);
         document.removeEventListener("touchstart", onTouchStart);
         document.removeEventListener("touchmove", onTouchMove);
         document.removeEventListener("touchend", onPointerUp);
         window.removeEventListener("resize", onResize);
         renderer.domElement.removeEventListener(
            "mousemove",
            updateMousePosition,
         );
         renderer.domElement.removeEventListener(
            "mouseleave",
            onMouseLeaveCanvas,
         );
         renderer.dispose();
      };
   }, []);

   return (
      <div ref={containerRef}>
         <section id="gallery">
            <div className="vignette-overlay"></div>
         </section>
      </div>
   );
}
