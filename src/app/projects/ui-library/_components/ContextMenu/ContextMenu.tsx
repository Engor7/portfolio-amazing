"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ContextMenu.module.scss";

type SubItem = { label: string; meta?: string; color?: string };
type MenuItem = { label: string; icon?: React.ReactNode; submenu?: SubItem[] };

const IconPlay = (
   <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
   >
      <g fill="none">
         <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.5"
         />
         <path
            fill="currentColor"
            d="M9.5 11.2v1.6c0 1.52 0 2.28.456 2.586s1.079-.032 2.326-.712l1.468-.8C15.25 13.056 16 12.647 16 12s-.75-1.056-2.25-1.874l-1.469-.8c-1.246-.68-1.87-1.02-2.325-.712C9.5 8.92 9.5 9.68 9.5 11.2"
         />
      </g>
   </svg>
);

const IconAddToQueue = (
   <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
   >
      <path
         fill="none"
         stroke="currentColor"
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth="1.5"
         d="M18 18H6c-.943 0-1.414 0-1.707-.293S4 16.943 4 16s0-1.414.293-1.707S5.057 14 6 14h12c.943 0 1.414 0 1.707.293S20 15.057 20 16s0 1.414-.293 1.707S18.943 18 18 18M4 10h16M4 6h16"
      />
   </svg>
);

const IconAddToPlaylist = (
   <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
   >
      <g
         fill="none"
         stroke="currentColor"
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth="1.5"
      >
         <path d="M3 15c0-2.809 0-4.213.674-5.222a4 4 0 0 1 1.104-1.104C5.787 8 7.19 8 10 8h4c2.809 0 4.213 0 5.222.674a4 4 0 0 1 1.104 1.104C21 10.787 21 12.19 21 15s0 4.213-.674 5.222a4 4 0 0 1-1.104 1.104C18.213 22 16.81 22 14 22h-4c-2.809 0-4.213 0-5.222-.674a4 4 0 0 1-1.104-1.104C3 19.213 3 17.81 3 15" />
         <path d="M12.5 16.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0 0v-5s.4 1.733 2 2M19 8c-.018-1.24-.11-1.943-.582-2.414C17.832 5 16.888 5 15.002 5H8.998c-1.887 0-2.83 0-3.416.586C5.11 6.057 5.018 6.76 5 8m12-3c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C15.398 2 14.932 2 14 2h-4c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083C7 3.602 7 4.068 7 5" />
      </g>
   </svg>
);

const IconRemoveFromPlaylist = (
   <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
   >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
         <path strokeLinejoin="round" d="M2 7.5h19m-4.5-5l-3 5m-4-5l-3 5" />
         <path
            strokeLinecap="round"
            d="M11.5 21c-4.478 0-6.718 0-8.109-1.391S2 15.979 2 11.5c0-4.478 0-6.718 1.39-8.109S7.021 2 11.5 2s6.718 0 8.109 1.391c1.39 1.391 1.39 3.63 1.39 8.109M14 18h8"
         />
      </g>
   </svg>
);

const IconPost = (
   <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
   >
      <path
         fill="none"
         stroke="currentColor"
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth="1.5"
         d="M3 11c0-3.75 0-5.625.955-6.939A5 5 0 0 1 5.06 2.955C6.375 2 8.251 2 12 2s5.625 0 6.939.955a5 5 0 0 1 1.106 1.106C21 5.375 21 7.251 21 11v2c0 3.75 0 5.625-.955 6.939a5 5 0 0 1-1.106 1.106C17.625 22 15.749 22 12 22s-5.625 0-6.939-.955a5 5 0 0 1-1.106-1.106C3 18.625 3 16.749 3 13zm12-4H7m3 5H7"
      />
   </svg>
);

const IconShare = (
   <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
   >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
         <path d="M20.5 5.5a3 3 0 1 1-6 0a3 3 0 0 1 6 0Zm-12 6a3 3 0 1 1-6 0a3 3 0 0 1 6 0Zm13 7a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z" />
         <path d="M14.535 4.581a8 8 0 0 0-1.162-.081a8.15 8.15 0 0 0-7.132 4.163m13.472-1.168A7.9 7.9 0 0 1 21.5 12.5a7.9 7.9 0 0 1-.974 3.801m-4.644 3.81a8.2 8.2 0 0 1-2.509.389c-3.79 0-6.974-2.555-7.873-6.01" />
      </g>
   </svg>
);

