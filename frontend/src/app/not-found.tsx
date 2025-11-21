// frontend/src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="text-amber-700 font-serif text-6xl font-bold">404</div>
        <h1 className="text-3xl font-serif font-semibold text-gray-900 dark:text-gray-100">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-light">
          The item or page you are looking for might have been moved, sold, or
          no longer exists.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 rounded-sm bg-white border border-stone-300 text-gray-800 hover:bg-stone-50 hover:border-stone-400 transition-all shadow-sm"
          >
            Return Home
          </Link>
          <Link
            href="/search"
            className="px-8 py-3 rounded-sm bg-red-900 text-white hover:bg-red-800 transition-all shadow-md"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
