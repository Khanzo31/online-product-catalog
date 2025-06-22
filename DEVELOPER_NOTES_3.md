# Developer Notes & Project History (Part 3 - The Great Upload Debug)

This document provides a definitive post-mortem of the complex debugging process required to enable image uploads on the production environment. It serves as a critical guide for understanding the application's hosting limitations and the established workaround.

## Project Status: Functionally Complete with Workaround

All P1/P2 features are implemented and the application is live. However, due to the inherent limitations of the free-tier hosting plan on Render, a specific workaround is required for a smooth content management experience when uploading multiple images.

- **Core Functionality:** All systems (data fetching, search, inquiries, dashboard) are fully operational.
- **Image Uploads:** Functional, but requires **pre-compressing images locally AND uploading them one at a time** to prevent server timeouts. This is the official and recommended procedure for content managers on the current hosting plan.

---

## The Great Upload Debug: A Chronological Post-Mortem

The process of enabling image uploads from the Strapi admin panel to a Cloudinary bucket revealed a cascade of issues stemming from the constraints of the free-tier hosting environment.

### 1. The Memory Crash

- **Symptom:** When uploading multiple high-resolution images, the process would hang and eventually fail. A "Web Service ... exceeded its memory limit" email was received from Render.
- **Root Cause:** Strapi's default behavior is to process uploaded files on its own server before sending them to a provider like Cloudinary. The large, multi-megabyte images consumed more RAM than was available on the Render Free Tier (512MB), causing the server instance to crash mid-upload.
- **Initial Workaround (Failure):** Pre-compressing images locally using `tinypng` and uploading them one-by-one still resulted in intermittent failures, proving the server limitations were extreme.

### 2. The Direct Upload Configuration Attempt

- **Goal:** To bypass the Render server entirely for uploads, preventing memory usage by having the browser upload directly to Cloudinary.
- **Implementation:**
  1. An `Unsigned` upload preset named `strapi-unsigned-uploads` was created in Cloudinary.
  2. The `config/plugins.ts` file in Strapi was updated to reference this preset. The key learning was that the `preset` key must be placed inside `actionOptions.upload` to enable client-side uploads, not inside `providerOptions`.
- **Symptom:** After this change, uploads created **duplicate files** in the Cloudinary Media Library and the delivered image URL from Strapi was missing the desired transformation rule. This proved that the direct upload was succeeding, but the final confirmation step from the browser back to the Strapi server was failing and being retried.

### 3. The Final Bottleneck: Concurrency & Timeouts

- **Symptom:** Even when uploading a single, uncompressed image, the process would fail in the Strapi UI with a generic `Failed to execute 'json' on 'Response': Unexpected end of JSON input` error.
- **Root Cause:** This partial success proved that all configurations (CORS, Cloudinary Preset, `plugins.ts`) were finally correct. The new, ultimate bottleneck was the **processing power and concurrency limitations** of the Render Free Tier. The server could not even reliably handle the single, lightweight API confirmation call from the browser after a successful upload to Cloudinary. The connection would die before the server could respond, resulting in the JSON error.

### 4. Final Resolution (The Official Workaround)

- **The "Compress and One-by-One" Method:** To work within the server's extreme limitations, both the file size and the number of requests must be minimized. This is the only reliable method.
- **Procedure:**
  1. **Pre-compress the image:** Use a service like [tinypng.com](https://tinypng.com/) to shrink the image file size, ideally to under 500 KB.
  2. **Upload one at a time:** In the "Add new assets" modal, select and upload **only one compressed image**.
  3. Wait for the upload to complete successfully.
  4. Click "Add more assets" and repeat the process for each subsequent compressed image.
- **Result:** This method was successful. It uses Cloudinary for the heavy lifting (which was already configured) and critically, it sends a much smaller source file and gives the free-tier server enough time to process the single, lightweight confirmation step without being overwhelmed.

---

## Final Key Learnings

- **Free Tiers Have Multiple Limits:** The primary constraint is not just RAM, but also CPU and the ability to handle even single, lightweight API requests in a timely manner. A feature that works perfectly on a local machine can fail in production due to these non-memory-related bottlenecks.
- **Browser Errors Can Be Misleading:** The `Unexpected end of JSON input` error was a generic symptom of a severed connection. The true cause was a server timeout during the final API confirmation step.
- **Duplicate Files are a Powerful Clue:** The appearance of duplicate assets in Cloudinary was the key piece of information that proved the direct upload itself was working, but the confirmation from the browser to the Strapi server was failing and being retried.
- **The Official Workaround is Necessary:** Until the project is moved to a paid hosting plan (e.g., Render Starter), the **"Compress and One-by-One"** upload method is the required and only reliable way to add images.
