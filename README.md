<p align="center">
  <img src="https://img.shields.io/badge/TWINSHIELD-CYBERSECURITY_LAB-00d4ff?style=for-the-badge&labelColor=0a1628&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTEyIDMuNSAxOC41IDZ2NS41YzAgNC0yLjYgNy4yLTYuNSA5LTMuOS0xLjgtNi41LTUtNi41LTlWNkwxMiAzLjVaIiBzdHJva2U9IiMwMGQ0ZmYiIHN0cm9rZS13aWR0aD0iMS42IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0ibTkuNSAxMS44IDEuNyAxLjcgMy4zLTMuMyIgc3Ryb2tlPSIjMDBkNGZmIiBzdHJva2Utd2lkdGg9IjEuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+" alt="TwinShield" />
</p>

<h1 align="center">
  🛡️ T W I N S H I E L D
</h1>

<p align="center">
  <b>Hack the Twin. Defend the Real.</b>
</p>

<p align="center">
  <em>A dual-view cybersecurity training platform where every attack has a victim — and you see both sides in real time.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.1-FF6B35?style=flat-square&logo=meta&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSockets-Real--Time-00d4ff?style=flat-square&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/15-ATTACK_LABS-ff4444?style=flat-square" />
  <img src="https://img.shields.io/badge/2-AI_AGENTS-bb88ff?style=flat-square" />
  <img src="https://img.shields.io/badge/4-DEFENCE_MODES-00ff88?style=flat-square" />
  <img src="https://img.shields.io/badge/30+-CTF_CHALLENGES-ffcc00?style=flat-square" />
</p>

---

## 🎯 What is TwinShield?

**TwinShield** is a **digital twin cybersecurity learning platform** that lets you execute real-world cyberattacks on isolated victim environments while watching the impact unfold in real time through a **split-screen dual-view interface**.

> **The core idea:** You don't just read about SQL injection — you _run sqlmap_ against a live banking portal, watch the victim's database get dumped, and then learn how to stop it. All inside a safe, sandboxed lab.

```
┌─────────────────────────────────────────────────┐
│                TWINSHIELD LAB SESSION            │
├────────────────────────┬────────────────────────┤
│   ◈ VICTIM VIEW        │   ◈ ATTACKER TERMINAL  │
│                        │                        │
│  🌐 CorpBank Portal    │  $ nmap -sV target     │
│  Username: admin       │  [+] PORT 80/tcp open  │
│  Password: ••••••••    │  $ sqlmap -u /login    │
│  ⚠ Unusual login       │  [+] SQLi found!       │
│  ✓ Auth bypassed!      │  [+] Dumping: users    │
│  📁 users.db EXPOSED   │  █████████████░░ 87%   │
└────────────────────────┴────────────────────────┘
```

---

## ⚡ Key Features

### 🔀 Dual-View Attack Labs
Every lab session renders **two simultaneous views**: the victim's UI (a realistic web app, login portal, or system) and the attacker's terminal. Run real attack commands and watch the victim react in real time.

### 🤖 AI Agent System (Groq LLaMA 3.1 8B)
Two AI agents work in **adversarial opposition** during every session:

| Agent | Role | Powered By |
|:------|:-----|:-----------|
| **🧠 Mentor AI** | Cybersecurity educator — guides your attack methodology, explains psychology, connects to real-world breaches | Groq LLaMA 3.1 8B |
| **🛡️ Defense AI** | SOC analyst — fires SIEM-style alerts, blocks IPs, detects intrusions, generates incident reports | Groq LLaMA 3.1 8B |

Both agents are **fully configurable** with:
- 🎓 **4 Teaching Modes**: Observe · Contextual · Deep Dive · Step-by-Step
- 🔥 **4 Defence Modes**: Rookie → SOC Analyst → Autonomous → Adversarial (PvP)
- 📊 **Tunable Parameters**: Explanation depth, aggression level, alert sensitivity
- 🔧 **Feature Toggles**: Real-world examples, psychological context, auto-blocking, post-mortem reports

