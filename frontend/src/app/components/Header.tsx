// frontend/src/app/components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
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
        <ul className="flex space-x-6">
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
