import { ScenarioScript } from '../lab-engine';

export const fakeApScript: ScenarioScript = {
    id: 'fakeap-01',

    victimScreens: [
        { id: 'wifi-list',       type: 'mobile', url: 'iPhone 15', content: 'WIFI_LIST' },
        { id: 'connected-fake',  type: 'mobile', url: 'iPhone 15', content: 'CONNECTED_FAKE' },
        { id: 'traffic-routed',  type: 'mobile', url: 'iPhone 15', content: 'TRAFFIC_ROUTED' },
        { id: 'creds-stolen',    type: 'browser',url: 'iPhone 15', content: 'CREDS_STOLEN' },
        { id: 'compromised',     type: 'result', url: 'iPhone 15', content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — SETUP ───────────────────────────────────────────────
        {
            id: 'setup',
            name: 'ROGUE AP CREATED',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'wifi-list',
            terminalLines: [
                { text: '══════════════════════════════════════',       type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — Evil Twin',             type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════',       type: 'dim',     delay: 200 },
                { text: '',                                             type: 'dim',     delay: 300 },
                { text: 'hostapd fake-ap.conf',                        type: 'command', delay: 500 },
                { text: '[*] Loading configuration...',                 type: 'info',    delay: 1200 },
                { text: '[*] SSID: CorpBank-WiFi',                      type: 'data',    delay: 1400 },
                { text: '[*] Channel: 6',                               type: 'data',    delay: 1600 },
                { text: '[*] Mode: Open (no password)',                 type: 'warning', delay: 1800 },
                { text: '[+] Fake access point started!',              type: 'success', delay: 2400 },
                { text: '[+] Broadcasting: CorpBank-WiFi',             type: 'success', delay: 2700 },
                { text: '',                                             type: 'dim',     delay: 3100 },
                { text: 'dnsmasq --conf-file=dnsmasq.conf',            type: 'command', delay: 3500 },
                { text: '[+] DHCP server running',                     type: 'success', delay: 4200 },
                { text: '[+] Assigning IPs to connecting clients',     type: 'info',    delay: 4500 },
                { text: '[+] DNS requests routing through attacker',   type: 'info',    delay: 4800 },
                { text: '',                                             type: 'dim',     delay: 5200 },
                { text: 'airmon-ng start wlan0',                       type: 'command', delay: 5600 },
                { text: '[+] Monitor mode enabled',                    type: 'success', delay: 6300 },
                { text: '[*] Watching for devices to connect...',       type: 'warning', delay: 6800 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker created a WiFi hotspot with the same name as your office network — CorpBank-WiFi. Your device is configured to auto-connect to known networks by name. It cannot tell the difference between the real and fake access point.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Two networks with identical names are visible. Your device will connect to whichever signal is stronger. Disable auto-connect to WiFi on all devices. Always verify with staff before connecting to workplace networks.',
                },
            ],
        },

        // ── PHASE 2 — DEAUTH ──────────────────────────────────────────────
        {
            id: 'deauth',
            name: 'FORCED RECONNECTION',
            autoPlay: false,
            progressPct: 30,
            victimScreen: 'wifi-list',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: 'aireplay-ng -0 10 -a D4:CA:6D:E1:92 -c F8:E0:79:AB:45 wlan0', type: 'command', delay: 300 },
                { text: '[*] Sending deauth packets...',                 type: 'warning', delay: 1000 },
                { text: '[*] Disconnecting victim from real network...', type: 'info',    delay: 1400 },
                { text: '[+] Victim disconnected!',                      type: 'success', delay: 2200 },
                { text: '[*] Victim device searching for network...',    type: 'info',    delay: 2600 },
                { text: '[*] Auto-connecting to strongest signal...',    type: 'info',    delay: 3000 },
                { text: '[+] Victim connected to FAKE AP!',              type: 'error',   delay: 3800, trigger: 'connected-fake' },
                { text: '[+] Victim IP: 192.168.1.45',                   type: 'data',    delay: 4100 },
                { text: '[*] All traffic now routed through attacker',   type: 'warning', delay: 4500 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'aireplay-ng sent deauthentication packets forcing your device off the real network. Your device automatically reconnected to the strongest CorpBank-WiFi signal — which is the fake one. This happened without any action from you.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Your device was forcibly disconnected and reconnected to a rogue access point. When you reconnect to WiFi after an unexpected disconnection always verify the network before using it for sensitive activity.',
                },
            ],
            decisionPoint: {
                id: 'wifi-decision',
                question: 'Your WiFi briefly disconnected then reconnected automatically. What should you do before continuing work?',
                description: 'Full attack plays out to show traffic interception in action.',
                choices: [
                    { label: '✅ Verify network with IT before continuing', safe: true,  consequence: 'Correct — unexpected reconnects can indicate a rogue AP attack' },
                    { label: '💻 Continue working — it reconnected fine',    safe: false, consequence: 'You are now on an attacker controlled network — all traffic exposed' },
                ],
            },
            nextPhase: 'intercept',
        },

        // ── PHASE 3 — INTERCEPT ───────────────────────────────────────────
        {
            id: 'intercept',
            name: 'TRAFFIC INTERCEPTION',
            autoPlay: true,
            progressPct: 55,
            victimScreen: 'traffic-routed',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: 'arpspoof -i wlan0 -t 192.168.1.45 192.168.1.1', type: 'command', delay: 500 },
                { text: '[+] ARP poisoning active',                      type: 'success', delay: 1300 },
                { text: '[+] Victim traffic routing through attacker',   type: 'warning', delay: 1600 },
                { text: '',                                              type: 'dim',     delay: 2000 },
                { text: 'sslstrip -l 8080',                              type: 'command', delay: 2400 },
                { text: '[+] SSLstrip running on port 8080',             type: 'success', delay: 3100 },
                { text: '[*] Downgrading HTTPS to HTTP...',              type: 'info',    delay: 3600 },
                { text: '[+] corpbank.com → HTTP (padlock gone)',       type: 'error',   delay: 4100 },
                { text: '[+] gmail.com → HTTP (padlock gone)',          type: 'error',   delay: 4400 },
                { text: '[*] All traffic now readable in plaintext',     type: 'warning', delay: 4900 },
                { text: '',                                              type: 'dim',     delay: 5300 },
                { text: 'tcpdump -i wlan0 -w capture.pcap',              type: 'command', delay: 5700 },
                { text: '[*] Capturing all packets...',                  type: 'info',    delay: 6400 },
                { text: '[+] HTTP traffic visible in plaintext',         type: 'error',   delay: 6800 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'SSLstrip is downgrading your HTTPS connections to HTTP. The padlock disappears from your browser. Most users do not notice this change and continue entering credentials on what they think is a secure connection.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'HTTPS connections are being stripped to HTTP. Check your browser URL bar — the padlock should always be present on banking and login pages. If missing do not enter any credentials.',
                },
            ],
            nextPhase: 'steal-creds',
        },

        // ── PHASE 4 — STEAL CREDS ─────────────────────────────────────────
        {
            id: 'steal-creds',
            name: 'CREDENTIALS STOLEN',
            autoPlay: true,
            progressPct: 80,
            victimScreen: 'traffic-routed',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Monitoring HTTP traffic...',                type: 'info',    delay: 500, trigger: 'creds-stolen' },
                { text: '[+] POST request intercepted!',                 type: 'error',   delay: 2400 },
                { text: '[+] Host: corpbank.com',                        type: 'data',    delay: 2700 },
                { text: '[+] URL: /login',                               type: 'data',    delay: 2900 },
                { text: '[+] Data: username=john.smith@corpbank.com',    type: 'warning', delay: 3200 },
                { text: '          &password=CorpBank2024!',             type: 'warning', delay: 3400 },
                { text: '[+] CREDENTIALS CAPTURED IN PLAINTEXT!',        type: 'error',   delay: 3900 },
                { text: '',                                              type: 'dim',     delay: 4300 },
                { text: '[+] POST request intercepted!',                 type: 'error',   delay: 5100 },
                { text: '[+] Host: gmail.com',                           type: 'data',    delay: 5300 },
                { text: '[+] Data: email=johnsmith90@gmail.com',         type: 'warning', delay: 5600 },
                { text: '          &password=MyGmailPass123',            type: 'warning', delay: 5800 },
                { text: '[+] Gmail credentials captured!',               type: 'error',   delay: 6300 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Your login credentials appeared in the attacker terminal in plain text because the HTTPS encryption was stripped. A VPN encrypts all traffic end to end making this entire attack useless — the attacker sees only encrypted data.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Credentials intercepted over unencrypted connection. Change CorpBank and Gmail passwords immediately from a safe network. Enable 2FA. Use a VPN on all public and untrusted WiFi networks going forward.',
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
            victimScreen: 'creds-stolen',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[+] Session summary:',                          type: 'data',    delay: 400, trigger: 'compromised' },
                { text: '[+] Credentials captured: 3',                  type: 'data',    delay: 900 },
                { text: '[+] HTTP sessions hijacked: 2',                type: 'data',    delay: 1300 },
                { text: '[+] DNS queries logged: 847',                  type: 'data',    delay: 1700 },
                { text: '[+] Data captured: 124 MB',                    type: 'data',    delay: 2100 },
                { text: '[+] Duration: 47 minutes',                     type: 'data',    delay: 2500 },
                { text: '[+] FULL TRAFFIC INTERCEPTION COMPLETE',       type: 'error',   delay: 3100 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'In 2017 Superfish adware pre-installed on Lenovo laptops performed MitM attacks on all HTTPS traffic including banking sites — affecting millions of users without their knowledge. Same technique different scale.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Future prevention: always use VPN on public and untrusted WiFi, verify HTTPS padlock before entering credentials, disable WiFi auto-connect on devices, use mobile data for sensitive activity, never ignore SSL certificate warnings.',
                },
            ],
        },
    ],
};
