// frontend/src/app/products/[documentId]/ProductDetailClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Product } from "./page";
import ProductInquiryForm from "@/app/components/ProductInquiryForm";
import { useFavorites } from "@/app/context/FavoritesContext";
import RelatedProducts from "@/app/components/RelatedProducts";
import { ProductCardProps } from "@/app/components/ProductCard";
import toast from "react-hot-toast";
import SocialShareButtons from "@/app/components/SocialShareButtons";

interface ProductDetailImage {
  id: number;
  url: string;
  width: number;
  height: number;
  name: string;
}

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { documentId } = product;
  const [relatedProducts, setRelatedProducts] = useState<ProductCardProps[]>(
    []
  );
  const [selectedImage, setSelectedImage] = useState(
    product.Images?.[0] || null
  );
  const [announcement, setAnnouncement] = useState("");
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [activeTab, setActiveTab] = useState("description");

  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      const allProductsRes = await fetch(
        `${strapiUrl}/api/products?populate=*`
      );
      if (allProductsRes.ok) {
        const allProductsResponseData = await allProductsRes.json();
        const allProducts: Product[] = allProductsResponseData.data || [];
        if (product.Product && allProducts.length > 0) {
          const related = allProducts
            .filter(
              (p) =>
                p.Product?.documentId === product.Product?.documentId &&
                p.documentId !== product.documentId
            )
            .slice(0, 4);
          setRelatedProducts(related);
        }
      }
    };
    fetchRelatedProducts();
  }, [product.Product, product.documentId]);

  useEffect(() => {
    if (product && product.id) {
      fetch(`${strapiUrl}/api/products/${product.id}/increment-view`, {
        method: "POST",
      });
    }
  }, [product]);

  const handleToggleFavorite = () => {
    const imageUrl = product.Images?.[0]?.url;
    const favoriteImageUrl = imageUrl
      ? imageUrl.startsWith("http")
        ? new URL(imageUrl).pathname
        : imageUrl
      : undefined;

    if (isFavorite(documentId)) {
      removeFavorite(documentId);
      toast("Removed from Favorites!", {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#4b5563",
          color: "#ffffff",
        },
      });
    } else {
      addFavorite({
        documentId,
        Name: product.Name,
        Price: product.Price,
        imageUrl: favoriteImageUrl,
      });
      toast("Added to Favorites!", {
        icon: "❤️",
        style: {
          borderRadius: "10px",
          background: "#dc2626",
          color: "#ffffff",
        },
      });
    }
  };

  const handleImageSelect = (image: ProductDetailImage, index: number) => {
    setSelectedImage(image);
    setAnnouncement(
      `Now viewing Image ${index + 1} of ${product?.Images?.length}: ${
        image.name
      }`
    );
  };

  const handleThumbnailKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
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

  const {
    Name,
    Price,
    Description,
    Images,
    CustomPropertyValues,
    Product: productType,
  } = product;

  // --- START OF UPDATE: Add handlers for next/previous image ---
  const handleNextImage = () => {
    if (!Images || Images.length < 2) return;
    const currentIndex = Images.findIndex(
      (img) => img.id === selectedImage?.id
    );
    const nextIndex = (currentIndex + 1) % Images.length;
    const nextImage = Images[nextIndex];
    handleImageSelect(nextImage, nextIndex);
  };

  const handlePrevImage = () => {
    if (!Images || Images.length < 2) return;
    const currentIndex = Images.findIndex(
      (img) => img.id === selectedImage?.id
    );
    const prevIndex = (currentIndex - 1 + Images.length) % Images.length;
    const prevImage = Images[prevIndex];
    handleImageSelect(prevImage, prevIndex);
  };
  // --- END OF UPDATE ---

  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  });
  const selectedImageIndex = Images?.findIndex(
    (img) => img.id === selectedImage?.id
  );
  const fullSelectedImageUrl = selectedImage
    ? selectedImage.url.startsWith("http")
      ? selectedImage.url
      : `${strapiUrl}${selectedImage.url}`
    : null;

  const formatValue = (value: string | number | boolean | null | undefined) => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return value?.toString();
  };

  const propertiesToRender = (productType?.CustomProperties || [])
    .map((propDef) => ({
      name: propDef.name,
      value: CustomPropertyValues?.[propDef.name],
    }))
    .filter(
      (prop) =>
        prop.value !== undefined && prop.value !== null && prop.value !== ""
    );

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.Name,
    image: fullSelectedImageUrl || "",
    description: product.Description,
    sku: product.SKU,
    brand: { "@type": "Brand", name: "AlpialCanada" },
    offers: {
      "@type": "Offer",
      url: `https://www.alpialcanada.com/products/${product.documentId}`,
      priceCurrency: "CAD",
      price: product.Price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.alpialcanada.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.Name,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {pageUrl && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>

        <nav aria-label="Breadcrumb" className="mb-6">
          <ol role="list" className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/search"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Products
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-300 dark:text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span
                  aria-current="page"
                  className="ml-2 font-medium text-gray-700 dark:text-gray-200 truncate"
                >
                  {Name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <div
              role="tabpanel"
              id="gallery-tabpanel"
              aria-labelledby={`gallery-tab-${selectedImage?.id}`}
              className="aspect-square relative mb-4 overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
            >
              {fullSelectedImageUrl ? (
                <Image
                  src={fullSelectedImageUrl}
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

              {/* --- START OF UPDATE: Add navigation arrows --- */}
              {Images && Images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white transition hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white transition hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}
              {/* --- END OF UPDATE --- */}
            </div>
            <div
              role="tablist"
              aria-label="Product image thumbnails"
              className="flex space-x-2"
              onKeyDown={(e) =>
                handleThumbnailKeyDown(e, selectedImageIndex ?? 0)
              }
            >
              {Images?.map((img, index) => {
                const fullThumbnailUrl = img.url.startsWith("http")
                  ? img.url
                  : `${strapiUrl}${img.url}`;
                return (
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
                        ? "border-red-600"
                        : "border-transparent hover:border-gray-400"
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2`}
                  >
                    <Image
                      src={fullThumbnailUrl}
                      alt={`View Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {Name}
            </h1>
            <p className="mt-4 text-3xl text-gray-700 dark:text-gray-300">
              {priceFormatter.format(Price)}
            </p>
            <div className="mt-6">
              <button
                onClick={handleToggleFavorite}
                aria-pressed={isFavorite(documentId)}
                className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors ${
                  isFavorite(documentId)
                    ? "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
                    : "bg-red-600 hover:bg-red-700 focus:ring-red-600"
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    className={isFavorite(documentId) ? "fill-current" : ""}
                  />
                </svg>
                {isFavorite(documentId)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>
            </div>

            <div className="mt-8">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`${
                      activeTab === "description"
                        ? "border-red-600 text-red-700 dark:text-red-500"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Description
                  </button>
                  {propertiesToRender && propertiesToRender.length > 0 && (
                    <button
                      onClick={() => setActiveTab("specs")}
                      className={`${
                        activeTab === "specs"
                          ? "border-red-600 text-red-700 dark:text-red-500"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                      Specifications
                    </button>
                  )}
                </nav>
              </div>

              <div className="mt-6">
                {activeTab === "description" && (
                  <article className="prose lg:prose-lg max-w-none dark:prose-invert animate-fade-in-up">
                    <ReactMarkdown>{Description}</ReactMarkdown>
                  </article>
                )}
                {activeTab === "specs" && (
                  <div className="animate-fade-in-up">
                    <dl className="space-y-4 text-base text-gray-600 dark:text-gray-300">
                      {propertiesToRender.map((prop) => (
                        <div key={prop.name} className="flex gap-4">
                          <dt className="font-medium text-gray-900 dark:text-white w-1/3">
                            {prop.name}
                          </dt>
                          <dd className="w-2/3">{formatValue(prop.value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 border dark:border-gray-700 shadow-sm pt-10 p-8 bg-white dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-serif font-semibold mb-4 text-gray-900 dark:text-gray-200">
                Interested in this product?
              </h3>
              <ProductInquiryForm
                productId={documentId}
                productName={Name}
                onSuccess={() =>
                  toast("Your inquiry has been sent!", {
                    icon: "✅",
                    style: {
                      borderRadius: "10px",
                      background: "#dc2626",
                      color: "#ffffff",
                    },
                  })
                }
              />
            </div>

            <div className="mt-8">
              {pageUrl && <SocialShareButtons url={pageUrl} title={Name} />}
            </div>

            <Link
              href="/search"
              className="mt-10 inline-block text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm"
            >
              ← Back to all products
            </Link>
          </div>
        </div>
        <RelatedProducts products={relatedProducts} />
      </main>
    </>
  );
}
