import { ScenarioScript } from '../lab-engine';

export const sqlStormScript: ScenarioScript = {
    id: 'sqli-01',

    victimScreens: [
        { id: 'corpbank-login', type: 'login',  url: 'http://192.168.1.100/login',            content: 'CORPBANK_LOGIN' },
        { id: 'sql-error',      type: 'browser', url: 'http://192.168.1.100/login',            content: 'SQL_ERROR' },
        { id: 'auth-bypassed',  type: 'browser', url: 'http://192.168.1.100/admin/dashboard',  content: 'AUTH_BYPASSED' },
        { id: 'db-dumping',     type: 'browser', url: 'http://192.168.1.100/admin/dump',       content: 'DB_DUMPING' },
        { id: 'compromised',    type: 'result',  url: 'http://192.168.1.100',                  content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — RECON ───────────────────────────────────────────────
        {
            id: 'recon',
            name: 'RECONNAISSANCE',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'corpbank-login',
            terminalLines: [
                { text: '══════════════════════════════════════', type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — SQL Storm',       type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════', type: 'dim',     delay: 200 },
                { text: '',                                       type: 'dim',     delay: 300 },
                { text: 'nmap -sV 192.168.1.100',               type: 'command', delay: 500 },
                { text: '[*] Scanning target...',                 type: 'info',    delay: 1200 },
                { text: 'PORT     STATE  SERVICE',               type: 'output',  delay: 1800 },
                { text: '22/tcp   open   ssh',                   type: 'data',    delay: 2100 },
                { text: '80/tcp   open   http Apache/2.4',       type: 'data',    delay: 2400 },
                { text: '3306/tcp open   mysql',                 type: 'data',    delay: 2700 },
                { text: '[+] Web application found on port 80',  type: 'success', delay: 3200 },
                { text: '[+] MySQL database on port 3306',       type: 'success', delay: 3600 },
                { text: '',                                       type: 'dim',     delay: 4000 },
                { text: 'curl http://192.168.1.100/login',       type: 'command', delay: 4300 },
                { text: '[*] Fetching login page...',            type: 'info',    delay: 5000 },
                { text: '[+] Login form found',                  type: 'success', delay: 5600 },
                { text: '[+] Parameters: username, password',    type: 'data',    delay: 5900 },
                { text: '[*] Testing for SQL injection...',      type: 'info',    delay: 6400 },
                { text: '',                                       type: 'dim',     delay: 6800 },
                { text: "python3 sqli_test.py --url http://192.168.1.100/login", type: 'command', delay: 7100 },
                { text: "[*] Injecting test payload: '",         type: 'info',    delay: 7900 },
                { text: '[!] SQL ERROR detected in response!',  type: 'warning', delay: 8500, trigger: 'sql-error' },
                { text: '[+] Target is VULNERABLE to SQL injection!', type: 'success', delay: 9000 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The attacker ran nmap to discover what services are running on your server. Finding MySQL on port 3306 tells them a database exists — a prime target.',
                },
                {
                    agent: 'mentor', type: 'lesson',
                    text: "A single quote injection test revealed a SQL error. This means your application is directly inserting user input into database queries without sanitising it — a critical vulnerability.",
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'SQL error messages are appearing on your login page. Error messages should never be shown to users — they reveal your database structure to attackers.',
                },
            ],
            nextPhase: 'sql-error',
        },

        // ── PHASE 2 — SQL ERROR ───────────────────────────────────────────
        {
            id: 'sql-error',
            name: 'SQL INJECTION CONFIRMED',
            autoPlay: false,
            progressPct: 35,
            victimScreen: 'sql-error',
            terminalLines: [
                { text: '',                                       type: 'dim',     delay: 0 },
                { text: 'sqlmap -u "http://192.168.1.100/login" --data "username=admin&password=test"', type: 'command', delay: 300 },
                { text: '[*] Testing connection...',             type: 'info',    delay: 1100 },
                { text: '[*] Testing parameter: username',       type: 'info',    delay: 1600 },
                { text: '[+] username is INJECTABLE',            type: 'success', delay: 2200 },
                { text: '[*] Database: MySQL 5.7.32',            type: 'data',    delay: 2700 },
                { text: '[*] Trying authentication bypass...',   type: 'info',    delay: 3200 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'sqlmap is an automated tool that tests every input field for SQL injection. It found your username field is injectable — meaning the attacker can control your database query directly.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Your login form is accepting malicious SQL code as input. The username field should only accept plain text — never raw SQL statements.',
                },
            ],
            decisionPoint: {
                id: 'sql-error-decision',
                question: 'You notice unusual error messages on your login page. What do you do?',
                description: 'Watch the full attack unfold to understand SQL injection completely.',
                choices: [
                    { label: '🔍 Ignore it — probably just a bug',                 safe: false, consequence: 'Attacker exploits the vulnerability' },
                    { label: '🚨 Report to IT — error messages are suspicious',    safe: true,  consequence: 'Good instinct — the scenario continues so you see the full attack' },
                ],
            },
            nextPhase: 'auth-bypass',
        },

        // ── PHASE 3 — AUTH BYPASS ─────────────────────────────────────────
        {
            id: 'auth-bypass',
            name: 'AUTHENTICATION BYPASSED',
            autoPlay: true,
            progressPct: 55,
            victimScreen: 'sql-error',
            terminalLines: [
                { text: '',                                       type: 'dim',     delay: 0 },
                { text: "[*] Attempting authentication bypass...",type: 'info',    delay: 300 },
                { text: "[*] Payload: admin'--",                 type: 'data',    delay: 800 },
                { text: '[*] Injecting into username field...',   type: 'info',    delay: 1200 },
                { text: '[+] AUTHENTICATION BYPASSED!',          type: 'success', delay: 1800, trigger: 'auth-bypassed' },
                { text: '[+] Logged in as: administrator',        type: 'success', delay: 2100 },
                { text: '[+] No password required!',             type: 'success', delay: 2400 },
                { text: '',                                       type: 'dim',     delay: 2800 },
                { text: 'sqlmap --current-user --current-db',    type: 'command', delay: 3100 },
                { text: '[+] Current user: root@localhost',      type: 'data',    delay: 3900 },
                { text: '[+] Current database: corpbank_db',     type: 'data',    delay: 4200 },
                { text: '[*] User has full database privileges!', type: 'warning', delay: 4600 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: "The payload admin'-- works by closing the SQL query early with a quote then commenting out the password check with double dash. The database never checks the password — admin access granted.",
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Authentication has been bypassed completely. The attacker is now logged into your admin dashboard without knowing any password. Parameterised queries would have prevented this entirely.',
                },
            ],
            nextPhase: 'db-dump',
        },

        // ── PHASE 4 — DB DUMP ─────────────────────────────────────────────
        {
            id: 'db-dump',
            name: 'DATABASE EXTRACTION',
            autoPlay: false,
            progressPct: 80,
            victimScreen: 'auth-bypassed',
            terminalLines: [
                { text: '',                                       type: 'dim',     delay: 0 },
                { text: 'sqlmap -u "http://192.168.1.100/login" --dump-all --batch', type: 'command', delay: 300 },
                { text: '[*] Enumerating tables...',             type: 'info',    delay: 1100 },
                { text: '[+] Tables: users, transactions, cards, employee_data, audit_logs', type: 'success', delay: 1800 },
                { text: '[*] Dumping users table...',            type: 'info',    delay: 2400, trigger: 'db-dumping' },
                { text: '[+] 10,000 rows extracted',             type: 'success', delay: 3200 },
                { text: '[*] Dumping transactions table...',     type: 'info',    delay: 3800 },
                { text: '[+] 50,000 rows extracted',             type: 'success', delay: 4600 },
                { text: '[*] Dumping cards table...',            type: 'info',    delay: 5200 },
                { text: '[+] 25,000 card numbers extracted!',    type: 'error',   delay: 6000 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: "sqlmap automatically dumped every table in your database. 25,000 credit card numbers, 10,000 user accounts and all transaction history — extracted in minutes.",
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Full database compromise detected. Immediate actions: take application offline, notify affected customers, engage incident response team and report to data protection authorities.',
                },
            ],
            decisionPoint: {
                id: 'db-dump-decision',
                question: 'The attacker now has your full database. What should have prevented this?',
                description: 'Scenario continues to show full impact and prevention steps.',
                choices: [
                    { label: '🔒 Parameterised queries in the code', safe: true,  consequence: 'Correct — this is the definitive fix' },
                    { label: '🔑 A stronger admin password',          safe: false, consequence: 'Password was never needed — SQL injection bypassed it entirely' },
                ],
            },
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
                { text: '',                                       type: 'dim',     delay: 0 },
                { text: '[+] ATTACK COMPLETE',                   type: 'error',   delay: 300 },
                { text: '[+] Data extracted:',                   type: 'data',    delay: 700 },
                { text: '    Users:        10,000 accounts',     type: 'data',    delay: 1000 },
                { text: '    Credit cards: 25,000 numbers',      type: 'data',    delay: 1300 },
                { text: '    Transactions: 50,000 records',      type: 'data',    delay: 1600 },
                { text: '',                                       type: 'dim',     delay: 1900 },
                { text: '[*] Compressing stolen data...',        type: 'info',    delay: 2200 },
                { text: '[*] Exfiltrating to attacker server...', type: 'info',   delay: 3000 },
                { text: '[+] Upload complete: corpbank_dump.sql', type: 'success', delay: 4000 },
                { text: '[+] Selling on dark web marketplace...', type: 'error',  delay: 4800 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'SQL injection is entirely preventable. Parameterised queries treat user input as data never as SQL code. One line of secure code would have stopped this entire attack.',
                },
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The 2009 Heartland Payment breach used SQL injection to steal 130 million credit card numbers — the largest breach at that time. The same technique you just saw.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'To prevent SQL injection: use parameterised queries always, implement a Web Application Firewall, never show database errors to users, run regular penetration tests, apply least privilege to database accounts.',
                },
            ],
        },
    ],
};
