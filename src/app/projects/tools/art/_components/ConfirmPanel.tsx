"use client";

import { useEffect, useRef } from "react";
import styles from "../art.module.scss";

interface ConfirmPanelProps {
   onConfirm: () => void;
   onCancel: () => void;
}

const ConfirmPanel = ({ onConfirm, onCancel }: ConfirmPanelProps) => {
   const ref = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClick = (e: MouseEvent) => {
         if (ref.current && !ref.current.contains(e.target as Node)) {
            onCancel();
         }
      };
      document.addEventListener("pointerdown", handleClick);
      return () => document.removeEventListener("pointerdown", handleClick);
   }, [onCancel]);

   return (
      <div ref={ref} className={styles.confirmPanel}>
         <button
            type="button"
            className={styles.confirmYes}
            onClick={onConfirm}
         >
            Yes, clear
         </button>
         <button
            type="button"
            className={styles.confirmCancel}
            onClick={onCancel}
         >
            Cancel
         </button>
      </div>
   );
};

export default ConfirmPanel;
