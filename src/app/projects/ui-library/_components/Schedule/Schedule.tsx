"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Schedule.module.scss";

type DayStatus = "busy" | "marked" | "markedBlue" | "selected" | null;

type DayCell = {
   day: number;
   outside?: boolean;
   defaultStatus?: DayStatus;
};

const MONTHS = [
   "January",
   "February",
   "March",
   "April",
   "May",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "December",
];

const rows: DayCell[][] = [
   [
      { day: 28, outside: true },
      { day: 29, outside: true },
      { day: 30, outside: true },
      { day: 31, outside: true },
      { day: 1 },
      { day: 2 },
      { day: 3, defaultStatus: "marked" },
   ],
   [
      { day: 4, defaultStatus: "busy" },
      { day: 5, defaultStatus: "busy" },
      { day: 6, defaultStatus: "busy" },
      { day: 7, defaultStatus: "busy" },
      { day: 8, defaultStatus: "markedBlue" },
      { day: 9 },
      { day: 10 },
   ],
   [
      { day: 11 },
      { day: 12, defaultStatus: "busy" },
      { day: 13, defaultStatus: "busy" },
      { day: 14, defaultStatus: "busy" },
      { day: 15, defaultStatus: "marked" },
      { day: 16, defaultStatus: "marked" },
      { day: 17 },
   ],
   [
      { day: 18, defaultStatus: "markedBlue" },
      { day: 19 },
      { day: 20, defaultStatus: "selected" },
      { day: 21 },
      { day: 22 },
      { day: 23 },
      { day: 24, outside: true },
   ],
];

