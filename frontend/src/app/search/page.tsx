"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";

// --- Type Definitions (No changes) ---
interface StrapiImage {
  id: number;
  url: string;
  width: number;
  height: number;
  name: string;
}
interface ProductType {
  id: number;
  Name: string;
  CustomProperties?: CustomProperty[];
}
interface Product {
  id: number;
  Name: string;
  SKU: string;
  Description: string;
  Price: number;
  Images: StrapiImage[];
  CustomPropertyValues?: { [key: string]: string | number };
  Product?: ProductType;
}
interface CustomProperty {
  name: string;
  type: "text" | "number" | "boolean";
}
interface CustomFilterValues {
  [key: string]: string;
}

// --- ProductCard Component (No changes) ---
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
      <div className="relative h-56 w-full bg-gray-100">
        {imageUrl ? (
          <Image
            src={`${strapiUrl}${imageUrl}`}
            alt={Name || "Product Image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
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

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [customProperties, setCustomProperties] = useState<CustomProperty[]>(
    []
  );
  const [customFilterValues, setCustomFilterValues] =
    useState<CustomFilterValues>({});
  const [statusMessage, setStatusMessage] = useState(
    "Enter a keyword or select a type to search for products."
  );

  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

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
        const apiUrl = `${strapiUrl}/api/product-types?filters[id][$eq]=${selectedType}&populate=*`;
        const res = await fetch(apiUrl);
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

  // =========================================================================
  // === UPDATED handleSearch FUNCTION WITH RESILIENT FETCH LOGIC ===
  // =========================================================================
  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);
    setResults([]);
    setStatusMessage("Searching for products...");

    // Build base query parameters
    const queryParams = new URLSearchParams();
    if (searchTerm.trim()) {
      queryParams.append("filters[Name][$containsi]", searchTerm.trim());
    }

    // Define ideal and fallback API URLs
    const idealApiUrl = `${strapiUrl}/api/products?${queryParams.toString()}&populate=*`;
    const fallbackApiUrl = `${strapiUrl}/api/products?${queryParams.toString()}`;

    try {
      let res = await fetch(idealApiUrl);

      // Check for failure and apply fallback logic if it's a "Bad Request"
      if (!res.ok) {
        if (res.status === 400) {
          console.warn(
            'handleSearch: Received "Bad Request". Retrying without populate.'
          );
          res = await fetch(fallbackApiUrl); // Retry with the simpler URL

          if (!res.ok) {
            // If even the fallback fails, throw an error
            throw new Error(
              `Fallback API call also failed with status: ${res.statusText}`
            );
          }
        } else {
          // For other errors (500, 404, etc.), throw immediately
          throw new Error(`API call failed with status: ${res.statusText}`);
        }
      }

      const responseData = await res.json();
      let products: Product[] = responseData.data || [];

      // Client-side filtering (remains the same)
      if (selectedType) {
        products = products.filter(
          (product) => product.Product?.id.toString() === selectedType
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
  // =========================================================================
  // === END OF UPDATED FUNCTION ===
  // =========================================================================

  const selectedTypeName =
    productTypes.find((pt) => pt.id === parseInt(selectedType))?.Name || "";

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Search & Filter</h1>

      <div role="status" className="sr-only">
        {statusMessage}
      </div>

      <form
        onSubmit={handleSearch}
        className="max-w-xl mx-auto mb-12 space-y-4"
      >
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Product Types</option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ))}
          </fieldset>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            Search
          </button>
        </div>
      </form>

      <div aria-busy={loading}>
        {loading ? (
          <p className="text-center">Searching...</p>
        ) : searched ? (
          results.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No products found for the selected criteria.
            </p>
          )
        ) : (
          <p className="text-center text-gray-500">
            Enter a keyword or select a type to search for products.
          </p>
        )}
      </div>
    </div>
  );
}
