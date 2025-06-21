# Project: Online Product Catalog Website

This repository contains the source code for a responsive online product catalog website built with a modern Headless (Jamstack) architecture. The system serves as a digital showcase for unique products, allowing the site owner to manage content and customers to browse, search, and inquire about products.

## 🚀 Project Status: Deployed & Live for Testing

All core P1, P2, and P3 requirements are implemented. The application has been successfully deployed to a live production environment and is ready for third-party user testing and content population.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com)
[![Deploy with Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

### Live Demo URLs

- **Frontend Website:** `https://<your-vercel-app-name>.vercel.app`
- **Backend Admin Panel:** `https://my-strapi-backend-l5qf.onrender.com`

---

## Implemented Features

The application is functionally complete according to the project specification.

#### Administrator Features

- **(FR-1.1)** Secure Administrator Login to a management panel.
- **(FR-1.3)** Product Creation with name, SKU, description, images, price, and type.
- **(FR-1.4)** Full Product Management (View, Edit, Delete).
- **(FR-1.5)** Product Type Management (Create, Edit, Delete categories and custom properties).
- **(FR-1.7)** Inquiry Management Log to store all customer inquiries.
- **(FR-1.8)** Static Page Management for "About Us," "Privacy Policy," etc.
- **(FR-1.2) Admin Dashboard (P2):** A password-protected dashboard showing key site metrics.
- **(FR-1.6) Product View Counts (P3):** A simple view counter on each product that is visible in the Strapi admin panel.
- **(NFR-4.2)** Secure server-side form validation and cookie-based authentication.

#### Customer / Frontend Features

- **(FR-2.1)** A Home Page displaying a gallery of products.
- **(FR-2.2)** A dynamic Product Details Page for each item.
- **(FR-2.3)** A functional Product Inquiry Form that saves submissions to the backend.
- **(FR-2.4)** A comprehensive Search & Filtering Page.
- **(FR-2.7)** The ability to view static content pages via dynamic routes.
- **(FR-2.8)** Cookie Consent Banner that persists user's choice.
- **(FR-2.5 & FR-2.6) Product Favoriting (P3):** Customers can save products to a "Favorites" list, which is accessible via a dedicated page with a live-updating count in the header.
- **(NFR-1.1 & NFR-1.2)** A fully responsive design compatible with modern browsers.
- **(NFR-1.3) Accessibility (WCAG AA) (P2):** A full accessibility audit has been completed.
- **(NFR-6.1) Third-Party Analytics (P2):** Consent-aware integration with Google Analytics.

---

## Technology Stack & Infrastructure

| Component               | Technology / Service | Role & Justification                                                                          |
| :---------------------- | :------------------- | :-------------------------------------------------------------------------------------------- |
| **Front-End Framework** | **Next.js (React)**  | Builds the user-facing website with server-side rendering for high performance.               |
| **Styling**             | **Tailwind CSS**     | A utility-first CSS framework for rapid, responsive UI development.                           |
| **Back-End (CMS)**      | **Strapi**           | Headless CMS providing a user-friendly admin panel and a content API.                         |
| **Database**            | **PostgreSQL**       | A powerful, open-source relational database for persistent data storage.                      |
| **Media Storage**       | **Cloudinary**       | A cloud-based service for permanent storage and delivery of image uploads.                    |
| **Front-End Hosting**   | **Vercel**           | A global hosting platform optimized for Next.js, providing continuous deployment from GitHub. |
| **Back-End Hosting**    | **Render**           | A cloud platform used to host the Strapi CMS and PostgreSQL database.                         |

---

## Next Steps

With the application now live, the final tasks involve integrating third-party services to complete the user journey and enhance search visibility.

### 1. Final Core Functionality: Email Integration (High Priority)

This is the last critical step to make the inquiry system fully operational. It involves integrating a transactional email service so that product inquiries are sent to the administrator and confirmed with the customer.

- **(NFR-5.1)** Integrate a transactional email service (e.g., **Resend**).
- **(FR-2.3.1)** Send an automated confirmation email to the customer after an inquiry.

### 2. Technical Enhancement: SEO (P1)

These tasks are essential for optimizing the website's visibility in search engines.

- **(NFR-3.2)** Dynamically generate unique `<title>` and `<meta name="description">` tags for each product page.
- **(NFR-3.3)** Add structured data (`Product` schema from Schema.org) to product pages.
- **(NFR-3.4)** Automatically generate a `sitemap.xml` file.

---

## Local Development Setup

To run this project on a local machine, follow these steps.

### Prerequisites

- Node.js (v18 or later)
- npm
- Git

### 1. Backend (Strapi)

```bash
# 1. Navigate to the backend directory
cd backend/my-strapi-project

# 2. Create an environment file from the example
cp .env.example .env

# 3. Fill in the .env file with your local database details and new secret keys.
#    For local development, you can leave the database variables commented out
#    to use the default SQLite database.

# 4. Install dependencies
npm install

# 5. Run the development server
npm run develop
```

The Strapi admin panel will be available at http://localhost:1337/admin.

# 1. Navigate to the frontend directory

cd frontend

# 2. Create a local environment file

cp .env.local.example .env.local

# 3. Edit .env.local to point to your local Strapi instance

NEXT_PUBLIC_STRAPI_API_URL=http://127.0.0.1:1337

# ...add other variables like dashboard password

# 4. Install dependencies

npm install

# 5. Run the development server

npm run dev

The frontend website will be available at http://localhost:3000.
