import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/* ── Product Card Skeleton (grid view) ── */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 20px rgba(62,47,28,0.08)" }}>
      <div className="aspect-[4/3]">
        <Skeleton height="100%" borderRadius={0} />
      </div>
      <div className="px-4 pt-3 pb-3.5">
        <Skeleton width={70} height={9} className="mb-1.5" />
        <Skeleton height={17} className="mb-2" />
        <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
          <div>
            <Skeleton width={50} height={18} />
            <Skeleton width={36} height={10} className="mt-0.5" />
          </div>
          <Skeleton width={56} height={32} borderRadius={12} />
        </div>
      </div>
    </div>
  );
}

/* ── Honey Video Card Skeleton ── */
export function HoneyVideoCardSkeleton() {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden">
      <Skeleton height="100%" borderRadius={0} baseColor="#241708" highlightColor="#3a2610" />
    </div>
  );
}

/* ── Product List Row Skeleton ── */
export function ProductListRowSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex"
      style={{ minHeight: "160px", boxShadow: "0 2px 16px rgba(62,47,28,0.07)" }}
    >
      <Skeleton width={160} height={160} borderRadius={0} />
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <Skeleton width={100} height={14} className="mb-2" />
          <Skeleton height={22} className="mb-2" />
          <Skeleton count={2} height={13} />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <Skeleton width={80} height={16} />
          <div className="flex items-center gap-2">
            <Skeleton width={36} height={36} borderRadius={12} />
            <Skeleton width={64} height={36} borderRadius={12} />
            <Skeleton width={80} height={36} borderRadius={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Cart Item Skeleton ── */
export function CartItemSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
      <Skeleton width={96} height={96} borderRadius={12} />
      <div className="flex-1 w-full">
        <Skeleton height={22} className="mb-1" />
        <Skeleton width={80} height={16} className="mb-3" />
        <div className="flex items-center gap-4">
          <Skeleton width={120} height={36} borderRadius={8} />
          <Skeleton circle width={28} height={28} />
        </div>
      </div>
      <Skeleton width={60} height={24} />
    </div>
  );
}

/* ── Wishlist Card Skeleton ── */
export function WishlistCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(62,47,28,0.07)" }}>
      <Skeleton height={224} borderRadius={0} />
      <div className="p-6">
        <Skeleton height={22} className="mb-2" />
        <Skeleton width={80} height={20} className="mb-6" />
        <Skeleton height={44} borderRadius={12} className="mb-3" />
        <Skeleton height={44} borderRadius={12} />
      </div>
    </div>
  );
}

/* ── Product Detail Skeleton ── */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8" style={{ background: "#FDFCFB" }}>
      <div className="max-w-[1440px] mx-auto">
        <Skeleton width={130} height={20} className="mb-8" />
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left: Image gallery */}
          <div className="lg:w-1/2 space-y-4">
            <Skeleton className="w-full aspect-square" borderRadius={24} />
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} width={96} height={96} borderRadius={16} />
              ))}
            </div>
          </div>
          {/* Right: Info */}
          <div className="lg:w-1/2 space-y-6">
            <div>
              <Skeleton width={100} height={14} className="mb-3" />
              <Skeleton height={52} />
            </div>
            <Skeleton width={200} height={34} borderRadius={999} />
            <Skeleton width={150} height={52} />
            <div>
              <Skeleton count={3} height={16} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height={56} borderRadius={16} />
              ))}
            </div>
            <div className="flex items-center gap-4 py-4">
              <Skeleton width={140} height={48} borderRadius={12} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton height={64} borderRadius={16} className="flex-1" />
              <Skeleton height={64} borderRadius={16} className="flex-1" />
              <Skeleton width={64} height={64} borderRadius={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Admin: Stat Card Value ── */
export function AdminStatSkeleton() {
  return <Skeleton width={56} height={30} borderRadius={6} />;
}

/* ── Admin: Products Table Rows (7 cols) ── */
export function AdminProductTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <tr key={i}>
          <td><Skeleton width={16} height={16} borderRadius={3} /></td>
          <td>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Skeleton width={40} height={40} borderRadius={8} />
              <div>
                <Skeleton width={120} height={13} style={{ marginBottom: 5 }} />
                <Skeleton width={80} height={11} />
              </div>
            </div>
          </td>
          <td><Skeleton width={60} height={13} /></td>
          <td><Skeleton width={50} height={13} /></td>
          <td><Skeleton width={30} height={13} /></td>
          <td><Skeleton width={80} height={22} borderRadius={99} /></td>
          <td style={{ textAlign: "right" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
              <Skeleton width={28} height={28} borderRadius={8} />
              <Skeleton width={28} height={28} borderRadius={8} />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

/* ── Admin: Orders Table Rows (7 cols) ── */
export function AdminOrderTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <tr key={i}>
          <td><Skeleton width={90} height={13} /></td>
          <td>
            <Skeleton width={130} height={13} style={{ marginBottom: 5 }} />
            <Skeleton width={150} height={11} />
          </td>
          <td><Skeleton width={20} height={13} /></td>
          <td><Skeleton width={55} height={13} /></td>
          <td><Skeleton width={80} height={22} borderRadius={99} /></td>
          <td><Skeleton width={90} height={13} /></td>
          <td style={{ textAlign: "right" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Skeleton width={28} height={28} borderRadius={8} />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

/* ── Admin: Inventory Table Rows (6 cols) ── */
export function AdminInventoryTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <tr key={i}>
          <td>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Skeleton width={40} height={40} borderRadius={8} />
              <div>
                <Skeleton width={120} height={13} style={{ marginBottom: 5 }} />
                <Skeleton width={80} height={11} />
              </div>
            </div>
          </td>
          <td><Skeleton width={60} height={13} /></td>
          <td><Skeleton width={40} height={13} /></td>
          <td><Skeleton width={50} height={13} /></td>
          <td><Skeleton width={80} height={22} borderRadius={99} /></td>
          <td><Skeleton width={90} height={13} /></td>
        </tr>
      ))}
    </>
  );
}

/* ── Order History Skeleton (Profile page) ── */
export function OrderHistorySkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border border-stone-100 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 mb-4 gap-4">
            <div>
              <Skeleton width={160} height={14} className="mb-1" />
              <Skeleton width={120} height={12} />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton width={80} height={28} borderRadius={999} />
              <Skeleton width={70} height={28} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton width={64} height={64} borderRadius={12} />
            <div className="flex-1">
              <Skeleton height={18} className="mb-2" />
              <Skeleton width={60} height={13} />
            </div>
            <Skeleton width={60} height={18} />
          </div>
        </div>
      ))}
    </div>
  );
}
