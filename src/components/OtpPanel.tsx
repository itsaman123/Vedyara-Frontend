import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import { errorMessage } from "../api/http";
import { requestOtp, verifyOtp, type Session } from "../api/userApi";

const RESEND_SECONDS = 30;

export default function OtpPanel({
  email,
  onVerified,
  onChangeEmail,
  intro,
  submitLabel = "Verify & continue",
}: {
  email: string;
  /** Runs with the new session; the panel stays busy until it settles */
  onVerified: (session: Session) => Promise<void> | void;
  onChangeEmail?: () => void;
  intro?: string;
  submitLabel?: string;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from the email");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onVerified(await verifyOtp(email, code));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    try {
      await requestOtp(email);
      setCooldown(RESEND_SECONDS);
      setCode("");
      setError("");
      toast.success("A new code is on its way");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex items-start gap-3 mb-5">
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(212,175,55,0.14)" }}
        >
          <FiMail size={18} style={{ color: "#9A7012" }} />
        </span>
        <p className="text-sm leading-6 text-stone-600">
          {intro ?? "Enter the 6-digit code we emailed to"}{" "}
          <span className="font-semibold text-[#2a1f12] break-all">{email}</span>
        </p>
      </div>

      <label htmlFor="otp-code" className="block text-[13px] font-semibold mb-1.5 text-[#3E2F1C]">
        Verification code
      </label>
      <input
        id="otp-code"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        placeholder="••••••"
        aria-invalid={!!error}
        className="w-full max-w-[220px] h-14 px-4 rounded-xl border bg-white text-2xl font-semibold tracking-[0.5em] text-[#2a1f12] outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.16)]"
        style={{ borderColor: error ? "#d9534f" : "rgba(62,47,28,0.15)" }}
      />
      {error && <p className="text-xs mt-1.5 text-[#b4281d]">{error}</p>}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm">
        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0}
          className="font-semibold text-[#2D4A1E] disabled:text-stone-400"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
        {onChangeEmail && (
          <button type="button" onClick={onChangeEmail} className="font-semibold text-stone-500 hover:text-stone-700">
            Use a different email
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full sm:w-auto px-8 h-12 rounded-xl font-semibold text-[15px] text-white transition-opacity disabled:opacity-60"
        style={{ background: "#2D4A1E" }}
      >
        {busy ? "Please wait…" : submitLabel}
      </button>
    </form>
  );
}
