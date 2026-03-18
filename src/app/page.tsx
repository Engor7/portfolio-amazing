import Link from "next/link";
import LayoutHome from "@/components/LayoutHome";
import ThemeToggle from "@/components/ThemeToggle";

const Home = () => {
   return (
      <LayoutHome>
         <nav className="main-nav">
            <Link href="/projects/tools/art">Art</Link>
            <span>/</span>
            <Link href="/projects/tools/music">Music</Link>
            <span>/</span>
            <Link href="/projects/ui-library">Ui</Link>
         </nav>
         <ThemeToggle />
      </LayoutHome>
   );
};

export default Home;
