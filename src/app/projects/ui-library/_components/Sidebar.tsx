import type { ComponentMeta } from "../_registry";
import styles from "../ui-library.module.scss";

interface SidebarProps {
   items: ComponentMeta[];
   active: string;
   onSelect: (slug: string) => void;
}

export const Sidebar = ({ items, active, onSelect }: SidebarProps) => (
   <nav className={styles.sidebar}>
      <ul className={styles.sidebarList}>
         {items.map((item) => (
            <li key={item.slug}>
               <button
                  className={`${styles.sidebarItem} ${active === item.slug ? styles.sidebarItemActive : ""}`}
                  onClick={() => onSelect(item.slug)}
               >
                  {item.name}
               </button>
            </li>
         ))}
      </ul>
   </nav>
);
