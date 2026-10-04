import type { ApiResponse } from "./productApi";

import { API_BASE_URL } from "../config/environment";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface CreateOrderResponse {
  razorpayOrder: RazorpayOrder;
  orderId: string;
}

export const createRazorpayOrder = async (data: {
  items: { productId: string; quantity: number }[];
  customerName: string;
  customerEmail: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/create`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const payload = (await response.json()) as ApiResponse<CreateOrderResponse>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to create order");
  }
  return payload.data;
};

export const verifyPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/verify`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const payload = (await response.json()) as ApiResponse<any>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Payment verification failed");
  }
  return payload.data;
};

export const sendOtp = async (data: { email: string }) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/send-otp`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const payload = (await response.json()) as ApiResponse<any>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to send OTP");
  }
  return payload.data;
};

export const verifyOtp = async (data: { email: string; otp: string; name?: string }) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/verify-otp`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const payload = (await response.json()) as ApiResponse<any>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to verify OTP");
  }
  return payload.data;
};

export const createCodOrder = async (data: {
  items: { productId: string; quantity: number }[];
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
}) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/create-cod`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const payload = (await response.json()) as ApiResponse<{ orderId: string; orderNumber: string }>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to place order");
  }
  return payload.data;
};

export const getMyOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/myorders`, {
    method: "GET",
    headers: getHeaders(),
  });
  const payload = (await response.json()) as ApiResponse<any[]>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch orders");
  }
  return payload.data;
};

export type TrackedOrder = {
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "awaiting" | "paid" | "refunded" | "failed";
  paymentMethod: "razorpay" | "cod";
  amount: number;
  itemsCount: number;
  city: string | null;
  createdAt: string;
  updatedAt: string;
  items: {
    name: string;
    slug: string | null;
    image: string | null;
    unit: string | null;
    quantity: number;
    price: number;
  }[];
};

export const trackOrder = async (orderNumber: string, email: string) => {
  const url = new URL(`${API_BASE_URL}/api/v1/orders/track`);
  url.searchParams.set("orderNumber", orderNumber.trim());
  url.searchParams.set("email", email.trim());
  const response = await fetch(url.toString());
  const payload = (await response.json()) as ApiResponse<TrackedOrder>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Could not find this order");
  }
  return payload.data;
};
