"use client";

import type { CSSProperties } from "react";
import { memo } from "react";
import s from "../music.module.scss";

interface CellProps {
   active: boolean;
   isCurrent: boolean;
   color: string;
   groupStart: boolean;
   trackId: string;
   step: number;
}

export const Cell = memo(function Cell({
   active,
   isCurrent,
   color,
   groupStart,
   trackId,
   step,
}: CellProps) {
   const isPulsing = active && isCurrent;
   return (
      <button
         type="button"
         className={`${s.cell} ${active ? s.cellActive : ""} ${isCurrent ? s.cellCurrent : ""} ${groupStart ? s.cellGroupStart : ""} ${isPulsing ? s.cellPulse : ""}`}
         style={
            active
               ? ({
                    backgroundColor: color,
                    "--cell-color": `${color}55`,
                    "--cell-glow": `${color}90`,
                 } as CSSProperties)
               : undefined
         }
         data-cell={`${trackId}:${step}`}
      />
   );
});
