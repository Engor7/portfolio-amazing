"use client";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";

import { useEffect, useRef } from "react";
import slides from "./slides";

export default function ChromeAbyssPage() {
   const sliderRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      gsap.registerPlugin(SplitText);

      const slider = sliderRef.current as HTMLDivElement;
      if (!slider) return;

      const totalSlides = slides.length;
      let currentSlide = 1;
      let isAnimating = false;
      let scrollAllowed = true;
      let lastScrollTime = 0;

      function createSlide(slideIndex: number) {
         const slideData = slides[slideIndex - 1];

         const slide = document.createElement("div");
         slide.className = "slide";

         const slideImg = document.createElement("div");
         slideImg.className = "slide-img";
         const img = document.createElement("img");
         img.src = slideData.slideImg;
         img.alt = "";
         slideImg.appendChild(img);

         const slideHeader = document.createElement("div");
         slideHeader.className = "slide-header";

         const slideTitle = document.createElement("div");
         slideTitle.className = "slide-title";
         const h1 = document.createElement("h1");
         h1.textContent = slideData.slideTitle;
         slideTitle.appendChild(h1);

         const slideDescription = document.createElement("div");
         slideDescription.className = "slide-description";
         const p = document.createElement("p");
         p.textContent = slideData.slideDescription;
         slideDescription.appendChild(p);

         const slideLink = document.createElement("div");
         slideLink.className = "slide-link";
         const a = document.createElement("a");
         a.href = slideData.slideUrl;
         a.textContent = "Access Node";
         slideLink.appendChild(a);

         slideHeader.appendChild(slideTitle);
         slideHeader.appendChild(slideDescription);
         slideHeader.appendChild(slideLink);

         const slideInfo = document.createElement("div");
         slideInfo.className = "slide-info";

         const slideTags = document.createElement("div");
         slideTags.className = "slide-tags";
         const tagsLabel = document.createElement("p");
         tagsLabel.textContent = "Sys.Tags";
         slideTags.appendChild(tagsLabel);

         slideData.slideTags.forEach((tag) => {
            const tagP = document.createElement("p");
            tagP.textContent = tag;
            slideTags.appendChild(tagP);
         });

         const slideIndexWrapper = document.createElement("div");
         slideIndexWrapper.className = "slide-index-wrapper";
         const slideIndexCopy = document.createElement("p");
         slideIndexCopy.textContent = slideIndex.toString().padStart(2, "0");
         const slideIndexSeparator = document.createElement("p");
         slideIndexSeparator.textContent = "/";
         const slidesTotalCount = document.createElement("p");
         slidesTotalCount.textContent = totalSlides.toString().padStart(2, "0");

         slideIndexWrapper.appendChild(slideIndexCopy);
         slideIndexWrapper.appendChild(slideIndexSeparator);
         slideIndexWrapper.appendChild(slidesTotalCount);

         slideInfo.appendChild(slideTags);
         slideInfo.appendChild(slideIndexWrapper);

         slide.appendChild(slideImg);
         slide.appendChild(slideHeader);
         slide.appendChild(slideInfo);

         return slide;
      }

      function splitTextElements(slide: HTMLElement) {
         const slideHeader = slide.querySelector(".slide-title h1");
         if (slideHeader) {
            SplitText.create(slideHeader, {
               type: "words",
               wordsClass: "word",
               mask: "words",
            });
         }

         const slideContent = slide.querySelectorAll("p, a");
         slideContent.forEach((element) => {
            SplitText.create(element, {
               type: "lines",
               linesClass: "line",
               mask: "lines",
               reduceWhiteSpace: false,
            });
         });
      }

      function animateSlide(direction: "down" | "up") {
         if (isAnimating || !scrollAllowed) return;

         isAnimating = true;
         scrollAllowed = false;

         const currentSlideElement = slider.querySelector(".slide");

         if (direction === "down") {
            currentSlide = currentSlide === totalSlides ? 1 : currentSlide + 1;
         } else {
            currentSlide = currentSlide === 1 ? totalSlides : currentSlide - 1;
         }

         const exitY = direction === "down" ? "-200vh" : "200vh";
         const entryY = direction === "down" ? "100vh" : "-100vh";
         const entryClipPath =
            direction === "down"
               ? "polygon(20% 20%, 80% 20%, 80% 100%, 20% 100%)"
               : "polygon(20% 0%, 80% 0%, 80% 80%, 20% 80%)";

         gsap.to(currentSlideElement, {
            scale: 0.25,
            opacity: 0,
            rotation: 30,
            y: exitY,
            duration: 2,
            ease: "power4.inOut",
            force3D: true,
            onComplete: () => {
               currentSlideElement?.remove();
            },
         });

         setTimeout(() => {
            const newSlide = createSlide(currentSlide);

            gsap.set(newSlide, {
               y: entryY,
               clipPath: entryClipPath,
               force3D: true,
            });

            slider.appendChild(newSlide);
            splitTextElements(newSlide);

            const words = newSlide.querySelectorAll(".word");
            const lines = newSlide.querySelectorAll(".line");

            gsap.set([...words, ...lines], {
               y: "100%",
               force3D: true,
            });

            gsap.to(newSlide, {
               y: 0,
               clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
               duration: 1.5,
               ease: "power4.out",
               force3D: true,
               onStart: () => {
                  const tl = gsap.timeline();

                  tl.to(
                     newSlide.querySelectorAll(".slide-title .word"),
                     {
                        y: "0%",
                        duration: 1,
                        ease: "power4.out",
                        stagger: 0.1,
                        force3D: true,
                     },
                     0.75,
                  );

                  tl.to(
                     newSlide.querySelectorAll(".slide-tags .line"),
                     {
                        y: "0%",
                        duration: 1,
                        ease: "power4.out",
                        stagger: 0.1,
                     },
                     "-=0.75",
                  );

                  tl.to(
                     newSlide.querySelectorAll(".slide-index-wrapper .line"),
                     {
                        y: "0%",
                        duration: 1,
                        ease: "power4.out",
                        stagger: 0.1,
                     },
                     "<",
                  );

                  tl.to(
                     newSlide.querySelectorAll(".slide-description .line"),
                     {
                        y: "0%",
                        duration: 1,
                        ease: "power4.out",
                        stagger: 0.1,
                     },
                     "<",
                  );

                  tl.to(
                     newSlide.querySelectorAll(".slide-link .line"),
                     {
                        y: "0%",
                        duration: 1,
                        ease: "power4.out",
                     },
                     "-=1",
                  );
               },
               onComplete: () => {
                  isAnimating = false;
                  setTimeout(() => {
                     scrollAllowed = true;
                     lastScrollTime = Date.now();
                  }, 100);
               },
            });
         }, 750);
      }

      function handleScroll(direction: "down" | "up") {
         const now = Date.now();
         if (isAnimating || !scrollAllowed) return;
         if (now - lastScrollTime < 1000) return;
         lastScrollTime = now;
         animateSlide(direction);
      }

      const onWheel = (e: WheelEvent) => {
         e.preventDefault();
         const direction = e.deltaY > 0 ? "down" : "up";
         handleScroll(direction);
      };

      let touchStartY = 0;
      let isTouchActive = false;

      const onTouchStart = (e: TouchEvent) => {
         touchStartY = e.touches[0].clientY;
         isTouchActive = true;
      };

      const onTouchMove = (e: TouchEvent) => {
         e.preventDefault();
         if (!isTouchActive || isAnimating || !scrollAllowed) return;

         const touchCurrentY = e.touches[0].clientY;
         const difference = touchStartY - touchCurrentY;

         if (Math.abs(difference) > 50) {
            isTouchActive = false;
            const direction = difference > 0 ? "down" : "up";
            handleScroll(direction);
         }
      };

      const onTouchEnd = () => {
         isTouchActive = false;
      };

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: false });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);

      return () => {
         window.removeEventListener("wheel", onWheel);
         window.removeEventListener("touchstart", onTouchStart);
         window.removeEventListener("touchmove", onTouchMove);
         window.removeEventListener("touchend", onTouchEnd);
      };
   }, []);

   return (
      <div className="slider" ref={sliderRef}>
         <div className="slide">
            <div className="slide-img">
               <Image src="/exp/chrome-abyss/slide-img-1.jpg" alt="" fill />
            </div>

            <div className="slide-header">
               <div className="slide-title">
                  <h1>After Hours</h1>
               </div>
               <div className="slide-description">
                  <p>
                     It's 2am and he's still at it. Nobody asked him to stay
                     late — he just can't leave a thing unfinished.
                  </p>
               </div>
               <div className="slide-link">
                  <a href="/">Access Node</a>
               </div>
            </div>

            <div className="slide-info">
               <div className="slide-tags">
                  <p>Sys.Tags</p>
                  <p>Focus</p>
                  <p>Late Night</p>
                  <p>Work</p>
                  <p>Obsession</p>
               </div>
               <div className="slide-index-wrapper">
                  <p id="slide-index">01</p>
                  <p>/</p>
                  <p id="total-slide-count">04</p>
               </div>
            </div>
         </div>
      </div>
   );
}
