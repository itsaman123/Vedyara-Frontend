import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LogoBrand from "./LogoBrand";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowRight,
  FiPackage,
  FiTrendingUp,
  FiExternalLink,
} from "react-icons/fi";
import { AMAZON_STORE_URL } from "../config/environment";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/products" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const products = [
  { label: "Pure Himalayan Honey", to: "/products" },
  { label: "Natural Turmeric Powder", to: "/products" },
  { label: "Aromatic Coriander Powder", to: "/products" },
];

const socialLinks = [
  { icon: FaInstagram, href: "https://www.instagram.com/vedyara.agro", label: "Instagram" },
  { icon: FaFacebookF, href: "https://facebook.com/share/1BFVLAUoD1", label: "Facebook" },
  { icon: FaWhatsapp, href: "https://wa.me/919509628400", label: "WhatsApp" },
];

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(170deg, #0d1a09 0%, #162811 45%, #1e3518 100%)" }}
    >
      {/* Top accent line */}
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #D4AF37 20%, #2D4A1E 50%, #D4AF37 80%, transparent)",
        }}
      />

      {/* ════════════════════════════════════════════════════
          B2B / BULK ORDERS BANNER
      ════════════════════════════════════════════════════ */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fade}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mx-4 sm:mx-8 lg:mx-16 mt-10 rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(110deg, rgba(45,74,30,0.5) 0%, rgba(212,175,55,0.07) 100%)",
          border: "1px solid rgba(212,175,55,0.2)",
        }}
      >
        <div className="px-6 sm:px-10 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* Left: content */}
          <div className="flex items-start gap-5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(212,175,55,0.12)",
                border: "1px solid rgba(212,175,55,0.22)",
              }}
            >
              <FiPackage size={22} style={{ color: "#D4AF37" }} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className="text-xs font-semibold uppercase"
                  style={{ color: "#D4AF37", letterSpacing: "0.2em" }}
                >
                  B2B &amp; Wholesale
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                  style={{
                    background: "rgba(212,175,55,0.12)",
                    color: "#D4AF37",
                    border: "1px solid rgba(212,175,55,0.28)",
                  }}
                >
                  Now Open
                </span>
              </div>
              <h3
                className="font-serif font-bold mb-1.5"
                style={{ color: "#F8F5F0", fontSize: "1.15rem" }}
              >
                Bulk Orders &amp; Business Partnerships
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(248,245,240,0.52)", maxWidth: "480px" }}
              >
                We supply premium honey, turmeric, and coriander in bulk to retailers,
                restaurants, Ayurvedic brands &amp; distributors. Custom packaging and
                private labelling available on request.
              </p>
            </div>
          </div>

          {/* Right: CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
            <a
              href="mailto:vedyaraorg@gmail.com?subject=Bulk%20Order%20Enquiry"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{ background: "#2D4A1E", color: "#ffffff" }}
            >
              <FiMail size={15} />
              Email for Quote
            </a>
            <a
              href="https://wa.me/919509628400?text=Hi%20Vedyara%2C%20I%20am%20interested%20in%20bulk%2Fwholesale%20orders.%20Please%20share%20your%20B2B%20pricing."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{
                background: "rgba(37,211,102,0.1)",
                color: "#25D366",
                border: "1px solid rgba(37,211,102,0.22)",
              }}
            >
              <FaWhatsapp size={16} />
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Decorative bg icon */}
        <FiTrendingUp
          size={130}
          className="absolute -right-5 -bottom-5 pointer-events-none"
          style={{ color: "#D4AF37", opacity: 0.04 }}
        />
      </motion.div>

      {/* ════════════════════════════════════════════════════
          MAIN FOOTER GRID
      ════════════════════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Col 1: Brand ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link to="/" className="inline-block mb-5" style={{ lineHeight: 0 }}>
              <LogoBrand variant="light" height={48} />
            </Link>

            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "rgba(248,245,240,0.48)", maxWidth: "230px" }}
            >
              Pure, natural, and rooted in ancient wisdom. Bringing India's finest
              pure produce straight from farm to table.
            </p>

            <div className="space-y-2 mb-7">
              {["FSSAI Certified", "Lab Tested & Verified", "No Artificial Additives"].map((cert) => (
                <div key={cert} className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#4a8a2a" }}
                  />
                  <span className="text-xs" style={{ color: "rgba(248,245,240,0.38)" }}>
                    {cert}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mb-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(248,245,240,0.45)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,245,240,0.45)")
                  }
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>

            {/* Amazon badge */}
            <a
              href={AMAZON_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
              style={{
                background: "rgba(255,153,0,0.1)",
                border: "1px solid rgba(255,153,0,0.25)",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>🛒</span>
              <div>
                <p style={{ fontSize: "0.62rem", color: "rgba(248,245,240,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Also available on</p>
                <p style={{ fontSize: "0.82rem", color: "#FF9900", fontWeight: 700, letterSpacing: "0.02em" }}>Amazon India</p>
              </div>
              <FiExternalLink size={13} style={{ color: "rgba(255,153,0,0.6)", marginLeft: "auto" }} />
            </a>
          </motion.div>

          {/* ── Col 2: Quick Links ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            transition={{ duration: 0.5, delay: 0.07, ease: "easeOut" }}
          >
            <h4
              className="font-serif font-bold mb-5 text-base"
              style={{ color: "#F8F5F0" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3 mb-8">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="group flex items-center gap-2 text-sm transition-colors duration-200"
                    style={{ color: "rgba(248,245,240,0.45)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,245,240,0.45)")
                    }
                  >
                    <FiArrowRight
                      size={13}
                      className="transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0"
                      style={{ color: "#4a8a2a" }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <p
                className="text-[10px] font-semibold uppercase mb-3"
                style={{ color: "rgba(248,245,240,0.25)", letterSpacing: "0.18em" }}
              >
                Our Promise
              </p>
              {["100% Natural", "No Chemicals", "Farm Direct", "Lab Tested"].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(45,74,30,0.18)",
                    border: "1px solid rgba(45,74,30,0.28)",
                  }}
                >
                  <span style={{ color: "#4a8a2a", fontSize: "0.7rem" }}>✓</span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "rgba(248,245,240,0.52)" }}
                  >
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Col 3: Our Products ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            transition={{ duration: 0.5, delay: 0.14, ease: "easeOut" }}
          >
            <h4
              className="font-serif font-bold mb-5 text-base"
              style={{ color: "#F8F5F0" }}
            >
              Our Products
            </h4>
            <ul className="space-y-3 mb-8">
              {products.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="group flex items-center gap-2 text-sm transition-colors duration-200"
                    style={{ color: "rgba(248,245,240,0.45)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,245,240,0.45)")
                    }
                  >
                    <FiArrowRight
                      size={13}
                      className="transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0"
                      style={{ color: "#4a8a2a" }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* B2B mini callout */}
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(212,175,55,0.05)",
                border: "1px solid rgba(212,175,55,0.14)",
              }}
            >
              <p
                className="text-xs font-semibold mb-1.5"
                style={{ color: "#D4AF37" }}
              >
                Need Bulk Quantities?
              </p>
              <p
                className="text-xs leading-relaxed mb-3"
                style={{ color: "rgba(248,245,240,0.38)" }}
              >
                Custom MOQs, private labelling &amp; wholesale pricing available for businesses.
              </p>
              <a
                href="mailto:vedyaraorg@gmail.com?subject=Bulk%20Order%20Enquiry"
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 hover:opacity-80"
                style={{ color: "#D4AF37" }}
              >
                Enquire Now <FiArrowRight size={11} />
              </a>
            </div>
          </motion.div>

          {/* ── Col 4: Contact ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            transition={{ duration: 0.5, delay: 0.21, ease: "easeOut" }}
          >
            <h4
              className="font-serif font-bold mb-5 text-base"
              style={{ color: "#F8F5F0" }}
            >
              Get In Touch
            </h4>

            <div className="space-y-4 mb-7">
              <a
                href="mailto:vedyaraorg@gmail.com"
                className="flex items-start gap-3 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(212,175,55,0.1)" }}
                >
                  <FiMail size={14} style={{ color: "#D4AF37" }} />
                </div>
                <div>
                  <p
                    className="text-[10px] uppercase tracking-wide mb-0.5"
                    style={{ color: "rgba(248,245,240,0.28)" }}
                  >
                    Email Us
                  </p>
                  <span
                    className="text-sm transition-colors duration-200 group-hover:text-yellow-300"
                    style={{ color: "rgba(248,245,240,0.52)" }}
                  >
                    vedyaraorg@gmail.com
                  </span>
                </div>
              </a>

              <a href="tel:+919509628400" className="flex items-start gap-3 group">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(212,175,55,0.1)" }}
                >
                  <FiPhone size={14} style={{ color: "#D4AF37" }} />
                </div>
                <div>
                  <p
                    className="text-[10px] uppercase tracking-wide mb-0.5"
                    style={{ color: "rgba(248,245,240,0.28)" }}
                  >
                    Call Us
                  </p>
                  <span
                    className="text-sm transition-colors duration-200 group-hover:text-yellow-300"
                    style={{ color: "rgba(248,245,240,0.52)" }}
                  >
                    +91 95096 28400
                  </span>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(212,175,55,0.1)" }}
                >
                  <FiMapPin size={14} style={{ color: "#D4AF37" }} />
                </div>
                <div>
                  <p
                    className="text-[10px] uppercase tracking-wide mb-0.5"
                    style={{ color: "rgba(248,245,240,0.28)" }}
                  >
                    Sourced From
                  </p>
                  <span
                    className="text-sm"
                    style={{ color: "rgba(248,245,240,0.52)" }}
                  >
                    Uttar Pradesh · Uttarakhand · Bihar
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919509628400?text=Hi%20Vedyara%2C%20I%20want%20to%20know%20more%20about%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{
                background: "rgba(37,211,102,0.08)",
                color: "#25D366",
                border: "1px solid rgba(37,211,102,0.2)",
              }}
            >
              <FaWhatsapp size={18} />
              <div>
                <span className="block leading-none text-sm">Chat on WhatsApp</span>
                <span
                  className="text-[11px] block mt-0.5"
                  style={{ color: "rgba(37,211,102,0.6)" }}
                >
                  Quick response guaranteed
                </span>
              </div>
            </a>
          </motion.div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p style={{ color: "rgba(248,245,240,0.27)" }}>
              © {currentYear}{" "}
              <span style={{ color: "rgba(248,245,240,0.42)" }}>Vedyara</span>
              . All rights reserved. Made with 🌿 for a healthier India.
            </p>

            <div className="flex items-center gap-4">
              {(["Privacy Policy", "Terms of Use", "Sitemap"] as const).map((item, i, arr) => (
                <span key={item} className="flex items-center gap-4">
                  <a
                    href="#"
                    className="transition-colors duration-200"
                    style={{ color: "rgba(248,245,240,0.27)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,245,240,0.27)")
                    }
                  >
                    {item}
                  </a>
                  {i < arr.length - 1 && (
                    <span style={{ color: "rgba(248,245,240,0.1)" }}>·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}