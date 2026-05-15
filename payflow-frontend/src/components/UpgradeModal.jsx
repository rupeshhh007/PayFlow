import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useCurrency } from "../context/CurrencyContext";

const PRICES = {
  monthly: {
    USD: 12,
    INR: 999,
    EUR: 11,
    GBP: 10,
  },
  yearly: {
    USD: 96,
    INR: 7999,
    EUR: 88,
    GBP: 80,
  },
};

const FEATURES = [
  "Higher wallet and transfer limits",
  "Advanced analytics views",
  "Recurring payment controls",
  "Priority support queue",
];

const BILLING_OPTIONS = [
  {
    id: "monthly",
    label: "Monthly",
    sub: "Flexible billing",
  },
  {
    id: "yearly",
    label: "Yearly",
    sub: "Best value",
  },
];

const UpgradeModal = ({ open, currentPlan, onClose, onUpgrade }) => {
  const { currency } = useCurrency();
  const [billingCycle, setBillingCycle] = useState(
    currentPlan?.billingCycle || "monthly"
  );
  const [loading, setLoading] = useState(false);

  const isPro = currentPlan?.tier === "pro";

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  const price = PRICES[billingCycle][currency] ?? PRICES[billingCycle].USD;

  const priceLabel = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(price),
    [currency, price]
  );

  const periodLabel = billingCycle === "yearly" ? "/year" : "/month";
  const savingsLabel = billingCycle === "yearly" ? "Save 33%" : "Cancel anytime";

  const handleUpgrade = async () => {
    if (loading) return;

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));

    onUpgrade({
      tier: "pro",
      billingCycle,
      upgradedAt:
        currentPlan?.tier === "pro" && currentPlan.upgradedAt
          ? currentPlan.upgradedAt
          : new Date().toISOString(),
    });

    toast.success(isPro ? "Pro plan updated." : "PayFlow Pro activated.");
    setLoading(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(10,16,32,1))",
          border: "1px solid rgba(148,163,184,0.1)",
          boxShadow:
            "0 25px 70px rgba(0,0,0,0.68), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="absolute left-8 right-8 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(56,189,248,0.55), rgba(139,92,246,0.5), transparent)",
          }}
        />

        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
          style={{
            background: "rgba(30,41,59,0.65)",
            border: "1px solid rgba(51,65,85,0.55)",
            color: "#64748b",
          }}
          aria-label="Close upgrade modal"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.25fr]">
          <section
            className="relative overflow-hidden p-7 lg:p-8"
            style={{
              background:
                "linear-gradient(135deg, rgba(30,58,95,0.78), rgba(15,37,64,0.68), rgba(10,26,48,0.88))",
              borderRight: "1px solid rgba(51,65,85,0.42)",
            }}
          >
            <div
              className="absolute right-[-90px] top-[-100px] h-64 w-64 rounded-full opacity-20 pointer-events-none"
              style={{
                background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />

            <div className="relative z-10">
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(56,189,248,0.14)",
                  border: "1px solid rgba(56,189,248,0.26)",
                  color: "#38bdf8",
                }}
              >
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2 15 8l6 .9-4.5 4.3 1.1 6.1L12 16.3 6.4 19.3l1.1-6.1L3 8.9 9 8l3-6Z" />
                </svg>
              </div>

              <p
                className="mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#38bdf8aa", letterSpacing: "0.12em" }}
              >
                PayFlow Pro
              </p>
              <h2
                className="mb-3 text-3xl font-bold text-white"
                style={{ letterSpacing: "-0.04em", lineHeight: 1.05 }}
              >
                Upgrade your wallet workspace
              </h2>
              <p className="text-sm leading-6" style={{ color: "#94a3b8" }}>
                Add higher limits, better insights, and recurring payment tools
                in one clean plan.
              </p>

              <div className="mt-7 space-y-3">
                {FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <span
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: "rgba(34,197,94,0.12)",
                        color: "#22c55e",
                      }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                      >
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="p-7 lg:p-8">
            <div className="mb-6 pr-10">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3
                  className="text-xl font-bold text-white"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {isPro ? "Manage Pro" : "Choose your plan"}
                </h3>
                {isPro && (
                  <span
                    className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.18)",
                      color: "#22c55e",
                    }}
                  >
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ color: "#64748b" }}>
                This is a demo upgrade flow. It activates Pro locally for this
                PayFlow account.
              </p>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {BILLING_OPTIONS.map((option) => {
                const selected = billingCycle === option.id;
                const optionPrice =
                  PRICES[option.id][currency] ?? PRICES[option.id].USD;
                const optionPriceLabel = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency,
                  maximumFractionDigits: 0,
                }).format(optionPrice);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setBillingCycle(option.id)}
                    className="rounded-xl p-4 text-left transition-all duration-200"
                    style={{
                      background: selected
                        ? "rgba(56,189,248,0.1)"
                        : "rgba(15,23,42,0.68)",
                      border: selected
                        ? "1px solid rgba(56,189,248,0.32)"
                        : "1px solid rgba(51,65,85,0.48)",
                      boxShadow: selected
                        ? "0 0 0 3px rgba(56,189,248,0.05)"
                        : "none",
                    }}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {option.label}
                        </p>
                        <p className="mt-0.5 text-xs" style={{ color: "#475569" }}>
                          {option.sub}
                        </p>
                      </div>
                      <span
                        className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full"
                        style={{
                          border: selected
                            ? "1px solid rgba(56,189,248,0.6)"
                            : "1px solid rgba(71,85,105,0.7)",
                          background: selected
                            ? "rgba(56,189,248,0.16)"
                            : "transparent",
                        }}
                      >
                        {selected && (
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: "#38bdf8" }}
                          />
                        )}
                      </span>
                    </div>
                    <p
                      className="text-2xl font-bold text-white"
                      style={{ letterSpacing: "-0.04em" }}
                    >
                      {optionPriceLabel}
                    </p>
                  </button>
                );
              })}
            </div>

            <div
              className="mb-5 rounded-2xl p-5"
              style={{
                background:
                  "linear-gradient(145deg, rgba(15,23,42,0.76), rgba(10,16,32,0.92))",
                border: "1px solid rgba(51,65,85,0.48)",
              }}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Pro access
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "#475569" }}>
                    Demo billing, no real payment is charged.
                  </p>
                </div>
                <span
                  className="rounded-lg px-2 py-1 text-xs font-semibold"
                  style={{
                    background: "rgba(139,92,246,0.12)",
                    color: "#c4b5fd",
                    border: "1px solid rgba(139,92,246,0.22)",
                  }}
                >
                  {savingsLabel}
                </span>
              </div>

              <div className="flex items-end gap-2">
                <span
                  className="text-4xl font-bold text-white"
                  style={{ letterSpacing: "-0.05em", lineHeight: 1 }}
                >
                  {priceLabel}
                </span>
                <span className="pb-1 text-sm" style={{ color: "#64748b" }}>
                  {periodLabel}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200"
                style={{
                  background: "rgba(15,23,42,0.7)",
                  border: "1px solid rgba(51,65,85,0.55)",
                  color: "#94a3b8",
                }}
              >
                Maybe later
              </button>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "rgba(255,255,255,0.96)",
                  border: "1px solid rgba(255,255,255,0.85)",
                  color: "#0f172a",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.24)",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="h-4 w-4 rounded-full border-2 border-slate-400 border-t-slate-900 animate-spin"
                      aria-hidden="true"
                    />
                    Saving
                  </>
                ) : (
                  <>
                    {isPro ? "Save plan" : "Activate Pro"}
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
          </section>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
