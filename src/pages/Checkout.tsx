import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FiAlertCircle,
  FiCheck,
  FiChevronRight,
  FiCreditCard,
  FiLock,
  FiPackage,
  FiTruck,
} from "react-icons/fi";
import { availableStock, sellingPrice, useProduct } from "../api/productApi";
import {
  cancelPayment,
  createCodOrder,
  createRazorpayOrder,
  getPaymentConfig,
  verifyPayment,
  type Order,
  type PaymentMethod,
  type PlaceOrderInput,
} from "../api/orderApi";
import { checkoutAuth, type AddressInput, type Session } from "../api/userApi";
import { errorMessage } from "../api/http";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import AddressForm from "../components/AddressForm";
import { Field } from "../components/FormField";
import OtpPanel from "../components/OtpPanel";
import { loadRazorpayScript } from "../utils/payment";
import {
  emptyAddress,
  isEmail,
  normalizePhone,
  trimAddress,
  validateAddress,
  type AddressErrors,
} from "../utils/validation";
import { useSEO } from "../utils/seo";

const INK = "#2a1f12";
const LINE = "rgba(62,47,28,0.09)";
const NEW_ADDRESS = "new";

type Line = {
  productId: string;
  name: string;
  image: string;
  slug: string;
  unit?: string;
  price: number;
  mrp?: number;
  quantity: number;
  available: boolean;
};

type Contact = { name: string; email: string; phone: string };
type ContactErrors = Partial<Record<keyof Contact, string>>;

class PaymentDismissed extends Error {}

