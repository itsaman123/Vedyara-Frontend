import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX, FiInfo, FiSearch, FiPackage, FiMinus } from "react-icons/fi";
import { useAdminProducts, type AdminProduct } from "./apiCalls";
import {
  useAdminCombo,
  useSaveAdminCombo,
  type ComboPayload,
} from "./comboApiCalls";
import { useDebounce } from "../useDebounce";

type SelectedProduct = {
  productId: string;
  name: string;
  image: string;
  price: number;
  discountedPrice: number | null;
  unit: string;
  quantity: number;
};

export default function AdminAddCombo() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("🎁");
  const [badge, setBadge] = useState("");
  const [price, setPrice] = useState("");
  const [order, setOrder] = useState("0");
  const [status, setStatus] = useState<"draft" | "active" | "inactive">("draft");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [formError, setFormError] = useState("");

  const debouncedProductSearch = useDebounce(productSearch, 300);

  const comboQuery = useAdminCombo(editId);
  const saveCombo = useSaveAdminCombo({
    onSuccess: () => navigate("/admin/combos"),
  });
  const productSearchQuery = useAdminProducts({
    search: debouncedProductSearch,
    limit: 8,
    status: "active",
  });

  useEffect(() => {
    const combo = comboQuery.data?.combo;
    if (!combo) return;

    setName(combo.name);
    setTagline(combo.tagline);
    setDescription(combo.description);
    setEmoji(combo.emoji || "🎁");
    setBadge(combo.badge);
    setPrice(String(combo.price));
    setOrder(String(combo.order));
    setStatus(combo.status);
    setHighlights(combo.highlights);
    setSelectedProducts(
      combo.products
        .filter((item) => item.product)
        .map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          image: item.product.images?.[0] ?? "",
          price: item.product.price,
          discountedPrice: item.product.discountedPrice,
          unit: item.product.unit,
          quantity: item.quantity,
        })),
    );
  }, [comboQuery.data]);

  const searchResults = (productSearchQuery.data?.items ?? []).filter(
    (product) => !selectedProducts.some((sel) => sel.productId === product._id),
  );

  const addProduct = (product: AdminProduct) => {
    setSelectedProducts((current) => [
      ...current,
      {
        productId: product._id,
        name: product.name,
        image: product.images?.[0] ?? "",
        price: product.price,
        discountedPrice: product.discountedPrice,
        unit: product.unit,
        quantity: 1,
      },
    ]);
    setProductSearch("");
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((current) => current.filter((p) => p.productId !== productId));
  };

  const changeQuantity = (productId: string, delta: number) => {
    setSelectedProducts((current) =>
      current.map((p) =>
        p.productId === productId
          ? { ...p, quantity: Math.max(1, p.quantity + delta) }
          : p,
      ),
    );
  };

  const handleAddHighlight = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && newHighlight.trim()) {
      event.preventDefault();
      setHighlights((current) => [...current, newHighlight.trim()]);
      setNewHighlight("");
    }
  };

  const removeHighlight = (highlight: string) => {
    setHighlights((current) => current.filter((h) => h !== highlight));
  };

  const totalValue = selectedProducts.reduce(
    (sum, p) => sum + (p.discountedPrice ?? p.price) * p.quantity,
    0,
  );
  const savings = price ? totalValue - Number(price) : 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Combo name is required.");
      return;
    }
    if (!price) {
      setFormError("Combo price is required.");
      return;
    }
    if (selectedProducts.length < 2) {
      setFormError("Add at least 2 products to build a combo.");
      return;
    }

    const payload: ComboPayload = {
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      emoji: emoji.trim() || "🎁",
      badge: badge.trim(),
      products: selectedProducts.map((p) => ({ product: p.productId, quantity: p.quantity })),
      price: Number(price),
      highlights,
      order: Number(order) || 0,
      status,
    };

    saveCombo.mutate({ id: editId ?? undefined, payload });
  };

  const isSaving = saveCombo.isPending;

  return (
    <form className="admin-page" onSubmit={handleSubmit}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{editId ? "Edit Combo" : "Add New Combo"}</h1>
          <p className="admin-page-subtitle">
            Bundle two or more existing products together as a combo pack for the storefront.
          </p>
        </div>
        <div className="admin-header-actions" style={{ display: "flex", gap: "12px" }}>
          <button className="admin-btn admin-btn-outline" type="button" onClick={() => navigate("/admin/combos")}>
            Cancel
          </button>
          <button className="admin-btn admin-btn-primary" type="submit" disabled={isSaving || comboQuery.isLoading}>
            {isSaving ? "Saving..." : editId ? "Update Combo" : "Add Combo"}
          </button>
        </div>
      </div>

      {(formError || saveCombo.isError) && (
        <div className="admin-card" style={{ padding: 16, marginBottom: 20, color: "#c0392b" }}>
          {formError || saveCombo.error?.message}
        </div>
      )}

      <div className="admin-add-product-grid">
        <div className="admin-add-left">
          <div className="admin-card" style={{ padding: "32px" }}>
            <h2 className="admin-card-section-title" style={{ marginBottom: "24px" }}>General Information</h2>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label">Combo Name</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Immunity Combo"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Emoji</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="🎁"
                  value={emoji}
                  onChange={(event) => setEmoji(event.target.value)}
                  maxLength={4}
                />
              </div>
            </div>

            <div className="admin-form-group" style={{ marginTop: "24px" }}>
              <label className="admin-label">Tagline</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Your daily wellness ritual"
                value={tagline}
                onChange={(event) => setTagline(event.target.value)}
              />
            </div>

            <div className="admin-form-group" style={{ marginTop: "24px" }}>
              <label className="admin-label">Description</label>
              <textarea
                className="admin-textarea"
                placeholder="Optional longer description for this combo..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>

          <div className="admin-card" style={{ padding: "32px" }}>
            <div className="admin-card-header-row" style={{ marginBottom: "20px" }}>
              <h2 className="admin-card-section-title" style={{ margin: 0 }}>Products in this Combo</h2>
              <span className="admin-card-hint">{selectedProducts.length} selected</span>
            </div>

            <div style={{ position: "relative", marginBottom: "20px" }}>
              <div className="admin-input-prefix">
                <FiSearch size={15} className="admin-prefix" />
                <input
                  type="text"
                  className="admin-input admin-input-with-prefix"
                  placeholder="Search products to add..."
                  value={productSearch}
                  onChange={(event) => setProductSearch(event.target.value)}
                />
              </div>

              {productSearch.trim() && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    zIndex: 10,
                    maxHeight: "260px",
                    overflowY: "auto",
                  }}
                >
                  {productSearchQuery.isLoading ? (
                    <p style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#aaa" }}>Searching...</p>
                  ) : searchResults.length === 0 ? (
                    <p style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#aaa" }}>No matching products found.</p>
                  ) : (
                    searchResults.map((product) => (
                      <button
                        type="button"
                        key={product._id}
                        onClick={() => addProduct(product)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "100%",
                          padding: "10px 16px",
                          background: "none",
                          border: "none",
                          borderBottom: "1px solid #f4f4f4",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", background: "#f4f4f4", flexShrink: 0 }}>
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#bbb" }}>
                              <FiPackage size={14} />
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>{product.name}</p>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#999" }}>₹{product.discountedPrice ?? product.price}</p>
                        </div>
                        <FiPlus size={14} style={{ color: "#d4af37" }} />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <AnimatePresence>
                {selectedProducts.map((product) => (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: "#fafafa",
                      borderRadius: "12px",
                      padding: "10px 14px",
                    }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", background: "#eee", flexShrink: 0 }}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#bbb" }}>
                          <FiPackage size={16} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>{product.name}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#999" }}>
                        ₹{product.discountedPrice ?? product.price} / {product.unit}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        type="button"
                        className="admin-action-btn-round"
                        onClick={() => changeQuantity(product.productId, -1)}
                      >
                        <FiMinus size={11} />
                      </button>
                      <span style={{ minWidth: 18, textAlign: "center", fontSize: "0.85rem", fontWeight: 600 }}>{product.quantity}</span>
                      <button
                        type="button"
                        className="admin-action-btn-round"
                        onClick={() => changeQuantity(product.productId, 1)}
                      >
                        <FiPlus size={11} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="admin-action-btn-round admin-action-delete"
                      onClick={() => removeProduct(product.productId)}
                    >
                      <FiX size={13} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {selectedProducts.length === 0 && (
                <p style={{ fontSize: "0.85rem", color: "#aaa", textAlign: "center", padding: "16px 0" }}>
                  Search above and add at least 2 products to build this combo.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="admin-add-right">
          <div className="admin-card" style={{ padding: "32px" }}>
            <h2 className="admin-card-section-title" style={{ marginBottom: "24px" }}>Pricing & Status</h2>

            <div className="admin-form-group" style={{ marginBottom: "20px" }}>
              <label className="admin-label">Combo Price</label>
              <div className="admin-input-prefix">
                <span className="admin-prefix">₹</span>
                <input
                  type="number"
                  className="admin-input admin-input-with-prefix"
                  placeholder="0.00"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </div>
              {selectedProducts.length > 0 && (
                <p className="admin-card-hint" style={{ marginTop: 8 }}>
                  Individual total: ₹{totalValue.toFixed(2)}
                  {price && savings > 0 && <> · Customer saves ₹{savings.toFixed(2)}</>}
                </p>
              )}
            </div>

            <div className="admin-form-row" style={{ marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label className="admin-label">Badge Text</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Best Value"
                  value={badge}
                  onChange={(event) => setBadge(event.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Display Order</label>
                <input
                  type="number"
                  className="admin-input"
                  placeholder="0"
                  value={order}
                  onChange={(event) => setOrder(event.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Status</label>
              <select
                className="admin-input"
                value={status}
                onChange={(event) => setStatus(event.target.value as typeof status)}
              >
                <option value="draft">Draft (hidden)</option>
                <option value="active">Active (visible on site)</option>
                <option value="inactive">Inactive (hidden)</option>
              </select>
            </div>
          </div>

          <div className="admin-card" style={{ padding: "32px" }}>
            <h2 className="admin-card-section-title" style={{ marginBottom: "24px" }}>Highlights</h2>

            <div className="admin-tags-list" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
              {highlights.map((highlight) => (
                <motion.span layout key={highlight} className="admin-tag">
                  {highlight}
                  <button
                    onClick={() => removeHighlight(highlight)}
                    className="admin-tag-remove"
                    style={{ marginLeft: "4px" }}
                    type="button"
                  >
                    <FiX size={12} />
                  </button>
                </motion.span>
              ))}
            </div>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="admin-input"
                placeholder="Type and press enter..."
                value={newHighlight}
                onChange={(event) => setNewHighlight(event.target.value)}
                onKeyDown={handleAddHighlight}
              />
              <FiPlus style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
            </div>
          </div>

          <div
            className="admin-listing-tip"
            style={{
              background: "#2b2118",
              borderRadius: "20px",
              padding: "24px",
              color: "#fff",
              boxShadow: "0 10px 30px rgba(43,33,24,0.2)",
            }}
          >
            <div className="admin-tip-header" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <FiInfo className="admin-tip-icon" style={{ color: "#d4af37" }} />
              <span className="admin-tip-title" style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em" }}>LISTING TIP</span>
            </div>
            <p className="admin-tip-text" style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "rgba(255, 255, 255, 0.7)" }}>
              Only combos set to "Active" appear in the Combo Packs section on the homepage. Product images and names are pulled live from the products you select.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
