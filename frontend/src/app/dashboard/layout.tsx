// frontend/src/app/dashboard/layout.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import LoginForm from "./LoginForm";

// --- THE FIX (Part 1) ---
// The layout component must be declared as `async` to use `await`.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- THE FIX (Part 2) ---
  // We must `await` the cookies() function.
  const cookieStore = await cookies();
  const password = cookieStore.get("dashboard_password")?.value;

  if (password !== process.env.DASHBOARD_PASSWORD) {
    return <LoginForm />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
            <Link
              href="/"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              ← Back to Main Site
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
