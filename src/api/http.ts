import type { ApiResponse } from "./productApi";

import { API_BASE_URL } from "../config/environment";

export const TOKEN_KEY = "token";

/** Fired when the server rejects the stored session; AuthContext signs out. */
export const AUTH_EXPIRED_EVENT = "vedyara:auth-expired";

export type FieldError = { field: string; message: string };

export class ApiError extends Error {
  status: number;
  errors: FieldError[];

  constructor(message: string, status: number, errors: FieldError[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/** Authenticated JSON request to the shop API; resolves to the payload's data. */
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  // Render returns an HTML page while the server is waking up
  const payload = (await response.json().catch(() => null)) as
    | (ApiResponse<T> & { errors?: FieldError[] | null })
    | null;

  if (!response.ok || !payload?.success) {
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    const fieldErrors = payload?.errors ?? [];
    // Validation errors are more useful than the generic "Validation failed"
    const message =
      fieldErrors[0]?.message ?? payload?.message ?? "Something went wrong. Please try again.";
    throw new ApiError(message, response.status, fieldErrors);
  }

  return payload.data;
}

export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";
