import { useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// ❌ FIXED: Removed rogue top-level `toast.success("It works!")` that fired on every page load
// ❌ FIXED: Removed redundant `navigate("/dashboard")` after `login()` — AuthContext already navigates

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await API.post("/users/login", form);
      const token = response?.data?.token || response?.data;
      login(token);

      toast.success("Welcome back!");

      navigate("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "jane@company.com",
    },
    {
      name: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      placeholder: "Enter your password",
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a0e1a 0%, #0d1525 50%, #0a1020 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute top-[-8%] right-[-4%] w-[420px] h-[420px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-[35%] left-[8%] w-52 h-52 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          filter: "blur(45px)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating stat chips — decorative */}
      <div
        className="absolute top-10 left-6 sm:left-16 hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium"
        style={{
          background: "rgba(15,23,42,0.85)",
          border: "1px solid rgba(51,65,85,0.6)",
          color: "#22c55e",
          backdropFilter: "blur(12px)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: "#22c55e" }}
        />
        Portfolio +2.4% today
      </div>
      <div
        className="absolute bottom-10 right-6 sm:right-16 hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium"
        style={{
          background: "rgba(15,23,42,0.85)",
          border: "1px solid rgba(51,65,85,0.6)",
          color: "#38bdf8",
          backdropFilter: "blur(12px)",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Bank-grade security
      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-2xl p-8 sm:p-10"
        style={{
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(10,16,32,0.98) 100%)",
          border: "1px solid rgba(148,163,184,0.1)",
          boxShadow:
            "0 0 0 1px rgba(59,130,246,0.05), 0 25px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-8 right-8 h-px rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), rgba(6,182,212,0.6), transparent)",
          }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              boxShadow: "0 4px 15px rgba(59,130,246,0.35)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9" />
              <path
                d="M2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
              />
            </svg>
          </div>
          <span
            className="text-white font-semibold text-lg"
            style={{ letterSpacing: "-0.02em" }}
          >
            Pay<span style={{ color: "#38bdf8" }}>Flow</span>
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1
            className="text-white text-3xl font-bold mb-2"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.15 }}
          >
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "#64748b" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="transition-colors duration-200"
              style={{ color: "#38bdf8" }}
              onMouseEnter={(e) => (e.target.style.color = "#7dd3fc")}
              onMouseLeave={(e) => (e.target.style.color = "#38bdf8")}
            >
              Sign up free →
            </Link>
          </p>
        </div>

        {/* SSO Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {["Google", "GitHub"].map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => toast("OAuth coming soon")}
              className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all duration-200"
              style={{
                background: "rgba(15,23,42,0.8)",
                border: "1px solid rgba(51,65,85,0.6)",
                color: "#94a3b8",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(56,189,248,0.3)";
                e.currentTarget.style.color = "#e2e8f0";
                e.currentTarget.style.background = "rgba(30,41,59,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(51,65,85,0.6)";
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.background = "rgba(15,23,42,0.8)";
              }}
            >
              {provider === "Google" ? (
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765C6.199 6.939 8.854 4.91 12 4.91c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.04 18.013C14.951 18.716 13.566 19.09 12 19.09c-3.133 0-5.78-2.013-6.723-4.822L1.237 17.335C3.193 21.294 7.265 24 12 24c2.933 0 5.735-1.043 7.834-3.001l-3.794-2.986z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M19.834 20.999C21.961 19.07 23.273 16.245 23.273 12c0-.709-.091-1.473-.228-2.182H12v4.636h6.182c-.318 1.468-1.179 2.618-2.176 3.559l3.828 2.986z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.277 14.268A7.12 7.12 0 0 1 4.91 12c0-.782.125-1.533.356-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"
                  />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              )}
              {provider}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(51,65,85,0.5)" }}
          />
          <span className="text-xs" style={{ color: "#334155" }}>
            or sign in with email
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(51,65,85,0.5)" }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={name}
                  className="block text-xs font-medium tracking-wider uppercase transition-colors duration-200"
                  style={{
                    color: focused === name ? "#38bdf8" : "#475569",
                    letterSpacing: "0.08em",
                  }}
                >
                  {label}
                </label>
                {name === "password" && (
                  <button
                    type="button"
                    className="text-xs transition-colors duration-200"
                    style={{ color: "#38bdf8" }}
                    onMouseEnter={(e) => (e.target.style.color = "#7dd3fc")}
                    onMouseLeave={(e) => (e.target.style.color = "#38bdf8")}
                    onClick={() => toast("Forgot password flow coming soon")}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={form[name]}
                  placeholder={placeholder}
                  onChange={handleChange}
                  onFocus={() => setFocused(name)}
                  onBlur={() => setFocused(null)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
                  style={{
                    background:
                      focused === name
                        ? "rgba(30,41,59,0.9)"
                        : "rgba(15,23,42,0.8)",
                    border:
                      focused === name
                        ? "1px solid rgba(56,189,248,0.5)"
                        : "1px solid rgba(51,65,85,0.6)",
                    boxShadow:
                      focused === name
                        ? "0 0 0 3px rgba(56,189,248,0.07), inset 0 1px 0 rgba(255,255,255,0.03)"
                        : "inset 0 1px 0 rgba(255,255,255,0.02)",
                    paddingRight: name === "password" ? "2.75rem" : "1rem",
                  }}
                />
                {name === "email" && form.email.includes("@") && (
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#22c55e" }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                )}
                {name === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
                    style={{ color: showPassword ? "#38bdf8" : "#475569" }}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Remember me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer group select-none">
              <div
                className="relative w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all duration-150"
                style={{
                  background: rememberMe
                    ? "linear-gradient(135deg, #2563eb, #0284c7)"
                    : "rgba(15,23,42,0.8)",
                  border: rememberMe
                    ? "1px solid transparent"
                    : "1px solid rgba(71,85,105,0.8)",
                  boxShadow: rememberMe
                    ? "0 0 8px rgba(37,99,235,0.4)"
                    : "none",
                }}
                onClick={() => setRememberMe((r) => !r)}
              >
                {rememberMe && (
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3.5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span className="text-xs" style={{ color: "#475569" }}>
                Remember me for 30 days
              </span>
            </label>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full rounded-xl py-3.5 text-sm font-semibold text-white overflow-hidden transition-all duration-200"
            style={{
              background: isSubmitting
                ? "rgba(37,99,235,0.5)"
                : "linear-gradient(135deg, #2563eb 0%, #0284c7 100%)",
              boxShadow:
                "0 4px 20px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              letterSpacing: "-0.01em",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.boxShadow =
                  "0 6px 28px rgba(37,99,235,0.5), inset 0 1px 0 rgba(255,255,255,0.15)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>

        {/* Security note */}
        <div
          className="mt-5 flex items-center gap-2.5 rounded-xl px-4 py-3"
          style={{
            background: "rgba(37,99,235,0.06)",
            border: "1px solid rgba(37,99,235,0.15)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            className="flex-shrink-0"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <p className="text-xs" style={{ color: "#475569" }}>
            Two-factor authentication is{" "}
            <span style={{ color: "#38bdf8" }}>enabled</span> on your account.
          </p>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "#1e293b" }}>
          🔒 256-bit encrypted · SOC 2 certified · GDPR compliant
        </p>
      </div>
    </div>
  );
};

export default Login;
