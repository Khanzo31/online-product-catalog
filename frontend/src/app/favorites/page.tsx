// frontend/src/app/favorites/page.tsx
"use client";

// --- 1. Import FavoriteItem alongside useFavorites ---
import { useFavorites, FavoriteItem } from "@/app/context/FavoritesContext";
import Link from "next/link";
import Image from "next/image";

// --- 2. Use FavoriteItem instead of any ---
function FavoriteProductCard({ product }: { product: FavoriteItem }) {
  const { documentId, Name, Price, imageUrl } = product;
  const { removeFavorite } = useFavorites();

  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  });

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Link href={`/products/${documentId}`} className="block">
        <div className="aspect-square bg-gray-200 group-hover:opacity-75">
          {imageUrl ? (
            <Image
              src={`${strapiUrl}${imageUrl}`}
              alt={Name || "Product Image"}
              width={400}
              height={400}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {Name || "Untitled Product"}
          </h3>
          <p className="mt-1 text-md font-medium text-gray-600">
            {priceFormatter.format(Price || 0)}
          </p>
        </div>
      </Link>
      <div className="p-4 pt-0 mt-auto">
        <button
          onClick={() => removeFavorite(documentId)}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

// --- The rest of the file remains unchanged ---
export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Your Favorites
        </h1>
        {favorites.length > 0 && (
          <p className="mt-4 text-lg text-gray-600">
            You have {favorites.length} favorite item
            {favorites.length !== 1 ? "s" : ""}.
          </p>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {favorites.map((product) => (
            <FavoriteProductCard key={product.documentId} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No favorites yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven’t added any products to your favorites.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
