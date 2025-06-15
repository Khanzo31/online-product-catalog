# Project: Online Product Catalog Website

This repository contains the source code for a responsive online product catalog website built with a modern Headless (Jamstack) architecture. The system serves as a digital showcase for unique products, allowing the site owner to manage content and customers to browse, search, and inquire about products.

## Project Status: MVP++ Complete

All core P1 (Must-Have) features are now implemented and functional. We have also completed several P2 (Should-Have) features, making the application robust and ready for further enhancement.

### Implemented Features

#### Administrator Features

- **(FR-1.1)** Secure Administrator Login to a management panel.
- **(FR-1.3)** Product Creation with name, SKU, description, images, price, and type.
- **(FR-1.4)** Full Product Management (View, Edit, Delete).
- **(FR-1.5)** Product Type Management (Create, Edit, Delete categories like "Artwork" and "Collectible").
- **(FR-1.7)** Inquiry Management Log to store all customer inquiries.
- **(FR-1.8)** Static Page Management for "About Us," "Privacy Policy," etc.
- **(FR-1.2) Admin Dashboard (P2):** A password-protected dashboard at `/dashboard` showing key site metrics like total products and inquiries.

#### Customer / Frontend Features

- **(FR-2.1)** A Home Page displaying a gallery of products.
- **(FR-2.2)** A dynamic Product Details Page for each item.
- **(FR-2.3)** A functional Product Inquiry Form that saves submissions to the backend.
- **(FR-2.4) Search & Filtering Page:** A comprehensive search page that now includes:
  - Keyword search.
  - Filtering by Product Type.
  - Dynamic generation of custom property filters (e.g., "Artist," "Origin") when a type is selected.
  - Partial, case-insensitive client-side filtering on custom properties for a user-friendly experience.
- **(FR-2.7)** The ability to view static content pages via dynamic routes.
- **(FR-2.8) Cookie Consent Banner:** A banner to inform users about cookie usage and request consent, which persists the user's choice.

---

### The Great Filter Debug: A Post-Mortem

The implementation of the advanced filtering feature (`FR-2.4`) was a complex multi-step process that revealed several critical "gotchas" about this specific Strapi API configuration. Documenting them is crucial for future development.

1.  **The Big Issue: Inconsistent API Data Structures.**

    - **Problem:** The Strapi API for this project returns data in two different formats:
      - A **flat structure** for a list of items (e.g., `GET /api/product-types`).
      - A **nested `attributes` structure** for a single item (e.g., `GET /api/product-types/1`).
    - **Resolution:** The code was refactored to handle this duality, correctly parsing the flat structure for lists and the nested structure for single-item lookups.

2.  **The Big Issue: The `findOne` Route (`/api/collection/:id`) is Inactive.**

    - **Problem:** All attempts to fetch a single item using the standard `/:id` route failed with a `404 Not Found` error.
    - **Resolution:** We adopted the project's established pattern of fetching a single item by using the `find` route with a filter, like `/api/product-types?filters[id][$eq]=1`. This workaround proved to be the key to unblocking the feature.

3.  **The Big Issue: The Relational Filter Key Name.**

    - **Problem:** When filtering `Products` by their `Product Type`, the API rejected several standard filter keys like `product` and `product[id]`.
    - **Resolution:** The final, correct filter key was determined to be `product_type`, based on Strapi's convention of using the collection's name for the relation key.

4.  **Final Architecture:** The most robust solution for the custom property search was a **hybrid approach**. The frontend makes a broad API call to get all products matching the keyword. Then, it uses **client-side JavaScript** to perform the fine-grained, partial, case-insensitive filtering on the custom properties. This provides the best user experience while working around the API's limitations.

---

### Remaining & Delayed Tasks

#### Delayed (Requires External Service Configuration)

- **(NFR-5.1) Transactional Email Service:** The inquiry form currently only saves to the Strapi log. The logic to send a real email notification via a service like Resend is postponed until a sending domain is configured.
- **(FR-2.3.1) Customer Inquiry Confirmation:** This is also part of the delayed email service implementation.

