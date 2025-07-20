# Developer Notes & Final Project Summary

This document serves as the final technical guide and summary for the AlpialCanada Online Product Catalog. The project is functionally complete, and all hosting infrastructure has been upgraded to support production workloads.

## ⚠️ Critical Project "Gotchas" & Key Learnings

This project has a unique technical configuration. Any future development **MUST** adhere to the following established patterns:

1.  **Strapi API Returns a "Flat" Structure:** Unlike modern Strapi defaults, the API for lists (e.g., `/api/products`) returns a flat array of objects (`response.data`). It does not use the nested `attributes` structure. All frontend data mapping must expect this v4-style response.

2.  **Routing is by `documentId` (string):** The standard numeric `/:id` route is not used. All links and fetches for single items must use a filter on the `documentId` string (e.g., `/products?filters[documentId][$eq]=...`). The `documentId` is the canonical identifier for all frontend routing.

3.  **Use `populate=*` for API Calls:** The most robust and reliable method for fetching relations is to use `populate=*`. Avoid complex, multi-level populate queries as they have proven to be unreliable with this configuration.

4.  **API Field Names are Case-Sensitive:** The API IDs for relations are case-sensitive (e.g., the relation from `Product` to `Product Type` is `Product` with an uppercase 'P'). Always verify the exact, case-sensitive API ID in the Strapi Content-Type Builder before writing fetch logic.

5.  **Dashboard Authentication is a "Dual-Check":** The dashboard has a two-part security model:

    - **Layout (`layout.tsx`):** Handles the UI, showing the `LoginForm` if the password cookie is invalid.
    - **Page (`page.tsx`):** Contains its own identical cookie check to prevent its server-side data fetching from running if unauthenticated. Both are required to prevent server crashes.

6.  **Local Development Environment Configuration:**
    - **Image Uploads:** To upload images locally, the Cloudinary provider **must be commented out** in `backend/my-strapi-project/config/plugins.ts`.
    - **Image Display:** For local images to display, the local Strapi hostname (`127.0.0.1:1337`) **must be added** to the `remotePatterns` in `frontend/next.config.ts`.
    - **Dashboard Data:** For the dashboard to fetch data, a read-only `STRAPI_API_TOKEN` **must be generated** in the local Strapi admin panel and added to the `frontend/.env.local` file.

---

## 🐞 Major Debugging Post-Mortem

The project underwent several extensive debugging phases to reach its current stable state.

### 1. API Connection & Data Structure

- **Problem:** The frontend was receiving incorrect data or `400 Bad Request` errors.
- **Resolution:** This was a multi-faceted issue resolved by:
  1.  **Fixing Backend Services:** Resetting core API files (`services`, `controllers`) in Strapi to their defaults to ensure endpoints served the correct content.
  2.  **Rebuilding Corrupted Schema:** Deleting and recreating relation fields (`images`, `Product`) in the Content-Type Builder to fix a corrupted schema that caused `populate` queries to fail.
  3.  **Refactoring Frontend:** Adapting the entire frontend to handle the project's unique v4-style "flat" API response and to use `documentId` (string) for all routing and single-item fetches.

### 2. Dashboard Authentication

- **Problem:** The server would crash when accessing `/dashboard` while unauthenticated, and fail to fetch data even after a successful login.
- **Resolution:**
  1.  The "Dual-Check" security model was implemented in the layout and page files to prevent data fetching before authentication.
  2.  Server-side `fetch` calls from the dashboard were updated to include a bearer `STRAPI_API_TOKEN`, as these server-to-server calls are anonymous by default.

### 3. Image Upload Failures (Production)

- **Problem:** Uploading images in the production Strapi admin panel caused the `my-strapi-backend` service on Render to crash due to exceeding its memory limit (512MB).
- **Resolution:** The problem was permanently resolved by upgrading the **Render Web Service plan from "Free" to "Standard"**, which increased the available RAM from 512MB to 2GB. This provided sufficient resources for Strapi to process multiple and/or large images without crashing.
