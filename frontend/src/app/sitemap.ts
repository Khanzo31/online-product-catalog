// frontend/src/app/sitemap.ts

import { MetadataRoute } from "next";

// --- START OF FIX ---
// 1. Simplify the interface. We will add priority/changeFrequency later.
interface ProductSitemapData {
  documentId: string;
  updatedAt: string;
}
// --- END OF FIX ---

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";
const siteUrl = "https://www.alpialcanada.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: ProductSitemapData[] = [];
  try {
    const res = await fetch(
      `${strapiUrl}/api/products?fields[0]=documentId&fields[1]=updatedAt`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const responseData = await res.json();
      products = responseData.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
  }

  // --- START OF FIX ---
  // 2. Map product data and ensure `lastModified` is a Date object.
  const productEntries: MetadataRoute.Sitemap = products.map(
    ({ documentId, updatedAt }) => ({
      url: `${siteUrl}/products/${documentId}`,
      lastModified: new Date(updatedAt), // Ensures this is always a Date object
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );
  // --- END OF FIX ---

  // 3. Define static pages (no change here, this part was correct)
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

  // 4. Combine static and dynamic routes
  return [...staticRoutes, ...productEntries];
}
