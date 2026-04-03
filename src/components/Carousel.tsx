"use client";

import { useTheme } from "next-themes";
import {
   type RefObject,
   useCallback,
   useEffect,
   useRef,
   useState,
} from "react";
import s from "./Carousel.module.scss";

type CarouselItem = {
   name: string;
   href: string;
} & (
   | { video: string; videoLight?: undefined; videoDark?: undefined }
   | { video?: undefined; videoLight: string; videoDark: string }
);

const ITEMS: CarouselItem[] = [
   { name: "Coin", video: "/videos/coin.mp4", href: "/projects/sites/coin" },
   {
      name: "UI Library",
      videoLight: "/videos/ui-library_black.mp4",
      videoDark: "/videos/ui-library_white.mp4",
      href: "/projects/ui-library",
   },
   {
      name: "Gridscape",
      videoLight: "/videos/gridscape_black.mp4",
      videoDark: "/videos/gridscape_white.mp4",
      href: "/projects/exp/gridscape",
   },
   {
      name: "Spotlight",
      videoLight: "/videos/spotlight_black.mp4",
      videoDark: "/videos/spotlight_white.mp4",
      href: "/projects/sites/spotlight",
   },
   {
      name: "View Scroll",
      videoLight: "/videos/view-scroll_black.mp4",
      videoDark: "/videos/view-scroll_white.mp4",
      href: "/projects/sites/view-scroll",
   },
   {
      name: "Art",
      videoLight: "/videos/art_black.mp4",
      videoDark: "/videos/art_white.mp4",
      href: "/projects/tools/art",
   },
   {
      name: "Scroll Reveal",
      videoLight: "/videos/scroll-reveal_black.mp4",
      videoDark: "/videos/scroll-reveal_white.mp4",
      href: "/projects/exp/scroll-reveal",
   },
   {
      name: "Prism Veil",
      video: "/videos/prism-veil.mp4",
      href: "/projects/exp/prism-veil",
   },
   {
      name: "Scroll Expand",
      videoLight: "/videos/scroll-expand_black.mp4",
      videoDark: "/videos/scroll-expand_white.mp4",
      href: "/projects/exp/scroll-expand",
   },
   {
      name: "Music",
      videoLight: "/videos/music_black.mp4",
      videoDark: "/videos/music_white.mp4",
      href: "/projects/tools/music",
   },
   {
      name: "Chrome Abyss",
      video: "/videos/chrome-abyss.mp4",
      href: "/projects/exp/chrome-abyss",
   },
   {
      name: "Ironhill",
      video: "/videos/ironhill.mp4",
      href: "/projects/exp/ironhill",
   },
];

const AUTO_SPEED = 0.9;
const TRIPLED = [...ITEMS, ...ITEMS, ...ITEMS];

function getVideoSrc(item: CarouselItem, theme: string | undefined): string {
   if (item.video) return item.video;
   return (theme === "dark" ? item.videoDark : item.videoLight) as string;
}

function VideoCard({
   item,
   theme,
   mounted,
   wasDragged,
}: {
   item: CarouselItem;
   theme: string | undefined;
   mounted: boolean;
   wasDragged: RefObject<boolean>;
}) {
   const cardRef = useRef<HTMLDivElement>(null);
   const videoRef = useRef<HTMLVideoElement>(null);
   const [loaded, setLoaded] = useState(false);
   const visibleRef = useRef(false);

   useEffect(() => {
      const el = cardRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(
         ([entry]) => {
            const v = videoRef.current;
            if (!v) return;
            visibleRef.current = entry.isIntersecting;

            if (entry.isIntersecting) {
               const src = getVideoSrc(item, mounted ? theme : "light");
               if (v.getAttribute("src") !== src) {
                  v.src = src;
                  setLoaded(false);
               }
               v.play().catch(() => {});
            } else {
               v.pause();
            }
         },
         { rootMargin: "0px 300px" },
      );
      obs.observe(el);
      return () => obs.disconnect();
   }, [item, theme, mounted]);

   return (
      <div ref={cardRef} className={`${s.card} ${loaded ? "" : s.skeleton}`}>
         <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            className={s.link}
            onClick={(e) => {
               if (wasDragged.current) e.preventDefault();
            }}
         >
            <div className={s.videoWrap}>
               <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  preload="none"
                  onLoadedData={() => setLoaded(true)}
               />
            </div>
            <span className={s.name}>{item.name}</span>
         </a>
      </div>
   );
}

