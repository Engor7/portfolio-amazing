"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./EyesButton.module.scss";

const Eye = ({
   mousePos,
   size = 80,
}: {
   mousePos: { x: number; y: number } | null;
   size?: number;
}) => {
   const eyeRef = useRef<HTMLDivElement>(null);
   const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

   useEffect(() => {
      if (!eyeRef.current || !mousePos) return;

      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const dx = mousePos.x - eyeCenterX;
      const dy = mousePos.y - eyeCenterY;
      const angle = Math.atan2(dy, dx);
      const maxMove = size * 0.22;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), size);
      const move = (dist / size) * maxMove;

      setPupilPos({
         x: Math.cos(angle) * move,
         y: Math.sin(angle) * move,
      });
   }, [mousePos, size]);

   return (
      <div
         ref={eyeRef}
         className={styles.eye}
         style={{ width: size, height: size }}
      >
         <div
            className={styles.pupil}
            style={{
               width: size * 0.28,
               height: size * 0.28,
               transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
            }}
         />
      </div>
   );
};

const EyesButton = () => {
   const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
      null,
   );
   const [hovered, setHovered] = useState(false);

   useEffect(() => {
      let rafId = 0;
      const handleMove = (e: MouseEvent) => {
         cancelAnimationFrame(rafId);
         rafId = requestAnimationFrame(() => {
            setMousePos({ x: e.clientX, y: e.clientY });
         });
      };
      window.addEventListener("mousemove", handleMove);
      return () => {
         window.removeEventListener("mousemove", handleMove);
         cancelAnimationFrame(rafId);
      };
   }, []);

   return (
      <div className={styles.wrapper}>
         <button
            type="button"
            className={`${styles.button} ${hovered ? styles.hovered : ""}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
         >
            <span className={styles.label}>Get in touch</span>
            <div className={styles.eyes}>
               <Eye mousePos={mousePos} size={40} />
               <Eye mousePos={mousePos} size={40} />
            </div>
         </button>
      </div>
   );
};

export default EyesButton;
