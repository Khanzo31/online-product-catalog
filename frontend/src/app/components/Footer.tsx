// frontend/src/app/components/Footer.tsx

import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // --- POLISH: Changed bg-gray-800 to bg-gray-900 ---
    <footer className="bg-gray-900 text-white mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="font-serif text-xl font-semibold tracking-wider">
          AlpialCanada
        </p>

        <div className="mt-6 flex justify-center items-center gap-x-6 gap-y-3 flex-wrap text-gray-400 text-sm tracking-wide">
          <span
            style={{
              direction: "rtl",
              unicodeBidi: "bidi-override",
            }}
            className="hover:text-white transition-colors"
          >
            moc.liamg@adanaclaipia
          </span>

          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="hover:text-white transition-colors">
            613-302-0549
          </span>

          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="inline-flex items-center hover:text-white transition-colors">
            <Image
              src="/globe.svg"
              alt="Location"
              width={14}
              height={14}
              className="mr-2 filter invert opacity-70"
            />
            Located in Ottawa, Canada
          </span>
        </div>

        <p className="mt-8 text-xs text-gray-600 uppercase tracking-widest">
          © {currentYear} AlpialCanada. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
