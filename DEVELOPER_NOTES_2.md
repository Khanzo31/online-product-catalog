# Developer Notes & Project History (Part 2)

This document contains a comprehensive history of the project's complex debugging phase. It details the series of bugs encountered while connecting the Next.js frontend to the Strapi v5 backend and the specific resolutions that led to a fully functional application. This serves as an essential guide for any future development.

## Project Status: Core Functionality Complete

After an extensive debugging process, all core features of the website are now fully functional. The frontend and backend are correctly communicating, and all data is being displayed as expected.

- **Homepage:** Correctly fetches and displays all products.
- **Product Detail Pages:** Correctly fetch and display individual product data.
- **Search & Filter Page:** Fully functional with keyword search, type filtering, and dynamic custom property filtering.
- **Inquiry Form:** Successfully submits inquiries from product pages to the Strapi backend.
- **Admin Dashboard:** Securely logs in and displays site statistics and recent inquiries.

---

## The Great API Debug: A Post-Mortem

The process of connecting the frontend to the Strapi backend revealed a cascade of issues stemming from a unique backend configuration. This journey is documented below in chronological order.

### 1. The Misconfigured Backend

- **Symptom:** The frontend homepage, when requesting `/api/products`, was receiving data for "Product Types" instead of "Products".
- **Root Cause:** The core service file for the `Product` content type was incorrectly modified to point to the `Product-Type` service logic. (`backend/my-strapi-project/src/api/product/services/product.ts` was referencing `api::product-type.product-type`).
- **Resolution:** We systematically reset the `controller`, `route`, and finally the `service` file for the `Product` API in the Strapi backend to their default factory states. This forced the `/api/products` endpoint to serve the correct data.

### 2. Schema Corruption & Missing Permissions UI

- **Symptom:** After fixing the backend files, API calls with specific `populate` parameters (e.g., `?populate=images`) failed with a `400 Bad Request: Invalid key images` error. Furthermore, the UI for setting field-level permissions in `Settings > Roles > Public > Product` was completely missing.
- **Root Cause:** This combination of symptoms proved that the schema for the `Product` content type in the Strapi database was corrupted, likely due to previous field renamings. The `Users & Permissions` plugin could not read the broken model to display the field list, and the API couldn't recognize the fields for the same reason.
- **Resolution:** The schema was forcibly rebuilt by navigating to the **Content-Type Builder**, deleting the `images` and `product` relation fields, saving (which restarts the server and purges the config), and then re-creating them. After this, the field-level permissions UI appeared correctly.

### 3. The Strapi v4 vs. v5 API Structure Anomaly

- **Symptom:** Even with a clean schema, the homepage (coded for a modern v5 "nested" API response) showed "No products found", while the search page (coded for an older v4 "flat" API response) worked perfectly.
- **Root Cause:** The user's Strapi instance, despite being v5, is configured to serve a **flat data structure** (`responseData.data` is an array of products), not the modern nested structure (`responseData.data[0].attributes`). This was the single most important discovery.
- **Resolution:** The entire frontend application (`homepage`, `product detail page`, `search page`) was refactored to expect and handle the "flat" v4-style API response. This included changing type definitions and data mapping logic.

### 4. `id` vs. `documentId` Routing

- **Symptom:** After refactoring for a flat structure using numeric `id`s for links, individual product pages returned a `404 Not Found` error. However, manually navigating to a URL with a product's `documentId` worked.
- **Root Cause:** The user's Strapi instance has the standard route for fetching by numeric ID (`/api/products/:id`) disabled or inaccessible to the Public role, but the filter-based lookup by `documentId` (`/api/products?filters[documentId][$eq]=...`) was working.
- **Resolution:** The entire application was refactored _again_ to use the `documentId` as the canonical identifier for routing. Links now point to `/products/[documentId]`, and the detail page fetches data using the filter method.

### 5. Inquiry Form Submission Failures

- **Symptom:** The product inquiry form failed on submission.
- **Root Cause:** Two issues were present:
  1.  The **`create` permission** was not enabled for the `Inquiry` content type for the Public role.
  2.  The API ID for the product relation field in the `Inquiry` schema was **`Product`** (uppercase P), but the form was submitting it as `product` (lowercase p).
- **Resolution:** The `create` permission was enabled in `Settings > Roles > Public`. The `ProductInquiryForm.tsx` component was then updated to send the relation using the correct, case-sensitive `Product` key.

### 6. Dashboard Data Fetching Errors

- **Symptom:** The admin dashboard failed to load stats and recent inquiries.
- **Root Cause:** Server-side `fetch` requests from a Next.js component are anonymous by default. The Strapi API correctly denied access to the inquiry list, which requires authentication.
- **Resolution:** A read-only API Token was generated in the Strapi settings. This token was added to the frontend's `.env.local` file and included as a `bearer` token in the `Authorization` header for all `fetch` requests made from the dashboard page.

### 7. Minor Frontend Bugs

- **Bug:** An incorrect React hook (`useFormState` vs. `useActionState`) was used, causing a client-side error.
- **Resolution:** The hook was updated to `useActionState` and its import was changed from `react-dom` to `react`.
- **Bug:** The `useFormStatus` hook was incorrectly moved to the `react` import.
- **Resolution:** The imports were separated, with `useActionState` coming from `react` and `useFormStatus` correctly coming from `react-dom`.

---

## Final Key Learnings

- **The API is the Source of Truth:** When the Strapi UI and the API response disagree (e.g., the `ID` mismatch), trust the API.
- **Permissions are Multi-Layered:** In Strapi, a role needs permission for the **Action** (e.g., `find`, `create`) AND the **Fields** it needs to access for that action.
- **Schema Corruption is Possible:** If the permissions UI is missing fields, it points to a corrupted schema that can only be fixed by deleting and re-creating the problematic fields in the Content-Type Builder.
- **`populate=*` is a powerful debugging tool** to quickly verify if an API endpoint is working at a basic level.
- **Server-to-Server API calls are Anonymous:** Next.js server components calling a Strapi API must provide their own authentication, typically via a bearer token.
- **This Project's Anomaly:** This specific Strapi instance serves a **v4-style "flat" API response**, and routing is based on `documentId`. All future development must follow this pattern.
