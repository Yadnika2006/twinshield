"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DashboardPage({ params }: { params?: { view?: string[] } }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [userStats, setUserStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/stats')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setUserStats(data); })
      .catch(err => console.error("Stats fetch error:", err))
      .finally(() => setStatsLoading(false));

    fetch('/api/leaderboard')
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setLeaderboard(data); })
      .catch(err => console.error("Leaderboard fetch error:", err));
  }, []);


  // Determine view based on params or pathname as fallback
  const view = params?.view?.[0] || pathname.split("/")[2] || "overview";

  const allScenarios = [
    // ── BEGINNER (unlocked) ──────────────────────────────────────────
    { id: "phish-01", name: "PhishNet", type: "Phishing", diff: "Beginner", diffColor: "#00ff88", desc: "Learn to identify and execute phishing attacks.", locked: false },
    { id: "weakpass-01", name: "WeakPass", type: "Weak Password Attack", diff: "Beginner", diffColor: "#00ff88", desc: "Crack poorly secured accounts using wordlists.", locked: false },
    { id: "social-01", name: "SocialEng", type: "Social Engineering", diff: "Beginner", diffColor: "#00ff88", desc: "Manipulate targets into revealing credentials.", locked: false },
    { id: "malware-01", name: "MalwareDrop", type: "Malware Download", diff: "Beginner", diffColor: "#00ff88", desc: "Trick users into downloading malicious payloads.", locked: false },
    // ── INTERMEDIATE (locked) ────────────────────────────────────────
    { id: "brute-01", name: "BruteX", type: "Brute Force", diff: "Intermediate", diffColor: "#ffcc00", desc: "Systematically break authentication barriers.", locked: false },
    { id: "xss-01", name: "XSSploit", type: "Cross Site Scripting", diff: "Intermediate", diffColor: "#ffcc00", desc: "Inject malicious scripts into web applications.", locked: false },
    { id: "klog-01", name: "KeyLogger", type: "Keylogger Attack", diff: "Intermediate", diffColor: "#ffcc00", desc: "Capture keystrokes from a compromised system.", locked: false },
    { id: "fakeap-01", name: "FakeAP", type: "Fake WiFi Hotspot", diff: "Intermediate", diffColor: "#ffcc00", desc: "Set up a rogue access point to intercept traffic.", locked: false },
    { id: "sess-01", name: "SessHijack", type: "Session Hijacking", diff: "Intermediate", diffColor: "#ffcc00", desc: "Steal authenticated session tokens.", locked: false },
    // ── ADVANCED (locked) ────────────────────────────────────────────
    { id: "sqli-01", name: "SQLStorm", type: "SQL Injection", diff: "Advanced", diffColor: "#ff4444", desc: "Bypass authentication and extract databases.", locked: false },
    { id: "mitm-01", name: "MitM Café", type: "Man in the Middle", diff: "Advanced", diffColor: "#ff4444", desc: "Intercept and manipulate network traffic.", locked: false },
    { id: "rnsw-01", name: "RansomDrop", type: "Ransomware", diff: "Advanced", diffColor: "#ff4444", desc: "Deploy and analyze ransomware behavior.", locked: false },
    { id: "spy-01", name: "SpyAgent", type: "Spyware", diff: "Advanced", diffColor: "#ff4444", desc: "Install covert surveillance on target system.", locked: false },
    { id: "usb-01", name: "USBdrop", type: "USB Malware", diff: "Advanced", diffColor: "#ff4444", desc: "Execute malicious payload via USB drop attack.", locked: false },
    { id: "dos-01", name: "NetFlood", type: "Denial of Service", diff: "Advanced", diffColor: "#ff4444", desc: "Overwhelm target systems to cause disruption.", locked: false },
  ];

  const filterMap: Record<string, string | null> = {
    "ALL": null,
    "BEGINNER": "Beginner",
    "INTERMEDIATE": "Intermediate",
    "ADVANCED": "Advanced",
    "CTF": "CTF",
  };


  const scenarios = activeFilter === "ALL"
    ? allScenarios
    : allScenarios.filter(s => s.diff === filterMap[activeFilter]);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="dot-bg" />

        {/* ─── DYNAMIC VIEW RENDERER ────────────────────────────────── */}

        {view === "overview" && (
          <div className="dashboard-container fade-in">
            {/* 1. WELCOME STRIP */}
            <div className="welcome-strip">
              <div className="welcome-text">
                <h1 className="orbitron">WELCOME BACK, {session?.user?.name || "OPERATOR"} <span className="pulse-dot">●</span> <span>ONLINE</span></h1>
              </div>
              <div className="stat-chips">
                <div className={`chip ${statsLoading ? "skeleton" : ""}`}>{statsLoading ? "..." : `${userStats?.totalSessions ?? 0} SESSIONS`}</div>
                <div className={`chip ${statsLoading ? "skeleton" : ""}`}>{statsLoading ? "..." : `${userStats?.totalScore ?? 0} PTS`}</div>
                <div className={`chip highlight ${statsLoading ? "skeleton" : ""}`}>{statsLoading ? "..." : userStats?.rank ? `RANK #${userStats.rank}` : "UNRANKED"}</div>
                <div className={`chip ${statsLoading ? "skeleton" : ""}`}>{statsLoading ? "..." : `${userStats?.badges?.length ?? 0} BADGES`}</div>
              </div>
            </div>

            {/* 2. AGENT STATUS BAR */}
            <div className="grid-2">
              <div className="glass-panel border-purple">
                <div className="panel-header">
                  <div className="title-area"><span className="icon">🧠</span><h3>MENTOR AI</h3></div>
                  <div className="status purple-pulse">● ACTIVE</div>
                </div>
                <div className="panel-body">
                  <div className="kv"><span className="k">MODE:</span> <span className="v">CONTEXTUAL TEACHING</span></div>
                  <button className="btn-outline purple" onClick={() => router.push("/agent-config")}>CONFIGURE →</button>
                </div>
              </div>

              <div className="glass-panel border-blue">
                <div className="panel-header">
                  <div className="title-area"><span className="icon">🛡️</span><h3>DEFENSE AI</h3></div>
                  <div className="status green-pulse">● STANDBY</div>
                </div>
                <div className="panel-body">
                  <div className="kv"><span className="k">MODE:</span> <span className="v">SOC ANALYST</span></div>
                  <button className="btn-outline blue" onClick={() => router.push("/agent-config")}>CONFIGURE →</button>
                </div>
              </div>
            </div>

            {/* 3. QUICK STATS ROW */}
            <div className="grid-3">
              <div className="glass-panel stat-card">
                <h3 className="card-label">// CURRENT LEVEL</h3>
                <div className={`level-val gradient-text ${statsLoading ? "skeleton" : ""}`}>{statsLoading ? "..." : `LEVEL ${userStats?.level ?? 1}`}</div>
                <div className="prog-container">
                  <div className="prog-fill" style={{ width: statsLoading ? '0%' : `${Math.min(100, ((userStats?.xp ?? 0) / ((userStats?.level ?? 1) * 100)) * 100)}%` }}></div>
                </div>
                <span className="prog-sub">{statsLoading ? "..." : `${userStats?.xp ?? 0} / ${(userStats?.level ?? 1) * 100} XP TO NEXT LEVEL`}</span>
              </div>

              <div className="glass-panel stat-card">
                <h3 className="card-label">// RECENT BADGE</h3>
                <div className="badge-display">
                  <span className="badge-icon glow">🎯</span>
                  <div className="badge-info">
                    <span className="b-name">First Blood</span>
                    <span className="b-date">earned today</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel stat-card">
                <h3 className="card-label">// CURRENT STREAK</h3>
                <div className="streak-display">
                  <span className="streak-icon">🔥</span>
                  <div className="streak-info">
                    <span className="s-val">5 DAY STREAK</span>
                    <span className="s-sub">KEEP IT UP, OPERATOR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. RECENT ACTIVITY */}
            <div className="glass-panel">
              <h2 className="section-title">◈ RECENT ACTIVITY</h2>
              <div className="activity-list">
                {statsLoading ? (
                  <div className="skeleton" style={{ height: 60, borderRadius: 4 }} />
                ) : userStats?.recentSessions?.length > 0 ? (
                  userStats.recentSessions.map((sess: any) => (
                    <div key={sess.id} className="activity-card">
                      <div className="scen-info">
                        <span className="name">{sess.scenario_id}</span>
                        <span className="date">{new Date(sess.started_at).toLocaleDateString()}</span>
                      </div>
                      <div className="score-info">
                        <span className="score">{sess.attacker_score ?? "—"}/100</span>
                        <span className="result" style={{ color: sess.grade === "D" || sess.grade === "C" ? "#ff4444" : "#00ff88" }}>
                          {sess.grade ? `GRADE ${sess.grade}` : "IN PROGRESS"}
                        </span>
                      </div>
                      <button className="btn-report" onClick={() => router.push(`/report/${sess.id}`)}>VIEW REPORT</button>
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#6b86a0", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.85rem", textAlign: "center", padding: "20px" }}>
                    No sessions yet. Launch a lab to get started!
                  </div>
                )}
              </div>
            </div>

            {/* 5. RECOMMENDED NEXT LAB */}
            <div className="recommended-card glass-panel shimmer-blue">
              <div className="rec-content">
                <h2 className="orbitron pink-glow">◈ CONTINUE YOUR JOURNEY</h2>
                <p className="rec-sub">Based on your recent SQLi success, we recommend <b>PhishNet</b> to expand your initial access toolkit.</p>
                <div className="rec-meta">
                  <span>TARGET: Generic Corp</span>
                  <span>|</span>
                  <span>EST: 45 MIN</span>
                </div>
              </div>
              <button className="btn-launch-big" onClick={() => router.push("/lab/phish-01?scenario=phish-01")}>▶ LAUNCH LAB</button>
            </div>

            {/* 6. CTF TEASER STRIP */}
            <div className="ctf-teaser-strip" onClick={() => router.push("/ctf")}>
              <div className="teaser-left">
                <span className="trophy">🏆</span>
                <span className="teaser-text">3 ACTIVE CTF CHALLENGES AVAILABLE</span>
              </div>
              <button className="btn-enter-ctf">▶ ENTER CTF ARENA</button>
            </div>
          </div>
        )}

        {view === "labs" && (
          <div className="dashboard-container fade-in">
            <h1 className="orbitron section-header">◈ MY LABS</h1>
            <div className="filter-tabs">
              {["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED", "CTF"].map(f => (
                <span
                  key={f}
                  className={`tab ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </span>
              ))}
            </div>

            {scenarios.length === 0 ? (
              <div className="glass-panel empty-state">
                <span className="empty-icon">🏆</span>
                <p className="orbitron">CTF LABS COMING SOON</p>
                <span className="mono">CTF-specific scenarios will appear here during active events.</span>
              </div>
            ) : (
              <div className="scenario-grid">
                {scenarios.map(scen => (
                  <div key={scen.id} className="scenario-card">
                    <h3 className="orbitron">{scen.name}</h3>
                    <div className="tags">
                      <span className="tag">{scen.type}</span>
                      <span className="tag" style={{ borderColor: scen.diffColor, color: scen.diffColor }}>{scen.diff}</span>
                    </div>
                    <p className="desc">{scen.desc}</p>
                    <button className="btn-launch" onClick={() => router.push(`/lab/${scen.id}?scenario=${scen.id}`)}>▶ LAUNCH LAB</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "progress" && (
          <div className="dashboard-container fade-in text-center">
            <h1 className="orbitron section-header">◈ PROGRESS TRACKER</h1>
            <div className="glass-panel">
              <p className="mono">Progress Analytics module initializing...</p>
              {/* Radar chart and level breakdown would go here */}
              <div className="radar-placeholder">
                <div className="pentagon"></div>
                <p className="muted mt-4">PENTAGONAL SKILL RADAR [RECON | EXPLOIT | EXFIL | DEFENCE | STEALTH]</p>
              </div>
            </div>
          </div>
        )}

        {view === "leaderboard" && (
          <div className="dashboard-container fade-in">
            <h1 className="orbitron section-header">◈ LEADERBOARD</h1>
            <div className="glass-panel">
              <table className="lb-table">
                <thead><tr><th>RANK</th><th>OPERATOR</th><th>SCORE</th><th>LEVEL</th><th>STATUS</th></tr></thead>
                <tbody>
                  {leaderboard.length > 0 ? leaderboard.map((entry: any, i: number) => (
                    <tr key={i} className={entry.user_id === (session?.user as any)?.id ? 'highlight' : ''}>
                      <td>#{i + 1}</td>
                      <td>{entry.name || `OPERATOR_${100 + i}`}</td>
                      <td>{entry.score ?? 0}</td>
                      <td>LV{entry.level ?? 1}</td>
                      <td><span className="pulse-dot-sm">●</span> ONLINE</td>
                    </tr>
                  )) : [...Array(10)].map((_, i) => (
                    <tr key={i} className={i === 6 ? 'highlight' : ''}>
                      <td>#{i + 1}</td>
                      <td>OPERATOR_{100 + i}</td>
                      <td>{3000 - (i * 200)}</td>
                      <td>LV{5 - Math.floor(i / 2)}</td>
                      <td><span className="pulse-dot-sm">●</span> ONLINE</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      <style jsx global>{`
        body { background: #0a1628; margin: 0; padding: 0; color: #fff; font-family: 'Exo 2', sans-serif; overflow: hidden; }
        .orbitron { font-family: 'Orbitron', sans-serif; }
        .mono { font-family: 'Share Tech Mono', monospace; }
        .layout { display: flex; width: 100vw; height: 100vh; overflow: hidden; }
        .main-content { margin-left: 220px; width: calc(100vw - 220px); height: 100vh; overflow-y: auto; position: relative; }
        .skeleton { background: linear-gradient(90deg, rgba(0,212,255,0.05) 25%, rgba(0,212,255,0.12) 50%, rgba(0,212,255,0.05) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        
        .dot-bg {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
          background-image: radial-gradient(rgba(0, 212, 255, 0.15) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .dashboard-container { padding: 40px; display: flex; flex-direction: column; gap: 30px; max-width: 1200px; margin: 0 auto; padding-bottom: 100px; }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .glass-panel { background: rgba(9, 26, 46, 0.8); border: 1px solid rgba(0, 212, 255, 0.2); padding: 24px; border-radius: 4px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

        /* WELCOME STRIP */
        .welcome-strip { display: flex; justify-content: space-between; align-items: center; background: rgba(0, 212, 255, 0.05); padding: 20px 30px; border-left: 4px solid #00d4ff; }
        .welcome-text h1 { margin: 0; font-size: 1.5rem; letter-spacing: 1px; }
        .welcome-text h1 span { color: #00ff88; font-size: 0.9rem; font-family: 'Share Tech Mono'; }
        .pulse-dot { color: #00ff88; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; text-shadow: 0 0 10px #00ff88; } 50% { opacity: 0.4; text-shadow: none; } }
        .stat-chips { display: flex; gap: 12px; }
        .chip { background: #050f1c; border: 1px solid rgba(0, 212, 255, 0.3); padding: 8px 16px; font-family: 'Share Tech Mono'; font-size: 0.85rem; border-radius: 20px; }
        .chip.highlight { border-color: #00ff88; color: #00ff88; }

        /* AGENT STATUS */
        .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .title-area { display: flex; align-items: center; gap: 10px; }
        .title-area h3 { margin: 0; font-family: 'Orbitron'; font-size: 1.1rem; }
        .purple-pulse { color: #bb88ff; font-family: 'Share Tech Mono'; font-size: 0.8rem; }
        .green-pulse { color: #00ff88; font-family: 'Share Tech Mono'; font-size: 0.8rem; }
        .kv { font-family: 'Share Tech Mono'; font-size: 0.9rem; margin-bottom: 15px; }
        .kv .k { color: #6b86a0; margin-right: 10px; }
        .btn-outline { background: transparent; border: 1px solid; padding: 6px 16px; font-family: 'Share Tech Mono'; cursor: pointer; border-radius: 4px; font-size: 0.8rem; }
        .btn-outline.purple { border-color: #bb88ff; color: #bb88ff; }
        .btn-outline.blue { border-color: #00d4ff; color: #00d4ff; }

        /* QUICK STATS */
        .stat-card { display: flex; flex-direction: column; gap: 12px; }
        .card-label { font-family: 'Share Tech Mono'; font-size: 0.8rem; color: #6b86a0; margin: 0; }
        .gradient-text { background: linear-gradient(90deg, #00d4ff, #8a2be2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-family: 'Orbitron'; font-weight: 900; font-size: 1.8rem; }
        .prog-container { height: 10px; background: #050f1c; border-radius: 5px; overflow: hidden; }
        .prog-fill { height: 100%; background: linear-gradient(90deg, #00d4ff, #00ff88); }
        .prog-sub { font-family: 'Share Tech Mono'; font-size: 0.7rem; color: #888; }
        
        .badge-display, .streak-display { display: flex; align-items: center; gap: 15px; }
        .badge-icon { font-size: 2rem; }
        .badge-icon.glow { filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.6)); }
        .badge-info, .streak-info { display: flex; flex-direction: column; }
        .b-name, .s-val { font-family: 'Orbitron'; font-weight: bold; font-size: 1rem; }
        .b-date, .s-sub { font-family: 'Share Tech Mono'; font-size: 0.7rem; color: #888; }
        .streak-icon { font-size: 2rem; animation: flicker 3s infinite; }
        @keyframes flicker { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.1); } }

        /* ACTIVITY LIST */
        .activity-list { display: flex; flex-direction: column; gap: 12px; }
        .activity-card { display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 15px 20px; border: 1px solid rgba(255,255,255,0.05); }
        .scen-info, .score-info { display: flex; flex-direction: column; gap: 5px; }
        .scen-info .name { font-family: 'Orbitron'; font-weight: bold; }
        .scen-info .date { font-family: 'Share Tech Mono'; font-size: 0.75rem; color: #6b86a0; }
        .score-info { text-align: right; }
        .score-info .score { font-family: 'Share Tech Mono'; }
        .score-info .result { font-size: 0.8rem; font-weight: bold; }
        .btn-report { background: transparent; border: 1px solid #6b86a0; color: #c8e6f0; font-family: 'Share Tech Mono'; font-size: 0.75rem; padding: 6px 12px; cursor: pointer; transition: 0.2s; }
        .btn-report:hover { border-color: #00d4ff; color: #00d4ff; }

        /* RECOMMENDED LAB */
        .recommended-card { position: relative; padding: 40px; display: flex; justify-content: space-between; align-items: center; overflow: hidden; }
        .shimmer-blue { border-color: rgba(0, 212, 255, 0.4); box-shadow: inset 0 0 30px rgba(0, 212, 255, 0.1); }
        .pink-glow { color: #00d4ff; text-shadow: 0 0 10px rgba(0, 212, 255, 0.5); font-size: 1.5rem; margin: 0 0 15px 0; }
        .rec-sub { font-size: 1rem; color: #c8e6f0; max-width: 600px; margin-bottom: 20px; }
        .rec-sub b { color: #00ff88; }
        .rec-meta { font-family: 'Share Tech Mono'; font-size: 0.85rem; color: #6b86a0; display: flex; gap: 15px; }
        .btn-launch-big { background: linear-gradient(90deg, #00d4ff, #00ff88); border: none; padding: 15px 30px; font-family: 'Orbitron'; font-weight: 900; color: #050f1c; cursor: pointer; font-size: 1.1rem; clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%); }
        .btn-launch-big:hover { transform: scale(1.02); box-shadow: 0 0 20px rgba(0, 212, 255, 0.4); }

        /* CTF TEASER */
        .ctf-teaser-strip { background: linear-gradient(90deg, #ff444422, #091a2e); border: 1px solid rgba(255, 68, 68, 0.3); padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.3s; }
        .ctf-teaser-strip:hover { border-color: #ff4444; background: linear-gradient(90deg, #ff444444, #091a2e); }
        .teaser-left { display: flex; align-items: center; gap: 20px; }
        .trophy { font-size: 1.8rem; filter: drop-shadow(0 0 10px rgba(255, 68, 68, 0.5)); }
        .teaser-text { font-family: 'Orbitron'; font-weight: bold; color: #ff4444; }
        .btn-enter-ctf { background: transparent; border: 1px solid #ff4444; color: #ff4444; font-family: 'Orbitron'; padding: 8px 20px; font-size: 0.8rem; cursor: pointer; }

        /* LABS VIEW */
        .section-header { font-size: 1.8rem; margin: 0; color: #fff; }
        .filter-tabs { display: flex; gap: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
        .tab { font-family: 'Share Tech Mono'; color: #6b86a0; cursor: pointer; transition: color 0.2s; user-select: none; }
        .tab:hover { color: #c8e6f0; }
        .tab.active { color: #00d4ff; border-bottom: 2px solid #00d4ff; padding-bottom: 9px; margin-bottom: -11px; }
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 60px; text-align: center; }
        .empty-icon { font-size: 3rem; filter: drop-shadow(0 0 10px rgba(255,68,68,0.4)); }
        .empty-state p { margin: 0; font-size: 1.2rem; color: #ff4444; }
        .empty-state span { font-size: 0.85rem; color: #6b86a0; }
        .scenario-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .scenario-card { background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.1); padding: 24px; display: flex; flex-direction: column; gap: 15px; position: relative; transition: 0.3s; }
        .scenario-card:hover { border-color: #00d4ff; transform: translateY(-3px); }
        .scenario-card.locked { opacity: 0.5; filter: grayscale(1); }
        .locked-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 10; font-family: 'Orbitron'; color: #ff4444; }
        .tags { display: flex; gap: 10px; }
        .tag { font-family: 'Share Tech Mono'; font-size: 0.7rem; border: 1px solid rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 10px; }
        .desc { font-size: 0.85rem; color: #888; margin: 0; line-height: 1.4; flex: 1; }
        .btn-launch { margin-top: auto; background: rgba(0,212,255,0.1); border: 1px solid #00d4ff; color: #00d4ff; padding: 10px; font-family: 'Orbitron'; font-size: 0.8rem; cursor: pointer; transition: 0.2s; }
        .btn-launch:hover:not(:disabled) { background: #00d4ff; color: #000; }

        /* LEADERBOARD */
        .lb-table { width: 100%; border-collapse: collapse; font-family: 'Share Tech Mono'; text-align: left; }
        .lb-table th { padding: 15px; color: #6b86a0; border-bottom: 1px solid rgba(0,212,255,0.2); }
        .lb-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .lb-table tr.highlight { background: rgba(0, 255, 136, 0.1); color: #00ff88; font-weight: bold; }
        .pulse-dot-sm { color: #00ff88; animation: pulse 2s infinite; font-size: 0.7rem; }

        .radar-placeholder { height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .pentagon { width: 150px; height: 150px; background: rgba(0, 212, 255, 0.1); border: 2px solid #00d4ff; clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); }
      `}</style>
    </div>
  );
}
