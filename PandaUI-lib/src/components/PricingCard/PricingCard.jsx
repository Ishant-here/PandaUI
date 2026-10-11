import React, { useState } from "react";

export const PricingCard = ({
  tier = "Pro",
  description = "Perfect for growing teams and startups.",
  monthlyPrice = 29,
  yearlyPrice = 24,
  currency = "$",
  badge = "Recommended",
  features = ["Unlimited projects", "Priority support", "Advanced analytics", "Custom integrations", "Team collaboration"],
  ctaText = "Start Free Trial",
  accent = "#6366f1",
  bg = "#0f172a",
  highlight = false,
  onCtaClick = () => {}
}) => {
  const [isYearly, setIsYearly] = useState(true);
  const price = isYearly ? yearlyPrice : monthlyPrice;
  
  const alpha = (hex, op) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return "rgba(" + r + "," + g + "," + b + "," + op + ")";
  };

  return (
    <div
      style={{
        background: bg,
        borderRadius: "20px",
        padding: "30px 26px",
        width: "320px",
        color: "#fff",
        fontFamily: "system-ui,sans-serif",
        boxShadow: highlight ? "0 20px 60px rgba(99,102,241,0.35)" : "0 10px 40px rgba(0,0,0,0.4)",
        border: highlight ? "1px solid " + alpha(accent, 0.4) : "1px solid rgba(255,255,255,0.08)",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease"
      }}
    >
      {highlight && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, " + accent + ", #a78bfa)" }} />
      )}
      <div style={{ position: "relative", zIndex: 2 }}>
        {badge && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 13px", borderRadius: "100px", marginBottom: "14px", background: highlight ? alpha(accent, 0.2) : alpha(accent, 0.08), border: "1px solid " + alpha(accent, highlight ? 0.4 : 0.25), fontSize: "10.5px", fontWeight: "700", color: highlight ? accent : alpha(accent, 0.8), textTransform: "uppercase", letterSpacing: "0.6px" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent, boxShadow: "0 0 8px " + alpha(accent, 0.6) }} />
            {badge}
          </div>
        )}
        <div style={{ fontSize: "14px", fontWeight: "600", color: alpha("#fff", 0.5), textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Monthly</div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: isYearly ? accent : alpha("#fff", 0.5), cursor: "pointer", transition: "color 0.2s" }} onClick={() => setIsYearly(true)}>Monthly</div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", margin: "14px 0" }}>
          <div style={{ width: "40px", height: "3px", borderRadius: "2px", background: isYearly ? accent : alpha("#fff", 0.15) }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: isYearly ? alpha("#fff", 0.2) : alpha(accent, 0.8), border: "2px solid " + accent, transition: "background 0.25s ease, transform 0.25s ease", transform: isYearly ? "translateX(26px)" : "translateX(0)" }} />
          <div style={{ width: "40px", height: "3px", borderRadius: "2px", background: !isYearly ? accent : alpha("#fff", 0.15) }} />
        </div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: !isYearly ? accent : alpha("#fff", 0.5), cursor: "pointer", transition: "color 0.2s" }} onClick={() => setIsYearly(false)}>Yearly</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "3px", margin: "8px 0 4px" }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: alpha("#fff", 0.5) }}>{currency}</span>
          <span style={{ fontSize: "48px", fontWeight: "800", lineHeight: 1 }}>{price}</span>
        </div>
        <div style={{ fontSize: "13px", color: alpha("#fff", 0.35), marginBottom: "20px" }}>{isYearly ? "per month, billed yearly" : "per month, billed monthly"}</div>
        <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "18px" }} />
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: "11px", fontSize: "13px", color: alpha("#fff", 0.78) }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", background: alpha(accent, 0.15), border: "1px solid " + alpha(accent, 0.35), flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={highlight ? accent : "#fff"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6.5 5,9.5 10,2.5" style={{ transformOrigin: "center", transform: "translateY(1px)" }} /></svg>
              </div>
              {f}
            </li>
          ))}
        </ul>
        <button
          onClick={onCtaClick}
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: "12px",
            border: "none",
            background: highlight ? "linear-gradient(135deg, " + accent + ", #8b5cf6)" : "linear-gradient(135deg, " + accent + ", " + alpha(accent, 0.7) + ")",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            fontFamily: "system-ui,sans-serif",
            boxShadow: highlight ? "0 6px 20px " + alpha(accent, 0.45) : "0 4px 14px rgba(0,0,0,0.3)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            transform: "translateY(0)"
          }}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
};