### 🏆 CTF Mode
Competitive Capture-The-Flag challenges with timed tasks, flag hunting, and a full leaderboard ranking system.

### 📊 Progress Tracking & Gamification
- **XP & Leveling System** — Earn XP for completing labs and quizzes
- **Badge Collection** — 8 unique achievement badges (First Blood, Elite Hacker, Ghost, etc.)
- **Activity Heatmap** — 90-day contribution graph
- **Strengths & Weaknesses** — AI-analyzed skill gap reports
- **Lab Completion Map** — Visual grid of all 15 labs with grades and attempt counts

### 📈 Instructor Dashboard
- Live session monitoring
- Scenario assignment
- AI-powered auto-grading
- Cohort analytics export

### 🔐 Authentication
- Email/password with bcrypt hashing
- Google OAuth integration
- JWT-based session management via NextAuth.js
- Role-based access (Student, Instructor, CTF Competitor)

---

## 🧪 Attack Lab Catalogue

TwinShield ships with **15 labs** across 3 difficulty tiers:

### 🟢 Beginner
| Lab | Code | Attack Type |
|:----|:-----|:------------|
| PhishNet | `phish-01` | Phishing Email & Credential Harvesting |
| WeakPass | `weakpass-01` | Weak Password / Dictionary Attack |
| SocialEng | `social-01` | Social Engineering & OSINT |
| MalwareDrop | `malware-01` | Malware Download & Reverse Shell |

### 🟡 Intermediate
| Lab | Code | Attack Type |
|:----|:-----|:------------|
| BruteX | `brute-01` | Brute Force Authentication |
| XSSploit | `xss-01` | Cross-Site Scripting (XSS) |
| KeyLogger | `klog-01` | Keylogger Deployment |
| FakeAP | `fakeap-01` | Fake WiFi Access Point |
| SessHijack | `sess-01` | Session Token Hijacking |

### 🔴 Advanced
| Lab | Code | Attack Type |
|:----|:-----|:------------|
| SQLStorm | `sqli-01` | SQL Injection (with live Flask victim) |
| MitM Café | `mitm-01` | Man-in-the-Middle & ARP Poisoning |
| RansomDrop | `rnsw-01` | Ransomware Encryption Simulation |
| SpyAgent | `spy-01` | Spyware & Covert Surveillance |
| USBdrop | `usb-01` | USB Drop / Autorun Exploitation |
| NetFlood | `dos-01` | Denial of Service (SYN Flood + Slowloris) |

> Each lab includes **5 tasks** (mix of checklist actions and CTF-style questions), a **5-question quiz**, and automated **grading with AI-generated reports**.

---

## 🏗️ Architecture

```
twinshield/
│
├── app/                          # Next.js 14 App Router
│   ├── page.tsx                  # Landing page (Matrix rain + auth)
│   ├── dashboard/                # Dashboard views (overview, labs, progress, leaderboard)
│   ├── lab/                      # Lab session interface (dual-view)
│   ├── ctf/                      # CTF challenge arena
│   ├── report/                   # Post-session reports & analytics
│   ├── agent-config/             # AI agent configuration panel
│   ├── login/                    # Authentication
│   └── api/                      # REST API routes
│       ├── auth/                 #   ├── NextAuth + custom registration
│       ├── agents/               #   ├── Groq LLM integration
│       ├── lab/                  #   ├── Lab session CRUD
│       ├── ctf/                  #   ├── CTF management
│       ├── quiz/                 #   ├── Quiz scoring
│       ├── leaderboard/          #   ├── Rankings
│       └── user/                 #   └── User stats & progress
│
├── gateway/                      # WebSocket Gateway Server
│   └── src/
│       ├── index.ts              # Express + WS server (port 4000)
│       ├── terminal.ws.ts        # PTY terminal bridge (node-pty)
│       └── events.ws.ts          # Real-time event broadcaster
│
├── victim-twin/                  # Victim Twin Environments
│   └── sql-storm/                # SQLStorm lab: Flask + SQLite banking portal
│       ├── app.py                # Vulnerable Flask application
│       ├── bank.db               # SQLite database (seeded)
│       └── templates/            # Victim UI templates
│
├── lib/                          # Core library
│   ├── agents/                   # AI agent system
│   │   ├── mentor-prompt.ts      # Mentor AI prompt engineering
│   │   ├── guardian-prompt.ts    # Defense AI prompt engineering
│   │   ├── settings.ts           # Agent configuration schema
│   │   ├── phase-steps.ts        # Lab phase orchestration
│   │   └── scenario-metadata.ts  # Scenario definitions
│   ├── scenarios.ts              # Full scenario library (15 labs)
│   ├── quiz-data.ts              # Quiz question bank
│   ├── db.ts                     # Supabase database layer
│   ├── auth.ts                   # Auth utilities
│   └── rate-limit.ts             # API rate limiting
│
├── components/                   # React components
│   ├── layout/                   # Sidebar, navigation
│   ├── lab/                      # Lab session components
│   ├── providers/                # Context providers (session, auth)
│   └── ui/                       # Reusable UI primitives (shadcn/ui)
│
└── sql/                          # Database schema
    ├── schema.sql                # Full Supabase schema
    ├── indexes.sql               # Performance indexes
    ├── rls_policies.sql          # Row-Level Security policies
    └── agent_settings.sql        # Agent configuration table
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | Next.js 14 (App Router) | Server & client rendering |
| **Language** | TypeScript 5 | Type-safe full stack |
| **Styling** | TailwindCSS + Custom CSS | Cyberpunk-themed UI |
| **UI Library** | shadcn/ui + Lucide Icons | Component primitives |
| **Auth** | NextAuth.js v4 | JWT sessions, Google OAuth, credentials |
| **Database** | Supabase (PostgreSQL) | Users, sessions, scores, badges |
| **AI/LLM** | Groq API (LLaMA 3.1 8B) | Mentor AI + Defense AI agents |
| **WebSocket** | ws + Express | Real-time terminal & event streaming |
| **Terminal** | node-pty + xterm.js | In-browser terminal emulation |
| **Validation** | Zod v4 | Runtime schema validation |
| **Victim Apps** | Flask + SQLite | Vulnerable target environments |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Python 3** (for victim-twin environments)
- A **Supabase** project (free tier works)
- A **Groq** API key ([console.groq.com](https://console.groq.com))
- A **Google Cloud** OAuth client (optional, for Google login)

### 1. Clone & Install

```bash
git clone https://github.com/Yadnika2006/twinshield.git
cd twinshield
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# ── Supabase ──
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ── NextAuth ──
NEXTAUTH_SECRET=your-secret-key          # Generate: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# ── Google OAuth (optional) ──
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ── AI Agents ──
GROQ_API_KEY=your-groq-api-key

# ── Gateway ──
NEXT_PUBLIC_GATEWAY_WS_URL=ws://localhost:4000
```

### 3. Set Up the Database

Run the SQL files in your Supabase SQL editor **in this order**:

```
1. sql/schema.sql           → Tables, views, triggers
2. sql/indexes.sql          → Performance indexes
3. sql/rls_policies.sql     → Row-level security
4. sql/agent_settings.sql   → Agent config table
```

### 4. Start the Gateway Server

```bash
cd gateway
npm install
npm run dev
```

The WebSocket gateway will start on `ws://localhost:4000`.

### 5. Start the Victim Twin (SQLStorm Lab)

```bash
cd victim-twin/sql-storm
pip install -r requirements.txt
python app.py
```

### 6. Start the Next.js App

```bash
# From the project root
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the Matrix rain landing page. 🟢

---

## 🎮 How It Works

```
  ┌──────────┐     ┌──────────────┐     ┌────────────────┐
  │  Student  │────▶│  Next.js App │────▶│  Supabase DB   │
  │  Browser  │     │  (Port 3000) │     │  (PostgreSQL)  │
  └─────┬─────┘     └──────┬───────┘     └────────────────┘
        │                  │
        │  WebSocket       │  REST API
        │                  │
  ┌─────▼─────┐     ┌──────▼───────┐
  │  Gateway   │     │  Groq API    │
  │  (WS:4000) │     │  (LLaMA 3.1) │
  ├────────────┤     └──────────────┘
  │ /terminal  │ ◀── PTY bridge (node-pty)
  │ /events    │ ◀── Real-time event stream
  └─────┬──────┘
        │
  ┌─────▼──────┐
  │ Victim Twin │
  │ (Flask App) │
  └────────────┘
