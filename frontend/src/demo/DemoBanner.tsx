// src/demo/DemoBanner.tsx
// Show this banner at the top of the app when in demo mode.
// It signals to visitors they're in a safe sandbox and nudges them to sign up.

import React from "react";

type DemoBannerProps = {
  onSignUp?: () => void;
};

export function DemoBanner({ onSignUp }: DemoBannerProps) {
  return (
    <div
      style={{
        background: "#1a1a2e",
        borderBottom: "1px solid #2e2e4a",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "14px",
        color: "#a0a0c0",
      }}
    >
      <span>
        <strong style={{ color: "#c084fc", marginRight: 8 }}>DEMO MODE</strong>
        You're exploring Luma with sample data. Nothing you write here is saved.
      </span>
      <button
        onClick={onSignUp}
        style={{
          background: "#c084fc",
          color: "#0f0f1a",
          border: "none",
          borderRadius: "6px",
          padding: "6px 14px",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "13px",
          whiteSpace: "nowrap",
        }}
      >
        Create a free account →
      </button>
    </div>
  );
}
