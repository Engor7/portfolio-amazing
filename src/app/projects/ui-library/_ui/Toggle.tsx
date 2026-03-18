import styles from "./ui.module.scss";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Toggle = ({ checked, onChange, label, disabled = false }: ToggleProps) => (
  <span
    className={`${styles.toggleWrapper} ${disabled ? styles.disabled : ""}`}
    onClick={() => !disabled && onChange(!checked)}
    role="switch"
    aria-checked={checked}
    tabIndex={disabled ? -1 : 0}
    onKeyDown={(e) => {
      if (!disabled && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        onChange(!checked);
      }
    }}
  >
    <span className={`${styles.toggleTrack} ${checked ? styles.toggleTrackOn : ""}`}>
      <span className={`${styles.toggleThumb} ${checked ? styles.toggleThumbOn : ""}`} />
    </span>
    {label && <span className={styles.toggleLabel}>{label}</span>}
  </span>
);
