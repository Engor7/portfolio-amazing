"use client";

import s from "../music.module.scss";

const FX_LIST: { key: string; label: string; tooltip: string }[] = [
   { key: "Hall", label: "Reverb", tooltip: "Hall reverb" },
   { key: "Delay", label: "Echo", tooltip: "Ping-pong delay" },
   { key: "Wobble", label: "Filter", tooltip: "Auto-filter wobble" },
];

interface FxPanelProps {
   activeEffects: Set<string>;
   onToggle: (name: string) => void;
}

export function FxPanel({ activeEffects, onToggle }: FxPanelProps) {
   return (
      <div className={s.fxTags}>
         {FX_LIST.map(({ key, label, tooltip }) => (
            <button
               type="button"
               key={key}
               className={`${s.fxTag} ${activeEffects.has(key) ? s.fxTagActive : ""}`}
               onClick={() => onToggle(key)}
               title={tooltip}
            >
               {label}
            </button>
         ))}
      </div>
   );
}
