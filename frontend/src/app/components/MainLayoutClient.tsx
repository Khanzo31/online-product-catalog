// frontend/src/app/components/MainLayoutClient.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AdminToolbar from "@/app/components/AdminToolbar";
import SuspenseWrapper from "@/app/components/SuspenseWrapper";
import CookieConsentBanner from "@/app/components/CookieConsentBanner";

export default function MainLayoutClient({
  children,
  isAdmin,
}: {
  children: React.ReactNode;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // Determine if we need to offset the header
  const showToolbar = isAdmin && !isDashboard;

  return (
    <>
      {showToolbar && <AdminToolbar />}

      <SuspenseWrapper />

      {/* FIX: Pass topOffset prop */}
      {!isDashboard && <Header topOffset={showToolbar} />}

      <main className={`flex-grow ${isDashboard ? "" : "pt-24 md:pt-28"}`}>
        {children}
      </main>

      {!isDashboard && <Footer />}

      <CookieConsentBanner />
    </>
  );
}
