"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";

// --- Type Definitions ---
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
interface ProductType {
  id: number;
  Name: string;
}

// --- ProductCard Component ---
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

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);
    setResults([]);

    const queryParams = new URLSearchParams();
    if (searchTerm.trim()) {
      queryParams.append("filters[Name][$containsi]", searchTerm.trim());
    }
    if (selectedType) {
      // --- THE DEFINITIVE FIX ---
      // The field name is "Product" with a capital P, as shown in your screenshot.
      queryParams.append("filters[Product][id][$eq]", selectedType);
    }
    queryParams.append("populate", "Images");

    const apiUrl = `${strapiUrl}/api/products?${queryParams.toString()}`;

    try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        // Log the URL for debugging if it fails
        console.error("Search API call failed with URL:", apiUrl);
        throw new Error("Search failed");
      }

      const responseData = await res.json();
      setResults(responseData.data || []);
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
