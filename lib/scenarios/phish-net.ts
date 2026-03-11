import { ScenarioScript } from '../lab-engine';

export const phishNetScript: ScenarioScript = {
    id: 'phish-01',

    victimScreens: [
        {
            id: 'inbox',
            type: 'inbox',
            url: 'mail.corpbank.internal/inbox',
            content: 'INBOX_VIEW'
        },
        {
            id: 'email-open',
            type: 'email',
            url: 'mail.corpbank.internal/inbox/msg/4721',
            content: 'EMAIL_VIEW'
        },
        {
            id: 'fake-login',
            type: 'login',
            url: 'http://c0rpbank.com/verify-account',
            content: 'FAKE_LOGIN_VIEW'
        },
        {
            id: 'compromised',
            type: 'result',
            url: 'http://c0rpbank.com/verify-account',
            content: 'COMPROMISED_VIEW'
        },
        {
            id: 'defended',
            type: 'result',
            url: 'mail.corpbank.internal/inbox',
            content: 'DEFENDED_VIEW'
        }
    ],

    phases: [
        {
            id: 'recon',
            name: 'RECONNAISSANCE',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'inbox',
            terminalLines: [
                { text: '══════════════════════════════════════', type: 'dim', delay: 0 },
                { text: '  ATTACKER TERMINAL — PhishNet Attack', type: 'dim', delay: 100 },
                { text: '══════════════════════════════════════', type: 'dim', delay: 200 },
                { text: '', type: 'dim', delay: 300 },
                { text: 'python3 osint_scraper.py --target corpbank.com', type: 'command', delay: 500 },
                { text: '[*] Scraping LinkedIn for employees...', type: 'info', delay: 1200 },
                { text: '[*] Checking company website...', type: 'info', delay: 1800 },
                { text: '[+] Found: john.smith@corpbank.com', type: 'success', delay: 2400 },
                { text: '    Role: IT Administrator', type: 'data', delay: 2700 },
                { text: '[+] Found: sarah.jones@corpbank.com', type: 'success', delay: 3000 },
                { text: '    Role: HR Manager', type: 'data', delay: 3300 },
                { text: '', type: 'dim', delay: 3600 },
                { text: 'python3 craft_email.py --target john.smith@corpbank.com', type: 'command', delay: 4000 },
                { text: '[*] Loading urgency template...', type: 'info', delay: 4800 },
                { text: '[*] Spoofing sender: it-security@c0rpbank.com', type: 'warning', delay: 5400 },
                { text: '    ^ zero (0) not letter O — typosquat', type: 'dim', delay: 5800 },
                { text: '[*] Embedding tracking pixel...', type: 'info', delay: 6200 },
                { text: '[*] Setting Reply-To: attacker@protonmail.com', type: 'warning', delay: 6700 },
                { text: '[+] Phishing email crafted successfully', type: 'success', delay: 7200 },
                { text: '', type: 'dim', delay: 7500 },
                { text: 'python3 send_phish.py --to john.smith@corpbank.com', type: 'command', delay: 7800 },
                { text: '[+] Email delivered to victim inbox', type: 'success', delay: 8600 },
                { text: '[*] Harvest server running on port 8080', type: 'info', delay: 9000 },
                { text: '[*] Waiting for victim to open email...', type: 'dim', delay: 9400 }
            ],
            agentMessages: [
                {
                    agent: 'mentor',
                    type: 'lesson',
                    text: 'The attacker started with OSINT — Open Source Intelligence. They collected your name, email and job title from LinkedIn and your company website. All public information. This is how they make the attack feel personal.'
                },
                {
                    agent: 'mentor',
                    type: 'lesson',
                    text: 'Notice the sender domain: c0rpbank.com uses a zero instead of the letter O. This is called a typosquat domain — registered specifically to deceive. Most people miss this under pressure.'
                },
                {
                    agent: 'guardian',
                    type: 'redflag',
                    text: 'A phishing email just landed in your inbox. Before opening it check: Is the sender domain exactly correct? Were you expecting this email? Does the subject create panic or urgency?'
                }
            ]
        },

        {
            id: 'email-opened',
            name: 'EMAIL OPENED',
            autoPlay: false,
            progressPct: 35,
            victimScreen: 'email-open',
            terminalLines: [
                { text: '', type: 'dim', delay: 0 },
                { text: '[!] VICTIM OPENED THE EMAIL!', type: 'warning', delay: 300 },
                { text: '[*] Tracking pixel fired successfully', type: 'success', delay: 800 },
                { text: '[+] Victim IP captured: 192.168.1.45', type: 'data', delay: 1200 },
                { text: '[+] Device: Windows 11 Chrome/120.0', type: 'data', delay: 1500 },
                { text: '[+] Location: Mumbai, Maharashtra, IN', type: 'data', delay: 1800 },
                { text: '[*] Timestamp: ' + new Date().toLocaleTimeString(), type: 'data', delay: 2100 },
                { text: '', type: 'dim', delay: 2400 },
                { text: '[*] Monitoring for link click...', type: 'dim', delay: 2700 }
            ],
            agentMessages: [
                {
                    agent: 'mentor',
                    type: 'lesson',
                    text: 'You just opened the email and the attacker was instantly notified. A tracking pixel — a tiny invisible image — fired and sent your IP address, device type and location to the attacker. This happened before you clicked anything.'
                },
                {
                    agent: 'guardian',
                    type: 'redflag',
                    text: 'Red flags in this email: sender is c0rpbank.com not corpbank.com — Reply-To is a completely different address — urgent threatening language throughout — no personalised greeting.'
                }
            ],
            decisionPoint: {
                id: 'open-link',
                question: 'The email asks you to verify your account urgently. What do you do?',
                description: 'You will see what happens either way — the full attack will play out so you can learn from it.',
                choices: [
                    {
                        label: '🔗 Click the verification link',
                        safe: false,
                        consequence: 'You click the link and land on the fake login page'
                    },
                    {
                        label: '📞 Call IT department to verify',
                        safe: true,
                        consequence: 'Smart choice — but the scenario continues so you can see the full attack'
                    }
                ]
            },
            nextPhase: 'fake-site'
        },

        {
            id: 'fake-site',
            name: 'FAKE SITE LOADED',
            autoPlay: true,
            progressPct: 55,
            victimScreen: 'fake-login',
            terminalLines: [
                { text: '', type: 'dim', delay: 0 },
                { text: '[!] VICTIM CLICKED THE LINK!', type: 'warning', delay: 300 },
                { text: '[*] Redirecting to fake login page...', type: 'info', delay: 700 },
                { text: '[+] Victim loaded: c0rpbank.com/verify-account', type: 'success', delay: 1200 },
                { text: '[*] Fake page identical to real corpbank.com', type: 'dim', delay: 1600 },
                { text: '[*] SSL certificate active — shows padlock', type: 'dim', delay: 2000 },
                { text: '[*] Victim sees no visible warning signs', type: 'dim', delay: 2400 },
                { text: '[*] Waiting for credential submission...', type: 'dim', delay: 2800 }
            ],
            agentMessages: [
                {
                    agent: 'mentor',
                    type: 'lesson',
                    text: 'The fake site has a valid SSL certificate — which is why it shows a padlock. Attackers get free SSL certs from services like LetsEncrypt. The padlock only means the connection is encrypted — not that the site is legitimate.'
                },
                {
                    agent: 'guardian',
                    type: 'alert',
                    text: 'DANGER: You are on an attacker controlled server. The URL shows c0rpbank.com not corpbank.com. Do not enter any credentials. Close this tab immediately and navigate to the real site manually.'
                }
            ],
            nextPhase: 'credentials-entered'
        },

        {
            id: 'credentials-entered',
            name: 'CREDENTIALS STOLEN',
            autoPlay: false,
            progressPct: 80,
            victimScreen: 'fake-login',
            terminalLines: [],
            agentMessages: [],
            decisionPoint: {
                id: 'enter-creds',
                question: 'The fake CorpBank login page asks for your email and password. What do you do?',
                description: 'The full attack will play out either way so you can see the consequences.',
                choices: [
                    {
                        label: '🔑 Enter my email and password',
                        safe: false,
                        consequence: 'Your credentials are sent directly to the attacker'
                    },
                    {
                        label: '🔎 The URL looks wrong — close this tab',
                        safe: true,
                        consequence: 'Good observation — but scenario continues to show full attack'
                    }
                ]
            },
            nextPhase: 'compromised'
        },

        {
            id: 'compromised',
            name: 'ATTACK COMPLETE',
            autoPlay: true,
            progressPct: 100,
            victimScreen: 'compromised',
            terminalLines: [
                { text: '', type: 'dim', delay: 0 },
                { text: '[!!!] CREDENTIALS RECEIVED!', type: 'error', delay: 300 },
                { text: '', type: 'dim', delay: 500 },
                { text: 'cat credentials.txt', type: 'command', delay: 700 },
                { text: '', type: 'dim', delay: 1300 },
                { text: '  email    : john.smith@corpbank.com', type: 'data', delay: 1500 },
                { text: '  password : CorpBank2024!', type: 'data', delay: 1700 },
                { text: '  ip_addr  : 192.168.1.45', type: 'data', delay: 1900 },
                { text: '  captured : ' + new Date().toLocaleTimeString(), type: 'data', delay: 2100 },
                { text: '', type: 'dim', delay: 2300 },
                { text: 'python3 credential_spray.py --creds credentials.txt', type: 'command', delay: 2600 },
                { text: '[*] Trying Gmail...', type: 'info', delay: 3400 },
                { text: '[+] Gmail: LOGIN SUCCESS — password reused!', type: 'success', delay: 4000 },
                { text: '[*] Trying LinkedIn...', type: 'info', delay: 4400 },
                { text: '[+] LinkedIn: LOGIN SUCCESS!', type: 'success', delay: 4900 },
                { text: '[*] Trying Netflix...', type: 'info', delay: 5200 },
                { text: '[+] Netflix: LOGIN SUCCESS!', type: 'success', delay: 5700 },
                { text: '', type: 'dim', delay: 6000 },
                { text: '[+] Accounts compromised: 4', type: 'error', delay: 6300 },
                { text: '[+] ATTACK COMPLETE 💀', type: 'error', delay: 6700 }
            ],
            agentMessages: [
                {
                    agent: 'mentor',
                    type: 'lesson',
                    text: 'Your credentials were stolen. Notice what happened next — the attacker tried your password on Gmail, LinkedIn and Netflix. This is credential stuffing. If you reuse passwords one breach compromises all your accounts.'
                },
                {
                    agent: 'mentor',
                    type: 'lesson',
                    text: 'Real world stat: 91% of cyberattacks start with phishing. The 2020 Twitter hack compromising Obama, Elon Musk and Apple started with one phishing email to a single Twitter employee.'
                },
                {
                    agent: 'guardian',
                    type: 'alert',
                    text: 'Your account has been compromised. Immediate actions required: Change your CorpBank password now — Change password on all sites using the same password — Enable 2FA on all accounts — Report to IT security team — Check bank statements for suspicious activity.'
                },
                {
                    agent: 'guardian',
                    type: 'prevention',
                    text: 'Future prevention: Use a password manager for unique passwords on every site — Enable 2FA so stolen passwords alone cannot login — Always verify URLs before entering credentials — When in doubt call IT directly — never click email links.'
                }
            ]
        }
    ]
};
