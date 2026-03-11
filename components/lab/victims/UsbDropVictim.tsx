import React, { useEffect, useState } from 'react';

interface Props { currentScreen: string; onInteraction?: (action: string) => void; }

/* ── Windows 11 Taskbar ── */
function Taskbar() {
    return (
        <div style={{ background: 'rgba(30,30,30,0.95)', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {['🪟','📁','🌐','📧','⚙️'].map(icon => (
                    <div key={icon} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, fontSize: '1.1rem', cursor: 'pointer' }}>{icon}</div>
                ))}
            </div>
            <div style={{ color: '#fff', fontSize: '0.75rem', fontFamily: 'sans-serif', textAlign: 'right' }}>
                <div>14:30</div>
                <div style={{ opacity: 0.6 }}>10 Mar 2026</div>
            </div>
        </div>
    );
}

/* ── Full fake Win11 desktop ── */
function Desktop({ children }: { children?: React.ReactNode }) {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'linear-gradient(135deg,#0f3460,#16213e,#0f3460)', position: 'relative' }}>
            <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
                {[['📁','Documents'],['🌐','Browser'],['📧','CorpBank Mail'],['🏦','CorpBank Portal']].map(([icon, name]) => (
                    <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 64, cursor: 'pointer' }}>
                        <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{icon}</span>
                        <span style={{ color: '#fff', fontSize: '0.65rem', textShadow: '0 1px 4px rgba(0,0,0,0.8)', textAlign: 'center' }}>{name}</span>
                    </div>
                ))}
                {children}
            </div>
            <Taskbar />
        </div>
    );
}