#### Remaining Features

- **(NFR-1.3) Accessibility (WCAG AA) (P2):** A full accessibility audit of all pages and components to ensure ARIA compliance and keyboard navigability.
- **(NFR-6.1) Third-Party Analytics (P2):** Integration with a service like Google Analytics, which will be contingent on the choice made in the cookie banner.
- **(FR-1.6) Product View Counts (P3):** A "nice-to-have" feature for the admin panel.
- **(FR-2.5 & FR-2.6) Product Favoriting (P3):** A "nice-to-have" feature for customers to save products to a list in their browser.

### Next Steps

The next logical step is to address the remaining P2 requirement: **NFR-1.3 Accessibility (WCAG AA)**. This involves auditing the existing components and pages to improve semantic HTML, add necessary ARIA attributes, ensure keyboard navigation works flawlessly, and check color contrast. This is an excellent next step as it improves the quality of what has already been built without adding new features.

---

## Project Structure (Updated)

online-product-catalog/
├── backend/
│ └── my-strapi-project/ # The Strapi v4 project
│ ├── .env # Strapi environment variables (database, etc.)
│ ├── config/ # Strapi configurations (database, plugins)
│ ├── database/ # Local SQLite database file (if used)
│ ├── public/
│ ├── src/
│ │ └── api/ # Contains the collection types
│ │ ├── product/
│ │ ├── page/
│ │ ├── inquiry/
│ │ └── product-type/
│ ├── node_modules/ # Dependencies (ignored by Git)
│ └── package.json
│
├── frontend/
│ ├── .env.local
│ ├── src/
│ │ └── app/
│ │ ├── [slug]/
│ │ │ └── page.tsx
│ │ ├── components/
│ │ │ ├── CookieConsentBanner.tsx
│ │ │ ├── Footer.tsx
│ │ │ ├── Header.tsx
│ │ │ └── ProductInquiryForm.tsx
│ │ ├── dashboard/
│ │ │ ├── actions.ts
│ │ │ ├── layout.tsx
│ │ │ ├── LoginForm.tsx
│ │ │ └── page.tsx
│ │ ├── products/
│ │ │ └── [id]/
│ │ │ └── page.tsx
│ │ ├── search/
│ │ │ └── page.tsx
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ └── page.tsx
│ └── ... (config files)
│
└── README.md

---

## Continuity Plan for New AI Instance

To bring a new AI instance up to speed, provide the following:

### 1. The High-Level Context (The "Why")

1.  **The Original Project Specification:** The first document outlining all requirements.
2.  **This `README.md` File:** This file contains the summary of what has been implemented, what remains, the overall project structure, and the critical "Post-Mortem" section detailing the specific behaviors of the Strapi API.

### 2. The Essential Code Files (The "What" and "How")

- **Backend Structure (Screenshots):** The screenshots of the `Product`, `Product Type`, and `Inquiry` Content-Type Builders are essential.
- **Frontend Core Logic:**
  - `frontend/src/app/page.tsx` (Homepage)
  - `frontend/src/app/products/[id]/page.tsx` (Product Detail, **our key reference for fetching single items**)
  - `frontend/src/app/search/page.tsx` (The fully implemented search/filter component)
  - `frontend/src/app/dashboard/layout.tsx` & `page.tsx` (Admin Dashboard)
  - `frontend/src/app/components/CookieConsentBanner.tsx`

### 3. How to Resume Work (The "What's Next")

Your next prompt to the new AI would be:

> "We have now implemented all P1 features and the Admin Dashboard. The next step is to address **NFR-1.3 Accessibility (WCAG AA)**. Let's start by auditing the **Product Details page** (`frontend/src/app/products/[id]/page.tsx`). Please review its code and suggest improvements for semantic HTML, ARIA roles, and keyboard accessibility, particularly for the image gallery."
