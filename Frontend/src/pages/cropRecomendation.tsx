import { useState, useEffect, CSSProperties } from "react";
import {
  Leaf, Droplets, Thermometer, Cloud, FlaskConical,
  Sprout, Trophy, Search, Bell, Zap,
} from "lucide-react";

/* ───────────────────────────── CONFIG ───────────────────────────── */

const PARAMETERS = [
  { key: "nitrogen", label: "Nitrogen (N)", icon: FlaskConical, unit: "mg/kg", placeholder: "90" },
  { key: "phosphorus", label: "Phosphorus (P)", icon: FlaskConical, unit: "mg/kg", placeholder: "42" },
  { key: "potassium", label: "Potassium (K)", icon: FlaskConical, unit: "mg/kg", placeholder: "43" },
  { key: "temperature", label: "Temperature", icon: Thermometer, unit: "°C", placeholder: "25.5" },
  { key: "humidity", label: "Humidity", icon: Droplets, unit: "%", placeholder: "72" },
  { key: "ph", label: "pH Level", icon: Leaf, unit: "", placeholder: "6.5" },
  { key: "rainfall", label: "Rainfall", icon: Cloud, unit: "mm", placeholder: "180" },
] as const;

const MOCK_CROPS = [
  { name: "Rice", confidence: 94.2, desc: "Ideal for high humidity and warm temperatures" },
  { name: "Jute", confidence: 87.6, desc: "Thrives in similar soil nutrient conditions" },
  { name: "Coconut", confidence: 81.3, desc: "Suitable rainfall and pH range detected" },
];

const RESULT_COLORS = ["#10b981", "#f59e0b", "#3b82f6"];

/* ───────────────────────────── STYLES ───────────────────────────── */

const THEME = {
  bg: "#0c111d",
  card: "#131a2b",
  border: "#1e2a3f",
  fg: "#e8edf5",
  fgMuted: "#6b7a94",
  primary: "#10b981",
  primaryDim: "rgba(16,185,129,0.15)",
  primaryBorder: "rgba(16,185,129,0.3)",
  secondary: "#182234",
  radius: "0.75rem",
};

const css = {
  page: {
    minHeight: "100vh",
    background: THEME.bg,
    color: THEME.fg,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative" as const,
    overflow: "hidden",
  },
  header: {
    borderBottom: `1px solid ${THEME.border}`,
    background: `${THEME.card}99`,
    backdropFilter: "blur(12px)",
    position: "sticky" as const,
    top: 0,
    zIndex: 20,
  },
  headerInner: {
    maxWidth: "72rem",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem 1.5rem",
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: "0.5rem",
    background: THEME.primaryDim,
    border: `1px solid ${THEME.primaryBorder}`,
  },
  main: {
    maxWidth: "72rem",
    margin: "0 auto",
    padding: "2rem 1.5rem",
    position: "relative" as const,
    zIndex: 10,
  },
  sectionLabel: {
    fontSize: "0.69rem",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    color: THEME.fgMuted,
    marginBottom: "0.75rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "0.75rem",
  },
  paramCard: (active: boolean): CSSProperties => ({
    borderRadius: THEME.radius,
    border: `1px solid ${active ? THEME.primaryBorder : THEME.border}`,
    background: `linear-gradient(135deg, ${THEME.secondary}, ${THEME.card})`,
    padding: "1rem",
    transition: "all 0.3s",
    boxShadow: active ? `0 0 20px -4px rgba(16,185,129,0.15)` : "none",
    animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
    opacity: 0,
  }),
  input: {
    width: "100%",
    background: "transparent",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: THEME.fg,
    outline: "none",
    border: "none",
    MozAppearance: "textfield" as const,
  },
  bar: (filled: boolean, color?: string): CSSProperties => ({
    marginTop: "0.75rem",
    height: 4,
    borderRadius: 999,
    background: THEME.border,
    overflow: "hidden",
    position: "relative" as const,
  }),
  barFill: (pct: string, color: string, delay: string): CSSProperties => ({
    height: "100%",
    borderRadius: 999,
    background: color,
    transition: `width 0.7s ease-out ${delay}`,
    width: pct,
  }),
  predictCard: (enabled: boolean): CSSProperties => ({
    borderRadius: THEME.radius,
    border: `1px dashed ${THEME.primaryBorder}`,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    cursor: enabled ? "pointer" : "default",
    transition: "all 0.3s",
    animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
    opacity: 0,
  }),
  resultCard: (color: string, show: boolean): CSSProperties => ({
    borderRadius: THEME.radius,
    border: `1px solid ${THEME.border}`,
    background: `linear-gradient(135deg, ${color}20, transparent)`,
    padding: "1.25rem",
    transition: "all 0.5s",
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
  }),
  summaryRow: {
    marginTop: "1rem",
    borderRadius: THEME.radius,
    border: `1px solid ${THEME.border}`,
    background: THEME.card,
    padding: "1rem",
  },
};

