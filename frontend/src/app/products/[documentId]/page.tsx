// frontend/src/app/products/[documentId]/page.tsx
"use client";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import ProductInquiryForm from "@/app/components/ProductInquiryForm";
import { useFavorites } from "@/app/context/FavoritesContext";
import RelatedProducts from "@/app/components/RelatedProducts";
import { ProductCardProps } from "@/app/components/ProductCard";

// Type Definitions (no changes)
interface CustomProperty {
  name: string;
  type: "text" | "number" | "boolean";
}
interface ProductType {
  id: number;
  documentId: string;
  Name: string;
  CustomProperties?: CustomProperty[];
}
interface ProductDetailImage {
  id: number;
  url: string;
  width: number;
  height: number;
  name: string;
}
interface Product extends Omit<ProductCardProps, "Images"> {
  Images: ProductDetailImage[];
  SKU: string;
  Description: string;
  CustomPropertyValues?: { [key: string]: string | number | boolean };
  Product?: ProductType;
}

export default function ProductDetailPage() {
  const params = useParams();
  const documentId = params.documentId as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductCardProps[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProductDetailImage | null>(
    null
  );
  const [announcement, setAnnouncement] = useState("");
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (!documentId) return;

    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productRes, allProductsRes] = await Promise.all([
          fetch(
            `${strapiUrl}/api/products?filters[documentId][$eq]=${documentId}&populate=*`
          ),
          fetch(`${strapiUrl}/api/products?populate=*`),
        ]);

        if (!productRes.ok) {
          throw new Error("Failed to fetch main product data");
        }
        if (!allProductsRes.ok) {
          throw new Error("Failed to fetch all products for relations");
        }

        const productResponseData = await productRes.json();
        const allProductsResponseData = await allProductsRes.json();
        const currentProduct: Product | null =
          productResponseData.data?.[0] || null;
        const allProducts: Product[] = allProductsResponseData.data || [];

        if (!currentProduct) {
          notFound();
          return;
        }

        setProduct(currentProduct);

        if (currentProduct.Product && allProducts.length > 0) {
          const related = allProducts
            .filter(
              (p) =>
                (p.Product?.documentId === currentProduct.Product?.documentId ||
                  p.Product?.id === currentProduct.Product?.id) &&
                p.documentId !== currentProduct.documentId
            )
            .slice(0, 4);
          setRelatedProducts(related);
        }

        if (currentProduct.Images?.length > 0) {
          setSelectedImage(currentProduct.Images[0]);
          thumbnailRefs.current = new Array(currentProduct.Images.length);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
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
    const imageUrl = product.Images?.[0]?.url;
    const favoriteImageUrl = imageUrl
      ? imageUrl.startsWith("http")
        ? new URL(imageUrl).pathname
        : imageUrl
      : undefined;

    if (isFavorite(documentId)) {
      removeFavorite(documentId);
    } else {
      addFavorite({
        documentId: documentId,
        Name: product.Name,
        Price: product.Price,
        imageUrl: favoriteImageUrl,
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
  if (!product) return null;

  const {
    Name,
    Price,
    Description,
    Images,
    CustomPropertyValues,
    Product: productType,
  } = product;
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

  const propertiesToRender = productType?.CustomProperties?.map((propDef) => ({
    name: propDef.name,
    value: CustomPropertyValues?.[propDef.name],
  })).filter(
    (prop) =>
      prop.value !== undefined && prop.value !== null && prop.value !== ""
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
              // FIXED: Replaced 'bg-brand' with 'bg-red-600'
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
                  // FIXED: Reverted to a simpler class-based approach that will now work
                  className={isFavorite(documentId) ? "fill-current" : ""}
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
            <article className="prose lg:prose-lg mt-2 max-w-none text-gray-600">
              <ReactMarkdown>{Description}</ReactMarkdown>
            </article>
          </div>
          {propertiesToRender && propertiesToRender.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">
                Specifications
              </h2>
              <dl className="mt-4 space-y-4 text-base text-gray-600">
                {propertiesToRender.map((prop) => (
                  <div key={prop.name} className="flex gap-4">
                    <dt className="font-medium text-gray-900 w-1/3">
                      {prop.name}
                    </dt>
                    <dd className="w-2/3">{formatValue(prop.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="mt-10 border-t pt-10">
            <h3 className="text-xl font-semibold mb-4">
              Interested in this product?
            </h3>
            <ProductInquiryForm productId={documentId} productName={Name} />
          </div>
          <Link
            href="/"
            className="mt-10 inline-block text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm"
          >
            ← Back to all products
          </Link>
        </div>
      </div>
      <RelatedProducts products={relatedProducts} />
    </main>
  );
}
