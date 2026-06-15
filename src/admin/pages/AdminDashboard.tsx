import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiPlusCircle,
  FiList,
  FiCheckCircle,
  FiAlertCircle,
  FiBox,
} from "react-icons/fi";
import { useAdminProductSummary } from "./apiCalls";
import { AdminStatSkeleton } from "../../components/Skeletons";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const summaryQuery = useAdminProductSummary();
  const summary = summaryQuery.data;
  const totalProducts = summary?.totalProducts ?? 0;
  const inStock = summary?.activeProducts ?? 0;
  const outOfStock = summary?.outOfStockProducts ?? 0;

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Overview</h1>
          <p className="admin-page-subtitle">
            Welcome back. Here is what's happening with your inventory today.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="admin-overview-stats">
        <motion.div className="admin-overview-stat" {...fadeUp} transition={{ delay: 0 }}>
          <div className="admin-overview-stat-icon" style={{ background: "rgba(62,47,28,0.08)" }}>
            <FiBox size={20} style={{ color: "#3e2f1c" }} />
          </div>
          <span className="admin-overview-stat-label">TOTAL PRODUCTS</span>
          <span className="admin-overview-stat-value">
            {summaryQuery.isLoading ? <AdminStatSkeleton /> : totalProducts}
          </span>
        </motion.div>

        <motion.div className="admin-overview-stat" {...fadeUp} transition={{ delay: 0.08 }}>
          <div className="admin-overview-stat-icon" style={{ background: "rgba(107,142,35,0.12)" }}>
            <FiCheckCircle size={20} style={{ color: "#6B8E23" }} />
          </div>
          <span className="admin-overview-stat-label">IN STOCK PRODUCTS</span>
          <span className="admin-overview-stat-value" style={{ color: "#6B8E23" }}>
            {summaryQuery.isLoading ? <AdminStatSkeleton /> : inStock}
          </span>
        </motion.div>

        <motion.div className="admin-overview-stat" {...fadeUp} transition={{ delay: 0.16 }}>
          <div className="admin-overview-stat-icon" style={{ background: "rgba(192,57,43,0.1)" }}>
            <FiAlertCircle size={20} style={{ color: "#c0392b" }} />
          </div>
          <span className="admin-overview-stat-label">OUT OF STOCK</span>
          <span className="admin-overview-stat-value" style={{ color: "#c0392b" }}>
            {summaryQuery.isLoading ? <AdminStatSkeleton /> : outOfStock}
          </span>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <h2 className="admin-section-heading">Quick Actions</h2>
      <div className="admin-quick-actions">
        <motion.div
          className="admin-quick-action admin-quick-action-dark"
          {...fadeUp}
          transition={{ delay: 0.2 }}
          onClick={() => navigate("/admin/add-product")}
        >
          <div className="admin-quick-action-icon-wrap">
            <FiPlusCircle size={24} />
          </div>
          <div>
            <h3 className="admin-quick-action-title">Add New Product</h3>
            <p className="admin-quick-action-desc">Create a new product listing for the shop</p>
          </div>
          {/* Decorative leaf */}
          <svg className="admin-quick-action-leaf" width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M30 5C20 15 10 30 15 45c5 10 20 12 25 5 5-7 0-20-10-30-3-3-6-8-0-15z" fill="rgba(255,255,255,0.08)" />
          </svg>
        </motion.div>

        <motion.div
          className="admin-quick-action admin-quick-action-light"
          {...fadeUp}
          transition={{ delay: 0.28 }}
          onClick={() => navigate("/admin/products")}
        >
          <div className="admin-quick-action-icon-wrap-light">
            <FiList size={24} />
          </div>
          <div>
            <h3 className="admin-quick-action-title-light">View All Products</h3>
            <p className="admin-quick-action-desc-light">Browse and manage your full inventory</p>
          </div>
        </motion.div>
      </div>

      {/* Curation Excellence banner */}
      <motion.div
        className="admin-curation-banner"
        {...fadeUp}
        transition={{ delay: 0.35 }}
      >
        <div className="admin-curation-overlay" />
        <div className="admin-curation-content">
          <h3 className="admin-curation-title">Curation Excellence</h3>
          <p className="admin-curation-desc">
            Your current catalog has {summary?.lowStockProducts ?? 0} product(s) at or below the reorder threshold.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
