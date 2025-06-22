# Developer Notes & Project History

This document contains a comprehensive history of the project's development, including features implemented, major debugging efforts, and a continuity plan for new developers or AI instances.

## Implemented Features

#### Administrator Features

- **(FR-1.1)** Secure Administrator Login to a management panel.
- **(FR-1.3)** Product Creation with name, SKU, description, images, price, and type.
- **(FR-1.4)** Full Product Management (View, Edit, Delete).
- **(FR-1.5)** Product Type Management (Create, Edit, Delete categories and custom properties).
- **(FR-1.7)** Inquiry Management Log to store all customer inquiries.
- **(FR-1.8)** Static Page Management for "About Us," "Privacy Policy," etc.
- **(FR-1.2) Admin Dashboard (P2):** A password-protected dashboard at `/dashboard` showing key site metrics.
- **(NFR-4.2)** Secure server-side form validation and cookie-based authentication for the dashboard.

#### Customer / Frontend Features

- **(FR-2.1)** A Home Page designed to display a gallery of products.
- **(FR-2.2)** A dynamic Product Details Page for each item.
- **(FR-2.3)** A functional Product Inquiry Form that saves submissions to the backend.
- **(FR-2.4)** A comprehensive Search & Filtering Page with keyword search, type filtering, and dynamic custom property filtering.
- **(FR-2.7)** The ability to view static content pages via dynamic routes.
- **(FR-2.8)** Cookie Consent Banner that persists the user's choice in local storage.
- **(NFR-1.1 & NFR-1.2)** A fully responsive design compatible with modern browsers.
- **(NFR-1.3) Accessibility (WCAG AA) (P2):** A full accessibility audit has been completed. All pages and interactive components (image galleries, forms, modals) are now semantically structured, keyboard-navigable, and provide feedback for screen readers.
- **(NFR-6.1) Third-Party Analytics (P2):** Consent-aware integration with Google Analytics. Tracking scripts are only loaded after the user explicitly accepts via the cookie banner.

---

## The Great API Debug: A Post-Mortem

The process of connecting the frontend to the Strapi backend after a version update revealed a series of critical issues. Documenting this journey is crucial for any future development.

1.  **Strapi Update:** The backend was successfully updated from Strapi `v4` to `v5.15.1`, and then to `v5.16.0`. This process required manually resolving dependency conflicts in `package.json` and performing a clean `npm install`.

2.  **`id` vs. `documentId` Refactor:** The entire frontend was refactored to use the modern Strapi v5 `documentId` (string) instead of the legacy `id` (number) for identifying content entries. This involved updating folder structures (`/products/[documentId]`), TypeScript interfaces, API fetch calls, and React `key` props.

3.  **Content Publishing Workflow:** It was established that content must be explicitly "Published" in the Strapi Content Manager to be available to the public API. Content saved as a "Draft" will not be returned.

4.  **API Permissions:** It was confirmed that for each Content Type (`Product`, `Product-Type`), the `find` and `findOne` permissions must be enabled for the **Public** user role in `Settings > Roles > Public`.

5.  **The Unresolved "Invalid key" Error:**
    - After all the above steps, the frontend still fails to fetch products. The console shows a `400 Bad Request` error.
    - The final error message is `{"data":null,"error":{"status":400,"name":"ValidationError","message":"Invalid key Images", ...}}`.
    - This error persists even when using the robust `populate=*` parameter, which is designed to fetch all relations.
    - **Hypothesis:** This strongly indicates a **corrupted or inconsistent configuration of one or more relation fields (`Images`, `Product`) within the Strapi backend's schema.** A previous change in the Content-Type Builder likely left the schema in a state that the API generator cannot parse correctly, specifically when handling `populate` queries. The issue is not in the frontend code, but in the backend's schema definition itself. The recommended next step is to delete and recreate the `Images` and `product_type` relation fields in Strapi to purge any corrupted configuration.

---

## Remaining & Delayed Tasks

#### Delayed (Requires External Service Configuration)

- **(NFR-5.1) Transactional Email Service (P1):** The inquiry form currently only saves to the Strapi log. Logic to send a real email notification to the site administrator via a service like Resend is postponed until an API key and sending domain are configured.
- **(FR-2.3.1) Customer Inquiry Confirmation (P2):** Sending a confirmation email to the customer is part of the same delayed email service implementation.

#### Remaining Features (P3 - Nice-to-Have)

- **(FR-1.6) Product View Counts:** A simple view counter on each product page in the admin panel.
- **(FR-2.5 & FR-2.6) Product Favoriting:** Allowing customers to save products to a list in their browser.

## Next Steps

