"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import avatarImg from "../images/avatar.png";
import {
   CameraIcon,
   ChevronDownIcon,
   LogoIcon,
   MoreIcon,
   StackIcon,
} from "./icons";

const Header = () => {
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const dropdownRef = useRef<HTMLLIElement>(null);
   const mobileMenuRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsDropdownOpen(false);
         }
         if (
            mobileMenuRef.current &&
            !mobileMenuRef.current.contains(event.target as Node)
         ) {
            setIsMobileMenuOpen(false);
         }
      };

      if (isDropdownOpen || isMobileMenuOpen) {
         document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [isDropdownOpen, isMobileMenuOpen]);

   const navItems = [
      { label: "Explore", href: "#", active: false },
      { label: "Streams", href: "#", active: true },
      { label: "Creators", href: "#", active: false },
      { label: "Events", href: "#", active: false },
   ];

   const dropdownItems = [
      { label: "Analytics", href: "#" },
      { label: "Studio", href: "#" },
      { label: "Developers", href: "#" },
      { label: "Support", href: "#" },
   ];

   return (
      <header className="view-scroll__header">
         <div className="view-scroll__header-logo">
            <span>Vibe</span>
            <LogoIcon />
         </div>

         <ul className="view-scroll__header-nav">
            {navItems.map((item) => (
               <li
                  key={item.label}
                  className={
                     item.active ? "view-scroll__header-nav--active" : ""
                  }
               >
                  <a href={item.href}>{item.label}</a>
               </li>
            ))}
            <li className="view-scroll__header-dropdown" ref={dropdownRef}>
               <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  type="button"
                  className={
                     isDropdownOpen
                        ? "view-scroll__header-dropdown-btn--open"
                        : ""
                  }
               >
                  More <ChevronDownIcon />
               </button>
               <ul
                  className={`view-scroll__header-dropdown-menu ${isDropdownOpen ? "view-scroll__header-dropdown-menu--open" : ""}`}
               >
                  {dropdownItems.map((item) => (
                     <li key={item.label}>
                        <a href={item.href}>{item.label}</a>
                     </li>
                  ))}
               </ul>
            </li>
         </ul>

         <div className="view-scroll__header-actions">
            <button className="view-scroll__header-btn" type="button">
               Go Live
            </button>
            <button
               className="view-scroll__header-icon view-scroll__header-icon--no-border"
               type="button"
               aria-label="Camera"
            >
               <CameraIcon />
            </button>
            <button
               className="view-scroll__header-icon view-scroll__header-icon--no-border"
               type="button"
               aria-label="Stack"
            >
               <StackIcon />
            </button>
            <button
               className="view-scroll__header-icon view-scroll__header-icon--no-border view-scroll__header-icon--square"
               type="button"
               aria-label="More options"
            >
               <MoreIcon />
            </button>
            <Image
               className="view-scroll__header-avatar"
               src={avatarImg}
               alt="Avatar"
            />
            <div
               className="view-scroll__header-mobile-wrapper"
               ref={mobileMenuRef}
            >
               <button
                  className={`view-scroll__header-mobile-menu ${isMobileMenuOpen ? "view-scroll__header-mobile-menu--open" : ""}`}
                  type="button"
                  aria-label="Menu"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               >
                  <span />
                  <span />
                  <span />
               </button>
               <nav
                  className={`view-scroll__header-mobile-nav ${isMobileMenuOpen ? "view-scroll__header-mobile-nav--open" : ""}`}
               >
                  {navItems.map((item) => (
                     <a
                        key={item.label}
                        href={item.href}
                        className={item.active ? "active" : ""}
                     >
                        {item.label}
                     </a>
                  ))}
                  {dropdownItems.map((item) => (
                     <a key={item.label} href={item.href}>
                        {item.label}
                     </a>
                  ))}
               </nav>
            </div>
         </div>
      </header>
   );
};

export default Header;
