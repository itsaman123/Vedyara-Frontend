import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheck,
  FiUser,
  FiMessageSquare,
} from "react-icons/fi";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
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
   CONTACT CARD
═══════════════════════════════════════════════════════════ */
const ContactCard = ({
  item,
  index,
}: {
  item: { icon: React.ElementType; label: string; value: string; href?: string; desc: string; color: string };
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const content = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 8 }}
      className="flex items-start gap-4 p-5 rounded-2xl bg-white shadow-lg transition-all duration-300"
      style={{ border: "1px solid rgba(62,47,28,0.06)", marginTop: "0.5rem" }}
    >
      <motion.div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${item.color}20` }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <item.icon size={20} style={{ color: item.color }} />
      </motion.div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "rgba(62,47,28,0.5)" }}>
          {item.label}
        </p>
        <p className="font-semibold text-base truncate" style={{ color: "#3E2F1C" }}>
          {item.value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(62,47,28,0.5)" }}>
          {item.desc}
        </p>
      </div>
    </motion.div>
  );

  if (item.href) {
    return <a href={item.href}>{content}</a>;
  }
  return content;
};

/* ═══════════════════════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════════════════════ */
const FaqItem = ({
  faq,
  index,
  isOpen,
  onClick,
}: {
  faq: { q: string; a: string };
  index: number;
  isOpen: boolean;
  onClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="rounded-2xl overflow-hidden"
    style={{
      background: "white",
      border: isOpen ? "1.5px solid rgba(212,175,55,0.4)" : "1px solid rgba(62,47,28,0.07)",
      boxShadow: isOpen ? "0 8px 30px rgba(212,175,55,0.12)" : "0 2px 12px rgba(0,0,0,0.03)",
    }}
  >
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-6 py-5 text-left"
    >
      <span className="font-semibold text-base pr-4" style={{ color: isOpen ? "#3E2F1C" : "rgba(62,47,28,0.82)" }}>
        {faq.q}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.25 }}
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: isOpen ? "linear-gradient(135deg, #D4AF37, #e8c84a)" : "rgba(62,47,28,0.07)",
          color: isOpen ? "#3E2F1C" : "rgba(62,47,28,0.5)",
        }}
      >
        <span className="text-lg">+</span>
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-6 pb-5">
            <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   CONTACT ITEMS & FAQS
═══════════════════════════════════════════════════════════ */
const contactItems = [
  {
    icon: FiMail,
    label: "Email Us",
    value: "vedyaraorg@gmail.com",
    href: "mailto:vedyaraorg@gmail.com",
    desc: "We reply within 24 hours",
    color: "#D4AF37",
  },
  {
    icon: FiPhone,
    label: "Call Us",
    value: "+91 9509628400",
    href: "tel:+91 9509628400",
    desc: "Mon-Sun, 9am-10pm IST",
    color: "#6B8E23",
  },
  {
    icon: FiMapPin,
    label: "Sourced From",
    value: "UP | Uttarakhand | Bihar",
    href: undefined,
    desc: "Direct from partner farms",
    color: "#D4AF37",
  },
];

const socialLinks = [
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    href: "https://wa.me/919509628400?text=Hi%20Vedyara",
    color: "#25D366",
    bg: "rgba(37,211,102,0.12)",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/vedyara.agro",
    color: "#E1306C",
    bg: "rgba(225,48,108,0.08)",
  },
];

const faqs = [
  {
    q: "Where are your products sourced from?",
    a: "All our products are sourced directly from trusted farms across India — including Uttar Pradesh, Uttarakhand, and Bihar.",
  },
  {
    q: "Where can I buy Vedyara products?",
    a: "You can shop directly on our website or on Amazon India — we're now live on Amazon! Search 'Vedyara' or visit our Amazon store.",
  },
  {
    q: "Are your products lab-tested and certified?",
    a: "Yes. All products are FSSAI certified and lab-tested for purity, quality, and safety before being packaged and dispatched.",
  },
  {
    q: "Do you offer bulk or wholesale orders?",
    a: "Absolutely! Please reach out via email or WhatsApp for bulk pricing and partnership inquiries.",
  },
];

/* ═══════════════════════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════════════════════ */
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("https://api.staticforms.dev/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "sf_1523fb872fc7b7a279b5bba5",
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success !== false) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <main className="relative overflow-x-hidden bg-[#faf9f7]">
      {/* ════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16"
        style={{ background: "linear-gradient(135deg, #fef9f3 0%, #f5f0e8 50%, #ebe6d9 100%)" }}
      >
        <Blob color="rgba(212,175,55,0.2)" className="w-[500px] h-[500px] -top-32 -left-32" />
        <Blob color="rgba(107,142,35,0.15)" className="w-[400px] h-[400px] -bottom-20 -right-20" />


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

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: "rgba(212,175,55,0.8)" }}
            >
              Vedyara / Contact Us
            </motion.p>

            <motion.div variants={fadeUp} custom={0.1} className="inline-flex items-center gap-3">
              <div className="w-8 h-px" style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>
                Get in Touch
              </span>
              <div className="w-8 h-px" style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }} />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={0.2}
              className="font-serif font-bold leading-tight"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#3E2F1C" }}
            >
              Let's{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #6B8E23)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Connect
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={0.3}
              className="text-lg text-gray-600 max-w-xl mx-auto"
            >
              Have a question about our products, want to place a bulk order, or just want to share
              your wellness journey? We'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "60px" }}>
            <path d="M0 60 Q360 0 720 40 Q1080 80 1440 20 L1440 60 Z" fill="#faf9f7" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif font-bold mb-3"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#3E2F1C" }}
              >
                We're Here to Help
              </motion.h2>
              <p className="text-sm text-gray-500">
                Whether you have product questions, need help with your Amazon order, or want to explore
                bulk/wholesale pricing — drop us a message.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {contactItems.map((item, i) => (
                <ContactCard key={item.label} item={item} index={i} />
              ))}
            </div>

            {/* Social Links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(62,47,28,0.5)" }}>
                Follow & Shop
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ icon: Icon, label, href, color, bg }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm"
                    style={{ background: bg, color, border: `1px solid ${color}30` }}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white shadow-lg"
              style={{ border: "1px solid rgba(62,47,28,0.06)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(62,47,28,0.5)" }}>
                Business Hours
              </p>
              {[
                { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
                { day: "Saturday", time: "9:00 AM – 4:00 PM" },
                { day: "Sunday", time: "Closed (orders accepted)" },
              ].map(({ day, time }) => (
                <div key={day} className="flex justify-between items-center py-2 border-b last:border-0"
                  style={{ borderColor: "rgba(62,47,28,0.06)" }}>
                  <span className="text-sm" style={{ color: "rgba(62,47,28,0.65)" }}>{day}</span>
                  <span className="text-sm font-semibold" style={{ color: "#3E2F1C" }}>{time}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN - FORM */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <div
              className="rounded-3xl p-8 md:p-10 relative overflow-hidden bg-white shadow-xl"
              style={{ border: "1px solid rgba(62,47,28,0.06)" }}
            >
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-bl-full"
                style={{ background: "radial-gradient(circle at top right, rgba(212,175,55,0.1) 0%, transparent 70%)" }}
              />

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative z-10"
                  >
                    <h2 className="font-serif font-bold mb-2" style={{ fontSize: "1.75rem", color: "#3E2F1C" }}>
                      Send us a Message
                    </h2>
                    <p className="text-sm mb-8" style={{ color: "rgba(62,47,28,0.55)" }}>
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                            style={{ color: "rgba(62,47,28,0.6)" }}>
                            Full Name *
                          </label>
                          <div className="relative">
                            <FiUser size={15} className="absolute left-4 top-1/2 -translate-y-1/2"
                              style={{ color: errors.name ? "#e74c3c" : "rgba(62,47,28,0.35)" }} />
                            <input
                              id="name" name="name" type="text" value={formData.name}
                              onChange={handleChange} placeholder="Your full name"
                              className="w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none"
                              style={{
                                borderColor: errors.name ? "#e74c3c" : formData.name ? "#D4AF37" : "rgba(62,47,28,0.14)",
                                background: "#FAFAF9",
                                boxShadow: errors.name ? "0 0 0 3px rgba(231,76,60,0.12)" : formData.name ? "0 0 0 3px rgba(212,175,55,0.12)" : "none",
                              }}
                            />
                          </div>
                          <AnimatePresence>
                            {errors.name && (
                              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }} className="text-xs mt-1.5" style={{ color: "#e74c3c" }}>
                                {errors.name}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                            style={{ color: "rgba(62,47,28,0.6)" }}>
                            Email Address *
                          </label>
                          <div className="relative">
                            <FiMail size={15} className="absolute left-4 top-1/2 -translate-y-1/2"
                              style={{ color: errors.email ? "#e74c3c" : "rgba(62,47,28,0.35)" }} />
                            <input
                              id="email" name="email" type="email" value={formData.email}
                              onChange={handleChange} placeholder="your@email.com"
                              className="w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none"
                              style={{
                                borderColor: errors.email ? "#e74c3c" : formData.email ? "#D4AF37" : "rgba(62,47,28,0.14)",
                                background: "#FAFAF9",
                              }}
                            />
                          </div>
                          <AnimatePresence>
                            {errors.email && (
                              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }} className="text-xs mt-1.5" style={{ color: "#e74c3c" }}>
                                {errors.email}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                          style={{ color: "rgba(62,47,28,0.6)" }}>
                          Subject
                        </label>
                        <select
                          id="subject" name="subject" value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 rounded-xl border text-sm cursor-pointer"
                          style={{ borderColor: "rgba(62,47,28,0.14)", background: "#FAFAF9" }}
                        >
                          <option value="" disabled>Select a topic…</option>
                          <option value="product-inquiry">Product Inquiry</option>
                          <option value="bulk-order">Bulk / Wholesale Order</option>
                          <option value="amazon-order">Amazon Order Help</option>
                          <option value="quality-feedback">Quality Feedback</option>
                          <option value="partnership">Farm / Business Partnership</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                          style={{ color: "rgba(62,47,28,0.6)" }}>
                          Message *
                        </label>
                        <div className="relative">
                          <FiMessageSquare size={15} className="absolute left-4 top-4"
                            style={{ color: errors.message ? "#e74c3c" : "rgba(62,47,28,0.35)" }} />
                          <textarea
                            id="message" name="message" rows={5} value={formData.message}
                            onChange={handleChange} placeholder="Tell us how we can help…"
                            className="w-full pl-10 pr-4 pt-3.5 pb-3.5 rounded-xl border text-sm resize-none transition-all focus:outline-none"
                            style={{
                              borderColor: errors.message ? "#e74c3c" : formData.message ? "#D4AF37" : "rgba(62,47,28,0.14)",
                              background: "#FAFAF9",
                              lineHeight: "1.65",
                            }}
                          />
                          <span className="absolute bottom-3 right-4 text-xs"
                            style={{ color: formData.message.length > 450 ? "#D4AF37" : "rgba(62,47,28,0.3)" }}>
                            {formData.message.length}/500
                          </span>
                        </div>
                        <AnimatePresence>
                          {errors.message && (
                            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }} className="text-xs mt-1.5" style={{ color: "#e74c3c" }}>
                              {errors.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <motion.button
                        type="submit" disabled={isSubmitting}
                        whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all"
                        style={{
                          background: isSubmitting ? "rgba(212,175,55,0.7)" : "linear-gradient(135deg, #D4AF37 0%, #e8c84a 50%, #D4AF37 100%)",
                          backgroundSize: "200% 200%",
                          color: "#3E2F1C",
                          boxShadow: isSubmitting ? "none" : "0 10px 32px rgba(212,175,55,0.45)",
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div className="w-5 h-5 border-2 border-current rounded-full"
                              style={{ borderTopColor: "transparent" }}
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }} />
                            <span>Sending…</span>
                          </>
                        ) : (
                          <>
                            <FiSend size={18} strokeWidth={2.2} />
                            <span>Send Message</span>
                          </>
                        )}
                      </motion.button>

                      {submitError && (
                        <p className="text-xs text-center" style={{ color: "#e74c3c" }}>{submitError}</p>
                      )}

                      <p className="text-xs text-center" style={{ color: "rgba(62,47,28,0.38)" }}>
                        🔒 Your information is safe with us. We never share your data with third parties.
                      </p>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="relative z-10 flex flex-col items-center justify-center text-center py-16"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.1 }}
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                      style={{
                        background: "linear-gradient(135deg, rgba(107,142,35,0.15), rgba(107,142,35,0.05))",
                        border: "2px solid rgba(107,142,35,0.3)",
                      }}
                    >
                      <FiCheck size={34} style={{ color: "#6B8E23" }} strokeWidth={3} />
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="font-serif font-bold mb-3"
                      style={{ fontSize: "1.8rem", color: "#3E2F1C" }}
                    >
                      Message Sent! 🌿
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="text-sm leading-relaxed mb-8 max-w-sm"
                      style={{ color: "rgba(62,47,28,0.62)" }}
                    >
                      Thank you, <strong>{formData.name}</strong>! We've received your message and will reply
                      to <strong>{formData.email}</strong> within 24 hours.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="flex gap-3">
                      <button
                        onClick={resetForm}
                        className="px-6 py-3 rounded-xl font-semibold text-sm"
                        style={{ background: "linear-gradient(135deg, #D4AF37, #e8c84a)", color: "#3E2F1C" }}
                      >
                        Send Another
                      </button>
                      <a
                        href="https://wa.me/919509628400"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                        style={{ background: "linear-gradient(135deg, #25D366, #1da851)", color: "white" }}
                      >
                        <FaWhatsapp size={17} />
                        WhatsApp Us
                      </a>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          FAQ SECTION
      ════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>FAQs</span>
              <div className="w-8 h-px" style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }} />
            </div>
            <h2 className="font-serif font-bold" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#3E2F1C" }}>
              Frequently Asked{" "}
              <span style={{ background: "linear-gradient(135deg, #D4AF37, #6B8E23)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Questions
              </span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
