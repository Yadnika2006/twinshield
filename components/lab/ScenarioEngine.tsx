'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LabOutcome, TerminalLine, DecisionPoint, ScenarioScript } from '../../lib/lab-engine';
import { phishNetScript }  from '../../lib/scenarios/phish-net';
import { sqlStormScript }  from '../../lib/scenarios/sql-storm';
import { bruteXScript }    from '../../lib/scenarios/brute-x';
import { xssploitScript }  from '../../lib/scenarios/xss-ploit';
import { sessHijackScript } from '../../lib/scenarios/sess-hijack';
import { malwareDropScript } from '../../lib/scenarios/malware-drop';
import { keyLoggerScript }   from '../../lib/scenarios/key-logger';
import { ransomDropScript }  from '../../lib/scenarios/ransom-drop';
import { spyAgentScript }    from '../../lib/scenarios/spy-agent';
import { usbDropScript }     from '../../lib/scenarios/usb-drop';
import { weakPassScript }    from '../../lib/scenarios/weak-pass';
import { fakeApScript }      from '../../lib/scenarios/fake-ap';
import { mitmCafeScript }    from '../../lib/scenarios/mitm-cafe';
import { netFloodScript }    from '../../lib/scenarios/net-flood';
import { socialEngScript }   from '../../lib/scenarios/social-eng';
import VictimPanel      from './VictimPanel';
import AttackerTerminal from './AttackerTerminal';
import AgentPanel, { AgentTrigger } from './AgentPanel';
import DecisionModal   from './DecisionModal';
import { scenarioMeta } from '@/lib/agents/scenario-metadata';
import {
    defaultAgentSettings,
    sanitizeAgentSettings,
    type AgentSettings,
} from '@/lib/agents/settings';

interface ScenarioEngineProps {
    scenarioId: string;
    onComplete: (outcome: LabOutcome) => void;
}

/** Pick the right script based on scenarioId */
function getScript(scenarioId: string): ScenarioScript | null {
    switch (scenarioId) {
        case 'sqli-01':     return sqlStormScript;
        case 'brute-01':    return bruteXScript;
        case 'xss-01':      return xssploitScript;
        case 'sess-01':     return sessHijackScript;
        case 'malware-01':  return malwareDropScript;
        case 'klog-01':     return keyLoggerScript;
        case 'rnsw-01':     return ransomDropScript;
        case 'spy-01':      return spyAgentScript;
        case 'usb-01':      return usbDropScript;
        case 'weakpass-01': return weakPassScript;
        case 'fakeap-01':   return fakeApScript;
        case 'mitm-01':     return mitmCafeScript;
        case 'dos-01':      return netFloodScript;
        case 'social-01':   return socialEngScript;
        case 'phish-01':    return phishNetScript;
        default:            return null;
    }
}

type InteractionPayload = {
    email?: string;
    password?: string;
    key?: string;
};

