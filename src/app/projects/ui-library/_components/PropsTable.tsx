import type { PropDef } from "../_registry";
import styles from "../ui-library.module.scss";

interface PropsTableProps {
  props: PropDef[];
}

export const PropsTable = ({ props }: PropsTableProps) => (
  <table className={styles.table}>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      {props.map((p) => (
        <tr key={p.name}>
          <td><code>{p.name}</code></td>
          <td><code>{p.type}</code></td>
          <td><code>{p.default}</code></td>
          <td>{p.description}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
