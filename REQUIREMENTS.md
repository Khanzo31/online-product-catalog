# Project Requirements & Technology Stack

This document outlines the requirements for the AlpialCanada Online Product Catalog Website. All listed requirements have been successfully implemented.

## 1. Project Overview

A responsive online product catalog for unique antiques and collectibles. The system serves as a digital showcase allowing the site owner to manage content via Strapi and "God Mode" frontend tools, while customers browse a gallery-style interface.

## 2. User Roles

- **Administrator (Owner):** Manages content via Strapi or directly through the frontend using Admin Mode.
- **Customer (Visitor):** Browses, searches, saves favorites, and inquiries about products.

## 3. Functional Requirements

| ID       | Requirement Name           | Status      | Notes                                                |
| :------- | :------------------------- | :---------- | :--------------------------------------------------- |
| **FR-1** | **Core Administration**    |             |                                                      |
| FR-1.1   | Secure Dashboard Login     | Implemented | Cookie-based auth with server-side validation.       |
| FR-1.2   | Inquiry Management         | Implemented | View inquiries, click-to-email customers.            |
| FR-1.3   | Quick Statistics           | Implemented | Dashboard overview of total inventory and inquiries. |
| **FR-2** | **"God Mode" Admin Tools** |             |                                                      |
| FR-2.1   | Admin Toolbar              | Implemented | Red bar appears on frontend when logged in.          |
| FR-2.2   | Frontend Deletion          | Implemented | Delete products directly from the product page.      |
| FR-2.3   | Direct Edit Link           | Implemented | One-click navigation from frontend to Strapi Admin.  |
| **FR-3** | **Customer Experience**    |             |                                                      |
| FR-3.1   | Gallery Interface          | Implemented | "Warm Stone" aesthetic with serif typography.        |
| FR-3.2   | Advanced Search            | Implemented | Live filtering, debounced input, category selection. |
| FR-3.3   | Image Lightbox             | Implemented | Full-screen zoomable image gallery.                  |
| FR-3.4   | Recently Viewed            | Implemented | LocalStorage-based history strip.                    |
| FR-3.5   | Favorites System           | Implemented | Persisted wishlist functionality.                    |
| FR-3.6   | Smart "No Results"         | Implemented | Shows history/suggestions instead of empty state.    |

## 4. Non-Functional Requirements

| ID        | Requirement Name            | Status      | Notes                                                   |
| :-------- | :-------------------------- | :---------- | :------------------------------------------------------ |
| **NFR-1** | **Performance**             |             |                                                         |
| NFR-1.1   | Dynamic Image Optimization  | Implemented | Next.js Image component with Cloudinary.                |
| NFR-1.2   | Server-Side Rendering (SSR) | Implemented | SEO-critical pages render on the server.                |
| **NFR-2** | **Security**                |             |                                                         |
| NFR-2.1   | Admin Token Security        | Implemented | Admin cookies are HTTP-only; Tokens hidden server-side. |
| NFR-2.2   | Input Sanitization          | Implemented | React handles escaping to prevent XSS.                  |
| NFR-2.3   | SSRF Protection             | Implemented | Local image optimization disabled in dev mode.          |

## 5. Technology Stack

| Component               | Technology      | Role & Version                                              |
| :---------------------- | :-------------- | :---------------------------------------------------------- |
| **Front-End Framework** | **Next.js 16**  | React framework (App Router) for SSR and Static Generation. |
| **Styling**             | **Tailwind v4** | Utility-first CSS with Typography plugin.                   |
| **Back-End (CMS)**      | **Strapi v5**   | Headless CMS for content management.                        |
| **Database**            | **PostgreSQL**  | Persistent data storage (Hosted on Render).                 |
| **Media Storage**       | **Cloudinary**  | Cloud-based image optimization and delivery.                |
| **Email Service**       | **Resend**      | Transactional emails for inquiry notifications.             |
