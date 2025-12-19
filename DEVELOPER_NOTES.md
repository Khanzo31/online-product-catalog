# Developer Notes & Technical Architecture

This document serves as the technical guide for the AlpialCanada Online Product Catalog. The project has evolved from a basic MVP to a sophisticated gallery application with administrative features and advanced SEO.

## Critical Project Configuration

Any future development MUST adhere to the following established patterns:

1.  **Strapi API Token Permissions (CRITICAL)**

    - The `STRAPI_API_TOKEN` in `.env.local` (and Vercel) must have **Full Access** (or at least `Delete` permissions on Products).
    - If this is set to Read-Only, the "Delete Product" feature in the frontend admin tools will fail with a 403 Forbidden error.

2.  **Next.js Image Optimization (Local vs Production)**

    - In `frontend/next.config.ts`, we set `unoptimized: process.env.NODE_ENV === "development"`.
    - **Reason:** Next.js security blocks fetching images from private IPs (`127.0.0.1`) by default. Disabling optimization locally fixes the broken images during development without compromising production security.

3.  **Admin Architecture**

    - **Security:** We do **not** expose the admin cookie to the client browser.
    - **Mechanism:** `frontend/src/app/layout.tsx` (Server Component) checks the `dashboard_password` cookie securely. It then passes a boolean `isAdmin` prop to `MainLayoutClient.tsx`.
    - **Visibility:** Components like `AdminToolbar` and `AdminControls` rely on this boolean prop to render UI elements.
    - **Action Security:** The actual deletion logic (`actions/admin.ts`) re-verifies the cookie on the server before making any API calls to Strapi.

4.  **Centralized Types**

    - Do not define interfaces like `Product` or `ProductImage` inside individual component files.
    - Import them from `@/types` which maps to `frontend/src/types/index.ts`.

5.  **Strapi API Structure**
    - Strapi v5 returns a flat structure (`response.data`). We do not use the nested `attributes` structure found in v4 documentation.

## Theme & UI Standards

- **Aesthetic:** Antique Gallery
- **Palette:**
  - **Primary Action:** Deep Mahogany (`bg-red-900`) - Used for buttons and primary calls to action.
  - **Secondary:** Amber/Bronze (`text-amber-700`) - Used for links, badges, and borders.
  - **Backgrounds:** Stone/Warm Grey (`bg-stone-50`, `bg-stone-100`) - Replaces sterile white/gray backgrounds.
- **Typography:** Product titles and Headings use `font-serif` (Lora). Capitalization is enforced via CSS (`capitalize`) to handle inconsistent data entry.

## Key Feature Implementations

### 1. Dynamic OpenGraph Images

- **File:** `src/app/products/[documentId]/opengraph-image.tsx`
- **Function:** Automatically generates a branded social media image (PNG) on the fly for every product url, overlaying the price and name onto the product image.

### 2. Search & Filtering

- **Logic:** The `FilterContent` component is defined _outside_ the main render loop in `SearchPage.tsx` to prevent input focus loss during re-renders.
- **Sorting:** Defaults to `createdAt:desc` to show the newest arrivals first.

### 3. Sitemap Segmentation

- **Files:** `app/sitemap.ts` (Static pages) and `app/products/sitemap.ts` (Product pages).
- **Purpose:** Keeps the sitemap organized and scalable as the inventory grows.

## Recent Debugging Resolutions

### 1. Search Bar Focus Loss

- **Problem:** Typing one letter in the search bar caused the input to lose focus.
- **Resolution:** The Filter component was being re-declared inside the component body. It was moved outside to ensure React preserves the DOM state.

### 2. Dashboard Layout Shift

- **Problem:** The header resizing on scroll caused a layout shift loop (spasm).
- **Resolution:** The Header position was changed to `fixed`, and padding was applied to the `MainLayoutClient` to compensate.

### 3. SSRF Image Error

- **Problem:** "Image resolved to private IP" error in local development.
- **Resolution:** Disabled Next.js image optimization in development mode via `next.config.ts`.

---

## Dependency Status

- **Next.js:** v16.x (Patched for CVE-2025-55182)
- **React:** v19.x
- **Tailwind:** v4