const scribblePaths = [
   {
      viewBox: "0 0 37 37",
      d: "M7.11538 2.69938C7.11538 2.7229 7.11538 2.74643 6.1508 5.86405C5.18621 8.98167 3.25704 15.1927 2.21617 18.7099C1.1753 22.2271 1.08119 22.8623 1.03271 23.2483C0.984234 23.6344 0.984234 23.752 1.06658 23.742C1.14892 23.7321 1.31361 23.5909 3.23351 21.1067C5.15342 18.6225 8.82355 13.7996 11.8788 10.174C14.934 6.54846 17.2631 4.26638 18.663 2.94961C20.0628 1.63284 20.4627 1.35052 20.6217 1.35801C20.7807 1.3655 20.6866 1.67134 18.3796 6.42833C16.0726 11.1853 11.5555 20.3842 8.93441 26.017C6.31334 31.6498 5.72518 33.4378 5.53982 34.2178C5.35446 34.9977 5.58972 34.7154 8.28707 30.6645C10.9844 26.6137 16.1367 18.8029 20.3437 13.1558C24.5507 7.50876 27.6562 4.26211 29.2795 2.5543C30.9028 0.846487 30.9499 0.775908 30.6683 1.25713C30.3867 1.73836 29.775 2.77352 26.919 8.40028C24.063 14.027 18.9813 24.214 16.3399 29.5324C13.6985 34.8508 13.6515 34.992 15.7799 31.9357C17.9083 28.8794 22.2137 22.6213 25.2433 18.527C28.2728 14.4327 29.8962 12.6917 30.7912 11.7596C31.7783 10.7316 32.0428 10.59 32.2092 10.5063C32.2538 10.4838 32.2346 10.6342 30.305 14.9061C28.3755 19.1779 24.5407 27.6004 23.6591 30.0336C22.7776 32.4668 24.9656 28.6555 26.2927 26.4333C27.6198 24.2112 28.0197 23.6936 28.5904 23.0858C29.1611 22.478 29.8905 21.7958 30.4779 21.3149C31.0654 20.834 31.4888 20.5752 31.8364 20.3949C32.1839 20.2145 32.4427 20.1204 31.8232 22.5187C31.2037 24.9169 29.698 29.8105 28.9811 32.2843C28.2643 34.7582 28.3819 34.664 29.0424 33.5451C29.703 32.4262 30.9028 30.2853 31.6503 29.0059C32.6177 27.3503 33.182 26.7748 33.7035 26.3478C34.5614 25.6453 35.1796 25.7268 35.3814 25.7621C35.5475 25.7912 35.5375 26.3642 35.1843 28.1233C34.9134 29.4722 34.2193 31.694 33.8686 33.0806C33.5178 34.4673 33.4708 34.9378 33.4818 35.1449C33.5634 35.2814 33.895 34.7382 34.3224 33.99C34.491 33.7123 34.5615 33.6417 34.6343 33.569",
   },
   {
      viewBox: "0 0 35 35",
      d: "M6.70818 1C6.70818 1.09411 6.6376 1.3308 5.93073 2.9805C5.30294 4.44567 4.0946 7.17107 3.17065 9.63565C2.2467 12.1002 1.63501 14.2176 1.30813 15.3907C0.981257 16.5638 0.957731 16.7285 1.03972 16.7781C1.1217 16.8276 1.30992 16.7571 3.19489 14.9327C5.07986 13.1083 8.65589 9.53228 10.898 7.38424C13.1402 5.2362 13.9401 4.62451 14.5639 4.19176C16.4213 2.90322 17.7571 2.83008 17.9945 2.82972C18.0935 2.82957 18.1378 2.92347 16.3622 6.67702C14.5867 10.4306 10.9871 17.8649 9.06225 21.9183C7.13736 25.9716 6.9962 26.4186 6.97053 26.6253C6.94487 26.8321 7.03897 26.785 9.22836 23.7729C11.4178 20.7608 15.6996 14.7851 18.1289 11.4597C20.5582 8.13423 21.0052 7.64018 21.7177 6.95042C22.4303 6.26067 23.3949 5.39019 24.3506 4.68297C25.3062 3.97575 26.2238 3.45816 26.7435 3.17977C27.2632 2.90137 27.3573 2.87784 24.6297 7.79452C21.902 12.7112 16.3498 22.5688 15.9833 23.7886C15.6169 25.0084 20.6045 17.2917 24.0914 12.3166C27.5783 7.34146 29.4134 5.34171 30.6881 4.05274C31.9628 2.76377 32.6215 2.24619 30.2789 7.40242C27.9362 12.5586 22.5722 23.4044 21.1381 26.2625C19.7041 29.1206 22.3626 23.6624 24.0732 20.3801C25.7839 17.0978 26.4662 16.1568 26.9941 15.5073C27.8247 14.4855 28.5914 13.9774 29.2202 13.6213C29.6652 13.3692 30.1841 13.3101 30.6357 13.392C30.8128 13.4242 30.758 13.7328 30.6988 14.0422C30.6396 14.3516 30.5455 14.7281 29.0266 18.0628C27.5077 21.3975 24.5669 27.679 23.0873 30.8797C21.6076 34.0804 21.6782 34.0098 22.9261 32.1266C24.1741 30.2434 26.5973 26.5498 28.1045 24.4352C29.6116 22.3207 30.1292 21.8972 30.4664 21.6673C30.8036 21.4374 30.9447 21.4139 31.0645 21.4018C31.1843 21.3896 31.2784 21.3896 31.3622 21.4602C31.8412 21.8638 31.4474 22.8126 30.964 24.1814C30.577 25.2774 29.7984 27.1501 29.2811 28.7196C28.7639 30.2891 28.5051 31.4889 28.3836 32.2011C28.262 32.9133 28.2855 33.1016 28.333 33.222C28.3804 33.3425 28.4509 33.3896 28.5579 33.3903C28.8103 33.392 29.0926 33.2014 29.577 32.7882C30.5157 31.9877 31.3953 30.9236 32.0715 30.1639C32.3595 29.8404 32.583 29.6866 32.7039 29.6489C32.8247 29.6111 32.8483 29.7052 32.8604 29.8831C32.9194 30.7491 32.8012 31.7441 32.8839 32.3555C32.9195 32.4392 32.9666 32.5098 33.0261 32.5227C33.0857 32.5355 33.1562 32.4884 33.3715 32.2974",
   },
];

const rotations = [0, 90, 180, 270];

const pseudoRandom = (day: number, salt: number) => {
   const x = Math.sin(day * 9301 + salt * 4973) * 49297;
   return x - Math.floor(x);
};