const IconViewAlbum = (
   <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
   >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
         <path d="M6 17.975c.129 1.308.42 2.189 1.077 2.846C8.256 22 10.154 22 13.949 22s5.693 0 6.872-1.18C22 19.643 22 17.745 22 13.95s0-5.693-1.18-6.872c-.656-.657-1.537-.948-2.846-1.077" />
         <path d="M2 10c0-3.771 0-5.657 1.172-6.828S6.229 2 10 2s5.657 0 6.828 1.172S18 6.229 18 10s0 5.657-1.172 6.828S13.771 18 10 18s-5.657 0-6.828-1.172S2 13.771 2 10Z" />
         <path d="M5 18c3.42-4.751 7.265-11.052 13-6.327" />
      </g>
   </svg>
);

const IconViewArtist = (
   <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
   >
      <g
         fill="none"
         stroke="currentColor"
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth="1.5"
      >
         <path d="M18.52 6.23C18.812 7.896 17.5 9 17.5 9s-1.603-.563-1.895-2.23C15.313 5.104 16.625 4 16.625 4s1.603.563 1.895 2.23m2.407 7.359c-1.345 1.129-2.99.5-2.99.5s-.3-1.758 1.044-2.887s2.99-.5 2.99-.5s.3 1.758-1.044 2.887m-4.193 6.237c-1.5-.575-1.734-2.19-1.734-2.19s1.267-1.038 2.767-.462c1.5.575 1.733 2.19 1.733 2.19s-1.267 1.038-2.767.462" />
         <path d="M15 17.637c1.405-1.201 3-3.58 3-5.91c0-.964-.154-1.885-.436-2.727M5.48 6.23C5.188 7.896 6.5 9 6.5 9s1.603-.563 1.895-2.23C8.687 5.104 7.375 4 7.375 4s-1.603.563-1.895 2.23m-2.407 7.359c1.345 1.129 2.99.5 2.99.5s.3-1.758-1.044-2.887s-2.99-.5-2.99-.5s-.3 1.758 1.044 2.887m4.194 6.237c1.5-.575 1.733-2.19 1.733-2.19s-1.267-1.038-2.767-.462c-1.5.575-1.733 2.19-1.733 2.19s1.267 1.038 2.767.462" />
         <path d="M9 17.637c-1.405-1.201-3-3.58-3-5.91c0-.964.154-1.885.436-2.727M11 10l1-.5v5m1 0h-2" />
      </g>
   </svg>
);

const IconNavigate = (
   <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
   >
      <g
         fill="none"
         stroke="currentColor"
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         <path
            strokeWidth="1.5"
            d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"
         />
         <path
            strokeWidth="1.5"
            d="M13.693 7.477L10.96 8.602c-.825.34-1.237.509-1.544.815c-.306.307-.476.72-.815 1.543l-1.125 2.733c-.844 2.05-1.266 3.074-.755 3.585c.51.511 1.536.09 3.585-.755l2.733-1.125c.824-.34 1.236-.509 1.543-.816s.476-.718.815-1.543l1.125-2.732c.844-2.05 1.266-3.074.755-3.585c-.51-.511-1.536-.09-3.585.755"
         />
         <path strokeWidth="2" d="M12 12v.01" />
      </g>
   </svg>
);

const IconConfirm = (
   <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
   >
      <path
         fill="none"
         stroke="currentColor"
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth="1.5"
         d="M7.5 8.5h9m-9 4H13m9-2c0-.77-.014-1.523-.04-2.25c-.083-2.373-.125-3.56-1.09-4.533c-.965-.972-2.186-1.024-4.626-1.129A100 100 0 0 0 12 2.5c-1.48 0-2.905.03-4.244.088c-2.44.105-3.66.157-4.626 1.13c-.965.972-1.007 2.159-1.09 4.532a64 64 0 0 0 0 4.5c.083 2.373.125 3.56 1.09 4.533c.965.972 2.186 1.024 4.626 1.129q1.102.047 2.275.07c.74.014 1.111.02 1.437.145s.6.358 1.148.828l2.179 1.87A.73.73 0 0 0 16 20.77v-2.348l.244-.01c2.44-.105 3.66-.157 4.626-1.13c.965-.972 1.007-2.159 1.09-4.532c.026-.727.04-1.48.04-2.25"
      />
   </svg>
);

