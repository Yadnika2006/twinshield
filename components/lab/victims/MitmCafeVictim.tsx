import React from 'react';

interface Props { 
    currentScreen: string; 
    onInteraction?: (action: string) => void;
}

export default function MitmCafeVictim({ currentScreen, onInteraction }: Props) {
    if (currentScreen === 'compromised') {
        return (
            <div style={{ flex: 1, background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
                <div style={{ fontSize: '4rem', lineHeight: 1 }}>📡</div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '0.85rem', color: '#ff4444', letterSpacing: 2 }}>MAN IN THE MIDDLE SUCCESSFUL</div>
                <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: 16, width: '90%', maxWidth: 320 }}>
                    {[
                        ['Attack Phase 1', 'ARP Spoof Poison'],
                        ['Attack Phase 2', 'SSLstrip Downgrade'],
                        ['Attack Phase 3', 'Plaintext Cred Capture'],
                        ['Attack Phase 4', 'Cookie Replay Hijack'],
                        ['Outcome',        'Bank Details Stolen']
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.74rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}:</span>
                            <span style={{ color: '#ff4444' }}>{v}</span>
                        </div>
                    ))}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: '#ff4444', textAlign: 'center', padding: '0 20px' }}>
                    Lack of VPN means public Wi-Fi is intrinsically insecure.
                </div>
            </div>
        );
    }

    /* MOCK BROWSER FRAME */
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#e5e5ea', padding: 20 }}>
            {/* Browser Window Wrapper */}
            <div style={{ flex: 1, background: '#fff', borderRadius: 8, border: '1px solid #d1d1d6', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                
                {/* Safari-like Top Bar */}
                <div style={{ background: '#f2f2f7', display: 'flex', flexDirection: 'column' }}>
                    {/* Tab Bar */}
                    <div style={{ display: 'flex', padding: '8px 12px 0', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginRight: 16 }}>
                            {['#ff3b30', '#ffcc00', '#28cd41'].map(c => (
                                <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                            ))}
                        </div>
                        <div style={{ background: '#fff', borderRadius: '8px 8px 0 0', padding: '6px 24px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#1c1c1e', fontWeight: 500, border: '1px solid #d1d1d6', borderBottom: 'none' }}>
                            <span>🏦</span> CorpBank Online
                        </div>
                    </div>
                    {/* Address Bar Row */}
                    <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', gap: 16, borderBottom: '1px solid #d1d1d6' }}>
                        <div style={{ display: 'flex', gap: 16, color: '#8e8e93', fontSize: '1.2rem' }}>
                            <span>{'<'}</span> <span>{'>'}</span> <span style={{ transform: 'rotate(45deg)' }}>↻</span>
                        </div>
                        {/* THE URL BAR */}
                        <div style={{ flex: 1, background: '#fff', border: '1px solid #d1d1d6', borderRadius: 6, padding: '4px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            {(currentScreen === 'cafe-browser' || currentScreen === 'arp-poisoned') ? (
                                <span style={{ color: '#000', fontSize: '0.9rem', fontWeight: 500 }}>
                                    <span style={{ color: '#8e8e93', marginRight: 4 }}>🔒</span> https://corpbank.com
                                </span>
                            ) : (
                                <span style={{ color: '#ff453a', fontSize: '0.9rem', fontWeight: 500, animation: 'flashUrl 1s ease-out' }}>
                                    <span style={{ fontWeight: 700, marginRight: 4 }}>Not Secure</span> http://corpbank.com
                                </span>
                            )}
                        </div>
                        <div style={{ color: '#8e8e93', fontSize: '1.2rem' }}>⚙️</div>
                    </div>
                </div>

                {/* THE PAGE CONTENT (CorpBank Login) */}
                <div style={{ flex: 1, display: 'flex', backgroundColor: '#f9fafb', position: 'relative' }}>
                    {/* Left Banner */}
                    <div style={{ flex: 1, background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', display: 'flex', flexDirection: 'column', padding: 48, color: '#fff', justifyContent: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 24 }}>🏦</div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 16px 0' }}>CorpBank</h1>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.5 }}>Secure online banking for personal and business accounts. Enjoy seamless transactions globally.</p>
                    </div>
                    {/* Right Login Panel */}
                    <div style={{ width: 400, background: '#fff', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#111827', margin: '0 0 8px 0', fontWeight: 600 }}>Welcome back</h2>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 32px 0' }}>Please enter your credentials to access your account.</p>

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#374151', marginBottom: 6 }}>Email Address</label>
                            <div style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem', color: '#111827', background: currentScreen === 'login-intercepted' ? '#f3f4f6' : '#fff', position: 'relative' }}>
                                {currentScreen === 'login-intercepted' ? 'john.smith@corpbank.com' : <span style={{ color: '#9ca3af' }}>Enter your email</span>}
                                {currentScreen === 'login-intercepted' && <span style={{ position: 'absolute', right: 12, top: 12, color: '#22c55e' }}>✔️</span>}
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#374151', marginBottom: 6 }}>Password</label>
                            <div style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4, background: currentScreen === 'login-intercepted' ? '#f3f4f6' : '#fff' }}>
                                {currentScreen === 'login-intercepted' ? (
                                    Array.from({length: 12}).map((_,i) => <span key={i} style={{fontSize:'0.6rem'}}>⚫</span>)
                                ) : (
                                    <span style={{ color: '#9ca3af' }}>Enter your password</span>
                                )}
                            </div>
                        </div>

                        <button style={{ background: '#2563eb', color: '#fff', fontWeight: 500, padding: '12px', border: 'none', borderRadius: 6, fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.2s', alignSelf: 'stretch', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {currentScreen === 'login-intercepted' ? (
                                <span style={{ animation: 'spin 1s linear infinite' }}>↻</span>
                            ) : 'Sign In'}
                        </button>
                    </div>

                    {/* INTERCEPTION OVERLAY (Hidden during normal flow until interception) */}
                    {currentScreen === 'login-intercepted' && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(2px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                            <div style={{ width: 80, height: 80, background: '#ef4444', borderRadius: '50%', color: '#fff', fontSize: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 10px 25px rgba(239,68,68,0.4)', animation: 'pop 0.4s ease-out' }}>
                                🔓
                            </div>
                            <div style={{ background: '#fff', border: '2px solid #ef4444', borderRadius: 12, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center', animation: 'slideUp 0.5s ease-out 0.2s both' }}>
                                <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '1.2rem', marginBottom: 12, letterSpacing: 1 }}>CREDENTIALS INTERCEPTED</div>
                                <div style={{ fontFamily: "'Consolas', monospace", background: '#1f2937', color: '#f3f4f6', padding: '12px 16px', borderRadius: 6, fontSize: '0.85rem', textAlign: 'left' }}>
                                    <span style={{ color: '#9ca3af' }}>POST</span> /login 
                                    <br/><br/>
                                    <span style={{ color: '#fbbf24' }}>username=</span>john.smith@corpbank.com<br/>
                                    <span style={{ color: '#fbbf24' }}>password=</span>CorpBank2024!
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* BOTTOM STATUS BAR (To hint at ARP poisoning invisibly) */}
                <div style={{ background: '#f2f2f7', borderTop: '1px solid #d1d1d6', padding: '4px 12px', fontSize: '0.7rem', color: '#8e8e93', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        {currentScreen === 'arp-poisoned' ? 'Resolving host corpbank.com...' : 'Done'}
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span>📶 CafeGuest-WiFi</span>
                        <span style={{ color: currentScreen === 'https-stripped' || currentScreen === 'login-intercepted' ? '#ff453a' : '#8e8e93' }}>
                            {currentScreen === 'https-stripped' || currentScreen === 'login-intercepted' ? 'Gateway: Untrusted' : 'Gateway: 192.168.0.1'}
                        </span>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes flashUrl { 0% { background: #ff453a; color: #fff; } 100% { background: transparent; color: #ff453a; } }
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                    @keyframes pop { 0% { transform: scale(0); } 80% { transform: scale(1.1); } 100% { transform: scale(1); } }
                    @keyframes slideUp { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
                `}} />
            </div>
        </div>
    );
}
