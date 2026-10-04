import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiCheck,
  FiHeart,
  FiShare2,
  FiExternalLink,
  FiZoomIn,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiPackage,
  FiArrowRight,
} from "react-icons/fi";
import { useProduct, useProducts, type Product as ApiProduct } from "../api/productApi";
import { products as localProducts, type Product } from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import { ProductDetailSkeleton, ProductCardSkeleton } from "../components/Skeletons";
import ProductCard from "../components/ProductCard";
import RotatingSeal from "../components/RotatingSeal";
import { AMAZON_STORE_URL, MEESHO_STORE_URL } from "../config/environment";
import { useSEO } from "../utils/seo";

/* ─────────────────────────────────────────────────────────────
   STATIC CONFIG
───────────────────────────────────────────────────────────── */
const INK = "#2a1f12";
const MUTED = "rgba(62,47,28,0.62)";
const SUBTLE = "rgba(62,47,28,0.45)";
const LINE = "rgba(62,47,28,0.09)";

const categoryLabels: Record<string, string> = {
  honey:  "Honey",
  spices: "Spices & Powders",
};

const honeyAttributes = [
  { label: "Aroma",           value: "Wildflower, forest blooms" },
  { label: "Taste",           value: "Sweet, mildly earthy" },
  { label: "Source",          value: "Multiflora, India" },
  { label: "Crystallisation", value: "May crystallise naturally" },
];

const spiceAttributes = [
  { label: "Origin",   value: "Farm sourced, India" },
  { label: "Process",  value: "Stone ground" },
  { label: "Purity",   value: "100% pure, no additives" },
  { label: "Best for", value: "Cooking & wellness" },
];

const honeyNutrition = [
  { label: "Energy",        per100g: "304 kcal", perServing: "~18 kcal" },
  { label: "Carbohydrates", per100g: "82.1 g",   perServing: "4.9 g"    },
  { label: "Total Sugars",  per100g: "76.8 g",   perServing: "4.6 g"    },
  { label: "Protein",       per100g: "0.3 g",    perServing: "0.02 g"   },
  { label: "Total Fat",     per100g: "0 g",      perServing: "0 g"      },
  { label: "Sodium",        per100g: "4 mg",     perServing: "0.24 mg"  },
];

const assurances = [
  { icon: FiTruck,     title: "Pan-India delivery", text: "Shipped with tracking" },
  { icon: FiShield,    title: "Lab tested",         text: "FSSAI approved" },
  { icon: FiRefreshCw, title: "Easy returns",       text: "On damaged or wrong items", to: "/returns-cancellations" },
];

/* ─────────────────────────────────────────────────────────────
   STAR RATING
───────────────────────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24">
          <path
            d="M12 2l2.9 8.7H23l-7.4 5.4 2.8 8.7L12 19.4l-6.4 5.4 2.8-8.7L1 10.7h8.1z"
            fill={s <= Math.round(rating) ? "#D4AF37" : "rgba(212,175,55,0.22)"}
          />
        </svg>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DETAIL TABS
───────────────────────────────────────────────────────────── */
type Tab = { id: string; label: string; content: React.ReactNode };

function DetailTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div
        className="flex gap-6 sm:gap-8 overflow-x-auto border-b"
        style={{ borderColor: LINE, scrollbarWidth: "none" }}
        role="tablist"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className="relative py-3.5 text-sm font-medium whitespace-nowrap transition-colors"
            style={{ color: active === t.id ? INK : SUBTLE }}
          >
            {t.label}
            {active === t.id && (
              <motion.span
                layoutId="pd-tab-underline"
                className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full"
                style={{ background: "#6B8E23" }}
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="py-7 text-[15px] leading-7"
          style={{ color: MUTED }}
        >
          {current.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   RELATED PRODUCTS
───────────────────────────────────────────────────────────── */
function RelatedProducts({
  currentId,
  currentSlug,
  category,
}: {
  currentId?: string;
  currentSlug?: string;
  category?: string;
}) {
  const navigate = useNavigate();
  const { data, isLoading } = useProducts({ limit: 24 });

  const related = useMemo(() => {
    const items = (data?.items ?? []).filter(
      (p) => p._id !== currentId && p.slug !== currentSlug && p.status !== "draft" && p.status !== "inactive",
    );
    // Same category first, then featured, then the rest
    return [...items]
      .sort((a, b) => {
        const same = (p: ApiProduct) => Number(p.category?.toLowerCase() === category?.toLowerCase());
        const cat = same(b) - same(a);
        return cat !== 0 ? cat : Number(b.featured) - Number(a.featured);
      })
      .slice(0, 8);
  }, [data, currentId, currentSlug, category]);

  if (!isLoading && related.length === 0) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <div className="flex items-end justify-between gap-4 mb-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] mb-1.5" style={{ color: "#6B8E23" }}>
            Complete your pantry
          </p>
          <h2 className="font-serif text-2xl sm:text-[1.75rem] font-bold" style={{ color: INK }}>
            You may also like
          </h2>
        </div>
        <Link
          to="/products"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all"
          style={{ color: "#2D4A1E" }}
        >
          View all <FiArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : related.map((p: ApiProduct, i) => (
              <ProductCard
                key={p._id}
                product={p}
                index={i}
                onView={(prod) => navigate(`/product/${prod.slug}`)}
              />
            ))}
      </div>

      <Link
        to="/products"
        className="sm:hidden mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold py-3 rounded-xl border"
        style={{ color: "#2D4A1E", borderColor: "rgba(45,74,30,0.2)" }}
      >
        View all products <FiArrowRight size={15} />
      </Link>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   DAILY RITUALS — ways to use the product
───────────────────────────────────────────────────────────── */
type Ritual = { emoji: string; title: string; text: string };

const rituals: Record<"honey" | "turmeric" | "coriander" | "spice", Ritual[]> = {
  honey: [
    { emoji: "☀️", title: "Morning warm water", text: "A spoonful in a glass of warm water, first thing in the day." },
    { emoji: "🍵", title: "In your tea", text: "Stir in once the tea cools a little, so the flavour stays bright." },
    { emoji: "🥣", title: "Over oats & fruit", text: "Drizzle over oats, muesli, curd or a bowl of cut fruit." },
    { emoji: "🍞", title: "On warm toast", text: "Spread thin on toast or rotis for a quick, simple treat." },
  ],
  turmeric: [
    { emoji: "🥛", title: "Golden milk", text: "Half a teaspoon in warm milk with a pinch of black pepper." },
    { emoji: "🍛", title: "Dal & curries", text: "Add early to the tadka so the colour blooms in the oil." },
    { emoji: "🍗", title: "Marinades", text: "Mix with curd, salt and chilli for paneer, veggies or meat." },
    { emoji: "🥗", title: "Roasted veggies", text: "Toss with oil before roasting for colour and warmth." },
  ],
  coriander: [
    { emoji: "🍛", title: "Curries & gravies", text: "Adds body and a mellow, citrusy depth to any masala." },
    { emoji: "🥘", title: "Everyday sabzi", text: "A spoonful near the end lifts dry vegetable dishes." },
    { emoji: "🌿", title: "Chutneys & raita", text: "Stir into chutneys, raita or buttermilk for aroma." },
    { emoji: "🔥", title: "Spice rubs", text: "Blend with cumin and chilli for grills and tikkas." },
  ],
  spice: [
    { emoji: "🍛", title: "Dal & curries", text: "Add to the tadka so the aroma blooms in the oil." },
    { emoji: "🥘", title: "Everyday sabzi", text: "A spoonful lifts dry vegetable dishes." },
    { emoji: "🍗", title: "Marinades", text: "Mix with curd and salt for paneer, veggies or meat." },
    { emoji: "🔥", title: "Spice rubs", text: "Blend with other spices for grills and tikkas." },
  ],
};

const ritualTints = ["#FFF5DC", "#EEF5E2", "#FCEBDD", "#F3EEE6"];

function DailyRituals({ kind, name }: { kind: keyof typeof rituals; name: string }) {
  const list = rituals[kind];
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] mb-1.5" style={{ color: "#6B8E23" }}>
          Daily rituals
        </p>
        <h2 className="font-serif text-2xl sm:text-[1.75rem] font-bold" style={{ color: INK }}>
          Four simple ways to enjoy it
        </h2>
        <p className="text-sm mt-2" style={{ color: MUTED }}>
          Little habits with {name}.
        </p>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* dashed connector behind the cards (desktop) */}
        <svg className="hidden lg:block absolute left-0 right-0 top-12 w-full h-8 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 10" aria-hidden="true">
          <path d="M2 5 C 20 0, 30 10, 50 5 S 80 0, 98 5" fill="none" stroke="#D4AF37" strokeWidth="0.25" strokeDasharray="1 1.2" vectorEffect="non-scaling-stroke" />
        </svg>

        {list.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 24, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
            whileHover={{ rotate: 0, y: -6 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
            className="relative rounded-3xl p-6 pt-7"
            style={{ background: ritualTints[i % ritualTints.length], boxShadow: "0 10px 30px rgba(62,47,28,0.06)" }}
          >
            <span
              className="absolute top-4 right-5 font-serif font-bold text-5xl leading-none"
              style={{ color: "transparent", WebkitTextStroke: "1px rgba(62,47,28,0.15)" }}
            >
              {i + 1}
            </span>
            <span className="relative z-10 w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm mb-5">
              {r.emoji}
            </span>
            <h3 className="font-sans text-base font-semibold mb-1.5" style={{ color: INK }}>{r.title}</h3>
            <p className="text-sm leading-6" style={{ color: MUTED }}>{r.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   HONEY DRIP DIVIDER
───────────────────────────────────────────────────────────── */
// x in % of width, h in px (the SVG is 64px tall and stretches horizontally,
// so drip widths are kept tiny in viewBox units to stay slim on screen)
const drips = [
  { x: 6, h: 22 }, { x: 14, h: 44 }, { x: 23, h: 16 }, { x: 33, h: 52 },
  { x: 41, h: 26 }, { x: 52, h: 38 }, { x: 61, h: 18 }, { x: 70, h: 48 },
  { x: 79, h: 24 }, { x: 88, h: 40 }, { x: 95, h: 20 },
];

function HoneyDrip({ background = "#F8F5F0" }: { background?: string }) {
  return (
    <div className="relative h-16 -mb-px" style={{ background }} aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 64" preserveAspectRatio="none">
        <defs>
          <linearGradient id="drip-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E9C25A" />
            <stop offset="1" stopColor="#C9961A" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="5" fill="url(#drip-gold)" />
        {drips.map((d) => (
          <path
            key={d.x}
            d={`M${d.x - 1.6} 4 C${d.x - 0.9} 7, ${d.x - 0.7} ${d.h - 7}, ${d.x - 0.7} ${d.h - 5} C${d.x - 0.7} ${d.h + 1}, ${d.x + 0.7} ${d.h + 1}, ${d.x + 0.7} ${d.h - 5} C${d.x + 0.7} ${d.h - 7}, ${d.x + 0.9} 7, ${d.x + 1.6} 4 Z`}
            fill="url(#drip-gold)"
          />
        ))}
      </svg>
      {drips.filter((_, i) => i % 2 === 1).map((d, i) => (
        <span
          key={d.x}
          className="honey-drop absolute w-2 h-2.5 rounded-full"
          style={{
            left: `calc(${d.x}% - 4px)`,
            top: d.h - 2,
            background: "#D4A12A",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            animation: `honeyDropFall 2.8s ease-in ${i * 0.7}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRODUCT DETAIL PAGE
───────────────────────────────────────────────────────────── */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();

  function handleImageMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = imgWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }

  const localProduct = useMemo(
    () => localProducts.find((p) => String(p.id) === id),
    [id],
  );

  const { data: apiProduct, isLoading, isError } = useProduct(id || "");

  const product = useMemo(() => {
    if (localProduct) return localProduct;
    if (!apiProduct) return null;
    return {
      _id:           apiProduct._id,
      id:            apiProduct._id,
      name:          apiProduct.name,
      category:      apiProduct.category,
      price:         `₹${apiProduct.discountedPrice !== null ? apiProduct.discountedPrice : apiProduct.price}`,
      originalPrice: apiProduct.discountedPrice !== null ? `₹${apiProduct.price}` : undefined,
      badge:         apiProduct.featured ? "Best Seller" : apiProduct.stock < 10 ? "Limited" : "Natural",
      image:         apiProduct.images[0] || "",
      images:        apiProduct.images.length > 0 ? apiProduct.images : [apiProduct.images[0] || ""],
      description:   apiProduct.description,
      shortDesc:     apiProduct.shortDescription || apiProduct.description.slice(0, 100),
      benefits:      apiProduct.tags?.length > 0 ? apiProduct.tags : ["100% Natural", "Lab Tested", "Pure"],
      weight:        apiProduct.unit,
      amazonLink:    "#",
      rating:        4.8,
      reviews:       124,
      limited:       apiProduct.stock < 10,
      featured:      apiProduct.featured,
    } as Product;
  }, [localProduct, apiProduct]);

  const liked    = product ? isInWishlist(product.id as string) : false;
  // Category casing varies in the admin data ("honey" vs "Honey")
  const categoryKey = product?.category?.toLowerCase() ?? "";
  const isHoney  = categoryKey === "honey";
  const attributes = isHoney ? honeyAttributes : spiceAttributes;

  const productTitle = product
    ? isHoney
      ? `${product.name} | Vedyara Multi Flora Honey — Pure & Raw`
      : `${product.name} | Vedyara Natural ${product.category === "spices" ? "Spices" : "Products"}`
    : "Vedyara Products";

  const productDesc = product
    ? isHoney
      ? `Buy ${product.name} from Vedyara. Pure multiflora honey — raw, unprocessed, lab-tested. ${product.shortDesc || ""}`
      : `Buy ${product.name} from Vedyara. 100% natural, farm-sourced, lab-tested. ${product.shortDesc || ""}`
    : "";

  useSEO({
    title:       productTitle,
    description: productDesc.slice(0, 160),
    keywords:    isHoney
      ? `${product?.name ?? "vedyara"}, vedyara multi flora honey, multiflora honey, vedyara honey, pure honey, raw honey india`
      : `${product?.name ?? "vedyara"}, vedyara natural products, pure spices india`,
    canonical:   id ? `https://vedyara.in/product/${id}` : undefined,
    image:       product?.image || undefined,
    structuredData: product
      ? {
          "@context": "https://schema.org",
          "@type":    "Product",
          name:       product.name,
          ...(isHoney && {
            alternateName: ["Vedyara Multi Flora Honey", "Vedyara Multiflora Honey"],
          }),
          description: product.shortDesc || product.description,
          brand: { "@type": "Brand", name: "Vedyara" },
          image: product.images,
          category: isHoney ? "Natural Honey" : product.category,
          offers: ["Meesho", "Amazon"].map((seller) => ({
            "@type":        "Offer",
            availability:   apiProduct?.status === "out_of_stock" || apiProduct?.stock === 0
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
            priceCurrency:  "INR",
            price:          product.price.replace(/[^\d.]/g, ""),
            url:            seller === "Meesho" ? MEESHO_STORE_URL : AMAZON_STORE_URL,
            seller:         { "@type": "Organization", name: seller },
          })),
        }
      : undefined,
  });

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product?.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      /* user dismissed the share sheet */
    }
  }

  // Sticky buy bar: show once the main buttons have scrolled above the viewport
  const productLoaded = !!product;
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [productLoaded]);

  /* ── Loading / error ── */
  if (isLoading) return <ProductDetailSkeleton />;
  if (isError || (!isLoading && !product)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-serif font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="text-amber-600 font-bold hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }
  if (!product) return null;

  /* ── Computed ── */
  const discount = product.originalPrice
    ? Math.round(
        (1 -
          parseInt(product.price.replace(/\D/g, "")) /
          parseInt(product.originalPrice.replace(/\D/g, ""))) *
        100,
      )
    : null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const selectedImage = images[selectedIdx] ?? images[0];

  // Marketplace-style names ("Name | Claim | Claim") read badly as one giant
  // heading — show the first part as the title and the rest as a subtitle.
  const [shortName, ...nameClaims] = product.name.split(/\s*\|\s*/);

  // "unit"/"pcs" is a placeholder, not a weight worth showing
  const weightLabel = product.weight && !/^(unit|units|pcs?|piece)$/i.test(product.weight.trim())
    ? product.weight
    : "";

  // Use the admin's short description; otherwise trim the full description
  // to whole sentences/words instead of cutting mid-word.
  const summary = (() => {
    const short = apiProduct?.shortDescription?.trim();
    // Some stored short descriptions are themselves cut mid-sentence; only
    // trust one that ends like a sentence.
    if (short && /[.!?]$/.test(short)) return short;
    const src = (product.description || short || "").trim();
    if (src.length <= 220) return src;
    const cut = src.slice(0, 220);
    const sentenceEnd = cut.lastIndexOf(". ");
    return sentenceEnd > 80 ? cut.slice(0, sentenceEnd + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
  })();

  const lowerName = product.name.toLowerCase();
  const ritualKind: keyof typeof rituals = isHoney
    ? "honey"
    : /turmeric|haldi/.test(lowerName)
      ? "turmeric"
      : /coriander|dhaniya/.test(lowerName)
        ? "coriander"
        : "spice";

  const stock = apiProduct?.stock;
  const outOfStock = apiProduct?.status === "out_of_stock" || stock === 0;
  const stockLabel = outOfStock
    ? { text: "Out of stock", bg: "rgba(192,57,43,0.08)", color: "#a3311f" }
    : stock !== undefined && stock < 10
      ? { text: `Only ${stock} left`, bg: "rgba(212,175,55,0.14)", color: "#8a6d12" }
      : { text: "In stock", bg: "rgba(107,142,35,0.1)", color: "#3d6b1a" };

  const tabs: Tab[] = [
    {
      id: "description",
      label: "Description",
      content: <p className="max-w-3xl whitespace-pre-line">{product.description}</p>,
    },
    {
      id: "benefits",
      label: "Benefits",
      content: (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-3xl">
          {product.benefits.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={{ background: "rgba(107,142,35,0.14)" }}
              >
                <FiCheck size={12} strokeWidth={3} style={{ color: "#3d6b1a" }} />
              </span>
              <span style={{ color: INK }}>{b}</span>
            </li>
          ))}
        </ul>
      ),
    },
    ...(isHoney
      ? [
          {
            id: "nutrition",
            label: "Nutrition",
            content: (
              <div className="max-w-xl">
                <p className="mb-3 text-sm" style={{ color: SUBTLE }}>
                  Serving size: 6 g (1 teaspoon)
                </p>
                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: LINE }}>
                  <div
                    className="grid grid-cols-3 text-xs font-semibold uppercase tracking-wider px-4 py-2.5"
                    style={{ background: "#F6F2EA", color: SUBTLE }}
                  >
                    <span>Nutrient</span>
                    <span className="text-center">Per 100 g</span>
                    <span className="text-right">Per serving</span>
                  </div>
                  {honeyNutrition.map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-3 text-sm px-4 py-2.5 border-t"
                      style={{ borderColor: LINE }}
                    >
                      <span style={{ color: INK }}>{row.label}</span>
                      <span className="text-center">{row.per100g}</span>
                      <span className="text-right">{row.perServing}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs" style={{ color: SUBTLE }}>
                  * Approximate values. Natural products vary slightly from batch to batch.
                </p>
              </div>
            ),
          },
        ]
      : []),
    {
      id: "details",
      label: "Product details",
      content: (
        <dl className="max-w-2xl divide-y" style={{ borderColor: LINE }}>
          {[
            { label: "Brand",             value: "Vedyara" },
            ...(weightLabel ? [{ label: "Net weight", value: weightLabel }] : []),
            { label: "Category",          value: categoryLabels[categoryKey] || product.category },
            { label: "Country of origin", value: "India" },
            { label: "Certifications",    value: "FSSAI approved, lab tested" },
            { label: "Storage",           value: "Store in a cool, dry place away from direct sunlight" },
            { label: "Shelf life",        value: "24 months from date of manufacture" },
          ].map((row) => (
            <div key={row.label} className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4 py-3 text-sm" style={{ borderColor: LINE }}>
              <dt style={{ color: SUBTLE }}>{row.label}</dt>
              <dd style={{ color: INK }}>{row.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: "returns",
      label: "Returns",
      content: (
        <div className="max-w-3xl space-y-3">
          <p>
            Received a damaged, tampered or wrong product? We will replace it or refund you in full.
          </p>
          <p>
            <span className="font-medium" style={{ color: INK }}>Sealed products</span> can be returned
            within 7 days of delivery. <span className="font-medium" style={{ color: INK }}>Opened products</span>{" "}
            cannot be returned for food-safety reasons, but if you are unhappy with the quality, send us a
            photo or video within 48 hours.
          </p>
          <p>Orders from Amazon or Meesho are handled through that marketplace's return portal.</p>
          <Link
            to="/returns-cancellations"
            className="inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: "#2D4A1E" }}
          >
            Read the full returns policy <FiArrowRight size={14} />
          </Link>
        </div>
      ),
    },
  ];

  /* ─────────────────── JSX ─────────────────── */
  return (
    <div className="min-h-screen" style={{ background: "#FDFCFB" }}>

      {/* ── Breadcrumb ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-5">
        <nav className="flex items-center gap-2 text-xs min-w-0" style={{ color: SUBTLE }}>
          <Link to="/" className="hover:text-amber-700 transition-colors flex-shrink-0">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-amber-700 transition-colors flex-shrink-0">Products</Link>
          <span>/</span>
          <span className="truncate" style={{ color: INK }}>{shortName}</span>
        </nav>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 lg:gap-14 items-start">

          {/* ══════════════════════════════════════════
              LEFT — Image Gallery
          ══════════════════════════════════════════ */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-3">
            <div className="flex gap-3">

              {/* Vertical thumbnail rail (desktop) */}
              {images.length > 1 && (
                <div
                  className="hidden sm:flex flex-col gap-2 flex-shrink-0 w-16 max-h-[520px] overflow-y-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedIdx(idx)}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white p-1 border transition-all duration-150"
                      style={{
                        borderColor: selectedIdx === idx ? "#6B8E23" : LINE,
                        boxShadow: selectedIdx === idx ? "0 0 0 2px rgba(107,142,35,0.2)" : "none",
                      }}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div
                ref={imgWrapRef}
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
                onMouseMove={handleImageMouseMove}
                className="relative flex-1 min-w-0 rounded-2xl overflow-hidden aspect-square bg-white"
                style={{ border: `1px solid ${LINE}` }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={selectedImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-3 sm:p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>

                <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
                  <RotatingSeal
                    size={84}
                    center={isHoney ? "🍯" : "🌿"}
                    text={isHoney ? "100% PURE · RAW · LAB TESTED · " : "STONE GROUND · NO ADDITIVES · "}
                    color={isHoney ? "#9A7012" : "#3d6b1a"}
                  />
                </div>

                {discount && (
                  <span
                    className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md text-xs font-semibold text-white"
                    style={{ background: "#2D4A1E" }}
                  >
                    {discount}% off
                  </span>
                )}

                {/* Zoom overlay (desktop hover) */}
                {zoom && (
                  <div
                    className="absolute inset-0 z-30 hidden lg:block"
                    style={{
                      backgroundImage: `url(${selectedImage})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "210%",
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundColor: "#fff",
                    }}
                  />
                )}

                <div
                  className="hidden lg:flex absolute bottom-3 right-3 z-20 items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium pointer-events-none transition-opacity"
                  style={{ background: "rgba(255,255,255,0.92)", color: SUBTLE, opacity: zoom ? 0 : 1, border: `1px solid ${LINE}` }}
                >
                  <FiZoomIn size={12} /> Hover to zoom
                </div>
              </div>
            </div>

            {/* Thumbnail strip (mobile) */}
            {images.length > 1 && (
              <div className="flex sm:hidden gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIdx(idx)}
                    className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white p-1 border"
                    style={{ borderColor: selectedIdx === idx ? "#6B8E23" : LINE }}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════
              RIGHT — Product Info
          ══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] mb-2" style={{ color: "#6B8E23" }}>
              {categoryLabels[categoryKey] || product.category}
            </p>

            <h1
              className="font-sans font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.4rem, 2.1vw, 1.8rem)", lineHeight: 1.25, color: INK }}
            >
              {shortName}
            </h1>
            {nameClaims.length > 0 && (
              <p className="mt-2 text-[15px] leading-6" style={{ color: MUTED }}>
                {nameClaims.join(" · ")}
              </p>
            )}

            {/* Rating + stock */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4">
              <div className="flex items-center gap-1.5">
                <StarRating rating={product.rating} />
                <span className="text-sm font-semibold" style={{ color: INK }}>{product.rating}</span>
                <span className="text-sm" style={{ color: SUBTLE }}>({product.reviews} reviews)</span>
              </div>
              <span className="w-px h-4" style={{ background: LINE }} />
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: stockLabel.bg, color: stockLabel.color }}
              >
                {stockLabel.text}
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: LINE }}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-3xl font-semibold tracking-tight" style={{ color: INK }}>
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-base line-through" style={{ color: SUBTLE }}>
                    MRP {product.originalPrice}
                  </span>
                )}
                {discount && (
                  <span className="text-sm font-semibold" style={{ color: "#3d6b1a" }}>
                    Save {discount}%
                  </span>
                )}
              </div>
              <p className="text-xs mt-1" style={{ color: SUBTLE }}>
                Inclusive of all taxes{weightLabel ? ` · ${weightLabel}` : ""}
              </p>
            </div>

            {/* Short description */}
            {summary && (
              <p className="mt-5 text-[15px] leading-7" style={{ color: MUTED }}>
                {summary}
              </p>
            )}

            {/* Key attributes */}
            <dl className="grid grid-cols-2 gap-px mt-6 rounded-xl overflow-hidden border" style={{ borderColor: LINE, background: LINE }}>
              {attributes.map((attr) => (
                <div key={attr.label} className="px-4 py-3" style={{ background: "#FDFCFB" }}>
                  <dt className="text-[11px] font-medium uppercase tracking-wider" style={{ color: SUBTLE }}>
                    {attr.label}
                  </dt>
                  <dd className="text-sm font-medium mt-0.5" style={{ color: INK }}>{attr.value}</dd>
                </div>
              ))}
            </dl>

            {/* CTAs */}
            <div ref={ctaRef} className="mt-6 flex flex-col gap-2.5">
              <div className="flex gap-2.5">
                <a
                  href={MEESHO_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-[15px] text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ background: "#a30089", boxShadow: "0 8px 22px rgba(163,0,137,0.25)" }}
                >
                  Buy on Meesho <FiExternalLink size={16} />
                </a>
                <button
                  onClick={() => toggleWishlist(product as never)}
                  aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                  className="w-12 h-12 flex items-center justify-center rounded-xl border transition-colors"
                  style={{
                    borderColor: liked ? "#c0392b" : "rgba(62,47,28,0.15)",
                    background: liked ? "rgba(192,57,43,0.06)" : "transparent",
                    color: liked ? "#c0392b" : MUTED,
                  }}
                >
                  <FiHeart size={18} fill={liked ? "#c0392b" : "transparent"} />
                </button>
                <button
                  onClick={handleShare}
                  aria-label="Share"
                  className="w-12 h-12 flex items-center justify-center rounded-xl border transition-colors hover:bg-black/[0.02]"
                  style={{ borderColor: "rgba(62,47,28,0.15)", color: MUTED }}
                >
                  <FiShare2 size={17} />
                </button>
              </div>
              <a
                href={AMAZON_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-[15px] transition-colors hover:bg-[#fff4e0]"
                style={{ color: "#a35f00", border: "1px solid rgba(255,153,0,0.4)", background: "#FFFAF1" }}
              >
                Buy on Amazon <FiExternalLink size={16} />
              </a>
              <p className="text-xs text-center mt-1" style={{ color: SUBTLE }}>
                Direct checkout on vedyara.in is coming soon.
              </p>
            </div>

            {/* Assurances */}
            <div className="grid grid-cols-3 gap-2 mt-6">
              {assurances.map(({ icon: Icon, title, text, to }) => {
                const inner = (
                  <>
                    <Icon size={18} style={{ color: "#6B8E23" }} />
                    <p className="text-xs font-semibold mt-2" style={{ color: INK }}>{title}</p>
                    <p className="text-[11px] leading-4 mt-0.5" style={{ color: SUBTLE }}>{text}</p>
                  </>
                );
                const cls = "rounded-xl p-3 text-center flex flex-col items-center";
                const style = { background: "#F7F4EE" };
                return to ? (
                  <Link key={title} to={to} className={`${cls} hover:bg-[#f0ebe1] transition-colors`} style={style}>{inner}</Link>
                ) : (
                  <div key={title} className={cls} style={style}>{inner}</div>
                );
              })}
            </div>

            {/* Bulk nudge */}
            <Link
              to="/bulk-order"
              className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors hover:bg-[#f7f4ee]"
              style={{ borderColor: LINE }}
            >
              <FiPackage size={18} style={{ color: "#8a6d12" }} />
              <span className="text-sm flex-1" style={{ color: MUTED }}>
                Buying for a business? <span className="font-semibold" style={{ color: INK }}>Get bulk pricing</span>
              </span>
              <FiArrowRight size={15} style={{ color: SUBTLE }} />
            </Link>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════
            DETAILS TABS
        ══════════════════════════════════════════ */}
        <div className="mt-14 lg:mt-20">
          <DetailTabs tabs={tabs} />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DAILY RITUALS
      ══════════════════════════════════════════ */}
      <DailyRituals kind={ritualKind} name={shortName} />

      {/* ══════════════════════════════════════════
          RELATED PRODUCTS
      ══════════════════════════════════════════ */}
      <HoneyDrip />
      <div style={{ background: "#F8F5F0" }}>
        <RelatedProducts
          currentId={apiProduct?._id}
          currentSlug={id}
          category={product.category}
        />
      </div>

      {/* ══════════════════════════════════════════
          A+ CONTENT — Brand Story Gallery
      ══════════════════════════════════════════ */}
      {images.length > 1 && (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] mb-1.5" style={{ color: "#6B8E23" }}>
              From Vedyara
            </p>
            <h2 className="font-serif text-2xl sm:text-[1.75rem] font-bold" style={{ color: INK }}>
              A closer look
            </h2>
          </div>
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            {images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: LINE }}
              >
                <img
                  src={img}
                  alt={`${shortName} — detail ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          STICKY BUY BAR
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-30 px-3 pb-3 sm:px-6 sm:pb-5 pointer-events-none"
          >
            <div
              className="pointer-events-auto max-w-3xl mx-auto flex items-center gap-3 rounded-2xl p-2.5 pr-3"
              style={{
                background: "rgba(255,255,255,0.94)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${LINE}`,
                boxShadow: "0 18px 50px rgba(42,31,18,0.18)",
              }}
            >
              <img src={images[0]} alt="" className="w-12 h-12 rounded-xl object-contain bg-white flex-shrink-0" style={{ border: `1px solid ${LINE}` }} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate" style={{ color: INK }}>{shortName}</p>
                <p className="text-sm" style={{ color: INK }}>
                  <span className="font-semibold">{product.price}</span>
                  {product.originalPrice && (
                    <span className="ml-2 text-xs line-through" style={{ color: SUBTLE }}>{product.originalPrice}</span>
                  )}
                </p>
              </div>
              <a
                href={AMAZON_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold"
                style={{ color: "#a35f00", border: "1px solid rgba(255,153,0,0.4)", background: "#FFFAF1" }}
              >
                Amazon <FiExternalLink size={14} />
              </a>
              <a
                href={MEESHO_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                style={{ background: "#a30089" }}
              >
                Buy on Meesho <FiExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
