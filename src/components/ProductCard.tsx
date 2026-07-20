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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="group cursor-pointer flex flex-col h-full"
      onClick={() => onView(product)}
    >
      <div className="relative bg-white border border-brand-gold/15 rounded-3xl overflow-hidden flex flex-col h-full shadow-card transition-all duration-400 group-hover:shadow-card-hover group-hover:border-brand-gold/40 group-hover:-translate-y-1.5">
        {/* Image area */}
        <div
          className="relative flex-shrink-0 overflow-hidden aspect-[4/3]"
          style={{ background: "radial-gradient(circle at 50% 42%, #fffdf8 0%, #f2ece0 75%)" }}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.06]"
          />

          {/* Wax-seal badge, top-left */}
          {savings !== null && savings > 0 ? (
            <div
              className="absolute top-2.5 left-2.5 w-11 h-11 rounded-full flex flex-col items-center justify-center rotate-[-9deg] shadow-gold-sm"
              style={{ background: "linear-gradient(135deg, #2D4A1E, #3d6b2a)" }}
            >
              <span className="text-xs font-extrabold text-white leading-none">{savings}%</span>
              <span className="text-[6.5px] font-bold uppercase tracking-wide text-white/85 leading-none mt-0.5">off</span>
            </div>
          ) : product.featured ? (
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-gradient-gold rotate-[-2deg] shadow-gold-sm">
              <span className="text-[9px] font-bold uppercase tracking-wide text-brand-brown">★ Best Seller</span>
            </div>
          ) : null}

          {/* Wishlist, top-right */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
            style={{
              background: wishlisted ? "#c0392b" : "rgba(255,255,255,0.9)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <FiHeart size={12} style={{ color: wishlisted ? "#fff" : "rgba(62,47,28,0.5)" }} fill={wishlisted ? "#fff" : "transparent"} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-3.5">
          <p className="text-[9px] font-semibold uppercase tracking-widest mb-0.5 text-brand-green">
            {product.category === "honey" ? "Honey" : "Spices & Powders"}
          </p>

          <h3 className="font-serif font-bold leading-snug mb-2 truncate text-[0.95rem] text-brand-brown">
            {product.name}
          </h3>

          {/* Price + action */}
          <div className="mt-auto pt-2.5 border-t border-brand-gold/15 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-base text-brand-brown">₹{displayPrice}</span>
                {product.discountedPrice !== null && (
                  <span className="text-[11px] text-brand-brown/35 line-through">₹{product.price}</span>
                )}
              </div>
              <p className="text-[10px] text-brand-brown/40">{product.unit}</p>
            </div>

            <a
              href={AMAZON_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Order on Amazon"
              className="inline-flex items-center justify-center gap-1 h-8 px-3 rounded-xl font-bold text-[11px] flex-shrink-0 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              style={{
                background: "#FF9900",
                color: "#1a1a1a",
                boxShadow: "0 4px 12px rgba(255,153,0,0.3)",
              }}
            >
              Buy <FiExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
