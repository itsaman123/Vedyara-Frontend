import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiExternalLink, FiArrowRight } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { CartItemSkeleton } from "../components/Skeletons";
import { AMAZON_STORE_URL } from "../config/environment";
import HoneycombScene from "../components/HoneycombScene";

const trustPillars = [
  { icon: "⭐", title: "4.8 Rating", sub: "Amazon Verified Reviews" },
  { icon: "🚚", title: "Fast Delivery", sub: "Pan-India via Amazon" },
  { icon: "↩️", title: "Easy Returns", sub: "Hassle-free policy" },
  { icon: "🔒", title: "Secure Payment", sub: "Amazon Protected" },
];

const promises = [
  { emoji: "🍯", label: "Raw & Unprocessed" },
  { emoji: "🔬", label: "Lab Tested" },
  { emoji: "🌿", label: "No Additives" },
  { emoji: "🏆", label: "FSSAI Certified" },
];

const Cart: React.FC = () => {
  const { isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#faf9f7]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-10 w-56 bg-[#f0ede8] rounded-xl animate-pulse mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => <CartItemSkeleton key={i} />)}
            </div>
            <div className="bg-white rounded-3xl p-8 h-64 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f0a05 0%, #1a0d04 55%, #0a0602 100%)" }}
    >
      {/* ── Three.js honeycomb fills entire page ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.5 }}>
        <HoneycombScene />
      </div>

      {/* Radial amber glow center */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 1,
          left: "50%", top: "38%",
          transform: "translate(-50%, -50%)",
          width: "80vw", height: "80vw",
          background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Gold line top */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ zIndex: 2, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.5), transparent)" }}
      />

      {/* ── Page content ── */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-32 pb-20">

        {/* ── Animated honey jar ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <motion.div
            animate={{ y: [-7, 7, -7] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Outer glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: "-28px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,175,55,0.22) 0%, transparent 70%)",
              }}
            />
            {/* Inner ring */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: "-14px",
                borderRadius: "50%",
                border: "1px solid rgba(212,175,55,0.15)",
              }}
            />
            {/* Hex jar */}
            <div
              className="w-[112px] h-[112px] flex items-center justify-center"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                background: "linear-gradient(145deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.06) 100%)",
                border: "1px solid rgba(212,175,55,0.35)",
                fontSize: "3.5rem",
              }}
            >
              🍯
            </div>
          </motion.div>
        </motion.div>

        {/* ── Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7"
          style={{
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.22)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#D4AF37" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#D4AF37" }}>
            Website Opening Soon
          </span>
        </motion.div>

        {/* ── H1 ── */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-bold text-center text-white mb-5"
          style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.08 }}
        >
          Your Cart Awaits
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #b8961f, #D4AF37, #e8c84a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            On Amazon India
          </span>
        </motion.h1>

        {/* ── Subtext ── */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-center mb-5 max-w-lg"
          style={{ color: "rgba(255,255,255,0.48)", lineHeight: 1.8, fontSize: "0.97rem" }}
        >
          Our direct checkout is still being built. Until then, our full Vedyara range is available on
          Amazon India — same pure quality, trusted delivery, easy returns.
        </motion.p>

        {/* ── Honey drip decoration ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2 mb-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full"
              style={{ background: "linear-gradient(to bottom, #D4AF37, rgba(212,175,55,0))" }}
              animate={{ height: [10, 28, 10] }}
              transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.3, ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        {/* ── CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <motion.a
            href={AMAZON_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl font-bold text-base"
            style={{
              background: "linear-gradient(135deg, #FF9900 0%, #ffb733 100%)",
              color: "#1a1a1a",
              boxShadow: "0 12px 40px rgba(255,153,0,0.45), 0 4px 16px rgba(255,153,0,0.2)",
            }}
          >
            <FiExternalLink size={18} />
            Shop on Amazon India
          </motion.a>
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base"
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Browse Products
              <FiArrowRight size={16} />
            </motion.button>
          </Link>
        </motion.div>

        {/* ── Trust pillars grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.55 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl w-full mb-12"
        >
          {trustPillars.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="text-center px-3 py-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(212,175,55,0.12)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="text-2xl mb-2">{p.icon}</div>
              <p className="font-bold text-sm text-white mb-0.5">{p.title}</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{p.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Gold divider ── */}
        <div
          className="w-full max-w-2xl h-px mb-8"
          style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.22), transparent)" }}
        />

        {/* ── Promise pills ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex flex-wrap justify-center gap-2.5 mb-8"
        >
          {promises.map((p) => (
            <div
              key={p.label}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(212,175,55,0.08)",
                border: "1px solid rgba(212,175,55,0.18)",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              <span>{p.emoji}</span>
              {p.label}
            </div>
          ))}
        </motion.div>

        {/* ── Star rating callout ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: "#D4AF37", fontSize: "15px" }}>★</span>
            ))}
          </div>
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
            4.8 rating · 1,000+ happy families
          </span>
        </motion.div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
          Questions?{" "}
          <a
            href="mailto:hello@vedyara.in"
            style={{ color: "rgba(212,175,55,0.5)" }}
          >
            hello@vedyara.in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Cart;
