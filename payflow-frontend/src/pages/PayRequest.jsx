import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useCurrency } from "../context/CurrencyContext";
import toast from "react-hot-toast";

// ❌ FIXED: formatMoney was hardcoded to INR — now uses CurrencyContext
// ❌ FIXED: Payment failure showed console.error only — now shows toast error to user
// ✨ ADDED: Shows requester note if present in the payment request data

const PayRequest = () => {
  const [params] = useSearchParams();
  const requestId = params.get("requestId");
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState("loading");

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);

  useEffect(() => {
    if (!requestId) {
      setStatus("error");
      return;
    }

    API.get(`/payment/request/${requestId}`)
      .then((res) => {
        setRequest(res.data);
        setStatus("idle");
      })
      .catch((err) => {
        console.error("Failed to fetch request:", err);
        setStatus("error");
      });
  }, [requestId]);

  const handlePay = async () => {
    setStatus("processing");
    try {
      await API.post(`/payment/pay/${requestId}`);
      setStatus("success");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error("Payment failed:", error);
      const msg =
        error?.response?.data?.message ||
        "Payment failed. Please try again.";
      toast.error(msg); // ❌ FIXED: was silent
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#0a1020] overflow-hidden font-sans">
      {/* Ambient glow */}
      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", filter: "blur(70px)" }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Loading */}
      {status === "loading" && (
        <div className="flex items-center gap-3 text-white">
          <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading payment request…
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="relative w-full max-w-md rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(10,16,32,0.98))",
            border: "1px solid rgba(239,68,68,0.2)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.55)",
          }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Payment Link Invalid</h2>
          <p className="text-sm mb-6" style={{ color: "#475569" }}>
            {requestId ? "This payment request could not be found or has already been completed." : "No payment request ID was provided."}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #2563eb, #0284c7)", boxShadow: "0 4px 16px rgba(37,99,235,0.3)" }}
          >
            Go to Dashboard
          </button>
        </div>
      )}

      {/* Success */}
      {status === "success" && (
        <div className="relative w-full max-w-md rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(10,16,32,0.98))",
            border: "1px solid rgba(34,197,94,0.2)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.55)",
          }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Payment Sent!</h2>
          <p className="text-sm" style={{ color: "#475569" }}>Redirecting to dashboard…</p>
        </div>
      )}

      {/* Main pay card */}
      {(status === "idle" || status === "processing") && request && (
        <div
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #0f2540 40%, #0a1a30 100%)",
            border: "1px solid rgba(56,189,248,0.2)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          {/* Glow */}
          <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", filter: "blur(30px)", transform: "translate(-30%, -30%)" }}
          />
          <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", filter: "blur(25px)", transform: "translate(20%, 20%)" }}
          />
          <div className="absolute top-0 left-8 right-8 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.5), rgba(59,130,246,0.4), transparent)" }}
          />

          <div className="relative z-10 p-8">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">Pay<span style={{ color: "#38bdf8" }}>Flow</span></span>
            </div>

            {/* Request info */}
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#38bdf8aa", letterSpacing: "0.12em" }}>
                Payment Request
              </p>
              <p className="text-5xl font-bold text-white mb-1" style={{ letterSpacing: "-0.04em" }}>
                {formatMoney(request.amount)}
              </p>
              {request.note && (
                <p className="text-sm mt-3 px-4 py-2 rounded-lg" style={{ color: "#94a3b8", background: "rgba(15,23,42,0.5)", border: "1px solid rgba(51,65,85,0.3)" }}>
                  "{request.note}"
                </p>
              )}
              <p className="text-xs mt-3" style={{ color: "#475569" }}>
                Requested by{" "}
                <span style={{ color: "#38bdf8" }}>
                  {request.requesterEmail || "a PayFlow user"}
                </span>
              </p>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={status === "processing"}
              className="w-full rounded-xl py-4 text-sm font-bold text-white transition-all duration-200"
              style={{
                background: status === "processing"
                  ? "rgba(37,99,235,0.5)"
                  : "linear-gradient(135deg, #2563eb 0%, #0284c7 100%)",
                boxShadow: "0 4px 20px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                cursor: status === "processing" ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (status !== "processing") e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {status === "processing" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Processing…
                </span>
              ) : (
                `Pay ${formatMoney(request.amount)}`
              )}
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full mt-3 rounded-xl py-3 text-sm font-medium transition-all duration-150"
              style={{
                background: "rgba(15,23,42,0.5)",
                border: "1px solid rgba(51,65,85,0.4)",
                color: "#475569",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayRequest;