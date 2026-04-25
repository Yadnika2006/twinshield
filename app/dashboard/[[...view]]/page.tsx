"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Target, Zap, Shield, Brain, Flame, Skull, Ghost, Trophy, Radio } from "lucide-react";

// ── Badge definitions ──
const ALL_BADGES: { id: string; icon: React.ReactNode; name: string; desc: string }[] = [
  { id: "FIRST_BLOOD", icon: <Target size={32} />, name: "First Blood", desc: "Complete your first lab" },
  { id: "SPEED_RUN", icon: <Zap size={32} />, name: "Speed Run", desc: "Complete a lab in under 15 min" },
  { id: "DEFENDER", icon: <Shield size={32} />, name: "Defender", desc: "Get 80+ defender score" },
  { id: "QUIZ_MASTER", icon: <Brain size={32} />, name: "Quiz Ace", desc: "Score 5/5 on any quiz" },
  { id: "PERSISTENT", icon: <Flame size={32} />, name: "Persistent", desc: "Complete 5+ sessions" },
  { id: "ELITE_HACKER", icon: <Skull size={32} />, name: "Elite Hacker", desc: "Complete all advanced labs" },
  { id: "GHOST", icon: <Ghost size={32} />, name: "Ghost", desc: "Complete a lab with 0 defender alerts" },
  { id: "CTF_CHAMPION", icon: <Trophy size={32} />, name: "CTF Champion", desc: "Win a CTF event" },
];

