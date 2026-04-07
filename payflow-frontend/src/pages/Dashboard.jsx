import { useEffect, useState, useMemo } from "react";
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

// 🔥 RESTORED BEAUTIFUL QUICK ACTIONS
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
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [balRes, txRes] = await Promise.all([
        getBalance(),
        getTransactions(),
      ]);

      setBalance(Number(balRes.data.balance || 0));
      setTransactions(txRes.data || []);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- INIT ----------------
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) loadDashboard();
  }, [user, authLoading]);

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
        <div className="mb-7 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {getGreeting()}
            </h1>
            <p className="text-sm text-slate-400">
              Here's what's happening with your account today.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            {currentDate}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="flex flex-col gap-6">
            <BalanceCard balance={balance} transactions={transactions} />

            {/* 🔥 PREMIUM QUICK ACTIONS */}
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
              <h3 className="text-sm font-bold text-white mb-4">
                Quick Actions
              </h3>

              <div className="flex flex-col gap-2.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      if (action.id === "send") setShowSendMoney(true);
                      if (action.id === "add") setShowDeposit(true);
                      if (action.id === "request") setShowRequestMoney(true);
                    }}
                    className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-left w-full transition-all duration-200"
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
                { label: "Deposited", value: formatMoney(deposits), color: "text-green-400" },
                { label: "Sent", value: formatMoney(totalSpent), color: "text-yellow-400" },
                { label: "Received", value: formatMoney(totalReceived), color: "text-blue-400" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-slate-900 p-4 rounded-xl">
                  <p className="text-xs text-slate-400">{kpi.label}</p>
                  <p className={`text-xl font-bold ${kpi.color}`}>
                    {kpi.value}
                  </p>
                </div>
              ))}
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