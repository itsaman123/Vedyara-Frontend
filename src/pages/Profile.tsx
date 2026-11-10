import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FiPackage,
  FiLogOut,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { getMyOrders, type Order } from "../api/orderApi";
import * as userApi from "../api/userApi";
import { errorMessage } from "../api/http";
import { useAuth } from "../context/AuthContext";
import { OrderHistorySkeleton } from "../components/Skeletons";
import AddressForm from "../components/AddressForm";
import { Field } from "../components/FormField";
import {
  emptyAddress,
  normalizePhone,
  trimAddress,
  validateAddress,
  type AddressErrors,
} from "../utils/validation";
import { useSEO } from "../utils/seo";

type Tab = "orders" | "addresses" | "profile";

const statusStyles: Record<Order["status"], string> = {
  delivered: "text-green-700 bg-green-50 border-green-200",
  processing: "text-blue-700 bg-blue-50 border-blue-200",
  shipped: "text-purple-700 bg-purple-50 border-purple-200",
  cancelled: "text-red-700 bg-red-50 border-red-200",
  pending: "text-amber-700 bg-amber-50 border-amber-200",
};

const paymentLabel = (order: Order) => {
  if (order.paymentMethod === "cod") {
    return order.paymentStatus === "paid" ? "Cash on delivery · Paid" : "Cash on delivery";
  }
  return order.paymentStatus === "refunded" ? "Paid online · Refunded" : "Paid online";
};

