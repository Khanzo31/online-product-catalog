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
  documentId: string;
  Name: string;
  Price: number;
  Images: StrapiImage[];
}

// --- DATA FETCHING FUNCTION (No changes needed) ---
async function getProducts(): Promise<Product[]> {
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";
  const apiUrl = `${strapiUrl}/api/products?populate=*&sort=createdAt:desc`;
  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) {
      console.error(
        `Failed to fetch from ${apiUrl}:`,
        res.status,
        res.statusText
      );
      return [];
    }
    const responseData = await res.json();
    return responseData.data || [];
  } catch (error) {
    console.error("Critical error fetching products:", error);
    return [];
  }
}

// --- PRODUCT CARD COMPONENT (UPDATED) ---
function ProductCard({ product }: { product: Product }) {
  const { documentId, Name, Price, Images } = product;
  const imageUrl = Images?.[0]?.url;
  // NOTE: The `strapiUrl` is no longer needed for the image
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  });
  return (
    <Link
      href={`/products/${documentId}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 shadow-sm"
    >
      <div className="relative h-56 w-full flex items-center justify-center bg-gray-200">
        {imageUrl ? (
          <Image
            // --- FIX: Use the imageUrl directly as it's an absolute path from Cloudinary ---
            src={imageUrl}
            alt={Name || "Product Image"}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>
      <div className="bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {Name || "Untitled Product"}
        </h3>
        <p className="mt-1 text-md font-medium text-gray-600">
          {priceFormatter.format(Price || 0)}
        </p>
      </div>
    </Link>
  );
}

// --- HOME PAGE COMPONENT (No changes needed) ---
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
