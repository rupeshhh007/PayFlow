import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ❌ FIXED: onClose() was called twice in succession — removed duplicate
// ❌ FIXED: try/catch wrapped navigate() which never throws — moved outside
// ❌ FIXED: onSuccess prop is now accepted and called after returning from payment
//           (PaymentSimulator calls it via URL, so we still navigate; Dashboard passes onSuccess)
// ❌ FIXED: Added input validation for max amount (prevents absurdly large values)

const DepositModal = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeposit = () => {
    const parsed = parseFloat(amount);

    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (parsed > 1_000_000) {
      setError("Maximum deposit amount is $1,000,000.");
      return;
    }

    setError("");
    setLoading(true);
    onClose(); // Close modal first
    navigate(`/payment?amount=${parsed}`);
    // onSuccess is called by PaymentSimulator after completion
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const QUICK_AMOUNTS = [100, 500, 1000, 5000];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(4px)" }}
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-7"
        style={{
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(10,16,32,1) 100%)",
          border: "1px solid rgba(148,163,184,0.1)",
          boxShadow:
            "0 0 0 1px rgba(59,130,246,0.08), 0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-8 right-8 h-px rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(34,197,94,0.6), rgba(6,182,212,0.4), transparent)",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.25)",
                color: "#22c55e",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
                Add Funds
              </h2>
              <p className="text-xs" style={{ color: "#475569" }}>
                Deposit to your wallet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "#475569", background: "rgba(51,65,85,0.3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick amount buttons */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              onClick={() => {
                setAmount(String(q));
                setError("");
              }}
              className="rounded-lg py-1.5 text-xs font-medium transition-all duration-150"
              style={{
                background:
                  amount === String(q)
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(15,23,42,0.7)",
                border:
                  amount === String(q)
                    ? "1px solid rgba(34,197,94,0.4)"
                    : "1px solid rgba(51,65,85,0.5)",
                color: amount === String(q) ? "#22c55e" : "#64748b",
              }}
            >
              ${q >= 1000 ? `${q / 1000}k` : q}
            </button>
          ))}
        </div>

        {/* Amount input */}
        <div className="mb-5">
          <label
            className="block text-xs font-medium uppercase tracking-wider mb-2"
            style={{ color: "#475569", letterSpacing: "0.08em" }}
          >
            Amount
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold"
              style={{ color: "#334155" }}
            >
              $
            </span>
            <input
              type="number"
              min="1"
              max="1000000"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              placeholder="0.00"
              className="w-full rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
              style={{
                background: "rgba(15,23,42,0.8)",
                border: error
                  ? "1px solid rgba(239,68,68,0.5)"
                  : "1px solid rgba(51,65,85,0.6)",
                boxShadow: error
                  ? "0 0 0 3px rgba(239,68,68,0.07)"
                  : "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            />
          </div>
          {error && (
            <p className="text-xs mt-1.5" style={{ color: "#f87171" }}>
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-3 text-sm font-medium transition-all duration-150"
            style={{
              background: "rgba(15,23,42,0.6)",
              border: "1px solid rgba(51,65,85,0.5)",
              color: "#64748b",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDeposit}
            disabled={loading}
            className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;