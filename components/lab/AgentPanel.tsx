'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { scenarioMeta } from '@/lib/agents/scenario-metadata';
import { getAllStepsForScenario } from '@/lib/agents/phase-steps';
import {
    defaultAgentSettings,
    type DefenseAgentSettings,
    type MentorAgentSettings,
} from '@/lib/agents/settings';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AgentTrigger {
    phase: string;
    event: string;
    studentDecision?: string;
    redFlags?: string[];
    timestamp: number;
}

interface LiveMessage {
    id: string;
    text: string;
    streaming: boolean;
    timestamp: Date;
    type: 'lesson' | 'alert' | 'prevention' | 'redflag' | 'tip';
}

interface AgentPanelProps {
    agentTrigger: AgentTrigger | null;
    scenarioId: string;
    isActive?: boolean;
    mentorSettings?: MentorAgentSettings;
    defenseSettings?: DefenseAgentSettings;
    // Legacy scripted fallback props (from ScenarioEngine)
    mentorMessages?: { agent: string; type: string; text: string }[];
    guardianMessages?: { agent: string; type: string; text: string }[];
}

function isFinalStage(trigger: AgentTrigger): boolean {
    const text = `${trigger.phase} ${trigger.event}`.toLowerCase();
    return (
        text.includes('complete') ||
        text.includes('completed') ||
        text.includes('final') ||
        text.includes('summary') ||
        text.includes('post') ||
        text.includes('compromised')
    );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function detectType(text: string, defaultType: 'lesson' | 'tip'): LiveMessage['type'] {
    const upper = text.toUpperCase();
    if (upper.startsWith('RED FLAG')) return 'redflag';
    if (upper.startsWith('ALERT')) return 'alert';
    if (upper.startsWith('PREVENTION')) return 'prevention';
    return defaultType;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function AgentPanel({
    agentTrigger,
    scenarioId,
    isActive = false,
    mentorSettings = defaultAgentSettings.mentor,
    defenseSettings = defaultAgentSettings.defense,
    mentorMessages: scriptedMentor = [],
    guardianMessages: scriptedGuardian = [],
}: AgentPanelProps) {
    const [visiblePanel, setVisiblePanel] = useState<'mentor' | 'guardian' | 'both'>('mentor');
    const [mentorMessages, setMentorMessages] = useState<LiveMessage[]>([]);
    const [guardianMessages, setGuardianMessages] = useState<LiveMessage[]>([]);
    const [mentorHistory, setMentorHistory] = useState<string[]>([]);
    const [guardianHistory, setGuardianHistory] = useState<string[]>([]);
    const [aiMode, setAiMode] = useState<'live' | 'scripted' | 'checking'>('checking');

    const mentorRef = useRef<HTMLDivElement>(null);
    const guardianRef = useRef<HTMLDivElement>(null);
    const prevTriggerTs = useRef<number>(0);
    const guardianTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasShownLabGuideRef = useRef<boolean>(false);
    const finalLessonSentRef = useRef<boolean>(false);

    const pushMentorMessage = useCallback((text: string, type: LiveMessage['type'] = 'lesson') => {
        setMentorMessages(prev => [
            ...prev,
            {
                id: `${Date.now()}-mentor-system-${Math.random().toString(36).slice(2, 8)}`,
                text,
                streaming: false,
                timestamp: new Date(),
                type,
            },
        ]);
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (mentorRef.current) {
            mentorRef.current.scrollTop = mentorRef.current.scrollHeight;
        }
    }, [mentorMessages]);

    useEffect(() => {
        if (guardianRef.current) {
            guardianRef.current.scrollTop = guardianRef.current.scrollHeight;
        }
    }, [guardianMessages]);

    useEffect(() => {
        if (!isActive || hasShownLabGuideRef.current) return;

        hasShownLabGuideRef.current = true;
        
        // Get all steps for this scenario and display them at once
        const allSteps = getAllStepsForScenario(scenarioId);
        if (allSteps) {
            pushMentorMessage(allSteps, 'tip');
        } else {
            pushMentorMessage('Lab started. Follow the phases below.', 'tip');
        }
    }, [isActive, scenarioId, pushMentorMessage]);

    // ── Live streaming call: Mentor AI ─────────────────────────────────────────
    const callMentorAI = useCallback(async (trigger: AgentTrigger) => {
        const meta = scenarioMeta[scenarioId];
        if (!meta) return;

        const msgId = Date.now().toString() + '-mentor';

        setMentorMessages(prev => [...prev, {
            id: msgId,
            text: '',
            streaming: true,
            timestamp: new Date(),
            type: 'lesson'
        }]);

        try {
            const response = await fetch('/api/agents/mentor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenarioId,
                    scenarioName: meta.name,
                    attackType: meta.attackType,
                    currentPhase: trigger.phase,
                    phaseEvent: trigger.event,
                    studentDecision: trigger.studentDecision,
                    sessionHistory: mentorHistory,
                    teachingMode: mentorSettings.teachingMode,
                    mentorSettings
                })
            });

            if (!response.ok || !response.body) throw new Error('API error');

            setAiMode('live');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const raw = line.slice(6).trim();
                    if (raw === '[DONE]') continue;

                    try {
                        const data = JSON.parse(raw);
                        const delta = data.choices?.[0]?.delta?.content;
                        if (delta) {
                            fullText += delta;
                            setMentorMessages(prev =>
                                prev.map(m => m.id === msgId ? { ...m, text: fullText } : m)
                            );
                        }
                    } catch {}
                }
            }

            const msgType = detectType(fullText, 'lesson');
            setMentorMessages(prev =>
                prev.map(m => m.id === msgId ? { ...m, streaming: false, type: msgType } : m)
            );
            setMentorHistory(prev => [...prev, fullText]);

        } catch (error) {
            console.error('Mentor AI stream error:', error);
            setAiMode('scripted');
            // Fallback to latest scripted message if available
            const fallback = scriptedMentor[scriptedMentor.length - 1];
            setMentorMessages(prev =>
                prev.map(m => m.id === msgId ? {
                    ...m,
                    text: fallback?.text || '[Mentor AI temporarily unavailable]',
                    streaming: false,
                    type: 'lesson'
                } : m)
            );
        }
    }, [scenarioId, mentorHistory, mentorSettings, scriptedMentor]);

    // ── Live streaming call: Defense AI ───────────────────────────────────────
    const callGuardianAI = useCallback(async (trigger: AgentTrigger) => {
        const meta = scenarioMeta[scenarioId];
        if (!meta) return;

        const msgId = Date.now().toString() + '-guardian';
        const redFlagsVisible = trigger.redFlags || meta.redFlags;

        setGuardianMessages(prev => [...prev, {
            id: msgId,
            text: '',
            streaming: true,
            timestamp: new Date(),
            type: 'tip'
        }]);

        try {
            const response = await fetch('/api/agents/guardian', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenarioId,
                    scenarioName: meta.name,
                    attackType: meta.attackType,
                    currentPhase: trigger.phase,
                    phaseEvent: trigger.event,
                    redFlagsVisible,
                    sessionHistory: guardianHistory,
                    socMode: defenseSettings.defenceMode,
                    defenseSettings
                })
            });

            if (!response.ok || !response.body) throw new Error('API error');

            setAiMode('live');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const raw = line.slice(6).trim();
                    if (raw === '[DONE]') continue;

                    try {
                        const data = JSON.parse(raw);
                        const delta = data.choices?.[0]?.delta?.content;
                        if (delta) {
                            fullText += delta;
                            setGuardianMessages(prev =>
                                prev.map(m => m.id === msgId ? { ...m, text: fullText } : m)
                            );
                        }
                    } catch {}
                }
            }

            const msgType = detectType(fullText, 'tip');
            setGuardianMessages(prev =>
                prev.map(m => m.id === msgId ? { ...m, streaming: false, type: msgType } : m)
            );
            setGuardianHistory(prev => [...prev, fullText]);

        } catch (error) {
            console.error('Defense AI stream error:', error);
            setAiMode('scripted');
            const fallback = scriptedGuardian[scriptedGuardian.length - 1];
            setGuardianMessages(prev =>
                prev.map(m => m.id === msgId ? {
                    ...m,
                    text: fallback?.text || '[Defense AI temporarily unavailable]',
                    streaming: false,
                    type: 'tip'
                } : m)
            );
        }
    }, [scenarioId, guardianHistory, defenseSettings, scriptedGuardian]);

    // ── Trigger effect ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!agentTrigger) return;
        if (agentTrigger.timestamp === prevTriggerTs.current) return;
        prevTriggerTs.current = agentTrigger.timestamp;

        // Capture trigger so closures inside timers see the correct value
        const trigger = agentTrigger;

        // Only call mentor AI at the final stage
        if (isFinalStage(trigger)) {
            if (!finalLessonSentRef.current) {
                finalLessonSentRef.current = true;
                callMentorAI(trigger);
            }
        }

        // Fire Defense AI with a small offset.
        // Use a persistent ref so re-renders caused by setMentorMessages
        // do NOT cancel this timeout (which would happen if we returned
        // clearTimeout from this effect).
        if (guardianTimerRef.current) clearTimeout(guardianTimerRef.current);
        guardianTimerRef.current = setTimeout(() => {
            callGuardianAI(trigger);
            guardianTimerRef.current = null;
        }, 400);

        // No cleanup return — we intentionally keep the guardian timer alive
        // across re-renders so it always fires.
    }, [agentTrigger, callMentorAI, callGuardianAI, pushMentorMessage]);

    // ── Chip renderer ─────────────────────────────────────────────────────────
    const getChip = (type: string, agent: 'mentor' | 'guardian') => {
        if (agent === 'mentor') {
            if (type === 'prevention') return <span className="chip chip-prev-mentor">🛡 PREVENTION</span>;
            if (type === 'tip') return <span className="chip chip-step">➡ STEP</span>;
            return <span className="chip chip-lesson">📚 LESSON</span>;
        }
        switch (type) {
            case 'redflag':    return <span className="chip chip-redflag">⚠ RED FLAG</span>;
            case 'alert':      return <span className="chip chip-alert">🚨 ALERT</span>;
            case 'prevention': return <span className="chip chip-prev">🛡 PREVENTION</span>;
            default:           return <span className="chip chip-tip">💡 TIP</span>;
        }
    };

    return (
        <div className="agent-wrapper">
            <div className="panel-toggle mono">
                <button
                    className={`toggle-btn ${visiblePanel === 'mentor' ? 'active' : ''}`}
                    onClick={() => setVisiblePanel('mentor')}
                    type="button"
                >
                    Mentor
                </button>
                <button
                    className={`toggle-btn ${visiblePanel === 'guardian' ? 'active' : ''}`}
                    onClick={() => setVisiblePanel('guardian')}
                    type="button"
                >
                    Defense
                </button>
                <button
                    className={`toggle-btn ${visiblePanel === 'both' ? 'active' : ''}`}
                    onClick={() => setVisiblePanel('both')}
                    type="button"
                >
                    Both
                </button>
            </div>

            {/* ── Mentor AI ── */}
            {(visiblePanel === 'mentor' || visiblePanel === 'both') && (
            <div className="agent-half mentor-half">
                <div className="ah-header mentor">
                    <div className="ah-title orbitron">🧠 MENTOR AI</div>
                    <div className="ah-sub mono">CYBERSECURITY EDUCATOR</div>
                    <div className={`status-dot ${isActive ? 'pulse-purple' : ''}`} />
                </div>
                <div className="ah-feed" ref={mentorRef}>
                    {mentorMessages.length === 0 && (
                        <div className="empty-state">Waiting for lab to start...</div>
                    )}
                    {mentorMessages.map((msg) => (
                        <div key={msg.id} className="msg-card mentor-card slide-in">
                            <div className="msg-meta mono">
                                {getChip(msg.type, 'mentor')}
                                <span className="msg-time">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>
                            <div className="msg-text" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                {msg.text || <span className="streaming-dots"><span>.</span><span>.</span><span>.</span></span>}
                                {msg.streaming && msg.text && <span className="cursor-blink">▌</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}

            {/* ── Defense AI ── */}
            {(visiblePanel === 'guardian' || visiblePanel === 'both') && (
            <div className="agent-half guardian-half">
                <div className="ah-header guardian">
                    <div className="ah-title orbitron">🛡️ DEFENSE AI</div>
                    <div className="ah-sub mono">DEFENCE MENTOR</div>
                    <div className={`status-dot ${isActive ? 'pulse-green' : ''}`} />
                </div>
                <div className="ah-feed" ref={guardianRef}>
                    {guardianMessages.length === 0 && (
                        <div className="empty-state">Monitoring for threats...</div>
                    )}
                    {guardianMessages.map((msg) => (
                        <div key={msg.id} className="msg-card guardian-card slide-in">
                            <div className="msg-meta mono">
                                {getChip(msg.type, 'guardian')}
                                <span className="msg-time">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>
                            <div className="msg-text" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                {msg.text || <span className="streaming-dots"><span>.</span><span>.</span><span>.</span></span>}
                                {msg.streaming && msg.text && <span className="cursor-blink">▌</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}

            {/* ── AI Mode Indicator ── */}
            <div className="ai-mode-indicator mono">
                {aiMode === 'live' && '⚡ AI: LIVE — Groq LLaMA'}
                {aiMode === 'scripted' && '📋 AI: scripted'}
                {aiMode === 'checking' && '○ AI: initialising'}
            </div>

            <style jsx>{`
        .agent-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #091a2e;
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 4px;
          overflow: hidden;
        }
                .panel-toggle {
                    display: flex;
                    gap: 6px;
                    padding: 8px;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    background: rgba(0,0,0,0.25);
                }
                .toggle-btn {
                    flex: 1;
                    padding: 6px 8px;
                    border: 1px solid rgba(0,212,255,0.25);
                    background: rgba(0,0,0,0.35);
                    color: #7aa4c4;
                    font-size: 0.72rem;
                    letter-spacing: 0.4px;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                .toggle-btn:hover {
                    color: #c8e6f0;
                    border-color: rgba(0,212,255,0.45);
                }
                .toggle-btn.active {
                    color: #00d4ff;
                    border-color: rgba(0,212,255,0.75);
                    background: rgba(0,212,255,0.12);
                }
        .agent-half {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 0;
        }
        .mentor-half { border-bottom: 1px solid rgba(0,212,255,0.15); }
        .ah-header {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative;
          flex-shrink: 0;
        }
        .mentor.ah-header { background: rgba(187,136,255,0.1); border-bottom-color: rgba(187,136,255,0.2); }
        .guardian.ah-header { background: rgba(0,255,136,0.1); border-bottom-color: rgba(0,255,136,0.2); }
        .ah-title { font-size: 0.9rem; font-weight: bold; margin-right: 10px; }
        .ah-sub { font-size: 0.6rem; color: #6b86a0; letter-spacing: 1px; }
        .mentor .ah-title { color: #bb88ff; }
        .guardian .ah-title { color: #00ff88; }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; position: absolute; right: 14px; background: #333; }
        .pulse-purple { background: #bb88ff; box-shadow: 0 0 10px #bb88ff; animation: pulseP 2s infinite; }
        .pulse-green  { background: #00ff88; box-shadow: 0 0 10px #00ff88; animation: pulseG 2s infinite; }
        @keyframes pulseP { 0%,100%{opacity:1} 50%{opacity:0.4;box-shadow:none} }
        @keyframes pulseG { 0%,100%{opacity:1} 50%{opacity:0.4;box-shadow:none} }

        .ah-feed {
          flex: 1;
          padding: 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 0;
        }
        .empty-state {
          color: rgba(255,255,255,0.2);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          text-align: center;
          padding: 20px 0;
        }
        .msg-card {
          background: rgba(0,0,0,0.2);
          padding: 10px 12px;
          border-radius: 4px;
          border-left: 3px solid;
          font-size: 0.82rem;
          line-height: 1.55;
        }
        .mentor-card  { border-color: #bb88ff; background: rgba(187,136,255,0.05); }
        .guardian-card{ border-color: #00ff88; background: rgba(0,255,136,0.05); }
        .msg-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .chip {
          font-size: 0.6rem; padding: 2px 6px; border-radius: 4px;
          border: 1px solid; font-weight: bold; font-family: 'Share Tech Mono', monospace;
        }
        .chip-lesson    { color: #bb88ff; border-color: rgba(187,136,255,0.4); background: rgba(187,136,255,0.1); }
        .chip-step      { color: #7dd3fc; border-color: rgba(125,211,252,0.45); background: rgba(125,211,252,0.12); }
        .chip-tip       { color: #00ff88; border-color: rgba(0,255,136,0.4); background: rgba(0,255,136,0.1); }
        .chip-alert     { color: #ff4444; border-color: rgba(255,68,68,0.4); background: rgba(255,68,68,0.1); }
        .chip-redflag   { color: #ffcc00; border-color: rgba(255,204,0,0.4); background: rgba(255,204,0,0.1); }
        .chip-prev      { color: #00ff88; border-color: rgba(0,255,136,0.4); background: rgba(0,255,136,0.1); }
        .chip-prev-mentor{ color: #00d4ff; border-color: rgba(0,212,255,0.4); background: rgba(0,212,255,0.1); }
        .msg-time { font-size: 0.6rem; color: #6b86a0; }
        .msg-text { color: #c8e6f0; word-break: break-word; }

        /* Streaming cursors & dots */
        .cursor-blink {
          display: inline-block;
          color: #00d4ff;
          animation: blink 0.8s step-end infinite;
          margin-left: 1px;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .streaming-dots span {
          display: inline-block;
          color: rgba(255,255,255,0.3);
          animation: dotBounce 1.2s infinite;
          font-size: 1.1rem;
        }
        .streaming-dots span:nth-child(2) { animation-delay: 0.2s; }
        .streaming-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotBounce {
          0%,80%,100%{ transform: translateY(0); }
          40%{ transform: translateY(-4px); }
        }

        /* AI mode indicator */
        .ai-mode-indicator {
          flex-shrink: 0;
          text-align: center;
          padding: 4px;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.2);
          border-top: 1px solid rgba(255,255,255,0.04);
          background: rgba(0,0,0,0.2);
          letter-spacing: 0.5px;
        }

        .orbitron { font-family: 'Orbitron', sans-serif; }
        .mono { font-family: 'Share Tech Mono', monospace; }
        .slide-in { animation: slideInRight 0.3s ease-out; }
        @keyframes slideInRight {
          from { opacity:0; transform: translateX(16px); }
          to   { opacity:1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
}