/* ───────────────────────────── KEYFRAMES ───────────────────────────── */

const keyframesStyle = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); filter: blur(4px); }
  to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.3; box-shadow: 0 0 0 0 rgba(16,185,129,0); }
  50%      { opacity: 0.7; box-shadow: 0 0 24px 4px rgba(16,185,129,0.15); }
}
@keyframes spin { to { transform: rotate(360deg); } }
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; }
`;

/* ───────────────────────────── FLOATING DOT ───────────────────────────── */

function FloatingDot({ style }: { style?: CSSProperties }) {
  return (
    <span
      style={{
        position: "absolute",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: `${THEME.primary}66`,
        animation: "pulseGlow 2.5s ease-in-out infinite",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

/* ───────────────────────────── COMPONENT ───────────────────────────── */

export default function CropRecommendation() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<typeof MOCK_CROPS | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (key: string, val: string) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const allFilled = PARAMETERS.every((p) => values[p.key]?.trim());

  const handlePredict = async () => {
  setLoading(true);

  try {
    const response = await fetch("https://irrigo3-0-1.onrender.com/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        N: Number(values.nitrogen),
        P: Number(values.phosphorus),
        K: Number(values.potassium),
        temperature: Number(values.temperature),
        humidity: Number(values.humidity),
        ph: Number(values.ph),
        rainfall: Number(values.rainfall),
      }),
    });

    const data = await response.json();

    // convert API response to your UI format
    const formattedResults = data.top3_recommendations.map((crop, index) => ({
      name: crop,
      confidence: index === 0 ? data.confidence : (data.confidence - (index * 5)).toFixed(2),
      desc: "Recommended based on current soil conditions",
    }));

    setResults(formattedResults);
  } catch (error) {
    console.error("Error:", error);
    alert("Error connecting to AI model");
  }

  setLoading(false);
};

  useEffect(() => {
    if (results && !loading) {
      const t = setTimeout(() => setShowResults(true), 50);
      return () => clearTimeout(t);
    }
  }, [results, loading]);

  const handleReset = () => {
    setShowResults(false);
    setTimeout(() => {
      setValues({});
      setResults(null);
    }, 300);
  };

  return (
    <div style={css.page}>
      <style>{keyframesStyle}</style>

      {/* Floating dots */}
      <FloatingDot style={{ top: "15%", left: "8%" }} />
      <FloatingDot style={{ top: "30%", left: "3%", animationDelay: "1s" }} />
      <FloatingDot style={{ top: "55%", left: "12%", animationDelay: "0.5s" }} />
      <FloatingDot style={{ top: "75%", left: "6%", animationDelay: "1.5s" }} />
      <FloatingDot style={{ top: "20%", right: "5%", animationDelay: "0.7s" }} />
      <FloatingDot style={{ top: "60%", right: "8%", animationDelay: "1.2s" }} />

      {/* Header */}
      <header style={css.header}>
        <div style={css.headerInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={css.logoBox}>
              <Sprout size={20} color={THEME.primary} />
            </div>
            <div>
              <h1 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.05em", margin: 0 }}>
                IRRIGOAI
              </h1>
              <p style={{ fontSize: 10, color: THEME.fgMuted, textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
                Smart Crop Advisor
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ padding: 8, background: "none", border: "none", cursor: "pointer", borderRadius: 8 }}>
              <Bell size={16} color={THEME.fgMuted} />
            </button>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: THEME.primaryDim, border: `1px solid ${THEME.primaryBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: THEME.primary }}>U</span>
            </div>
          </div>
        </div>
      </header>

      <main style={css.main}>
        {/* Title */}
        <div style={{ marginBottom: 32, animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards", opacity: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Predict Best Crops</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 6, fontSize: 12, color: THEME.fgMuted }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Zap size={12} color={THEME.primary} /> 7 parameters
                </span>
                <span>Top 3 recommendations</span>
              </div>
            </div>
            {results && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, background: THEME.primaryDim, border: `1px solid ${THEME.primaryBorder}` }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: THEME.primary, animation: "pulseGlow 2s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: THEME.primary }}>Results Ready</span>
              </div>
            )}
          </div>
        </div>

        {/* Parameter grid */}
        <section>
          <p style={css.sectionLabel}>Soil & Climate Parameters</p>
          <div style={css.grid}>
            {PARAMETERS.map((param, i) => {
              const Icon = param.icon;
              const hasValue = !!values[param.key]?.trim();
              return (
                <div key={param.key} style={{ ...css.paramCard(hasValue), animationDelay: `${100 + i * 50}ms` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon size={14} color={THEME.primary} />
                      <span style={{ fontSize: 11, fontWeight: 500, color: THEME.primary }}>{param.label}</span>
                    </div>
                    {hasValue && (
                      <span style={{ fontSize: 9, fontWeight: 500, color: `${THEME.primary}b3`, display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: THEME.primary }} /> Set
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <input
                      type="number"
                      step="any"
                      placeholder={param.placeholder}
                      value={values[param.key] || ""}
                      onChange={(e) => handleChange(param.key, e.target.value)}
                      style={css.input}
                    />
                    {param.unit && <span style={{ fontSize: 14, color: THEME.fgMuted, flexShrink: 0 }}>{param.unit}</span>}
                  </div>
                  <div style={css.bar(hasValue)}>
                    <div style={css.barFill(hasValue ? "100%" : "0%", THEME.primary, "0ms")} />
                  </div>
                </div>
              );
            })}

            {/* Predict button card */}
            <div
              style={{ ...css.predictCard(allFilled && !loading), animationDelay: `${100 + 7 * 50}ms` }}
              onClick={allFilled && !loading ? handlePredict : undefined}
              onMouseEnter={(e) => { if (allFilled) (e.currentTarget.style.background = `${THEME.primary}0d`); }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {loading ? (
                <>
                  <span style={{ width: 32, height: 32, border: `2px solid ${THEME.primaryBorder}`, borderTop: `2px solid ${THEME.primary}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 8 }} />
                  <span style={{ fontSize: 12, color: THEME.primary, fontWeight: 500 }}>Analyzing...</span>
                </>
              ) : (
                <>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: THEME.primaryDim, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                    <Sprout size={20} color={THEME.primary} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: allFilled ? THEME.primary : THEME.fgMuted }}>
                    {allFilled ? "Run Prediction" : "Fill all fields"}
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Results */}
        {results && (
          <section style={{ marginTop: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, transition: "all 0.5s", opacity: showResults ? 1 : 0, transform: showResults ? "translateY(0)" : "translateY(12px)" }}>
              <Trophy size={16} color={RESULT_COLORS[1]} />
              <p style={css.sectionLabel}>Top 3 Recommended Crops</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {results.map((crop, i) => (
                <div key={crop.name} style={{ ...css.resultCard(RESULT_COLORS[i], showResults), transitionDelay: showResults ? `${i * 100}ms` : "0ms" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: RESULT_COLORS[i] }}>
                      #{i + 1} Pick
                    </span>
                    <span style={{ fontSize: 10, color: THEME.fgMuted, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: RESULT_COLORS[i] }} /> Match
                    </span>
                  </div>
                  <h3 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 4px 0" }}>{crop.name}</h3>
                  <p style={{ fontSize: 12, color: THEME.fgMuted, margin: "0 0 16px 0", lineHeight: 1.5 }}>{crop.desc}</p>
                  <span style={{ fontSize: 24, fontWeight: 700, color: RESULT_COLORS[i] }}>
                    {crop.confidence}<span style={{ fontSize: 14, marginLeft: 2 }}>%</span>
                  </span>
                  <div style={css.bar(true)}>
                    <div style={css.barFill(showResults ? `${crop.confidence}%` : "0%", RESULT_COLORS[i], showResults ? `${300 + i * 100}ms` : "0ms")} />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ ...css.summaryRow, transition: "all 0.5s", opacity: showResults ? 1 : 0, transform: showResults ? "translateY(0)" : "translateY(12px)", transitionDelay: showResults ? "400ms" : "0ms" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: THEME.fgMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Prediction Summary</span>
                <button
                  onClick={handleReset}
                  style={{ fontSize: 12, color: THEME.primary, fontWeight: 500, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  Reset & Try Again
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 12 }}>
                {results.map((crop, i) => (
                  <div key={crop.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: RESULT_COLORS[i] }} />
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{crop.name}</span>
                    <span style={{ fontSize: 12, color: THEME.fgMuted, marginLeft: "auto", fontVariantNumeric: "tabular-nums" }}>{crop.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
