// frontend/src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";
import { ProductCardProps } from "@/app/components/ProductCard";

const PAGE_SIZE = 8;

export default function HomePage() {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  // Effect for the initial page load
  useEffect(() => {
    // --- START: THE FIX ---
    // Move the data-fetching function inside the useEffect hook.
    // This ensures it's part of the hook's scope and resolves the dependency warning.
    const fetchProducts = async (pageNum: number) => {
      try {
        const apiUrl = `${strapiUrl}/api/products?populate=Images&sort=createdAt:desc&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}`;
        const res = await fetch(apiUrl);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const responseData = await res.json();
        return {
          data: responseData.data || [],
          pageCount: responseData.meta.pagination.pageCount || 0,
        };
      } catch (error) {
        console.error("Error fetching products:", error);
        return { data: [], pageCount: 0 };
      }
    };

    const loadInitialProducts = async () => {
      setLoadingInitial(true);
      const { data, pageCount } = await fetchProducts(1);
      setProducts(data);
      setTotalPages(pageCount);
      setPage(1);
      setLoadingInitial(false);
    };

    loadInitialProducts();
    // The dependency array is now correct because strapiUrl is the only external variable.
  }, [strapiUrl]);
  // --- END: THE FIX ---

  // Handler for the "Load More" button
  const handleLoadMore = async () => {
    // We can define the fetch logic again here, or keep it separate if preferred.
    // For simplicity, we'll redefine it here to keep concerns separate.
    const fetchProducts = async (pageNum: number) => {
      try {
        const apiUrl = `${strapiUrl}/api/products?populate=Images&sort=createdAt:desc&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}`;
        const res = await fetch(apiUrl);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const responseData = await res.json();
        return {
          data: responseData.data || [],
        };
      } catch (error) {
        console.error("Error fetching products:", error);
        return { data: [] };
      }
    };

    setLoadingMore(true);
    const nextPage = page + 1;
    const { data } = await fetchProducts(nextPage);
    setProducts((prevProducts) => [...prevProducts, ...data]);
    setPage(nextPage);
    setLoadingMore(false);
  };

  if (loadingInitial) {
    return <p className="text-center py-16">Loading products...</p>;
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h2 className="font-serif text-4xl font-bold mb-10 text-center text-gray-800">
        Recently Added
      </h2>
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {page < totalPages && (
            <div className="text-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-red-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:bg-red-300"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
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
