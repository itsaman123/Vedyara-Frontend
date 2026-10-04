import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import RotatingSeal from "./RotatingSeal";
import HoneyImg from "../assets/image-1.jpg";
import HaldiImg from "../assets/haldi.jpeg";
import DhaniyaImg from "../assets/dhaniya.jpeg";

const CYCLE_MS = 6000;

const items = [
  {
    key: "honey",
    name: "Multi Flora Honey",
    short: "Honey",
    eyebrow: "Liquid gold",
    line: "Nectar from countless wildflowers, left raw so every spoon tastes of where it came from.",
    perks: ["Natural sweetener", "Rich in antioxidants", "Boosts immunity", "Aids digestion"],
    uses: ["Warm water", "Tea", "Oats", "Toast"],
    img: HoneyImg,
    to: "/products?category=honey",
    accent: "#C9961A",
    tint: "linear-gradient(160deg, #FFF6DD 0%, #F8E7B9 100%)",
    seal: "RAW · UNPROCESSED · MULTIFLORA · ",
    emoji: "🍯",
  },
  {
    key: "turmeric",
    name: "Turmeric Powder",
    short: "Turmeric",
    eyebrow: "The golden spice",
    line: "Stone-ground slowly, so the colour stays deep and the aroma stays alive.",
    perks: ["High curcumin", "Deep natural colour", "Everyday immunity", "No added colour"],
    uses: ["Golden milk", "Dal", "Curries", "Marinades"],
    img: HaldiImg,
    to: "/products?search=turmeric",
    accent: "#D9822B",
    tint: "linear-gradient(160deg, #FFF0DF 0%, #F9D9B4 100%)",
    seal: "STONE GROUND · PURE HALDI · ",
    emoji: "✨",
  },
  {
    key: "coriander",
    name: "Coriander Powder",
    short: "Coriander",
    eyebrow: "Aromatic purity",
    line: "That warm, citrusy aroma you notice the moment you open the pack — nothing else mixed in.",
    perks: ["Fresh aroma", "Digestive aid", "No fillers", "Enhances flavour"],
    uses: ["Curries", "Chutneys", "Sabzi", "Spice rubs"],
    img: DhaniyaImg,
    to: "/products?search=coriander",
    accent: "#5E8A22",
    tint: "linear-gradient(160deg, #EEF5E2 0%, #D6E7BE 100%)",
    seal: "FRESH GROUND · PURE DHANIYA · ",
    emoji: "🌿",
  },
];