export default function DashboardPage({ params }: { params?: { view?: string[] } }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [userStats, setUserStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [progressData, setProgressData] = useState<any>(null);
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/stats', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setUserStats(data); })
      .catch(err => console.error("Stats fetch error:", err))
      .finally(() => setStatsLoading(false));

    fetch('/api/leaderboard', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setLeaderboard(data); })
      .catch(err => console.error("Leaderboard fetch error:", err));

    fetch('/api/user/progress', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setProgressData(data); })
      .catch(err => console.error("Progress fetch error:", err))
      .finally(() => setProgressLoading(false));
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
  };


  const scenarios = activeFilter === "ALL"
    ? allScenarios
    : allScenarios.filter(s => s.diff === filterMap[activeFilter]);

  const sessionUserName = session?.user?.name || (sessionStatus === "loading" ? "" : "OPERATOR");

  return (
    <div className="layout ts-dashboard-route">
      <Sidebar />
      <div className="main-content">
        <div className="dot-bg" />

        {/* ─── DYNAMIC VIEW RENDERER ────────────────────────────────── */}

        {view === "overview" && (
          <div className="dashboard-container fade-in">
            {/* 1. WELCOME STRIP */}
            <div className="welcome-strip">
              <div className="welcome-text">
                <h1 className="orbitron">WELCOME BACK, {sessionUserName} <span className="pulse-dot">●</span> <span>ONLINE</span></h1>
              </div>
              <div className="stat-chips">
                <div className={`chip ${statsLoading ? "skeleton" : ""}`}>{statsLoading ? "..." : `${userStats?.totalSessions ?? 0} SESSIONS`}</div>
                <div className={`chip ${statsLoading ? "skeleton" : ""}`}>{statsLoading ? "..." : `${userStats?.totalScore ?? 0} PTS`}</div>
                <div className={`chip highlight ${statsLoading ? "skeleton" : ""}`}>{statsLoading ? "..." : userStats?.rank ? `RANK #${userStats.rank}` : "UNRANKED"}</div>
                <div className={`chip ${statsLoading ? "skeleton" : ""}`}>{statsLoading ? "..." : `${userStats?.badges?.length ?? 0} BADGES`}</div>
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
                  {statsLoading ? (
                    <div className="skeleton" style={{ height: 40, width: '100%' }} />
                  ) : userStats?.badges?.length > 0 ? (() => {
                    const recent = [...userStats.badges].sort((a: any, b: any) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())[0];
                    const details = ALL_BADGES.find(b => b.id === recent.badge_id);
                    return (
                      <>
                        <span className="badge-icon glow" style={{ display: 'inline-flex', alignItems: 'center' }}>{details?.icon || <Target size={32} />}</span>
                        <div className="badge-info">
                          <span className="b-name">{details?.name || recent.badge_id}</span>
                          <span className="b-date">earned {new Date(recent.earned_at).toLocaleDateString()}</span>
                        </div>
                      </>
                    );
                  })() : (
                    <div className="badge-info">
                      <span className="b-name" style={{ color: '#6b86a0' }}>NONE YET</span>
                      <span className="b-date">Complete labs to earn</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-panel stat-card">
                <h3 className="card-label">// CURRENT STREAK</h3>
                <div className="streak-display">
                  <span className="streak-icon" style={{ display: 'inline-flex', alignItems: 'center', color: '#ff9900' }}><Flame size={32} /></span>
                  <div className="streak-info">
                    <span className="s-val">{statsLoading ? "..." : `${userStats?.streak ?? 0} DAY STREAK`}</span>
                    <span className="s-sub">{userStats?.streak > 0 ? "KEEP IT UP, OPERATOR" : "START YOUR JOURNEY TODAY"}</span>
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
            {(() => {
              // Find the first lab that isn't 'completed' in the progress data
              const nextLab = progressData?.labMap?.find((l: any) => l.status !== 'completed') || allScenarios[0];
              
              return (
                <div className="recommended-card glass-panel shimmer-blue">
                  <div className="rec-content">
                    <h2 className="orbitron pink-glow">◈ CONTINUE YOUR JOURNEY</h2>
                    <p className="rec-sub">
                      {progressData?.labMap?.some((l: any) => l.status === 'completed') 
                        ? `Great work on your last mission! We recommend ` 
                        : `Welcome, Operator. Start your journey with `}
                      <b style={{ color: '#00d4ff' }}>{nextLab.name}</b> to advance your skills in {nextLab.type || nextLab.category}.
                    </p>
                    <div className="rec-meta">
                      <span style={{ color: nextLab.diffColor || '#00ff88' }}>DIFFICULTY: {nextLab.diff || 'Beginner'}</span>
                      <span>|</span>
                      <span>CATEGORY: {nextLab.type || 'General'}</span>
                    </div>
                  </div>
                  <button className="btn-launch-big" onClick={() => router.push(`/lab/${nextLab.id}?scenario=${nextLab.id}`)}>
                    ▶ LAUNCH {nextLab.name.toUpperCase()}
                  </button>
                </div>
              );
            })()}

            {/* 6. CTF TEASER STRIP */}
            <div className="ctf-teaser-strip" onClick={() => router.push("/ctf")}>
              <div className="teaser-left">
                <span className="trophy"><Trophy size={28} /></span>
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
              {["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map(f => (
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
                <span className="empty-icon"><Trophy size={48} /></span>
                <p className="orbitron">CTF LABS COMING SOON</p>
                <span className="mono">CTF-specific scenarios will appear here during active events.</span>
              </div>
            ) : (
              <div className="scenario-grid">
                {scenarios.map(scen => {
                  const isCompleted = progressData?.labMap?.find((l: any) => l.id === scen.id)?.status === 'completed';
                  return (
                    <div key={scen.id} className={`scenario-card ${isCompleted ? 'completed-scen' : ''}`}>
                      {isCompleted && <div className="solved-badge orbitron">SOLVED</div>}
                      <h3 className="orbitron">{scen.name}</h3>
                      <div className="tags">
                        <span className="tag">{scen.type}</span>
                        <span className="tag" style={{ borderColor: scen.diffColor, color: scen.diffColor }}>{scen.diff}</span>
                      </div>
                      <p className="desc">{scen.desc}</p>
                      <button className="btn-launch" onClick={() => router.push(`/lab/${scen.id}?scenario=${scen.id}`)}>
                        {isCompleted ? "▶ REPLAY LAB" : "▶ LAUNCH LAB"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {view === "progress" && (
          <div className="dashboard-container fade-in">
            <h1 className="orbitron section-header">◈ PROGRESS TRACKER</h1>

            {progressLoading ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: 60 }}>
                <div className="skeleton" style={{ height: 300, borderRadius: 4 }} />
                <p className="mono" style={{ marginTop: 20, color: '#6b86a0' }}>Loading analytics...</p>
              </div>
            ) : !progressData ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: 60 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#6b86a0', marginBottom: '16px' }}><Radio size={48} /></span>
                <p className="orbitron" style={{ color: '#6b86a0', margin: 0 }}>NO DATA AVAILABLE</p>
                <p className="mono" style={{ color: '#4a6070', fontSize: '0.85rem' }}>Complete a lab to see your progress analytics.</p>
              </div>
            ) : (
              <>
                {/* ── CERTIFICATE BANNER ── */}
                <div className={`certificate-banner glass-panel ${!progressData.isEligibleForCertificate ? 'locked' : ''}`}>
                  <div className="cert-info">
                    <span className="cert-icon">{progressData.isEligibleForCertificate ? '🏅' : '🔒'}</span>
                    <div className="cert-text">
                      <h3 className="orbitron">
                        {progressData.isEligibleForCertificate ? "CONGRATULATIONS, OPERATOR" : "CERTIFICATE LOCKED"}
                      </h3>
                      <p className="mono">
                        {progressData.isEligibleForCertificate 
                          ? "You have successfully completed all Lab Scenarios and CTF Challenges." 
                          : "Complete all Lab Scenarios and CTF Challenges to unlock your certificate."}
                      </p>
                    </div>
                  </div>
                  <button 
                    className="btn-cert" 
                    onClick={() => progressData.isEligibleForCertificate && router.push('/certificate')}
                    disabled={!progressData.isEligibleForCertificate}
                  >
                    {progressData.isEligibleForCertificate ? 'CLAIM CERTIFICATE' : 'LOCKED'}
                  </button>
                </div>

                {/* ── ROW 1: Level & Stats ── */}
                <div className="glass-panel stat-card">
                  <h3 className="card-label">// LEVEL & XP</h3>
                  <div className="level-val gradient-text">LEVEL {progressData.user.level}</div>
                  <div className="prog-container">
                    <div className="prog-fill" style={{ width: `${Math.min(100, (progressData.user.xp / (progressData.user.level * 100)) * 100)}%` }}></div>
                  </div>
                  <span className="prog-sub">{progressData.user.xp} / {progressData.user.level * 100} XP TO NEXT LEVEL</span>
                  <div className="progress-stats-row-grid" style={{ marginTop: 20 }}>
                    <div className="progress-stat-row">
                      <span className="mono" style={{ color: '#6b86a0' }}>TOTAL SCORE</span>
                      <span className="mono" style={{ color: '#00ff88' }}>{progressData.user.score} PTS</span>
                    </div>
                    <div className="progress-stat-row">
                      <span className="mono" style={{ color: '#6b86a0' }}>SESSIONS</span>
                      <span className="mono" style={{ color: '#00d4ff' }}>{progressData.totalSessions}</span>
                    </div>
                    <div className="progress-stat-row">
                      <span className="mono" style={{ color: '#6b86a0' }}>AVG ATK SCORE</span>
                      <span className="mono" style={{ color: '#00d4ff' }}>{progressData.avgAttackerScore}/100</span>
                    </div>
                    <div className="progress-stat-row">
                      <span className="mono" style={{ color: '#6b86a0' }}>AVG DEF SCORE</span>
                      <span className="mono" style={{ color: '#00ff88' }}>{progressData.avgDefenderScore}/100</span>
                    </div>
                  </div>
                </div>

                {/* ── ROW 2: Lab Completion Map ── */}
                <div className="glass-panel">
                  <h3 className="card-label" style={{ marginBottom: 20 }}>// LAB COMPLETION MAP</h3>
                  <div className="lab-map-grid">
                    {progressData.labMap.map((lab: any) => (
                      <div
                        key={lab.id}
                        className={`lab-map-tile ${lab.status}`}
                        onClick={() => lab.status === 'completed' ? null : router.push(`/lab/${lab.id}?scenario=${lab.id}`)}
                      >
                        <div className="lmt-header">
                          <span className="lmt-name orbitron">{lab.name}</span>
                          {lab.bestGrade && (
                            <span className={`lmt-grade ${lab.bestGrade.startsWith('A') ? 'grade-a' : lab.bestGrade.startsWith('B') ? 'grade-b' : 'grade-c'}`}>
                              {lab.bestGrade}
                            </span>
                          )}
                        </div>
                        <span className="lmt-type mono">{lab.type}</span>
                        <div className="lmt-footer">
                          <span className="lmt-diff" style={{ color: lab.diff === 'Beginner' ? '#00ff88' : lab.diff === 'Intermediate' ? '#ffcc00' : '#ff4444' }}>
                            {lab.diff}
                          </span>
                          {lab.attempts > 0 ? (
                            <span className="mono" style={{ fontSize: '0.7rem', color: '#6b86a0' }}>{lab.attempts} attempt{lab.attempts > 1 ? 's' : ''} · {lab.bestScore}/100</span>
                          ) : (
                            <span className="mono" style={{ fontSize: '0.7rem', color: '#4a6070' }}>Not started</span>
                          )}
                        </div>
                        {lab.status === 'completed' && <div className="lmt-check"><Target size={14} /></div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── ROW 3: Activity Heatmap ── */}
                <div className="glass-panel">
                  <h3 className="card-label" style={{ marginBottom: 16 }}>// ACTIVITY HEATMAP — LAST 90 DAYS</h3>
                  <div className="heatmap-container">
                    {Object.entries(progressData.heatmap)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([date, count]: [string, any]) => (
                        <div
                          key={date}
                          className="heatmap-cell"
                          title={`${date}: ${count} session${count !== 1 ? 's' : ''}`}
                          style={{
                            background: count === 0 ? 'rgba(0,212,255,0.05)' :
                              count === 1 ? 'rgba(0,212,255,0.25)' :
                              count === 2 ? 'rgba(0,212,255,0.5)' :
                              'rgba(0,212,255,0.8)',
                          }}
                        />
                      ))}
                  </div>
                  <div className="heatmap-legend">
                    <span className="mono" style={{ fontSize: '0.7rem', color: '#6b86a0' }}>Less</span>
                    <div className="heatmap-cell" style={{ background: 'rgba(0,212,255,0.05)', width: 12, height: 12 }} />
                    <div className="heatmap-cell" style={{ background: 'rgba(0,212,255,0.25)', width: 12, height: 12 }} />
                    <div className="heatmap-cell" style={{ background: 'rgba(0,212,255,0.5)', width: 12, height: 12 }} />
                    <div className="heatmap-cell" style={{ background: 'rgba(0,212,255,0.8)', width: 12, height: 12 }} />
                    <span className="mono" style={{ fontSize: '0.7rem', color: '#6b86a0' }}>More</span>
                  </div>
                </div>

                {/* ── ROW 4: Badge Collection ── */}
                <div className="glass-panel">
                  <h3 className="card-label" style={{ marginBottom: 20 }}>// BADGE COLLECTION</h3>
                  <div className="badge-grid">
                    {ALL_BADGES.map(badge => {
                      const earned = progressData.badges.find((b: any) => b.badge_id === badge.id);
                      return (
                        <div key={badge.id} className={`badge-tile ${earned ? 'earned' : 'locked'}`}>
                          <span className="bt-icon">{badge.icon}</span>
                          <div className="bt-info">
                            <span className="bt-name orbitron">{badge.name}</span>
                            <span className="bt-desc mono">{badge.desc}</span>
                            {earned && <span className="bt-date mono">EARNED {new Date(earned.earned_at).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── ROW 5: Strengths & Weaknesses ── */}
                <div className="progress-sw-grid">
                  <div className="glass-panel sw-panel">
                    <h3 className="card-label" style={{ color: '#00ff88' }}>// STRENGTHS ▲</h3>
                    {progressData.strengths.length > 0 ? progressData.strengths.map((s: any, i: number) => (
                      <div key={i} className="sw-row">
                        <div className="sw-rank" style={{ color: '#00ff88' }}>#{i + 1}</div>
                        <div className="sw-info">
                          <span className="orbitron" style={{ fontSize: '0.85rem' }}>{s.name}</span>
                          <span className="mono" style={{ fontSize: '0.75rem', color: '#6b86a0' }}>{s.type}</span>
                        </div>
                        <div className="sw-score mono" style={{ color: '#00ff88' }}>{s.avgScore}/100</div>
                      </div>
                    )) : (
                      <p className="mono" style={{ color: '#4a6070', fontSize: '0.85rem' }}>Complete labs to see strengths</p>
                    )}
                  </div>
                  <div className="glass-panel sw-panel">
                    <h3 className="card-label" style={{ color: '#ff4444' }}>// WEAKNESSES ▼</h3>
                    {progressData.weaknesses.length > 0 ? progressData.weaknesses.map((s: any, i: number) => (
                      <div key={i} className="sw-row">
                        <div className="sw-rank" style={{ color: '#ff4444' }}>#{i + 1}</div>
                        <div className="sw-info">
                          <span className="orbitron" style={{ fontSize: '0.85rem' }}>{s.name}</span>
                          <span className="mono" style={{ fontSize: '0.75rem', color: '#6b86a0' }}>{s.type}</span>
                        </div>
                        <div className="sw-score mono" style={{ color: '#ff4444' }}>{s.avgScore}/100</div>
                      </div>
                    )) : (
                      <p className="mono" style={{ color: '#4a6070', fontSize: '0.85rem' }}>Complete labs to see weaknesses</p>
                    )}
                  </div>
                </div>

                {/* ── ROW 6: Session History Table ── */}
                <div className="glass-panel">
                  <h3 className="card-label" style={{ marginBottom: 20 }}>// SESSION HISTORY</h3>
                  {progressData.sessions.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="lb-table">
                        <thead>
                          <tr>
                            <th>LAB</th>
                            <th>DATE</th>
                            <th>DURATION</th>
                            <th>ATK SCORE</th>
                            <th>DEF SCORE</th>
                            <th>QUIZ</th>
                            <th>GRADE</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {progressData.sessions.map((s: any) => (
                            <tr key={s.id}>
                              <td style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.8rem' }}>{s.scenario_id}</td>
                              <td>{new Date(s.started_at).toLocaleDateString()}</td>
                              <td>{s.duration_seconds ? `${Math.floor(s.duration_seconds / 60)}:${String(s.duration_seconds % 60).padStart(2, '0')}` : '—'}</td>
                              <td>
                                <div className="mini-bar-container">
                                  <div className="mini-bar-fill" style={{ width: `${s.attacker_score || 0}%`, background: '#00d4ff' }}></div>
                                </div>
                                <span>{s.attacker_score ?? '—'}</span>
                              </td>
                              <td>
                                <div className="mini-bar-container">
                                  <div className="mini-bar-fill" style={{ width: `${s.defender_score || 0}%`, background: '#00ff88' }}></div>
                                </div>
                                <span>{s.defender_score ?? '—'}</span>
                              </td>
                              <td>{s.quiz_score ?? '—'}/5</td>
                              <td>
                                <span className={`grade-pill ${s.grade?.startsWith('A') ? 'grade-a' : s.grade?.startsWith('B') ? 'grade-b' : 'grade-c'}`}>
                                  {s.grade || '—'}
                                </span>
                              </td>
                              <td>
                                <button className="btn-report" onClick={() => router.push(`/report/${s.id}`)}>VIEW →</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="mono" style={{ color: '#4a6070', textAlign: 'center', padding: 30 }}>No sessions yet. Launch a lab!</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {view === "leaderboard" && (
          <div className="dashboard-container fade-in">
            <h1 className="orbitron section-header">◈ LEADERBOARD</h1>
            <div className="glass-panel">
              <table className="lb-table">
                <thead><tr><th>RANK</th><th>OPERATOR</th><th>SCORE</th><th>LEVEL</th><th>STATUS</th></tr></thead>
                <tbody>
                  {leaderboard.length > 0 ? (
                    <>
                      {leaderboard.map((entry: any, i: number) => {
                        const rank = entry.rank || i + 1;
                        const isTop3 = rank <= 3;
                        const rankColor = rank === 1 ? "#ffd700" : rank === 2 ? "#c0c0c0" : rank === 3 ? "#cd7f32" : "inherit";
                        
                        return (
                          <tr key={i} className={`${entry.user_id === (session?.user as any)?.id ? 'highlight' : ''} ${isTop3 ? 'top-rank' : ''}`}>
                            <td style={{ color: rankColor, fontWeight: isTop3 ? 'bold' : 'normal' }}>
                              <span style={{ fontSize: isTop3 ? '1.5rem' : '1rem' }}>
                                {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className={isTop3 ? 'orbitron' : ''}>{entry.name || `OPERATOR_${String(entry.user_id).slice(0, 4).toUpperCase()}`}</span>
                                {isTop3 && (
                                  <span className="mono" style={{ 
                                    fontSize: '0.65rem', 
                                    padding: '2px 6px', 
                                    borderRadius: '4px', 
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    border: `1px solid ${rankColor}`,
                                    color: rankColor
                                  }}>
                                    {rank === 1 ? "ELITE" : "PRO"}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="orbitron" style={{ color: '#00d4ff' }}>{entry.score ?? 0}</td>
                            <td><span className="mono">LV{entry.level ?? 1}</span></td>
                            <td><span className="pulse-dot-sm">●</span> ONLINE</td>
                          </tr>
                        );
                      })}
                      {/* Personal Rank Sticky Footer (only if not already in the visible list) */}
                      {!leaderboard.some((e: any) => e.user_id === (session?.user as any)?.id) && userStats && (
                        <tr className="highlight sticky-rank">
                          <td>#{userStats.rank || "—"}</td>
                          <td>{session?.user?.name || "YOU"} (YOU)</td>
                          <td>{userStats.totalScore || 0}</td>
                          <td>LV{userStats.level || 1}</td>
                          <td><span className="pulse-dot-sm">●</span> ONLINE</td>
                        </tr>
                      )}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#6b86a0', fontFamily: 'Share Tech Mono' }}>
                        NO OPERATORS RANKED YET. BE THE FIRST!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      <style jsx>{`
        :global(body) { background: #0a1628; margin: 0; padding: 0; color: #fff; font-family: 'Exo 2', sans-serif; overflow: hidden; }
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
        .scenario-card.completed-scen { border-color: #00ff8844; }
        .scenario-card.completed-scen:hover { border-color: #00ff88; }
        .solved-badge {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #00ff88;
          color: #050f1c;
          font-size: 0.6rem;
          padding: 4px 8px;
          font-weight: 900;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
          z-index: 5;
          transform: rotate(5deg);
        }
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
        .sticky-rank {
          position: sticky;
          bottom: 0;
          background: rgba(0, 255, 136, 0.2) !important;
          border-top: 2px solid #00ff88 !important;
          backdrop-filter: blur(10px);
          z-index: 10;
        }
        .pulse-dot-sm { color: #00ff88; animation: pulse 2s infinite; font-size: 0.7rem; }

        /* ─── PROGRESS PAGE STYLES ─── */
        .certificate-banner { display: flex; justify-content: space-between; align-items: center; border-color: #00ff88; box-shadow: 0 0 20px rgba(0, 255, 136, 0.2); background: linear-gradient(90deg, rgba(0,255,136,0.05), rgba(0,0,0,0)); margin-bottom: 20px; transition: 0.3s ease; }
        .cert-info { display: flex; align-items: center; gap: 20px; }
        .cert-icon { font-size: 3rem; filter: drop-shadow(0 0 10px rgba(0, 255, 136, 0.6)); }
        .cert-text h3 { margin: 0; color: #00ff88; font-size: 1.2rem; text-shadow: 0 0 5px rgba(0, 255, 136, 0.5); }
        .cert-text p { margin: 5px 0 0 0; color: #c8e6f0; font-size: 0.9rem; }
        .btn-cert { background: linear-gradient(90deg, #00ff88, #00d4ff); color: #050f1c; font-family: 'Orbitron'; font-weight: bold; border: none; padding: 12px 24px; cursor: pointer; transition: 0.3s; clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); }
        .btn-cert:hover { box-shadow: 0 0 15px rgba(0, 255, 136, 0.4); transform: translateY(-2px); }

        .certificate-banner.locked { border-color: rgba(255,255,255,0.1); box-shadow: none; background: rgba(0,0,0,0.2); opacity: 0.6; filter: grayscale(50%); }
        .certificate-banner.locked .cert-icon { filter: grayscale(100%) opacity(0.5); font-size: 2.5rem; padding-left: 5px; }
        .certificate-banner.locked .cert-text h3 { color: #6b86a0; text-shadow: none; }
        .certificate-banner.locked .btn-cert { background: rgba(255,255,255,0.05); color: #6b86a0; cursor: not-allowed; box-shadow: none; transform: none; }

        .progress-stats-row-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .progress-stat-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }

        /* Lab Map */
        .lab-map-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .lab-map-tile {
          background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 14px;
          display: flex; flex-direction: column; gap: 6px; position: relative; transition: all 0.3s; cursor: pointer;
        }
        .lab-map-tile.completed { border-color: rgba(0,255,136,0.3); }
        .lab-map-tile.completed:hover { border-color: #00ff88; box-shadow: 0 0 12px rgba(0,255,136,0.2); }
        .lab-map-tile.not_started { opacity: 0.5; }
        .lab-map-tile.not_started:hover { opacity: 0.8; border-color: rgba(0,212,255,0.3); }
        .lmt-header { display: flex; justify-content: space-between; align-items: center; }
        .lmt-name { font-size: 0.75rem; font-weight: bold; }
        .lmt-grade { font-size: 0.65rem; padding: 2px 6px; border-radius: 3px; font-weight: bold; }
        .grade-a { background: rgba(0,255,136,0.2); color: #00ff88; }
        .grade-b { background: rgba(0,212,255,0.2); color: #00d4ff; }
        .grade-c { background: rgba(255,68,68,0.2); color: #ff4444; }
        .lmt-type { font-size: 0.65rem; color: #6b86a0; }
        .lmt-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .lmt-diff { font-size: 0.6rem; font-family: 'Share Tech Mono', monospace; }
        .lmt-check { position: absolute; top: 8px; right: 8px; color: #00ff88; font-size: 0.7rem; font-weight: bold; }

        /* Activity Heatmap */
        .heatmap-container { display: flex; flex-wrap: wrap; gap: 3px; }
        .heatmap-cell { width: 10px; height: 10px; border-radius: 2px; }
        .heatmap-legend { display: flex; align-items: center; gap: 4px; margin-top: 12px; }

        /* Badge Grid */
        .badge-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .badge-tile {
          display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 6px;
          background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.08); transition: 0.3s;
        }
        .badge-tile.earned { border-color: rgba(0,255,136,0.3); background: rgba(0,255,136,0.03); }
        .badge-tile.earned:hover { box-shadow: 0 0 12px rgba(0,255,136,0.2); }
        .badge-tile.locked { opacity: 0.4; filter: grayscale(0.8); }
        .bt-icon { font-size: 2rem; min-width: 40px; text-align: center; }
        .bt-info { display: flex; flex-direction: column; gap: 2px; }
        .bt-name { font-size: 0.8rem; }
        .bt-desc { font-size: 0.7rem; color: #6b86a0; }
        .bt-date { font-size: 0.65rem; color: #00ff88; margin-top: 4px; }

        /* Strengths & Weaknesses */
        .progress-sw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .sw-panel { display: flex; flex-direction: column; gap: 12px; }
        .sw-row { display: flex; align-items: center; gap: 12px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 4px; }
        .sw-rank { font-family: 'Orbitron', sans-serif; font-size: 1.2rem; font-weight: bold; min-width: 40px; text-align: center; }
        .sw-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .sw-score { font-size: 0.9rem; font-weight: bold; }

        /* Mini bar in session table */
        .mini-bar-container { width: 60px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-bottom: 4px; overflow: hidden; }
        .mini-bar-fill { height: 100%; border-radius: 2px; }

        /* Grade pill */
        .grade-pill { padding: 3px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
      `}</style>
    </div>
  );
}
