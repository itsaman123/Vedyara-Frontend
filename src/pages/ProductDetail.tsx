import { useState, useEffect, useMemo } from "react";
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
  FiZap,
  FiTruck,
  FiRotateCcw,
  FiMinus,
  FiPlus
} from "react-icons/fi";
import { useProduct } from "../api/productApi";
import { products as localProducts, type Product } from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import { ProductDetailSkeleton } from "../components/Skeletons";
import { AMAZON_STORE_URL } from "../config/environment";

const badgeConfig: Record<string, { bg: string; color: string; emoji: string }> = {
  "Best Seller": { bg: "linear-gradient(135deg,#D4AF37,#e8c84a)", color: "#3E2F1C", emoji: "🏆" },
  Trending:      { bg: "linear-gradient(135deg,#6B8E23,#7fa828)", color: "#fff", emoji: "🔥" },
  New:           { bg: "linear-gradient(135deg,#3E2F1C,#5a4532)", color: "#D4AF37", emoji: "✨" },
  Limited:       { bg: "linear-gradient(135deg,#c0392b,#e74c3c)", color: "#fff", emoji: "⚡" },
  Natural:       { bg: "linear-gradient(135deg,#6B8E23,#98FB98)", color: "#1A2E05", emoji: "🌿" },
  Fresh:         { bg: "linear-gradient(135deg,#4682B4,#87CEEB)", color: "#fff", emoji: "❄️" },
  Bestseller:    { bg: "linear-gradient(135deg,#D4AF37,#e8c84a)", color: "#3E2F1C", emoji: "🏆" },
};

