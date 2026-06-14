import type { ApiResponse } from "./productApi";

import { API_BASE_URL } from "../config/environment";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/profile`, {
    method: "GET",
    headers: getHeaders(),
  });
  const payload = (await response.json()) as ApiResponse<any>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch profile");
  }
  return payload.data;
};

export const addAddress = async (addressData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/addresses`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(addressData),
  });
  const payload = (await response.json()) as ApiResponse<any>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to add address");
  }
  return payload.data;
};
