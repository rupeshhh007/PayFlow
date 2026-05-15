import { useAuth } from "../context/AuthContext";
import { MobileMenu } from "./MobileMenu";

const Navbar = () => {
  const { user, logout } = useAuth();

  const initials =
    user?.email?.slice(0, 2).toUpperCase() || "PF";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3.5"
      style={{
        background: "rgba(10,14,26,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(148,163,184,0.07)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <MobileMenu onLogout={logout} />
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
          </svg>
        </div>

        <span className="text-white font-bold text-lg">
          Pay<span style={{ color: "#38bdf8" }}>Flow</span>
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#0891b2)",
            }}
          >
            {initials}
          </div>

          <span
            className="text-sm hidden sm:block"
            style={{ color: "#94a3b8" }}
          >
            {user?.email}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;