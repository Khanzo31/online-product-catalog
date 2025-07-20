// frontend/src/app/products/[documentId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient"; // 1. Import the new Client Component

// --- Type Definitions (can be shared by both components) ---
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
  // Exporting so the client component can use it
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

// --- Server-Side Data Fetching and Metadata Generation ---
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

type Props = {
  params: { documentId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductData(params.documentId);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for could not be found.",
    };
  }

  const description = product.Description
    ? product.Description.substring(0, 155).replace(/\s+/g, " ").trim() + "..."
    : "View details for this product on AlpialCanada.";

  return {
    title: `${product.Name} | AlpialCanada`,
    description: description,
    openGraph: {
      title: `${product.Name} | AlpialCanada`,
      description: description,
      images: product.Images?.[0]?.url
        ? [
            {
              url: product.Images[0].url.startsWith("http")
                ? product.Images[0].url
                : `${strapiUrl}${product.Images[0].url}`,
              width: product.Images[0].width,
              height: product.Images[0].height,
              alt: product.Name,
            },
          ]
        : [],
    },
  };
}

// --- The Main Page Component (Now a Server Component) ---
export default async function ProductPage({ params }: Props) {
  const product = await getProductData(params.documentId);

  if (!product) {
    notFound();
  }

  // 2. The Server Component renders the Client Component and passes the data as a prop
  return <ProductDetailClient product={product} />;
}
