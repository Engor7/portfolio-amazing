"use client";

import { useEffect, useState } from "react";
import { ArrowRightIcon, ClockIcon } from "./icons";

const Footer = () => {
   const [time, setTime] = useState<string>("");

   useEffect(() => {
      const updateTime = () => {
         const now = new Date();
         const nycTime = now.toLocaleTimeString("en-US", {
            timeZone: "America/New_York",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
         });
         setTime(nycTime);
      };

      updateTime();
      const interval = setInterval(updateTime, 1000);

      return () => clearInterval(interval);
   }, []);

   return (
      <footer className="view-scroll__footer">
         <div className="view-scroll__footer-left">
            <span className="view-scroll__footer-left-lang">EN</span>
            <span className="view-scroll__footer-left-divider">|</span>
            <ClockIcon />
            <span>{time} NYC</span>
         </div>
         <div className="view-scroll__footer-right">
            Scroll to explore
            <ArrowRightIcon />
         </div>
      </footer>
   );
};

export default Footer;
