import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { simulatePayment } from "../api/paymentApi";
const PaymentSimulator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const amount = parseFloat(searchParams.get("amount") || "0");

  const [activeTab, setActiveTab] = useState("upi");
  const [status, setStatus] = useState("idle"); // idle, processing, success
  const [orderId, setOrderId] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Form states
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  useEffect(() => {
    // Generate a random order ID on mount
    const randomId = "PF_ORD_" + Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderId(randomId);
  }, []);

  const formatMoney = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // Adjust if your app uses a different default
    }).format(val);

  const handlePayment = async (e) => {
    e.preventDefault();
    setStatus("processing");

    // Fake verification animation delay (2 seconds)
    setTimeout(async () => {
      try {
        await simulatePayment(amount, activeTab);

        setStatus("success");
        setShowToast(true);

        // Wait for success animation/toast to show, then redirect
        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
      } catch (error) {
        console.error("Payment failed to simulate:", error);
        setStatus("idle");
        alert("Payment simulation failed. Check console.");
      }
    }, 2000);
  };

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

      {/* Gateway Card Container */}
      <div
        className="relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl transition-all duration-500"
        style={{
          background: "rgba(15,23,42,0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(51,65,85,0.6)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Left: Summary Panel */}
        <div
          className="md:w-1/3 p-8 border-b md:border-b-0 md:border-r"
          style={{
            background: "rgba(10,16,32,0.6)",
            borderColor: "rgba(51,65,85,0.6)",
          }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">PayFlow</h2>
              <p className="text-xs text-slate-400">Secure Checkout</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-400 mb-1">Amount to pay</p>
              <h1 className="text-4xl font-bold text-white tracking-tight">{formatMoney(amount)}</h1>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-700/50 text-sm">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Merchant</span>
                <span className="font-medium text-white">PayFlow Wallet</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Email</span>
                <span className="font-medium">user@payflow.io</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Order ID</span>
                <span className="font-mono text-xs mt-0.5">{orderId}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-2 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-2 rounded-lg w-max">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            128-bit SSL Secured
          </div>
        </div>

        {/* Right: Payment Methods Panel */}
        <div className="md:w-2/3 p-8 relative">
          {/* Overlay for Processing/Success */}
          {status !== "idle" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm rounded-r-2xl">
              {status === "processing" ? (
                <div className="flex flex-col items-center animate-pulse">
                  <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4" />
                  <h3 className="text-white text-lg font-semibold">Processing Payment</h3>
                  <p className="text-slate-400 text-sm mt-2">Please do not close this window</p>
                </div>
              ) : (
                <div className="flex flex-col items-center transform transition-all duration-500 scale-100">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-10 h-10 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold">Payment Successful</h3>
                  <p className="text-slate-400 text-sm mt-1">Redirecting to dashboard...</p>
                </div>
              )}
            </div>
          )}

          <h3 className="text-lg font-semibold text-white mb-6">Select Payment Method</h3>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50">
            {["upi", "card", "netbanking"].map((method) => (
              <button
                key={method}
                onClick={() => setActiveTab(method)}
                disabled={status !== "idle"}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                  activeTab === method
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {method === "netbanking" ? "Net Banking" : method}
              </button>
            ))}
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            {/* UPI Section */}
            {activeTab === "upi" && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">UPI ID / VPA</label>
                  <input
                    type="text"
                    required
                    disabled={status !== "idle"}
                    placeholder="username@bank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm text-blue-300">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>You will receive a payment request on your UPI app. Please approve it within 5 minutes.</p>
                </div>
              </div>
            )}

            {/* Card Section */}
            {activeTab === "card" && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Card Number</label>
                  <input
                    type="text"
                    required
                    disabled={status !== "idle"}
                    maxLength="16"
                    placeholder="0000 0000 0000 0000"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Expiry</label>
                    <input
                      type="text"
                      required
                      disabled={status !== "idle"}
                      placeholder="MM/YY"
                      maxLength="5"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">CVV</label>
                    <input
                      type="password"
                      required
                      disabled={status !== "idle"}
                      placeholder="•••"
                      maxLength="3"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono tracking-widest"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name on Card</label>
                  <input
                    type="text"
                    required
                    disabled={status !== "idle"}
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Net Banking Section */}
            {activeTab === "netbanking" && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Select Bank</label>
                  <select
                    required
                    disabled={status !== "idle"}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
                    style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                  >
                    <option value="" disabled selected>Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={status !== "idle"}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay {formatMoney(amount)}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-800 border border-green-500/30 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slideUp">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm">Payment Successful</p>
            <p className="text-slate-400 text-xs">Wallet Credited</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSimulator;