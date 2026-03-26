"use client";

import { moonSvg, sunSvg } from "./icons";
import styles from "./ToggleSwitch.module.scss";

type Props = {
   checked: boolean;
   onChange: (checked: boolean) => void;
   floating?: boolean;
};

const ToggleSwitch = ({ checked, onChange, floating }: Props) => {
   return (
      <button
         type="button"
         className={`${styles.toggle} ${checked ? styles.checked : ""} ${floating ? styles.floating : ""}`}
         onClick={() => onChange(!checked)}
         aria-pressed={checked}
      >
         <span
            className={styles.iconSun}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: SMIL animations require raw HTML
            dangerouslySetInnerHTML={{ __html: sunSvg }}
         />
         <span
            className={styles.iconMoon}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: SMIL animations require raw HTML
            dangerouslySetInnerHTML={{ __html: moonSvg }}
         />
         <span className={styles.knob} />
      </button>
   );
};

export default ToggleSwitch;
