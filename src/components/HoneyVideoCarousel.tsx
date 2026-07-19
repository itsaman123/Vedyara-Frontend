import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiPlay } from "react-icons/fi";

/* ─────────────────────────────────────────────────────────────
   VIDEO ITEMS
   To add a real YouTube/Reel video:
     1. Set ytId to the YouTube video ID (e.g. "dQw4w9WgXcQ")
     2. Set videoSrc for a direct MP4/webm file path (from /public)
   Leave both empty to show the placeholder card.
───────────────────────────────────────────────────────────── */
const videos = [
  {
    id: 1,
    title: "Morning Honey Ritual",
    desc: "A spoonful of raw honey with warm water every morning — the simplest wellness habit.",
    emoji: "🌅",
    gradient: "linear-gradient(170deg, #7c3200 0%, #b05a00 40%, #d4840a 100%)",
    accentColor: "#F59E0B",
    ytId: "",       // Add YouTube video ID here
    videoSrc: "",   // or path to local video file in /public
  },
  {
    id: 2,
    title: "Immunity Boost",
    desc: "Raw multiflora honey is packed with antioxidants that naturally strengthen your body's defences.",
    emoji: "🛡️",
    gradient: "linear-gradient(170deg, #5c1a00 0%, #922d00 45%, #c04a00 100%)",
    accentColor: "#D4AF37",
    ytId: "",
    videoSrc: "",
  },
  {
    id: 3,
    title: "Natural Sweetener",
    desc: "Replace refined sugar in your tea, desserts, and recipes with Vedyara's pure multi flora honey.",
    emoji: "🍯",
    gradient: "linear-gradient(170deg, #3d2000 0%, #7a4500 45%, #b06a00 100%)",
    accentColor: "#E8C84A",
    ytId: "",
    videoSrc: "",
  },
  {
    id: 4,
    title: "Glowing Skin",
    desc: "Apply a DIY honey face mask twice a week — nature's original moisturiser and glow treatment.",
    emoji: "✨",
    gradient: "linear-gradient(170deg, #4a1a00 0%, #803000 45%, #b55000 100%)",
    accentColor: "#D4AF37",
    ytId: "",
    videoSrc: "",
  },
  {
    id: 5,
    title: "Cough & Throat Relief",
    desc: "Mix honey with ginger juice for instant soothing relief — no chemicals, just nature.",
    emoji: "🌿",
    gradient: "linear-gradient(170deg, #1a2e10 0%, #2d4a1e 50%, #3d6b2a 100%)",
    accentColor: "#6B8E23",
    ytId: "",
    videoSrc: "",
  },
];

type VideoItem = typeof videos[0];

