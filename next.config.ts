import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   devIndicators: false,
   headers: async () => [
      {
         source: "/(.*)",
         headers: [
            {
               key: "Cache-Control",
               value: "no-store, no-cache, must-revalidate, proxy-revalidate",
            },
         ],
      },
   ],
};

export default nextConfig;
