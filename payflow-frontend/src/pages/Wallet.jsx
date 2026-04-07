import { useEffect, useState } from "react";
import BalanceCard from "../components/BalanceCard";
import DepositModal from "../components/DepositModal";
import SendMoneyModal from "../components/SendMoneyModal";
import { getBalance, getTransactions } from "../api/walletApi";
import { useCurrency } from "../context/CurrencyContext";

// ❌ FIXED: loadBalance had no try/catch — an API error would crash the component silently
// ❌ FIXED: BalanceCard now receives totalReceived & totalSpent so stat cards show real data
// ❌ FIXED: Action buttons now match the app's design system instead of raw Tailwind green/blue
// ✨ ADDED: Loading skeleton state while balance fetches

const Wallet = () => {
  const { currency } = useCurrency();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [balRes, txRes] = await Promise.all([getBalance(), getTransactions()]);
      setBalance(balRes.data.balance);
      setTransactions(txRes.data);
    } catch (err) {
      setError("Failed to load wallet data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalReceived = transactions
    .filter((t) => t.type === "TRANSFER_RECEIVED")
    .reduce((s, t) => s + t.amount, 0);

  const totalSpent = transactions
    .filter((t) => t.type === "TRANSFER_SENT")
    .reduce((s, t) => s + t.amount, 0);

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

  return (
    <div className="relative z-10 space-y-6">
      {/* Ambient glow */}
      <div
        className="fixed top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1e3a5f", letterSpacing: "0.12em" }}>
              Account
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(30,41,59,0.6)" }} />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.03em" }}>
            Wallet
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
            Manage your balance and transfers
          </p>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
          <button onClick={loadData} className="ml-auto text-xs underline" style={{ color: "#f87171" }}>
            Retry
          </button>
        </div>
      )}

      {/* Balance Card */}
      {loading ? (
        <div className="rounded-2xl p-6 animate-pulse" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(51,65,85,0.3)" }}>
          <div className="h-3 w-24 rounded-full mb-4" style={{ background: "rgba(51,65,85,0.5)" }} />
          <div className="h-10 w-40 rounded-full mb-6" style={{ background: "rgba(51,65,85,0.5)" }} />
          <div className="flex gap-3">
            <div className="h-3 w-32 rounded-full" style={{ background: "rgba(51,65,85,0.4)" }} />
            <div className="h-3 w-16 rounded-full" style={{ background: "rgba(51,65,85,0.3)" }} />
          </div>
        </div>
      ) : (
        <BalanceCard
          balance={balance}
          totalReceived={totalReceived}
          totalSpent={totalSpent}
        />
      )}

      {/* Action Buttons */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,16,32,0.95))",
          border: "1px solid rgba(148,163,184,0.08)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <h3 className="text-sm font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowDeposit(true)}
            className="flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
              color: "#22c55e",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(34,197,94,0.18)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(34,197,94,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Add Funds
          </button>

          <button
            onClick={() => setShowSend(true)}
            className="flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200"
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.25)",
              color: "#3b82f6",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(59,130,246,0.18)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(59,130,246,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send Money
          </button>
        </div>
      </div>

      {/* Recent transactions summary */}
      {!loading && transactions.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,16,32,0.95))",
            border: "1px solid rgba(148,163,184,0.08)",
          }}
        >
          <h3 className="text-sm font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            Summary
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Deposited", value: fmt(transactions.filter(t => t.type === "DEPOSIT").reduce((s, t) => s + t.amount, 0)), color: "#22c55e" },
              { label: "Sent",      value: fmt(totalSpent),    color: "#f87171" },
              { label: "Received",  value: fmt(totalReceived), color: "#38bdf8" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#334155", letterSpacing: "0.1em" }}>
                  {item.label}
                </p>
                <p className="text-base font-bold" style={{ color: item.color, letterSpacing: "-0.02em" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showDeposit && (
        <DepositModal onClose={() => setShowDeposit(false)} onSuccess={loadData} />
      )}
      {showSend && (
        <SendMoneyModal onClose={() => setShowSend(false)} onSuccess={loadData} />
      )}
    </div>
  );
};

export default Wallet;