/* ─────────────────────────────────────────────────────────────
   ORDERS
───────────────────────────────────────────────────────────── */
function OrdersTab() {
  const { data: orders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm min-h-[500px]">
      <h1 className="font-serif font-bold text-3xl text-brand-brown mb-8">Order History</h1>

      {isLoading ? (
        <OrderHistorySkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-stone-500 mb-4">We couldn't load your orders.</p>
          <button onClick={() => refetch()} className="px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-[#2D4A1E]">
            Try again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <FiPackage size={48} className="text-stone-300 mb-4" />
          <h3 className="font-bold text-xl text-stone-800 mb-2">No orders yet</h3>
          <p className="text-stone-500 mb-6">Your orders will show up here once you place one.</p>
          <Link to="/products" className="px-6 py-3 bg-[#D4AF37] text-[#3E2F1C] font-bold rounded-full hover:bg-[#e8c84a] transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-stone-200 rounded-2xl p-5 sm:p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 mb-4 gap-4">
                <div>
                  <p className="text-sm font-bold text-stone-500 mb-1">Order #{order.orderNumber}</p>
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <FiClock /> {new Date(order.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <div className="text-right">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Total</p>
                    <p className="font-bold text-lg text-[#3E2F1C]">₹{order.amount}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-stone-50 rounded-xl p-2 flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full bg-amber-100 rounded" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.slug ? (
                        <Link to={`/product/${item.slug}`} className="font-bold text-stone-800 hover:underline line-clamp-1">
                          {item.name.split("|")[0].trim()}
                        </Link>
                      ) : (
                        <h4 className="font-bold text-stone-800 line-clamp-1">{item.name.split("|")[0].trim()}</h4>
                      )}
                      <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-stone-800">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                <div className="text-stone-500 space-y-1">
                  {order.shippingAddress?.city && (
                    <p className="flex items-center gap-2">
                      <FiMapPin size={13} /> {order.shippingAddress.name}, {order.shippingAddress.city} — {order.shippingAddress.pincode}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    {order.paymentStatus === "paid" ? <FiCheckCircle size={13} className="text-green-600" /> : <FiTruck size={13} />}
                    {paymentLabel(order)}
                  </p>
                </div>
                {order.status !== "cancelled" && (
                  <Link
                    to={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}
                    className="font-semibold text-[#2D4A1E] whitespace-nowrap"
                  >
                    Track order →
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ADDRESSES
───────────────────────────────────────────────────────────── */
function AddressesTab({ user }: { user: userApi.User }) {
  const { setUser } = useAuth();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<userApi.AddressInput>(() => ({ ...emptyAddress(), name: user.name, phone: user.phone }));
  const [errors, setErrors] = useState<AddressErrors>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = async (id: string, action: () => Promise<{ user: userApi.User }>, success: string) => {
    setBusyId(id);
    try {
      setUser((await action()).user);
      toast.success(success);
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateAddress(draft);
    setErrors(found);
    if (Object.keys(found).length) return;
    if (await run("new", () => userApi.addAddress(trimAddress(draft)), "Address saved")) {
      setAdding(false);
      setDraft({ ...emptyAddress(), name: user.name, phone: user.phone });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm min-h-[500px]">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="font-serif font-bold text-3xl text-brand-brown">Addresses</h1>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#2D4A1E]"
          >
            <FiPlus size={15} /> Add address
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={save} noValidate className="mb-8 p-5 rounded-2xl border border-stone-200">
          <AddressForm value={draft} onChange={setDraft} errors={errors} />
          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              disabled={busyId === "new"}
              className="px-6 h-11 rounded-xl font-semibold text-sm text-white bg-[#2D4A1E] disabled:opacity-60"
            >
              {busyId === "new" ? "Saving…" : "Save address"}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="px-5 h-11 rounded-xl font-semibold text-sm text-stone-500 hover:bg-stone-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {user.addresses.length === 0 && !adding ? (
        <div className="flex flex-col items-center justify-center h-56 text-center">
          <FiMapPin size={40} className="text-stone-300 mb-4" />
          <p className="text-stone-500">No saved addresses yet. Addresses you use at checkout are saved here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.addresses.map((a) => (
            <div
              key={a._id}
              className="rounded-2xl border p-5 flex flex-col"
              style={{ borderColor: a.isDefault ? "#6B8E23" : "rgba(62,47,28,0.12)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <p className="font-bold text-stone-800">{a.name}</p>
                {a.isDefault && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-600 leading-6">
                {a.address}
                <br />
                {a.city}
                {a.state ? `, ${a.state}` : ""} — {a.pincode}
              </p>
              <p className="text-sm text-stone-400 mt-1">{a.phone}</p>
              <div className="flex gap-4 mt-4 pt-4 border-t border-stone-100 text-sm font-semibold">
                {!a.isDefault && (
                  <button
                    disabled={busyId === a._id}
                    onClick={() => run(a._id, () => userApi.setDefaultAddress(a._id), "Default address updated")}
                    className="text-[#2D4A1E] disabled:opacity-50"
                  >
                    Set as default
                  </button>
                )}
                <button
                  disabled={busyId === a._id}
                  onClick={() => run(a._id, () => userApi.deleteAddress(a._id), "Address removed")}
                  className="inline-flex items-center gap-1.5 text-stone-500 hover:text-red-600 disabled:opacity-50"
                >
                  <FiTrash2 size={13} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROFILE DETAILS
───────────────────────────────────────────────────────────── */
function ProfileTab({ user }: { user: userApi.User }) {
  const { setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [saving, setSaving] = useState(false);
  const dirty = name.trim() !== user.name || phone.trim() !== user.phone;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: typeof errors = {};
    if (name.trim().length < 2) found.name = "Enter your full name";
    if (phone.trim() && !normalizePhone(phone)) found.phone = "Enter a valid 10-digit mobile number";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const { user: updated } = await userApi.updateProfile({ name: name.trim(), phone: phone.trim() });
      setUser(updated);
      setPhone(updated.phone);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm min-h-[500px]">
      <h1 className="font-serif font-bold text-3xl text-brand-brown mb-8">Profile Details</h1>
      <form onSubmit={save} noValidate className="space-y-5 max-w-md">
        <Field label="Full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <Field
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
        />
        <Field
          label="Email address"
          type="email"
          value={user.email}
          disabled
          hint={user.emailVerified ? "Verified · used to sign in and for order updates" : "Used to sign in and for order updates"}
        />
        <button
          type="submit"
          disabled={!dirty || saving}
          className="px-8 h-12 rounded-xl font-semibold text-[15px] text-white bg-[#2D4A1E] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function Profile() {
  useSEO({ title: "My Account | Vedyara", noindex: true });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>(pathname === "/orders" ? "orders" : "profile");

  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />;
  }

  const handleLogout = () => {
    signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "orders", label: "My Orders", icon: <FiPackage /> },
    { id: "addresses", label: "Addresses", icon: <FiMapPin /> },
    { id: "profile", label: "Profile Details", icon: <FiUser /> },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#faf9f7]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm md:sticky md:top-32">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-3xl font-serif font-bold mb-4">
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
              <h2 className="font-bold text-xl text-[#3E2F1C] text-center">{user?.name || "My Account"}</h2>
              <p className="text-sm text-stone-400 mt-1 truncate max-w-full px-2 text-center">{user?.email || ""}</p>
            </div>

            <nav className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#3E2F1C] text-white"
                      : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
              <div className="h-px bg-stone-100 my-2" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-colors"
              >
                <FiLogOut /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "addresses" && user && <AddressesTab user={user} />}
          {activeTab === "profile" && user && <ProfileTab key={user._id} user={user} />}
        </div>
      </div>
    </div>
  );
}
