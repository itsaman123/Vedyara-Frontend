import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCardSkeleton, ProductListRowSkeleton } from "../components/Skeletons";
import ProductCard from "../components/ProductCard";
import {
  FiSearch, FiX, FiHeart, FiArrowRight,
  FiCheck, FiPackage, FiShield, FiExternalLink, FiShoppingBag,
} from "react-icons/fi";
import { FaStar, FaLeaf } from "react-icons/fa";
import { useProducts, type Product as ApiProduct } from "../api/productApi";
import { categories } from "../data/products";
import HoneyImg from "../assets/image-1.jpg";
import HaldiImg from "../assets/haldi.jpeg";
import DhaniyaImg from "../assets/dhaniya.jpeg";
import { useWishlist } from "../context/WishlistContext";
import { AMAZON_STORE_URL } from "../config/environment";
import { useSEO } from "../utils/seo";

/* ═══════════════════════════════════════════════════════════
   LIST ROW — premium list view
═══════════════════════════════════════════════════════════ */
const ProductListRow = ({
  product,
  index,
  onView,
}: {
  product: ApiProduct;
  index: number;
  onView: (p: ApiProduct) => void;
}) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id);
  const displayPrice = product.discountedPrice !== null ? product.discountedPrice : product.price;

  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl overflow-hidden flex gap-0 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      style={{ boxShadow: "0 2px 16px rgba(62,47,28,0.07)" }}
      onClick={() => onView(product)}
    >
      {/* Image */}
      <div
        className="w-40 sm:w-52 flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(145deg, #fdf9f4, #f5efe6)", minHeight: "160px" }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            {product.featured && (
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mb-1.5"
                style={{ background: "linear-gradient(135deg, #D4AF37, #e8c84a)", color: "#3E2F1C" }}
              >
                Best Seller
              </span>
            )}
            <h3 className="font-serif font-bold text-lg leading-snug" style={{ color: "#1a0f05" }}>
              {product.name}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-xl" style={{ color: "#1a0f05" }}>₹{displayPrice}</p>
            {product.discountedPrice !== null && (
              <p className="text-xs line-through text-gray-400">₹{product.price}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2 max-w-2xl">
          {product.shortDescription || product.description.slice(0, 120)}
        </p>

        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                style={{ background: "rgba(107,142,35,0.1)", color: "#3d6b1a" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FaStar size={13} style={{ color: "#D4AF37" }} />
              <span className="text-sm font-semibold" style={{ color: "#1a0f05" }}>4.8</span>
              <span className="text-xs text-gray-400">(124)</span>
            </div>
            <span className="text-xs text-gray-400">{product.unit}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors duration-200"
              style={{
                background: wishlisted ? "#c0392b" : "rgba(62,47,28,0.05)",
                color: wishlisted ? "#fff" : "rgba(62,47,28,0.5)",
              }}
            >
              <FiHeart size={15} fill={wishlisted ? "#fff" : "transparent"} />
            </button>
            <a
              href={AMAZON_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="h-9 px-4 flex items-center gap-1.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95"
              style={{ background: "#FF9900", color: "#1a1a1a", boxShadow: "0 4px 12px rgba(255,153,0,0.25)" }}
            >
              Order on Amazon <FiExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ═══════════════════════════════════════════════════════════
   CATEGORY PILL
═══════════════════════════════════════════════════════════ */
const CategoryPill = ({
  category,
  isActive,
  onClick,
  count,
}: {
  category: { id: string; label: string; emoji: string };
  isActive: boolean;
  onClick: () => void;
  count: number;
}) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-250"
    style={{
      background: isActive ? "linear-gradient(135deg, #D4AF37, #e8c84a)" : "white",
      color: isActive ? "#3E2F1C" : "#5a4532",
      boxShadow: isActive ? "0 4px 14px rgba(212,175,55,0.35)" : "0 1px 6px rgba(0,0,0,0.06)",
      border: isActive ? "none" : "1px solid rgba(62,47,28,0.1)",
    }}
  >
    <span>{category.emoji}</span>
    <span>{category.label}</span>
    {count > 0 && (
      <span
        className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
        style={{
          background: isActive ? "rgba(62,47,28,0.15)" : "rgba(212,175,55,0.12)",
          color: isActive ? "#3E2F1C" : "#7a5c1a",
        }}
      >
        {count}
      </span>
    )}
  </motion.button>
);

/* ═══════════════════════════════════════════════════════════
   PRODUCTS PAGE
═══════════════════════════════════════════════════════════ */
export default function Products() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const { data, isLoading, isError } = useProducts({
    category: activeCategory === "all" ? undefined : activeCategory,
    search: searchQuery || undefined,
    sortBy: sortBy.startsWith("price") ? "price" : "createdAt",
    sortOrder: sortBy === "price-asc" ? "asc" : "desc",
  });

  const products = useMemo(() => data?.items ?? [], [data]);
  const totalCount = data?.pagination.total ?? 0;

  useSEO({
    title: "Buy Multi Flora Honey & Natural Spices Online | Vedyara Products",
    description: "Shop Vedyara's full range — pure multi flora honey, turmeric powder & coriander powder. Farm-sourced, lab-tested. Order Vedyara multiflora honey on Amazon India.",
    keywords: "vedyara multi flora honey price, buy multiflora honey online, vedyara honey shop, natural spices india, buy vedyara products",
    canonical: "https://vedyara.in/products",
  });

  const handleView = (product: ApiProduct) => navigate(`/product/${product.slug}`);

  const clearSearch = () => setSearchQuery("");

  const trustBadges = [
    { icon: <FiCheck size={13} />, label: "FSSAI Certified" },
    { icon: <FaLeaf size={12} />, label: "100% Natural" },
    { icon: <FiShield size={13} />, label: "Lab Tested" },
    { icon: <FiPackage size={13} />, label: "Pan-India Delivery" },
  ];

  return (
    <main className="relative overflow-x-hidden bg-[#faf9f7] pb-24 md:pb-0">

      {/* ════════════════════════════════════════════════════
          HERO — clean text-only premium header
      ════════════════════════════════════════════════════ */}
      <section
        className="relative pt-28 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #fef9f3 0%, #f2ebe0 100%)" }}
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#D4AF37 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Gold line top */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)" }}
        />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ── Left: Text ── */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{
                  background: "rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.28)",
                }}
              >
                <FaLeaf size={11} style={{ color: "#6B8E23" }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#2D4A1E" }}>
                  Vedyara Collection
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif font-bold leading-tight mb-4"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: "#1a0f05" }}
              >
                Nature's Finest,{" "}
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #b8961f, #D4AF37, #e8c84a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Delivered Pure.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-base mb-8"
                style={{ color: "rgba(26,15,5,0.55)", lineHeight: 1.75, maxWidth: "440px" }}
              >
                Pure Vedyara Multi Flora Honey and aromatic spice powders — each product is
                farm-sourced, lab-tested, and free from preservatives.
              </motion.p>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.45 }}
                className="flex flex-wrap gap-2.5"
              >
                {trustBadges.map((b) => (
                  <div
                    key={b.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      border: "1px solid rgba(45,74,30,0.14)",
                      color: "rgba(26,15,5,0.65)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <span style={{ color: "#2D4A1E" }}>{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right: Product images ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
              style={{ height: "340px" }}
            >
              {/* Large honey jar — centre-left */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ width: "180px", height: "220px", zIndex: 3 }}
              >
                <div
                  className="w-full h-full rounded-3xl overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, #fff9ee, #fef0d0)",
                    boxShadow: "0 24px 60px rgba(212,175,55,0.25), 0 8px 24px rgba(0,0,0,0.08)",
                  }}
                >
                  <img src={HoneyImg} alt="Vedyara Multi Flora Honey" className="w-full h-full object-contain p-6" />
                </div>
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #D4AF37, #e8c84a)", color: "#3E2F1C", boxShadow: "0 4px 12px rgba(212,175,55,0.4)" }}
                >
                  🍯 Honey
                </div>
              </motion.div>

              {/* Turmeric — top right */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute right-16 top-4"
                style={{ width: "140px", height: "170px", zIndex: 2 }}
              >
                <div
                  className="w-full h-full rounded-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, #fffbf0, #fef3d0)",
                    boxShadow: "0 16px 40px rgba(212,175,55,0.2), 0 4px 16px rgba(0,0,0,0.06)",
                  }}
                >
                  <img src={HaldiImg} alt="Natural Turmeric Powder" className="w-full h-full object-contain p-5" />
                </div>
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
                  style={{ background: "rgba(255,180,0,0.15)", color: "#7a4800", border: "1px solid rgba(212,175,55,0.35)" }}
                >
                  ✨ Turmeric
                </div>
              </motion.div>

              {/* Coriander — bottom right */}
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="absolute right-0 bottom-4"
                style={{ width: "148px", height: "175px", zIndex: 2 }}
              >
                <div
                  className="w-full h-full rounded-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, #f4fbf4, #e8f5e8)",
                    boxShadow: "0 16px 40px rgba(107,142,35,0.18), 0 4px 16px rgba(0,0,0,0.06)",
                  }}
                >
                  <img src={DhaniyaImg} alt="Natural Coriander Powder" className="w-full h-full object-contain p-5" />
                </div>
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
                  style={{ background: "rgba(107,142,35,0.1)", color: "#3a6b1a", border: "1px solid rgba(107,142,35,0.25)" }}
                >
                  🌿 Coriander
                </div>
              </motion.div>

              {/* Decorative gold ring */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  width: "280px",
                  height: "280px",
                  border: "1px solid rgba(212,175,55,0.15)",
                  zIndex: 1,
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  width: "380px",
                  height: "380px",
                  border: "1px dashed rgba(212,175,55,0.08)",
                  zIndex: 1,
                }}
              />
            </motion.div>

          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "48px" }}>
            <path d="M0 48 Q360 0 720 32 Q1080 64 1440 16 L1440 48 Z" fill="#faf9f7" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          STICKY FILTERS
      ════════════════════════════════════════════════════ */}
      <div
        className="sticky top-16 z-30 py-4 px-5 sm:px-8 lg:px-12"
        style={{
          background: "rgba(250,249,247,0.96)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(62,47,28,0.07)",
          boxShadow: "0 2px 16px rgba(62,47,28,0.05)",
        }}
      >
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <FiSearch
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "rgba(62,47,28,0.38)" }}
              />
              <input
                type="text"
                placeholder="Search products, benefits…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border bg-white text-sm focus:outline-none transition-all duration-250"
                style={{
                  borderColor: searchQuery ? "#D4AF37" : "rgba(62,47,28,0.12)",
                  boxShadow: searchQuery ? "0 0 0 3px rgba(212,175,55,0.14)" : "none",
                  color: "#3E2F1C",
                }}
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full"
                    style={{ background: "rgba(62,47,28,0.1)" }}
                  >
                    <FiX size={11} style={{ color: "#3E2F1C" }} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs px-3 py-2.5 rounded-xl border bg-white cursor-pointer hidden sm:block focus:outline-none"
                style={{ borderColor: "rgba(62,47,28,0.12)", color: "#3E2F1C" }}
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>

              {/* View toggle */}
              <div
                className="flex items-center p-1 rounded-xl gap-0.5"
                style={{ background: "rgba(62,47,28,0.07)" }}
              >
                {(["grid", "list"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                    style={{
                      background: viewMode === mode ? "white" : "transparent",
                      color: viewMode === mode ? "#3E2F1C" : "rgba(62,47,28,0.4)",
                      boxShadow: viewMode === mode ? "0 1px 4px rgba(62,47,28,0.1)" : "none",
                    }}
                  >
                    {mode === "grid" ? (
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                        <rect x="0" y="0" width="5.5" height="5.5" rx="1" />
                        <rect x="7.5" y="0" width="5.5" height="5.5" rx="1" />
                        <rect x="0" y="7.5" width="5.5" height="5.5" rx="1" />
                        <rect x="7.5" y="7.5" width="5.5" height="5.5" rx="1" />
                      </svg>
                    ) : (
                      <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor">
                        <rect x="0" y="0" width="13" height="3" rx="1" />
                        <rect x="0" y="4" width="13" height="3" rx="1" />
                        <rect x="0" y="8" width="13" height="3" rx="1" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              <p className="text-xs hidden md:block" style={{ color: "rgba(62,47,28,0.45)" }}>
                <span className="font-bold" style={{ color: "#3E2F1C" }}>{totalCount}</span> products
              </p>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <CategoryPill
                key={cat.id}
                category={cat}
                isActive={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                count={
                  cat.id === "all"
                    ? totalCount
                    : products.filter((p) => p.category === cat.id).length
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PRODUCT GRID / LIST
      ════════════════════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {[...Array(6)].map((_, i) =>
                viewMode === "grid" ? (
                  <ProductCardSkeleton key={i} />
                ) : (
                  <ProductListRowSkeleton key={i} />
                )
              )}
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="text-5xl mb-5">⚠️</div>
              <h3 className="font-serif font-bold text-xl mb-2" style={{ color: "#3E2F1C" }}>
                Connection Issue
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">
                We're having trouble loading products. Please try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-full font-semibold text-sm text-white"
                style={{ background: "#2D4A1E" }}
              >
                Retry
              </button>
            </motion.div>
          ) : products.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${searchQuery}-${sortBy}-${viewMode}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {products.map((product, i) =>
                viewMode === "grid" ? (
                  <ProductCard
                    key={product._id}
                    product={product}
                    index={i}
                    onView={handleView}
                  />
                ) : (
                  <ProductListRow
                    key={product._id}
                    product={product}
                    index={i}
                    onView={handleView}
                  />
                )
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="text-6xl mb-5">🌿</div>
              <h3 className="font-serif font-bold text-xl mb-3" style={{ color: "#3E2F1C" }}>
                No Products Found
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">
                {searchQuery
                  ? `Nothing matched "${searchQuery}". Try a different search.`
                  : "No products available in this category yet."}
              </p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 rounded-full font-semibold text-sm"
                  style={{ background: "linear-gradient(135deg, #D4AF37, #e8c84a)", color: "#3E2F1C" }}
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom trust note */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12 pt-10 border-t"
            style={{ borderColor: "rgba(62,47,28,0.07)" }}
          >
            <p className="text-xs mb-4" style={{ color: "rgba(62,47,28,0.4)" }}>
              Showing all <strong style={{ color: "#3E2F1C" }}>{products.length}</strong> products
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {[
                { icon: "🛡️", text: "Secure Checkout" },
                { icon: "🚚", text: "Pan-India Delivery" },
                { icon: "↩️", text: "Easy Returns" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(62,47,28,0.45)" }}>
                  <span>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════
          MOBILE STICKY CTA
      ════════════════════════════════════════════════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 py-3 px-4 md:hidden"
        style={{
          background: "rgba(250,249,247,0.97)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(62,47,28,0.07)",
        }}
      >
        <div className="flex items-center gap-3 max-w-sm mx-auto">
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: "rgba(62,47,28,0.07)", color: "#3E2F1C" }}
          >
            <FiArrowRight size={18} />
          </button>
          <div
            className="flex-1 flex items-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #D4AF37, #e8c84a)", color: "#3E2F1C" }}
          >
            <FiShoppingBag size={16} />
            <span>{totalCount} Products Available</span>
          </div>
        </div>
      </div>
    </main>
  );
}
