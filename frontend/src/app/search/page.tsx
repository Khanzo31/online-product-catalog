"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ProductCard, { ProductCardProps } from "@/app/components/ProductCard";

// --- START: TYPE DEFINITIONS (Simplified) ---
interface ProductType {
  id: number;
  documentId: string;
  Name: string;
}
interface Product extends ProductCardProps {
  SKU: string;
  Description: string;
  Product?: ProductType;
}

// A type for the API response structure
interface StrapiApiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
// --- END: TYPE DEFINITIONS ---

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
        // --- THIS IS THE FIX ---
        // We must reset the page state to 1 whenever a new search is initiated.
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
        Browse Products
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-36 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h2 className="text-xl font-semibold font-serif text-gray-800 dark:text-gray-200 border-b pb-3 dark:border-gray-600">
              Filters
            </h2>
            <div>
              <label
                htmlFor="search-keyword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Search by keyword
              </label>
              <input
                type="text"
                id="search-keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. 'oak table'"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-600 focus:border-red-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="product-type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Product Type
              </label>
              <select
                id="product-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-600 focus:border-red-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Product Types</option>
                {productTypes.map((type) => (
                  <option key={type.id} value={type.documentId}>
                    {type.Name}
                  </option>
                ))}
              </select>
            </div>

            {activeFilters.length > 0 && (
              <button
                onClick={handleClearAll}
                className="w-full text-center text-sm text-red-600 hover:text-red-800 dark:hover:text-red-500 hover:underline"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        <main className="lg:col-span-3">
          {activeFilters.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-semibold dark:text-gray-300">
                Active:
              </span>
              {activeFilters.map((filter) => (
                <span
                  key={filter.label}
                  className="inline-flex items-center gap-x-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-sm font-medium pl-3 pr-1 py-1 rounded-full"
                >
                  {filter.label}
                  <button
                    onClick={filter.onClear}
                    aria-label={`Remove filter: ${filter.label}`}
                    className="flex-shrink-0 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-500 hover:bg-gray-300 hover:text-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-200 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {statusMessage}
              </p>
              <div>
                <label htmlFor="sort-by" className="sr-only">
                  Sort by
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-600 focus:border-red-600 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="updatedAt:desc">Sort by: Latest</option>
                  <option value="Price:asc">Price: Low to High</option>
                  <option value="Price:desc">Price: High to Low</option>
                  <option value="Name:asc">Name: A to Z</option>
                  <option value="Name:desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-center py-16 dark:text-gray-300">Loading...</p>
          ) : results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 animate-fade-in-up">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {page < totalPages && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="bg-red-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:bg-red-300"
                  >
                    {loadingMore ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <h3 className="font-serif text-lg font-semibold text-gray-800 dark:text-gray-200">
                No Products Found
              </h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Try adjusting your filters or search term.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
