import type { ThemeMode, ToolType } from "../_lib/types";
import styles from "../art.module.scss";
import {
   DownloadIcon,
   MoonIcon,
   PenIcon,
   RainbowIcon,
   RedoIcon,
   SunIcon,
   TrashIcon,
   UndoIcon,
} from "./icons";
import SizeSlider from "./SizeSlider";

interface ToolbarProps {
   tool: ToolType;
   onToolChange: (tool: ToolType) => void;
   theme: ThemeMode;
   onToggleTheme: () => void;
   onDownload: () => void;
   onClearRequest: () => void;
   strokeWidth: number;
   onStrokeWidthChange: (w: number) => void;
   hasStrokes: boolean;
   onUndo: () => void;
   onRedo: () => void;
   canRedo: boolean;
}

const Toolbar = ({
   tool,
   onToolChange,
   theme,
   onToggleTheme,
   onDownload,
   onClearRequest,
   strokeWidth,
   onStrokeWidthChange,
   hasStrokes,
   onUndo,
   onRedo,
   canRedo,
}: ToolbarProps) => {
   const isDark = theme === "dark";

   return (
      <>
         <div className={styles.toolbar}>
            <button
               type="button"
               className={`${styles.toolBtn} ${tool === "rainbow" ? styles.toolBtnActive : ""}`}
               onClick={() => onToolChange("rainbow")}
            >
               <RainbowIcon />
            </button>

            <button
               type="button"
               className={`${styles.toolBtn} ${tool === "color" ? styles.toolBtnActive : ""}`}
               onClick={() => onToolChange("color")}
            >
               <PenIcon />
            </button>

            <button
               type="button"
               className={styles.toolBtn}
               onClick={onUndo}
               disabled={!hasStrokes}
            >
               <UndoIcon />
            </button>

            <button
               type="button"
               className={styles.toolBtn}
               onClick={onRedo}
               disabled={!canRedo}
            >
               <RedoIcon />
            </button>

            <button
               type="button"
               className={`${styles.toolBtn} ${styles.toolBtnTheme}`}
               onClick={onToggleTheme}
            >
               <div className={styles.themeIcon}>
                  <SunIcon
                     className={isDark ? styles.sunIconHidden : styles.sunIcon}
                  />
                  <MoonIcon
                     className={
                        isDark ? styles.moonIconVisible : styles.moonIcon
                     }
                  />
               </div>
            </button>

            <button
               type="button"
               className={`${styles.toolBtn} ${styles.toolBtnDownload}`}
               onClick={onDownload}
               disabled={!hasStrokes}
            >
               <DownloadIcon />
            </button>

            <button
               type="button"
               className={`${styles.toolBtn} ${styles.toolBtnTrash}`}
               onClick={onClearRequest}
            >
               <TrashIcon />
            </button>
         </div>

         <SizeSlider
            value={strokeWidth}
            min={2}
            max={300}
            onChange={onStrokeWidthChange}
         />
      </>
   );
};

export default Toolbar;
