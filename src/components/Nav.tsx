"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getNavLinks } from "@/lib/nav-links";
import { useActiveSection } from "@/lib/use-active-section";
import { useLang } from "@/providers/LangProvider";
import s from "./Nav.module.scss";

interface NavProps {
   className?: string;
   linkClassName?: string;
}

function scrollTo(href: string) {
   document
      .getElementById(href.slice(1))
      ?.scrollIntoView({ behavior: "smooth" });
}

export default function Nav({ className, linkClassName }: NavProps) {
   const active = useActiveSection();
   const { t } = useLang();
   const navLinks = getNavLinks(t.nav);
   const navRef = useRef<HTMLElement>(null);
   const linksRef = useRef<Map<string, HTMLAnchorElement>>(new Map());
   const [pill, setPill] = useState<{ left: number; width: number } | null>(
      null,
   );

   const updatePill = useCallback(() => {
      const el = linksRef.current.get(active);
      const nav = navRef.current;
      if (!el || !nav) return;
      const navRect = nav.getBoundingClientRect();
      const linkRect = el.getBoundingClientRect();
      const borderLeft = parseFloat(getComputedStyle(nav).borderLeftWidth) || 0;
      setPill({
         left: linkRect.left - navRect.left - borderLeft,
         width: linkRect.width,
      });
   }, [active]);

   useEffect(() => {
      updatePill();
   }, [updatePill]);

   useEffect(() => {
      const nav = navRef.current;
      if (!nav) return;
      const ro = new ResizeObserver(updatePill);
      ro.observe(nav);
      return () => ro.disconnect();
   }, [updatePill]);

   return (
      <nav ref={navRef} className={`${s.nav} ${className ?? ""}`}>
         {pill !== null && (
            <span
               className={s.indicator}
               style={{ left: pill.left, width: pill.width }}
            />
         )}
         {navLinks.map(({ href, label }) => (
            <a
               key={href}
               href={href}
               ref={(el) => {
                  if (el) linksRef.current.set(href, el);
                  else linksRef.current.delete(href);
               }}
               className={`${s.navLink} ${linkClassName ?? ""} ${active === href ? s.active : ""}`}
               onClick={(e) => {
                  e.preventDefault();
                  scrollTo(href);
               }}
            >
               {label}
            </a>
         ))}
      </nav>
   );
}
