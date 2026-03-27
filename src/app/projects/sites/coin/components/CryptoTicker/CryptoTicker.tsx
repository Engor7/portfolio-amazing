"use client";

import "./CryptoTicker.scss";

const cryptoData = [
   {
      symbol: "BTC",
      name: "Bitcoin",
      price: "43,521.80",
      change: 2.34,
      up: true,
   },
   {
      symbol: "ETH",
      name: "Ethereum",
      price: "2,284.15",
      change: 1.87,
      up: true,
   },
   { symbol: "BNB", name: "BNB", price: "312.45", change: -0.92, up: false },
   { symbol: "SOL", name: "Solana", price: "98.72", change: 5.21, up: true },
   { symbol: "XRP", name: "XRP", price: "0.6234", change: -1.45, up: false },
   { symbol: "ADA", name: "Cardano", price: "0.5821", change: 3.12, up: true },
   {
      symbol: "DOGE",
      name: "Dogecoin",
      price: "0.0892",
      change: -2.18,
      up: false,
   },
   { symbol: "DOT", name: "Polkadot", price: "7.45", change: 1.56, up: true },
];

const CryptoTicker = () => {
   const renderTickerContent = () => {
      const items = [...cryptoData, ...cryptoData, ...cryptoData];
      return items.map((coin, index) => (
         <tspan key={`${coin.symbol}-${index}`}>
            <tspan fill="#e0e0e0">
               {coin.symbol} ${coin.price}{" "}
            </tspan>
            <tspan fill={coin.up ? "#22c55e" : "#ef4444"}>
               {coin.up ? "▲" : "▼"} {Math.abs(coin.change)}%
            </tspan>
            <tspan fill="#e0e0e0"> • </tspan>
         </tspan>
      ));
   };

   return (
      <div className="crypto-ticker">
         <svg
            viewBox="0 0 1200 70"
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-labelledby="tickerTitle"
         >
            <title id="tickerTitle">Cryptocurrency prices ticker</title>
            <defs>
               <path
                  id="wave"
                  d="M-600,35 Q-525,15 -450,35 T-300,35 T-150,35 T0,35 T150,35 T300,35 T450,35 T600,35 T750,35 T900,35 T1050,35 T1200,35 T1350,35 T1500,35 T1650,35 T1800,35"
                  fill="none"
               />
               <linearGradient
                  id="bgGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
               >
                  <stop offset="0%" stopColor="#1a1a1a" />
                  <stop offset="50%" stopColor="#2d2d2d" />
                  <stop offset="100%" stopColor="#1a1a1a" />
               </linearGradient>
            </defs>

            <use
               href="#wave"
               stroke="url(#bgGradient)"
               strokeWidth="30"
               strokeLinecap="round"
            />

            <text className="crypto-ticker__text" dy="0.35em">
               <textPath href="#wave">
                  <animate
                     attributeName="startOffset"
                     from="0%"
                     to="-50%"
                     dur="30s"
                     repeatCount="indefinite"
                  />
                  {renderTickerContent()}
               </textPath>
            </text>
         </svg>
      </div>
   );
};

export default CryptoTicker;
