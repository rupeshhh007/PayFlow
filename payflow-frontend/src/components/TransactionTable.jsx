const TRANSACTIONS = [];

const StatusBadge = ({ status }) => {
  const styles =
    status === "completed"
      ? {
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.2)",
          color: "#22c55e",
          dot: "#22c55e",
        }
      : {
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.2)",
          color: "#f59e0b",
          dot: "#f59e0b",
        };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium capitalize"
      style={{ background: styles.background, border: styles.border, color: styles.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: styles.dot, boxShadow: `0 0 4px ${styles.dot}` }}
      />
      {status}
    </span>
  );
};

const TransactionTable = ({ transactions = [] }) => {
  const formattedTransactions = [...transactions]
  .sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
  .map((tx) => {
  let name = "Wallet";
  let category = "income";
  let amountPrefix = "+";

  if (tx.type === "TRANSFER_SENT") {
    name = "Money Sent";
    category = "expense";
    amountPrefix = "-";
  }

  if (tx.type === "TRANSFER_RECEIVED") {
    name = "Money Received";
    category = "income";
    amountPrefix = "+";
  }

  if (tx.type === "DEPOSIT") {
    name = "Deposit";
    category = "income";
    amountPrefix = "+";
  }

  return {
    id: `TX-${tx.id}`,
    name,
    type: tx.type.replace("_", " "),
    date: new Date(tx.createdAt).toLocaleDateString(),
    amount: `${amountPrefix}₹${tx.amount}`,
    category,
    status: "completed",
    avatar: name[0],
    avatarColor:
      category === "income" ? "#22c55e" : "#f87171",
  };
});
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,16,32,0.95))",
        border: "1px solid rgba(148,163,184,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
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
            Last 7 days activity
          </p>
        </div>
        <button
          className="text-xs font-medium flex items-center gap-1 transition-colors duration-200"
          style={{ color: "#38bdf8" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#7dd3fc")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#38bdf8")}
        >
          View all
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
            {formattedTransactions.map((tx, i) => (
              <tr
                key={tx.id}
                className="group transition-colors duration-150"
                style={{
                  borderBottom:
                    i < TRANSACTIONS.length - 1
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
                {/* Transaction name */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{
                        background: `${tx.avatarColor}22`,
                        border: `1px solid ${tx.avatarColor}40`,
                        color: tx.avatarColor,
                      }}
                    >
                      {tx.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tx.name}</p>
                      <p className="text-xs" style={{ color: "#334155" }}>
                        {tx.type} · {tx.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-3.5">
                  <span className="text-xs" style={{ color: "#475569" }}>
                    {tx.date}
                  </span>
                </td>

                {/* Amount */}
                <td className="px-6 py-3.5">
                  <span
                    className="text-sm font-bold font-mono"
                    style={{
                      color:
                        tx.category === "income" ? "#22c55e" : "#f87171",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {tx.amount}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-3.5">
                  <StatusBadge status={tx.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;