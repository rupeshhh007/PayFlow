import { useState, useEffect, useMemo } from "react";
import API from "../api/api";
import TransactionStats from "../components/TransactionStats";
import TransactionFilters from "../components/TransactionFilters";
import { useCurrency } from "../context/CurrencyContext";

// ❌ FIXED: fmt() helper was hardcoded to "USD" — now reads from CurrencyContext
// ❌ FIXED: Row border logic used `i < displayed.length - 1` inconsistently; normalised

// ── Type config ───────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  DEPOSIT: {
    label: "Deposit",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.2)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    sign: "+",
    amountColor: "#22c55e",
  },
  TRANSFER_SENT: {
    label: "Sent",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.2)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
    sign: "-",
    amountColor: "#f87171",
  },
  TRANSFER_RECEIVED: {
    label: "Received",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>
    ),
    sign: "+",
    amountColor: "#34d399",
  },
};

// ── Loading Skeleton ──────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr>
    {[120, 80, 90, 70, 80].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <div
          className="h-3.5 rounded-full animate-pulse"
          style={{ width: `${w}px`, background: "rgba(30,41,59,0.8)" }}
        />
      </td>
    ))}
  </tr>
);

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ search, filter }) => (
  <tr>
    <td colSpan={5}>
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: "rgba(56,189,248,0.07)",
            border: "1px solid rgba(56,189,248,0.12)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-white" style={{ letterSpacing: "-0.01em" }}>
          {search || filter !== "ALL" ? "No matching transactions" : "No transactions yet"}
        </p>
        <p className="text-xs" style={{ color: "#334155" }}>
          {search || filter !== "ALL"
            ? "Try adjusting your filters"
            : "Make a deposit or transfer to get started"}
        </p>
      </div>
    </td>
  </tr>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Transactions = () => {
  const { currency } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // ❌ FIXED: currency now comes from CurrencyContext, not hardcoded "USD"
  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(n);

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const fmtTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    setLoading(true);
    API.get("/transactions")
      .then((res) => setTransactions(res.data))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  const displayed = useMemo(() => {
    let list = [...transactions].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    if (filter !== "ALL") {
      list = list.filter((t) => t.type === filter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          String(t.id).includes(q) ||
          (t.receiverEmail || "").toLowerCase().includes(q) ||
          (t.senderEmail || "").toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q)
      );
    }

    if (dateRange.from) {
      list = list.filter(
        (t) => new Date(t.createdAt) >= new Date(dateRange.from)
      );
    }
    if (dateRange.to) {
      list = list.filter(
        (t) => new Date(t.createdAt) <= new Date(dateRange.to + "T23:59:59")
      );
    }

    return list;
  }, [transactions, filter, search, dateRange]);

  const COLS = ["Transaction", "Type", "Date", "Amount", "Status"];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            Transactions
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
            Full history of your account activity
          </p>
        </div>
        <div
          className="text-xs px-3 py-1.5 rounded-lg"
          style={{
            background: "rgba(56,189,248,0.07)",
            border: "1px solid rgba(56,189,248,0.15)",
            color: "#38bdf8",
          }}
        >
          {loading ? "Loading…" : `${transactions.length} total`}
        </div>
      </div>

      {/* Stats */}
      <TransactionStats transactions={transactions} />

      {/* Filters */}
      <TransactionFilters
        search={search}
        filter={filter}
        dateRange={dateRange}
        onSearch={setSearch}
        onFilter={setFilter}
        onDateRange={setDateRange}
      />

      {/* Table */}
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {COLS.map((col, i) => (
                  <th
                    key={col}
                    className="px-5 py-3.5 text-xs font-semibold uppercase tracking-widest"
                    style={{
                      color: "#334155",
                      letterSpacing: "0.09em",
                      background: "rgba(10,14,26,0.97)",
                      borderBottom: "1px solid rgba(51,65,85,0.35)",
                      textAlign: i === 3 || i === 4 ? "right" : "left",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading
                ? [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                : displayed.length === 0
                ? <EmptyState search={search} filter={filter} />
                : displayed.map((tx, idx) => {
                    const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.DEPOSIT;
                    const isEven = idx % 2 === 0;
                    return (
                      <tr
                        key={tx.id}
                        className="transition-all duration-150"
                        style={{
                          background: isEven ? "transparent" : "rgba(15,23,42,0.25)",
                          borderBottom: "1px solid rgba(30,41,59,0.5)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${cfg.color}08`;
                          e.currentTarget.style.borderColor = `${cfg.color}20`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isEven
                            ? "transparent"
                            : "rgba(15,23,42,0.25)";
                          e.currentTarget.style.borderColor = "rgba(30,41,59,0.5)";
                        }}
                      >
                        {/* ID */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: cfg.bg,
                                border: `1px solid ${cfg.border}`,
                                color: cfg.color,
                              }}
                            >
                              {cfg.icon}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white" style={{ letterSpacing: "-0.01em" }}>
                                TXN-{String(tx.id).padStart(6, "0")}
                              </p>
                              {(tx.receiverEmail || tx.senderEmail) && (
                                <p className="text-xs mt-0.5 truncate max-w-[140px]" style={{ color: "#334155" }}>
                                  {tx.receiverEmail || tx.senderEmail}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-5 py-4">
                          <span
                            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg w-fit"
                            style={{
                              background: cfg.bg,
                              border: `1px solid ${cfg.border}`,
                              color: cfg.color,
                            }}
                          >
                            <span
                              className="w-1 h-1 rounded-full flex-shrink-0"
                              style={{ background: cfg.color, boxShadow: `0 0 4px ${cfg.color}` }}
                            />
                            {cfg.label}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <p className="text-xs font-medium" style={{ color: "#64748b" }}>
                            {fmtDate(tx.createdAt)}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "#1e3a5f" }}>
                            {fmtTime(tx.createdAt)}
                          </p>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4 text-right">
                          <span
                            className="text-sm font-bold"
                            style={{ color: cfg.amountColor, letterSpacing: "-0.02em" }}
                          >
                            {cfg.sign}{fmt(tx.amount)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 text-right">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
                            style={{
                              background: "rgba(34,197,94,0.08)",
                              border: "1px solid rgba(34,197,94,0.18)",
                              color: "#22c55e",
                            }}
                          >
                            <span
                              className="w-1 h-1 rounded-full"
                              style={{ background: "#22c55e", boxShadow: "0 0 4px #22c55e" }}
                            />
                            Completed
                          </span>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && displayed.length > 0 && (
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(30,41,59,0.5)" }}
          >
            <p className="text-xs" style={{ color: "#1e3a5f" }}>
              Showing <span style={{ color: "#334155" }}>{displayed.length}</span> of{" "}
              <span style={{ color: "#334155" }}>{transactions.length}</span> transactions
            </p>
            <p className="text-xs" style={{ color: "#1e3a5f" }}>
              Sorted: newest first
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;