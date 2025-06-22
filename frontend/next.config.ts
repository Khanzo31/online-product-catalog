// frontend/next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // This pattern is for LOCAL DEVELOPMENT using the default Strapi uploader.
      // You should keep this for when you work locally.
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
      // This new pattern is for PRODUCTION, allowing images from Cloudinary.
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "", // Port is empty for standard HTTPS (port 443)
        pathname: "/**", // Allow any path on this hostname
      },
    ],
  },
};

module.exports = nextConfig;
