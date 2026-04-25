import React from 'react';

interface Props {
    currentScreen: string;
    onInteraction?: (action: string, data?: any) => void;
}

export default function WeakPassVictim({ currentScreen, onInteraction }: Props) {
    if (currentScreen === 'compromised') {
        return (
            <div style={{ flex: 1, background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
                <div style={{ fontSize: '4rem', lineHeight: 1 }}>💥</div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '0.85rem', color: '#ff4444', letterSpacing: 2 }}>SERVER FULLY COMPROMISED</div>
                <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: 16, width: '90%', maxWidth: 320 }}>
                    {[
                        ['Attack vector', 'SSH Brute Force'],
                        ['Time taken',    '4 minutes'],
                        ['Attempts',      '1,247'],
                        ['Privilege',     'Root Administrator'],
                        ['Data lost',     'Full database exfiltrated']
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.74rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}:</span>
                            <span style={{ color: '#ff4444' }}>{v}</span>
                        </div>
                    ))}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: '#ff4444', textAlign: 'center', padding: '0 20px' }}>
                    A single predictable password gave total control.
                </div>
            </div>
        );
    }

    // BASE UI FOR SSH
    return (
        <div style={{ flex: 1, padding: 32, background: '#111827', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 500, background: '#000', borderRadius: 6, border: '1px solid #374151', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
                {/* PuTTY/Terminal Titlebar */}
                <div style={{ background: '#f3f4f6', padding: '4px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.9rem' }}>💻</span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'sans-serif', color: '#000' }}>SSH — 192.168.1.45:22</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {['–', '□', '✕'].map(symbol => (
                            <div key={symbol} style={{ width: 18, height: 18, border: '1px solid #ccc', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: '#4b5563' }}>
                                {symbol}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Terminal Body */}
                <div style={{ padding: 12, height: 280, fontFamily: "'Consolas', 'Courier New', monospace", fontSize: '0.8rem', color: '#e5e7eb', display: 'flex', flexDirection: 'column', border: currentScreen === 'login-cracked' || currentScreen === 'inside-system' ? '2px solid #22c55e' : 'none', position: 'relative' }}>
                    {currentScreen === 'inside-system' && (
                        <div style={{ background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', textAlign: 'center', padding: 2, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2 }}>
                            COMPROMISED SHELL
                        </div>
                    )}
                    
                    <div style={{ marginTop: 'auto' }}>
                        {currentScreen === 'ssh-terminal' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ whiteSpace: 'nowrap', color: '#9ca3af' }}>login:</span>
                                    <input 
                                        type="text"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const target = e.currentTarget.parentElement?.nextElementSibling?.querySelector('input');
                                                target?.focus();
                                            }
                                        }}
                                        style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', font: 'inherit', width: '100%', padding: 0 }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ whiteSpace: 'nowrap', color: '#9ca3af' }}>password:</span>
                                    <input 
                                        type="password"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const pass = e.currentTarget.value;
                                                const userInput = e.currentTarget.parentElement?.previousElementSibling?.querySelector('input') as HTMLInputElement;
                                                const user = userInput.value;
                                                
                                                if (user === 'admin' && pass === 'server123') {
                                                    onInteraction?.('connect-ssh');
                                                } else {
                                                    alert('SSH Error: Permission denied. Verify credentials in your attacker terminal.');
                                                    e.currentTarget.value = '';
                                                    userInput.focus();
                                                }
                                            }
                                        }}
                                        style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', font: 'inherit', width: '100%', padding: 0 }}
                                    />
                                </div>
                                <div style={{ marginTop: 12, fontSize: '0.65rem', color: '#4b5563', fontStyle: 'italic', borderTop: '1px solid #1f2937', paddingTop: 8 }}>
                                    Hint: Crack the password using Hydra on port 22.
                                </div>
                            </div>
                        )}
                        {currentScreen === 'brute-attempts' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} style={{ opacity: 0.3 + (i * 0.1) }}>
                                        admin@192.168.1.45's password: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Access denied</span>
                                    </div>
                                ))}
                                <div style={{ marginTop: 8, fontSize: '0.7rem', color: '#ef4444', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>[1,247 attempts]</span>
                                    <span>[300 attempts/sec]</span>
                                </div>
                            </div>
                        )}
                        {(currentScreen === 'login-cracked' || currentScreen === 'inside-system') && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <div>admin@192.168.1.45's password: <span style={{ color: '#22c55e' }}>*************</span></div>
                                <br />
                                <div>Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-150-generic x86_64)</div>
                                <br />
                                <div> * Documentation:  https://help.ubuntu.com</div>
                                <div> * Management:     https://landscape.canonical.com</div>
                                <div> * Support:        https://ubuntu.com/advantage</div>
                                <br />
                                <div>Last login: Mon Nov 11 09:23:11 2024 from 192.168.1.200</div>
                                <br />
                                {currentScreen === 'login-cracked' ? (
                                    <div>
                                        <span style={{ color: '#22c55e', fontWeight: 'bold' }}>admin@corp-server</span><span style={{ color: '#fff' }}>:~$ </span>
                                        <span style={{ animation: 'blink 1s step-start infinite' }}>█</span>
                                    </div>
                                ) : (
                                    <>
                                        <div><span style={{ color: '#22c55e', fontWeight: 'bold' }}>admin@corp-server</span><span style={{ color: '#fff' }}>:~$ sudo cat /etc/shadow</span></div>
                                        <div style={{ opacity: 0.8 }}>root:$6$xyz$abc123...:18900:0:99999:7:::</div>
                                        <div style={{ opacity: 0.8 }}>admin:$6$lmn$def456...:18900:0:99999:7:::</div>
                                        <div><span style={{ color: '#22c55e', fontWeight: 'bold' }}>admin@corp-server</span><span style={{ color: '#fff' }}>:~$ _</span></div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Inject global blinking animation if not exist */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes blink { 50% { opacity: 0; } }
            `}} />
        </div>
    );
}
