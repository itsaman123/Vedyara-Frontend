import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiHeart, FiLock, FiShoppingBag, FiTrash2, FiTruck } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import type { Product } from "../api/productApi";
import { CartItemSkeleton } from "../components/Skeletons";
import QuantityStepper from "../components/QuantityStepper";
import { useSEO } from "../utils/seo";

const INK = "#2a1f12";
const LINE = "rgba(62,47,28,0.09)";

const Cart: React.FC = () => {
  useSEO({ title: "Your Cart | Vedyara", noindex: true });
  const navigate = useNavigate();
  const { cart, isLoading, updateQuantity, removeFromCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

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

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center bg-[#faf9f7]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(212,175,55,0.12)" }}>
            <FiShoppingBag size={38} style={{ color: "#b8961f" }} />
          </div>
          <h1 className="font-serif font-bold text-3xl text-brand-brown mb-3">Your Cart is Empty</h1>
          <p className="text-stone-500 mb-8 max-w-sm mx-auto">
            Pure honey and stone-ground spices are a click away.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white"
            style={{ background: "#2D4A1E" }}
          >
            Start Shopping <FiArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  const subtotal = cart?.totalAmount ?? 0;
  const mrpTotal = items.reduce((sum, i) => sum + (i.mrp ?? i.price) * i.quantity, 0);
  const savings = Math.max(0, mrpTotal - subtotal);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const hasUnavailable = items.some((i) => i.available === false);

  const saveForLater = async (item: (typeof items)[number]) => {
    if (!isInWishlist(item.productId)) {
      // The wishlist only needs these fields to render the saved product
      await toggleWishlist({
        _id: item.productId,
        name: item.name,
        slug: item.slug,
        price: item.mrp ?? item.price,
        discountedPrice: item.mrp && item.mrp !== item.price ? item.price : null,
        images: item.image ? [item.image] : [],
        unit: item.unit ?? "",
      } as Product);
    }
    await removeFromCart(item.productId);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#faf9f7]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl" style={{ color: INK }}>
            Your Cart
          </h1>
          <span className="text-sm text-stone-500">
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-8 items-start">
          {/* Items */}
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const unavailable = item.available === false;
                return (
                  <motion.li
                    key={item.productId}
                    layout
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="bg-white rounded-2xl border p-4 sm:p-5 flex gap-4"
                    style={{ borderColor: LINE }}
                  >
                    <Link
                      to={`/product/${item.slug}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#f7f3ec] flex-shrink-0 flex items-center justify-center"
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <FiShoppingBag className="text-stone-300" size={28} />
                      )}
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.slug}`}
                            className="font-semibold text-[15px] leading-snug line-clamp-2 hover:underline"
                            style={{ color: INK }}
                          >
                            {item.name.split("|")[0].trim()}
                          </Link>
                          {item.unit && <p className="text-xs text-stone-400 mt-0.5">{item.unit}</p>}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold" style={{ color: INK }}>₹{item.price * item.quantity}</p>
                          {item.mrp && item.mrp > item.price && (
                            <p className="text-xs text-stone-400 line-through">₹{item.mrp * item.quantity}</p>
                          )}
                        </div>
                      </div>

                      {unavailable && (
                        <p className="text-xs font-semibold text-[#b4281d] mt-2">
                          {item.stock && item.stock > 0 ? `Only ${item.stock} left — lower the quantity` : "Out of stock"}
                        </p>
                      )}

                      <div className="mt-auto pt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <QuantityStepper
                          size="sm"
                          value={item.quantity}
                          max={item.stock}
                          onChange={(q) => updateQuantity(item.productId, q)}
                        />
                        <button
                          onClick={() => saveForLater(item)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
                        >
                          <FiHeart size={13} /> Save for later
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#b4281d]"
                        >
                          <FiTrash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          {/* Summary */}
          <aside className="bg-white rounded-2xl border p-5 sm:p-6 lg:sticky lg:top-28" style={{ borderColor: LINE }}>
            <h2 className="font-semibold text-[17px] mb-4" style={{ color: INK }}>
              Order summary
            </h2>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between text-stone-500">
                <dt>Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})</dt>
                <dd>₹{mrpTotal}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-[#3d6b1a]">
                  <dt>Discount</dt>
                  <dd>−₹{savings}</dd>
                </div>
              )}
              <div className="flex justify-between text-stone-500">
                <dt>Shipping</dt>
                <dd className="font-semibold text-[#3d6b1a]">Free</dd>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t" style={{ borderColor: LINE }}>
                <dt className="font-semibold" style={{ color: INK }}>Total</dt>
                <dd className="text-xl font-bold" style={{ color: INK }}>₹{subtotal}</dd>
              </div>
            </dl>

            {savings > 0 && (
              <p className="mt-3 text-xs font-semibold text-center py-2 rounded-lg" style={{ background: "rgba(107,142,35,0.08)", color: "#3d6b1a" }}>
                You save ₹{savings} on this order
              </p>
            )}

            <button
              onClick={() => navigate("/checkout")}
              disabled={hasUnavailable}
              className="mt-5 w-full py-4 rounded-xl font-semibold text-[15px] text-white flex items-center justify-center gap-2 disabled:opacity-55"
              style={{ background: "#2D4A1E", boxShadow: "0 10px 26px rgba(45,74,30,0.25)" }}
            >
              Proceed to Checkout <FiArrowRight size={16} />
            </button>
            {hasUnavailable && (
              <p className="text-xs text-center mt-2 text-[#a3311f]">Update the items marked above to continue.</p>
            )}

            <div className="mt-5 pt-5 border-t space-y-2.5 text-xs text-stone-500" style={{ borderColor: LINE }}>
              <p className="flex items-center gap-2"><FiTruck size={14} className="text-[#6B8E23]" /> Free delivery across India</p>
              <p className="flex items-center gap-2"><FiLock size={14} className="text-[#6B8E23]" /> Secure payment · Cash on delivery available</p>
            </div>

            <Link to="/products" className="block text-center text-sm font-semibold mt-5 text-[#2D4A1E]">
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
