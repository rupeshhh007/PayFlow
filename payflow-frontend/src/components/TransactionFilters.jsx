const FILTERS = [
  { key: "ALL",               label: "All",      dot: "#38bdf8" },
  { key: "DEPOSIT",           label: "Deposits", dot: "#22c55e" },
  { key: "TRANSFER_SENT",     label: "Sent",     dot: "#f87171" },
  { key: "TRANSFER_RECEIVED", label: "Received", dot: "#34d399" },
];

const TransactionFilters = ({ active, onFilterChange, search, onSearchChange, counts }) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Filter tabs */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl flex-shrink-0"
        style={{
          background: "rgba(10,16,32,0.8)",
          border: "1px solid rgba(51,65,85,0.4)",
        }}
      >
        {FILTERS.map((f) => {
          const isActive = active === f.key;
          const count = counts?.[f.key] ?? 0;
          return (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: isActive
                  ? "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(20,30,55,0.95))"
                  : "transparent",
                color: isActive ? "#e2e8f0" : "#475569",
                border: isActive
                  ? "1px solid rgba(148,163,184,0.12)"
                  : "1px solid transparent",
                boxShadow: isActive
                  ? "0 2px 8px rgba(0,0,0,0.3)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "#94a3b8";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "#475569";
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: f.dot,
                  boxShadow: isActive ? `0 0 5px ${f.dot}` : "none",
                  opacity: isActive ? 1 : 0.4,
                }}
              />
              {f.label}
              {count > 0 && (
                <span
                  className="ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                  style={{
                    background: isActive ? "rgba(56,189,248,0.12)" : "rgba(30,41,59,0.6)",
                    color: isActive ? "#38bdf8" : "#334155",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search bar */}
      <div className="relative flex-1 min-w-0">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "#334155" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by type, ID, email…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl py-2.5 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
          style={{
            paddingLeft: "2.25rem",
            background: "rgba(10,16,32,0.8)",
            border: "1px solid rgba(51,65,85,0.4)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid rgba(56,189,248,0.4)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.06)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid rgba(51,65,85,0.4)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
            style={{ color: "#334155" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#64748b")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;