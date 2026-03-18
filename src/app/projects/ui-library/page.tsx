"use client";
import { useState } from "react";
import { registry } from "./_registry";
import { Sidebar } from "./_components/Sidebar";
import { ComponentDetail } from "./_components/ComponentDetail";
import styles from "./ui-library.module.scss";

const UILibraryPage = () => {
  const [active, setActive] = useState(registry[0].slug);
  const meta = registry.find((c) => c.slug === active) ?? registry[0];

  return (
    <div className={styles.layout}>
      <Sidebar items={registry} active={active} onSelect={setActive} />
      <main className={styles.main}>
        <ComponentDetail meta={meta} />
      </main>
    </div>
  );
};

export default UILibraryPage;
