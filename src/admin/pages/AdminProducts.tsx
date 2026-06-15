import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import {
  useAdminProducts,
  useDeleteAdminProduct,
  useDeleteAdminProducts,
  type AdminProduct,
} from "./apiCalls";
import { useDebounce } from "../useDebounce";
import { AdminProductTableSkeleton } from "../../components/Skeletons";

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS: { label: string; value: AdminProduct["status"] | "" }[] = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Draft", value: "draft" },
  { label: "Out of Stock", value: "out_of_stock" },
];

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminProduct["status"] | "">("");
  const debouncedSearch = useDebounce(searchInput, 400);
  const navigate = useNavigate();

  const productsQuery = useAdminProducts({
    page,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
    status: statusFilter || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const deleteProduct = useDeleteAdminProduct();
  const deleteProducts = useDeleteAdminProducts();
  const products = productsQuery.data?.items ?? [];
  const pagination = productsQuery.data?.pagination;
  const totalPages = pagination?.pages ?? 1;
  const totalProducts = pagination?.total ?? 0;

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    setSelectedIds([]);
  }, [page]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? products.map((p) => p._id) : []);
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this product?")) {
      deleteProduct.mutate(id, {
        onSuccess: () => setSelectedIds((cur) => cur.filter((x) => x !== id)),
      });
    }
  };

  const handleDeleteSelected = () => {
    if (
      selectedIds.length > 0 &&
      window.confirm(`Delete ${selectedIds.length} product(s)?`)
    ) {
      deleteProducts.mutate(selectedIds, { onSuccess: () => setSelectedIds([]) });
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vedyara-products.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">
        <span>Catalog</span>
        <span className="admin-breadcrumb-sep">›</span>
        <span className="admin-breadcrumb-active">All Products</span>
      </div>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Product Management</h1>
          <p className="admin-page-subtitle">Manage your natural product inventory and listings.</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-outline" onClick={handleExport}>
            <FiDownload size={13} /> Export
          </button>
          <button className="admin-btn admin-btn-primary" onClick={() => navigate("/admin/add-product")}>
            <FiPlus size={14} /> Add Product
          </button>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <FiSearch size={14} className="admin-toolbar-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            className="admin-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="admin-toolbar-right">
          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AdminProduct["status"] | "")}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {selectedIds.length > 0 && (
            <button
              className="admin-btn admin-btn-outline"
              onClick={handleDeleteSelected}
              disabled={deleteProducts.isPending}
              style={{ color: "#d93025", borderColor: "#fce8e6" }}
            >
              <FiTrash2 size={13} /> Delete ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      <motion.div className="admin-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="admin-table-wrap">
          <table className="admin-table admin-product-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input
                    type="checkbox"
                    className="admin-checkbox"
                    onChange={handleSelectAll}
                    checked={products.length > 0 && selectedIds.length === products.length}
                  />
                </th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {products.map((product) => {
                  const isSelected = selectedIds.includes(product._id);
                  const price = product.discountedPrice ?? product.price;
                  const isInStock = product.stock > 0;

                  return (
                    <motion.tr
                      key={product._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ background: isSelected ? "rgba(212,175,55,0.04)" : undefined }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          className="admin-checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(product._id)}
                        />
                      </td>
                      <td>
                        <div className="admin-product-cell">
                          <div className="admin-product-thumb-lg">
                            {product.images[0] ? (
                              <img src={product.images[0]} alt={product.name} />
                            ) : (
                              <span style={{ fontSize: "0.9rem", color: "#aaa" }}>
                                {product.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p className="admin-product-cell-name">{product.name}</p>
                            <p className="admin-product-cell-sku">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="admin-table-cat">{product.category}</td>
                      <td className="admin-table-amount">₹{price}</td>
                      <td>
                        <span className={product.stock === 0 ? "admin-stock-zero" : ""}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-stock-badge ${isInStock ? "in-stock" : "out-of-stock"}`}>
                          <span className="admin-stock-dot" />
                          {isInStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}>
                          <button
                            className="admin-action-btn-round"
                            title="Edit"
                            onClick={() => navigate(`/admin/add-product?edit=${product._id}`)}
                          >
                            <FiEdit2 size={13} />
                          </button>
                          <button
                            className="admin-action-btn-round admin-action-delete"
                            title="Delete"
                            onClick={() => handleDelete(product._id)}
                            disabled={deleteProduct.isPending}
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {productsQuery.isLoading ? (
                <AdminProductTableSkeleton rows={ITEMS_PER_PAGE} />
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: "0.85rem" }}>
                    No products found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <span className="admin-pagination-info">
              {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, totalProducts)} of {totalProducts}
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
