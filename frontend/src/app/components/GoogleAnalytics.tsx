// frontend/src/app/components/GoogleAnalytics.tsx

"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent_status");
    if (GA_MEASUREMENT_ID && consent === "accepted") {
      const url = `${pathname}?${searchParams.toString()}`;
      // --- THIS IS THE FIX ---
      // @ts-expect-error - gtag is defined on the window object by the script
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  const consent =
    typeof window !== "undefined"
      ? localStorage.getItem("cookie_consent_status")
      : null;

  if (!GA_MEASUREMENT_ID || consent !== "accepted") {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
