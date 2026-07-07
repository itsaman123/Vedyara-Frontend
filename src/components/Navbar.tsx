import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiShoppingBag, FiHeart, FiUser, FiExternalLink } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import LogoBrand from "./LogoBrand";
import { AMAZON_STORE_URL } from "../config/environment";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [barDismissed, setBarDismissed] = useState(
    () => sessionStorage.getItem("dev-bar-dismissed") === "1"
  );
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setIsScrolled(window.scrollY > 60);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-400"
        style={
          isScrolled
            ? {
                background: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 1px 0 rgba(212,175,55,0.2), 0 4px 24px rgba(62,47,28,0.07)",
              }
            : {
                background: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "0 1px 0 rgba(212,175,55,0.18)",
              }
        }
      >
        {/* ── Dev phase announcement bar ── */}
        <AnimatePresence>
          {!barDismissed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden", background: "#3E2F1C" }}
            >
              <div className="flex items-center justify-center gap-2 px-4 py-2 text-center relative">
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f5efe6", letterSpacing: "0.02em" }}>
                  🚧 Website in <strong style={{ color: "#D4AF37" }}>Development Phase</strong> — Orders are currently accepted on <strong style={{ color: "#FF9900" }}>Amazon India</strong> only
                </span>
                <a
                  href={AMAZON_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-opacity hover:opacity-80 flex-shrink-0"
                  style={{ background: "#FF9900", color: "#1a1a1a" }}
                >
                  Order on Amazon <FiExternalLink size={10} />
                </a>
                <button
                  onClick={() => {
                    sessionStorage.setItem("dev-bar-dismissed", "1");
                    setBarDismissed(true);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "#f5efe6" }}
                  aria-label="Dismiss"
                >
                  <FiX size={12} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-5 sm:px-8 lg:px-12">
          <div
            className="flex items-center justify-between"
            style={{
              height: isScrolled ? "62px" : "68px",
              transition: "height 0.4s ease",
            }}
          >
            {/* ── LOGO ── */}
            <Link
              to="/"
              onClick={() => setIsMobileOpen(false)}
              className="flex-shrink-0 flex items-center"
              style={{ lineHeight: 0 }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <LogoBrand
                  variant="dark"
                  height={80}
                />
              </motion.div>
            </Link>

            {/* ── DESKTOP NAV ── */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `nav-link text-sm transition-colors duration-300 ${
                      isActive ? "active font-semibold" : "font-medium"
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? "#3E2F1C" : "rgba(62,47,28,0.6)",
                    ...(isActive
                      ? {
                          background: "rgba(212,175,55,0.14)",
                          padding: "4px 12px",
                          borderRadius: "999px",
                          border: "1px solid rgba(212,175,55,0.28)",
                        }
                      : {}),
                  })}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* ── DESKTOP CTA ── */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Wishlist, Cart, and Profile icons */}
              <div className="flex items-center gap-2 mr-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/profile")}
                  className="relative p-2 rounded-full transition-colors"
                  aria-label="My Profile"
                  style={{
                    background: "rgba(62,47,28,0.06)",
                    color: "#3E2F1C",
                  }}
                >
                  <FiUser size={20} aria-hidden="true" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/wishlist")}
                  className="relative p-2 rounded-full transition-colors"
                  aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
                  style={{
                    background: "rgba(62,47,28,0.06)",
                    color: "#3E2F1C",
                  }}
                >
                  <FiHeart size={20} aria-hidden="true" />
                  {wishlistCount > 0 && (
                    <span aria-hidden="true" className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/cart")}
                  className="relative p-2 rounded-full transition-colors"
                  aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
                  style={{
                    background: "rgba(62,47,28,0.06)",
                    color: "#3E2F1C",
                  }}
                >
                  <FiShoppingBag size={20} aria-hidden="true" />
                  {cartCount > 0 && (
                    <span aria-hidden="true" className="absolute top-0 right-0 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/products")}
                className="btn-gold flex items-center gap-2 text-sm"
                style={{ paddingTop: "10px", paddingBottom: "10px" }}
              >
                <FiShoppingBag size={15} strokeWidth={2.2} />
                <span>Shop Now</span>
              </motion.button>
            </div>

            {/* ── MOBILE HAMBURGER ── */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-300 focus:outline-none"
              style={{
                background: "rgba(62,47,28,0.07)",
                color: "#3E2F1C",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiX size={22} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMenu size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Gold underline accent on scroll */}
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(212,175,55,0.5), transparent)",
                transformOrigin: "center",
              }}
            />
          )}
        </AnimatePresence>
      </motion.header>

      {/* ════════════════════════════════════════════════════
          MOBILE DRAWER
      ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 lg:hidden"
              style={{
                background: "rgba(20,12,4,0.52)",
                backdropFilter: "blur(4px)",
              }}
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-40 flex flex-col lg:hidden"
              style={{
                width: "min(85vw, 320px)",
                background: "#F8F5F0",
                boxShadow: "-8px 0 40px rgba(62,47,28,0.2)",
              }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-6 py-5 border-b"
                style={{ borderColor: "rgba(62,47,28,0.1)" }}
              >
                <Link
                  to="/"
                  onClick={() => setIsMobileOpen(false)}
                  style={{ lineHeight: 0 }}
                >
                  <LogoBrand variant="dark" height={40} />
                </Link>

                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-brand-brown transition-colors hover:bg-brand-cream-dark focus:outline-none"
                  aria-label="Close menu"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.055, duration: 0.32 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-base transition-all duration-200 ${isActive
                          ? "bg-brand-gold text-brand-brown shadow-gold-sm"
                          : "text-brand-brown hover:bg-brand-cream-dark"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors"
                            style={{
                              background: isActive
                                ? "#3E2F1C"
                                : "rgba(212,175,55,0.5)",
                            }}
                          />
                          {link.label}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer footer CTA */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="px-4 pb-8 flex flex-col gap-3"
              >
                <div
                  className="divider-gold mb-1"
                  style={{ width: "100%", height: "1px" }}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { navigate("/wishlist"); setIsMobileOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold"
                    style={{ background: "rgba(62,47,28,0.08)", color: "#3E2F1C" }}
                  >
                    <FiHeart size={18} />
                    Wishlist ({wishlistCount})
                  </button>
                  <button
                    onClick={() => { navigate("/cart"); setIsMobileOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold bg-amber-600 text-white"
                  >
                    <FiShoppingBag size={18} />
                    Cart ({cartCount})
                  </button>
                </div>
                <p
                  className="text-center text-xs"
                  style={{ color: "rgba(62,47,28,0.42)" }}
                >
                  Fast delivery · Secure checkout · Easy returns
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
