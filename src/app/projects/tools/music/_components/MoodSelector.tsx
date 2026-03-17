"use client";

import type { MoodId } from "../_lib/musicTheory";
import s from "../music.module.scss";

const MOODS: { id: MoodId; label: string; emoji: string }[] = [
   { id: "happy", label: "Happy", emoji: "☀" },
   { id: "dark", label: "Dark", emoji: "🌑" },
   { id: "chill", label: "Chill", emoji: "🌊" },
   { id: "energetic", label: "Energy", emoji: "⚡" },
];

interface MoodSelectorProps {
   onSelect: (mood: MoodId) => void;
}

export function MoodSelector({ onSelect }: MoodSelectorProps) {
   return (
      <div className={s.moodSelector}>
         {MOODS.map((mood) => (
            <button
               type="button"
               key={mood.id}
               className={s.moodBtn}
               onClick={() => onSelect(mood.id)}
               title={`${mood.label} mood`}
            >
               <span className={s.moodEmoji}>{mood.emoji}</span>
               <span>{mood.label}</span>
            </button>
         ))}
      </div>
   );
}
