// frontend/next.config.ts

// This is the standard configuration for a Next.js project.
const nextConfig = {
  // --- START OF THE FIX ---
  // We need to configure the Next.js Image component to allow it to
  // fetch images from our local Strapi server and our production
  // Cloudinary media library.
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // --- END OF THE FIX ---
};

export default nextConfig;
