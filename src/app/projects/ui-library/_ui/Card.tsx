import type { ReactNode } from "react";
import styles from "./ui.module.scss";

export interface CardProps {
  title?: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
}

export const Card = ({ title, description, footer, children }: CardProps) => (
  <div className={styles.card}>
    <div className={styles.cardBody}>
      {title && <h3 className={styles.cardTitle}>{title}</h3>}
      {description && <p className={styles.cardDescription}>{description}</p>}
      {children && <div className={styles.cardContent}>{children}</div>}
    </div>
    {footer && <div className={styles.cardFooter}>{footer}</div>}
  </div>
);
