"use client";

import { useRef, useEffect } from "react";

interface SOCPanelProps {
    sessionId?: string;
}

export default function SOCPanel({ sessionId }: SOCPanelProps) {
    const mentorAIFeedRef = useRef<HTMLDivElement>(null);
    const guardianFeedRef = useRef<HTMLDivElement>(null);

    // Mock data for MentorAI
    const mentorAIMessages = [
        { time: "00:02", text: "Session started. Watch this attack carefully — I will explain each step as it happens." },
        { time: "00:05", text: "The attacker is scanning for open ports. This is called reconnaissance — the first phase of any attack." },
    ];

    // Mock data for GuardianAI
    const guardianAlerts = [
        { time: "00:00", level: "INFO", color: "#00d4ff", text: "Session started. Monitoring active." },
        { time: "00:03", level: "MEDIUM", color: "#ffcc00", text: "Port scan detected from terminal" },
        { time: "00:07", level: "HIGH", color: "#ff8800", text: "SQLi pattern detected in request" },
        { time: "00:11", level: "CRITICAL", color: "#ff4444", text: "Auth bypass successful — logging" },
    ];

    // Scroll both feeds to bottom
    useEffect(() => {
        if (mentorAIFeedRef.current) {
            mentorAIFeedRef.current.scrollTop = mentorAIFeedRef.current.scrollHeight;
        }
        if (guardianFeedRef.current) {
            guardianFeedRef.current.scrollTop = guardianFeedRef.current.scrollHeight;
        }
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                background: "#091a2e",
                fontFamily: "'Share Tech Mono', monospace",
            }}
        >
            {/* =========================================================
          TOP HALF — MENTORAI CARD
      ========================================================= */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    borderBottom: "1px solid rgba(0, 212, 255, 0.2)",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div style={{ padding: "10px", borderBottom: "1px solid rgba(187, 136, 255, 0.15)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ color: "#bb88ff", fontSize: "0.8rem", fontWeight: "bold", letterSpacing: "1px" }}>
                            🧠 MENTORAI
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span className="pulse-purple" style={{
                                width: "6px", height: "6px", borderRadius: "50%", background: "#bb88ff", boxShadow: "0 0 6px #bb88ff"
                            }}></span>
                            <span style={{ color: "#bb88ff", fontSize: "0.6rem" }}>ACTIVE</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.6rem", color: "rgba(200, 230, 240, 0.5)", letterSpacing: "1px" }}>
                            CYBERSECURITY EDUCATOR
                        </span>
                        <span style={{ fontSize: "0.55rem", padding: "2px 6px", border: "1px solid rgba(187, 136, 255, 0.4)", color: "#bb88ff", borderRadius: "10px", backgroundColor: "rgba(187, 136, 255, 0.1)" }}>
                            CONTEXTUAL
                        </span>
                    </div>
                </div>

                {/* Chat Feed */}
                <div
                    ref={mentorAIFeedRef}
                    style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}
                >
                    {mentorAIMessages.map((msg, i) => (
                        <div key={i} style={{ borderLeft: "2px solid #bb88ff", paddingLeft: "8px", background: "rgba(187, 136, 255, 0.05)", padding: "8px", fontSize: "0.75rem", color: "#c8e6f0", lineHeight: 1.4 }}>
                            <div style={{ color: "#bb88ff", fontSize: "0.6rem", marginBottom: "4px" }}>[{msg.time}]</div>
                            <div>{msg.text}</div>
                        </div>
                    ))}
                </div>

                {/* Bottom Input Area */}
                <div style={{ padding: "8px", borderTop: "1px solid rgba(187, 136, 255, 0.15)", display: "flex", gap: "6px" }}>
                    <input
                        type="text"
                        placeholder="Ask MentorAI..."
                        style={{
                            flex: 1,
                            background: "rgba(0, 0, 0, 0.4)",
                            border: "1px solid rgba(187, 136, 255, 0.3)",
                            color: "#bb88ff",
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: "0.75rem",
                            padding: "6px 10px",
                            outline: "none",
                        }}
                    />
                    <button
                        style={{
                            background: "rgba(187, 136, 255, 0.15)",
                            border: "1px solid #bb88ff",
                            color: "#bb88ff",
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: "0.7rem",
                            padding: "0 12px",
                            cursor: "pointer",
                        }}
                    >
                        SEND
                    </button>
                </div>
            </div>

            {/* =========================================================
          BOTTOM HALF — GUARDIANAI CARD
      ========================================================= */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: "10px", borderBottom: "1px solid rgba(0, 255, 136, 0.15)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ color: "#00ff88", fontSize: "0.8rem", fontWeight: "bold", letterSpacing: "1px" }}>
                            🛡️ GUARDIANAI
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span className="pulse-green" style={{
                                width: "6px", height: "6px", borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 6px #00ff88"
                            }}></span>
                            <span style={{ color: "#00ff88", fontSize: "0.6rem" }}>MONITORING</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.6rem", color: "rgba(200, 230, 240, 0.5)", letterSpacing: "1px" }}>
                            SOC DEFENCE
                        </span>
                        <span style={{ fontSize: "0.55rem", padding: "2px 6px", border: "1px solid rgba(0, 255, 136, 0.4)", color: "#00ff88", borderRadius: "10px", backgroundColor: "rgba(0, 255, 136, 0.1)" }}>
                            SOC ANALYST
                        </span>
                    </div>
                </div>

                {/* Alert Feed */}
                <div
                    ref={guardianFeedRef}
                    style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "8px" }}
                >
                    {guardianAlerts.map((alert, i) => (
                        <div key={i} style={{
                            background: `${alert.color}15`,
                            border: `1px solid ${alert.color}40`,
                            borderLeft: `2px solid ${alert.color}`,
                            padding: "6px",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                                <span style={{
                                    fontSize: "0.55rem",
                                    padding: "2px 5px",
                                    background: `${alert.color}20`,
                                    color: alert.color,
                                    border: `1px solid ${alert.color}40`
                                }}>
                                    {alert.level}
                                </span>
                                <span style={{ fontSize: "0.55rem", color: "rgba(200, 230, 240, 0.4)" }}>[{alert.time}]</span>
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "#c8e6f0", lineHeight: 1.4 }}>
                                {alert.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Area */}
                <div style={{
                    padding: "8px 12px",
                    borderTop: "1px solid rgba(0, 255, 136, 0.15)",
                    fontSize: "0.65rem",
                    color: "#00ff88",
                    background: "rgba(0, 255, 136, 0.05)"
                }}>
                    ◈ ACTION: Logging attack pattern to SIEM
                </div>
            </div>

            <style>{`
        @keyframes pulsePurple {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes pulseGreen {
          0%, 100% { opacity: 1; transform: scale(1); text-shadow: 0 0 6px #00ff88; }
          50%      { opacity: 0.4; transform: scale(0.8); text-shadow: none; }
        }
        .pulse-purple { animation: pulsePurple 1.5s infinite; }
        .pulse-green { animation: pulseGreen 1.5s infinite; }

        /* Custom scrollbar for agent feeds */
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        div::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.3); border-radius: 2px; }
        div::-webkit-scrollbar-thumb:hover { background: rgba(0,212,255,0.5); }
      `}</style>
        </div>
    );
}