The immediate and critical next step is to **resolve the backend schema corruption**. The recommended procedure is to:

1.  In the Strapi Content-Type Builder, **delete** the `Images` relation from the `Product` type.
2.  Save the content type, allowing the server to restart.
3.  Re-create the field with the API ID `images` (lowercase).
4.  Repeat this "delete-and-recreate" process for the `Product` relation field, naming it `product_type`.
5.  Re-link all data for all products and ensure they are published.
6.  Once the backend API is confirmed to be serving data correctly by testing the API endpoint directly in a browser, the final P1/P2 requirement (`NFR-5.1` and `FR-2.3.1`) can be addressed by integrating the Resend email service.

---

## Project Structure (Comprehensive)

ONLINE-PRODUCT-CATALOG/
├── .vscode/
├── backend/
│ └── my-strapi-project/
│ ├── .strapi/
│ ├── config/
│ │ └── ... (admin.ts, api.ts, database.ts, server.ts, etc.)
│ ├── database/
│ │ └── ...
│ ├── public/
│ │ └── uploads/
│ ├── src/
│ │ ├── api/
│ │ │ ├── inquiry/
│ │ │ ├── page/
│ │ │ ├── product/
│ │ │ │ └── content-types/
│ │ │ │ └── product/
│ │ │ │ └── schema.json <-- CORE SCHEMA FILE
│ │ │ └── product-type/
│ │ └── ...
│ ├── .env
│ └── package.json
├── frontend/
│ ├── .next/
│ ├── public/
│ ├── src/
│ │ ├── app/
│ │ │ ├── [slug]/
│ │ │ │ └── page.tsx
│ │ │ ├── components/
│ │ │ │ ├── CookieConsentBanner.tsx
│ │ │ │ ├── Footer.tsx
│ │ │ │ ├── GoogleAnalytics.tsx
│ │ │ │ ├── Header.tsx
│ │ │ │ └── ProductInquiryForm.tsx
│ │ │ ├── dashboard/
│ │ │ │ ├── actions.ts
│ │ │ │ ├── LoginForm.tsx
│ │ │ │ └── page.tsx
│ │ │ ├── products/
│ │ │ │ └── [documentId]/ <-- Renamed from [id]
│ │ │ │ └── page.tsx
│ │ │ ├── search/
│ │ │ │ └── page.tsx
│ │ │ └── page.tsx <-- Homepage
│ │ └── ...
│ ├── .env.local
│ └── package.json
├── .gitignore
├── README.md
└── REQUIREMENTS.md

---

## Continuity Plan for New AI Instance (e.g., Gemini 2.5 Pro)

To bring a new AI instance up to speed on this project, provide the following three things:

### 1. High-Level Context (The "Why")

1.  **The Project Specification:** The `REQUIREMENTS.md` file contains the original project requirements and technology stack.
2.  **The Project History:** This document (`DEVELOPER_NOTES.md`) contains the summary of what has been implemented, what remains, the overall project structure, and most importantly, the **"The Great API Debug: A Post-Mortem"** section detailing the history of the API connection issues.

### 2. Essential Files for Context (The "What" and "How")

- **Backend Schema (The Source of Truth):**
  - The `backend/my-strapi-project/src/api/product/content-types/product/schema.json` file. This is non-negotiable as it defines the true API IDs and is central to the current bug.
  - Screenshots of the `Product` and `Product Type` Content-Type Builders in the Strapi UI.
- **Environment Configuration (Example):** An example of the `frontend/.env.local` file.
- **Frontend Core Logic (Code Files):**
  - `frontend/src/app/page.tsx` (Shows the primary data fetching logic that is currently failing).
  - `frontend/src/app/search/page.tsx` (Shows complex forms and client-side filtering logic).
  - `frontend/src/app/products/[documentId]/page.tsx` (Shows single-item fetch and the `documentId` refactor).

### 3. How to Resume Work (The "What's Next")

Your next prompt to the new AI would be:

> "I have a Next.js and Strapi project that is nearly complete, but the frontend is receiving a `400 Bad Request` with an `Invalid key Images` error when trying to populate relations from the Strapi API. The `DEVELOPER_NOTES.md` file contains a detailed history of the debugging attempts. The current hypothesis is that the Strapi schema for the `Product` content type is corrupted.
>
> Your task is to guide me through fixing this. Let's start by examining the provided `backend/my-strapi-project/src/api/product/content-types/product/schema.json` file to identify the true, case-sensitive API IDs for all relation fields. Then, provide the definitive, corrected frontend code for `frontend/src/app/page.tsx` that uses these exact API IDs in the `populate` query."
