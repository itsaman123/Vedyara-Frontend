export default function TrustBanner() {
  const items = [
    { emoji: "🛒", label: "Now Live on Amazon India" },
    { emoji: "🔬", label: "Lab Tested Every Batch" },
    { emoji: "🌿", label: "100% Natural" },
    { emoji: "🌾", label: "Farm Sourced" },
    { emoji: "🚫", label: "No Chemicals" },
    { emoji: "🔒", label: "Secure Payments" },
    { emoji: "🏆", label: "FSSAI Certified" },
    { emoji: "🚚", label: "Pan-India Delivery" },
    { emoji: "✅", label: "Zero Preservatives" },
  ];

  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden py-3.5 border-y"
      style={{ background: "#2D4A1E", borderColor: "rgba(212,175,55,0.25)" }}
    >
      <div
        className="flex items-center"
        style={{ animation: "trustMarquee 32s linear infinite", width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 flex-shrink-0" style={{ margin: "0 28px" }}>
            <span style={{ fontSize: "1rem" }}>{item.emoji}</span>
            <span
              style={{
                color: "rgba(255,255,255,0.92)",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </span>
            {i < doubled.length - 1 && (
              <span style={{ color: "#D4AF37", fontSize: "0.55rem", marginLeft: "12px" }}>✦</span>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes trustMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