/* ─────────────────────────────────────────────────────────────
   SINGLE VIDEO CARD (9:16 portrait)
───────────────────────────────────────────────────────────── */
function VideoCard({ item }: { item: VideoItem }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 rounded-3xl overflow-hidden select-none"
      style={{
        width: "clamp(180px, 22vw, 260px)",
        aspectRatio: "9 / 16",
      }}
    >
      {/* YouTube embed */}
      {item.ytId && playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${item.ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : item.videoSrc && playing ? (
        /* Local video file */
        <video
          src={item.videoSrc}
          autoPlay
          playsInline
          controls
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        /* ── Placeholder card ── */
        <>
          {/* Gradient bg */}
          <div className="absolute inset-0" style={{ background: item.gradient }} />

          {/* Honeycomb pattern overlay */}
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0 34L0 84V66l28 16 28-16v18L28 100z' fill='none' stroke='%23F59E0B' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "56px 100px",
          }} />

          {/* Glowing hex center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-5">
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="relative flex items-center justify-center"
              style={{
                width: 88,
                height: 88,
                background: `radial-gradient(circle, ${item.accentColor}30 0%, ${item.accentColor}08 70%)`,
                borderRadius: "50%",
                boxShadow: `0 0 40px ${item.accentColor}40`,
              }}
            >
              <span style={{ fontSize: 44 }}>{item.emoji}</span>
            </motion.div>

            {/* Drip lines decoration */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full"
                  style={{ background: item.accentColor, opacity: 0.4 }}
                  animate={{ height: [8, 18, 8] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>

          {/* Bottom overlay — title & desc */}
          <div
            className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-10"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: item.accentColor }}>
              Honey Benefit
            </p>
            <h3 className="font-serif font-bold text-white text-base leading-snug mb-1.5">
              {item.title}
            </h3>
            <p className="text-[11px] leading-relaxed text-white/60 line-clamp-3">
              {item.desc}
            </p>
          </div>

          {/* Play button — shown when ytId or videoSrc is set */}
          {(item.ytId || item.videoSrc) && (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  border: "2px solid rgba(255,255,255,0.4)",
                }}
              >
                <FiPlay size={22} style={{ color: "#fff", marginLeft: 3 }} />
              </div>
            </button>
          )}

          {/* "Coming Soon" tag when no video yet */}
          {!item.ytId && !item.videoSrc && (
            <div
              className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              Video Coming Soon
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CAROUSEL
───────────────────────────────────────────────────────────── */
export default function HoneyVideoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const total = videos.length;

  const scrollTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(total - 1, idx));
    setActiveIdx(clamped);
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLDivElement>("[data-card]");
    cards[clamped]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f0a05 0%, #1a0e04 50%, #0f0a05 100%)" }}
    >
      {/* Ambient honeycomb dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0 34L0 84V66l28 16 28-16v18L28 100z' fill='none' stroke='%23D4AF37' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "56px 100px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "80vw", height: "80vw",
          background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          {/* Hex badge */}
          <div className="inline-flex items-center gap-2 mb-5">
            <div
              className="w-8 h-8 flex items-center justify-center"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                background: "linear-gradient(135deg, #D4AF37, #e8c84a)",
              }}
            >
              <span style={{ fontSize: 14 }}>🍯</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#D4AF37" }}>
              Honey in Action
            </span>
          </div>

          <h2
            className="font-serif font-bold text-white mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
          >
            See What Pure Honey{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #D4AF37, #e8c84a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Can Do
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Real use-cases, real benefits — how Vedyara Multi Flora Honey transforms everyday wellness moments.
          </p>
        </motion.div>

        {/* Carousel track */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scrollTo(activeIdx - 1)}
            disabled={activeIdx === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-20 hidden md:flex"
            style={{
              background: "rgba(212,175,55,0.12)",
              border: "1px solid rgba(212,175,55,0.25)",
              color: "#D4AF37",
            }}
          >
            <FiChevronLeft size={20} />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scrollTo(activeIdx + 1)}
            disabled={activeIdx >= total - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-20 hidden md:flex"
            style={{
              background: "rgba(212,175,55,0.12)",
              border: "1px solid rgba(212,175,55,0.25)",
              color: "#D4AF37",
            }}
          >
            <FiChevronRight size={20} />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth"
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Leading spacer so first card centers on mobile */}
            <div className="flex-shrink-0 w-4 md:hidden" />

            <AnimatePresence mode="popLayout">
              {videos.map((v, i) => (
                <motion.div
                  key={v.id}
                  data-card
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                  style={{ scrollSnapAlign: "center" }}
                  className="flex-shrink-0"
                >
                  <VideoCard item={v} />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Trailing spacer */}
            <div className="flex-shrink-0 w-4 md:hidden" />
          </div>

          {/* Hide scrollbar */}
          <style>{`[data-honey-scroll]::-webkit-scrollbar { display: none; }`}</style>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: activeIdx === i ? 28 : 8,
                height: 8,
                background: activeIdx === i
                  ? "linear-gradient(90deg, #D4AF37, #e8c84a)"
                  : "rgba(212,175,55,0.25)",
              }}
            />
          ))}
        </div>

        {/* Add-video hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs mt-8"
          style={{ color: "rgba(212,175,55,0.3)" }}
        >
          Add your YouTube video IDs to{" "}
          <code className="font-mono" style={{ color: "rgba(212,175,55,0.5)" }}>
            HoneyVideoCarousel.tsx
          </code>{" "}
          to activate the player
        </motion.p>
      </div>
    </section>
  );
}
