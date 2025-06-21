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
            "res.cloudinary.com",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "res.cloudinary.com",
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      headers: "*",
      // --- THE DEFINITIVE CONFIGURATION ---
      origin: [
        "http://localhost:3000",
        "http://localhost:1337",
        "https://my-strapi-backend-83yr.onrender.com",

        // 1. Your MAIN production domain (NO trailing slash)
        "https://online-product-catalog.vercel.app",

        // 2. A Regular Expression for ALL preview/branch deployments
        /^https:\/\/online-product-catalog-.*\.vercel\.app$/,
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
