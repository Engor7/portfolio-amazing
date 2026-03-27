"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import "./CryptoPriceIndex.scss";

interface CryptoData {
   symbol: string;
   price: string;
   priceNum: number;
   change: number;
   sparklineData: number[];
}

const cryptoData: CryptoData[] = [
   {
      symbol: "BTC",
      price: "$43,127",
      priceNum: 43127,
      change: 2.28,
      sparklineData: [20, 35, 28, 45, 38, 32, 48, 42, 55, 50, 62, 58],
   },
   {
      symbol: "ETH",
      price: "$2,295",
      priceNum: 2295,
      change: 2.8,
      sparklineData: [45, 42, 50, 35, 55, 48, 40, 60, 52, 65, 58, 70],
   },
   {
      symbol: "XRP",
      price: "$0.63",
      priceNum: 0.63,
      change: -1.24,
      sparklineData: [65, 58, 70, 55, 62, 48, 55, 42, 50, 38, 45, 35],
   },
   {
      symbol: "BNB",
      price: "$252",
      priceNum: 252,
      change: 1.31,
      sparklineData: [30, 32, 28, 35, 40, 38, 45, 50, 48, 55, 52, 58],
   },
   {
      symbol: "ADA",
      price: "$0.635",
      priceNum: 0.635,
      change: -0.85,
      sparklineData: [55, 60, 52, 58, 50, 45, 52, 48, 42, 50, 45, 40],
   },
   {
      symbol: "SOL",
      price: "$73",
      priceNum: 73,
      change: 1.73,
      sparklineData: [25, 40, 30, 50, 35, 45, 55, 48, 60, 52, 58, 65],
   },
];

interface ChartPoint {
   x: number;
   y: number;
   value: number;
}

interface SparklinePoints {
   linePath: string;
   areaPath: string;
   points: ChartPoint[];
}

