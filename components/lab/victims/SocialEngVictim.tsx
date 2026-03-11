import React from 'react';

interface Props { 
    currentScreen: string; 
    onInteraction?: (action: string) => void;
}

export default function SocialEngVictim({ currentScreen, onInteraction }: Props) {
    if (currentScreen === 'compromised') {
        return (
            <div style={{ flex: 1, background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
                <div style={{ fontSize: '4rem', lineHeight: 1 }}>🗣️</div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '0.85rem', color: '#ff4444', letterSpacing: 2 }}>NETWORK BREACHED VIA HUMAN</div>
                <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: 16, width: '90%', maxWidth: 320 }}>
                    {[
                        ['Attack Type',   'Vishing (Voice Phishing)'],
                        ['Credential',    'VPN Password Extracted'],
                        ['Time Taken',    '4 Minutes Voice Call'],
                        ['Cost',          '$0.00'],
                        ['Tools Needed',  'LinkedIn & Spoofed CID']
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.74rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}:</span>
                            <span style={{ color: '#ff4444' }}>{v}</span>
                        </div>
                    ))}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: '#ff4444', textAlign: 'center', padding: '0 20px' }}>
                    Social engineering bypasses every technical security control we build.
                </div>
            </div>
        );
    }

    // ── SCENE 1: OSINT LinkedIn Profile ──
    if (currentScreen === 'profile-view') {
        return (
            <div style={{ flex: 1, backgroundColor: '#f3f2ef', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 40, fontFamily: 'sans-serif' }}>
                <div style={{ width: 500, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {/* Header Banner */}
                    <div style={{ height: 120, backgroundColor: '#a0b4b7', position: 'relative' }}>
                        {/* Profile Photo */}
                        <div style={{ width: 120, height: 120, borderRadius: '50%', border: '4px solid #fff', backgroundColor: '#e2e8f0', position: 'absolute', bottom: -60, left: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                            👨‍💻
                        </div>
                    </div>
                    {/* Name/Info Block */}
                    <div style={{ padding: '70px 24px 24px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#000', margin: '0 0 4px 0' }}>John Smith</h1>
                                <p style={{ fontSize: '1rem', color: '#181818', margin: '0 0 8px 0' }}>IT Administrator at CorpBank Financial</p>
                                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 16px 0' }}>Mumbai, Maharashtra &middot; 347 connections</p>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button 
                                        style={{ backgroundColor: '#0a66c2', color: '#fff', border: 'none', borderRadius: 20, padding: '6px 16px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                                        onClick={() => onInteraction?.('answer-call')}
                                    >
                                        Connect
                                    </button>
                                    <button style={{ color: '#0a66c2', border: '1px solid #0a66c2', backgroundColor: '#fff', borderRadius: 20, padding: '6px 16px', fontWeight: 600, fontSize: '0.9rem' }}>Message</button>
                                </div>
                            </div>
                            {/* Company Logo mock */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: '#000', fontWeight: 600 }}>
                                <div style={{ width: 32, height: 32, backgroundColor: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', borderRadius: 4 }}>🏦</div>
                                CorpBank
                            </div>
                        </div>
                    </div>
                    {/* Activity Feed */}
                    <div style={{ padding: 24, borderTop: '1px solid #e5e5e5', backgroundColor: '#fff' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 16px 0', color: '#000' }}>Recent Activity</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>👨‍💻</div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500, color: '#000' }}>John Smith <span style={{ color: '#666', fontWeight: 400 }}>posted this • 1d</span></p>
                                    <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#181818', lineHeight: 1.4, backgroundColor: 'rgba(239,68,68,0.1)', padding: 6, borderLeft: '3px solid #ef4444' }}>
                                        "Just finished deploying the new VPN infrastructure for the remote infrastructure team. Great project and a big step up in security for CorpBank! #vpn #cybersecurity"
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 'bold' }}>ATTACKER TARGET IDENTIFIED</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── SCENE 2: Incoming Phone Call ──
    if (currentScreen === 'phone-ringing') {
        return (
            <div style={{ flex: 1, backgroundColor: '#1f2937', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: 340, height: 600, backgroundColor: '#000', borderRadius: 40, border: '8px solid #374151', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% -20%, #374151, transparent 60%)', opacity: 0.5 }} />
                    
                    <p style={{ color: '#d1d5db', fontSize: '1rem', marginTop: 40 }}>incoming call...</p>
                    
                    <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 600, margin: '20px 0 8px 0', textAlign: 'center' }}>CorpBank IT Helpdesk</h1>
                    <p style={{ color: '#9ca3af', fontSize: '1rem', margin: 0 }}>+91-22-XXXX-1234</p>
                    
                    <div style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 'bold', marginTop: 24, backgroundColor: 'rgba(239,68,68,0.2)', padding: '4px 12px', borderRadius: 12 }}>SPOOFED NUMBER</div>

                    {/* Ringing Animation Avatar */}
                    <div style={{ margin: 'auto', position: 'relative', width: 120, height: 120 }}>
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)', animation: 'ripple 1.5s infinite running' }} />
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)', animation: 'ripple 1.5s infinite running 0.5s' }} />
                        <div style={{ width: 120, height: 120, borderRadius: '50%', backgroundColor: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', zIndex: 10, position: 'relative' }}>
                            🎧
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 10px', marginTop: 'auto', marginBottom: 60 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#fff' }}>❌</div>
                            <span style={{ color: '#fff', fontSize: '0.9rem' }}>Decline</span>
                        </div>
                        <div 
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                            onClick={() => onInteraction?.('accept-call')}
                        >
                            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#fff', animation: 'bounce 1s infinite' }}>📞</div>
                            <span style={{ color: '#fff', fontSize: '0.9rem' }}>Accept</span>
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes ripple { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }
                    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                `}} />
            </div>
        );
    }

    // ── SCENE 3 & 4: Live Phone Call Transcript Conversation ──
    const transcriptLines = [
        { speaker: 'ATTACKER', text: "Hi John, this is Mike from IT. We have detected unusual activity on your VPN account. Several failed login attempts from an IP in Russia.", type: 'vishing' },
        { speaker: 'VICTIM',   text: "Oh that is strange. I only use VPN from home." },
        { speaker: 'ATTACKER', text: "That is why we are calling. We need to verify it is you and not an attacker. Can you confirm your employee ID?", type: 'vishing' },
        { speaker: 'VICTIM',   text: "Sure it is EMP-4721" },
        { speaker: 'ATTACKER', text: "Great. Now I need to verify your current VPN password to check if it has been compromised in the breach.", type: 'vishing' },
        { speaker: 'VICTIM',   text: "Is it not safer to just reset it?" },
        { speaker: 'ATTACKER', text: "We would normally do that but our password reset system is down for maintenance. This will only take a moment.", type: 'vishing' },
        { speaker: 'ATTACKER', text: "I understand your concern John. Let me transfer you to my supervisor to explain the situation.", type: 'vishing', delay: true },
        { speaker: 'SYSTEM',   text: "[HOLD MUSIC for 30 seconds]" },
        { speaker: 'ATTACKER', text: "Sorry about that. My supervisor confirmed we need the current password to complete the audit trail before resetting. It is just for our records.", type: 'vishing' },
        { speaker: 'VICTIM',   text: "Okay... it is VPNpass2024!", critical: true },
        { speaker: 'ATTACKER', text: "Perfect thank you John. We will get this sorted immediately. Have a good day.", type: 'vishing' }
    ];

    // Naive truncation to simulate timing based on screen
    let visibleLines = transcriptLines;
    if (currentScreen === 'conversation') { // Trim the end lines so they don't load yet
        visibleLines = transcriptLines.slice(0, 7);
    }

    return (
        <div style={{ flex: 1, backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', padding: '24px 0', fontFamily: '"Segoe UI", sans-serif' }}>
            <div style={{ width: 440, backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* Header */}
                <div style={{ padding: '16px 20px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#fff' }}>🎧</div>
                        <div>
                            <div style={{ fontWeight: 600, color: '#111827', fontSize: '1.1rem' }}>CorpBank IT Helpdesk</div>
                            <div style={{ color: '#22c55e', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 6, height: 6, backgroundColor: '#22c55e', borderRadius: '50%' }} /> Active Call 04:12
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Bubbles */}
                <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 }}>Live Transcript</div>
                    
                    {visibleLines.map((line, i) => {
                        const isAttacker = line.speaker === 'ATTACKER';
                        const isSystem = line.speaker === 'SYSTEM';

                        if (isSystem) {
                            return (
                                <div key={i} style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', fontStyle: 'italic', margin: '8px 0' }}>
                                    {line.text}
                                </div>
                            );
                        }

                        return (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isAttacker ? 'flex-start' : 'flex-end', animation: 'fadeIn 0.3s ease-out' }}>
                                <span style={{ fontSize: '0.7rem', color: '#6b7280', margin: '0 4px 4px 4px', fontWeight: 600 }}>{line.speaker}</span>
                                <div style={{ 
                                    maxWidth: '85%', 
                                    padding: '10px 14px', 
                                    borderRadius: 16, 
                                    borderTopLeftRadius: isAttacker ? 4 : 16,
                                    borderTopRightRadius: isAttacker ? 16 : 4,
                                    backgroundColor: isAttacker ? '#f3f4f6' : (line.critical ? '#fee2e2' : '#2563eb'),
                                    color: isAttacker ? '#111827' : (line.critical ? '#991b1b' : '#fff'),
                                    border: line.critical ? '2px solid #ef4444' : 'none',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.4
                                }}>
                                    {line.text}
                                </div>
                                {line.critical && (
                                    <div style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 'bold', marginTop: 4, textAlign: 'right', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        ⚠️ PASSWORD DISCLOSED
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}} />
        </div>
    );
}
