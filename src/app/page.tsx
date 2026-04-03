import Carousel from "@/components/Carousel";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroContent from "@/components/HeroContent";
import HeroFooter from "@/components/HeroFooter";
import LayoutHome from "@/components/LayoutHome";
import Skills from "@/components/Skills";
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
            <Skills />
            <Experience />
         </main>
         <Footer />
         <StickyHeader />
      </LayoutHome>
   );
};

export default Home;
