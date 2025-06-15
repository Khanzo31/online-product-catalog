// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import core components
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import CookieConsentBanner from "@/app/components/CookieConsentBanner";
import GoogleAnalytics from "@/app/components/GoogleAnalytics";

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
        {/* Render Analytics component - it will only load scripts if consent is given */}
        <GoogleAnalytics />

        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />

        {/* The banner will only show if consent has not been given */}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
