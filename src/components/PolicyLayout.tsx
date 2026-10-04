import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export const CONTACT_EMAIL = "vedyaraorg@gmail.com";
export const CONTACT_PHONE = "+91 95096 28400";
export const CONTACT_PHONE_HREF = "tel:+919509628400";
export const WHATSAPP_URL = "https://wa.me/919509628400";

export type PolicySection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

/* Small building blocks so policy copy stays consistent */
export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] leading-7 mb-4 last:mb-0" style={{ color: "rgba(62,47,28,0.75)" }}>
      {children}
    </p>
  );
}

export function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5 mb-4 last:mb-0">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-3 text-[15px] leading-7"
          style={{ color: "rgba(62,47,28,0.75)" }}
        >
          <span
            className="mt-[11px] w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: "#6B8E23" }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold" style={{ color: "#2a1f12" }}>{children}</strong>;
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl px-5 py-4 mb-4 last:mb-0 text-sm leading-6"
      style={{
        background: "rgba(107,142,35,0.07)",
        border: "1px solid rgba(107,142,35,0.18)",
        color: "#2D4A1E",
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Layout: hero + sticky table of contents + sections + contact
───────────────────────────────────────────────────────────── */
export default function PolicyLayout({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: PolicySection[];
}) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -65% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      {/* Hero */}
      <div
        className="pt-28 pb-12 sm:pb-14"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(212,175,55,0.12) 0%, transparent 70%)",
          borderBottom: "1px solid rgba(62,47,28,0.07)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            className="flex items-center gap-2 text-xs font-medium mb-6"
            style={{ color: "rgba(62,47,28,0.45)" }}
          >
            <Link to="/" className="hover:text-amber-700 transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: "#3E2F1C" }}>{title}</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "#6B8E23" }}
            >
              {eyebrow}
            </span>
            <h1
              className="font-serif font-bold mt-2 mb-4"
              style={{ fontSize: "clamp(1.85rem, 3.6vw, 2.6rem)", color: "#2a1f12", lineHeight: 1.15 }}
            >
              {title}
            </h1>
            <p className="text-base leading-7 max-w-2xl" style={{ color: "rgba(62,47,28,0.65)" }}>
              {intro}
            </p>
            <p className="text-xs mt-4" style={{ color: "rgba(62,47,28,0.4)" }}>
              Last updated: {updated}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* TOC */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <nav className="sticky top-28">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-3"
                style={{ color: "rgba(62,47,28,0.4)" }}
              >
                On this page
              </p>
              <ul className="space-y-1 border-l" style={{ borderColor: "rgba(62,47,28,0.1)" }}>
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="block -ml-px pl-4 py-1.5 text-sm border-l-2 transition-colors"
                      style={{
                        borderColor: active === s.id ? "#6B8E23" : "transparent",
                        color: active === s.id ? "#2D4A1E" : "rgba(62,47,28,0.55)",
                        fontWeight: active === s.id ? 600 : 400,
                      }}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Sections */}
          <div className="flex-1 min-w-0">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-28 pb-10 mb-10 border-b last:border-b-0 last:mb-0 last:pb-0"
                style={{ borderColor: "rgba(62,47,28,0.08)" }}
              >
                <h2
                  className="flex items-baseline gap-3 text-lg sm:text-xl font-semibold mb-4"
                  style={{ color: "#2a1f12" }}
                >
                  <span className="text-sm font-semibold tabular-nums" style={{ color: "#D4AF37" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </h2>
                {s.content}
              </section>
            ))}

            {/* Contact card */}
            <div
              className="mt-14 rounded-3xl p-6 sm:p-8"
              style={{ background: "linear-gradient(135deg, #1e3518 0%, #2D4A1E 100%)" }}
            >
              <h3 className="font-serif text-xl font-bold mb-2" style={{ color: "#F8F5F0" }}>
                Still have questions?
              </h3>
              <p className="text-sm mb-5" style={{ color: "rgba(248,245,240,0.65)" }}>
                Our team usually replies within one working day.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#F8F5F0" }}
                >
                  <FiMail size={15} /> {CONTACT_EMAIL}
                </a>
                <a
                  href={CONTACT_PHONE_HREF}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#F8F5F0" }}
                >
                  <FiPhone size={15} /> {CONTACT_PHONE}
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "#25D366", color: "#fff" }}
                >
                  <FaWhatsapp size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
