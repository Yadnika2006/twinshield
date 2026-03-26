import { ScenarioScript } from '../lab-engine';

export const netFloodScript: ScenarioScript = {
    id: 'dos-01',

    victimScreens: [
        { id: 'server-dashboard',  type: 'browser', url: 'corpbank.internal/metrics', content: 'SERVER_DASHBOARD' },
        { id: 'traffic-spiking',   type: 'browser', url: 'corpbank.internal/metrics', content: 'TRAFFIC_SPIKING' },
        { id: 'server-struggling', type: 'browser', url: 'corpbank.internal/metrics', content: 'SERVER_STRUGGLING' },
        { id: 'server-down',       type: 'browser', url: 'corpbank.com',              content: 'SERVER_DOWN' },
        { id: 'compromised',       type: 'result',  url: 'corpbank.com',              content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — SYN FLOOD ───────────────────────────────────────────
        {
            id: 'syn-flood',
            name: 'BOTNET ATTACK',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'server-dashboard',
            terminalLines: [
                { text: '══════════════════════════════════════',       type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — Distributed DoS',       type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════',       type: 'dim',     delay: 200 },
                { text: '',                                             type: 'dim',     delay: 300 },
                { text: '[*] Target: corpbank.com',                     type: 'info',    delay: 500 },
                { text: '[*] Gathering 10,000 bot network IPs...',      type: 'info',    delay: 1200 },
                { text: '[+] Botnet ready: 10,000 infected machines',   type: 'success', delay: 2800 },
                { text: '',                                             type: 'dim',     delay: 3200 },
                { text: 'hping3 -S --flood -V -p 80 corpbank.com',      type: 'command', delay: 3800 },
                { text: '[*] SYN flood starting...',                    type: 'warning', delay: 4200 },
                { text: '[*] Sending 50,000 packets/second',            type: 'warning', delay: 4500 },
                { text: '[*] Source IPs spoofed — untraceable',         type: 'info',    delay: 4900 },
                { text: '[+] Packets sent: 100,000',                    type: 'data',    delay: 5800 },
                { text: '[+] Packets sent: 500,000',                    type: 'data',    delay: 6400 },
                { text: '[+] Packets sent: 1,000,000',                  type: 'data',    delay: 7000 },
                { text: '[*] Server connection table filling...',       type: 'warning', delay: 8200 },
                { text: '[+] Packets sent: 5,000,000',                  type: 'data',    delay: 8800 },
                { text: '[*] Server beginning to struggle...',          type: 'error',   delay: 9600, trigger: 'traffic-spiking' },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'A SYN flood exploits the TCP handshake. For every SYN packet the server allocates memory waiting for a response that never comes. 50,000 packets per second fills the connection table — leaving no room for legitimate user connections.',
                },
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker is using a botnet — 10,000 compromised computers worldwide sending packets simultaneously. Source IPs are spoofed making it impossible to simply block the attacking IP. You need upstream filtering to absorb this volume.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Massive traffic spike detected from multiple IP addresses simultaneously. This is a DDoS attack signature. Contact your hosting provider and CDN provider immediately to enable DDoS mitigation and traffic scrubbing.',
                },
            ],
            nextPhase: 'slowloris',
        },

        // ── PHASE 2 — SLOWLORIS ───────────────────────────────────────────
        {
            id: 'slowloris',
            name: 'APPLICATION FLOOD',
            autoPlay: false,
            progressPct: 35,
            victimScreen: 'traffic-spiking',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Adding Slowloris layer attack...',          type: 'info',    delay: 300 },
                { text: 'python3 slowloris.py corpbank.com --sockets 500 --sleeptime 15', type: 'command', delay: 900 },
                { text: '[*] Opening 500 partial connections...',        type: 'warning', delay: 1800 },
                { text: '[+] Connection 1: open (partial header sent)',  type: 'data',    delay: 2400 },
                { text: '[+] Connection 2: open (partial header sent)',  type: 'data',    delay: 2500 },
                { text: '[+] Connection 3: open (partial header sent)',  type: 'data',    delay: 2600 },
                { text: '[*] Sending partial headers every 15s...',      type: 'info',    delay: 3400 },
                { text: '[*] Keeping connections alive but incomplete',  type: 'warning', delay: 4200 },
                { text: '[*] 500/500 server connections occupied',       type: 'error',   delay: 5100 },
                { text: '[*] No connections left for real users',        type: 'error',   delay: 5800 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Slowloris is the opposite of a SYN flood. It opens real connections but sends headers so slowly the server waits forever. With only 500 connections and a slow internet line it can take down a server that handles millions of normal requests per day.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Application layer attack detected. Slowloris uses very little bandwidth making it hard to detect with simple traffic monitoring. Connection timeouts and limits per IP address stop this attack completely.',
                },
            ],
            decisionPoint: {
                id: 'flood-decision',
                question: 'Your server is receiving millions of requests and becoming unresponsive. What is your first response?',
                description: 'Full attack plays out to show complete server takedown.',
                choices: [
                    { label: '☁️ Enable CDN DDoS protection immediately', safe: true,  consequence: 'Correct — Cloudflare or AWS Shield absorbs attack traffic upstream' },
                    { label: '🔄 Restart the server',                      safe: false, consequence: 'Attack continues immediately after restart — no impact on attacker' },
                ],
            },
            nextPhase: 'struggling',
        },

        // ── PHASE 3 — STRUGGLING ──────────────────────────────────────────
        {
            id: 'struggling',
            name: 'RESOURCE EXHAUSTION',
            autoPlay: true,
            progressPct: 55,
            victimScreen: 'traffic-spiking',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Server metrics deteriorating...',           type: 'warning', delay: 500 },
                { text: '[+] CPU: 100%',                                 type: 'error',   delay: 1100 },
                { text: '[+] Memory: 98%',                               type: 'error',   delay: 1500 },
                { text: '[+] Connections: 500/500 (maxed)',              type: 'error',   delay: 1900 },
                { text: '[+] Response time: 45,000ms',                   type: 'error',   delay: 2400 },
                { text: '[+] Legitimate requests: timing out',           type: 'data',    delay: 3100 },
                { text: '[+] Error rate: 87%',                           type: 'error',   delay: 3600, trigger: 'server-struggling' },
                { text: '[*] Server on the edge of failure...',          type: 'error',   delay: 4400 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The server is at 100 percent resource usage. Every CPU cycle and memory block is handling attack traffic. Real customers trying to access CorpBank are getting timeouts. For a bank this means customers cannot access their money — direct financial and reputational damage.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Server resources exhausted. Enable rate limiting immediately — limit connections per IP to 10 per second. Contact CDN provider for traffic scrubbing. Scale up server capacity if cloud hosted.',
                },
            ],
            nextPhase: 'server-down',
        },

        // ── PHASE 4 — SERVER DOWN ─────────────────────────────────────────
        {
            id: 'server-down',
            name: 'SERVICE OFFLINE',
            autoPlay: true,
            progressPct: 80,
            victimScreen: 'server-struggling',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[+] Server returning 503 Service Unavailable',  type: 'error',   delay: 1200, trigger: 'server-down' },
                { text: '[+] corpbank.com: UNREACHABLE',                 type: 'error',   delay: 2800 },
                { text: '[+] All customer requests: FAILING',            type: 'data',    delay: 3400 },
                { text: '[*] Attack sustained for: 47 minutes',          type: 'info',    delay: 4200 },
                { text: '[*] Estimated customers affected: 50,000',      type: 'warning', delay: 4700 },
                { text: '[*] Estimated financial loss: $2,000/minute',   type: 'warning', delay: 5200 },
                { text: '[+] Server: OFFLINE',                           type: 'error',   delay: 6000 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'CorpBank is completely offline. 50,000 customers cannot access their accounts. At 2,000 dollars per minute in lost transactions plus regulatory fines for service unavailability the cost of not having DDoS protection is enormous.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'DDoS response checklist: enable CDN protection, contact ISP for upstream filtering, implement rate limiting, use auto-scaling on cloud infrastructure, activate incident response plan, communicate with customers via social media.',
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
            victimScreen: 'server-down',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[+] DDoS attack summary:',                     type: 'data',    delay: 400, trigger: 'compromised' },
                { text: '[+] Duration: 47 minutes',                     type: 'data',    delay: 900 },
                { text: '[+] Peak traffic: 50,000 req/sec',             type: 'data',    delay: 1300 },
                { text: '[+] Customers affected: 50,000',               type: 'data',    delay: 1700 },
                { text: '[+] Downtime cost: $94,000',                   type: 'error',   delay: 2100 },
                { text: '[+] Regulatory fine risk: significant',        type: 'warning', delay: 2500 },
                { text: '[+] SERVICE COMPLETELY UNAVAILABLE',           type: 'error',   delay: 3100 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'In 2016 the Mirai botnet generated 1.2 terabits per second taking down Twitter Netflix and Reddit for hours. In 2020 AWS absorbed the largest ever DDoS at 2.3 terabits per second. DDoS attacks grow larger every year.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Future prevention: use Cloudflare or AWS Shield Always-On DDoS protection, implement rate limiting on all endpoints, use auto-scaling cloud infrastructure, maintain DDoS incident response plan, test defences with regular load testing.',
                },
            ],
        },
    ],
};
