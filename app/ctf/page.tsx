"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { scenarios } from "@/lib/scenarios";

interface LeaderboardEntry {
    id?: string;
    user_id?: string;
    name?: string;
    score?: number;
    level?: number;
    rank?: number;
    total_sessions?: number;
}

interface UserStats {
    totalSessions: number;
    totalScore: number;
    level: number;
    xp: number;
    rank: number | null;
    recentSessions: {
        id: string;
        scenario_id: string;
        started_at: string;
        ended_at: string | null;
        grade?: string;
    }[];
}

export default function CtfPage() {
    const router = useRouter();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [lbRes, statsRes] = await Promise.all([
                    fetch("/api/leaderboard"),
                    fetch("/api/user/stats"),
                ]);
                if (lbRes.ok) {
                    const lbData = await lbRes.json();
                    setLeaderboard(lbData);
                }
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setUserStats(statsData);
                }
            } catch (e) {
                console.error("Failed to fetch CTF data:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const activeChallenges = [
        { id: "sqli-01", name: "LoginBreaker", cat: "SQLi", diff: "Easy", pts: 100, solves: 47, diffColor: "#00ff88" },
        { id: "sess-01", name: "CookieMonster", cat: "Session Hijack", diff: "Medium", pts: 200, solves: 12, diffColor: "#ffcc00", time: "45:00" },
        { id: "phish-01", name: "PhishMaster", cat: "Phishing", diff: "Easy", pts: 150, solves: 89, diffColor: "#00ff88" },
    ];

    // Derive completed scenario IDs from recent sessions
    const completedScenarioIds = new Set(
        (userStats?.recentSessions || [])
            .filter(s => s.ended_at)
            .map(s => s.scenario_id)
    );

    // Build flags from completed sessions mapped to scenarios
    const capturedFlags = (userStats?.recentSessions || [])
        .filter(s => s.ended_at)
        .map(s => {
            const scenario = scenarios.find(sc => sc.id === s.scenario_id);
            return {
                name: scenario?.name || s.scenario_id,
                date: s.ended_at ? new Date(s.ended_at).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : "",
            };
        });

    const totalScenarios = scenarios.length;
    const flagsCount = completedScenarioIds.size;

    function timeAgo(dateStr: string | undefined): string {
        if (!dateStr) return "—";
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    }

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content ctf-theme">
                <div className="dot-bg" />

                <div className="ctf-container">
                    <div className="header-strip">
                        <div className="h-left">
                            <h1 className="orbitron">◈ CTF ARENA 🏆</h1>
                            <span className="subtitle">Capture The Flag — Competitive Mode</span>
                        </div>
                        <div className="h-stats">
                            <div className="stat"><span>FLAGS</span> <b>{loading ? "—" : `${flagsCount}/${totalScenarios}`}</b></div>
                            <div className="stat"><span>RANK</span> <b>{loading ? "—" : userStats?.rank ? `#${userStats.rank}` : "—"}</b></div>
                            <div className="stat highlight"><span>PTS</span> <b>{loading ? "—" : userStats?.totalScore ?? 0}</b></div>
                        </div>
                    </div>

                    <section className="mt-4">
                        <h2 className="section-title">◈ ACTIVE CHALLENGES</h2>
                        <div className="chal-grid">
                            {activeChallenges.map(c => (
                                <div className="chal-card" key={c.id}>
                                    <div className="badges">
                                        <span className="badge" style={{ color: c.diffColor, borderColor: c.diffColor }}>{c.diff}</span>
                                        <span className="badge cat">{c.cat}</span>
                                    </div>
                                    <h3 className="orbitron">{c.name}</h3>
                                    <div className="meta">
                                        <span className="pts">{c.pts} PTS</span>
                                        <span className="solves">{c.solves} solves</span>
                                    </div>
                                    {c.time && <div className="time">⏱ {c.time} remaining</div>}
                                    <button className="btn-solid" onClick={() => router.push(`/lab/${c.id}`)}>▶ LAUNCH CHALLENGE</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid-2 mt-4">
                        <section className="glass-panel">
                            <h2 className="section-title">◈ LEADERBOARD</h2>
                            {loading ? (
                                <div className="lb-loading">Loading leaderboard...</div>
                            ) : leaderboard.length === 0 ? (
                                <div className="lb-loading">No leaderboard data yet. Complete labs to earn points!</div>
                            ) : (
                                <table className="lb-table">
                                    <thead><tr><th>Rank</th><th>Operator</th><th>Level</th><th>Points</th></tr></thead>
                                    <tbody>
                                        {leaderboard.slice(0, 10).map((entry, i) => {
                                            const rank = entry.rank || i + 1;
                                            const isCurrentUser = userStats && (entry.user_id === undefined || entry.score === userStats.totalScore);
                                            return (
                                                <tr key={entry.id || entry.user_id || i} className={rank === userStats?.rank ? "highlight" : ""}>
                                                    <td>{rank}</td>
                                                    <td>{entry.name || `OP_${String(rank).padStart(3, "0")}`}</td>
                                                    <td>Lv.{entry.level || 1}</td>
                                                    <td>{entry.score || 0}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </section>

                        <section className="glass-panel">
                            <h2 className="section-title">◈ YOUR FLAGS</h2>
                            <div className="flag-grid">
                                {loading ? (
                                    <div className="lb-loading" style={{ gridColumn: "1/-1" }}>Loading...</div>
                                ) : capturedFlags.length === 0 ? (
                                    <div className="lb-loading" style={{ gridColumn: "1/-1" }}>No flags captured yet. Complete labs to earn flags!</div>
                                ) : (
                                    <>
                                        {capturedFlags.map((flag, i) => (
                                            <div className="flag-card captured" key={i}>
                                                <span className="f-icon">🏁</span>
                                                <div className="f-info"><h4>{flag.name}</h4><span>{flag.date}</span></div>
                                            </div>
                                        ))}
                                        {/* Show locked slots for remaining scenarios */}
                                        {Array.from({ length: Math.max(0, totalScenarios - capturedFlags.length) }).slice(0, 3).map((_, i) => (
                                            <div className="flag-card locked" key={`locked-${i}`}><span>🔒</span> <h4>Locked</h4></div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        body { background: #0a1628; margin: 0; padding: 0; color: #fff; font-family: 'Exo 2', sans-serif; }
        .orbitron { font-family: 'Orbitron', sans-serif; }
        .layout { display: flex; width: 100vw; height: 100vh; overflow: hidden; }
        .main-content { margin-left: 220px; width: calc(100vw - 220px); height: 100vh; overflow-y: auto; position: relative; }
        
        .ctf-theme .dot-bg { 
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; 
          background-image: radial-gradient(rgba(255, 68, 68, 0.1) 1px, transparent 1px); 
          background-size: 20px 20px; 
        }

        .ctf-container { padding: 30px; display: flex; flex-direction: column; gap: 24px; max-width: 1400px; margin: 0 auto; }
        
        .header-strip { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(255,68,68,0.2), rgba(0,0,0,0.3)); padding: 24px; border-left: 4px solid #ff4444; }
        .h-left h1 { margin: 0 0 8px 0; font-size: 1.8rem; color: #ff4444; text-shadow: 0 0 10px rgba(255,68,68,0.4); }
        .subtitle { font-family: 'Share Tech Mono'; color: #c8e6f0; }
        
        .h-stats { display: flex; gap: 20px; }
        .stat { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,68,68,0.3); padding: 12px 20px; display: flex; flex-direction: column; align-items: center; border-radius: 4px; }
        .stat span { font-family: 'Share Tech Mono'; font-size: 0.75rem; color: #888; }
        .stat b { font-family: 'Orbitron'; font-size: 1.2rem; color: #fff; margin-top: 4px; }
        .stat.highlight { border-color: #ff4444; background: rgba(255,68,68,0.1); }
        .stat.highlight b { color: #ff4444; text-shadow: 0 0 10px rgba(255,68,68,0.5); }

        .section-title { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #ff4444; margin-top: 0; margin-bottom: 20px; }
        .mt-4 { margin-top: 20px; }
        .grid-2 { display: grid; grid-template-columns: 3fr 2fr; gap: 24px; }
        
        .glass-panel { background: #091a2e; border: 1px solid rgba(255, 68, 68, 0.2); padding: 24px; border-radius: 4px; position: relative; }

        /* CHALLENGES */
        .chal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .chal-card { background: #050f1c; border: 1px solid rgba(255,68,68,0.3); padding: 20px; display: flex; flex-direction: column; gap: 12px; transition: transform 0.2s; }
        .chal-card:hover { transform: translateY(-3px); border-color: #ff4444; box-shadow: 0 5px 15px rgba(255,68,68,0.1); }
        .badges { display: flex; gap: 8px; }
        .badge { font-family: 'Share Tech Mono'; font-size: 0.7rem; padding: 2px 8px; border: 1px solid; border-radius: 12px; }
        .badge.cat { color: #ccc; border-color: rgba(255,255,255,0.2); }
        .chal-card h3 { margin: 0; font-size: 1.2rem; color: #fff; }
        .meta { display: flex; justify-content: space-between; font-family: 'Share Tech Mono'; font-size: 0.9rem; }
        .pts { color: #ff4444; font-weight: bold; }
        .solves { color: #6b86a0; }
        .time { font-family: 'Share Tech Mono'; font-size: 0.8rem; color: #ffcc00; margin-top: -6px; }
        .btn-solid { margin-top: auto; background: rgba(255,68,68,0.1); border: 1px solid #ff4444; color: #ff4444; font-family: 'Orbitron'; font-weight: bold; padding: 10px; cursor: pointer; transition: all 0.2s; clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%); }
        .btn-solid:hover { background: #ff4444; color: #000; box-shadow: 0 0 15px rgba(255,68,68,0.4); }

        /* LEADERBOARD */
        .lb-table { width: 100%; border-collapse: collapse; font-family: 'Share Tech Mono'; font-size: 0.9rem; text-align: left; }
        .lb-table th { color: #ff4444; padding: 12px 10px; border-bottom: 1px solid rgba(255,68,68,0.3); }
        .lb-table td { padding: 12px 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .lb-table tr.highlight { background: rgba(255,68,68,0.1); border-left: 3px solid #ff4444; }
        .lb-table tr.highlight td { color: #ff8888; font-weight: bold; text-shadow: 0 0 5px rgba(255,68,68,0.3); }
        .lb-loading { font-family: 'Share Tech Mono'; font-size: 0.9rem; color: #6b86a0; padding: 20px 0; text-align: center; }

        /* FLAGS */
        .flag-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .flag-card { padding: 16px; border: 1px solid; display: flex; align-items: center; gap: 16px; }
        .flag-card.captured { background: rgba(0,255,136,0.05); border-color: rgba(0,255,136,0.3); }
        .f-icon { font-size: 1.5rem; }
        .f-info { display: flex; flex-direction: column; }
        .f-info h4 { margin: 0 0 4px 0; font-family: 'Share Tech Mono'; font-size: 0.9rem; color: #fff; }
        .f-info span { font-family: 'Share Tech Mono'; font-size: 0.75rem; color: #00ff88; }
        .flag-card.locked { background: rgba(0,0,0,0.2); border-color: #333; color: #666; justify-content: center; opacity: 0.5; }
        .flag-card.locked h4 { margin: 0; font-family: 'Share Tech Mono'; }
      `}</style>
        </div>
    );
}
