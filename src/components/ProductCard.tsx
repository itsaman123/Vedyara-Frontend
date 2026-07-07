import { motion } from "framer-motion";
import { FiHeart, FiExternalLink } from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import type { Product as ApiProduct } from "../api/productApi";
import { AMAZON_STORE_URL } from "../config/environment";

export default function ProductCard({
  product,
  index,
  onView,
}: {
  product: ApiProduct;
  index: number;
  onView: (p: ApiProduct) => void;
}) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id);

  const displayPrice = product.discountedPrice !== null ? product.discountedPrice : product.price;
  const savings = product.discountedPrice !== null
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: "easeOut" }}
      className="group cursor-pointer flex flex-col h-full"
      onClick={() => onView(product)}
    >
      <div
        className="relative bg-white rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1"
        style={{ boxShadow: "0 2px 20px rgba(62,47,28,0.08)" }}
      >
        {/* Image area */}
        <div className="relative flex-shrink-0 overflow-hidden aspect-square" style={{ background: "#faf8f5" }}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge top-left */}
          {savings !== null && savings > 0 ? (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
              style={{ background: "linear-gradient(135deg, #2D4A1E, #3d6b2a)", color: "#fff" }}
            >
              {savings}% off
            </span>
          ) : product.featured ? (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
              style={{ background: "linear-gradient(135deg, #D4AF37, #e8c84a)", color: "#3E2F1C" }}
            >
              Best Seller
            </span>
          ) : null}

          {/* Wishlist top-right */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
            style={{
              background: wishlisted ? "#c0392b" : "rgba(255,255,255,0.9)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <FiHeart size={14} style={{ color: wishlisted ? "#fff" : "rgba(62,47,28,0.5)" }} fill={wishlisted ? "#fff" : "transparent"} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-5 pt-4 pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#6B8E23" }}>
            {product.category === "honey" ? "Honey" : "Spices & Powders"}
          </p>

          <h3 className="font-serif font-bold leading-snug mb-1" style={{ fontSize: "1.05rem", color: "#1a0f05" }}>
            {product.name}
          </h3>

          <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: "rgba(26,15,5,0.5)" }}>
            {product.shortDescription || product.description.slice(0, 80)}
          </p>

          {/* Price + actions */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-lg" style={{ color: "#1a0f05" }}>₹{displayPrice}</span>
                {product.discountedPrice !== null && (
                  <span className="ml-1.5 text-xs text-gray-400 line-through">₹{product.price}</span>
                )}
                <p className="text-[11px] text-gray-400 mt-0.5">{product.unit}</p>
              </div>

              <a
                href={AMAZON_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl font-bold text-xs transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                style={{
                  background: "#FF9900",
                  color: "#1a1a1a",
                  boxShadow: "0 4px 12px rgba(255,153,0,0.3)",
                }}
              >
                Order on Amazon <FiExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
