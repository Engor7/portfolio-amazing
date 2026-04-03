"use client";

import { useLang } from "@/providers/LangProvider";
import s from "./Footer.module.scss";

export default function Footer() {
   const { t } = useLang();

   return (
      <footer id="main-footer" className={s.footer}>
         <p className={s.wip}>{t.footer.wip}</p>
         <div className={s.bottom}>
            <span className={s.domain}>egor-js.ru</span>
            <span className={s.copy}>&copy; 2026</span>
         </div>
      </footer>
   );
}
