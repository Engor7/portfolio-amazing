"use client";

import { useLang } from "@/providers/LangProvider";
import s from "../app/page.module.scss";

export default function Skills() {
   const { t } = useLang();

   return (
      <section className={`${s.section} ${s.skills}`} id="skills">
         <div>
            <h2 className={s.sectionTitle}>{t.skills.title}</h2>
            <p>{t.skills.paragraph}</p>
         </div>
         <div>
            <h3>{t.skills.frontend}</h3>
            <ul>
               <li>TypeScript</li>
               <li>JavaScript (ES5, ES6)</li>
               <li>React.js</li>
               <li>Next.js</li>
               <li>Redux / Redux Toolkit</li>
               <li>React Query</li>
               <li>Zustand</li>
               <li>Vue.js (2, 3)</li>
               <li>Nuxt.js</li>
               <li>Vuex / Pinia</li>
               <li>Vue Router</li>
               <li>HTML</li>
               <li>CSS</li>
               <li>Tailwind CSS</li>
               <li>SASS</li>
               <li>Vite</li>
               <li>WebPack</li>
               <li>Gulp</li>
               <li>Pug</li>
               <li>jQuery</li>
               <li>{t.skills.crossBrowser}</li>
            </ul>
         </div>
         <div>
            <h3>{t.skills.webDev}</h3>
            <ul>
               <li>Node.js</li>
               <li>Express.js</li>
               <li>REST API</li>
               <li>GraphQL</li>
               <li>PostgreSQL</li>
               <li>MongoDB</li>
               <li>Nginx</li>
               <li>Git</li>
               <li>CI/CD</li>
               <li>Docker</li>
               <li>PHP</li>
               <li>WordPress</li>
               <li>{t.skills.oop}</li>
            </ul>
         </div>
         <div>
            <h3>{t.skills.design}</h3>
            <ul>
               <li>Photoshop</li>
               <li>Figma</li>
               <li>Illustrator</li>
               <li>{t.skills.prototyping}</li>
               <li>Wireframing</li>
               <li>User Research</li>
               <li>{t.skills.uxPrinciples}</li>
               <li>{t.skills.adaptiveErgonomics}</li>
            </ul>
         </div>
         <div>
            <h3>{t.skills.other}</h3>
            <ul>
               <li>Agile / Scrum</li>
               <li>{t.skills.bem}</li>
               <li>{t.skills.seoBasics}</li>
               <li>{t.skills.designTheory}</li>
               <li>{t.skills.artHistory}</li>
               <li>{t.skills.identity}</li>
               <li>{t.skills.colorTheory}</li>
               <li>{t.skills.photography}</li>
               <li>{t.skills.colorCorrection}</li>
               <li>{t.skills.retouching}</li>
               <li>{t.skills.touchTyping}</li>
               <li>IntelliJ IDEA</li>
               <li>Vim</li>
            </ul>
         </div>
      </section>
   );
}