/* ─────────────────────────────────────────────────────────────
   SECTION SHELL
───────────────────────────────────────────────────────────── */
function Section({
  step,
  title,
  aside,
  children,
}: {
  step: number;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border p-5 sm:p-7" style={{ borderColor: LINE }}>
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="flex items-center gap-3 font-semibold text-[17px]" style={{ color: INK }}>
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#2D4A1E", color: "#fff" }}
          >
            {step}
          </span>
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

function ChoiceCard({
  checked,
  onSelect,
  disabled,
  children,
  name,
}: {
  checked: boolean;
  onSelect: () => void;
  disabled?: boolean;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${disabled ? "opacity-55 cursor-not-allowed" : "cursor-pointer"}`}
      style={{
        borderColor: checked ? "#6B8E23" : "rgba(62,47,28,0.14)",
        background: checked ? "rgba(107,142,35,0.05)" : "#fff",
        boxShadow: checked ? "0 0 0 1px #6B8E23" : "none",
      }}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onSelect}
        className="mt-1 accent-[#2D4A1E] w-4 h-4 flex-shrink-0"
      />
      <span className="flex-1 min-w-0">{children}</span>
    </label>
  );
}

/* ─────────────────────────────────────────────────────────────
   CHECKOUT PAGE
───────────────────────────────────────────────────────────── */
export default function Checkout() {
  useSEO({ title: "Checkout | Vedyara", noindex: true });
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, signIn, signOut } = useAuth();
  const { cart, isLoading: cartLoading, clearCart } = useCart();

  // "Buy now" checks out a single product without touching the cart
  const buySlug = searchParams.get("buy") ?? "";
  const buyQty = Math.max(1, Number.parseInt(searchParams.get("qty") ?? "1", 10) || 1);
  const isBuyNow = !!buySlug;
  const { data: buyProduct, isLoading: productLoading, isError: productError } = useProduct(buySlug);

  const paymentConfig = useQuery({
    queryKey: ["payment-config"],
    queryFn: getPaymentConfig,
    staleTime: 5 * 60 * 1000,
  });
  const onlineEnabled = !!paymentConfig.data?.razorpayEnabled;

  const lines: Line[] = useMemo(() => {
    if (isBuyNow) {
      if (!buyProduct) return [];
      const stock = availableStock(buyProduct);
      return [
        {
          productId: buyProduct._id,
          name: buyProduct.name,
          image: buyProduct.images[0] || "",
          slug: buyProduct.slug,
          unit: buyProduct.unit,
          price: sellingPrice(buyProduct),
          mrp: buyProduct.price,
          quantity: stock === null ? buyQty : Math.min(buyQty, Math.max(stock, 1)),
          available: stock === null || stock > 0,
        },
      ];
    }
    return (cart?.items ?? []).map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      slug: item.slug,
      unit: item.unit,
      price: item.price,
      mrp: item.mrp,
      quantity: item.quantity,
      available: item.available !== false,
    }));
  }, [isBuyNow, buyProduct, buyQty, cart]);

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const mrpTotal = lines.reduce((sum, l) => sum + (l.mrp ?? l.price) * l.quantity, 0);
  const savings = Math.max(0, mrpTotal - subtotal);
  const hasUnavailable = lines.some((l) => !l.available);

  /* ── form state ── */
  const [contact, setContact] = useState<Contact>({ name: "", email: "", phone: "" });
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const savedAddresses = user?.addresses ?? [];
  const [addressChoice, setAddressChoice] = useState<string>(
    () => savedAddresses.find((a) => a.isDefault)?._id ?? savedAddresses[0]?._id ?? NEW_ADDRESS,
  );
  const [newAddress, setNewAddress] = useState<AddressInput>(() => ({
    ...emptyAddress(),
    name: user?.name ?? "",
    phone: user?.phone ?? "",
  }));
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});
  const [saveAddress, setSaveAddress] = useState(true);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const paymentMethod: PaymentMethod = method ?? (onlineEnabled ? "razorpay" : "cod");

  const [placing, setPlacing] = useState(false);
  // Returning customer at checkout: holds the order until their email is verified
  const [otpFor, setOtpFor] = useState<{ email: string; address: AddressInput } | null>(null);

  const selectedSaved = savedAddresses.find((a) => a._id === addressChoice);
  const usingNewAddress = !selectedSaved;

  // Mirror the buyer's name and phone into the address until edited separately
  const updateContact = (next: Contact) => {
    setNewAddress((a) => ({
      ...a,
      name: a.name === contact.name ? next.name : a.name,
      phone: a.phone === contact.phone ? next.phone : a.phone,
    }));
    setContact(next);
  };

  /* ── place order ── */
  const finish = (order: Order) => {
    navigate("/order-confirmation", { replace: true, state: { order } });
    if (!isBuyNow) void clearCart();
  };

  const payOnline = async (payload: PlaceOrderInput, prefill: { name: string; email: string; contact: string }) => {
    const rzp = await createRazorpayOrder(payload);

    if (!(await loadRazorpayScript()) || !window.Razorpay) {
      void cancelPayment(rzp.orderId).catch(() => {});
      throw new Error("Couldn't open the payment window. Check your connection, or choose Cash on Delivery.");
    }
    const Razorpay = window.Razorpay;

    await new Promise<void>((resolve, reject) => {
      const checkout = new Razorpay({
        key: rzp.keyId,
        amount: rzp.razorpayOrder.amount,
        currency: rzp.razorpayOrder.currency,
        order_id: rzp.razorpayOrder.id,
        name: "Vedyara",
        description: `Order ${rzp.orderNumber}`,
        image: `${window.location.origin}/vedyara-logo.png`,
        prefill,
        theme: { color: "#3E2F1C" },
        handler: async (response) => {
          try {
            finish(await verifyPayment({ orderId: rzp.orderId, ...response }));
            resolve();
          } catch {
            reject(
              new Error(
                "Your payment went through but we couldn't confirm it here. Please check My Orders in a minute, or contact us with your payment ID.",
              ),
            );
          }
        },
        modal: {
          ondismiss: () => {
            void cancelPayment(rzp.orderId).catch(() => {});
            reject(new PaymentDismissed());
          },
        },
      });
      // Razorpay keeps its window open for a retry after a failed attempt
      checkout.on("payment.failed", (response) => {
        toast.error(response.error.description || "Payment failed. Please try again.");
      });
      checkout.open();
    });
  };

  const placeOrder = async (address: AddressInput, buyer: { name: string; email: string }) => {
    const payload: PlaceOrderInput = {
      items: lines.map(({ productId, quantity }) => ({ productId, quantity })),
      shippingAddress: address,
      saveAddress: usingNewAddress ? saveAddress : false,
    };

    try {
      if (paymentMethod === "cod") {
        finish(await createCodOrder(payload));
      } else {
        await payOnline(payload, { name: buyer.name, email: buyer.email, contact: address.phone });
      }
    } catch (error) {
      if (error instanceof PaymentDismissed) {
        toast("Payment cancelled. Your items are still here when you're ready.", { icon: "🛒" });
      } else {
        toast.error(errorMessage(error), { duration: 6000 });
      }
    }
  };

  const validate = () => {
    const cErrors: ContactErrors = {};
    if (!isAuthenticated) {
      if (contact.name.trim().length < 2) cErrors.name = "Enter your full name";
      if (!isEmail(contact.email)) cErrors.email = "Enter a valid email address";
      if (!normalizePhone(contact.phone)) cErrors.phone = "Enter a valid 10-digit mobile number";
    }
    const aErrors = usingNewAddress ? validateAddress(newAddress) : {};
    setContactErrors(cErrors);
    setAddressErrors(aErrors);
    return Object.keys(cErrors).length === 0 && Object.keys(aErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (placing) return;

    if (!validate()) {
      toast.error("Please check the highlighted fields");
      document.querySelector("[aria-invalid='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const address = selectedSaved
      ? trimAddress({
          name: selectedSaved.name,
          phone: selectedSaved.phone,
          address: selectedSaved.address,
          city: selectedSaved.city,
          state: selectedSaved.state ?? "",
          pincode: selectedSaved.pincode,
        })
      : trimAddress(newAddress);

    setPlacing(true);
    try {
      if (!isAuthenticated) {
        const buyer = {
          name: contact.name.trim(),
          email: contact.email.trim().toLowerCase(),
          phone: normalizePhone(contact.phone) ?? contact.phone,
        };
        const result = await checkoutAuth(buyer);
        if (result.otpRequired) {
          setOtpFor({ email: result.email, address });
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        signIn(result);
        await placeOrder(address, result.user);
      } else if (user) {
        await placeOrder(address, user);
      }
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setPlacing(false);
    }
  };

  const handleVerified = async (session: Session) => {
    if (!otpFor) return;
    signIn(session);
    setPlacing(true);
    try {
      await placeOrder(otpFor.address, session.user);
    } finally {
      setPlacing(false);
      setOtpFor(null);
    }
  };

  /* ── states ── */
  const loading = isBuyNow ? productLoading : cartLoading;
  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[#faf9f7]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="h-80 bg-white rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center bg-[#faf9f7]">
        <FiPackage size={44} className="text-stone-300 mb-5" />
        <h1 className="font-serif font-bold text-3xl mb-3" style={{ color: INK }}>
          {isBuyNow && productError ? "This product isn't available" : "Your cart is empty"}
        </h1>
        <p className="text-stone-500 mb-8 max-w-sm">Add something you love and come back to check out.</p>
        <Link
          to="/products"
          className="px-8 py-3.5 rounded-xl font-semibold text-white"
          style={{ background: "#2D4A1E" }}
        >
          Browse products
        </Link>
      </div>
    );
  }

  const submitLabel = placing
    ? "Placing your order…"
    : paymentMethod === "cod"
      ? `Place order · ₹${subtotal}`
      : `Pay ₹${subtotal} securely`;

  const submitButton = (className: string) => (
    <button
      type="submit"
      form="checkout-form"
      disabled={placing || hasUnavailable}
      className={`w-full py-4 rounded-xl font-semibold text-[15px] text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-55 ${className}`}
      style={{ background: "#2D4A1E", boxShadow: "0 10px 26px rgba(45,74,30,0.25)" }}
    >
      <FiLock size={15} /> {submitLabel}
    </button>
  );

  const loginHref = `/login?next=${encodeURIComponent(location.pathname + location.search)}`;

  /* ── render ── */
  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-[#faf9f7]">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
          {isBuyNow ? (
            <Link to={`/product/${buySlug}`} className="hover:text-stone-600">Product</Link>
          ) : (
            <Link to="/cart" className="hover:text-stone-600">Cart</Link>
          )}
          <FiChevronRight size={12} />
          <span className="text-stone-600">Checkout</span>
        </nav>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl mb-8" style={{ color: INK }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8 items-start">
          {/* ══════════ LEFT — details ══════════ */}
          <div className="space-y-5">
            {otpFor ? (
              <Section step={1} title="Welcome back! Verify your email">
                <OtpPanel
                  email={otpFor.email}
                  intro="You've shopped with us before. To keep your account safe, enter the 6-digit code we emailed to"
                  submitLabel={paymentMethod === "cod" ? "Verify & place order" : "Verify & pay"}
                  onVerified={handleVerified}
                  onChangeEmail={() => setOtpFor(null)}
                />
              </Section>
            ) : (
              <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* 1 — Contact */}
                <Section
                  step={1}
                  title="Contact details"
                  aside={
                    isAuthenticated ? (
                      <button type="button" onClick={signOut} className="text-xs font-semibold text-stone-500 hover:text-stone-700">
                        Not you? Sign out
                      </button>
                    ) : (
                      <Link to={loginHref} className="text-xs font-semibold text-[#2D4A1E]">
                        Have an account? Sign in
                      </Link>
                    )
                  }
                >
                  {isAuthenticated && user ? (
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-serif font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: INK }}>{user.name}</p>
                        <p className="text-sm text-stone-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field
                          label="Full name"
                          autoComplete="name"
                          value={contact.name}
                          onChange={(e) => updateContact({ ...contact, name: e.target.value })}
                          error={contactErrors.name}
                        />
                        <Field
                          label="Mobile number"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="10-digit mobile"
                          value={contact.phone}
                          onChange={(e) => updateContact({ ...contact, phone: e.target.value })}
                          error={contactErrors.phone}
                        />
                        <Field
                          label="Email"
                          type="email"
                          autoComplete="email"
                          className="sm:col-span-2"
                          value={contact.email}
                          onChange={(e) => updateContact({ ...contact, email: e.target.value })}
                          error={contactErrors.email}
                          hint="Order updates go here"
                        />
                      </div>
                      <p className="flex items-start gap-2 text-xs text-stone-500 mt-4 leading-5">
                        <FiCheck size={14} className="mt-0.5 flex-shrink-0 text-[#6B8E23]" />
                        We'll create your Vedyara account with these details, so you can track this order and check out faster next time.
                      </p>
                    </>
                  )}
                </Section>

                {/* 2 — Address */}
                <Section step={2} title="Delivery address">
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {savedAddresses.map((a) => (
                        <ChoiceCard
                          key={a._id}
                          name="address"
                          checked={addressChoice === a._id}
                          onSelect={() => setAddressChoice(a._id)}
                        >
                          <span className="flex items-center gap-2">
                            <span className="font-semibold text-sm" style={{ color: INK }}>{a.name}</span>
                            {a.isDefault && (
                              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                                Default
                              </span>
                            )}
                          </span>
                          <span className="block text-sm text-stone-600 mt-1 leading-5">
                            {a.address}, {a.city}
                            {a.state ? `, ${a.state}` : ""} — {a.pincode}
                          </span>
                          <span className="block text-xs text-stone-400 mt-1">{a.phone}</span>
                        </ChoiceCard>
                      ))}
                      <ChoiceCard
                        name="address"
                        checked={addressChoice === NEW_ADDRESS}
                        onSelect={() => setAddressChoice(NEW_ADDRESS)}
                      >
                        <span className="font-semibold text-sm" style={{ color: INK }}>Deliver to a new address</span>
                      </ChoiceCard>
                    </div>
                  )}

                  {usingNewAddress && (
                    <>
                      <AddressForm value={newAddress} onChange={setNewAddress} errors={addressErrors} />
                      {isAuthenticated && (
                        <label className="flex items-center gap-2.5 mt-4 text-sm text-stone-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saveAddress}
                            onChange={(e) => setSaveAddress(e.target.checked)}
                            className="w-4 h-4 accent-[#2D4A1E]"
                          />
                          Save this address to my account
                        </label>
                      )}
                    </>
                  )}
                </Section>

                {/* 3 — Payment */}
                <Section step={3} title="Payment">
                  <div className="space-y-3">
                    <ChoiceCard
                      name="payment"
                      checked={paymentMethod === "razorpay"}
                      onSelect={() => setMethod("razorpay")}
                      disabled={!onlineEnabled}
                    >
                      <span className="flex items-center gap-2 font-semibold text-sm" style={{ color: INK }}>
                        <FiCreditCard size={15} /> Pay online
                        {!onlineEnabled && !paymentConfig.isLoading && (
                          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                            Coming soon
                          </span>
                        )}
                      </span>
                      <span className="block text-xs text-stone-500 mt-1">UPI, cards, netbanking and wallets via Razorpay</span>
                    </ChoiceCard>
                    <ChoiceCard name="payment" checked={paymentMethod === "cod"} onSelect={() => setMethod("cod")}>
                      <span className="flex items-center gap-2 font-semibold text-sm" style={{ color: INK }}>
                        <FiTruck size={15} /> Cash on delivery
                      </span>
                      <span className="block text-xs text-stone-500 mt-1">Pay in cash when your order arrives</span>
                    </ChoiceCard>
                  </div>
                </Section>

                {submitButton("lg:hidden")}
              </form>
            )}
          </div>

          {/* ══════════ RIGHT — summary ══════════ */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border p-5 sm:p-6 lg:sticky lg:top-28"
            style={{ borderColor: LINE }}
          >
            <h2 className="font-semibold text-[17px] mb-4" style={{ color: INK }}>
              Order summary
            </h2>
            <ul className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
              {lines.map((l) => (
                <li key={l.productId} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl bg-stone-50 border flex-shrink-0" style={{ borderColor: LINE }}>
                    {l.image ? (
                      <img src={l.image} alt="" className="w-full h-full object-contain p-1" />
                    ) : (
                      <FiPackage className="m-auto mt-4 text-stone-300" />
                    )}
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#3E2F1C] text-white text-[11px] font-bold flex items-center justify-center">
                      {l.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: INK }}>
                      {l.name.split("|")[0].trim()}
                    </p>
                    {l.available ? (
                      l.unit && <p className="text-xs text-stone-400">{l.unit}</p>
                    ) : (
                      <p className="text-xs font-semibold text-[#b4281d]">Out of stock</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: INK }}>₹{l.price * l.quantity}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 pt-5 border-t space-y-2.5 text-sm" style={{ borderColor: LINE }}>
              <div className="flex justify-between text-stone-500">
                <dt>Subtotal</dt>
                <dd>₹{mrpTotal}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-[#3d6b1a]">
                  <dt>Discount</dt>
                  <dd>−₹{savings}</dd>
                </div>
              )}
              <div className="flex justify-between text-stone-500">
                <dt>Shipping</dt>
                <dd className="font-semibold text-[#3d6b1a]">Free</dd>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t" style={{ borderColor: LINE }}>
                <dt className="font-semibold" style={{ color: INK }}>Total</dt>
                <dd className="text-xl font-bold" style={{ color: INK }}>₹{subtotal}</dd>
              </div>
            </dl>

            {hasUnavailable && (
              <p className="flex items-start gap-2 mt-4 p-3 rounded-xl text-xs leading-5 bg-red-50 text-[#a3311f]">
                <FiAlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                Some items are out of stock. {isBuyNow ? "Please choose another product." : "Remove them from your cart to continue."}
              </p>
            )}

            {!otpFor && submitButton("hidden lg:flex mt-5")}

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 mt-4">
              <FiLock size={11} /> Secure checkout · Prices include all taxes
            </p>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
