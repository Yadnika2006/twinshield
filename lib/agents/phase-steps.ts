/**
 * Phase-to-Step Mapping
 * Defines specific, instructional steps for each scenario phase.
 * Steps are shown sequentially as the user progresses through phases.
 */

export const phaseStepMap: Record<string, Record<string, string>> = {
  'phish-01': {
    recon: 'Step 1: Watch the attacker scan for employee information and craft a phishing email.',
    craft: 'Step 2: Observe the fake email being prepared with a malicious link.',
    'email-sent': 'Step 3: Check your inbox for a suspicious email from noreply@paypa1-secure.biz.',
    'email-open': 'Step 4: Click "Open Email" to read and inspect the sender, subject, and embedded link carefully.',
    'link-click': 'Step 5: Click the link only when you understand it leads to a fake login page.',
    'fake-login': 'Step 6: Enter your credentials (if prompted) and submit the login form.',
    'compromised': 'Step 7: Watch as your credentials are captured and the attacker gains access to your account.',
  },

  'sqli-01': {
    recon: 'Step 1: Observe the attacker scanning the website for SQL injection vulnerabilities.',
    inject: 'Step 2: Watch the attacker test the search field with SQL payloads.',
    'sql-error': 'Step 3: Click "Attempt Login" to submit a malicious SQL query to the database.',
    'auth-bypass': 'Step 4: See the attacker bypass authentication by injecting SQL code.',
    'db-dump': 'Step 5: Watch as the attacker extracts sensitive data from the database.',
    'compromised': 'Step 6: Observe the attacker exfiltrating customer and credential records.',
  },

  'brute-01': {
    recon: 'Step 1: Watch the attacker enumerate SSH services on the network.',
    'brute-force': 'Step 2: Click "Connect SSH" to observe brute force attempts on the login.',
    'auth-bypass': 'Step 3: Watch as the attacker tries multiple username/password combinations.',
    'shell-access': 'Step 4: See the attacker gain shell access after cracking the password.',
    'compromised': 'Step 5: Observe the attacker executing commands on the compromised system.',
  },

  'xss-01': {
    recon: 'Step 1: Watch the attacker find a vulnerable input field in the application.',
    inject: 'Step 2: Click "Search/Submit" to inject JavaScript code into the search field.',
    'alert-popup': 'Step 3: Observe the JavaScript popup confirming the XSS vulnerability.',
    'steal': 'Step 4: Click "Open DevTools" to see how the attacker steals session cookies.',
    'compromised': 'Step 5: Watch as the attacker hijacks your session with stolen cookies.',
  },

  'sess-01': {
    'establish': 'Step 1: Watch the attacker set up a Man-in-the-Middle proxy on the network.',
    'intercept': 'Step 2: Click "Connect-Wifi" to observe the attacker intercepting network traffic.',
    'capture': 'Step 3: See the attacker extracting your session token from the intercepted traffic.',
    'hijack': 'Step 4: Watch as the attacker uses your session token to access your account.',
    'compromised': 'Step 5: Observe the attacker accessing your account as if they were you.',
  },

  'malware-01': {
    recon: 'Step 1: Observe the attacker creating a malicious executable file.',
    craft: 'Step 2: Watch the attacker embedding it in a seemingly innocent document.',
    'email-sent': 'Step 3: Check your inbox for an email with an attachment like "invoice.exe".',
    'download': 'Step 4: Click "Open Attachment" to download the malicious file.',
    execute: 'Step 5: Click "Run File" to execute the malware.',
    'meterpreter': 'Step 6: Watch the attacker establish a backdoor connection to your system.',
    'compromised': 'Step 7: Observe the attacker accessing your files and personal data.',
  },

  'klog-01': {
    craft: 'Step 1: Watch the attacker create a keylogger malware disguised as software.',
    'email-sent': 'Step 2: Check your inbox for a phishing email with malware attached.',
    download: 'Step 3: Click "Open Attachment" to download the keylogger.',
    execute: 'Step 4: Click "Run File" to install the keylogger on your system.',
    logging: 'Step 5: Watch as the attacker logs all your keyboard input silently.',
    'compromised': 'Step 6: Observe how sensitive information (passwords, emails) can be stolen.',
  },

  'rnsw-01': {
    'deploy': 'Step 1: Watch the attacker deploy ransomware via a phishing link.',
    encrypt: 'Step 2: See the attacker encrypting all files on the victim system.',
    'ransom-note': 'Step 3: Observe the ransom demand displayed to the victim.',
    backup: 'Step 4: Watch as the attacker also targets backup systems.',
    'compromised': 'Step 5: See the impact: data is encrypted and recovery is difficult.',
  },

  'spy-01': {
    'deploy': 'Step 1: Watch the attacker deposit spyware on the system.',
    monitoring: 'Step 2: Observe the spyware capturing screen recordings and webcam access.',
    exfil: 'Step 3: See sensitive data being exfiltrated to the attacker\'s server.',
    'compromised': 'Step 4: Watch the attacker monitoring every action on the victim system.',
  },

  'usb-01': {
    craft: 'Step 1: Watch the attacker prepare a malicious USB device with payload.',
    'insert': 'Step 2: Click "Pick Up USB" to insert the USB into the system.',
    'autoplay': 'Step 3: Click "Run AutoPlay" when the system prompts to run the USB.',
    payload: 'Step 4: Watch the attacker\'s payload execute automatically.',
    'compromised': 'Step 5: Observe the attacker gaining access through the USB exploit.',
  },

  'weakpass-01': {
    recon: 'Step 1: Watch the attacker building a wordlist from public information.',
    'brute-force': 'Step 2: Observe the attacker attempting weak passwords against your account.',
    'bypass-auth': 'Step 3: See the attacker crack a weak password through brute force.',
    'compromised': 'Step 4: Watch the attacker accessing your account with the cracked password.',
  },

  'fakeap-01': {
    setup: 'Step 1: Watch the attacker set up a fake Wi-Fi hotspot with a legitimate-looking name.',
    broadcast: 'Step 2: See the attacker broadcasting the fake access point.',
    'connect-wifi': 'Step 3: Click "Connect to Wi-Fi" to connect to the fake network.',
    intercept: 'Step 4: Observe the attacker intercepting all your network traffic.',
    'compromised': 'Step 5: See your sensitive data (passwords, emails) being captured.',
  },

  'mitm-01': {
    setup: 'Step 1: Watch the attacker configure a Man-in-the-Middle attack on the network.',
    'traffic-hijack': 'Step 2: Observe the attacker intercepting your HTTP traffic.',
    'inject': 'Step 3: See the attacker modifying web pages before they reach you.',
    'credential-steal': 'Step 4: Watch the attacker capturing your login credentials.',
    'compromised': 'Step 5: Observe the attacker accessing your accounts with stolen credentials.',
  },

  'dos-01': {
    recon: 'Step 1: Watch the attacker scanning the network for the target server.',
    'flood-start': 'Step 2: Observe the attacker sending massive traffic to overwhelm the server.',
    'server-down': 'Step 3: See the web server becoming unresponsive and offline.',
    'compromised': 'Step 4: Observe the Denial of Service attack successfully taking down the service.',
  },

  'social-01': {
    research: 'Step 1: Watch the attacker researching personal information about you.',
    'call-made': 'Step 2: Observe an incoming call from someone claiming to be IT Support.',
    'answer-call': 'Step 3: Click "Answer Call" to engage with the social engineer.',
    manipulation: 'Step 4: Listen as the attacker uses urgency and authority to influence you.',
    'compromised': 'Step 5: Watch as the attacker manipulates you into revealing sensitive information.',
  },
};

/**
 * Get all steps for a scenario formatted as a single message with clear structure
 */
export function getAllStepsForScenario(scenarioId: string): string {
  const steps = phaseStepMap[scenarioId];
  if (!steps) return '';
  
  const stepTexts = Object.values(steps);
  return stepTexts.join('\n');
}

/**
 * Get the step instruction for a given scenario and phase
 */
export function getPhaseStepInstruction(scenarioId: string, phaseId: string): string {
  const steps = phaseStepMap[scenarioId];
  if (!steps) return `Proceeding with phase: ${phaseId}`;
  return steps[phaseId] || `Phase: ${phaseId.toUpperCase()}`;
}

/**
 * Get the current step number (count of phases completed so far)
 * Call this when a new phase starts
 */
export function getStepNumber(scenarioId: string, phaseId: string): number {
  const steps = phaseStepMap[scenarioId];
  if (!steps) return 1;
  
  const phaseIds = Object.keys(steps);
  const index = phaseIds.indexOf(phaseId);
  return index >= 0 ? index + 1 : 1;
}
