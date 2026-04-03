"use client";

import { useLang } from "@/providers/LangProvider";
import s from "./HeroContent.module.scss";

export default function HeroContent() {
   const { t } = useLang();

   return (
      <div className={s.content}>
         <span>{t.hero.greeting}</span>
         <h1>{t.hero.title}</h1>
         <p>{t.hero.paragraph}</p>
      </div>
   );
}
