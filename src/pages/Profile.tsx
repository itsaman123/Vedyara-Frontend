import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiLogOut, FiUser, FiClock, FiCheckCircle } from "react-icons/fi";
import { getMyOrders } from "../api/orderApi";
import { getProfile } from "../api/userApi";
import { toast } from "react-hot-toast";
import { OrderHistorySkeleton } from "../components/Skeletons";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images?: string[];
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

interface UserProfile {
  name: string;
  email: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Seed from localStorage for instant render, then refresh from API
  const stored = localStorage.getItem("user");
  const storedUser: UserProfile | null = stored ? JSON.parse(stored) : null;
  const [user, setUser] = useState<UserProfile | null>(storedUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to view your profile");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [ordersData, profileData] = await Promise.all([
          getMyOrders(),
          getProfile(),
        ]);
        setOrders(ordersData);
        if (profileData?.user) {
          setUser({ name: profileData.user.name, email: profileData.user.email });
          localStorage.setItem("user", JSON.stringify(profileData.user));
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "text-green-600 bg-green-50 border-green-200";
      case "processing": return "text-blue-600 bg-blue-50 border-blue-200";
      case "shipped": return "text-purple-600 bg-purple-50 border-purple-200";
      case "cancelled": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-amber-600 bg-amber-50 border-amber-200"; // pending
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#faf9f7]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-32">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-3xl font-serif font-bold mb-4">
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
              <h2 className="font-bold text-xl text-[#3E2F1C]">{user?.name || "My Account"}</h2>
              <p className="text-sm text-stone-400 mt-1 truncate max-w-full px-2 text-center">{user?.email || ""}</p>
            </div>
            
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
                  activeTab === "profile" 
                    ? "bg-[#3E2F1C] text-white" 
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
                }`}
              >
                <FiUser /> Profile Details
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
                  activeTab === "orders" 
                    ? "bg-[#3E2F1C] text-white" 
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
                }`}
              >
                <FiPackage /> My Orders
              </button>
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
        <div className="flex-1">
          {activeTab === "orders" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm min-h-[500px]">
              <h1 className="font-serif font-bold text-3xl text-brand-brown mb-8">Order History</h1>
              
              {isLoading ? (
                <OrderHistorySkeleton />
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <FiPackage size={48} className="text-stone-300 mb-4" />
                  <h3 className="font-bold text-xl text-stone-800 mb-2">No orders found</h3>
                  <p className="text-stone-500 mb-6">Looks like you haven't placed any orders yet.</p>
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
                      className="border border-stone-200 rounded-2xl p-6 transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 mb-4 gap-4">
                        <div>
                          <p className="text-sm font-bold text-stone-500 mb-1">Order #{order.orderNumber}</p>
                          <div className="flex items-center gap-2 text-xs text-stone-400">
                            <FiClock /> {new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <div className="text-right">
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Total Amount</p>
                            <p className="font-bold text-lg text-[#3E2F1C]">₹{order.amount}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-stone-50 rounded-xl p-2 flex-shrink-0">
                              {item.product?.images?.[0] ? (
                                <img src={item.product.images[0]} alt="Product" className="w-full h-full object-contain" />
                              ) : (
                                <div className="w-full h-full bg-amber-100 rounded" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-stone-800">{item.product?.name || "Product Unavailable"}</h4>
                              <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="font-bold text-stone-800">
                              ₹{item.price}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {order.paymentStatus === "paid" && (
                        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-end gap-2 text-sm font-bold text-green-600">
                          <FiCheckCircle /> Payment Successful
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm min-h-[500px]">
              <h1 className="font-serif font-bold text-3xl text-brand-brown mb-8">Profile Details</h1>
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-bold text-stone-500 mb-2">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.name || ""}
                    placeholder={isLoading ? "Loading…" : "—"}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-500 mb-2">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    placeholder={isLoading ? "Loading…" : "—"}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 outline-none"
                  />
                </div>
                <p className="text-sm text-stone-400">
                  Profile editing will be available soon. Your details are managed during checkout.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
