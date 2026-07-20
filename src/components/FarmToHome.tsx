import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const steps = [
  {
    icon: "🐝",
    step: "01",
    title: "Bee Farm",
    desc: "Our bees forage pristine forests and meadows, collecting nectar at peak bloom from chemical-free environments.",
    accent: "#D4AF37",
  },
  {
    icon: "🌾",
    step: "02",
    title: "Harvest",
    desc: "Expert beekeepers hand-harvest with traditional techniques, preserving every enzyme and natural property.",
    accent: "#6B8E23",
  },
  {
    icon: "🔬",
    step: "03",
    title: "Lab Testing",
    desc: "Every single batch is sent to NABL-certified labs. No product ships without passing our purity benchmark.",
    accent: "#2D4A1E",
  },
  {
    icon: "📦",
    step: "04",
    title: "Packaging",
    desc: "Cold-filled in FSSAI-certified hygienic facilities. Zero heat treatment — every nutrient stays intact.",
    accent: "#8B6914",
  },
  {
    icon: "🚚",
    step: "05",
    title: "Your Door",
    desc: "Shipped directly from our facility to your home. No warehousing delays, no quality compromise.",
    accent: "#2D4A1E",
  },
];

type Step = (typeof steps)[number];

/* ─────────────────────────────────────────────────────────────
   Desktop step — reveals in sequence as scrollYProgress advances
───────────────────────────────────────────────────────────── */
function DesktopStep({
  step,
  index,
  progress,
}: {
  step: Step;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = (index / steps.length) * 0.85;
  const end = start + 0.55 / steps.length;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [30, 0]);
  const scale = useTransform(progress, [start, end], [0.85, 1]);
  const glow = useTransform(progress, [start, end], [0, 1]);
  const boxShadow = useTransform(glow, (v) => `0 0 ${24 * v}px ${step.accent}${Math.round(v * 0x22).toString(16).padStart(2, "0")}`);

  return (
    <motion.div style={{ opacity, y, scale }} className="flex flex-col items-center text-center">
      <motion.div
        className="w-[104px] h-[104px] rounded-full flex flex-col items-center justify-center mb-6 relative"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `2px solid ${step.accent}`,
          boxShadow,
        }}
      >
        <span style={{ fontSize: "2rem" }}>{step.icon}</span>
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 800,
            color: step.accent,
            letterSpacing: "0.12em",
            marginTop: "2px",
          }}
        >
          {step.step}
        </span>
      </motion.div>

      <h3 className="font-serif font-bold text-white text-base mb-2">{step.title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
        {step.desc}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Mobile step — same scroll-scrubbed reveal, vertical timeline
───────────────────────────────────────────────────────────── */
function MobileStep({
  step,
  index,
  progress,
}: {
  step: Step;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = (index / steps.length) * 0.9;
  const end = start + 0.6 / steps.length;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const x = useTransform(progress, [start, end], [-24, 0]);

  return (
    <motion.div style={{ opacity, x }} className="relative flex items-start gap-5">
      <div
        className="absolute -left-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: "#0f1f08",
          border: `2px solid ${step.accent}`,
          top: "2px",
        }}
      >
        <span style={{ fontSize: "0.95rem" }}>{step.icon}</span>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span style={{ fontSize: "0.6rem", color: step.accent, fontWeight: 800, letterSpacing: "0.14em" }}>
            {step.step}
          </span>
          <h3 className="font-serif font-bold text-white text-base">{step.title}</h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function FarmToHome() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.4"],
  });

  const lineScaleX = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);
  const lineScaleY = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden" style={{ background: "#0f1f08" }}>
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "#D4AF37", letterSpacing: "0.22em" }}
          >
            Our Process
          </span>
          <h2
            className="font-serif font-bold text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Farm to{" "}
            <span style={{ color: "#D4AF37" }}>Your Home</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Five careful steps between nature's bounty and your table — no shortcuts, no compromises.
          </p>
        </motion.div>

        {/* Desktop: horizontal timeline, scroll-scrubbed */}
        <div className="hidden lg:block relative">
          {/* Connecting line — draws in as you scroll through the section */}
          <div className="absolute top-[52px] left-0 right-0 flex items-center px-[10%]" style={{ zIndex: 0 }}>
            <motion.div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to right, #D4AF37, #6B8E23, #D4AF37)",
                scaleX: lineScaleX,
                transformOrigin: "left",
              }}
            />
          </div>

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step, i) => (
              <DesktopStep key={step.step} step={step} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline, scroll-scrubbed */}
        <div className="lg:hidden relative pl-10">
          {/* Vertical line — grows downward as you scroll */}
          <div className="absolute left-[20px] top-0 bottom-0 w-px overflow-hidden">
            <motion.div
              className="w-full h-full"
              style={{
                background: "linear-gradient(to bottom, #D4AF37, #6B8E23, #D4AF37)",
                scaleY: lineScaleY,
                transformOrigin: "top",
              }}
            />
          </div>

          <div className="flex flex-col gap-10">
            {steps.map((step, i) => (
              <MobileStep key={step.step} step={step} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
