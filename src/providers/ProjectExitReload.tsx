"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ProjectExitReload() {
   const pathname = usePathname();
   const prevPathRef = useRef(pathname);

   useEffect(() => {
      const prev = prevPathRef.current;
      prevPathRef.current = pathname;

      if (prev.startsWith("/projects/") && !pathname.startsWith("/projects/")) {
         window.location.reload();
      }
   }, [pathname]);

   return null;
}
