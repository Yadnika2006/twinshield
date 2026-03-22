"use client";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a1628",
        color: "#00d4ff",
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <div style={{ fontSize: "3rem", color: "#60a5fa" }}>⬡</div>
        <div
          style={{
            fontSize: "0.8rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          Loading...
        </div>
        <div
          style={{
            width: "12rem",
            height: "0.25rem",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="ts-loading-bar" />
        </div>
      </div>

      <style jsx>{`
        @keyframes ts-loading-bar {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .ts-loading-bar {
          position: absolute;
          inset-block: 0;
          left: 0;
          width: 33%;
          background: #3b82f6;
          animation: ts-loading-bar 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
}
