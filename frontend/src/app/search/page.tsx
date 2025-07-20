// frontend/src/app/search/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard, { ProductCardProps } from "@/app/components/ProductCard";

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

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [customProperties, setCustomProperties] = useState<
    { name: string; type: string }[]
  >([]);
  const [customFilterValues, setCustomFilterValues] =
    useState<CustomFilterValues>({});
  const [statusMessage, setStatusMessage] = useState(
    "Enter a keyword or select a type to search for products."
  );
  const [sortBy, setSortBy] = useState("default");
  const isInitialMount = useRef(true);

  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const res = await fetch(`${strapiUrl}/api/product-types`);
        const responseData = await res.json();
        setProductTypes(responseData.data || []);
      } catch (error) {
        console.error("Failed to fetch product types:", error);
      }
    };
    fetchProductTypes();
  }, [strapiUrl]);

  useEffect(() => {
    if (!selectedType) {
      setCustomProperties([]);
      setCustomFilterValues({});
      return;
    }
    const fetchCustomProperties = async () => {
      try {
        const res = await fetch(
          `${strapiUrl}/api/product-types?filters[documentId][$eq]=${selectedType}&populate=*`
        );
        if (!res.ok)
          throw new Error(`API call failed with status: ${res.status}`);
        const responseData = await res.json();
        const singleTypeData = responseData.data?.[0];
        const properties = singleTypeData?.CustomProperties || [];
        setCustomProperties(properties);
        setCustomFilterValues({});
      } catch (error) {
        console.error("Failed to fetch custom properties:", error);
        setCustomProperties([]);
      }
    };
    fetchCustomProperties();
  }, [selectedType, strapiUrl]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const hasSearchCriteria =
      debouncedSearchTerm.trim() !== "" ||
      selectedType !== "" ||
      Object.values(customFilterValues).some((v) => v.trim() !== "");

    if (!hasSearchCriteria) {
      setResults([]);
      setHasInteracted(false);
      return;
    }

    const handleSearch = async () => {
      setLoading(true);
      setHasInteracted(true);
      setResults([]);
      setStatusMessage("Searching for products...");
      setSortBy("default");

      const queryParams = new URLSearchParams();
      if (debouncedSearchTerm.trim()) {
        queryParams.append(
          "filters[Name][$containsi]",
          debouncedSearchTerm.trim()
        );
      }
      queryParams.append("populate", "*");
      queryParams.append("sort", "createdAt:desc");

      const apiUrl = `${strapiUrl}/api/products?${queryParams.toString()}`;

      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("API call to fetch products failed");

        const responseData = await res.json();
        let products: Product[] = responseData.data || [];

        if (selectedType) {
          products = products.filter(
            (product) => product.Product?.documentId === selectedType
          );
        }
        const activeCustomFilters = Object.entries(customFilterValues).filter(
          ([, value]) => value.trim() !== ""
        );
        if (activeCustomFilters.length > 0) {
          products = products.filter((product) => {
            return activeCustomFilters.every(([key, value]) => {
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
        setResults(products);
        setStatusMessage(
          products.length > 0
            ? `Found ${products.length} products.`
            : "No products found for the selected criteria."
        );
      } catch (error) {
        console.error(error);
        setResults([]);
        setStatusMessage("An error occurred during the search.");
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [debouncedSearchTerm, selectedType, customFilterValues, strapiUrl]);

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

  const selectedTypeName =
    productTypes.find((pt) => pt.documentId === selectedType)?.Name || "";

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Search & Filter</h1>

      <div role="status" className="sr-only">
        {statusMessage}
      </div>

      <div className="max-w-xl mx-auto mb-12 space-y-4">
        <div>
          <label htmlFor="search-keyword" className="sr-only">
            Search by keyword
          </label>
          <input
            type="text"
            id="search-keyword"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by keyword..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-600 focus:border-red-600"
          />
        </div>
        <div>
          <label htmlFor="product-type" className="sr-only">
            Filter by Product Type
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
          <fieldset className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
            <legend className="font-semibold text-gray-700 px-1">
              Filter by {selectedTypeName} Properties:
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
      </div>

      <div aria-busy={loading}>
        {!hasInteracted ? (
          <p className="text-center text-gray-500">
            Enter a keyword or select a type to search for products.
          </p>
        ) : loading ? (
          <p className="text-center">Searching...</p>
        ) : results.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-700">
                Showing {results.length} product
                {results.length !== 1 ? "s" : ""}.
              </p>
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
                  <option value="default">Sort by Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No products found for the selected criteria.
          </p>
        )}
      </div>
    </div>
  );
}
