# SEO & Technical Health Requirements

This document outlines the advanced Search Engine Optimization (SEO) strategies implemented to ensure high visibility for unique antique items.

## 1. Core SEO Strategy

The site uses a "Long Tail" keyword strategy appropriate for unique items (e.g., "Vintage 1950s Diecast Truck" vs. just "Truck").

## 2. Advanced Implementation Details

| Feature                | Implementation                                                                                                                          | Benefit                                                                                                                    |
| :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Dynamic Open Graph** | `opengraph-image.tsx` generates PNGs on the fly using the product image, name, and price overlaid on a branded background.              | Increases click-through rates on social media (Facebook, iMessage, Twitter) by making shared links look professional.      |
| **Segmented Sitemaps** | `sitemap.ts` (Core) and `products/sitemap.ts` (Inventory).                                                                              | Helps Google crawl large inventories efficiently by separating static pages from dynamic product data.                     |
| **Enhanced Schema**    | JSON-LD includes `isSimilarTo` pointing to related products.                                                                            | Prevents "SEO Dead Ends." If a product is sold, the schema guides crawlers to related items, preserving ranking authority. |
| **Smart Alt Text**     | Fallback logic: Uses Strapi `alternativeText` if available, otherwise generates descriptive text: `"{Name} - View {Index} of {Total}"`. | Improvements ranking in Google Images, a critical traffic source for visual collectibles.                                  |
| **Rich Snippets**      | `Offer` schema includes `priceValidUntil` (dynamic +1 year) and `MerchantReturnPolicy`.                                                 | Qualifies product cards for "Rich Results" in Google Search (showing price/stock status directly in results).              |

## 3. URL Structure & Canonicalization

- **Canonical Tags:** Every page self-references via `<link rel="canonical" ... />` to prevent duplicate content issues if parameters are added to URLs.
- **Routing:** Uses stable `documentId` (string) identifiers: `/products/rlnf48...`.

## 4. Performance Vital Signs

- **Cumulative Layout Shift (CLS):** Minimized by using fixed aspect ratios for images and `skeleton` loaders during data fetching.
- **Largest Contentful Paint (LCP):** Optimized by prioritizing the loading of the main product image (`priority={true}`) on the Product Detail page.
