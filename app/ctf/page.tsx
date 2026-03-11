"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useRouter } from "next/navigation";

export default function CtfPage() {
    const router = useRouter();

    const activeChallenges = [
        { id: "loginbreaker", name: "LoginBreaker", cat: "SQLi", diff: "Easy", pts: 100, solves: 47, diffColor: "#00ff88" },
        { id: "cookiemonster", name: "CookieMonster", cat: "Session Hijack", diff: "Medium", pts: 200, solves: 12, diffColor: "#ffcc00", time: "45:00" },
        { id: "phishmaster", name: "PhishMaster", cat: "Phishing", diff: "Easy", pts: 150, solves: 89, diffColor: "#00ff88" },
    ];

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
                            <div className="stat"><span>FLAGS</span> <b>3/12</b></div>
                            <div className="stat"><span>RANK</span> <b>#7</b></div>
                            <div className="stat highlight"><span>PTS</span> <b>680</b></div>
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
                            <table className="lb-table">
                                <thead><tr><th>Rank</th><th>Operator</th><th>Flags</th><th>Points</th><th>Last Solve</th></tr></thead>
                                <tbody>
                                    <tr><td>1</td><td>OP_042</td><td>8</td><td>840</td><td>10m ago</td></tr>
                                    <tr><td>2</td><td>OP_017</td><td>6</td><td>720</td><td>1h ago</td></tr>
                                    <tr className="highlight"><td>3</td><td>OP_001</td><td>3</td><td>680</td><td>Just now</td></tr>
                                    <tr><td>4</td><td>OP_109</td><td>3</td><td>540</td><td>2h ago</td></tr>
                                    <tr><td>5</td><td>OP_088</td><td>2</td><td>490</td><td>5h ago</td></tr>
                                    <tr><td>6</td><td>OP_212</td><td>2</td><td>320</td><td>1d ago</td></tr>
                                    <tr><td>7</td><td>OP_011</td><td>1</td><td>100</td><td>1d ago</td></tr>
                                </tbody>
                            </table>
                        </section>

                        <section className="glass-panel">
                            <h2 className="section-title">◈ YOUR FLAGS</h2>
                            <div className="flag-grid">
                                <div className="flag-card captured">
                                    <span className="f-icon">🏁</span>
                                    <div className="f-info"><h4>CorpBank DB Flag</h4><span>100 pts • Today</span></div>
                                </div>
                                <div className="flag-card captured">
                                    <span className="f-icon">🏁</span>
                                    <div className="f-info"><h4>CEO Password</h4><span>250 pts • Mar 06</span></div>
                                </div>
                                <div className="flag-card captured">
                                    <span className="f-icon">🏁</span>
                                    <div className="f-info"><h4>SSH Key Exfil</h4><span>330 pts • Mar 01</span></div>
                                </div>
                                <div className="flag-card locked"><span>🔒</span> <h4>Locked</h4></div>
                                <div className="flag-card locked"><span>🔒</span> <h4>Locked</h4></div>
                                <div className="flag-card locked"><span>🔒</span> <h4>Locked</h4></div>
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
