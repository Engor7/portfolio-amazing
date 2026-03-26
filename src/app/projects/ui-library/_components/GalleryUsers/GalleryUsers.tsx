"use client";

import { useState } from "react";
import styles from "./GalleryUsers.module.scss";

const users = [
   { id: 1, name: "@neo", img: "IMG_5010.jpg" },
   { id: 2, name: "@siya", img: "IMG_4973.jpg" },
   { id: 3, name: "@ialy", img: "IMG_5021.jpg" },
   { id: 4, name: "@tyoni", img: "IMG_5020.jpg" },
   { id: 5, name: "@bian", img: "IMG_4974.jpg" },
   { id: 6, name: "@sayli", img: "IMG_5022.jpg" },
];

const GalleryUsers = () => {
   const [activeUserId, setActiveUserId] = useState(1);

   const nextUser = () => {
      const currentIndex = users.findIndex((u) => u.id === activeUserId);
      const nextIndex = (currentIndex + 1) % users.length;
      setActiveUserId(users[nextIndex].id);
   };

   const prevUser = () => {
      const currentIndex = users.findIndex((u) => u.id === activeUserId);
      const prevIndex = (currentIndex - 1 + users.length) % users.length;
      setActiveUserId(users[prevIndex].id);
   };

   const activeUser = users.find((u) => u.id === activeUserId) ?? users[0];

   return (
      <div className={styles.gallery}>
         {users.map((user) => (
            <div
               key={user.id}
               className={`${styles.user} ${user.id === activeUserId ? styles.active : ""}`}
            >
               {/* biome-ignore lint/performance/noImgElement: CSS targets bare img for animations */}
               <img src={`/avatars_users/${user.img}`} alt={user.name} />
            </div>
         ))}
         <div className={styles.userData}>
            <span>{activeUser.name}</span>
            <div className={styles.buttons}>
               <button
                  type="button"
                  className={styles.button}
                  onClick={prevUser}
                  aria-label="Previous user"
               >
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                     <path
                        d="M15 8H1M1 8L8 15M1 8L8 1"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
                  </svg>
               </button>
               <button
                  type="button"
                  className={styles.button}
                  onClick={nextUser}
                  aria-label="Next user"
               >
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                     <path
                        d="M1 8H15M15 8L8 1M15 8L8 15"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
                  </svg>
               </button>
            </div>
         </div>
      </div>
   );
};

export default GalleryUsers;
