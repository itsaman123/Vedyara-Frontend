import { request } from "./http";

export type Address = {
  _id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  pincode: string;
  isDefault: boolean;
};

export type AddressInput = Omit<Address, "_id" | "isDefault">;

export type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  emailVerified: boolean;
  addresses: Address[];
};

export type Session = { otpRequired: false; token: string; user: User };
export type OtpChallenge = { otpRequired: true; email: string };

export const getProfile = () => request<{ user: User }>("/api/v1/users/profile");

export const updateProfile = (data: { name?: string; phone?: string }) =>
  request<{ user: User }>("/api/v1/users/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const addAddress = (address: AddressInput & { isDefault?: boolean }) =>
  request<{ user: User }>("/api/v1/users/addresses", {
    method: "POST",
    body: JSON.stringify(address),
  });

export const setDefaultAddress = (id: string) =>
  request<{ user: User }>(`/api/v1/users/addresses/${id}/default`, { method: "PATCH" });

export const deleteAddress = (id: string) =>
  request<{ user: User }>(`/api/v1/users/addresses/${id}`, { method: "DELETE" });

/** New email: creates the account and returns a session. Known email: emails a code. */
export const checkoutAuth = (data: { name: string; email: string; phone: string }) =>
  request<Session | OtpChallenge>("/api/v1/users/checkout-auth", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const requestOtp = (email: string) =>
  request<OtpChallenge>("/api/v1/users/otp/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const verifyOtp = (email: string, otp: string) =>
  request<Session>("/api/v1/users/otp/verify", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
