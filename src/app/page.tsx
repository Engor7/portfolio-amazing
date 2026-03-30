import Link from "next/link";
import LayoutHome from "@/components/LayoutHome";
import ThemeToggle from "@/components/ThemeToggle";

const Home = () => {
   return (
      <LayoutHome>
         <main>
            <nav className="main-nav">
               <Link href="/projects/tools/art">Art</Link>
               <span aria-hidden="true">/</span>
               <Link href="/projects/tools/music">Music</Link>
               <span aria-hidden="true">/</span>
               <Link href="/projects/ui-library">Ui</Link>
               <span aria-hidden="true">/</span>
               <Link href="/projects/sites/view-scroll">View Scroll</Link>
               <span aria-hidden="true">/</span>
               <Link href="/projects/sites/coin">Coin</Link>
               <span aria-hidden="true">/</span>
               <Link href="/projects/sites/spotlight">Spotlight</Link>
               <span>/</span>
               <span>[</span>
               <ThemeToggle />
               <span>]</span>
            </nav>
            <ul className="main-nav main-nav_new">
               <a href="/projects/exp/scroll-reveal">Scroll Reveal</a>
               <span aria-hidden="true">/</span>
               <Link href="/projects/exp/chrome-abyss">Chrome Abyss</Link>
               <span aria-hidden="true">/</span>
               <a href="/projects/exp/prism-veil">Prism Veil</a>
               <span aria-hidden="true">/</span>
               <a href="/projects/exp/gridscape">Gridscape</a>
               <span aria-hidden="true">/</span>
               <a href="/projects/exp/ironhill">ironhill</a>
               <span aria-hidden="true">/</span>
               <Link href="/projects/exp/scroll-expand">Scroll Expand</Link>
            </ul>
         </main>
      </LayoutHome>
   );
};

export default Home;
