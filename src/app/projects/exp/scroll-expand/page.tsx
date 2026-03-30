"use client";

import gsap from "gsap";
import Lenis from "lenis";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "./projects";

const TOTAL_ROWS = 10;

function getPerRow() {
   return window.innerWidth < 768 ? 3 : 9;
}

type ProjectItem = (typeof PROJECTS)[number] & { idx: number };

function buildRows(perRow: number) {
   const rows: ProjectItem[][] = [];
   let idx = 0;
   for (let r = 0; r < TOTAL_ROWS; r++) {
      const row: ProjectItem[] = [];
      for (let c = 0; c < perRow; c++) {
         row.push({ ...PROJECTS[idx % PROJECTS.length], idx });
         idx++;
      }
      rows.push(row);
   }
   return rows;
}

export default function ScrollExpandPage() {
   const sectionRef = useRef<HTMLElement>(null);
   const rowsRef = useRef<HTMLDivElement[]>([]);
   const [rowsData, setRowsData] = useState(() => buildRows(9));

   useEffect(() => {
      setRowsData(buildRows(getPerRow()));
   }, []);

   useEffect(() => {
      window.scrollTo(0, 0);
      const lenis = new Lenis();
      const tickerCallback = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      const section = sectionRef.current;
      if (!section) return;

      const rows = rowsRef.current.filter(Boolean);
      if (rows.length === 0 || rows.length !== rowsData.length) return;

      const isMobile = window.innerWidth < 768;
      let rowStartWidth = isMobile ? 105 : 125;
      let rowEndWidth = isMobile ? 350 : 500;

      const firstRow = rows[0];
      firstRow.style.width = `${rowEndWidth}%`;
      const expandedRowHeight = firstRow.offsetHeight;
      firstRow.style.width = "";

      const sectionGap = parseFloat(getComputedStyle(section).gap) || 0;
      const sectionPadding =
         parseFloat(getComputedStyle(section).paddingTop) || 0;

      const expandedSectionHeight =
         expandedRowHeight * rows.length +
         sectionGap * (rows.length - 1) +
         sectionPadding * 2;

      section.style.height = `${expandedSectionHeight}px`;

      function onScrollUpdate() {
         const scrollY = window.scrollY;
         const viewportHeight = window.innerHeight;

         rows.forEach((row) => {
            const rect = row.getBoundingClientRect();
            const rowTop = rect.top + scrollY;
            const rowBottom = rowTop + rect.height;

            const scrollStart = rowTop - viewportHeight;
            let progress = (scrollY - scrollStart) / (rowBottom - scrollStart);
            progress = Math.max(0, Math.min(1, progress));

            const width =
               rowStartWidth + (rowEndWidth - rowStartWidth) * progress;
            row.style.width = `${width}%`;
         });
      }

      gsap.ticker.add(onScrollUpdate);

      let prevPerRow = getPerRow();

      const handleResize = () => {
         const newPerRow = getPerRow();
         if (newPerRow !== prevPerRow) {
            prevPerRow = newPerRow;
            setRowsData(buildRows(newPerRow));
            return;
         }

         const mobile = window.innerWidth < 768;
         rowStartWidth = mobile ? 105 : 125;
         rowEndWidth = mobile ? 350 : 500;

         firstRow.style.width = `${rowEndWidth}%`;
         const newRowHeight = firstRow.offsetHeight;
         firstRow.style.width = "";

         const newSectionHeight =
            newRowHeight * rows.length +
            sectionGap * (rows.length - 1) +
            sectionPadding * 2;

         section.style.height = `${newSectionHeight}px`;
      };

      window.addEventListener("resize", handleResize);

      return () => {
         gsap.ticker.remove(onScrollUpdate);
         gsap.ticker.remove(tickerCallback);
         window.removeEventListener("resize", handleResize);
         lenis.destroy();
      };
   }, [rowsData]);

   return (
      <>
         <section className="intro">
            <h1>Selected Works</h1>
            <p>
               A curated collection of projects exploring design, motion, and
               digital craft.
            </p>
         </section>

         <section ref={sectionRef} className="projects">
            {rowsData.map((rowProjects, rowIndex) => (
               <div
                  key={rowProjects[0].idx}
                  className="projects-row"
                  ref={(el) => {
                     if (el) rowsRef.current[rowIndex] = el;
                  }}
               >
                  {rowProjects.map((project) => (
                     <div key={project.idx} className="project">
                        <div className="project-img">
                           <Image src={project.img} alt={project.name} fill />
                        </div>
                        <div className="project-info">
                           <p>{project.name}</p>
                           <p>{project.year}</p>
                        </div>
                     </div>
                  ))}
               </div>
            ))}
         </section>

         <section className="outro">
            <p>That&apos;s all for now — more coming soon.</p>
         </section>
      </>
   );
}
