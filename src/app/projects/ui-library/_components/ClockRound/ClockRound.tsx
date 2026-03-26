"use client";

import { useEffect, useState } from "react";
import styles from "./ClockRound.module.scss";

const ClockRound = () => {
   const [ready, setReady] = useState(false);
   const [rotateHour, setRotateHour] = useState(0);
   const [rotateMinute, setRotateMinute] = useState(0);
   const [rotateSecond, setRotateSecond] = useState(0);

   useEffect(() => {
      const tick = () => {
         const date = new Date();
         const hours = ((date.getHours() + 11) % 12) + 1;
         setRotateHour(hours * 30);
         setRotateMinute(date.getMinutes() * 6);
         setRotateSecond(date.getSeconds() * 6);
      };

      tick();
      setReady(true);
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
   }, []);

   if (!ready) return null;

   return (
      <div className={styles.clock}>
         <div className={styles.clock__round}>
            <div
               className={styles.clock__hour}
               style={{ transform: `rotate(${rotateHour}deg)` }}
            />
            <div
               className={styles.clock__minute}
               style={{ transform: `rotate(${rotateMinute}deg)` }}
            />
            <div
               className={styles.clock__second}
               style={{ transform: `rotate(${rotateSecond}deg)` }}
            />
            <div className={styles.clock__indicatorWrapper}>
               {Array.from({ length: 60 }, (_, i) => (
                  <div
                     // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length indicators with no stable id
                     key={i}
                     className={styles.clock__indicator}
                     style={{ transform: `rotateZ(${6 * (i + 1)}deg)` }}
                  />
               ))}
            </div>
         </div>
      </div>
   );
};

export default ClockRound;
