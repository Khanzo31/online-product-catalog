// frontend/src/app/search/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ProductCard from "@/app/components/ProductCard";
import ProductCardSkeleton from "@/app/components/ProductCardSkeleton";
import { Product, ProductType, StrapiApiResponse } from "@/types";
import RecentlyViewed from "@/app/components/RecentlyViewed"; // Import RecentlyViewed

const PAGE_SIZE = 12;

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusMessage, setStatusMessage] = useState("Loading products...");
  const [sortBy, setSortBy] = useState("updatedAt:desc");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false); // Mobile State
  const isInitialMount = useRef(true);

  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = useCallback(
    async (targetPage: number, isNewSearch: boolean = false) => {
      if (isNewSearch) {
        setLoading(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }
      setStatusMessage("Searching...");

      const params = new URLSearchParams({
        populate: "*",
        "pagination[page]": targetPage.toString(),
        "pagination[pageSize]": PAGE_SIZE.toString(),
        sort: sortBy,
      });

      if (debouncedSearchTerm.trim()) {
        const term = debouncedSearchTerm.trim();
        params.append("filters[$or][0][Name][$containsi]", term);
        params.append("filters[$or][1][Description][$containsi]", term);
      }

      if (selectedType) {
        params.append("filters[Product][documentId][$eq]", selectedType);
      }

      try {
        const apiUrl = `${strapiUrl}/api/products?${params.toString()}`;
        const res = await fetch(apiUrl);

        if (!res.ok) {
          const errorBody = await res.text();
          console.error("API Error Response:", errorBody);
          throw new Error(`Product search failed with status: ${res.status}`);
        }

        const responseData: StrapiApiResponse<Product> = await res.json();
        const newResults = responseData.data || [];
        const paginationMeta = responseData.meta.pagination;

        setTotalPages(paginationMeta.pageCount);

        setResults((prevResults) => {
          const updatedResults = isNewSearch
            ? newResults
            : [...prevResults, ...newResults];

          const totalFound = paginationMeta.total;
          const currentCount = updatedResults.length;
          setStatusMessage(
            totalFound > 0
              ? `Showing ${currentCount} of ${totalFound} products.`
              : "No products found."
          );

          return updatedResults;
        });
      } catch (error) {
        setStatusMessage("An error occurred during search.");
        console.error(error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearchTerm, selectedType, sortBy, strapiUrl]
  );

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const res = await fetch(`${strapiUrl}/api/product-types`);
        setProductTypes((await res.json()).data || []);
      } catch (error) {
        console.error("Failed to fetch product types:", error);
      }
    };
    fetchProductTypes();
  }, [strapiUrl]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      handleSearch(1, true);
      return;
    }
    handleSearch(1, true);
  }, [debouncedSearchTerm, selectedType, sortBy, handleSearch]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(nextPage, false);
  };

  const handleClearSearch = () => setSearchTerm("");
  const handleClearType = () => setSelectedType("");

  const handleClearAll = () => {
    handleClearSearch();
    handleClearType();
  };

  const selectedTypeName =
    productTypes.find((pt) => pt.documentId === selectedType)?.Name || "";

  const activeFilters = [];
  if (debouncedSearchTerm) {
    activeFilters.push({
      label: `Keyword: "${debouncedSearchTerm}"`,
      onClear: handleClearSearch,
    });
  }
  if (selectedType && selectedTypeName) {
    activeFilters.push({
      label: `Type: ${selectedTypeName}`,
      onClear: handleClearType,
    });
  }

  // Reusable Filter Component to avoid code duplication
  const FilterContent = () => (
    <>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="search-keyword"
            className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
          >
            Keyword
          </label>
          <input
            type="text"
            id="search-keyword"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g. 'oak table'"
            className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-sm shadow-sm focus:ring-1 focus:ring-amber-600 focus:border-amber-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="product-type"
            className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
          >
            Category
          </label>
          <select
            id="product-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-sm shadow-sm focus:ring-1 focus:ring-amber-600 focus:border-amber-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
          >
            <option value="">All Categories</option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.documentId}>
                {type.Name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {activeFilters.length > 0 && (
        <button
          onClick={handleClearAll}
          className="w-full text-center text-sm font-medium text-amber-700 hover:text-amber-900 dark:hover:text-amber-500 hover:underline transition-colors mt-6"
        >
          Clear All Filters
        </button>
      )}
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200 tracking-tight">
        Browse Collection
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* --- MOBILE FILTER TOGGLE --- */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-stone-300 px-4 py-3 rounded-sm shadow-sm text-gray-800 font-serif tracking-wide hover:bg-stone-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-amber-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Refine Collection
          </button>
        </div>

        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-36 bg-stone-50 dark:bg-gray-800 p-6 rounded-sm border border-stone-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100 border-b border-stone-200 dark:border-gray-600 pb-3 mb-6 tracking-wide uppercase">
              Refine Search
            </h2>
            <FilterContent />
          </div>
        </aside>

        {/* --- MOBILE DRAWER (Modal) --- */}
        {isMobileFiltersOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-gray-900 shadow-xl flex flex-col animate-slide-in-right">
              <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-gray-700">
                <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100">
                  Refine Search
                </h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <FilterContent />
              </div>
              <div className="p-6 border-t border-stone-200 dark:border-gray-700">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full bg-amber-700 text-white px-4 py-3 rounded-sm text-lg font-serif hover:bg-amber-800 transition-colors"
                >
                  View Results
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="lg:col-span-3">
          {activeFilters.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                Active filters:
              </span>
              {activeFilters.map((filter) => (
                <span
                  key={filter.label}
                  className="inline-flex items-center gap-x-2 bg-stone-100 border border-stone-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm px-3 py-1.5 rounded-full"
                >
                  {filter.label}
                  <button
                    onClick={filter.onClear}
                    aria-label={`Remove filter: ${filter.label}`}
                    className="flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-stone-200 dark:hover:bg-gray-600 transition-colors focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-stone-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0 font-serif italic">
                {statusMessage}
              </p>
              <div className="flex items-center">
                <label htmlFor="sort-by" className="sr-only">
                  Sort by
                </label>
                <span className="text-sm text-gray-500 mr-3">Sort by:</span>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-48 pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-amber-600 focus:border-amber-600 rounded-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="updatedAt:desc">Latest Arrivals</option>
                  <option value="Price:asc">Price: Low to High</option>
                  <option value="Price:desc">Price: High to Low</option>
                  <option value="Name:asc">Name: A to Z</option>
                  <option value="Name:desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 animate-fade-in-up">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {page < totalPages && (
                <div className="text-center mt-16">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="bg-transparent border border-amber-700 text-amber-700 hover:bg-amber-50 px-10 py-3 rounded-sm text-lg font-serif tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? "Loading..." : "Load More Items"}
                  </button>
                </div>
              )}
            </>
          ) : (
            // --- SMART EMPTY STATE ---
            <div className="space-y-12">
              <div className="text-center py-16 border border-stone-100 bg-stone-50 dark:bg-gray-800 dark:border-gray-700 rounded-sm">
                <h3 className="font-serif text-xl text-gray-800 dark:text-gray-200 mb-2">
                  No Products Found
                </h3>
                {/* Fixed ESLint Error below */}
                <p className="text-gray-500 dark:text-gray-400 font-light">
                  We couldn&apos;t find any items matching your criteria.
                </p>
                <button
                  onClick={handleClearAll}
                  className="mt-6 text-amber-700 hover:underline"
                >
                  Clear all filters
                </button>
              </div>

              {/* Show recently viewed to keep them on site */}
              <RecentlyViewed />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
