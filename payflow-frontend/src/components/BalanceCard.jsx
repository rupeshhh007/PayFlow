import { useCurrency } from "../context/CurrencyContext";
const StatCard = ({ label, amount, change, positive, icon, accent }) => (
  <div
    className="relative rounded-2xl p-5 overflow-hidden flex flex-col gap-3"
    style={{
      background:
        "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,16,32,0.95))",
      border: "1px solid rgba(148,163,184,0.08)",
      boxShadow:
        "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
    }}
  >
    {/* Subtle corner glow */}
    <div
      className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
      style={{
        background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
        filter: "blur(16px)",
        transform: "translate(30%, -30%)",
      }}
    />

    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#334155", letterSpacing: "0.1em" }}>
        {label}
      </p>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30`, color: accent }}
      >
        {icon}
      </div>
    </div>

    <div>
      <p
        className="text-2xl font-bold text-white"
        style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
      >
        {amount}
      </p>
      <div className="flex items-center gap-1.5 mt-1.5">
        <span
          className="flex items-center gap-0.5 text-xs font-medium rounded-md px-1.5 py-0.5"
          style={{
            background: positive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: positive ? "#22c55e" : "#ef4444",
          }}
        >
          {positive ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
          {change}
        </span>
        <span className="text-xs" style={{ color: "#334155" }}>
          vs last month
        </span>
      </div>
    </div>
  </div>
);

const BalanceCard = ({ balance = 0 }) => {
  const { currency } = useCurrency();
  const formattedBalance = Number(balance).toLocaleString("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
  return (
    <div className="space-y-4">
      {/* Primary Balance */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f2540 40%, #0a1a30 100%)",
          border: "1px solid rgba(56,189,248,0.2)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        {/* Glow blobs */}
        <div
          className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            filter: "blur(30px)",
            transform: "translate(-30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
            filter: "blur(25px)",
            transform: "translate(20%, 20%)",
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-8 right-8 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(56,189,248,0.5), rgba(59,130,246,0.4), transparent)",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: "#38bdf8aa", letterSpacing: "0.12em" }}
              >
                Total Balance
              </p>
              <h2
  className="text-4xl font-bold text-white"
  style={{ letterSpacing: "-0.04em", lineHeight: 1 }}
>
  ${formattedBalance}
</h2>
            </div>
            <div
              className="flex flex-col items-end gap-1"
            >
              <span
                className="flex items-center gap-1 text-xs font-semibold rounded-lg px-2 py-1"
                style={{
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  color: "#22c55e",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
                +8.3%
              </span>
              <span className="text-xs" style={{ color: "#334155" }}>
                this month
              </span>
            </div>
          </div>

          {/* Mini bar chart */}
          <div className="flex items-end gap-1 h-10 mb-4">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all duration-300"
                style={{
                  height: `${h}%`,
                  background:
                    i === 11
                      ? "linear-gradient(to top, #3b82f6, #38bdf8)"
                      : `rgba(56,189,248,${0.1 + (i / 11) * 0.2})`,
                  boxShadow: i === 11 ? "0 0 6px rgba(56,189,248,0.5)" : "none",
                }}
              />
            ))}
          </div>

          {/* Account info row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.2)" }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </div>
              <span className="text-xs font-mono" style={{ color: "#475569" }}>
                •••• •••• •••• 4291
              </span>
            </div>
            <span
              className="text-xs rounded-md px-2 py-0.5 font-medium"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.18)",
                color: "#22c55e",
              }}
            >
              ● Active
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Monthly Income"
          amount="$12,840.00"
          change="+14.2%"
          positive={true}
          accent="#22c55e"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
        <StatCard
          label="Monthly Expenses"
          amount="$5,390.20"
          change="+3.1%"
          positive={false}
          accent="#f59e0b"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 12V22H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default BalanceCard;