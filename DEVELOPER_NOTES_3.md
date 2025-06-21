# Developer Notes & Project History (Part 3 - The Great Upload Debug)

This document provides a definitive post-mortem of the complex debugging process required to enable image uploads on the production environment. It serves as a critical guide for understanding the application's hosting limitations and the established workaround.

## Project Status: Functionally Complete with Workaround

All P1/P2 features are implemented and the application is live. However, due to the inherent limitations of the free-tier hosting plan on Render, a specific workaround is required for a smooth content management experience when uploading multiple images.

- **Core Functionality:** All systems (data fetching, search, inquiries, dashboard) are fully operational.
- **Image Uploads:** Functional, but requires uploading images one at a time to prevent server timeouts. This is the official and recommended procedure for content managers on the current hosting plan.

---

## The Great Upload Debug: A Chronological Post-Mortem

The process of enabling image uploads from the Strapi admin panel to a Cloudinary bucket revealed a cascade of issues stemming from the constraints of the free-tier hosting environment.

### 1. The Memory Crash

- **Symptom:** When uploading multiple high-resolution images, the process would hang and eventually fail with a generic `Failed to execute 'json' on 'Response': Unexpected end of JSON input` error in the browser. A "Web Service ... exceeded its memory limit" email was received from Render.
- **Root Cause:** Strapi's default behavior is to process uploaded files on the server before sending them to a provider like Cloudinary. The large, multi-megabyte images from Unsplash consumed more RAM than was available on the Render Free Tier (512MB), causing the server instance to crash mid-upload.
- **Resolution Attempt #1 (Failure):** Pre-compressing images locally using `tinypng` still caused a memory crash, proving the memory limit was extremely restrictive.

### 2. The Direct Upload Configuration

- **Goal:** To bypass the server entirely for uploads, preventing memory usage.
- **Implementation:**
  1. An `Unsigned` upload preset was created in Cloudinary to allow direct uploads from a browser.
  2. An incoming transformation (`w_1600,c_scale,q_auto`) was added to this preset to automatically resize and optimize all uploads.
  3. The `plugins.ts` file in Strapi was updated to reference this preset via a `CLOUDINARY_UPLOAD_PRESET` environment variable.
- **Symptom:** The memory crash and JSON error persisted. This proved the direct-upload mechanism was not being triggered, and uploads were still being routed through the server.

### 3. The Missing "Cloudinary" Tab & The CSP/CORS Rabbit Hole

- **Symptom:** A thorough check of the Strapi Media Library revealed the "Cloudinary" tab (for browsing the Cloudinary library directly) was missing. This was the key clue that the plugin was not initializing correctly.
- **Investigation & Resolution Path:**
  1. **Clean Re-install:** A full, clean re-installation of all backend `node_modules` was performed to rule out a corrupted dependency. The issue persisted.
  2. **Content Security Policy (CSP):** It was hypothesized that Strapi's default security policy was blocking the plugin's UI from loading. The `config/middlewares.ts` file was updated to add `res.cloudinary.com` to the `img-src` and `media-src` directives. The issue persisted.
  3. **Cross-Origin Resource Sharing (CORS):** The investigation then shifted to network requests. The final hypothesis was that while the direct upload to Cloudinary might be working, the final confirmation `POST` from the admin panel back to the Strapi server was being blocked by CORS policy. The `config/middlewares.ts` file was updated again with an expanded `strapi::cors` configuration, explicitly listing the backend and frontend URLs in the `origin` array.

### 4. The Final Bottleneck: Concurrency & Timeouts

- **Symptom:** After all configuration fixes, the behavior changed slightly but critically: when uploading multiple images, **one** image would successfully upload, while the others would fail with the same JSON error.
- **Root Cause:** This partial success proved that all configurations (CSP, CORS, Cloudinary Preset) were finally correct. The new bottleneck was the **processing power and concurrency limitations** of the Render Free Tier. The server could handle the single API confirmation call from the first successful upload, but it could not handle the rapid, near-simultaneous API calls from the second, third, etc., uploads. This caused the server process to hang and the connection to time out, leading to the JSON error for all subsequent images.

### 5. Final Resolution (The Official Workaround)

- **The "One-by-One" Method:** To work within the server's limitations, images must be uploaded sequentially.
- **Procedure:**
  1. In the "Add new assets" modal, select and upload **only one** image.
  2. Wait for the upload to complete successfully.
  3. Click "Add more assets" and repeat the process for each subsequent image.
- **Result:** This method was successful. It correctly uses Cloudinary for the heavy lifting and gives the free-tier server enough time to process each confirmation step individually without being overwhelmed.

---

## Final Key Learnings

- **Free Tiers Have Multiple Limits:** The primary constraint is not just RAM, but also CPU and the ability to handle concurrent requests. A feature that works perfectly on a local machine can fail in production due to these non-memory-related bottlenecks.
- **Browser Errors Can Be Misleading:** The `Unexpected end of JSON input` error was a generic symptom of a severed connection. The true cause evolved from a server crash (memory), to a CORS block, and finally to a server timeout (concurrency).
- **Partial Success is a Powerful Clue:** The fact that one upload worked while others failed was the key piece of information that allowed us to eliminate configuration issues and pinpoint the concurrency limitation as the final root cause.
- **The Official Workaround is Necessary:** Until the project is moved to a paid hosting plan (e.g., Render Starter), the "one-by-one" upload method is the required and only reliable way to add multiple images to a product.
