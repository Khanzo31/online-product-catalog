// frontend/src/app/components/Header.tsx
"use client"; // This component now needs to be a client component to use the hook

import Link from "next/link";
import { useFavorites } from "@/app/context/FavoritesContext"; // Import the hook

export default function Header() {
  const { favoritesCount } = useFavorites(); // Get the count from the context

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <nav
        className="container mx-auto px-4 py-4 flex justify-between items-center"
        aria-label="Main Navigation"
      >
        <div className="text-xl font-bold">
          <Link
            href="/"
            className="hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
          >
            The Provenance Post
          </Link>
        </div>
        <ul className="flex space-x-6 items-center">
          {" "}
          {/* Added items-center */}
          <li>
            <Link
              href="/"
              className="text-gray-600 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm px-1"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/search"
              className="text-gray-600 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm px-1"
            >
              Search
            </Link>
          </li>
          <li>
            {/* New Favorites Link */}
            <Link
              href="/favorites"
              className="text-gray-600 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm px-1 flex items-center group"
            >
              Favorites
              {favoritesCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-medium text-white group-hover:bg-red-700 transition-colors">
                  {favoritesCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/about-us"
              className="text-gray-600 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm px-1"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
