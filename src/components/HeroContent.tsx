import s from "./HeroContent.module.scss";

export default function HeroContent() {
   return (
      <div className={s.content}>
         <span>Привет, это Егор</span>
         <h1>Я Frontend-разработчик</h1>
         <p>
            У меня обширный опыт в веб-разработке. Я начал свой путь более 9 лет
            назад. Есть опыт не только во Frontend, но и в Backend разработке.
            Отличные знания и опыт в UX/UI дизайне. Прошёл огонь и воду с
            разными командами, а иногда и в одиночку.
         </p>
      </div>
   );
}
