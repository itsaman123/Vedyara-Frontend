import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
const VdLogo = '/vedyara-logo.png'
import {
  FiGrid,
  FiBox,
  FiPlusCircle,
  FiPackage,
  FiShoppingCart,
  FiLogOut,
  FiBell,
  FiHelpCircle,
  FiExternalLink,
  FiMenu,
  FiFilm,
} from "react-icons/fi";
import {
  clearAdminToken,
  getAdminToken,
  useAdminLogin,
  useAdminProfile,
} from "./pages/apiCalls";

/* ═══════════════════════════════════════════════════════════
   SIDEBAR NAV ITEMS
═══════════════════════════════════════════════════════════ */
const mainNav = [
  { to: "/admin", icon: FiGrid, label: "Dashboard", end: true },
  { to: "/admin/products", icon: FiBox, label: "Products" },
  { to: "/admin/add-product", icon: FiPlusCircle, label: "Add Product" },
  { to: "/admin/videos", icon: FiFilm, label: "Videos" },
];

const inventoryNav = [
  { to: "/admin/inventory", icon: FiPackage, label: "Inventory" },
  { to: "/admin/orders", icon: FiShoppingCart, label: "Orders" },
];

/* ═══════════════════════════════════════════════════════════
   ADMIN LAYOUT
═══════════════════════════════════════════════════════════ */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasToken = Boolean(getAdminToken());
  const profileQuery = useAdminProfile();
  const loginMutation = useAdminLogin();
  const admin = profileQuery.data?.admin;
  const adminInitials =
    admin?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const handleLogout = () => {
    clearAdminToken();
    queryClient.clear();
    navigate("/admin");
  };

  const renderLinks = (items: typeof mainNav) =>
    items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) =>
          `admin-nav-link ${isActive ? "active" : ""}`
        }
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon size={18} />
        <span>{item.label}</span>
      </NavLink>
    ));

  if (!hasToken || profileQuery.isError) {
    return (
      <div className="admin-layout" style={{ display: "grid", placeItems: "center", padding: 24 }}>
        <form
          className="admin-card"
          onSubmit={handleLogin}
          style={{ width: "min(420px, 100%)", padding: 32 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <img src={VdLogo} alt="Vedyara" style={{ width: 46, height: 46, objectFit: "contain" }} />
            <div>
              <h1 className="admin-card-section-title" style={{ margin: 0 }}>Admin Login</h1>
              <p className="admin-card-hint" style={{ marginTop: 4 }}>Sign in to manage Vedyara</p>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Email</label>
            <input
              className="admin-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-form-group" style={{ marginTop: 18 }}>
            <label className="admin-label">Password</label>
            <input
              className="admin-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {loginMutation.isError && (
            <p style={{ color: "#c0392b", margin: "16px 0 0", fontSize: 14 }}>
              {loginMutation.error.message}
            </p>
          )}

          <button
            className="admin-btn admin-btn-primary"
            type="submit"
            disabled={loginMutation.isPending}
            style={{ width: "100%", marginTop: 24 }}
          >
            {loginMutation.isPending ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  if (profileQuery.isPending) {
    return (
      <div className="admin-layout" style={{ display: "grid", placeItems: "center" }}>
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-inner">
          {/* Brand */}
          <div className="admin-sidebar-brand">
            <div className="admin-brand-icon">

              <img
                src={VdLogo}
                alt="logo"
                style={{
                  width: "42px",
                  height: "42px",
                  objectFit: "contain",
                }}
              />
            </div>
            <div>
              <h1 className="admin-brand-title">Vedyara Admin</h1>
              <p className="admin-brand-sub">Premium Natural Wellness</p>
            </div>

          </div>

          {/* Main nav */}
          <nav className="admin-sidebar-nav">
            {renderLinks(mainNav)}

            {/* Section divider */}
            <div className="admin-nav-section-label">INVENTORY & SALES</div>
            {renderLinks(inventoryNav)}
          </nav>

          {/* Bottom actions */}
          <div className="admin-sidebar-footer">
            <button
              className="admin-view-store-btn"
              onClick={() => {
                window.open("/", "_blank");
              }}
            >
              View Live Store <FiExternalLink size={14} />
            </button>

            <button
              className="admin-nav-link admin-logout-btn"
              onClick={handleLogout}
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="admin-hamburger"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <FiMenu size={20} />
            </button>
            {/* <div className="admin-search-bar">
              <FiSearch size={16} className="admin-search-icon" />
              <input
                type="text"
                placeholder="Search product data..."
                className="admin-search-input"
              />
            </div> */}
          </div>

          <div className="admin-header-right">
            <button className="admin-header-icon-btn">
              <FiBell size={18} />
              <span className="admin-notif-dot" />
            </button>
            <button className="admin-header-icon-btn">
              <FiHelpCircle size={18} />
            </button>
            <div className="admin-header-divider" />
            <div className="admin-header-profile">
              <div className="admin-profile-info">
                <span className="admin-profile-name">{admin?.name || "Admin"}</span>
                <span className="admin-profile-role">{admin?.role?.toUpperCase() || "ADMINISTRATOR"}</span>
              </div>
              <div className="admin-avatar">
                <span>{adminInitials}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
