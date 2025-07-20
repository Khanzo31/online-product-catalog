// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
// --- 1. Import the Toaster component ---
import { Toaster } from "react-hot-toast";

// Import core components
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import CookieConsentBanner from "@/app/components/CookieConsentBanner";
import SuspenseWrapper from "@/app/components/SuspenseWrapper";
import { FavoritesProvider } from "@/app/context/FavoritesContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AlpialCanada | Antiques & Collectibles",
  description:
    "A curated online catalog of unique antiques and collectibles from AlpialCanada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="flex flex-col min-h-screen font-sans">
        <FavoritesProvider>
          {/* --- 2. Add the Toaster component here --- */}
          <Toaster position="bottom-right" />
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
