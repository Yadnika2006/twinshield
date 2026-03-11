import { ScenarioScript } from '../lab-engine';

export const keyLoggerScript: ScenarioScript = {
    id: 'klog-01',

    victimScreens: [
        { id: 'desktop-normal',   type: 'desktop', url: 'CORP-PC01', content: 'DESKTOP_NORMAL' },
        { id: 'keylogger-active', type: 'desktop', url: 'CORP-PC01', content: 'KEYLOGGER_ACTIVE' },
        { id: 'keys-captured',    type: 'desktop', url: 'CORP-PC01', content: 'KEYS_CAPTURED' },
        { id: 'log-exfiltrated',  type: 'desktop', url: 'CORP-PC01', content: 'LOG_EXFILTRATED' },
        { id: 'compromised',      type: 'result',  url: 'CORP-PC01', content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — INSTALL ─────────────────────────────────────────────
        {
            id: 'install',
            name: 'KEYLOGGER INSTALLED',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'desktop-normal',
            terminalLines: [
                { text: '══════════════════════════════════════',   type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — Key Logger',        type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════',   type: 'dim',     delay: 200 },
                { text: '',                                         type: 'dim',     delay: 300 },
                { text: 'cat keylogger.py',                        type: 'command', delay: 500 },
                { text: 'import pynput',                           type: 'output',  delay: 1200 },
                { text: 'from pynput.keyboard import Listener',    type: 'output',  delay: 1400 },
                { text: 'import smtplib, threading',               type: 'output',  delay: 1600 },
                { text: '',                                         type: 'dim',     delay: 1800 },
                { text: 'def on_press(key):',                      type: 'output',  delay: 2000 },
                { text: '  log_key(str(key))',                     type: 'output',  delay: 2200 },
                { text: '  if len(key_buffer) >= 100:',            type: 'output',  delay: 2400 },
                { text: '    send_email(key_buffer)',              type: 'output',  delay: 2600 },
                { text: '',                                         type: 'dim',     delay: 2800 },
                { text: 'with Listener(on_press=on_press) as l:',  type: 'output',  delay: 3000 },
                { text: '  l.join()',                              type: 'output',  delay: 3200 },
                { text: '',                                         type: 'dim',     delay: 3600 },
                { text: 'python3 compile_keylogger.py --output svchost_helper.exe --startup autorun', type: 'command', delay: 3900 },
                { text: '[+] Compiled as: svchost_helper.exe',     type: 'success', delay: 4900 },
                { text: '[+] Added to Windows startup registry',   type: 'success', delay: 5300 },
                { text: '[+] Process hidden from task manager',    type: 'success', delay: 5700 },
                { text: '[*] Deploying to victim via phishing email...', type: 'info', delay: 6200 },
                { text: '[+] Keylogger installed silently',        type: 'success', delay: 7100 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'This keylogger was written in Python using the pynput library. It runs silently in the background capturing every keystroke. It disguises itself as svchost.exe — a legitimate Windows process — making it nearly impossible to spot without security tools.',
                },
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The keylogger is added to Windows startup registry so it runs automatically every time you turn on your computer. Simply restarting will not remove it — only a full system reinstall or security tool will clean it.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'A keylogger records everything you type — passwords, emails, messages, banking details. Antivirus tools detect known keyloggers but custom ones like this may evade detection. 2FA protects you even if passwords are stolen.',
                },
            ],
        },

        // ── PHASE 2 — CAPTURING ───────────────────────────────────────────
        {
            id: 'capturing',
            name: 'SILENTLY RECORDING',
            autoPlay: false,
            progressPct: 35,
            victimScreen: 'desktop-normal',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Keylogger running silently...',             type: 'info',    delay: 300 },
                { text: '[*] Process disguised as: svchost_helper',     type: 'dim',     delay: 900 },
                { text: '[*] Victim has no indication it is running',   type: 'warning', delay: 1500, trigger: 'keylogger-active' },
                { text: '[*] Capturing all keystrokes...',              type: 'info',    delay: 2100 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The victim desktop looks completely normal. No popup, no warning, no slowdown. The keylogger uses less than 1 percent CPU. This is what makes keyloggers so dangerous — there is zero visible indication.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'If a keylogger is installed on your system every password you type is compromised. Use a password manager which autofills credentials without keyboard input — defeating keyloggers completely.',
                },
            ],
            decisionPoint: {
                id: 'keylogger-decision',
                question: 'Your computer seems completely normal. The keylogger is running silently. What would reveal it is there?',
                description: 'Full attack plays out to show how keystrokes are captured and sent.',
                choices: [
                    { label: '🔍 Check Task Manager for unknown processes', safe: true,  consequence: 'Good — unusual processes in Task Manager can indicate malware' },
                    { label: '💻 Nothing — it looks normal to me',          safe: false, consequence: 'This is exactly what the attacker relies on — invisibility' },
                ],
            },
            nextPhase: 'keys-captured',
        },

        // ── PHASE 3 — KEYS CAPTURED ───────────────────────────────────────
        {
            id: 'keys-captured',
            name: 'CREDENTIALS CAPTURED',
            autoPlay: true,
            progressPct: 55,
            victimScreen: 'keylogger-active',
            terminalLines: [
                { text: '',                                                      type: 'dim',     delay: 0 },
                { text: '[KEY] c-o-r-p-b-a-n-k-.-c-o-m [ENTER]',              type: 'data',    delay: 300, trigger: 'keys-captured' },
                { text: '[KEY] j-o-h-n-.-s-m-i-t-h-@-c-o-r-p-b-a-n-k-.-c-o-m', type: 'data', delay: 1100 },
                { text: '[KEY] [TAB]',                                           type: 'dim',     delay: 1800 },
                { text: '[KEY] C-o-r-p-B-a-n-k-2-0-2-4-! [ENTER]',            type: 'data',    delay: 2200 },
                { text: '[*] Credentials captured!',                             type: 'success', delay: 2900 },
                { text: '',                                                      type: 'dim',     delay: 3300 },
                { text: '[KEY] g-m-a-i-l-.-c-o-m [ENTER]',                     type: 'data',    delay: 3600 },
                { text: '[KEY] j-o-h-n-s-m-i-t-h-9-0-@-g-m-a-i-l-.-c-o-m',  type: 'data',    delay: 4300 },
                { text: '[KEY] [TAB]',                                           type: 'dim',     delay: 5000 },
                { text: '[KEY] M-y-G-m-a-i-l-P-a-s-s-1-2-3 [ENTER]',         type: 'data',    delay: 5400 },
                { text: '[*] Gmail credentials captured!',                       type: 'success', delay: 6100 },
                { text: '',                                                      type: 'dim',     delay: 6500 },
                { text: '[KEY] H-i- -S-a-r-a-h-,- -t-h-e- -p-a-s-s-w-o-r-d- -i-s- -S-e-c-r-e-t-1-2-3 [ENTER]', type: 'data', delay: 6800 },
                { text: '[*] Private message captured!',                         type: 'warning', delay: 7800 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Every single keystroke is appearing in the attacker terminal in real time. Notice your CorpBank login, your Gmail password and even the private message you typed to a colleague — all captured as you typed.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Keylogger actively capturing credentials. Your CorpBank and Gmail passwords are now compromised. Do not type any more passwords on this machine. Change all passwords from a different clean device immediately.',
                },
            ],
        },

        // ── PHASE 4 — EXFILTRATE ──────────────────────────────────────────
        {
            id: 'exfiltrate',
            name: 'LOG EXFILTRATED',
            autoPlay: true,
            progressPct: 80,
            victimScreen: 'keys-captured',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Buffer full — sending keystroke log...',    type: 'info',    delay: 300, trigger: 'log-exfiltrated' },
                { text: '[*] Connecting to SMTP relay...',              type: 'info',    delay: 900 },
                { text: '[*] Emailing log to attacker@protonmail.com',  type: 'info',    delay: 1500 },
                { text: '[+] Email sent successfully!',                  type: 'success', delay: 2300 },
                { text: '[+] Subject: KeyLog_CORP-PC01_2024',           type: 'data',    delay: 2700 },
                { text: '[+] Contents: 2,847 keystrokes captured',      type: 'data',    delay: 3000 },
                { text: '[+] Passwords identified: 8',                   type: 'data',    delay: 3300 },
                { text: '[+] Credit card number detected: 1',            type: 'error',   delay: 3700 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Every 60 seconds the keylogger emails the captured log to the attacker. They receive it silently and automatically. 8 passwords and a credit card number were extracted from just one hour of normal computer use.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Use a password manager to autofill passwords without typing them — defeats keyloggers completely. Enable 2FA so stolen passwords alone cannot login. Use virtual keyboard for banking sites.',
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
                { text: '[+] Total keystrokes captured: 2,847',         type: 'data',    delay: 300 },
                { text: '[+] Passwords extracted:       8',             type: 'data',    delay: 700 },
                { text: '[+] Credit card detected: 4532-XXXX-XXXX-1234', type: 'data',  delay: 1000 },
                { text: '[+] Private messages:          24',            type: 'data',    delay: 1300 },
                { text: '[+] FULL KEYSTROKE HISTORY COMPROMISED',       type: 'error',   delay: 1800 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The 2016 Bangladesh Bank heist where attackers stole 81 million dollars began with a keylogger installed on bank computers that captured SWIFT banking system credentials. Same technique — different scale.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Future prevention: use password manager for autofill, enable 2FA on all accounts, run regular antivirus scans, check startup programs for unknown entries, use hardware security keys for critical accounts.',
                },
            ],
        },
    ],
};
