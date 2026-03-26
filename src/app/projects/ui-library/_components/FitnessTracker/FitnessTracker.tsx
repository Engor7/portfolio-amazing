"use client";

import { useState } from "react";
import styles from "./FitnessTracker.module.scss";

const LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const INITIAL_COMPLETED = [true, true, true, true, false, false, false];
const GOAL = 10000;

function calcStreak(completed: boolean[]): number {
   let streak = 0;
   for (const c of completed) {
      if (c) streak++;
      else break;
   }
   return streak;
}

const FitnessTracker = () => {
   const [completed, setCompleted] = useState(INITIAL_COMPLETED);
   const steps = 6825;

   const percent = Math.round((steps / GOAL) * 100);
   const streak = calcStreak(completed);

   const toggleDay = (index: number) => {
      setCompleted((prev) => prev.map((v, i) => (i === index ? !v : v)));
   };

   return (
      <div className={styles.tracker}>
         <div className={styles.header}>
            <svg
               className={styles.fireIcon}
               viewBox="0 0 128 128"
               aria-hidden="true"
            >
               <defs>
                  <radialGradient
                     id="fire-a"
                     cx="68.884"
                     cy="124.296"
                     r="70.587"
                     gradientTransform="matrix(-1 -.00434 -.00713 1.6408 131.986 -79.345)"
                     gradientUnits="userSpaceOnUse"
                  >
                     <stop offset=".314" stopColor="#FF9800" />
                     <stop offset=".662" stopColor="#FF6D00" />
                     <stop offset=".972" stopColor="#F44336" />
                  </radialGradient>
                  <radialGradient
                     id="fire-b"
                     cx="64.921"
                     cy="54.062"
                     r="73.86"
                     gradientTransform="matrix(-.0101 .9999 .7525 .0076 26.154 -11.267)"
                     gradientUnits="userSpaceOnUse"
                  >
                     <stop offset=".214" stopColor="#FFF176" />
                     <stop offset=".328" stopColor="#FFF27D" />
                     <stop offset=".487" stopColor="#FFF48F" />
                     <stop offset=".672" stopColor="#FFF7AD" />
                     <stop offset=".793" stopColor="#FFF9C4" />
                     <stop
                        offset=".822"
                        stopColor="#FFF8BD"
                        stopOpacity=".804"
                     />
                     <stop
                        offset=".863"
                        stopColor="#FFF6AB"
                        stopOpacity=".529"
                     />
                     <stop
                        offset=".91"
                        stopColor="#FFF38D"
                        stopOpacity=".209"
                     />
                     <stop offset=".941" stopColor="#FFF176" stopOpacity="0" />
                  </radialGradient>
               </defs>
               <path
                  fill="url(#fire-a)"
                  d="M35.56 40.73c-.57 6.08-.97 16.84 2.62 21.42c0 0-1.69-11.82 13.46-26.65c6.1-5.97 7.51-14.09 5.38-20.18c-1.21-3.45-3.42-6.3-5.34-8.29c-1.12-1.17-.26-3.1 1.37-3.03c9.86.44 25.84 3.18 32.63 20.22c2.98 7.48 3.2 15.21 1.78 23.07c-.9 5.02-4.1 16.18 3.2 17.55c5.21.98 7.73-3.16 8.86-6.14c.47-1.24 2.1-1.55 2.98-.56c8.8 10.01 9.55 21.8 7.73 31.95c-3.52 19.62-23.39 33.9-43.13 33.9c-24.66 0-44.29-14.11-49.38-39.65c-2.05-10.31-1.01-30.71 14.89-45.11c1.18-1.08 3.11-.12 2.95 1.5"
               />
               <path
                  fill="url(#fire-b)"
                  d="M76.11 77.42c-9.09-11.7-5.02-25.05-2.79-30.37c.3-.7-.5-1.36-1.13-.93c-3.91 2.66-11.92 8.92-15.65 17.73c-5.05 11.91-4.69 17.74-1.7 24.86c1.8 4.29-.29 5.2-1.34 5.36c-1.02.16-1.96-.52-2.71-1.23a16.1 16.1 0 0 1-4.44-7.6c-.16-.62-.97-.79-1.34-.28c-2.8 3.87-4.25 10.08-4.32 14.47C40.47 113 51.68 124 65.24 124c17.09 0 29.54-18.9 19.72-34.7c-2.85-4.6-5.53-7.61-8.85-11.88"
               />
            </svg>
            <div className={styles.streakInfo}>
               <span className={styles.label}>STREAK</span>
               <span className={styles.value}>
                  {streak} {streak === 1 ? "DAY" : "DAYS"}
               </span>
            </div>
            <svg
               className={styles.fitnessIcon}
               viewBox="0 0 24 24"
               fill="currentColor"
               aria-hidden="true"
            >
               <path d="M5.5 8q-.425 0-.712-.288T4.5 7t.288-.712T5.5 6t.713.288T6.5 7t-.288.713T5.5 8M10 22q-1.65 0-2.825-1.175T6 18v-6q0-2.5 1.75-4.25T12 6h1.825q1.725 0 2.95 1.163T18 10.025q0 1.15-.612 2.113T15.724 13.6q-.8.375-1.262 1.113T14 16.325V18q0 1.675-1.162 2.838T10 22M8 6q-.425 0-.712-.288T7 5v-.5q0-.425.288-.712T8 3.5t.713.288T9 4.5V5q0 .425-.288.713T8 6m2 14q.825 0 1.413-.587T12 18v-1.675q0-1.45.763-2.675t2.087-1.85q.525-.25.838-.738T16 10q0-.875-.65-1.437T13.825 8H12q-1.65 0-2.825 1.175T8 12v6q0 .825.588 1.413T10 20m1-15q-.425 0-.712-.288T10 4v-.5q0-.425.288-.712T11 2.5t.713.288T12 3.5V4q0 .425-.288.713T11 5m3 0q-.425 0-.712-.288T13 4V3q0-.425.288-.712T14 2t.713.288T15 3v1q0 .425-.288.713T14 5m3.5 1q-.625 0-1.062-.437T16 4.5v-1q0-.625.438-1.062T17.5 2t1.063.438T19 3.5v1q0 .625-.437 1.063T17.5 6M10 12" />
            </svg>
         </div>

         <div className={styles.week}>
            {LABELS.map((label, i) => (
               <div key={label} className={styles.day}>
                  <button
                     type="button"
                     className={`${styles.circle} ${completed[i] ? styles.completed : ""}`}
                     onClick={() => toggleDay(i)}
                     aria-label={`${label} ${completed[i] ? "completed" : "incomplete"}`}
                  >
                     <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path
                           d="M3.5 8.5L6.5 11.5L12.5 5"
                           stroke="white"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  </button>
                  <span className={styles.dayLabel}>{label}</span>
               </div>
            ))}
         </div>

         <div className={styles.steps}>
            <span className={styles.stepsLabel}>STEPS</span>
            <div className={styles.stepsRow}>
               <span className={styles.stepsValue}>
                  <b>{steps.toLocaleString("en-US")}</b>
                  <span>/</span>
                  <span className={styles.stepsTotal}>
                     {GOAL.toLocaleString("en-US")}
                  </span>
               </span>
               <span className={styles.stepsPercent}>{percent}%</span>
            </div>
            <div className={styles.progressBar}>
               <div
                  className={styles.progressFill}
                  style={{ width: `${percent}%` }}
               />
            </div>
         </div>
      </div>
   );
};

export default FitnessTracker;
