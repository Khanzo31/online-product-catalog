// frontend/src/app/components/AdminToolbar.tsx
"use client";

import Link from "next/link";
import { logoutAdmin } from "@/app/actions/admin";

export default function AdminToolbar() {
  return (
    <div className="bg-red-900 text-white text-xs font-bold py-2 px-4 flex justify-between items-center fixed top-0 left-0 right-0 z-[60]">
      <div className="flex items-center gap-4">
        <span className="uppercase tracking-wider">Admin Mode Active</span>
        <Link href="/dashboard" className="hover:underline text-red-100">
          Go to Dashboard
        </Link>
      </div>
      <button
        onClick={() => logoutAdmin()}
        className="hover:underline text-red-100"
      >
        Log Out
      </button>
    </div>
  );
}
