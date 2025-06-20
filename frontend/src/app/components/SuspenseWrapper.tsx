// frontend/src/app/components/SuspenseWrapper.tsx
"use client";

import { Suspense } from "react";
import GoogleAnalytics from "./GoogleAnalytics";

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalytics />
    </Suspense>
  );
}
