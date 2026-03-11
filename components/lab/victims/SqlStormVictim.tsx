import React, { useEffect, useState } from 'react';

interface Props { currentScreen: string; onInteraction?: (action: string) => void; }

/* ── shared colours ── */
const C = {
    bg: '#0a1628', panel: '#091a2e', border: 'rgba(0,212,255,0.2)',
    blue: '#00d4ff', green: '#00ff88', red: '#ff4444', dim: 'rgba(200,230,240,0.5)',
};

/* ── Browser chrome wrapper ── */
function BrowserChrome({ url, danger, children }: { url: string; danger?: boolean; children: React.ReactNode }) {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Mac-style bar */}
            <div style={{ background: '#e2e8f0', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, borderBottom: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#28ca41' }} />
                </div>
                <div style={{ flex: 1, background: danger ? 'rgba(255,68,68,0.1)' : '#f8fafc', padding: '4px 12px', borderRadius: 4, fontSize: '0.78rem', fontFamily: 'sans-serif', color: danger ? '#c0392b' : '#334155', border: danger ? '1px solid rgba(255,68,68,0.3)' : '1px solid transparent', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{danger ? '⚠' : '🔒'}</span> {url}
                </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
        </div>
    );
}

export default function SqlStormVictim({ currentScreen, onInteraction }: Props) {

    /* animated row counter for db-dumping */
    const [rowCount, setRowCount] = useState(0);
    useEffect(() => {
        if (currentScreen !== 'db-dumping') { setRowCount(0); return; }
        const id = setInterval(() => setRowCount(n => Math.min(n + 17, 10000)), 120);
        return () => clearInterval(id);
    }, [currentScreen]);

    /* ── CORPBANK-LOGIN ── */
    if (currentScreen === 'corpbank-login') return (
        <BrowserChrome url="http://192.168.1.100/login">
            <div style={{ background: '#f5f7fa', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                <div style={{ background: '#fff', borderRadius: 10, padding: 36, width: '100%', maxWidth: 340, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontFamily: 'sans-serif' }}>
                    <div style={{ textAlign: 'center', marginBottom: 28 }}>
                        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.6rem', fontWeight: 900, color: '#1e3a8a', letterSpacing: 2 }}>CORPBANK</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>Secure Banking Portal</div>
                    </div>
                    <input placeholder="Username" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.9rem', marginBottom: 14, boxSizing: 'border-box' }} />
                    <input type="password" placeholder="Password" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.9rem', marginBottom: 20, boxSizing: 'border-box' }} />
                    <button 
                        onClick={() => onInteraction?.('attempt-login')}
                        style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                        Log In
                    </button>
                    <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.7rem', color: '#94a3b8' }}>🔒 256-bit SSL Secured · Secure Banking Portal</div>
                </div>
            </div>
        </BrowserChrome>
    );

    /* ── SQL-ERROR ── */
    if (currentScreen === 'sql-error') return (
        <BrowserChrome url="http://192.168.1.100/login" danger>
            <div style={{ background: '#f5f7fa', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                <div style={{ background: '#fff', borderRadius: 10, padding: 36, width: '100%', maxWidth: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontFamily: 'sans-serif' }}>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.6rem', fontWeight: 900, color: '#1e3a8a', letterSpacing: 2 }}>CORPBANK</div>
                    </div>
                    <input placeholder="Username" defaultValue="'" style={{ width: '100%', padding: '10px 12px', border: '2px solid #ef4444', borderRadius: 6, fontSize: '0.9rem', marginBottom: 10, boxSizing: 'border-box', color: '#ef4444' }} />
                    <input type="password" placeholder="Password" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.9rem', marginBottom: 16, boxSizing: 'border-box' }} />
                    <button style={{ width: '100%', padding: 12, background: '#94a3b8', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.95rem', fontWeight: 700 }}>Log In</button>
                    {/* SQL error box */}
                    <div style={{ marginTop: 20, background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 6, padding: '12px 14px' }}>
                        <div style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, marginBottom: 8 }}>⚠ DATABASE ERROR</div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: '#b91c1c', lineHeight: 1.7 }}>
                            You have an error in your SQL syntax<br />
                            near &apos;&apos;&apos;&apos; at line 1<br /><br />
                            <span style={{ color: '#6b7280' }}>Query:</span><br />
                            SELECT * FROM users WHERE<br />
                            username=&apos;&apos;&apos; AND password=&apos;test&apos;
                        </div>
                    </div>
                </div>
            </div>
        </BrowserChrome>
    );

    /* ── AUTH-BYPASSED ── */
    if (currentScreen === 'auth-bypassed') return (
        <BrowserChrome url="http://192.168.1.100/admin/dashboard">
            <div style={{ background: '#f0fdf4', minHeight: '100%', fontFamily: 'sans-serif', padding: 0 }}>
                <div style={{ background: 'linear-gradient(135deg,#166534,#16a34a)', padding: '12px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ fontFamily: "'Orbitron',sans-serif", letterSpacing: 1 }}>ADMIN DASHBOARD</b>
                    <span style={{ fontSize: '0.8rem' }}>Welcome, <b>Administrator</b> ✓</span>
                </div>
                <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    {[
                        { label: 'User Accounts', value: '10,000', icon: '👤' },
                        { label: 'Card Records', value: '25,000', icon: '💳' },
                        { label: 'Transactions', value: '50,000', icon: '💰' },
                    ].map(s => (
                        <div key={s.label} style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 8, padding: '16px 20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#166534' }}>{s.value}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
                <div style={{ paddingLeft: 20, marginTop: 4 }}>
                    <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 6, padding: '10px 16px', fontSize: '0.8rem', color: '#166534', display: 'inline-block' }}>
                        ✓ Authenticated as root — Full database privileges active
                    </div>
                </div>
            </div>
        </BrowserChrome>
    );

    /* ── DB-DUMPING ── */
    if (currentScreen === 'db-dumping') return (
        <BrowserChrome url="http://192.168.1.100/admin/dump">
            <div style={{ background: '#040d18', minHeight: '100%', padding: 16, fontFamily: "'Share Tech Mono',monospace", fontSize: '0.72rem', color: '#00d4ff' }}>
                <div style={{ color: C.blue, marginBottom: 12, fontSize: '0.8rem', letterSpacing: 2 }}>DATABASE DUMP IN PROGRESS</div>
                {/* counter */}
                <div style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)', padding: '8px 14px', marginBottom: 14, borderRadius: 4 }}>
                    <span style={{ color: '#00ff88' }}>Extracted: </span>
                    <span style={{ color: '#fff', fontWeight: 900 }}>{rowCount.toLocaleString()}</span>
                    <span style={{ color: '#6b86a0' }}> / 10,000</span>
                    <div style={{ marginTop: 6, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(rowCount / 10000) * 100}%`, background: 'linear-gradient(90deg,#00d4ff,#00ff88)', transition: 'width 0.1s' }} />
                    </div>
                </div>
                {/* table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr', gap: 8, color: '#6b86a0', borderBottom: '1px solid rgba(0,212,255,0.15)', paddingBottom: 6, marginBottom: 6 }}>
                    <span>ID</span><span>Username</span><span>Email</span><span>Password Hash</span>
                </div>
                {/* sample rows */}
                {[
                    ['1','john','john@corpbank.com','$2b$10$xyz...'],
                    ['2','sarah','sarah@corpbank.com','$2b$10$abc...'],
                    ['3','admin','admin@corpbank.com','$2b$10$def...'],
                    ['4','mike','mike@corpbank.com','$2b$10$ghi...'],
                    ['5','lisa','lisa@corpbank.com','$2b$10$jkl...'],
                ].map(([id, user, email, hash]) => (
                    <div key={id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr', gap: 8, padding: '4px 0', color: '#c8e6f0', borderBottom: '1px solid rgba(255,255,255,0.03)', animation: 'fadeIn 0.3s ease' }}>
                        <span style={{ color: '#6b86a0' }}>{id}</span>
                        <span style={{ color: '#bb88ff' }}>{user}</span>
                        <span>{email}</span>
                        <span style={{ color: '#00ff88', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hash}</span>
                    </div>
                ))}
                <div style={{ marginTop: 10, color: '#ff4444', fontSize: '0.7rem' }}>... {rowCount > 5 ? `${(rowCount - 5).toLocaleString()} more rows` : ''} being extracted</div>
            </div>
        </BrowserChrome>
    );

    /* ── COMPROMISED ── */
    return (
        <div style={{ flex: 1, background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
            <div style={{ fontSize: '5rem', lineHeight: 1 }}>💾</div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '0.9rem', color: '#ff4444', letterSpacing: 2 }}>DATABASE FULLY COMPROMISED</div>
            <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: 16, width: '90%', maxWidth: 300 }}>
                {[['Users stolen','10,000 accounts'],['Credit cards','25,000 numbers'],['Transactions','50,000 records'],['Destination','dark web marketplace']].map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.75rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}:</span>
                        <span style={{ color: '#ff4444' }}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
