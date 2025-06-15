// frontend/src/app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>© {currentYear} The Provenance Post. All Rights Reserved.</p>
        <nav aria-label="Secondary" className="mt-2">
          <Link
            href="/about-us"
            className="mx-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
          >
            About Us
          </Link>
          <span className="text-gray-500">|</span>
          <Link
            href="/privacy-policy"
            className="mx-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
