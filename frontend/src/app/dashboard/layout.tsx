// frontend/src/app/dashboard/layout.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import LoginForm from "./LoginForm";
import Image from "next/image";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const password = cookieStore.get("dashboard_password")?.value;

  if (password !== process.env.DASHBOARD_PASSWORD) {
    return <LoginForm />;
  }

  return (
    <div className="bg-stone-50 dark:bg-gray-950 min-h-screen font-sans">
      {/* --- POLISH: Premium Dark Header --- */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative h-10 w-10">
                  <Image
                    src="/alpial-logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-serif font-bold text-white tracking-wider uppercase group-hover:text-amber-500 transition-colors">
                    Admin Panel
                  </h1>
                  <span className="text-xs text-gray-400 uppercase tracking-widest">
                    AlpialCanada
                  </span>
                </div>
              </Link>
            </div>

            <Link
              href="/"
              className="px-4 py-2 rounded-sm text-sm font-medium text-stone-300 border border-stone-700 hover:bg-stone-800 hover:text-white transition-all"
            >
              ← Back to Main Site
            </Link>
          </div>
        </div>
      </header>
      <main className="py-10">{children}</main>
    </div>
  );
}
