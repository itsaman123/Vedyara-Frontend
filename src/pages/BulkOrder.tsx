import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FiMail, FiTag, FiPackage, FiTruck, FiAward, FiCheck, FiChevronDown } from "react-icons/fi";
import { CONTACT_EMAIL } from "../components/PolicyLayout";
import { useSEO } from "../utils/seo";

const WHATSAPP_NUMBER = "919509628400";

const productOptions = ["Multiflora Honey", "Turmeric Powder", "Coriander Powder", "Combo / Gift Packs", "Other"];
const businessTypes = ["Retail / Kirana store", "Restaurant / Café / Hotel", "Ayurvedic / Wellness brand", "Distributor / Wholesaler", "Corporate gifting", "Other"];
const quantityRanges = ["10 – 50 kg", "50 – 200 kg", "200 – 500 kg", "500 kg +", "Not sure yet"];

const perks = [
  { icon: FiTag,     title: "Wholesale pricing",   text: "Tiered rates that get better as your order grows." },
  { icon: FiPackage, title: "Custom packaging",    text: "Bulk tins, retail jars, or private labelling with your brand." },
  { icon: FiAward,   title: "Lab-tested quality",  text: "FSSAI approved. Lab test reports available on request." },
  { icon: FiTruck,   title: "Pan-India delivery",  text: "Reliable freight to your door, with tracking." },
];

const process = [
  { title: "Send your enquiry", text: "Tell us what you need using the form below." },
  { title: "Get a quote",       text: "We reply with pricing and samples within 24 hours." },
  { title: "Confirm & pay",     text: "Approve the quote, packaging and delivery date." },
  { title: "We deliver",        text: "Freshly packed and shipped to your location." },
];

const faqs = [
  { q: "What is the minimum order quantity?", a: "Our bulk pricing starts from 10 kg per product. For private labelling, the minimum depends on the packaging, so share your needs and we will advise." },
  { q: "Can I get samples before ordering?", a: "Yes. We can send samples so you can check taste and quality. Sample and shipping charges are adjusted against your first bulk order." },
  { q: "Do you offer private labelling?", a: "Yes. We can pack our honey and spices under your brand name with your label design, as per FSSAI labelling rules." },
  { q: "What payment terms do you offer?", a: "First orders are usually paid in advance by bank transfer or UPI. Credit terms can be discussed for repeat business partners." },
  { q: "How long does delivery take?", a: "Most bulk orders are dispatched within 5 to 7 working days after confirmation. Delivery time depends on your location." },
];

const inputClass =
  "w-full px-4 py-3 rounded-xl text-sm bg-white outline-none transition-shadow focus:ring-2 focus:ring-[#6B8E23]/30";
const inputStyle = { border: "1px solid rgba(62,47,28,0.14)", color: "#2a1f12" };

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(62,47,28,0.6)" }}>
        {label}{required && <span style={{ color: "#c0392b" }}> *</span>}
      </span>
      {children}
    </label>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "rgba(62,47,28,0.09)" }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-4 py-4 text-left">
        <span className="text-[15px] font-medium" style={{ color: "#2a1f12" }}>{q}</span>
        <FiChevronDown
          size={18}
          className="flex-shrink-0 transition-transform duration-200"
          style={{ color: "rgba(62,47,28,0.4)", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-6" style={{ color: "rgba(62,47,28,0.65)" }}>{a}</p>
      )}
    </div>
  );
}

