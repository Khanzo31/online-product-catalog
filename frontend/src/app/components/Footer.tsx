// frontend/src/app/components/Footer.tsx

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
        </div>

        <p className="mt-6 text-sm text-gray-400">
          © {currentYear} AlpialCanada. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
