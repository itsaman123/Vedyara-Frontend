import { useQuery } from "@tanstack/react-query";

import { API_BASE_URL } from "../config/environment";

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  subCategory: string;
  tags: string[];
  sku: string;
  price: number;
  discountedPrice: number | null;
  stock: number;
  unit: string;
  images: string[];
  featured: boolean;
  status: "active" | "inactive" | "draft" | "out_of_stock";
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const getProducts = async (params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  featured?: boolean | string;
} = {}) => {
  const url = new URL(`${API_BASE_URL}/api/v1/products`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  const payload = (await response.json()) as ApiResponse<{
    items: Product[];
    pagination: Pagination;
  }>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch products");
  }

  return payload.data;
};

export const getProductBySlug = async (slug: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/products/${slug}`);
  const payload = (await response.json()) as ApiResponse<{ product: Product }>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch product");
  }

  return payload.data.product;
};

export function useProducts(params: Parameters<typeof getProducts>[0] = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
}
