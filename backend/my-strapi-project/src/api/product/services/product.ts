// path: backend/my-strapi-project/src/api/product/services/product.ts

/**
 * product service
 */

import { factories } from "@strapi/strapi";

// This correctly points the service to its own API.
export default factories.createCoreService("api::product.product");
