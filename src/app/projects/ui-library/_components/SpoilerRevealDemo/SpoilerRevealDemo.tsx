import Image from "next/image";
import SpoilerReveal from "../SpoilerReveal/SpoilerReveal";
import styles from "./SpoilerRevealDemo.module.scss";

const SpoilerRevealDemo = () => {
   return (
      <div className={styles.spoilerDemo}>
         <div className={styles.spoilerContent}>
            <div className={styles.spoilerTextCol}>
               <h3 className={styles.spoilerHeading}>
                  The art of{" "}
                  <SpoilerReveal gap={4}>
                     <span className={styles.spoilerHeadingInner}>
                        hidden beauty
                     </span>
                  </SpoilerReveal>
               </h3>
               <div className={styles.spoilerParagraph}>
                  Every surface tells a story.{" "}
                  <SpoilerReveal gap={3}>
                     <span className={styles.spoilerInline}>
                        Light bends around her face
                     </span>
                  </SpoilerReveal>{" "}
                  revealing textures that only exist in motion.{" "}
                  <SpoilerReveal gap={3}>
                     <span className={styles.spoilerInline}>
                        The golden hour never lasts.
                     </span>
                  </SpoilerReveal>
               </div>
               <div className={styles.spoilerParagraph}>
                  She runs across the ridge,{" "}
                  <SpoilerReveal gap={3}>
                     <span className={styles.spoilerInline}>
                        chasing the last light
                     </span>
                  </SpoilerReveal>{" "}
                  before the sky turns cold.
               </div>
            </div>
            <div className={styles.spoilerImages}>
               <SpoilerReveal gap={3} block className={styles.spoilerImgWrap}>
                  <Image
                     src="/SpoilerReveal_img/img_1.png"
                     alt=""
                     width={280}
                     height={280}
                     className={styles.spoilerImgInner}
                  />
               </SpoilerReveal>
               <div className={styles.spoilerImgWrap}>
                  <Image
                     src="/SpoilerReveal_img/img.png"
                     alt=""
                     width={280}
                     height={280}
                     loading="eager"
                     className={styles.spoilerImgInner}
                     style={{ width: "auto" }}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default SpoilerRevealDemo;
