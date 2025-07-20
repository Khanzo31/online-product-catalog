// frontend/src/app/components/CookieConsentBanner.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const COOKIE_CONSENT_KEY = "cookie_consent_status";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentStatus) {
      setIsVisible(true);
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      bannerRef.current?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Tab") return;

        const focusableElements =
          bannerRef.current?.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])"
          );
        if (!focusableElements) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        previouslyFocusedElement.current?.focus();
      };
    }
  }, [isVisible]);

  const handleDismiss = (status: "accepted" | "declined") => {
    localStorage.setItem(COOKIE_CONSENT_KEY, status);
    setIsVisible(false);

    if (status === "accepted") {
      router.refresh();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-heading"
      tabIndex={-1}
      className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50 shadow-lg focus:outline-none"
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p id="cookie-consent-heading" className="text-sm text-gray-300">
          We use cookies and local storage to enhance your experience and for
          site analytics. By clicking “Accept,” you agree to our use of these
          technologies.
        </p>
        <div className="flex-shrink-0 flex gap-3">
          <button
            onClick={() => handleDismiss("declined")}
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Decline
          </button>
          <button
            onClick={() => handleDismiss("accepted")}
            className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
