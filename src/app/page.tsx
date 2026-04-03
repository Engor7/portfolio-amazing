import Carousel from "@/components/Carousel";
import Header from "@/components/Header";
import HeroContent from "@/components/HeroContent";
import HeroFooter from "@/components/HeroFooter";
import LayoutHome from "@/components/LayoutHome";
import StickyHeader from "@/components/StickyHeader";
import s from "./page.module.scss";

const Home = () => {
   return (
      <LayoutHome>
         <main>
            <section className={s.hero} id="hero">
               <Header />
               <HeroContent />
               <div className={s.bottom}>
                  <HeroFooter />
                  <Carousel />
               </div>
            </section>
            <section className={s.section} id="skills">
               <h2 className={s.sectionTitle}>Навыки</h2>
            </section>
            <section className={s.section} id="experience">
               <h2 className={s.sectionTitle}>Опыт</h2>
            </section>
         </main>
         <footer id="main-footer" className={s.footer}>
            <span className={s.footerDomain}>egorjs.ru</span>
            <span className={s.footerCopy}>&copy; 2026</span>
         </footer>
         <StickyHeader />
      </LayoutHome>
   );
};

export default Home;
