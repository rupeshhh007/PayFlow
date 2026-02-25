import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BalanceCard from "../components/BalanceCard";
import TransactionTable from "../components/TransactionTable";
import { getBalance, getTransactions } from "../api/walletApi";
import DepositModal from "../components/DepositModal";
import SendMoneyModal from "../components/SendMoneyModal";
import { useCurrency } from "../context/CurrencyContext";
import RequestMoneyModal from "../components/RequestMoneyModal";

const QUICK_ACTIONS = [
  {
    id: "send",
    label: "Send Money",
    description: "Transfer to anyone",
    accent: "#3b82f6",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
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
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
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
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
];

const Dashboard = () => {
  const { currency } = useCurrency();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [userEmail, setUserEmail] = useState("user@payflow.io");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showRequestMoney, setShowRequestMoney] = useState(false);

  const [showSendMoney, setShowSendMoney] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const loadDashboard = async () => {
    try {
      const balRes = await getBalance();
      const txRes = await getTransactions();

      setBalance(balRes.data.balance);
      setTransactions(txRes.data);
    } catch {
      navigate("/login", { replace: true });
    }
  };

  // Route protection — redirect to /login if no token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    loadDashboard();
  }, [navigate]);
  const totalSpent = transactions
    .filter((t) => t.type === "TRANSFER_SENT")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceived = transactions
    .filter((t) => t.type === "TRANSFER_RECEIVED")
    .reduce((sum, t) => sum + t.amount, 0);

  const deposits = transactions
    .filter((t) => t.type === "DEPOSIT")
    .reduce((sum, t) => sum + t.amount, 0);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="fixed bottom-0 left-56 w-80 h-80 rounded-full pointer-events-none opacity-8"
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

      {/* Main content area */}
      <div className="relative z-10">
        <div className="px-6 py-7 max-w-6xl">
          {/* Page header */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#1e3a5f", letterSpacing: "0.12em" }}
              >
                Overview
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(30,41,59,0.6)" }}
              />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h1
                  className="text-2xl font-bold text-white"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  Namaste👋
                </h1>
                <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
                  Here's what's happening with your account today.
                </p>
              </div>
              <div
                className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 text-xs"
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid rgba(51,65,85,0.5)",
                  color: "#475569",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Feb 23, 2026
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left column: Balance + Quick Actions */}
            <div className="xl:col-span-1 flex flex-col gap-6">
              <BalanceCard balance={balance} transactions={transactions} />

              {/* Quick Actions */}
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
                <h3
                  className="text-sm font-bold text-white mb-4"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Quick Actions
                </h3>
                <div className="flex flex-col gap-2.5">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        if (action.id === "send") {
                          setShowSendMoney(true);
                        }
                        if (action.id === "add") {
                          setShowDeposit(true);
                        }
                        if (action.id === "request") {
                          setShowRequestMoney(true);
                        }
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
                        e.currentTarget.style.borderColor =
                          "rgba(51,65,85,0.4)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${action.accent}15`,
                          border: `1px solid ${action.accent}30`,
                          color: action.accent,
                        }}
                      >
                        {action.icon}
                      </div>
                      <div>
                        <p
                          className="text-sm font-semibold text-white"
                          style={{ letterSpacing: "-0.01em" }}
                        >
                          {action.label}
                        </p>
                        <p className="text-xs" style={{ color: "#334155" }}>
                          {action.description}
                        </p>
                      </div>
                      <svg
                        className="ml-auto flex-shrink-0"
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

            {/* Right column: Transactions */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              {/* Spending snapshot */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    label: "Deposited",
                    value: formatMoney(deposits),
                    sub: "money added",
                    color: "#22c55e",
                  },
                  {
                    label: "Sent",
                    value: formatMoney(totalSpent),
                    sub: "transferred",
                    color: "#f59e0b",
                  },
                  {
                    label: "Received",
                    value: formatMoney(totalReceived),
                    sub: "payments received",
                    color: "#38bdf8",
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-xl p-4"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,16,32,0.95))",
                      border: "1px solid rgba(148,163,184,0.07)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
                    }}
                  >
                    <p
                      className="text-xs uppercase tracking-widest mb-2"
                      style={{ color: "#334155", letterSpacing: "0.1em" }}
                    >
                      {kpi.label}
                    </p>
                    <p
                      className="text-xl font-bold"
                      style={{ color: kpi.color, letterSpacing: "-0.03em" }}
                    >
                      {kpi.value}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#334155" }}>
                      {kpi.sub}
                    </p>
                  </div>
                ))}
              </div>

              <TransactionTable transactions={transactions} />
            </div>
          </div>
        </div>
      </div>

      {showSendMoney && (
        <SendMoneyModal
          onClose={() => setShowSendMoney(false)}
          onSuccess={loadDashboard}
        />
      )}
      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
      {showRequestMoney && (
        <RequestMoneyModal onClose={() => setShowRequestMoney(false)} />
      )}
    </div>
  );
};

export default Dashboard;
