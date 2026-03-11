import React, { useEffect, useState } from 'react';

interface Props { currentScreen: string; onInteraction?: (action: string) => void; }

function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ background: '#e2e8f0', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, borderBottom: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                    {['#ff5f57','#ffbd2e','#28ca41'].map(c => <span key={c} style={{ display:'inline-block', width:12, height:12, borderRadius:'50%', background:c }} />)}
                </div>
                <div style={{ flex: 1, background: '#f8fafc', padding: '4px 12px', borderRadius: 4, fontSize: '0.78rem', fontFamily: 'sans-serif', color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                    🔒 {url}
                </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
        </div>
    );
}

function LoginForm({ onInteraction }: { onInteraction?: (action: string) => void }) {
    return (
        <div style={{ background: '#f5f7fa', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <div style={{ background: '#fff', borderRadius: 10, padding: 36, width: '100%', maxWidth: 340, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontFamily: 'sans-serif' }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'1.6rem', fontWeight:900, color:'#1e3a8a', letterSpacing:2 }}>CORPBANK</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>Online Banking</div>
                </div>
                <input placeholder="Username" style={{ width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:6, fontSize:'0.9rem', marginBottom:14, boxSizing:'border-box' }} />
                <input type="password" placeholder="Password" style={{ width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:6, fontSize:'0.9rem', marginBottom:20, boxSizing:'border-box' }} />
                <button 
                    onClick={() => onInteraction?.('submit-login')}
                    style={{ width:'100%', padding:12, background:'linear-gradient(135deg,#1e3a8a,#3b82f6)', color:'#fff', border:'none', borderRadius:6, fontSize:'0.95rem', fontWeight:700, cursor:'pointer' }}
                >
                    Log In
                </button>
                <div style={{ marginTop: 14, fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>No CAPTCHA · No lockout warning</div>
            </div>
        </div>
    );
}

export default function BruteXVictim({ currentScreen, onInteraction }: Props) {

    /* Brute force attempt animation */
    const [attempt, setAttempt] = useState(0);
    const passwords = ['password','123456','admin123','letmein','welcome1','qwerty','monkey','dragon','sunshine','password1','welcome123'];
    useEffect(() => {
        if (currentScreen !== 'brute-forcing') { setAttempt(0); return; }
        const id = setInterval(() => setAttempt(n => (n + 1) % passwords.length), 350);
        return () => clearInterval(id);
    }, [currentScreen]);

    const [attemptCount, setAttemptCount] = useState(0);
    useEffect(() => {
        if (currentScreen !== 'brute-forcing') { setAttemptCount(0); return; }
        const id = setInterval(() => setAttemptCount(n => Math.min(n + 11, 847)), 50);
        return () => clearInterval(id);
    }, [currentScreen]);

    /* ── LOGIN-FORM ── */
    if (currentScreen === 'login-form') return (
        <BrowserChrome url="https://corpbank.com/login"><LoginForm onInteraction={onInteraction} /></BrowserChrome>
    );

    /* ── INTERCEPTED ── */
    if (currentScreen === 'intercepted') return (
        <BrowserChrome url="https://corpbank.com/login">
            <div style={{ display: 'flex', height: '100%', minHeight: 400 }}>
                <div style={{ flex: 1 }}><LoginForm onInteraction={onInteraction} /></div>
                {/* Burp overlay */}
                <div style={{ width: 240, background: '#1e1e2e', borderLeft: '2px solid #f97316', padding: 14, fontFamily:"'Share Tech Mono',monospace", fontSize: '0.68rem', color: '#c8e6f0', overflowY: 'auto' }}>
                    <div style={{ color: '#f97316', fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>🔶 BURP SUITE INTERCEPTED</div>
                    <div style={{ color: '#6b86a0', marginBottom: 8 }}>POST /login HTTP/1.1</div>
                    <div style={{ color: '#6b86a0', marginBottom: 4 }}>Host: corpbank.com</div>
                    <div style={{ color: '#6b86a0', marginBottom: 12 }}>Content-Type: application/x-www-form-urlencoded</div>
                    <div style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', padding: '8px 10px', borderRadius: 4, color: '#fbbf24', lineHeight: 1.8 }}>
                        username=<b>admin</b><br />&password=<b>test123</b>
                    </div>
                    <div style={{ marginTop: 12, color: '#00ff88', fontSize: '0.65rem' }}>→ Sending to Intruder...</div>
                </div>
            </div>
        </BrowserChrome>
    );

    /* ── BRUTE-FORCING ── */
    if (currentScreen === 'brute-forcing') return (
        <BrowserChrome url="https://corpbank.com/login">
            <div style={{ position: 'relative', height: '100%' }}>
                <LoginForm onInteraction={onInteraction} />
                {/* attempt counter overlay */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(4,13,24,0.95)', borderTop: '2px solid #ff4444', padding: '12px 18px', fontFamily:"'Share Tech Mono',monospace" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.78rem' }}>
                        <span style={{ color: '#ff4444' }}>⚡ HYDRA BRUTE FORCE ACTIVE</span>
                        <span style={{ color: '#ffcc00' }}>1,000 attempts/sec</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: '0.73rem', marginBottom: 10 }}>
                        <span style={{ color: '#6b86a0' }}>Trying:</span>
                        <span style={{ color: '#fff' }}>admin</span>
                        <span style={{ color: '#ff8844' }}>/ {passwords[attempt]}</span>
                        <span style={{ color: '#ff4444', marginLeft: 'auto' }}>FAILED</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.72rem', color: '#6b86a0' }}>
                        <span>Attempts: <b style={{ color: '#fff' }}>{attemptCount}</b> / 14,000,000</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(attemptCount / 847) * 100}%`, background: 'linear-gradient(90deg,#ff4444,#ff8844)', transition: 'width 0.05s' }} />
                    </div>
                </div>
            </div>
        </BrowserChrome>
    );

    /* ── LOGIN-SUCCESS ── */
    if (currentScreen === 'login-success') return (
        <BrowserChrome url="https://corpbank.com/admin">
            <div style={{ background: '#f0fdf4', minHeight: '100%', fontFamily: 'sans-serif' }}>
                <div style={{ background: 'linear-gradient(135deg,#166534,#16a34a)', padding: '12px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ fontFamily:"'Orbitron',sans-serif", letterSpacing:1 }}>ADMIN DASHBOARD</b>
                    <span style={{ fontSize: '0.8rem' }}>Logged in: <b>admin</b> (brute forced)</span>
                </div>
                <div style={{ padding: 20 }}>
                    <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 6, padding: '10px 16px', marginBottom: 18, fontSize: '0.8rem', color: '#166534' }}>
                        ✓ Login successful with password: <b>welcome123</b>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        {[['👤 Users','10,000 accounts'],['💳 Cards','25,000 records'],['💰 Finances','Full access'],['⚙️ System','Config exposed']].map(([k,v]) => (
                            <div key={k} style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 8, padding: '14px 16px' }}>
                                <div style={{ fontSize: '1rem', marginBottom: 4 }}>{k}</div>
                                <div style={{ color: '#166534', fontWeight: 700 }}>{v}</div>
                                <button style={{ marginTop: 8, fontSize: '0.7rem', padding: '4px 10px', background: '#166534', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Download ↓</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </BrowserChrome>
    );

    /* ── COMPROMISED ── */
    return (
        <div style={{ flex: 1, background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
            <div style={{ fontSize: '5rem', lineHeight: 1 }}>🔓</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'0.9rem', color:'#ff4444', letterSpacing:2 }}>ACCOUNT TAKEOVER COMPLETE</div>
            <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: 16, width: '90%', maxWidth: 300 }}>
                {[['Method','Brute force (Hydra)'],['Attempts','847 of 14M tried'],['Password','welcome123'],['Accounts exposed','10,000']].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontFamily:"'Share Tech Mono',monospace", fontSize:'0.75rem' }}>
                        <span style={{ color:'rgba(255,255,255,0.4)' }}>{k}:</span>
                        <span style={{ color:'#ff4444' }}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
