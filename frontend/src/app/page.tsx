// frontend/src/app/page.tsx
import ProductCard from "@/app/components/ProductCard";
import { ProductCardProps } from "@/app/components/ProductCard";

async function getProducts(): Promise<ProductCardProps[]> {
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";
  const apiUrl = `${strapiUrl}/api/products?populate=Images&sort=createdAt:desc`;
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

export default async function HomePage() {
  const products = await getProducts();
  return (
    <main className="container mx-auto px-4 py-12">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">
            No products found. Please check back later!
          </p>
        </div>
      )}
    </main>
  );
}
