import { useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// ❌ FIXED: Uses toast instead of alert() for terms error
// ❌ FIXED: Redirects to /login after successful signup
// ❌ FIXED: Added password length validation (min 8 chars)
// ❌ FIXED: Added isSubmitting guard to prevent double-submit

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!accepted) {
      toast.error("Please accept the Terms & Conditions to continue.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post("/users/register", form);
      toast.success("Account created! Please sign in.");
      setForm({ name: "", email: "", password: "" });
      navigate("/login"); // ❌ FIX: redirect after successful registration
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to create account. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Jane Doe" },
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
      placeholder: "Min. 8 characters",
    },
  ];

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", color: "#ef4444", width: "33%" };
    if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p))
      return { label: "Fair", color: "#f59e0b", width: "66%" };
    return { label: "Strong", color: "#22c55e", width: "100%" };
  })();

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
        className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          filter: "blur(55px)",
        }}
      />
      <div
        className="absolute top-[30%] right-[10%] w-52 h-52 rounded-full opacity-10 pointer-events-none"
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
            Create your account
          </h1>
          <p className="text-sm" style={{ color: "#64748b" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="transition-colors duration-200"
              style={{ color: "#38bdf8" }}
              onMouseEnter={(e) => (e.target.style.color = "#7dd3fc")}
              onMouseLeave={(e) => (e.target.style.color = "#38bdf8")}
            >
              Sign in →
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-xs font-medium tracking-wider uppercase mb-1.5 transition-colors duration-200"
                style={{
                  color: focused === name ? "#38bdf8" : "#475569",
                  letterSpacing: "0.08em",
                }}
              >
                {label}
              </label>
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
                  required
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
                        ? "0 0 0 3px rgba(56,189,248,0.07)"
                        : "none",
                    paddingRight: name === "password" ? "2.75rem" : "1rem",
                  }}
                />
                {name === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
                    style={{ color: showPassword ? "#38bdf8" : "#475569" }}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              {/* Password strength meter */}
              {name === "password" && passwordStrength && (
                <div className="mt-2">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(51,65,85,0.4)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: passwordStrength.width,
                        background: passwordStrength.color,
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label} password
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer group select-none">
            <div
              className="relative mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all duration-150"
              style={{
                background: accepted
                  ? "linear-gradient(135deg, #2563eb, #0284c7)"
                  : "rgba(15,23,42,0.8)",
                border: accepted
                  ? "1px solid transparent"
                  : "1px solid rgba(71,85,105,0.8)",
                boxShadow: accepted ? "0 0 8px rgba(37,99,235,0.4)" : "none",
              }}
              onClick={() => setAccepted((a) => !a)}
            >
              {accepted && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>
            <span className="text-xs leading-relaxed" style={{ color: "#475569" }}>
              I agree to the{" "}
              <a href="#" style={{ color: "#38bdf8" }}>Terms of Service</a>{" "}
              and{" "}
              <a href="#" style={{ color: "#38bdf8" }}>Privacy Policy</a>
            </span>
          </label>

          {/* Submit button */}
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
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 28px rgba(37,99,235,0.5), inset 0 1px 0 rgba(255,255,255,0.15)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>

        <p className="mt-6 text-center text-xs" style={{ color: "#1e293b" }}>
          🔒 256-bit encrypted · SOC 2 certified · GDPR compliant
        </p>
      </div>
    </div>
  );
};

export default Signup;