import { FiMinus, FiPlus } from "react-icons/fi";

export default function QuantityStepper({
  value,
  onChange,
  max,
  disabled = false,
  size = "md",
}: {
  value: number;
  onChange: (next: number) => void;
  /** Upper bound, usually the stock left; omit when unlimited */
  max?: number | null;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-9" : "h-12";
  const btn = size === "sm" ? "w-8" : "w-11";
  const atMax = max !== undefined && max !== null && value >= max;

  return (
    <div
      className={`inline-flex items-center ${box} rounded-xl border bg-white select-none`}
      style={{ borderColor: "rgba(62,47,28,0.15)" }}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        className={`${btn} h-full flex items-center justify-center text-[#3E2F1C] disabled:opacity-30 transition-opacity`}
      >
        <FiMinus size={14} />
      </button>
      <span className="min-w-[2rem] text-center text-sm font-semibold text-[#2a1f12]" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || atMax}
        onClick={() => onChange(value + 1)}
        className={`${btn} h-full flex items-center justify-center text-[#3E2F1C] disabled:opacity-30 transition-opacity`}
      >
        <FiPlus size={14} />
      </button>
    </div>
  );
}
