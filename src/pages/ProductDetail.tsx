import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiCheck,
  FiPackage,
  FiHeart,
  FiShare2,
  FiExternalLink,
  FiShield,
  FiChevronDown,
  FiZoomIn,
} from "react-icons/fi";
import { useProduct } from "../api/productApi";
import { products as localProducts, type Product } from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import { ProductDetailSkeleton } from "../components/Skeletons";
import { AMAZON_STORE_URL } from "../config/environment";
import { useSEO } from "../utils/seo";

/* ─────────────────────────────────────────────────────────────
   STATIC CONFIG
───────────────────────────────────────────────────────────── */
const badgeConfig: Record<string, { bg: string; color: string; emoji: string }> = {
  "Best Seller": { bg: "linear-gradient(135deg,#D4AF37,#e8c84a)", color: "#3E2F1C", emoji: "🏆" },
  Trending:      { bg: "linear-gradient(135deg,#6B8E23,#7fa828)", color: "#fff",     emoji: "🔥" },
  New:           { bg: "linear-gradient(135deg,#3E2F1C,#5a4532)", color: "#D4AF37",  emoji: "✨" },
  Limited:       { bg: "linear-gradient(135deg,#c0392b,#e74c3c)", color: "#fff",     emoji: "⚡" },
  Natural:       { bg: "linear-gradient(135deg,#6B8E23,#98FB98)", color: "#1A2E05",  emoji: "🌿" },
  Bestseller:    { bg: "linear-gradient(135deg,#D4AF37,#e8c84a)", color: "#3E2F1C",  emoji: "🏆" },
};

const categoryLabels: Record<string, string> = {
  honey:  "Honey",
  spices: "Spices & Powders",
};

const honeyAttributes = [
  { icon: "🌸", label: "Aroma",          value: "Wildflower, Forest Blooms" },
  { icon: "🍯", label: "Taste Note",     value: "Sweet, Mildly Earthy" },
  { icon: "✨", label: "Sweetness",      value: "Naturally Sweet" },
  { icon: "❄️", label: "Crystallization", value: "May Crystalize Naturally" },
];

const spiceAttributes = [
  { icon: "🌾", label: "Origin",   value: "Farm Sourced, India" },
  { icon: "🔬", label: "Process",  value: "Stone Ground" },
  { icon: "✅", label: "Purity",   value: "100% Pure" },
  { icon: "🌿", label: "Best For", value: "Cooking & Wellness" },
];

const honeyNutrition = [
  { label: "Energy",         per100g: "304 kcal",  perServing: "~18 kcal" },
  { label: "Carbohydrates",  per100g: "82.1 g",    perServing: "4.9 g"    },
  { label: "Total Sugars",   per100g: "76.8 g",    perServing: "4.6 g"    },
  { label: "Protein",        per100g: "0.3 g",     perServing: "0.02 g"   },
  { label: "Total Fat",      per100g: "0 g",       perServing: "0 g"      },
  { label: "Sodium",         per100g: "4 mg",      perServing: "0.24 mg"  },
];

