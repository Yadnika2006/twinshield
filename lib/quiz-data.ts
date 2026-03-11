export interface QuizQuestion {
  id: string;
  scenarioId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ScenarioQuiz {
  scenarioId: string;
  questions: QuizQuestion[];
}

export const quizData: ScenarioQuiz[] = [
  {
    scenarioId: "phish-01",
    questions: [
      {
        id: "q1",
        scenarioId: "phish-01",
        question: "What was suspicious about the sender email in this phishing attack?",
        options: [
          "A: The email was too long",
          "B: The domain used c0rpbank.com with a zero instead of the letter O",
          "C: The email had no subject line",
          "D: The email was sent at night"
        ],
        correctIndex: 1,
        explanation: "Typosquatting replaces letters with similar looking characters. c0rpbank uses zero instead of O — easy to miss when reading quickly under pressure.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "phish-01",
        question: "What is the purpose of a tracking pixel in a phishing email?",
        options: [
          "A: To make the email look more professional",
          "B: To add company branding",
          "C: To notify the attacker when the email is opened and capture victim IP address",
          "D: To prevent the email going to spam"
        ],
        correctIndex: 2,
        explanation: "A tracking pixel is a 1x1 invisible image. When your email client loads it your IP address and open time are sent to the attacker server silently.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "phish-01",
        question: "Why did the phishing email create a 24 hour deadline?",
        options: [
          "A: Because the offer was genuinely limited",
          "B: To create urgency and bypass rational thinking — a social engineering tactic",
          "C: Because the system required it",
          "D: To give the victim enough time to respond"
        ],
        correctIndex: 1,
        explanation: "Urgency is the most common social engineering trigger. Time pressure activates the fight or flight response making people act before thinking critically.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "phish-01",
        question: "What would have definitively confirmed the email was fake before clicking anything?",
        options: [
          "A: Checking if the email had a logo",
          "B: Seeing if the email was in your spam folder",
          "C: Hovering over the link to preview the real destination URL",
          "D: Checking if the email was sent in HTML"
        ],
        correctIndex: 2,
        explanation: "Hovering over links reveals the real destination URL in the browser status bar. c0rpbank.com would have been visible before clicking — confirming it as fake.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "phish-01",
        question: "Which of these would have prevented this phishing attack completely?",
        options: [
          "A: A stronger email password",
          "B: Email filtering with domain verification plus security awareness training",
          "C: Using a different browser",
          "D: Logging out of email when not in use"
        ],
        correctIndex: 1,
        explanation: "DMARC and SPF email authentication combined with trained staff awareness are the two most effective phishing defences. Neither alone is sufficient — both are required.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "weakpass-01",
    questions: [
      {
        id: "q1",
        scenarioId: "weakpass-01",
        question: "What tool did the attacker use to crack the SSH password?",
        options: [
          "A: nmap",
          "B: Wireshark",
          "C: Hydra",
          "D: Metasploit"
        ],
        correctIndex: 2,
        explanation: "Hydra is a parallelised login cracker supporting many protocols including SSH. It tested over 1000 passwords per second against the SSH service.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "weakpass-01",
        question: "What wordlist did Hydra use to guess passwords?",
        options: [
          "A: A random list the attacker created",
          "B: rockyou.txt — 14 million real passwords from previous data breaches",
          "C: A dictionary from the internet",
          "D: Common English words only"
        ],
        correctIndex: 1,
        explanation: "RockYou.txt was leaked in the 2009 RockYou breach. It contains 14 million real passwords people actually used — making it devastatingly effective against common password choices.",
        difficulty: "easy"
      },
      {
        id: "q3",
        scenarioId: "weakpass-01",
        question: "What configuration would have made this brute force attack impossible?",
        options: [
          "A: Using a longer password",
          "B: Changing the username from admin",
          "C: Disabling password authentication and using SSH key-based authentication only",
          "D: Using a firewall"
        ],
        correctIndex: 2,
        explanation: "SSH key authentication uses cryptographic keys instead of passwords. There is nothing to brute force — guessing keys is computationally impossible with modern key lengths.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "weakpass-01",
        question: "What is fail2ban and how would it have helped here?",
        options: [
          "A: An antivirus that scans SSH connections",
          "B: A tool that blocks IPs after a set number of failed login attempts",
          "C: A password manager for servers",
          "D: A firewall that blocks port 22"
        ],
        correctIndex: 1,
        explanation: "Fail2ban monitors auth logs and automatically blocks IPs that fail login too many times. After 5 failed attempts the attacker IP is blocked for 24 hours — stopping brute force completely.",
        difficulty: "medium"
      },
      {
        id: "q5",
        scenarioId: "weakpass-01",
        question: "The cracked password was server123. Which password would take centuries to crack even with the fastest supercomputer?",
        options: [
          "A: Server123456789",
          "B: C0rpB@nk2024!",
          "C: xK#9mP2$vL8nQ5@w",
          "D: MySecurePassword2024"
        ],
        correctIndex: 2,
        explanation: "A random 16 character password using uppercase lowercase numbers and symbols has 95^16 possible combinations. At 1 trillion guesses per second it would take longer than the age of the universe to crack.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "social-01",
    questions: [
      {
        id: "q1",
        scenarioId: "social-01",
        question: "What information did the attacker gather from LinkedIn before the call?",
        options: [
          "A: Only the victim's email address",
          "B: Name, job title, manager name, systems managed and recent project details",
          "C: Just the company phone number",
          "D: The victim's personal address"
        ],
        correctIndex: 1,
        explanation: "OSINT from LinkedIn gave the attacker everything needed to sound legitimate. Professional networks are goldmines for social engineering reconnaissance.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "social-01",
        question: "The caller ID showed the real CorpBank IT number. Why was this not proof the caller was legitimate?",
        options: [
          "A: Because IT never calls employees",
          "B: Because caller ID can be spoofed using VoIP services to show any number",
          "C: Because the number was slightly wrong",
          "D: Because real IT uses email not phone"
        ],
        correctIndex: 1,
        explanation: "Caller ID spoofing is trivially easy with VoIP services. Attackers can display any number they choose. Never trust caller ID as proof of identity.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "social-01",
        question: "Why did the attacker put the victim on hold before asking for the password?",
        options: [
          "A: To check records on their system",
          "B: To waste the victim's time",
          "C: To create commitment — the victim had already invested time and was more likely to comply",
          "D: Because they needed to look up the procedure"
        ],
        correctIndex: 2,
        explanation: "This is the commitment and consistency bias. Once someone invests time in a call they feel obligated to see it through. The hold music is a deliberate psychological tactic.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "social-01",
        question: "What is the single most important rule that would have stopped this attack?",
        options: [
          "A: Never answer unknown calls",
          "B: Legitimate IT staff will NEVER ask for your password under any circumstance",
          "C: Always ask for the caller's employee ID",
          "D: Only discuss IT matters over email"
        ],
        correctIndex: 1,
        explanation: "No legitimate IT person needs your password to help you. They have admin tools to reset, unlock or assist without knowing your credentials. Any request for your password is always an attack.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "social-01",
        question: "What verification method would have definitively confirmed the caller was legitimate?",
        options: [
          "A: Asking for their full name and employee ID",
          "B: Checking their LinkedIn profile",
          "C: Hanging up and calling IT back on the official published number",
          "D: Asking them to send a follow up email"
        ],
        correctIndex: 2,
        explanation: "Always break the attacker's communication channel. Hang up and independently call the official number. An attacker cannot intercept a call you initiate to a verified number.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "malware-01",
    questions: [
      {
        id: "q1",
        scenarioId: "malware-01",
        question: "What did the attacker use to create the malware payload?",
        options: [
          "A: A virus downloaded from the internet",
          "B: msfvenom — a payload generator from the Metasploit framework",
          "C: A custom built virus",
          "D: A purchased malware kit"
        ],
        correctIndex: 1,
        explanation: "msfvenom generates reverse shell payloads and is part of Metasploit — a legitimate penetration testing framework. The same tools used by defenders are used by attackers.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "malware-01",
        question: "What is a reverse shell and why does it bypass firewalls?",
        options: [
          "A: A shell that reverses the victim's commands back to them",
          "B: The victim machine connects OUT to the attacker — bypassing rules that block incoming connections",
          "C: A mirror of the attacker terminal",
          "D: An encrypted connection to the server"
        ],
        correctIndex: 1,
        explanation: "Firewalls typically block incoming connections but allow outgoing. A reverse shell has the victim initiate the connection outward — the firewall sees it as normal outgoing traffic.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "malware-01",
        question: "What should have been the warning sign before running the file?",
        options: [
          "A: The file was too large",
          "B: The email arrived on a Monday",
          "C: Legitimate software updates never arrive as email attachments — always from official vendor websites",
          "D: The email used HTML formatting"
        ],
        correctIndex: 2,
        explanation: "This is a universal rule. No legitimate software vendor delivers updates via email attachments. Always go directly to the official website to download any update.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "malware-01",
        question: "The attacker installed persistence on the system. What does this mean?",
        options: [
          "A: The attacker saved their files on the system",
          "B: The malware reinstalls itself automatically after the computer is restarted",
          "C: The attacker stayed connected for a long time",
          "D: The malware is particularly strong"
        ],
        correctIndex: 1,
        explanation: "Persistence mechanisms write to startup registry keys or scheduled tasks. Even after restarting the malware runs again. A full OS reinstall is often required for complete removal.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "malware-01",
        question: "Which combination best protects against malware from email attachments?",
        options: [
          "A: Strong password and antivirus",
          "B: Never run email attachments plus application whitelisting plus updated antivirus",
          "C: Firewall and strong password",
          "D: 2FA and email password"
        ],
        correctIndex: 1,
        explanation: "Defence in depth: never running attachments stops most attacks. Application whitelisting blocks unknown executables from running. Antivirus catches known malware signatures. All three together provide strong protection.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "brute-01",
    questions: [
      {
        id: "q1",
        scenarioId: "brute-01",
        question: "What made the login form vulnerable to brute force attack?",
        options: [
          "A: The password was too short",
          "B: No rate limiting, no account lockout and no CAPTCHA protection",
          "C: The username was admin",
          "D: The site used HTTP not HTTPS"
        ],
        correctIndex: 1,
        explanation: "Without rate limiting an attacker can make unlimited attempts. Without lockout there is no consequence for failed attempts. CAPTCHA breaks automated tools. All three were missing.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "brute-01",
        question: "What did Burp Suite do in this attack?",
        options: [
          "A: It scanned the website for vulnerabilities",
          "B: It intercepted the login request to identify the exact parameter names for Hydra",
          "C: It cracked the password directly",
          "D: It bypassed the login form"
        ],
        correctIndex: 1,
        explanation: "Burp Suite is a web proxy that intercepts browser traffic. By capturing one login attempt it revealed the POST parameter names — username and password — which Hydra then targeted precisely.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "brute-01",
        question: "How many attempts did Hydra make before cracking the password?",
        options: [
          "A: 10 attempts",
          "B: 100 attempts",
          "C: 847 attempts",
          "D: 14 million attempts"
        ],
        correctIndex: 2,
        explanation: "The password welcome123 was found at attempt 847. At 1000 attempts per second this took less than one second. A password not in the wordlist would take exponentially longer.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "brute-01",
        question: "Which single control would have the greatest impact preventing this attack?",
        options: [
          "A: Requiring a longer password",
          "B: Account lockout after 5 failed attempts",
          "C: Using HTTPS",
          "D: Requiring email verification"
        ],
        correctIndex: 1,
        explanation: "Account lockout after 5 attempts limits the attack to 5 guesses before the account is locked regardless of how fast the attacker tries. At 5 attempts the 847 attempt attack becomes impossible.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "brute-01",
        question: "2FA was not enabled on this account. If it had been enabled what would have happened after Hydra found the password?",
        options: [
          "A: The attacker would have been blocked immediately",
          "B: The attacker would still gain access because they have the password",
          "C: The attacker could log in but would need the second factor — which they do not have — making the stolen password useless alone",
          "D: The account would lock automatically"
        ],
        correctIndex: 2,
        explanation: "2FA means knowing the password is not enough. The attacker needs the second factor — typically a phone app code. Without the victim's physical phone the cracked password grants no access.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "xss-01",
    questions: [
      {
        id: "q1",
        scenarioId: "xss-01",
        question: "What does XSS stand for and what does it allow an attacker to do?",
        options: [
          "A: Extra Secure Script — adds security",
          "B: Cross Site Scripting — inject malicious JavaScript into pages other users view",
          "C: Cross System Sharing — share files",
          "D: Extended Script System — extend pages"
        ],
        correctIndex: 1,
        explanation: "XSS allows attackers to inject JavaScript into web pages. When other users view the page the script runs in their browser — allowing cookie theft, keylogging and session hijacking.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "xss-01",
        question: "What is the difference between reflected XSS and stored XSS?",
        options: [
          "A: They are the same thing",
          "B: Reflected is faster than stored",
          "C: Reflected affects only the attacker. Stored saves the payload in the database and affects every user who views it",
          "D: Stored only works on login pages"
        ],
        correctIndex: 2,
        explanation: "Stored XSS is far more dangerous. The payload is saved in the database — a malicious comment for example. Every user who views that comment has the script execute in their browser automatically.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "xss-01",
        question: "What flag on cookies would have prevented the cookie theft in this attack?",
        options: [
          "A: Secure flag",
          "B: SameSite flag",
          "C: HttpOnly flag — prevents JavaScript from reading cookie values",
          "D: Encrypted flag"
        ],
        correctIndex: 2,
        explanation: "The HttpOnly flag tells the browser that the cookie cannot be accessed via JavaScript. document.cookie returns nothing. The theft payload fails completely because the cookie is invisible to scripts.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "xss-01",
        question: "What server configuration would have blocked the XSS script from executing entirely?",
        options: [
          "A: HTTPS certificate",
          "B: Content Security Policy header specifying which scripts are allowed to run",
          "C: A Web Application Firewall alone",
          "D: Input length limits"
        ],
        correctIndex: 1,
        explanation: "A strict CSP header like script-src 'self' tells the browser to only execute scripts from your own domain. The injected script comes from user input — not your domain — so the browser refuses to execute it.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "xss-01",
        question: "Modern frameworks like React prevent XSS by default. How?",
        options: [
          "A: They use HTTPS automatically",
          "B: They block all user input",
          "C: They automatically escape all output treating user content as text not executable code",
          "D: They scan for malicious code"
        ],
        correctIndex: 2,
        explanation: "React escapes all rendered content by default. User input containing script tags is displayed as literal text characters — not executed as code. This makes XSS nearly impossible in properly written React applications.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "klog-01",
    questions: [
      {
        id: "q1",
        scenarioId: "klog-01",
        question: "How did the keylogger hide itself from the victim?",
        options: [
          "A: It ran only at night when not in use",
          "B: It disguised itself as svchost.exe — a legitimate Windows system process",
          "C: It deleted itself after running",
          "D: It ran from a USB drive"
        ],
        correctIndex: 1,
        explanation: "svchost.exe is a genuine Windows process that always runs in background. Malware named identically blends into the process list making it nearly invisible to untrained users checking Task Manager.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "klog-01",
        question: "What library did the keylogger use to capture keystrokes?",
        options: [
          "A: requests",
          "B: os",
          "C: pynput — a Python input monitoring library",
          "D: socket"
        ],
        correctIndex: 2,
        explanation: "pynput is a legitimate Python library for monitoring and controlling input devices. It has valid uses for accessibility software but is frequently abused for keylogging.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "klog-01",
        question: "What tool would a password manager provide that defeats keyloggers completely?",
        options: [
          "A: Stronger passwords",
          "B: Autofill — credentials are inserted without any keyboard input so keyloggers capture nothing",
          "C: Encrypted storage",
          "D: Two factor authentication"
        ],
        correctIndex: 1,
        explanation: "Autofill injects credentials directly into form fields bypassing the keyboard entirely. A keylogger only captures what is physically typed — autofilled passwords are completely invisible to it.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "klog-01",
        question: "The keylogger was added to Windows startup registry. Which tool would reveal unauthorised startup entries?",
        options: [
          "A: Task Manager processes tab",
          "B: Windows Defender scan",
          "C: Autoruns by Sysinternals — shows every program configured to start automatically",
          "D: Device Manager"
        ],
        correctIndex: 2,
        explanation: "Autoruns is a free Microsoft Sysinternals tool that shows every auto-start location in Windows. It is the gold standard for identifying persistence mechanisms installed by malware.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "klog-01",
        question: "Even if a keylogger captures your password which additional control means the stolen password alone is useless?",
        options: [
          "A: A longer password",
          "B: Changing passwords frequently",
          "C: Two factor authentication — the attacker needs your physical device for the second factor",
          "D: Using different passwords on each site"
        ],
        correctIndex: 2,
        explanation: "2FA is the perfect complement to keylogger defence. Even when a password is stolen the attacker cannot login without the second factor — your phone app or hardware key — which they do not have.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "fakeap-01",
    questions: [
      {
        id: "q1",
        scenarioId: "fakeap-01",
        question: "Why did the victim's device connect to the fake access point?",
        options: [
          "A: The victim manually selected the wrong network",
          "B: Devices auto-connect to known network names and cannot distinguish between two access points with the same SSID",
          "C: The real network was unavailable",
          "D: The fake network had a password"
        ],
        correctIndex: 1,
        explanation: "WiFi auto-connect uses only the network name (SSID) to identify known networks. Two access points can have identical names. Devices connect to the strongest signal — which the attacker controls.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "fakeap-01",
        question: "What did the deauthentication attack accomplish?",
        options: [
          "A: It deleted the victim's WiFi settings",
          "B: It forced the victim's device off the real network so it would reconnect to the stronger fake one",
          "C: It disabled the victim's WiFi card",
          "D: It blocked the victim from using internet"
        ],
        correctIndex: 1,
        explanation: "802.11 deauthentication packets are unauthenticated in older WiFi standards. Any device can send them forcing disconnection. WPA3 protects against deauth attacks — another reason to upgrade WiFi standards.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "fakeap-01",
        question: "What did SSLstrip do to the victim's HTTPS connections?",
        options: [
          "A: It encrypted the traffic more strongly",
          "B: It blocked HTTPS connections",
          "C: It downgraded HTTPS connections to HTTP making all traffic readable as plain text",
          "D: It created fake SSL certificates"
        ],
        correctIndex: 2,
        explanation: "SSLstrip intercepts the initial HTTP request before HTTPS redirect happens. It maintains HTTPS with the real server but serves plain HTTP to the victim — invisibly decrypting all traffic.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "fakeap-01",
        question: "What technology completely defeats the fake access point attack regardless of which network you connect to?",
        options: [
          "A: Using HTTPS websites",
          "B: A VPN — encrypts all traffic before it leaves your device so the attacker sees only encrypted data",
          "C: Turning off WiFi auto-connect",
          "D: Using a strong WiFi password"
        ],
        correctIndex: 1,
        explanation: "A VPN encrypts everything at the device level before any WiFi transmission. Even on a fake AP with full traffic visibility the attacker sees only encrypted ciphertext. No credentials no sessions no data.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "fakeap-01",
        question: "HSTS prevents SSLstrip attacks. How does HSTS work?",
        options: [
          "A: It blocks all HTTP connections globally",
          "B: It requires a certificate on all sites",
          "C: The browser remembers that a site must always use HTTPS and refuses HTTP connections even if instructed",
          "D: It encrypts DNS queries"
        ],
        correctIndex: 2,
        explanation: "HSTS (HTTP Strict Transport Security) is a header that tells browsers to always use HTTPS for a domain — forever. Once seen the browser refuses plain HTTP entirely making SSLstrip ineffective.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "sess-01",
    questions: [
      {
        id: "q1",
        scenarioId: "sess-01",
        question: "What is a session cookie and why is it valuable to an attacker?",
        options: [
          "A: A cookie that tracks your browsing history",
          "B: A temporary token proving you are logged in. Stealing it lets attacker login as you without needing your password",
          "C: A cookie that stores your preferences",
          "D: A cookie that saves your password"
        ],
        correctIndex: 1,
        explanation: "After you log in the server issues a session token. Your browser sends it with every request to prove who you are. Stealing the token is equivalent to stealing your authenticated session entirely.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "sess-01",
        question: "Which cookie flag was missing that directly enabled this session theft?",
        options: [
          "A: Secure flag",
          "B: SameSite flag",
          "C: HttpOnly flag — its absence allowed JavaScript to read the session cookie",
          "D: Domain flag"
        ],
        correctIndex: 2,
        explanation: "HttpOnly cookies cannot be accessed by JavaScript at all. The XSS payload using document.cookie would have returned empty string. No cookie to steal means no session hijacking possible.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "sess-01",
        question: "The attacker replayed your session cookie. What would have detected this suspicious activity?",
        options: [
          "A: A strong password",
          "B: Concurrent session detection — alerting when the same session is used from two different IP addresses simultaneously",
          "C: HTTPS",
          "D: Regular password changes"
        ],
        correctIndex: 1,
        explanation: "Detecting two concurrent logins from different IPs using the same session token is a strong signal of session hijacking. Modern applications can invalidate the session and force re-authentication.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "sess-01",
        question: "The attacker used stored XSS to steal the cookie. What input sanitisation would have prevented the XSS entirely?",
        options: [
          "A: Removing all HTML from user input",
          "B: HTML encoding output — converting special characters like < and > into their HTML entity equivalents",
          "C: Limiting comment length",
          "D: Requiring login to post comments"
        ],
        correctIndex: 1,
        explanation: "HTML encoding converts < to &lt; and > to &gt;. The browser displays them as literal characters rather than interpreting them as HTML tags. The script tag becomes visible text — not executable code.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "sess-01",
        question: "Which combination of controls provides the strongest session protection?",
        options: [
          "A: Long password and HTTPS",
          "B: HttpOnly cookies plus short session timeouts plus re-authentication for sensitive actions",
          "C: 2FA and strong password",
          "D: CAPTCHA and account lockout"
        ],
        correctIndex: 1,
        explanation: "HttpOnly prevents theft. Short timeouts limit the attack window. Re-auth for sensitive actions means even a hijacked session cannot transfer money or change passwords without the real user's credentials.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "sqli-01",
    questions: [
      {
        id: "q1",
        scenarioId: "sqli-01",
        question: "What did the payload admin'-- do to the SQL query?",
        options: [
          "A: It logged in as admin directly",
          "B: It closed the SQL string with a quote then commented out the password check with double dash",
          "C: It deleted the admin account",
          "D: It reset the admin password"
        ],
        correctIndex: 1,
        explanation: "The single quote closes the username string in the SQL query. Double dash is a SQL comment — everything after it is ignored. The password WHERE clause is commented out — authentication bypassed.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "sqli-01",
        question: "What is sqlmap and what did it do in this attack?",
        options: [
          "A: A tool that maps SQL databases visually",
          "B: An automated SQL injection tool that found vulnerabilities and extracted the entire database automatically",
          "C: A SQL query builder",
          "D: A database backup tool"
        ],
        correctIndex: 1,
        explanation: "sqlmap is an open source penetration testing tool that automates SQL injection detection and exploitation. It can extract entire databases, bypass authentication and in some cases execute system commands.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "sqli-01",
        question: "What does parameterised queries mean and why does it prevent SQL injection?",
        options: [
          "A: Queries that have many parameters",
          "B: Queries that are stored in a config file",
          "C: Queries where user input is passed as data never as SQL code — the database treats it as a value not a command",
          "D: Encrypted SQL queries"
        ],
        correctIndex: 2,
        explanation: "Parameterised queries separate SQL code from user data completely. The database knows exactly what is code and what is input data. A single quote in the input is just data — not SQL syntax.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "sqli-01",
        question: "The SQL error message revealed the database query structure. What should have happened instead?",
        options: [
          "A: The error should have included more detail",
          "B: Error messages should be logged internally but only a generic error shown to users — never revealing system internals",
          "C: The error should redirect to homepage",
          "D: The error should lock the account"
        ],
        correctIndex: 1,
        explanation: "Verbose error messages are information gold for attackers. They reveal database type, query structure and sometimes table names. Users should only see a generic something went wrong message.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "sqli-01",
        question: "Even if SQL injection extracts password hashes what additional protection makes the hashes useless?",
        options: [
          "A: Long passwords",
          "B: Frequent password changes",
          "C: Proper password hashing using bcrypt or Argon2 with unique salts making hash cracking computationally infeasible",
          "D: Encrypted the database"
        ],
        correctIndex: 2,
        explanation: "bcrypt deliberately runs slowly — making hash cracking take years not seconds. Unique salts prevent rainbow table attacks. Even with the hash database stolen bcrypt hashed passwords remain practically uncrackable.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "mitm-01",
    questions: [
      {
        id: "q1",
        scenarioId: "mitm-01",
        question: "What is ARP poisoning and what did it allow the attacker to do?",
        options: [
          "A: A network scan that finds open ports",
          "B: Sending fake ARP replies to position the attacker between victim and router so all traffic flows through them",
          "C: Poisoning the DNS server",
          "D: Blocking the victim's internet connection"
        ],
        correctIndex: 1,
        explanation: "ARP maps IP addresses to MAC addresses on local networks. By sending false ARP replies the attacker claims to be both the gateway and the victim — intercepting all traffic in both directions.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "mitm-01",
        question: "Why did the attacker enable IP forwarding before starting the attack?",
        options: [
          "A: To speed up the connection",
          "B: To encrypt the traffic",
          "C: To forward intercepted packets to their real destination — keeping the victim connected so they notice nothing",
          "D: To bypass the firewall"
        ],
        correctIndex: 2,
        explanation: "Without IP forwarding all victim traffic would stop at the attacker laptop causing obvious connection loss. With it enabled traffic is forwarded normally. The victim stays connected and suspects nothing — the perfect invisible intercept.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "mitm-01",
        question: "What is HSTS and how does it prevent SSLstrip attacks?",
        options: [
          "A: A firewall rule blocking HTTP",
          "B: A browser policy that remembers sites must always use HTTPS — refusing plain HTTP even if instructed",
          "C: An SSL certificate type",
          "D: A server configuration for encryption"
        ],
        correctIndex: 1,
        explanation: "Once a browser sees an HSTS header it permanently remembers to use HTTPS for that domain. SSLstrip cannot downgrade the connection because the browser enforces HTTPS before any network communication begins.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "mitm-01",
        question: "Which tool completely defeats MitM attacks on public WiFi regardless of whether HTTPS is used?",
        options: [
          "A: HTTPS alone",
          "B: A strong WiFi password",
          "C: A VPN — creates an encrypted tunnel from device to VPN server bypassing all local network interception",
          "D: Antivirus software"
        ],
        correctIndex: 2,
        explanation: "A VPN encrypts traffic at the device before it reaches the network. The attacker intercepts only the VPN tunnel — encrypted ciphertext they cannot read. All credentials sessions and data remain completely private.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "mitm-01",
        question: "Certificate pinning would have prevented this attack. What is it?",
        options: [
          "A: Pinning a physical certificate to your screen as a reminder",
          "B: An application hardcoding expected certificate details and refusing connections with different certificates",
          "C: Locking SSL certificates to one server",
          "D: A browser plugin that checks certificates"
        ],
        correctIndex: 1,
        explanation: "Certificate pinning embeds the expected certificate fingerprint directly in the application. Even if an attacker presents a valid-looking certificate the app rejects it because it does not match the pinned value. MitM becomes impossible.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "rnsw-01",
    questions: [
      {
        id: "q1",
        scenarioId: "rnsw-01",
        question: "Why could the victim not decrypt their files even after paying the ransom?",
        options: [
          "A: The encryption was too strong to reverse",
          "B: The decryption key was sent to the attacker server before encryption started — victim never had it",
          "C: The files were deleted not encrypted",
          "D: The ransom payment was not received"
        ],
        correctIndex: 1,
        explanation: "The encryption key is generated locally then immediately exfiltrated to the attacker. The victim never possesses the key. This is why paying does not guarantee recovery — the attacker may not send it back.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "rnsw-01",
        question: "Why were the online backups also encrypted in this attack?",
        options: [
          "A: The backup service was also hacked",
          "B: Online backups that are continuously connected are accessible to ransomware and get encrypted along with local files",
          "C: The backup software had a vulnerability",
          "D: The backups were on the same server"
        ],
        correctIndex: 1,
        explanation: "Cloud sync services like OneDrive and Google Drive sync the encrypted versions automatically. Connected network drives are reached via mapped paths. Only truly offline backups — disconnected drives — survive ransomware attacks.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "rnsw-01",
        question: "What is the 3-2-1 backup rule?",
        options: [
          "A: Back up 3 times a day, 2 locations, 1 cloud service",
          "B: 3 copies of data, on 2 different media types, with 1 copy stored offsite offline",
          "C: Back up for 3 years, keep 2 versions, 1 encrypted",
          "D: 3 cloud backups, 2 local, 1 USB"
        ],
        correctIndex: 1,
        explanation: "3-2-1 is the gold standard. 3 copies means you can lose 2 and still recover. 2 media types means hardware failure on one does not affect the other. 1 offsite means ransomware and physical disaster cannot reach the last copy.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "rnsw-01",
        question: "The ransom note used a countdown timer. What psychological principle does this exploit?",
        options: [
          "A: Loss aversion — fear of permanent loss combined with artificial scarcity and urgency to force hasty decisions",
          "B: Authority bias",
          "C: Social proof",
          "D: Reciprocity"
        ],
        correctIndex: 0,
        explanation: "Loss aversion is one of the most powerful human biases. The fear of losing irreplaceable files combined with an escalating price and deletion deadline creates enormous pressure to pay quickly without thinking rationally.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "rnsw-01",
        question: "Should you pay ransomware attackers? What do experts and law enforcement advise?",
        options: [
          "A: Always pay — it is the only way to get files back",
          "B: Never pay under any circumstances",
          "C: Do not pay — only 65 percent receive working decryption keys and payment funds further attacks",
          "D: Pay only if the amount is under $10,000"
        ],
        correctIndex: 2,
        explanation: "FBI and Interpol advise against paying. Statistics show 35 percent never receive a working key. Payment encourages more attacks and funds criminal operations. Recovery from offline backups is always the preferred path.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "spy-01",
    questions: [
      {
        id: "q1",
        scenarioId: "spy-01",
        question: "How often did the spyware capture a screenshot of the victim's screen?",
        options: [
          "A: Every keystroke",
          "B: Once per day",
          "C: Every 5 minutes continuously",
          "D: Only when the victim typed a password"
        ],
        correctIndex: 2,
        explanation: "Screenshots every 5 minutes means the attacker gets a complete picture of everything you work on throughout the day — emails, documents, websites, messages — all without your knowledge.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "spy-01",
        question: "What physical control completely defeats webcam spying?",
        options: [
          "A: Disabling the camera in device manager",
          "B: A physical webcam cover costing less than one dollar that blocks the lens",
          "C: Keeping the laptop lid closed",
          "D: Antivirus software"
        ],
        correctIndex: 1,
        explanation: "Advanced spyware can sometimes activate cameras without triggering indicator lights. Physical covers are the only absolute guarantee. Even Mark Zuckerberg and James Comey use physical webcam covers.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "spy-01",
        question: "The spyware was disguised as svchost.exe. How would you distinguish malicious from legitimate svchost processes?",
        options: [
          "A: Legitimate svchost is in C:\\Windows\\System32. Any svchost running from another location is suspicious",
          "B: Malicious svchost uses more CPU",
          "C: There should only ever be one svchost",
          "D: Malicious svchost has a different icon"
        ],
        correctIndex: 0,
        explanation: "Legitimate Windows svchost.exe always runs from C:\\Windows\\System32. Right clicking a process in Task Manager and selecting Open File Location reveals the path. Any other location is malware.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "spy-01",
        question: "The spyware was exfiltrating data encrypted. Why does this make detection harder?",
        options: [
          "A: Encrypted traffic is faster and uses less bandwidth",
          "B: Encrypted exfiltration blends with normal HTTPS traffic — network monitoring cannot read its contents to identify it as malicious",
          "C: Encryption prevents antivirus from scanning",
          "D: Encrypted data cannot be blocked by firewalls"
        ],
        correctIndex: 1,
        explanation: "Traditional network monitoring inspects traffic content to identify threats. Encrypted exfiltration looks identical to normal HTTPS web browsing. Behavioural analysis — detecting unusual upload volumes or destinations — is needed to catch it.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "spy-01",
        question: "Which type of security tool is best suited to detecting spyware that bypasses traditional antivirus?",
        options: [
          "A: Firewall",
          "B: Password manager",
          "C: Endpoint Detection and Response (EDR) which monitors behaviour patterns rather than just known malware signatures",
          "D: VPN"
        ],
        correctIndex: 2,
        explanation: "EDR tools like CrowdStrike and SentinelOne analyse process behaviour — what a program does rather than what it looks like. Screenshot capture plus outbound connections is suspicious behaviour regardless of what the process is named.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "usb-01",
    questions: [
      {
        id: "q1",
        scenarioId: "usb-01",
        question: "What label did the attacker put on the USB to maximise the chance someone would plug it in?",
        options: [
          "A: IT Department Tools",
          "B: SALARY INFORMATION Q4 2024",
          "C: Please Return to Reception",
          "D: CorpBank Software Update"
        ],
        correctIndex: 1,
        explanation: "Research shows salary information is the most curiosity-inducing USB label. 90 percent of people who found a USB labelled with pay data plugged it in. Human curiosity is the vulnerability being exploited here.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "usb-01",
        question: "What file automatically executed the malware when the USB was inserted?",
        options: [
          "A: update.exe ran automatically",
          "B: autorun.inf instructed Windows to execute update.exe when the USB was inserted",
          "C: The USB firmware ran automatically",
          "D: Windows detected and ran the largest file"
        ],
        correctIndex: 1,
        explanation: "autorun.inf is a configuration file Windows reads when removable media is inserted. It specifies what action to take — in this case run the payload. Modern Windows disables autorun by default but many enterprise machines have it enabled.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "usb-01",
        question: "The attacker escalated to domain administrator from one USB. What does domain administrator access mean?",
        options: [
          "A: Access to the company website only",
          "B: Access to one server",
          "C: Full control of every computer, user account and server in the organisation",
          "D: Access to email only"
        ],
        correctIndex: 2,
        explanation: "Domain Administrator is the highest privilege in a Windows network. It controls all computers all user accounts all data all servers. One USB drive bypassed every perimeter control and achieved complete organisational compromise.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "usb-01",
        question: "Which enterprise control would have blocked the USB payload from executing even if plugged in?",
        options: [
          "A: Strong endpoint password",
          "B: Antivirus alone",
          "C: USB device control policy blocking unknown USB storage devices plus application whitelisting",
          "D: Firewall"
        ],
        correctIndex: 2,
        explanation: "USB device control whitelists only approved drives by hardware ID — unknown USB drives mount as read-only or are blocked entirely. Application whitelisting prevents unknown executables from running. Both together make USB drops ineffective.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "usb-01",
        question: "What should an employee do if they find a USB drive in their workplace car park?",
        options: [
          "A: Plug it into an isolated test computer to see what is on it",
          "B: Hand it to IT security without plugging it in anywhere — they have tools to analyse it safely",
          "C: Put it in lost property",
          "D: Plug it in and check for owner details to return it"
        ],
        correctIndex: 1,
        explanation: "IT security teams have isolated sandbox environments and write-blockers to examine found storage devices safely. Never plug a found USB into any computer — even one you think is isolated. The only safe action is physical handoff to security team.",
        difficulty: "hard"
      }
    ]
  },
  {
    scenarioId: "dos-01",
    questions: [
      {
        id: "q1",
        scenarioId: "dos-01",
        question: "What is a botnet and how was it used in this attack?",
        options: [
          "A: A network of robots built for automation",
          "B: A network of 10,000 compromised computers sending attack traffic simultaneously — making source blocking impossible",
          "C: A type of server cluster",
          "D: Bots that run automated scripts"
        ],
        correctIndex: 1,
        explanation: "A botnet is thousands of real computers infected with malware and controlled remotely. Each sends attack packets from its own legitimate IP address. Blocking one IP has no effect — thousands more continue.",
        difficulty: "easy"
      },
      {
        id: "q2",
        scenarioId: "dos-01",
        question: "What is a SYN flood and what resource does it exhaust?",
        options: [
          "A: Floods the server with large files",
          "B: Exploits TCP handshake by sending SYN packets without completing the connection — filling the server connection table",
          "C: Floods DNS with fake requests",
          "D: Sends too many login attempts"
        ],
        correctIndex: 1,
        explanation: "TCP requires a 3-way handshake: SYN, SYN-ACK, ACK. A SYN flood sends millions of SYN packets but never sends the final ACK. The server allocates memory for each waiting connection — eventually running out with no capacity for legitimate users.",
        difficulty: "medium"
      },
      {
        id: "q3",
        scenarioId: "dos-01",
        question: "What makes Slowloris different from a volumetric DDoS attack?",
        options: [
          "A: Slowloris is faster than volumetric attacks",
          "B: Slowloris uses legitimate low-volume connections making it hard to distinguish from slow real users",
          "C: Slowloris targets databases not web servers",
          "D: Slowloris requires a botnet"
        ],
        correctIndex: 1,
        explanation: "Slowloris opens real connections and sends partial HTTP headers very slowly. Each connection looks like a legitimately slow user. No high traffic volume means simple traffic-based detection fails. Connection timeouts and per-IP limits are the effective countermeasures.",
        difficulty: "medium"
      },
      {
        id: "q4",
        scenarioId: "dos-01",
        question: "What is the most effective first response when a DDoS attack begins?",
        options: [
          "A: Restart all servers",
          "B: Block all foreign IP addresses",
          "C: Activate CDN DDoS protection which absorbs and filters traffic at the network edge before it reaches servers",
          "D: Increase server bandwidth"
        ],
        correctIndex: 2,
        explanation: "CDN providers like Cloudflare have network capacity measured in terabits per second — orders of magnitude larger than any attacker. They absorb attack traffic at their edge nodes and forward only legitimate requests to your origin server.",
        difficulty: "hard"
      },
      {
        id: "q5",
        scenarioId: "dos-01",
        question: "Which of these would have prevented this DDoS from taking the service offline?",
        options: [
          "A: A stronger server password",
          "B: HTTPS certificate",
          "C: Always-on DDoS protection with auto-scaling cloud infrastructure and CDN distribution",
          "D: A Web Application Firewall alone"
        ],
        correctIndex: 2,
        explanation: "Always-on scrubbing detects attack patterns instantly. Auto-scaling adds capacity automatically under load. CDN distribution means the origin is never directly exposed. Together these make complete service takedown practically impossible even under multi-terabit attacks.",
        difficulty: "hard"
      }
    ]
  }
];
