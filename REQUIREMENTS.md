# Project Requirements & Technology Stack

This document contains the original project specification for the Online Product Catalog Website.

## 1. Project Overview

This document outlines the functional and non-functional requirements for a responsive online product catalog website. The system will serve as a digital showcase for unique products, allowing the site owner to manage content and customers to browse, search, and inquire about products. The project will not include an integrated payment system; inquiries about payment will be handled via email communication. The chosen technical architecture is a modern Headless (Jamstack) approach to ensure high performance, security, and scalability.

## 2. User Roles

- **Administrator (Owner):** The primary user responsible for managing all website content, including products, pages, and viewing site analytics.
- **Customer (Visitor):** Any public user who visits the website to browse and inquire about products.

## 3. Functional Requirements

Functional requirements define the specific features and behaviors of the system.
**Priorities:**

- **P1:** Must-Have: Essential for the Minimum Viable Product (MVP).
- **P2:** Should-Have: High-value feature, to be included if possible.
- **P3:** Could-Have: Nice-to-have feature for future releases.

| ID       | Requirement Name                | Priority | Definition                                                                                                                                         |
| :------- | :------------------------------ | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR-1** | **Administrator Features**      |          |                                                                                                                                                    |
| FR-1.1   | Secure Admin Login              | P1       | The administrator must log in with a password to access a secure management panel.                                                                 |
| FR-1.3   | Product Creation                | P1       | The administrator can add new products with a name, SKU, description, multiple images, a designated product type, and price.                       |
| FR-1.4   | Product Management              | P1       | The administrator can view a list of all products and perform Edit or Delete operations on each.                                                   |
| FR-1.5   | Product Type Management         | P1       | The administrator can create, edit, and delete "Product Types" and define unique custom properties for each type.                                  |
| FR-1.7   | Inquiry Management Log          | P1       | The admin panel must contain a log of all customer inquiries submitted through the site, serving as a reliable backup to email.                    |
| FR-1.8   | Static Page Management          | P1       | The administrator can create, edit, and delete simple content pages (e.g., "About Us," "Privacy Policy") using a rich-text editor.                 |
| FR-1.2   | Admin Dashboard                 | P2       | A summary screen for the administrator showing key metrics like recent inquiries.                                                                  |
| FR-1.6   | Product View Counts             | P3       | The administrator can see a simple view counter on each individual product page.                                                                   |
| **FR-2** | **Customer / Visitor Features** |          |                                                                                                                                                    |
| FR-2.1   | Home Page                       | P1       | The main landing page of the site, which displays a gallery of the most recently added products.                                                   |
| FR-2.2   | Product Details Page            | P1       | A dedicated page for each product showing all its details, custom properties, and images.                                                          |
| FR-2.3   | Product Inquiry Form            | P1       | A form on each product page for customers to submit their name, email, and a message. The form will reference the product being inquired about.    |
| FR-2.4   | Search & Filtering Page         | P1       | A page where customers can search by keyword and filter results by Product Type and the custom properties associated with that type.               |
| FR-2.7   | View Static Content             | P1       | Customers can access and read static content pages created by the administrator.                                                                   |
| FR-2.8   | Cookie Consent Banner           | P1       | On first visit, a banner must inform users about the use of cookies/local storage for site functionality and analytics, and request their consent. |
| FR-2.3.1 | Customer Inquiry Confirmation   | P2       | An automated confirmation email is sent to the customer after they successfully submit an inquiry.                                                 |
| FR-2.5   | Product Favoriting              | P3       | Customers can save a product to a personal "Favorites" list that persists in their browser.                                                        |
| FR-2.6   | Favorites Page                  | P3       | A dedicated page showing all the items a customer has marked as a favorite.                                                                        |

## 4. Non-Functional Requirements

Non-functional requirements define the quality attributes and technical standards of the system.

| ID        | Requirement Name              | Priority | Definition                                                                                                                      |
| :-------- | :---------------------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **NFR-1** | **Usability & Design**        |          |                                                                                                                                 |
| NFR-1.1   | Responsive Design             | P1       | The website layout must be fully functional and visually appealing on desktop, tablet, and mobile devices.                      |
| NFR-1.2   | Browser Compatibility         | P1       | The site must function correctly on the latest two versions of major browsers (Chrome, Firefox, Safari, Edge).                  |
| NFR-1.3   | Accessibility (WCAG AA)       | P2       | The website should adhere to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.                                |
| **NFR-2** | **Performance**               |          |                                                                                                                                 |
| NFR-2.1   | Fast Page Load Speed          | P1       | All pages should achieve a "Good" score on Google's Core Web Vitals. Target a Largest Contentful Paint (LCP) under 2.5 seconds. |
| NFR-2.2   | Image Optimization            | P1       | All uploaded images must be automatically compressed and resized for optimal web performance.                                   |
| **NFR-3** | **SEO**                       |          |                                                                                                                                 |
| NFR-3.1   | SEO-Friendly URLs             | P1       | URLs must be clean, human-readable, and descriptive.                                                                            |
| NFR-3.2   | Meta Tags                     | P1       | The system must automatically generate unique `<title>` and `<meta name="description">` tags for each product page.             |
| NFR-3.3   | Structured Data (Schema)      | P1       | Product pages must include Schema.org Product markup to enable rich snippets in search engine results.                          |
| NFR-3.4   | Sitemap.xml                   | P1       | An `sitemap.xml` file must be automatically generated and updated.                                                              |
| **NFR-4** | **Security**                  |          |                                                                                                                                 |
| NFR-4.1   | HTTPS Encryption              | P1       | The entire website must be served over a secure SSL/TLS (HTTPS) connection.                                                     |
| NFR-4.2   | Input Validation              | P1       | All user-submitted data must be validated and sanitized on the server.                                                          |
| NFR-4.3   | Secure Admin Passwords        | P1       | Administrator passwords must be securely hashed and salted in the database.                                                     |
| **NFR-5** | **Reliability & Maintenance** |          |                                                                                                                                 |
| NFR-5.1   | Transactional Email Service   | P1       | The system must use a dedicated transactional email service for all outgoing mail.                                              |
| NFR-5.2   | Automated Backups             | P1       | The site files and database must be backed up automatically on a regular basis.                                                 |
| **NFR-6** | **Analytics & Monitoring**    |          |                                                                                                                                 |
| NFR-6.1   | Third-Party Analytics         | P2       | Integration with a web analytics service, contingent on user consent.                                                           |

## 5. Recommended Technology Stack

| Component               | Technology          | Role & Justification                                                                                                               |
| :---------------------- | :------------------ | :--------------------------------------------------------------------------------------------------------------------------------- |
| **Front-End Framework** | **Next.js (React)** | Builds the user-facing website. Chosen for its superior Server-Side Rendering (SSR) and Static Site Generation (SSG) capabilities. |
| **Styling**             | **Tailwind CSS**    | A utility-first CSS framework for rapidly building custom, responsive user interfaces.                                             |
| **Back-End (CMS)**      | **Strapi**          | A headless Content Management System that provides a user-friendly admin panel and a content API.                                  |
| **Database**            | **PostgreSQL**      | A powerful, open-source relational database used by Strapi.                                                                        |
| **Front-End Hosting**   | **Vercel**          | A global hosting platform optimized for Next.js.                                                                                   |
| **Back-End Hosting**    | **Render**          | A cloud platform used to host the Strapi CMS and PostgreSQL database.                                                              |
| **Email Service**       | **Resend**          | A transactional email API service to ensure reliable delivery of product inquiry emails.                                           |
