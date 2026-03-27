"use client";

import "./Footer.scss";
import Link from "next/dist/client/link";
import ParticlesCanvas from "./ParticlesCanvas";

const Footer = () => {
   return (
      <footer className="footer">
         <ParticlesCanvas />
         <div className="footer__content">
            <span className="footer__badge">
               EXPLORE MORE ARTICLES LIKE THIS
            </span>

            <h2 className="footer__title">
               SUBSCRIBE TO <span className="footer__thin">THE FINANCE</span>
               <br />
               <span className="footer__thin">REDEFINED</span> NEWSLETTER
            </h2>

            <p className="footer__description">
               A WEEKLY SUMMARY OF THE MOST IMPACTFUL DEFI
               <br />
               STORIES, INSIGHTS AND EDUCATION DEVELOPMENTS,
               <br />
               DELIVERED EVERY FRIDAY.
            </p>

            <div className="footer__form-wrapper">
               <form
                  className="footer__form"
                  onSubmit={(e) => e.preventDefault()}
               >
                  <input
                     type="email"
                     placeholder="YOUR E-MAIL"
                     className="footer__input"
                  />
                  <button type="submit" className="footer__button">
                     SUBSCRIBE
                  </button>
               </form>

               <p className="footer__terms">
                  BY SUBSCRIBING, YOU AGREE TO OUR{" "}
                  <Link href="#">TERMS OF SERVICES</Link> AND{" "}
                  <Link href="#">PRIVACY POLICY</Link>
               </p>
            </div>

            <p className="footer__disclaimer">
               Design found online, non-commercial use only. Original author
               unknown — willing to credit upon request.
            </p>
         </div>
      </footer>
   );
};

export default Footer;
