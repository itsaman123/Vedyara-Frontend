import { useQuery } from "@tanstack/react-query";

import type { ApiResponse } from "./productApi";
import { API_BASE_URL } from "../config/environment";

export type ComboProductRef = {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    discountedPrice: number | null;
    images: string[];
    unit: string;
  } | null;
  quantity: number;
};

export type Combo = {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  emoji: string;
  badge: string;
  products: ComboProductRef[];
  price: number;
  highlights: string[];
  order: number;
  status: "active" | "inactive" | "draft";
};

export const getCombos = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/combos`);
  const payload = (await response.json()) as ApiResponse<{ items: Combo[] }>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch combos");
  }

  return payload.data.items;
};

export function useCombos() {
  return useQuery({
    queryKey: ["combos"],
    queryFn: getCombos,
  });
}
