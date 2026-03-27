"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import type { StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import av1 from "../images/av_1.png";
import av2 from "../images/av_2.png";
import av3 from "../images/av_3.png";
import img from "../images/img.png";
import img1 from "../images/img_1.png";
import img2 from "../images/img_2.png";
import img3 from "../images/img_3.png";
import img4 from "../images/img_4.png";
import img5 from "../images/img_5.png";
import img6 from "../images/img_6.png";
import img7 from "../images/img_7.png";
import img8 from "../images/img_8.png";
import img9 from "../images/img_9.png";
import img10 from "../images/img_10.png";
import img11 from "../images/img_11.png";
import img12 from "../images/img_12.png";
import img13 from "../images/img_13.png";
import img14 from "../images/img_14.png";
import CarouselCard from "./CarouselCard";

interface CardData {
   id: number;
   type: "live" | "event" | "ad" | "group";
   image?: StaticImageData;
   color?: string;

   // Live type fields
   title?: string;
   author?: string;
   authorRole?: string;
   followers?: string;

   // Event type fields
   eventDate?: string;
   eventTitle?: string;
   eventLocation?: string;

   // Ad type fields
   adText?: string;

   // Group type fields
   groupTag?: string;
   groupCategory?: string;
   groupTitle?: string;
   groupMembers?: number;
   groupImages?: StaticImageData[];
}

const CARDS_DATA: CardData[] = [
   {
      id: 1,
      type: "live",
      image: img,
      followers: "4.2M",
      title: "Midnight rider chronicles",
      author: "Victor Shade",
      authorRole: "Equestrian Artist",
   },
   {
      id: 2,
      type: "event",
      image: img1,
      followers: "1.5M",
      eventDate: "15 February",
      eventTitle: "Arctic Rally Challenge",
      eventLocation: "Helsinki, Finland",
   },
   {
      id: 3,
      type: "group",
      groupTag: "motorsport fans",
      groupCategory: "Racing",
      groupTitle: "Speed Demons United",
      groupMembers: 12500,
      groupImages: [av1, av2, av3],
   },
   {
      id: 4,
      type: "live",
      image: img2,
      followers: "3.1M",
      title: "Wildlife in focus",
      author: "Erik Nordstrom",
      authorRole: "Nature Photographer",
   },
   {
      id: 5,
      type: "ad",
      image: img3,
      adText: "Feel the speed",
   },
   {
      id: 6,
      type: "group",
      groupTag: "adrenaline seekers",
      groupCategory: "Motorsport",
      groupTitle: "Formula Night Racers",
      groupMembers: 24800,
      groupImages: [av2, av3, av1],
   },
   {
      id: 7,
      type: "event",
      image: img8,
      followers: "2.8M",
      eventDate: "22 February",
      eventTitle: "Spectrum Light Show",
      eventLocation: "Tokyo, Japan",
   },
   {
      id: 8,
      type: "live",
      image: img5,
      followers: "890K",
      title: "Beyond the powder line",
      author: "Kai Müller",
      authorRole: "Pro Freeride Skier",
   },
   {
      id: 9,
      type: "group",
      groupTag: "winter sports",
      groupCategory: "Adventure",
      groupTitle: "Alpine Thrill Seekers",
      groupMembers: 8900,
      groupImages: [av3, av1, av2],
   },
   {
      id: 10,
      type: "event",
      image: img6,
      followers: "5.1M",
      eventDate: "25 February",
      eventTitle: "Dune World Premiere",
      eventLocation: "Los Angeles, CA",
   },
   {
      id: 11,
      type: "ad",
      image: img9,
      adText: "Unleash your wild side",
   },
   {
      id: 12,
      type: "live",
      image: img4,
      followers: "2.1M",
      title: "Chasing clouds solo",
      author: "Luna Vega",
      authorRole: "Paragliding Champion",
   },
   {
      id: 13,
      type: "group",
      groupTag: "sky explorers",
      groupCategory: "Extreme",
      groupTitle: "Wings Over Earth",
      groupMembers: 18300,
      groupImages: [av1, av3, av2],
   },
   {
      id: 14,
      type: "event",
      image: img7,
      followers: "1.9M",
      eventDate: "1 March",
      eventTitle: "Paws & Petals Festival",
      eventLocation: "Portland, OR",
   },
   {
      id: 15,
      type: "live",
      image: img10,
      followers: "1.2M",
      title: "Glow up masterclass",
      author: "Mia Chen",
      authorRole: "Beauty Creator",
   },
   {
      id: 16,
      type: "group",
      groupTag: "self care",
      groupCategory: "Beauty",
      groupTitle: "Glow Getters Club",
      groupMembers: 15600,
      groupImages: [av2, av1, av3],
   },
   {
      id: 17,
      type: "ad",
      image: img11,
      adText: "Own the streets",
   },
   {
      id: 18,
      type: "event",
      image: img12,
      followers: "2.4M",
      eventDate: "8 March",
      eventTitle: "Skin Deep Summit",
      eventLocation: "Seoul, Korea",
   },
   {
      id: 19,
      type: "live",
      image: img13,
      followers: "1.8M",
      title: "Garden stories at 80",
      author: "Harold Greene",
      authorRole: "Botanist & Storyteller",
   },
   {
      id: 20,
      type: "group",
      groupTag: "green thumbs",
      groupCategory: "Gardening",
      groupTitle: "Bloom Together",
      groupMembers: 21400,
      groupImages: [av3, av2, av1],
   },
   {
      id: 21,
      type: "ad",
      image: img14,
      adText: "Good vibes only",
   },
];

