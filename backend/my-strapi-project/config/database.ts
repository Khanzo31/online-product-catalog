// backend/my-strapi-project/config/database.ts
import path from "path";

export default ({ env }) => {
  // Production Environment (Render)
  if (env("NODE_ENV") === "production") {
    return {
      connection: {
        client: "postgres",
        connection: {
          connectionString: env("DATABASE_URL"),
          ssl: {
            rejectUnauthorized: false,
          },
        },
        debug: false,
      },
    };
  }

  // Development Environment (Local)
  return {
    connection: {
      client: "sqlite",
      connection: {
        filename: path.join(
          __dirname,
          "..",
          "..",
          env("DATABASE_FILENAME", ".tmp/data.db")
        ),
      },
      useNullAsDefault: true,
    },
  };
};
