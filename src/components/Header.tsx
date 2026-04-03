import Image from "next/image";
import LangToggle from "@/components/LangToggle";
import Nav from "@/components/Nav";
import NavBurger from "@/components/NavBurger";
import RoleAnimated from "@/components/RoleAnimated";
import ThemeToggle from "@/components/ThemeToggle";
import s from "./Header.module.scss";

export default function Header() {
   return (
      <header className={s.header} id="main-header">
         <div className={s.left}>
            <Image
               src="/avatar.png"
               alt="Egor"
               width={48}
               height={48}
               className={s.avatar}
            />
            <div className={s.info}>
               <span className={s.name}>Egor</span>
               <RoleAnimated />
            </div>
         </div>

         <Nav className={s.navCentered} />

         <div className={s.right}>
            <LangToggle className={s.langToggle} />
            <ThemeToggle />
            <NavBurger dropdownDir="down" className={s.mobileBurger} />
         </div>
      </header>
   );
}
