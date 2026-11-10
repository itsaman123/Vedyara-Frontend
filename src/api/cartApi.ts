import { request } from "./http";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  mrp?: number;
  image: string;
  quantity: number;
  slug: string;
  unit?: string;
  /** null when the product doesn't track inventory */
  stock?: number | null;
  /** Server carts only: false when the product can't currently be bought */
  available?: boolean;
};

export type Cart = {
  items: CartItem[];
  totalAmount: number;
};

export const getCart = () => request<Cart>("/api/v1/cart");

export const addToCart = (productId: string, quantity: number = 1) =>
  request<Cart>("/api/v1/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });

export const updateCartItem = (productId: string, quantity: number) =>
  request<Cart>(`/api/v1/cart/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });

export const removeFromCart = (productId: string) =>
  request<Cart>(`/api/v1/cart/${productId}`, { method: "DELETE" });

export const clearCart = () => request<Cart>("/api/v1/cart", { method: "DELETE" });

export const mergeCart = (items: { productId: string; quantity: number }[]) =>
  request<Cart>("/api/v1/cart/merge", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
