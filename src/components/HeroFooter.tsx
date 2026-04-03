import s from "./HeroFooter.module.scss";

export default function HeroFooter() {
   return (
      <div className={s.footer}>
         <div className={s.contacts}>
            <a
               href="https://t.me/egor_erygin"
               className={s.link}
               target="_blank"
               rel="noreferrer"
            >
               Telegram
            </a>
            <a
               href="https://github.com/Engor7"
               className={s.link}
               target="_blank"
               rel="noreferrer"
            >
               GitHub
            </a>
         </div>

         <div className={s.copy}>
            <span>Портфолио</span>
            <span className={s.line} />
            <span>© 2026</span>
         </div>
      </div>
   );
}
