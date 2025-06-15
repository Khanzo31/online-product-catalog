// frontend/src/app/components/CookieConsentBanner.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "cookie_consent_status";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentStatus) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          We use cookies and local storage to enhance your experience and for
          site analytics. By clicking “Accept,” you agree to our use of these
          technologies. For more details, see our{" "}
          <Link href="/privacy-policy" className="underline hover:text-white">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex-shrink-0 flex gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
