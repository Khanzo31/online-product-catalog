// path: backend/my-strapi-project/src/api/product/controllers/product.ts

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    /**
     * Custom controller action to increment a product's view count without
     * updating the `updatedAt` timestamp.
     */
    async incrementView(ctx) {
      try {
        const { id } = ctx.params;

        // 1. Fetch the product to ensure it exists and get the current count.
        // We only need the ViewCount field for this operation.
        const product = await strapi
          .service("api::product.product")
          .findOne(id, {
            fields: ["ViewCount"],
          });

        if (!product) {
          return ctx.notFound("Product not found");
        }

        // 2. Use the low-level database query builder to update ONLY the ViewCount.
        // This method bypasses the lifecycle hooks and does NOT modify `updatedAt`.
        await strapi.db.query("api::product.product").update({
          where: { id: id },
          data: {
            ViewCount: (product.ViewCount || 0) + 1,
          },
        });

        // 3. Send a success response. No need to return the full product object.
        return ctx.send({
          message: `View count for product ${id} incremented.`,
        });
      } catch (err) {
        strapi.log.error("Error in incrementView controller:", err);
        return ctx.internalServerError(
          "An error occurred while incrementing the view count.",
          { error: err.message }
        );
      }
    },
  })
);
