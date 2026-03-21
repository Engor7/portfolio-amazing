"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./ui-library.module.scss";

const pages: { color: string; width: number; height: number }[][] = [
   [
      { color: "#e74c3c", width: 200, height: 300 },
      { color: "#3498db", width: 150, height: 250 },
      { color: "#2ecc71", width: 300, height: 300 },
      { color: "#f39c12", width: 120, height: 280 },
      { color: "#9b59b6", width: 250, height: 200 },
      { color: "#1abc9c", width: 180, height: 300 },
   ],
   [
      { color: "#e67e22", width: 280, height: 300 },
      { color: "#2c3e50", width: 140, height: 260 },
      { color: "#d35400", width: 220, height: 300 },
      { color: "#16a085", width: 300, height: 200 },
      { color: "#8e44ad", width: 160, height: 280 },
   ],
   [
      { color: "#c0392b", width: 100, height: 300 },
      { color: "#2980b9", width: 260, height: 250 },
      { color: "#27ae60", width: 180, height: 300 },
      { color: "#f1c40f", width: 300, height: 280 },
      { color: "#7f8c8d", width: 200, height: 200 },
      { color: "#e84393", width: 140, height: 300 },
      { color: "#00cec9", width: 240, height: 260 },
   ],
   [
      { color: "#6c5ce7", width: 220, height: 300 },
      { color: "#fd79a8", width: 300, height: 250 },
      { color: "#00b894", width: 160, height: 280 },
      { color: "#fdcb6e", width: 240, height: 300 },
      { color: "#636e72", width: 120, height: 200 },
      { color: "#0984e3", width: 280, height: 260 },
   ],
];

const UILibraryPage = () => {
   const [activePage, setActivePage] = useState(0);
   const [mounted, setMounted] = useState(false);
   const { theme, setTheme } = useTheme();

   useEffect(() => {
      setMounted(true);
   }, []);

   return (
      <div>
         <header>
            <nav>
               {pages.map((page, i) => (
                  <button
                     key={page[0].color}
                     type="button"
                     onClick={() => setActivePage(i)}
                  >
                     {i + 1}
                  </button>
               ))}
            </nav>

            <button
               type="button"
               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
               {mounted ? (theme === "dark" ? "☀️" : "🌙") : null}
            </button>
         </header>

         <main>
            <div className={styles.grid}>
               {pages[activePage].map((block) => (
                  <div
                     key={block.color}
                     className={styles.block}
                     style={{
                        backgroundColor: block.color,
                        width: block.width,
                        height: block.height,
                     }}
                  />
               ))}
            </div>
         </main>
      </div>
   );
};

export default UILibraryPage;
