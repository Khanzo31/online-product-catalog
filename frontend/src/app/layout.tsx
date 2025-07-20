// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import core components
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import CookieConsentBanner from "@/app/components/CookieConsentBanner";
import SuspenseWrapper from "@/app/components/SuspenseWrapper";
import { FavoritesProvider } from "@/app/context/FavoritesContext";

const inter = Inter({ subsets: ["latin"] });

// --- START OF DEFINITIVE CHANGE ---
export const metadata: Metadata = {
  title: "AlpialCanada | Antiques & Collectibles",
  description:
    "A curated online catalog of unique antiques and collectibles from AlpialCanada.",
};
// --- END OF DEFINITIVE CHANGE ---

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <FavoritesProvider>
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
