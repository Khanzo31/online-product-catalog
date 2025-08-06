// frontend/src/app/components/Footer.tsx

import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg font-semibold">AlpialCanada</p>

        <div className="mt-4 flex justify-center items-center gap-x-6 gap-y-2 flex-wrap text-gray-300">
          {/* --- OBFUSCATED EMAIL ---
              This displays 'alpialcanada@gmail.com' to users but is structured
              in reverse in the HTML to confuse basic email-harvesting bots.
              The 'direction: rtl' and 'unicode-bidi: bidi-override' CSS properties
              make the browser render the reversed text in the correct order.
           */}
          <span
            style={{
              direction: "rtl",
              unicodeBidi: "bidi-override",
            }}
          >
            moc.liamg@adanaclaipia
          </span>

          <span className="hidden sm:inline text-gray-500">|</span>
          <span>613-302-0549</span>

          {/* --- START OF UPDATE --- */}
          <span className="hidden sm:inline text-gray-500">|</span>
          <span className="inline-flex items-center">
            <Image
              src="/globe.svg"
              alt="Location"
              width={16}
              height={16}
              className="mr-2 filter invert"
            />
            Located in Ottawa, Canada
          </span>
          {/* --- END OF UPDATE --- */}
        </div>

        <p className="mt-6 text-sm text-gray-400">
          © {currentYear} AlpialCanada. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
