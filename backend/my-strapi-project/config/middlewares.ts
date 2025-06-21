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
  // --- THIS IS THE NEW, EXPANDED CORS CONFIGURATION ---
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      headers: "*",
      // Add your frontend and backend URLs to the origin list
      origin: [
        "http://localhost:3000", // Your local frontend
        "http://localhost:1337", // Your local strapi
        "https://my-strapi-backend-83yr.onrender.com", // Your deployed strapi
        // Add your Vercel URL here when you have it
        // e.g., 'https://your-frontend-app.vercel.app'
      ],
    },
  },
  // ---------------------------------------------------
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
