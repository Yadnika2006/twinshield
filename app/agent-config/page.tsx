"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function AgentConfigPage() {
    // MentorAI Settings
    const [mentorAIStatus, setMentorAIStatus] = useState(true);
    const [teachingMode, setTeachingMode] = useState("contextual");
    const [explanationDepth, setExplanationDepth] = useState(50);
    const [mentorAIToggles, setMentorAIToggles] = useState({
        realWorldExamples: true,
        psychologicalContext: true,
        postLessonSummary: true,
        technicalDetails: false,
    });
    const [mentorPersonality, setMentorPersonality] = useState("friendly");

    // GuardianAI Settings
    const [guardianStatus, setGuardianStatus] = useState(true);
    const [defenceMode, setDefenceMode] = useState("soc_analyst");
    const [aggression, setAggression] = useState(40);
    const [guardianToggles, setGuardianToggles] = useState({
        autoBlock: true,
        postMortem: true,
        realtimeAlerts: true,
        emailAlerts: false,
        diffScaling: true,
    });
    const [alertSens, setAlertSens] = useState("medium");

    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveMentor = () => showToast("MentorAI config saved successfully");
    const handleSaveGreen = () => showToast("GuardianAI config saved successfully");

    const resetDefaults = () => {
        setMentorAIStatus(true);
        setTeachingMode("contextual");
        setExplanationDepth(50);
        setMentorAIToggles({ realWorldExamples: true, psychologicalContext: true, postLessonSummary: true, technicalDetails: false });
        setMentorPersonality("friendly");

        setGuardianStatus(true);
        setDefenceMode("soc_analyst");
        setAggression(40);
        setGuardianToggles({ autoBlock: true, postMortem: true, realtimeAlerts: true, emailAlerts: false, diffScaling: true });
        setAlertSens("medium");

        showToast("All settings reset to defaults");
    };

    return (
        <div className="dashboard-root">
            <Navbar />
            <div className="dashboard-content">
                <Sidebar />
                <main className="main-content">
                    <div className="fade-in">

                        {/* ── HEADER ── */}
                        <div className="page-header">
                            <h1 className="orbitron">◈ AGENT CONFIGURATION</h1>
                            <p className="muted body-text">Customize how MentorAI and GuardianAI assist you during lab sessions</p>
                        </div>

                        <div className="config-grid">

                            {/* ════════════════════════════════
                                 MENTORAI CONFIGURATION CARD
                            ════════════════════════════════ */}
                            <div className="agent-card purple-theme">
                                <div className="ac-header">
                                    <div className="ac-title">
                                        <span className="orbitron ac-name purple-text">🧠 MENTORAI</span>
                                        <span className="mono ac-sub">CYBERSECURITY EDUCATOR</span>
                                    </div>
                                    <button
                                        className={`status-pill mono ${mentorAIStatus ? 'active-green' : 'standby-grey'}`}
                                        onClick={() => setMentorAIStatus(!mentorAIStatus)}
                                    >
                                        {mentorAIStatus ? 'ACTIVE' : 'STANDBY'}
                                    </button>
                                </div>

                                <div className="ac-body">
                                    {/* Teaching Mode */}
                                    <div className="config-section">
                                        <label className="sec-label mono">TEACHING MODE</label>
                                        <div className="radio-pills">
                                            {[
                                                { id: 'observe', title: 'OBSERVE ONLY', desc: 'Watch the attack — no explanations shown' },
                                                { id: 'contextual', title: 'CONTEXTUAL', desc: 'Explains each step as the attack unfolds' },
                                                { id: 'deep_dive', title: 'DEEP DIVE', desc: 'Full technical explanations and background' },
                                                { id: 'step_by_step', title: 'STEP BY STEP', desc: 'MentorAI guides you through everything' },
                                            ].map(opt => (
                                                <div
                                                    key={opt.id}
                                                    className={`rp-item ${teachingMode === opt.id ? 'sel-purple' : ''}`}
                                                    onClick={() => setTeachingMode(opt.id)}
                                                >
                                                    <span className="rp-radio">{teachingMode === opt.id ? '●' : '○'}</span>
                                                    <div>
                                                        <h4 className="orbitron">{opt.title}</h4>
                                                        <p>{opt.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Explanation Depth */}
                                    <div className="config-section">
                                        <div className="slider-header">
                                            <label className="sec-label mono">EXPLANATION DEPTH</label>
                                            <span className="mono slider-val">{explanationDepth < 30 ? 'SIMPLE' : explanationDepth > 70 ? 'TECHNICAL' : 'BALANCED'}</span>
                                        </div>
                                        <p className="sec-desc">How detailed should explanations be?</p>
                                        <div className="slider-wrap">
                                            <span className="mono muted">SIMPLE</span>
                                            <input
                                                type="range" min="0" max="100"
                                                className="purple-slider"
                                                value={explanationDepth}
                                                onChange={(e) => setExplanationDepth(Number(e.target.value))}
                                            />
                                            <span className="mono muted">TECHNICAL</span>
                                        </div>
                                    </div>

                                    {/* Behaviour Toggles */}
                                    <div className="config-section">
                                        <label className="sec-label mono">BEHAVIOUR TOGGLES</label>
                                        <div className="toggle-list">
                                            {[
                                                { key: 'realWorldExamples', label: 'Show real world attack examples', desc: 'Connects attacks to famous real breaches' },
                                                { key: 'psychologicalContext', label: 'Explain why attacks work psychologically', desc: 'Shows the human factors behind each attack' },
                                                { key: 'postLessonSummary', label: 'Post attack full lesson summary', desc: 'Generates learning summary after session' },
                                                { key: 'technicalDetails', label: 'Show technical implementation details', desc: 'Shows code and technical attack mechanics' },
                                            ].map(t => (
                                                <div className="toggle-row" key={t.key}>
                                                    <div className="tr-text">
                                                        <h4>{t.label}</h4>
                                                        <p>{t.desc}</p>
                                                    </div>
                                                    <button
                                                        className={`toggle-btn mono ${mentorAIToggles[t.key as keyof typeof mentorAIToggles] ? 'isOn purple' : 'isOff'}`}
                                                        onClick={() => setMentorAIToggles(prev => ({ ...prev, [t.key]: !prev[t.key as keyof typeof mentorAIToggles] }))}
                                                    >
                                                        {mentorAIToggles[t.key as keyof typeof mentorAIToggles] ? 'ON' : 'OFF'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mentor Personality */}
                                    <div className="config-section">
                                        <label className="sec-label mono">MENTOR PERSONALITY</label>
                                        <div className="radio-circs">
                                            {[
                                                { id: 'academic', label: 'ACADEMIC', desc: 'Formal educational tone' },
                                                { id: 'friendly', label: 'FRIENDLY', desc: 'Conversational and encouraging' },
                                                { id: 'concise', label: 'CONCISE', desc: 'Short sharp key points only' },
                                            ].map(opt => (
                                                <div
                                                    key={opt.id}
                                                    className="rc-row"
                                                    onClick={() => setMentorPersonality(opt.id)}
                                                >
                                                    <span className={`rc-dot ${mentorPersonality === opt.id ? 'purple-dot' : ''}`}>
                                                        {mentorPersonality === opt.id ? '●' : '○'}
                                                    </span>
                                                    <span className="rc-label orbitron">{opt.label}</span>
                                                    <span className="rc-desc">{opt.desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="ac-footer">
                                    <button className="btn-save purple-grad mono" onClick={handleSaveMentor}>
                                        SAVE MENTORAI CONFIG
                                    </button>
                                </div>
                            </div>

                            {/* ════════════════════════════════
                                 GUARDIANAI CONFIGURATION CARD
                            ════════════════════════════════ */}
                            <div className="agent-card green-theme">
                                <div className="ac-header">
                                    <div className="ac-title">
                                        <span className="orbitron ac-name green-text">🛡️ GUARDIANAI</span>
                                        <span className="mono ac-sub">DEFENCE AGENT</span>
                                    </div>
                                    <button
                                        className={`status-pill mono ${guardianStatus ? 'active-green' : 'standby-grey'}`}
                                        onClick={() => setGuardianStatus(!guardianStatus)}
                                    >
                                        {guardianStatus ? 'ACTIVE' : 'STANDBY'}
                                    </button>
                                </div>

                                <div className="ac-body">
                                    {/* Defence Mode */}
                                    <div className="config-section">
                                        <label className="sec-label mono">DEFENCE MODE</label>
                                        <div className="radio-pills">
                                            {[
                                                { id: 'rookie', title: 'ROOKIE', desc: 'Narrates attacks only — no blocking' },
                                                { id: 'soc_analyst', title: 'SOC ANALYST', desc: 'Fires alerts and advises — you decide' },
                                                { id: 'autonomous', title: 'AUTONOMOUS', desc: 'Full auto defence — blocks everything' },
                                                { id: 'adversarial', title: 'ADVERSARIAL', desc: 'Actively tries to stop you winning' },
                                            ].map(opt => (
                                                <div
                                                    key={opt.id}
                                                    className={`rp-item ${defenceMode === opt.id ? 'sel-green' : ''}`}
                                                    onClick={() => setDefenceMode(opt.id)}
                                                >
                                                    <span className="rp-radio">{defenceMode === opt.id ? '●' : '○'}</span>
                                                    <div>
                                                        <h4 className="orbitron">{opt.title}</h4>
                                                        <p>{opt.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Aggression Level */}
                                    <div className="config-section">
                                        <div className="slider-header">
                                            <label className="sec-label mono">AGGRESSION LEVEL</label>
                                            <span className="mono slider-val">{aggression < 30 ? 'PASSIVE' : aggression > 70 ? 'AGGRESSIVE' : 'MODERATE'}</span>
                                        </div>
                                        <p className="sec-desc">How aggressively GuardianAI defends</p>
                                        <div className="slider-wrap">
                                            <span className="mono muted">PASSIVE</span>
                                            <input
                                                type="range" min="0" max="100"
                                                className="green-slider"
                                                value={aggression}
                                                onChange={(e) => setAggression(Number(e.target.value))}
                                            />
                                            <span className="mono muted">AGGRESSIVE</span>
                                        </div>
                                    </div>

                                    {/* Behaviour Toggles */}
                                    <div className="config-section">
                                        <label className="sec-label mono">BEHAVIOUR TOGGLES</label>
                                        <div className="toggle-list">
                                            {[
                                                { key: 'autoBlock', label: 'Auto block suspicious IPs', desc: 'Automatically firewall attacker IPs' },
                                                { key: 'postMortem', label: 'Generate post-mortem report', desc: 'Full incident report after session' },
                                                { key: 'realtimeAlerts', label: 'Real time SOC alerts', desc: 'Live alerts in lab SOC panel' },
                                                { key: 'emailAlerts', label: 'Email alerts', desc: 'Send alerts to registered email' },
                                                { key: 'diffScaling', label: 'Difficulty scaling', desc: 'Adapts defence to your skill level' },
                                            ].map(t => (
                                                <div className="toggle-row" key={t.key}>
                                                    <div className="tr-text">
                                                        <h4>{t.label}</h4>
                                                        <p>{t.desc}</p>
                                                    </div>
                                                    <button
                                                        className={`toggle-btn mono ${guardianToggles[t.key as keyof typeof guardianToggles] ? 'isOn green' : 'isOff'}`}
                                                        onClick={() => setGuardianToggles(prev => ({ ...prev, [t.key]: !prev[t.key as keyof typeof guardianToggles] }))}
                                                    >
                                                        {guardianToggles[t.key as keyof typeof guardianToggles] ? 'ON' : 'OFF'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Alert Sensitivity */}
                                    <div className="config-section">
                                        <label className="sec-label mono">ALERT SENSITIVITY</label>
                                        <div className="radio-circs">
                                            {[
                                                { id: 'low', label: 'LOW', desc: 'Critical alerts only' },
                                                { id: 'medium', label: 'MEDIUM', desc: 'High and critical alerts' },
                                                { id: 'high', label: 'HIGH', desc: 'All alerts including info' },
                                            ].map(opt => (
                                                <div
                                                    key={opt.id}
                                                    className="rc-row"
                                                    onClick={() => setAlertSens(opt.id)}
                                                >
                                                    <span className={`rc-dot ${alertSens === opt.id ? 'green-dot' : ''}`}>
                                                        {alertSens === opt.id ? '●' : '○'}
                                                    </span>
                                                    <span className="rc-label orbitron">{opt.label}</span>
                                                    <span className="rc-desc">{opt.desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="ac-footer">
                                    <button className="btn-save green-grad mono" onClick={handleSaveGreen}>
                                        SAVE GUARDIANAI CONFIG
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ── AGENT INTERACTION LOG ── */}
                        <section className="terminal-log-section mt-8">
                            <h2 className="orbitron log-title">◈ RECENT AGENT ACTIVITY</h2>
                            <div className="term-panel mono">
                                <div className="log-line">
                                    <span className="t-time">[00:02]</span> <span className="t-purple">🧠 MENTORAI</span>     <span className="t-msg">&quot;Session started — I will explain each attack technique as it unfolds&quot;</span>
                                </div>
                                <div className="log-line">
                                    <span className="t-time">[00:07]</span> <span className="t-green">🛡️ GUARDIANAI</span> <span className="t-msg">&quot;SQL injection pattern detected — alert fired to SOC panel&quot;</span>
                                </div>
                                <div className="log-line">
                                    <span className="t-time">[00:11]</span> <span className="t-purple">🧠 MENTORAI</span>     <span className="t-msg">&quot;Good progress — SQL injection works because input is not sanitised before the query&quot;</span>
                                </div>
                                <div className="log-line">
                                    <span className="t-time">[00:18]</span> <span className="t-green">🛡️ GUARDIANAI</span> <span className="t-msg">&quot;Exfiltration attempt detected — outbound transfer blocked&quot;</span>
                                </div>
                                <div className="log-line">
                                    <span className="t-time">[00:21]</span> <span className="t-purple">🧠 MENTORAI</span>     <span className="t-msg">&quot;Session complete — full lesson summary saved to your report&quot;</span>
                                </div>
                            </div>
                        </section>

                        {/* ── RESET / INFO ROW ── */}
                        <div className="reset-row mt-6">
                            <button className="btn-reset mono" onClick={resetDefaults}>RESET ALL TO DEFAULTS</button>
                            <p className="info-txt">
                                Settings apply to your next lab session.<br />
                                Changes do not affect sessions in progress.
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            {/* TOAST NOTIF */}
            {toast && (
                <div className="toast-anim">
                    {toast}
                </div>
            )}

            {/* ─────────────────── STYLES ─────────────────── */}
            <style jsx>{`
                .dashboard-root {
                    display: flex; flex-direction: column; height: 100vh;
                    background: #0a1628; color: #fff;
                    background-image: radial-gradient(rgba(0,212,255,0.05) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                .dashboard-content { display: flex; flex: 1; height: calc(100vh - 60px); }
                .main-content { flex: 1; overflow-y: auto; padding: 40px; }
                .fade-in { animation: fadeIn 0.4s ease-out; max-width: 1300px; margin: 0 auto; padding-bottom: 60px; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .orbitron { font-family: 'Orbitron', sans-serif; letter-spacing: 1px; }
                .mono { font-family: 'Share Tech Mono', monospace; }
                .muted { color: rgba(255,255,255,0.5); }
                .mt-6 { margin-top: 24px; }
                .mt-8 { margin-top: 32px; }

                /* HEADER */
                .page-header { margin-bottom: 32px; border-bottom: 1px solid rgba(0,212,255,0.2); padding-bottom: 16px; }
                .page-header h1 { margin: 0 0 8px 0; font-size: 1.8rem; color: #00d4ff; }
                .body-text { margin: 0; font-family: 'Exo 2', sans-serif; }

                /* GRID */
                .config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: stretch; }

                /* AGENT CARDS */
                .agent-card {
                    background: #091a2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                    display: flex; flex-direction: column; overflow: hidden;
                }
                .purple-theme { border-top: 3px solid #bb88ff; background: linear-gradient(180deg, rgba(187,136,255,0.07) 0%, transparent 100%), #091a2e; }
                .green-theme { border-top: 3px solid #00ff88; background: linear-gradient(180deg, rgba(0,255,136,0.05) 0%, transparent 100%), #091a2e; }
                
                .ac-header { display: flex; justify-content: space-between; align-items: center; padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .ac-title { display: flex; flex-direction: column; }
                .ac-name { font-size: 1.5rem; margin-bottom: 4px; }
                .purple-text { color: #bb88ff; }
                .green-text { color: #00ff88; }
                .ac-sub { font-size: 0.8rem; color: #888; }
                
                .status-pill { padding: 4px 12px; border-radius: 20px; border: 1px solid transparent; font-size: 0.8rem; font-weight: bold; cursor: pointer; transition: 0.2s; background: transparent; }
                .active-green { color: #00ff88; border-color: #00ff88; background: rgba(0,255,136,0.1); }
                .standby-grey { color: #888; border-color: #555; background: rgba(255,255,255,0.05); }

                .ac-body { padding: 24px; flex: 1; display: flex; flex-direction: column; gap: 32px; }

                /* SECTIONS */
                .sec-label { display: block; font-size: 0.85rem; color: #aaa; margin-bottom: 12px; font-weight: bold; }
                .sec-desc { font-size: 0.85rem; color: #777; margin: -8px 0 12px 0; }
                
                /* RADIOS */
                .radio-pills { display: flex; flex-direction: column; gap: 8px; }
                .rp-item { 
                    display: flex; align-items: center; padding: 12px 16px; 
                    background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 6px; cursor: pointer; transition: 0.2s; 
                }
                .rp-item:hover { background: rgba(255,255,255,0.05); }
                .rp-radio { margin-right: 16px; font-size: 1.2rem; }
                .rp-item h4 { margin: 0 0 4px 0; font-size: 0.95rem; letter-spacing: 0.5px; }
                .rp-item p { margin: 0; font-size: 0.8rem; color: #aaa; }
                
                .sel-purple { background: rgba(187,136,255,0.1) !important; border-color: rgba(187,136,255,0.5); }
                .sel-purple .rp-radio { color: #bb88ff; }
                .sel-purple h4 { color: #bb88ff; }
                .sel-green { background: rgba(0,255,136,0.1) !important; border-color: rgba(0,255,136,0.5); }
                .sel-green .rp-radio { color: #00ff88; }
                .sel-green h4 { color: #00ff88; }

                /* SLIDERS */
                .slider-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
                .slider-val { font-size: 0.85rem; color: #fff; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px; }
                .slider-wrap { display: flex; align-items: center; gap: 16px; }
                input[type=range] { flex: 1; -webkit-appearance: none; background: transparent; height: 30px; cursor: pointer; }
                input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%; margin-top: -5px; }
                .purple-slider::-webkit-slider-thumb { background: #bb88ff; box-shadow: 0 0 10px #bb88ff; }
                .green-slider::-webkit-slider-thumb { background: #00ff88; box-shadow: 0 0 10px #00ff88; }

                /* TOGGLES */
                .toggle-list { display: flex; flex-direction: column; gap: 12px; }
                .toggle-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .toggle-row:last-child { border: none; padding-bottom: 0; }
                .tr-text h4 { margin: 0 0 4px 0; font-size: 0.95rem; font-family: 'Exo 2', sans-serif; font-weight: normal; }
                .tr-text p { margin: 0; font-size: 0.8rem; color: #777; }
                .toggle-btn { padding: 4px 12px; border-radius: 12px; border: none; font-size: 0.8rem; cursor: pointer; font-weight: bold; width: 50px; }
                .isOff { background: rgba(255,255,255,0.1); color: #888; }
                .isOn.purple { background: #bb88ff; color: #000; box-shadow: 0 0 8px rgba(187,136,255,0.4); }
                .isOn.green { background: #00ff88; color: #000; box-shadow: 0 0 8px rgba(0,255,136,0.4); }

                /* RADIO CIRCS (Personality & Sens) */
                .radio-circs { display: flex; flex-direction: column; gap: 12px; }
                .rc-row { display: flex; align-items: center; cursor: pointer; }
                .rc-dot { margin-right: 12px; color: #555; font-size: 1.2rem; }
                .purple-dot { color: #bb88ff; }
                .green-dot { color: #00ff88; }
                .rc-label { font-size: 0.9rem; width: 130px; letter-spacing: 1px; color: #ccc; }
                .rc-desc { font-size: 0.85rem; color: #777; }
                .rc-row:hover .rc-label { color: #fff; }

                /* FOOTER */
                .ac-footer { padding: 24px; border-top: 1px solid rgba(255,255,255,0.05); }
                .btn-save { width: 100%; border: none; padding: 14px; border-radius: 6px; font-weight: bold; font-size: 1rem; cursor: pointer; color: #000; transition: box-shadow 0.2s; }
                .purple-grad { background: linear-gradient(90deg, #bb88ff, #9966ee); }
                .purple-grad:hover { box-shadow: 0 0 15px rgba(187,136,255,0.4); }
                .green-grad { background: linear-gradient(90deg, #00ff88, #00cc6a); }
                .green-grad:hover { box-shadow: 0 0 15px rgba(0,255,136,0.4); }

                /* TERMINAL LOG */
                .log-title { font-size: 1.1rem; color: #00d4ff; border-bottom: 1px solid rgba(0,212,255,0.2); padding-bottom: 8px; margin-bottom: 16px; }
                .term-panel { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-left: 3px solid #00d4ff; padding: 20px; border-radius: 4px; display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem; line-height: 1.4; }
                .t-time { color: #888; margin-right: 12px; }
                .t-purple { color: #bb88ff; width: 130px; display: inline-block; font-weight: bold; }
                .t-green { color: #00ff88; width: 130px; display: inline-block; font-weight: bold; }
                .t-msg { color: #ccc; }

                /* RESET ROW */
                .reset-row { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 16px; }
                .btn-reset { background: transparent; border: none; color: rgba(255,68,68,0.7); cursor: pointer; padding: 8px 16px; border-radius: 4px; transition: 0.2s; }
                .btn-reset:hover { background: rgba(255,68,68,0.1); color: #ff4444; }
                .info-txt { font-family: 'Exo 2', sans-serif; font-size: 0.85rem; color: #777; text-align: right; margin: 0; line-height: 1.4; }

                /* TOAST */
                .toast-anim {
                    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
                    background: rgba(0,212,255,0.1); border: 1px solid #00d4ff; color: #00d4ff;
                    padding: 12px 24px; border-radius: 30px; font-family: 'Share Tech Mono', monospace;
                    box-shadow: 0 0 20px rgba(0,212,255,0.2); animation: toastIn 0.3s ease-out;
                    z-index: 1000;
                }
                @keyframes toastIn { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

            `}</style>
        </div>
    );
}
