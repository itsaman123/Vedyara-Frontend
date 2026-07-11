import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useSEO } from "../utils/seo";
const FarmImage = "/farm-image.webp";
const BeeFarm = "/bee-farm.webp";
const HoneyBottle = "/honey-bottle.webp";
import {
  FiArrowRight,
  FiCheck,
  FiHeart,
  FiGlobe,
  FiUsers,
  FiAward,
} from "react-icons/fi";
import { FaLeaf, FaQuoteLeft } from "react-icons/fa";
import { fadeUp, staggerContainer } from "../utils/animations";

/* ═══════════════════════════════════════════════════════════
   DECORATIVE BLOB — static, no animation
═══════════════════════════════════════════════════════════ */
const Blob = ({ color, className }: { color: string; className?: string }) => (
  <div
    className={`absolute rounded-full blur-2xl pointer-events-none ${className}`}
    style={{ background: color }}
  />
);

/* ═══════════════════════════════════════════════════════════
   SECTION TAG
═══════════════════════════════════════════════════════════ */
const SectionTag = ({ label }: { label: string }) => (
  <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-3 mb-6">
    <div className="w-8 h-px" style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }} />
    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>
      {label}
    </span>
    <div className="w-8 h-px" style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }} />
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   VALUE CARD
═══════════════════════════════════════════════════════════ */
const ValueCard = ({
  value,
  index,
}: {
  value: { icon: string; title: string; description: string; color: string };
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="p-8 rounded-3xl bg-white shadow-lg shadow-black/5 relative overflow-hidden group cursor-default h-full"
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(107,142,35,0.05) 100%)",
        }}
      />
      <div className="relative z-10">
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: value.color, border: "1px solid rgba(212,175,55,0.2)" }}
          whileHover={{ rotate: 10, scale: 1.1 }}
        >
          <span className="text-2xl">{value.icon}</span>
        </motion.div>
        <h3 className="font-serif font-bold text-lg mb-3" style={{ color: "#3E2F1C" }}>
          {value.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════════════ */
const AnimatedStat = ({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
        className="text-4xl md:text-5xl font-bold mb-2"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #6B8E23)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {value}
      </motion.div>
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{label}</p>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const values = [
  {
    icon: "🌿",
    title: "Purity First",
    description: "Every product is 100% natural, free from synthetic pesticides, chemicals, or artificial additives.",
    color: "rgba(107,142,35,0.12)",
  },
  {
    icon: "🤝",
    title: "Farmer First",
    description: "We pay fair prices, cut out middlemen, and build long-term partnerships that empower rural communities.",
    color: "rgba(212,175,55,0.1)",
  },
  {
    icon: "🔬",
    title: "Science Backed",
    description: "Every batch is tested in certified labs for purity, nutritional content, and safety before reaching you.",
    color: "rgba(62,47,28,0.07)",
  },
  {
    icon: "♻️",
    title: "Earth Friendly",
    description: "Eco-conscious, minimal packaging. What's good for your body should also be good for the planet.",
    color: "rgba(107,142,35,0.1)",
  },
  {
    icon: "🏡",
    title: "Community Driven",
    description: "Every purchase supports small-scale farmers, women's cooperatives, and rural livelihoods.",
    color: "rgba(212,175,55,0.08)",
  },
  {
    icon: "💛",
    title: "Trusted by Families",
    description: "Over 1000 families across India trust Vedyara for pure honey, turmeric, and coriander every day.",
    color: "rgba(62,47,28,0.06)",
  },
];

const milestones = [
  { year: "2022", event: "First products launched — Pure Honey & Turmeric Powder" },
  { year: "2024", event: "Expanded to 50+ farmer partnerships across India" },
  { year: "2026", event: "Now live nationally & on Amazon India 🛒" },
];

/* ═══════════════════════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════════════════════ */
export default function About() {
  useSEO({
    title: "About Vedyara | Our Story | Pure Multi Flora Honey & Natural Spices",
    description: "Learn about Vedyara — the brand behind India's pure multi flora honey, turmeric & coriander powder. Our mission: bring farm-fresh, lab-tested natural products to every home.",
    keywords: "about vedyara, vedyara honey brand, vedyara multi flora honey brand, natural products india, pure honey brand india",
    canonical: "https://vedyara.in/about",
  });

  return (
    <main className="relative overflow-x-hidden bg-[#faf9f7]">
      {/* ════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-24 pb-16"
        style={{ background: "linear-gradient(135deg, #fef9f3 0%, #f5f0e8 50%, #ebe6d9 100%)" }}
      >
        <Blob color="rgba(212,175,55,0.2)" className="w-[600px] h-[600px] -top-48 -left-48" />
        <Blob color="rgba(107,142,35,0.15)" className="w-[500px] h-[500px] -bottom-32 -right-32" />


        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.p
                variants={fadeUp}
                custom={0}
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: "rgba(212,175,55,0.8)" }}
              >
                Vedyara / About Us
              </motion.p>

              <SectionTag label="Our Story" />

              <motion.h1
                variants={fadeUp}
                custom={0.1}
                className="font-serif font-bold leading-tight"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#3E2F1C" }}
              >
                Rooted in Nature.
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #6B8E23)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Built on Trust.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={0.2}
                className="text-lg text-gray-600 max-w-lg"
              >
                Born from a deep belief that every Indian family deserves food that is truly pure —
                grown without chemicals, processed without shortcuts, and delivered with integrity.
              </motion.p>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { value: "2022", label: "Founded" },
                  { value: "200+", label: "Farm Partners" },
                  { value: "10K+", label: "Families Served" },
                ].map((s, i) => (
                  <AnimatedStat key={s.label} value={s.value} label={s.label} index={i} />
                ))}
              </motion.div>

              <motion.div variants={fadeUp} custom={0.4} className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #e8c84a)",
                    color: "#3E2F1C",
                    boxShadow: "0 8px 28px rgba(212,175,55,0.3)",
                  }}
                >
                  <span>Explore Products</span>
                  <FiArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold border-2"
                  style={{
                    borderColor: "rgba(62,47,28,0.2)",
                    color: "#3E2F1C",
                  }}
                >
                  Get in Touch
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div
                className="absolute inset-0 rounded-full blur-3xl"
                style={{
                  background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
                  transform: "scale(1.3)",
                }}
              />
              <img
                src={FarmImage}
                alt="Natural Farm"
                className="w-full rounded-3xl shadow-2xl"
              />

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 p-6 rounded-2xl bg-white shadow-xl"
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6B8E23" }}>
                  Our Commitment
                </p>
                <p className="font-serif font-bold text-xl" style={{ color: "#3E2F1C" }}>
                  Zero Compromise
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <FaLeaf size={14} style={{ color: "#6B8E23" }} />
                  <span className="text-sm" style={{ color: "rgba(62,47,28,0.6)" }}>
                    100% Natural Always
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-gray-400 uppercase tracking-widest">Scroll</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          MISSION SECTION
      ════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden bg-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <SectionTag label="Our Mission" />
            <motion.blockquote
              variants={fadeUp}
              custom={0.1}
              className="font-serif font-bold leading-tight mb-8 relative"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#3E2F1C" }}
            >
              <FaQuoteLeft
                size={40}
                className="absolute -top-4 left-1/2 -translate-x-1/2"
                style={{ color: "rgba(212,175,55,0.2)" }}
              />
              <span className="relative z-10 block mt-8">
                "To make pure, honest food accessible to every Indian family — by empowering
                the farmers who grow it and{" "}
                <span style={{ color: "#D4AF37" }}>honouring the land</span> that sustains us."
              </span>
            </motion.blockquote>

            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              We believe pure food shouldn't be a luxury. With direct farm partnerships and
              a no-middleman model, we keep prices fair while quality stays uncompromisingly high.
            </motion.p>

            <motion.div variants={staggerContainer} className="flex flex-wrap justify-center gap-4 mt-10">
              {[
                { icon: <FiHeart size={18} />, label: "Passion for Purity" },
                { icon: <FiGlobe size={18} />, label: "Farm Transparency" },
                { icon: <FiUsers size={18} />, label: "Rural Empowerment" },
                { icon: <FiAward size={18} />, label: "Quality Standards" },
              ].map(({ icon, label }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  custom={0.1}
                  whileHover={{ scale: 1.06, y: -2 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-white shadow-lg"
                  style={{ border: "1.5px solid rgba(212,175,55,0.2)" }}
                >
                  <span style={{ color: "#D4AF37" }}>{icon}</span>
                  <span className="text-sm font-semibold" style={{ color: "#3E2F1C" }}>
                    {label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          BRAND STORY
      ════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-[#faf9f7] overflow-hidden">
        <Blob color="rgba(212,175,55,0.1)" className="w-[400px] h-[400px] top-0 right-0" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden">
                <img
                  src={HoneyBottle}
                  alt="Natural Products"
                  className="w-full transition-transform duration-700 hover:scale-105"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30, y: -20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -top-5 -right-5 p-5 rounded-2xl bg-white shadow-xl"
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#D4AF37" }}>
                  Impact
                </p>
                <p className="font-serif font-bold text-2xl" style={{ color: "#3E2F1C" }}>
                  200+
                </p>
                <p className="text-xs" style={{ color: "rgba(62,47,28,0.55)" }}>
                  Farmer Partnerships
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionTag label="How We Started" />

              <motion.h2
                variants={fadeUp}
                custom={0.1}
                className="font-serif font-bold leading-tight mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#3E2F1C" }}
              >
                A Small Dream,
                <br />
                <span style={{ color: "#D4AF37" }}>A Powerful Purpose</span>
              </motion.h2>

              <motion.p variants={fadeUp} custom={0.2} className="text-base text-gray-600 mb-5">
                It began with a simple question: why is it so hard to find food that's genuinely pure?
                In 2022, we launched with just two products — Himalayan wild honey and premium turmeric powder.
                Both sold out in weeks.
              </motion.p>

              <motion.p variants={fadeUp} custom={0.3} className="text-base text-gray-600 mb-8">
                The response confirmed what we believed: people were hungry for something real.
                Today, we offer honey, turmeric, and coriander — each sourced directly from trusted farms across India.
              </motion.p>

              <motion.div variants={staggerContainer} className="space-y-4">
                {milestones.map((m, i) => (
                  <motion.div key={m.year} variants={fadeUp} custom={0.05 * i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #D4AF37, #e8c84a)", color: "#3E2F1C" }}>
                      {m.year.slice(2)}
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-0.5" style={{ color: "#D4AF37" }}>{m.year}</p>
                      <p className="text-sm text-gray-600">{m.event}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          VALUES GRID
      ════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)" }}
        />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <SectionTag label="Our Values" />
            <motion.h2
              variants={fadeUp}
              custom={0.1}
              className="font-serif font-bold"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#3E2F1C" }}
            >
              Principles We Never{" "}
              <span style={{ color: "#D4AF37" }}>Compromise On</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <ValueCard key={v.title} value={v} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          NGO VISION
      ════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden" style={{ background: "#3E2F1C" }}>
        <Blob color="rgba(212,175,55,0.08)" className="w-[500px] h-[500px] top-0 right-0" />
        <Blob color="rgba(107,142,35,0.06)" className="w-[400px] h-[400px] bottom-0 left-0" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionTag label="Beyond Business" />

              <motion.h2
                variants={fadeUp}
                custom={0.1}
                className="font-serif font-bold leading-tight mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "white" }}
              >
                A Vision for{" "}
                <span style={{ color: "#D4AF37" }}>Rural India</span>
              </motion.h2>

              <motion.p variants={fadeUp} custom={0.2} className="text-base text-gray-300 mb-5">
                Vedyara has always been more than a food brand. Our mission is intertwined
                with the people who grow our food — India's small-scale farmers who farm
                with care, tradition, and integrity.
              </motion.p>

              <motion.div variants={staggerContainer} className="space-y-3 mb-8">
                {[
                  "Free natural farming workshops in 10 states",
                  "Soil health testing & regenerative farming support",
                  "Scholarships for children of farmer partners",
                  "Women-led farming cooperative empowerment",
                ].map((item) => (
                  <motion.div key={item} variants={fadeUp} custom={0.05} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(107,142,35,0.2)" }}>
                      <FiCheck size={11} style={{ color: "#6B8E23" }} strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { src: FarmImage, alt: "Farm landscape", span: "col-span-2" },
                { src: BeeFarm, alt: "Pure honey", span: "" },
                { src: HoneyBottle, alt: "Natural products", span: "" },
              ].map((img) => (
                <div key={img.alt} className={`rounded-2xl overflow-hidden ${img.span}`} style={{ height: img.span ? "220px" : "180px" }}>
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CERTIFICATIONS
      ════════════════════════════════════════════════════ */}
      <section className="relative py-16 bg-[#faf9f7]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-semibold uppercase tracking-widest mb-8"
              style={{ color: "rgba(62,47,28,0.5)" }}>
              Certifications & Standards
            </motion.p>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: "🏆", label: "FSSAI Certified" },
                { icon: "🔬", label: "Lab Verified" },
                { icon: "🚜", label: "Farm Traced" },
                { icon: "♻️", label: "Eco Packaging" },
                { icon: "🤝", label: "Fair Trade" },
              ].map((cert, i) => (
                <motion.div
                  key={cert.label}
                  variants={fadeUp}
                  custom={0.05 * i}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white shadow-lg"
                >
                  <span className="text-2xl">{cert.icon}</span>
                  <p className="font-semibold text-xs" style={{ color: "#3E2F1C" }}>{cert.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #fef9f3 0%, #f5f0e8 100%)" }}>
        <Blob color="rgba(212,175,55,0.15)" className="w-[500px] h-[500px] -top-32 -left-32" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <SectionTag label="Join the Movement" />
            <motion.h2
              variants={fadeUp}
              custom={0.1}
              className="font-serif font-bold mb-6 leading-tight"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#3E2F1C" }}
            >
              Be Part of the{" "}
              <span style={{ background: "linear-gradient(135deg, #D4AF37, #6B8E23)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Pure Food Revolution
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={0.2} className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
              Every purchase supports our partner farmers, funds rural education, and brings us closer to a
              healthier, more honest food ecosystem for every Indian family.
            </motion.p>
            <motion.div variants={fadeUp} custom={0.3} className="flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #e8c84a)",
                  color: "#3E2F1C",
                  boxShadow: "0 8px 28px rgba(212,175,55,0.3)",
                }}
              >
                <span>Shop Now</span>
                <FiArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold border-2"
                style={{ borderColor: "rgba(62,47,28,0.2)", color: "#3E2F1C" }}
              >
                Partner with Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
