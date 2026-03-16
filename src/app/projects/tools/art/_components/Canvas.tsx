import { memo, type RefObject } from "react";
import type { Stroke, Transform } from "../_lib/types";
import styles from "../art.module.scss";

interface CanvasProps {
   transform: Transform;
   strokes: Stroke[];
   inProgressRef: RefObject<SVGGElement | null>;
   svgRef: RefObject<SVGSVGElement | null>;
}

const Canvas = memo(
   ({ transform, strokes, inProgressRef, svgRef }: CanvasProps) => {
      return (
         <div
            className={styles.canvasInner}
            style={{
               transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
               transformOrigin: "0 0",
            }}
         >
            <svg
               ref={svgRef}
               viewBox="0 0 8000 6000"
               width="100%"
               height="100%"
               overflow="visible"
               className={styles.svg}
               role="img"
               aria-label="Drawing canvas"
            >
               <title>Drawing canvas</title>
               {strokes.map((stroke) => {
                  if (stroke.kind === "rainbow") {
                     return (
                        <g key={stroke.id}>
                           {stroke.segments.map((seg, segIdx) => (
                              <path
                                 key={`${stroke.id}-s${segIdx}`}
                                 d={seg.d}
                                 fill="none"
                                 stroke={seg.color}
                                 strokeWidth={stroke.width}
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                           ))}
                        </g>
                     );
                  }
                  return (
                     <path
                        key={stroke.id}
                        d={stroke.d}
                        fill="none"
                        stroke={stroke.color}
                        strokeWidth={stroke.width}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
                  );
               })}
               <g ref={inProgressRef} />
            </svg>
         </div>
      );
   },
);

Canvas.displayName = "Canvas";

export default Canvas;