const Scribble = ({ day, dimmed }: { day: number; dimmed?: boolean }) => {
   const variant = pseudoRandom(day, 1) > 0.5 ? 1 : 0;
   const rot = rotations[Math.floor(pseudoRandom(day, 2) * rotations.length)];
   const s = scribblePaths[variant];

   return (
      <svg
         className={styles.scribble}
         viewBox={s.viewBox}
         fill="none"
         aria-hidden="true"
         style={{ transform: `rotate(${rot}deg)`, opacity: dimmed ? 0.3 : 1 }}
      >
         <path
            d={s.d}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
         />
      </svg>
   );
};

const ArrowLeft = () => (
   <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
   >
      <path
         d="M10 3L5 8L10 13"
         stroke="currentColor"
         strokeWidth="1.8"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

const ArrowRight = () => (
   <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
   >
      <path
         d="M6 3L11 8L6 13"
         stroke="currentColor"
         strokeWidth="1.8"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

const statusOptions: { status: DayStatus; label: string }[] = [
   { status: "busy", label: "Busy" },
   { status: "marked", label: "Marked" },
   { status: "markedBlue", label: "Event" },
   { status: "selected", label: "Today" },
   { status: null, label: "Clear" },
];

const Schedule = () => {
   const [monthIdx, setMonthIdx] = useState(9);
   const [statuses, setStatuses] = useState<Record<string, DayStatus>>(() => {
      const init: Record<string, DayStatus> = {};
      for (const row of rows) {
         for (const cell of row) {
            if (cell.defaultStatus) {
               init[`${cell.day}`] = cell.defaultStatus;
            }
         }
      }
      return init;
   });
   const [menuKey, setMenuKey] = useState<string | null>(null);
   const [menuVisible, setMenuVisible] = useState(false);
   const [cellRect, setCellRect] = useState({
      top: 0,
      left: 0,
      width: 0,
      height: 0,
   });
   const [menuSide, setMenuSide] = useState<"right" | "left" | "below">(
      "right",
   );
   const [menuTop, setMenuTop] = useState(0);
   const [menuLeft, setMenuLeft] = useState(0);
   const menuRef = useRef<HTMLDivElement>(null);
   const activeCellRef = useRef<HTMLElement | null>(null);

   const prev = () => setMonthIdx((i) => (i - 1 + 12) % 12);
   const next = () => setMonthIdx((i) => (i + 1) % 12);

   const openMenu = useCallback((key: string, el: HTMLElement) => {
      activeCellRef.current = el;
      const r = el.getBoundingClientRect();
      setCellRect({
         top: r.top,
         left: r.left,
         width: r.width,
         height: r.height,
      });
      setMenuKey(key);
      setMenuVisible(true);
   }, []);

   const closeMenu = useCallback(() => {
      setMenuKey(null);
      setMenuVisible(false);
      activeCellRef.current = null;
   }, []);

   const setStatus = useCallback(
      (status: DayStatus) => {
         if (!menuKey) return;
         setStatuses((prev) => {
            const next = { ...prev };
            if (status === null) {
               delete next[menuKey];
            } else {
               next[menuKey] = status;
            }
            return next;
         });
         closeMenu();
      },
      [menuKey, closeMenu],
   );

   useEffect(() => {
      if (!menuKey) return;
      const onKey = (e: KeyboardEvent) => {
         if (e.key === "Escape") closeMenu();
      };
      window.addEventListener("keydown", onKey);
      window.addEventListener("resize", closeMenu);
      return () => {
         window.removeEventListener("keydown", onKey);
         window.removeEventListener("resize", closeMenu);
      };
   }, [menuKey, closeMenu]);

   useEffect(() => {
      if (!menuVisible || !menuRef.current) return;
      const menuW = menuRef.current.offsetWidth;
      const menuH = menuRef.current.offsetHeight;
      const isMobile = window.innerWidth <= 640;

      if (isMobile) {
         setMenuSide("below");
         const top = cellRect.top + cellRect.height + 28;
         setMenuTop(
            top + menuH > window.innerHeight - 8
               ? cellRect.top - menuH - 8
               : top,
         );
         setMenuLeft(
            Math.min(
               Math.max(8, cellRect.left + cellRect.width / 2 - menuW / 2),
               window.innerWidth - menuW - 8,
            ),
         );
      } else {
         const rightEdge = cellRect.left + cellRect.width + 8 + menuW;
         setMenuSide(rightEdge > window.innerWidth - 8 ? "left" : "right");

         let top = cellRect.top;
         if (top + menuH > window.innerHeight - 8) {
            top = window.innerHeight - menuH - 8;
         }
         if (top < 8) top = 8;
         setMenuTop(top);
      }
   }, [menuVisible, cellRect]);

   return (
      <>
         <div className={styles.root}>
            <div className={styles.header}>
               <span className={styles.title}>Schedule</span>
               <div className={styles.monthNav}>
                  <button type="button" className={styles.arrow} onClick={prev}>
                     <ArrowLeft />
                  </button>
                  <span className={styles.month}>{MONTHS[monthIdx]}</span>
                  <button type="button" className={styles.arrow} onClick={next}>
                     <ArrowRight />
                  </button>
               </div>
            </div>

            <div className={styles.grid}>
               {rows.map((row, ri) =>
                  row.map((cell) => {
                     const key = `${cell.day}`;
                     const status = statuses[key] ?? null;
                     const isOpen = menuKey === key;

                     const cls = [
                        styles.cell,
                        cell.outside && styles.outside,
                        status === "busy" && styles.busy,
                        status === "marked" && styles.marked,
                        status === "markedBlue" && styles.markedBlue,
                        status === "selected" && styles.selected,
                        isOpen && styles.cellHighlight,
                     ]
                        .filter(Boolean)
                        .join(" ");

                     return (
                        // biome-ignore lint/a11y/useKeyWithClickEvents: calendar cell
                        // biome-ignore lint/a11y/noStaticElementInteractions: calendar cell
                        <div
                           key={`${ri}-${cell.day}`}
                           className={cls}
                           onClick={(e) => {
                              if (cell.outside) return;
                              openMenu(key, e.currentTarget);
                           }}
                        >
                           {status === "busy" && (
                              <Scribble day={cell.day} dimmed={isOpen} />
                           )}
                           <span className={styles.dayNum}>{cell.day}</span>
                           {isOpen && (
                              <span className={styles.dayMonth}>
                                 {MONTHS[monthIdx]}
                              </span>
                           )}
                        </div>
                     );
                  }),
               )}
            </div>
         </div>

         {menuKey &&
            createPortal(
               <>
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop close */}
                  {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop close */}
                  <div className={styles.backdrop} onClick={closeMenu} />
                  <div
                     className={`${styles.cell} ${styles.cellFloat} ${styles.cellHighlight} ${statuses[menuKey] === "busy" ? styles.busy : ""} ${statuses[menuKey] === "marked" ? styles.marked : ""} ${statuses[menuKey] === "markedBlue" ? styles.markedBlue : ""} ${statuses[menuKey] === "selected" ? styles.selected : ""} ${!statuses[menuKey] || statuses[menuKey] === "marked" || statuses[menuKey] === "markedBlue" ? styles.cellPlain : ""}`}
                     style={{
                        position: "fixed",
                        top: cellRect.top,
                        left: cellRect.left,
                        width: cellRect.width,
                        height: cellRect.height,
                        zIndex: 10001,
                        margin: 0,
                     }}
                  >
                     {statuses[menuKey] === "busy" && (
                        <Scribble day={Number(menuKey)} dimmed />
                     )}
                     <span className={styles.dayNum}>{menuKey}</span>
                     <span className={styles.dayMonth}>{MONTHS[monthIdx]}</span>
                  </div>
                  {menuVisible && (
                     <div
                        ref={menuRef}
                        className={styles.contextMenu}
                        style={{
                           top: menuTop,
                           ...(menuSide === "below"
                              ? { left: menuLeft }
                              : menuSide === "right"
                                ? { left: cellRect.left + cellRect.width + 8 }
                                : {
                                     right:
                                        window.innerWidth - cellRect.left + 8,
                                  }),
                        }}
                     >
                        {statusOptions.map((opt) => (
                           <button
                              key={opt.label}
                              type="button"
                              className={styles.menuItem}
                              onClick={() => setStatus(opt.status)}
                           >
                              {opt.label}
                           </button>
                        ))}
                     </div>
                  )}
               </>,
               document.body,
            )}
      </>
   );
};

export default Schedule;
