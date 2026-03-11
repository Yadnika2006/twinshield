import React, { useState } from 'react';
import SqlStormVictim  from './victims/SqlStormVictim';
import BruteXVictim   from './victims/BruteXVictim';
import XssploitVictim from './victims/XssploitVictim';
import SessHijackVictim from './victims/SessHijackVictim';
import MalwareDropVictim from './victims/MalwareDropVictim';
import KeyLoggerVictim from './victims/KeyLoggerVictim';
import RansomDropVictim from './victims/RansomDropVictim';
import SpyAgentVictim from './victims/SpyAgentVictim';
import UsbDropVictim from './victims/UsbDropVictim';
import WeakPassVictim from './victims/WeakPassVictim';
import FakeAPVictim from './victims/FakeAPVictim';
import MitmCafeVictim from './victims/MitmCafeVictim';
import NetFloodVictim from './victims/NetFloodVictim';
import SocialEngVictim from './victims/SocialEngVictim';
import PhishNetVictim from './victims/PhishNetVictim';

interface VictimPanelProps {
    currentScreen: string;
    scenarioId: string;
    onInteraction?: (action: string, payload?: any) => void;
}

/* ─────────────────────────────────────────────────────────────────
   COMING SOON placeholder
───────────────────────────────────────────────────────────────── */
function ComingSoonVictim({ scenarioId }: { scenarioId: string }) {
    return (
        <div style={{ flex:1, background:'#0a1628', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:24, fontFamily:'sans-serif' }}>
            <div style={{ fontSize:'4rem' }}>🧪</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", color:'#00d4ff', fontSize:'0.9rem', letterSpacing:2 }}>SCENARIO LOADING</div>
            <div style={{ color:'rgba(200,230,255,0.5)', fontSize:'0.8rem' }}>{scenarioId} — victim panel coming soon</div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   MASTER ROUTER
───────────────────────────────────────────────────────────────── */
export default function VictimPanel({ currentScreen, scenarioId, onInteraction }: VictimPanelProps) {

    /* Shared header for non-phish scenarios */
    const showHeader = scenarioId !== 'phish-01';

    const inner = (() => {
        switch (scenarioId) {
            case 'phish-01':
                return <PhishNetVictim currentScreen={currentScreen} onInteraction={onInteraction} />;
            case 'sqli-01':
                return <SqlStormVictim  currentScreen={currentScreen} onInteraction={onInteraction} />;
            case 'brute-01':
                return <BruteXVictim   currentScreen={currentScreen} onInteraction={onInteraction} />;
            case 'xss-01':
                return <XssploitVictim currentScreen={currentScreen} onInteraction={onInteraction} />;
            case 'sess-01':
                return <SessHijackVictim currentScreen={currentScreen} onInteraction={onInteraction} />;
            case 'malware-01':
                return <MalwareDropVictim currentScreen={currentScreen} />;
            case 'klog-01':
                return <KeyLoggerVictim currentScreen={currentScreen} />;
            case 'rnsw-01':
                return <RansomDropVictim currentScreen={currentScreen} />;
            case 'spy-01':
                return <SpyAgentVictim currentScreen={currentScreen} />;
            case 'usb-01':
                return <UsbDropVictim currentScreen={currentScreen} onInteraction={onInteraction} />;
            case 'weakpass-01':
                return <WeakPassVictim currentScreen={currentScreen} onInteraction={onInteraction} />;
            case 'fakeap-01':
                return <FakeAPVictim currentScreen={currentScreen} onInteraction={onInteraction} />;
            case 'mitm-01':
                return <MitmCafeVictim currentScreen={currentScreen} onInteraction={onInteraction} />;
            case 'dos-01':
                return <NetFloodVictim currentScreen={currentScreen} onInteraction={onInteraction} />;
            case 'social-01':
                return <SocialEngVictim currentScreen={currentScreen} onInteraction={onInteraction} />;
            default:
                return <ComingSoonVictim scenarioId={scenarioId} />;
        }
    })();

    if (!showHeader) return <>{inner}</>;

    /* Wrap non-phish victims with the VICTIM VIEW header + LIVE badge */
    return (
        <div style={{ width:'100%', height:'100%', overflow:'hidden', display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', background:'rgba(0,0,0,0.3)', borderBottom:'1px solid rgba(0,212,255,0.2)', flexShrink:0 }}>
                <span style={{ fontSize:'0.8rem' }}>🔴</span>
                <span style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:'bold', color:'#fff' }}>VICTIM VIEW</span>
                <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'0.7rem', color:'#ff4444', border:'1px solid rgba(255,68,68,0.4)', padding:'2px 6px', borderRadius:'4px', marginLeft:'auto' }}>LIVE</span>
            </div>
            <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                {inner}
            </div>
        </div>
    );
}
