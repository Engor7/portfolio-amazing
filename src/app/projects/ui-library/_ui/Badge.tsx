import styles from "./ui.module.scss";

type BadgeVariant = "default" | "success" | "warning" | "error";
type BadgeSize = "sm" | "md";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantClass: Record<BadgeVariant, string> = {
  default: styles.badgeDefault,
  success: styles.badgeSuccess,
  warning: styles.badgeWarning,
  error: styles.badgeError,
};

const sizeClass: Record<BadgeSize, string> = {
  sm: styles.badgeSm,
  md: styles.badgeMd,
};

export const Badge = ({ label, variant = "default", size = "md" }: BadgeProps) => (
  <span className={`${styles.badge} ${variantClass[variant]} ${sizeClass[size]}`}>
    {label}
  </span>
);
