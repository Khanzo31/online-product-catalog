// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
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
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.alpialcanada.com"),
  alternates: {
    canonical: "/",
  },
  title: "AlpialCanada | Antiques & Collectibles",
  description:
    "Discover a curated collection of unique antiques, vintage toys, and rare collectibles at AlpialCanada. Browse our online catalog to find your next treasure today.",

  manifest: "/site.webmanifest",

  openGraph: {
    title: "AlpialCanada | Antiques & Collectibles",
    description:
      "A curated online catalog of unique antiques, vintage toys, and rare collectibles.",
    url: "https://www.alpialcanada.com",
    siteName: "AlpialCanada",
    images: [
      {
        url: "/product-collage-1.png", // Next.js resolves this to an absolute URL
        width: 1200,
        height: 630,
        alt: "A collage of collectible die-cast cars and antiques.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlpialCanada | Antiques & Collectibles",
    description:
      "A curated online catalog of unique antiques, vintage toys, and rare collectibles.",
    images: ["/product-collage-1.png"],
  },

  // --- THIS IS THE RECOMMENDED UPDATE ---
  icons: {
    // This is the primary icon Google will look for.
    icon: "/favicon.ico",
    // This provides a high-resolution icon for Apple devices and other services.
    apple: "/apple-touch-icon.png",
  },
  // --- END OF UPDATE ---
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.alpialcanada.com/",
    name: "AlpialCanada",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://www.alpialcanada.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "AlpialCanada",
      logo: {
        "@type": "ImageObject",
        url: "https://www.alpialcanada.com/alpial-logo.png",
      },
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="flex flex-col min-h-screen font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <FavoritesProvider>
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
