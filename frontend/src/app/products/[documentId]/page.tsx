// frontend/src/app/products/[documentId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { Product } from "@/types";
import { cookies } from "next/headers"; // Import cookies

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

  const baseDescription = product.Description
    ? product.Description.substring(0, 155).replace(/\s+/g, " ").trim() + "..."
    : "View details for this unique item on AlpialCanada.";

  const trustDescription = `Authentic Collection: ${baseDescription}`;

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

  // --- CHECK ADMIN COOKIE ---
  const cookieStore = await cookies();
  const password = cookieStore.get("dashboard_password")?.value;
  const isAdmin = password === process.env.DASHBOARD_PASSWORD;

  if (!product) {
    notFound();
  }

  // Pass isAdmin status to client
  return <ProductDetailClient product={product} isAdmin={isAdmin} />;
}
