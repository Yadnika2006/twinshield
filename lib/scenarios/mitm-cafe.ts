import { ScenarioScript } from '../lab-engine';

export const mitmCafeScript: ScenarioScript = {
    id: 'mitm-01',

    victimScreens: [
        { id: 'cafe-browser',     type: 'browser', url: 'https://corpbank.com', content: 'CAFE_BROWSER' },
        { id: 'arp-poisoned',     type: 'browser', url: 'https://corpbank.com', content: 'ARP_POISONED' },
        { id: 'https-stripped',   type: 'browser', url: 'http://corpbank.com',  content: 'HTTPS_STRIPPED' },
        { id: 'login-intercepted',type: 'browser', url: 'http://corpbank.com',  content: 'LOGIN_INTERCEPTED' },
        { id: 'compromised',      type: 'result',  url: '192.168.0.45',         content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — ARP POISON ──────────────────────────────────────────
        {
            id: 'arp-poison',
            name: 'NETWORK POISONING',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'cafe-browser',
            terminalLines: [
                { text: '══════════════════════════════════════',       type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — MitM Cafe',             type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════',       type: 'dim',     delay: 200 },
                { text: '',                                             type: 'dim',     delay: 300 },
                { text: '[*] Attacker sitting in same cafe network',    type: 'info',    delay: 500 },
                { text: 'echo 1 > /proc/sys/net/ipv4/ip_forward',      type: 'command', delay: 1200 },
                { text: '[+] IP forwarding enabled',                    type: 'success', delay: 1600 },
                { text: '[*] Packets will be forwarded to avoid DoS',   type: 'info',    delay: 1900 },
                { text: '',                                             type: 'dim',     delay: 2300 },
                { text: 'arpspoof -i eth0 -t 192.168.0.45 192.168.0.1', type: 'command', delay: 2800 },
                { text: '[*] Sending fake ARP replies...',              type: 'warning', delay: 3500 },
                { text: '[+] Telling victim: I am the gateway',        type: 'success', delay: 3900 },
                { text: '[*] Sending every 2 seconds...',               type: 'info',    delay: 4200 },
                { text: '',                                             type: 'dim',     delay: 4600 },
                { text: 'arpspoof -i eth0 -t 192.168.0.1 192.168.0.45', type: 'command', delay: 5100 },
                { text: '[+] Telling gateway: I am the victim',        type: 'success', delay: 5800 },
                { text: '[+] ARP poisoning complete!',                  type: 'error',   delay: 6300, trigger: 'arp-poisoned' },
                { text: '[+] Attacker positioned in the middle',        type: 'error',   delay: 6700 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'ARP poisoning works by lying to both your device and the router. Your device is told the attacker\'s laptop is the gateway. The router is told the attacker is you. All traffic flows through the attacker in both directions — completely invisible to you.',
                },
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'IP forwarding must be enabled first so the attacker actually forwards your traffic to the internet. Without this you would lose connectivity and notice something is wrong. With it enabled everything appears completely normal.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'ARP poisoning is invisible on public WiFi. The only protection is encryption. Use a VPN which encrypts all traffic before it leaves your device — the attacker only sees encrypted gibberish.',
                },
            ],
        },

        // ── PHASE 2 — SSL STRIP ───────────────────────────────────────────
        {
            id: 'ssl-strip',
            name: 'HTTPS DOWNGRADE',
            autoPlay: false,
            progressPct: 35,
            victimScreen: 'arp-poisoned',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: 'mitmproxy --mode transparent --ssl-insecure -p 8080', type: 'command', delay: 300 },
                { text: '[+] Transparent proxy running',                 type: 'success', delay: 1100 },
                { text: '[*] Intercepting all HTTP and HTTPS...',        type: 'warning', delay: 1500 },
                { text: '',                                              type: 'dim',     delay: 1900 },
                { text: 'sslstrip2 -l 8080 -w sslstrip.log',             type: 'command', delay: 2400 },
                { text: '[+] SSLstrip2 running',                         type: 'success', delay: 3200 },
                { text: '[*] Watching for HTTPS redirects...',           type: 'info',    delay: 3700 },
                { text: '[+] corpbank.com: HTTPS → HTTP stripped!',     type: 'error',   delay: 4400 },
                { text: '[+] Victim browser now uses HTTP',              type: 'data',    delay: 4800, trigger: 'https-stripped' },
                { text: '[*] Padlock icon removed from victim browser',  type: 'warning', delay: 5200 },
                { text: '[*] Victim may not notice change...',           type: 'info',    delay: 5700 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'SSLstrip intercepts the redirect from HTTP to HTTPS and serves plain HTTP instead. Your browser never gets the chance to establish an encrypted connection. HSTS preloading prevents this by forcing HTTPS in the browser before any request is made.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Your HTTPS connection has been downgraded to HTTP. The padlock in your browser should have disappeared. Always check for HTTPS on banking and login pages. Enable HSTS in your browser settings.',
                },
            ],
            decisionPoint: {
                id: 'mitm-decision',
                question: 'You are in a cafe using public WiFi to check your bank account. You notice the padlock is missing from the URL bar. What do you do?',
                description: 'Full attack continues to show credential interception in detail.',
                choices: [
                    { label: '🔒 Stop immediately — missing padlock is serious', safe: true,  consequence: 'Correct — missing padlock means connection is not encrypted' },
                    { label: '🤷 Continue — the site looks normal',             safe: false, consequence: 'Your credentials will be captured in plain text' },
                ],
            },
            nextPhase: 'capture',
        },

        // ── PHASE 3 — CAPTURE ─────────────────────────────────────────────
        {
            id: 'capture',
            name: 'CREDENTIALS CAPTURED',
            autoPlay: true,
            progressPct: 60,
            victimScreen: 'https-stripped',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Traffic flowing through attacker...',       type: 'info',    delay: 500 },
                { text: '[*] Monitoring for login forms...',             type: 'info',    delay: 1200 },
                { text: '[+] GET http://corpbank.com/login',             type: 'data',    delay: 2400 },
                { text: '[+] Serving fake login page over HTTP',         type: 'warning', delay: 2800 },
                { text: '[*] Victim loading login form...',              type: 'info',    delay: 3400, trigger: 'login-intercepted' },
                { text: '[+] Victim submitting credentials...',          type: 'error',   delay: 6800 },
                { text: 'POST /login HTTP/1.1',                          type: 'output',  delay: 7200 },
                { text: 'Host: corpbank.com',                            type: 'output',  delay: 7400 },
                { text: 'username=john.smith@corpbank.com',              type: 'output',  delay: 7600 },
                { text: '&password=CorpBank2024!',                       type: 'output',  delay: 7800 },
                { text: '[+] CREDENTIALS CAPTURED!',                     type: 'error',   delay: 8400 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Your login credentials traveled from your browser through the attacker laptop to the real CorpBank server. Everything worked normally from your perspective — you got logged in. But the attacker has a copy of your password.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Login credentials captured via MitM. The attacker has your CorpBank password. Change it immediately from a safe network. Enable 2FA so stolen passwords alone are insufficient for account access.',
                },
            ],
            nextPhase: 'session-capture',
        },

        // ── PHASE 4 — SESSION CAPTURE ─────────────────────────────────────
        {
            id: 'session-capture',
            name: 'SESSION HIJACKING',
            autoPlay: true,
            progressPct: 80,
            victimScreen: 'login-intercepted',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Session cookie captured!',                  type: 'warning', delay: 600 },
                { text: '[+] Set-Cookie: PHPSESSID=xyz789abc123',        type: 'data',    delay: 1100 },
                { text: '[*] Replaying session...',                      type: 'info',    delay: 1700 },
                { text: '[+] Logged into CorpBank as victim!',          type: 'success', delay: 2600 },
                { text: '[*] Capturing all page content...',             type: 'info',    delay: 3200 },
                { text: '[+] Account balance: $24,500',                  type: 'data',    delay: 4100 },
                { text: '[+] Account number: 4521-XXXX-XXXX',            type: 'data',    delay: 4400 },
                { text: '[+] Recent transactions visible',               type: 'success', delay: 4700 },
                { text: '[*] Downloading statement PDF...',              type: 'warning', delay: 5400 },
                { text: '[+] Statement downloaded',                      type: 'success', delay: 6800 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker captured your session cookie after login and replayed it. They are now logged in as you and can see your entire account. They downloaded your bank statement with full account details.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Session fixation protection and short session timeouts limit this attack window. Certificate pinning prevents SSLstrip. For you as a user VPN is the complete solution to all MitM attacks.',
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
            victimScreen: 'login-intercepted',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[+] MitM attack summary:',                     type: 'data',    delay: 400, trigger: 'compromised' },
                { text: '[+] Credentials captured: 2',                  type: 'data',    delay: 900 },
                { text: '[+] Sessions hijacked: 1',                     type: 'data',    delay: 1300 },
                { text: '[+] Bank data accessed: yes',                  type: 'data',    delay: 1700 },
                { text: '[+] Account details: stolen',                  type: 'data',    delay: 2100 },
                { text: '[+] Duration: 23 minutes',                     type: 'data',    delay: 2500 },
                { text: '[+] FULL MAN IN MIDDLE COMPLETE',              type: 'error',   delay: 3100 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'In 2015 Superfish on Lenovo laptops performed MitM on all HTTPS traffic. In 2019 a major telecoms provider was caught redirecting mobile traffic through inspection systems using identical techniques. MitM is a real ongoing threat.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Future prevention: always use VPN on public WiFi, verify HTTPS padlock always, enable HSTS in browser, use mobile data for banking, never ignore certificate warnings, check for certificate validity.',
                },
            ],
        },
    ],
};
