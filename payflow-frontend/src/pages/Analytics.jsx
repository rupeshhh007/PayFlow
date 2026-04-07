import { useEffect, useState, useMemo } from "react";
import { getTransactions } from "../api/walletApi";
import { useCurrency } from "../context/CurrencyContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

// ❌ FIXED: fmt() was hardcoded to "USD" — now uses CurrencyContext
// ❌ FIXED: Removed debug `console.log("API RESPONSE:", res.data)` left in production code
// ❌ FIXED: Duplicate loading state comment block (appeared twice) — cleaned up

// ── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  deposit:  { stroke: "#22c55e", fill: "rgba(34,197,94,0.08)",  hex: "#22c55e" },
  sent:     { stroke: "#f87171", fill: "rgba(248,113,113,0.08)", hex: "#f87171" },
  received: { stroke: "#38bdf8", fill: "rgba(56,189,248,0.08)", hex: "#38bdf8" },
  bar:      "#3b82f6",
};

const PIE_PALETTE = ["#22c55e", "#f87171", "#38bdf8"];

const CARD_STYLE = {
  background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(10,16,32,0.95))",
  border: "1px solid rgba(148,163,184,0.08)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const shortDate = (iso) => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

const shortMonth = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric" });
};

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, fmt }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-xs"
      style={{
        background: "rgba(10,16,32,0.97)",
        border: "1px solid rgba(56,189,248,0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <p className="font-semibold mb-2" style={{ color: "#94a3b8" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span style={{ color: "#64748b" }}>{p.name}:</span>
          <span className="font-bold ml-auto pl-4" style={{ color: p.color }}>
            {fmt(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Custom Pie Label ──────────────────────────────────────────────────────────
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.04) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ── KPI Card ──────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, sub, accent, icon, trend }) => (
  <div
    className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden"
    style={{ ...CARD_STYLE, transition: "box-shadow 0.25s, transform 0.25s" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${accent}33, inset 0 1px 0 rgba(255,255,255,0.06)`;
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = CARD_STYLE.boxShadow;
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <div className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none"
      style={{ background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`, filter: "blur(16px)", transform: "translate(30%,-30%)" }}
    />
    <div className="absolute top-0 left-6 right-6 h-px"
      style={{ background: `linear-gradient(90deg, transparent, ${accent}55, transparent)` }}
    />

    <div className="flex items-center justify-between relative z-10">
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#334155", letterSpacing: "0.1em" }}>
        {label}
      </span>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}15`, border: `1px solid ${accent}28`, color: accent }}
      >
        {icon}
      </div>
    </div>

    <div className="relative z-10">
      <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
        {value}
      </p>
      {sub !== undefined && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <span
            className="text-xs font-semibold rounded-md px-1.5 py-0.5 flex items-center gap-0.5"
            style={{
              background: trend >= 0 ? "rgba(34,197,94,0.1)" : "rgba(248,113,113,0.1)",
              color: trend >= 0 ? "#22c55e" : "#f87171",
            }}
          >
            {trend >= 0 ? (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 15l-6-6-6 6" /></svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
            )}
            {sub}
          </span>
          <span className="text-xs" style={{ color: "#1e3a5f" }}>total activity</span>
        </div>
      )}
    </div>
  </div>
);

// ── Chart Card ────────────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, children, span = "" }) => (
  <div className={`rounded-2xl p-6 flex flex-col gap-5 ${span}`} style={CARD_STYLE}>
    <div>
      <h3 className="text-sm font-bold text-white" style={{ letterSpacing: "-0.02em" }}>{title}</h3>
      {subtitle && <p className="text-xs mt-0.5" style={{ color: "#334155" }}>{subtitle}</p>}
    </div>
    {children}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Analytics = () => {
  const { currency } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ❌ FIXED: currency from context instead of hardcoded "USD"
  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(n);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTransactions();
        // ❌ FIXED: removed console.log("API RESPONSE:", res.data)
        setTransactions(res.data);
      } catch (err) {
        console.error("Analytics load failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── KPI calculations ──────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    let deposited = 0, sent = 0, received = 0;
    for (const tx of transactions) {
      if (tx.type === "DEPOSIT")             deposited += tx.amount;
      else if (tx.type === "TRANSFER_SENT")  sent      += tx.amount;
      else if (tx.type === "TRANSFER_RECEIVED") received += tx.amount;
    }
    return { deposited, sent, received, net: deposited + received - sent };
  }, [transactions]);

  const cashFlowData = useMemo(() => {
    const map = {};
    for (const tx of transactions) {
      const day = shortDate(tx.createdAt);
      if (!map[day]) map[day] = { date: day, Deposits: 0, Sent: 0, Received: 0 };
      if (tx.type === "DEPOSIT")             map[day].Deposits  += tx.amount;
      else if (tx.type === "TRANSFER_SENT")  map[day].Sent      += tx.amount;
      else if (tx.type === "TRANSFER_RECEIVED") map[day].Received += tx.amount;
    }
    return Object.values(map).sort((a, b) => {
      const [am, ad] = a.date.split("/").map(Number);
      const [bm, bd] = b.date.split("/").map(Number);
      return am !== bm ? am - bm : ad - bd;
    });
  }, [transactions]);

  const pieData = useMemo(() => {
    const { deposited, sent, received } = kpis;
    const total = deposited + sent + received;
    if (!total) return [];
    return [
      { name: "Deposits", value: deposited },
      { name: "Sent",     value: sent      },
      { name: "Received", value: received  },
    ].filter((d) => d.value > 0);
  }, [kpis]);

  const barData = useMemo(() => {
    const map = {};
    for (const tx of transactions) {
      const day = shortMonth(tx.createdAt);
      map[day] = (map[day] || 0) + tx.amount;
    }
    return Object.entries(map)
      .map(([date, Total]) => ({ date, Total }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  const axisStyle = { fill: "#334155", fontSize: 11, fontFamily: "inherit" };
  const gridProps  = { stroke: "rgba(51,65,85,0.4)", strokeDasharray: "3 3" };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="flex items-center gap-3 text-white">
          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading analytics…
        </div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.12)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-white">No transaction data yet</p>
        <p className="text-xs" style={{ color: "#334155" }}>
          Make a deposit or transfer to start seeing analytics
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1e3a5f", letterSpacing: "0.12em" }}>
            Reporting
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(30,41,59,0.6)" }} />
        </div>
        <h1 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.03em" }}>
          Analytics
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
          Financial overview of your account
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Total Deposited" value={fmt(kpis.deposited)} sub={`${transactions.filter(t => t.type === "DEPOSIT").length} txns`}
          trend={1} accent="#22c55e"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
        />
        <KpiCard
          label="Total Sent" value={fmt(kpis.sent)} sub={`${transactions.filter(t => t.type === "TRANSFER_SENT").length} txns`}
          trend={-1} accent="#f87171"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>}
        />
        <KpiCard
          label="Total Received" value={fmt(kpis.received)} sub={`${transactions.filter(t => t.type === "TRANSFER_RECEIVED").length} txns`}
          trend={1} accent="#38bdf8"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>}
        />
        <KpiCard
          label="Net Flow" value={fmt(kpis.net)} sub="net position"
          trend={kpis.net >= 0 ? 1 : -1} accent={kpis.net >= 0 ? "#22c55e" : "#f87171"}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ChartCard title="Cash Flow Over Time" subtitle="Daily breakdown by transaction type" span="xl:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={cashFlowData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
              <Tooltip content={(props) => <ChartTooltip {...props} fmt={fmt} />} />
              <Line type="monotone" dataKey="Deposits"  stroke={COLORS.deposit.stroke}  strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Sent"      stroke={COLORS.sent.stroke}     strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Received"  stroke={COLORS.received.stroke} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 pt-2">
            {[["Deposits", COLORS.deposit.hex], ["Sent", COLORS.sent.hex], ["Received", COLORS.received.hex]].map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full" style={{ background: color }} />
                <span className="text-xs" style={{ color: "#475569" }}>{name}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Transaction Mix" subtitle="Distribution by type">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="value" labelLine={false} label={<PieLabel />}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0];
                  return (
                    <div className="rounded-xl px-3 py-2 text-xs"
                      style={{ background: "rgba(10,16,32,0.97)", border: "1px solid rgba(56,189,248,0.2)" }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: item.payload.fill || "#94a3b8" }} />
                        <span style={{ color: item.payload.fill || "#94a3b8" }} className="font-semibold">{item.name}</span>
                        <span className="ml-2 text-white font-bold">{fmt(item.value)}</span>
                      </div>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col gap-2">
            {pieData.map((entry, i) => {
              const total = pieData.reduce((s, d) => s + d.value, 0);
              const pct = total ? ((entry.value / total) * 100).toFixed(1) : 0;
              return (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_PALETTE[i] }} />
                    <span className="text-xs" style={{ color: "#475569" }}>{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{pct}%</span>
                    <span className="text-xs" style={{ color: "#334155" }}>{fmt(entry.value)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <ChartCard title="Daily Activity" subtitle="Total transaction volume per day">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barCategoryGap="35%">
            <CartesianGrid {...gridProps} vertical={false} />
            <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
            <Tooltip content={(props) => <ChartTooltip {...props} fmt={fmt} />} />
            <Bar dataKey="Total" radius={[5, 5, 0, 0]}>
              {barData.map((_, i) => (
                <Cell key={i} fill="url(#barGrad)" />
              ))}
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity={0.5} />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex items-center gap-6 pt-4" style={{ borderTop: "1px solid rgba(51,65,85,0.3)" }}>
          {[
            { label: "Peak Day",   value: barData.length ? fmt(Math.max(...barData.map((d) => d.Total))) : "—" },
            { label: "Avg / Day",  value: barData.length ? fmt(barData.reduce((s, d) => s + d.Total, 0) / barData.length) : "—" },
            { label: "Active Days", value: barData.length },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xs" style={{ color: "#334155" }}>{s.label}</p>
              <p className="text-sm font-bold text-white mt-0.5" style={{ letterSpacing: "-0.02em" }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default Analytics;