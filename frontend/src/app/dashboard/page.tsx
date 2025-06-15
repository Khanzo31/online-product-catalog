// frontend/src/app/dashboard/page.tsx

import Link from "next/link";
import { format } from "date-fns";

// =================================================================================
// 1. TYPE DEFINITIONS
// =================================================================================
interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      total: number;
    };
  };
}

interface Inquiry {
  id: number;
  CustomerName: string;
  CustomerEmail: string;
  Message: string;
  createdAt: string;
  product: {
    id: number;
    Name: string;
  };
}

// =================================================================================
// 2. DATA FETCHING FUNCTIONS (MUST BE IN THIS FILE)
// =================================================================================
const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

async function getStats() {
  try {
    const [productsRes, inquiriesRes] = await Promise.all([
      fetch(`${strapiUrl}/api/products?pagination[pageSize]=1`),
      fetch(`${strapiUrl}/api/inquiries?pagination[pageSize]=1`),
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
      `${strapiUrl}/api/inquiries?sort=createdAt:desc&pagination[limit]=5&populate[product][fields][0]=Name`,
      { cache: "no-store" } // Ensure we always get the latest data
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recent inquiries");
    }

    const data: StrapiResponse<Inquiry> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching recent inquiries:", error);
    return [];
  }
}

// =================================================================================
// 3. STAT CARD COMPONENT (MUST BE IN THIS FILE)
// =================================================================================
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

// =================================================================================
// 4. MAIN DASHBOARD PAGE COMPONENT (CORRECTED)
// =================================================================================
export default async function DashboardPage() {
  const stats = await getStats();
  const recentInquiries = await getRecentInquiries();

  return (
    // This div now sits inside the <main> tag from the new layout.tsx
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Products" value={stats.productCount} />
        <StatCard title="Total Inquiries" value={stats.inquiryCount} />
      </div>

      {/* Recent Inquiries Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Inquiries
        </h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <li key={inquiry.id} className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {inquiry.CustomerName}
                        <span className="text-gray-500 font-normal ml-2">
                          ({inquiry.CustomerEmail})
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        Inquired about:{" "}
                        <Link
                          href={`/products/${inquiry.product.id}`}
                          className="font-semibold hover:underline"
                        >
                          {inquiry.product.Name}
                        </Link>
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-500">
                        {format(new Date(inquiry.createdAt), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-gray-500">
                No inquiries found.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
