import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiPlus, FiX, FiInfo, FiBox, FiStar, FiMove } from "react-icons/fi";
import {
  uploadAdminProductImages,
  useAdminProduct,
  useSaveAdminProduct,
  type ProductPayload,
} from "./apiCalls";

type ProductImageDraft =
  | { id: string; kind: "remote"; url: string }
  | { id: string; kind: "local"; url: string; file: File };

export default function AdminAddProduct() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("unit");
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isInStock, setIsInStock] = useState(true);
  const [images, setImages] = useState<ProductImageDraft[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productQuery = useAdminProduct(editId);
  const saveProduct = useSaveAdminProduct({
    onSuccess: () => navigate("/admin/products"),
  });

  useEffect(() => {
    const product = productQuery.data?.product;
    if (!product) return;

    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setDiscountedPrice(product.discountedPrice === null ? "" : String(product.discountedPrice));
    setStock(String(product.stock));
    setUnit(product.unit);
    setCategory(product.category);
    setSku(product.sku);
    setTags(product.tags);
    setImages(product.images.map((url) => ({ id: url, kind: "remote", url })));
    setIsInStock(product.stock > 0 && product.status !== "out_of_stock");
  }, [productQuery.data]);

  const handleAddTag = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && newTag.trim()) {
      event.preventDefault();
      const tag = newTag.trim().toUpperCase();
      if (!tags.includes(tag)) {
        setTags([...tags, tag]);
      }
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const nextImages = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      kind: "local" as const,
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((current) => [...current, ...nextImages]);
    event.target.value = "";
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const image = images[index];
    if (image?.kind === "local") {
      URL.revokeObjectURL(image.url);
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      return [item, ...next];
    });
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (dropIndex: number) => setDragOverIndex(dropIndex);
  const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };
  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(dragIndex, 1);
      next.splice(dropIndex, 0, item);
      return next;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!name.trim() || !category.trim() || !price) {
      setFormError("Product name, category, and price are required.");
      return;
    }

    try {
      const stockNumber = Number(stock || 0);

      // Upload local files while preserving their position in the images array
      const localImages = images.filter(
        (img): img is Extract<ProductImageDraft, { kind: "local" }> => img.kind === "local",
      );
      const uploadedUrlById = new Map<string, string>();
      if (localImages.length > 0) {
        const { images: uploaded } = await uploadAdminProductImages(localImages.map((img) => img.file));
        localImages.forEach((img, i) => uploadedUrlById.set(img.id, uploaded[i].url));
      }

      // Reconstruct the final URL list in the exact visual order the user arranged
      const orderedImages = images
        .map((img) => (img.kind === "remote" ? img.url : uploadedUrlById.get(img.id) ?? ""))
        .filter(Boolean);

      const payload: ProductPayload = {
        name: name.trim(),
        description: description.trim(),
        shortDescription: description.trim().slice(0, 140),
        category: category.trim(),
        tags,
        sku: sku.trim() || undefined,
        price: Number(price),
        discountedPrice: discountedPrice ? Number(discountedPrice) : null,
        stock: isInStock ? stockNumber : 0,
        unit: unit.trim() || "unit",
        images: orderedImages,
        status: isInStock && stockNumber > 0 ? "active" : "out_of_stock",
        inventoryTracking: true,
      };

    saveProduct.mutate({ id: editId ?? undefined, payload });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Image upload failed");
    }
  };

  const isSaving = saveProduct.isPending;

  return (
    <form className="admin-page" onSubmit={handleSubmit}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{editId ? "Edit Product" : "Add New Product"}</h1>
          <p className="admin-page-subtitle">
            Create and maintain products in the Vedyara catalog.
          </p>
        </div>
        <div className="admin-header-actions" style={{ display: "flex", gap: "12px" }}>
          <button className="admin-btn admin-btn-outline" type="button" onClick={() => navigate("/admin/products")}>
            Cancel
          </button>
          <button className="admin-btn admin-btn-primary" type="submit" disabled={isSaving || productQuery.isLoading}>
            {isSaving ? "Saving..." : editId ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>

      {(formError || saveProduct.isError) && (
        <div className="admin-card" style={{ padding: 16, marginBottom: 20, color: "#c0392b" }}>
          {formError || saveProduct.error?.message}
        </div>
      )}

      <div className="admin-add-product-grid">
        <div className="admin-add-left">
          <div className="admin-card" style={{ padding: "32px" }}>
            <h2 className="admin-card-section-title" style={{ marginBottom: "24px" }}>General Information</h2>
            
            <div className="admin-form-group">
              <label className="admin-label">Product Name</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Pure Natural Honey"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="admin-form-group" style={{ marginTop: "24px" }}>
              <label className="admin-label">Description</label>
              <textarea
                className="admin-textarea"
                placeholder="Describe the benefits, ingredients, and usage of this premium product..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>

          <div className="admin-card" style={{ padding: "32px" }}>
            <div className="admin-card-header-row" style={{ marginBottom: "20px" }}>
              <h2 className="admin-card-section-title" style={{ margin: 0 }}>Product Images</h2>
              <span className="admin-card-hint">PNG, JPG OR WEBP</span>
            </div>
            
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden-input"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <div
              className="admin-upload-zone"
              onClick={triggerUpload}
              style={{
                border: "2px dashed #e0e0e0",
                background: "#fafafa",
                borderRadius: "16px",
                padding: "48px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <FiUploadCloud size={48} style={{ color: "#d4af37", marginBottom: "16px" }} />
              <p className="admin-upload-text" style={{ fontSize: "1rem", fontWeight: 600, color: "#333", margin: 0 }}>Click to upload</p>
              <p className="admin-upload-hint" style={{ color: "#888", margin: "8px 0 0" }}>Images are stored with the product record.</p>
            </div>

            <div className="admin-image-thumbs" style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "24px", alignItems: "flex-start" }}>
              <AnimatePresence>
                {images.map((img, index) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="admin-thumb"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => { e.preventDefault(); handleDragOver(index); }}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={handleDragEnd}
                    style={{
                      position: "relative",
                      width: "96px",
                      height: "96px",
                      opacity: dragIndex === index ? 0.35 : 1,
                      outline: dragOverIndex === index && dragIndex !== index
                        ? "2.5px dashed #d4af37"
                        : index === 0
                        ? "2.5px solid #d4af37"
                        : "2.5px solid transparent",
                      outlineOffset: "2px",
                      borderRadius: "12px",
                      cursor: "grab",
                      transition: "opacity 0.15s, outline 0.15s",
                    }}
                  >
                    <img src={img.url} alt={`product-${index}`} style={{ borderRadius: "10px" }} />

                    {/* Star: gold filled = primary, ghost = click to set primary */}
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(index)}
                      title={index === 0 ? "Primary image" : "Set as primary image"}
                      style={{
                        position: "absolute",
                        top: "4px",
                        left: "4px",
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: index === 0 ? "default" : "pointer",
                        background: index === 0 ? "#d4af37" : "rgba(0,0,0,0.32)",
                        color: index === 0 ? "#3E2F1C" : "rgba(255,255,255,0.85)",
                        padding: 0,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                      }}
                    >
                      <FiStar size={11} fill={index === 0 ? "#3E2F1C" : "none"} strokeWidth={2.2} />
                    </button>

                    {/* Remove button */}
                    <button
                      className="admin-thumb-remove"
                      onClick={() => removeImage(index)}
                      type="button"
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "10px",
                      }}
                    >
                      <FiX />
                    </button>

                    {/* Drag handle hint */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        background: "rgba(0,0,0,0.28)",
                        borderRadius: "4px",
                        padding: "2px 5px",
                        pointerEvents: "none",
                      }}
                    >
                      <FiMove size={9} color="rgba(255,255,255,0.8)" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                className="admin-thumb admin-thumb-add"
                onClick={triggerUpload}
                type="button"
                style={{
                  width: "96px",
                  height: "96px",
                  borderRadius: "12px",
                  border: "2px dashed #ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: "#f9f9f9",
                  color: "#999",
                  flexShrink: 0,
                }}
              >
                <FiPlus size={24} />
              </button>
            </div>

            {images.length > 0 && (
              <p style={{ fontSize: "0.72rem", color: "#aaa", marginTop: "10px", textAlign: "center" }}>
                ☆ Star = cover photo on product card &nbsp;·&nbsp; Drag to reorder
              </p>
            )}
          </div>
        </div>

        <div className="admin-add-right">
          <div className="admin-card" style={{ padding: "32px" }}>
            <h2 className="admin-card-section-title" style={{ marginBottom: "24px" }}>Pricing & Inventory</h2>
            
            <div className="admin-form-row" style={{ marginBottom: "20px" }}>
              <div className="admin-form-group">
                <label className="admin-label">Base Price</label>
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
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Discounted Price</label>
                <div className="admin-input-prefix">
                  <span className="admin-prefix">₹</span>
                  <input
                    type="number"
                    className="admin-input admin-input-with-prefix"
                    placeholder="0.00"
                    value={discountedPrice}
                    onChange={(event) => setDiscountedPrice(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="admin-form-row" style={{ marginBottom: "24px" }}>
              <div className="admin-form-group">
                <label className="admin-label">Stock Quantity</label>
                <input
                  type="number"
                  className="admin-input"
                  placeholder="Enter amount"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Unit</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="kg, pack, unit"
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                />
              </div>
            </div>

            <div
              className="admin-toggle-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f9f9f9",
                padding: "16px",
                borderRadius: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FiBox className={isInStock ? "text-primary" : "text-gray"} />
                <label className="admin-label" style={{ margin: 0, color: "#333" }}>Availability Status</label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  className="admin-toggle-label"
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: isInStock ? "#4b6a13" : "#e74c3c",
                  }}
                >
                  {isInStock ? "In Stock" : "Out of Stock"}
                </span>
                <button
                  className={`admin-toggle ${isInStock ? "active" : ""}`}
                  onClick={() => setIsInStock(!isInStock)}
                  type="button"
                >
                  <span className="admin-toggle-knob" />
                </button>
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: "32px" }}>
            <h2 className="admin-card-section-title" style={{ marginBottom: "24px" }}>Organization</h2>
            
            <div className="admin-form-group" style={{ marginBottom: "24px" }}>
              <label className="admin-label">Category</label>
              <input
                className="admin-input"
                placeholder="e.g. honey, spices"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              />
            </div>

            <div className="admin-form-group" style={{ marginBottom: "24px" }}>
              <label className="admin-label">SKU</label>
              <input
                className="admin-input"
                placeholder="Leave empty to auto-generate"
                value={sku}
                onChange={(event) => setSku(event.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Tags</label>
              <div className="admin-tags-list" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                {tags.map(tag => (
                  <motion.span layout key={tag} className="admin-tag">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="admin-tag-remove"
                      style={{ marginLeft: "4px" }}
                      type="button"
                    >
                      <FiX size={12} />
                    </button>
                  </motion.span>
                ))}
              </div>
              <div className="admin-tag-input-wrap" style={{ position: "relative" }}>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Type and press enter..."
                  value={newTag}
                  onChange={(event) => setNewTag(event.target.value)}
                  onKeyDown={handleAddTag}
                />
                <FiPlus style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
              </div>
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
              Product images, pricing, inventory, category, and status are saved directly to the admin product API.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
