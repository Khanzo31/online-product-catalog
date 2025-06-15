"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";

// --- Type Definitions (Updated to match your exact data structure) ---
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
  // --- FIX #1 --- Changed field name to match your API response
  Product?: ProductType;
}
interface CustomProperty {
  name: string;
  type: "text" | "number" | "boolean";
}
interface CustomFilterValues {
  [key: string]: string;
}

// --- ProductCard Component (No changes needed) ---
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
      className="group block overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);
    setResults([]);

    const queryParams = new URLSearchParams();
    if (searchTerm.trim()) {
      queryParams.append("filters[Name][$containsi]", searchTerm.trim());
    }
    // We populate everything to ensure we get the relation data
    queryParams.append("populate", "*");

    const apiUrl = `${strapiUrl}/api/products?${queryParams.toString()}`;

    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("API call to fetch products failed");

      const responseData = await res.json();
      let products: Product[] = responseData.data || [];

      if (selectedType) {
        // --- FIX #2 --- Change the filter logic to use the correct field name
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
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Search & Filter</h1>
      <form
        onSubmit={handleSearch}
        className="max-w-xl mx-auto mb-12 space-y-4"
      >
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by keyword..."
            className="w-full px-4 py-2 border-none focus:ring-0"
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
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
            <h3 className="font-semibold text-gray-700">
              Filter by{" "}
              {
                productTypes.find((pt) => pt.id === parseInt(selectedType))
                  ?.Name
              }{" "}
              Properties:
            </h3>
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
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <div>
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
