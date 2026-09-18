import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { apiRequest } from "./apiCalls";

export type ComboProductRef = {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    discountedPrice: number | null;
    images: string[];
    unit: string;
  };
  quantity: number;
};

export type AdminCombo = {
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
  createdAt: string;
  updatedAt: string;
};

export type ComboPayload = {
  name: string;
  tagline?: string;
  description?: string;
  emoji?: string;
  badge?: string;
  products: { product: string; quantity: number }[];
  price: number;
  highlights?: string[];
  order?: number;
  status?: AdminCombo["status"];
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type ComboListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminCombo["status"];
};

export const getAdminCombos = (params: ComboListParams = {}) =>
  apiRequest<{ items: AdminCombo[]; pagination: Pagination }>(
    "/api/admin/combos",
    {},
    params,
  );

export const getAdminCombo = (id: string) =>
  apiRequest<{ combo: AdminCombo }>(`/api/admin/combos/${id}`);

export const createAdminCombo = (payload: ComboPayload) =>
  apiRequest<{ combo: AdminCombo }>("/api/admin/combos", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminCombo = ({
  id,
  payload,
}: {
  id: string;
  payload: ComboPayload;
}) =>
  apiRequest<{ combo: AdminCombo }>(`/api/admin/combos/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAdminCombo = (id: string) =>
  apiRequest<{ comboId: string }>(`/api/admin/combos/${id}`, {
    method: "DELETE",
  });

export function useAdminCombos(params: ComboListParams = {}) {
  return useQuery({
    queryKey: ["admin", "combos", params],
    queryFn: () => getAdminCombos(params),
  });
}

export function useAdminCombo(id: string | null) {
  return useQuery({
    queryKey: ["admin", "combo", id],
    queryFn: () => getAdminCombo(id as string),
    enabled: Boolean(id),
  });
}

export function useSaveAdminCombo(
  options?: UseMutationOptions<
    { combo: AdminCombo },
    Error,
    { id?: string; payload: ComboPayload }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      id ? updateAdminCombo({ id, payload }) : createAdminCombo(payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "combos"] });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useDeleteAdminCombo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminCombo,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "combos"] });
    },
  });
}
