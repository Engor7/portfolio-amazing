"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WeatherForecast.module.scss";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY ?? "";
const cities = ["Moscow", "Berlin", "Rome", "Dubai", "London", "New York City"];

type WeatherData = {
   temperature: number;
   icon: string;
   humidity: number;
   pressure: number;
   windSpeed: number;
   cloudiness: number;
};

const WeatherForecast = () => {
   const [selectedCity, setSelectedCity] = useState(cities[0]);
   const [isOpen, setIsOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [data, setData] = useState<WeatherData>({
      temperature: 0,
      icon: "",
      humidity: 0,
      pressure: 0,
      windSpeed: 0,
      cloudiness: 0,
   });

   const selectorRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handler = (e: MouseEvent) => {
         if (
            selectorRef.current &&
            !selectorRef.current.contains(e.target as Node)
         ) {
            setIsOpen(false);
         }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
   }, []);

   useEffect(() => {
      let cancelled = false;
      setIsLoading(true);
      setIsOpen(false);

      const fetchWeather = async () => {
         try {
            const res = await fetch(
               `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`,
            );
            const json = await res.json();
            if (cancelled) return;
            setData({
               temperature: Math.round(json.main.temp),
               icon: json.weather[0].icon,
               humidity: json.main.humidity,
               pressure: json.main.pressure,
               windSpeed: json.wind.speed,
               cloudiness: json.clouds.all,
            });
         } catch (err) {
            console.error("Error fetching weather:", err);
         } finally {
            if (!cancelled) setIsLoading(false);
         }
      };

      void fetchWeather();
      return () => {
         cancelled = true;
      };
   }, [selectedCity]);

   return (
      <div className={styles.weather}>
         <div className={styles.top}>
            <div className={styles.selectorWrapper} ref={selectorRef}>
               <button
                  type="button"
                  className={`${styles.selectedCity} ${isOpen ? styles.selectedCityActive : ""}`}
                  onClick={() => setIsOpen((v) => !v)}
               >
                  {selectedCity}
                  <svg
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     aria-hidden="true"
                  >
                     <polyline points="6 9 12 15 18 9" />
                  </svg>
               </button>
               {isOpen && (
                  <div className={styles.selectorList}>
                     {cities.map((city) => (
                        <button
                           type="button"
                           key={city}
                           className={`${styles.selectorItem} ${city === selectedCity ? styles.selectorItemActive : ""}`}
                           onClick={() => setSelectedCity(city)}
                        >
                           {city}
                        </button>
                     ))}
                  </div>
               )}
            </div>
            <div className={styles.temperature}>
               {isLoading ? (
                  <div className={styles.loading}>
                     <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                     >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                     </svg>
                  </div>
               ) : (
                  <>
                     {data.temperature > 0 && <span>+</span>}
                     {data.temperature}
                  </>
               )}
            </div>
            <div className={styles.icon}>
               {data.icon && (
                  // biome-ignore lint/performance/noImgElement: weather icon from public
                  <img
                     key={`${selectedCity}-${data.icon}`}
                     src={`/weather_img/${data.icon}.png`}
                     alt="weather"
                  />
               )}
            </div>
         </div>
         <div className={styles.info}>
            <div className={styles.infoItem}>
               <span>Humidity</span>
               <b>{data.humidity}%</b>
            </div>
            <div className={styles.infoItem}>
               <span>Pressure</span>
               <b>{data.pressure} hPa</b>
            </div>
            <div className={styles.infoItem}>
               <span>Wind</span>
               <b>{data.windSpeed} m/s</b>
            </div>
            <div className={styles.infoItem}>
               <span>Cloudiness</span>
               <b>{data.cloudiness}%</b>
            </div>
         </div>
      </div>
   );
};

export default WeatherForecast;