const categoryLabels: Record<string, string> = {
  honey:  "🍯 Honey",
  spices: "✨ Spices & Powders",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="18" height="18" viewBox="0 0 24 24">
          <path
            d="M12 2l2.9 8.7H23l-7.4 5.4 2.8 8.7L12 19.4l-6.4 5.4 2.8-8.7L1 10.7h8.1z"
            fill={s <= Math.round(rating) ? "#D4AF37" : "rgba(212,175,55,0.25)"}
          />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);


  // Try to find in local products first (for static data)
  const localProduct = useMemo(() => 
    localProducts.find((p) => String(p.id) === id), 
  [id]);

  // Fetch from API (for dynamic data)
  const { data: apiProduct, isLoading, isError } = useProduct(id || "");

  const product = useMemo(() => {
    if (localProduct) return localProduct;
    if (!apiProduct) return null;

    return {
      _id: apiProduct._id,
      id: apiProduct._id,
      name: apiProduct.name,
      category: apiProduct.category,
      price: `₹${apiProduct.discountedPrice !== null ? apiProduct.discountedPrice : apiProduct.price}`,
      originalPrice: apiProduct.discountedPrice !== null ? `₹${apiProduct.price}` : undefined,
      badge: apiProduct.featured ? "Best Seller" : apiProduct.stock < 10 ? "Limited" : "Natural",
      image: apiProduct.images[0] || "https://via.placeholder.com/400",
      images: apiProduct.images.length > 0 ? apiProduct.images : [apiProduct.images[0] || "https://via.placeholder.com/400"],
      description: apiProduct.description,
      shortDesc: apiProduct.shortDescription || apiProduct.description.slice(0, 100),
      benefits: apiProduct.tags && apiProduct.tags.length > 0 ? apiProduct.tags : ["100% Natural", "Lab Tested", "Pure"],
      weight: apiProduct.unit,
      amazonLink: "#",
      rating: 4.8,
      reviews: 124,
      limited: apiProduct.stock < 10,
      featured: apiProduct.featured
    } as Product;
  }, [localProduct, apiProduct]);

  const liked = product ? isInWishlist(product.id as string) : false;


  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || product.image);
    }
  }, [product]);

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError || (!isLoading && !product)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-serif font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="text-amber-600 font-bold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(
        (1 -
          parseInt(product.price.replace(/\D/g, "")) /
          parseInt(product.originalPrice.replace(/\D/g, ""))) *
        100,
      )
    : null;

  const badge = product.badge ? (badgeConfig[product.badge] || badgeConfig["Trending"]) : null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8" style={{ background: "#FDFCFB" }}>
      <div className="max-w-[1440px] mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-70"
            style={{ color: "#3E2F1C" }}
          >
            <FiArrowLeft size={18} />
            Back to Shop
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="lg:w-1/2 space-y-4">
            <div 
              className="relative aspect-square rounded-3xl overflow-hidden flex items-center justify-center p-8 sm:p-12"
              style={{ 
                background: "linear-gradient(145deg, #fefcf7 0%, #f8f0e3 50%, #f0e4cc 100%)",
                boxShadow: "inset 0 0 40px rgba(62,47,28,0.05)"
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-contain relative z-10"
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(62,47,28,0.15))",
                    maxHeight: "450px"
                  }}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </AnimatePresence>

              {/* Decorative Circle */}
              <div
                className="absolute pointer-events-none"
                style={{
                  width: "70%",
                  height: "70%",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />

              {/* Badge */}
              {badge && (
                <div
                  className="absolute top-6 left-6 z-20 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold"
                  style={{
                    background: badge.bg,
                    color: badge.color,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  <span>{badge.emoji}</span>
                  <span>{product.badge}</span>
                </div>
              )}

              {/* Like Button */}
              <button
                onClick={() => product && toggleWishlist(product as any)}
                className="absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                style={{
                  background: liked ? "#c0392b" : "rgba(255,255,255,0.9)",
                  color: liked ? "#fff" : "rgba(62,47,28,0.5)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(62,47,28,0.05)"
                }}
              >
                <FiHeart
                  size={20}
                  fill={liked ? "#fff" : "transparent"}
                  strokeWidth={liked ? 0 : 2}
                />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(img)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden p-2 transition-all duration-300 border-2 ${
                    selectedImage === img ? "border-[#D4AF37]" : "border-transparent"
                  }`}
                  style={{ 
                    background: "rgba(62,47,28,0.03)",
                    boxShadow: selectedImage === img ? "0 8px 20px rgba(212,175,55,0.2)" : "none"
                  }}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-1/2 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <p
                  className="text-sm font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: "#6B8E23" }}
                >
                  {categoryLabels[product.category] || product.category}
                </p>
                <h1
                  className="font-serif font-bold leading-tight"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#3E2F1C" }}
                >
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10">
                  <StarRating rating={product.rating} />
                  <span className="font-bold text-sm text-[#3E2F1C]">{product.rating}</span>
                </div>
                <span className="text-sm font-medium" style={{ color: "rgba(62,47,28,0.5)" }}>
                  {product.reviews.toLocaleString()} verified reviews
                </span>
              </div>

              <div className="flex items-baseline gap-4">
                <span
                  className="font-serif font-bold"
                  style={{ fontSize: "3rem", color: "#3E2F1C" }}
                >
                  {product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl line-through" style={{ color: "rgba(62,47,28,0.3)" }}>
                      {product.originalPrice}
                    </span>
                    <span
                      className="text-sm font-bold px-4 py-1.5 rounded-full"
                      style={{
                        background: "#6B8E23",
                        color: "#fff",
                        boxShadow: "0 4px 12px rgba(107,142,35,0.2)"
                      }}
                    >
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-lg leading-relaxed max-w-xl" style={{ color: "rgba(62,47,28,0.7)" }}>
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 py-4">
                {product.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#6B8E23]/10 text-[#6B8E23]">
                      <FiCheck size={16} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold text-[#3E2F1C]">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 py-6 border-y border-stone-100">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Weight</span>
                  <div className="flex items-center gap-2 text-stone-800 font-bold">
                    <FiPackage className="text-[#D4AF37]" />
                    {product.weight}
                  </div>
                </div>
                <div className="w-px h-10 bg-stone-100" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Purity</span>
                  <div className="flex items-center gap-2 text-stone-800 font-bold">
                    <FiShield className="text-[#6B8E23]" />
                    Lab Certified
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 py-4">
                <span className="text-sm font-bold uppercase tracking-widest text-stone-400">Quantity</span>
                <div className="flex items-center border-2 border-stone-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-stone-50 transition-colors text-stone-600"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg text-brand-brown">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-stone-50 transition-colors text-stone-600"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>

              {/* Development phase notice */}
              <div
                className="rounded-2xl px-5 py-4 mb-2"
                style={{ background: "rgba(62,47,28,0.05)", border: "1px solid rgba(62,47,28,0.1)" }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: "#3E2F1C" }}>
                  🚧 Website in Development Phase
                </p>
                <p className="text-xs" style={{ color: "rgba(62,47,28,0.65)" }}>
                  Direct orders are not yet available here. You can order this product on Amazon India right now.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <motion.a
                  href={AMAZON_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg transition-shadow hover:shadow-xl"
                  style={{
                    background: "#FF9900",
                    color: "#1a1a1a",
                    boxShadow: "0 10px 30px rgba(255,153,0,0.3)"
                  }}
                >
                  <FiExternalLink size={22} />
                  Order on Amazon India
                </motion.a>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 flex items-center justify-center rounded-2xl border-2 border-stone-100 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  style={{ color: "#3E2F1C" }}
                >
                  <FiShare2 size={24} />
                </motion.button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
                {[
                  { icon: <FiTruck />, label: "Fast Shipping" },
                  { icon: <FiZap />, label: "100% Natural" },
                  { icon: <FiRotateCcw />, label: "Easy Returns" },
                  { icon: <FiShield />, label: "Secure Payment" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-stone-50 text-stone-400">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
