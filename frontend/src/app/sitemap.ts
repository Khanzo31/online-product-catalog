// frontend/src/app/sitemap.ts

import { MetadataRoute } from "next";

interface PageSitemapData {
  Slug: string;
  updatedAt: string;
}

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";
const siteUrl = "https://www.alpialcanada.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let pages: PageSitemapData[] = [];

  try {
    const pageResponse = await fetch(
      `${strapiUrl}/api/pages?fields[0]=Slug&fields[1]=updatedAt`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (pageResponse.ok) {
      const pageData = await pageResponse.json();
      pages = pageData.data || [];
    } else {
      console.error("Failed to fetch pages for sitemap.");
    }
  } catch (error) {
    console.error("Failed to fetch sitemap data:", error);
  }

  // Map dynamic page data from Strapi to sitemap entries.
  const pageEntries: MetadataRoute.Sitemap = pages.map(
    ({ Slug, updatedAt }) => ({
      url: `${siteUrl}/${Slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: "yearly",
      priority: 0.6,
    })
  );

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

  return [...staticRoutes, ...pageEntries];
}
