// frontend/src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
// Import the new banner component
import CookieConsentBanner from "@/app/components/CookieConsentBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Provenance Post - Online Product Catalog",
  description: "A digital showcase for unique and beautiful products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        {/* Add the Cookie Consent Banner here */}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
