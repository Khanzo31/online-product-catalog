// frontend/src/app/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/app/context/FavoritesContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { favoritesCount } = useFavorites();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const threshold = 50;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="bg-gray-800 shadow-lg border-b border-gray-700 sticky top-0 z-50 transition-all duration-300 h-28 flex items-center">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-4 group"
          onClick={() => setIsMenuOpen(false)}
        >
          <Image
            src="/alpial-logo.png"
            alt="AlpialCanada Logo"
            width={isScrolled ? 50 : 80}
            height={isScrolled ? 50 : 80}
            priority
            className="transition-all duration-300"
          />
          <div>
            {/* --- THIS IS THE FIX: Changed from h1 to div --- */}
            <div className="font-serif text-2xl md:text-3xl font-bold tracking-wider text-white uppercase group-hover:text-red-300 transition-colors">
              AlpialCanada
            </div>
            {!isScrolled && (
              <p className="hidden md:block text-md text-gray-300 mt-1 transition-opacity duration-300">
                Antiques & Collectibles
              </p>
            )}
          </div>
        </Link>

        {/* Desktop Navigation (hidden on mobile) */}
        <nav aria-label="Main Navigation" className="hidden md:block">
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

        {/* Mobile Hamburger Menu Button (visible on mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel (conditionally rendered) */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 bg-gray-800 shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/search"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Search
            </Link>
            <Link
              href="/favorites"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              <div className="flex items-center">
                Favorites
                {favoritesCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-medium text-white">
                    {favoritesCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
