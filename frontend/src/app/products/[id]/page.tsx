"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import ProductInquiryForm from "@/app/components/ProductInquiryForm";

// =================================================================================
// 1. TYPE DEFINITIONS
// =================================================================================

interface StrapiImage {
  id: number;
  url: string;
  width: number;
  height: number;
  name: string;
}

interface Product {
  id: number;
  Name: string;
  SKU: string;
  Description: string;
  Price: number;
  Images: StrapiImage[];
}

// =================================================================================
// 2. PRODUCT DETAIL PAGE COMPONENT
// =================================================================================

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<StrapiImage | null>(null);

  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `${strapiUrl}/api/products?filters[id][$eq]=${id}&populate=Images`;
        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error("Failed to fetch product data from the server");
        }

        const responseData = await res.json();
        const productObject = responseData.data?.[0];

        if (!productObject) {
          notFound();
          return;
        }

        setProduct(productObject);

        if (productObject.Images?.length > 0) {
          setSelectedImage(productObject.Images[0]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, strapiUrl]);

  if (loading)
    return (
      <div className="container mx-auto text-center py-20">
        Loading product...
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto text-center py-20 text-red-500">
        Error: {error}
      </div>
    );
  if (!product) return notFound();

  const { Name, Price, Description, Images } = product;
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Image Gallery Section */}
        <div>
          <div className="aspect-square relative mb-4 overflow-hidden rounded-lg border bg-gray-100">
            {selectedImage ? (
              <Image
                src={`${strapiUrl}${selectedImage.url}`}
                alt={selectedImage.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            {Images?.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                  selectedImage?.id === img.id
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-400"
                }`}
              >
                {" "}
                <Image
                  src={`${strapiUrl}${img.url}`}
                  alt={img.name}
                  fill
                  className="object-cover"
                />{" "}
              </button>
            ))}
          </div>
        </div>
        {/* Product Details Section */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {Name}
          </h1>
          <p className="mt-4 text-3xl text-gray-700">
            {priceFormatter.format(Price)}
          </p>
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-base text-gray-600 whitespace-pre-wrap">
              {Description}
            </p>
          </div>
          {/* Inquiry Form Integration */}
          <div className="mt-10 border-t pt-10">
            <h3 className="text-xl font-semibold mb-4">
              Interested in this product?
            </h3>
            <ProductInquiryForm
              productId={product.id}
              productName={product.Name}
            />
          </div>
          <Link
            href="/"
            className="mt-10 inline-block text-blue-600 hover:underline"
          >
            ← Back to all products
          </Link>
        </div>
      </div>
    </main>
  );
}
