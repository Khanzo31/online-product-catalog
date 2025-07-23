// frontend/src/app/products/[documentId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

// --- Type Definitions ---
interface ProductDetailImage {
  id: number;
  url: string;
  width: number;
  height: number;
  name: string;
}
interface ProductType {
  id: number;
  documentId: string;
  Name: string;
  CustomProperties?: { name: string; type: string }[];
}
export interface Product {
  id: number;
  documentId: string;
  Name: string;
  Price: number;
  Images: ProductDetailImage[];
  SKU: string;
  Description: string;
  CustomPropertyValues?: { [key: string]: string | number | boolean };
  Product?: ProductType;
}

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

  const description = product.Description
    ? product.Description.substring(0, 155).replace(/\s+/g, " ").trim() + "..."
    : "View details for this product on AlpialCanada.";

  const imageUrl = product.Images?.[0]?.url
    ? product.Images[0].url.startsWith("http")
      ? product.Images[0].url
      : `${strapiUrl}${product.Images[0].url}`
    : undefined;

  const imageMeta = imageUrl
    ? [
        {
          url: imageUrl,
          width: product.Images[0].width,
          height: product.Images[0].height,
          alt: product.Name,
        },
      ]
    : [];

  return {
    title: `${product.Name} | AlpialCanada`,
    description: description,
    // --- UPDATE: Added canonical URL for the product ---
    alternates: {
      canonical: `/products/${documentId}`,
    },
    openGraph: {
      title: `${product.Name} | AlpialCanada`,
      description: description,
      images: imageMeta,
    },
    // --- UPDATE: Added Twitter-specific card metadata ---
    twitter: {
      card: "summary_large_image",
      title: `${product.Name} | AlpialCanada`,
      description: description,
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
