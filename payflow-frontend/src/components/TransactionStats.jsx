const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 2,
  }).format(n);

const StatCard = ({ label, value, accent, icon, sub }) => (
  <div
    className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden transition-all duration-300"
    style={{
      background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,16,32,0.95))",
      border: "1px solid rgba(148,163,184,0.08)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${accent}33, inset 0 1px 0 rgba(255,255,255,0.06)`;
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    {/* Corner glow */}
    <div
      className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
      style={{
        background: `radial-gradient(circle, ${accent}25 0%, transparent 70%)`,
        filter: "blur(14px)",
        transform: "translate(30%,-30%)",
      }}
    />
    {/* Top accent line */}
    <div
      className="absolute top-0 left-6 right-6 h-px"
      style={{
        background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
      }}
    />

    <div className="flex items-center justify-between relative z-10">
      <span
        className="text-xs font-semibold uppercase"
        style={{ color: "#334155", letterSpacing: "0.1em" }}
      >
        {label}
      </span>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{
          background: `${accent}15`,
          border: `1px solid ${accent}28`,
          color: accent,
        }}
      >
        {icon}
      </div>
    </div>

    <div className="relative z-10">
      <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1" style={{ color: "#334155" }}>{sub}</p>
      )}
    </div>
  </div>
);

const TransactionStats = ({ transactions }) => {
  let deposited = 0, sent = 0, received = 0;
  for (const tx of transactions) {
    if (tx.type === "DEPOSIT")             deposited += tx.amount;
    else if (tx.type === "TRANSFER_SENT")       sent      += tx.amount;
    else if (tx.type === "TRANSFER_RECEIVED")   received  += tx.amount;
  }

  const stats = [
    {
      label: "Total Transactions",
      value: transactions.length,
      accent: "#38bdf8",
      sub: "all time",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      ),
    },
    {
      label: "Total Deposited",
      value: fmt(deposited),
      accent: "#22c55e",
      sub: `across all deposits`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      label: "Total Received",
      value: fmt(received),
      accent: "#34d399",
      sub: "inbound transfers",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
      ),
    },
    {
      label: "Total Sent",
      value: fmt(sent),
      accent: "#f87171",
      sub: "outbound transfers",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => <StatCard key={s.label} {...s} />)}
    </div>
  );
};

export default TransactionStats;