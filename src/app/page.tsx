import Link from "next/dist/client/link";
import LayoutHome from "./layoutHome";

const Home = () => {
   return (
      <LayoutHome>
         <nav className="main-nav">
            <Link href="/art">Art</Link>
         </nav>
      </LayoutHome>
   );
};

export default Home;
