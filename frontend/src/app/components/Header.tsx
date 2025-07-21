// frontend/src/app/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/app/context/FavoritesContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { favoritesCount } = useFavorites();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const threshold = 50;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    // Call handler once on mount to set initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array is correct, runs only on mount.

  return (
    // --- START OF DEFINITIVE FIX ---
    // 1. A fixed height `h-28` (7rem, 112px) is applied to the header.
    //    This is the height of the EXPANDED header, so it never changes.
    // 2. The dynamic padding `py-2`/`py-4` is REMOVED.
    // 3. `flex` and `items-center` are added to vertically center the content
    //    within the fixed-height container.
    <header className="bg-gray-800 shadow-lg border-b border-gray-700 sticky top-0 z-50 transition-all duration-300 h-28 flex items-center">
      {/* --- END OF DEFINITIVE FIX --- */}

      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-4 group">
          <Image
            src="/alpial-logo.png"
            alt="AlpialCanada Logo"
            // The size of the image itself still changes, but it won't affect the parent header's height.
            width={isScrolled ? 50 : 80}
            height={isScrolled ? 50 : 80}
            priority
            className="transition-all duration-300"
          />
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wider text-white uppercase group-hover:text-red-300 transition-colors">
              AlpialCanada
            </h1>
            {/* This subtitle correctly disappears on scroll */}
            {!isScrolled && (
              <p className="hidden md:block text-md text-gray-300 mt-1 transition-opacity duration-300">
                Antiques & Collectibles
              </p>
            )}
          </div>
        </Link>

        <nav aria-label="Main Navigation">
          <ul className="flex space-x-4 md:space-x-6 text-base md:text-lg uppercase tracking-wide">
            <li>
              <Link
                href="/"
                className="text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm px-1 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm px-1 transition-colors"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                href="/favorites"
                className="text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm px-1 flex items-center group transition-colors"
              >
                Favorites
                {favoritesCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-medium text-white group-hover:bg-red-500 transition-colors">
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
