# 🔑 TwinShield CTF — Complete Answer Key

> All 15 labs with their task answers. Answers are **case-insensitive** (matched via `.toLowerCase()`).
> Only **question-type** tasks require text answers. **Checklist-type** tasks are marked complete with a button click.

---

## Lab 1: PhishNet (`phish-01`) — Phishing | BEGINNER

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | ANALYSE THE EMAIL | *(click to complete)* |
| 2 | ❓ Question | What is the fake domain being used in the phishing email instead of corpbank.com? | `cornbank.com` |
| 3 | ✅ Checklist | CRAFT THE PHISHING EMAIL | *(click to complete)* |
| 4 | ✅ Checklist | DEPLOY THE LANDING PAGE | *(click to complete)* |
| 5 | ❓ Question | Name one technique that made your phishing email convincing to the victim | `urgency` |

---

## Lab 2: WeakPass (`weakpass-01`) — Weak Password Attack | BEGINNER

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | FIND THE LOGIN ENDPOINT | *(click to complete)* |
| 2 | ❓ Question | What port number is the login service running on? | `22` |
| 3 | ✅ Checklist | PREPARE YOUR WORDLIST | *(click to complete)* |
| 4 | ✅ Checklist | LAUNCH HYDRA ATTACK | *(click to complete)* |
| 5 | ❓ Question | What was the cracked password you found using Hydra? | `admin123` |

---

## Lab 3: SocialEng (`social-01`) — Social Engineering | BEGINNER

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | OSINT RECONNAISSANCE | *(click to complete)* |
| 2 | ❓ Question | What is the name of the target employee you researched? | `john smith` |
| 3 | ✅ Checklist | BUILD YOUR PRETEXT | *(click to complete)* |
| 4 | ✅ Checklist | EXECUTE THE ATTACK | *(click to complete)* |
| 5 | ❓ Question | What psychological technique did you use to make the target comply? | `authority` |

---

## Lab 4: MalwareDrop (`malware-01`) — Malware Download | BEGINNER

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | GENERATE THE PAYLOAD | *(click to complete)* |
| 2 | ❓ Question | What msfvenom payload did you use for a Windows reverse shell? | `windows/meterpreter/reverse_tcp` |
| 3 | ✅ Checklist | HOST THE DOWNLOAD PAGE | *(click to complete)* |
| 4 | ✅ Checklist | SET UP YOUR LISTENER | *(click to complete)* |
| 5 | ❓ Question | What port number did you configure for the reverse shell connection? | `4444` |

---

## Lab 5: BruteX (`brute-01`) — Brute Force | INTERMEDIATE

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | INTERCEPT LOGIN REQUEST | *(click to complete)* |
| 2 | ❓ Question | What is the name of the password field in the login POST request? | `password` |
| 3 | ✅ Checklist | CONFIGURE HYDRA | *(click to complete)* |
| 4 | ✅ Checklist | LAUNCH THE ATTACK | *(click to complete)* |
| 5 | ❓ Question | Approximately how many password attempts did Hydra make before succeeding? | `847` |

---

## Lab 6: XSSploit (`xss-01`) — Cross Site Scripting | INTERMEDIATE

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | FIND THE VULNERABLE INPUT | *(click to complete)* |
| 2 | ❓ Question | Which input field on the target page is vulnerable to XSS? | `search` |
| 3 | ✅ Checklist | EXECUTE PROOF OF CONCEPT | *(click to complete)* |
| 4 | ✅ Checklist | CRAFT COOKIE THEFT PAYLOAD | *(click to complete)* |
| 5 | ❓ Question | What HTTP security header would have prevented this XSS attack? | `content-security-policy` |

---

## Lab 7: KeyLogger (`klog-01`) — Keylogger Attack | INTERMEDIATE

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | WRITE THE KEYLOGGER | *(click to complete)* |
| 2 | ❓ Question | What Python library did you use to capture keyboard input? | `pynput` |
| 3 | ✅ Checklist | ADD EXFILTRATION | *(click to complete)* |
| 4 | ✅ Checklist | DEPLOY ON TARGET | *(click to complete)* |
| 5 | ❓ Question | What Windows tool would you use to detect a running keylogger process? | `task manager` |

---

## Lab 8: FakeAP (`fakeap-01`) — Fake WiFi Hotspot | INTERMEDIATE

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | SET UP FAKE ACCESS POINT | *(click to complete)* |
| 2 | ❓ Question | What SSID did you configure for your fake access point? | `corpbank-wifi` |
| 3 | ✅ Checklist | CONFIGURE DHCP SERVER | *(click to complete)* |
| 4 | ✅ Checklist | FORCE VICTIM TO CONNECT | *(click to complete)* |
| 5 | ❓ Question | What tool did you use to send deauthentication packets? | `aireplay-ng` |

---

## Lab 9: SessHijack (`sess-01`) — Session Hijacking | INTERMEDIATE

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | ANALYSE SESSION COOKIES | *(click to complete)* |
| 2 | ❓ Question | Does the session cookie have the HttpOnly flag set? | `no` |
| 3 | ✅ Checklist | STEAL THE SESSION TOKEN | *(click to complete)* |
| 4 | ✅ Checklist | INJECT STOLEN TOKEN | *(click to complete)* |
| 5 | ❓ Question | What happened when you refreshed the page after injecting the stolen cookie? | `logged in as victim` |

---

