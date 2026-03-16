import type { Point } from "./types";

export function thinPoints(points: Point[], minDist = 2): Point[] {
   if (points.length <= 2) return points;
   const result: Point[] = [points[0]];
   const minDistSq = minDist * minDist;

   for (let i = 1; i < points.length - 1; i++) {
      const prev = result[result.length - 1];
      const dx = points[i].x - prev.x;
      const dy = points[i].y - prev.y;
      if (dx * dx + dy * dy >= minDistSq) {
         result.push(points[i]);
      }
   }

   result.push(points[points.length - 1]);
   return result;
}

function catmullRomControlPoints(
   p0: Point,
   p1: Point,
   p2: Point,
   p3: Point,
): { cp1x: number; cp1y: number; cp2x: number; cp2y: number } {
   return {
      cp1x: p1.x + (p2.x - p0.x) / 6,
      cp1y: p1.y + (p2.y - p0.y) / 6,
      cp2x: p2.x - (p3.x - p1.x) / 6,
      cp2y: p2.y - (p3.y - p1.y) / 6,
   };
}

function catmullRomToBezierPath(points: Point[]): string {
   if (points.length === 0) return "";
   if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
   if (points.length === 2) {
      return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
   }

   const padded = [points[0], ...points, points[points.length - 1]];
   let d = `M ${padded[1].x},${padded[1].y}`;

   for (let i = 0; i < padded.length - 3; i++) {
      const p2 = padded[i + 2];
      const { cp1x, cp1y, cp2x, cp2y } = catmullRomControlPoints(
         padded[i],
         padded[i + 1],
         p2,
         padded[i + 3],
      );
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
   }

   return d;
}

/**
 * Returns the cubic bezier `C ...` command for segment at index `i`
 * using Catmull-Rom math with neighboring points for control points.
 * `points` should already be thinned. Index `i` produces the curve from points[i] to points[i+1].
 */
export function catmullRomSegment(points: Point[], i: number): string {
   if (points.length < 2 || i < 0 || i >= points.length - 1) return "";

   const p0 = points[Math.max(i - 1, 0)];
   const p1 = points[i];
   const p2 = points[i + 1];
   const p3 = points[Math.min(i + 2, points.length - 1)];
   const { cp1x, cp1y, cp2x, cp2y } = catmullRomControlPoints(p0, p1, p2, p3);

   return `M ${p1.x},${p1.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
}

export function pointsToSmoothPath(points: Point[]): string {
   return catmullRomToBezierPath(thinPoints(points));
}

/** HSV (h 0-1, s 0-1, v 0-1) → hex "#rrggbb" */
export function hsvToHex(h: number, s: number, v: number): string {
   const hh = ((h % 1) + 1) % 1;
   const i = Math.floor(hh * 6);
   const f = hh * 6 - i;
   const p = v * (1 - s);
   const q = v * (1 - f * s);
   const t = v * (1 - (1 - f) * s);
   let r: number, g: number, b: number;
   switch (i % 6) {
      case 0:
         r = v;
         g = t;
         b = p;
         break;
      case 1:
         r = q;
         g = v;
         b = p;
         break;
      case 2:
         r = p;
         g = v;
         b = t;
         break;
      case 3:
         r = p;
         g = q;
         b = v;
         break;
      case 4:
         r = t;
         g = p;
         b = v;
         break;
      default:
         r = v;
         g = p;
         b = q;
         break;
   }
   const ri = (r * 255) | 0;
   const gi = (g * 255) | 0;
   const bi = (b * 255) | 0;
   return `#${((ri << 16) | (gi << 8) | bi).toString(16).padStart(6, "0")}`;
}
