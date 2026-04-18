"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { scenarios } from "@/lib/scenarios";

type SessionData = {
    id: string;
    scenario_id: string;
    grade: string | null;
    attacker_score: number | null;
    defender_score: number | null;
    quiz_score: number | null;
    tasks_completed: number | null;
    duration_seconds: number | null;
    started_at: string | null;
    ended_at: string | null;
};

export default function ReportPage({ params }: { params: { sessionId: string } }) {
    const router = useRouter();

    const [sessionData, setSessionData] = useState<SessionData | null>(null);

    useEffect(() => {
        // Try to fetch real session data
        fetch(`/api/lab/session/${params.sessionId}`, { cache: "no-store" })
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data) setSessionData(data); })
            .catch(() => null);
    }, [params.sessionId]);

    // ── GRADE CALCULATION ENGINE (Fallback) ──
    const calculateGrade = (score: number): string => {
        if (score >= 90) return "S+";
        if (score >= 80) return "A";
        if (score >= 70) return "B+";
        if (score >= 60) return "B";
        if (score >= 45) return "C";
        if (score >= 35) return "D";
        return "F";
    };

    // Derived display values — real data if available, fallback to calculation
    const currentScenarioId = sessionData?.scenario_id || "";
    const currentScenario = scenarios.find(s => s.id === currentScenarioId);
    const scenarioName = currentScenario?.name || currentScenarioId || "Lab";
    const currentIndex = scenarios.findIndex(s => s.id === currentScenarioId);
    const nextScenario = currentIndex >= 0 && currentIndex < scenarios.length - 1 ? scenarios[currentIndex + 1] : scenarios[0];
    
    const attackerScore = sessionData?.attacker_score ?? 0;
    const defenderScore = sessionData?.defender_score ?? 0;
    const quizScore = sessionData?.quiz_score ?? 0;
    const tasksCompleted = sessionData?.tasks_completed ?? 0;

    // Calculate overall score same as backend for consistency
    const totalPossibleQuiz = currentScenario?.quiz?.length || 5;
    const totalPossibleTasks = currentScenario?.tasks?.length || 5;

    const quizPercent = (quizScore / totalPossibleQuiz) * 100;
    const tasksPercent = (tasksCompleted / totalPossibleTasks) * 100;
    
    const overallScore = Math.round(
        attackerScore * 0.3 +
        defenderScore * 0.1 +
        quizPercent * 0.3 +
        tasksPercent * 0.3
    );

    const grade = sessionData?.grade || calculateGrade(overallScore);
    
    const durationSec = sessionData?.duration_seconds ?? 0;
    const durationFmt = sessionData?.ended_at && durationSec > 0
        ? `${String(Math.floor(durationSec / 60)).padStart(2, '0')}:${String(durationSec % 60).padStart(2, '0')}`
        : "00:00";
    const sessionDate = sessionData?.started_at
        ? new Date(sessionData.started_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : "—";

    return (
        <div className="dashboard-root">
            <Navbar />
            <div className="dashboard-content">
                <Sidebar />
                <main className="main-content">
                    <div className="fade-in">

                        {/* ── HEADER SECTION ── */}
                        <div className="header-section">
                            <div className="header-left">
                                <h1 className="orbitron blue">◈ INCIDENT REPORT</h1>
                                <div className="chips-row">
                                    <span className="chip">{scenarioName}</span>
                                    <span className="chip mono">ID_{params.sessionId.toUpperCase().slice(0, 8)}</span>
                                    <span className="chip mono">{sessionDate}</span>
                                    <span className="chip mono">⏱ {durationFmt}</span>
                                </div>
                            </div>

                            <div className="header-right">
                                <div className="score-circle attack-score">
                                    <svg viewBox="0 0 100 100" className="circle-svg">
                                        <circle cx="50" cy="50" r="45" stroke="rgba(0, 212, 255, 0.2)" strokeWidth="6" fill="none" />
                                        <circle cx="50" cy="50" r="45" stroke="#00d4ff" strokeWidth="6" fill="none" strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - attackerScore / 100)} transform="rotate(-90 50 50)" />
                                    </svg>
                                    <div className="circle-content">
                                        <span className="score-num orbitron">{attackerScore}</span>
                                        <span className="score-label mono">ATTACKER<br />SCORE</span>
                                    </div>
                                </div>
                                <div className="score-circle defend-score">
                                    <svg viewBox="0 0 100 100" className="circle-svg">
                                        <circle cx="50" cy="50" r="45" stroke="rgba(0, 255, 136, 0.2)" strokeWidth="6" fill="none" />
                                        <circle cx="50" cy="50" r="45" stroke="#00ff88" strokeWidth="6" fill="none" strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - defenderScore / 100)} transform="rotate(-90 50 50)" />
                                    </svg>
                                    <div className="circle-content">
                                        <span className="score-num orbitron">{defenderScore}</span>
                                        <span className="score-label mono">DEFENDER<br />SCORE</span>
                                    </div>
                                </div>
                            </div>

                            <div className="overall-grade-badge">
                                OVERALL GRADE <b>{grade}</b>
                            </div>
                        </div>

                        {/* ── SECTION 1: ATTACK TIMELINE ── */}
                        <section className="report-section">
                            <h2 className="orbitron">◈ ATTACK TIMELINE</h2>
                            <div className="timeline-container">
                                {[
                                    { time: "00:02", sev: "MEDIUM", sevColor: "#ffcc00", desc: "Reconnaissance phase began — port scan initiated" },
                                    { time: "00:07", sev: "CRITICAL", sevColor: "#ff4444", desc: "SQL injection attempted on /login endpoint" },
                                    { time: "00:11", sev: "CRITICAL", sevColor: "#ff4444", desc: "Authentication bypassed — admin account compromised" },
                                    { time: "00:15", sev: "HIGH", sevColor: "#ff8800", desc: "Database enumeration started" },
                                    { time: "00:18", sev: "CRITICAL", sevColor: "#ff4444", desc: "Data exfiltration initiated — users table targeted" },
                                    { time: "00:21", sev: "BLOCKED", sevColor: "#00ff88", desc: "Defense AI blocked outbound data transfer" },
                                    { time: "00:23", sev: "INFO", sevColor: "#00d4ff", desc: "Session ended by operator" },
                                ].map((event, i, arr) => (
                                    <div className="tl-row" key={i}>
                                        <div className="tl-time mono">{event.time}</div>
                                        <div className="tl-middle">
                                            <div className="tl-dot" style={{ backgroundColor: event.sevColor }}></div>
                                            {i < arr.length - 1 && <div className="tl-line"></div>}
                                        </div>
                                        <div className="tl-event">
                                            <span className="tl-sev mono" style={{ color: event.sevColor }}>{event.sev}</span>
                                            <p className="tl-desc">{event.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ── SECTION 2: ANALYSIS TWO COLUMNS ── */}
                        <section className="report-section dual-columns">
                            {/* Left: What went wrong */}
                            <div className="analysis-col purple-col">
                                <h2 className="orbitron">◈ WHAT WENT WRONG</h2>
                                <div className="card-stack">
                                    <div className="fail-card">
                                        <div className="fc-icon">✗</div>
                                        <div className="fc-body">
                                            <h4 className="orbitron">NO RATE LIMITING</h4>
                                            <p>Login endpoint had no request throttling allowing unlimited attempts</p>
                                        </div>
                                    </div>
                                    <div className="fail-card">
                                        <div className="fc-icon">✗</div>
                                        <div className="fc-body">
                                            <h4 className="orbitron">MISSING WAF RULES</h4>
                                            <p>No Web Application Firewall rules to detect SQL injection patterns</p>
                                        </div>
                                    </div>
                                    <div className="fail-card">
                                        <div className="fc-icon">✗</div>
                                        <div className="fc-body">
                                            <h4 className="orbitron">SLOW DETECTION</h4>
                                            <p>Exfiltration was detected 7 minutes after it began — too slow</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: What Defense AI did well */}
                            <div className="analysis-col green-col">
                                <h2 className="orbitron">◈ WHAT DEFENSE AI DID WELL</h2>
                                <div className="card-stack">
                                    <div className="success-card">
                                        <div className="fc-icon">✓</div>
                                        <div className="fc-body">
                                            <h4 className="orbitron">BLOCKED EXFILTRATION</h4>
                                            <p>Successfully intercepted and blocked the final data transfer attempt</p>
                                        </div>
                                    </div>
                                    <div className="success-card">
                                        <div className="fc-icon">✓</div>
                                        <div className="fc-body">
                                            <h4 className="orbitron">ACCURATE ALERTING</h4>
                                            <p>Generated 4 correct severity alerts with zero false positives</p>
                                        </div>
                                    </div>
                                    <div className="success-card">
                                        <div className="fc-icon">✓</div>
                                        <div className="fc-body">
                                            <h4 className="orbitron">PHASE DETECTION</h4>
                                            <p>Correctly identified all 3 attack phases in real time</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── SECTION 3: SKILL ASSESSMENT ── */}
                        <section className="report-section">
                            <h2 className="orbitron">◈ SKILL ASSESSMENT</h2>
                            <div className="metrics-row">
                                <div className="metric-card">
                                    <div className="mc-val blue orbitron">{quizScore}/{totalPossibleQuiz}</div>
                                    <div className="mc-label mono">QUIZ SCORE</div>
                                    <div className="mc-bar-bg"><div className="mc-bar-fill blue-bg" style={{ width: `${(quizScore / totalPossibleQuiz) * 100}%` }}></div></div>
                                    <div className={`mc-badge mono ${quizScore >= Math.ceil(totalPossibleQuiz * 0.6) ? 'green-bg' : 'orange-bg'}`}>{quizScore >= Math.ceil(totalPossibleQuiz * 0.6) ? 'PASS' : 'FAIL'}</div>
                                </div>
                                <div className="metric-card">
                                    <div className="mc-val yellow orbitron">{tasksCompleted}/{totalPossibleTasks}</div>
                                    <div className="mc-label mono">TASKS COMPLETE</div>
                                    <div className="mc-bar-bg"><div className="mc-bar-fill yellow-bg" style={{ width: `${(tasksCompleted / totalPossibleTasks) * 100}%` }}></div></div>
                                    <div className={`mc-badge mono ${tasksCompleted >= totalPossibleTasks ? 'green-bg' : 'yellow-bg'}`}>{tasksCompleted >= totalPossibleTasks ? 'COMPLETE' : 'PARTIAL'}</div>
                                </div>
                                <div className="metric-card">
                                    <div className="mc-val orange orbitron">{attackerScore}<span style={{ fontSize: '1rem' }}>/100</span></div>
                                    <div className="mc-label mono">ATTACKER SCORE</div>
                                    <div className="mc-bar-bg"><div className="mc-bar-fill orange-bg" style={{ width: `${attackerScore}%` }}></div></div>
                                    <div className="mc-badge orange-bg mono">DETECTED</div>
                                    <div className="mc-sub">Based on session activity</div>
                                </div>
                                <div className="metric-card grade-card">
                                    <div className="mc-grade orbitron">{grade}</div>
                                    <div className="mc-label mono">OVERALL GRADE</div>
                                    <p className="mc-desc">Good attack technique, improve stealth</p>
                                </div>
                            </div>
                        </section>

                        {/* ── SECTION 4: BADGES EARNED ── */}
                        <section className="report-section">
                            <h2 className="orbitron">◈ BADGES EARNED THIS SESSION</h2>
                            <div className="badges-row">
                                <div className="badge-card new-badge glow-anim">
                                    <div className="bc-icon">🎯</div>
                                    <div className="bc-info">
                                        <h4 className="orbitron">FIRST BLOOD</h4>
                                        <p>First successful authentication bypass</p>
                                        <span className="mono bc-pill green">EARNED TODAY</span>
                                    </div>
                                </div>
                                <div className="badge-card owned-badge">
                                    <div className="bc-icon">⚡</div>
                                    <div className="bc-info">
                                        <h4 className="orbitron">SPEED RUN</h4>
                                        <p className="muted">Already in collection</p>
                                    </div>
                                </div>
                                <div className="badge-card locked-badge">
                                    <div className="bc-icon">🔒</div>
                                    <div className="bc-info">
                                        <h4 className="orbitron">ELITE HACKER</h4>
                                        <p className="muted">Complete 5 advanced labs to unlock</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── SECTION 5: RECOMMENDATIONS ── */}
                        <section className="report-section">
                            <h2 className="orbitron">◈ SKILLS TO IMPROVE</h2>
                            <div className="rec-row">
                                <div className="rec-card">
                                    <div className="rec-icon">📚</div>
                                    <h4 className="orbitron">LEARN: Web Application Firewalls</h4>
                                    <p>Understanding WAF rules will help you bypass them more effectively</p>
                                    <a href="#" className="rec-link mono blue">READ MORE →</a>
                                </div>
                                <div className="rec-card">
                                    <div className="rec-icon">🔨</div>
                                    <h4 className="orbitron">PRACTICE: Log Analysis</h4>
                                    <p>You triggered too many alerts. Practice low and slow attack techniques</p>
                                    <a href="#" className="rec-link mono blue">PRACTICE LAB →</a>
                                </div>
                                <div className="rec-card recommended-next">
                                    <div className="rec-icon">➡️</div>
                                    <h4 className="orbitron">NEXT SCENARIO RECOMMENDED</h4>
                                    <p className="blue">{nextScenario.name} — {nextScenario.category}</p>
                                    <Link href={`/lab/${nextScenario.id}`} className="rec-btn mono">▶ LAUNCH NOW</Link>
                                </div>
                            </div>
                        </section>

                        {/* ── SECTION 6: ACTION BUTTONS ROW ── */}
                        <div className="bottom-actions">
                            <button className="btn-action mono" onClick={() => router.push('/dashboard')}>↩ BACK TO DASHBOARD</button>
                            <button className="btn-action mono" onClick={() => router.push(`/lab/${currentScenarioId || params.sessionId}`)}>🔁 TRY AGAIN</button>
                            <button className="btn-action mono disabled" title="Coming soon">📄 EXPORT PDF</button>
                            <button className="btn-action primary mono" onClick={() => router.push(`/lab/${nextScenario.id}`)}>▶ NEXT SCENARIO</button>
                        </div>

                    </div>
                </main>
            </div>

            {/* ─────────────────── STYLES ─────────────────── */}
            <style jsx>{`
                .dashboard-root {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    background: #0a1628;
                    color: #fff;
                    background-image: radial-gradient(rgba(0,212,255,0.05) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                .dashboard-content {
                    display: flex;
                    margin-top: 60px;
                    height: calc(100vh - 60px);
                }
                .main-content {
                    flex: 1;
                    margin-left: 220px;
                    overflow-y: auto;
                    padding: 40px;
                }
                .fade-in { animation: fadeIn 0.4s ease-out; max-width: 1100px; margin: 0 auto; padding-bottom: 60px; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .orbitron { font-family: 'Orbitron', sans-serif; letter-spacing: 1px; }
                .mono { font-family: 'Share Tech Mono', monospace; }
                .blue { color: #00d4ff; }
                .muted { color: rgba(255,255,255,0.5); }
                
                h2 { margin-top: 0; border-bottom: 1px solid rgba(0,212,255,0.2); padding-bottom: 10px; margin-bottom: 24px; font-size: 1.2rem; }

                /* HEADER */
                .header-section {
                    display: flex;
                    justify-content: space-between;
                    background: #091a2e;
                    border: 1px solid rgba(0,212,255,0.2);
                    padding: 30px;
                    border-radius: 8px;
                    position: relative;
                    margin-bottom: 40px;
                }
                .header-left h1 { margin: 0 0 16px 0; font-size: 1.8rem; }
                .chips-row { display: flex; gap: 12px; flex-wrap: wrap; }
                .chip {
                    background: rgba(0,212,255,0.1);
                    border: 1px solid rgba(0,212,255,0.3);
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    color: #00d4ff;
                }
                .header-right { display: flex; gap: 24px; }
                .score-circle {
                    position: relative;
                    width: 100px; height: 100px;
                    display: flex; justify-content: center; align-items: center;
                }
                .circle-svg { position: absolute; top:0; left:0; width: 100%; height: 100%; }
                .circle-content { text-align: center; position: relative; z-index: 2; line-height: 1.2; }
                .score-num { font-size: 1.8rem; display: block; }
                .attack-score .score-num { color: #00d4ff; }
                .defend-score .score-num { color: #00ff88; }
                .score-label { font-size: 0.65rem; color: rgba(255,255,255,0.7); }
                .overall-grade-badge {
                    position: absolute;
                    bottom: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(90deg, #00d4ff, #00ff88);
                    color: #000;
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-family: 'Orbitron', sans-serif;
                    font-weight: 700;
                    box-shadow: 0 0 15px rgba(0,255,136,0.4);
                }

                /* SECTION 1: TIMELINE */
                .report-section {
                    background: #091a2e;
                    border: 1px solid rgba(0,212,255,0.1);
                    border-radius: 8px;
                    padding: 24px;
                    margin-bottom: 32px;
                }
                .timeline-container { display: flex; flex-direction: column; }
                .tl-row { display: flex; align-items: flex-start; }
                .tl-time { width: 80px; padding-top: 4px; color: #00ff88; text-align: right; }
                .tl-middle {
                    width: 40px; display: flex; flex-direction: column; align-items: center;
                    position: relative; margin: 0 10px;
                }
                .tl-dot {
                    width: 12px; height: 12px; border-radius: 50%;
                    margin-top: 6px; z-index: 2;
                    box-shadow: 0 0 8px currentColor;
                }
                .tl-line {
                    width: 2px; height: calc(100% + 10px);
                    background: rgba(255,255,255,0.1);
                    position: absolute; top: 18px;
                }
                .tl-event { flex: 1; padding-bottom: 20px; }
                .tl-sev { font-size: 0.8rem; font-weight: bold; padding: 2px 6px; background: rgba(255,255,255,0.05); border-radius: 4px; border: 1px solid currentColor; margin-right: 12px; }
                .tl-desc { display: inline; color: #ccc; margin:0; line-height: 1.5; }

                /* SECTION 2: DUAL COLUMNS */
                .dual-columns { display: flex; gap: 24px; background: transparent; border: none; padding: 0; }
                .analysis-col {
                    flex: 1; padding: 24px; border-radius: 8px; border: 1px solid transparent;
                }
                .purple-col { background: rgba(187,136,255,0.05); border-color: rgba(187,136,255,0.2); }
                .purple-col h2 { color: #bb88ff; border-color: rgba(187,136,255,0.2); }
                .green-col { background: rgba(0,255,136,0.05); border-color: rgba(0,255,136,0.2); }
                .green-col h2 { color: #00ff88; border-color: rgba(0,255,136,0.2); }
                .card-stack { display: flex; flex-direction: column; gap: 16px; }
                .fail-card, .success-card {
                    display: flex; background: rgba(0,0,0,0.3); padding: 16px; border-radius: 6px; border-left: 3px solid;
                }
                .fail-card { border-color: #bb88ff; }
                .success-card { border-color: #00ff88; }
                .fc-icon { font-size: 1.5rem; margin-right: 16px; font-weight: bold; }
                .fail-card .fc-icon { color: #bb88ff; }
                .success-card .fc-icon { color: #00ff88; }
                .fc-body h4 { margin: 0 0 6px 0; font-size: 0.9rem; letter-spacing: 0.5px; }
                .fc-body p { margin: 0; font-size: 0.9rem; color: #bbb; line-height: 1.4; }

                /* SECTION 3: SKILL ASSESSMENT */
                .metrics-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
                .metric-card {
                    background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 6px; text-align: center;
                }
                .mc-val { font-size: 2.2rem; line-height: 1; margin-bottom: 8px; }
                .yellow { color: #ffcc00; }
                .orange { color: #ff8800; }
                .mc-label { font-size: 0.8rem; color: #888; margin-bottom: 16px; }
                .mc-bar-bg { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 12px; overflow: hidden; }
                .mc-bar-fill { height: 100%; border-radius: 3px; }
                .blue-bg { background: #00d4ff; }
                .yellow-bg { background: #ffcc00; }
                .orange-bg { background: #ff8800; }
                .green-bg { background: #00ff88; }
                .mc-badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; color: #000; font-weight: bold; }
                .mc-sub { font-size: 0.75rem; color: #ff8800; margin-top: 8px; }
                .grade-card { display: flex; flex-direction: column; justify-content: center; background: linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,255,136,0.1)); border-color: rgba(0,212,255,0.3); }
                .mc-grade { font-size: 3.5rem; background: -webkit-linear-gradient(#00d4ff, #00ff88); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; margin-bottom: 8px; }
                .mc-desc { font-size: 0.85rem; color: #ccc; margin: 0; line-height: 1.4; }

                /* SECTION 4: BADGES */
                .badges-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
                .badge-card { display: flex; align-items: center; padding: 16px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; }
                .bc-icon { font-size: 2.5rem; margin-right: 16px; width: 50px; text-align: center; }
                .bc-info h4 { margin: 0 0 4px 0; font-size: 0.95rem; }
                .bc-info p { margin: 0 0 8px 0; font-size: 0.8rem; color: #aaa; }
                .new-badge { border-color: rgba(0,255,136,0.5); background: rgba(0,255,136,0.05); }
                .glow-anim { position: relative; }
                .glow-anim::after { content: ''; position: absolute; inset: -1px; border-radius: 6px; border: 1px solid #00ff88; box-shadow: 0 0 10px rgba(0,255,136,0.3); pointer-events: none; animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; box-shadow: 0 0 15px rgba(0,255,136,0.6); } 100% { opacity: 0.6; } }
                .bc-pill { padding: 3px 8px; border-radius: 4px; font-size: 0.7rem; color: #000; background: #00ff88; font-weight: bold; }
                .owned-badge { opacity: 0.7; }
                .locked-badge { opacity: 0.4; filter: grayscale(1); }

                /* SECTION 5: REC */
                .rec-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
                .rec-card { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 6px; display: flex; flex-direction: column; }
                .rec-icon { font-size: 1.8rem; margin-bottom: 12px; }
                .rec-card h4 { margin: 0 0 8px 0; font-size: 0.95rem; }
                .rec-card p { margin: 0 0 16px 0; font-size: 0.85rem; color: #aaa; flex: 1; line-height: 1.4; }
                .rec-link { font-size: 0.85rem; text-decoration: none; }
                .rec-link:hover { text-decoration: underline; }
                .recommended-next { background: rgba(0,212,255,0.05); border-color: rgba(0,212,255,0.3); }
                .rec-btn { background: #00d4ff; color: #000; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 0.85rem; text-align: center; transition: 0.2s; }
                .rec-btn:hover { background: #fff; box-shadow: 0 0 10px rgba(0,212,255,0.5); }

                /* SECTION 6: ACTIONS */
                .bottom-actions { display: flex; gap: 16px; margin-top: 40px; }
                .btn-action {
                    flex: 1; padding: 16px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); 
                    color: #fff; cursor: pointer; border-radius: 6px; transition: 0.2s; font-size: 0.9rem;
                }
                .btn-action:hover:not(.disabled) { background: rgba(255,255,255,0.1); border-color: #00d4ff; color: #00d4ff; }
                .btn-action.primary { background: rgba(0,212,255,0.1); border-color: #00d4ff; color: #00d4ff; }
                .btn-action.primary:hover { background: #00d4ff; color: #000; box-shadow: 0 0 15px rgba(0,212,255,0.4); }
                .btn-action.disabled { opacity: 0.3; cursor: not-allowed; }

            `}</style>
        </div>
    );
}
