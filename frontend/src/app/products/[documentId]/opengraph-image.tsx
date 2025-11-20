// frontend/src/app/products/[documentId]/opengraph-image.tsx

import { ImageResponse } from "next/og";
import { Product } from "@/types";

export const runtime = "edge";

export const alt = "AlpialCanada Product Detail";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

async function getProduct(documentId: string): Promise<Product | null> {
  const res = await fetch(
    `${strapiUrl}/api/products?filters[documentId][$eq]=${documentId}&populate=Images`
  );
  const data = await res.json();
  return data.data?.[0] || null;
}

export default async function Image({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const product = await getProduct(documentId);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: "#f9f6f2",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
          }}
        >
          AlpialCanada
        </div>
      ),
      { ...size }
    );
  }

  const imageUrl = product.Images?.[0]?.url
    ? product.Images[0].url.startsWith("http")
      ? product.Images[0].url
      : `${strapiUrl}${product.Images[0].url}`
    : null;

  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  });

  return new ImageResponse(
    (
      <div
        style={{
          background: "#f9f6f2", // warm-bg
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Left Side: Image */}
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.Name}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#e5e7eb",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                fontSize: 24,
              }}
            >
              No Image
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#dc2626", // red-600
              marginBottom: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            AlpialCanada
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#111827",
              lineHeight: 1.1,
              marginBottom: 20,
              // Clamp text length visually
              display: "flex",
            }}
          >
            {product.Name}
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#4b5563",
              fontWeight: 600,
            }}
          >
            {priceFormatter.format(product.Price)}
          </div>
          <div
            style={{
              marginTop: 40,
              fontSize: 18,
              color: "#6b7280",
            }}
          >
            Unique Antiques & Collectibles
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
