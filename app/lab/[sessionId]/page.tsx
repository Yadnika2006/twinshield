"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ScenarioEngine from "@/components/lab/ScenarioEngine";
import QuizPanel from "@/components/lab/QuizPanel";

import { getScenario } from "@/lib/scenarios";

const OPTION_LABELS = ["A", "B", "C", "D"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LabPage({ params }: { params: { sessionId: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const scenarioQuery = searchParams.get('scenario');
    const [fetchedScenarioId, setFetchedScenarioId] = useState<string | null>(null);
    const [dbSessionId, setDbSessionId] = useState<string | null>(null);

    useEffect(() => {
        // If we have a query param, it takes priority
        if (scenarioQuery) return;

        // If sessionId in URL is not a UUID, it's likely a scenario slug (fallback)
        if (!params.sessionId.includes('-')) return;

        // If it looks like a UUID, fetch the actual session to get the scenarioId
        fetch(`/api/lab/session/${params.sessionId}`)
            .then(r => r.json())
            .then(data => {
                if (data.scenario_id) {
                    setFetchedScenarioId(data.scenario_id);
                    setDbSessionId(params.sessionId);
                }
            })
            .catch(err => console.error("Session lookup failed:", err));
    }, [params.sessionId, scenarioQuery]);

    const finalScenarioId = scenarioQuery || fetchedScenarioId || params.sessionId;
    const SCENARIO = getScenario(finalScenarioId);

    // ── Tab state ──────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState(1);
    const [completedTabs, setCompletedTabs] = useState<number[]>([]);
    const [labComplete, setLabComplete] = useState(false);
    const [labOutcome, setLabOutcome] = useState<string>('');

    // ── Timer ──────────────────────────────────────────────────────────────────
    const [timer, setTimer] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
        if (!timerActive) return;
        const id = setInterval(() => setTimer((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, [timerActive]);

    const fmtTime = (s: number) => {
        const h = String(Math.floor(s / 3600)).padStart(2, "0");
        const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
        const sec = String(s % 60).padStart(2, "0");
        return `${h}:${m}:${sec}`;
    };

    // ── Quiz state ─────────────────────────────────────────────────────────────
    const [quizTotalScore, setQuizTotalScore] = useState(0);

    // ── Task state ─────────────────────────────────────────────────────────────
    const [completedTasks, setCompletedTasks] = useState<number[]>([]);
    const [taskAnswers, setTaskAnswers] = useState<Record<number, string>>({});
    const [taskCorrect, setTaskCorrect] = useState<Record<number, boolean | null>>({});
    const [wrongAttempts, setWrongAttempts] = useState<Record<number, number>>({});
    const [taskTimestamps, setTaskTimestamps] = useState<Record<number, string>>({});
    const [taskLoading, setTaskLoading] = useState<number | null>(null);
    const [xpReward, setXpReward] = useState<Record<number, number>>({});

    const markTaskDone = (taskId: number, xp?: number) => {
        const now = new Date().toLocaleTimeString();
        setCompletedTasks(prev => prev.includes(taskId) ? prev : [...prev, taskId]);
        setTaskTimestamps(prev => ({ ...prev, [taskId]: now }));
        if (xp) setXpReward(prev => ({ ...prev, [taskId]: xp }));
    };

    const submitChecklist = async (taskId: number) => {
        setTaskLoading(taskId);
        if (dbSessionId) {
            try {
                const res = await fetch('/api/lab/task', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: dbSessionId, scenarioId: SCENARIO?.id, taskId, type: 'checklist' }),
                });
                const data = await res.json();
                markTaskDone(taskId, data.xpAwarded);
            } catch { markTaskDone(taskId); }
        } else {
            markTaskDone(taskId);
        }
        setTaskLoading(null);
    };

    const submitAnswer = async (taskId: number) => {
        const answer = (taskAnswers[taskId] || '').trim();
        if (!answer) return;
        setTaskLoading(taskId);
        if (dbSessionId) {
            try {
                const res = await fetch('/api/lab/task', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: dbSessionId, scenarioId: SCENARIO?.id, taskId, type: 'question', answer }),
                });
                const data = await res.json();
                if (data.correct) {
                    setTaskCorrect(prev => ({ ...prev, [taskId]: true }));
                    markTaskDone(taskId, data.xpAwarded);
                } else {
                    setTaskCorrect(prev => ({ ...prev, [taskId]: false }));
                    setWrongAttempts(prev => ({ ...prev, [taskId]: (prev[taskId] || 0) + 1 }));
                }
            } catch {
                // Fallback: local check
                const task = SCENARIO?.tasks.find(t => t.id === taskId);
                const correct = answer.toLowerCase() === (task?.expectedAnswer || '').trim().toLowerCase();
                if (correct) { setTaskCorrect(prev => ({ ...prev, [taskId]: true })); markTaskDone(taskId); }
                else { setTaskCorrect(prev => ({ ...prev, [taskId]: false })); setWrongAttempts(prev => ({ ...prev, [taskId]: (prev[taskId] || 0) + 1 })); }
            }
        } else {
            const task = SCENARIO?.tasks.find(t => t.id === taskId);
            const correct = answer.toLowerCase() === (task?.expectedAnswer || '').trim().toLowerCase();
            if (correct) { setTaskCorrect(prev => ({ ...prev, [taskId]: true })); markTaskDone(taskId); }
            else { setTaskCorrect(prev => ({ ...prev, [taskId]: false })); setWrongAttempts(prev => ({ ...prev, [taskId]: (prev[taskId] || 0) + 1 })); }
        }
        setTaskLoading(null);
    };

    const allDone = SCENARIO ? completedTasks.length === SCENARIO.tasks.length : false;

    // ── Helpers ────────────────────────────────────────────────────────────────
    const goTab = (n: number) => {
        if (n === 4 && !completedTabs.includes(3)) return;
        setActiveTab(n);
    };

    const startLab = async () => {
        setCompletedTabs((prev) => prev.includes(1) ? prev : [...prev, 1]);
        setTimerActive(true);
        // Create DB session
        try {
            const res = await fetch('/api/lab/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenarioId: SCENARIO?.id }),
            });
            if (res.ok) {
                const data = await res.json();
                setDbSessionId(data.sessionId);
            }
        } catch (e) {
            // Continue without DB session if API fails
        }
        goTab(2);
    };

    const endSession = () => {
        setCompletedTabs((prev) => prev.includes(2) ? prev : [...prev, 2]);
        setTimerActive(false);
        goTab(4);
    };

    // ─────────────────────────────────────────────────────────────────────────

    if (!SCENARIO) {
        return (
            <div className="lab-root">
                <Navbar />
                <div className="lab-navbar" style={{ justifyContent: 'center' }}>
                    <span className="scen-name orbitron">SCENARIO NOT FOUND</span>
                </div>
            </div>
        );
    }

    const diffColorMap: Record<string, string> = {
        "BEGINNER": "#00ff88",
        "INTERMEDIATE": "#ffcc00",
        "ADVANCED": "#ff4444"
    };
    const diffColor = diffColorMap[SCENARIO.difficulty] || "#00d4ff";

    return (
        <div className="lab-root">
            {/* ── NAVBAR ── */}
            <Navbar />

            {/* ── LAB SECONDARY NAVBAR ── */}
            <div className="lab-navbar">
                <div className="lab-nav-left">
                    <span className="scen-name orbitron">{SCENARIO.name}</span>
                    <span className="separator">|</span>
                    <span
                        className="diff-pill"
                        style={{ borderColor: diffColor, color: diffColor }}
                    >
                        {SCENARIO.difficulty}
                    </span>
                    <span className="separator">|</span>
                    <span className="cat-tag mono muted">{SCENARIO.category}</span>
                </div>

                <div className="lab-nav-tabs">
                    {[
                        [1, "OBJECTIVE"],
                        [2, "LAB"],
                        [3, "QUIZ"],
                        [4, "TASKS"],
                    ].map(([num, label]) => {
                        const isActive = activeTab === num;
                        const isCompleted = completedTabs.includes(num as number);
                        const isLocked = num === 4 && !completedTabs.includes(3);
                        return (
                            <button
                                key={num}
                                className={`lab-tab-btn ${isActive ? "active" : ""} ${isCompleted && !isActive ? "completed" : ""} ${isLocked ? "locked" : ""}`}
                                disabled={isLocked}
                                onClick={() => goTab(num as number)}
                            >
                                <span className="tab-num">
                                    {isLocked ? "🔒 " : isCompleted && !isActive ? "✓ " : `0${num} `}
                                </span>
                                <span className="tab-label">{label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="lab-nav-right">
                    <span className="timer-display mono">⏱ {fmtTime(timer)}</span>
                    {activeTab === 2 && (
                        <button
                            className="btn-next-nav"
                            disabled={!labComplete}
                            onClick={() => goTab(3)}
                        >
                            NEXT: QUIZ →
                        </button>
                    )}
                    {activeTab === 3 && (
                        <button
                            className="btn-next-nav"
                            disabled={!completedTabs.includes(3)}
                            onClick={() => goTab(4)}
                        >
                            NEXT: TASKS →
                        </button>
                    )}
                </div>
            </div>

            {/* ── TAB CONTENT ── */}
            <div className="tab-content">

                {/* ════════════════════════════════
            TAB 1 — OBJECTIVE
        ════════════════════════════════ */}
                {activeTab === 1 && (
                    <div className="center-scroll">
                        <div className="obj-container fade-in">

                            {/* Info strip */}
                            <div className="info-strip">
                                <div className="info-chip">🎯 <b>SCENARIO:</b> {SCENARIO.name}</div>
                                <div className="info-chip" style={{ color: diffColor }}>
                                    ⚡ <b>DIFFICULTY:</b> {SCENARIO.difficulty}
                                </div>
                                <div className="info-chip">⏱ <b>EST TIME:</b> {SCENARIO.estimatedTime}</div>
                                <div className="info-chip">🛠 <b>TOOLS:</b> {SCENARIO.tools.join(", ")}</div>
                            </div>

                            {/* What is it */}
                            <section className="obj-section">
                                <h2 className="sec-title">◈ WHAT IS {SCENARIO.category.toUpperCase()}?</h2>
                                <p className="body-text">
                                    {SCENARIO.objective.whatIsIt}
                                </p>
                            </section>

                            {/* How does it work */}
                            <section className="obj-section">
                                <h2 className="sec-title">◈ HOW DOES IT WORK?</h2>
                                <div className="steps-row">
                                    {SCENARIO.objective.howItWorks.map((step, i) => (
                                        <div key={step.step} className="steps-group">
                                            <div className="step-card">
                                                <span className="step-num orbitron">0{step.step}</span>
                                                <p className="step-text"><b>{step.title}:</b> {step.description}</p>
                                            </div>
                                            {i < SCENARIO.objective.howItWorks.length - 1 && <span className="step-arrow">→</span>}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Mission */}
                            <section className="obj-section">
                                <h2 className="sec-title">◈ YOUR MISSION</h2>
                                <div className="mission-list">
                                    {SCENARIO.objective.missions.map((m, i) => (
                                        <div key={i} className="mission-pill">🎯 {m}</div>
                                    ))}
                                </div>
                            </section>

                            {/* Agent Assistance */}
                            <section className="obj-section">
                                <h2 className="sec-title">◈ AGENT ASSISTANCE</h2>
                                <div className="agent-row">
                                    <div className="agent-card purple-card">
                                        <div className="agent-head">
                                            <span className="agent-icon">🧠</span>
                                            <span className="orbitron agent-name">MENTOR AI</span>
                                        </div>
                                        <p>{SCENARIO.objective.mentorAI.intro}</p>
                                        <span className="agent-mode">Mode: Contextual Teaching</span>
                                    </div>
                                    <div className="agent-card green-card">
                                        <div className="agent-head">
                                            <span className="agent-icon">🛡️</span>
                                            <span className="orbitron agent-name">DEFENSE AI</span>
                                        </div>
                                        <p>Monitoring for suspicious activity: {SCENARIO.objective.guardianAI.redFlags[0]}</p>
                                        <span className="agent-mode">Mode: SOC Analyst</span>
                                    </div>
                                </div>
                            </section>

                            <button className="btn-start pulse" onClick={startLab}>
                                ▶ NEXT: START LAB
                            </button>
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════
            TAB 2 — LAB
        ════════════════════════════════ */}
                {activeTab === 2 && (
                    <>
                        <ScenarioEngine
                            scenarioId={SCENARIO.id}
                            onComplete={(outcome) => {
                                setLabComplete(true);
                                setLabOutcome(outcome);
                                setCompletedTabs((prev) => prev.includes(2) ? prev : [...prev, 2]);
                            }}
                        />
                    </>
                )}

                {/* ════════════════════════════════
            TAB 3 — QUIZ
        ════════════════════════════════ */}
                {activeTab === 3 && (
                    <>
                        <QuizPanel
                            scenarioId={SCENARIO.id}
                            sessionId={dbSessionId || params.sessionId}
                            onComplete={(score) => {
                                setQuizTotalScore(score);
                                setCompletedTabs((prev) => prev.includes(3) ? prev : [...prev, 3]);
                            }}
                        />
                    </>
                )}

                {/* ════════════════════════════════
            TAB 4 — TASKS
        ════════════════════════════════ */}
                {activeTab === 4 && (
                    <div className="center-scroll">
                        <div className="tasks-container fade-in">
                            <div className="tasks-header">
                                <h2 className="sec-title green">◈ MISSION TASKS</h2>
                                <div className="overall-progress">
                                    <span className="mono prog-label">
                                        {completedTasks.length} / 5 TASKS COMPLETE
                                    </span>
                                    <div className="prog-bg">
                                        <div
                                            className="prog-fill"
                                            style={{ width: `${(completedTasks.length / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="task-list">
                                {SCENARIO.tasks.map((task) => {
                                    const isDone = completedTasks.includes(task.id);
                                    const isActive = !isDone;
                                    const attempts = wrongAttempts[task.id] || 0;
                                    const showHint = attempts >= 2;
                                    const answerResult = taskCorrect[task.id];

                                    return (
                                        <div key={task.id} className={`task-card ${isDone ? "done" : isActive ? "active" : ""}`}>
                                            <div className="t-icon">{isDone ? "✅" : "⬜"}</div>
                                            <div className="t-body">
                                                <h4 className="orbitron t-name">TASK {task.id} — {task.title}</h4>
                                                <p className="t-desc">{task.description}</p>

                                                {isDone && (
                                                    <div style={{ marginTop: '8px' }}>
                                                        <span className="mono" style={{ color: '#00ff88', display: 'block' }}>✅ Completed at {taskTimestamps[task.id]}</span>
                                                        {xpReward[task.id] && (
                                                            <span className="mono" style={{ color: '#00d4ff', display: 'block', fontSize: '0.82rem' }}>+{xpReward[task.id]} XP awarded</span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* CHECKLIST task */}
                                                {isActive && task.type === 'checklist' && (
                                                    <div className="flag-section mt-4">
                                                        <button
                                                            className="btn-flag"
                                                            disabled={taskLoading === task.id}
                                                            onClick={() => submitChecklist(task.id)}
                                                            style={{ marginTop: '12px', background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }}
                                                        >
                                                            {taskLoading === task.id ? '...' : '☑ MARK AS COMPLETE'}
                                                        </button>
                                                    </div>
                                                )}

                                                {/* QUESTION task */}
                                                {isActive && task.type === 'question' && (
                                                    <div className="flag-section mt-4">
                                                        <p className="mono" style={{ color: '#00d4ff', marginBottom: '10px', fontSize: '0.9rem' }}>❓ {task.question}</p>
                                                        <div className="flag-row mt-2" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                                            <input
                                                                className={`flag-input ${answerResult === false ? 'error' : ''}`}
                                                                type="text"
                                                                placeholder="Type your answer..."
                                                                value={taskAnswers[task.id] || ''}
                                                                onChange={e => setTaskAnswers(prev => ({ ...prev, [task.id]: e.target.value }))}
                                                                onKeyDown={e => e.key === 'Enter' && submitAnswer(task.id)}
                                                            />
                                                            <button
                                                                className="btn-flag"
                                                                disabled={taskLoading === task.id || !(taskAnswers[task.id] || '').trim()}
                                                                onClick={() => submitAnswer(task.id)}
                                                            >
                                                                {taskLoading === task.id ? '...' : 'SUBMIT ANSWER'}
                                                            </button>
                                                        </div>
                                                        {answerResult === false && (
                                                            <span className="mono" style={{ display: 'block', color: '#ff4444', marginBottom: '8px', fontSize: '0.85rem' }}>
                                                                ✗ Incorrect — try again! ({attempts} wrong attempt{attempts !== 1 ? 's' : ''})
                                                            </span>
                                                        )}
                                                        {answerResult === true && (
                                                            <span className="mono" style={{ display: 'block', color: '#00ff88', marginBottom: '8px', fontSize: '0.85rem' }}>✓ Correct!</span>
                                                        )}
                                                        {showHint && (
                                                            <div style={{ padding: '10px 14px', background: 'rgba(255,68,68,0.07)', borderLeft: '3px solid #ff4444', marginTop: '8px' }}>
                                                                <span className="mono" style={{ color: '#ff4444', fontWeight: 'bold' }}>[HINT] </span>
                                                                <span className="mono" style={{ fontSize: '0.85rem' }}>{task.hint}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                className="btn-complete ready"
                                onClick={async () => {
                                    if (dbSessionId) {
                                        // Complete the session in DB
                                        const res = await fetch('/api/lab/complete', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                sessionId: dbSessionId,
                                                duration: timer,
                                                attackerScore: 74,
                                                defenderScore: 61,
                                                quizScore: quizTotalScore,
                                                tasksCompleted: completedTasks.length,
                                            }),
                                        });
                                        if (res.ok) {
                                            // Navigate to the real DB session report
                                            router.push(`/report/${dbSessionId}`);
                                            return;
                                        }
                                    }
                                    // Fallback: use scenario ID
                                    router.push(`/report/${params.sessionId}`);
                                }}
                            >
                                ▶ COMPLETE LAB
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ─────────────────── STYLES ─────────────────── */}
            <style jsx global>{`
        body {
          background: #0a1628;
          margin: 0; padding: 0;
          color: #fff;
          font-family: 'Exo 2', sans-serif;
          overflow: hidden;
        }

        /* ── ROOT ── */
        .lab-root {
          display: flex;
          flex-direction: column;
                    height: calc(100vh - 60px);
                    margin-top: 60px;
          width: 100vw;
          background-image: radial-gradient(rgba(0,212,255,0.08) 1px, transparent 1px);
          background-size: 22px 22px;
        }

        .orbitron { font-family: 'Orbitron', sans-serif; }
        .mono { font-family: 'Share Tech Mono', monospace; }

        /* ── LAB SECONDARY NAVBAR ── */
        .lab-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #091a2e;
          border-bottom: 1px solid rgba(0,212,255,0.25);
          box-shadow: 0 2px 20px rgba(0,212,255,0.1);
          height: 52px;
          flex-shrink: 0;
          z-index: 10;
          position: sticky;
                    top: 0;
        }

        .lab-nav-left { 
            display: flex; 
            align-items: center; 
            gap: 12px; 
            padding-left: 24px;
        }
        .scen-name { font-size: 0.95rem; color: #00d4ff; letter-spacing: 1px; }
        .separator { color: rgba(255,255,255,0.2); }
        .cat-tag { font-size: 0.8rem; color: rgba(255,255,255,0.4); }
        .diff-pill {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          border: 1px solid;
          border-radius: 20px;
          padding: 3px 10px;
        }

        .lab-nav-tabs {
            display: flex;
            height: 100%;
        }
        .lab-tab-btn {
            background: transparent;
            border: none;
            border-bottom: 3px solid transparent;
            color: rgba(255,255,255,0.4);
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.85rem;
            letter-spacing: 0.05em;
            padding: 0 32px;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
            height: 52px;
        }
        .lab-tab-btn:hover {
            color: #00d4ff;
            background: rgba(0,212,255,0.05);
        }
        .lab-tab-btn.active {
            color: #00d4ff;
            background: rgba(0,212,255,0.05);
            border-bottom-color: #00d4ff;
            text-shadow: 0 0 12px rgba(0,212,255,0.4);
        }
        .lab-tab-btn.completed {
            color: #00ff88;
            border-bottom-color: #00ff88;
        }
        .lab-tab-btn.locked,
        .lab-tab-btn:disabled {
            color: rgba(255,255,255,0.28);
            cursor: not-allowed;
            opacity: 0.7;
        }
        .lab-tab-btn.locked:hover,
        .lab-tab-btn:disabled:hover {
            color: rgba(255,255,255,0.28);
            background: transparent;
            text-shadow: none;
        }
        .tab-num { opacity: 0.7; }

        @media (max-width: 768px) {
            .tab-label { display: none; }
        }

                .lab-nav-right {
                    padding-right: 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
        .timer-display { color: #00ff88; font-size: 0.95rem; letter-spacing: 1px; }

                .btn-next-nav {
                    background: linear-gradient(90deg, #00d4ff, #00ff88);
                    border: none;
                    color: #050f1c;
                    font-family: 'Orbitron', sans-serif;
                    font-weight: 800;
                    font-size: 0.72rem;
                    letter-spacing: 0.04em;
                    padding: 8px 12px;
                    cursor: pointer;
                    clip-path: polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%);
                    transition: transform 0.15s, box-shadow 0.15s;
                    box-shadow: 0 0 12px rgba(0, 212, 255, 0.22);
                }

                .btn-next-nav:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 0 16px rgba(0, 255, 136, 0.28);
                }

                .btn-next-nav:disabled {
                    background: rgba(26, 44, 63, 0.95);
                    color: rgba(184, 207, 224, 0.45);
                    border: 1px solid rgba(0, 212, 255, 0.18);
                    box-shadow: none;
                    cursor: not-allowed;
                    clip-path: none;
                }

        /* ── TAB CONTENT SHELL ── */
        .tab-content {
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .center-scroll {
          height: 100%;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          padding: 40px 20px;
        }

        .fade-in {
          animation: fadeSlideUp 0.35s ease-out;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ══════════════ TAB 1 — OBJECTIVE ══════════════ */
        .obj-container {
          width: 100%;
          max-width: 860px;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        /* Info strip */
        .info-strip {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .info-chip {
          background: rgba(0,212,255,0.06);
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 6px;
          padding: 8px 16px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          color: #c8e6f0;
        }
        .info-chip b { color: #00d4ff; margin-right: 4px; }

        /* Section */
        .obj-section { display: flex; flex-direction: column; gap: 16px; }
        .sec-title {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.05rem;
          color: #00d4ff;
          margin: 0;
          letter-spacing: 0.05em;
        }
        .sec-title.green { color: #00ff88; }
        .sec-title.blue  { color: #00d4ff; }
        .body-text {
          color: #b8cfe0;
          line-height: 1.75;
          font-size: 0.95rem;
          margin: 0;
        }

        /* Code block */
        .code-block {
          background: #020c18;
          border: 1px solid rgba(0,255,136,0.25);
          border-left: 4px solid #00ff88;
          padding: 20px 24px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          color: #00ff88;
          white-space: pre;
          line-height: 1.7;
          border-radius: 2px;
        }
        .code-comment { color: #4a6a5a; }
        .code-kw      { color: #00d4ff; }
        .code-inject  { color: #ff4444; font-weight: bold; }

        /* Steps */
        .steps-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .steps-group { display: flex; align-items: center; gap: 8px; flex: 1; }
        .step-card {
          flex: 1;
          background: rgba(0,212,255,0.05);
          border: 1px solid rgba(0,212,255,0.2);
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }
        .step-num {
          font-size: 2rem;
          color: #00d4ff;
          text-shadow: 0 0 10px rgba(0,212,255,0.4);
        }
        .step-text { font-size: 0.85rem; color: #b8cfe0; margin: 0; line-height: 1.5; }
        .step-arrow { font-size: 1.8rem; color: rgba(0,212,255,0.4); flex-shrink: 0; }

        /* Mission */
        .mission-list { display: flex; flex-direction: column; gap: 10px; }
        .mission-pill {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(0,212,255,0.15);
          border-left: 4px solid #00d4ff;
          padding: 14px 20px;
          font-size: 0.95rem;
          color: #c8e6f0;
          border-radius: 2px;
        }

        /* Agent cards */
        .agent-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .agent-card {
          background: rgba(0,0,0,0.25);
          border: 1px solid;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-radius: 2px;
        }
        .agent-card p { margin: 0; font-size: 0.9rem; color: #b8cfe0; }
        .purple-card { border-top-color: var(--purple, #bb88ff); background: linear-gradient(180deg, rgba(187,136,255,0.05) 0%, transparent 100%); }
        .green-card { border-top-color: var(--green); background: linear-gradient(180deg, rgba(0,255,136,0.05) 0%, transparent 100%); }
        .agent-head { display: flex; align-items: center; gap: 10px; }
        .agent-icon { font-size: 1.4rem; }
        .agent-name { font-size: 1rem; color: #fff; }
        .agent-mode { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #6b86a0; }

        /* Start button */
        .btn-start {
          background: linear-gradient(90deg, #00d4ff, #00ff88);
          border: none;
          padding: 18px;
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 1.15rem;
          color: #050f1c;
          cursor: pointer;
          clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .btn-start:hover { transform: scale(0.98); box-shadow: 0 0 24px rgba(0,212,255,0.35); }
        .pulse { animation: pulseGlow 2.5s infinite; }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0   rgba(0,212,255,0.3); }
          50%       { box-shadow: 0 0 18px rgba(0,212,255,0.6); }
        }

        /* ══════════════ TAB 2 — LAB ══════════════ */
        .lab-pane {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }

        .control-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #091a2e;
          border-bottom: 1px solid rgba(0,212,255,0.15);
          padding: 10px 24px;
          flex-shrink: 0;
        }
        .session-status { display: flex; align-items: center; gap: 12px; }
        .pulse-dot {
          color: #00ff88;
          font-size: 0.8rem;
          animation: dotPulse 1.5s infinite;
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; text-shadow: 0 0 6px #00ff88; }
          50%       { opacity: 0.35; text-shadow: none; }
        }
        .session-label { color: #00ff88; font-size: 0.85rem; }
        .timer-val { color: #fff; font-size: 1rem; letter-spacing: 2px; }
        .btn-end {
          background: transparent;
          border: 1px solid #ff4444;
          color: #ff4444;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          padding: 7px 16px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-end:hover { background: rgba(255,68,68,0.15); }

        .lab-columns { display: flex; flex: 1; overflow: hidden; }
        .col-40 { width: 40%; display: flex; flex-direction: column; overflow: hidden; }
        .col-20 { width: 20%; display: flex; flex-direction: column; overflow: hidden; }
        .border-right { border-right: 1px solid rgba(0,212,255,0.2); }

        /* ══════════════ TAB 3 — QUIZ ══════════════ */
        .quiz-container {
          width: 100%;
          max-width: 760px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .quiz-header { display: flex; flex-direction: column; gap: 10px; }
        .muted { color: #6b86a0; font-size: 0.9rem; margin: 0; }
        .q-progress-row { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .q-counter { font-size: 0.85rem; color: #00d4ff; }
        .q-bar-bg { height: 4px; background: #1a2e44; border-radius: 2px; overflow: hidden; }
        .q-bar-fill { height: 100%; background: #00d4ff; transition: width 0.4s ease; border-radius: 2px; }

        .q-card {
          background: #091a2e;
          border: 1px solid rgba(0,212,255,0.2);
          border-top: 3px solid #00d4ff;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .q-text { font-size: 1.1rem; color: #fff; margin: 0; line-height: 1.5; }
        .opts { display: flex; flex-direction: column; gap: 10px; }
        .opt-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 13px 18px;
          color: #b8cfe0;
          font-family: 'Exo 2', sans-serif;
          font-size: 0.95rem;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
          text-align: left;
        }
        .opt-btn:hover { border-color: rgba(0,212,255,0.4); color: #fff; }
        .opt-btn.sel {
          background: rgba(0,212,255,0.12);
          border-color: #00d4ff;
          color: #fff;
        }
        .opt-key {
          font-family: 'Share Tech Mono', monospace;
          color: #00d4ff;
          font-size: 0.9rem;
          min-width: 20px;
        }

        .quiz-nav { display: flex; justify-content: space-between; align-items: center; }
        .btn-nav {
          background: transparent;
          border: 1px solid rgba(0,212,255,0.35);
          color: #00d4ff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          padding: 10px 22px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-nav:hover:not(:disabled) { background: rgba(0,212,255,0.1); }
        .btn-nav:disabled { opacity: 0.3; cursor: not-allowed; }
        .btn-nav.next { border-color: #00d4ff; }
        .btn-submit-quiz {
          background: linear-gradient(90deg, #00d4ff, #00ff88);
          border: none;
          color: #050f1c;
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 12px 28px;
          cursor: pointer;
          clip-path: polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%);
        }
        .btn-submit-quiz:disabled { background: #333; color: #666; cursor: not-allowed; clip-path: none; }

        /* Results */
        .results { display: flex; flex-direction: column; gap: 24px; }
        .score-card {
          background: #091a2e;
          border: 1px solid;
          padding: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .score-card.pass { border-color: rgba(0,255,136,0.4); }
        .score-card.fail { border-color: rgba(255,68,68,0.4); }
        .score-val { font-size: 2rem; color: #fff; }
        .score-bar-bg { width: 100%; height: 10px; background: #0a1628; border-radius: 5px; overflow: hidden; }
        .score-bar-fill { height: 100%; border-radius: 5px; transition: width 0.6s ease; }
        .grade-pill {
          padding: 6px 20px;
          border-radius: 20px;
          font-size: 1rem;
          border: 2px solid;
        }
        .grade-pill.pass { color: #00ff88; border-color: #00ff88; }
        .grade-pill.fail { color: #ff4444; border-color: #ff4444; }

        .result-list { display: flex; flex-direction: column; gap: 8px; }
        .result-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 12px 16px;
          background: rgba(0,0,0,0.2);
          border: 1px solid;
          border-radius: 2px;
        }
        .result-row.correct { border-color: rgba(0,255,136,0.3); }
        .result-row.wrong   { border-color: rgba(255,68,68,0.3); }
        .r-icon { font-size: 1.1rem; font-weight: bold; flex-shrink: 0; margin-top: 2px; }
        .result-row.correct .r-icon { color: #00ff88; }
        .result-row.wrong   .r-icon { color: #ff4444; }
        .r-detail { display: flex; flex-direction: column; gap: 4px; }
        .r-q { font-size: 0.9rem; color: #c8e6f0; }
        .r-ans { font-size: 0.8rem; color: #6b86a0; }
        .r-ans b { color: #00ff88; }

        .btn-proceed {
          background: transparent;
          border: 1px solid #00ff88;
          color: #00ff88;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.9rem;
          padding: 14px;
          cursor: pointer;
          transition: background 0.2s;
          align-self: flex-end;
        }
        .btn-proceed:hover { background: rgba(0,255,136,0.1); }

        /* ══════════════ TAB 4 — TASKS ══════════════ */
        .tasks-container {
          width: 100%;
          max-width: 760px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .tasks-header { display: flex; flex-direction: column; gap: 14px; }
        .overall-progress { display: flex; flex-direction: column; gap: 8px; }
        .prog-label { font-size: 0.85rem; color: #00ff88; }
        .prog-bg { height: 8px; background: #0d1f35; border-radius: 4px; overflow: hidden; }
        .prog-fill { height: 100%; background: linear-gradient(90deg, #00d4ff, #00ff88); border-radius: 4px; transition: width 0.5s ease; }

        .task-list { display: flex; flex-direction: column; gap: 14px; }
        .task-card {
          background: #091a2e;
          border: 1px solid rgba(0,212,255,0.15);
          padding: 20px 24px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
          transition: border-color 0.2s;
        }
        .task-card.done   { border-color: rgba(0,255,136,0.3); background: rgba(0,255,136,0.03); }
        .task-card.active { border-color: #00d4ff; box-shadow: inset 0 0 20px rgba(0,212,255,0.04); }
        .task-card.locked { opacity: 0.45; filter: grayscale(0.7); }

        .t-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 2px; }
        .t-body { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .t-name { font-size: 0.9rem; color: #fff; margin: 0; letter-spacing: 0.05em; }
        .t-desc { font-size: 0.88rem; color: #8aacbf; margin: 0; line-height: 1.5; }
        .t-time { font-size: 0.75rem; color: #00ff88; }

        /* Flag section */
        .flag-section { display: flex; flex-direction: column; gap: 10px; margin-top: 6px; }
        .flag-label { font-size: 0.8rem; color: #6b86a0; }
        .flag-row { display: flex; gap: 8px; }
        .flag-input {
          flex: 1;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(0,212,255,0.3);
          color: #00ff88;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          padding: 9px 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .flag-input:focus { border-color: #00d4ff; }
        .flag-input.error { border-color: #ff4444; }
        .flag-err { font-size: 0.8rem; color: #ff4444; }
        .btn-flag {
          background: rgba(0,212,255,0.1);
          border: 1px solid #00d4ff;
          color: #00d4ff;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0 18px;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .btn-flag:hover { background: rgba(0,212,255,0.2); }
        .btn-hint {
          align-self: flex-start;
          background: rgba(255,68,68,0.08);
          border: 1px solid rgba(255,68,68,0.4);
          color: #ff8888;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          padding: 6px 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-hint:hover { background: rgba(255,68,68,0.15); }
        .hint-box {
          background: rgba(255,68,68,0.07);
          border: 1px solid rgba(255,68,68,0.25);
          border-left: 3px solid #ff4444;
          padding: 12px 16px;
          font-size: 0.85rem;
          color: #c8e6f0;
          line-height: 1.55;
          border-radius: 2px;
        }
        .hint-tag { color: #ff4444; margin-right: 8px; }
        .hint-box code { background: rgba(0,0,0,0.4); padding: 1px 6px; color: #00ff88; font-size: 0.85rem; }

        /* Complete button */
        .btn-complete {
          border: none;
          width: 100%;
          padding: 18px;
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 1.05rem;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
        }
        .btn-complete.ready {
          background: linear-gradient(90deg, #00d4ff, #00ff88);
          color: #050f1c;
        }
        .btn-complete.ready:hover { transform: scale(0.985); box-shadow: 0 0 20px rgba(0,255,136,0.3); }
        .btn-complete.disabled {
          background: #1a2840;
          color: #3a5070;
          cursor: not-allowed;
          clip-path: none;
        }

                .tab-next-wrap {
                    position: fixed;
                    right: 24px;
                    bottom: 24px;
                    z-index: 40;
                }

                .btn-next-tab {
                    background: linear-gradient(90deg, #00d4ff, #00ff88);
                    border: none;
                    color: #050f1c;
                    font-family: 'Orbitron', sans-serif;
                    font-weight: 800;
                    font-size: 0.9rem;
                    letter-spacing: 0.04em;
                    padding: 12px 20px;
                    cursor: pointer;
                    clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
                    box-shadow: 0 0 18px rgba(0, 212, 255, 0.25);
                    transition: transform 0.15s, box-shadow 0.15s;
                }

                .btn-next-tab:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 0 22px rgba(0, 255, 136, 0.35);
                }
      `}</style>
        </div>
    );
}
