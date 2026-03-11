import React, { useEffect, useState } from 'react';

interface Props { currentScreen: string; onInteraction?: (action: string) => void; }

/* ── Windows 11 Taskbar ── */
function Taskbar({ time }: { time: string }) {
    return (
        <div style={{ background: 'rgba(30,30,30,0.95)', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, backdropFilter: 'blur(20px)' }}>
            {/* center icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {['🪟','📁','🌐','📧','⚙️'].map(icon => (
                    <div key={icon} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, fontSize: '1.1rem', cursor: 'pointer' }}>{icon}</div>
                ))}
            </div>
            {/* clock */}
            <div style={{ color: '#fff', fontSize: '0.75rem', fontFamily: 'sans-serif', textAlign: 'right' }}>
                <div>{time}</div>
                <div style={{ opacity: 0.6 }}>10 Mar 2026</div>
            </div>
        </div>
    );
}

/* ── Full fake Win11 desktop ── */
function Desktop({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) {
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    useEffect(() => {
        const id = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 10000);
        return () => clearInterval(id);
    }, []);
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'linear-gradient(135deg,#0f3460,#16213e,#0f3460)', position: 'relative', ...style }}>
            {/* wallpaper icons */}
            <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
                {[['📁','Documents'],['🌐','Browser'],['📧','CorpBank Mail'],['🏦','CorpBank Portal']].map(([icon, name]) => (
                    <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 64, cursor: 'pointer' }}>
                        <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{icon}</span>
                        <span style={{ color: '#fff', fontSize: '0.65rem', textShadow: '0 1px 4px rgba(0,0,0,0.8)', textAlign: 'center' }}>{name}</span>
                    </div>
                ))}
                {children}
            </div>
            <Taskbar time={time} />
        </div>
    );
}

export default function KeyLoggerVictim({ currentScreen, onInteraction }: Props) {

    /* live keystrokes to display */
    const keystream = [
        'j','o','h','n','.','s','m','i','t','h','@','c','o','r','p','b','a','n','k','.','c','o','m',
        '[TAB]','C','o','r','p','B','a','n','k','2','0','2','4','!','[ENTER]'
    ];
    const [keyIdx, setKeyIdx] = useState(0);
    const [keys, setKeys] = useState<string[]>([]);
    useEffect(() => {
        if (currentScreen !== 'keys-captured') { setKeys([]); setKeyIdx(0); return; }
        if (keyIdx >= keystream.length) return;
        const id = setTimeout(() => {
            setKeys(prev => [...prev, keystream[keyIdx]]);
            setKeyIdx(i => i + 1);
        }, 180);
        return () => clearTimeout(id);
    }, [currentScreen, keyIdx]);

    /* envelope animation */
    const [envSent, setEnvSent] = useState(false);
    useEffect(() => {
        if (currentScreen !== 'log-exfiltrated') { setEnvSent(false); return; }
        const id = setTimeout(() => setEnvSent(true), 2500);
        return () => clearTimeout(id);
    }, [currentScreen]);

    /* ── DESKTOP-NORMAL ── */
    if (currentScreen === 'desktop-normal') return <Desktop />;

    /* ── KEYLOGGER-ACTIVE ── */
    if (currentScreen === 'keylogger-active') return (
        <Desktop>
            {/* barely-visible red dot */}
            <div title="svchost_helper running" style={{ position: 'absolute', bottom: 56, right: 16, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', opacity: 0.55, animation: 'pulse 2s infinite' }} />
            {/* tiny process note */}
            <div style={{ position: 'absolute', bottom: 50, right: 8, background: 'rgba(0,0,0,0.8)', color: '#ef4444', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem', padding: '2px 6px', borderRadius: 3, opacity: 0.4 }}>
                svchost_helper.exe
            </div>
        </Desktop>
    );

    /* ── KEYS-CAPTURED ── */
    if (currentScreen === 'keys-captured') return (
        <Desktop>
            {/* floating keystroke display */}
            <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,68,68,0.4)', borderRadius: 8, padding: '12px 14px', width: 240, backdropFilter: 'blur(10px)' }}>
                <div style={{ color: '#ff4444', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.65rem', marginBottom: 8, letterSpacing: 1 }}>⌨ KEYSTROKE CAPTURE</div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: '#fbbf24', lineHeight: 1.8, wordBreak: 'break-all', minHeight: 60 }}>
                    {keys.map((k, i) => (
                        <span key={i} style={{ color: k.startsWith('[') ? '#00d4ff' : '#fbbf24' }}>{k}</span>
                    ))}
                    <span style={{ animation: 'pulse 0.8s infinite', color: '#fff' }}>▌</span>
                </div>
            </div>
        </Desktop>
    );

    /* ── LOG-EXFILTRATED ── */
    if (currentScreen === 'log-exfiltrated') return (
        <Desktop>
            {!envSent && (
                <div style={{
                    position: 'absolute', bottom: 80, right: 16,
                    background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(251,191,36,0.4)',
                    borderRadius: 8, padding: '10px 14px', fontSize: '0.7rem', fontFamily: "'Share Tech Mono',monospace",
                    color: '#fbbf24', backdropFilter: 'blur(10px)',
                    animation: !envSent ? 'slideUp 0.4s ease' : 'slideOff 0.5s ease forwards',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1.2rem' }}>✉️</span>
                        <div>
                            <div>Sending keystroke log...</div>
                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>attacker@protonmail.com</div>
                        </div>
                    </div>
                </div>
            )}
        </Desktop>
    );

    /* ── COMPROMISED ── */
    return (
        <div style={{ flex: 1, background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
            <div style={{ fontSize: '4rem', lineHeight: 1 }}>⌨️</div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '0.85rem', color: '#ff4444', letterSpacing: 2 }}>ALL KEYSTROKES CAPTURED</div>
            <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: 16, width: '90%', maxWidth: 300 }}>
                {[
                    ['Keystrokes', '2,847 captured'],
                    ['Passwords',  '8 extracted'],
                    ['Credit card','4532-XXXX-1234'],
                    ['Messages',   '24 private'],
                ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.74rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}:</span>
                        <span style={{ color: '#ff4444' }}>{v}</span>
                    </div>
                ))}
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: '#fbbf24', textAlign: 'center', padding: '0 20px' }}>
                Sent to: attacker@protonmail.com
            </div>
        </div>
    );
}
