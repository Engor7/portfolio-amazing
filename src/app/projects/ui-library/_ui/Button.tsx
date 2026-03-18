import type { ButtonHTMLAttributes } from "react";
import styles from "./ui.module.scss";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClass: Record<Variant, string> = {
  primary: styles.btnPrimary,
  secondary: styles.btnSecondary,
  ghost: styles.btnGhost,
};

const sizeClass: Record<Size, string> = {
  sm: styles.btnSm,
  md: styles.btnMd,
  lg: styles.btnLg,
};

export const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) => (
  <button
    className={`${styles.btn} ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
);
