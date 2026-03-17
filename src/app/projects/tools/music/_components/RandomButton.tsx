"use client";

import s from "../music.module.scss";

interface RandomButtonProps {
   onGenerate: () => void;
}

export function RandomButton({ onGenerate }: RandomButtonProps) {
   return (
      <button type="button" className={s.randomBtn} onClick={onGenerate}>
         Random
      </button>
   );
}
