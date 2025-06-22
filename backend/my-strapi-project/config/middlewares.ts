// backend/my-strapi-project/config/middlewares.ts

export default [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https://*"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "res.cloudinary.com", // Keep for production
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "res.cloudinary.com", // Keep for production
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      headers: "*",
      // This origin array is correctly configured for both local dev and production.
      // It includes the necessary localhost URLs.
      origin: [
        "http://localhost:3000", // Local Next.js frontend
        "http://localhost:1337", // Local Strapi Admin
        "https://my-strapi-backend-l5qf.onrender.com", // Production Backend
        "https://online-product-catalog.vercel.app", // Production Frontend
        /^https:\/\/online-product-catalog-.*\.vercel\.app$/, // Vercel Preview/Branch Deploys
      ],
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
