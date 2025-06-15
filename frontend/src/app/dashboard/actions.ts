// frontend/src/app/dashboard/actions.ts
"use server";

import { cookies } from "next/headers";

const PASSWORD_COOKIE = "dashboard_password";

export async function login(formData: FormData) {
  const password = formData.get("password");

  if (password === process.env.DASHBOARD_PASSWORD) {
    // --- THE FIX ---
    // We must await the cookies() function to get the store object.
    (await cookies()).set(PASSWORD_COOKIE, password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return { success: true, error: null };
  } else {
    return { success: false, error: "Incorrect password." };
  }
}
