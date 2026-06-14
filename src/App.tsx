import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { initClarity } from "./analytics";

initClarity();
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

/* ── Home is eager — it's the LCP page ── */
import Home from "./pages/Home";

/* ── All other pages are lazy — they split into separate chunks ── */
const Products    = lazy(() => import("./pages/Products"));
const About       = lazy(() => import("./pages/About"));
const Contact     = lazy(() => import("./pages/Contact"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart        = lazy(() => import("./pages/Cart"));
const Wishlist    = lazy(() => import("./pages/Wishlist"));
const Checkout    = lazy(() => import("./pages/Checkout"));
const Profile             = lazy(() => import("./pages/Profile"));
const OrderConfirmation   = lazy(() => import("./pages/OrderConfirmation"));

/* ── Admin chunk (large, rarely visited) ── */
import "./admin/admin.css";
import "./admin/admin-components.css";
import "./admin/admin-pages.css";
const AdminLayout     = lazy(() => import("./admin/AdminLayout"));
const AdminDashboard  = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminProducts   = lazy(() => import("./admin/pages/AdminProducts"));
const AdminAddProduct = lazy(() => import("./admin/pages/AdminAddProduct"));
const AdminInventory  = lazy(() => import("./admin/pages/AdminInventory"));
const AdminOrders     = lazy(() => import("./admin/pages/AdminOrders"));

/* ── Minimal skeleton shown during lazy-load ── */
function PageSkeleton() {
  return (
    <div
      className="min-h-screen w-full animate-pulse"
      style={{ background: "#F8F5F0" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Page transition — lightweight fade only (no y shift)
   y-shift causes layout shift on route change
───────────────────────────────────────────────────────────── */
const pageFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit:    { opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
};

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={pageFade.initial}
      animate={pageFade.animate}
      exit={pageFade.exit}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Animated routes
───────────────────────────────────────────────────────────── */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrap><Home /></PageWrap>} />
        <Route path="/products"   element={<PageWrap><Suspense fallback={<PageSkeleton />}><Products /></Suspense></PageWrap>} />
        <Route path="/about"      element={<PageWrap><Suspense fallback={<PageSkeleton />}><About /></Suspense></PageWrap>} />
        <Route path="/contact"    element={<PageWrap><Suspense fallback={<PageSkeleton />}><Contact /></Suspense></PageWrap>} />
        <Route path="/product/:id" element={<PageWrap><Suspense fallback={<PageSkeleton />}><ProductDetail /></Suspense></PageWrap>} />
        <Route path="/cart"       element={<PageWrap><Suspense fallback={<PageSkeleton />}><Cart /></Suspense></PageWrap>} />
        <Route path="/wishlist"   element={<PageWrap><Suspense fallback={<PageSkeleton />}><Wishlist /></Suspense></PageWrap>} />
        <Route path="/checkout"              element={<PageWrap><Suspense fallback={<PageSkeleton />}><Checkout /></Suspense></PageWrap>} />
        <Route path="/order-confirmation"    element={<PageWrap><Suspense fallback={<PageSkeleton />}><OrderConfirmation /></Suspense></PageWrap>} />
        <Route path="/orders"     element={<PageWrap><Suspense fallback={<PageSkeleton />}><Profile /></Suspense></PageWrap>} />
        <Route path="/profile"    element={<PageWrap><Suspense fallback={<PageSkeleton />}><Profile /></Suspense></PageWrap>} />
        <Route path="*"           element={<PageWrap><NotFound /></PageWrap>} />
      </Routes>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────
   Simple 404 page
───────────────────────────────────────────────────────────── */
function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: "#F8F5F0", paddingTop: "80px" }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="text-7xl mb-6"
      >
        🌿
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-serif font-bold mb-3"
        style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#3E2F1C" }}
      >
        Page Not Found
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-base mb-8 max-w-sm"
        style={{ color: "rgba(62,47,28,0.6)" }}
      >
        Looks like this page wandered off. Let's bring you back home.
      </motion.p>
      <motion.a
        href="/"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #e8c84a)",
          color: "#3E2F1C",
          boxShadow: "0 10px 30px rgba(212,175,55,0.4)",
          textDecoration: "none",
        }}
      >
        ← Back to Home
      </motion.a>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Scroll restoration
───────────────────────────────────────────────────────────── */
function RouteScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.search]);
  return null;
}

/* ═══════════════════════════════════════════════════════════
   LAYOUT WRAPPER
═══════════════════════════════════════════════════════════ */
function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index            element={<AdminDashboard />} />
            <Route path="products"  element={<AdminProducts />} />
            <Route path="add-product" element={<AdminAddProduct />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders"    element={<AdminOrders />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen" style={{ zIndex: 1 }}>
      <Navbar />
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  return (
    <Router>
      <RouteScrollToTop />
      <AppShell />
    </Router>
  );
}
