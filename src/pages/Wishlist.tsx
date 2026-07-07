import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiTrash2, FiExternalLink, FiShoppingBag } from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import { WishlistCardSkeleton } from "../components/Skeletons";
import { AMAZON_STORE_URL } from "../config/environment";

const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist, isLoading } = useWishlist();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#faf9f7]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="h-10 w-48 bg-[#f0ede8] rounded-xl animate-pulse mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {[...Array(8)].map((_, i) => <WishlistCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center bg-[#faf9f7]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiHeart size={40} className="text-red-400" />
          </div>
          <h1 className="font-serif font-bold text-3xl text-brand-brown mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            You haven't saved any items yet. Start exploring and save your favorites!
          </p>
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full font-bold bg-amber-600 text-white shadow-lg"
            >
              Explore Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#faf9f7]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <h1 className="font-serif font-bold text-4xl text-brand-brown mb-10">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
              >
                {/* Remove button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                >
                  <FiTrash2 size={18} />
                </button>

                {/* Product Image */}
                <div 
                  className="h-56 flex items-center justify-center p-6 bg-gradient-to-br from-amber-50/30 to-orange-50/30 cursor-pointer"
                  onClick={() => navigate(`/product/${product.slug}`)}
                >
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-100/50 rounded-xl">
                      <FiShoppingBag className="text-amber-300 w-12 h-12" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif font-bold text-lg text-brand-brown mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-6">
                    <p className="font-bold text-xl text-brand-brown">₹{product.discountedPrice !== null ? product.discountedPrice : product.price}</p>
                    {product.discountedPrice !== null && (
                      <p className="text-sm text-gray-400 line-through">₹{product.price}</p>
                    )}
                  </div>

                  <div className="mt-auto space-y-3">
                    <motion.a
                      href={AMAZON_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2"
                      style={{ background: "#FF9900", color: "#1a1a1a" }}
                    >
                      <FiExternalLink size={16} />
                      Order on Amazon
                    </motion.a>
                    <button
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="w-full py-3 rounded-xl border border-gray-100 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
