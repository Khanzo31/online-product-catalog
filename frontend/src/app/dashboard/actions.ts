// frontend/src/app/dashboard/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const PASSWORD_COOKIE = "dashboard_password";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  const password = formData.get("password");

  if (password === process.env.DASHBOARD_PASSWORD) {
    // --- THE CORRECT FIX ---
    // The cookies() function returns a Promise. We MUST await it before
    // calling the .set() method on the resolved cookie store.
    (await cookies()).set(PASSWORD_COOKIE, password as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    redirect("/dashboard");
  } else {
    return "Incorrect password. Please try again.";
  }
}
