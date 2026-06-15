import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroBanner from "../assets/hero-banner.png";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FiArrowRight,
  FiShoppingBag,
  FiPackage,
  FiShield,
  FiDroplet,
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
import { fadeUp, staggerContainer } from "../utils/animations";
import { ProductCardSkeleton } from "../components/Skeletons";


/* ═══════════════════════════════════════════════════════════
   STATS COUNTER
═══════════════════════════════════════════════════════════ */
const StatCounter = ({ value, label, index }: { value: string; label: string; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-4xl md:text-5xl font-bold mb-2"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #6B8E23)",
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
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{label}</p>
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
              Customer Love
            </motion.span>
            <motion.h2 variants={fadeUp} custom={0.1} className="font-serif font-bold text-brand-brown" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              What Our Customers Say
            </motion.h2>
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
export default function Home() {
  const navigate = useNavigate();

  const { data, isLoading } = useProducts({ limit: 3 });

  const featuredProducts = useMemo(() => data?.items ?? [], [data]);

  const handleView = (product: ApiProduct) => navigate(`/product/${product.slug}`);
  const handleBuyNow = (product: ApiProduct) =>
    navigate("/checkout", { state: { isDirectBuy: true, product, quantity: 1 } });

  const heroFeatures = [
    {
      icon: <FaLeaf size={18} style={{ color: "#2D4A1E" }} />,
      title: "Pure & Natural",
      desc: "Made with 100% natural ingredients.",
    },
    {
      icon: <FaLeaf size={18} style={{ color: "#2D4A1E" }} />,
      title: "Rooted in Tradition",
      desc: "Inspired by ancient wisdom, crafted for today.",
    },
    {
      icon: <FiDroplet size={18} style={{ color: "#2D4A1E" }} />,
      title: "No Harmful Chemicals",
      desc: "Free from preservatives & synthetic additives.",
    },
    {
      icon: <FiPackage size={18} style={{ color: "#2D4A1E" }} />,
      title: "Sustainable & Ethical",
      desc: "Good for you, good for the Earth.",
    },
  ];

  const productBenefits = [
    {
      icon: "🍯",
      name: "Honey",
      tagline: "Liquid Gold",
      color: "from-amber-50 to-yellow-50",
      border: "border-amber-100",
      perks: ["Boosts Immunity", "Rich Antioxidants", "Natural Sweetener", "Aids Digestion"],
    },
    {
      icon: "✨",
      name: "Turmeric Powder",
      tagline: "Golden Spice",
      color: "from-orange-50 to-amber-50",
      border: "border-orange-100",
      perks: ["High Curcumin", "Anti-inflammatory", "Immunity Booster", "Daily Wellness"],
    },
    {
      icon: "🌿",
      name: "Coriander Powder",
      tagline: "Aromatic Purity",
      color: "from-green-50 to-emerald-50",
      border: "border-green-100",
      perks: ["Digestive Aid", "Rich Aroma", "Pure & Fresh", "Enhances Flavour"],
    },
  ];

  return (
    <main className="relative overflow-x-hidden bg-[#faf9f7]">

      {/* ════════════════════════════════════════════════════
          1. HERO SECTION
      ════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#F4EDE0", minHeight: "92vh" }}
      >
        {/* LCP image — real <img> so browser can prioritise it */}
        <img
          src={HeroBanner}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: 0, objectPosition: "60% center" }}
        />

        {/* Desktop gradient — left-to-right cream fade (md+) */}
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(to right, #F4EDE0 0%, #F4EDE0 22%, rgba(244,237,224,0.88) 36%, rgba(244,237,224,0.45) 52%, rgba(244,237,224,0.08) 68%, transparent 80%)",
            zIndex: 1,
          }}
        />

        {/* Mobile gradient — covers the full text column so products don't bleed through */}
        <div
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            background:
              "linear-gradient(to top, #F4EDE0 0%, #F4EDE0 65%, rgba(244,237,224,0.92) 78%, rgba(244,237,224,0.6) 88%, rgba(244,237,224,0.15) 95%, transparent 100%)",
            zIndex: 1,
          }}
        />

        <div className="relative flex items-end md:items-center min-h-[92vh]" style={{ zIndex: 2 }}>
          <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-24 pb-44 md:pb-36">
            <div className="max-w-[500px]">

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(45,74,30,0.22)",
                }}
              >
                <FaLeaf size={11} style={{ color: "#2D4A1E" }} />
                <span
                  className="font-semibold uppercase"
                  style={{ color: "#2D4A1E", fontSize: "0.62rem", letterSpacing: "0.2em" }}
                >
                  Rooted in Ancient Wisdom
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif font-bold mb-5"
                style={{ fontSize: "clamp(2.6rem, 5vw, 4.6rem)", lineHeight: 1.1 }}
              >
                <span style={{ color: "#0f0a05" }}>Pure Goodness</span>
                <br />
                <span style={{ color: "#2D4A1E" }}>From Nature.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55, ease: "easeOut" }}
                className="mb-10"
                style={{ color: "rgba(15,10,5,0.58)", fontSize: "0.975rem", lineHeight: 1.7 }}
              >
                Thoughtfully crafted products inspired by timeless
                traditions and the purity of nature. Honey, Turmeric & Coriander — unprocessed, lab-tested, and pure.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/products">
                  <button
                    className="flex items-center gap-2.5 rounded-xl font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
                    style={{ background: "#2D4A1E", padding: "14px 30px", fontSize: "0.875rem" }}
                  >
                    Shop Now
                    <FiArrowRight size={15} />
                  </button>
                </Link>
                <Link to="/products">
                  <button
                    className="rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
                    style={{
                      background: "#ffffff",
                      color: "#0f0a05",
                      border: "1.5px solid rgba(15,10,5,0.18)",
                      padding: "14px 30px",
                      fontSize: "0.875rem",
                    }}
                  >
                    Explore Products
                  </button>
                </Link>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 lg:px-14 xl:px-20" style={{ zIndex: 2 }}>
          <div
            className="rounded-t-3xl"
            style={{
              background: "#ffffff",
              boxShadow: "0 -4px 30px rgba(0,0,0,0.06)",
            }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-stone-100">
              {heroFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.07, duration: 0.4, ease: "easeOut" }}
                  className={`flex items-start gap-3 px-4 py-5 md:px-6 md:py-6 ${i >= 2 ? "hidden lg:flex" : ""}`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      border: "1.5px solid rgba(45,74,30,0.18)",
                      background: "rgba(45,74,30,0.04)",
                    }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: "#0f0a05" }}>{f.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(15,10,5,0.48)" }}>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          2. TRUST BANNER
      ════════════════════════════════════════════════════ */}
      <TrustBanner />

      {/* ════════════════════════════════════════════════════
          3. STATS SECTION
      ════════════════════════════════════════════════════ */}
      <section className="relative py-16 bg-white overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: "linear-gradient(to right, transparent, #D4AF37, #6B8E23, #D4AF37, transparent)" }}
        />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <StatCounter key={stat.id} value={stat.value} label={stat.label} index={i} />
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
              Pure Himalayan honey, stone-ground turmeric, and aromatic coriander — each product tells a story of purity.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? [...Array(3)].map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredProducts.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} onView={handleView} onBuyNow={handleBuyNow} />
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
          4. PRODUCT BENEFITS
      ════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.span variants={fadeUp} custom={0} className="inline-block text-sm font-semibold text-amber-600 uppercase tracking-widest mb-4">
              Nature's Best
            </motion.span>
            <motion.h2 variants={fadeUp} custom={0.1} className="font-serif font-bold text-brand-brown" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              The Power of Each Product
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productBenefits.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${item.color} border ${item.border} group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#2D4A1E" }}>
                  {item.tagline}
                </p>
                <h3 className="font-serif font-bold text-xl mb-5" style={{ color: "#0f0a05" }}>
                  {item.name}
                </h3>
                <ul className="space-y-2.5">
                  {item.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(15,10,5,0.65)" }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(45,74,30,0.12)" }}>
                        <span style={{ color: "#2D4A1E", fontSize: "0.6rem", fontWeight: 800 }}>✓</span>
                      </div>
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link to="/products">
                  <button
                    className="mt-6 flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
                    style={{ color: "#2D4A1E" }}
                  >
                    Shop {item.name}
                    <FiArrowRight size={14} />
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PRODUCT COMPARISON
      ════════════════════════════════════════════════════ */}
      <ProductComparison />

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
      <section className="relative py-24 overflow-hidden" style={{ background: "#F4EDE0" }}>
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeUp} custom={0} className="inline-block text-xs font-semibold uppercase mb-4" style={{ color: "#2D4A1E", letterSpacing: "0.22em" }}>
              Start Your Journey
            </motion.span>

            <motion.h2
              variants={fadeUp}
              custom={0.1}
              className="font-serif font-bold mb-6 leading-tight"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", color: "#0f0a05" }}
            >
              Tradition. Purity.
              <br />
              <span style={{ color: "#2D4A1E" }}>Wellness.</span>
            </motion.h2>

            <motion.p variants={fadeUp} custom={0.2} className="text-base mb-10 max-w-xl mx-auto" style={{ color: "rgba(15,10,5,0.55)", lineHeight: 1.7 }}>
              Join 1000+ families who have made the switch to purer, healthier living with Vedyara.
            </motion.p>

            <motion.div variants={fadeUp} custom={0.3} className="flex flex-wrap justify-center gap-4">
              <Link to="/products">
                <button
                  className="flex items-center gap-3 rounded-xl font-semibold text-sm text-white transition-all duration-150 hover:-translate-y-0.5 active:scale-95"
                  style={{ background: "#2D4A1E", padding: "14px 32px" }}
                >
                  <FiShoppingBag size={16} />
                  Explore Products
                  <FiArrowRight size={16} />
                </button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.4} className="mt-12 flex flex-wrap justify-center gap-8">
              {[
                { icon: "🛡️", text: "FSSAI Certified" },
                { icon: <FaLeaf size={14} />, text: "100% Natural" },
                { icon: <FiShield size={14} />, text: "Secure Checkout" },
                { icon: <FiPackage size={14} />, text: "Pan-India Delivery" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" style={{ color: "rgba(15,10,5,0.5)" }}>
                  <span style={{ color: "#2D4A1E" }}>{item.icon}</span>
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
