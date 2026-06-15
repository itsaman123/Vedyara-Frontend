import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiAlertTriangle,
  FiCheckCircle,
  FiPackage,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useAdminProducts } from "./apiCalls";
import { useDebounce } from "../useDebounce";
import { AdminStatSkeleton, AdminInventoryTableSkeleton } from "../../components/Skeletons";

const ITEMS_PER_PAGE = 10;
const REORDER_LEVEL = 20;

type StockFilter = "all" | "in_stock" | "low" | "out";

const STOCK_OPTIONS: { label: string; value: StockFilter }[] = [
  { label: "All Stock", value: "all" },
  { label: "In Stock", value: "in_stock" },
  { label: "Low Stock", value: "low" },
  { label: "Out of Stock", value: "out" },
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(value),
  );

export default function AdminInventory() {
  const [searchInput, setSearchInput] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Map our UI filter to the API status param
  const apiStatus =
    stockFilter === "out" ? "out_of_stock" : undefined;

  const inventoryQuery = useAdminProducts({
    page,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
    status: apiStatus,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const allProducts = inventoryQuery.data?.items ?? [];

  // Client-side filter for low/in-stock (server only distinguishes out_of_stock)
  const products =
    stockFilter === "low"
      ? allProducts.filter((p) => p.stock > 0 && p.stock <= REORDER_LEVEL)
      : stockFilter === "in_stock"
      ? allProducts.filter((p) => p.stock > REORDER_LEVEL)
      : allProducts;

  const pagination = inventoryQuery.data?.pagination;
  const totalPages = pagination?.pages ?? 1;
  const totalItems = pagination?.total ?? 0;

  const healthyCount = allProducts.filter((p) => p.stock > REORDER_LEVEL).length;
  const lowCount = allProducts.filter((p) => p.stock > 0 && p.stock <= REORDER_LEVEL).length;
  const outCount = allProducts.filter((p) => p.stock === 0).length;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vedyara-inventory.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inventory</h1>
          <p className="admin-page-subtitle">Monitor stock levels and product availability.</p>
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
            <FiPackage size={18} style={{ color: "#3e2f1c" }} />
          </div>
          <span className="admin-overview-stat-label">Total SKUs</span>
          <span className="admin-overview-stat-value">
            {inventoryQuery.isLoading ? <AdminStatSkeleton /> : totalItems}
          </span>
        </div>
        <div className="admin-overview-stat">
          <div className="admin-overview-stat-icon" style={{ background: "rgba(107,142,35,0.12)" }}>
            <FiCheckCircle size={18} style={{ color: "#6B8E23" }} />
          </div>
          <span className="admin-overview-stat-label">Healthy Stock</span>
          <span className="admin-overview-stat-value" style={{ color: "#6B8E23" }}>
            {inventoryQuery.isLoading ? <AdminStatSkeleton /> : healthyCount}
          </span>
        </div>
        <div className="admin-overview-stat">
          <div className="admin-overview-stat-icon" style={{ background: "rgba(192,57,43,0.1)" }}>
            <FiAlertTriangle size={18} style={{ color: "#c0392b" }} />
          </div>
          <span className="admin-overview-stat-label">Low / Out</span>
          <span className="admin-overview-stat-value" style={{ color: "#c0392b" }}>
            {inventoryQuery.isLoading ? <AdminStatSkeleton /> : lowCount + outCount}
          </span>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <FiSearch size={14} className="admin-toolbar-search-icon" />
          <input
            type="text"
            placeholder="Search by name or SKU…"
            className="admin-input"
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
          />
        </div>
        <div className="admin-toolbar-right">
          <select
            className="admin-filter-select"
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value as StockFilter); setPage(1); }}
          >
            {STOCK_OPTIONS.map((o) => (
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
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Reorder Point</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {products.map((item) => {
                  const isOut = item.stock === 0;
                  const isLow = item.stock > 0 && item.stock <= REORDER_LEVEL;
                  const statusLabel = isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock";
                  const badgeClass = isOut ? "out-of-stock" : "in-stock";

                  return (
                    <motion.tr
                      key={item._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td>
                        <div className="admin-product-cell">
                          <div className="admin-product-thumb-lg">
                            {item.images[0] ? (
                              <img src={item.images[0]} alt={item.name} />
                            ) : (
                              <span style={{ fontSize: "0.9rem", color: "#aaa" }}>
                                {item.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p className="admin-product-cell-name">{item.name}</p>
                            <p className="admin-product-cell-sku">SKU: {item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="admin-table-cat">{item.category}</td>
                      <td>
                        <span
                          className="admin-table-amount"
                          style={{ color: isOut ? "#d93025" : isLow ? "#b8961f" : undefined }}
                        >
                          {item.stock} {item.unit}
                        </span>
                      </td>
                      <td style={{ color: "#777", fontSize: "0.8rem" }}>
                        {REORDER_LEVEL} {item.unit}
                      </td>
                      <td>
                        <span className={`admin-stock-badge ${badgeClass}`}>
                          <span className="admin-stock-dot" />
                          {statusLabel}
                        </span>
                      </td>
                      <td className="admin-table-date">{formatDate(item.updatedAt)}</td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {inventoryQuery.isLoading ? (
                <AdminInventoryTableSkeleton rows={ITEMS_PER_PAGE} />
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: "0.85rem" }}>
                    No items match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <span className="admin-pagination-info">
              {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, totalItems)} of {totalItems}
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
