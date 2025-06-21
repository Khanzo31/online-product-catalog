// frontend/src/app/products/[documentId]/page.tsx
"use client";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import ProductInquiryForm from "@/app/components/ProductInquiryForm";
import { useFavorites } from "@/app/context/FavoritesContext";

// --- TYPE DEFINITIONS (No changes needed) ---
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
  CustomPropertyValues?: { [key: string]: string | number };
}

// --- PRODUCT DETAIL PAGE COMPONENT (UPDATED) ---
export default function ProductDetailPage() {
  const params = useParams();
  const documentId = params.documentId as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<StrapiImage | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // NOTE: The `strapiUrl` is only needed for data fetching, not images
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (!documentId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = `${strapiUrl}/api/products?filters[documentId][$eq]=${documentId}&populate=*`;
        const res = await fetch(apiUrl);

        if (!res.ok) {
          if (res.status === 404) notFound();
          throw new Error("Failed to fetch product data");
        }

        const responseData = await res.json();
        const productObject: Product | null = responseData.data?.[0] || null;

        if (!productObject) {
          notFound();
          return;
        }

        setProduct(productObject);
        if (productObject.Images?.length > 0) {
          setSelectedImage(productObject.Images[0]);
          thumbnailRefs.current = new Array(productObject.Images.length);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [documentId, strapiUrl]);

  useEffect(() => {
    if (product && product.id) {
      const increment = async () => {
        try {
          await fetch(
            `${strapiUrl}/api/products/${product.id}/increment-view`,
            {
              method: "POST",
            }
          );
        } catch (err) {
          console.error("Failed to increment view count:", err);
        }
      };
      increment();
    }
  }, [product, strapiUrl]);

  const handleToggleFavorite = () => {
    if (!product) return;

    if (isFavorite(documentId)) {
      removeFavorite(documentId);
    } else {
      addFavorite({
        documentId: documentId,
        Name: product.Name,
        Price: product.Price,
        imageUrl: product.Images?.[0]?.url,
      });
    }
  };

  const handleImageSelect = (image: StrapiImage, index: number) => {
    setSelectedImage(image);
    setAnnouncement(
      `Now viewing Image ${index + 1} of ${product?.Images?.length}: ${
        image.name
      }`
    );
  };

  const handleThumbnailKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    currentIndex: number
  ) => {
    if (!product?.Images) return;
    let nextIndex = currentIndex;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % product.Images.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex =
        (currentIndex - 1 + product.Images.length) % product.Images.length;
    } else {
      return;
    }
    e.preventDefault();
    const nextImage = product.Images[nextIndex];
    handleImageSelect(nextImage, nextIndex);
    thumbnailRefs.current[nextIndex]?.focus();
  };

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

  if (!product) {
    return null;
  }

  const { Name, Price, Description, Images } = product;
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  });
  const selectedImageIndex = Images?.findIndex(
    (img) => img.id === selectedImage?.id
  );

  return (
    <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <div
            role="tabpanel"
            id="gallery-tabpanel"
            aria-labelledby={`gallery-tab-${selectedImage?.id}`}
            className="aspect-square relative mb-4 overflow-hidden rounded-lg border bg-gray-100"
          >
            {selectedImage ? (
              <Image
                // --- FIX #1: Use the URL directly ---
                src={selectedImage.url}
                alt={`${Name} - View ${(selectedImageIndex ?? 0) + 1} of ${
                  Images.length
                }`}
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
          <div
            role="tablist"
            aria-label="Product image thumbnails"
            className="flex space-x-2"
            onKeyDown={(e) =>
              handleThumbnailKeyDown(e, selectedImageIndex ?? 0)
            }
          >
            {Images?.map((img, index) => (
              <button
                key={img.id}
                role="tab"
                id={`gallery-tab-${img.id}`}
                aria-controls="gallery-tabpanel"
                aria-selected={selectedImage?.id === img.id}
                tabIndex={selectedImage?.id === img.id ? 0 : -1}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                onClick={() => handleImageSelect(img, index)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                  selectedImage?.id === img.id
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-400"
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
              >
                <Image
                  // --- FIX #2: Use the URL directly ---
                  src={img.url}
                  alt={`View Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {Name}
          </h1>
          <p className="mt-4 text-3xl text-gray-700">
            {priceFormatter.format(Price)}
          </p>

          <div className="mt-6">
            <button
              onClick={handleToggleFavorite}
              aria-pressed={isFavorite(documentId)}
              className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors ${
                isFavorite(documentId)
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill={isFavorite(documentId) ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {isFavorite(documentId)
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </button>
          </div>

          <div className="mt-6">
            <h2
              id="description-heading"
              className="text-lg font-medium text-gray-900"
            >
              Description
            </h2>
            <p
              aria-labelledby="description-heading"
              className="mt-2 text-base text-gray-600 whitespace-pre-wrap"
            >
              {Description}
            </p>
          </div>
          <div className="mt-10 border-t pt-10">
            <h3 className="text-xl font-semibold mb-4">
              Interested in this product?
            </h3>
            <ProductInquiryForm
              productId={documentId}
              productName={product.Name}
            />
          </div>
          <Link
            href="/"
            className="mt-10 inline-block text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm"
          >
            ← Back to all products
          </Link>
        </div>
      </div>
    </main>
  );
}