export default function ProductSpotlight() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Once someone taps or swipes (mostly on phones), stop auto-advancing so the
  // content doesn't change under them while they read.
  const [interacted, setInteracted] = useState(false);
  const item = items[active];

  const select = (i: number) => {
    setInteracted(true);
    setActive((i + items.length) % items.length);
  };

  useEffect(() => {
    if (paused || interacted) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % items.length), CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [active, paused, interacted]);

  return (
    <section
      className="relative py-20 sm:py-24 bg-white overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Soft accent wash that follows the active product */}
      <motion.div
        className="absolute -right-40 top-10 w-[620px] h-[620px] rounded-full pointer-events-none blur-3xl"
        animate={{ background: `radial-gradient(circle, ${item.accent}22 0%, transparent 65%)` }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
        {/* ── Left: heading + selector ── */}
        <div>
          <span className="inline-block text-xs font-semibold uppercase mb-4" style={{ color: "#6B8E23", letterSpacing: "0.22em" }}>
            Nature's Best
          </span>
          <h2 className="font-serif font-bold leading-[1.1] mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#1a0f05" }}>
            One kitchen.
            <br />
            <span className="italic font-medium" style={{ color: item.accent, transition: "color .6s" }}>
              Three pure essentials.
            </span>
          </h2>
          <p className="text-[15px] leading-7 max-w-md mb-6 lg:mb-8" style={{ color: "rgba(62,47,28,0.62)" }}>
            Everything we make starts and ends the same way — nothing added, nothing taken away.
          </p>

          {/* Mobile: swipeable chips */}
          <div className="lg:hidden flex gap-2 overflow-x-auto -mx-5 px-5 py-1" style={{ scrollbarWidth: "none" }} role="tablist">
            {items.map((it, i) => {
              const on = i === active;
              return (
                <button
                  key={it.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => select(i)}
                  className="flex-shrink-0 inline-flex items-center gap-2 h-11 px-4 rounded-full text-sm font-semibold transition-colors"
                  style={{
                    background: on ? it.accent : "#FAF6EE",
                    color: on ? "#fff" : "#3E2F1C",
                    boxShadow: on ? `0 6px 16px ${it.accent}55` : "none",
                  }}
                >
                  <span>{it.emoji}</span>
                  {it.short}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex flex-col gap-2" role="tablist">
            {items.map((it, i) => {
              const on = i === active;
              return (
                <button
                  key={it.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className="group relative text-left rounded-2xl px-5 py-4 overflow-hidden transition-colors"
                  style={{ background: on ? "#FAF6EE" : "transparent" }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold tabular-nums" style={{ color: on ? it.accent : "rgba(62,47,28,0.35)" }}>
                      0{i + 1}
                    </span>
                    <span
                      className="font-serif text-xl sm:text-2xl font-bold transition-colors"
                      style={{ color: on ? "#1a0f05" : "rgba(62,47,28,0.38)" }}
                    >
                      {it.name}
                    </span>
                    <FiArrowRight
                      size={18}
                      className="ml-auto transition-all duration-300"
                      style={{ color: it.accent, opacity: on ? 1 : 0, transform: on ? "translateX(0)" : "translateX(-8px)" }}
                    />
                  </div>
                  {/* progress */}
                  <span className="absolute left-5 right-5 bottom-0 h-[2px] rounded-full" style={{ background: on ? "rgba(62,47,28,0.08)" : "transparent" }}>
                    {on && (
                      <motion.span
                        key={`${active}-${paused}`}
                        className="block h-full rounded-full origin-left"
                        style={{ background: it.accent }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: paused ? 0 : 1 }}
                        transition={{ duration: paused ? 0.2 : CYCLE_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: stage ── */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_0.85fr] gap-6 sm:gap-8 items-center">
          {/* Arch image */}
          <div className="relative mx-auto w-full max-w-[270px] sm:max-w-[340px]">
            <motion.div
              className="relative aspect-[3/4] rounded-t-full rounded-b-[2rem] overflow-hidden cursor-grab active:cursor-grabbing"
              animate={{ background: item.tint }}
              transition={{ duration: 0.6 }}
              style={{ boxShadow: "0 30px 60px rgba(62,47,28,0.14)" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) select(active + 1);
                else if (info.offset.x > 50) select(active - 1);
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.key}
                  className="absolute inset-0 flex items-center justify-center px-7 pt-16 pb-7"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Sized to the photo's own shape so nothing is cropped */}
                  <img
                    src={item.img}
                    alt={item.name}
                    loading="lazy"
                    className="max-w-full max-h-full w-auto h-auto rounded-2xl mix-blend-multiply"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="lg:hidden flex justify-center gap-1.5 mt-4" aria-hidden="true">
              {items.map((it, i) => (
                <span
                  key={it.key}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: i === active ? 22 : 6, background: i === active ? item.accent : "rgba(62,47,28,0.18)" }}
                />
              ))}
            </div>
            <p className="lg:hidden text-center text-[11px] mt-2" style={{ color: "rgba(62,47,28,0.45)" }}>
              Swipe to explore
            </p>

            <div className="absolute -left-4 sm:-left-10 top-[58%]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.45 }}
                >
                  <RotatingSeal text={item.seal} center={item.emoji} size={88} color={item.accent} className="sm:scale-110" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: item.accent }}>
                {item.eyebrow}
              </p>
              <p className="font-serif text-lg leading-7 italic mb-5" style={{ color: "#2a1f12" }}>
                “{item.line}”
              </p>
              <ul className="space-y-2 mb-5">
                {item.perks.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: "rgba(42,31,18,0.75)" }}
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${item.accent}1f` }}>
                      <FiCheck size={11} strokeWidth={3} style={{ color: item.accent }} />
                    </span>
                    {p}
                  </motion.li>
                ))}
              </ul>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: "rgba(62,47,28,0.45)" }}>
                Try it in
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {item.uses.map((u) => (
                  <span key={u} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "#FAF6EE", color: "#3E2F1C" }}>
                    {u}
                  </span>
                ))}
              </div>
              <Link
                to={item.to}
                className="group inline-flex items-center gap-2 pl-5 pr-2 h-11 rounded-full text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: "#2D4A1E" }}
              >
                Shop {item.name}
                <span className="w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <FiArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
