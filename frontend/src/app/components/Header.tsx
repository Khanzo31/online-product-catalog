// frontend/src/app/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/app/context/FavoritesContext";
import { useState, useEffect } from "react";

export default function Header({ topOffset = false }: { topOffset?: boolean }) {
  const { favoritesCount } = useFavorites();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const threshold = 20;
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > threshold);
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-50 w-full transition-all duration-300 border-b border-gray-800 ${
        topOffset ? "top-9" : "top-0" // FIX: Adjust top position if admin bar exists
      } ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-md shadow-lg h-20"
          : "bg-gray-900 h-24 md:h-28"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 h-full">
        {/* ... (rest of the file remains exactly the same) ... */}
        <Link
          href="/"
          className="flex items-center gap-4 group"
          onClick={() => setIsMenuOpen(false)}
        >
          <Image
            src="/alpial-logo.png"
            alt="AlpialCanada Logo"
            width={isScrolled ? 45 : 60}
            height={isScrolled ? 45 : 60}
            priority
            className="transition-all duration-300"
          />
          <div>
            <div
              className={`font-serif font-bold tracking-wider text-white uppercase group-hover:text-amber-500 transition-colors ${
                isScrolled ? "text-lg md:text-xl" : "text-xl md:text-3xl"
              }`}
            >
              AlpialCanada
            </div>
            {!isScrolled && (
              <p className="hidden md:block text-xs md:text-sm text-gray-400 mt-0.5 transition-opacity duration-300 tracking-widest uppercase">
                Antiques & Collectibles
              </p>
            )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:block">
          <ul className="flex space-x-4 md:space-x-8 text-sm font-medium uppercase tracking-widest">
            <li>
              <Link
                href="/"
                className="text-gray-300 hover:text-white hover:border-b-2 hover:border-amber-600 pb-1 transition-all"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="text-gray-300 hover:text-white hover:border-b-2 hover:border-amber-600 pb-1 transition-all"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                href="/favorites"
                className="text-gray-300 hover:text-white hover:border-b-2 hover:border-amber-600 pb-1 flex items-center group transition-all"
              >
                Favorites
                {favoritesCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-700 text-[10px] font-bold text-white shadow-sm group-hover:bg-red-600 transition-colors">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Hamburger Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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

      {/* Mobile Navigation Panel */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-xl backdrop-blur-md bg-opacity-95"
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-3 rounded-sm text-base font-medium uppercase tracking-wider"
            >
              Home
            </Link>
            <Link
              href="/search"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-3 rounded-sm text-base font-medium uppercase tracking-wider"
            >
              Search
            </Link>
            <Link
              href="/favorites"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-3 rounded-sm text-base font-medium uppercase tracking-wider"
            >
              <div className="flex items-center justify-between">
                Favorites
                {favoritesCount > 0 && (
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-700 text-xs font-bold text-white">
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
