import { ScenarioScript } from '../lab-engine';

export const ransomDropScript: ScenarioScript = {
    id: 'rnsw-01',

    victimScreens: [
        { id: 'file-explorer',  type: 'browser', url: 'C:\\Users\\john.smith\\Documents', content: 'FILE_EXPLORER' },
        { id: 'encrypting',     type: 'browser', url: 'C:\\Users\\john.smith\\Documents', content: 'ENCRYPTING' },
        { id: 'all-encrypted',  type: 'browser', url: 'C:\\Users\\john.smith\\Documents', content: 'ALL_ENCRYPTED' },
        { id: 'ransom-note',    type: 'browser', url: 'C:\\Users\\john.smith\\README_DECRYPT.txt', content: 'RANSOM_NOTE' },
        { id: 'compromised',    type: 'result',  url: 'CORP-PC01',                        content: 'COMPROMISED' },
    ],

    phases: [
        // ── PHASE 1 — DEPLOY ──────────────────────────────────────────────
        {
            id: 'deploy',
            name: 'RANSOMWARE DEPLOYED',
            autoPlay: true,
            progressPct: 15,
            victimScreen: 'file-explorer',
            terminalLines: [
                { text: '══════════════════════════════════════',                   type: 'dim',     delay: 0 },
                { text: '  ATTACKER TERMINAL — Ransom Drop',                       type: 'dim',     delay: 100 },
                { text: '══════════════════════════════════════',                   type: 'dim',     delay: 200 },
                { text: '',                                                         type: 'dim',     delay: 300 },
                { text: 'cat ransomware.py',                                        type: 'command', delay: 500 },
                { text: 'from cryptography.fernet import Fernet',                   type: 'output',  delay: 1200 },
                { text: 'import os, smtplib',                                      type: 'output',  delay: 1400 },
                { text: '',                                                         type: 'dim',     delay: 1600 },
                { text: 'key = Fernet.generate_key()',                             type: 'output',  delay: 1900 },
                { text: 'f = Fernet(key)',                                          type: 'output',  delay: 2100 },
                { text: '',                                                         type: 'dim',     delay: 2300 },
                { text: 'for root, dirs, files in os.walk(target):',               type: 'output',  delay: 2600 },
                { text: '  for file in files:',                                    type: 'output',  delay: 2800 },
                { text: '    encrypt_file(file, f)',                               type: 'output',  delay: 3000 },
                { text: "    os.rename(file, file+'.encrypted')",                  type: 'output',  delay: 3200 },
                { text: '',                                                         type: 'dim',     delay: 3400 },
                { text: 'send_key_to_server(key)',                                  type: 'output',  delay: 3700 },
                { text: 'drop_ransom_note()',                                       type: 'output',  delay: 3900 },
                { text: '',                                                         type: 'dim',     delay: 4300 },
                { text: "python3 deploy_ransom.py --target \\\\CORP-PC01\\C:\\Users\\john.smith", type: 'command', delay: 4600 },
                { text: '[*] Ransomware deployed via phishing email',               type: 'info',    delay: 5600 },
                { text: '[*] Execution triggered...',                               type: 'info',    delay: 6000 },
                { text: '[+] Encryption key generated',                             type: 'success', delay: 6600 },
                { text: '[+] Key sent to attacker server',                          type: 'success', delay: 7000 },
                { text: '[*] Beginning file encryption...',                         type: 'warning', delay: 7500, trigger: 'encrypting' },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'This ransomware uses Fernet symmetric encryption — the same type used in legitimate security systems. The key is generated on your machine then immediately sent to the attacker server. Without that key your files cannot be decrypted — ever.',
                },
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Notice the key leaves your machine before encryption starts. This is deliberate — even if you disconnect from internet immediately the key is already gone. Offline backups are the only real defence.',
                },
                {
                    agent: 'guardian', type: 'redflag',
                    text: 'Ransomware is executing on your system. The only recovery path is offline backups. Disconnect from network immediately to prevent spreading to shared drives and other network machines.',
                },
            ],
            nextPhase: 'encrypting',
        },

        // ── PHASE 2 — ENCRYPTING ──────────────────────────────────────────
        {
            id: 'encrypting',
            name: 'FILES BEING ENCRYPTED',
            autoPlay: false,
            progressPct: 35,
            victimScreen: 'encrypting',
            terminalLines: [
                { text: '',                                                         type: 'dim',     delay: 0 },
                { text: '[*] Encrypting files...',                                  type: 'warning', delay: 300 },
                { text: '[+] report_q4.docx → report_q4.docx.encrypted',           type: 'success', delay: 900 },
                { text: '[+] client_list.xlsx → client_list.xlsx.encrypted',       type: 'success', delay: 1300 },
                { text: '[+] budget_2024.pdf → budget_2024.pdf.encrypted',         type: 'success', delay: 1700 },
                { text: '[+] family_photos/ → ALL FILES ENCRYPTED',                type: 'error',   delay: 2100 },
                { text: '[+] passwords.txt → passwords.txt.encrypted',             type: 'success', delay: 2500 },
                { text: '[*] 127 files encrypted so far...',                        type: 'info',    delay: 3100 },
                { text: '[*] Scanning network drives...',                           type: 'info',    delay: 3600 },
                { text: '[+] \\\\FILESERVER01\\shared → ENCRYPTING',               type: 'error',   delay: 4300 },
                { text: '[*] 500 files encrypted...',                               type: 'info',    delay: 5100 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Files are being encrypted faster than you can react. Modern ransomware encrypts thousands of files per minute. Notice it is also spreading to network shared drives — affecting your entire organisation not just your computer.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'Files are actively being encrypted. Immediate action: power off the machine by holding the power button — do not shutdown normally. This stops encryption. Disconnect all network cables first.',
                },
            ],
            decisionPoint: {
                id: 'encrypting-decision',
                question: 'Your files are being renamed to .encrypted right now. What is your first response?',
                description: 'Full attack plays out to show complete ransomware impact.',
                choices: [
                    { label: '⚡ Hold power button — force shutdown now',  safe: true,  consequence: 'Correct — stopping execution limits the number of files encrypted' },
                    { label: '💳 Find out the ransom amount first',         safe: false, consequence: 'Every second costs more files — stop execution before anything else' },
                ],
            },
            nextPhase: 'all-encrypted',
        },

        // ── PHASE 3 — ALL ENCRYPTED ───────────────────────────────────────
        {
            id: 'all-encrypted',
            name: 'ALL FILES LOCKED',
            autoPlay: true,
            progressPct: 55,
            victimScreen: 'encrypting',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[+] Encryption complete!',                      type: 'error',   delay: 300, trigger: 'all-encrypted' },
                { text: '[+] Files encrypted: 2,847',                   type: 'data',    delay: 800 },
                { text: '[+] File types: docx xlsx pdf jpg mp4 txt',    type: 'data',    delay: 1200 },
                { text: '[+] Network files encrypted: 15,000',          type: 'data',    delay: 1600 },
                { text: '[+] Backups encrypted: YES',                    type: 'error',   delay: 2000 },
                { text: '    (online backups were accessible)',          type: 'dim',     delay: 2300 },
                { text: '[*] Dropping ransom notes...',                  type: 'info',    delay: 2800 },
                { text: '[+] README_DECRYPT.txt created in all folders', type: 'success', delay: 3500, trigger: 'ransom-note' },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'Everything is encrypted including your online backup because it was connected when ransomware ran. This is why the 3-2-1 backup rule requires one copy OFFLINE and OFFSITE — ransomware cannot encrypt what it cannot reach.',
                },
                {
                    agent: 'guardian', type: 'alert',
                    text: 'All files encrypted including connected backups. Do not pay the ransom — no guarantee of key delivery and it funds criminal operations. Restore from last known clean offline backup.',
                },
            ],
            nextPhase: 'ransom-note',
        },

        // ── PHASE 4 — RANSOM NOTE ─────────────────────────────────────────
        {
            id: 'ransom-note',
            name: 'RANSOM DEMANDED',
            autoPlay: true,
            progressPct: 80,
            victimScreen: 'ransom-note',
            terminalLines: [
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[*] Ransom note content:',                     type: 'info',    delay: 300 },
                { text: '══════════════════════════════',               type: 'dim',     delay: 700 },
                { text: 'YOUR FILES HAVE BEEN ENCRYPTED',               type: 'error',   delay: 1100 },
                { text: '',                                              type: 'dim',     delay: 1400 },
                { text: 'All your documents, photos, databases',        type: 'output',  delay: 1700 },
                { text: 'and other important files have been',          type: 'output',  delay: 1900 },
                { text: 'encrypted with military grade encryption.',    type: 'output',  delay: 2100 },
                { text: '',                                              type: 'dim',     delay: 2400 },
                { text: 'To recover your files send 0.5 Bitcoin',      type: 'warning', delay: 2700 },
                { text: '($18,500 USD) to:',                            type: 'warning', delay: 2900 },
                { text: '1A2B3C4D5E6F7G8H9I0J',                       type: 'data',    delay: 3200 },
                { text: '',                                              type: 'dim',     delay: 3500 },
                { text: 'You have 48 HOURS before the price doubles.',  type: 'error',   delay: 3800 },
                { text: 'You have 96 HOURS before files are deleted.',  type: 'error',   delay: 4200 },
                { text: '',                                              type: 'dim',     delay: 4500 },
                { text: 'Contact: decrypt@darkmail.onion',              type: 'data',    delay: 4800 },
                { text: '══════════════════════════════',               type: 'dim',     delay: 5200 },
                { text: '[*] Timer started: 48:00:00 remaining',        type: 'error',   delay: 5600 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The ransom note uses every psychological pressure tactic: urgency with the timer, fear of permanent deletion, and a seemingly reasonable first price that doubles. Bitcoin payment is untraceable — this is why cryptocurrency enabled ransomware growth.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Do NOT pay the ransom. FBI statistics show only 65 percent of victims get their files back after paying. Report to law enforcement, engage incident response team and restore from clean offline backup.',
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
                { text: '',                                              type: 'dim',     delay: 0 },
                { text: '[+] Attack summary:',                          type: 'data',    delay: 300 },
                { text: '[+] Files encrypted:   17,847',                type: 'data',    delay: 700 },
                { text: '[+] Ransom demanded:   $18,500',               type: 'data',    delay: 1000 },
                { text: '[+] Timer:             47:58:32 remaining',    type: 'error',   delay: 1300 },
                { text: '[+] Backups:           encrypted',             type: 'error',   delay: 1600 },
                { text: '[+] Network spread:    3 machines',            type: 'data',    delay: 1900 },
                { text: '[+] ORGANISATION HELD TO RANSOM',              type: 'error',   delay: 2400 },
            ],
            agentMessages: [
                {
                    agent: 'mentor', type: 'lesson',
                    text: 'The 2021 Colonial Pipeline ransomware attack shut down US East Coast fuel supply for 6 days. The company paid 4.4 million dollars. FBI later recovered 2.3 million by tracking the Bitcoin wallet. Same attack technique you just experienced.',
                },
                {
                    agent: 'guardian', type: 'prevention',
                    text: 'Future prevention: maintain offline backups using 3-2-1 rule, never run email attachments, keep all software patched, segment your network, disable macros in Office documents, train all staff to recognise suspicious files.',
                },
            ],
        },
    ],
};
