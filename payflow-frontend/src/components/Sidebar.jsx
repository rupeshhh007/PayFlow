import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTransactions } from "../api/walletApi";
import UpgradeModal from "./UpgradeModal";
import {
  getStoredPlan,
  PLAN_UPDATED_EVENT,
  saveStoredPlan,
} from "../utils/plan";

// ❌ FIXED: Hardcoded badge "12" on Transactions nav item — now shows real transaction count
// ✨ ADDED: Badge auto-hides when count is 0

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "transactions",
    label: "Transactions",
    showCount: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 12V22H4V12" />
        <path d="M22 7H2v5h20V7z" />
        <path d="M12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [txCount, setTxCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [plan, setPlan] = useState(() => getStoredPlan());

  const isPro = plan.tier === "pro";

  useEffect(() => {
    getTransactions()
      .then((res) => setTxCount(res.data?.length ?? 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const syncPlan = () => setPlan(getStoredPlan());

    window.addEventListener(PLAN_UPDATED_EVENT, syncPlan);
    window.addEventListener("storage", syncPlan);

    return () => {
      window.removeEventListener(PLAN_UPDATED_EVENT, syncPlan);
      window.removeEventListener("storage", syncPlan);
    };
  }, []);

  const handleUpgrade = (nextPlan) => {
    setPlan(saveStoredPlan(nextPlan));
  };

  return (
    <>
      <aside
        className="fixed left-0 top-14 bottom-0 w-56 flex flex-col gap-6 px-3 py-5 overflow-y-auto"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,14,26,0.97) 0%, rgba(8,12,22,0.99) 100%)",
          borderRight: "1px solid rgba(148,163,184,0.06)",
          zIndex: 40,
        }}
      >
        {/* Logo wordmark */}
        <div className="px-2 mb-1">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{
              color: "#1e3a5f",
              letterSpacing: "0.12em",
            }}
          >
            Main Menu
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === `/${item.id}`;
            const badge =
              item.showCount && txCount > 0
                ? txCount > 99
                  ? "99+"
                  : String(txCount)
                : null;

            return (
              <button
                key={item.id}
                onClick={() => navigate(`/${item.id}`)}
                className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-left w-full transition-all duration-200 group"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.08))"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(56,189,248,0.2)"
                    : "1px solid transparent",
                  color: isActive ? "#e2e8f0" : "#475569",
                  boxShadow: isActive
                    ? "inset 0 1px 0 rgba(255,255,255,0.04)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(30,41,59,0.5)";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#475569";
                  }
                }}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                    style={{
                      background: "linear-gradient(to bottom, #3b82f6, #06b6d4)",
                      boxShadow: "0 0 6px rgba(56,189,248,0.6)",
                    }}
                  />
                )}
                <span style={{ color: isActive ? "#38bdf8" : "inherit" }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {badge && (
                  <span
                    className="ml-auto text-xs font-semibold rounded-md px-1.5 py-0.5"
                    style={{
                      background: "rgba(56,189,248,0.12)",
                      color: "#38bdf8",
                      fontSize: "0.65rem",
                    }}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Upgrade nudge */}
        <div className="mt-auto mx-1">
          <div
            className="rounded-xl p-3.5"
            style={{
              background: isPro
                ? "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(56,189,248,0.06))"
                : "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(6,182,212,0.06))",
              border: isPro
                ? "1px solid rgba(34,197,94,0.16)"
                : "1px solid rgba(56,189,248,0.12)",
            }}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-white">
                {isPro ? "Pro active" : "Upgrade to Pro"}
              </p>
              {isPro && (
                <span
                  className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    background: "rgba(34,197,94,0.12)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  Pro
                </span>
              )}
            </div>
            <p className="text-xs mb-3" style={{ color: "#475569" }}>
              {isPro
                ? "Higher limits are enabled"
                : "Unlock analytics and higher limits"}
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full rounded-lg py-1.5 text-xs font-semibold text-white transition-all duration-200"
              style={{
                background: isPro
                  ? "linear-gradient(135deg, #16a34a, #0891b2)"
                  : "linear-gradient(135deg, #2563eb, #0284c7)",
                boxShadow: isPro
                  ? "0 2px 10px rgba(34,197,94,0.22)"
                  : "0 2px 10px rgba(37,99,235,0.3)",
              }}
            >
              {isPro ? "Manage plan" : "Upgrade"}
            </button>
          </div>
        </div>
      </aside>

      <UpgradeModal
        open={showUpgradeModal}
        currentPlan={plan}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
      />
    </>
  );
};

export default Sidebar;
