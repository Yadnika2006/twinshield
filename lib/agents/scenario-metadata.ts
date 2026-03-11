export interface ScenarioMeta {
    name: string;
    attackType: string;
    redFlags: string[];
}

export const scenarioMeta: Record<string, ScenarioMeta> = {
    'phish-01': {
        name: 'PhishNet',
        attackType: 'Phishing via typosquatted email',
        redFlags: [
            'Sender domain uses zero not letter O',
            'Reply-To address differs from sender',
            'Urgency language creating time pressure',
            'Link destination differs from display text',
            'Credentials requested via email link'
        ]
    },
    'weakpass-01': {
        name: 'WeakPass',
        attackType: 'SSH brute force password attack',
        redFlags: [
            'SSH exposed on port 22 to internet',
            'No rate limiting on login attempts',
            'Weak predictable password pattern used',
            'Default admin username in use',
            'No 2FA on administrative SSH access'
        ]
    },
    'sqli-01': {
        name: 'SQLStorm',
        attackType: 'SQL injection authentication bypass',
        redFlags: [
            'SQL error messages visible to users',
            'User input inserted directly into query',
            'Database errors reveal query structure',
            'No Web Application Firewall in place',
            'Database account has excessive privileges'
        ]
    },
    'brute-01': {
        name: 'BruteX',
        attackType: 'Web login form brute force',
        redFlags: [
            'No CAPTCHA on login form',
            'No account lockout policy configured',
            'No rate limiting per IP address',
            'Common password found in rockyou list',
            'No 2FA enabled on account'
        ]
    },
    'xss-01': {
        name: 'XSSploit',
        attackType: 'Cross site scripting cookie theft',
        redFlags: [
            'User input reflected without sanitisation',
            'No Content Security Policy header set',
            'Session cookie missing HttpOnly flag',
            'Script tags accepted in input fields',
            'No output encoding on user content'
        ]
    },
    'klog-01': {
        name: 'KeyLogger',
        attackType: 'Keylogger malware credential theft',
        redFlags: [
            'Unknown process in startup registry',
            'svchost running from non-system32 path',
            'Unusual outbound SMTP connections',
            'No endpoint detection tool installed',
            'Passwords typed instead of autofilled'
        ]
    },
    'fakeap-01': {
        name: 'FakeAP',
        attackType: 'Rogue WiFi access point SSLstrip',
        redFlags: [
            'Two networks with identical SSID visible',
            'HTTPS padlock missing from URL bar',
            'Unexpected WiFi disconnection occurred',
            'Network gateway IP changed unexpectedly',
            'No VPN active on public network'
        ]
    },
    'sess-01': {
        name: 'SessHijack',
        attackType: 'Session hijacking via XSS theft',
        redFlags: [
            'Session cookie missing HttpOnly flag',
            'Session cookie missing Secure flag',
            'User generated content not sanitised',
            'Unexpected session expiry occurring',
            'Concurrent login from different IP detected'
        ]
    },
    'mitm-01': {
        name: 'MitM Cafe',
        attackType: 'Man in the middle ARP poisoning',
        redFlags: [
            'Using public WiFi without VPN active',
            'HTTPS padlock disappeared from browser',
            'SSL certificate warning appeared',
            'Unexpected network disconnection',
            'Login page switched from HTTPS to HTTP'
        ]
    },
    'rnsw-01': {
        name: 'RansomDrop',
        attackType: 'Ransomware via email attachment',
        redFlags: [
            'Executable file received via email',
            'File extensions changing to encrypted',
            'Unusual high CPU and disk activity',
            'Online backups being modified rapidly',
            'Unknown process accessing all user files'
        ]
    },
    'spy-01': {
        name: 'SpyAgent',
        attackType: 'Spyware screenshot webcam capture',
        redFlags: [
            'Unknown process disguised as svchost',
            'Webcam indicator light activating alone',
            'Unusual outbound data transfers detected',
            'Process in startup from unknown path',
            'High network usage with no downloads'
        ]
    },
    'usb-01': {
        name: 'USBdrop',
        attackType: 'USB drop attack autorun payload',
        redFlags: [
            'Unknown USB drive found in workplace',
            'AutoPlay appeared after USB insertion',
            'Executable offered via AutoPlay prompt',
            'Unknown process connecting outbound',
            'Domain admin credentials found in memory'
        ]
    },
    'dos-01': {
        name: 'NetFlood',
        attackType: 'DDoS SYN flood and Slowloris',
        redFlags: [
            'Massive traffic spike from many IPs',
            'CPU and memory at 100 percent',
            'Connection table completely exhausted',
            'Response times climbing exponentially',
            'Legitimate users receiving 503 errors'
        ]
    },
    'social-01': {
        name: 'SocialEng',
        attackType: 'Social engineering phone impersonation',
        redFlags: [
            'Caller requesting password over phone',
            'Urgency created about account compromise',
            'Caller knows personal LinkedIn details',
            'Request to bypass normal IT procedures',
            'Caller ID cannot be independently verified'
        ]
    },
    'malware-01': {
        name: 'MalwareDrop',
        attackType: 'Malware delivery email attachment',
        redFlags: [
            'Software update delivered via email',
            'Executable file in email attachment',
            'Outbound connection to unknown IP',
            'Fake installer showing progress bar',
            'Process adding itself to startup registry'
        ]
    }
};
