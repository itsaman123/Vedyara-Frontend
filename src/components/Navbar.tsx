import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiSearch,
  FiChevronDown,
  FiArrowRight,
  FiPackage,
  FiTruck,
  FiRefreshCw,
  FiPhone,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import LogoBrand from "./LogoBrand";
import HoneyImg from "../assets/image-1.jpg";
import HaldiImg from "../assets/haldi.jpeg";
import DhaniyaImg from "../assets/dhaniya.jpeg";

/* ─────────────────────────────────────────────────────────────
   CONFIG
   Header height budget: 32px strip + 60px bar = 92px, which fits
   inside the pt-24 (96px) top padding pages already use.
───────────────────────────────────────────────────────────── */
const STRIP_H = 32;
const BAR_H = 60;

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop", mega: true },
  { to: "/about", label: "About Us" },
  { to: "/bulk-order", label: "Bulk Order" },
  { to: "/contact", label: "Contact" },
];

const shopCategories = [
  { to: "/products?category=honey",    label: "Pure Honey",       desc: "Raw multiflora honey",       img: HoneyImg },
  { to: "/products?search=turmeric",   label: "Turmeric Powder",  desc: "Stone-ground, high curcumin", img: HaldiImg },
  { to: "/products?search=coriander",  label: "Coriander Powder", desc: "Fresh, aromatic & pure",     img: DhaniyaImg },
];

const helpLinks = [
  { to: "/track-order",           label: "Track Order",            icon: FiTruck },
  { to: "/bulk-order",            label: "Bulk & Wholesale",       icon: FiPackage },
  { to: "/returns-cancellations", label: "Returns & Cancellations", icon: FiRefreshCw },
];

const announcements = [
  "100% natural · Lab tested · FSSAI approved",
  "Raw honey & stone-ground spices, straight from Indian farms",
  "Bulk & wholesale orders now open for businesses",
];

const popularSearches = ["Honey", "Turmeric", "Coriander"];

