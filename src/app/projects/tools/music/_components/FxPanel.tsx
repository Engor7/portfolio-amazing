"use client";

import s from "../music.module.scss";

const FX_LIST: {
   key: string;
   label: string;
   tooltip: string;
   colorClass: string;
}[] = [
   {
      key: "Hall",
      label: "Reverb",
      tooltip: "Hall reverb",
      colorClass: "fxReverbTag",
   },
   {
      key: "Delay",
      label: "Echo",
      tooltip: "Ping-pong delay",
      colorClass: "fxDelayTag",
   },
   {
      key: "Wobble",
      label: "Filter",
      tooltip: "Auto-filter wobble",
      colorClass: "fxFilterTag",
   },
];

interface FxPanelProps {
   activeEffects: Set<string>;
   onToggle: (name: string) => void;
}

export function FxPanel({ activeEffects, onToggle }: FxPanelProps) {
   return (
      <div className={s.fxTags}>
         {FX_LIST.map(({ key, label, tooltip, colorClass }) => (
            <button
               type="button"
               key={key}
               className={`${s.fxTag} ${s[colorClass]} ${activeEffects.has(key) ? s.fxTagActive : ""}`}
               onClick={() => onToggle(key)}
               title={tooltip}
            >
               {label}
            </button>
         ))}
      </div>
   );
}
