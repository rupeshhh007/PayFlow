import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import BalanceCard from "../components/BalanceCard";
import TransactionTable from "../components/TransactionTable";
import { getBalance, getTransactions } from "../api/walletApi";
import DepositModal from "../components/DepositModal";
import SendMoneyModal from "../components/SendMoneyModal";
import RequestMoneyModal from "../components/RequestMoneyModal";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const QUICK_ACTIONS = [
  {
    id: "send",
    label: "Send Money",
    description: "Transfer to anyone",
    accent: "#3b82f6",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
  },
  {
    id: "request",
    label: "Request Payment",
    description: "Send a payment link",
    accent: "#06b6d4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>
    ),
  },
  {
    id: "add",
    label: "Add Funds",
    description: "Top up your balance",
    accent: "#22c55e",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    id: "recurring",
    label: "Recurring",
    description: "Schedule payments",
    accent: "#8b5cf6",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 3v6h-6" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
];

const Dashboard = () => {
  const { currency } = useCurrency();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRequestMoney, setShowRequestMoney] = useState(false);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);

  // ---------------- LOAD DATA ----------------
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const [balRes, txRes] = await Promise.all([
        getBalance(),
        getTransactions(),
      ]);

      setBalance(Number(balRes.data.balance || 0));
      setTransactions(txRes.data || []);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------- INIT ----------------
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) loadDashboard();
  }, [user, authLoading, navigate, loadDashboard]);

  // ---------------- DERIVED DATA ----------------
  const { totalSpent, totalReceived, deposits } = useMemo(() => {
    return {
      totalSpent: transactions
        .filter((t) => t.type === "TRANSFER_SENT")
        .reduce((sum, t) => sum + Number(t.amount), 0),

      totalReceived: transactions
        .filter((t) => t.type === "TRANSFER_RECEIVED")
        .reduce((sum, t) => sum + Number(t.amount), 0),

      deposits: transactions
        .filter((t) => t.type === "DEPOSIT")
        .reduce((sum, t) => sum + Number(t.amount), 0),
    };
  }, [transactions]);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);

  // ---------------- GREETING ----------------
  const getGreeting = () => {
    if (!user?.email) return "Welcome";
    return `Hey ${user.email.split("@")[0]} 👋`;
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // ---------------- LOADING ----------------
  if (loading || authLoading) {
    return <div className="text-white p-10">Loading dashboard...</div>;
  }

  return (
    <div className="relative">
      <div className="px-6 py-7 max-w-6xl">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {getGreeting()}
            </h1>
            <p className="text-sm text-slate-400">
              Here's what's happening with your account today.
            </p>
          </div>

          <div
            className="flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold"
            style={{
              background: "rgba(15,23,42,0.72)",
              border: "1px solid rgba(51,65,85,0.55)",
              color: "#94a3b8",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {currentDate}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="flex flex-col gap-6">
            <BalanceCard balance={balance} transactions={transactions} />

            <div
              className="rounded-2xl p-5"
              style={{
                background:
                  "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,16,32,0.95))",
                border: "1px solid rgba(148,163,184,0.08)",
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Quick Actions
                </h3>
                <span
                  className="rounded-lg px-2 py-1 text-[11px] font-semibold"
                  style={{
                    background: "rgba(56,189,248,0.08)",
                    color: "#38bdf8",
                    border: "1px solid rgba(56,189,248,0.12)",
                  }}
                >
                  Payments
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      if (action.id === "send") setShowSendMoney(true);
                      if (action.id === "add") setShowDeposit(true);
                      if (action.id === "request") setShowRequestMoney(true);
                      if (action.id === "recurring") navigate("/recurring");
                    }}
                    className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left transition-all duration-200"
                    style={{
                      background: "rgba(15,23,42,0.6)",
                      border: "1px solid rgba(51,65,85,0.4)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${action.accent}0f`;
                      e.currentTarget.style.borderColor = `${action.accent}35`;
                      e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(15,23,42,0.6)";
                      e.currentTarget.style.borderColor = "rgba(51,65,85,0.4)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: `${action.accent}15`,
                        border: `1px solid ${action.accent}30`,
                        color: action.accent,
                      }}
                    >
                      {action.icon}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {action.label}
                      </p>
                      <p className="text-xs text-slate-500">
                        {action.description}
                      </p>
                    </div>

                    <svg
                      className="ml-auto"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="xl:col-span-2 flex flex-col gap-6">

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Deposited", value: formatMoney(deposits), color: "#22c55e" },
                { label: "Sent", value: formatMoney(totalSpent), color: "#f59e0b" },
                { label: "Received", value: formatMoney(totalReceived), color: "#38bdf8" },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-2xl p-4"
                  style={{
                    background: "linear-gradient(145deg, rgba(15,23,42,0.86), rgba(10,16,32,0.94))",
                    border: "1px solid rgba(148,163,184,0.08)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.035)",
                  }}
                >
                  <p className="text-xs text-slate-400">{kpi.label}</p>
                  <p
                    className="text-xl font-bold"
                    style={{ color: kpi.color, letterSpacing: "-0.02em" }}
                  >
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Recurring payments */}
            <div
              className="relative overflow-hidden rounded-2xl p-5"
              style={{
                background:
                  "linear-gradient(145deg, rgba(15,23,42,0.92), rgba(10,16,32,0.98))",
                border: "1px solid rgba(139,92,246,0.18)",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <div
                className="absolute left-5 right-5 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(56,189,248,0.35), transparent)",
                }}
              />

              <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(139,92,246,0.12)",
                      border: "1px solid rgba(139,92,246,0.28)",
                      color: "#a78bfa",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                      <path d="M21 3v6h-6" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </div>

                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        Recurring payments
                      </h3>
                      <span
                        className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                        style={{
                          background: "rgba(34,197,94,0.1)",
                          border: "1px solid rgba(34,197,94,0.18)",
                          color: "#22c55e",
                        }}
                      >
                        Ready
                      </span>
                    </div>
                    <p className="max-w-md text-sm text-slate-400">
                      Schedule daily, weekly, or monthly transfers from one clean place.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/recurring")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 lg:w-auto"
                  style={{
                    background: "rgba(255,255,255,0.96)",
                    color: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.85)",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.32)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.25)";
                  }}
                >
                  Create schedule
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="relative z-10 mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Frequency", value: "Daily to monthly" },
                  { label: "Status", value: "Protected" },
                  { label: "Next step", value: "Add recipient" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl px-3 py-3"
                    style={{
                      background: "rgba(15,23,42,0.66)",
                      border: "1px solid rgba(51,65,85,0.48)",
                    }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions */}
            {transactions.length === 0 ? (
              <p className="text-slate-400">No transactions yet.</p>
            ) : (
              <TransactionTable transactions={transactions} />
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showSendMoney && (
        <SendMoneyModal onClose={() => setShowSendMoney(false)} onSuccess={loadDashboard} />
      )}

      {showDeposit && (
        <DepositModal onClose={() => setShowDeposit(false)} onSuccess={loadDashboard} />
      )}

      {showRequestMoney && (
        <RequestMoneyModal onClose={() => setShowRequestMoney(false)} />
      )}
    </div>
  );
};

export default Dashboard;
