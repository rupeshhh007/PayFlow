import { useCurrency } from "../context/CurrencyContext";
import { useNavigate } from "react-router-dom";

// ❌ FIXED: Hardcoded `const TRANSACTIONS = []` was used for border logic
//           — `i < TRANSACTIONS.length - 1` is always `i < -1` = always false.
//           All rows had no border between them. Fixed to use actual array length.
// ❌ FIXED: Amount was hardcoded as `₹${tx.amount}` (always Indian rupee) — now uses CurrencyContext
// ❌ FIXED: "View all" button was a no-op — now navigates to /transactions
// ❌ FIXED: Shows skeleton loading state when loading=true prop passed
// ✨ ADDED: Empty state when no transactions exist yet

const TYPE_CONFIG = {
  TRANSFER_SENT: {
    label: "Sent",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.2)",
    sign: "-",
    avatar: "↑",
    avatarColor: "#f87171",
  },
  TRANSFER_RECEIVED: {
    label: "Received",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
    sign: "+",
    avatar: "↓",
    avatarColor: "#34d399",
  },
  DEPOSIT: {
    label: "Deposit",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.2)",
    sign: "+",
    avatar: "+",
    avatarColor: "#22c55e",
  },
};

const StatusBadge = () => (
  <span
    className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium"
    style={{
      background: "rgba(34,197,94,0.08)",
      border: "1px solid rgba(34,197,94,0.2)",
      color: "#22c55e",
    }}
  >
    <span
      className="w-1.5 h-1.5 rounded-full"
      style={{ background: "#22c55e", boxShadow: "0 0 4px #22c55e" }}
    />
    Completed
  </span>
);

const SkeletonRow = () => (
  <tr>
    {[140, 80, 90, 80].map((w, i) => (
      <td key={i} className="px-6 py-3.5">
        <div
          className="h-3 rounded-full animate-pulse"
          style={{ width: `${w}px`, background: "rgba(30,41,59,0.8)" }}
        />
      </td>
    ))}
  </tr>
);

const TransactionTable = ({ transactions = [], loading = false }) => {
  const { currency } = useCurrency();
  const navigate = useNavigate();

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(n);

  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8); // Show last 8 on dashboard

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,16,32,0.95))",
        border: "1px solid rgba(148,163,184,0.08)",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid rgba(51,65,85,0.4)" }}
      >
        <div>
          <h3
            className="text-sm font-bold text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Recent Transactions
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#334155" }}>
            Latest account activity
          </p>
        </div>
        <button
          onClick={() => navigate("/transactions")}
          className="text-xs font-medium flex items-center gap-1 transition-colors duration-200"
          style={{ color: "#38bdf8" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#7dd3fc")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#38bdf8")}
        >
          View all
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(30,41,59,0.8)" }}>
              {["Transaction", "Date", "Amount", "Status"].map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#1e3a5f", letterSpacing: "0.1em" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
            ) : recentTx.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: "rgba(56,189,248,0.07)",
                        border: "1px solid rgba(56,189,248,0.12)",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                      >
                        <path d="M12 22V12M12 12L8 16M12 12l4 4M20 16.7A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
                      </svg>
                    </div>
                    <p
                      className="text-sm font-semibold text-white"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      No transactions yet
                    </p>
                    <p className="text-xs" style={{ color: "#334155" }}>
                      Make a deposit or send money to get started
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              recentTx.map((tx, i) => {
                const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.DEPOSIT;
                const dateStr = new Date(tx.createdAt).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                );

                return (
                  <tr
                    key={tx.id}
                    className="group transition-colors duration-150"
                    style={{
                      borderBottom:
                        i < recentTx.length - 1
                          ? "1px solid rgba(30,41,59,0.5)"
                          : "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(30,41,59,0.35)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Transaction */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{
                            background: `${cfg.avatarColor}22`,
                            border: `1px solid ${cfg.avatarColor}40`,
                            color: cfg.avatarColor,
                          }}
                        >
                          {cfg.avatar}
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium text-white"
                            style={{ letterSpacing: "-0.01em" }}
                          >
                            {cfg.label}
                          </p>
                          <p className="text-xs" style={{ color: "#334155" }}>
                            {tx.type.replace("_", " ")} · #{tx.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-3.5">
                      <span className="text-xs" style={{ color: "#475569" }}>
                        {dateStr}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-3.5">
                      <span
                        className="text-sm font-bold font-mono"
                        style={{
                          color: cfg.avatarColor,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {cfg.sign}
                        {fmt(tx.amount)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3.5">
                      <StatusBadge />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {!loading && recentTx.length > 0 && (
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(30,41,59,0.5)" }}
        >
          <p className="text-xs" style={{ color: "#334155" }}>
            Showing{" "}
            <span style={{ color: "#475569" }}>{recentTx.length}</span> of{" "}
            <span style={{ color: "#475569" }}>{transactions.length}</span>{" "}
            transactions
          </p>
          <button
            onClick={() => navigate("/transactions")}
            className="text-xs transition-colors"
            style={{ color: "#334155" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#38bdf8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
          >
            See all →
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;