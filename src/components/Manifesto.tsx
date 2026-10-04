import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* Words wrapped in *asterisks* are highlighted */
const TEXT =
  "We don't make honey — *the bees do.* We don't invent spices — *farmers grow them.* Our only job is to *keep everything else out.*";

// Split into words once, tracking which ones sit inside *highlight* markers
const WORDS = (() => {
  let inHighlight = false;
  return TEXT.split(" ").map((raw) => {
    if (raw.startsWith("*")) inHighlight = true;
    const word = { text: raw.replace(/\*/g, ""), highlight: inHighlight };
    if (raw.endsWith("*")) inHighlight = false;
    return word;
  });
})();

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlight: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block mr-[0.28em] ${highlight ? "italic" : ""}`}
    >
      <span
        style={
          highlight
            ? {
                background: "linear-gradient(120deg, #B8861B, #D4AF37 50%, #6B8E23)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }
            : undefined
        }
      >
        {children}
      </span>
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "#faf9f7" }}>
      {/* Hand-drawn style bee path */}
      <svg
        className="absolute left-[6%] top-12 w-40 h-24 opacity-40 pointer-events-none hidden md:block"
        viewBox="0 0 160 90"
        fill="none"
        aria-hidden="true"
      >
        <path d="M4 70 C 30 10, 60 90, 90 40 S 140 20, 150 30" stroke="#D4AF37" strokeWidth="1.4" strokeDasharray="4 5" />
        <text x="138" y="26" fontSize="18">🐝</text>
      </svg>

      <div ref={ref} className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <span className="inline-block text-xs font-semibold uppercase mb-6" style={{ color: "#6B8E23", letterSpacing: "0.22em" }}>
          Our Philosophy
        </span>
        <p
          className="font-serif font-bold leading-[1.25]"
          style={{ fontSize: "clamp(1.7rem, 4.2vw, 3.2rem)", color: "#1a0f05" }}
        >
          {WORDS.map((w, i) => {
            const start = i / WORDS.length;
            const end = start + 1 / WORDS.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]} highlight={w.highlight}>
                {w.text}
              </Word>
            );
          })}
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 font-serif italic text-lg"
          style={{ color: "rgba(62,47,28,0.55)" }}
        >
          — The Vedyara promise
        </motion.p>
      </div>
    </section>
  );
}
