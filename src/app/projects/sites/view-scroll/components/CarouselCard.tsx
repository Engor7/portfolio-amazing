"use client";

import Image, { type StaticImageData } from "next/image";
import {
   AcademicIcon,
   ArrowRightIcon,
   LocationIcon,
   SpinnersIcon,
} from "./icons";

interface CarouselCardProps {
   id: number;
   type: "live" | "event" | "ad" | "group";
   image?: StaticImageData;
   isActive: boolean;

   // Live type fields
   title?: string;
   author?: string;
   authorRole?: string;
   followers?: string;

   // Event type fields
   eventDate?: string;
   eventTitle?: string;
   eventLocation?: string;

   // Ad type fields
   adText?: string;

   // Group type fields
   groupTag?: string;
   groupCategory?: string;
   groupTitle?: string;
   groupMembers?: number;
   groupImages?: StaticImageData[];
}

const CarouselCard = (props: CarouselCardProps) => {
   const { type, isActive, image } = props;

   const renderContent = () => {
      switch (type) {
         case "live":
            return <LiveCard {...props} />;
         case "event":
            return <EventCard {...props} />;
         case "ad":
            return null;
         case "group":
            return <GroupCard {...props} />;
         default:
            return null;
      }
   };

   const renderFooter = () => {
      switch (type) {
         case "live":
            return (
               <div
                  className={`carousel__card-footer ${isActive ? "carousel__card-footer--visible" : ""}`}
               >
                  <h3 className="carousel__card-footer-title">{props.title}</h3>
                  <p className="carousel__card-footer-author">{props.author}</p>
                  <p className="carousel__card-footer-role">
                     {props.authorRole}
                  </p>
               </div>
            );
         case "ad":
            return (
               <div
                  className={`carousel__card-footer ${isActive ? "carousel__card-footer--visible" : ""}`}
               >
                  <p className="carousel__card-footer-ad-text">
                     {props.adText}
                  </p>
               </div>
            );
         default:
            return null;
      }
   };

   const hasFooter = type === "live" || type === "ad";

   return (
      <div
         className={`carousel__card-wrapper ${hasFooter && isActive ? "carousel__card-wrapper--with-footer" : ""}`}
      >
         <div
            className={`carousel__card carousel__card--${type} ${isActive ? "carousel__card--active" : ""}`}
         >
            {image && (
               <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 960px) 45vw, 30vw"
                  className="carousel__card-bg"
                  placeholder="blur"
                  priority={props.id <= 3}
               />
            )}
            <div className="carousel__card-overlay" />
            {renderContent()}
         </div>
         {renderFooter()}
      </div>
   );
};

const LiveCard = (props: CarouselCardProps) => {
   const { followers } = props;
   return (
      <>
         <div className="carousel__card-badge carousel__card-badge--live">
            Live
         </div>
         <div className="carousel__card-followers carousel__card-followers--light">
            {followers} watching
         </div>
      </>
   );
};

const EventCard = (props: CarouselCardProps) => {
   const { followers, eventDate, eventTitle, eventLocation } = props;
   return (
      <>
         <div className="carousel__card-icon-badge">
            <AcademicIcon />
         </div>
         <div className="carousel__card-followers carousel__card-followers--dark">
            {followers} interested
         </div>
         <div className="carousel__card-content carousel__card-content--event">
            <button type="button" className="carousel__card-join-btn">
               RSVP
               <ArrowRightIcon />
            </button>
            <div className="carousel__card-event-info">
               <p className="carousel__card-event-date">{eventDate}</p>
               <p className="carousel__card-event-title">{eventTitle}</p>
               <div className="carousel__card-event-location">
                  <LocationIcon />
                  <span>{eventLocation}</span>
               </div>
            </div>
         </div>
      </>
   );
};

const GroupCard = (props: CarouselCardProps) => {
   const { groupTag, groupCategory, groupTitle, groupMembers, groupImages } =
      props;
   return (
      <>
         <div className="carousel__card-icon-badge">
            <SpinnersIcon />
         </div>
         <div className="carousel__card-group-tag">{groupTag}</div>
         <div className="carousel__card-content carousel__card-content--group">
            <div className="carousel__card-group-images">
               {groupImages?.slice(0, 3).map((groupImg) => (
                  <div
                     key={groupImg.src}
                     className="carousel__card-group-image"
                  >
                     <Image
                        src={groupImg}
                        alt=""
                        fill
                        sizes="48px"
                        placeholder="blur"
                     />
                  </div>
               ))}
            </div>
            <p className="carousel__card-group-category">{groupCategory}</p>
            <h3 className="carousel__card-group-title">{groupTitle}</h3>
            <div className="carousel__card-group-actions">
               <button
                  type="button"
                  className="carousel__card-group-btn carousel__card-group-btn--members"
               >
                  {groupMembers ? `${(groupMembers / 1000).toFixed(1)}k` : "0"}{" "}
                  active
               </button>
               <button
                  type="button"
                  className="carousel__card-group-btn carousel__card-group-btn--join"
               >
                  enter
               </button>
            </div>
         </div>
      </>
   );
};

export default CarouselCard;
