// frontend/src/app/page.tsx
import Image from "next/image";
import Link from "next/link";

// --- TYPE DEFINITIONS ---
interface StrapiImage {
  id: number;
  url: string;
  width: number;
  height: number;
  name: string;
}
interface Product {
  id: number;
  Name: string;
  SKU: string;
  Description: string;
  Price: number;
  Images: StrapiImage[];
}

// --- UPDATED DATA FETCHING FUNCTION ---
// This function is now resilient to the "Bad Request" error on empty collections.
async function getProducts(): Promise<Product[]> {
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  // 1. We start by trying the ideal, efficient API call with populated images.
  const idealApiUrl = `${strapiUrl}/api/products?populate=Images`;

  try {
    let res = await fetch(idealApiUrl, { next: { revalidate: 60 } });

    // 2. Check if the first attempt failed.
    if (!res.ok) {
      // 3. If the failure is a "Bad Request" (status 400), we suspect it's our known issue.
      if (res.status === 400) {
        console.warn(
          'getProducts: Received "Bad Request". This might be due to populating an empty collection. Retrying without populate.'
        );
        // 4. We attempt a fallback API call without the `populate` parameter.
        const fallbackApiUrl = `${strapiUrl}/api/products`;
        res = await fetch(fallbackApiUrl, { next: { revalidate: 60 } });

        // If even the fallback fails, we give up.
        if (!res.ok) {
          console.error(
            "Failed to fetch products on fallback:",
            res.statusText
          );
          return [];
        }
      } else {
        // 5. If it's a different error (like 500, 404, etc.), we log it and fail gracefully.
        console.error("Failed to fetch products:", res.statusText);
        return [];
      }
    }

    // 6. Whether the original or fallback call succeeded, we process the JSON.
    const responseData = await res.json();
    return responseData.data || [];
  } catch (error) {
    // This catches network errors or other issues with the fetch itself.
    console.error("Error fetching products from Strapi:", error);
    return [];
  }
}

// --- PRODUCT CARD COMPONENT ---
function ProductCard({ product }: { product: Product }) {
  const { Name, Price, Images } = product;
  const imageUrl = Images?.[0]?.url;
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <div className="relative h-56 w-full">
        {imageUrl ? (
          <Image
            src={`${strapiUrl}${imageUrl}`}
            alt={Name || "Product Image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {Name || "Untitled Product"}
        </h3>
        <p className="mt-1 text-md font-medium text-gray-600">
          {priceFormatter.format(Price)}
        </p>
      </div>
    </Link>
  );
}

// --- HOME PAGE COMPONENT ---
export default async function HomePage() {
  const products = await getProducts();
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="mb-10 text-center text-4xl font-bold tracking-tight text-gray-900">
        Our Latest Products
      </h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-600">
            No products found. Please check back later!
          </p>
        </div>
      )}
    </main>
  );
}
