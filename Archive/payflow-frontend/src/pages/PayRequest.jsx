import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/api"; // Assuming this is your Axios instance

const PayRequest = () => {
  const [params] = useSearchParams();
  const requestId = params.get("requestId");
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState("loading"); // loading, idle, processing, success, error

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
      
      // Wait for success animation before redirecting
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Payment failed:", error);
      setStatus("idle");
      // You could add a dedicated error toast state here
    }
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#0a1020] overflow-hidden font-sans">
      {/* Ambient glow matching dashboard */}
      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Payment Card Container */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 animate-slideUp"
        style={{
          background: "rgba(15,23,42,0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(51,65,85,0.6)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-[rgba(51,65,85,0.6)] bg-[rgba(10,16,32,0.4)]">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg tracking-tight">Payment Request</h2>
            <p className="text-xs text-slate-400">PayFlow Secure Transfer</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 relative">
          
          {/* Overlay for Processing/Success */}
          {(status === "processing" || status === "success") && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
              {status === "processing" ? (
                <div className="flex flex-col items-center animate-fadeIn">
                  <div className="w-16 h-16 border-4 border-slate-700 border-t-[#38bdf8] rounded-full animate-spin mb-4" />
                  <h3 className="text-white text-lg font-semibold">Processing Payment...</h3>
                  <p className="text-slate-400 text-sm mt-1">Securing connection</p>
                </div>
              ) : (
                <div className="flex flex-col items-center animate-fadeIn">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold">Payment Successful</h3>
                  <p className="text-slate-400 text-sm mt-1">Redirecting to dashboard...</p>
                </div>
              )}
            </div>
          )}

          {/* Loading Skeleton */}
          {status === "loading" && (
            <div className="space-y-6 animate-pulse">
              <div>
                <div className="h-4 bg-slate-700 rounded w-24 mb-3"></div>
                <div className="h-10 bg-slate-700 rounded w-48"></div>
              </div>
              <div className="h-24 bg-slate-700/50 rounded-xl"></div>
              <div className="h-14 bg-blue-900/40 rounded-xl mt-6"></div>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Request Not Found</h3>
              <p className="text-slate-400 text-sm mb-6">This payment link may be invalid or has already been fulfilled.</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-[#38bdf8] text-sm font-semibold hover:text-white transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          )}

          {/* Content */}
          {status === "idle" && request && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                  Amount Requested
                </p>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  {formatMoney(request.amount)}
                </h1>
              </div>

              {request.note && (
                <div className="bg-[rgba(10,16,32,0.6)] border border-[rgba(51,65,85,0.5)] rounded-xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                    Note attached
                  </p>
                  <p className="text-slate-300 text-sm italic">
                    "{request.note}"
                  </p>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handlePay}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                >
                  Pay {formatMoney(request.amount)}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-green-400 opacity-80 mt-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Secure encrypted transaction
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayRequest;