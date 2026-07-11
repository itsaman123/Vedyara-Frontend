import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";
import Honey from "../assets/image-1.jpg";
import Haldi from "../assets/haldi.jpeg";
import Dhaniya from "../assets/dhaniya.jpeg";

const combos = [
  {
    id: "immunity",
    name: "Immunity Combo",
    tagline: "Your daily wellness ritual",
    emoji: "🛡️",
    products: ["Vedyara Multi Flora Honey", "Turmeric Powder"],
    images: [Honey, Haldi],
    price: "₹549",
    original: "₹799",
    save: "₹250",
    badge: "Best Value",
    badgeColor: "#D4AF37",
    badgeBg: "linear-gradient(135deg,#D4AF37,#e8c84a)",
    accentBg: "linear-gradient(135deg,#fdf8ea,#f9f2d4)",
    borderColor: "rgba(212,175,55,0.25)",
    highlights: ["Boosts immunity", "Anti-inflammatory", "Natural energy"],
  },
  {
    id: "kitchen",
    name: "Kitchen Essentials",
    tagline: "Pure spices for everyday cooking",
    emoji: "🌿",
    products: ["Turmeric Powder", "Coriander Powder"],
    images: [Haldi, Dhaniya],
    price: "₹199",
    original: "₹289",
    save: "₹90",
    badge: "Popular",
    badgeColor: "#fff",
    badgeBg: "linear-gradient(135deg,#2D4A1E,#3d6b2a)",
    accentBg: "linear-gradient(135deg,#f0f5e8,#e6f0d4)",
    borderColor: "rgba(107,142,35,0.25)",
    highlights: ["Zero chemicals", "Stone-ground pure", "Aromatic & fresh"],
  },
  {
    id: "family",
    name: "Family Honey Pack",
    tagline: "Enough goodness for the whole family",
    emoji: "🍯",
    products: ["500g Honey", "1Kg Honey"],
    images: [Honey, Honey],
    price: "₹1,099",
    original: "₹1,399",
    save: "₹300",
    badge: "Most Savings",
    badgeColor: "#3E2F1C",
    badgeBg: "linear-gradient(135deg,#D4AF37,#c8992a)",
    accentBg: "linear-gradient(135deg,#fef8f0,#fdf0d9)",
    borderColor: "rgba(212,175,55,0.3)",
    highlights: ["Raw & unprocessed", "1.5Kg total honey", "Direct from farm"],
  },
];

export default function ComboPacks() {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "#2D4A1E", letterSpacing: "0.22em" }}
          >
            Bundle & Save
          </span>
          <h2
            className="font-serif font-bold"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#0f0a05" }}
          >
            Combo Packs
          </h2>
          <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "rgba(15,10,5,0.5)" }}>
            Handpicked combinations for everyday wellness — bundled for better value.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo, i) => (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="relative rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                background: combo.accentBg,
                border: `1.5px solid ${combo.borderColor}`,
              }}
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide"
                  style={{
                    background: combo.badgeBg,
                    color: combo.badgeColor,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  {combo.badge}
                </span>
              </div>

              {/* Product images */}
              <div className="relative h-[200px] flex items-center justify-center gap-2 px-8 pt-10">
                {combo.images.map((img, j) => (
                  <div
                    key={j}
                    className="relative"
                    style={{
                      width: "110px",
                      height: "140px",
                      transform: j === 0 ? "rotate(-4deg) translateY(8px)" : "rotate(3deg)",
                      zIndex: j === 0 ? 2 : 1,
                    }}
                  >
                    <img
                      src={img}
                      alt={combo.products[j]}
                      className="w-full h-full rounded-2xl"
                      style={{
                        objectFit: "cover",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="px-6 pt-6 pb-6 flex flex-col flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <span style={{ fontSize: "1.6rem" }}>{combo.emoji}</span>
                  <div>
                    <h3 className="font-serif font-bold text-lg leading-tight" style={{ color: "#0f0a05" }}>
                      {combo.name}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(15,10,5,0.5)" }}>
                      {combo.tagline}
                    </p>
                  </div>
                </div>

                {/* Products included */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {combo.products.map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style={{ background: "rgba(255,255,255,0.7)", color: "#0f0a05" }}
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Highlights */}
                <ul className="space-y-1.5 mb-5">
                  {combo.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-xs" style={{ color: "rgba(15,10,5,0.65)" }}>
                      <span style={{ color: "#2D4A1E", fontSize: "0.6rem", fontWeight: 800 }}>✓</span>
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif font-bold text-xl" style={{ color: "#0f0a05" }}>
                        {combo.price}
                      </span>
                      <span className="text-xs line-through" style={{ color: "rgba(15,10,5,0.35)" }}>
                        {combo.original}
                      </span>
                    </div>
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: "#2D4A1E" }}
                    >
                      Save {combo.save}
                    </span>
                  </div>

                  <Link to="/products">
                    <button
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:gap-3 active:scale-95"
                      style={{ background: "#2D4A1E", boxShadow: "0 4px 12px rgba(45,74,30,0.25)" }}
                    >
                      <FiShoppingBag size={13} />
                      Add Combo
                      <FiArrowRight size={12} />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
