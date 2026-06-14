import type { ApiResponse, Product } from "./productApi";

import { API_BASE_URL } from "../config/environment";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getWishlist = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/wishlist`, {
    headers: getHeaders(),
  });
  const payload = (await response.json()) as ApiResponse<{ items: Product[] }>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch wishlist");
  }
  return payload.data.items;
};

export const toggleWishlist = async (productId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/wishlist/toggle`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ productId }),
  });
  const payload = (await response.json()) as ApiResponse<{ inWishlist: boolean }>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to toggle wishlist");
  }
  return payload.data;
};
