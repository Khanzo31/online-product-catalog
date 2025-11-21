// frontend/src/app/favorites/page.tsx
"use client";

import { useFavorites, FavoriteItem } from "@/app/context/FavoritesContext";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

function FavoriteProductCard({ product }: { product: FavoriteItem }) {
  const { documentId, Name, Price, imageUrl } = product;
  const { removeFavorite } = useFavorites();

  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  const fullImageUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `${strapiUrl}${imageUrl}`
    : null;

  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(documentId);
    toast("Removed from Favorites", {
      icon: "🗑️",
      style: {
        borderRadius: "10px",
        background: "#4b5563",
        color: "#ffffff",
      },
    });
  };

  // --- REDESIGN: Matches ProductCard aesthetics but specialized for Favorites ---
  return (
    <Link
      href={`/products/${documentId}`}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-square bg-stone-100 dark:bg-gray-900">
        {fullImageUrl ? (
          <Image
            src={fullImageUrl}
            alt={Name || "Product Image"}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-stone-400">No Image</span>
          </div>
        )}

        {/* --- REDESIGN: Elegant 'Remove' X Icon --- */}
        <button
          onClick={handleRemove}
          aria-label="Remove from favorites"
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-400 hover:text-red-600 hover:bg-white transition-all shadow-sm z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-4 text-center">
        <h3 className="font-serif text-lg font-medium text-gray-900 dark:text-gray-100 truncate capitalize group-hover:text-amber-700 transition-colors">
          {Name || "Untitled Product"}
        </h3>
        <p className="mt-1 text-md text-gray-600 dark:text-gray-400 font-light">
          {priceFormatter.format(Price || 0)}
        </p>
      </div>
    </Link>
  );
}

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 min-h-[60vh]">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Your Favorites
        </h1>
        {favorites.length > 0 ? (
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 font-light">
            You have {favorites.length} item{favorites.length !== 1 ? "s" : ""}{" "}
            saved.
          </p>
        ) : (
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 font-light italic">
            Your collection is currently empty.
          </p>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 animate-fade-in-up">
          {favorites.map((product) => (
            <FavoriteProductCard key={product.documentId} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-stone-100 bg-stone-50 dark:bg-gray-800 dark:border-gray-700 rounded-sm max-w-2xl mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-stone-300 dark:text-gray-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="mt-2 font-serif text-xl font-medium text-gray-900 dark:text-gray-200">
            No favorites yet
          </h3>
          <p className="mt-2 text-stone-500 dark:text-gray-400">
            Save items you love to view them here later.
          </p>
          <div className="mt-8">
            <Link
              href="/search"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-sm shadow-sm text-white bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900 transition-all"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