/* ── fake windows-style titlebar ── */
function WinBar({ title, color = '#1e3a8a' }: { title: string; color?: string }) {
    return (
        <div style={{ background: color, padding: '7px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontSize: '0.8rem', fontFamily: 'sans-serif' }}>{title}</span>
            <div style={{ display: 'flex', gap: 8 }}>
                {['–','□','✕'].map(s => (
                    <span key={s} style={{ color: '#fff', opacity: 0.7, fontSize: '0.75rem', cursor: 'pointer' }}>{s}</span>
                ))}
            </div>
        </div>
    );
}

export default function UsbDropVictim({ currentScreen, onInteraction }: Props) {

    /* installer progress animation */
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if (currentScreen !== 'autorun-trigger') { setProgress(0); return; }
        const id = setInterval(() => setProgress(p => Math.min(p + 1.2, 100)), 80);
        return () => clearInterval(id);
    }, [currentScreen]);

    /* ── OFFICE-FLOOR ── */
    if (currentScreen === 'office-floor') return (
        <div style={{ flex: 1, background: '#2d3748', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* floor pattern */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            {/* usb drive element */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, zIndex: 10 }}>
                <div style={{ color: '#cbd5e1', fontSize: '1rem', fontFamily: 'sans-serif', opacity: 0.8 }}>
                    Someone left this USB drive in the car park...
                </div>
                <div 
                    onClick={() => onInteraction?.('pick-up-usb')}
                    style={{ background: '#1e293b', border: '2px solid #475569', borderRadius: 8, padding: '16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'transform 0.2s, boxShadow 0.2s', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', cursor: currentScreen === 'office-floor' ? 'pointer' : 'default' }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,212,255,0.2)'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)'; }}
                >
                    <span style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}>💾</span>
                    <div style={{ background: '#fef3c7', padding: '4px 12px', border: '1px solid #f59e0b', borderRadius: 2, transform: 'rotate(-2deg)' }}>
                        <span style={{ color: '#d97706', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.75rem', fontWeight: 'bold' }}>SALARY INFORMATION Q4 2024</span>
                    </div>
                </div>
                <div style={{ color: '#00d4ff', fontSize: '0.8rem', fontFamily: "'Orbitron',sans-serif", animation: 'pulse 2s infinite' }}>
                    CLICK TO INSERT USB
                </div>
            </div>
        </div>
    );

    /* ── USB-INSERTED (AutoPlay Dialog) ── */
    if (currentScreen === 'usb-inserted') return (
        <Desktop>
            <div style={{ position: 'absolute', top: 24, right: 24, background: '#fff', border: '1px solid #94a3b8', borderRadius: 4, width: 340, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', overflow: 'hidden', fontFamily: 'sans-serif', zIndex: 100, animation: 'slideInRight 0.3s ease-out' }}>
                <WinBar title="AutoPlay" />
                <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <span style={{ fontSize: '2rem' }}>💾</span>
                        <div>
                            <div style={{ fontWeight: 700, color: '#1e293b' }}>CorpBank IT Tools (E:)</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Always do this for software and games:</div>
                        </div>
                    </div>
                    
                    <div style={{ color: '#334155', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Install or run program from your media</div>
                    
                    <button onClick={() => onInteraction?.('run-autoplay')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 4, cursor: 'pointer', textAlign: 'left', marginBottom: 12, transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#dbeafe'} onMouseOut={e=>e.currentTarget.style.background='#eff6ff'}>
                        <span style={{ fontSize: '1.5rem' }}>🏦</span>
                        <div>
                            <div style={{ color: '#1d4ed8', fontWeight: 700, fontSize: '0.85rem' }}>Install CorpBank Security Update</div>
                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Published by CorpBank IT</div>
                        </div>
                    </button>

                    <div style={{ color: '#334155', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Other choices</div>
                    
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'transparent', border: '1px solid transparent', cursor: 'pointer', textAlign: 'left', marginBottom: 4 }} onMouseOver={e=>e.currentTarget.style.background='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                        <span style={{ fontSize: '1.2rem' }}>📁</span>
                        <div style={{ color: '#1e293b', fontSize: '0.85rem' }}>Open folder to view files</div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'transparent', border: '1px solid transparent', cursor: 'pointer', textAlign: 'left' }} onMouseOver={e=>e.currentTarget.style.background='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                        <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>⚙️</span>
                        <div style={{ color: '#1e293b', fontSize: '0.85rem' }}>Take no action</div>
                    </div>
                </div>
            </div>
            {/* hidden desktop icons to simulate full view */}
        </Desktop>
    );

    /* ── AUTORUN-TRIGGER (Fake Installer) ── */
    if (currentScreen === 'autorun-trigger') return (
        <Desktop>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', border: '1px solid #94a3b8', borderRadius: 4, width: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', overflow: 'hidden', fontFamily: 'sans-serif', zIndex: 100 }}>
                <WinBar title="CorpBank Security Update v2.1 — Setup" />
                <div style={{ padding: 28, textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', borderRadius: 12, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🏦</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Installing CorpBank IT Tools</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 24 }}>Please wait while the software is installed...</div>
                    {/* progress bar */}
                    <div style={{ background: '#f1f5f9', height: 22, borderRadius: 3, border: '1px solid #cbd5e1', overflow: 'hidden', marginBottom: 10 }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#1e3a8a,#3b82f6)', transition: 'width 0.08s', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
                            {progress > 15 && <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>{Math.round(progress)}%</span>}
                        </div>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 20 }}>
                        {progress < 40 ? 'Extracting files...' : progress < 80 ? 'Connecting to 192.168.1.200...' : 'Establishing background service...'}
                    </div>
                </div>
            </div>
        </Desktop>
    );

    /* ── BACKDOOR OPEN ── */
    if (currentScreen === 'backdoor-open') return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0a1a', overflow: 'hidden' }}>
            {/* RED BANNER */}
            <div style={{ background: '#dc2626', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: '0.9rem' }}>🚨</span>
                <span style={{ color: '#fff', fontFamily: "'Orbitron',sans-serif", fontSize: '0.75rem', letterSpacing: 1 }}>CORPORATE NETWORK BREACHED — ATTACKER PIVOTING</span>
            </div>
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <Desktop />
                {/* right: cmd overlay terminal */}
                <div style={{ position: 'absolute', top: 60, right: 30, width: 380, height: 280, background: '#000', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#333', padding: '4px 10px', color: '#fff', fontSize: '0.7rem', fontFamily: 'sans-serif', display: 'flex', justifyContent: 'space-between' }}>
                        <span>C:\Windows\System32\cmd.exe</span>
                        <div style={{ display: 'flex', gap: 8 }}><span>_</span><span>□</span><span>X</span></div>
                    </div>
                    <div style={{ flex: 1, padding: 12, fontFamily: "'Consolas', monospace", fontSize: '0.75rem', color: '#ccc', overflowY: 'auto' }}>
                        <div>Microsoft Windows [Version 10.0.22621.1702]</div>
                        <div style={{ marginBottom: 16 }}>(c) Microsoft Corporation. All rights reserved.</div>
                        <div style={{ color: '#fff' }}>C:\Windows\System32&gt; <span style={{ color: '#ef4444' }}>meterpreter session 1 opened</span></div>
                        <div style={{ color: '#a3e635' }}>[+] Inside: CorpBank internal network</div>
                        <div style={{ color: '#a3e635' }}>[+] Domain: CORPBANK.LOCAL</div>
                        <div style={{ color: '#fff', marginTop: 8 }}>meterpreter &gt; run post/multi/recon/local_exploit</div>
                        <div style={{ color: '#fbbf24' }}>[*] Finding privilege escalation paths...</div>
                        <div style={{ color: '#a3e635' }}>[+] Domain admin credentials in memory!</div>
                        <div style={{ color: '#fff', marginTop: 8 }}>meterpreter &gt; hashdump</div>
                        <div style={{ color: '#a3e635' }}>[+] Administrator:500:hash:hash</div>
                        <div style={{ color: '#fff', marginTop: 8 }}>meterpreter &gt; run post/windows/manage/migrate</div>
                        <div style={{ color: '#fbbf24' }}>[*] Pivoting to domain controller...</div>
                        <div style={{ color: '#ef4444', fontWeight: 'bold' }}>[+] DOMAIN ADMIN ACCESS ACHIEVED</div>
                    </div>
                </div>
            </div>
        </div>
    );

    /* ── COMPROMISED ── */
    return (
        <div style={{ flex: 1, background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
            <div style={{ fontSize: '4rem', lineHeight: 1 }}>🏢</div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '0.85rem', color: '#ff4444', letterSpacing: 2 }}>ENTIRE ORGANISATION COMPROMISED</div>
            <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: 16, width: '90%', maxWidth: 300 }}>
                {[
                    ['Entry vector',   'USB drop (car park)'],
                    ['Privilege level','Domain Admin'],
                    ['Machines hit',   'ALL accessible'],
                    ['Data exposed',   'ALL accessible'],
                    ['Time to admin',  '4 minutes'],
                ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.74rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}:</span>
                        <span style={{ color: '#ff4444' }}>{v}</span>
                    </div>
                ))}
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: '#ff4444', textAlign: 'center', padding: '0 20px' }}>
                One USB bypassed all perimeter security
            </div>
        </div>
    );
}
