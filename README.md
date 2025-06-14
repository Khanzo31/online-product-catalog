# Project: Online Product Catalog Website

This repository contains the source code for a responsive online product catalog website built with a modern Headless (Jamstack) architecture. The system serves as a digital showcase for unique products, allowing the site owner to manage content and customers to browse, search, and inquire about products.

## Project Status: MVP Complete

The core features for a Minimum Viable Product (MVP) have been successfully implemented. The application is functional and allows users to view and inquire about products, and for the administrator to manage the site's content.

### Implemented Features (P1 - Must-Haves)

#### Administrator / Backend (Strapi)

- **(FR-1.1)** Secure Administrator Login to a management panel.
- **(FR-1.3)** Product Creation with name, SKU, description, images, price, and type.
- **(FR-1.4)** Full Product Management (View, Edit, Delete).
- **(FR-1.5)** Product Type Management (Create, Edit, Delete categories like "Artwork").
- **(FR-1.7)** Inquiry Management Log to store all customer inquiries.
- **(FR-1.8)** Static Page Management for "About Us," "Privacy Policy," etc.

#### Customer / Frontend (Next.js)

- **(FR-2.1)** A Home Page displaying a gallery of products.
- **(FR-2.2)** A dynamic Product Details Page for each item.
- **(FR-2.3)** A functional Product Inquiry Form that saves submissions to the backend.
- **(FR-2.4)** A comprehensive Search & Filtering Page with keyword and product type filtering.
- **(FR-2.7)** The ability to view static content pages via dynamic routes.

#### Non-Functional Requirements

- **(NFR-1.1)** A fully Responsive Design that works on desktop, tablet, and mobile.
- **(NFR-3.1)** Clean, SEO-Friendly URLs for products and pages.
- **(NFR-4.3)** Secure Admin Passwords (handled by Strapi's built-in hashing).

---

### Remaining & Delayed Tasks

The following features and requirements from the original specification are pending implementation.

#### Delayed (Requires External Service Configuration)

- **(NFR-5.1) Transactional Email Service:** The inquiry form currently only saves to the Strapi log. The logic to send a real email notification to the site owner via a service like Resend has been postponed.
- **(FR-2.3.1) Customer Inquiry Confirmation:** The automated confirmation email to the customer is also part of the delayed email service implementation.

#### Remaining Features

- **(FR-2.4 - Part 2) Filter by Custom Properties:** The search page does not yet filter by custom properties associated with a Product Type (e.g., filtering Artwork by "Artist").
- **(FR-2.8) Cookie Consent Banner:** A banner to inform users about cookie usage and request consent has not yet been implemented. This is a high-priority task for compliance.
- **(FR-1.2) Admin Dashboard (P2):** A summary screen for the administrator with key metrics.
- **(NFR-1.3) Accessibility (WCAG AA) (P2):** A full accessibility audit and implementation of ARIA attributes.
- **(NFR-6.1) Third-Party Analytics (P2):** Integration with a service like Google Analytics, contingent on the cookie banner.
- **(FR-1.6 & FR-2.5 & FR-2.6) Product View Counts & Favoriting (P3):** "Nice-to-have" features planned for future releases.

---

## Project Structure

The project is organized as a monorepo with two main folders: `frontend` and `backend`.

online-product-catalog/
├── .git/ # Git version control directory
├── .gitignore # Specifies files for Git to ignore (node_modules, .env\*)
├── backend/
│ └── my-strapi-project/ # The Strapi v4 project
│ ├── .env # Strapi environment variables
│ ├── config/ # Strapi configurations (database, plugins)
│ ├── database/ # Local SQLite database file
│ ├── public/
│ ├── src/
│ │ └── api/ # Contains the collection types (product, page, etc.)
│ └── package.json
│
├── frontend/
│ ├── .env.local # Next.js environment variables (API keys, etc.)
│ ├── .next/ # Next.js build output (ignored by Git)
│ ├── node_modules/ # Project dependencies (ignored by Git)
│ ├── public/ # Static assets (images, fonts)
│ ├── src/
│ │ └── app/
│ │ ├── [slug]/ # Dynamic route for static pages (About, etc.)
│ │ │ └── page.tsx
│ │ ├── components/ # Reusable React components
│ │ │ ├── Footer.tsx
│ │ │ ├── Header.tsx
│ │ │ └── ProductInquiryForm.tsx
│ │ ├── products/
│ │ │ └── [id]/ # Dynamic route for product detail pages
│ │ │ └── page.tsx
│ │ ├── search/
│ │ │ └── page.tsx
│ │ ├── globals.css # Global styles
│ │ ├── layout.tsx # The root layout with Header and Footer
│ │ └── page.tsx # The Home Page
│ ├── next.config.js # Next.js configuration
│ ├── package.json
│ ├── postcss.config.js
│ └── tailwind.config.js
│
└── README.md # This file
