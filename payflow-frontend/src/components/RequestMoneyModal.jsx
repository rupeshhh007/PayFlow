import React, { useState } from "react";
import API from "../api/api";

const RequestMoneyModal = ({ onClose }) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [paymentLink, setPaymentLink] = useState("");
  const [copied, setCopied] = useState(false);
  

  const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus("loading");

  try {
    const response = await API.post("/payment/request", {
      amount: Number(amount),
      note,
    });

    setPaymentLink(response.data.paymentLink);
    setStatus("success");

  } catch (error) {
    console.error(error);
    setStatus("error");
  }
};

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Blurred Backdrop */}
      <div
        className="absolute inset-0 bg-[#0a1020]/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl z-10 animate-slideUp"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f2540 40%, #0a1a30 100%)",
          border: "1px solid rgba(56,189,248,0.2)",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        {/* Glow blobs to match BalanceCard */}
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

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-[rgba(148,163,184,0.08)]">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "#38bdf8aa", letterSpacing: "0.12em" }}
            >
              Receive Funds
            </p>
            <h2 className="text-xl font-bold text-white tracking-tight">Request Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[rgba(15,23,42,0.4)] border border-[rgba(51,65,85,0.4)] text-slate-400 hover:text-white hover:bg-[rgba(15,23,42,0.8)] transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-6">
          {status !== "success" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={status === "loading"}
                    className="w-full bg-[rgba(10,16,32,0.6)] border border-[rgba(51,65,85,0.5)] rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-all"
                  />
                </div>
              </div>

              {/* Note Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="What is this for?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full bg-[rgba(10,16,32,0.6)] border border-[rgba(51,65,85,0.5)] rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-all"
                />
              </div>

              {/* Error Message */}
              {status === "error" && (
                <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                  Failed to generate link. Please try again.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full mt-2 font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: status === "loading" ? "rgba(59,130,246,0.5)" : "#3b82f6",
                  color: "white",
                  boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
                }}
              >
                {status === "loading" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Link
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Success State */
            <div className="flex flex-col items-center text-center animate-fadeIn py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Link Generated!</h3>
              <p className="text-slate-400 text-sm mb-6">
                Share this link with anyone to receive ${Number(amount).toFixed(2)}.
              </p>

              {/* Link Container */}
              <div className="w-full bg-[rgba(10,16,32,0.8)] border border-[rgba(56,189,248,0.2)] rounded-xl p-3 flex items-center gap-3 mb-6">
                <div className="flex-1 overflow-hidden">
                  <p className="text-[#38bdf8] font-mono text-sm truncate select-all">
                    {paymentLink || "https://payflow.io/pay/req_12345"}
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex-shrink-0 bg-[rgba(56,189,248,0.15)] hover:bg-[rgba(56,189,248,0.25)] text-[#38bdf8] p-2 rounded-lg transition-colors"
                  title="Copy Link"
                >
                  {copied ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                onClick={onClose}
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestMoneyModal;