declare global {
  interface Window {
    clarity: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}

const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined;

export function initClarity() {
  if (!CLARITY_ID) return;

  window.clarity = window.clarity || function (...args: unknown[]) {
    (window.clarity.q = window.clarity.q || []).push(args);
  };
  const t = document.createElement("script");
  t.async = true;
  t.src = "https://www.clarity.ms/tag/" + CLARITY_ID;
  document.head.appendChild(t);
}

// Tag a COD purchase — shows as a custom event in Clarity dashboard
export function trackPurchase(params: { orderNumber: string; totalAmount: number }) {
  if (!CLARITY_ID || typeof window.clarity !== "function") return;
  window.clarity("event", "purchase");
  window.clarity("set", "orderNumber", params.orderNumber);
  window.clarity("set", "orderValue", String(params.totalAmount));
}