const MENU_ITEMS: MenuItem[] = [
   { label: "Play", icon: IconPlay },
   { label: "Add to Queue", icon: IconAddToQueue },
   {
      label: "Add to Playlist",
      icon: IconAddToPlaylist,
      submenu: [
         { label: "Summer", meta: "2h 3m", color: "#e8a87c" },
         { label: "Favorites", meta: "7h 24m", color: "#7b6d8d" },
         { label: "Montreal", meta: "1h 22m", color: "#6c8cbf" },
         { label: "aux", meta: "4h", color: "#7aae9e" },
         { label: "Spring", meta: "10h 2m", color: "#9b6b9e" },
      ],
   },
   { label: "Remove from Playlist", icon: IconRemoveFromPlaylist },
   { label: "Post", icon: IconPost },
   {
      label: "Share",
      icon: IconShare,
      submenu: [
         { label: "Copy Link" },
         { label: "Twitter" },
         { label: "Telegram" },
         { label: "WhatsApp" },
      ],
   },
   {
      label: "View Album",
      icon: IconViewAlbum,
      submenu: [
         { label: "Isabella Dances", meta: "2023" },
         { label: "Night Circus", meta: "2021" },
         { label: "Daydream", meta: "2019" },
      ],
   },
   { label: "View Artist", icon: IconViewArtist },
];

