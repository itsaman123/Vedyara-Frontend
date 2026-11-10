import type { Product } from "./productApi";

import { request } from "./http";

export const getWishlist = async () =>
  (await request<{ items: Product[] }>("/api/v1/wishlist")).items;

export const toggleWishlist = (productId: string) =>
  request<{ inWishlist: boolean }>("/api/v1/wishlist/toggle", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });

export const mergeWishlist = async (productIds: string[]) =>
  (
    await request<{ items: Product[] }>("/api/v1/wishlist/merge", {
      method: "POST",
      body: JSON.stringify({ productIds }),
    })
  ).items;
