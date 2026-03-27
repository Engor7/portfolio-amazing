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
               <Link href="/projects/sites/anima-one">Anima One</Link>
               <span aria-hidden="true">/</span>
               <Link href="/projects/sites/view-scroll">View Scroll</Link>
               <span aria-hidden="true">/</span>
               <Link href="/projects/sites/coin">Coin</Link>
               <span aria-hidden="true">/</span>
               <Link href="/projects/sites/red-web">Red Web</Link>

               <span>/</span>
               <span>[</span>
               <ThemeToggle />
               <span>]</span>
            </nav>
         </main>
      </LayoutHome>
   );
};

export default Home;