const ContextMenu = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
   const [submenuPos, setSubmenuPos] = useState<{
      top: number;
      left?: number;
      right?: number;
   }>({ top: 0, left: 0 });

   const wrapperRef = useRef<HTMLDivElement>(null);
   const mainRef = useRef<HTMLDivElement>(null);
   const itemRefs = useRef<Map<number, HTMLLIElement>>(new Map());

   // close on outside click (desktop)
   useEffect(() => {
      const handler = (e: MouseEvent) => {
         if (
            wrapperRef.current &&
            !wrapperRef.current.contains(e.target as Node)
         ) {
            setActiveSubmenu(null);
         }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
   }, []);

   // lock body scroll when mobile sheet is open
   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "";
      }
      return () => {
         document.body.style.overflow = "";
      };
   }, [isOpen]);

   const positionSubmenu = useCallback((index: number) => {
      const itemEl = itemRefs.current.get(index);
      const mainEl = mainRef.current;
      if (!itemEl || !mainEl) return;

      const itemRect = itemEl.getBoundingClientRect();
      const mainRect = mainEl.getBoundingClientRect();
      const submenuWidth = 180;
      const submenuHeight = 200;

      let top = itemRect.top - mainRect.top;
      let left: number | undefined = mainRect.width + 4;
      let right: number | undefined;

      if (mainRect.right + submenuWidth + 8 > window.innerWidth) {
         left = undefined;
         right = mainRect.width + 4;
      }

      if (itemRect.top + submenuHeight > window.innerHeight) {
         top = Math.max(0, mainRect.height - submenuHeight);
      }

      setSubmenuPos({ top, left, right });
   }, []);

   const handleItemHover = (index: number, item: MenuItem) => {
      if (item.submenu) {
         setActiveSubmenu(index);
         positionSubmenu(index);
      } else {
         setActiveSubmenu(null);
      }
   };

   const handleItemClick = (index: number, item: MenuItem) => {
      if (item.submenu) {
         setActiveSubmenu(activeSubmenu === index ? null : index);
      }
   };

   const close = () => {
      setIsOpen(false);
      setActiveSubmenu(null);
   };

   const activeItem = activeSubmenu !== null ? MENU_ITEMS[activeSubmenu] : null;

   return (
      <div ref={wrapperRef} className={styles.wrapper}>
         {/* mobile trigger */}
         <button
            type="button"
            className={styles.trigger}
            onClick={() => setIsOpen(true)}
         >
            Context menu
         </button>

         {/* mobile backdrop + bottom sheet */}
         <button
            type="button"
            className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ""}`}
            onClick={close}
            onKeyDown={(e) => {
               if (e.key === "Escape") close();
            }}
            tabIndex={-1}
         />
         <div className={`${styles.sheet} ${isOpen ? styles.sheetOpen : ""}`}>
            <div className={styles.sheetHandle} />
            <ul className={styles.sheetList}>
               {MENU_ITEMS.map((item, i) => (
                  <li key={item.label} className={styles.sheetGroup}>
                     <button
                        type="button"
                        className={`${styles.sheetItem} ${activeSubmenu === i ? styles.sheetItemActive : ""}`}
                        onClick={() => handleItemClick(i, item)}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") handleItemClick(i, item);
                        }}
                        tabIndex={0}
                     >
                        <span className={styles.icon}>{item.icon ?? "x"}</span>
                        <span className={styles.sheetLabel}>{item.label}</span>
                        {item.submenu && (
                           <span
                              className={`${styles.sheetChevron} ${activeSubmenu === i ? styles.sheetChevronOpen : ""}`}
                           >
                              ›
                           </span>
                        )}
                     </button>
                     {item.submenu && (
                        <div
                           className={`${styles.accordion} ${activeSubmenu === i ? styles.accordionOpen : ""}`}
                        >
                           <ul className={styles.accordionList}>
                              {item.submenu.map((sub) => (
                                 <li
                                    key={sub.label}
                                    className={styles.accordionItem}
                                 >
                                    {sub.color && (
                                       <span
                                          className={styles.subColor}
                                          style={{ background: sub.color }}
                                       />
                                    )}
                                    <span className={styles.subLabel}>
                                       {sub.label}
                                    </span>
                                    {sub.meta && (
                                       <span className={styles.subMeta}>
                                          {sub.meta}
                                       </span>
                                    )}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     )}
                  </li>
               ))}
            </ul>
            <div className={styles.sheetFooter}>
               <span className={styles.hint}>
                  <span className={styles.hintKey}>{IconNavigate}</span>{" "}
                  Navigate
               </span>
               <span className={styles.hint}>
                  <span className={styles.hintKey}>{IconConfirm}</span> Confirm
               </span>
            </div>
         </div>

         {/* desktop menu */}
         {/* biome-ignore lint/a11y/noStaticElementInteractions: mouse-only desktop hover zone */}
         <div
            className={styles.desktop}
            onMouseLeave={() => setActiveSubmenu(null)}
         >
            <div ref={mainRef} className={styles.main}>
               <ul className={styles.list}>
                  {MENU_ITEMS.map((item, i) => (
                     <li
                        key={item.label}
                        ref={(el) => {
                           if (el) itemRefs.current.set(i, el);
                        }}
                        className={`${styles.item} ${activeSubmenu === i ? styles.active : ""}`}
                        onMouseEnter={() => handleItemHover(i, item)}
                        onClick={() => handleItemClick(i, item)}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") handleItemClick(i, item);
                        }}
                     >
                        <span className={styles.icon}>{item.icon ?? "x"}</span>
                        <span className={styles.label}>{item.label}</span>
                        {item.submenu && (
                           <span className={styles.chevron}>›</span>
                        )}
                     </li>
                  ))}
               </ul>
               <div className={styles.footer}>
                  <span className={styles.hint}>
                     <span className={styles.hintKey}>{IconNavigate}</span>{" "}
                     Navigate
                  </span>
                  <span className={styles.hint}>
                     <span className={styles.hintKey}>{IconConfirm}</span>{" "}
                     Confirm
                  </span>
               </div>
            </div>

            {activeItem?.submenu && (
               <div
                  className={styles.submenu}
                  style={{
                     top: submenuPos.top,
                     ...(submenuPos.left !== undefined
                        ? { left: submenuPos.left }
                        : { right: submenuPos.right }),
                  }}
               >
                  <ul className={styles.subList}>
                     {activeItem.submenu.map((sub) => (
                        <li key={sub.label} className={styles.subItem}>
                           {sub.color && (
                              <span
                                 className={styles.subColor}
                                 style={{ background: sub.color }}
                              />
                           )}
                           <span className={styles.subLabel}>{sub.label}</span>
                           {sub.meta && (
                              <span className={styles.subMeta}>{sub.meta}</span>
                           )}
                        </li>
                     ))}
                  </ul>
               </div>
            )}
         </div>
      </div>
   );
};

export default ContextMenu;