export default function BulkOrder() {
  const [form, setForm] = useState({
    name: "", business: "", phone: "", email: "", city: "",
    businessType: "", quantity: "", message: "",
  });
  const [products, setProducts] = useState<string[]>([]);
  const [error, setError] = useState("");

  useSEO({
    title: "Bulk & Wholesale Orders | Vedyara Honey & Spices",
    description:
      "Buy Vedyara multiflora honey, turmeric and coriander powder in bulk. Wholesale pricing, private labelling and pan-India delivery for businesses.",
    canonical: "https://vedyara.in/bulk-order",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleProduct = (p: string) =>
    setProducts((list) => (list.includes(p) ? list.filter((x) => x !== p) : [...list, p]));

  function buildMessage() {
    return [
      "Hi Vedyara, I'd like a bulk order quote.",
      "",
      `Name: ${form.name}`,
      form.business && `Business: ${form.business}`,
      form.businessType && `Business type: ${form.businessType}`,
      `Phone: ${form.phone}`,
      form.email && `Email: ${form.email}`,
      form.city && `City: ${form.city}`,
      `Products: ${products.length ? products.join(", ") : "Not specified"}`,
      form.quantity && `Approx. quantity: ${form.quantity}`,
      form.message && `\nDetails: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function validate() {
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please add your name and phone number so we can reach you.");
      return false;
    }
    if (!/^[+\d\s-]{10,15}$/.test(form.phone.trim())) {
      setError("Please enter a valid phone number.");
      return false;
    }
    setError("");
    return true;
  }

  function sendWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener");
  }

  function sendEmail() {
    if (!validate()) return;
    const subject = `Bulk Order Enquiry${form.business ? ` – ${form.business}` : ""}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage())}`;
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      {/* Hero */}
      <div
        className="pt-28 pb-14"
        style={{ background: "linear-gradient(170deg, #162811 0%, #1e3518 60%, #2D4A1E 100%)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-medium mb-6" style={{ color: "rgba(248,245,240,0.45)" }}>
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: "rgba(248,245,240,0.8)" }}>Bulk Order</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "#D4AF37" }}>
              B2B & Wholesale
            </span>
            <h1
              className="font-serif font-bold mt-2 mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 2.75rem)", color: "#F8F5F0", lineHeight: 1.15 }}
            >
              Bulk orders for your business
            </h1>
            <p className="text-base leading-7" style={{ color: "rgba(248,245,240,0.65)" }}>
              Pure honey and stone-ground spices, sourced straight from Indian farms, for
              retailers, restaurants, Ayurvedic brands, distributors and corporate gifting.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
            {perks.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
                <Icon size={20} style={{ color: "#D4AF37" }} />
                <p className="text-sm font-semibold mt-3" style={{ color: "#F8F5F0" }}>{title}</p>
                <p className="text-xs leading-5 mt-1" style={{ color: "rgba(248,245,240,0.55)" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form + process */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <form
            onSubmit={sendWhatsApp}
            className="rounded-3xl bg-white p-6 sm:p-8"
            style={{ border: "1px solid rgba(62,47,28,0.08)", boxShadow: "0 4px 30px rgba(62,47,28,0.06)" }}
          >
            <h2 className="text-xl font-semibold mb-1" style={{ color: "#2a1f12" }}>Request a quote</h2>
            <p className="text-sm mb-6" style={{ color: "rgba(62,47,28,0.55)" }}>
              Fill in what you know. We will get back to you within 24 hours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Your name" required>
                <input value={form.name} onChange={set("name")} className={inputClass} style={inputStyle} />
              </Field>
              <Field label="Business name">
                <input value={form.business} onChange={set("business")} className={inputClass} style={inputStyle} />
              </Field>
              <Field label="Phone / WhatsApp" required>
                <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+91" className={inputClass} style={inputStyle} />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={set("email")} className={inputClass} style={inputStyle} />
              </Field>
              <Field label="City">
                <input value={form.city} onChange={set("city")} className={inputClass} style={inputStyle} />
              </Field>
              <Field label="Business type">
                <select value={form.businessType} onChange={set("businessType")} className={inputClass} style={inputStyle}>
                  <option value="">Select</option>
                  {businessTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>

            <div className="mt-5">
              <span className="block text-xs font-semibold mb-2" style={{ color: "rgba(62,47,28,0.6)" }}>Products you need</span>
              <div className="flex flex-wrap gap-2">
                {productOptions.map((p) => {
                  const on = products.includes(p);
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => toggleProduct(p)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors"
                      style={{
                        background: on ? "#2D4A1E" : "#FAF8F4",
                        color: on ? "#fff" : "rgba(62,47,28,0.75)",
                        border: `1px solid ${on ? "#2D4A1E" : "rgba(62,47,28,0.12)"}`,
                      }}
                    >
                      {on && <FiCheck size={14} />} {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-5">
              <Field label="Approximate monthly quantity">
                <select value={form.quantity} onChange={set("quantity")} className={inputClass} style={inputStyle}>
                  <option value="">Select</option>
                  {quantityRanges.map((q) => <option key={q}>{q}</option>)}
                </select>
              </Field>
              <Field label="Anything else? (packaging, private label, delivery date)">
                <textarea value={form.message} onChange={set("message")} rows={4} className={`${inputClass} resize-none`} style={inputStyle} />
              </Field>
            </div>

            {error && <p className="text-sm mt-4" style={{ color: "#c0392b" }}>{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#25D366" }}
              >
                <FaWhatsapp size={17} /> Send on WhatsApp
              </button>
              <button
                type="button"
                onClick={sendEmail}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#2D4A1E" }}
              >
                <FiMail size={16} /> Send by email
              </button>
            </div>
          </form>

          {/* Process */}
          <aside>
            <h2 className="text-lg font-semibold mb-5" style={{ color: "#2a1f12" }}>How it works</h2>
            <ol className="space-y-5">
              {process.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                    style={{ background: "rgba(212,175,55,0.15)", color: "#8a6d12" }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold" style={{ color: "#2a1f12" }}>{step.title}</p>
                    <p className="text-sm mt-0.5" style={{ color: "rgba(62,47,28,0.6)" }}>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-2xl p-5 mt-8" style={{ background: "rgba(107,142,35,0.07)", border: "1px solid rgba(107,142,35,0.16)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "#2D4A1E" }}>Prefer to talk?</p>
              <p className="text-sm" style={{ color: "rgba(62,47,28,0.65)" }}>
                Call us on{" "}
                <a href="tel:+919509628400" className="font-semibold underline" style={{ color: "#2D4A1E" }}>+91 95096 28400</a>{" "}
                or email{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline" style={{ color: "#2D4A1E" }}>{CONTACT_EMAIL}</a>.
              </p>
            </div>
          </aside>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-8" style={{ color: "#2a1f12" }}>
            Bulk order FAQs
          </h2>
          <div className="border-t" style={{ borderColor: "rgba(62,47,28,0.09)" }}>
            {faqs.map((f) => <Faq key={f.q} {...f} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
