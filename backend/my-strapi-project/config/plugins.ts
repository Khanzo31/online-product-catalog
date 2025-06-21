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
        upload: {
          // This is the correct location for the preset
          // to enable direct client-side uploads.
          preset: env("CLOUDINARY_UPLOAD_PRESET"),
        },
        delete: {},
      },
    },
  },
});
