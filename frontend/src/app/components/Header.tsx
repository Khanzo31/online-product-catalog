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
    const handleScroll = () => {
      // Set state based on scroll position (e.g., after scrolling > 50px)
      setIsScrolled(window.scrollY > 50);
    };

    // Add event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    // UPDATED: Added classes for sticky behavior, transitions, and conditional padding
    <header
      className={`bg-warm-bg shadow-sm border-b sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Left Side: Logo and Title */}
        <Link href="/" className="flex items-center gap-4 group">
          <Image
            src="/alpial-logo.png"
            alt="AlpialCanada Logo"
            // UPDATED: Conditional logo size
            width={isScrolled ? 50 : 80}
            height={isScrolled ? 50 : 80}
            priority
            className="transition-all duration-300"
          />
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wider text-gray-800 uppercase group-hover:text-red-700 transition-colors">
              AlpialCanada
            </h1>
            {/* UPDATED: Conditionally hide tagline */}
            {!isScrolled && (
              <p className="hidden md:block text-md text-gray-600 mt-1">
                Antiques & Collectibles
              </p>
            )}
          </div>
        </Link>

        {/* Right Side: Navigation */}
        <nav aria-label="Main Navigation">
          <ul className="flex space-x-4 md:space-x-6 text-base md:text-lg uppercase tracking-wide">
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
