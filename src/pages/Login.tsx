import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { ApiError, errorMessage } from "../api/http";
import { requestOtp, type Session } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { Field } from "../components/FormField";
import OtpPanel from "../components/OtpPanel";
import { isEmail } from "../utils/validation";
import { useSEO } from "../utils/seo";

// Only same-site paths, so ?next= can't bounce users to another website
const safeNext = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/profile";

export default function Login() {
  useSEO({ title: "Sign in | Vedyara", noindex: true });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const { isAuthenticated, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [noAccount, setNoAccount] = useState(false);
  const [sending, setSending] = useState(false);
  const [codeSentTo, setCodeSentTo] = useState<string | null>(null);

  if (isAuthenticated && !codeSentTo) return <Navigate to={next} replace />;

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoAccount(false);
    if (!isEmail(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setSending(true);
    try {
      const { email: confirmed } = await requestOtp(email.trim().toLowerCase());
      setCodeSentTo(confirmed);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setNoAccount(true);
      else setError(errorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const handleVerified = (session: Session) => {
    signIn(session);
    navigate(next, { replace: true });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[#faf9f7] flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border p-7 sm:p-9 h-fit"
        style={{ borderColor: "rgba(62,47,28,0.09)" }}
      >
        <h1 className="font-serif font-bold text-3xl mb-2 text-[#2a1f12]">Sign in</h1>
        <p className="text-sm text-stone-500 mb-7 leading-6">
          Use the email from your orders. We'll send you a one-time code — no password needed.
        </p>

        {codeSentTo ? (
          <OtpPanel
            email={codeSentTo}
            submitLabel="Sign in"
            onVerified={handleVerified}
            onChangeEmail={() => setCodeSentTo(null)}
          />
        ) : (
          <form onSubmit={sendCode} noValidate>
            <Field
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />

            {noAccount && (
              <div className="mt-4 p-4 rounded-xl text-sm leading-6 bg-amber-50 text-[#7a5c1a]">
                We couldn't find an account for this email. Your account is created automatically when you
                place your first order.{" "}
                <Link to="/products" className="font-semibold underline">
                  Start shopping
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="mt-6 w-full h-12 rounded-xl font-semibold text-[15px] text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "#2D4A1E" }}
            >
              {sending ? "Sending code…" : "Send code"} {!sending && <FiArrowRight size={16} />}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
