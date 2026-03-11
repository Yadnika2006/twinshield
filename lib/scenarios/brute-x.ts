import { ScenarioScript } from '../lab-engine';

export const bruteXScript: ScenarioScript = {
    id: 'brute-01',

    victimScreens: [
        { id: 'login-form',    type: 'login',   url: 'https://corpbank.com/login',  content: 'LOGIN_FORM' },
        { id: 'intercepted',   type: 'browser', url: 'https://corpbank.com/login',  content: 'INTERCEPTED' },
        { id: 'brute-forcing', type: 'browser', url: 'https://corpbank.com/login',  content: 'BRUTE_FORCING' },
        { id: 'login-success', type: 'browser', url: 'https://corpbank.com/admin',  content: 'LOGIN_SUCCESS' },
        { id: 'compromised',   type: 'result',  url: 'https://corpbank.com',        content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — RECON ───────────────────────────────────────────────
        {
            id: 'recon',
            name: 'RECONNAISSANCE',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'login-form',
            terminalLines: [
                { text: '══════════════════════════════════════', type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — Brute-X Attack', type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════', type: 'dim',     delay: 200 },
                { text: '',                                      type: 'dim',     delay: 300 },
                { text: 'nmap -sV target.corpbank.com',         type: 'command', delay: 500 },
                { text: '[+] 80/tcp  open  http',               type: 'success', delay: 1300 },
                { text: '[+] 443/tcp open  https',              type: 'success', delay: 1600 },
                { text: '[*] Web login form detected',           type: 'info',    delay: 2100 },
                { text: '[*] No rate limiting detected',         type: 'warning', delay: 2600 },
                { text: '[*] No CAPTCHA detected',              type: 'warning', delay: 3000 },
                { text: '[+] Target is vulnerable to brute force!', type: 'success', delay: 3500 },
                { text: '',                                      type: 'dim',     delay: 3900 },
                { text: 'burpsuite --proxy 127.0.0.1:8080',    type: 'command', delay: 4200 },
                { text: '[*] Burp Suite started',               type: 'info',    delay: 5000 },
                { text: '[*] Intercepting traffic...',          type: 'info',    delay: 5400 },
                { text: '[*] Navigate to login page and submit once', type: 'dim', delay: 5900 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker discovered two critical weaknesses: no rate limiting and no CAPTCHA. This means they can make unlimited login attempts as fast as their computer allows — perfect for brute force.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Your login page has no protection against automated attacks. Every login form needs rate limiting, account lockout after failed attempts and CAPTCHA to prevent brute force.',
                },
            ],
        },

        // ── PHASE 2 — INTERCEPT ───────────────────────────────────────────
        {
            id: 'intercept',
            name: 'TRAFFIC INTERCEPTED',
            autoPlay: false,
            progressPct: 30,
            victimScreen: 'login-form',
            terminalLines: [
                { text: '',                                      type: 'dim',     delay: 0 },
                { text: '[*] Request intercepted!',              type: 'warning', delay: 300, trigger: 'intercepted' },
                { text: 'POST /login HTTP/1.1',                  type: 'output',  delay: 700 },
                { text: 'Host: corpbank.com',                    type: 'output',  delay: 900 },
                { text: 'Content-Type: application/x-www-form-urlencoded', type: 'output', delay: 1100 },
                { text: '',                                      type: 'dim',     delay: 1300 },
                { text: 'username=admin&password=test123',       type: 'data',    delay: 1600 },
                { text: '',                                      type: 'dim',     delay: 2000 },
                { text: '[+] Parameters identified:',            type: 'success', delay: 2300 },
                { text: '    username field: username',          type: 'data',    delay: 2600 },
                { text: '    password field: password',          type: 'data',    delay: 2900 },
                { text: '[*] Sending to Intruder...',            type: 'info',    delay: 3400 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Burp Suite intercepted the login request and revealed the exact parameter names. The attacker now knows exactly what to target — username and password fields sent as a POST request.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Login credentials are being intercepted by a proxy tool. Always use HTTPS and ensure your login form submits securely.',
                },
            ],
            decisionPoint: {
                id: 'intercept-decision',
                question: 'Your login form has been intercepted. What would have made this harder?',
                description: 'Full attack continues so you see exactly how brute force works.',
                choices: [
                    { label: '🤖 Adding CAPTCHA to the login form',  safe: true,  consequence: 'Correct — CAPTCHA breaks automated tools like Hydra' },
                    { label: '🔑 Using a longer password',            safe: false, consequence: 'Longer passwords help but without rate limiting they can still be cracked given enough time' },
                ],
            },
            nextPhase: 'brute-forcing',
        },

        // ── PHASE 3 — BRUTE FORCING ───────────────────────────────────────
        {
            id: 'brute-forcing',
            name: 'BRUTE FORCE IN PROGRESS',
            autoPlay: true,
            progressPct: 60,
            victimScreen: 'intercepted',
            terminalLines: [
                { text: '',                                      type: 'dim',     delay: 0 },
                { text: 'hydra -l admin -P /wordlists/rockyou.txt corpbank.com http-post-form "/login:username=^USER^&password=^PASS^:Invalid"', type: 'command', delay: 300 },
                { text: '[*] Hydra starting...',                 type: 'info',    delay: 1200, trigger: 'brute-forcing' },
                { text: '[ATTEMPT] admin : password    → FAILED', type: 'error', delay: 1700 },
                { text: '[ATTEMPT] admin : 123456      → FAILED', type: 'error', delay: 2000 },
                { text: '[ATTEMPT] admin : admin123    → FAILED', type: 'error', delay: 2300 },
                { text: '[ATTEMPT] admin : letmein     → FAILED', type: 'error', delay: 2600 },
                { text: '[ATTEMPT] admin : welcome1    → FAILED', type: 'error', delay: 2900 },
                { text: '[*] Trying 1,000 passwords per second...', type: 'info', delay: 3200 },
                { text: '[ATTEMPT] admin : qwerty      → FAILED', type: 'error', delay: 3600 },
                { text: '[ATTEMPT] admin : monkey      → FAILED', type: 'error', delay: 3900 },
                { text: '[ATTEMPT] admin : dragon      → FAILED', type: 'error', delay: 4200 },
                { text: '[*] 500 attempts completed...',         type: 'dim',     delay: 4600 },
                { text: '[*] 750 attempts completed...',         type: 'dim',     delay: 5200 },
                { text: '[ATTEMPT] admin : sunshine    → FAILED', type: 'error', delay: 5600 },
                { text: '[ATTEMPT] admin : password1   → FAILED', type: 'error', delay: 5900 },
                { text: '[*] 847 attempts completed...',         type: 'dim',     delay: 6300 },
                { text: '[ATTEMPT] admin : welcome123  → SUCCESS!', type: 'success', delay: 6800 },
                { text: '',                                      type: 'dim',     delay: 7200 },
                { text: '[+] VALID CREDENTIALS FOUND!',          type: 'success', delay: 7500 },
                { text: '[+] username: admin',                   type: 'data',    delay: 7800 },
                { text: '[+] password: welcome123',              type: 'data',    delay: 8100 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Hydra tried 847 passwords in under one second. RockYou.txt contains 14 million common passwords from real breaches. Your password was in the list. This is why common passwords are dangerous.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Brute force attack in progress — 1,000 attempts per second detected. Account lockout after 5 attempts would have stopped this attack after 5 seconds.',
                },
            ],
        },

        // ── PHASE 4 — LOGIN SUCCESS ───────────────────────────────────────
        {
            id: 'login-success',
            name: 'ADMIN ACCESS GAINED',
            autoPlay: true,
            progressPct: 85,
            victimScreen: 'brute-forcing',
            terminalLines: [
                { text: '',                                      type: 'dim',     delay: 0 },
                { text: '[*] Logging in with found credentials...', type: 'info', delay: 300, trigger: 'login-success' },
                { text: '[+] Login successful!',                 type: 'success', delay: 900 },
                { text: '[+] Admin panel accessed',              type: 'success', delay: 1300 },
                { text: '[+] User data visible: 10,000 accounts', type: 'data',  delay: 1700 },
                { text: '[+] Financial data visible',            type: 'data',    delay: 2000 },
                { text: '[+] System configuration exposed',      type: 'data',    delay: 2300 },
                { text: '',                                      type: 'dim',     delay: 2700 },
                { text: 'python3 extract_data.py --all',         type: 'command', delay: 3000 },
                { text: '[*] Extracting all user records...',    type: 'info',    delay: 3800 },
                { text: '[+] 10,000 accounts downloaded',        type: 'success', delay: 4600 },
                { text: '[+] Stored in breach_data.txt',         type: 'data',    delay: 5000 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'With admin credentials the attacker has full access to everything. One weak password exposed 10,000 customer accounts. Password managers generate and store strong unique passwords so you never need to remember them.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Immediate actions after brute force: lock the compromised account, force password reset, enable 2FA, implement account lockout policy, add CAPTCHA, review what was accessed during the compromise period.',
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
                { text: '[+] Accounts compromised: 10,000',      type: 'data',    delay: 700 },
                { text: '[+] Admin access duration: 4 mins',     type: 'data',    delay: 1000 },
                { text: '[+] Data exfiltrated: breach_data.txt', type: 'data',    delay: 1300 },
                { text: '[*] Publishing to dark web forum...',   type: 'info',    delay: 1800 },
                { text: '[+] Sale complete: $2,400',             type: 'error',   delay: 2500 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Brute force attacks are 100 percent preventable. Account lockout after 5 attempts, CAPTCHA and 2FA together make brute force practically impossible — even against the world\'s fastest computers.',
                },
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The 2018 Dunkin Donuts breach exposed 300,000 customer accounts through credential stuffing — a targeted form of brute force using passwords from previous breaches.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Future prevention: implement account lockout after 5 failed attempts, add CAPTCHA to all login forms, enforce strong password policy minimum 12 characters, enable 2FA on all accounts, monitor for unusual login patterns and geographic anomalies.',
                },
            ],
        },
    ],
};
