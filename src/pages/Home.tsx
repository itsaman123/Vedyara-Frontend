import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroBanner from "../assets/hero-banner.png";
import HeroVideo from "../assets/hero-vid.mp4";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import {
  FiArrowRight,
  FiShoppingBag,
  FiPackage,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaStar, FaQuoteLeft, FaLeaf } from "react-icons/fa";
import { useProducts, type Product as ApiProduct } from "../api/productApi";
import {
  testimonials,
  whyChooseUs,
  stats,
} from "../data/products";
import TrustBanner from "../components/TrustBanner";
import FarmToHome from "../components/FarmToHome";
import ProductComparison from "../components/ProductComparison";
import ComboPacks from "../components/ComboPacks";
import EducationalSection from "../components/EducationalSection";
import ProductCard from "../components/ProductCard";
import HoneyVideoCarousel from "../components/HoneyVideoCarousel";
import ProductSpotlight from "../components/ProductSpotlight";
import Manifesto from "../components/Manifesto";
import RotatingSeal from "../components/RotatingSeal";
import { fadeUp, staggerContainer } from "../utils/animations";
import { ProductCardSkeleton } from "../components/Skeletons";
import { useSEO } from "../utils/seo";


/* ─────────────────────────────────────────────────────────────
   OUR PROMISE — static data (6 items, HoneyVeda-style)
───────────────────────────────────────────────────────────── */
const ourPromises = [
  { icon: "🚫", title: "No Heating",        desc: "Cold-extracted — raw enzymes fully intact" },
  { icon: "🐝", title: "Bee-Friendly",      desc: "Ethical, sustainable beekeeping practices" },
  { icon: "🌿", title: "Zero Additives",    desc: "Pure honey, nothing added or removed" },
  { icon: "🔬", title: "Lab Tested",        desc: "NABL-certified purity check every batch" },
  { icon: "🌾", title: "Forest Sourced",    desc: "Directly from pristine Indian forests" },
  { icon: "♻️", title: "Eco Packaging",     desc: "Minimal footprint, sustainable materials" },
];

/* ═══════════════════════════════════════════════════════════
   STATS COUNTER
═══════════════════════════════════════════════════════════ */
const StatCounter = ({ value, label, index, isDark = false }: { value: string; label: string; index: number; isDark?: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="text-center relative group">
      {/* Pulsing hex ring behind number */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none"
        style={{
          width: 80, height: 80,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: isDark
            ? "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 80%)"
            : "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 80%)",
          opacity: isInView ? 1 : 0,
          transition: `opacity 0.6s ease ${index * 0.1 + 0.3}s`,
        }}
      />
      <div
        className="text-4xl md:text-5xl font-bold mb-2 relative z-10"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #c8a227, #e8c84a)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          opacity: isInView ? 1 : 0,
          transform: isInView ? "none" : "translateY(20px)",
          transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
        }}
      >
        {value}
      </div>
      <p
        className="text-sm font-medium uppercase tracking-wider"
        style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(62,47,28,0.5)" }}
      >
        {label}
      </p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   TESTIMONIAL CARD
═══════════════════════════════════════════════════════════ */
const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    className="bg-white rounded-3xl p-6 shadow-lg shadow-black/5 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-2"
  >
    {/* Stars + quote icon row */}
    <div className="flex items-center justify-between">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} size={14} style={{ color: i < testimonial.rating ? "#D4AF37" : "#e5e7eb" }} />
        ))}
      </div>
      <FaQuoteLeft size={16} style={{ color: "rgba(212,175,55,0.35)" }} />
    </div>

    {/* Review text */}
    <p className="text-gray-600 text-sm leading-relaxed italic flex-1">
      "{testimonial.review}"
    </p>

    {/* Divider */}
    <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)" }} />

    {/* Author row */}
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #D4AF37, #e8c84a)", color: "#3E2F1C" }}
      >
        {testimonial.avatar}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm text-brand-brown truncate">{testimonial.name}</p>
        <p className="text-xs text-gray-400 truncate">{testimonial.location} · {testimonial.date}</p>
      </div>
    </div>

    {/* Product tag — separate row, no overlap */}
    <span
      className="self-start px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{ background: "rgba(107,142,35,0.1)", color: "#506a1a" }}
    >
      {testimonial.product}
    </span>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   TESTIMONIALS CAROUSEL
