// frontend/src/app/components/RelatedProducts.tsx
"use client";

import ProductCard, { ProductCardProps } from "./ProductCard";

interface RelatedProductsProps {
  products: ProductCardProps[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null; // Don't render anything if there are no related products
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        You might also like
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