## Lab 10: SQLStorm (`sqli-01`) — SQL Injection | ADVANCED

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | FIND THE INJECTION POINT | *(click to complete)* |
| 2 | ❓ Question | What type of error appeared when you injected a single quote? | `sql syntax error` |
| 3 | ✅ Checklist | BYPASS AUTHENTICATION | *(click to complete)* |
| 4 | ✅ Checklist | ENUMERATE THE DATABASE | *(click to complete)* |
| 5 | ❓ Question | What SQL injection payload did you use to bypass the login? | `admin'--` |

---

## Lab 11: MitM Cafe (`mitm-01`) — Man in the Middle | ADVANCED

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | ENABLE IP FORWARDING | *(click to complete)* |
| 2 | ❓ Question | Why must IP forwarding be enabled before ARP poisoning? | `to forward packets` |
| 3 | ✅ Checklist | PERFORM ARP POISONING | *(click to complete)* |
| 4 | ✅ Checklist | STRIP SSL ENCRYPTION | *(click to complete)* |
| 5 | ❓ Question | What type of sensitive data were you able to see after stripping SSL? | `login credentials` |

---

## Lab 12: RansomDrop (`rnsw-01`) — Ransomware | ADVANCED

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | WRITE ENCRYPTION SCRIPT | *(click to complete)* |
| 2 | ❓ Question | What type of encryption does Fernet use? | `symmetric` |
| 3 | ✅ Checklist | TEST ON SAMPLE FILES | *(click to complete)* |
| 4 | ✅ Checklist | CREATE RANSOM NOTE | *(click to complete)* |
| 5 | ❓ Question | What is required to decrypt the files after ransomware encryption? | `decryption key` |

---

## Lab 13: SpyAgent (`spy-01`) — Spyware | ADVANCED

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | BUILD SCREENSHOT TOOL | *(click to complete)* |
| 2 | ❓ Question | What PIL function captures a full screenshot? | `imagegrab.grab` |
| 3 | ✅ Checklist | ADD PROCESS MONITORING | *(click to complete)* |
| 4 | ✅ Checklist | SET UP EXFILTRATION CHANNEL | *(click to complete)* |
| 5 | ❓ Question | What process name would you use to disguise your spyware on Windows? | `svchost.exe` |

---

## Lab 14: USBdrop (`usb-01`) — USB Malware | ADVANCED

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | CREATE AUTORUN CONFIGURATION | *(click to complete)* |
| 2 | ❓ Question | What Windows feature does autorun.inf exploit? | `autoplay` |
| 3 | ✅ Checklist | GENERATE REVERSE SHELL PAYLOAD | *(click to complete)* |
| 4 | ✅ Checklist | SIMULATE USB INSERTION | *(click to complete)* |
| 5 | ❓ Question | What percentage of people plug in USB drives they find in public places? | `45` |

---

## Lab 15: NetFlood (`dos-01`) — Denial of Service | ADVANCED

| Task | Type | Question | Answer |
|:---|:---|:---|:---|
| 1 | ✅ Checklist | CAPTURE BASELINE TRAFFIC | *(click to complete)* |
| 2 | ❓ Question | Approximately how many packets per second did you see in normal traffic? | `10` |
| 3 | ✅ Checklist | LAUNCH SYN FLOOD | *(click to complete)* |
| 4 | ✅ Checklist | LAUNCH SLOWLORIS ATTACK | *(click to complete)* |
| 5 | ❓ Question | What makes Slowloris different from a SYN flood attack? | `keeps connections open` |

---

## Quick Reference — All 30 Answers

| # | Lab | Q | Answer |
|:---|:---|:---|:---|
| 1 | PhishNet | Task 2 | `cornbank.com` |
| 2 | PhishNet | Task 5 | `urgency` |
| 3 | WeakPass | Task 2 | `22` |
| 4 | WeakPass | Task 5 | `admin123` |
| 5 | SocialEng | Task 2 | `john smith` |
| 6 | SocialEng | Task 5 | `authority` |
| 7 | MalwareDrop | Task 2 | `windows/meterpreter/reverse_tcp` |
| 8 | MalwareDrop | Task 5 | `4444` |
| 9 | BruteX | Task 2 | `password` |
| 10 | BruteX | Task 5 | `847` |
| 11 | XSSploit | Task 2 | `search` |
| 12 | XSSploit | Task 5 | `content-security-policy` |
| 13 | KeyLogger | Task 2 | `pynput` |
| 14 | KeyLogger | Task 5 | `task manager` |
| 15 | FakeAP | Task 2 | `corpbank-wifi` |
| 16 | FakeAP | Task 5 | `aireplay-ng` |
| 17 | SessHijack | Task 2 | `no` |
| 18 | SessHijack | Task 5 | `logged in as victim` |
| 19 | SQLStorm | Task 2 | `sql syntax error` |
| 20 | SQLStorm | Task 5 | `admin'--` |
| 21 | MitM Cafe | Task 2 | `to forward packets` |
| 22 | MitM Cafe | Task 5 | `login credentials` |
| 23 | RansomDrop | Task 2 | `symmetric` |
| 24 | RansomDrop | Task 5 | `decryption key` |
| 25 | SpyAgent | Task 2 | `imagegrab.grab` |
| 26 | SpyAgent | Task 5 | `svchost.exe` |
| 27 | USBdrop | Task 2 | `autoplay` |
| 28 | USBdrop | Task 5 | `45` |
| 29 | NetFlood | Task 2 | `10` |
| 30 | NetFlood | Task 5 | `keeps connections open` |
