"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./StockInfo.module.scss";

const companies = [
   { id: 1, name: "BTC" },
   { id: 2, name: "BNB" },
   { id: 3, name: "ETH" },
   { id: 4, name: "SOL" },
   { id: 5, name: "LTC" },
];

const intervals = ["5m", "1h", "4h", "12h", "1d", "3d", "1w", "1M"];

const PLACEHOLDER_PRICES = [
   62.3, 58.7, 61.2, 64.8, 63.1, 59.4, 57.8, 60.5, 65.2, 67.1, 64.3, 62.8, 66.4,
   68.9, 67.2, 63.7, 61.9, 64.5, 66.8, 69.3, 71.2, 68.7, 66.1, 69.8, 72.4,
];

const fetchCurrentPrice = async (symbol: string) => {
   const res = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`,
   );
   if (!res.ok) throw new Error(`API error: ${res.status}`);
   const data = await res.json();
   return {
      price: data.lastPrice as string,
      priceChangePercent: data.priceChangePercent as string,
   };
};

const fetchPriceHistory = async (symbol: string, interval: string) => {
   const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=25`,
   );
   if (!res.ok) throw new Error(`API error: ${res.status}`);
   const data = await res.json();
   return (data as string[][]).map((kline) => ({
      high: kline[2],
      low: kline[3],
   }));
};

function generatePriceChartSVG(
   width: number,
   height: number,
   values: number[],
   change: number,
) {
   const padY = 5;
   let pathD = "";
   let areaD = "";
   const gradientId = "priceChartGradient";
   const color = change > 0 ? "green" : "red";

   const maxValue = Math.max(...values);
   const minValue = Math.min(...values);
   const scaleX = width / Math.max(1, values.length - 1);
   const scaleY = (height - 2 * padY) / (maxValue - minValue || 1);

   values.forEach((value, index) => {
      const x = index * scaleX;
      const y = height - padY - (value - minValue) * scaleY;

      if (index === 0) {
         pathD += `M${x},${y}`;
         areaD += `M${x},${height}`;
         areaD += ` L${x},${y}`;
      } else {
         const prevX = (index - 1) * scaleX;
         const cpX1 = (prevX + x) / 2;
         const cpY1 = height - padY - (values[index - 1] - minValue) * scaleY;
         const cpX2 = cpX1;
         const cpY2 = y;

         pathD += ` C${cpX1},${cpY1} ${cpX2},${cpY2} ${x},${y}`;
         areaD += ` C${cpX1},${cpY1} ${cpX2},${cpY2} ${x},${y}`;
      }
   });

   areaD += ` L${(values.length - 1) * scaleX},${height} Z`;

   const defs = `<defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="40%" style="stop-color:${color}; stop-opacity: 0.3" />
      <stop offset="100%" style="stop-color:${color}; stop-opacity: 0" />
    </linearGradient>
  </defs>`;

   const areaPath = `<path d="${areaD}" fill="url(#${gradientId})"/>`;

   return `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    ${defs}
    ${areaPath}
    <path d="${pathD}" fill="none" stroke-width="2" stroke="${color}"/>
  </svg>`;
}

const StockInfo = () => {
   const [selectedCompany, setSelectedCompany] = useState(companies[0].name);
   const [selectedInterval, setSelectedInterval] = useState(intervals[0]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [currentPrice, setCurrentPrice] = useState("0");
   const [priceChange, setPriceChange] = useState("0");
   const [averagePrices, setAveragePrices] =
      useState<number[]>(PLACEHOLDER_PRICES);
   const [chartSVG, setChartSVG] = useState<string | null>(() =>
      generatePriceChartSVG(325, 100, PLACEHOLDER_PRICES, 1),
   );
   const [chartKey, setChartKey] = useState(0);

   const loadPrice = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
         const priceData = await fetchCurrentPrice(selectedCompany);
         const price = parseFloat(priceData.price).toFixed(2);
         const change = priceData.priceChangePercent;
         setCurrentPrice(price);
         setPriceChange(change);

         const history = await fetchPriceHistory(
            selectedCompany,
            selectedInterval,
         );
         const avg = history.map(
            (d) => (parseFloat(d.high) + parseFloat(d.low)) / 2,
         );
         setAveragePrices(avg);

         if (avg.length > 0) {
            setChartSVG(
               generatePriceChartSVG(325, 100, avg, parseFloat(change)),
            );
            setChartKey((k) => k + 1);
         }
      } catch {
         setError("Failed to load data");
      } finally {
         setIsLoading(false);
      }
   }, [selectedCompany, selectedInterval]);

   useEffect(() => {
      void loadPrice();
   }, [loadPrice]);

   return (
      <div className={styles.stock}>
         <div className={styles.companies}>
            {companies.map((company) => (
               <button
                  key={company.id}
                  type="button"
                  className={`${styles.companyName} ${company.name === selectedCompany ? styles.companyNameActive : ""}`}
                  onClick={() => setSelectedCompany(company.name)}
               >
                  {company.name}
               </button>
            ))}
         </div>

         <div className={styles.date}>
            {intervals.map((interval) => (
               <button
                  key={interval}
                  type="button"
                  className={`${styles.dateItem} ${interval === selectedInterval ? styles.dateItemActive : ""}`}
                  onClick={() => setSelectedInterval(interval)}
               >
                  {interval}
               </button>
            ))}
         </div>

         <div className={styles.chartWrapper}>
            {isLoading && (
               <div className={styles.loading}>
                  <svg
                     width="20"
                     height="20"
                     viewBox="0 0 100 100"
                     preserveAspectRatio="xMidYMid"
                     aria-hidden="true"
                  >
                     <circle
                        cx="50"
                        cy="50"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="10"
                        r="35"
                        strokeDasharray="164.93361431346415 56.97787143782138"
                     >
                        <animateTransform
                           attributeName="transform"
                           type="rotate"
                           repeatCount="indefinite"
                           dur="0.465s"
                           values="0 50 50;360 50 50"
                           keyTimes="0;1"
                        />
                     </circle>
                  </svg>
               </div>
            )}
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.price}>
               <span>{currentPrice} $</span>
               <span
                  className={
                     parseFloat(priceChange) > 0
                        ? styles.priceUp
                        : parseFloat(priceChange) < 0
                          ? styles.priceDown
                          : ""
                  }
               >
                  {priceChange}%
               </span>
            </div>
            {chartSVG && (
               <div
                  key={chartKey}
                  className={styles.chart}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG chart from trusted numeric data
                  dangerouslySetInnerHTML={{ __html: chartSVG }}
               />
            )}
            <div className={styles.viewPricesWrapper}>
               {averagePrices.map((price, index) => (
                  <div
                     key={`price-${price.toFixed(2)}-${index}`}
                     className={styles.viewPricesItem}
                  >
                     <span>{price.toFixed(2)} $</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default StockInfo;
