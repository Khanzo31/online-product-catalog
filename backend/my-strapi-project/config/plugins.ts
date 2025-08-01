// backend/my-strapi-project/config/plugins.ts

export default ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        // --- THIS IS THE CORRECT PLACE ---
        upload: {
          preset: env("CLOUDINARY_UPLOAD_PRESET"), // <-- Moved here
        },
        delete: {},
      },
    },
  },
});
