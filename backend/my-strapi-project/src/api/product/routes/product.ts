// path: backend/my-strapi-project/src/api/product/routes/product.ts

/**
 * product router
 */

import { factories } from "@strapi/strapi"; // <-- ADD THIS LINE

export default factories.createCoreRouter("api::product.product");
