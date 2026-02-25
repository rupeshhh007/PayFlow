import { useState } from "react";
import toast from "react-hot-toast";
import API from "../api/api";

const SendMoneyModal = ({ onClose, onSuccess }) => {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!receiverEmail.trim()) {
      newErrors.email = "Recipient email is required.";
    } else if (!emailRegex.test(receiverEmail.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    const parsed = parseFloat(amount);
    if (!amount) {
      newErrors.amount = "Amount is required.";
    } else if (isNaN(parsed) || parsed <= 0) {
      newErrors.amount = "Amount must be greater than $0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ── Transfer handler ─────────────────────────────────────────────────────────
  const handleTransfer = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await API.post("/wallet/transfer", {
        receiverEmail: receiverEmail.trim(),
        amount: parseFloat(amount),
      });

      toast.success("Transfer successful! 🎉");
      setReceiverEmail("");
      setAmount("");
      setErrors({});
      onSuccess();
      onClose();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Transfer failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleTransfer();
    if (e.key === "Escape") onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const isFormValid =
    receiverEmail.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(receiverEmail.trim()) &&
    parseFloat(amount) > 0;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(5px)" }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-7"
        style={{
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(10,16,32,1) 100%)",
          border: "1px solid rgba(148,163,184,0.1)",
          boxShadow:
            "0 0 0 1px rgba(59,130,246,0.08), 0 25px 60px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)",
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

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.25)",
                color: "#60a5fa",
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
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
            <div>
              <h2
                className="text-white font-bold text-base"
                style={{ letterSpacing: "-0.02em" }}
              >
                Send Money
              </h2>
              <p className="text-xs" style={{ color: "#475569" }}>
                Transfer funds instantly
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
            aria-label="Close modal"
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

        {/* ── Recipient Email ── */}
        <div className="mb-4">
          <label
            className="block text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#475569", letterSpacing: "0.1em" }}
          >
            Recipient Email
          </label>
          <div className="relative">
            <span
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#334155" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="recipient@example.com"
              value={receiverEmail}
              onChange={(e) => {
                setReceiverEmail(e.target.value);
                clearError("email");
              }}
              disabled={loading}
              autoFocus
              className="w-full rounded-xl py-3 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                paddingLeft: "2.5rem",
                background: "rgba(15,23,42,0.8)",
                border: errors.email
                  ? "1px solid rgba(239,68,68,0.5)"
                  : "1px solid rgba(51,65,85,0.6)",
                boxShadow: errors.email
                  ? "0 0 0 3px rgba(239,68,68,0.07)"
                  : "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
              onFocus={(e) => {
                if (!errors.email) {
                  e.currentTarget.style.border = "1px solid rgba(56,189,248,0.5)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.07)";
                }
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.currentTarget.style.border = "1px solid rgba(51,65,85,0.6)";
                  e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.02)";
                }
              }}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs flex items-center gap-1.5" style={{ color: "#f87171" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* ── Amount ── */}
        <div className="mb-5">
          <label
            className="block text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#475569", letterSpacing: "0.1em" }}
          >
            Amount (USD)
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none"
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
                clearError("amount");
              }}
              disabled={loading}
              className="w-full rounded-xl py-3 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                paddingLeft: "2rem",
                background: "rgba(15,23,42,0.8)",
                border: errors.amount
                  ? "1px solid rgba(239,68,68,0.5)"
                  : "1px solid rgba(51,65,85,0.6)",
                boxShadow: errors.amount
                  ? "0 0 0 3px rgba(239,68,68,0.07)"
                  : "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
              onFocus={(e) => {
                if (!errors.amount) {
                  e.currentTarget.style.border = "1px solid rgba(56,189,248,0.5)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.07)";
                }
              }}
              onBlur={(e) => {
                if (!errors.amount) {
                  e.currentTarget.style.border = "1px solid rgba(51,65,85,0.6)";
                  e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.02)";
                }
              }}
            />
          </div>
          {errors.amount && (
            <p className="mt-1.5 text-xs flex items-center gap-1.5" style={{ color: "#f87171" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.amount}
            </p>
          )}
        </div>

        {/* ── Quick Amount Chips ── */}
        <div className="flex gap-2 mb-6">
          {[50, 100, 250, 500].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={loading}
              onClick={() => {
                setAmount(String(preset));
                clearError("amount");
              }}
              className="flex-1 rounded-lg py-1.5 text-xs font-medium transition-all duration-150 disabled:opacity-40"
              style={{
                background:
                  amount === String(preset)
                    ? "rgba(59,130,246,0.12)"
                    : "rgba(15,23,42,0.7)",
                border:
                  amount === String(preset)
                    ? "1px solid rgba(59,130,246,0.35)"
                    : "1px solid rgba(51,65,85,0.5)",
                color: amount === String(preset) ? "#60a5fa" : "#475569",
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
              ${preset}
            </button>
          ))}
        </div>

        {/* ── Transfer summary preview ── */}
        {isFormValid && (
          <div
            className="mb-5 rounded-xl px-4 py-3 flex items-center justify-between"
            style={{
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.15)",
            }}
          >
            <div className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-xs" style={{ color: "#475569" }}>
                Sending to{" "}
                <span className="font-medium" style={{ color: "#94a3b8" }}>
                  {receiverEmail.length > 22
                    ? receiverEmail.slice(0, 22) + "…"
                    : receiverEmail}
                </span>
              </span>
            </div>
            <span className="text-sm font-bold" style={{ color: "#38bdf8" }}>
              ${parseFloat(amount).toFixed(2)}
            </span>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl py-3 text-sm font-medium transition-all duration-200 disabled:opacity-40"
            style={{
              background: "rgba(15,23,42,0.7)",
              border: "1px solid rgba(51,65,85,0.6)",
              color: "#64748b",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.borderColor = "rgba(71,85,105,0.8)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.borderColor = "rgba(51,65,85,0.6)";
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleTransfer}
            disabled={loading || !isFormValid}
            className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background:
                loading || !isFormValid
                  ? "rgba(37,99,235,0.3)"
                  : "linear-gradient(135deg, #2563eb 0%, #0284c7 100%)",
              boxShadow:
                loading || !isFormValid
                  ? "none"
                  : "0 4px 16px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
              letterSpacing: "-0.01em",
              cursor: loading || !isFormValid ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loading && isFormValid) {
                e.currentTarget.style.boxShadow =
                  "0 6px 22px rgba(37,99,235,0.45), inset 0 1px 0 rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && isFormValid) {
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.12)";
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
                Send Money
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* ── Security note ── */}
        <p className="mt-4 text-center text-xs" style={{ color: "#1e3a5f" }}>
          🔒 End-to-end encrypted · Transfers are instant
        </p>
      </div>
    </div>
  );
};

export default SendMoneyModal;