```

1. **Choose a Scenario** — Pick from 15 attack labs across 3 difficulty levels
2. **Lab Spins Up** — The victim twin environment initializes with the target application
3. **Attack & Observe** — Execute attacks in the terminal while watching the victim react in the split view
4. **AI Coaching** — Mentor AI guides your methodology; Defense AI fires alerts and attempts to block you
5. **Get Assessed** — Complete tasks, answer quiz questions, and receive an AI-generated incident report with a grade

---

## 🤖 AI Agent Deep Dive

### Mentor AI (`mentor-prompt.ts`)
The Mentor AI is a context-aware cybersecurity educator that adapts to:

- **Teaching Mode** — Observe (brief narration), Contextual (why it matters), Deep Dive (technical mechanics), Step-by-Step (structured walkthrough)
- **Personality** — Academic (formal), Friendly (encouraging), Concise (high-signal)
- **Explanation Depth** — 0-100 slider from simple → balanced → technical
- **Feature Toggles** — Real-world breach examples, psychological context, post-lesson summaries, technical implementation details

### Defense AI (`guardian-prompt.ts`)
The Defense AI is a SOC analyst that responds to attacks with:

- **Defence Mode** — Rookie (gentle guidance), SOC Analyst (triage-focused), Autonomous (decisive containment), Adversarial (stress-test coaching)
- **Aggression** — 0-100 slider from passive → moderate → aggressive
- **Alert Sensitivity** — Low (high-confidence only), Medium (balanced), High (proactive warnings)
- **Feature Toggles** — Auto-blocking, post-mortem reports, real-time alerts, difficulty scaling

Both agents use **Groq's LLaMA 3.1 8B** for fast, low-latency inference and are designed to **never repeat** previous messages within a session.

---

## 🗄️ Database Schema

```sql
users              →  Profiles, XP, levels, scores, roles
lab_sessions       →  Attack/defender scores, grades, durations
task_completions   →  Per-task answers and completion timestamps
quiz_results       →  Per-question results with correctness
user_badges        →  Achievement badges (8 types)
agent_settings     →  Per-user AI agent configuration (JSONB)
leaderboard        →  Materialized view for rankings
```

All tables use **Row-Level Security (RLS)** — users can only access their own data. Service role key is used for admin operations.

---

## 🏅 Badge System

| Badge | Requirement |
|:------|:------------|
| 🎯 **First Blood** | Complete your first lab |
| ⚡ **Speed Run** | Complete a lab in under 15 minutes |
| 🛡️ **Defender** | Score 80+ on the defender metric |
| 🧠 **Quiz Ace** | Score 5/5 on any quiz |
| 🔥 **Persistent** | Complete 5+ sessions |
| 💀 **Elite Hacker** | Complete all advanced labs |
| 👻 **Ghost** | Complete a lab with 0 defender alerts |
| 🏆 **CTF Champion** | Win a CTF event |

---

## 📜 Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `cd gateway && npm run dev` | Start WebSocket gateway (port 4000) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-lab`)
3. Commit your changes (`git commit -m 'Add new ransomware lab'`)
4. Push to the branch (`git push origin feature/awesome-lab`)
5. Open a Pull Request

---

## 📄 License

This project is built for **educational purposes only**. All attack simulations run in sandboxed environments. Do not use any techniques learned here against systems you do not own or have explicit authorization to test.

---

<p align="center">
  <img src="https://img.shields.io/badge/HACK-DEFEND-MASTER-00ff88?style=for-the-badge&labelColor=0a1628" alt="Hack. Defend. Master." />
</p>

<p align="center">
  <sub>Built with ❤️</sub>
</p>