const generateSparklinePaths = (
   data: number[],
   width: number,
   height: number,
): SparklinePoints => {
   const paddingY = 4;
   const chartHeight = height - paddingY * 2;

   const min = Math.min(...data);
   const max = Math.max(...data);
   const range = max - min || 1;

   const points: ChartPoint[] = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = paddingY + chartHeight - ((value - min) / range) * chartHeight;
      return { x, y, value };
   });

   // Smooth bezier curve
   let linePath = `M ${points[0].x} ${points[0].y}`;

   for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const prev = points[i - 1] || current;
      const nextNext = points[i + 2] || next;

      const cp1x = current.x + (next.x - prev.x) / 6;
      const cp1y = current.y + (next.y - prev.y) / 6;
      const cp2x = next.x - (nextNext.x - current.x) / 6;
      const cp2y = next.y - (nextNext.y - current.y) / 6;

      linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
   }

   // Area path (line + bottom closure)
   const areaPath =
      linePath +
      ` L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

   return {
      linePath,
      areaPath,
      points,
   };
};

interface SparklineProps {
   data: number[];
   color: string;
   id: string;
   currentPrice: number;
   height?: number;
}

const formatPrice = (price: number): string => {
   if (price >= 1000) {
      return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
   }
   if (price >= 1) {
      return `$${price.toFixed(2)}`;
   }
   return `$${price.toFixed(3)}`;
};

const Sparkline = ({
   data,
   color,
   id,
   currentPrice,
   height = 85,
}: SparklineProps) => {
   const [activeIndex, setActiveIndex] = useState<number | null>(null);
   const [width, setWidth] = useState(300);
   const svgRef = useRef<SVGSVGElement>(null);

   useEffect(() => {
      const updateWidth = () => {
         if (svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            if (rect.width > 0) {
               setWidth(rect.width);
            }
         }
      };

      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
   }, []);

   const { linePath, areaPath, points } = generateSparklinePaths(
      data,
      width,
      height,
   );
   const gradientId = `gradient-${id}`;
   const glowId = `glow-${id}`;
   const lastPoint = points[points.length - 1];

   // Calculate prices for each point based on relative values
   const lastValue = data[data.length - 1];
   const priceMultiplier = currentPrice / lastValue;

   // Find min and max points
   const minIndex = data.indexOf(Math.min(...data));
   const maxIndex = data.indexOf(Math.max(...data));
   const minPoint = points[minIndex];
   const maxPoint = points[maxIndex];

   const gridLines = [0.33, 0.66].map((ratio) => height * ratio);

   const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * width;

      // Find nearest point by X position
      let nearestIndex = 0;
      let minDistance = Math.abs(points[0].x - mouseX);

      for (let i = 1; i < points.length; i++) {
         const distance = Math.abs(points[i].x - mouseX);
         if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = i;
         }
      }

      setActiveIndex(nearestIndex);
   };

   const handleMouseLeave = () => {
      setActiveIndex(null);
   };

   const activePoint = activeIndex !== null ? points[activeIndex] : null;
   const activePrice = activePoint
      ? formatPrice(activePoint.value * priceMultiplier)
      : "";
   const tooltipWidth = activePrice.length * 7 + 14;
   const tooltipX = activePoint
      ? Math.min(
           Math.max(activePoint.x - tooltipWidth / 2, 0),
           width - tooltipWidth,
        )
      : 0;
   const tooltipY = activePoint ? Math.max(activePoint.y - 22, 2) : 0;

   return (
      <svg
         ref={svgRef}
         width="100%"
         height={height}
         viewBox={`0 0 ${width} ${height}`}
         preserveAspectRatio="none"
         className="crypto-card__sparkline"
         aria-hidden="true"
         onMouseMove={handleMouseMove}
         onMouseLeave={handleMouseLeave}
      >
         <defs>
            {/* Gradient for area fill */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stopColor={color} stopOpacity="0.5" />
               <stop offset="40%" stopColor={color} stopOpacity="0.2" />
               <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>

            {/* Glow filter for line */}
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
               <feGaussianBlur stdDeviation="3" result="blur" />
               <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
               </feMerge>
            </filter>
         </defs>

         {/* Grid lines - extend beyond edges */}
         {gridLines.map((y) => (
            <line
               key={`grid-${y}`}
               x1={-20}
               y1={y}
               x2={width + 20}
               y2={y}
               className="crypto-card__grid-line"
            />
         ))}

         {/* Gradient area fill */}
         <path
            d={areaPath}
            fill={`url(#${gradientId})`}
            className="crypto-card__area"
         />

         {/* Main line with glow */}
         <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${glowId})`}
            className="crypto-card__line"
         />

         {/* Min/Max indicators (only when not hovering) */}
         {activePoint === null && (
            <>
               {/* Max point */}
               <circle
                  cx={maxPoint.x}
                  cy={maxPoint.y}
                  r="2.5"
                  fill={color}
                  className="crypto-card__minmax-dot"
               />
               {/* Min point */}
               <circle
                  cx={minPoint.x}
                  cy={minPoint.y}
                  r="2.5"
                  fill={color}
                  opacity="0.5"
                  className="crypto-card__minmax-dot"
               />
            </>
         )}

         {/* Active hover point */}
         {activePoint && (
            <g className="crypto-card__hover-point crypto-card__hover-point--active">
               {/* Vertical guide line - extends beyond chart */}
               <line
                  x1={activePoint.x}
                  y1={-50}
                  x2={activePoint.x}
                  y2={height + 50}
                  className="crypto-card__vertical-line"
               />
               {/* Point */}
               <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="4"
                  fill="#ffffff"
               />
               {/* Tooltip */}
               <rect
                  x={tooltipX}
                  y={tooltipY}
                  width={tooltipWidth}
                  height={16}
                  className="crypto-card__tooltip-bg"
               />
               <text
                  x={tooltipX + tooltipWidth / 2}
                  y={tooltipY + 12}
                  textAnchor="middle"
                  className="crypto-card__tooltip"
               >
                  {activePrice}
               </text>
            </g>
         )}

         {/* Pulsing ring at end */}
         <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="3"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.4"
            className="crypto-card__dot-ring"
         />
         {/* Solid dot at end */}
         <circle cx={lastPoint.x} cy={lastPoint.y} r="2" fill={color} />
      </svg>
   );
};

interface CryptoCardProps {
   crypto: CryptoData;
}

const CryptoCard = ({ crypto }: CryptoCardProps) => {
   const isPositive = crypto.change >= 0;
   const changeColor = isPositive ? "#22c55e" : "#ef4444";
   const changeSign = isPositive ? "+" : "";

   return (
      <div className="crypto-card">
         <div className="crypto-card__header">
            <span className="crypto-card__symbol">{crypto.symbol}</span>
            <span
               className="crypto-card__change"
               style={{ color: changeColor }}
            >
               {changeSign}
               {crypto.change}%
            </span>
         </div>
         <div className="crypto-card__chart">
            <Sparkline
               data={crypto.sparklineData}
               color={changeColor}
               id={crypto.symbol}
               currentPrice={crypto.priceNum}
            />
         </div>
         <div className="crypto-card__price">{crypto.price}</div>
      </div>
   );
};

const CryptoPriceIndex = () => {
   return (
      <section className="crypto-price-index">
         <div className="crypto-price-index__header">
            <span className="crypto-price-index__bracket crypto-price-index__bracket--left">
               (
            </span>
            <h2 className="crypto-price-index__title">
               cryptocurrency <em>price</em> index
            </h2>
            <span className="crypto-price-index__bracket crypto-price-index__bracket--right">
               )
            </span>
         </div>
         <div className="crypto-price-index__grid">
            {cryptoData.map((crypto) => (
               <CryptoCard key={crypto.symbol} crypto={crypto} />
            ))}
         </div>
      </section>
   );
};

export default CryptoPriceIndex;