═══════════════════════════════════════════════════════════ */
function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const perPage = 3;
  const total = testimonials.length;
  const maxIndex = Math.max(0, total - perPage);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  const visible = testimonials.slice(current, current + perPage);

  return (
    <section className="relative py-24 bg-[#faf9f7] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <motion.span variants={fadeUp} custom={0} className="inline-block text-sm font-semibold text-amber-600 uppercase tracking-widest mb-3">
              Our Community
            </motion.span>
            <motion.h2 variants={fadeUp} custom={0.1} className="font-serif font-bold text-brand-brown" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Loved by 1,000+ Families
            </motion.h2>
            <motion.p variants={fadeUp} custom={0.2} className="mt-2 text-sm" style={{ color: "rgba(62,47,28,0.55)" }}>
              from verified reviews on Meesho & Amazon India
            </motion.p>
          </div>
          {/* Nav arrows */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-200 disabled:opacity-30"
              style={{ borderColor: "rgba(62,47,28,0.2)", color: "#0f0a05" }}
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              disabled={current >= maxIndex}
              className="w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-200 disabled:opacity-30 hover:bg-[#2D4A1E] hover:text-white hover:border-[#2D4A1E]"
              style={{ borderColor: "rgba(62,47,28,0.2)", color: "#0f0a05" }}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Carousel track */}
        <div className="overflow-hidden">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visible.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-200"
              style={{
                width: current === i ? "24px" : "8px",
                height: "8px",
                background: current === i ? "#2D4A1E" : "rgba(62,47,28,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════ */
/* Hero headline word that cycles through the range */
const HERO_WORDS = ["Honey", "Turmeric", "Coriander"];

function RotatingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    // Keep it still for prerender/automation so the snapshot reads "Honey"
    if (navigator.webdriver) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % HERO_WORDS.length), 2800);
    return () => window.clearInterval(t);
  }, []);

  return (
    <span className="relative inline-flex overflow-hidden align-bottom" style={{ paddingBottom: "0.08em" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={HERO_WORDS[idx]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block italic"
          style={{
            background: "linear-gradient(120deg, #F3D57A, #D4AF37 55%, #E8C84A)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {HERO_WORDS[idx]},
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Home() {
  const navigate = useNavigate();

  useSEO({
    title: "Vedyara | Buy Multi Flora Honey Online — Pure Natural Honey & Spices India",
    description: "Buy Vedyara Multi Flora Honey online — pure, raw multiflora honey from pristine forests. Also find natural turmeric & coriander powder. 100% natural, lab-tested. Available on Meesho & Amazon.",
    keywords: "vedyara multi flora honey, multi flora honey, vedyara multiflora honey, vedyara multi-flora honey, vedyara honey, buy honey online india, pure natural honey, raw multiflora honey",
    canonical: "https://vedyara.in/",
  });

  const { data, isLoading } = useProducts({ limit: 3 });

  const featuredProducts = useMemo(() => data?.items ?? [], [data]);

  const dripRef = useRef(null);
  const dripInView = useInView(dripRef, { once: false, amount: 0.5 });

  const handleView = (product: ApiProduct) => navigate(`/product/${product.slug}`);


  return (
    <main className="relative overflow-x-hidden bg-[#faf9f7]">

      {/* ════════════════════════════════════════════════════
          1. HERO SECTION — Full-bleed video
      ════════════════════════════════════════════════════ */}
      <section id="home-hero" className="relative overflow-hidden h-[88vh] md:h-screen min-h-[560px] bg-[#0f0a05]">
        <video
          src={HeroVideo}
          poster={HeroBanner}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Overlay — darkens bottom-left so text stays legible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(15,10,5,0.75) 0%, rgba(15,10,5,0.3) 45%, rgba(15,10,5,0.15) 100%)",
          }}
        />

        <div className="relative z-10 h-full flex items-end">
          <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pb-16 md:pb-24">
            <div className="max-w-[640px]">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-block mb-4 text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: "#e8c84a" }}
              >
                Rooted in Ancient Wisdom
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif font-bold text-white mb-8"
                style={{ fontSize: "clamp(2.6rem, 6vw, 5.2rem)", lineHeight: 1.05 }}
              >
                <span className="sr-only">Pure Honey, From Nature.</span>
                <span aria-hidden="true">
                  Pure <RotatingWord />
                  <br />
                  From Nature.
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                className="flex flex-nowrap items-center gap-5 sm:gap-6"
              >
                {/* Primary — cream pill, honey fill sweeps in on hover */}
                <Link
                  to="/products"
                  className="group relative inline-flex flex-shrink-0 items-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-medium uppercase"
                  style={{
                    background: "#FBF6EC",
                    color: "#1a1208",
                    padding: "10px 20px",
                    fontSize: "0.68rem",
                    letterSpacing: "0.16em",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"
                    style={{ background: "linear-gradient(120deg, #D4AF37, #e8c84a)" }}
                  />
                  <span className="relative sm:hidden">Shop Now</span>
                  <span className="relative hidden sm:inline">Shop the Collection</span>
                  <FiArrowRight
                    size={13}
                    className="relative transition-transform duration-500 group-hover:translate-x-1"
                  />
                </Link>

                {/* Secondary — quiet text link */}
                <Link
                  to="/about"
                  className="group relative flex-shrink-0 whitespace-nowrap text-white/85 hover:text-white uppercase transition-colors duration-300"
                  style={{ fontSize: "0.68rem", letterSpacing: "0.16em", paddingBottom: 3 }}
                >
                  Our Story
                  <span
                    aria-hidden="true"
                    className="absolute left-0 bottom-0 h-px w-full origin-left scale-x-50 bg-white/70 transition-transform duration-500 group-hover:scale-x-100"
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating featured-product card (desktop) */}
        {featuredProducts[0] && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block absolute right-10 xl:right-16 bottom-20 z-10"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute -top-12 -left-12 z-10">
                <RotatingSeal size={96} center="🐝" text="FROM THE HIVE · TO YOUR HOME · " />
              </div>
              <Link
                to={`/product/${featuredProducts[0].slug}`}
                className="group flex items-center gap-4 w-[320px] p-3 pr-4 rounded-3xl"
                style={{
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(16px) saturate(140%)",
                  WebkitBackdropFilter: "blur(16px) saturate(140%)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
                }}
              >
                <div className="w-20 h-20 rounded-2xl bg-white/90 p-1.5 flex-shrink-0 overflow-hidden">
                  <img
                    src={featuredProducts[0].images[0]}
                    alt=""
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#F3D57A" }}>
                    Bestseller
                  </p>
                  <p className="text-sm font-semibold text-white leading-snug line-clamp-2 mt-0.5">
                    {featuredProducts[0].name.split("|")[0].trim()}
                  </p>
                  <p className="text-sm text-white/80 mt-1">
                    ₹{featuredProducts[0].discountedPrice ?? featuredProducts[0].price}
                    {featuredProducts[0].discountedPrice !== null && (
                      <span className="ml-2 text-xs line-through text-white/50">₹{featuredProducts[0].price}</span>
                    )}
                  </p>
                </div>
                <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "#1a1208" }}>
                  <FiArrowRight size={16} />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* Scroll cue */}
        <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 pointer-events-none">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">Scroll</span>
          <span className="w-[22px] h-[34px] rounded-full border border-white/50 flex justify-center pt-1.5">
            <motion.span
              className="w-1 h-1.5 rounded-full bg-[#F3D57A]"
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          2. TRUST BANNER
      ════════════════════════════════════════════════════ */}
      <TrustBanner />

      {/* ════════════════════════════════════════════════════
          OUR PROMISE — 6-icon section
      ════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#6B8E23", letterSpacing: "0.22em" }}
            >
              Our Commitment
            </span>
            <h2
              className="font-serif font-bold"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#0f0a05" }}
            >
              The Vedyara Standard
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
            {ourPromises.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div
                  className="w-16 h-16 flex items-center justify-center text-2xl"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    background: "linear-gradient(145deg, rgba(212,175,55,0.13), rgba(212,175,55,0.04))",
                    border: "1.5px solid rgba(212,175,55,0.2)",
                  }}
                >
                  {p.icon}
                </div>
                <div>
                  <p className="text-sm font-bold mb-0.5" style={{ color: "#1a0f05" }}>{p.title}</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: "rgba(62,47,28,0.48)" }}>{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          3. STATS SECTION — dark honeycomb theme
      ════════════════════════════════════════════════════ */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a0d04 0%, #0f0a05 60%, #130c04 100%)" }}
      >
        {/* CSS honeycomb grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0 34L0 84V66l28 16 28-16v18L28 100z' fill='none' stroke='%23D4AF37' stroke-width='0.6'/%3E%3C/svg%3E")`,
            backgroundSize: "56px 100px",
            opacity: 0.06,
          }}
        />

        {/* Radial amber glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "90vw", height: "90vw",
            background: "radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Gold line top */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.5), rgba(107,142,35,0.3), rgba(212,175,55,0.5), transparent)" }}
        />
        {/* Gold line bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)" }}
        />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#D4AF37", letterSpacing: "0.22em" }}
            >
              Our Impact
            </span>
            <h2
              className="font-serif font-bold text-white"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
            >
              Numbers That Matter
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <StatCounter key={stat.id} value={stat.value} label={stat.label} index={i} isDark />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          3. ALL PRODUCTS
      ════════════════════════════════════════════════════ */}
      <section className="relative py-20 bg-[#faf9f7] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.span variants={fadeUp} custom={0} className="inline-block text-sm font-semibold text-amber-600 uppercase tracking-widest mb-4">
              Our Collection
            </motion.span>
            <motion.h2 variants={fadeUp} custom={0.1} className="font-serif font-bold text-brand-brown mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Shop Our Products
            </motion.h2>
            <motion.p variants={fadeUp} custom={0.2} className="max-w-2xl mx-auto text-gray-500">
              Pure Vedyara Multi Flora Honey, stone-ground turmeric, and aromatic coriander — each product tells a story of purity.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? [...Array(3)].map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredProducts.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} onView={handleView} />
                ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mt-14"
          >
            <Link to="/products">
              <button
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-sm text-white transition-all duration-150 hover:-translate-y-0.5 active:scale-95"
                style={{ background: "#2D4A1E" }}
              >
                <FiShoppingBag size={16} />
                View All Products
                <FiArrowRight size={16} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          COMBO PACKS
      ════════════════════════════════════════════════════ */}
      <ComboPacks />

      {/* ════════════════════════════════════════════════════
          4. PRODUCT SPOTLIGHT — interactive
      ════════════════════════════════════════════════════ */}
      <ProductSpotlight />

      {/* ════════════════════════════════════════════════════
          PRODUCT COMPARISON
      ════════════════════════════════════════════════════ */}
      <ProductComparison />

      {/* ════════════════════════════════════════════════════
          MANIFESTO — words light up on scroll
      ════════════════════════════════════════════════════ */}
      <Manifesto />

      {/* ════════════════════════════════════════════════════
          5. OUR STORY
      ════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden" style={{ background: "#F4EDE0" }}>
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                <img
                  src="/farm-image.webp"
                  alt="Our Farm"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-6 left-6 right-6 px-5 py-4 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}
                >
                  <p className="font-serif font-bold text-lg mb-0.5" style={{ color: "#0f0a05" }}>Est. 2020</p>
                  <p className="text-sm" style={{ color: "rgba(15,10,5,0.55)" }}>From the heart of India's farms</p>
                </div>
              </div>

              <div
                className="absolute -top-5 -right-5 px-5 py-4 rounded-2xl shadow-xl"
                style={{ background: "#2D4A1E" }}
              >
                <p className="text-2xl font-bold text-white">1000+</p>
                <p className="text-xs text-green-200 mt-0.5">Happy Families</p>
              </div>
            </motion.div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="order-1 lg:order-2"
            >
              <span
                className="inline-block text-xs font-semibold uppercase mb-4"
                style={{ color: "#2D4A1E", letterSpacing: "0.22em" }}
              >
                Our Story
              </span>

              <h2
                className="font-serif font-bold mb-6 leading-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#0f0a05" }}
              >
                From Ancient Wisdom
                <br />
                <span style={{ color: "#2D4A1E" }}>to Your Table.</span>
              </h2>

              <div className="space-y-4 mb-8">
                <p className="leading-relaxed" style={{ color: "rgba(15,10,5,0.65)", fontSize: "0.95rem" }}>
                  Vedyara was born from a simple belief — that the purest food is grown with care, harvested with respect, and delivered without compromise. Rooted in the ancient traditions of Ayurvedic wisdom, we bridge the gap between India's farms and modern kitchens.
                </p>
                <p className="leading-relaxed" style={{ color: "rgba(15,10,5,0.65)", fontSize: "0.95rem" }}>
                  Every jar of our golden honey, every packet of stone-ground turmeric, and every pouch of aromatic coriander carries the story of the farmers who tend the land with generations of inherited knowledge — and our promise to bring that purity to you, unchanged.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Farm-Direct Sourcing", icon: "🌾" },
                  { label: "Zero Preservatives", icon: "✓" },
                  { label: "FSSAI Certified", icon: "🏆" },
                  { label: "Lab Tested Purity", icon: "🔬" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-semibold" style={{ color: "#0f0a05" }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <Link to="/about">
                <button
                  className="flex items-center gap-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
                  style={{ background: "#2D4A1E", padding: "14px 28px" }}
                >
                  Read Our Full Story
                  <FiArrowRight size={15} />
                </button>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FARM TO HOME JOURNEY
      ════════════════════════════════════════════════════ */}
      <FarmToHome />

      {/* ════════════════════════════════════════════════════
          6. WHY CHOOSE US
      ════════════════════════════════════════════════════ */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a2e10 0%, #2D4A1E 50%, #1a2e10 100%)" }}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} custom={0} className="inline-block text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#D4AF37", letterSpacing: "0.22em" }}>
              Our Promise
            </motion.span>
            <motion.h2 variants={fadeUp} custom={0.1} className="font-serif font-bold text-white mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Why Choose <span style={{ color: "#D4AF37" }}>Vedyara</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={0.2} className="max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem" }}>
              No shortcuts. No compromise. Every product upholds our four core pillars of purity.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                className="relative p-8 rounded-3xl text-center group transition-transform duration-300 hover:-translate-y-2"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
              >
                <div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: "rgba(212,175,55,0.12)",
                    border: "1px solid rgba(212,175,55,0.25)",
                  }}
                >
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-white mb-3">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{feature.description}</p>

                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
                  style={{ background: "linear-gradient(to right, #D4AF37, #6B8E23)" }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "50%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          VIDEO CAROUSEL — Honey use-cases (9:16 portrait)
      ════════════════════════════════════════════════════ */}
      <HoneyVideoCarousel />

      {/* ════════════════════════════════════════════════════
          EDUCATIONAL SECTION
      ════════════════════════════════════════════════════ */}
      <EducationalSection />

      {/* ════════════════════════════════════════════════════
          7. TESTIMONIALS CAROUSEL
      ════════════════════════════════════════════════════ */}
      <TestimonialsCarousel />

      {/* ════════════════════════════════════════════════════
          8. CTA SECTION
      ════════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden" style={{ background: "linear-gradient(160deg, #1a0d04 0%, #0f0a05 60%, #130c04 100%)" }}>
        {/* CSS honeycomb overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0 34L0 84V66l28 16 28-16v18L28 100z' fill='none' stroke='%23D4AF37' stroke-width='0.6'/%3E%3C/svg%3E")`,
            backgroundSize: "56px 100px",
            opacity: 0.06,
          }}
        />
        {/* Radial gold glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "80vw", height: "80vw",
            background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        {/* Top gold border */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)" }}
        />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Hex badge */}
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 mb-7">
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  background: "linear-gradient(135deg, #D4AF37, #e8c84a)",
                }}
              >
                <span style={{ fontSize: 14 }}>🌿</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#D4AF37" }}>
                Start Your Journey
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={0.1}
              className="font-serif font-bold mb-5 leading-tight"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", color: "#fff" }}
            >
              Tradition. Purity.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #e8c84a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Wellness.
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="text-base mb-10 max-w-xl mx-auto"
              style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}
            >
              Join 1000+ families who have made the switch to purer, healthier living with Vedyara.
            </motion.p>

            {/* Drip accent — only animates while actually on screen */}
            <motion.div
              ref={dripRef}
              variants={fadeUp}
              custom={0.25}
              className="flex justify-center gap-2 mb-8"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full"
                  style={{ background: "linear-gradient(to bottom, #D4AF37, rgba(212,175,55,0))" }}
                  animate={dripInView ? { height: [10, 24, 10] } : { height: 10 }}
                  transition={dripInView ? { repeat: Infinity, duration: 1.5, delay: i * 0.28, ease: "easeInOut" } : { duration: 0.2 }}
                />
              ))}
            </motion.div>

            <motion.div variants={fadeUp} custom={0.3} className="flex flex-wrap justify-center gap-4">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-3 rounded-xl font-bold text-sm"
                  style={{
                    background: "linear-gradient(135deg, #2D4A1E, #1a3010)",
                    color: "#fff",
                    padding: "15px 34px",
                    boxShadow: "0 12px 36px rgba(45,74,30,0.5)",
                  }}
                >
                  <FiShoppingBag size={16} />
                  Explore Products
                  <FiArrowRight size={16} />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.4} className="mt-14 flex flex-wrap justify-center gap-8">
              {[
                { icon: "🛡️", text: "FSSAI Certified" },
                { icon: <FaLeaf size={13} />, text: "100% Natural" },
                { icon: <FiShield size={13} />, text: "No Additives" },
                { icon: <FiPackage size={13} />, text: "Pan-India Delivery" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  <span style={{ color: "#D4AF37" }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          9. MOBILE STICKY CTA
      ════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm px-4 py-3 md:hidden border-t border-gray-100">
        <Link
          to="/products"
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-bold text-sm text-white shadow-lg"
          style={{ background: "#2D4A1E" }}
        >
          <FiShoppingBag size={18} />
          Shop Now
        </Link>
      </div>

    </main>
  );
}
