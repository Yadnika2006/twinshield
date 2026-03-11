'use client';
import React, { useState } from 'react';

interface Props {
    currentScreen: string;
    onInteraction?: (action: string, data?: any) => void;
}

const FALLBACK_EMAIL    = 'john.smith@corpbank.com';
const FALLBACK_PASSWORD = 'CorpBank2024!';

export default function PhishNetVictim({ currentScreen, onInteraction }: Props) {
    const [victimEmail,    setVictimEmail]    = useState('');
    const [victimPassword, setVictimPassword] = useState('');
    const [stolenEmail,    setStolenEmail]    = useState(FALLBACK_EMAIL);
    const [stolenPassword, setStolenPassword] = useState(FALLBACK_PASSWORD);

    const getUrl = () => {
        if (currentScreen === 'inbox')      return 'mail.corpbank.internal/inbox';
        if (currentScreen === 'email-open') return 'mail.corpbank.internal/inbox/msg/4721';
        if (currentScreen === 'fake-login') return 'http://c0rpbank.com/verify-account';
        return 'corpbank.internal';
    };

    const isResultScreen = currentScreen === 'compromised' || currentScreen === 'defended';

    const handleSubmitCreds = () => {
        const email    = victimEmail.trim()    || FALLBACK_EMAIL;
        const password = victimPassword.trim() || FALLBACK_PASSWORD;
        setStolenEmail(email);
        setStolenPassword(password);
        onInteraction?.('submit-creds', { email, password });
    };

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: isResultScreen ? '#0a0a1a' : '#ffffff' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
                {/* Browser Chrome */}
                {!isResultScreen && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 16px', background: '#e2e8f0', borderBottom: '1px solid #cbd5e1', flexShrink: 0 }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {['#ff5f57','#ffbd2e','#28ca41'].map(c => <span key={c} style={{ display:'inline-block', width:'12px', height:'12px', borderRadius:'50%', background:c }} />)}
                        </div>
                        <div style={{ flex:1, background:currentScreen==='fake-login'?'rgba(255,68,68,0.1)':'#f8fafc', padding:'4px 12px', borderRadius:'4px', fontFamily:'sans-serif', fontSize:'0.8rem', color:currentScreen==='fake-login'?'#ff8844':'#334155', textAlign:'center', border:currentScreen==='fake-login'?'1px solid rgba(255,68,68,0.3)':'1px solid transparent' }}>
                            <span>🔒</span> {getUrl()}
                        </div>
                    </div>
                )}

                {/* INBOX */}
                {currentScreen === 'inbox' && (
                    <div style={{ flex:1, background:'#ffffff', display:'flex', flexDirection:'column', fontFamily:'sans-serif', position:'relative', overflow:'hidden' }}>
                        <div style={{ background:'#1a2a4a', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', color:'#ffffff' }}>
                            <div style={{ fontWeight:'bold', fontSize:'1rem' }}>📬 CorpBank Mail</div>
                            <div style={{ background:'#3b82f6', color:'#ffffff', fontSize:'0.75rem', padding:'2px 8px', borderRadius:'12px', fontWeight:'bold' }}>3 unread</div>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', overflowY:'auto', flex:1 }}>
                            <div style={{ padding:'16px', borderBottom:'1px solid #e2e8f0', background:'#ffffff' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px', fontSize:'0.9rem' }}>
                                    <span style={{ fontWeight:'bold', color:'#334155' }}>IT Department</span>
                                    <span style={{ fontSize:'0.8rem', color:'#64748b' }}>Yesterday</span>
                                </div>
                                <div style={{ fontSize:'0.9rem', color:'#475569' }}>Monthly security newsletter</div>
                            </div>
                            <div style={{ padding:'16px', borderBottom:'1px solid #e2e8f0', background:'#ffffff' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px', fontSize:'0.9rem' }}>
                                    <span style={{ fontWeight:'bold', color:'#334155' }}>HR Team</span>
                                    <span style={{ fontSize:'0.8rem', color:'#64748b' }}>2 days ago</span>
                                </div>
                                <div style={{ fontSize:'0.9rem', color:'#475569' }}>Leave policy update</div>
                            </div>
                            <div
                                onClick={() => onInteraction?.('open-email')}
                                title="Click to open this email"
                                style={{ padding:'16px', borderBottom:'1px solid #e2e8f0', background:'#fff5f5', borderLeft:'4px solid #ef4444', cursor:'pointer', transition:'background 0.18s, box-shadow 0.18s', position:'relative' }}
                                onMouseOver={e => { e.currentTarget.style.background='#ffe5e5'; e.currentTarget.style.boxShadow='0 0 0 2px rgba(239,68,68,0.35)'; }}
                                onMouseOut={e  => { e.currentTarget.style.background='#fff5f5'; e.currentTarget.style.boxShadow='none'; }}
                            >
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px', fontSize:'0.9rem' }}>
                                    <span style={{ fontWeight:'bold', color:'#1e293b', display:'flex', alignItems:'center', gap:'8px' }}>
                                        ⚠ it-security@c0rpbank.com
                                        <span style={{ background:'#dc2626', color:'#ffffff', fontSize:'0.65rem', padding:'2px 6px', borderRadius:'4px' }}>URGENT</span>
                                    </span>
                                    <span style={{ fontSize:'0.8rem', color:'#ef4444', fontWeight:'bold' }}>Just now</span>
                                </div>
                                <div style={{ fontSize:'0.9rem', color:'#1e293b', fontWeight:'bold' }}>Your account will be suspended — verify now</div>
                                <div style={{ position:'absolute', right:'12px', bottom:'6px', fontSize:'9px', color:'rgba(239,68,68,0.5)', fontFamily:"'Share Tech Mono',monospace" }}>click to open →</div>
                            </div>
                        </div>
                        <div style={{ textAlign:'center', padding:'8px 0', color:'rgba(0,212,255,0.5)', fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', borderTop:'1px solid rgba(0,212,255,0.1)', flexShrink:0 }}>
                            Click the urgent email to open it
                        </div>
                    </div>
                )}

                {/* EMAIL-OPEN */}
                {currentScreen === 'email-open' && (
                    <div style={{ flex:1, background:'#ffffff', fontFamily:'sans-serif', overflowY:'auto' }}>
                        <div style={{ background:'#f8faff', padding:'24px', borderBottom:'1px solid #e2e8f0' }}>
                            <div style={{ display:'flex', flexDirection:'column', gap:'8px', fontSize:'0.9rem', marginBottom:'16px' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                                    <span style={{ width:'70px', color:'#64748b' }}>From:</span>
                                    <span style={{ fontWeight:'bold', color:'#1e293b' }}>it-security@c0rpbank.com</span>
                                    <span style={{ background:'#fef2f2', color:'#dc2626', border:'1px solid #fca5a5', padding:'2px 6px', borderRadius:'4px', fontSize:'0.7rem', fontWeight:'bold' }}>⚠ FAKE DOMAIN</span>
                                </div>
                                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                                    <span style={{ width:'70px', color:'#64748b' }}>Reply-To:</span>
                                    <span style={{ fontWeight:'bold', color:'#1e293b' }}>attacker@protonmail.com</span>
                                    <span style={{ background:'#fef2f2', color:'#dc2626', border:'1px solid #fca5a5', padding:'2px 6px', borderRadius:'4px', fontSize:'0.7rem', fontWeight:'bold' }}>⚠ DIFFERENT ADDRESS</span>
                                </div>
                                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                                    <span style={{ width:'70px', color:'#64748b' }}>To:</span>
                                    <span style={{ color:'#334155' }}>john.smith@corpbank.com</span>
                                </div>
                            </div>
                            <h2 style={{ color:'#dc2626', fontSize:'1.2rem', margin:'0', fontWeight:'bold' }}>🚨 URGENT: Your CorpBank account will be suspended in 24 hours</h2>
                        </div>
                        <div style={{ padding:'24px', color:'#334155', fontSize:'0.95rem', lineHeight:'1.6' }}>
                            <p style={{ marginBottom:'16px' }}>Dear John Smith,</p>
                            <p style={{ marginBottom:'16px' }}>Our security team has detected suspicious login attempts on your account from an unknown location.</p>
                            <p style={{ marginBottom:'24px' }}>To protect your account you must verify your identity immediately.</p>
                            <button onClick={() => onInteraction?.('click-link')} style={{ width:'100%', background:'linear-gradient(to right, #1e3a8a, #3b82f6)', color:'#ffffff', border:'none', padding:'14px', borderRadius:'6px', fontSize:'1rem', fontWeight:'bold', cursor:'pointer', marginBottom:'32px' }}>
                                🔒 Verify My Account Now →
                            </button>
                        </div>
                    </div>
                )}

                {/* FAKE-LOGIN */}
                {currentScreen === 'fake-login' && (
                    <div style={{ flex:1, background:'linear-gradient(to bottom, #1e0a0a, #2d0000)', display:'flex', alignItems:'center', justifyContent:'center', overflowY:'auto' }}>
                        <div style={{ textAlign:'center', padding:'20px', width:'100%' }}>
                            <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'2rem', margin:'0 0 4px 0', letterSpacing:'1px' }}>
                                <span style={{ color:'#ff6644' }}>C0RP</span><span style={{ color:'#ff4444' }}>BANK</span>
                            </h1>
                            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'#ff8844', marginBottom:'24px', opacity:0.8 }}>ATTACKER CONTROLLED SERVER</div>
                            <div style={{ background:'#ffffff', borderRadius:'8px', padding:'24px', width:'100%', maxWidth:'300px', margin:'0 auto', border:'1px solid rgba(255,68,68,0.4)', boxShadow:'0 10px 25px rgba(0,0,0,0.5)' }}>
                                <h2 style={{ color:'#dc2626', fontSize:'1.1rem', margin:'0 0 4px 0', fontWeight:'bold', fontFamily:'sans-serif' }}>🔒 Account Verification Required</h2>
                                <p style={{ color:'#64748b', fontSize:'0.8rem', margin:'0 0 20px 0', fontFamily:'sans-serif' }}>Please enter your credentials</p>
                                <div style={{ marginBottom:'14px', textAlign:'left' }}>
                                    <label style={{ display:'block', fontSize:'0.75rem', color:'#64748b', fontFamily:'sans-serif', marginBottom:'4px' }}>Email address</label>
                                    <input id="victim-email-input" type="text" placeholder="Enter your email address" value={victimEmail} onChange={e => setVictimEmail(e.target.value)}
                                        style={{ width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'4px', fontSize:'0.9rem', fontFamily:'sans-serif', boxSizing:'border-box', outline:'none' }}
                                        onFocus={e => { e.target.style.borderColor='#dc2626'; }} onBlur={e => { e.target.style.borderColor='#cbd5e1'; }} />
                                </div>
                                <div style={{ marginBottom:'20px', textAlign:'left' }}>
                                    <label style={{ display:'block', fontSize:'0.75rem', color:'#64748b', fontFamily:'sans-serif', marginBottom:'4px' }}>Password</label>
                                    <input id="victim-password-input" type="password" placeholder="Enter your password" value={victimPassword} onChange={e => setVictimPassword(e.target.value)}
                                        style={{ width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'4px', fontSize:'0.9rem', fontFamily:'sans-serif', boxSizing:'border-box', outline:'none' }}
                                        onFocus={e => { e.target.style.borderColor='#dc2626'; }} onBlur={e => { e.target.style.borderColor='#cbd5e1'; }}
                                        onKeyDown={e => { if (e.key==='Enter') handleSubmitCreds(); }} />
                                </div>
                                <button onClick={handleSubmitCreds} style={{ width:'100%', background:'linear-gradient(to right, #dc2626, #991b1b)', color:'#ffffff', border:'none', padding:'12px', borderRadius:'4px', fontSize:'0.95rem', fontWeight:'bold', cursor:'pointer', fontFamily:'sans-serif' }}>
                                    Verify &amp; Continue →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* COMPROMISED */}
                {currentScreen === 'compromised' && (
                    <div style={{ flex:1, background:'#0a0a1a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px', padding:'20px' }}>
                        <div style={{ fontSize:'5rem', lineHeight:1 }}>💀</div>
                        <div style={{ background:'rgba(255,68,68,0.08)', border:'1px solid rgba(255,68,68,0.3)', borderRadius:'10px', padding:'16px', width:'90%', maxWidth:'300px' }}>
                            <h2 style={{ color:'#ff4444', fontFamily:"'Orbitron',sans-serif", fontSize:'0.85rem', letterSpacing:'1px', margin:'0 0 10px 0', textAlign:'center' }}>⚡ YOUR DATA WAS STOLEN</h2>
                            {[['email', stolenEmail], ['password', stolenPassword], ['ip_address','192.168.1.45'], ['sent_to','attacker@protonmail.com'], ['accounts_pwned','4 accounts']].map(([k,v]) => (
                                <div key={k} style={{ display:'flex', gap:'8px', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', fontFamily:"'Share Tech Mono',monospace", fontSize:'10px' }}>
                                    <span style={{ color:'rgba(255,255,255,0.4)', width:'90px', flexShrink:0 }}>{k}:</span>
                                    <span style={{ color:'#ff4444', wordBreak:'break-all' }}>{v}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', color:'#ff4444', textAlign:'center' }}>You fell for the phishing attack</div>
                    </div>
                )}

                {/* DEFENDED */}
                {currentScreen === 'defended' && (
                    <div style={{ flex:1, background:'linear-gradient(to bottom, #0a1a0a, #0a1628)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px', padding:'20px' }}>
                        <div style={{ fontSize:'5rem', lineHeight:1 }}>🛡️</div>
                        <div style={{ background:'rgba(0,255,136,0.06)', border:'1px solid rgba(0,255,136,0.2)', borderRadius:'10px', padding:'16px', width:'85%', maxWidth:'280px' }}>
                            <h2 style={{ color:'#00ff88', fontFamily:"'Orbitron',sans-serif", fontSize:'0.9rem', letterSpacing:'1px', margin:'0 0 8px 0', textAlign:'center' }}>✓ ATTACK BLOCKED</h2>
                            {['You identified the suspicious email','You did not click the malicious link','Your credentials are safe','You reported to IT department'].map(t => (
                                <div key={t} style={{ display:'flex', gap:'6px', fontSize:'11px', color:'rgba(255,255,255,0.8)', fontFamily:'sans-serif', marginBottom:4 }}>
                                    <span style={{ color:'#00ff88' }}>✓</span> {t}
                                </div>
                            ))}
                        </div>
                        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', color:'#00ff88', textAlign:'center' }}>Great awareness! Attack prevented.</div>
                    </div>
                )}
            </div>
        </div>
    );
}
