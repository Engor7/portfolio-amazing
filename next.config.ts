import type { NextConfig } from "next";

const securityHeaders = [
   { key: "X-Content-Type-Options", value: "nosniff" },
   { key: "X-Frame-Options", value: "DENY" },
   { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
   {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
   },
];

const nextConfig: NextConfig = {
   output: "standalone",
   devIndicators: false,
   redirects: async () => [
      {
         source: "/projects",
         destination: "/",
         permanent: true,
      },
   ],
   headers: async () => [
      {
         source: "/(.*)",
         headers: securityHeaders,
      },
      {
         source: "/videos/:path*",
         headers: [
            {
               key: "Cache-Control",
               value: "public, max-age=31536000, immutable",
            },
         ],
      },
   ],
};

export default nextConfig;
