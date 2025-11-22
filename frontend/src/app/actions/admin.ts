// frontend/src/app/actions/admin.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

export async function deleteProduct(documentId: string) {
  // 1. Security Check: Verify the admin cookie exists
  const cookieStore = await cookies();
  const password = cookieStore.get("dashboard_password")?.value;

  if (password !== process.env.DASHBOARD_PASSWORD) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // 2. Call Strapi API to delete
    const res = await fetch(`${strapiUrl}/api/products/${documentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete product in Strapi");
    }

    return { success: true };
  } catch (error) {
    console.error("Delete Product Error:", error);
    return { success: false, message: "Failed to delete product" };
  }
}

export async function logoutAdmin() {
  (await cookies()).delete("dashboard_password");
  redirect("/");
}
