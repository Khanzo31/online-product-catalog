// backend/my-strapi-project/config/plugins.ts

export default ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
        // --- THIS IS THE NEW LINE ---
        // This enables direct uploads from the Strapi admin panel to Cloudinary,
        // bypassing your server to prevent memory crashes.
        upload_preset: env("CLOUDINARY_UPLOAD_PRESET"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  // ... any other plugin configurations you might have can go here
});
