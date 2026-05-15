import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../api/api";
import { useCurrency } from "../context/CurrencyContext";

const FREQUENCIES = [
  {
    value: "DAILY",
    label: "Daily",
    description: "Every day",
  },
  {
    value: "WEEKLY",
    label: "Weekly",
    description: "Once a week",
  },
  {
    value: "MONTHLY",
    label: "Monthly",
    description: "Once a month",
  },
];

const RecurringPayment = () => {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const currencySymbol = useMemo(() => {
    const parts = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).formatToParts(0);

    return parts.find((part) => part.type === "currency")?.value ?? "$";
  }, [currency]);

  const formattedAmount = useMemo(() => {
    const parsed = Number(amount);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(0);
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(parsed);
  }, [amount, currency]);

  const selectedFrequency =
    FREQUENCIES.find((item) => item.value === frequency) ?? FREQUENCIES[2];

  const validate = () => {
    const nextErrors = {};
    const trimmedEmail = receiverEmail.trim();
    const parsedAmount = Number(amount);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      nextErrors.receiverEmail = "Recipient email is required.";
    } else if (!emailRegex.test(trimmedEmail)) {
      nextErrors.receiverEmail = "Enter a valid email address.";
    }

    if (!amount) {
      nextErrors.amount = "Amount is required.";
    } else if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = "Amount must be greater than 0.";
    } else if (parsedAmount > 1_000_000) {
      nextErrors.amount = "Maximum recurring amount is 1,000,000.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate() || loading) return;

    setLoading(true);

    try {
      const response = await API.post("/recurring/create", {
        receiverEmail: receiverEmail.trim(),
        amount: Number(amount),
        frequency,
      });

      const message =
        response?.data?.message ||
        response?.data ||
        "Recurring payment created.";

      toast.success(
        typeof message === "string" ? message : "Recurring payment created."
      );
      setReceiverEmail("");
      setAmount("");
      setFrequency("MONTHLY");
      setErrors({});
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to create recurring payment.";

      toast.error(
        typeof message === "string"
          ? message
          : "Failed to create recurring payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 space-y-6">
      <div
        className="fixed right-0 top-0 h-[420px] w-[420px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#1e3a5f", letterSpacing: "0.12em" }}
            >
              Payments
            </span>
            <div
              className="h-px w-16"
              style={{ background: "rgba(30,41,59,0.8)" }}
            />
          </div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            Recurring payments
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: "#475569" }}>
            Schedule automatic transfers without leaving your wallet flow.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200"
          style={{
            background: "rgba(15,23,42,0.72)",
            border: "1px solid rgba(51,65,85,0.55)",
            color: "#94a3b8",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.color = "#e2e8f0";
            event.currentTarget.style.borderColor = "rgba(56,189,248,0.28)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.color = "#94a3b8";
            event.currentTarget.style.borderColor = "rgba(51,65,85,0.55)";
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{
            background:
              "linear-gradient(145deg, rgba(15,23,42,0.92), rgba(10,16,32,0.98))",
            border: "1px solid rgba(148,163,184,0.08)",
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="absolute left-8 right-8 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(56,189,248,0.35), transparent)",
            }}
          />

          <div className="mb-6 flex items-start gap-4">
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.28)",
                color: "#a78bfa",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <path d="M21 3v6h-6" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>

            <div>
              <h2
                className="text-lg font-bold text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                Create a schedule
              </h2>
              <p className="text-sm" style={{ color: "#475569" }}>
                Set the recipient, amount, and transfer cadence.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="receiverEmail"
                className="mb-2 block text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#475569", letterSpacing: "0.1em" }}
              >
                Recipient email
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "#334155" }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </span>
                <input
                  id="receiverEmail"
                  type="email"
                  placeholder="recipient@example.com"
                  value={receiverEmail}
                  onChange={(event) => {
                    setReceiverEmail(event.target.value);
                    clearError("receiverEmail");
                  }}
                  disabled={loading}
                  className="w-full rounded-xl py-3 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 disabled:opacity-60"
                  style={{
                    paddingLeft: "2.75rem",
                    background: "rgba(15,23,42,0.76)",
                    border: errors.receiverEmail
                      ? "1px solid rgba(239,68,68,0.5)"
                      : "1px solid rgba(51,65,85,0.6)",
                    boxShadow: errors.receiverEmail
                      ? "0 0 0 3px rgba(239,68,68,0.07)"
                      : "inset 0 1px 0 rgba(255,255,255,0.02)",
                  }}
                />
              </div>
              {errors.receiverEmail && (
                <p className="mt-2 text-xs" style={{ color: "#f87171" }}>
                  {errors.receiverEmail}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#475569", letterSpacing: "0.1em" }}
              >
                Amount
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                  style={{ color: "#475569" }}
                >
                  {currencySymbol}
                </span>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    clearError("amount");
                  }}
                  disabled={loading}
                  className="w-full rounded-xl py-3 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 disabled:opacity-60"
                  style={{
                    paddingLeft: "2.25rem",
                    background: "rgba(15,23,42,0.76)",
                    border: errors.amount
                      ? "1px solid rgba(239,68,68,0.5)"
                      : "1px solid rgba(51,65,85,0.6)",
                    boxShadow: errors.amount
                      ? "0 0 0 3px rgba(239,68,68,0.07)"
                      : "inset 0 1px 0 rgba(255,255,255,0.02)",
                  }}
                />
              </div>
              {errors.amount && (
                <p className="mt-2 text-xs" style={{ color: "#f87171" }}>
                  {errors.amount}
                </p>
              )}
            </div>

            <div>
              <p
                className="mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#475569", letterSpacing: "0.1em" }}
              >
                Frequency
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {FREQUENCIES.map((item) => {
                  const isActive = frequency === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      disabled={loading}
                      onClick={() => setFrequency(item.value)}
                      className="rounded-xl px-4 py-3 text-left transition-all duration-200 disabled:opacity-60"
                      style={{
                        background: isActive
                          ? "rgba(139,92,246,0.16)"
                          : "rgba(15,23,42,0.66)",
                        border: isActive
                          ? "1px solid rgba(139,92,246,0.42)"
                          : "1px solid rgba(51,65,85,0.48)",
                        boxShadow: isActive
                          ? "0 0 0 3px rgba(139,92,246,0.06)"
                          : "none",
                      }}
                    >
                      <span
                        className="block text-sm font-semibold"
                        style={{ color: isActive ? "#c4b5fd" : "#e2e8f0" }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="mt-1 block text-xs"
                        style={{ color: "#475569" }}
                      >
                        {item.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs" style={{ color: "#475569" }}>
              Your schedule is created securely through your PayFlow account.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              style={{
                background: "rgba(255,255,255,0.96)",
                color: "#0f172a",
                border: "1px solid rgba(255,255,255,0.85)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
              }}
            >
              {loading ? (
                <>
                  <span
                    className="h-4 w-4 rounded-full border-2 border-slate-400 border-t-slate-900 animate-spin"
                    aria-hidden="true"
                  />
                  Creating
                </>
              ) : (
                <>
                  Create schedule
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
            </button>
          </div>
        </form>

        <aside
          className="relative overflow-hidden rounded-2xl p-6"
          style={{
            background:
              "linear-gradient(135deg, #1e3a5f 0%, #0f2540 42%, #0a1a30 100%)",
            border: "1px solid rgba(56,189,248,0.2)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.38), 0 0 0 1px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="absolute left-8 right-8 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(56,189,248,0.5), rgba(139,92,246,0.45), transparent)",
            }}
          />

          <div className="relative z-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#38bdf8aa", letterSpacing: "0.12em" }}
                >
                  Schedule preview
                </p>
                <h2
                  className="text-3xl font-bold text-white"
                  style={{ letterSpacing: "-0.04em", lineHeight: 1 }}
                >
                  {formattedAmount}
                </h2>
              </div>
              <span
                className="rounded-md px-2 py-1 text-xs font-semibold"
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.18)",
                  color: "#22c55e",
                }}
              >
                Ready
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Recipient",
                  value: receiverEmail.trim() || "Not selected",
                },
                {
                  label: "Frequency",
                  value: selectedFrequency.label,
                },
                {
                  label: "Timing",
                  value: selectedFrequency.description,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                  style={{ borderColor: "rgba(148,163,184,0.12)" }}
                >
                  <span className="text-sm" style={{ color: "#64748b" }}>
                    {item.label}
                  </span>
                  <span className="truncate text-right text-sm font-semibold text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="mt-8 rounded-xl px-4 py-3"
              style={{
                background: "rgba(10,16,32,0.42)",
                border: "1px solid rgba(56,189,248,0.14)",
              }}
            >
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    background: "rgba(56,189,248,0.12)",
                    color: "#38bdf8",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white">
                  Protected transfer
                </p>
              </div>
              <p className="text-xs leading-5" style={{ color: "#64748b" }}>
                Recurring transfers use the same protected wallet session as
                the rest of your PayFlow account.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RecurringPayment;
