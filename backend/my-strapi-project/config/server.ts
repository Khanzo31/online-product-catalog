// backend/my-strapi-project/config/server.ts

export default ({ env }) => ({
  // Uses HOST from Render env, defaults to 0.0.0.0
  host: env("HOST", "0.0.0.0"),
  // Uses PORT from Render env, defaults to 1337
  port: env.int("PORT", 1337),
  // This is the critical line that fixes the admin panel URL
  // It uses the URL from your Render env
  url: env("URL", "http://localhost:1337"),
  app: {
    // Uses APP_KEYS from Render env
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
