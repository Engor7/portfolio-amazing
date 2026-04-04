"use client";

import ReadMore from "@/components/ReadMore";
import { useLang } from "@/providers/LangProvider";
import s from "../app/page.module.scss";

export default function Experience() {
   const { t } = useLang();

   return (
      <section className={`${s.section} ${s.experience}`} id="experience">
         <div>
            <h2 className={s.sectionTitle}>{t.experience.title}</h2>
            <p>{t.experience.paragraph}</p>
         </div>
         <div>
            <h3>ECOS Bitcoin Mining Ecosystem</h3>
            <ol>
               <li>{t.experience.ecos.role}</li>
               <li>{t.experience.ecos.period}</li>
            </ol>
            <p>{t.experience.ecos.p1}</p>
            <p>{t.experience.ecos.p2}</p>
            <p className={s.mb4}>{t.experience.ecos.functionality}</p>
            <ul className={s.listLs}>
               <li>{t.experience.ecos.li1}</li>
               <li>{t.experience.ecos.li2}</li>
            </ul>
            <ReadMore>
               <ul className={s.listLs}>
                  <li>{t.experience.ecos.li3}</li>
                  <li>{t.experience.ecos.li4}</li>
                  <li>{t.experience.ecos.li5}</li>
               </ul>
               <p className={s.mb4}>{t.experience.ecos.backoffice}</p>
               <ul className={s.listLs}>
                  <li>{t.experience.ecos.bo1}</li>
                  <li>{t.experience.ecos.bo2}</li>
                  <li>{t.experience.ecos.bo3}</li>
                  <li>{t.experience.ecos.bo4}</li>
               </ul>
               <p>{t.experience.ecos.wordpress}</p>
            </ReadMore>
         </div>
         <div>
            <h3>CityAds Media</h3>
            <ol>
               <li>{t.experience.cityads.role}</li>
               <li>{t.experience.cityads.period}</li>
            </ol>
            <p>{t.experience.cityads.p1}</p>
            <p>{t.experience.cityads.p2}</p>
         </div>
         <div>
            <h3>{t.experience.openSchool.name}</h3>
            <ol>
               <li>{t.experience.openSchool.role}</li>
               <li>{t.experience.openSchool.period}</li>
            </ol>
            <p>{t.experience.openSchool.p1}</p>
            <p>{t.experience.openSchool.p2}</p>
         </div>
         <div>
            <h3>{t.experience.freelance.name}</h3>
            <ol>
               <li>{t.experience.freelance.role}</li>
               <li>{t.experience.freelance.period}</li>
            </ol>
            <p>{t.experience.freelance.p1}</p>
            <p>{t.experience.freelance.p2}</p>
         </div>
         <div>
            <p>{t.experience.closing}</p>
         </div>
      </section>
   );
}
