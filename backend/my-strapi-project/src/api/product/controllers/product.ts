// path: backend/my-strapi-project/src/api/product/controllers/product.ts
"use strict";

/**
 * product controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    // Our custom controller action
    async incrementView(ctx: any) {
      const { id } = ctx.params;

      try {
        // 1. Fetch the product to ensure it exists and get the current count
        const product = await strapi.entityService.findOne(
          "api::product.product",
          id
        );

        if (!product) {
          return ctx.notFound("Product not found");
        }

        // Strapi types can be complex, so || 0 is a safe fallback.
        const currentViewCount = (product as any).ViewCount || 0;

        // 2. Update the product with the incremented count
        const updatedProduct = await strapi.entityService.update(
          "api::product.product",
          id,
          {
            data: {
              ViewCount: currentViewCount + 1,
            },
          }
        );

        // 3. Respond with success and the new count
        return ctx.send({
          message: "View count incremented successfully.",
          newCount: (updatedProduct as any).ViewCount,
        });
      } catch (err) {
        // Log the full error to the Strapi console for easier debugging
        console.error("Error in incrementView controller:", err);
        // Provide a generic error to the client
        ctx.internalServerError(
          "An error occurred while incrementing the view count."
        );
      }
    },
  })
);
