// frontend/src/app/products/[documentId]/ProductDetailClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Product, ProductImage } from "@/types";
import ProductInquiryForm from "@/app/components/ProductInquiryForm";
import { useFavorites } from "@/app/context/FavoritesContext";
import RelatedProducts from "@/app/components/RelatedProducts";
import toast from "react-hot-toast";
import SocialShareButtons from "@/app/components/SocialShareButtons";
import RecentlyViewed from "@/app/components/RecentlyViewed";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { ProductCardProps } from "@/app/components/ProductCard";

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { documentId } = product;
  const [relatedProducts, setRelatedProducts] = useState<ProductCardProps[]>(
    []
  );
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(
    product.Images?.[0] || null
  );
  const [announcement, setAnnouncement] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inquiryFormRef = useRef<HTMLDivElement>(null);

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
      if (!product.Product?.documentId) return;

      const queryParams = new URLSearchParams({
        "filters[Product][documentId][$eq]": product.Product.documentId,
        "filters[documentId][$ne]": product.documentId,
        "pagination[limit]": "4",
        populate: "Images",
      });

      try {
        const res = await fetch(
          `${strapiUrl}/api/products?${queryParams.toString()}`
        );
        if (res.ok) {
          const responseData = await res.json();
          setRelatedProducts(responseData.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch related products", error);
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
          background: "#991b1b",
          color: "#ffffff",
        },
      });
    }
  };

  const scrollToInquiry = () => {
    if (inquiryFormRef.current) {
      inquiryFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleImageSelect = (image: ProductImage, index: number) => {
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

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!Images || Images.length < 2) return;
    const currentIndex = Images.findIndex(
      (img) => img.id === selectedImage?.id
    );
    const nextIndex = (currentIndex + 1) % Images.length;
    const nextImage = Images[nextIndex];
    handleImageSelect(nextImage, nextIndex);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!Images || Images.length < 2) return;
    const currentIndex = Images.findIndex(
      (img) => img.id === selectedImage?.id
    );
    const prevIndex = (currentIndex - 1 + Images.length) % Images.length;
    const prevImage = Images[prevIndex];
    handleImageSelect(prevImage, prevIndex);
  };

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

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const priceValidUntil = nextYear.toISOString().split("T")[0];

  const similarProductsSchema = relatedProducts.map((rp) => ({
    "@type": "Product",
    name: rp.Name,
    url: `https://www.alpialcanada.com/products/${rp.documentId}`,
    offers: {
      "@type": "Offer",
      price: rp.Price,
      priceCurrency: "CAD",
    },
  }));

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
      priceValidUntil: priceValidUntil,
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "CA",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "CAD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "CA",
        },
      },
    },
    isSimilarTo:
      similarProductsSchema.length > 0 ? similarProductsSchema : undefined,
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
        name: "Search",
        item: "https://www.alpialcanada.com/search",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.Name,
        item: pageUrl,
      },
    ],
  };

  const getAltText = (img: ProductImage, index: number) => {
    if (img.alternativeText) return img.alternativeText;
    // --- FIX 1: Added optional chaining for length ---
    return `${Name} - View ${index + 1} of ${Images?.length || 0}`;
  };

  // --- FIX 2: Fallback to empty array if Images is null to prevent map crash ---
  const slides = (Images || []).map((img) => ({
    src: img.url.startsWith("http") ? img.url : `${strapiUrl}${img.url}`,
    alt: img.alternativeText || Name,
  }));

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

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={selectedImageIndex}
        slides={slides}
        plugins={[Zoom]}
        animation={{ fade: 250 }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
      />

      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 mb-16 md:mb-0">
        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>

        <nav aria-label="Breadcrumb" className="mb-8">
          <ol
            role="list"
            className="flex items-center space-x-2 text-sm text-gray-500"
          >
            <li>
              <Link href="/" className="hover:text-amber-700 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-300">/</span>
            </li>
            <li>
              <Link
                href="/search"
                className="hover:text-amber-700 transition-colors"
              >
                Search
              </Link>
            </li>
            <li>
              <span className="text-gray-300">/</span>
            </li>
            <li>
              <span
                aria-current="page"
                className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px] inline-block align-bottom capitalize"
              >
                {Name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <div
              role="tabpanel"
              id="gallery-tabpanel"
              aria-labelledby={`gallery-tab-${selectedImage?.id}`}
              className="aspect-square relative mb-4 overflow-hidden rounded-sm border bg-stone-50 dark:bg-gray-800 dark:border-gray-700 cursor-zoom-in shadow-sm"
              onClick={() => setLightboxOpen(true)}
            >
              {fullSelectedImageUrl ? (
                <Image
                  src={fullSelectedImageUrl}
                  alt={
                    selectedImage
                      ? getAltText(selectedImage, selectedImageIndex ?? 0)
                      : Name
                  }
                  fill
                  className="object-contain hover:opacity-90 transition-opacity"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}

              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                Click to Zoom
              </div>

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
            </div>

            <div
              role="tablist"
              aria-label="Product image thumbnails"
              className="flex space-x-3 overflow-x-auto pb-2"
              onKeyDown={(e) =>
                handleThumbnailKeyDown(e, selectedImageIndex ?? 0)
              }
            >
              {/* --- FIX 3: Added optional chaining for mapping --- */}
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
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-all ${
                      selectedImage?.id === img.id
                        ? "border-amber-600 opacity-100 ring-2 ring-amber-100"
                        : "border-transparent hover:border-stone-300 opacity-60 hover:opacity-100"
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2`}
                  >
                    <Image
                      src={fullThumbnailUrl}
                      alt={getAltText(img, index)}
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 capitalize">
              {Name}
            </h1>
            <p className="mt-4 text-3xl text-gray-700 dark:text-gray-300 font-light">
              {priceFormatter.format(Price)}
            </p>
            <div className="mt-8 hidden md:block">
              <button
                onClick={handleToggleFavorite}
                aria-pressed={isFavorite(documentId)}
                className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-sm transition-colors ${
                  isFavorite(documentId)
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-red-900 text-white hover:bg-red-800"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 mr-2 ${
                    isFavorite(documentId) ? "text-red-700" : "text-white"
                  }`}
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
                  ? "Saved to Favorites"
                  : "Add to Favorites"}
              </button>
            </div>

            <div className="mt-10">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`${
                      activeTab === "description"
                        ? "border-amber-600 text-amber-700 dark:text-amber-500"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm tracking-wide uppercase`}
                  >
                    Description
                  </button>
                  {propertiesToRender && propertiesToRender.length > 0 && (
                    <button
                      onClick={() => setActiveTab("specs")}
                      className={`${
                        activeTab === "specs"
                          ? "border-amber-600 text-amber-700 dark:text-amber-500"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm tracking-wide uppercase`}
                    >
                      Specifications
                    </button>
                  )}
                </nav>
              </div>

              <div className="mt-6">
                {activeTab === "description" && (
                  <article className="prose lg:prose-lg max-w-none dark:prose-invert animate-fade-in-up text-gray-600 dark:text-gray-300 leading-relaxed">
                    <ReactMarkdown>{Description}</ReactMarkdown>
                  </article>
                )}
                {activeTab === "specs" && (
                  <div className="animate-fade-in-up">
                    <dl className="divide-y divide-stone-100 dark:divide-gray-800">
                      {propertiesToRender.map((prop) => (
                        <div
                          key={prop.name}
                          className="grid grid-cols-3 gap-4 py-4"
                        >
                          <dt className="font-medium text-gray-900 dark:text-white col-span-1">
                            {prop.name}
                          </dt>
                          <dd className="col-span-2 text-gray-600 dark:text-gray-300">
                            {formatValue(prop.value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </div>

            <div
              ref={inquiryFormRef}
              className="mt-12 border border-stone-200 dark:border-gray-700 shadow-sm pt-10 p-8 bg-stone-50 dark:bg-gray-800 rounded-sm"
            >
              <h3 className="text-xl font-serif font-semibold mb-6 text-gray-900 dark:text-gray-200">
                Request Information
              </h3>
              <ProductInquiryForm
                productId={documentId}
                productName={Name}
                onSuccess={() =>
                  toast("Your inquiry has been sent!", {
                    icon: "✅",
                    style: {
                      borderRadius: "10px",
                      background: "#166534",
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
              className="mt-12 inline-block text-amber-700 hover:text-amber-900 dark:hover:text-amber-500 hover:underline focus:outline-none rounded-sm font-medium"
            >
              ← Back to Collection
            </Link>
          </div>
        </div>
        <RelatedProducts products={relatedProducts} />

        <RecentlyViewed currentProduct={product} />
      </main>

      {/* --- MOBILE STICKY ACTION BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 md:hidden z-40 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button
          onClick={handleToggleFavorite}
          className={`flex-1 flex items-center justify-center py-3 rounded-sm border transition-colors ${
            isFavorite(documentId)
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </button>
        <button
          onClick={scrollToInquiry}
          className="flex-[3] bg-red-900 text-white py-3 rounded-sm font-serif text-lg tracking-wide hover:bg-red-800"
        >
          Inquire Now
        </button>
      </div>
    </>
  );
}
