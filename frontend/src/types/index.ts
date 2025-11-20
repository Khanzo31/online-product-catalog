// frontend/src/types/index.ts

export interface ProductImage {
  id: number;
  url: string;
  width: number;
  height: number;
  name: string;
  alternativeText?: string; // Added for SEO
}

export interface ProductType {
  id: number;
  documentId: string;
  Name: string;
  CustomProperties?: { name: string; type: string }[];
}

export interface Product {
  id: number;
  documentId: string;
  Name: string;
  Price: number;
  Images: ProductImage[];
  SKU: string;
  Description: string;
  CustomPropertyValues?: { [key: string]: string | number | boolean };
  Product?: ProductType;
  createdAt: string; // Added for "New Arrival" logic later
}

// Generic response wrapper for Strapi v5
export interface StrapiApiResponse<T> {
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
