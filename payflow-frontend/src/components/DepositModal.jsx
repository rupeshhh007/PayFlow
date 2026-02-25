import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";


const DepositModal = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeposit = async () => {
    const parsed = parseFloat(amount);

    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      navigate(`/payment?amount=${parsed}`);
onClose();
      onClose();  
    } catch (err) {
      setError(
        err?.response?.data?.message || "Deposit failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

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
              "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), rgba(6,182,212,0.6), transparent)",
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
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <div>
              <h2
                className="text-white font-bold text-base"
                style={{ letterSpacing: "-0.02em" }}
              >
                Add Funds
              </h2>
              <p className="text-xs" style={{ color: "#475569" }}>
                Deposit to your PayFlow wallet
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{
              background: "rgba(30,41,59,0.6)",
              border: "1px solid rgba(51,65,85,0.5)",
              color: "#475569",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#94a3b8";
              e.currentTarget.style.borderColor = "rgba(71,85,105,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#475569";
              e.currentTarget.style.borderColor = "rgba(51,65,85,0.5)";
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Amount input */}
        <div className="mb-5">
          <label
            className="block text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#475569", letterSpacing: "0.1em" }}
          >
            Amount (USD)
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
              style={{ color: "#475569" }}
            >
              $
            </span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleDeposit()}
              autoFocus
              className="w-full rounded-xl py-3 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
              style={{
                paddingLeft: "2rem",
                background: "rgba(15,23,42,0.8)",
                border: error
                  ? "1px solid rgba(239,68,68,0.5)"
                  : "1px solid rgba(51,65,85,0.6)",
                boxShadow: error
                  ? "0 0 0 3px rgba(239,68,68,0.07)"
                  : "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
              onFocus={(e) => {
                if (!error) {
                  e.currentTarget.style.border =
                    "1px solid rgba(56,189,248,0.5)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(56,189,248,0.07)";
                }
              }}
              onBlur={(e) => {
                if (!error) {
                  e.currentTarget.style.border =
                    "1px solid rgba(51,65,85,0.6)";
                  e.currentTarget.style.boxShadow =
                    "inset 0 1px 0 rgba(255,255,255,0.02)";
                }
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <p
              className="mt-2 text-xs flex items-center gap-1.5"
              style={{ color: "#f87171" }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Quick amount chips */}
        <div className="flex gap-2 mb-6">
          {[100, 500, 1000, 5000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setAmount(String(preset));
                if (error) setError("");
              }}
              className="flex-1 rounded-lg py-1.5 text-xs font-medium transition-all duration-150"
              style={{
                background:
                  amount === String(preset)
                    ? "rgba(34,197,94,0.12)"
                    : "rgba(15,23,42,0.7)",
                border:
                  amount === String(preset)
                    ? "1px solid rgba(34,197,94,0.3)"
                    : "1px solid rgba(51,65,85,0.5)",
                color: amount === String(preset) ? "#22c55e" : "#475569",
              }}
              onMouseEnter={(e) => {
                if (amount !== String(preset)) {
                  e.currentTarget.style.borderColor = "rgba(56,189,248,0.25)";
                  e.currentTarget.style.color = "#94a3b8";
                }
              }}
              onMouseLeave={(e) => {
                if (amount !== String(preset)) {
                  e.currentTarget.style.borderColor = "rgba(51,65,85,0.5)";
                  e.currentTarget.style.color = "#475569";
                }
              }}
            >
              ${preset.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl py-3 text-sm font-medium transition-all duration-200"
            style={{
              background: "rgba(15,23,42,0.7)",
              border: "1px solid rgba(51,65,85,0.6)",
              color: "#64748b",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#94a3b8";
              e.currentTarget.style.borderColor = "rgba(71,85,105,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.borderColor = "rgba(51,65,85,0.6)";
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleDeposit}
            disabled={loading}
            className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: loading
                ? "rgba(34,197,94,0.4)"
                : "linear-gradient(135deg, #16a34a, #15803d)",
              boxShadow: loading
                ? "none"
                : "0 4px 16px rgba(34,197,94,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
              letterSpacing: "-0.01em",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow =
                  "0 6px 22px rgba(34,197,94,0.35), inset 0 1px 0 rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(34,197,94,0.25), inset 0 1px 0 rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Processing…
              </>
            ) : (
              <>
                Deposit Funds
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Security note */}
        <p
          className="mt-4 text-center text-xs"
          style={{ color: "#1e3a5f" }}
        >
          🔒 Secured with 256-bit encryption
        </p>
      </div>
    </div>
  );
};

export default DepositModal;