export default function Carousel() {
   const { resolvedTheme } = useTheme();
   const [mounted, setMounted] = useState(false);
   const wrapperRef = useRef<HTMLDivElement>(null);
   const trackRef = useRef<HTMLDivElement>(null);
   const offsetRef = useRef(0);
   const setWidthRef = useRef(0);
   const dragging = useRef(false);
   const wasDragged = useRef(false);
   const startX = useRef(0);
   const startOffset = useRef(0);
   const rafRef = useRef<number | null>(null);

   const applyOffset = useCallback((x: number) => {
      if (trackRef.current)
         trackRef.current.style.transform = `translateX(${x}px)`;
   }, []);

   const normalize = useCallback((x: number) => {
      const sw = setWidthRef.current;
      if (!sw) return x;
      if (x > -sw * 0.5) x -= sw;
      else if (x < -sw * 1.5) x += sw;
      return x;
   }, []);

   useEffect(() => {
      setMounted(true);
   }, []);

   useEffect(() => {
      const measure = () => {
         const track = trackRef.current;
         if (!track) return;
         const sw = track.scrollWidth / 3;
         setWidthRef.current = sw;
         offsetRef.current = -sw;
         applyOffset(-sw);
      };

      measure();
      const t = setTimeout(measure, 300);
      return () => clearTimeout(t);
   }, [applyOffset]);

   useEffect(() => {
      const tick = () => {
         if (!dragging.current) {
            let next = offsetRef.current - AUTO_SPEED;
            next = normalize(next);
            offsetRef.current = next;
            applyOffset(next);
         }
         rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return () => {
         if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
   }, [applyOffset, normalize]);

   useEffect(() => {
      const el = wrapperRef.current;
      if (!el) return;
      const handler = (e: WheelEvent) => {
         if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
         e.preventDefault();
         let next = offsetRef.current - e.deltaX;
         next = normalize(next);
         offsetRef.current = next;
         applyOffset(next);
      };
      el.addEventListener("wheel", handler, { passive: false });
      return () => el.removeEventListener("wheel", handler);
   }, [applyOffset, normalize]);

   const onPointerDown = useCallback(
      (e: React.PointerEvent) => {
         dragging.current = true;
         wasDragged.current = false;
         startX.current = e.clientX;
         startOffset.current = offsetRef.current;

         const onMove = (ev: PointerEvent) => {
            if (!dragging.current) return;
            const dx = ev.clientX - startX.current;
            if (Math.abs(dx) > 3) wasDragged.current = true;
            let next = startOffset.current + dx;
            next = normalize(next);
            offsetRef.current = next;
            applyOffset(next);
         };

         const onUp = () => {
            dragging.current = false;
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
         };

         window.addEventListener("pointermove", onMove);
         window.addEventListener("pointerup", onUp);
      },
      [applyOffset, normalize],
   );

   return (
      <div ref={wrapperRef} className={s.wrapper} onPointerDown={onPointerDown}>
         <div ref={trackRef} className={s.track}>
            {TRIPLED.map((item, i) => (
               <VideoCard
                  key={`${Math.floor(i / ITEMS.length)}-${item.href}`}
                  item={item}
                  theme={resolvedTheme}
                  mounted={mounted}
                  wasDragged={wasDragged}
               />
            ))}
         </div>
      </div>
   );
}
