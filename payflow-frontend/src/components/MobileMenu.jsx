import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/transactions", label: "Transactions" },
  { path: "/wallet", label: "Wallet" },
  { path: "/analytics", label: "Analytics" },
  { path: "/settings", label: "Settings" },
];

export const MobileMenu = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.05)] text-slate-200 transition hover:bg-[rgba(255,255,255,0.12)]"
        aria-label="Open navigation menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-4 right-4 top-16 z-50 rounded-3xl border border-slate-800 bg-[#0a0e1a]/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-900"}`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-300 hover:bg-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
