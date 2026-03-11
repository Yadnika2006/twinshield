import { ScenarioScript } from '../lab-engine';

export const socialEngScript: ScenarioScript = {
    id: 'social-01',

    victimScreens: [
        { id: 'profile-view',      type: 'browser', url: 'linkedin.com',          content: 'PROFILE_VIEW' },
        { id: 'phone-ringing',     type: 'mobile',  url: 'iPhone 15',             content: 'PHONE_RINGING' },
        { id: 'conversation',      type: 'mobile',  url: 'Phone Call Transcript', content: 'CONVERSATION' },
        { id: 'credentials-given', type: 'mobile',  url: 'Phone Call Transcript', content: 'CREDENTIALS_GIVEN' },
        { id: 'compromised',       type: 'result',  url: 'VPN Gateway',           content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — OSINT ───────────────────────────────────────────────
        {
            id: 'osint',
            name: 'PUBLIC RECONNAISSANCE',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'profile-view',
            terminalLines: [
                { text: '══════════════════════════════════════',       type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — Social Engineer',       type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════',       type: 'dim',     delay: 200 },
                { text: '',                                             type: 'dim',     delay: 300 },
                { text: 'python3 osint_recon.py --target "john smith" --company "CorpBank"', type: 'command', delay: 500 },
                { text: '[*] Searching LinkedIn...',                    type: 'info',    delay: 1200 },
                { text: '[+] Name: John Smith',                         type: 'data',    delay: 2800 },
                { text: '[+] Role: IT Administrator',                   type: 'data',    delay: 3100 },
                { text: '[+] Company: CorpBank Financial',              type: 'data',    delay: 3400 },
                { text: '[+] Manager: David Chen (IT Director)',        type: 'data',    delay: 3700 },
                { text: '[+] Team: Infrastructure Team',                type: 'data',    delay: 4000 },
                { text: '[+] Skills: Active Directory, Windows Server', type: 'data',    delay: 4300 },
                { text: '[+] Recent post: "Just set up new VPN system"',type: 'warning', delay: 4800 },
                { text: '',                                             type: 'dim',     delay: 5200 },
                { text: '[*] Searching company website...',             type: 'info',    delay: 5600 },
                { text: '[+] IT helpdesk number: +91-22-XXXX-1234',     type: 'data',    delay: 6400 },
                { text: '[+] IT email: it-support@corpbank.com',        type: 'data',    delay: 6700 },
                { text: '',                                             type: 'dim',     delay: 7100 },
                { text: '[*] Searching data breach databases...',       type: 'info',    delay: 7500 },
                { text: '[+] Previous breach found: LinkedIn 2012',     type: 'error',   delay: 8800 },
                { text: '[+] Email confirmed: john.smith@corpbank.com', type: 'success', delay: 9200 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker spent 10 minutes on LinkedIn and the company website and knows your name, job title, manager\'s name, what systems you manage and your work email. This is all public information. They know enough to sound completely legitimate.',
                },
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'John\'s recent LinkedIn post about setting up a VPN system gave the attacker a perfect pretext. They will pretend to be calling about VPN issues — something John will immediately believe is plausible.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Be careful what you share on professional networks. Detailed LinkedIn profiles give attackers everything they need to build convincing impersonation attacks against you and your colleagues.',
                },
            ],
        },

        // ── PHASE 2 — CALL ────────────────────────────────────────────────
        {
            id: 'call',
            name: 'IMPERSONATION CALL',
            autoPlay: false,
            progressPct: 30,
            victimScreen: 'phone-ringing',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Attacker calling from spoofed number...',   type: 'warning', delay: 300 },
                { text: '[*] Caller ID shows: CorpBank IT Helpdesk',     type: 'error',   delay: 900 },
                { text: '[*] Number: +91-22-XXXX-1234 (spoofed)',        type: 'data',    delay: 1400 },
                { text: '[*] Ringing victim phone...',                   type: 'info',    delay: 2000, trigger: 'phone-ringing' },
                { text: '[*] Victim answers...',                         type: 'info',    delay: 3500 },
                { text: '[+] Call connected!',                           type: 'success', delay: 4200, trigger: 'conversation' },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Caller ID spoofing lets attackers display any number they choose. The victim sees the real CorpBank IT helpdesk number but the call goes to the attacker. This is legal to do in many countries and costs almost nothing with VoIP services.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Caller ID can be faked. Never trust caller ID alone to verify identity. Always hang up and call back on the official published number to verify any caller claiming to be from IT, management or your bank.',
                },
            ],
            decisionPoint: {
                id: 'social-decision',
                question: 'Your phone shows CorpBank IT Helpdesk calling. They say there is an urgent VPN issue with your account. What do you do?',
                description: 'Full social engineering attack plays out to show the complete technique.',
                choices: [
                    { label: '📞 Answer and hear what they need',                 safe: false, consequence: 'The attacker will use your trust to extract credentials' },
                    { label: '🔁 Hang up and call IT back on the official number', safe: true,  consequence: 'Correct — always verify through official channels' },
                ],
            },
            nextPhase: 'conversation',
        },

        // ── PHASE 3 — CONVERSATION ────────────────────────────────────────
        {
            id: 'conversation',
            name: 'MANIPULATION',
            autoPlay: true,
            progressPct: 55,
            victimScreen: 'conversation',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: 'ATTACKER: "Hi John, this is Mike from IT.',     type: 'warning', delay: 500 },
                { text: '  We have detected unusual activity on your',   type: 'warning', delay: 700 },
                { text: '  VPN account. Several failed login attempts',  type: 'warning', delay: 900 },
                { text: '  from an IP in Russia."',                      type: 'warning', delay: 1100 },
                { text: '',                                              type: 'dim',     delay: 1500 },
                { text: 'VICTIM: "Oh that is strange. I only use',       type: 'output',  delay: 2400 },
                { text: '  VPN from home."',                             type: 'output',  delay: 2600 },
                { text: '',                                              type: 'dim',     delay: 3000 },
                { text: 'ATTACKER: "That is why we are calling.',        type: 'warning', delay: 3500 },
                { text: '  We need to verify it is you and not an',      type: 'warning', delay: 3700 },
                { text: '  attacker. Can you confirm your employee',     type: 'warning', delay: 3900 },
                { text: '  ID?"',                                        type: 'warning', delay: 4100 },
                { text: '',                                              type: 'dim',     delay: 4500 },
                { text: 'VICTIM: "Sure it is EMP-4721"',                 type: 'output',  delay: 5200 },
                { text: '',                                              type: 'dim',     delay: 5600 },
                { text: 'ATTACKER: "Great. Now I need to verify your',   type: 'warning', delay: 6100 },
                { text: '  current VPN password to check if it has',     type: 'warning', delay: 6300 },
                { text: '  been compromised in the breach."',            type: 'warning', delay: 6500 },
                { text: '',                                              type: 'dim',     delay: 6900 },
                { text: 'VICTIM: "Is it not safer to just reset it?"',   type: 'output',  delay: 7600 },
                { text: '',                                              type: 'dim',     delay: 8000 },
                { text: 'ATTACKER: "We would normally do that but',      type: 'warning', delay: 8500 },
                { text: '  our password reset system is down for',       type: 'warning', delay: 8700 },
                { text: '  maintenance. This will only take a moment."', type: 'warning', delay: 8900 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Notice the technique: establish legitimacy first with accurate details, create urgency with the Russia login story, then ask for something small first — the employee ID — before escalating to the password. Each small compliance makes the next request feel more normal.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'IT will NEVER ask for your password over the phone. This is a universal rule in every legitimate organisation. No legitimate IT person needs your password to help you. This request alone confirms it is a scam.',
                },
            ],
            nextPhase: 'credentials',
        },

        // ── PHASE 4 — CREDENTIALS ─────────────────────────────────────────
        {
            id: 'credentials',
            name: 'PASSWORD EXTRACTION',
            autoPlay: true,
            progressPct: 80,
            victimScreen: 'conversation',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: 'ATTACKER: "I understand your concern John.',    type: 'warning', delay: 500 },
                { text: '  Let me transfer you to my supervisor to',     type: 'warning', delay: 700 },
                { text: '  explain the situation."',                     type: 'warning', delay: 900 },
                { text: '',                                              type: 'dim',     delay: 1300 },
                { text: '[HOLD MUSIC for 30 seconds]',                   type: 'info',    delay: 2000 },
                { text: '',                                              type: 'dim',     delay: 2400 },
                { text: 'ATTACKER (back): "Sorry about that. My',        type: 'warning', delay: 3500 },
                { text: '  supervisor confirmed we need the current',    type: 'warning', delay: 3700 },
                { text: '  password to complete the audit trail',        type: 'warning', delay: 3900 },
                { text: '  before resetting. It is just for our',        type: 'warning', delay: 4100 },
                { text: '  records."',                                   type: 'warning', delay: 4300 },
                { text: '',                                              type: 'dim',     delay: 4700 },
                { text: 'VICTIM: "Okay... it is VPNpass2024!"',          type: 'error',   delay: 5800, trigger: 'credentials-given' },
                { text: '',                                              type: 'dim',     delay: 6200 },
                { text: 'ATTACKER: "Perfect thank you John. We will',    type: 'warning', delay: 6800 },
                { text: '  get this sorted immediately. Have a',         type: 'warning', delay: 7000 },
                { text: '  good day."',                                  type: 'warning', delay: 7200 },
                { text: '',                                              type: 'dim',     delay: 7600 },
                { text: '[CALL ENDS]',                                   type: 'info',    delay: 8200 },
                { text: '',                                              type: 'dim',     delay: 8600 },
                { text: '[+] Credential obtained: VPNpass2024!',         type: 'success', delay: 9000 },
                { text: '[*] Logging into VPN as john.smith...',         type: 'info',    delay: 9600 },
                { text: '[+] VPN ACCESS GRANTED',                        type: 'success', delay: 10400 },
                { text: '[+] Inside CorpBank network!',                  type: 'error',   delay: 10800 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The fake hold music was a pressure tactic — making John feel he had already committed to the call and should finish what he started. The fake supervisor added false authority. John gave his password because the attacker sounded completely legitimate.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Credentials disclosed over phone call. Change your VPN password immediately. Report the social engineering attempt to IT security team. They need to know an attacker has your credentials and is inside the network.',
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
            victimScreen: 'credentials-given',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[+] Social engineering summary:',               type: 'data',    delay: 400, trigger: 'compromised' },
                { text: '[+] Time to obtain credential: 4 minutes',      type: 'data',    delay: 900 },
                { text: '[+] Technical skill required: none',            type: 'data',    delay: 1300 },
                { text: '[+] Cost to attacker: $0',                      type: 'data',    delay: 1700 },
                { text: '[+] VPN access: granted',                       type: 'error',   delay: 2100 },
                { text: '[+] Network access: full internal',             type: 'error',   delay: 2500 },
                { text: '[+] Detected by security tools: NO',            type: 'error',   delay: 2900 },
                { text: '[+] NETWORK BREACHED VIA HUMAN',                type: 'error',   delay: 3500 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'This attack required zero technical skill and cost nothing. No malware, no exploits, no hacking — just a phone call. Social engineering bypasses every technical security control because humans are always the weakest link in any system.',
                },
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'In 2019 a UK energy company CEO wired 220,000 euros to fraudsters after a call from someone using AI to clone his boss\'s voice. Social engineering is evolving with AI making it even more convincing.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Future prevention: never give passwords over phone or chat, always verify callers by calling back on official number, attend security awareness training, report all suspicious calls to IT, establish verbal verification codes with your team for sensitive requests.',
                },
            ],
        },
    ],
};
