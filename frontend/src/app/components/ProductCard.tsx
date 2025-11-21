// frontend/src/app/components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";
import { useFavorites } from "@/app/context/FavoritesContext";
import toast from "react-hot-toast";
import { ProductImage } from "@/types";

export interface ProductCardProps {
  id: number;
  documentId: string;
  Name: string;
  Price: number;
  Images: ProductImage[];
  createdAt?: string;
}

export default function ProductCard({
  product,
}: {
  product: ProductCardProps;
}) {
  const { documentId, Name, Price, Images, createdAt } = product;
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  const getFullUrl = (url: string) =>
    url.startsWith("http") ? url : `${strapiUrl}${url}`;

  const primaryImageUrl = Images?.[0]?.url ? getFullUrl(Images[0].url) : null;
  const secondaryImageUrl = Images?.[1]?.url ? getFullUrl(Images[1].url) : null;

  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  });

  const isFavorited = isFavorite(documentId);

  const isNewArrival = createdAt
    ? (new Date().getTime() - new Date(createdAt).getTime()) /
        (1000 * 3600 * 24) <
      30
    : false;

  const handleFavoriteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const favoriteItem = {
      documentId,
      Name,
      Price,
      imageUrl: Images?.[0]?.url,
    };

    if (isFavorited) {
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
      addFavorite(favoriteItem);
      toast("Added to Favorites!", {
        icon: "❤️",
        style: {
          borderRadius: "10px",
          background: "#991b1b", // Red-800 for toast
          color: "#ffffff",
        },
      });
    }
  };

  return (
    <Link
      href={`/products/${documentId}`}
      className="group block overflow-hidden rounded-sm border border-stone-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative h-64 w-full bg-stone-100 dark:bg-gray-900 overflow-hidden">
        {isNewArrival && (
          <span className="absolute top-3 left-3 z-20 bg-amber-700 text-white text-[10px] tracking-[0.2em] font-serif uppercase px-3 py-1 shadow-md">
            New Arrival
          </span>
        )}

        {primaryImageUrl ? (
          <>
            <Image
              src={primaryImageUrl}
              alt={Name || "Product Image"}
              fill
              className={`object-cover transition-all duration-700 ease-in-out z-10 ${
                secondaryImageUrl
                  ? "group-hover:opacity-0"
                  : "group-hover:scale-110"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />

            {secondaryImageUrl && (
              <Image
                src={secondaryImageUrl}
                alt={`${Name} - Alternate View`}
                fill
                className="object-cover absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-stone-400 font-serif italic">
              No Image Available
            </span>
          </div>
        )}

        <button
          onClick={handleFavoriteClick}
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
          aria-pressed={isFavorited}
          // --- POLISH: Changed active color to red-700 ---
          className="absolute top-3 right-3 z-30 p-2 rounded-full text-stone-600 bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:bg-white hover:text-red-700 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={isFavorited ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              className={isFavorited ? "text-red-700" : ""}
            />
          </svg>
        </button>
      </div>

      <div className="p-5 text-center">
        {/* --- POLISH: Added 'capitalize' --- */}
        <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-amber-700 transition-colors capitalize">
          {Name || "Untitled Product"}
        </h3>
        <p className="mt-2 text-sm font-normal tracking-wide text-gray-600 dark:text-gray-400">
          {priceFormatter.format(Price || 0)}
        </p>
      </div>
    </Link>
  );
}
