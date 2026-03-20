"use client";

import s from "../music.module.scss";
import { RandomIcon } from "./icons";

interface RandomButtonProps {
   onGenerate: () => void;
}

export function RandomButton({ onGenerate }: RandomButtonProps) {
   return (
      <button type="button" className={s.randomBtn} onClick={onGenerate}>
         <RandomIcon width={16} height={16} />
         Random
      </button>
   );
}
