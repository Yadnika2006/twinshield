import React, { useEffect, useState } from 'react';

interface Props { currentScreen: string; onInteraction?: (action: string) => void; }

/* ── Simple Win11 desktop ── */
function SimpleDesktop({ children, dimmed }: { children?: React.ReactNode; dimmed?: boolean }) {
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    useEffect(() => {
        const id = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 10000);
        return () => clearInterval(id);
    }, []);
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg,#0f3460,#16213e,#0f3460)', position: 'relative', overflow: 'hidden', opacity: dimmed ? 0.65 : 1 }}>
            <div style={{ flex: 1, padding: 16, position: 'relative' }}>
                {[['📁','Documents'],['🌐','Browser'],['📧','Email'],['💬','Teams']].map(([icon, name]) => (
                    <div key={name} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 64, margin: '0 8px 16px 0', verticalAlign: 'top', cursor: 'pointer' }}>
                        <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{icon}</span>
                        <span style={{ color: '#fff', fontSize: '0.65rem', textShadow: '0 1px 4px rgba(0,0,0,0.8)', textAlign: 'center' }}>{name}</span>
                    </div>
                ))}
                {children}
            </div>
            <div style={{ background: 'rgba(20,20,20,0.9)', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                    {['🪟','📁','🌐','📧'].map(i => <span key={i} style={{ fontSize: '1.1rem', padding: '0 4px', cursor: 'pointer' }}>{i}</span>)}
                </div>
                <span style={{ color: '#fff', fontSize: '0.72rem' }}>{time}</span>
            </div>
        </div>
    );
}

/* ── flash effect overlay ── */
function Flash({ show }: { show: boolean }) {
    return show ? (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', animation: 'flash 0.4s ease-out forwards', pointerEvents: 'none', zIndex: 99 }} />
    ) : null;
}

export default function SpyAgentVictim({ currentScreen, onInteraction }: Props) {

    /* screenshot flash */
    const [flashing, setFlashing] = useState(false);
    useEffect(() => {
        if (currentScreen !== 'screenshot-taken') return;
        setFlashing(true);
        const id = setTimeout(() => setFlashing(false), 450);
        return () => clearTimeout(id);
    }, [currentScreen]);

    /* webcam blink */
    const [camOn, setCamOn] = useState(false);
    useEffect(() => {
        if (currentScreen !== 'camera-active') { setCamOn(false); return; }
        setCamOn(true);
        const id = setTimeout(() => setCamOn(false), 2200);
        return () => clearTimeout(id);
    }, [currentScreen]);

    /* upload progress */
    const [upPct, setUpPct] = useState(0);
    useEffect(() => {
        if (currentScreen !== 'data-sent') { setUpPct(0); return; }
        const id = setInterval(() => setUpPct(p => Math.min(p + 2, 100)), 80);
        return () => clearInterval(id);
    }, [currentScreen]);

    /* ── DESKTOP-NORMAL ── */
    if (currentScreen === 'desktop-normal') return <SimpleDesktop />;

    /* ── SPYWARE-ACTIVE ── */
    if (currentScreen === 'spyware-active') return (
        <SimpleDesktop>
            {/* barely visible indicator */}
            <div title="svchost.exe" style={{ position: 'absolute', bottom: 52, right: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, background: '#ef4444', borderRadius: '50%', display: 'inline-block', opacity: 0.45, animation: 'pulse 2.5s infinite' }} />
            </div>
        </SimpleDesktop>
    );

    /* ── SCREENSHOT-TAKEN ── */
    if (currentScreen === 'screenshot-taken') return (
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <SimpleDesktop dimmed={false} />
            <Flash show={flashing} />
            {/* screen capture badge */}
            <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.88)', border: '1px solid rgba(255,68,68,0.4)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(10px)' }}>
                <span style={{ fontSize: '1.1rem' }}>📸</span>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem', color: '#ff4444' }}>
                    <div>screen_004.png captured</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>→ attacker server</div>
                </div>
            </div>
        </div>
    );

    /* ── CAMERA-ACTIVE ── */
    if (currentScreen === 'camera-active') return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
            <SimpleDesktop dimmed />
            {/* fake laptop bezel with webcam */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 28, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: camOn ? '#22c55e' : '#374151', boxShadow: camOn ? '0 0 8px #22c55e' : 'none', transition: 'all 0.3s' }} />
                {camOn && (
                    <span style={{ color: '#22c55e', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem', animation: 'fadeIn 0.3s ease' }}>📷 CAMERA ACCESSED</span>
                )}
            </div>
            {/* notification */}
            {camOn && (
                <div style={{ position: 'absolute', bottom: 52, right: 16, background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 8, padding: '8px 14px', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem' }}>
                    <div style={{ color: '#22c55e', marginBottom: 2 }}>📷 Camera accessed silently</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>svchost.exe (hidden process)</div>
                </div>
            )}
        </div>
    );

    /* ── DATA-SENT ── */
    if (currentScreen === 'data-sent') return (
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <SimpleDesktop dimmed />
            {/* upload widget */}
            <div style={{ position: 'absolute', bottom: 52, right: 16, background: 'rgba(0,0,0,0.92)', border: '1px solid rgba(0,212,255,0.35)', borderRadius: 10, padding: '12px 16px', width: 220, backdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: "'Share Tech Mono',monospace", fontSize: '0.68rem' }}>
                    <span style={{ color: '#00d4ff' }}>⬆ Uploading...</span>
                    <span style={{ color: '#fbbf24' }}>{upPct}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ height: '100%', width: `${upPct}%`, background: 'linear-gradient(90deg,#00d4ff,#00ff88)', transition: 'width 0.08s' }} />
                </div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>
                    234 MB → attacker.server.com
                </div>
            </div>
        </div>
    );

    /* ── COMPROMISED ── */
    return (
        <div style={{ flex: 1, background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
            <div style={{ fontSize: '4rem', lineHeight: 1 }}>🕵️</div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '0.85rem', color: '#ff4444', letterSpacing: 2 }}>FULL SURVEILLANCE ACTIVE</div>
            {/* screenshot grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, width: '90%', maxWidth: 300, marginBottom: 8 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{ aspectRatio: '16/9', background: `hsl(${i * 30},40%,20%)`, borderRadius: 4, border: '1px solid rgba(255,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
                        📸
                    </div>
                ))}
            </div>
            <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: 14, width: '90%', maxWidth: 300 }}>
                {[
                    ['Screenshots',   '47 images'],
                    ['Audio clips',   '8 recordings'],
                    ['Webcam photos', '12 captured'],
                    ['Days monitored','7 days'],
                    ['Data sent',     '234 MB'],
                ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}:</span>
                        <span style={{ color: '#ff4444' }}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
