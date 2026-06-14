import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { trackPurchase } from "../analytics";

import { motion } from "framer-motion";
import {
  FiCheck,
  FiTruck,
  FiPackage,
  FiShield,
  FiMapPin,
  FiMail,
  FiPhone,
} from "react-icons/fi";

interface OrderItem {
  name: string;
  image?: string;
  quantity: number;
  price: number;
}

interface OrderState {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: OrderItem[];
  totalAmount: number;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, delay, ease: "easeOut" as const } },
});

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderState | null;

  // Guard: no order data → go home
  useEffect(() => {
    if (!state?.orderId) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  // Tag purchase in Clarity on mount
  useEffect(() => {
    if (!state?.orderId) return;
    trackPurchase({ orderNumber: state.orderNumber, totalAmount: state.totalAmount });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Block browser back — user must use the CTA buttons
  useEffect(() => {
    window.history.pushState(null, "", window.location.pathname);
    const handlePop = () =>
      window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  if (!state?.orderId) return null;

  const {
    orderNumber,
    customerName,
    customerEmail,
    shippingAddress,
    items,
    totalAmount,
  } = state;

  const firstName = customerName.split(" ")[0];

  const steps = [
    {
      icon: FiCheck,
      title: "Order Confirmed",
      desc: "We've received your order",
      done: true,
    },
    {
      icon: FiPackage,
      title: "Being Prepared",
      desc: "Your items are being packed (1–2 days)",
      done: false,
    },
    {
      icon: FiTruck,
      title: "Out for Delivery",
      desc: "Estimated delivery in 3–7 business days",
      done: false,
    },
    {
      icon: FiShield,
      title: "Delivered",
      desc: `Pay ₹${totalAmount} cash to the delivery person`,
      done: false,
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#faf9f7]">
      <div className="max-w-xl mx-auto px-4">

        {/* ── Success Header ── */}
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.05 }}
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg"
            style={{ background: "linear-gradient(135deg, #D4AF37, #e8c84a)" }}
          >
            <FiCheck size={44} strokeWidth={2.5} style={{ color: "#3E2F1C" }} />
          </motion.div>

          <motion.h1
            {...fadeUp(0.15)}
            className="font-serif font-bold text-4xl text-[#3E2F1C] mb-2"
          >
            Order Confirmed!
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-stone-500 text-base">
            Thank you, {firstName}! Your order is on its way.
          </motion.p>

          {orderNumber && (
            <motion.div
              {...fadeUp(0.25)}
              className="mt-3 px-5 py-2 rounded-full"
              style={{
                background: "rgba(212,175,55,0.12)",
                border: "1px solid rgba(212,175,55,0.4)",
              }}
            >
              <span className="text-xs text-stone-500 font-medium">Order ID · </span>
              <span className="font-mono font-bold text-[#3E2F1C] text-sm">
                {orderNumber}
              </span>
            </motion.div>
          )}
        </div>

        {/* ── Items Ordered ── */}
        <motion.div
          {...fadeUp(0.3)}
          className="bg-white rounded-3xl p-6 shadow-sm mb-4"
        >
          <h2 className="font-bold text-[#3E2F1C] text-base mb-4">Items Ordered</h2>

          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-14 h-14 bg-stone-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-stone-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <FiPackage size={22} className="text-stone-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-800 text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-[#3E2F1C] text-sm flex-shrink-0">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="h-px bg-stone-100 my-4" />

          <div className="flex justify-between text-sm text-stone-500 mb-2">
            <span>Shipping</span>
            <span className="text-green-600 font-bold">Free</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-[#3E2F1C] text-base">Total</span>
            <span className="font-bold text-[#3E2F1C] text-lg">₹{totalAmount}</span>
          </div>
        </motion.div>

        {/* ── Delivery Address ── */}
        <motion.div
          {...fadeUp(0.35)}
          className="bg-white rounded-3xl p-6 shadow-sm mb-4"
        >
          <h2 className="font-bold text-[#3E2F1C] text-base mb-4 flex items-center gap-2">
            <FiMapPin size={16} style={{ color: "#D4AF37" }} />
            Delivering To
          </h2>
          <div className="text-sm text-stone-600 space-y-1">
            <p className="font-semibold text-stone-800">{shippingAddress.name}</p>
            <p>{shippingAddress.address}</p>
            <p>
              {shippingAddress.city} — {shippingAddress.pincode}
            </p>
            <div className="border-t border-stone-100 mt-3 pt-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <FiPhone size={13} className="text-stone-400 flex-shrink-0" />
                <span>{shippingAddress.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail size={13} className="text-stone-400 flex-shrink-0" />
                <span>{customerEmail}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── What Happens Next ── */}
        <motion.div
          {...fadeUp(0.4)}
          className="bg-white rounded-3xl p-6 shadow-sm mb-4"
        >
          <h2 className="font-bold text-[#3E2F1C] text-base mb-5">What Happens Next</h2>
          <div className="space-y-5">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                {/* connector line */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: s.done
                        ? "linear-gradient(135deg, #D4AF37, #e8c84a)"
                        : "#f5f5f4",
                    }}
                  >
                    <s.icon
                      size={16}
                      style={{ color: s.done ? "#3E2F1C" : "#a8a29e" }}
                    />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-5 bg-stone-200 mt-1" />
                  )}
                </div>
                <div className="pt-1">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: s.done ? "#3E2F1C" : "#a8a29e" }}
                  >
                    {s.title}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── COD Reminder ── */}
        <motion.div
          {...fadeUp(0.45)}
          className="flex items-start gap-3 p-5 rounded-2xl mb-8"
          style={{
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.3)",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(212,175,55,0.2)" }}
          >
            <FiTruck size={18} style={{ color: "#b8941f" }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#3E2F1C" }}>
              Cash on Delivery · ₹{totalAmount}
            </p>
            <p
              className="text-xs mt-1 leading-relaxed"
              style={{ color: "rgba(62,47,28,0.65)" }}
            >
              Please keep the exact amount ready when your order arrives. The delivery
              person will collect it at your doorstep.
            </p>
          </div>
        </motion.div>

        {/* ── CTAs ── */}
        <motion.div
          {...fadeUp(0.5)}
          className="flex flex-col sm:flex-row gap-3"
        >
          {localStorage.getItem("token") && (
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 py-4 rounded-2xl font-bold text-sm border-2 border-[#3E2F1C] text-[#3E2F1C] hover:bg-stone-50 transition-colors"
            >
              View My Orders
            </button>
          )}
          <button
            onClick={() => navigate("/products")}
            className="flex-1 py-4 rounded-2xl font-bold text-sm transition-colors shadow-md"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #e8c84a)",
              color: "#3E2F1C",
            }}
          >
            Continue Shopping
          </button>
        </motion.div>

      </div>
    </div>
  );
}
