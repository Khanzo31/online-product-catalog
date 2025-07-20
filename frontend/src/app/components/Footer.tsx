// frontend/src/app/components/Footer.tsx

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg font-semibold">AlpialCanada</p>
        <div className="mt-4 flex justify-center items-center gap-x-6 gap-y-2 flex-wrap text-gray-300">
          <a
            href="mailto:alpialcanada@gmail.com" // UPDATED: Email address
            className="hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
          >
            alpialcanada@gmail.com
          </a>
          <span className="hidden sm:inline text-gray-500">|</span>
          <a
            href="tel:+16133020549" // UPDATED: Phone number for click-to-call
            className="hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
          >
            613-302-0549
          </a>
        </div>
        <p className="mt-6 text-sm text-gray-400">
          © {currentYear} AlpialCanada. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
