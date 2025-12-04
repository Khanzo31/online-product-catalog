// frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fix for "resolved to private ip" error in local development.
    // We disable Next.js Image Optimization locally because it blocks
    // fetching from 127.0.0.1 for security reasons.
    unoptimized: process.env.NODE_ENV === "development",

    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
