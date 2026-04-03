"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/nav-links";
import { useActiveSection } from "@/lib/use-active-section";
import s from "./NavBurger.module.scss";

interface NavBurgerProps {
   dropdownDir?: "up" | "down";
   className?: string;
}

function scrollTo(href: string) {
   document
      .getElementById(href.slice(1))
      ?.scrollIntoView({ behavior: "smooth" });
}

export default function NavBurger({
   dropdownDir = "down",
   className,
}: NavBurgerProps) {
   const [open, setOpen] = useState(false);
   const ref = useRef<HTMLDivElement>(null);
   const btnRef = useRef<HTMLButtonElement>(null);
   const dropdownRef = useRef<HTMLDivElement>(null);
   const active = useActiveSection();

   useEffect(() => {
      if (!open) return;
      const handleClick = (e: MouseEvent) => {
         const target = e.target as Node;
         if (
            ref.current?.contains(target) ||
            dropdownRef.current?.contains(target)
         )
            return;
         setOpen(false);
      };
      const handleScroll = () => setOpen(false);
      document.addEventListener("mousedown", handleClick);
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
         document.removeEventListener("mousedown", handleClick);
         window.removeEventListener("scroll", handleScroll);
      };
   }, [open]);

   useEffect(() => {
      if (!open || !dropdownRef.current) return;
      const dir = dropdownDir === "up" ? 1 : -1;
      const links = dropdownRef.current.querySelectorAll(`.${s.link}`);

      gsap.fromTo(
         dropdownRef.current,
         { opacity: 0, scale: 0.95, y: dir * 8 },
         { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "back.out(1.7)" },
      );

      gsap.fromTo(
         links,
         { y: dir * 12, opacity: 0 },
         {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.04,
            ease: "back.out(1.7)",
            delay: 0.04,
         },
      );
   }, [open, dropdownDir]);

   return (
      <div className={`${s.wrap} ${className ?? ""}`} ref={ref}>
         <button
            ref={btnRef}
            type="button"
            className={`${s.burger} ${open ? s.open : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
         >
            <span />
            <span />
            <span />
         </button>
         {open && (
            <div
               ref={dropdownRef}
               className={`${s.dropdown} ${dropdownDir === "up" ? s.up : s.down}`}
            >
               {NAV_LINKS.map(({ href, label }) => (
                  <a
                     key={href}
                     href={href}
                     className={`${s.link} ${active === href ? s.active : ""}`}
                     onClick={(e) => {
                        e.preventDefault();
                        scrollTo(href);
                        setOpen(false);
                     }}
                  >
                     {label}
                  </a>
               ))}
            </div>
         )}
      </div>
   );
}
