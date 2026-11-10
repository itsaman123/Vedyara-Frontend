import { useId } from "react";

const controlClass =
  "w-full h-12 px-4 rounded-xl border bg-white text-[15px] text-[#2a1f12] outline-none transition-shadow placeholder:text-stone-400 focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.16)] disabled:bg-stone-50 disabled:text-stone-500";

type Common = { label: string; error?: string; hint?: string; className?: string };

function Wrapper({
  id,
  label,
  error,
  hint,
  className = "",
  children,
}: Common & { id: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[13px] font-semibold mb-1.5 text-[#3E2F1C]">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs mt-1.5 text-[#b4281d]">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs mt-1.5 text-stone-400">{hint}</p>
      ) : null}
    </div>
  );
}

export function Field({
  label,
  error,
  hint,
  className,
  ...props
}: Common & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} className={className}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={controlClass}
        style={{ borderColor: error ? "#d9534f" : "rgba(62,47,28,0.15)" }}
        {...props}
      />
    </Wrapper>
  );
}

export function SelectField({
  label,
  error,
  hint,
  className,
  children,
  ...props
}: Common & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className">) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} className={className}>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${controlClass} cursor-pointer`}
        style={{ borderColor: error ? "#d9534f" : "rgba(62,47,28,0.15)" }}
        {...props}
      >
        {children}
      </select>
    </Wrapper>
  );
}
