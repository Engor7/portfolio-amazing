import type { ComponentMeta } from "../_registry";
import { PropsTable } from "./PropsTable";
import { CodeBlock } from "./CodeBlock";
import styles from "../ui-library.module.scss";

interface ComponentDetailProps {
  meta: ComponentMeta;
}

export const ComponentDetail = ({ meta }: ComponentDetailProps) => {
  const Demo = meta.demo;
  return (
    <div className={styles.detail}>
      <h1 className={styles.detailTitle}>{meta.name}</h1>
      <p className={styles.detailDescription}>{meta.description}</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Demo</h2>
        <div className={styles.demoBox}>
          <Demo />
        </div>
      </section>

      {meta.notes && (
        <p className={styles.notesBox}>{meta.notes}</p>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage</h2>
        <CodeBlock code={meta.usage} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Props</h2>
        <PropsTable props={meta.props} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Source</h2>
        <CodeBlock code={meta.source} />
      </section>
    </div>
  );
};