/* ─────────────────────────────────────────────────────────────
   STAR RATING
───────────────────────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="16" height="16" viewBox="0 0 24 24">
          <path
            d="M12 2l2.9 8.7H23l-7.4 5.4 2.8 8.7L12 19.4l-6.4 5.4 2.8-8.7L1 10.7h8.1z"
            fill={s <= Math.round(rating) ? "#D4AF37" : "rgba(212,175,55,0.2)"}
          />
        </svg>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ACCORDION ITEM
───────────────────────────────────────────────────────────── */
function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b" style={{ borderColor: "rgba(62,47,28,0.09)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="font-semibold text-sm" style={{ color: "#1a0f05" }}>
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex-shrink-0"
          style={{ color: "rgba(62,47,28,0.4)" }}
        >
          <FiChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="pb-6 text-sm leading-relaxed"
              style={{ color: "rgba(62,47,28,0.65)" }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRODUCT DETAIL PAGE
───────────────────────────────────────────────────────────── */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const { toggleWishlist, isInWishlist } = useWishlist();

  function handleImageMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = imgWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }

  const localProduct = useMemo(
    () => localProducts.find((p) => String(p.id) === id),
    [id],
  );

  const { data: apiProduct, isLoading, isError } = useProduct(id || "");

  const product = useMemo(() => {
    if (localProduct) return localProduct;
    if (!apiProduct) return null;
    return {
      _id:           apiProduct._id,
      id:            apiProduct._id,
      name:          apiProduct.name,
      category:      apiProduct.category,
      price:         `₹${apiProduct.discountedPrice !== null ? apiProduct.discountedPrice : apiProduct.price}`,
      originalPrice: apiProduct.discountedPrice !== null ? `₹${apiProduct.price}` : undefined,
      badge:         apiProduct.featured ? "Best Seller" : apiProduct.stock < 10 ? "Limited" : "Natural",
      image:         apiProduct.images[0] || "",
      images:        apiProduct.images.length > 0 ? apiProduct.images : [apiProduct.images[0] || ""],
      description:   apiProduct.description,
      shortDesc:     apiProduct.shortDescription || apiProduct.description.slice(0, 100),
      benefits:      apiProduct.tags?.length > 0 ? apiProduct.tags : ["100% Natural", "Lab Tested", "Pure"],
      weight:        apiProduct.unit,
      amazonLink:    "#",
      rating:        4.8,
      reviews:       124,
      limited:       apiProduct.stock < 10,
      featured:      apiProduct.featured,
    } as Product;
  }, [localProduct, apiProduct]);

  const liked    = product ? isInWishlist(product.id as string) : false;
  const isHoney  = product?.category === "honey";
  const attributes = isHoney ? honeyAttributes : spiceAttributes;

  const productTitle = product
    ? isHoney
      ? `${product.name} | Vedyara Multi Flora Honey — Pure & Raw`
      : `${product.name} | Vedyara Natural ${product.category === "spices" ? "Spices" : "Products"}`
    : "Vedyara Products";

  const productDesc = product
    ? isHoney
      ? `Buy ${product.name} from Vedyara. Pure multiflora honey — raw, unprocessed, lab-tested. ${product.shortDesc || ""}`
      : `Buy ${product.name} from Vedyara. 100% natural, farm-sourced, lab-tested. ${product.shortDesc || ""}`
    : "";

  useSEO({
    title:       productTitle,
    description: productDesc.slice(0, 160),
    keywords:    isHoney
      ? `${product?.name ?? "vedyara"}, vedyara multi flora honey, multiflora honey, vedyara honey, pure honey, raw honey india`
      : `${product?.name ?? "vedyara"}, vedyara natural products, pure spices india`,
    canonical:   id ? `https://vedyara.in/product/${id}` : undefined,
    structuredData: product && isHoney
      ? {
          "@context": "https://schema.org",
          "@type":    "Product",
          name:       product.name,
          alternateName: ["Vedyara Multi Flora Honey", "Vedyara Multiflora Honey"],
          description: product.shortDesc || product.description,
          brand: { "@type": "Brand", name: "Vedyara" },
          image: product.images,
          category: "Natural Honey",
          offers: {
            "@type":        "Offer",
            availability:   "https://schema.org/InStock",
            priceCurrency:  "INR",
            price:          product.price.replace(/[^\d.]/g, ""),
            url:            AMAZON_STORE_URL,
          },
        }
      : undefined,
  });

  useEffect(() => {
    if (product) setSelectedIdx(0);
  }, [product]);

  /* ── Loading / error ── */
  if (isLoading) return <ProductDetailSkeleton />;
  if (isError || (!isLoading && !product)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-serif font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="text-amber-600 font-bold hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }
  if (!product) return null;

  /* ── Computed ── */
  const discount = product.originalPrice
    ? Math.round(
        (1 -
          parseInt(product.price.replace(/\D/g, "")) /
          parseInt(product.originalPrice.replace(/\D/g, ""))) *
        100,
      )
    : null;

  const badge  = product.badge ? (badgeConfig[product.badge] ?? badgeConfig["Natural"]) : null;
  const images = product.images?.length > 0 ? product.images : [product.image];
  const selectedImage = images[selectedIdx] ?? images[0];

  /* ─────────────────── JSX ─────────────────── */
  return (
    <div className="min-h-screen" style={{ background: "#FDFCFB" }}>

      {/* ── Breadcrumb ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-xs font-medium"
          style={{ color: "rgba(62,47,28,0.45)" }}
        >
          <Link to="/" className="hover:text-amber-700 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-amber-700 transition-colors">Products</Link>
          <span>/</span>
          <span className="truncate font-semibold" style={{ color: "#3E2F1C" }}>
            {product.name}
          </span>
        </motion.div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* ══════════════════════════════════════════
              LEFT — Image Gallery
          ══════════════════════════════════════════ */}
          <div className="lg:w-[52%] lg:max-w-[580px] flex flex-col gap-4">

            <div className="flex gap-3 sm:gap-4">

            {/* Vertical thumbnail rail (Amazon-style, desktop only) */}
            {images.length > 1 && (
              <div
                className="hidden sm:flex flex-col gap-2.5 flex-shrink-0 w-[64px] max-h-[460px] overflow-y-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setSelectedIdx(idx)}
                    className="flex-shrink-0 w-[64px] h-[64px] rounded-xl overflow-hidden p-1.5 border-2 transition-all duration-200"
                    style={{
                      background: "rgba(62,47,28,0.03)",
                      borderColor: selectedIdx === idx ? "#D4AF37" : "transparent",
                      boxShadow: selectedIdx === idx
                        ? "0 0 0 3px rgba(212,175,55,0.18), 0 6px 18px rgba(212,175,55,0.18)"
                        : "0 1px 6px rgba(62,47,28,0.07)",
                    }}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div
              ref={imgWrapRef}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleImageMouseMove}
              className="relative flex-1 min-w-0 rounded-3xl overflow-hidden aspect-square"
              style={{
                background: "linear-gradient(145deg, #fefcf7 0%, #f8f0e3 55%, #f0e4cc 100%)",
                boxShadow: "0 4px 40px rgba(62,47,28,0.07)",
              }}
            >
              {/* Honeycomb SVG pattern */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0 34L0 84V66l28 16 28-16v18L28 100z' fill='none' stroke='%23D4AF37' stroke-width='0.7'/%3E%3C/svg%3E")`,
                  backgroundSize: "56px 100px",
                  opacity: 0.055,
                }}
              />

              {/* Rotating dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                className="absolute pointer-events-none rounded-full"
                style={{
                  inset: "7%",
                  border: "1.5px dashed rgba(212,175,55,0.22)",
                }}
              />

              {/* Static inner ring */}
              <div
                className="absolute pointer-events-none rounded-full"
                style={{
                  inset: "14%",
                  border: "1px solid rgba(212,175,55,0.12)",
                }}
              />

              {/* Hex SVG outline */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 200 200"
                fill="none"
              >
                <polygon
                  points="100,14 186,57 186,143 100,186 14,143 14,57"
                  stroke="rgba(212,175,55,0.1)"
                  strokeWidth="1.5"
                  strokeDasharray="10 5"
                />
              </svg>

              {/* Radial glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${
                    isHoney
                      ? "rgba(212,175,55,0.13)"
                      : "rgba(107,142,35,0.1)"
                  } 0%, transparent 65%)`,
                }}
              />

              {/* Product image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain p-8 z-10"
                  style={{ filter: "drop-shadow(0 20px 44px rgba(62,47,28,0.16))" }}
                  initial={{ opacity: 0, scale: 0.9, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.06, y: -10 }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                />
              </AnimatePresence>

              {/* Best Seller + discount badges, stacked top-left */}
              <div className="absolute top-5 left-5 z-20 flex flex-col items-start gap-2">
                {badge && (
                  <div
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold"
                    style={{
                      background: badge.bg,
                      color: badge.color,
                      boxShadow: "0 6px 18px rgba(0,0,0,0.14)",
                    }}
                  >
                    <span>{badge.emoji}</span>
                    <span>{product.badge}</span>
                  </div>
                )}

                {discount && (
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #6B8E23, #7fa828)",
                      boxShadow: "0 4px 12px rgba(107,142,35,0.35)",
                    }}
                  >
                    {discount}% OFF
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => product && toggleWishlist(product as any)}
                className="absolute top-5 right-5 z-20 w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-200 hover:scale-110 active:scale-90"
                style={{
                  background: liked ? "#c0392b" : "rgba(255,255,255,0.92)",
                  color: liked ? "#fff" : "rgba(62,47,28,0.5)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(62,47,28,0.06)",
                }}
              >
                <FiHeart size={18} fill={liked ? "#fff" : "transparent"} />
              </button>

              {/* Zoom overlay (desktop hover) */}
              {zoom && (
                <div
                  className="absolute inset-0 z-30 hidden lg:block"
                  style={{
                    backgroundImage: `url(${selectedImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "210%",
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundColor: "#fefcf7",
                  }}
                />
              )}

              {/* Zoom hint */}
              {images.length > 0 && (
                <div
                  className="hidden lg:flex absolute bottom-4 right-4 z-20 items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold pointer-events-none transition-opacity duration-200"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    color: "rgba(62,47,28,0.55)",
                    opacity: zoom ? 0 : 1,
                  }}
                >
                  <FiZoomIn size={12} /> Hover to zoom
                </div>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div
                  className="absolute bottom-4 left-4 z-20 font-mono text-[11px] font-semibold px-2.5 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    color: "rgba(62,47,28,0.55)",
                  }}
                >
                  {selectedIdx + 1}&nbsp;/&nbsp;{images.length}
                </div>
              )}
            </div>
            {/* end main image */}

            </div>
            {/* end image row */}

            {/* Thumbnail strip (mobile only) */}
            {images.length > 1 && (
              <div
                className="flex sm:hidden gap-2.5 overflow-x-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setSelectedIdx(idx)}
                    className="flex-shrink-0 w-[64px] h-[64px] rounded-xl overflow-hidden p-1.5 border-2 transition-all duration-200"
                    style={{
                      background: "rgba(62,47,28,0.03)",
                      borderColor: selectedIdx === idx ? "#D4AF37" : "transparent",
                      boxShadow: selectedIdx === idx
                        ? "0 0 0 3px rgba(212,175,55,0.18), 0 6px 18px rgba(212,175,55,0.18)"
                        : "0 1px 6px rgba(62,47,28,0.07)",
                    }}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Inline trust pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { emoji: "🔬", text: "Lab Certified" },
                { emoji: "🌿", text: "100% Natural" },
                { emoji: "📦", text: "Eco Packaging" },
                { emoji: "🏆", text: "FSSAI Approved" },
              ].map((b) => (
                <div
                  key={b.text}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(107,142,35,0.07)",
                    color: "#3d6b1a",
                    border: "1px solid rgba(107,142,35,0.14)",
                  }}
                >
                  {b.emoji} {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              RIGHT — Product Info
          ══════════════════════════════════════════ */}
          <div className="lg:w-[48%] flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5, ease: "easeOut" }}
            >

              {/* Category hex badge */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    background: "linear-gradient(135deg, #D4AF37, #e8c84a)",
                    fontSize: "9px",
                  }}
                >
                  {isHoney ? "🍯" : "✨"}
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#6B8E23" }}
                >
                  {categoryLabels[product.category] || product.category}
                </span>
              </div>

              {/* Product name */}
              <h1
                className="font-serif font-bold leading-tight mb-4"
                style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.35rem)", color: "#1a0f05" }}
              >
                {product.name}
              </h1>

              {/* Rating + stock */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full"
                  style={{ background: "rgba(212,175,55,0.1)" }}
                >
                  <StarRating rating={product.rating} />
                  <span className="font-bold text-sm" style={{ color: "#3E2F1C" }}>
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm" style={{ color: "rgba(62,47,28,0.4)" }}>
                  {product.reviews.toLocaleString()} reviews
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(107,142,35,0.1)", color: "#3d6b1a" }}>
                  ● In Stock
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className="font-serif font-bold"
                  style={{
                    fontSize: "2.25rem",
                    background: "linear-gradient(135deg, #b8961f, #D4AF37, #c89f20)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span
                    className="text-lg line-through font-medium"
                    style={{ color: "rgba(62,47,28,0.3)" }}
                  >
                    {product.originalPrice}
                  </span>
                )}
              </div>

              {/* Savings badge */}
              {discount && (
                <div className="mb-6">
                  <span
                    className="inline-block text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #6B8E23, #7fa828)",
                      color: "#fff",
                      boxShadow: "0 3px 10px rgba(107,142,35,0.25)",
                    }}
                  >
                    You Save {discount}%
                  </span>
                </div>
              )}

              {/* ── Honey / Spice Attribute Tags ── */}
              <div
                className="grid grid-cols-2 gap-3 py-5 my-2"
                style={{
                  borderTop: "1px solid rgba(62,47,28,0.08)",
                  borderBottom: "1px solid rgba(62,47,28,0.08)",
                }}
              >
                {attributes.map((attr) => (
                  <div
                    key={attr.label}
                    className="flex items-start gap-3 px-3 py-3 rounded-2xl"
                    style={{
                      background: "rgba(212,175,55,0.05)",
                      border: "1px solid rgba(212,175,55,0.12)",
                    }}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{attr.icon}</span>
                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                        style={{ color: "rgba(62,47,28,0.4)" }}
                      >
                        {attr.label}
                      </p>
                      <p className="text-xs font-semibold" style={{ color: "#1a0f05" }}>
                        {attr.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust strip */}
              <p
                className="text-xs font-semibold text-center py-3 my-1"
                style={{ color: "rgba(62,47,28,0.5)", letterSpacing: "0.04em" }}
              >
                {isHoney
                  ? "Forest Sourced  |  Raw & Pure  |  No Heat  |  No Chemicals  |  Lab Tested"
                  : "Farm Sourced  |  Stone Ground  |  No Additives  |  Lab Tested"}
              </p>

              {/* Dev notice — premium dark */}
              <div
                className="rounded-2xl px-4 py-4 my-4"
                style={{
                  background: "linear-gradient(135deg, #0f0a05, #1a0d04)",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      background: "rgba(212,175,55,0.15)",
                      fontSize: "13px",
                    }}
                  >
                    🚧
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-0.5" style={{ color: "rgba(255,255,255,0.9)" }}>
                      Direct Orders Opening Soon
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Our website checkout is in development. Order this product right now on Amazon India — same quality, trusted delivery.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA row */}
              <div className="flex gap-3 mb-6">
                <motion.a
                  href={AMAZON_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base"
                  style={{
                    background: "linear-gradient(135deg, #FF9900 0%, #ffb733 100%)",
                    color: "#1a1a1a",
                    boxShadow: "0 12px 32px rgba(255,153,0,0.35)",
                  }}
                >
                  <FiExternalLink size={19} />
                  Order on Amazon India
                </motion.a>

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.93 }}
                  className="w-14 flex items-center justify-center rounded-2xl border-2 transition-colors duration-200"
                  style={{
                    borderColor: "rgba(62,47,28,0.12)",
                    color: "rgba(62,47,28,0.45)",
                  }}
                >
                  <FiShare2 size={18} />
                </motion.button>
              </div>

              {/* ── Accordion sections ── */}
              <div className="border-t" style={{ borderColor: "rgba(62,47,28,0.08)" }}>

                <AccordionItem title="Description" defaultOpen>
                  <p>{product.description}</p>
                </AccordionItem>

                <AccordionItem title="Benefits">
                  <ul className="space-y-2.5 mt-1">
                    {product.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <div
                          className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                            background: "linear-gradient(135deg, #6B8E23, #7fa828)",
                          }}
                        >
                          <FiCheck size={11} color="#fff" strokeWidth={3} />
                        </div>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionItem>

                {isHoney && (
                  <AccordionItem title="Nutritional Information">
                    <p className="mb-3 text-xs" style={{ color: "rgba(62,47,28,0.45)" }}>
                      Serving size: 6 g (1 teaspoon)  ·  Servings per pack: varies by size
                    </p>
                    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(62,47,28,0.09)" }}>
                      <div
                        className="grid grid-cols-3 text-[11px] font-bold uppercase tracking-wider px-4 py-2.5"
                        style={{ background: "rgba(212,175,55,0.08)", color: "rgba(62,47,28,0.5)" }}
                      >
                        <span>Nutrient</span>
                        <span className="text-center">Per 100g</span>
                        <span className="text-right">Per Serving</span>
                      </div>
                      {honeyNutrition.map((row, i) => (
                        <div
                          key={row.label}
                          className="grid grid-cols-3 text-xs px-4 py-2.5 border-t"
                          style={{
                            borderColor: "rgba(62,47,28,0.06)",
                            background: i % 2 === 0 ? "transparent" : "rgba(62,47,28,0.015)",
                          }}
                        >
                          <span className="font-medium" style={{ color: "#1a0f05" }}>{row.label}</span>
                          <span className="text-center" style={{ color: "rgba(62,47,28,0.6)" }}>{row.per100g}</span>
                          <span className="text-right" style={{ color: "rgba(62,47,28,0.6)" }}>{row.perServing}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs" style={{ color: "rgba(62,47,28,0.38)" }}>
                      * Approximate values. Nutritional content may vary batch to batch as this is a natural product.
                    </p>
                  </AccordionItem>
                )}

                <AccordionItem title="Product Details">
                  <div className="space-y-2.5">
                    {[
                      { label: "Brand",         value: "Vedyara" },
                      { label: "Weight / Unit",  value: product.weight },
                      { label: "Category",       value: categoryLabels[product.category] || product.category },
                      { label: "Country of Origin", value: "India" },
                      { label: "Certifications",  value: "FSSAI Approved, Lab Tested" },
                      { label: "Storage",         value: "Store in a cool, dry place away from direct sunlight" },
                      { label: "Shelf Life",      value: "24 months from date of manufacture" },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex gap-3 text-xs pb-2 border-b last:border-b-0"
                        style={{ borderColor: "rgba(62,47,28,0.06)" }}
                      >
                        <span
                          className="font-bold flex-shrink-0 w-36"
                          style={{ color: "rgba(62,47,28,0.5)" }}
                        >
                          {row.label}
                        </span>
                        <span style={{ color: "#1a0f05" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionItem>

                <AccordionItem title="Returns & Exchange">
                  <div className="space-y-3">
                    <p>
                      We take great care in packaging our products. If you receive a damaged, tampered, or
                      incorrect product, we will arrange a replacement or full refund.
                    </p>
                    <p>
                      <span className="font-semibold" style={{ color: "#1a0f05" }}>Sealed products:</span>{" "}
                      Eligible for return/replacement within 7 days of delivery if unopened and seal is intact.
                    </p>
                    <p>
                      <span className="font-semibold" style={{ color: "#1a0f05" }}>Opened products:</span>{" "}
                      Cannot be returned due to food safety regulations. However, if the product quality is
                      unsatisfactory, please reach out to us with a photo/video within 48 hours of receiving.
                    </p>
                    <div
                      className="flex flex-col gap-2 mt-3 p-3 rounded-xl"
                      style={{ background: "rgba(107,142,35,0.06)", border: "1px solid rgba(107,142,35,0.12)" }}
                    >
                      <p className="text-xs font-bold" style={{ color: "#2D4A1E" }}>Contact for returns:</p>
                      <p className="text-xs" style={{ color: "rgba(62,47,28,0.6)" }}>
                        Email: hello@vedyara.in
                      </p>
                      <p className="text-xs" style={{ color: "rgba(62,47,28,0.6)" }}>
                        Amazon orders: Use the Amazon return portal for fastest resolution.
                      </p>
                    </div>
                  </div>
                </AccordionItem>

              </div>
              {/* end accordions */}

            </motion.div>
          </div>
          {/* end right */}

        </div>
      </div>

      {/* ══════════════════════════════════════════
          A+ CONTENT — Brand Story Gallery
      ══════════════════════════════════════════ */}
      {images.length > 1 && (
        <div style={{ background: "#F8F5F0" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-10">
              <span className="section-tag">From Vedyara</span>
              <h2 className="section-heading-center">A Closer Look</h2>
            </div>
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {images.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="rounded-3xl overflow-hidden"
                  style={{ boxShadow: "0 4px 30px rgba(62,47,28,0.08)" }}
                >
                  <img
                    src={img}
                    alt={`${product.name} — detail ${idx + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
