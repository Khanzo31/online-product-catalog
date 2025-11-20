// frontend/src/app/components/RecentlyViewed.tsx
"use client";

import { useEffect, useState } from "react";
import { Product, ProductImage } from "@/types";
import ProductCard from "./ProductCard";

interface RecentlyViewedProps {
  currentProduct: Product;
}

interface StoredProduct {
  id: number;
  documentId: string;
  Name: string;
  Price: number;
  Images: ProductImage[];
  createdAt: string;
}

const HISTORY_KEY = "recently_viewed_products";
const MAX_ITEMS = 4;

export default function RecentlyViewed({
  currentProduct,
}: RecentlyViewedProps) {
  const [history, setHistory] = useState<StoredProduct[]>([]);

  useEffect(() => {
    if (!currentProduct) return;

    try {
      // 1. Get existing history
      const stored = localStorage.getItem(HISTORY_KEY);
      let items: StoredProduct[] = stored ? JSON.parse(stored) : [];

      // 2. Remove if current product already exists (to move it to top)
      items = items.filter(
        (item) => item.documentId !== currentProduct.documentId
      );

      // 3. Add current product to front
      const newItem: StoredProduct = {
        id: currentProduct.id,
        documentId: currentProduct.documentId,
        Name: currentProduct.Name,
        Price: currentProduct.Price,
        Images: currentProduct.Images,
        createdAt: currentProduct.createdAt,
      };
      items.unshift(newItem);

      // 4. Limit to max items
      if (items.length > MAX_ITEMS + 1) {
        // +1 because we display 4 *other* items
        items = items.slice(0, MAX_ITEMS + 1);
      }

      // 5. Save back to storage
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));

      // 6. Set state for rendering (excluding current product)
      setHistory(
        items.filter((item) => item.documentId !== currentProduct.documentId)
      );
    } catch (error) {
      console.error("Failed to update recently viewed history", error);
    }
  }, [currentProduct]);

  if (history.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
      <h2 className="font-serif text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
        Recently Viewed
      </h2>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {history.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
