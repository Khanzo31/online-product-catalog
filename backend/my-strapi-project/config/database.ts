// backend/my-strapi-project/config/database.ts

export default ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      // Use the DATABASE_URL from your Render environment
      connectionString: env("DATABASE_URL"),
      // This setting is required for Render's managed PostgreSQL databases
      ssl: {
        rejectUnauthorized: false,
      },
    },
    // Set to false in production for better performance
    debug: false,
  },
});
