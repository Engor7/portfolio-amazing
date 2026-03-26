"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./WordPopup.module.scss";

const text = `He sat in his favorite [chair], draped in warm tones, while outside the [wind] carried whispers through blue curtains. Soon he’d chase the [sun] again, golden light on his skin like a quiet promise.`;

const MENU_ITEMS = [
   { label: "Video generation" },
   { label: "Make variations" },
   { label: "Report a generation" },
   { label: "Share" },
];

const WORD_COVERS: Record<string, string> = {
   chair: "/word-popup/cover_w.png",
   wind: "/word-popup/cover_w2.png",
   sun: "/word-popup/cover_w3.png",
};

const CARD_W = 310;
// Must match .cardInner total height (cardImage 210 + padding 6 + bar ~48 + gap 4)
const CARD_H = 270;
const MENU_W = 162;
const MENU_GAP = 8;
const TOTAL_MENU_H = MENU_ITEMS.length * (36 + MENU_GAP);
const MARGIN = 6;

type TextPart = { type: "text" | "highlight"; content: string };

function parseText(rawText: string): TextPart[] {
   const parts: TextPart[] = [];
   const regex = /\[([^\u005d]+)\u005d/g;
   let last = 0;
   let match: RegExpExecArray | null = null;
   // biome-ignore lint/suspicious/noAssignInExpressions: standard regex iteration pattern
   while ((match = regex.exec(rawText)) !== null) {
      if (match.index > last)
         parts.push({
            type: "text",
            content: rawText.slice(last, match.index),
         });
      parts.push({ type: "highlight", content: match[1] });
      last = match.index + match[0].length;
   }
   if (last < rawText.length)
      parts.push({ type: "text", content: rawText.slice(last) });
   return parts;
}

type DesktopPos = {
   mode: "desktop";
   cardTop: number;
   cardLeft: number;
   menuLeft: number;
   menuTop: number;
   menuSide: "right" | "left" | "below";
};

type MobilePos = { mode: "bottom" };

type Position = DesktopPos | MobilePos;

function calcPosition(rects: DOMRect[]): Position {
   const vw = window.innerWidth;
   const vh = window.innerHeight;
   if (vw < 600) return { mode: "bottom" };

   const lastRect = rects[rects.length - 1];
   const firstRect = rects[0];
   const anchorCenterX = firstRect.left + firstRect.width / 2;

   let cardLeft = anchorCenterX - CARD_W / 2;
   cardLeft = Math.max(MARGIN, Math.min(cardLeft, vw - CARD_W - MARGIN));

   let cardTop: number;
   const spaceAbove = firstRect.top - MARGIN;
   const spaceBelow = vh - lastRect.bottom - MARGIN;
   if (spaceAbove >= CARD_H + MARGIN) {
      cardTop = firstRect.top - CARD_H - MARGIN;
   } else if (spaceBelow >= CARD_H + MARGIN) {
      cardTop = lastRect.bottom + MARGIN;
   } else {
      cardTop = Math.max(
         MARGIN,
         Math.min(firstRect.top - CARD_H / 2, vh - CARD_H - MARGIN),
      );
   }

   let menuSide: "right" | "left" | "below";
   let menuLeft: number;
   let menuTop: number;
   const rightSpace = vw - (cardLeft + CARD_W) - MARGIN;
   const leftSpace = cardLeft - MARGIN;
   if (rightSpace >= MENU_W + MARGIN) {
      menuSide = "right";
      menuLeft = cardLeft + CARD_W + MARGIN;
      menuTop = cardTop;
   } else if (leftSpace >= MENU_W + MARGIN) {
      menuSide = "left";
      menuLeft = cardLeft - MENU_W - MARGIN;
      menuTop = cardTop;
   } else {
      menuSide = "below";
      menuLeft = cardLeft;
      menuTop = cardTop + CARD_H + MARGIN;
      if (menuTop + TOTAL_MENU_H > vh - MARGIN)
         menuTop = cardTop - TOTAL_MENU_H - MARGIN;
   }

   return { mode: "desktop", cardTop, cardLeft, menuLeft, menuTop, menuSide };
}

type ActiveState = {
   word: string;
   cover: string;
   pos: Position;
   rects: DOMRect[];
   fontSize: string;
   fontWeight: string;
   fontFamily: string;
   lineHeight: string;
   letterSpacing: string;
};

const menuAnimClass: Record<string, string> = {
   right: styles.menuAnimRight,
   left: styles.menuAnimLeft,
   below: styles.menuAnimBelow,
};

const WordPopup = () => {
   const [active, setActive] = useState<ActiveState | null>(null);
   const [overlayVisible, setOverlayVisible] = useState(false);
   const [cardVisible, setCardVisible] = useState(false);
   const [menuVisibleCount, setMenuVisibleCount] = useState(0);
   const popupRef = useRef<HTMLDivElement>(null);
   const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
   const parts = parseText(text);

   const clearTimers = useCallback(() => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
   }, []);

   const openWord = useCallback(
      (el: HTMLSpanElement, word: string) => {
         const rects = Array.from(el.getClientRects());
         if (!rects.length) return;

         const cs = window.getComputedStyle(el);
         const pos = calcPosition(rects);

         clearTimers();
         setOverlayVisible(false);
         setCardVisible(false);
         setMenuVisibleCount(0);

         setActive({
            word,
            cover: WORD_COVERS[word] ?? "/word-popup/cover_w.png",
            pos,
            rects,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            fontFamily: cs.fontFamily,
            lineHeight: cs.lineHeight,
            letterSpacing: cs.letterSpacing,
         });

         const t0 = setTimeout(() => setOverlayVisible(true), 10);
         const t1 = setTimeout(() => setCardVisible(true), 90);
         const mt = MENU_ITEMS.map((_, i) =>
            setTimeout(() => setMenuVisibleCount(i + 1), 270 + i * 90),
         );
         timersRef.current = [t0, t1, ...mt];
      },
      [clearTimers],
   );

   const handleClose = useCallback(() => {
      clearTimers();
      setOverlayVisible(false);
      setCardVisible(false);
      setMenuVisibleCount(0);
      const t = setTimeout(() => setActive(null), 320);
      timersRef.current = [t];
   }, [clearTimers]);

   useEffect(() => {
      const h = (e: MouseEvent | TouchEvent) => {
         const target = e.target as HTMLElement;
         if (
            popupRef.current &&
            !popupRef.current.contains(target) &&
            !target.closest("[data-wp-highlight]") &&
            !target.closest("[data-wp-clone]")
         )
            handleClose();
      };
      document.addEventListener("mousedown", h);
      document.addEventListener("touchstart", h);
      window.addEventListener("resize", handleClose);
      return () => {
         document.removeEventListener("mousedown", h);
         document.removeEventListener("touchstart", h);
         window.removeEventListener("resize", handleClose);
         clearTimers();
      };
   }, [handleClose, clearTimers]);

   const pos = active?.pos;
   const isMobile = pos?.mode === "bottom";

   const marqueeText = "Make it look dark, HDR style, cinematic look";

   const flowerIcon = (
      <svg
         className={styles.flowerIcon}
         xmlns="http://www.w3.org/2000/svg"
         width="14"
         height="14"
         viewBox="0 0 24 24"
      >
         <title>Flower</title>
         <g fill="none">
            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
            <path
               fill="currentColor"
               d="M10.24 3.209a5.35 5.35 0 0 1 1.82 1.254a5.9 5.9 0 0 1 1.805-1.21c.997-.413 2.14-.487 3.135.087s1.503 1.602 1.644 2.671c.09.688.038 1.428-.147 2.17a5.3 5.3 0 0 1 1.996.947C21.373 9.812 22 10.816 22 12c0 1.178-.62 2.178-1.493 2.86a5.3 5.3 0 0 1-1.928.939c.197.721.25 1.453.152 2.138c-.156 1.097-.71 2.134-1.73 2.723c-1.027.593-2.21.55-3.241.131a5.35 5.35 0 0 1-1.819-1.254c-.55.53-1.165.946-1.806 1.21c-.997.413-2.14.487-3.135-.087s-1.502-1.602-1.644-2.671a5.9 5.9 0 0 1 .147-2.17a5.35 5.35 0 0 1-1.996-.947C2.627 14.188 2 13.185 2 12c0-1.178.62-2.177 1.493-2.86A5.3 5.3 0 0 1 5.42 8.2a5.3 5.3 0 0 1-.152-2.138C5.425 4.966 5.979 3.929 7 3.34c1.026-.592 2.209-.55 3.24-.131M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8m0 2a2 2 0 1 1 0 4a2 2 0 0 1 0-4"
            />
         </g>
      </svg>
   );

   const marqueeSegment = (
      <>
         {marqueeText}
         <span className={styles.marqueeSeparator}>{flowerIcon}</span>
      </>
   );

   const cardContent = (
      <>
         <div className={styles.cardImageWrap}>
            <div
               className={styles.cardImage}
               style={{ backgroundImage: `url(${active?.cover})` }}
            ></div>
            <button
               type="button"
               className={styles.closeBtn}
               onClick={handleClose}
            >
               ✕
            </button>
         </div>
         <div className={styles.cardBar}>
            <div className={styles.cardBarText}>
               <span className={styles.cardBarLabel}>
                  <span className={styles.marqueeTrack}>
                     <span className={styles.marqueeSegment}>
                        {marqueeSegment}
                     </span>
                     <span className={styles.marqueeSegment} aria-hidden="true">
                        {marqueeSegment}
                     </span>
                  </span>
               </span>
            </div>
         </div>
      </>
   );

   return (
      <div className={styles.root}>
         <div className={styles.textWrap}>
            <p className={styles.textContent}>
               {parts.map((p, i) =>
                  p.type === "highlight" ? (
                     // biome-ignore lint/a11y/useSemanticElements: inline text element needs span, not button
                     <span
                        key={p.content}
                        className={styles.highlight}
                        data-wp-highlight
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                           e.stopPropagation();
                           openWord(e.currentTarget, p.content);
                        }}
                        onKeyDown={(e) => {
                           if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openWord(e.currentTarget, p.content);
                           }
                        }}
                     >
                        {p.content}
                     </span>
                  ) : (
                     // biome-ignore lint/suspicious/noArrayIndexKey: text fragments have no stable key
                     <span key={i}>{p.content}</span>
                  ),
               )}
            </p>
         </div>
         <p className={styles.hint}>Click on the highlighted words</p>

         {active && (
            <>
               {/* biome-ignore lint/a11y/useKeyWithClickEvents: overlay dismissal, not interactive content */}
               {/* biome-ignore lint/a11y/noStaticElementInteractions: overlay backdrop */}
               <div
                  className={styles.spotlightOverlay}
                  style={{
                     opacity: overlayVisible ? 1 : 0,
                     pointerEvents: overlayVisible ? "auto" : "none",
                  }}
                  onClick={handleClose}
               />

               {active.rects.map((rect, i) => (
                  <span
                     key={`${rect.top}-${rect.left}-${rect.width}`}
                     className={styles.wordClone}
                     data-wp-clone
                     style={{
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        fontSize: active.fontSize,
                        fontFamily: active.fontFamily,
                        fontWeight: active.fontWeight,
                        lineHeight: `${rect.height}px`,
                        letterSpacing: active.letterSpacing,
                        opacity: overlayVisible ? 1 : 0,
                     }}
                  >
                     <span
                        style={{
                           display: "inline-block",
                           transform:
                              i === 0
                                 ? "none"
                                 : `translateX(calc(-${active.rects.slice(0, i).reduce((sum, r) => sum + r.width, 0)}px))`,
                           whiteSpace: "nowrap",
                        }}
                     >
                        {active.word}
                     </span>
                  </span>
               ))}

               <div ref={popupRef}>
                  {isMobile ? (
                     <>
                        <div className={styles.mobileCard}>
                           {cardVisible && (
                              <div
                                 className={`${styles.cardInner} ${styles.sheetAnim}`}
                              >
                                 {cardContent}
                              </div>
                           )}
                        </div>
                        <div
                           className={styles.mobileMenu}
                           style={{
                              bottom: `calc(210px + 44px + 16px + max(16px, env(safe-area-inset-bottom)) + 12px)`,
                           }}
                        >
                           {MENU_ITEMS.map((item, i) => (
                              <button
                                 type="button"
                                 key={item.label}
                                 className={styles.menuPill}
                                 style={{
                                    opacity: menuVisibleCount > i ? 1 : 0,
                                    transform:
                                       menuVisibleCount > i
                                          ? "translateY(0)"
                                          : "translateY(6px)",
                                    transition:
                                       "opacity 0.18s ease, transform 0.18s ease",
                                 }}
                              >
                                 {item.label}
                              </button>
                           ))}
                        </div>
                     </>
                  ) : pos?.mode === "desktop" ? (
                     <>
                        {cardVisible && (
                           <div
                              className={styles.cardAnim}
                              style={{
                                 position: "fixed",
                                 top: pos.cardTop,
                                 left: pos.cardLeft,
                                 width: CARD_W,
                                 zIndex: 1002,
                              }}
                           >
                              <div className={styles.cardInner}>
                                 {cardContent}
                              </div>
                           </div>
                        )}

                        <div
                           style={{
                              position: "fixed",
                              top: pos.menuTop,
                              left: pos.menuLeft,
                              display: "flex",
                              flexDirection:
                                 pos.menuSide === "below" ? "row" : "column",
                              alignItems: "flex-start",
                              flexWrap:
                                 pos.menuSide === "below" ? "wrap" : "nowrap",
                              gap: MENU_GAP,
                              width: pos.menuSide === "below" ? CARD_W : "auto",
                              zIndex: 1002,
                           }}
                        >
                           {MENU_ITEMS.slice(0, menuVisibleCount).map(
                              (item) => (
                                 <button
                                    type="button"
                                    key={item.label}
                                    className={`${styles.menuBtn} ${menuAnimClass[pos.menuSide]}`}
                                 >
                                    <span>{item.label}</span>
                                 </button>
                              ),
                           )}
                        </div>
                     </>
                  ) : null}
               </div>
            </>
         )}
      </div>
   );
};

export default WordPopup;
