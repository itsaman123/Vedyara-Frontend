import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiPlus, FiTrash2, FiFilm, FiYoutube } from "react-icons/fi";
import { useAdminVideos, useDeleteAdminVideo } from "./videoApiCalls";
import { AdminProductTableSkeleton } from "../../components/Skeletons";

export default function AdminVideos() {
  const navigate = useNavigate();
  const videosQuery = useAdminVideos();
  const deleteVideo = useDeleteAdminVideo();
  const videos = videosQuery.data?.items ?? [];

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this video?")) {
      deleteVideo.mutate(id);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">
        <span>Content</span>
        <span className="admin-breadcrumb-sep">›</span>
        <span className="admin-breadcrumb-active">Videos</span>
      </div>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Video Management</h1>
          <p className="admin-page-subtitle">Manage the homepage "Honey in Action" video carousel.</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => navigate("/admin/add-video")}>
            <FiPlus size={14} /> Add Video
          </button>
        </div>
      </div>

      <motion.div className="admin-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="admin-table-wrap">
          <table className="admin-table admin-product-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Order</th>
                <th>Video</th>
                <th>Source</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {videos.map((video) => (
                  <motion.tr
                    key={video._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td className="admin-table-amount">{video.order}</td>
                    <td>
                      <div className="admin-product-cell">
                        <div className="admin-product-thumb-lg">
                          {video.thumbnail ? (
                            <img src={video.thumbnail} alt={video.title} />
                          ) : (
                            <FiFilm size={16} style={{ color: "#aaa" }} />
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p className="admin-product-cell-name">{video.title}</p>
                          {video.description && (
                            <p className="admin-product-cell-sku" style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {video.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-cat">
                      {video.ytId ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <FiYoutube size={13} /> YouTube
                        </span>
                      ) : video.videoSrc ? (
                        "Uploaded file"
                      ) : (
                        <span style={{ color: "#aaa" }}>No source yet</span>
                      )}
                    </td>
                    <td>
                      <span className={`admin-stock-badge ${video.isActive ? "in-stock" : "out-of-stock"}`}>
                        <span className="admin-stock-dot" />
                        {video.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}>
                        <button
                          className="admin-action-btn-round"
                          title="Edit"
                          onClick={() => navigate(`/admin/add-video?edit=${video._id}`)}
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button
                          className="admin-action-btn-round admin-action-delete"
                          title="Delete"
                          onClick={() => handleDelete(video._id)}
                          disabled={deleteVideo.isPending}
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {videosQuery.isLoading ? (
                <AdminProductTableSkeleton rows={4} />
              ) : videos.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: "0.85rem" }}>
                    No videos yet. Add your first one for the homepage carousel.
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
