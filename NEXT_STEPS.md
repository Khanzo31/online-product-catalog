# Project: AlpialCanada Online Product Catalog

This repository contains the source code for a responsive online product catalog website built with a modern Headless (Jamstack) architecture.

## 🚀 Project Status: Functionally Complete & Live

All P1, P2, and P3 user-facing features are now implemented and deployed. The application is live and fully functional on its custom domain, including transactional emails for inquiries. The only remaining tasks are technical SEO enhancements.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com)
[![Deploy with Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

### Live Demo URLs

- **Frontend Website:** `https://www.alpialcanada.com`
- **Backend Admin Panel:** `https://my-strapi-backend-l5qf.onrender.com/admin`

---

## Technology Stack & Infrastructure

| Component               | Technology / Service | Role & Justification                                                                     |
| :---------------------- | :------------------- | :--------------------------------------------------------------------------------------- |
| **Front-End Framework** | **Next.js (React)**  | Builds the user-facing website with server-side rendering for high performance.          |
| **Styling**             | **Tailwind CSS**     | A utility-first CSS framework for rapid, responsive UI development.                      |
| **Back-End (CMS)**      | **Strapi**           | Headless CMS providing a user-friendly admin panel and a content API.                    |
| **Database**            | **PostgreSQL**       | A powerful, open-source relational database for persistent data storage.                 |
| **Media Storage**       | **Cloudinary**       | A cloud-based service for permanent storage and delivery of image uploads.               |
| **Email Service**       | **Resend**           | A transactional email API service to ensure reliable delivery of product inquiry emails. |
| **Front-End Hosting**   | **Vercel**           | A global hosting platform providing continuous deployment from GitHub.                   |
| **Back-End Hosting**    | **Render**           | A cloud platform used to host the Strapi CMS and PostgreSQL database.                    |

---

## Next Steps: Final Enhancements

With all core functionality complete, the final phase involves technical enhancements to maximize the site's visibility and performance.

### 1. SEO Implementation (P1)

These tasks are essential for optimizing the website's visibility in search engines.

- **(NFR-3.2)** Dynamically generate unique `<title>` and `<meta name="description">` tags for each product page using Next.js `generateMetadata`.
- **(NFR-3.3)** Add structured data (`Product` schema from Schema.org) to product pages for rich snippets.
- **(NFR-3.4)** Automatically generate a `sitemap.xml` file to help search engines discover all pages.

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

# 3. Fill in the .env file with your local database details,
#    new secret keys, and your Resend API Key.

# 4. Install dependencies
npm install

# 5. Run the development server
npm run develop
```

The Strapi admin panel will be available at `http://localhost:1337/admin`.

### 2. Frontend (Next.js)

```bash
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
```

The frontend website will be available at `http://localhost:3000`.
