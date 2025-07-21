// frontend/src/app/search/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ProductCard, { ProductCardProps } from "@/app/components/ProductCard";

// --- START: TYPE DEFINITIONS ---
interface ProductType {
  id: number;
  documentId: string;
  Name: string;
  CustomProperties?: { name: string; type: string }[];
}
interface Product extends ProductCardProps {
  SKU: string;
  Description: string;
  CustomPropertyValues?: { [key: string]: string | number };
  Product?: ProductType;
}
interface CustomFilterValues {
  [key: string]: string;
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

const PAGE_SIZE = 12; // Increased for a wider grid

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
  const [customProperties, setCustomProperties] = useState<
    { name: string; type: string }[]
  >([]);
  const [customFilterValues, setCustomFilterValues] =
    useState<CustomFilterValues>({});
  const [statusMessage, setStatusMessage] = useState("Loading products...");
  const [sortBy, setSortBy] = useState("default");
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
        setResults([]);
        setPage(1);
      } else {
        setLoadingMore(true);
      }
      setStatusMessage("Searching...");

      const params = new URLSearchParams({
        populate: "*",
        "pagination[page]": targetPage.toString(),
        "pagination[pageSize]": PAGE_SIZE.toString(),
      });

      if (debouncedSearchTerm.trim()) {
        params.append("filters[Name][$containsi]", debouncedSearchTerm.trim());
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
        let newResults = responseData.data || [];

        if (Object.values(customFilterValues).some((v) => v.trim() !== "")) {
          newResults = newResults.filter((product) => {
            return Object.entries(customFilterValues).every(([key, value]) => {
              if (!value.trim()) return true;
              const productValue = product.CustomPropertyValues?.[key];
              if (productValue === null || productValue === undefined)
                return false;
              return productValue
                .toString()
                .toLowerCase()
                .includes(value.trim().toLowerCase());
            });
          });
        }

        setResults((prev) =>
          isNewSearch ? newResults : [...prev, ...newResults]
        );
        setTotalPages(responseData.meta.pagination.pageCount);
        const totalFound = responseData.meta.pagination.total;
        const currentCount = isNewSearch
          ? newResults.length
          : results.length + newResults.length;
        setStatusMessage(
          totalFound > 0
            ? `Showing ${currentCount} of ${totalFound} products.`
            : "No products found."
        );
      } catch (error) {
        setStatusMessage("An error occurred during search.");
        console.error(error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      debouncedSearchTerm,
      selectedType,
      customFilterValues,
      strapiUrl,
      results.length,
    ]
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
    handleSearch(1, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const fetchCustomProperties = async () => {
      if (selectedType) {
        try {
          const res = await fetch(
            `${strapiUrl}/api/product-types?filters[documentId][$eq]=${selectedType}&populate=*`
          );
          setCustomProperties(
            (await res.json()).data?.[0]?.CustomProperties || []
          );
        } catch (error) {
          console.error("Failed to fetch custom properties:", error);
          setCustomProperties([]);
        }
      } else {
        setCustomProperties([]);
      }
      setCustomFilterValues({});
    };

    fetchCustomProperties();
    handleSearch(1, true);
  }, [debouncedSearchTerm, selectedType]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isInitialMount.current) {
      handleSearch(1, true);
    }
  }, [customFilterValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(nextPage, false);
  };

  useEffect(() => {
    if (results.length > 1) {
      const sortedResults = [...results].sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.Price - b.Price;
          case "price-desc":
            return b.Price - a.Price;
          case "name-asc":
            return a.Name.localeCompare(b.Name);
          case "name-desc":
            return b.Name.localeCompare(a.Name);
          default:
            return 0;
        }
      });
      if (JSON.stringify(sortedResults) !== JSON.stringify(results)) {
        setResults(sortedResults);
      }
    }
  }, [sortBy, results]);

  const handleClearSearch = () => setSearchTerm("");
  const handleClearType = () => setSelectedType("");
  const handleClearCustomFilter = (key: string) => {
    setCustomFilterValues((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };
  const handleClearAll = () => {
    handleClearSearch();
    handleClearType();
    setCustomFilterValues({});
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
  Object.entries(customFilterValues).forEach(([key, value]) => {
    if (value) {
      activeFilters.push({
        label: `${key}: "${value}"`,
        onClear: () => handleClearCustomFilter(key),
      });
    }
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold mb-8 text-center text-gray-800">
        Browse Products
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-28 space-y-6 bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold font-serif text-gray-800 border-b pb-3">
              Filters
            </h2>
            <div>
              <label
                htmlFor="search-keyword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search by keyword
              </label>
              <input
                type="text"
                id="search-keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. 'oak table'"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="product-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Type
              </label>
              <select
                id="product-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-600 focus:border-red-600"
              >
                <option value="">All Product Types</option>
                {productTypes.map((type) => (
                  <option key={type.id} value={type.documentId}>
                    {type.Name}
                  </option>
                ))}
              </select>
            </div>

            {customProperties.length > 0 && (
              <fieldset className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-4">
                <legend className="font-semibold text-gray-700 px-1">
                  {selectedTypeName} Properties
                </legend>
                {customProperties.map((prop) => (
                  <div key={prop.name}>
                    <label
                      htmlFor={`prop-${prop.name}`}
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      {prop.name}
                    </label>
                    <input
                      type={prop.type}
                      id={`prop-${prop.name}`}
                      value={customFilterValues[prop.name] || ""}
                      onChange={(e) =>
                        setCustomFilterValues((prev) => ({
                          ...prev,
                          [prop.name]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-600 focus:border-red-600"
                    />
                  </div>
                ))}
              </fieldset>
            )}

            {activeFilters.length > 0 && (
              <button
                onClick={handleClearAll}
                className="w-full text-center text-sm text-red-600 hover:text-red-800 hover:underline"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        <main className="lg:col-span-3">
          {activeFilters.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-semibold">Active:</span>
              {activeFilters.map((filter) => (
                <span
                  key={filter.label}
                  className="inline-flex items-center gap-x-2 bg-gray-200 text-gray-800 text-sm font-medium pl-3 pr-1 py-1 rounded-full"
                >
                  {filter.label}
                  <button
                    onClick={filter.onClear}
                    aria-label={`Remove filter: ${filter.label}`}
                    className="flex-shrink-0 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-500 hover:bg-gray-300 hover:text-gray-700 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-700">{statusMessage}</p>
              <div>
                <label htmlFor="sort-by" className="sr-only">
                  Sort by
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-600 focus:border-red-600 sm:text-sm rounded-md"
                >
                  {/* --- THIS IS THE FIX --- */}
                  <option value="default" disabled>
                    Sort by
                  </option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-center py-16">Loading...</p>
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
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">
                No Products Found
              </h3>
              <p className="mt-1 text-gray-600">
                Try adjusting your filters or search term.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
