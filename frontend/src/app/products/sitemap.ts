// frontend/src/app/products/sitemap.ts

import { MetadataRoute } from "next";

interface ProductSitemapData {
  documentId: string;
  updatedAt: string;
}

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";
const siteUrl = "https://www.alpialcanada.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: ProductSitemapData[] = [];

  try {
    const response = await fetch(
      `${strapiUrl}/api/products?fields[0]=documentId&fields[1]=updatedAt`,
      { next: { revalidate: 3600 } }
    );

    if (response.ok) {
      const productData = await response.json();
      products = productData.data || [];
    } else {
      console.error("Failed to fetch products for sitemap.");
    }
  } catch (error) {
    console.error("Failed to fetch sitemap data:", error);
  }

  // Map product data to sitemap entries
  return products.map(({ documentId, updatedAt }) => ({
    url: `${siteUrl}/products/${documentId}`,
    lastModified: new Date(updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
}
