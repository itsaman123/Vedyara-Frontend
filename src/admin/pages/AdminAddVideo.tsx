import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiUploadCloud, FiInfo, FiFilm, FiX } from "react-icons/fi";
import {
  uploadAdminVideoFile,
  useAdminVideo,
  useSaveAdminVideo,
  type VideoPayload,
} from "./videoApiCalls";

type Source = "youtube" | "upload";

export default function AdminAddVideo() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [source, setSource] = useState<Source>("youtube");
  const [ytId, setYtId] = useState("");
  const [existingVideoSrc, setExistingVideoSrc] = useState("");
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoQuery = useAdminVideo(editId);
  const saveVideo = useSaveAdminVideo({
    onSuccess: () => navigate("/admin/videos"),
  });

  useEffect(() => {
    const video = videoQuery.data?.video;
    if (!video) return;

    setTitle(video.title);
    setDescription(video.description);
    setOrder(String(video.order));
    setIsActive(video.isActive);
    setYtId(video.ytId);
    setExistingVideoSrc(video.videoSrc);
    setSource(video.videoSrc && !video.ytId ? "upload" : "youtube");
  }, [videoQuery.data]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setLocalFile(file);
    event.target.value = "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("Video title is required.");
      return;
    }

    try {
      let videoSrc = source === "upload" ? existingVideoSrc : "";

      if (source === "upload" && localFile) {
        setIsUploading(true);
        const uploaded = await uploadAdminVideoFile(localFile);
        videoSrc = uploaded.url;
      }
      setIsUploading(false);

      const payload: VideoPayload = {
        title: title.trim(),
        description: description.trim(),
        order: Number(order) || 0,
        isActive,
        ytId: source === "youtube" ? ytId.trim() : "",
        videoSrc: source === "upload" ? videoSrc : "",
      };

      saveVideo.mutate({ id: editId ?? undefined, payload });
    } catch (error) {
      setIsUploading(false);
      setFormError(error instanceof Error ? error.message : "Video upload failed");
    }
  };

  const isSaving = saveVideo.isPending || isUploading;

  return (
    <form className="admin-page" onSubmit={handleSubmit}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{editId ? "Edit Video" : "Add New Video"}</h1>
          <p className="admin-page-subtitle">
            Manage the videos shown in the homepage "Honey in Action" carousel.
          </p>
        </div>
        <div className="admin-header-actions" style={{ display: "flex", gap: "12px" }}>
          <button className="admin-btn admin-btn-outline" type="button" onClick={() => navigate("/admin/videos")}>
            Cancel
          </button>
          <button className="admin-btn admin-btn-primary" type="submit" disabled={isSaving || videoQuery.isLoading}>
            {isUploading ? "Uploading..." : saveVideo.isPending ? "Saving..." : editId ? "Update Video" : "Add Video"}
          </button>
        </div>
      </div>

      {(formError || saveVideo.isError) && (
        <div className="admin-card" style={{ padding: 16, marginBottom: 20, color: "#c0392b" }}>
          {formError || saveVideo.error?.message}
        </div>
      )}

      <div className="admin-add-product-grid">
        <div className="admin-add-left">
          <div className="admin-card" style={{ padding: "32px" }}>
            <h2 className="admin-card-section-title" style={{ marginBottom: "24px" }}>General Information</h2>

            <div className="admin-form-group">
              <label className="admin-label">Video Title</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Morning Honey Ritual"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="admin-form-group" style={{ marginTop: "24px" }}>
              <label className="admin-label">Description</label>
              <textarea
                className="admin-textarea"
                placeholder="A short caption shown on the video card..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>

          <div className="admin-card" style={{ padding: "32px" }}>
            <div className="admin-card-header-row" style={{ marginBottom: "20px" }}>
              <h2 className="admin-card-section-title" style={{ margin: 0 }}>Video Source</h2>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <button
                type="button"
                className={`admin-btn ${source === "youtube" ? "admin-btn-primary" : "admin-btn-outline"}`}
                onClick={() => setSource("youtube")}
              >
                YouTube Link
              </button>
              <button
                type="button"
                className={`admin-btn ${source === "upload" ? "admin-btn-primary" : "admin-btn-outline"}`}
                onClick={() => setSource("upload")}
              >
                Upload File
              </button>
            </div>

            {source === "youtube" ? (
              <div className="admin-form-group">
                <label className="admin-label">YouTube Video ID</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. dQw4w9WgXcQ (from the video URL)"
                  value={ytId}
                  onChange={(event) => setYtId(event.target.value)}
                />
                <p className="admin-card-hint" style={{ marginTop: 8 }}>
                  Paste just the ID from youtube.com/watch?v=<b>this-part</b>
                </p>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden-input"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />

                {localFile ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa", borderRadius: 12, padding: "14px 16px" }}>
                    <span style={{ fontSize: "0.85rem", color: "#333" }}>{localFile.name}</span>
                    <button type="button" onClick={() => setLocalFile(null)} className="admin-action-btn-round admin-action-delete">
                      <FiX size={13} />
                    </button>
                  </div>
                ) : existingVideoSrc ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa", borderRadius: 12, padding: "14px 16px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "#333" }}>
                      <FiFilm size={14} /> Current video uploaded
                    </span>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="admin-btn admin-btn-outline">
                      Replace
                    </button>
                  </div>
                ) : (
                  <div
                    className="admin-upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: "2px dashed #e0e0e0",
                      background: "#fafafa",
                      borderRadius: "16px",
                      padding: "40px 24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <FiUploadCloud size={40} style={{ color: "#d4af37", marginBottom: "14px" }} />
                    <p style={{ fontSize: "1rem", fontWeight: 600, color: "#333", margin: 0 }}>Click to upload</p>
                    <p style={{ color: "#888", margin: "8px 0 0", fontSize: "0.8rem" }}>MP4, WebM or MOV</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="admin-add-right">
          <div className="admin-card" style={{ padding: "32px" }}>
            <h2 className="admin-card-section-title" style={{ marginBottom: "24px" }}>Display</h2>

            <div className="admin-form-group" style={{ marginBottom: "24px" }}>
              <label className="admin-label">Order</label>
              <input
                type="number"
                className="admin-input"
                placeholder="0"
                value={order}
                onChange={(event) => setOrder(event.target.value)}
              />
              <p className="admin-card-hint" style={{ marginTop: 8 }}>
                Lower numbers appear first in the carousel.
              </p>
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
              <label className="admin-label" style={{ margin: 0, color: "#333" }}>Visible on site</label>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  className="admin-toggle-label"
                  style={{ fontSize: "0.8rem", fontWeight: 600, color: isActive ? "#4b6a13" : "#e74c3c" }}
                >
                  {isActive ? "Active" : "Hidden"}
                </span>
                <button
                  className={`admin-toggle ${isActive ? "active" : ""}`}
                  onClick={() => setIsActive(!isActive)}
                  type="button"
                >
                  <span className="admin-toggle-knob" />
                </button>
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
              Videos without a source yet show a "Coming Soon" placeholder card on the site — safe to add early and fill in later.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
