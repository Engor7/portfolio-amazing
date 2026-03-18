"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { registry } from "./_registry";
import { Sidebar } from "./_components/Sidebar";
import { ComponentDetail } from "./_components/ComponentDetail";
import styles from "./ui-library.module.scss";

const UILibraryPage = () => {
  const [active, setActive] = useState(registry[0].slug);
  const meta = registry.find((c) => c.slug === active) ?? registry[0];
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.layout}>
      <Sidebar items={registry} active={active} onSelect={setActive} />
      <main className={styles.main}>
        <button
          className={styles.themeToggle}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <ComponentDetail meta={meta} />
      </main>
    </div>
  );
};

export default UILibraryPage;
