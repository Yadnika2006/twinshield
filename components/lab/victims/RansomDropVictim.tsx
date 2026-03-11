import React, { useEffect, useState } from 'react';

interface Props { currentScreen: string; onInteraction?: (action: string) => void; }

const FILES = [
    { name: 'report_q4.docx',    icon: '📄', size: '1.2 MB' },
    { name: 'client_list.xlsx',  icon: '📊', size: '856 KB' },
    { name: 'budget_2024.pdf',   icon: '📋', size: '2.1 MB' },
    { name: 'family_photos',     icon: '📁', size: 'folder' },
    { name: 'passwords.txt',     icon: '📝', size: '4 KB'   },
    { name: 'corpbank_strategy.pdf', icon: '📋', size: '5.4 MB' },
];

/* Fake Windows Explorer */
function Explorer({ encryptedCount, allDone }: { encryptedCount: number; allDone?: boolean }) {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: 'sans-serif', overflow: 'hidden' }}>
            {/* toolbar */}
            <div style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb', padding: '6px 14px', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 600 }}>📂 C:\Users\john.smith\Documents</span>
                {encryptedCount > 0 && (
                    <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.7rem', padding: '1px 6px', borderRadius: 3, marginLeft: 'auto' }}>
                        Encrypting: {allDone ? 'COMPLETE' : `${encryptedCount} files...`}
                    </span>
                )}
            </div>
            {/* column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px 80px', gap: 8, padding: '6px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280' }}>
                <span /><span>Name</span><span>Type</span><span>Size</span>
            </div>
            {/* files */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {FILES.map((f, i) => {
                    const enc = i < encryptedCount;
                    return (
                        <div key={f.name} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px 80px', gap: 8, padding: '8px 14px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', background: enc ? 'rgba(220,38,38,0.04)' : '#fff', transition: 'background 0.3s' }}>
                            <span style={{ fontSize: '1.1rem', filter: enc ? 'saturate(0)' : 'none', transition: 'filter 0.3s' }}>
                                {enc ? '🔒' : f.icon}
                            </span>
                            <span style={{ fontSize: '0.82rem', color: enc ? '#dc2626' : '#1e293b', fontFamily: enc ? "'Share Tech Mono',monospace" : 'inherit', transition: 'color 0.3s' }}>
                                {enc ? `${f.name}.encrypted` : f.name}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: enc ? '#dc2626' : '#64748b' }}>
                                {enc ? 'ENCRYPTED' : f.name.includes('.') ? f.name.split('.').pop()?.toUpperCase() + ' File' : 'Folder'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{f.size}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function RansomDropVictim({ currentScreen, onInteraction }: Props) {

    /* encryption animation counter */
    const [encCount, setEncCount] = useState(0);
    useEffect(() => {
        if (currentScreen !== 'encrypting') { setEncCount(0); return; }
        if (encCount >= FILES.length) return;
        const id = setTimeout(() => setEncCount(n => n + 1), 700);
        return () => clearTimeout(id);
    }, [currentScreen, encCount]);

    /* countdown timer for ransom note */
    const [secs, setSecs] = useState(48 * 3600);
    useEffect(() => {
        if (currentScreen !== 'ransom-note') return;
        const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [currentScreen]);

    const hh = String(Math.floor(secs / 3600)).padStart(2, '0');
    const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');

    /* ── FILE-EXPLORER ── */
    if (currentScreen === 'file-explorer') return <Explorer encryptedCount={0} />;

    /* ── ENCRYPTING ── */
    if (currentScreen === 'encrypting') return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Explorer encryptedCount={encCount} />
            {/* CPU spike bar */}
            <div style={{ background: '#1e1e2e', height: 36, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', borderTop: '1px solid #333', flexShrink: 0 }}>
                <span style={{ color: '#ff4444', fontSize: '0.7rem', fontFamily: "'Share Tech Mono',monospace" }}>CPU:</span>
                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(30 + encCount * 12, 100)}%`, background: 'linear-gradient(90deg,#ff8844,#ff4444)', transition: 'width 0.5s' }} />
                </div>
                <span style={{ color: '#ff4444', fontSize: '0.7rem', fontFamily: "'Share Tech Mono',monospace" }}>{Math.min(30 + encCount * 12, 100)}%</span>
            </div>
        </div>
    );

    /* ── ALL-ENCRYPTED ── */
    if (currentScreen === 'all-encrypted') return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: 'sans-serif', overflow: 'hidden' }}>
            <div style={{ background: '#fef2f2', borderBottom: '2px solid #ef4444', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: '1.1rem' }}>🔒</span>
                <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.85rem' }}>ALL FILES ENCRYPTED — 2,847 files affected</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px', gap: 8, padding: '6px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280', flexShrink: 0 }}>
                <span /><span>Name</span><span>Type</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {FILES.map(f => (
                    <div key={f.name} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px', gap: 8, padding: '8px 14px', borderBottom: '1px solid #fef2f2', alignItems: 'center', background: 'rgba(220,38,38,0.03)' }}>
                        <span style={{ fontSize: '1.1rem' }}>🔒</span>
                        <span style={{ fontSize: '0.82rem', color: '#dc2626', fontFamily: "'Share Tech Mono',monospace" }}>{f.name}.encrypted</span>
                        <span style={{ fontSize: '0.72rem', color: '#dc2626' }}>ENCRYPTED</span>
                    </div>
                ))}
                <div style={{ padding: '10px 14px', color: '#dc2626', fontSize: '0.8rem', fontWeight: 700, borderTop: '2px solid #fca5a5' }}>
                    + 2,841 more files encrypted...
                </div>
            </div>
        </div>
    );

    /* ── RANSOM NOTE ── */
    if (currentScreen === 'ransom-note') return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1a1a1a', overflow: 'hidden' }}>
            {/* fake text editor titlebar */}
            <div style={{ background: '#2d2d2d', padding: '7px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: '0.78rem', fontFamily: 'sans-serif' }}>📄 README_DECRYPT.txt — Notepad</span>
                <span style={{ color: '#ff4444', fontSize: '0.7rem', fontFamily: "'Share Tech Mono',monospace" }}>⚠ IMPORTANT</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.78rem', color: '#f1f5f9', lineHeight: 1.9 }}>
                <div style={{ color: '#ff4444', fontWeight: 900, fontSize: '1rem', marginBottom: 16, letterSpacing: 1 }}>
                    ╔══════════════════════════════════╗<br />
                    ║  YOUR FILES HAVE BEEN ENCRYPTED  ║<br />
                    ╚══════════════════════════════════╝
                </div>
                <p>All your documents, photos, databases and other important files have been encrypted with military grade AES-256 encryption.</p>
                <p>To recover your files send <span style={{ color: '#fbbf24', fontWeight: 700 }}>0.5 Bitcoin ($18,500 USD)</span> to:</p>
                <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', padding: '8px 12px', borderRadius: 4, color: '#fbbf24', margin: '8px 0 16px', wordBreak: 'break-all' }}>
                    1A2B3C4D5E6F7G8H9I0J
                </div>
                <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)', padding: '10px 14px', borderRadius: 4, marginBottom: 16 }}>
                    <div style={{ color: '#ff4444', fontWeight: 700, marginBottom: 8 }}>⏰ TIME REMAINING:</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ff4444', letterSpacing: 4 }}>{hh}:{mm}:{ss}</div>
                    <div style={{ color: '#f87171', fontSize: '0.7rem', marginTop: 4 }}>Price DOUBLES after 48 hours · Files DELETED after 96 hours</div>
                </div>
                <p>Contact: <span style={{ color: '#00d4ff' }}>decrypt@darkmail.onion</span></p>
            </div>
        </div>
    );

    /* ── COMPROMISED ── */
    return (
        <div style={{ flex: 1, background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
            <div style={{ fontSize: '4rem', lineHeight: 1 }}>🔐</div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '0.85rem', color: '#ff4444', letterSpacing: 2 }}>ORGANISATION HELD TO RANSOM</div>
            <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: 16, width: '90%', maxWidth: 300 }}>
                {[
                    ['Files encrypted','17,847'],
                    ['Ransom demanded','$18,500'],
                    ['Time remaining', `${hh}:${mm}:${ss}`],
                    ['Backups',        'Encrypted'],
                    ['Machines hit',   '3 systems'],
                ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.74rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}:</span>
                        <span style={{ color: '#ff4444' }}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
