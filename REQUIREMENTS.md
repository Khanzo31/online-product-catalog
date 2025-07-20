# Project Requirements & Technology Stack

This document outlines the requirements for the AlpialCanada Online Product Catalog Website. All listed requirements have been successfully implemented and the project is complete.

## 1. Project Overview

This document outlines the functional and non-functional requirements for a responsive online product catalog website. The system serves as a digital showcase for unique products, allowing the site owner to manage content and customers to browse, search, and inquire about products. The project does not include an integrated payment system; inquiries are handled via transactional email. The chosen technical architecture is a modern Headless (Jamstack) approach.

## 2. User Roles

- **Administrator (Owner):** The primary user responsible for managing all website content.
- **Customer (Visitor):** Any public user who visits the website to browse and inquire about products.

## 3. Functional Requirements

| ID       | Requirement Name                | Priority | Status      |
| :------- | :------------------------------ | :------- | :---------- |
| **FR-1** | **Administrator Features**      |          |             |
| FR-1.1   | Secure Admin Login              | P1       | Implemented |
| FR-1.3   | Product Creation                | P1       | Implemented |
| FR-1.4   | Product Management              | P1       | Implemented |
| FR-1.5   | Product Type Management         | P1       | Implemented |
| FR-1.7   | Inquiry Management Log          | P1       | Implemented |
| FR-1.8   | Static Page Management          | P1       | Implemented |
| FR-1.2   | Admin Dashboard                 | P2       | Implemented |
| FR-1.6   | Product View Counts             | P3       | Implemented |
| **FR-2** | **Customer / Visitor Features** |          |             |
| FR-2.1   | Home Page                       | P1       | Implemented |
| FR-2.2   | Product Details Page            | P1       | Implemented |
| FR-2.3   | Product Inquiry Form            | P1       | Implemented |
| FR-2.4   | Search & Filtering Page         | P1       | Implemented |
| FR-2.7   | View Static Content             | P1       | Implemented |
| FR-2.8   | Cookie Consent Banner           | P1       | Implemented |
| FR-2.3.1 | Customer Inquiry Confirmation   | P2       | Implemented |
| FR-2.5   | Product Favoriting              | P3       | Implemented |
| FR-2.6   | Favorites Page                  | P3       | Implemented |

## 4. Non-Functional Requirements

| ID        | Requirement Name              | Priority | Status      |
| :-------- | :---------------------------- | :------- | :---------- |
| **NFR-1** | **Usability & Design**        |          |             |
| NFR-1.1   | Responsive Design             | P1       | Implemented |
| NFR-1.2   | Browser Compatibility         | P1       | Implemented |
| NFR-1.3   | Accessibility (WCAG AA)       | P2       | Implemented |
| **NFR-2** | **Performance**               |          |             |
| NFR-2.1   | Fast Page Load Speed          | P1       | Implemented |
| NFR-2.2   | Image Optimization            | P1       | Implemented |
| **NFR-3** | **SEO**                       |          |             |
| NFR-3.1   | SEO-Friendly URLs             | P1       | Implemented |
| NFR-3.2   | Meta Tags                     | P1       | Implemented |
| NFR-3.3   | Structured Data (Schema)      | P1       | Implemented |
| NFR-3.4   | Sitemap.xml                   | P1       | Implemented |
| **NFR-4** | **Security**                  |          |             |
| NFR-4.1   | HTTPS Encryption              | P1       | Implemented |
| NFR-4.2   | Input Validation              | P1       | Implemented |
| NFR-4.3   | Secure Admin Passwords        | P1       | Implemented |
| **NFR-5** | **Reliability & Maintenance** |          |             |
| NFR-5.1   | Transactional Email Service   | P1       | Implemented |
| NFR-5.2   | Automated Backups             | P1       | Implemented |
| **NFR-6** | **Analytics & Monitoring**    |          |             |
| NFR-6.1   | Third-Party Analytics         | P2       | Implemented |

## 5. Technology Stack

| Component               | Technology       | Role & Justification                                                                 |
| :---------------------- | :--------------- | :----------------------------------------------------------------------------------- |
| **Front-End Framework** | **Next.js**      | Builds the high-performance, server-rendered user-facing website.                    |
| **Styling**             | **Tailwind CSS** | A utility-first CSS framework for rapid, responsive UI development.                  |
| **Back-End (CMS)**      | **Strapi**       | Headless CMS providing a user-friendly admin panel and a content API.                |
| **Database**            | **PostgreSQL**   | A powerful, open-source relational database for persistent data storage.             |
| **Media Storage**       | **Cloudinary**   | A cloud-based service for permanent storage, optimization, and delivery of images.   |
| **Email Service**       | **Resend**       | A transactional email API service to ensure reliable delivery of inquiry emails.     |
| **Front-End Hosting**   | **Vercel**       | A global hosting platform providing CI/CD and serving the `alpialcanada.com` domain. |
| **Back-End Hosting**    | **Render**       | A cloud platform used to host the Strapi CMS and PostgreSQL database.                |
