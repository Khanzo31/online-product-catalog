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
            background: "#f5f5f4", // stone-100
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#444",
            fontFamily: "serif",
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
          background: "#f5f5f4", // stone-100
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          fontFamily: "Times New Roman, serif", // Enforce serif
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
                borderRadius: "4px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                backgroundColor: "white",
                padding: "10px",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#e7e5e4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#78716c",
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
            padding: "50px",
            borderLeft: "1px solid #d6d3d1",
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: "#b45309", // amber-700
              marginBottom: 15,
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "4px",
            }}
          >
            AlpialCanada
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#1c1917", // stone-900
              lineHeight: 1,
              marginBottom: 30,
              display: "flex",
            }}
          >
            {product.Name}
          </div>
          <div
            style={{
              fontSize: 42,
              color: "#44403c", // stone-700
              fontWeight: 400,
              fontStyle: "italic",
            }}
          >
            {priceFormatter.format(product.Price)}
          </div>
          <div
            style={{
              marginTop: 60,
              fontSize: 16,
              color: "#78716c",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Antiques & Collectibles
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
