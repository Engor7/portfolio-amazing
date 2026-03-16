import Link from "next/link";
import LayoutHome from "./layoutHome";

const Home = () => {
   return (
      <LayoutHome>
         <nav className="main-nav">
            <Link href="/projects/tools/art">Art</Link>
            <span>/</span>
            <Link href="/projects/ui-library">Ui</Link>
         </nav>
      </LayoutHome>
   );
};

export default Home;
