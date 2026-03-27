"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

// Scenario metadata for display names
const SCENARIO_META: Record<string, { name: string; type: string; diff: string; diffColor: string }> = {
    "phish-01":   { name: "PhishNet",     type: "Phishing",             diff: "Beginner",     diffColor: "#00ff88" },
    "weakpass-01":{ name: "WeakPass",     type: "Weak Password Attack", diff: "Beginner",     diffColor: "#00ff88" },
    "social-01":  { name: "SocialEng",    type: "Social Engineering",   diff: "Beginner",     diffColor: "#00ff88" },
    "malware-01": { name: "MalwareDrop",  type: "Malware Download",     diff: "Beginner",     diffColor: "#00ff88" },
    "brute-01":   { name: "BruteX",       type: "Brute Force",          diff: "Intermediate", diffColor: "#ffcc00" },
    "xss-01":     { name: "XSSploit",     type: "Cross Site Scripting", diff: "Intermediate", diffColor: "#ffcc00" },
    "klog-01":    { name: "KeyLogger",    type: "Keylogger Attack",     diff: "Intermediate", diffColor: "#ffcc00" },
    "fakeap-01":  { name: "FakeAP",       type: "Fake WiFi Hotspot",    diff: "Intermediate", diffColor: "#ffcc00" },
    "sess-01":    { name: "SessHijack",   type: "Session Hijacking",    diff: "Intermediate", diffColor: "#ffcc00" },
    "sqli-01":    { name: "SQLStorm",     type: "SQL Injection",        diff: "Advanced",     diffColor: "#ff4444" },
    "mitm-01":    { name: "MitM Café",    type: "Man in the Middle",    diff: "Advanced",     diffColor: "#ff4444" },
    "rnsw-01":    { name: "RansomDrop",   type: "Ransomware",           diff: "Advanced",     diffColor: "#ff4444" },
    "spy-01":     { name: "SpyAgent",     type: "Spyware",              diff: "Advanced",     diffColor: "#ff4444" },
    "usb-01":     { name: "USBdrop",      type: "USB Malware",          diff: "Advanced",     diffColor: "#ff4444" },
    "dos-01":     { name: "NetFlood",     type: "Denial of Service",    diff: "Advanced",     diffColor: "#ff4444" },
};

