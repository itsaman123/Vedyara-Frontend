import type { AddressInput } from "./userApi";

import { request } from "./http";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "awaiting" | "paid" | "refunded" | "failed";
export type PaymentMethod = "razorpay" | "cod";

export type Order = {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  amount: number;
  itemsCount: number;
  shippingAddress: AddressInput;
  createdAt: string;
  updatedAt: string;
  items: {
    productId: string;
    name: string;
    image: string;
    slug: string | null;
    quantity: number;
    price: number;
  }[];
};

export type PlaceOrderInput = {
  items: { productId: string; quantity: number }[];
  shippingAddress: AddressInput;
  saveAddress?: boolean;
};

export type PaymentConfig = {
  razorpayEnabled: boolean;
  razorpayKeyId: string | null;
  codEnabled: boolean;
};

export type RazorpayOrderResponse = {
  orderId: string;
  orderNumber: string;
  keyId: string;
  razorpayOrder: { id: string; amount: number; currency: string };
};

export const getPaymentConfig = () => request<PaymentConfig>("/api/v1/orders/payment-config");

export const createCodOrder = async (data: PlaceOrderInput) =>
  (
    await request<{ order: Order }>("/api/v1/orders/create-cod", {
      method: "POST",
      body: JSON.stringify(data),
    })
  ).order;

export const createRazorpayOrder = (data: PlaceOrderInput) =>
  request<RazorpayOrderResponse>("/api/v1/orders/create", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const verifyPayment = async (data: {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) =>
  (
    await request<{ order: Order }>("/api/v1/orders/verify", {
      method: "POST",
      body: JSON.stringify(data),
    })
  ).order;

export const cancelPayment = (orderId: string) =>
  request<null>(`/api/v1/orders/${orderId}/cancel-payment`, { method: "POST" });

export const getMyOrders = () => request<Order[]>("/api/v1/orders/myorders");

export type TrackedOrder = {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
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

export const trackOrder = (orderNumber: string, email: string) => {
  const params = new URLSearchParams({ orderNumber: orderNumber.trim(), email: email.trim() });
  return request<TrackedOrder>(`/api/v1/orders/track?${params}`);
};
