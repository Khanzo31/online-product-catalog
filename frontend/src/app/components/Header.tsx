// frontend/src/app/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/app/context/FavoritesContext";

export default function Header() {
  const { favoritesCount } = useFavorites();

  return (
    // --- 1. Apply the new warm background color ---
    <header className="bg-warm-bg shadow-sm border-b py-4">
      <div className="container mx-auto flex flex-col items-center text-center">
        <Link href="/" className="mb-4">
          <Image
            src="/alpial-logo.png"
            alt="AlpialCanada Logo"
            width={120}
            height={120}
            priority
          />
        </Link>
        {/* --- 2. Apply the new serif font to the main heading --- */}
        <h1 className="font-serif text-4xl font-bold tracking-wider text-gray-800 uppercase">
          AlpialCanada
        </h1>
        <p className="text-md text-gray-600 mt-1">Antiques & Collectibles</p>

        <nav className="mt-4" aria-label="Main Navigation">
          <ul className="flex space-x-8 text-lg uppercase tracking-wide">
            <li>
              <Link
                href="/"
                className="text-gray-700 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-sm px-1 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="text-gray-700 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-sm px-1 transition-colors"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                href="/favorites"
                className="text-gray-700 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-sm px-1 flex items-center group transition-colors"
              >
                Favorites
                {favoritesCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-medium text-white group-hover:bg-red-700 transition-colors">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
