import React, { useEffect, useState } from 'react';

interface Props { 
    currentScreen: string; 
    onInteraction?: (action: string) => void;
}

export default function NetFloodVictim({ currentScreen, onInteraction }: Props) {
    const isCompromised = currentScreen === 'compromised';
    
    // Animate stats naturally based on phase
    const [stats, setStats] = useState({ cpu: 12, mem: 34, conn: 47, resp: 120, req: 45 });
    
    useEffect(() => {
        if (currentScreen === 'server-dashboard') {
            setStats({ cpu: 12, mem: 34, conn: 47, resp: 120, req: 45 });
        } else if (currentScreen === 'traffic-spiking') {
            setStats({ cpu: 67, mem: 72, conn: 350, resp: 2400, req: 12450 });
        } else if (currentScreen === 'server-struggling') {
            setStats({ cpu: 100, mem: 98, conn: 500, resp: 45000, req: 50000 });
        }
        // Jitter logic removed for pure declarative, relying on CSS transitions instead
    }, [currentScreen]);

    if (isCompromised) {
        return (
            <div style={{ flex: 1, background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
                <div style={{ fontSize: '4rem', lineHeight: 1 }}>🛑</div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '0.85rem', color: '#ff4444', letterSpacing: 2 }}>SERVICE COMPLETELY UNAVAILABLE</div>
                <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: 16, width: '90%', maxWidth: 320 }}>
                    {[
                        ['Affected Users', '50,000+ Customers'],
                        ['Downtime Duration', '47 Minutes'],
                        ['Financial Loss',    '$94,000 Estimated'],
                        ['Attack Type',       'SYN Flood + Slowloris Layer 7'],
                        ['Peak Bandwidth',    '2.5 Tbps']
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.74rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}:</span>
                            <span style={{ color: '#ff4444' }}>{v}</span>
                        </div>
                    ))}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', color: '#ff4444', textAlign: 'center', padding: '0 20px' }}>
                    Lack of upstream DDoS mitigation resulted in catastrophic service failure.
                </div>
            </div>
        );
    }

    /* ── BROWSER 503 ERROR PAGE ── */
    if (currentScreen === 'server-down') {
        return (
            <div style={{ flex: 1, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px', fontFamily: '"Segoe UI", Roboto, Helvetica, sans-serif' }}>
                 <div style={{ maxWidth: 640, width: '100%' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                         <span style={{ fontSize: '2.5rem' }}>☹️</span>
                         <h1 style={{ fontSize: '1.8rem', color: '#333', fontWeight: 300, margin: 0 }}>This site can't be reached</h1>
                     </div>
                     <p style={{ color: '#5f6368', fontSize: '1rem', marginBottom: 16 }}>
                         <strong>corpbank.com</strong> took too long to respond.
                     </p>
                     <p style={{ color: '#5f6368', fontSize: '1rem', marginBottom: 32 }}>
                         Try:
                         <ul style={{ paddingLeft: 24, marginTop: 8 }}>
                             <li>Checking the connection</li>
                             <li>Checking the proxy and the firewall</li>
                             <li>Running Windows Network Diagnostics</li>
                         </ul>
                     </p>
                     <div style={{ color: '#80868b', fontSize: '0.75rem', marginTop: 40, paddingTop: 16, borderTop: '1px solid #eee' }}>
                         ERR_CONNECTION_TIMED_OUT
                         <br/>
                         <strong>HTTP 503 Service Unavailable</strong>
                     </div>
                 </div>
            </div>
        );
    }

    /* ── SERVER MONITORING DASHBOARD ── */
    const isStruggling = currentScreen === 'server-struggling';
    const isSpiking = currentScreen === 'traffic-spiking' || isStruggling;

    return (
        <div style={{ flex: 1, background: '#111827', padding: 24, fontFamily: 'sans-serif' }}>
            <div style={{ background: '#1f2937', borderRadius: 12, padding: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, borderBottom: '1px solid #374151', paddingBottom: 16 }}>
                    <div>
                        <div style={{ fontSize: '1.2rem', color: '#f3f4f6', fontWeight: 600 }}>Web01-Main (corpbank.com)</div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Nginx Load Balancer / Proxy</div>
                    </div>
                    {/* Status Badge */}
                    {isStruggling ? (
                        <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 'bold', animation: 'flashBadge 0.5s ease-in-out infinite alternate' }}>
                            CRITICAL
                        </div>
                    ) : isSpiking ? (
                        <div style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '6px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 'bold' }}>
                            DEGRADED
                        </div>
                    ) : (
                        <div style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', color: '#10b981', padding: '6px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 'bold' }}>
                            OPERATIONAL
                        </div>
                    )}
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* CPU */}
                    <MetricCard 
                        title="CPU Usage" 
                        value={`${stats.cpu}%`}
                        pct={stats.cpu}
                        color={isStruggling ? '#ef4444' : isSpiking ? '#f59e0b' : '#10b981'}
                        flash={isStruggling}
                    />
                    {/* RAM */}
                    <MetricCard 
                        title="Memory Block" 
                        value={`${stats.mem}%`}
                        pct={stats.mem}
                        color={isStruggling ? '#ef4444' : isSpiking ? '#f59e0b' : '#10b981'}
                    />
                    {/* Connections */}
                    <MetricCard 
                        title="Active Connections" 
                        value={`${stats.conn} / 500`}
                        pct={(stats.conn / 500) * 100}
                        color={isStruggling ? '#ef4444' : isSpiking ? '#f59e0b' : '#10b981'}
                        maxedOut={stats.conn === 500}
                    />
                    {/* Response Time */}
                    <div style={{ background: '#374151', borderRadius: 8, padding: 16 }}>
                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase' }}>Avg Response Time</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: isStruggling ? '#ef4444' : isSpiking ? '#f59e0b' : '#10b981', display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                            {stats.resp.toLocaleString()} <span style={{ fontSize: '0.9rem', marginBottom: 6, fontWeight: 'normal' }}>ms</span>
                        </div>
                    </div>
                </div>

                {/* Request Rate Chart Mock */}
                <div style={{ marginTop: 20, background: '#374151', borderRadius: 8, padding: 16, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase' }}>Incoming Requests / Sec</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: isStruggling ? '#ef4444' : isSpiking ? '#f59e0b' : '#10b981' }}>
                            {stats.req.toLocaleString()} req/s
                        </div>
                    </div>
                    
                    {/* Abstract graph lines */}
                    <div style={{ height: 60, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                        {Array.from({length: 40}).map((_, i) => {
                            const h = isStruggling ? 90 + Math.random()*10 : isSpiking ? 40 + Math.random()*30 : 5 + Math.random()*15;
                            return (
                                <div key={i} style={{ 
                                    flex: 1, 
                                    background: isStruggling ? '#ef4444' : isSpiking ? '#f59e0b' : '#10b981', 
                                    height: `${h}%`, 
                                    opacity: 0.8,
                                    transition: 'height 1s ease-in-out'
                                }} />
                            );
                        })}
                    </div>
                    {/* Error rate overlay */}
                    {isStruggling && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                87% TIMEOUT ERROR RATE
                            </div>
                        </div>
                    )}
                </div>

                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes flashBadge { from { opacity: 1; } to { opacity: 0.4; } }
                    @keyframes pulseBar { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
                `}} />
            </div>
        </div>
    );
}

function MetricCard({ title, value, pct, color, flash, maxedOut }: { title: string; value: string; pct: number; color: string; flash?: boolean; maxedOut?: boolean }) {
    return (
        <div style={{ background: '#374151', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase' }}>{title}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color }}>{value}</div>
            </div>
            {/* progress bar track */}
            <div style={{ height: 6, background: '#1f2937', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ 
                    height: '100%', 
                    width: `${pct}%`, 
                    background: color, 
                    transition: 'width 1s ease-in-out, background 1s linear',
                    animation: flash || maxedOut ? 'pulseBar 0.3s ease-in-out infinite' : 'none'
                }} />
            </div>
            {maxedOut && (
                 <div style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 'bold', marginTop: 4, textAlign: 'right' }}>RESOURCE POOL EXHAUSTED</div>
            )}
        </div>
    );
}
