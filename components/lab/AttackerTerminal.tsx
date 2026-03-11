import React, { useEffect, useState, useRef, useCallback } from 'react';
import { TerminalLine } from '../../lib/lab-engine';

interface AttackerTerminalProps {
    lines: TerminalLine[];       // The lines for the CURRENT phase (changes each phase)
    isPlaying: boolean;
    onComplete: () => void;
    phaseName?: string;          // Optional label for the separator banner
}

// A rendered terminal entry — either a permanent (fully typed) line or still-animating
interface RenderedEntry {
    id: string;            // unique key
    text: string;          // full target text
    displayText: string;   // what is currently shown (grows during typewriter)
    color: string;
    isCommand: boolean;
    isComplete: boolean;   // true once fully revealed
    showPrompt: boolean;
}

const getColor = (type: string): string => {
    switch (type) {
        case 'command': return '#00ff88';
        case 'output':  return 'rgba(255,255,255,0.6)';
        case 'success': return '#00ff88';
        case 'error':   return '#ff4444';
        case 'warning': return '#ffcc00';
        case 'info':    return '#00d4ff';
        case 'dim':     return 'rgba(255,255,255,0.25)';
        case 'data':    return '#bb88ff';
        case 'separator': return 'rgba(255,255,255,0.2)';
        default:        return 'rgba(255,255,255,0.6)';
    }
};

const TYPING_SPEED = 40; // ms per character

export default function AttackerTerminal({
    lines,
    isPlaying,
    onComplete,
    phaseName,
}: AttackerTerminalProps) {
    // ── Permanent accumulated history (never reset) ──────────────────────
    const historyRef = useRef<RenderedEntry[]>([]);
    // Trigger re-render when history changes
    const [, forceRender] = useState(0);
    const rerender = useCallback(() => forceRender(n => n + 1), []);

    // Track which lines array we are currently animating
    const currentLinesRef = useRef<TerminalLine[]>([]);
    const animFrameRef = useRef<number>();
    const batchStartRef = useRef<number>(0);     // Date.now() when this batch started
    const batchCompleted = useRef(false);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    const containerRef = useRef<HTMLDivElement>(null);

    // ── Auto-scroll to bottom ─────────────────────────────────────────────
    const scrollToBottom = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, []);

    // ── When `lines` prop changes → new phase has started ────────────────
    useEffect(() => {
        // Don't react to the very first empty array on mount
        if (lines === currentLinesRef.current) return;
        currentLinesRef.current = lines;

        if (lines.length === 0) return;

        // Cancel any running animation from previous phase
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        batchCompleted.current = false;

        // 1. Append a phase separator to history
        const separatorLabel = phaseName
            ? `── ${phaseName.toUpperCase()} ─────────────────────────`
            : `── NEW PHASE ────────────────────────────────`;

        historyRef.current = [
            ...historyRef.current,
            {
                id: `sep-${Date.now()}`,
                text: separatorLabel,
                displayText: separatorLabel,
                color: getColor('separator'),
                isCommand: false,
                isComplete: true,
                showPrompt: false,
            },
        ];

        // 2. Reserve slots in history for incoming lines (empty at first)
        const newEntries: RenderedEntry[] = lines.map((line, idx) => ({
            id: `line-${Date.now()}-${idx}`,
            text: line.text,
            displayText: '',
            color: getColor(line.type),
            isCommand: line.type === 'command',
            isComplete: false,
            showPrompt: line.type === 'command',
        }));

        historyRef.current = [...historyRef.current, ...newEntries];
        const entryIds = newEntries.map(e => e.id);

        batchStartRef.current = Date.now();
        rerender();
        scrollToBottom();

        // 3. Animation loop — only updates the new entries
        const tick = () => {
            const elapsed = Date.now() - batchStartRef.current;
            let allDone = true;

            historyRef.current = historyRef.current.map(entry => {
                const localIdx = entryIds.indexOf(entry.id);
                if (localIdx === -1) return entry; // old history — untouched

                const line = lines[localIdx];
                if (!line) return entry;

                if (elapsed < line.delay) {
                    allDone = false;
                    return entry; // not time yet
                }

                if (entry.isCommand) {
                    const timeSince = elapsed - line.delay;
                    const chars = Math.floor(timeSince / TYPING_SPEED);
                    if (chars < line.text.length) {
                        allDone = false;
                        return { ...entry, displayText: line.text.substring(0, chars), isComplete: false };
                    }
                    return { ...entry, displayText: line.text, isComplete: true };
                }

                // Non-command: reveal instantly at delay
                return { ...entry, displayText: line.text, isComplete: true };
            });

            rerender();
            scrollToBottom();

            if (allDone && !batchCompleted.current) {
                batchCompleted.current = true;
                onCompleteRef.current();
            } else if (!allDone) {
                animFrameRef.current = requestAnimationFrame(tick);
            }
        };

        animFrameRef.current = requestAnimationFrame(tick);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lines]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    // ── Derive whether the idle cursor should show ────────────────────────
    const allComplete = historyRef.current.length > 0 &&
        historyRef.current.every(e => e.isComplete);
    const showIdleCursor = isPlaying && allComplete;

    return (
        <div className="term-wrapper">
            <div className="term-header">
                <span className="pulse-dot">🔴</span>
                <span className="orbitron title">ATTACKER TERMINAL</span>
                <span className="sub-tag mono">LIVE VIEW</span>
            </div>

            <div className="term-content mono" ref={containerRef}>
                {historyRef.current.map(entry => (
                    <div
                        key={entry.id}
                        className="term-line"
                        style={{ color: entry.color }}
                    >
                        {entry.showPrompt && (
                            <span style={{ color: 'rgba(255,255,255,0.4)', marginRight: '8px' }}>
                                root@kalibox:~#
                            </span>
                        )}
                        {entry.displayText}
                        {/* Show typing cursor for command still being typed */}
                        {entry.isCommand && !entry.isComplete && (
                            <span className="term-cursor" />
                        )}
                    </div>
                ))}

                {/* Idle blinking cursor when playing and all done */}
                {showIdleCursor && (
                    <div className="term-line" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        root@kalibox:~# <span className="term-cursor blink" />
                    </div>
                )}
            </div>

            <style jsx>{`
        .term-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #040d18;
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 4px;
          overflow: hidden;
        }
        .term-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(0,0,0,0.5);
          border-bottom: 1px solid rgba(0,212,255,0.2);
          flex-shrink: 0;
        }
        .orbitron { font-family: 'Orbitron', sans-serif; font-weight: bold; }
        .mono { font-family: 'Share Tech Mono', monospace; }
        .pulse-dot { font-size: 0.8rem; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .title { color: #ff4444; letter-spacing: 1px; }
        .sub-tag { font-size: 0.7rem; color: #6b86a0; margin-left: auto; }

        .term-content {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          font-size: 0.85rem;
          line-height: 1.6;
          height: 100%;
        }
        .term-line {
          margin-bottom: 2px;
          white-space: pre-wrap;
          word-break: break-all;
        }
        .term-cursor {
          display: inline-block;
          width: 8px;
          height: 14px;
          background: #00ff88;
          vertical-align: middle;
          margin-left: 2px;
        }
        .term-cursor.blink {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
        </div>
    );
}
