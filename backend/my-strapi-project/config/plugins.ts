// backend/my-strapi-project/config/plugins.ts

export default ({ env }) => ({
  // --- FIX FOR LOCAL DEVELOPMENT ---
  // The Cloudinary provider is configured for production and requires API keys.
  // For local development, we comment it out to make Strapi revert to the
  // default 'local' upload provider.
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {
          preset: env("CLOUDINARY_UPLOAD_PRESET"),
        },
        delete: {},
      },
    },
  },
});
