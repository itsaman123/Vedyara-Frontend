import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiPlus, FiTrash2, FiGift } from "react-icons/fi";
import { useAdminCombos, useDeleteAdminCombo } from "./comboApiCalls";
import { AdminProductTableSkeleton } from "../../components/Skeletons";

export default function AdminCombos() {
  const navigate = useNavigate();
  const combosQuery = useAdminCombos({ limit: 100 });
  const deleteCombo = useDeleteAdminCombo();
  const combos = combosQuery.data?.items ?? [];

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this combo?")) {
      deleteCombo.mutate(id);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">
        <span>Catalog</span>
        <span className="admin-breadcrumb-sep">›</span>
        <span className="admin-breadcrumb-active">Combos</span>
      </div>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Combo Management</h1>
          <p className="admin-page-subtitle">Bundle existing products together as a combo pack for the storefront.</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => navigate("/admin/add-combo")}>
            <FiPlus size={14} /> Add Combo
          </button>
        </div>
      </div>

      <motion.div className="admin-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="admin-table-wrap">
          <table className="admin-table admin-product-table">
            <thead>
              <tr>
                <th>Combo</th>
                <th>Products</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {combos.map((combo) => (
                  <motion.tr
                    key={combo._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td>
                      <div className="admin-product-cell">
                        <div className="admin-product-thumb-lg" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                          {combo.emoji || <FiGift size={16} style={{ color: "#aaa" }} />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p className="admin-product-cell-name">{combo.name}</p>
                          {combo.tagline && (
                            <p className="admin-product-cell-sku" style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {combo.tagline}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-cat">
                      {combo.products.length === 0 ? (
                        <span style={{ color: "#aaa" }}>No products</span>
                      ) : (
                        combo.products
                          .map((item) => `${item.product?.name ?? "Deleted product"} ×${item.quantity}`)
                          .join(", ")
                      )}
                    </td>
                    <td className="admin-table-amount">₹{combo.price}</td>
                    <td>
                      <span className={`admin-stock-badge ${combo.status === "active" ? "in-stock" : "out-of-stock"}`}>
                        <span className="admin-stock-dot" />
                        {combo.status === "active" ? "Active" : combo.status === "draft" ? "Draft" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}>
                        <button
                          className="admin-action-btn-round"
                          title="Edit"
                          onClick={() => navigate(`/admin/add-combo?edit=${combo._id}`)}
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button
                          className="admin-action-btn-round admin-action-delete"
                          title="Delete"
                          onClick={() => handleDelete(combo._id)}
                          disabled={deleteCombo.isPending}
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {combosQuery.isLoading ? (
                <AdminProductTableSkeleton rows={4} />
              ) : combos.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: "0.85rem" }}>
                    No combos yet. Bundle a few products together to create your first one.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
