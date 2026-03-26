import { ScenarioScript } from '../lab-engine';

export const spyAgentScript: ScenarioScript = {
    id: 'spy-01',

    victimScreens: [
        { id: 'desktop-normal',   type: 'desktop', url: 'CORP-PC01', content: 'DESKTOP_NORMAL' },
        { id: 'spyware-active',   type: 'desktop', url: 'CORP-PC01', content: 'SPYWARE_ACTIVE' },
        { id: 'screenshot-taken', type: 'desktop', url: 'CORP-PC01', content: 'SCREENSHOT_TAKEN' },
        { id: 'camera-active',    type: 'desktop', url: 'CORP-PC01', content: 'CAMERA_ACTIVE' },
        { id: 'data-sent',        type: 'desktop', url: 'CORP-PC01', content: 'DATA_SENT' },
        { id: 'compromised',      type: 'result',  url: 'CORP-PC01', content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — INSTALL ─────────────────────────────────────────────
        {
            id: 'install',
            name: 'SPYWARE INSTALLED',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'desktop-normal',
            terminalLines: [
                { text: '══════════════════════════════════════',       type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — Spy Agent',             type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════',       type: 'dim',     delay: 200 },
                { text: '',                                             type: 'dim',     delay: 300 },
                { text: 'cat spyware.py',                              type: 'command', delay: 500 },
                { text: 'from PIL import ImageGrab',                   type: 'output',  delay: 1200 },
                { text: 'import psutil, smtplib',                      type: 'output',  delay: 1400 },
                { text: 'import threading, time',                      type: 'output',  delay: 1600 },
                { text: '',                                             type: 'dim',     delay: 1800 },
                { text: 'def capture_screen():',                       type: 'output',  delay: 2100 },
                { text: "  screenshot = ImageGrab.grab()",             type: 'output',  delay: 2300 },
                { text: "  screenshot.save('screen.png')",             type: 'output',  delay: 2500 },
                { text: '  return screenshot',                         type: 'output',  delay: 2700 },
                { text: '',                                             type: 'dim',     delay: 2900 },
                { text: 'def get_processes():',                        type: 'output',  delay: 3200 },
                { text: '  return [p.name() for p in',                type: 'output',  delay: 3400 },
                { text: '          psutil.process_iter()]',            type: 'output',  delay: 3600 },
                { text: '',                                             type: 'dim',     delay: 3800 },
                { text: 'def exfiltrate():',                           type: 'output',  delay: 4100 },
                { text: '  while True:',                               type: 'output',  delay: 4300 },
                { text: '    capture_screen()',                        type: 'output',  delay: 4500 },
                { text: '    get_processes()',                         type: 'output',  delay: 4700 },
                { text: '    send_to_server()',                        type: 'output',  delay: 4900 },
                { text: '    time.sleep(300)',                         type: 'output',  delay: 5100 },
                { text: '',                                             type: 'dim',     delay: 5400 },
                { text: 'python3 build_spyware.py --name svchost.exe --startup true --stealth true', type: 'command', delay: 5700 },
                { text: '[+] Spyware compiled as svchost.exe',         type: 'success', delay: 6700 },
                { text: '[+] Added to startup registry',               type: 'success', delay: 7000 },
                { text: '[+] Process hidden from Task Manager',        type: 'success', delay: 7300 },
                { text: '[*] Deploying to victim machine...',          type: 'info',    delay: 7800 },
                { text: '[+] Spyware installed successfully',          type: 'success', delay: 8700 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'This spyware uses ImageGrab from Python PIL library to capture screenshots and psutil to log all running processes. It disguises itself as svchost.exe — a genuine Windows system process that always runs in background.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Spyware operates completely silently. No popup, no warning, no performance impact. Regular application permission audits and antivirus scans are the only way to detect it before damage is done.',
                },
            ],
            nextPhase: 'monitoring',
        },

        // ── PHASE 2 — MONITORING ──────────────────────────────────────────
        {
            id: 'monitoring',
            name: 'SURVEILLANCE ACTIVE',
            autoPlay: false,
            progressPct: 30,
            victimScreen: 'desktop-normal',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Spyware active and monitoring...',          type: 'info',    delay: 300 },
                { text: '[*] Screenshot interval: every 5 minutes',     type: 'info',    delay: 900 },
                { text: '[*] Process logging: continuous',              type: 'info',    delay: 1300 },
                { text: '[*] Clipboard monitoring: enabled',            type: 'info',    delay: 1700, trigger: 'spyware-active' },
                { text: '[*] All data queued for exfiltration...',      type: 'dim',     delay: 2300 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The spyware is now running and the victim desktop looks completely normal. The attacker receives a live picture of everything on your screen every 5 minutes. They can read your emails, documents and messages without you ever knowing.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Check your application permissions regularly. On Windows: Settings → Privacy → Camera and Microphone to see which apps have access. Physically cover your webcam when not in use.',
                },
            ],
            decisionPoint: {
                id: 'monitoring-decision',
                question: 'Your computer seems perfectly normal. How would you detect spyware is running?',
                description: 'Full attack plays out to show exactly what spyware captures.',
                choices: [
                    { label: '🔍 Check Task Manager for unknown processes',  safe: true,  consequence: 'Good — svchost.exe appearing multiple times can indicate spyware' },
                    { label: '😌 I would not know — it looks normal',         safe: false, consequence: 'Most victims never know — detection requires security tools' },
                ],
            },
            nextPhase: 'screenshot',
        },

        // ── PHASE 3 — SCREENSHOT ──────────────────────────────────────────
        {
            id: 'screenshot',
            name: 'SCREENSHOTS CAPTURED',
            autoPlay: true,
            progressPct: 50,
            victimScreen: 'spyware-active',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Capturing screenshot...',                  type: 'info',    delay: 300, trigger: 'screenshot-taken' },
                { text: '[+] Screenshot saved: screen_001.png',        type: 'success', delay: 1000 },
                { text: '[*] Victim is typing an email...',             type: 'info',    delay: 1700 },
                { text: '[+] Screenshot saved: screen_002.png',        type: 'success', delay: 2400 },
                { text: '    (email contents visible)',                 type: 'dim',     delay: 2700 },
                { text: '[*] Victim opened banking site...',            type: 'info',    delay: 3300 },
                { text: '[+] Screenshot saved: screen_003.png',        type: 'success', delay: 4100 },
                { text: '    (account balance visible: $24,500)',       type: 'data',    delay: 4400 },
                { text: '[*] Victim typing password...',               type: 'info',    delay: 5000 },
                { text: '[+] Screenshot saved: screen_004.png',        type: 'success', delay: 5800 },
                { text: '    (password partially visible)',             type: 'warning', delay: 6100 },
                { text: '[+] 12 screenshots captured this hour',       type: 'data',    delay: 6700 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker now has screenshots showing your email contents, bank balance and a partial view of your password being typed. Screenshots every 5 minutes means they see almost everything you work on throughout your day.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Sensitive information is being captured via screenshots. Cover webcam when not in use. Use privacy screen filters in public. Be aware of what is visible on screen before stepping away.',
                },
            ],
            nextPhase: 'camera',
        },

        // ── PHASE 4 — CAMERA ──────────────────────────────────────────────
        {
            id: 'camera',
            name: 'WEBCAM ACTIVATED',
            autoPlay: true,
            progressPct: 70,
            victimScreen: 'screenshot-taken',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Activating webcam capture...',             type: 'warning', delay: 300, trigger: 'camera-active' },
                { text: '[+] Webcam photo taken silently',             type: 'success', delay: 1100 },
                { text: '[*] Victim visible at workstation',           type: 'info',    delay: 1700 },
                { text: '[+] Location identifiable from background',   type: 'data',    delay: 2300 },
                { text: '[*] Microphone recording started...',         type: 'warning', delay: 2900 },
                { text: '[+] Audio clip captured: 30 seconds',        type: 'success', delay: 3700 },
                { text: '[*] Phone call recorded',                     type: 'info',    delay: 4300 },
                { text: '[+] Sensitive conversation captured',         type: 'error',   delay: 5000 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Modern spyware can activate your webcam and microphone without triggering the indicator light on many laptops. Physical webcam covers cost less than one dollar and completely defeat this capability — even the most sophisticated spyware.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Place a physical cover over your webcam. Use headphones with inline microphone for sensitive calls. Check camera and microphone permissions in privacy settings monthly. Tape is free and effective.',
                },
            ],
            nextPhase: 'exfiltrate',
        },

        // ── PHASE 5 — EXFILTRATE ──────────────────────────────────────────
        {
            id: 'exfiltrate',
            name: 'DATA EXFILTRATED',
            autoPlay: true,
            progressPct: 85,
            victimScreen: 'camera-active',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Exfiltrating collected data...',            type: 'info',    delay: 300, trigger: 'data-sent' },
                { text: '[+] Screenshots:       47 images uploaded',    type: 'success', delay: 1000 },
                { text: '[+] Process logs:      24 hours uploaded',     type: 'success', delay: 1400 },
                { text: '[+] Audio clips:       8 recordings uploaded', type: 'success', delay: 1800 },
                { text: '[+] Webcam photos:     12 uploaded',           type: 'success', delay: 2200 },
                { text: '[+] Clipboard contents: 156 entries',          type: 'success', delay: 2600 },
                { text: '[+] Total data:        234 MB exfiltrated',    type: 'data',    delay: 3200 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: '234 megabytes of your private life sent to the attacker — screenshots, recordings, webcam photos and everything you copied to clipboard. All sent encrypted so it bypasses most network monitoring tools.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Large data exfiltration detected. Contact IT security immediately. Disconnect from network. Do not use device for any sensitive activity until fully cleaned.',
                },
            ],
            nextPhase: 'compromised',
        },

        // ── PHASE 6 — COMPROMISED ─────────────────────────────────────────
        {
            id: 'compromised',
            name: 'ATTACK COMPLETE',
            autoPlay: true,
            progressPct: 100,
            victimScreen: 'compromised',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[+] Surveillance summary:',                    type: 'data',    delay: 300 },
                { text: '[+] Screenshots:     47',                      type: 'data',    delay: 700 },
                { text: '[+] Audio recordings: 8',                      type: 'data',    delay: 1000 },
                { text: '[+] Webcam captures: 12',                      type: 'data',    delay: 1300 },
                { text: '[+] Days monitored:  7',                       type: 'data',    delay: 1600 },
                { text: '[+] FULL SURVEILLANCE ACTIVE',                 type: 'error',   delay: 2200 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The NSO Group Pegasus spyware was used to surveil journalists and politicians in 45 countries. It activated cameras and microphones with zero interaction. The same principles apply to this lab.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Future prevention: physical webcam cover, audit app permissions monthly, only install software from official sources, run antivirus regularly, check startup programs, use endpoint detection and response tools.',
                },
            ],
        },
    ],
};
