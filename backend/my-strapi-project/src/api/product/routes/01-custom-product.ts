// backend/my-strapi-project/src/api/product/routes/01-custom-product.ts

export default {
  routes: [
    {
      method: "POST",
      path: "/products/:id/increment-view",
      handler: "product.incrementView",
      config: {
        auth: false,
      },
    },
  ],
};
