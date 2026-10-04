import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiPackage, FiSearch, FiTruck, FiHome, FiClock, FiXCircle, FiLoader } from "react-icons/fi";
import { trackOrder, type TrackedOrder } from "../api/orderApi";
import { CONTACT_EMAIL, WHATSAPP_URL } from "../components/PolicyLayout";
import { useSEO } from "../utils/seo";

const steps = [
  { key: "pending",    label: "Order placed", hint: "We have received your order",       icon: FiClock },
  { key: "processing", label: "Packed",       hint: "Your order is being packed",         icon: FiPackage },
  { key: "shipped",    label: "Shipped",      hint: "Handed over to our courier partner", icon: FiTruck },
  { key: "delivered",  label: "Delivered",    hint: "Delivered to your address",          icon: FiHome },
] as const;

const paymentLabels: Record<TrackedOrder["paymentStatus"], string> = {
  awaiting: "Payment pending",
  paid:     "Paid",
  refunded: "Refunded",
  failed:   "Payment failed",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const inputClass =
  "w-full px-4 py-3 rounded-xl text-sm bg-white outline-none transition-shadow focus:ring-2 focus:ring-[#6B8E23]/30";
const inputStyle = { border: "1px solid rgba(62,47,28,0.14)", color: "#2a1f12" };

function OrderResult({ order }: { order: TrackedOrder }) {
  const cancelled = order.status === "cancelled";
  const currentIdx = steps.findIndex((s) => s.key === order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl bg-white p-6 sm:p-8"
      style={{ border: "1px solid rgba(62,47,28,0.08)", boxShadow: "0 4px 30px rgba(62,47,28,0.06)" }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 mb-6 border-b" style={{ borderColor: "rgba(62,47,28,0.08)" }}>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] font-semibold" style={{ color: "rgba(62,47,28,0.45)" }}>
            Order
          </p>
          <p className="text-lg font-semibold" style={{ color: "#2a1f12" }}>#{order.orderNumber}</p>
          <p className="text-sm mt-0.5" style={{ color: "rgba(62,47,28,0.55)" }}>
            Placed on {formatDate(order.createdAt)}
            {order.city ? ` · Shipping to ${order.city}` : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold" style={{ color: "#2a1f12" }}>₹{order.amount.toLocaleString("en-IN")}</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(62,47,28,0.55)" }}>
            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online"} · {paymentLabels[order.paymentStatus]}
          </p>
        </div>
      </div>

      {/* Timeline */}
      {cancelled ? (
        <div className="flex items-start gap-3 rounded-2xl px-5 py-4 mb-6" style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.15)" }}>
          <FiXCircle size={20} className="flex-shrink-0 mt-0.5" style={{ color: "#c0392b" }} />
          <div>
            <p className="font-semibold text-sm" style={{ color: "#8e2a20" }}>This order was cancelled</p>
            <p className="text-sm mt-0.5" style={{ color: "rgba(62,47,28,0.65)" }}>
              Updated {formatDate(order.updatedAt)}. If you paid online, the refund goes back to your original payment method.
            </p>
          </div>
        </div>
      ) : (
        <ol className="relative mb-8 grid grid-cols-1 sm:grid-cols-4 gap-5 sm:gap-2">
          {steps.map((step, i) => {
            const done = i <= currentIdx;
            const isCurrent = i === currentIdx;
            const Icon = step.icon;
            return (
              <li key={step.key} className="relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 sm:text-center">
                {/* connector */}
                {i < steps.length - 1 && (
                  <span
                    className="hidden sm:block absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 rounded"
                    style={{ background: i < currentIdx ? "#6B8E23" : "rgba(62,47,28,0.1)" }}
                  />
                )}
                <span
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: done ? "#6B8E23" : "#F3EFE8",
                    color: done ? "#fff" : "rgba(62,47,28,0.35)",
                    boxShadow: isCurrent ? "0 0 0 5px rgba(107,142,35,0.15)" : "none",
                  }}
                >
                  {done && !isCurrent ? <FiCheck size={18} strokeWidth={3} /> : <Icon size={17} />}
                </span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: done ? "#2a1f12" : "rgba(62,47,28,0.45)" }}>
                    {step.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(62,47,28,0.5)" }}>{step.hint}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {/* Items */}
      <p className="text-xs uppercase tracking-[0.14em] font-semibold mb-3" style={{ color: "rgba(62,47,28,0.45)" }}>
        {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
      </p>
      <ul className="space-y-3">
        {order.items.map((item, i) => (
          <li key={i} className="flex items-center gap-4 rounded-2xl p-3" style={{ background: "#FAF8F4" }}>
            <div className="w-14 h-14 rounded-xl bg-white flex-shrink-0 overflow-hidden p-1.5">
              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-contain" />}
            </div>
            <div className="flex-1 min-w-0">
              {item.slug ? (
                <Link to={`/product/${item.slug}`} className="text-sm font-medium line-clamp-2 hover:underline" style={{ color: "#2a1f12" }}>
                  {item.name}
                </Link>
              ) : (
                <p className="text-sm font-medium line-clamp-2" style={{ color: "#2a1f12" }}>{item.name}</p>
              )}
              <p className="text-xs mt-0.5" style={{ color: "rgba(62,47,28,0.5)" }}>
                Qty {item.quantity}{item.unit ? ` · ${item.unit}` : ""}
              </p>
            </div>
            <p className="text-sm font-semibold flex-shrink-0" style={{ color: "#2a1f12" }}>
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function TrackOrder() {
  const [params] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get("order") || "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  useSEO({
    title: "Track Your Order | Vedyara",
    description: "Check the status of your Vedyara order with your order number and email address.",
    canonical: "https://vedyara.in/track-order",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      setError("Please enter both your order number and email.");
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      setOrder(await trackOrder(orderNumber.replace(/^#/, ""), email));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <div
        className="pt-28 pb-10"
        style={{ background: "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(212,175,55,0.12) 0%, transparent 70%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "#6B8E23" }}>
            Help & Support
          </span>
          <h1
            className="font-serif font-bold mt-2 mb-3"
            style={{ fontSize: "clamp(1.85rem, 3.6vw, 2.6rem)", color: "#2a1f12", lineHeight: 1.15 }}
          >
            Track your order
          </h1>
          <p className="text-base leading-7" style={{ color: "rgba(62,47,28,0.65)" }}>
            Enter the order number from your confirmation email and the email you ordered with.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-5 sm:p-6 mb-6 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 sm:items-end"
          style={{ border: "1px solid rgba(62,47,28,0.08)", boxShadow: "0 4px 30px rgba(62,47,28,0.06)" }}
        >
          <label className="block">
            <span className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(62,47,28,0.6)" }}>Order number</span>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. ORD-1728000000000-123"
              className={inputClass}
              style={inputStyle}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(62,47,28,0.6)" }}>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              style={inputStyle}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ background: "#2D4A1E" }}
          >
            {loading ? <FiLoader size={16} className="animate-spin" /> : <FiSearch size={16} />}
            Track
          </button>
          {error && (
            <p className="sm:col-span-3 text-sm" style={{ color: "#c0392b" }}>{error}</p>
          )}
        </form>

        <AnimatePresence mode="wait">
          {order && <OrderResult key={order.orderNumber} order={order} />}
        </AnimatePresence>

        {/* Help */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
          {[
            { title: "Signed in?", text: "See all your orders in one place.", link: <Link to="/orders" className="font-semibold underline">My orders</Link> },
            { title: "Ordered on Amazon or Meesho?", text: "Track it from your marketplace account.", link: null },
            {
              title: "Need help?",
              text: "We reply within one working day.",
              link: (
                <span className="flex gap-3">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline">WhatsApp</a>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">Email</a>
                </span>
              ),
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl p-4 text-sm" style={{ background: "rgba(107,142,35,0.06)", border: "1px solid rgba(107,142,35,0.14)" }}>
              <p className="font-semibold mb-1" style={{ color: "#2a1f12" }}>{c.title}</p>
              <p style={{ color: "rgba(62,47,28,0.6)" }}>{c.text}</p>
              {c.link && <div className="mt-2" style={{ color: "#2D4A1E" }}>{c.link}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
