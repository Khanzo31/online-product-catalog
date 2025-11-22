// frontend/src/app/components/AdminControls.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/app/actions/admin";
import toast from "react-hot-toast";

interface AdminControlsProps {
  documentId: string;
  isAdmin: boolean;
}

// Note: 'numericId' removed as it is not needed for the list view link
export default function AdminControls({
  documentId,
  isAdmin,
}: AdminControlsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  if (!isAdmin) return null;

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to PERMANENTLY DELETE this product? This cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteProduct(documentId);

    if (result.success) {
      toast.success("Product deleted successfully");
      router.push("/dashboard");
      router.refresh();
    } else {
      toast.error("Failed to delete product");
      setIsDeleting(false);
    }
  };

  const strapiBase =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
  const editUrl = `${strapiBase.replace(
    "/api",
    ""
  )}/admin/content-manager/collection-types/api::product.product`;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2 animate-fade-in-up">
      <a
        href={editUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
        title="Open Product List in Strapi"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </a>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 hover:scale-105 transition-all disabled:bg-gray-400"
        title="Delete Product"
      >
        {isDeleting ? (
          <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
