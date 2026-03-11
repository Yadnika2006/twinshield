import React from 'react';

interface Props { 
    currentScreen: string; 
    onInteraction?: (action: string) => void;
}

export default function FakeAPVictim({ currentScreen, onInteraction }: Props) {
    if (currentScreen === 'compromised') {
        return (
            <div style={{ flex: 1, background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
                <div style={{ fontSize: '4rem', lineHeight: 1 }}>📶</div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '0.85rem', color: '#ff4444', letterSpacing: 2 }}>TRAFFIC FULLY CAPTURED</div>
                <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: 16, width: '90%', maxWidth: 320 }}>
                    {[
                        ['Connections',   'Intercepted HTTP'],
                        ['DNS Logging',   '847 Queries Captured'],
                        ['Stolen Data',   'CorpBank & Gmail Passwords'],
                        ['Time Taken',    '47 Minutes'],
                        ['User Action',   'None (Auto-Connect)']
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.74rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}:</span>
                            <span style={{ color: '#ff4444' }}>{v}</span>
                        </div>
                    ))}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: '#ff4444', textAlign: 'center', padding: '0 20px' }}>
                    Identical twin network names deceive both devices and humans.
                </div>
            </div>
        );
    }

    /* MOCK MOBILE FRAME */
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827', padding: 24 }}>
            <div style={{ width: 340, height: 600, background: '#000', borderRadius: 40, border: '8px solid #374151', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                {/* Mobile Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px', color: '#fff', fontSize: '0.75rem', fontWeight: 600, zIndex: 10, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
                    <span>14:30</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <span>LTE</span>
                        <span>📶</span>
                        <span>🔋</span>
                    </div>
                </div>

                {/* CONTENT: WiFi Settings List */}
                {(currentScreen === 'wifi-list' || currentScreen === 'connected-fake') && (
                    <div style={{ flex: 1, background: '#1c1c1e', color: '#fff', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '24px 20px 10px', fontSize: '1.8rem', fontWeight: 700 }}>Wi-Fi</div>
                        <div style={{ background: '#2c2c2e', margin: '0 16px', borderRadius: 10, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <span style={{ fontSize: '1.1rem' }}>Wi-Fi</span>
                            <div style={{ width: 44, height: 26, background: '#34c759', borderRadius: 13, position: 'relative' }}>
                                <div style={{ width: 22, height: 22, background: '#fff', borderRadius: '50%', position: 'absolute', right: 2, top: 2 }} />
                            </div>
                        </div>

                        <div style={{ color: '#8e8e93', fontSize: '0.8rem', paddingLeft: 24, textTransform: 'uppercase', marginBottom: 8 }}>My Networks</div>
                        <div style={{ background: '#2c2c2e', margin: '0 16px', borderRadius: 10, overflow: 'hidden' }}>
                            {/* Connected Network */}
                            {currentScreen === 'connected-fake' && (
                                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', borderBottom: '0.5px solid #3a3a3c' }}>
                                    <span style={{ color: '#0a84ff', marginRight: 12 }}>✔️</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500, color: '#ff453a' }}>CorpBank-WiFi</div>
                                        <div style={{ fontSize: '0.7rem', color: '#ff453a', opacity: 0.8 }}>Unsecured Network</div>
                                    </div>
                                    <span style={{ color: '#8e8e93', fontSize: '1.2rem' }}>ℹ️</span>
                                </div>
                            )}

                            {/* Available Networks List */}
                            {[
                                ['CorpBank-WiFi', 'str', currentScreen === 'wifi-list', true],
                                ['CorpBank-WiFi', 'str-max', false, false],
                                ['CafeGuest', 'med', false, false],
                                ['StaffNetwork', 'str', true, false],
                                ['iPhone 15 Pro', 'weak', false, false],
                            ].map(([name, strength, hasLock, isOriginal], i) => (
                                <div 
                                    key={`${name}-${i}`} 
                                    style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', borderBottom: i < 4 ? '0.5px solid #3a3a3c' : 'none', cursor: 'pointer' }}
                                    onClick={() => i === 0 && onInteraction?.('connect-wifi')}
                                >
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 500 }}>{name}</span>
                                        {name === 'CorpBank-WiFi' && !isOriginal && currentScreen === 'wifi-list' && (
                                            <span style={{ fontSize: '0.7rem', color: '#ff453a', animation: 'pulse 2s infinite' }}>Strongest signal — auto connecting...</span>
                                        )}
                                        {/* Original CorpBank Network dropped down */}
                                        {name === 'CorpBank-WiFi' && isOriginal && currentScreen === 'connected-fake' && (
                                            <span style={{ fontSize: '0.7rem', color: '#8e8e93' }}>Signal lost — trying to reconnect</span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {hasLock && <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>🔒</span>}
                                        <span style={{ fontSize: '1.1rem', opacity: strength === 'weak' ? 0.4 : strength === 'med' ? 0.7 : 1 }}>
                                            {strength === 'str-max' ? '📶' : '📶'}
                                        </span>
                                        <span style={{ color: '#0a84ff', fontSize: '1.2rem', marginLeft: 4 }}>ℹ️</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CONTENT: Traffic Routed Map */}
                {currentScreen === 'traffic-routed' && (
                    <div style={{ flex: 1, background: '#1c1c1e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
                        <div style={{ fontSize: '3rem' }}>📱</div>
                        <div style={{ color: '#fff', fontWeight: 600 }}>Your Device</div>
                        <div style={{ fontSize: '0.8rem', color: '#8e8e93', textAlign: 'center' }}>Connected to "CorpBank-WiFi" Fake Node</div>

                        <div style={{ position: 'relative', width: 2, height: 60, background: 'rgba(255,69,58,0.2)', margin: '10px 0' }}>
                            <div style={{ position: 'absolute', top: 0, width: '100%', height: '30%', background: '#ff453a', animation: 'flowdown 1s infinite' }} />
                        </div>

                        <div style={{ padding: 16, background: 'rgba(255,69,58,0.1)', border: '1px solid #ff453a', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '2.5rem' }}>💻👁️</span>
                            <div style={{ color: '#ff453a', fontWeight: 'bold' }}>Evil Twin AP</div>
                            <div style={{ fontSize: '0.7rem', color: '#ff453a', textAlign: 'center', maxWidth: 160 }}>SSL Downgrade Active<br/>ARP Poisoning Active</div>
                        </div>

                        <div style={{ position: 'relative', width: 2, height: 60, background: 'rgba(255,69,58,0.2)', margin: '10px 0' }}>
                            <div style={{ position: 'absolute', top: 0, width: '100%', height: '30%', background: '#ff453a', animation: 'flowdown 1s infinite' }} />
                        </div>

                        <div style={{ fontSize: '2.5rem' }}>🌐</div>
                        <div style={{ color: '#fff', fontWeight: 600 }}>The Internet</div>

                        <style dangerouslySetInnerHTML={{__html: `
                            @keyframes flowdown { 0% { top: 0; opacity: 1; } 100% { top: 70%; opacity: 0; } }
                        `}} />
                    </div>
                )}

                {/* CONTENT: HTTP Browser Form */}
                {currentScreen === 'creds-stolen' && (
                    <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column' }}>
                        {/* Browser Top */}
                        <div style={{ background: '#f2f2f7', padding: '16px 12px 12px', display: 'flex', justifyContent: 'center', borderBottom: '1px solid #e5e5ea' }}>
                            <div style={{ background: '#e5e5ea', width: '90%', padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ color: '#ff453a', fontWeight: 'bold', fontSize: '0.85rem' }}>Not Secure</span>
                                <span style={{ color: '#000', fontSize: '0.9rem', flex: 1, textAlign: 'center', marginRight: 24 }}>corpbank.com</span>
                            </div>
                        </div>
                        {/* Form */}
                        <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60 }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🏦</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1c1c1e', marginBottom: 32 }}>CorpBank Login</div>
                            
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ border: '1px solid #d1d1d6', borderRadius: 8, padding: '12px 16px', background: '#f2f2f7', color: '#1c1c1e' }}>
                                    john.smith@corpbank.com
                                </div>
                                <div style={{ border: '1px solid #d1d1d6', borderRadius: 8, padding: '12px 16px', background: '#f2f2f7', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    {Array.from({length: 12}).map((_,i) => <span key={i} style={{fontSize:'0.6rem'}}>⚫</span>)}
                                </div>
                                <div style={{ background: '#007aff', color: '#fff', borderRadius: 8, padding: 14, textAlign: 'center', fontWeight: 'bold', marginTop: 16 }}>
                                    Sign In
                                </div>
                            </div>

                            <div style={{ position: 'absolute', bottom: 60, background: 'rgba(255,69,58,0.9)', color: '#fff', padding: '12px 24px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 'bold', animation: 'slideUp 0.5s ease-out' }}>
                                <span>⚠️</span> DATA SENT OVER INSECURE HTTP
                            </div>
                        </div>

                        <style dangerouslySetInnerHTML={{__html: `
                            @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                        `}} />
                    </div>
                )}
            </div>
        </div>
    );
}