/* ─────────────────────────────────────────────────────────────
   ICON BUTTON
───────────────────────────────────────────────────────────── */
function IconButton({
  label,
  onClick,
  children,
  badge,
  badgeColor = "#2D4A1E",
  ink,
  hoverBg,
  className = "",
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  badge?: number;
  badgeColor?: string;
  ink: string;
  hoverBg: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={badge ? `${label}, ${badge} items` : label}
      className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-colors ${className}`}
      style={{ color: ink }}
    >
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: hoverBg }}
      />
      <span className="relative">{children}</span>
      {!!badge && badge > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0.5 min-w-[17px] h-[17px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
          style={{ background: badgeColor, boxShadow: "0 0 0 2px #fff" }}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════ */
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);
  const megaTimer = useRef<number | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  /* Scroll state */
  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setIsScrolled(window.scrollY > 40);
        // Glass navbar while it still sits over the home video hero
        const hero = document.getElementById("home-hero");
        setOverHero(!!hero && hero.getBoundingClientRect().bottom > 80);
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  /* Close menus on navigation — adjusting state during render on route change */
  const [lastLocation, setLastLocation] = useState(pathname + search);
  if (lastLocation !== pathname + search) {
    setLastLocation(pathname + search);
    setIsMobileOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
  }

  /* Rotating announcement */
  useEffect(() => {
    const t = window.setInterval(() => setMsgIdx((i) => (i + 1) % announcements.length), 4500);
    return () => window.clearInterval(t);
  }, []);

  /* Close mobile menu on desktop resize */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  /* Search: focus on open, Esc to close */
  useEffect(() => {
    if (!searchOpen) return;
    searchRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  function runSearch(term: string) {
    const q = term.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setQuery("");
  }

  function openMega() {
    if (megaTimer.current) window.clearTimeout(megaTimer.current);
    setMegaOpen(true);
  }
  function closeMegaSoon() {
    if (megaTimer.current) window.clearTimeout(megaTimer.current);
    megaTimer.current = window.setTimeout(() => setMegaOpen(false), 120);
  }

  const glass = pathname === "/" && overHero && !isMobileOpen && !megaOpen && !searchOpen;
  const ink = glass ? "#FFFFFF" : "#2a1f12";
  const muted = glass ? "rgba(255,255,255,0.8)" : "rgba(62,47,28,0.68)";
  const hoverBg = glass ? "rgba(255,255,255,0.14)" : "rgba(62,47,28,0.06)";
  const showStrip = !isScrolled;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        {/* ══════════ Utility strip ══════════ */}
        <div
          className="overflow-hidden transition-[height] duration-300 ease-out"
          style={{
            height: showStrip ? STRIP_H : 0,
            background: glass ? "rgba(15,26,10,0.55)" : "#1e3518",
          }}
        >
          <div className="h-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-6 text-[12px]">
            {/* Rotating message */}
            <div className="relative flex-1 lg:flex-none h-full overflow-hidden text-center lg:text-left min-w-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={msgIdx}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex items-center justify-center lg:justify-start gap-2 truncate"
                  style={{ color: "rgba(248,245,240,0.88)" }}
                >
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#D4AF37" }} />
                  <span className="truncate">{announcements[msgIdx]}</span>
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Help links (desktop) */}
            <div className="hidden lg:flex items-center gap-5 flex-shrink-0" style={{ color: "rgba(248,245,240,0.72)" }}>
              <Link to="/track-order" className="inline-flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
                <FiTruck size={13} /> Track Order
              </Link>
              <Link to="/returns-cancellations" className="hover:text-[#D4AF37] transition-colors">
                Returns
              </Link>
              <span className="w-px h-3" style={{ background: "rgba(248,245,240,0.2)" }} />
              <a href="tel:+919509628400" className="inline-flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
                <FiPhone size={12} /> +91 95096 28400
              </a>
              <a
                href="https://wa.me/919509628400"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
              >
                <FaWhatsapp size={13} /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ══════════ Main bar ══════════ */}
        <div
          className="relative transition-[background,box-shadow] duration-300"
          style={
            glass
              ? {
                  background: "linear-gradient(to bottom, rgba(15,10,5,0.32), rgba(15,10,5,0.08))",
                  backdropFilter: "blur(14px) saturate(140%)",
                  WebkitBackdropFilter: "blur(14px) saturate(140%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.12)",
                }
              : {
                  background: "rgba(255,255,255,0.97)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  boxShadow: isScrolled
                    ? "0 1px 0 rgba(62,47,28,0.06), 0 6px 24px rgba(62,47,28,0.07)"
                    : "0 1px 0 rgba(62,47,28,0.07)",
                }
          }
        >
          <div
            className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-[auto_1fr_auto] items-center gap-4"
            style={{ height: BAR_H }}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center" style={{ lineHeight: 0, height: BAR_H }} aria-label="Vedyara home">
              <LogoBrand variant={glass ? "light" : "dark"} height={78} />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center justify-center gap-1 h-full">
              {navLinks.map((link) =>
                link.mega ? (
                  <div
                    key={link.to}
                    className="relative h-full flex items-center"
                    onMouseEnter={openMega}
                    onMouseLeave={closeMegaSoon}
                  >
                    <NavLink
                      to={link.to}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-full text-[14px] transition-colors"
                      style={({ isActive }) => ({
                        color: isActive || megaOpen ? ink : muted,
                        fontWeight: isActive ? 600 : 500,
                        background: megaOpen ? hoverBg : "transparent",
                      })}
                      aria-expanded={megaOpen}
                      onFocus={openMega}
                    >
                      {link.label}
                      <FiChevronDown
                        size={14}
                        className="transition-transform duration-200"
                        style={{ transform: megaOpen ? "rotate(180deg)" : "none" }}
                      />
                    </NavLink>
                  </div>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className="relative px-3.5 py-2 rounded-full text-[14px] transition-colors hover:bg-[var(--hover)]"
                    style={({ isActive }) => ({
                      color: isActive ? ink : muted,
                      fontWeight: isActive ? 600 : 500,
                      ["--hover" as string]: hoverBg,
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-active-dot"
                            className="absolute left-1/2 -translate-x-1/2 bottom-0.5 w-1 h-1 rounded-full"
                            style={{ background: glass ? "#fff" : "#D4AF37" }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ),
              )}
            </nav>
            <span className="lg:hidden" />

            {/* Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <IconButton label="Search" onClick={() => setSearchOpen((o) => !o)} ink={ink} hoverBg={hoverBg}>
                {searchOpen ? <FiX size={19} /> : <FiSearch size={19} />}
              </IconButton>
              <IconButton label="My account" onClick={() => navigate("/profile")} ink={ink} hoverBg={hoverBg} className="hidden sm:flex">
                <FiUser size={19} />
              </IconButton>
              <IconButton
                label="Wishlist"
                onClick={() => navigate("/wishlist")}
                badge={wishlistCount}
                badgeColor="#c0392b"
                ink={ink}
                hoverBg={hoverBg}
                className="hidden sm:flex"
              >
                <FiHeart size={19} />
              </IconButton>
              <IconButton label="Cart" onClick={() => navigate("/cart")} badge={cartCount} ink={ink} hoverBg={hoverBg}>
                <FiShoppingBag size={19} />
              </IconButton>

              <Link
                to="/products"
                className="hidden lg:inline-flex items-center gap-2 ml-2 pl-4 pr-3 h-10 rounded-full text-[14px] font-semibold transition-all hover:-translate-y-0.5 hover:shadow-gold-md"
                style={{ background: "linear-gradient(135deg, #D4AF37, #e8c84a)", color: "#2a1f12" }}
              >
                Shop Now
                <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(42,31,18,0.12)" }}>
                  <FiArrowRight size={13} />
                </span>
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setIsMobileOpen((prev) => !prev)}
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                className="lg:hidden w-10 h-10 ml-1 flex items-center justify-center rounded-full"
                style={{ background: hoverBg, color: ink }}
              >
                {isMobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>

          {/* ══════════ Mega menu ══════════ */}
          <AnimatePresence>
            {megaOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                onMouseEnter={openMega}
                onMouseLeave={closeMegaSoon}
                className="hidden lg:block absolute left-0 right-0 top-full bg-white"
                style={{ boxShadow: "0 18px 40px rgba(62,47,28,0.12)", borderTop: "1px solid rgba(62,47,28,0.07)" }}
              >
                <div className="max-w-[1100px] mx-auto px-8 py-7 grid grid-cols-[1fr_1fr_1fr_260px] gap-5">
                  {shopCategories.map((c) => (
                    <Link key={c.label} to={c.to} className="group rounded-2xl overflow-hidden" style={{ background: "#F8F5F0" }}>
                      <div className="h-44 overflow-hidden flex items-center justify-center p-3">
                        <img
                          src={c.img}
                          alt=""
                          loading="lazy"
                          className="h-full w-auto max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "#2a1f12" }}>{c.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: "rgba(62,47,28,0.55)" }}>{c.desc}</p>
                        </div>
                        <FiArrowRight
                          size={15}
                          className="flex-shrink-0 transition-transform group-hover:translate-x-1"
                          style={{ color: "#6B8E23" }}
                        />
                      </div>
                    </Link>
                  ))}

                  <div className="flex flex-col gap-2">
                    <Link
                      to="/products"
                      className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold text-white"
                      style={{ background: "#2D4A1E" }}
                    >
                      View all products <FiArrowRight size={15} />
                    </Link>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mt-3 mb-1 px-1" style={{ color: "rgba(62,47,28,0.45)" }}>
                      Help & services
                    </p>
                    {helpLinks.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-[#F8F5F0]"
                        style={{ color: "#2a1f12" }}
                      >
                        <Icon size={16} style={{ color: "#6B8E23" }} /> {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════ Search panel ══════════ */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 right-0 top-full bg-white"
                style={{ boxShadow: "0 18px 40px rgba(62,47,28,0.12)", borderTop: "1px solid rgba(62,47,28,0.07)" }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    runSearch(query);
                  }}
                  className="max-w-2xl mx-auto px-5 py-5"
                >
                  <div
                    className="flex items-center gap-3 rounded-full px-5 h-12"
                    style={{ background: "#F8F5F0", border: "1px solid rgba(62,47,28,0.1)" }}
                  >
                    <FiSearch size={18} style={{ color: "rgba(62,47,28,0.45)" }} />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search honey, turmeric, coriander…"
                      className="flex-1 bg-transparent outline-none text-[15px]"
                      style={{ color: "#2a1f12" }}
                    />
                    <button type="submit" className="text-sm font-semibold" style={{ color: "#2D4A1E" }}>
                      Search
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3 px-1">
                    <span className="text-xs" style={{ color: "rgba(62,47,28,0.5)" }}>Popular:</span>
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => runSearch(term)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors hover:bg-[#ede8e0]"
                        style={{ background: "#F8F5F0", color: "#3E2F1C" }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Click-away layer for search / mega menu */}
      <AnimatePresence>
        {(searchOpen || megaOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30"
            style={{ background: "rgba(20,12,4,0.25)" }}
            onClick={() => {
              setSearchOpen(false);
              setMegaOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════
          MOBILE DRAWER
      ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(20,12,4,0.5)", backdropFilter: "blur(3px)" }}
              onClick={() => setIsMobileOpen(false)}
            />

            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 flex flex-col lg:hidden"
              style={{ width: "min(88vw, 360px)", background: "#FDFCFB", boxShadow: "-8px 0 40px rgba(62,47,28,0.2)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-16 border-b" style={{ borderColor: "rgba(62,47,28,0.08)" }}>
                <Link to="/" style={{ lineHeight: 0 }}>
                  <LogoBrand variant="dark" height={60} />
                </Link>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full"
                  style={{ background: "rgba(62,47,28,0.06)", color: "#2a1f12" }}
                  aria-label="Close menu"
                >
                  <FiX size={19} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                {/* Search */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    runSearch(query);
                  }}
                  className="flex items-center gap-2.5 rounded-full px-4 h-11 mb-5"
                  style={{ background: "#F3EFE8" }}
                >
                  <FiSearch size={17} style={{ color: "rgba(62,47,28,0.45)" }} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products"
                    className="flex-1 bg-transparent outline-none text-[15px]"
                    style={{ color: "#2a1f12" }}
                  />
                </form>

                {/* Main links */}
                <nav className="flex flex-col">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                    >
                      <NavLink
                        to={link.to}
                        end={link.to === "/"}
                        className="flex items-center justify-between py-3.5 border-b text-[16px]"
                        style={({ isActive }) => ({
                          borderColor: "rgba(62,47,28,0.07)",
                          color: isActive ? "#2D4A1E" : "#2a1f12",
                          fontWeight: isActive ? 600 : 500,
                        })}
                      >
                        {link.label}
                        <FiArrowRight size={16} style={{ color: "rgba(62,47,28,0.3)" }} />
                      </NavLink>
                    </motion.div>
                  ))}
                </nav>

                {/* Categories */}
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mt-6 mb-3" style={{ color: "rgba(62,47,28,0.45)" }}>
                  Shop by category
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {shopCategories.map((c) => (
                    <Link key={c.label} to={c.to} className="rounded-xl overflow-hidden" style={{ background: "#F3EFE8" }}>
                      <img src={c.img} alt="" loading="lazy" className="w-full aspect-[3/4] object-contain p-1.5 mix-blend-multiply" />
                      <p className="text-[11px] font-semibold text-center px-1 py-2 leading-tight" style={{ color: "#2a1f12" }}>
                        {c.label}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* Help */}
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mt-6 mb-2" style={{ color: "rgba(62,47,28,0.45)" }}>
                  Help & services
                </p>
                <div className="flex flex-col">
                  {helpLinks.map(({ to, label, icon: Icon }) => (
                    <Link key={to} to={to} className="flex items-center gap-3 py-2.5 text-[15px]" style={{ color: "#2a1f12" }}>
                      <Icon size={16} style={{ color: "#6B8E23" }} /> {label}
                    </Link>
                  ))}
                  <Link to="/profile" className="flex items-center gap-3 py-2.5 text-[15px]" style={{ color: "#2a1f12" }}>
                    <FiUser size={16} style={{ color: "#6B8E23" }} /> My Account
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pt-4 pb-6 border-t flex flex-col gap-3" style={{ borderColor: "rgba(62,47,28,0.08)" }}>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => navigate("/wishlist")}
                    className="flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold"
                    style={{ background: "rgba(62,47,28,0.06)", color: "#2a1f12" }}
                  >
                    <FiHeart size={16} /> Wishlist{wishlistCount ? ` (${wishlistCount})` : ""}
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    className="flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "#2D4A1E" }}
                  >
                    <FiShoppingBag size={16} /> Cart{cartCount ? ` (${cartCount})` : ""}
                  </button>
                </div>
                <a
                  href="https://wa.me/919509628400"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm font-medium"
                  style={{ color: "#1f9d52" }}
                >
                  <FaWhatsapp size={16} /> Chat with us on WhatsApp
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
