// frontend/src/app/dashboard/layout.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import LoginForm from "./LoginForm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const password = cookieStore.get("dashboard_password")?.value;

  // If the user is NOT logged in, show the login form.
  if (password !== process.env.DASHBOARD_PASSWORD) {
    return <LoginForm />;
  }

  // If the user IS logged in, show the dashboard shell and the page content.
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
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
