import type { Stroke } from "./types";

export function strokesToSvgString(strokes: Stroke[]): string {
   const paths = strokes
      .map((stroke) => {
         if (stroke.kind === "rainbow") {
            const segs = stroke.segments
               .map(
                  (seg) =>
                     `    <path d="${seg.d}" fill="none" stroke="${seg.color}" stroke-width="${stroke.width}" stroke-linecap="round" stroke-linejoin="round"/>`,
               )
               .join("\n");
            return `  <g>\n${segs}\n  </g>`;
         }
         return `  <path d="${stroke.d}" fill="none" stroke="${stroke.color}" stroke-width="${stroke.width}" stroke-linecap="round" stroke-linejoin="round"/>`;
      })
      .join("\n");

   return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8000 6000" width="8000" height="6000">\n${paths}\n</svg>`;
}

export function downloadSvg(strokes: Stroke[]): void {
   const svgString = strokesToSvgString(strokes);
   const blob = new Blob([svgString], { type: "image/svg+xml" });
   const url = URL.createObjectURL(blob);
   const a = document.createElement("a");
   a.href = url;
   a.download = "drawing.svg";
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
   URL.revokeObjectURL(url);
}
