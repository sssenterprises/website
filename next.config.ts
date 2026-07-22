import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
  },

  allowedDevOrigins: [
    "192.168.2.36",
  ],

  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: false,
};

export default nextConfig;