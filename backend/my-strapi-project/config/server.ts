// path: backend/my-strapi-project/config/server.js
module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  // --- ADD THIS SECTION ---
  // This disables the anonymous analytics that are being blocked by your
  // browser's ad blocker, which is causing the 'Failed to fetch' error.
  admin: {
    autoOpen: false, // Optional: prevents the admin panel from opening in a new tab
    watchIgnoreFiles: ["**/config/sync/**"],
  },
  telemetry: {
    enabled: false,
  },
  // ------------------------
});
