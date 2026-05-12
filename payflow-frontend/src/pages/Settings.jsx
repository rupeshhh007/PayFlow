import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";

// ── Helpers ───────────────────────────────────────────────────────────────────
const decodeEmailFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.email || payload.username || null;
  } catch {
    return null;
  }
};
const { logout } = useAuth();

const getInitials = (email = "") =>
  email.split("@")[0].slice(0, 2).toUpperCase();

// ── Shared card style ─────────────────────────────────────────────────────────
const CARD = {
  background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,16,32,0.95))",
  border: "1px solid rgba(148,163,184,0.08)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
};

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, subtitle, accent = "#38bdf8", children }) => (
  <div className="rounded-2xl overflow-hidden" style={CARD}>
    <div
      className="px-6 py-4 flex items-center gap-3"
      style={{ borderBottom: "1px solid rgba(51,65,85,0.4)" }}
    >
      <div
        className="w-1 h-5 rounded-full flex-shrink-0"
        style={{ background: `linear-gradient(to bottom, ${accent}, ${accent}66)` }}
      />
      <div>
        <h3 className="text-sm font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "#334155" }}>{subtitle}</p>
        )}
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

// ── Row layout ────────────────────────────────────────────────────────────────
const Row = ({ label, sub, children, last = false }) => (
  <div
    className="flex items-center justify-between py-4 gap-4"
    style={last ? {} : { borderBottom: "1px solid rgba(30,41,59,0.7)" }}
  >
    <div className="min-w-0">
      <p className="text-sm font-medium text-white" style={{ letterSpacing: "-0.01em" }}>
        {label}
      </p>
      {sub && <p className="text-xs mt-0.5" style={{ color: "#334155" }}>{sub}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

// ── Toggle switch ─────────────────────────────────────────────────────────────
const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className="relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0"
    style={{
      background: enabled
        ? "linear-gradient(135deg, #2563eb, #0284c7)"
        : "rgba(30,41,59,0.8)",
      border: enabled
        ? "1px solid rgba(56,189,248,0.3)"
        : "1px solid rgba(51,65,85,0.6)",
      boxShadow: enabled ? "0 0 10px rgba(37,99,235,0.3)" : "none",
    }}
    aria-pressed={enabled}
  >
    <span
      className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
      style={{
        background: enabled ? "#fff" : "#475569",
        left: enabled ? "calc(100% - 18px)" : "2px",
        boxShadow: enabled ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
      }}
    />
  </button>
);

// ── Logout confirmation modal ─────────────────────────────────────────────────
const LogoutModal = ({ onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(5px)" }}
    onClick={(e) => e.target === e.currentTarget && onCancel()}
  >
    <div
      className="relative w-full max-w-sm rounded-2xl p-7"
      style={{
        background: "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(10,16,32,1))",
        border: "1px solid rgba(239,68,68,0.2)",
        boxShadow:
          "0 0 0 1px rgba(239,68,68,0.06), 0 25px 60px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="absolute top-0 left-8 right-8 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent)",
        }}
      />

      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </div>
        <div>
          <h2
            className="text-white font-bold text-base"
            style={{ letterSpacing: "-0.02em" }}
          >
            Sign out of PayFlow?
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
            Your session will be terminated.
          </p>
        </div>
      </div>

      <p className="text-sm mb-6" style={{ color: "#475569", lineHeight: 1.6 }}>
        You'll need to sign back in to access your wallet and transaction history.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl py-3 text-sm font-medium transition-all duration-200"
          style={{
            background: "rgba(15,23,42,0.7)",
            border: "1px solid rgba(51,65,85,0.6)",
            color: "#64748b",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.borderColor = "rgba(71,85,105,0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#64748b";
            e.currentTarget.style.borderColor = "rgba(51,65,85,0.6)";
          }}
        >
          Stay signed in
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #dc2626, #b91c1c)",
            boxShadow:
              "0 4px 14px rgba(220,38,38,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 6px 20px rgba(220,38,38,0.45), inset 0 1px 0 rgba(255,255,255,0.1)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 4px 14px rgba(220,38,38,0.3), inset 0 1px 0 rgba(255,255,255,0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Yes, sign out
        </button>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Settings = () => {
  const navigate = useNavigate();
  const email = useMemo(() => decodeEmailFromToken() || "user@payflow.io", []);

  const { currency, setCurrency } = useCurrency();
  const [notifications, setNotifications] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleLogout = () => {
  logout();
};

  // ✅ No Navbar, no Sidebar, no ml-56, no pt-14, no min-h-screen
  // AppLayout already provides all of that via <Outlet />
  return (
    <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-6">
      {/* ── Page header ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#1e3a5f", letterSpacing: "0.12em" }}
          >
            Account
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(30,41,59,0.6)" }} />
        </div>
        <h1
          className="text-2xl font-bold text-white"
          style={{ letterSpacing: "-0.03em" }}
        >
          Settings
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
          Manage your account preferences and security.
        </p>
      </div>

      {/* ── 1. Profile ── */}
      <Section title="Profile" subtitle="Your account identity" accent="#38bdf8">
        <div
          className="flex items-center gap-4 p-4 rounded-xl mb-2"
          style={{
            background: "rgba(15,23,42,0.6)",
            border: "1px solid rgba(51,65,85,0.4)",
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #2563eb, #0891b2)",
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              letterSpacing: "0.03em",
            }}
          >
            {getInitials(email)}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="text-sm font-semibold text-white truncate"
              style={{ letterSpacing: "-0.01em" }}
            >
              {email}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
              PayFlow Wallet Member
            </p>
          </div>

          <span
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold flex-shrink-0"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.22)",
              color: "#22c55e",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 5px #22c55e" }}
            />
            Active
          </span>
        </div>

        <Row label="Email Address" sub="Used for login and notifications">
          <span
            className="text-xs font-mono px-3 py-1.5 rounded-lg"
            style={{
              background: "rgba(15,23,42,0.7)",
              border: "1px solid rgba(51,65,85,0.5)",
              color: "#64748b",
            }}
          >
            {email}
          </span>
        </Row>

        <Row label="Account Type" sub="Your current plan" last>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{
              background: "rgba(56,189,248,0.08)",
              border: "1px solid rgba(56,189,248,0.18)",
              color: "#38bdf8",
            }}
          >
            Free Tier
          </span>
        </Row>
      </Section>

      {/* ── 2. Security ── */}
      <Section
        title="Security"
        subtitle="Password and session management"
        accent="#a78bfa"
      >
        <Row label="Password" sub="Last changed: unknown">
          <button
            onClick={() => setPasswordChanged(true)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{
              background: passwordChanged
                ? "rgba(34,197,94,0.1)"
                : "rgba(30,41,59,0.7)",
              border: passwordChanged
                ? "1px solid rgba(34,197,94,0.25)"
                : "1px solid rgba(51,65,85,0.5)",
              color: passwordChanged ? "#22c55e" : "#94a3b8",
            }}
            onMouseEnter={(e) => {
              if (!passwordChanged) {
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)";
                e.currentTarget.style.color = "#c4b5fd";
              }
            }}
            onMouseLeave={(e) => {
              if (!passwordChanged) {
                e.currentTarget.style.borderColor = "rgba(51,65,85,0.5)";
                e.currentTarget.style.color = "#94a3b8";
              }
            }}
          >
            {passwordChanged ? (
              <>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Email sent
              </>
            ) : (
              <>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Change password
              </>
            )}
          </button>
        </Row>

        <Row label="Active Session" sub="Current device and browser">
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 5px #22c55e" }}
            />
            <span className="text-xs font-medium" style={{ color: "#64748b" }}>
              This device
            </span>
          </div>
        </Row>

        <div
          className="flex items-start gap-3 mt-1 p-3 rounded-xl"
          style={{
            background: "rgba(167,139,250,0.05)",
            border: "1px solid rgba(167,139,250,0.12)",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2"
            className="flex-shrink-0 mt-0.5"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
            Your account is secured with JWT-based authentication. Tokens expire
            automatically after inactivity.
          </p>
        </div>
      </Section>

      {/* ── 3. Preferences ── */}
      <Section
        title="Preferences"
        subtitle="Personalise your PayFlow experience"
        accent="#f59e0b"
      >
        <Row label="Display Currency" sub="Used across balance and transaction views">
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="appearance-none text-xs font-medium pr-7 pl-3 py-2 rounded-lg outline-none transition-all duration-200 cursor-pointer"
              style={{
                background: "rgba(15,23,42,0.8)",
                border: "1px solid rgba(51,65,85,0.6)",
                color: "#94a3b8",
              }}
            >
              <option value="USD">🇺🇸 USD — US Dollar</option>
              <option value="INR">🇮🇳 INR — Indian Rupee</option>
              <option value="EUR">🇪🇺 EUR — Euro</option>
              <option value="GBP">🇬🇧 GBP — British Pound</option>
            </select>
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#475569"
              strokeWidth="2.5"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </Row>

        <Row
          label="Email Notifications"
          sub="Transaction alerts and account activity"
          last
        >
          <Toggle enabled={notifications} onChange={setNotifications} />
        </Row>
      </Section>

      {/* ── 4. Danger Zone ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,16,32,0.95))",
          border: "1px solid rgba(239,68,68,0.18)",
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(239,68,68,0.04)",
        }}
      >
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(239,68,68,0.12)" }}
        >
          <div
            className="w-1 h-5 rounded-full flex-shrink-0"
            style={{
              background: "linear-gradient(to bottom, #ef4444, #ef444466)",
            }}
          />
          <div>
            <h3
              className="text-sm font-bold text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Danger Zone
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#334155" }}>
              Irreversible account actions
            </p>
          </div>
        </div>

        <div className="px-6 py-5">
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{
              background: "rgba(239,68,68,0.04)",
              border: "1px solid rgba(239,68,68,0.12)",
            }}
          >
            <div>
              <p
                className="text-sm font-semibold text-white"
                style={{ letterSpacing: "-0.01em" }}
              >
                Sign out of PayFlow
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                Clears your session token and returns to login
              </p>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.22)",
                color: "#f87171",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
                e.currentTarget.style.color = "#fca5a5";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.22)";
                e.currentTarget.style.color = "#f87171";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs pb-6 flex flex-col gap-2">
        <p style={{ color: "#1e3a5f" }}>
          PayFlow · v1.0.0 · 🔒 256-bit encrypted · SOC 2 certified
        </p>
        <p style={{ color: "#334155" }}>
          PayFlow is a simulated digital wallet built for educational purposes.<br/>
          No real money transactions occur.
        </p>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
};

export default Settings;