const CARD_GAP = 20;
const PEEK_PERCENT = 0.1;
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 960;

const WHEEL_LOCKOUT = 100;
const TRACKPAD_THRESHOLD = 5;

// Touch sensitivity
const SWIPE_VELOCITY_THRESHOLD = 150;
const SWIPE_DISTANCE_THRESHOLD = 0.08;

interface CarouselProps {
   onIndexChange?: (index: number, imageSrc?: string) => void;
}

const Carousel = ({ onIndexChange }: CarouselProps) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [cardWidth, setCardWidth] = useState(0);
   const [containerWidth, setContainerWidth] = useState(0);
   const [isDragging, setIsDragging] = useState(false);

   const x = useMotionValue(0);
   const currentIndexRef = useRef(currentIndex);
   const totalCards = CARDS_DATA.length;

   const wheelStateRef = useRef({
      accumulatedDelta: 0,
      lastTriggerTime: 0,
      eventCount: 0,
      lastEventTime: 0,
   });

   useEffect(() => {
      currentIndexRef.current = currentIndex;
   }, [currentIndex]);

   // Calculate card width
   useEffect(() => {
      const calculate = () => {
         if (!containerRef.current) return;

         const width = containerRef.current.offsetWidth;
         const screenWidth = window.innerWidth;

         let fullVisibleCards: number;
         if (screenWidth <= MOBILE_BREAKPOINT) {
            fullVisibleCards = 1;
         } else if (screenWidth <= TABLET_BREAKPOINT) {
            fullVisibleCards = 2;
         } else {
            fullVisibleCards = 3;
         }

         const totalCardUnits = fullVisibleCards + 2 * PEEK_PERCENT;
         const totalGaps = (fullVisibleCards + 1) * CARD_GAP;
         const newCardWidth = (width - totalGaps) / totalCardUnits;

         setContainerWidth(width);
         setCardWidth(newCardWidth);
      };

      calculate();
      window.addEventListener("resize", calculate);
      return () => window.removeEventListener("resize", calculate);
   }, []);

   // Get target X position for a given index
   const getTargetX = useCallback(
      (index: number) => {
         if (cardWidth === 0 || containerWidth === 0) return 0;
         const centerOffset = (containerWidth - cardWidth) / 2;
         return centerOffset - index * (cardWidth + CARD_GAP);
      },
      [cardWidth, containerWidth],
   );

   // Animate to index
   const animateToIndex = useCallback(
      (index: number) => {
         const newIndex = Math.max(0, Math.min(totalCards - 1, index));
         if (newIndex === currentIndexRef.current) return;

         setCurrentIndex(newIndex);
         const targetX = getTargetX(newIndex);
         animate(x, targetX, {
            type: "spring",
            stiffness: 300,
            damping: 30,
         });
      },
      [totalCards, getTargetX, x],
   );

   // Initialize position
   useEffect(() => {
      if (cardWidth > 0 && containerWidth > 0) {
         x.set(getTargetX(currentIndex));
      }
   }, [cardWidth, containerWidth, currentIndex, getTargetX, x]);

   // Wheel handler
   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let decayTimeout: NodeJS.Timeout | null = null;

      const handleWheel = (e: WheelEvent) => {
         e.preventDefault();

         const now = Date.now();
         const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
         if (delta === 0) return;

         const state = wheelStateRef.current;
         const timeSinceLastEvent = now - state.lastEventTime;

         if (timeSinceLastEvent > 100) {
            state.eventCount = 0;
         }

         state.eventCount++;
         state.lastEventTime = now;

         const isMouse = state.eventCount < 3 && Math.abs(delta) >= 50;

         if (isMouse) {
            if (now - state.lastTriggerTime < WHEEL_LOCKOUT) return;
            state.lastTriggerTime = now;

            const idx = currentIndexRef.current;
            animateToIndex(delta > 0 ? idx + 1 : idx - 1);
            state.accumulatedDelta = 0;
         } else {
            if (now - state.lastTriggerTime < WHEEL_LOCKOUT) return;

            state.accumulatedDelta += delta;

            if (decayTimeout) clearTimeout(decayTimeout);
            decayTimeout = setTimeout(() => {
               state.accumulatedDelta *= 0.5;
               if (Math.abs(state.accumulatedDelta) < 10) {
                  state.accumulatedDelta = 0;
               }
            }, 100);

            if (Math.abs(state.accumulatedDelta) > TRACKPAD_THRESHOLD) {
               state.lastTriggerTime = now;

               const idx = currentIndexRef.current;
               animateToIndex(state.accumulatedDelta > 0 ? idx + 1 : idx - 1);

               state.accumulatedDelta = 0;
               state.eventCount = 0;
            }
         }
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
         container.removeEventListener("wheel", handleWheel);
         if (decayTimeout) clearTimeout(decayTimeout);
      };
   }, [animateToIndex]);

   // Handle drag end - snap to nearest card with velocity consideration
   const handleDragEnd = useCallback(
      (
         _event: MouseEvent | TouchEvent | PointerEvent,
         info: { velocity: { x: number } },
      ) => {
         setIsDragging(false);

         const currentX = x.get();
         const cardStep = cardWidth + CARD_GAP;
         const centerOffset = (containerWidth - cardWidth) / 2;

         // Calculate base index from position
         const rawIndex = (centerOffset - currentX) / cardStep;

         // Check velocity for swipe gesture (more sensitive on touch)
         const velocity = info.velocity.x;
         let targetIndex: number;

         if (Math.abs(velocity) > SWIPE_VELOCITY_THRESHOLD) {
            // Fast swipe - move in swipe direction
            targetIndex =
               velocity > 0
                  ? Math.floor(rawIndex) // swipe right = previous
                  : Math.ceil(rawIndex); // swipe left = next
         } else {
            // Slow drag - check distance threshold
            const currentIdx = currentIndexRef.current;
            const dragDistance = currentX - getTargetX(currentIdx);
            const threshold = cardWidth * SWIPE_DISTANCE_THRESHOLD;

            if (dragDistance > threshold) {
               targetIndex = currentIdx - 1;
            } else if (dragDistance < -threshold) {
               targetIndex = currentIdx + 1;
            } else {
               targetIndex = currentIdx;
            }
         }

         // Clamp to valid range
         const clampedIndex = Math.max(
            0,
            Math.min(totalCards - 1, targetIndex),
         );

         setCurrentIndex(clampedIndex);
         animate(x, getTargetX(clampedIndex), {
            type: "spring",
            stiffness: 300,
            damping: 30,
         });
      },
      [cardWidth, containerWidth, totalCards, getTargetX, x],
   );

   // Derive active index from x position for visual feedback
   const activeIndex = useTransform(x, (latest) => {
      if (cardWidth === 0 || containerWidth === 0) return currentIndex;
      const centerOffset = (containerWidth - cardWidth) / 2;
      const cardStep = cardWidth + CARD_GAP;
      const rawIndex = (centerOffset - latest) / cardStep;
      return Math.round(Math.max(0, Math.min(totalCards - 1, rawIndex)));
   });

   const [visualActiveIndex, setVisualActiveIndex] = useState(0);
   useEffect(() => {
      return activeIndex.on("change", (v) => setVisualActiveIndex(v));
   }, [activeIndex]);

   // Notify parent of index change
   useEffect(() => {
      const card = CARDS_DATA[visualActiveIndex];
      const imageSrc = card?.image?.src;
      onIndexChange?.(visualActiveIndex, imageSrc);
   }, [visualActiveIndex, onIndexChange]);

   const isLoading = cardWidth === 0 || containerWidth === 0;

   if (isLoading) {
      return (
         <div className="carousel carousel--loading" ref={containerRef}>
            <div className="carousel__skeleton-track">
               <div className="carousel__skeleton-card">
                  <div className="carousel__skeleton-badge" />
                  <div className="carousel__skeleton-tag" />
                  <div className="carousel__skeleton-content">
                     <div className="carousel__skeleton-line carousel__skeleton-line--short" />
                     <div className="carousel__skeleton-line carousel__skeleton-line--medium" />
                     <div className="carousel__skeleton-line carousel__skeleton-line--long" />
                  </div>
               </div>
               <div className="carousel__skeleton-card carousel__skeleton-card--hide-phone">
                  <div className="carousel__skeleton-badge" />
                  <div className="carousel__skeleton-tag" />
                  <div className="carousel__skeleton-content">
                     <div className="carousel__skeleton-line carousel__skeleton-line--short" />
                     <div className="carousel__skeleton-line carousel__skeleton-line--medium" />
                     <div className="carousel__skeleton-line carousel__skeleton-line--long" />
                  </div>
               </div>
               <div className="carousel__skeleton-card carousel__skeleton-card--hide-mobile">
                  <div className="carousel__skeleton-badge" />
                  <div className="carousel__skeleton-tag" />
                  <div className="carousel__skeleton-content">
                     <div className="carousel__skeleton-line carousel__skeleton-line--short" />
                     <div className="carousel__skeleton-line carousel__skeleton-line--medium" />
                     <div className="carousel__skeleton-line carousel__skeleton-line--long" />
                  </div>
               </div>
               <div className="carousel__skeleton-card carousel__skeleton-card--hide-tablet">
                  <div className="carousel__skeleton-badge" />
                  <div className="carousel__skeleton-tag" />
                  <div className="carousel__skeleton-content">
                     <div className="carousel__skeleton-line carousel__skeleton-line--short" />
                     <div className="carousel__skeleton-line carousel__skeleton-line--medium" />
                     <div className="carousel__skeleton-line carousel__skeleton-line--long" />
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="carousel" ref={containerRef}>
         <motion.div
            className={`carousel__track ${isDragging ? "carousel__track--dragging" : ""}`}
            style={{ x }}
            drag="x"
            dragConstraints={{
               left: getTargetX(totalCards - 1),
               right: getTargetX(0),
            }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
         >
            {CARDS_DATA.map((card, index) => (
               <div
                  key={card.id}
                  style={{ width: cardWidth, flexShrink: 0, height: "100%" }}
               >
                  <CarouselCard
                     {...card}
                     isActive={index === visualActiveIndex}
                  />
               </div>
            ))}
         </motion.div>
      </div>
   );
};

export default Carousel;
