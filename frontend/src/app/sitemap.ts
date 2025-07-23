// frontend/src/app/sitemap.ts

import { MetadataRoute } from "next";

// --- START OF UPDATE ---
// 1. Define interfaces for both product and page data to ensure type safety.
interface ProductSitemapData {
  documentId: string;
  updatedAt: string;
}
interface PageSitemapData {
  Slug: string; // This must match the API ID of the "Slug" field in your Page content type
  updatedAt: string;
}
// --- END OF UPDATE ---

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";
const siteUrl = "https://www.alpialcanada.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: ProductSitemapData[] = [];
  let pages: PageSitemapData[] = [];

  try {
    // --- START OF UPDATE ---
    // 2. Fetch products and pages in parallel for better performance.
    const [productResponse, pageResponse] = await Promise.all([
      fetch(
        `${strapiUrl}/api/products?fields[0]=documentId&fields[1]=updatedAt`,
        { next: { revalidate: 3600 } }
      ),
      fetch(`${strapiUrl}/api/pages?fields[0]=Slug&fields[1]=updatedAt`, {
        next: { revalidate: 3600 },
      }),
    ]);

    if (productResponse.ok) {
      const productData = await productResponse.json();
      products = productData.data || [];
    } else {
      console.error("Failed to fetch products for sitemap.");
    }

    if (pageResponse.ok) {
      const pageData = await pageResponse.json();
      pages = pageData.data || [];
    } else {
      console.error("Failed to fetch pages for sitemap.");
    }
    // --- END OF UPDATE ---
  } catch (error) {
    console.error("Failed to fetch sitemap data:", error);
  }

  // Map product data to sitemap entries
  const productEntries: MetadataRoute.Sitemap = products.map(
    ({ documentId, updatedAt }) => ({
      url: `${siteUrl}/products/${documentId}`,
      lastModified: new Date(updatedAt),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  // --- START OF UPDATE ---
  // 3. Map dynamic page data from Strapi to sitemap entries.
  const pageEntries: MetadataRoute.Sitemap = pages.map(
    ({ Slug, updatedAt }) => ({
      url: `${siteUrl}/${Slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: "yearly", // Pages like "About Us" change infrequently
      priority: 0.6,
    })
  );
  // --- END OF UPDATE ---

  // Define static pages that are not in the CMS
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/search",
    "/favorites",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" ? 1.0 : 0.5,
  }));

  // --- START OF UPDATE ---
  // 4. Combine static routes, product entries, and the new page entries.
  return [...staticRoutes, ...productEntries, ...pageEntries];
  // --- END OF UPDATE ---
}
