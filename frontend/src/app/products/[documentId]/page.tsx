// frontend/src/app/products/[documentId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { Product } from "@/types";

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

async function getProductData(documentId: string): Promise<Product | null> {
  const apiUrl = `${strapiUrl}/api/products?filters[documentId][$eq]=${documentId}&populate=*`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const responseData = await res.json();
    return responseData.data?.[0] || null;
  } catch (error) {
    console.error("Failed to fetch product data:", error);
    return null;
  }
}

type PagePromiseProps = {
  params: Promise<{ documentId: string }>;
};

export async function generateMetadata({
  params,
}: PagePromiseProps): Promise<Metadata> {
  const { documentId } = await params;
  const product = await getProductData(documentId);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for could not be found.",
    };
  }

  // Trust Signal: Ensure 'Vintage' or 'Antique' is in the description for clicks
  const baseDescription = product.Description
    ? product.Description.substring(0, 155).replace(/\s+/g, " ").trim() + "..."
    : "View details for this unique item on AlpialCanada.";

  const trustDescription = `Authentic Collection: ${baseDescription}`;

  // We allow the opengraph-image.tsx to handle the main OG image generation.
  // However, we provide a fallback here just in case.
  const imageUrl = product.Images?.[0]?.url
    ? product.Images[0].url.startsWith("http")
      ? product.Images[0].url
      : `${strapiUrl}${product.Images[0].url}`
    : undefined;

  return {
    title: `${product.Name} | AlpialCanada`,
    description: trustDescription,
    alternates: {
      canonical: `/products/${documentId}`,
    },
    openGraph: {
      title: product.Name,
      description: trustDescription,
      url: `https://www.alpialcanada.com/products/${documentId}`,
      siteName: "AlpialCanada",
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.Name,
      description: trustDescription,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: PagePromiseProps) {
  const { documentId } = await params;
  const product = await getProductData(documentId);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
