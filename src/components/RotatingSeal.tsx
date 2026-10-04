import { useId } from "react";

/**
 * Circular badge with text running around the edge and a slow spin —
 * used as a decorative "seal" over hero and product imagery.
 */
export default function RotatingSeal({
  text = "100% PURE · RAW · NATURAL · LAB TESTED · ",
  size = 112,
  color = "#2a1f12",
  background = "rgba(255,255,255,0.92)",
  center = "🍯",
  duration = 18,
  className = "",
}: {
  text?: string;
  size?: number;
  color?: string;
  background?: string;
  center?: React.ReactNode;
  duration?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const pathId = `seal-path-${id}`;

  return (
    <div
      className={`relative rounded-full flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, background, boxShadow: "0 10px 30px rgba(42,31,18,0.18)" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className="seal-spin absolute inset-0 w-full h-full"
        style={{ animationDuration: `${duration}s` }}
      >
        <defs>
          <path id={pathId} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fill={color} style={{ fontSize: 9.2, fontWeight: 600, letterSpacing: 1.6, fontFamily: "Inter, sans-serif" }}>
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      <span
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: size * 0.42,
          height: size * 0.42,
          fontSize: size * 0.2,
          border: `1px dashed ${color}33`,
        }}
      >
        {center}
      </span>
    </div>
  );
}