export default function ReportsHubPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDiff, setFilterDiff] = useState("ALL");
    const [filterGrade, setFilterGrade] = useState("ALL");
    const [sortBy, setSortBy] = useState("date_desc");

    useEffect(() => {
        fetch(`/api/user/reports?sort=${sortBy}`, { cache: "no-store" })
            .then(r => r.ok ? r.json() : { sessions: [] })
            .then(data => setSessions(data.sessions || []))
            .catch(() => setSessions([]))
            .finally(() => setLoading(false));
    }, [sortBy]);

    // Compute aggregate stats
    const totalSessions = sessions.length;
    const avgAttacker = totalSessions > 0
        ? Math.round(sessions.reduce((sum, s) => sum + (s.attacker_score || 0), 0) / totalSessions)
        : 0;
    const avgDefender = totalSessions > 0
        ? Math.round(sessions.reduce((sum, s) => sum + (s.defender_score || 0), 0) / totalSessions)
        : 0;
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    const totalHours = Math.floor(totalTime / 3600);
    const totalMins = Math.floor((totalTime % 3600) / 60);

    const bestSession = [...sessions].sort((a, b) => (b.attacker_score || 0) - (a.attacker_score || 0))[0];
    const worstSession = [...sessions].sort((a, b) => (a.attacker_score || 0) - (b.attacker_score || 0))[0];

    // Compute grade distribution
    const gradeDistribution: Record<string, number> = {};
    sessions.forEach(s => {
        const g = s.grade || "?";
        gradeDistribution[g] = (gradeDistribution[g] || 0) + 1;
    });

    // Apply client-side filters
    const filteredSessions = sessions.filter(s => {
        const meta = SCENARIO_META[s.scenario_id];
        if (filterDiff !== "ALL" && meta?.diff !== filterDiff) return false;
        if (filterGrade !== "ALL" && !s.grade?.startsWith(filterGrade)) return false;
        return true;
    });

    // Performance trend data — aggregate score by session order
    const trendData = sessions
        .slice()
        .sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime())
        .map((s, i) => ({
            index: i,
            atk: s.attacker_score || 0,
            def: s.defender_score || 0,
        }));

    const maxTrend = Math.max(...trendData.map(d => Math.max(d.atk, d.def)), 100);
    const trendH = 120;
    const trendW = 600;

    const atkPath = trendData.length > 1
        ? trendData.map((d, i) =>
            `${i === 0 ? 'M' : 'L'}${(i / (trendData.length - 1)) * trendW},${trendH - (d.atk / maxTrend) * trendH}`
        ).join(' ')
        : '';
    const defPath = trendData.length > 1
        ? trendData.map((d, i) =>
            `${i === 0 ? 'M' : 'L'}${(i / (trendData.length - 1)) * trendW},${trendH - (d.def / maxTrend) * trendH}`
        ).join(' ')
        : '';

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div className="dot-bg" />

                <div className="rp-container fade-in">
                    <h1 className="orbitron rp-header">◈ INCIDENT REPORTS</h1>

                    {/* ── AGGREGATE STATS ROW ── */}
                    <div className="rp-stats-grid">
                        <div className="rp-stat-card">
                            <span className="rp-stat-val orbitron" style={{ color: '#00d4ff' }}>{totalSessions}</span>
                            <span className="rp-stat-label mono">TOTAL SESSIONS</span>
                        </div>
                        <div className="rp-stat-card">
                            <span className="rp-stat-val orbitron" style={{ color: '#00d4ff' }}>{avgAttacker}</span>
                            <span className="rp-stat-label mono">AVG ATK SCORE</span>
                        </div>
                        <div className="rp-stat-card">
                            <span className="rp-stat-val orbitron" style={{ color: '#00ff88' }}>{avgDefender}</span>
                            <span className="rp-stat-label mono">AVG DEF SCORE</span>
                        </div>
                        <div className="rp-stat-card">
                            <span className="rp-stat-val orbitron" style={{ color: '#bb88ff' }}>{totalHours}h {totalMins}m</span>
                            <span className="rp-stat-label mono">TOTAL TIME</span>
                        </div>
                        <div className="rp-stat-card">
                            <span className="rp-stat-val orbitron" style={{ color: '#00ff88' }}>
                                {bestSession ? (SCENARIO_META[bestSession.scenario_id]?.name || bestSession.scenario_id) : '—'}
                            </span>
                            <span className="rp-stat-label mono">BEST LAB ({bestSession?.attacker_score ?? '—'}/100)</span>
                        </div>
                        <div className="rp-stat-card">
                            <span className="rp-stat-val orbitron" style={{ color: '#ff4444' }}>
                                {worstSession ? (SCENARIO_META[worstSession.scenario_id]?.name || worstSession.scenario_id) : '—'}
                            </span>
                            <span className="rp-stat-label mono">WEAKEST LAB ({worstSession?.attacker_score ?? '—'}/100)</span>
                        </div>
                    </div>

                    {/* ── PERFORMANCE TREND ── */}
                    {trendData.length > 1 && (
                        <div className="rp-glass-panel">
                            <h3 className="rp-card-label">// PERFORMANCE TREND</h3>
                            <div className="rp-trend-legend">
                                <span className="mono" style={{ fontSize: '0.75rem' }}><span style={{ color: '#00d4ff' }}>━━</span> ATK SCORE</span>
                                <span className="mono" style={{ fontSize: '0.75rem' }}><span style={{ color: '#00ff88' }}>━━</span> DEF SCORE</span>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <svg viewBox={`-10 -10 ${trendW + 20} ${trendH + 30}`} style={{ width: '100%', maxWidth: trendW + 20, display: 'block', margin: '0 auto' }}>
                                    {/* Grid lines */}
                                    {[0, 25, 50, 75, 100].map(v => (
                                        <g key={v}>
                                            <line x1={0} y1={trendH - (v / maxTrend) * trendH} x2={trendW} y2={trendH - (v / maxTrend) * trendH}
                                                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                            <text x={-8} y={trendH - (v / maxTrend) * trendH + 3}
                                                fill="#4a6070" fontSize="9" fontFamily="'Share Tech Mono', monospace" textAnchor="end">{v}</text>
                                        </g>
                                    ))}
                                    {/* ATK line */}
                                    <path d={atkPath} fill="none" stroke="#00d4ff" strokeWidth="2" />
                                    {/* DEF line */}
                                    <path d={defPath} fill="none" stroke="#00ff88" strokeWidth="2" />
                                    {/* ATK dots */}
                                    {trendData.map((d, i) => (
                                        <circle key={`a-${i}`} cx={(i / (trendData.length - 1)) * trendW} cy={trendH - (d.atk / maxTrend) * trendH}
                                            r="3" fill="#00d4ff" />
                                    ))}
                                    {/* DEF dots */}
                                    {trendData.map((d, i) => (
                                        <circle key={`d-${i}`} cx={(i / (trendData.length - 1)) * trendW} cy={trendH - (d.def / maxTrend) * trendH}
                                            r="3" fill="#00ff88" />
                                    ))}
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* ── GRADE DISTRIBUTION ── */}
                    {Object.keys(gradeDistribution).length > 0 && (
                        <div className="rp-glass-panel">
                            <h3 className="rp-card-label">// GRADE DISTRIBUTION</h3>
                            <div className="rp-grade-dist">
                                {Object.entries(gradeDistribution).sort(([a], [b]) => a.localeCompare(b)).map(([grade, count]) => (
                                    <div key={grade} className="rp-grade-bar-container">
                                        <span className={`rp-grade-label mono ${grade.startsWith('A') ? 'grade-a' : grade.startsWith('B') ? 'grade-b' : 'grade-c'}`}>
                                            {grade}
                                        </span>
                                        <div className="rp-grade-bar-bg">
                                            <div
                                                className="rp-grade-bar-fill"
                                                style={{
                                                    width: `${(count / totalSessions) * 100}%`,
                                                    background: grade.startsWith('A') ? '#00ff88' : grade.startsWith('B') ? '#00d4ff' : '#ff4444',
                                                }}
                                            />
                                        </div>
                                        <span className="mono" style={{ fontSize: '0.75rem', color: '#6b86a0', minWidth: 30 }}>{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── FILTERS & SORT ── */}
                    <div className="rp-filters">
                        <div className="rp-filter-group">
                            <span className="mono" style={{ color: '#6b86a0', fontSize: '0.8rem' }}>DIFFICULTY:</span>
                            {["ALL", "Beginner", "Intermediate", "Advanced"].map(f => (
                                <button key={f} className={`rp-filter-btn mono ${filterDiff === f ? 'active' : ''}`}
                                    onClick={() => setFilterDiff(f)}>{f.toUpperCase()}</button>
                            ))}
                        </div>
                        <div className="rp-filter-group">
                            <span className="mono" style={{ color: '#6b86a0', fontSize: '0.8rem' }}>GRADE:</span>
                            {["ALL", "A", "B", "C", "D"].map(f => (
                                <button key={f} className={`rp-filter-btn mono ${filterGrade === f ? 'active' : ''}`}
                                    onClick={() => setFilterGrade(f)}>{f}</button>
                            ))}
                        </div>
                        <div className="rp-filter-group">
                            <span className="mono" style={{ color: '#6b86a0', fontSize: '0.8rem' }}>SORT:</span>
                            <select className="rp-sort-select mono" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="date_desc">NEWEST FIRST</option>
                                <option value="date_asc">OLDEST FIRST</option>
                                <option value="score_desc">HIGHEST SCORE</option>
                            </select>
                        </div>
                    </div>

                    {/* ── SESSION LIST ── */}
                    {loading ? (
                        <div className="rp-glass-panel" style={{ textAlign: 'center', padding: 60 }}>
                            <div className="skeleton" style={{ height: 200, borderRadius: 4 }} />
                            <p className="mono" style={{ marginTop: 20, color: '#6b86a0' }}>Loading reports...</p>
                        </div>
                    ) : filteredSessions.length === 0 ? (
                        <div className="rp-glass-panel rp-empty">
                            <span style={{ fontSize: '3rem' }}>📋</span>
                            <p className="orbitron" style={{ color: '#6b86a0', margin: '16px 0 8px' }}>NO REPORTS FOUND</p>
                            <p className="mono" style={{ color: '#4a6070', fontSize: '0.85rem' }}>
                                {totalSessions > 0 ? 'Try adjusting your filters.' : 'Complete a lab to generate your first report.'}
                            </p>
                        </div>
                    ) : (
                        <div className="rp-sessions-list">
                            {filteredSessions.map(s => {
                                const meta = SCENARIO_META[s.scenario_id];
                                const name = meta?.name || s.scenario_id;
                                const type = meta?.type || "Unknown";
                                const diff = meta?.diff || "—";
                                const diffColor = meta?.diffColor || "#6b86a0";
                                const dur = s.duration_seconds
                                    ? `${Math.floor(s.duration_seconds / 60)}:${String(s.duration_seconds % 60).padStart(2, '0')}`
                                    : '—';
                                return (
                                    <div key={s.id} className="rp-session-card" onClick={() => router.push(`/report/${s.id}`)}>
                                        <div className="rp-sc-left">
                                            <div className="rp-sc-title">
                                                <span className="orbitron" style={{ fontSize: '1rem' }}>{name}</span>
                                                <span className="rp-sc-type mono">{type}</span>
                                            </div>
                                            <div className="rp-sc-meta">
                                                <span className="rp-sc-chip mono">ID_{s.id.slice(0, 8).toUpperCase()}</span>
                                                <span className="rp-sc-chip mono">{new Date(s.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <span className="rp-sc-chip mono">⏱ {dur}</span>
                                                <span className="rp-sc-chip mono" style={{ borderColor: diffColor, color: diffColor }}>{diff}</span>
                                            </div>
                                        </div>
                                        <div className="rp-sc-right">
                                            <div className="rp-sc-scores">
                                                <div className="rp-sc-score-item">
                                                    <div className="rp-mini-bar-bg">
                                                        <div className="rp-mini-bar" style={{ width: `${s.attacker_score || 0}%`, background: '#00d4ff' }}></div>
                                                    </div>
                                                    <span className="mono" style={{ fontSize: '0.85rem', color: '#00d4ff' }}>{s.attacker_score ?? '—'}</span>
                                                    <span className="mono" style={{ fontSize: '0.65rem', color: '#4a6070' }}>ATK</span>
                                                </div>
                                                <div className="rp-sc-score-item">
                                                    <div className="rp-mini-bar-bg">
                                                        <div className="rp-mini-bar" style={{ width: `${s.defender_score || 0}%`, background: '#00ff88' }}></div>
                                                    </div>
                                                    <span className="mono" style={{ fontSize: '0.85rem', color: '#00ff88' }}>{s.defender_score ?? '—'}</span>
                                                    <span className="mono" style={{ fontSize: '0.65rem', color: '#4a6070' }}>DEF</span>
                                                </div>
                                            </div>
                                            <div className={`rp-sc-grade ${s.grade?.startsWith('A') ? 'grade-a' : s.grade?.startsWith('B') ? 'grade-b' : 'grade-c'}`}>
                                                {s.grade || '—'}
                                            </div>
                                            <button className="rp-view-btn mono">VIEW REPORT →</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                :global(body) { background: #0a1628; margin: 0; padding: 0; color: #fff; font-family: 'Exo 2', sans-serif; }
                .orbitron { font-family: 'Orbitron', sans-serif; }
                .mono { font-family: 'Share Tech Mono', monospace; }
                .layout { display: flex; width: 100vw; height: 100vh; overflow: hidden; }
                .main-content { margin-left: 220px; width: calc(100vw - 220px); height: 100vh; overflow-y: auto; position: relative; }
                .dot-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background-image: radial-gradient(rgba(0,212,255,0.15) 1px, transparent 1px); background-size: 20px 20px; }
                .fade-in { animation: fadeIn 0.5s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .skeleton { background: linear-gradient(90deg, rgba(0,212,255,0.05) 25%, rgba(0,212,255,0.12) 50%, rgba(0,212,255,0.05) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

                .rp-container { padding: 40px; display: flex; flex-direction: column; gap: 24px; max-width: 1200px; margin: 0 auto; padding-bottom: 100px; }
                .rp-header { font-size: 1.8rem; margin: 0; color: #fff; }

                /* Stats Grid */
                .rp-stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
                .rp-stat-card {
                    background: rgba(9,26,46,0.8); border: 1px solid rgba(0,212,255,0.15); border-radius: 4px;
                    padding: 20px 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center;
                }
                .rp-stat-val { font-size: 1.2rem; font-weight: bold; }
                .rp-stat-label { font-size: 0.7rem; color: #6b86a0; }

                /* Glass Panel */
                .rp-glass-panel { background: rgba(9,26,46,0.8); border: 1px solid rgba(0,212,255,0.15); border-radius: 4px; padding: 24px; }
                .rp-card-label { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #6b86a0; margin: 0 0 16px 0; }

                /* Trend */
                .rp-trend-legend { display: flex; gap: 24px; margin-bottom: 12px; }

                /* Grade Distribution */
                .rp-grade-dist { display: flex; flex-direction: column; gap: 8px; }
                .rp-grade-bar-container { display: flex; align-items: center; gap: 12px; }
                .rp-grade-label { min-width: 30px; font-weight: bold; font-size: 0.85rem; }
                .grade-a { color: #00ff88; }
                .grade-b { color: #00d4ff; }
                .grade-c { color: #ff4444; }
                .rp-grade-bar-bg { flex: 1; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
                .rp-grade-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }

                /* Filters */
                .rp-filters { display: flex; flex-wrap: wrap; gap: 20px; align-items: center; }
                .rp-filter-group { display: flex; align-items: center; gap: 8px; }
                .rp-filter-btn {
                    background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #6b86a0;
                    padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; transition: 0.2s;
                }
                .rp-filter-btn:hover { border-color: rgba(0,212,255,0.4); color: #c8e6f0; }
                .rp-filter-btn.active { border-color: #00d4ff; color: #00d4ff; background: rgba(0,212,255,0.1); }
                .rp-sort-select {
                    background: #050f1c; border: 1px solid rgba(0,212,255,0.2); color: #c8e6f0;
                    padding: 5px 12px; border-radius: 4px; font-size: 0.75rem; cursor: pointer;
                }

                /* Empty */
                .rp-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; text-align: center; }

                /* Session List */
                .rp-sessions-list { display: flex; flex-direction: column; gap: 12px; }
                .rp-session-card {
                    display: flex; justify-content: space-between; align-items: center;
                    background: rgba(9,26,46,0.8); border: 1px solid rgba(0,212,255,0.1); border-radius: 4px;
                    padding: 20px 24px; cursor: pointer; transition: all 0.3s;
                }
                .rp-session-card:hover { border-color: rgba(0,212,255,0.4); transform: translateX(4px); background: rgba(0,212,255,0.03); }
                .rp-sc-left { display: flex; flex-direction: column; gap: 10px; }
                .rp-sc-title { display: flex; align-items: center; gap: 12px; }
                .rp-sc-type { font-size: 0.8rem; color: #6b86a0; }
                .rp-sc-meta { display: flex; gap: 8px; flex-wrap: wrap; }
                .rp-sc-chip { background: rgba(0,212,255,0.06); border: 1px solid rgba(0,212,255,0.15); padding: 3px 10px; border-radius: 3px; font-size: 0.7rem; color: #6b86a0; }
                .rp-sc-right { display: flex; align-items: center; gap: 20px; }
                .rp-sc-scores { display: flex; gap: 16px; }
                .rp-sc-score-item { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 60px; }
                .rp-mini-bar-bg { width: 60px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
                .rp-mini-bar { height: 100%; border-radius: 2px; }
                .rp-sc-grade {
                    font-family: 'Orbitron', sans-serif; font-size: 1.8rem; font-weight: 900;
                    min-width: 60px; text-align: center;
                }
                .rp-view-btn {
                    background: transparent; border: 1px solid rgba(0,212,255,0.3); color: #00d4ff;
                    padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; transition: 0.2s; white-space: nowrap;
                }
                .rp-view-btn:hover { background: rgba(0,212,255,0.1); border-color: #00d4ff; }
            `}</style>
        </div>
    );
}