export default function ScenarioEngine({ scenarioId, onComplete }: ScenarioEngineProps) {
    const script = getScript(scenarioId);

    const [currentPhaseId,   setCurrentPhaseId]   = useState<string>('');
    const [victimScreen,     setVictimScreen]     = useState<string>('');
    const [terminalLines,    setTerminalLines]    = useState<TerminalLine[]>([]);
    const [agentTrigger,     setAgentTrigger]     = useState<AgentTrigger | null>(null);
    const [showDecision,     setShowDecision]     = useState<boolean>(false);
    const [currentDecision,  setCurrentDecision]  = useState<DecisionPoint | null>(null);
    const [progress,         setProgress]         = useState<number>(0);
    const [attackPhaseName,  setAttackPhaseName]  = useState<string>('');
    const [isPlaying,        setIsPlaying]        = useState<boolean>(false);
    const [agentSettings,    setAgentSettings]    = useState<AgentSettings>(
        sanitizeAgentSettings(defaultAgentSettings)
    );

    const timersRef      = useRef<NodeJS.Timeout[]>([]);
    const stolenCredsRef = useRef({ email: 'john.smith@corpbank.com', password: 'CorpBank2024!' });

    /** Patch the 'compromised' phase terminal lines with actual stolen credentials (phish-net only) */
    const patchTerminalLines = useCallback((phaseId: string, rawLines: TerminalLine[]): TerminalLine[] => {
        if (phaseId !== 'compromised' || scenarioId !== 'phish-01') return rawLines;
        const { email, password } = stolenCredsRef.current;
        return rawLines.map(line => {
            if (line.text.includes('john.smith@corpbank.com'))
                return { ...line, text: line.text.replace('john.smith@corpbank.com', email) };
            if (line.text.includes('CorpBank2024!'))
                return { ...line, text: line.text.replace('CorpBank2024!', password) };
            return line;
        });
    }, [scenarioId]);

    /**
     * Schedule victim-screen trigger switches: when a terminal line with
     * a `trigger` field plays (based on its delay), switch the
     * VictimPanel to that screen automatically.
     */
    const scheduleTriggers = useCallback((lines: TerminalLine[]) => {
        lines.forEach(line => {
            if (!line.trigger) return;
            // Add a small offset (+200ms) so the screen switches just after the line appears
            const t = setTimeout(() => setVictimScreen(line.trigger!), line.delay + 200);
            timersRef.current.push(t);
        });
    }, []);

    const startPhase = useCallback((phaseId: string) => {
        if (!script) return;
        const phase = script.phases.find(p => p.id === phaseId);
        if (!phase) {
            onComplete('compromised');
            return;
        }

        // Cancel all pending timers from the previous phase
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];

        const patchedLines = patchTerminalLines(phaseId, phase.terminalLines);

        setCurrentPhaseId(phaseId);
        setAttackPhaseName(phase.name);
        setProgress(phase.progressPct);
        setVictimScreen(phase.victimScreen);
        setTerminalLines(patchedLines);
        setCurrentDecision(phase.decisionPoint || null);

        // Schedule trigger-based victim screen switches
        scheduleTriggers(patchedLines);

        // Fire AI agent trigger — use agentContext from phase if available, else use phase name
        const meta = scenarioMeta[scenarioId];
        const t0 = setTimeout(() => {
            setAgentTrigger({
                phase: phaseId,
                event: phase.agentContext || phase.name,
                redFlags: meta?.redFlags || [],
                timestamp: Date.now()
            });
        }, 1500);
        timersRef.current.push(t0);

        if (phase.autoPlay) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
            if (phase.decisionPoint) setShowDecision(true);
        }
    }, [script, patchTerminalLines, scheduleTriggers, onComplete, scenarioId]);

    useEffect(() => {
        if (script && script.phases.length > 0) {
            startPhase(script.phases[0].id);
        }
        return () => { timersRef.current.forEach(clearTimeout); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [script]);

    useEffect(() => {
        let isMounted = true;

        const loadAgentSettings = async () => {
            try {
                const response = await fetch('/api/agents/config', { cache: 'no-store' });
                if (!response.ok) return;

                const settings = sanitizeAgentSettings(await response.json());
                if (isMounted) setAgentSettings(settings);
            } catch (error) {
                console.error('Failed to load agent settings for runtime:', error);
            }
        };

        loadAgentSettings();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleTerminalComplete = useCallback(() => {
        if (!script) return;
        setIsPlaying(false);
        const phase = script.phases.find(p => p.id === currentPhaseId);
        if (!phase) return;

        if (phase.decisionPoint) {
            setShowDecision(true);
        } else if (phase.nextPhase) {
            const t = setTimeout(() => startPhase(phase.nextPhase!), 1000);
            timersRef.current.push(t);
        } else {
            const t = setTimeout(() => onComplete('compromised'), 2000);
            timersRef.current.push(t);
        }
    }, [script, currentPhaseId, startPhase, onComplete]);

    const handleDecisionComplete = useCallback((choiceIndex: number, safe: boolean) => {
        if (!script) return;
        setShowDecision(false);

        const phase = script.phases.find(p => p.id === currentPhaseId);
        const choiceLabel = phase?.decisionPoint?.choices[choiceIndex]?.label
            || (safe ? 'safe choice' : 'risky choice');

        // Fire AI trigger with student decision context
        setAgentTrigger({
            phase: currentPhaseId,
            event: 'student_decision',
            studentDecision: choiceLabel,
            redFlags: scenarioMeta[scenarioId]?.redFlags || [],
            timestamp: Date.now()
        });

        if (phase && phase.nextPhase) {
            const t = setTimeout(() => startPhase(phase.nextPhase!), 2000);
            timersRef.current.push(t);
        } else {
            const t = setTimeout(() => onComplete('compromised'), 2000);
            timersRef.current.push(t);
        }
    }, [script, currentPhaseId, startPhase, onComplete, scenarioId]);

    const handleInteraction = useCallback((action: string, data?: InteractionPayload) => {
        switch(action) {
            case 'open-email':
                setVictimScreen('email-open');
                startPhase('email-opened');
                break;
            case 'click-link':
                setShowDecision(true);
                break;
            case 'submit-creds':
                if (data?.email)    stolenCredsRef.current.email    = data.email;
                if (data?.password) stolenCredsRef.current.password = data.password;
                setShowDecision(true);
                break;
            case 'connect-ssh':
                setVictimScreen('brute-attempts');
                startPhase('brute-force');
                break;
            case 'attempt-login':
                setVictimScreen('sql-error');
                startPhase('sql-error');
                break;
            case 'continue':
                if (currentPhaseId === 'sql-error') startPhase('auth-bypass');
                else if (currentPhaseId === 'auth-bypass') startPhase('db-dump');
                break;
            case 'submit-login':
                setVictimScreen('intercepted');
                startPhase('brute-force');
                break;
            case 'search-submit':
                setVictimScreen('alert-popup');
                startPhase('inject');
                break;
            case 'close-alert':
                setVictimScreen('cookie-stolen');
                startPhase('steal');
                break;
            case 'open-devtools':
                setVictimScreen('devtools-open');
                startPhase('steal');
                break;
            case 'open-attachment':
                setVictimScreen('download-prompt');
                startPhase('execute');
                break;
            case 'run-file':
                setVictimScreen('installing');
                startPhase('meterpreter');
                break;
            case 'keystroke':
                setTerminalLines(prev => [...prev, { text: `[KEY] ${data?.key ?? ''}`, type: 'warning', delay: 0 }]);
                break;
            case 'pick-up-usb':
                setVictimScreen('usb-inserted');
                startPhase('inserted');
                break;
            case 'run-autoplay':
                setVictimScreen('autorun-trigger');
                startPhase('payload');
                break;
            case 'connect-wifi':
                setVictimScreen('connected-fake');
                startPhase('intercept');
                break;
            case 'answer-call':
                setVictimScreen('phone-ringing');
                startPhase('call');
                break;
            case 'accept-call':
                setVictimScreen('conversation');
                startPhase('pretext');
                break;
            default:
                break;
        }
    }, [currentPhaseId, startPhase]);

    if (!script) {
        return (
            <div className="engine-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(0,0,0,0.4)', border: '1px solid #ff4444', borderRadius: '8px' }}>
                    <h2 className="orbitron" style={{ color: '#ff4444' }}>SCENARIO NOT FOUND</h2>
                    <p className="mono" style={{ color: '#a0aec0', marginTop: '10px' }}>The requested laboratory ID [{scenarioId}] does not exist.</p>
                    <button className="btn-outline red" style={{ marginTop: '20px' }} onClick={() => window.location.href='/dashboard'}>RETURN TO DASHBOARD</button>
                </div>
            </div>
        );
    }

    return (
        <div className="engine-layout">
            {/* Top Meta Bar */}
            <div className="meta-bar">
                <div className="mb-left">
                    <span className="orbitron label">SCENARIO RUNNING</span>
                    <span className="mono separator">|</span>
                    <span className="mono val">{attackPhaseName}</span>
                </div>
                <div className="mb-right">
                    <span className="mono pct">{progress}%</span>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            {/* Main 3-Column Layout */}
            <div className="panels-container">

                {/* LEFT: Victim Panel (38%) */}
                <div className="panel v-panel">
                    <VictimPanel
                        currentScreen={victimScreen}
                        scenarioId={scenarioId}
                        onInteraction={handleInteraction}
                    />
                    <DecisionModal
                        decision={currentDecision}
                        visible={showDecision}
                        onChoice={handleDecisionComplete}
                    />
                </div>

                {/* MIDDLE: Attacker Terminal (38%) */}
                <div className="panel t-panel">
                    <AttackerTerminal
                        lines={terminalLines}
                        isPlaying={isPlaying}
                        onComplete={handleTerminalComplete}
                        phaseName={attackPhaseName}
                    />
                </div>

                {/* RIGHT: Agent Panel (24%) */}
                <div className="panel a-panel">
                    <AgentPanel
                        agentTrigger={agentTrigger}
                        scenarioId={scenarioId}
                        isActive={isPlaying || showDecision}
                        mentorSettings={agentSettings.mentor}
                        defenseSettings={agentSettings.defense}
                    />
                </div>

            </div>

            <style jsx>{`
        .engine-layout {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 200px);
          min-height: 700px;
          gap: 16px;
        }
        .meta-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(0,212,255,0.2);
          padding: 12px 24px;
          border-radius: 4px;
        }
        .mb-left { display: flex; align-items: center; gap: 12px; }
        .orbitron { font-family: 'Orbitron', sans-serif; font-weight: bold; }
        .mono { font-family: 'Share Tech Mono', monospace; }
        .label { color: #00d4ff; font-size: 0.9rem; letter-spacing: 1px; }
        .separator { color: #334155; }
        .val { color: #fff; font-size: 0.9rem; }
        .mb-right { display: flex; align-items: center; gap: 12px; width: 300px; }
        .pct { color: #00ff88; font-size: 0.85rem; }
        .progress-track {
          flex: 1;
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00d4ff, #00ff88);
          transition: width 0.8s ease-out;
        }
        .panels-container {
          flex: 1;
          display: flex;
          gap: 16px;
          overflow: hidden;
        }
        .panel { display: flex; flex-direction: column; position: relative; }
        .v-panel { flex: 38; }
        .t-panel { flex: 38; }
        .a-panel { flex: 24; }
      `}</style>
        </div>
    );
}
