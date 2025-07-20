// frontend/src/app/components/Footer.tsx

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg font-semibold">AlpialCanada</p>

        <div className="mt-4 flex justify-center items-center gap-x-6 gap-y-2 flex-wrap text-gray-300">
          {/* UPDATED: Email address is now plain text */}
          <span>alpialcanada@gmail.com</span>
          <span className="hidden sm:inline text-gray-500">|</span>
          {/* UPDATED: Phone number is now plain text */}
          <span>613-302-0549</span>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          © {currentYear} AlpialCanada. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
