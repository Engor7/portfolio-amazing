import Image from "next/image";
import styles from "./CardStack.module.scss";

const CardStack = () => {
   return (
      <div className={styles.stack}>
         {/* Left — image card */}
         <div className={`${styles.card} ${styles.cardLeft}`}>
            <span className={styles.iconBadge}>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  aria-hidden="true"
               >
                  <title>Flower</title>
                  <path
                     fill="currentColor"
                     fillRule="evenodd"
                     d="M7 .5a3.22 3.22 0 0 0-3.174 2.627a3.3 3.3 0 0 0-.6-.056C1.45 3.071 0 4.496 0 6.267a3.19 3.19 0 0 0 1.607 2.766c-.17.39-.265.82-.265 1.27c0 1.773 1.45 3.197 3.225 3.197c.97 0 1.841-.424 2.433-1.097A3.23 3.23 0 0 0 9.433 13.5c1.774 0 3.225-1.424 3.225-3.196c0-.452-.095-.882-.265-1.271A3.19 3.19 0 0 0 14 6.267c0-1.771-1.45-3.196-3.225-3.196q-.308.001-.6.056A3.22 3.22 0 0 0 7 .5M5.025 3.696c0-1.068.877-1.946 1.975-1.946s1.975.878 1.975 1.946q0 .11-.012.215a.625.625 0 0 0 .905.626c.271-.137.578-.216.907-.216c1.097 0 1.975.878 1.975 1.946a1.95 1.95 0 0 1-1.426 1.87a.625.625 0 0 0-.322.985c.255.328.406.737.406 1.182c0 1.068-.878 1.946-1.975 1.946a1.975 1.975 0 0 1-1.85-1.26a.625.625 0 0 0-1.167 0a1.98 1.98 0 0 1-1.849 1.26c-1.097 0-1.975-.878-1.975-1.946c0-.445.15-.854.406-1.182a.625.625 0 0 0-.322-.985a1.95 1.95 0 0 1-1.426-1.87c0-1.068.878-1.946 1.975-1.946c.328 0 .636.079.907.216a.625.625 0 0 0 .905-.625a2 2 0 0 1-.012-.216m.533 2.108c.37-.368.88-.528 1.442-.528c.563 0 1.073.16 1.442.528c.37.369.53.879.53 1.44c0 .563-.16 1.073-.53 1.442c-.37.368-.88.528-1.442.528c-.563 0-1.073-.16-1.442-.528c-.37-.37-.53-.879-.53-1.441s.16-1.072.53-1.44"
                     clipRule="evenodd"
                  />
               </svg>
            </span>
            <Image
               src="/card-stack/card_1.png"
               alt=""
               fill
               sizes="300px"
               className={styles.cardImage}
            />
         </div>

         {/* Center — article card */}
         <div className={`${styles.card} ${styles.cardCenter}`}>
            <span className={styles.iconBadge}>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
               >
                  <title>At sign</title>
                  <path
                     fill="currentColor"
                     d="M20 12a8 8 0 1 0-3.562 6.657l1.11 1.664A9.95 9.95 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10v1.5a3.5 3.5 0 0 1-6.396 1.966A5 5 0 1 1 15 8h2v5.5a1.5 1.5 0 0 0 3 0zm-8-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
                  />
               </svg>
            </span>
            <h3 className={styles.title}>
               Creative Motion & Interactive Web Experiences
            </h3>
            <span className={styles.readMore}>Read More</span>
         </div>

         {/* Right — link card */}
         <div className={`${styles.card} ${styles.cardRight}`}>
            <span className={styles.iconBadge}>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
               >
                  <title>Arrow</title>
                  <path
                     fill="currentColor"
                     d="M6 7c0 .55.45 1 1 1h7.59l-8.88 8.88a.996.996 0 1 0 1.41 1.41L16 9.41V17c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1"
                  />
               </svg>
            </span>
            <Image
               src="/card-stack/card_3.png"
               alt=""
               fill
               sizes="300px"
               className={styles.cardImage}
            />
            <div className={styles.overlay} />
            <div className={styles.linkContent}>
               <h4>Interactive Animations</h4>
               <span>Visit Site</span>
            </div>
         </div>
      </div>
   );
};

export default CardStack;
