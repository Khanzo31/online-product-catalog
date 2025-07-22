// frontend/src/app/components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";
import { useFavorites } from "@/app/context/FavoritesContext";
import toast from "react-hot-toast";

interface ProductCardImage {
  url: string;
}

export interface ProductCardProps {
  id: number;
  documentId: string;
  Name: string;
  Price: number;
  Images: ProductCardImage[];
}

export default function ProductCard({
  product,
}: {
  product: ProductCardProps;
}) {
  const { documentId, Name, Price, Images } = product;
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  const relativeImageUrl = Images?.[0]?.url;
  const fullImageUrl = relativeImageUrl
    ? relativeImageUrl.startsWith("http")
      ? relativeImageUrl
      : `${strapiUrl}${relativeImageUrl}`
    : null;

  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  });

  const isFavorited = isFavorite(documentId);

  const handleFavoriteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const favoriteItem = {
      documentId,
      Name,
      Price,
      imageUrl: relativeImageUrl,
    };

    if (isFavorited) {
      removeFavorite(documentId);
      toast("Removed from Favorites!", {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#4b5563", // gray-600
          color: "#ffffff",
        },
      });
    } else {
      addFavorite(favoriteItem);
      toast("Added to Favorites!", {
        icon: "❤️",
        style: {
          borderRadius: "10px",
          background: "#dc2626", // red-600
          color: "#ffffff",
        },
      });
    }
  };

  return (
    <Link
      href={`/products/${documentId}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <div className="relative">
        <div className="relative h-56 w-full bg-gray-100">
          {fullImageUrl ? (
            <Image
              src={fullImageUrl}
              alt={Name || "Product Image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              // --- THIS IS THE FIX ---
              // Provides sizing information for various grid layouts.
              // This covers 1-col (mobile), 2-col (tablet), and 3/4-col (desktop) layouts.
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <button
          onClick={handleFavoriteClick}
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
          aria-pressed={isFavorited}
          className="absolute top-2 right-2 z-10 p-2 bg-white/70 rounded-full text-gray-700 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill={isFavorited ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              className={isFavorited ? "text-red-500" : ""}
            />
          </svg>
        </button>
      </div>
      <div className="bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {Name || "Untitled Product"}
        </h3>
        <p className="mt-1 text-md font-medium text-gray-600">
          {priceFormatter.format(Price || 0)}
        </p>
      </div>
    </Link>
  );
}
