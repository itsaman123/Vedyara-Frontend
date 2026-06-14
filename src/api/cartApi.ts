import type { ApiResponse } from "./productApi";

import { API_BASE_URL } from "../config/environment";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
};

export type Cart = {
  items: CartItem[];
  totalAmount: number;
};

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getCart = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/cart`, {
    headers: getHeaders(),
  });
  const payload = (await response.json()) as ApiResponse<Cart>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch cart");
  }
  return payload.data;
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/cart`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });
  const payload = (await response.json()) as ApiResponse<Cart>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to add to cart");
  }
  return payload.data;
};

export const updateCartItem = async (productId: string, quantity: number) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/cart/${productId}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ quantity }),
  });
  const payload = (await response.json()) as ApiResponse<Cart>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to update cart");
  }
  return payload.data;
};

export const removeFromCart = async (productId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/cart/${productId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const payload = (await response.json()) as ApiResponse<Cart>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to remove from cart");
  }
  return payload.data;
};
