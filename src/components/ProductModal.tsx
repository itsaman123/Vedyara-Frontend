import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiPackage, FiHeart, FiShare2, FiExternalLink } from "react-icons/fi";

import { AMAZON_STORE_URL } from "../config/environment";

interface ProductModalProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const badgeConfig: Record<string, { bg: string; color: string; emoji: string }> = {
  "Best Seller": { bg: "linear-gradient(135deg,#D4AF37,#e8c84a)", color: "#3E2F1C", emoji: "🏆" },
  Trending:      { bg: "linear-gradient(135deg,#6B8E23,#7fa828)", color: "#fff", emoji: "🔥" },
  New:           { bg: "linear-gradient(135deg,#3E2F1C,#5a4532)", color: "#D4AF37", emoji: "✨" },
  Limited:       { bg: "linear-gradient(135deg,#c0392b,#e74c3c)", color: "#fff", emoji: "⚡" },
};

const categoryLabels: Record<string, string> = {
  honey:   "🍯 Honey",
  spices:  "✨ Spices & Powders",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24">
          <path
            d="M12 2l2.9 8.7H23l-7.4 5.4 2.8 8.7L12 19.4l-6.4 5.4 2.8-8.7L1 10.7h8.1z"
            fill={s <= Math.round(rating) ? "#D4AF37" : "rgba(212,175,55,0.25)"}
          />
        </svg>
      ))}
    </div>
  );
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(
        (1 -
          parseInt(product.price.replace(/\D/g, "")) /
          parseInt(product.originalPrice.replace(/\D/g, ""))) *
        100,
      )
    : null;

  const badge = product.badge ? badgeConfig[product.badge] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(14,8,2,0.75)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            onClick={onClose}
          >
            <motion.div
              key="modal-panel"
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="relative w-full max-w-5xl overflow-hidden"
              style={{
                maxHeight: "92vh",
                borderRadius: "24px",
                background: "#fff",
                boxShadow: "0 40px 100px rgba(14,8,2,0.5), 0 16px 40px rgba(14,8,2,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  color: "#3E2F1C",
                  boxShadow: "0 4px 16px rgba(62,47,28,0.15)",
                }}
              >
                <FiX size={18} strokeWidth={2.5} />
              </button>

              <div className="flex flex-col md:flex-row" style={{ minHeight: "min(92vh, 580px)" }}>
                <div
                  className="relative md:w-[48%] flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{
                    minHeight: "340px",
                    background: "linear-gradient(145deg, #fefcf7 0%, #f8f0e3 50%, #f0e4cc 100%)",
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(circle at 3px 3px, rgba(212,175,55,0.08) 1px, transparent 0)",
                      backgroundSize: "28px 28px",
                    }}
                  />

                  <div
                    className="absolute pointer-events-none"
                    style={{
                      width: "320px",
                      height: "320px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />

                  {!imgError ? (
                    <motion.img
                      key={product.id}
                      src={product.image}
                      alt={product.name}
                      className="relative z-10"
                      style={{
                        width: "72%",
                        height: "auto",
                        maxHeight: "380px",
                        objectFit: "contain",
                        filter: "drop-shadow(0 24px 48px rgba(62,47,28,0.22)) drop-shadow(0 8px 16px rgba(62,47,28,0.1))",
                      }}
                      initial={{ scale: 1.1, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.65, ease: [0.34, 1.1, 0.64, 1] }}
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <span style={{ fontSize: "5rem" }}>
                        {categoryLabels[product.category]?.split(" ")[0] ?? "🌿"}
                      </span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(62,47,28,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {product.category}
                      </span>
                    </div>
                  )}

                  {badge && (
                    <motion.div
                      initial={{ opacity: 0, x: -16, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.25, type: "spring", stiffness: 300 }}
                      className="absolute top-5 left-5 z-20 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold"
                      style={{
                        background: badge.bg,
                        color: badge.color,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                      }}
                    >
                      <span>{badge.emoji}</span>
                      <span>{product.badge}</span>
                    </motion.div>
                  )}

                  {product.limited && (
                    <motion.div
                      initial={{ opacity: 0, x: 16, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                      className="absolute top-5 right-20 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold"
                      style={{
                        background: "rgba(192,57,43,0.92)",
                        color: "white",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-300 animate-pulse" />
                      Limited Stock
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      color: "#5a4532",
                      border: "1px solid rgba(62,47,28,0.1)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 4px 16px rgba(62,47,28,0.1)",
                    }}
                  >
                    <FiPackage size={12} />
                    {product.weight}
                    <span style={{ color: "rgba(62,47,28,0.3)" }}>·</span>
                    {categoryLabels[product.category]}
                  </motion.div>

                  <button
                    onClick={() => setLiked(!liked)}
                    className="absolute bottom-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                    style={{
                      background: liked ? "rgba(192,57,43,0.1)" : "rgba(255,255,255,0.92)",
                      color: liked ? "#c0392b" : "rgba(62,47,28,0.5)",
                      boxShadow: "0 4px 12px rgba(62,47,28,0.1)",
                      border: liked ? "1px solid rgba(192,57,43,0.2)" : "1px solid rgba(62,47,28,0.08)",
                    }}
                  >
                    <FiHeart
                      size={16}
                      fill={liked ? "#c0392b" : "transparent"}
                      strokeWidth={liked ? 0 : 2}
                    />
                  </button>
                </div>

                <div
                  className="flex-1 overflow-y-auto"
                  style={{ maxHeight: "min(92vh, 580px)" }}
                >
                  <div className="p-7 md:p-9 flex flex-col gap-5">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <p
                        className="text-xs font-bold uppercase tracking-widest mb-2"
                        style={{ color: "#6B8E23", letterSpacing: "0.18em" }}
                      >
                        {product.category}
                      </p>
                      <h2
                        className="font-serif font-bold leading-tight"
                        style={{ fontSize: "clamp(1.5rem, 2.8vw, 2rem)", color: "#3E2F1C" }}
                      >
                        {product.name}
                      </h2>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 }}
                      className="flex items-center gap-3"
                    >
                      <StarRating rating={product.rating} />
                      <span className="font-bold text-sm" style={{ color: "#3E2F1C" }}>{product.rating}</span>
                      <span className="text-xs" style={{ color: "rgba(62,47,28,0.45)" }}>
                        ({product.reviews.toLocaleString()} reviews)
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28 }}
                      className="flex items-center gap-4 flex-wrap"
                    >
                      <span
                        className="font-serif font-bold"
                        style={{ fontSize: "2.2rem", color: "#3E2F1C", lineHeight: 1 }}
                      >
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <>
                          <span className="text-base line-through" style={{ color: "rgba(62,47,28,0.35)" }}>
                            {product.originalPrice}
                          </span>
                          <span
                            className="text-xs font-bold px-3 py-1.5 rounded-full"
                            style={{
                              background: "rgba(107,142,35,0.12)",
                              color: "#506a1a",
                            }}
                          >
                            Save {discount}%
                          </span>
                        </>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.34 }}
                      style={{
                        height: "1px",
                        background: "linear-gradient(to right, rgba(62,47,28,0.12), transparent)",
                      }}
                    />

                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.38 }}
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(62,47,28,0.68)" }}
                    >
                      {product.description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.44 }}
                    >
                      <p
                        className="text-xs font-bold uppercase tracking-wider mb-3"
                        style={{ color: "#3E2F1C", letterSpacing: "0.14em" }}
                      >
                        Key Benefits
                      </p>
                      <div className="grid grid-cols-2 gap-2.5">
                        {product.benefits.map((benefit: string, i: number) => (
                          <motion.div
                            key={benefit}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.48 + i * 0.06 }}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                            style={{
                              background: "rgba(107,142,35,0.07)",
                              border: "1px solid rgba(107,142,35,0.14)",
                            }}
                          >
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: "rgba(107,142,35,0.15)" }}
                            >
                              <FiCheck size={11} style={{ color: "#506a1a" }} strokeWidth={3} />
                            </div>
                            <span className="text-xs font-medium" style={{ color: "#3E2F1C" }}>
                              {benefit}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-wrap gap-2"
                    >
                      {[
                        { icon: "🌿", label: "100% Natural" },
                        { icon: "🔬", label: "Lab Tested" },
                        { icon: "🚫", label: "No Additives" },
                        { icon: "🏆", label: "FSSAI Certified" },
                      ].map(({ icon, label }) => (
                        <div
                          key={label}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                          style={{
                            background: "rgba(62,47,28,0.04)",
                            color: "rgba(62,47,28,0.55)",
                            border: "1px solid rgba(62,47,28,0.06)",
                          }}
                        >
                          <span>{icon}</span>
                          <span>{label}</span>
                        </div>
                      ))}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65, type: "spring", stiffness: 200 }}
                      className="flex gap-3 pt-2 mt-auto"
                    >
                      <motion.a
                        href={AMAZON_STORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm"
                        style={{
                          background: "#FF9900",
                          color: "#1a1a1a",
                          boxShadow: "0 8px 24px rgba(255,153,0,0.3)",
                        }}
                      >
                        <FiExternalLink size={18} /> Order on Amazon India
                      </motion.a>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 flex items-center justify-center rounded-2xl"
                        style={{
                          background: "rgba(62,47,28,0.06)",
                          color: "rgba(62,47,28,0.6)",
                          border: "1.5px solid rgba(62,47,28,0.1)",
                        }}
                      >
                        <FiShare2 size={18} strokeWidth={2} />
                      </motion.button>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.72 }}
                      className="text-xs text-center"
                      style={{ color: "rgba(62,47,28,0.3)" }}
                    >
                      🛒 Also available on{" "}
                      <a
                        href={AMAZON_STORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 font-semibold hover:underline"
                        style={{ color: "#FF9900" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Amazon India <FiExternalLink size={10} />
                      </a>
                      {" "}· Free shipping on orders above ₹499
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
