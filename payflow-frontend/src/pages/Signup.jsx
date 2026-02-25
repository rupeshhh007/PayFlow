import { useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Jane Doe" },
    { name: "email", label: "Email Address", type: "email", placeholder: "jane@company.com" },
    {
      name: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      placeholder: "Min. 8 characters",
    },
  ];
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!accepted) {
    alert("Accept Terms & Conditions");
    return;
  }

  try {
    await API.post("/users/register", form);
    toast.success("Account has been created!");

    setForm({
      name: "",
      email: "",
      password: "",
    });

  } catch (err) {
    console.error(err);
    toast.error("Failed to create account");
  }
};

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #0d1525 50%, #0a1020 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="absolute top-[40%] right-[10%] w-48 h-48 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-2xl p-8 sm:p-10"
        style={{
          background: "linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(10,16,32,0.98) 100%)",
          border: "1px solid rgba(148,163,184,0.1)",
          boxShadow: "0 0 0 1px rgba(59,130,246,0.05), 0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-8 right-8 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), rgba(6,182,212,0.6), transparent)" }}
        />

        {/* Logo mark */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 15px rgba(59,130,246,0.35)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            PayFlow<span style={{ color: "#38bdf8" }}></span>
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
            Already have one?{" "}
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
            <div key={name} className="relative">
              <label
                htmlFor={name}
                className="block text-xs font-medium mb-1.5 tracking-wider uppercase transition-colors duration-200"
                style={{ color: focused === name ? "#38bdf8" : "#475569", letterSpacing: "0.08em" }}
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
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
                  style={{
                    background: focused === name ? "rgba(30,41,59,0.9)" : "rgba(15,23,42,0.8)",
                    border: focused === name
                      ? "1px solid rgba(56,189,248,0.5)"
                      : "1px solid rgba(51,65,85,0.6)",
                    boxShadow: focused === name ? "0 0 0 3px rgba(56,189,248,0.07), inset 0 1px 0 rgba(255,255,255,0.03)" : "inset 0 1px 0 rgba(255,255,255,0.02)",
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
            </div>
          ))}

          {/* Password strength bar (decorative) */}
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => {
                const len = form.password.length;
                const filled = i === 1 ? len >= 1 : i === 2 ? len >= 5 : i === 3 ? len >= 8 : len >= 12;
                const color = i <= 2 ? "#f97316" : i === 3 ? "#facc15" : "#22c55e";
                return (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      background: filled ? color : "rgba(51,65,85,0.5)",
                      boxShadow: filled ? `0 0 6px ${color}55` : "none",
                    }}
                  />
                );
              })}
            </div>
            {form.password.length > 0 && (
              <p className="text-xs" style={{ color: "#475569" }}>
                {form.password.length < 5 ? "Weak" : form.password.length < 8 ? "Fair" : form.password.length < 12 ? "Good" : "Strong"} password
              </p>
            )}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer">
  <input
    type="checkbox"
    checked={accepted}
    onChange={() => setAccepted(!accepted)}
    className="mt-1 accent-cyan-400"
  />

  <span className="text-xs text-slate-400">
    I agree to Terms of Service and Privacy Policy
  </span>
</label>

          {/* Submit */}
          <button
            type="submit"
            className="relative w-full rounded-xl py-3.5 text-sm font-semibold text-white overflow-hidden transition-all duration-200 group"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #0284c7 100%)",
              boxShadow: "0 4px 20px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 6px 28px rgba(37,99,235,0.5), inset 0 1px 0 rgba(255,255,255,0.15)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Create Free Account
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(51,65,85,0.5)" }} />
            <span className="text-xs" style={{ color: "#334155" }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: "rgba(51,65,85,0.5)" }} />
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {["Google", "GitHub"].map((provider) => (
              <button
                key={provider}
                type="button"
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
                    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                    <path fill="#4A90E2" d="M19.834192,20.9995801 C21.9611571,19.0703608 23.2727273,16.2446333 23.2727273,12 C23.2727273,11.2909091 23.1818182,10.5272727 23.0454545,9.81818182 L12,9.81818182 L12,14.4545455 L18.1818182,14.4545455 C17.8989899,15.9222222 17.0377249,17.0722222 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                )}
                {provider}
              </button>
            ))}
          </div>
        </form>

        {/* Bottom footer */}
        <p className="mt-8 text-center text-xs" style={{ color: "#1e293b" }}>
          🔒 256-bit encrypted · SOC 2 certified · GDPR compliant
        </p>
      </div>
    </div>
  );
};

export default Signup;