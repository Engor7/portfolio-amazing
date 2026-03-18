import type { InputHTMLAttributes } from "react";
import styles from "./ui.module.scss";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({ label, error, className = "", ...props }: InputProps) => (
  <div className={styles.inputWrapper}>
    {label && <label className={styles.inputLabel}>{label}</label>}
    <input
      className={`${styles.input} ${error ? styles.inputError : ""} ${className}`}
      {...props}
    />
    {error && <span className={styles.inputErrorText}>{error}</span>}
  </div>
);
