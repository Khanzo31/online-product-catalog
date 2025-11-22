// frontend/src/app/dashboard/page.tsx
import Link from "next/link";
import { format } from "date-fns";
import { cookies } from "next/headers";

interface Inquiry {
  id: number;
  CustomerName: string;
  CustomerEmail: string;
  Message: string;
  createdAt: string;
  product: {
    id: number;
    documentId: string;
    Name: string;
  };
}

interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      total: number;
    };
  };
}

interface RawInquiryItem {
  id: number;
  documentId: string;
  CustomerName: string;
  CustomerEmail: string;
  Message: string;
  createdAt: string;
  Product?: {
    id: number;
    documentId: string;
    Name: string;
  };
}

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

const headers = {
  Authorization: `bearer ${process.env.STRAPI_API_TOKEN}`,
};

async function getStats() {
  try {
    const [productsRes, inquiriesRes] = await Promise.all([
      fetch(`${strapiUrl}/api/products?pagination[pageSize]=1`, { headers }),
      fetch(`${strapiUrl}/api/inquiries?pagination[pageSize]=1`, { headers }),
    ]);

    if (!productsRes.ok || !inquiriesRes.ok) {
      throw new Error("Failed to fetch stats");
    }

    const productsData: StrapiResponse<unknown> = await productsRes.json();
    const inquiriesData: StrapiResponse<unknown> = await inquiriesRes.json();

    return {
      productCount: productsData.meta.pagination.total,
      inquiryCount: inquiriesData.meta.pagination.total,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { productCount: 0, inquiryCount: 0 };
  }
}

async function getRecentInquiries(): Promise<Inquiry[]> {
  try {
    const response = await fetch(
      `${strapiUrl}/api/inquiries?sort=createdAt:desc&pagination[limit]=6&populate=Product`,
      { cache: "no-store", headers }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recent inquiries");
    }

    const responseData = await response.json();

    const inquiries: Inquiry[] = (responseData.data || []).map(
      (item: RawInquiryItem) => ({
        id: item.id,
        CustomerName: item.CustomerName,
        CustomerEmail: item.CustomerEmail,
        Message: item.Message,
        createdAt: item.createdAt,
        product: {
          id: item.Product?.id || 0,
          documentId: item.Product?.documentId || "",
          Name: item.Product?.Name || "Unknown Product",
        },
      })
    );
    return inquiries;
  } catch (error) {
    console.error("Error fetching recent inquiries:", error);
    return [];
  }
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-stone-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
      <div className="p-3 bg-stone-100 dark:bg-gray-700 rounded-full text-amber-700 dark:text-amber-500">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
          {title}
        </h3>
        <p className="mt-1 text-3xl font-serif font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const password = cookieStore.get("dashboard_password")?.value;
  if (password !== process.env.DASHBOARD_PASSWORD) {
    return null;
  }

  const stats = await getStats();
  const recentInquiries = await getRecentInquiries();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 dark:text-white">
          Overview
        </h2>
        <p className="text-stone-500 dark:text-stone-400 mt-2">
          Welcome back. Here is what&apos;s happening with your collection.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        <StatCard
          title="Total Inventory"
          value={stats.productCount}
          icon={
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Inquiries"
          value={stats.inquiryCount}
          icon={
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
        />

        {/* Quick Action Card */}
        <div className="bg-red-900 text-white p-6 rounded-sm border border-red-800 shadow-md flex flex-col justify-center items-start">
          <h3 className="font-serif font-bold text-xl mb-2">Manage Content</h3>
          <p className="text-red-100 text-sm mb-4">
            Add or edit products in Strapi.
          </p>
          <a
            href={
              process.env.NODE_ENV === "production"
                ? "https://my-strapi-backend-l5qf.onrender.com/admin"
                : "http://localhost:1337/admin"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-red-900 px-4 py-2 rounded-sm text-sm font-bold hover:bg-red-50 transition-colors"
          >
            Open Admin Panel →
          </a>
        </div>
      </div>

      {/* Inquiries Section */}
      <div>
        <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-stone-200 dark:border-gray-700">
          Recent Inquiries
        </h3>

        <div className="space-y-4">
          {recentInquiries.length > 0 ? (
            recentInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-white dark:bg-gray-800 border border-stone-200 dark:border-gray-700 p-6 rounded-sm shadow-sm hover:border-amber-500 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {inquiry.CustomerName}
                      </span>
                      <a
                        href={`mailto:${inquiry.CustomerEmail}`}
                        className="text-sm text-stone-500 hover:text-amber-600 transition-colors"
                      >
                        &lt;{inquiry.CustomerEmail}&gt;
                      </a>
                    </div>

                    {/* --- FIX: Escaped double quotes --- */}
                    <div className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-3 bg-stone-50 dark:bg-gray-900 p-3 rounded-sm border border-stone-100 dark:border-gray-700 italic">
                      &quot;{inquiry.Message}&quot;
                    </div>

                    <div className="text-sm">
                      <span className="text-stone-400">Regarding: </span>
                      <Link
                        href={`/products/${inquiry.product.documentId}`}
                        className="font-medium text-amber-700 hover:underline dark:text-amber-500"
                      >
                        {inquiry.product.Name}
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <span className="text-xs font-medium text-stone-400 uppercase tracking-wider bg-stone-100 dark:bg-gray-700 px-2 py-1 rounded-sm">
                      {format(new Date(inquiry.createdAt), "MMM dd, yyyy")}
                    </span>
                    <a
                      href={`mailto:${inquiry.CustomerEmail}?subject=Re: Inquiry about ${inquiry.product.Name}`}
                      className="text-sm font-bold text-red-900 dark:text-red-400 hover:text-red-700 flex items-center gap-1 mt-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                      Reply
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center border-2 border-dashed border-stone-200 dark:border-gray-700 rounded-sm">
              <p className="text-stone-500 dark:text-stone-400">
                No inquiries found yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
