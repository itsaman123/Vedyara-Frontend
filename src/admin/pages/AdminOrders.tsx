import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiDownload,
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
} from "react-icons/fi";
import { useAdminOrders, useAdminOrderSummary, type AdminOrder } from "./apiCalls";
import { useDebounce } from "../useDebounce";
import { AdminStatSkeleton, AdminOrderTableSkeleton } from "../../components/Skeletons";

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS: { label: string; value: AdminOrder["status"] | "" }[] = [
  { label: "All Orders", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const getStatusClass = (status: AdminOrder["status"]) => {
  switch (status) {
    case "delivered": return "in-stock";
    case "cancelled": return "out-of-stock";
    case "pending": return "pending";
    case "shipped": return "shipped";
    default: return "in-stock";
  }
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(value),
  );

export default function AdminOrders() {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminOrder["status"] | "">("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchInput, 400);

  const ordersQuery = useAdminOrders({
    page,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
    status: statusFilter || undefined,
  });
  const summaryQuery = useAdminOrderSummary();
  const orders = ordersQuery.data?.items ?? [];
  const pagination = ordersQuery.data?.pagination;
  const totalPages = pagination?.pages ?? 1;
  const totalOrders = pagination?.total ?? 0;
  const summary = summaryQuery.data;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(orders, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vedyara-orders.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">Monitor sales and fulfillments.</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-outline" onClick={handleExport}>
            <FiDownload size={13} /> Export
          </button>
        </div>
      </div>

      <div className="admin-overview-stats">
        <div className="admin-overview-stat">
          <div className="admin-overview-stat-icon" style={{ background: "rgba(62,47,28,0.08)" }}>
            <FiShoppingCart size={18} style={{ color: "#3e2f1c" }} />
          </div>
          <span className="admin-overview-stat-label">Total Orders</span>
          <span className="admin-overview-stat-value">
            {summaryQuery.isLoading ? <AdminStatSkeleton /> : summary?.totalOrders ?? 0}
          </span>
        </div>
        <div className="admin-overview-stat">
          <div className="admin-overview-stat-icon" style={{ background: "rgba(107,142,35,0.12)" }}>
            <FiShoppingCart size={18} style={{ color: "#6B8E23" }} />
          </div>
          <span className="admin-overview-stat-label">Completed</span>
          <span className="admin-overview-stat-value" style={{ color: "#6B8E23" }}>
            {summaryQuery.isLoading ? <AdminStatSkeleton /> : summary?.completedOrders ?? 0}
          </span>
        </div>
        <div className="admin-overview-stat">
          <div className="admin-overview-stat-icon" style={{ background: "rgba(212,175,55,0.1)" }}>
            <FiShoppingCart size={18} style={{ color: "#b8961f" }} />
          </div>
          <span className="admin-overview-stat-label">In Progress</span>
          <span className="admin-overview-stat-value" style={{ color: "#b8961f" }}>
            {summaryQuery.isLoading ? <AdminStatSkeleton /> : summary?.inProgressOrders ?? 0}
          </span>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <FiSearch size={14} className="admin-toolbar-search-icon" />
          <input
            type="text"
            placeholder="Search by order ID or customer…"
            className="admin-input"
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
          />
        </div>
        <div className="admin-toolbar-right">
          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as AdminOrder["status"] | ""); setPage(1); }}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <motion.div className="admin-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {orders.map((order) => (
                  <motion.tr
                    key={order._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td className="admin-table-id">{order.orderNumber}</td>
                    <td>
                      <p className="admin-product-cell-name" style={{ margin: 0 }}>{order.customerName}</p>
                      <p className="admin-product-cell-sku" style={{ margin: 0 }}>{order.customerEmail}</p>
                    </td>
                    <td>{order.itemsCount}</td>
                    <td className="admin-table-amount">₹{order.amount}</td>
                    <td>
                      <span className={`admin-stock-badge ${getStatusClass(order.status)}`}>
                        <span className="admin-stock-dot" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="admin-table-date">{formatDate(order.createdAt)}</td>
                    <td style={{ textAlign: "right" }}>
                      <button className="admin-action-btn-round" title="View Details" type="button">
                        <FiEye size={13} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {ordersQuery.isLoading ? (
                <AdminOrderTableSkeleton rows={ITEMS_PER_PAGE} />
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: "0.85rem" }}>
                    No orders found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <span className="admin-pagination-info">
              {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, totalOrders)} of {totalOrders}
            </span>
            <div className="admin-pagination-controls">
              <button className="admin-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <FiChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`admin-page-btn ${page === i + 1 ? "active" : ""}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button className="admin-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
