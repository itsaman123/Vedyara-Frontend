import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { API_BASE_URL } from "../../config/environment";

const ADMIN_TOKEN_KEY = "vedyara_admin_token";

export type AdminProfile = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export type AdminProduct = {
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
  inventoryTracking: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type ProductListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: AdminProduct["status"];
  sortBy?: "createdAt" | "updatedAt" | "name" | "price" | "stock" | "status";
  sortOrder?: "asc" | "desc";
};

export type ProductPayload = {
  name: string;
  description?: string;
  shortDescription?: string;
  category: string;
  subCategory?: string;
  tags?: string[];
  sku?: string;
  price: number;
  discountedPrice?: number | null;
  stock?: number;
  unit?: string;
  images?: string[];
  featured?: boolean;
  status?: AdminProduct["status"];
  inventoryTracking?: boolean;
};

export type UploadedImage = {
  filename: string;
  url: string;
};

export type InventoryMovement = {
  _id: string;
  productId: Pick<
    AdminProduct,
    "_id" | "name" | "slug" | "sku" | "stock" | "unit" | "images"
  >;
  quantity: number;
  type: "added" | "removed" | "sold";
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminOrder = {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "awaiting" | "paid" | "refunded" | "failed";
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
};

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

export const setAdminToken = (token: string) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminToken = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

const buildUrl = (path: string, params?: Record<string, unknown>) => {
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  params?: Record<string, unknown>,
) {
  const token = getAdminToken();
  const headers = new Headers(options.headers);

  if (
    !headers.has("Content-Type") &&
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, params), {
    ...options,
    headers,
    credentials: "include",
  });
  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "API request failed");
  }

  return payload.data;
}

export const loginAdmin = async (credentials: {
  email: string;
  password: string;
}) => {
  const data = await apiRequest<{ admin: AdminProfile; token: string }>(
    "/api/admin/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
  );
  setAdminToken(data.token);
  return data;
};

export const getAdminProfile = () =>
  apiRequest<{ admin: AdminProfile }>("/api/admin/auth/me");

export const getAdminProducts = (params: ProductListParams = {}) =>
  apiRequest<{ items: AdminProduct[]; pagination: Pagination }>(
    "/api/admin/products",
    {},
    params,
  );

export const getAdminProduct = (id: string) =>
  apiRequest<{ product: AdminProduct }>(`/api/admin/products/${id}`);

export const getAdminProductSummary = () =>
  apiRequest<{
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    lowStockProducts: number;
  }>("/api/admin/products/summary");

export const createAdminProduct = (payload: ProductPayload) =>
  apiRequest<{ product: AdminProduct }>("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminProduct = ({
  id,
  payload,
}: {
  id: string;
  payload: ProductPayload;
}) =>
  apiRequest<{ product: AdminProduct }>(`/api/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAdminProduct = (id: string) =>
  apiRequest<{ productId: string }>(`/api/admin/products/${id}`, {
    method: "DELETE",
  });

export const deleteAdminProducts = (ids: string[]) =>
  apiRequest<{ deletedCount: number }>("/api/admin/products", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });

export const getCloudinarySignature = () =>
  apiRequest<{
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder: string;
  }>("/api/admin/uploads/cloudinary-signature", { method: "POST" });

export const uploadToCloudinary = async (
  file: File,
  config: {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder: string;
  },
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", config.apiKey);
  formData.append("timestamp", String(config.timestamp));
  formData.append("signature", config.signature);
  formData.append("folder", config.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
  };
};

export const uploadAdminProductImages = async (files: File[]) => {
  // Option 1: Use backend-mediated upload (already updated to Cloudinary in backend)
  /*
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  return apiRequest<{ images: UploadedImage[] }>(
    "/api/admin/uploads/product-images",
    {
      method: "POST",
      body: formData,
    },
  );
  */

  // Option 2: Direct Cloudinary Upload (faster, saves backend resources)
  const config = await getCloudinarySignature();

  const uploadPromises = files.map(file => uploadToCloudinary(file, config));
  const results = await Promise.all(uploadPromises);

  return {
    images: results.map(res => ({
      filename: res.publicId,
      url: res.url
    }))
  };
};

export const getAdminInventoryMovements = (params: {
  page?: number;
  limit?: number;
  search?: string;
  type?: InventoryMovement["type"];
}) =>
  apiRequest<{ items: InventoryMovement[]; pagination: Pagination }>(
    "/api/admin/inventory",
    {},
    params,
  );

export const getAdminOrders = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminOrder["status"];
}) =>
  apiRequest<{ items: AdminOrder[]; pagination: Pagination }>(
    "/api/admin/orders",
    {},
    params,
  );

export const getAdminOrderSummary = () =>
  apiRequest<{
    totalOrders: number;
    completedOrders: number;
    inProgressOrders: number;
  }>("/api/admin/orders/summary");

export function useAdminProfile() {
  return useQuery({
    queryKey: ["admin", "profile"],
    queryFn: getAdminProfile,
    retry: false,
    enabled: Boolean(getAdminToken()),
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useAdminProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: () => getAdminProducts(params),
  });
}

export function useAdminProduct(id: string | null) {
  return useQuery({
    queryKey: ["admin", "product", id],
    queryFn: () => getAdminProduct(id as string),
    enabled: Boolean(id),
  });
}

export function useAdminProductSummary() {
  return useQuery({
    queryKey: ["admin", "products", "summary"],
    queryFn: getAdminProductSummary,
  });
}

export function useSaveAdminProduct(
  options?: UseMutationOptions<
    { product: AdminProduct },
    Error,
    { id?: string; payload: ProductPayload }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      id ? updateAdminProduct({ id, payload }) : createAdminProduct(payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useDeleteAdminProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useDeleteAdminProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminProducts,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useAdminInventoryMovements(params: {
  page?: number;
  limit?: number;
  search?: string;
  type?: InventoryMovement["type"];
}) {
  return useQuery({
    queryKey: ["admin", "inventory", params],
    queryFn: () => getAdminInventoryMovements(params),
  });
}

export function useAdminOrders(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminOrder["status"];
}) {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: () => getAdminOrders(params),
  });
}

export function useAdminOrderSummary() {
  return useQuery({
    queryKey: ["admin", "orders", "summary"],
    queryFn: getAdminOrderSummary,
  });
}
