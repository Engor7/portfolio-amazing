import s from "../app/page.module.scss";

export default function Skills() {
   return (
      <section className={`${s.section} ${s.skills}`} id="skills">
         <div>
            <h2 className={s.sectionTitle}>Навыки</h2>
            <p>
               Знать все на свете невозможно, однако современный
               Frontend-разработчик должен оставаться гибким, способным
               усваивать новые технологии. Сегодня, когда веб разработка
               стремится к универсальности во всем, быстрое погружение и
               применение мощных инструментов становится не самой сложной
               задачей.
            </p>
         </div>
         <div>
            <h3>Frontend</h3>
            <ul>
               <li>HTML</li>
               <li>CSS</li>
               <li>SASS</li>
               <li>JavaScript (ES5, ES6)</li>
               <li>TypeScript</li>
               <li>Vue.js (2, 3)</li>
               <li>Nuxt.js</li>
               <li>Vuex / Pinia</li>
               <li>Vue Router</li>
               <li>SASS</li>
               <li>Pug</li>
               <li>React.js</li>
               <li>jQuery</li>
               <li>WebPack</li>
               <li>Vite</li>
               <li>Gulp</li>
               <li>Кроссбраузерная и адаптивная верстка</li>
            </ul>
         </div>
         <div>
            <h3>Web development</h3>
            <ul>
               <li>Node.js</li>
               <li>Express.js</li>
               <li>REST API</li>
               <li>SQL</li>
               <li>GitHub</li>
               <li>CI/CD</li>
               <li>Docker</li>
               <li>PHP</li>
               <li>WordPress</li>
               <li>ООП</li>
            </ul>
         </div>
         <div>
            <h3>Дизайн и UI/UX</h3>
            <ul>
               <li>Photoshop</li>
               <li>Figma</li>
               <li>Illustrator</li>
               <li>Прототипирование</li>
               <li>Wireframing</li>
               <li>User Research</li>
               <li>Принципы UX\UI</li>
               <li>Эргономика адаптивного веб интерфейса</li>
            </ul>
         </div>
         <div>
            <h3>Другие навыки</h3>
            <ul>
               <li>БЭМ</li>
               <li>Основы SEO</li>
               <li>Теория дизайна</li>
               <li>История искусств</li>
               <li>Айдентика</li>
               <li>Теория цвета</li>
               <li>Фотография</li>
               <li>Цветокоррекция</li>
               <li>Ретушь</li>
               <li>Слепой метод печати</li>
               <li>IntelliJ IDEA</li>
               <li>Vim</li>
            </ul>
         </div>
      </section>
   );
}
