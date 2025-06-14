// frontend/src/app/components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/" className="hover:text-indigo-600">
            The Provenance Post
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-gray-600 hover:text-indigo-600">
                Home
              </Link>
            </li>
            {/* --- ADD THIS NEW LINK --- */}
            <li>
              <Link
                href="/search"
                className="text-gray-600 hover:text-indigo-600"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                href="/about-us"
                className="text-gray-600 hover:text-indigo-600"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
