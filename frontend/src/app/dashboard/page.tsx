// frontend/src/app/dashboard/page.tsx
import Link from "next/link";
import { format } from "date-fns";
import { cookies } from "next/headers";

// ... (All your type definitions and data fetching functions remain here)
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
  // ... getStats implementation
  try {
    const [productsRes, inquiriesRes] = await Promise.all([
      fetch(`${strapiUrl}/api/products?pagination[pageSize]=1`, { headers }),
      fetch(`${strapiUrl}/api/inquiries?pagination[pageSize]=1`, { headers }),
    ]);

    if (!productsRes.ok || !inquiriesRes.ok) {
      if (!productsRes.ok)
        console.error("Stats: Product fetch failed", productsRes.statusText);
      if (!inquiriesRes.ok)
        console.error("Stats: Inquiry fetch failed", inquiriesRes.statusText);
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
  // ... getRecentInquiries implementation
  try {
    const response = await fetch(
      `${strapiUrl}/api/inquiries?sort=createdAt:desc&pagination[limit]=5&populate=Product`,
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
          Name: item.Product?.Name || "N/A",
        },
      })
    );
    return inquiries;
  } catch (error) {
    console.error("Error fetching recent inquiries:", error);
    return [];
  }
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default async function DashboardPage() {
  // Security Gate: Protects the page's data fetching logic.
  const cookieStore = await cookies();
  const password = cookieStore.get("dashboard_password")?.value;
  if (password !== process.env.DASHBOARD_PASSWORD) {
    return null; // Exit early
  }

  // This code only runs if the user is authenticated.
  const stats = await getStats();
  const recentInquiries = await getRecentInquiries();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Products" value={stats.productCount} />
        <StatCard title="Total Inquiries" value={stats.inquiryCount} />
      </div>
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Inquiries
        </h3>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <li key={inquiry.id} className="p-4 sm:p-6">
                  {/* ... inquiry item JSX ... */}
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
                          href={`/products/${inquiry.product.documentId}`}
                          className="font-semibold hover:underline"
                        >
                          {inquiry.product.Name || "Product"}
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
