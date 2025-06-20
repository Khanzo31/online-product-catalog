// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import core components
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import CookieConsentBanner from "@/app/components/CookieConsentBanner";
// --- 1. REMOVE the direct import for GoogleAnalytics ---
// import GoogleAnalytics from "@/app/components/GoogleAnalytics";
// --- 2. ADD the import for our new wrapper component ---
import SuspenseWrapper from "@/app/components/SuspenseWrapper";
import { FavoritesProvider } from "@/app/context/FavoritesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Provenance Post - Online Product Catalog",
  description: "A digital showcase for unique products and collectibles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <FavoritesProvider>
          {/* --- 3. REPLACE <GoogleAnalytics /> with <SuspenseWrapper /> --- */}
          <SuspenseWrapper />

          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />

          <CookieConsentBanner />
        </FavoritesProvider>
      </body>
    </html>
  );
}
