// frontend/src/app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>© {currentYear} The Provenance Post. All Rights Reserved.</p>
        <div className="mt-2">
          <Link href="/about-us" className="mx-2 hover:underline">
            About Us
          </Link>
          <span className="text-gray-500">|</span>
          <Link href="/privacy-policy" className="mx-2 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
