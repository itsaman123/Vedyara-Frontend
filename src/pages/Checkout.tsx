import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiExternalLink, FiLock } from "react-icons/fi";
import { AMAZON_STORE_URL } from "../config/environment";

export default function Checkout() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center bg-[#faf9f7]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center max-w-lg w-full"
      >
        {/* Icon */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: "rgba(212,175,55,0.12)", border: "2px solid rgba(212,175,55,0.25)" }}
        >
          <FiLock size={36} style={{ color: "#D4AF37" }} />
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
          style={{ background: "rgba(62,47,28,0.07)", border: "1px solid rgba(62,47,28,0.12)" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#3E2F1C" }}>
            🚧 Development Phase
          </span>
        </div>

        <h1 className="font-serif font-bold text-3xl mb-4" style={{ color: "#1a0f05" }}>
          Checkout Not Yet Available
        </h1>
        <p className="text-base mb-3" style={{ color: "rgba(26,15,5,0.55)" }}>
          We're actively building our direct ordering system. While we finish up, you can order all Vedyara products on Amazon India with fast delivery.
        </p>
        <p className="text-sm mb-10" style={{ color: "rgba(26,15,5,0.4)" }}>
          Same quality, same trust — just on Amazon for now.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href={AMAZON_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base"
            style={{
              background: "#FF9900",
              color: "#1a1a1a",
              boxShadow: "0 8px 24px rgba(255,153,0,0.35)",
            }}
          >
            <FiExternalLink size={18} />
            Order on Amazon India
          </motion.a>

          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl font-semibold text-base transition-all"
              style={{
                background: "white",
                color: "#3E2F1C",
                border: "1px solid rgba(62,47,28,0.15)",
                boxShadow: "0 2px 12px rgba(62,47,28,0.07)",
              }}
            >
              Browse Products
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
