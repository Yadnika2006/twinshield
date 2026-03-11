"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ── Matrix Rain ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコ";
    const fontSize = 13;
    let cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1);

    const draw = () => {
      cols = Math.floor(canvas.width / fontSize);
      while (drops.length < cols) drops.push(1);

      ctx.fillStyle = "rgba(10,22,40,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff88";
      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const c = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(c, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
          drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 45);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── Smooth scroll helper ── */
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* ── Authentication Handlers ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      setError("Invalid credentials");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Call our custom registration API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to register");
        setIsLoading(false);
        return;
      }

      // 2. SignIn automatically
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError("Account created, but login failed. Please login manually.");
        setIsLoginMode(true);
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <>
      <canvas id="matrix-bg" ref={canvasRef} />

      {/* ════════════════════════════════
          NAVBAR
      ════════════════════════════════ */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="shield-icon">⬡</span>TWINSHIELD
        </div>
        <div className="nav-links">
          <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo("features"); }}>Features</a>
          <a href="#agents" onClick={(e) => { e.preventDefault(); scrollTo("agents"); }}>Agents</a>
          <a href="#how" onClick={(e) => { e.preventDefault(); scrollTo("how"); }}>How It Works</a>
          <a href="#login" onClick={(e) => { e.preventDefault(); scrollTo("login"); }}>Lab Access</a>
        </div>
      </nav>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section id="hero" className="landing-section">
        <div className="scanline" />

        {/* Hex decorations */}
        <svg className="hex-deco left" viewBox="0 0 200 200">
          <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" fill="none" stroke="#00d4ff" strokeWidth="1" />
          <polygon points="100,30 170,65 170,135 100,170 30,135 30,65" fill="none" stroke="#00d4ff" strokeWidth="0.5" />
        </svg>
        <svg className="hex-deco right" viewBox="0 0 200 200">
          <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" fill="none" stroke="#00ff88" strokeWidth="1" />
          <polygon points="100,30 170,65 170,135 100,170 30,135 30,65" fill="none" stroke="#00ff88" strokeWidth="0.5" />
        </svg>

        <p className="hero-eyebrow">Digital Twin Cybersecurity Framework</p>

        <h1 className="hero-title">
          <span className="t1">
            TWIN
            <br />
            SHIELD
          </span>
          <span className="t2">Hack. Defend. Master.</span>
        </h1>

        <p className="hero-sub">
          A live dual-view cybersecurity lab where you see the{" "}
          <span>victim&apos;s world</span> and the{" "}
          <span>attacker&apos;s terminal</span> simultaneously. Real attacks.
          Real defences. Real skills.
        </p>

        <div className="hero-badges">
          <span className="badge">🎯 Dual-View Attack Lab</span>
          <span className="badge">🤖 AI Agents</span>
          <span className="badge">🛡️ Live Defence Simulation</span>
          <span className="badge">🎓 Skill Assessment</span>
        </div>

        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => scrollTo("login")}>
            ▶ Login
          </button>
          <button className="btn-secondary" onClick={() => scrollTo("features")}>
            Explore Features
          </button>
        </div>

        <div className="scroll-ind">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* ════════════════════════════════
          TERMINAL PREVIEW
      ════════════════════════════════ */}
      <div className="terminal-preview-wrapper">
        <div className="terminal-preview">
          <div className="term-bar">
            <div className="term-dot r" />
            <div className="term-dot y" />
            <div className="term-dot g" />
            <span className="term-title">
              TWINSHIELD LAB — SESSION #4471 — SQLStorm Scenario
            </span>
          </div>
          <div className="term-body">
            {/* Victim column */}
            <div className="term-col victim">
              <div className="term-col-label">◈ VICTIM VIEW — LIVE TWIN</div>
              <span className="tc-line v">🌐 CorpBank Portal — Login</span>
              <span className="tc-line d">Username: admin</span>
              <span className="tc-line d">Password: ••••••••</span>
              <span className="tc-line w">⚠ Unusual login attempt detected</span>
              <span className="tc-line v">✓ Authentication bypassed</span>
              <span className="tc-line w">⚠ Database query anomaly logged</span>
              <span className="tc-line d">📁 /var/data/users.db — EXPOSED</span>
            </div>
            {/* Attacker column */}
            <div className="term-col attacker">
              <div className="term-col-label">◈ ATTACKER TERMINAL</div>
              <span className="tc-line d">$ nmap -sV 192.168.1.10</span>
              <span className="tc-line a">[+] PORT 80/tcp  open  http</span>
              <span className="tc-line d">$ sqlmap -u http://target/login</span>
              <span className="tc-line a">[+] SQLi found: POST param &apos;user&apos;</span>
              <span className="tc-line a">[+] Backend DBMS: SQLite 3.x</span>
              <span className="tc-line a">[+] Dumping table: users</span>
              <span className="tc-line d">
                <span className="cursor-blink" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          STATS BAR
      ════════════════════════════════ */}
      <section id="stats" className="landing-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-num">12+</span>
            <span className="stat-label">Attack Scenarios</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">2</span>
            <span className="stat-label">AI Agents</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">4</span>
            <span className="stat-label">Defence Modes</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">100%</span>
            <span className="stat-label">Isolated Sandboxes</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURES
      ════════════════════════════════ */}
      <section id="features" className="landing-section">
        <div className="features-inner">
          <div className="features-header">
            <p className="section-label">// Core Capabilities</p>
            <h2 className="section-title">Built For Real-World Cyber Training</h2>
            <p style={{ color: "var(--dim)", fontSize: "0.9rem", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Every feature is designed around one principle — seeing both sides
              of an attack makes you a better defender.
            </p>
          </div>
          <div className="features-grid">
            {[
              { icon: "⚡", name: "Dual-View Lab", tag: "Core Feature", desc: "See the victim's UI and the attacker's terminal side-by-side in real time. Every command causes a visible reaction on the victim side." },
              { icon: "🤖", name: "AI Agent System", tag: "AI Powered", desc: "MentorAI guides your attack methodology. GuardianAI defends, alerts, and coaches — both adapting to your skill level live." },
              { icon: "🛡️", name: "SOC Simulation", tag: "Defence", desc: "GuardianAI fires real SIEM-style alerts, builds an incident timeline, and generates post-mortem reports after every session." },
              { icon: "🎯", name: "Scenario Library", tag: "12+ Scenarios", desc: "SQLi, phishing, ransomware, MitM, CVE exploitation — each with a realistic victim twin environment tailored to the attack type." },
              { icon: "🏆", name: "CTF Mode", tag: "Competitive", desc: "Timed challenges, stealth scoring, hidden flags. Compete solo or in red vs blue team pairs. Full leaderboard and ranking system." },
              { icon: "📊", name: "Instructor Dashboard", tag: "Education", desc: "Watch all student sessions live, assign scenarios, auto-grade with AI, and export cohort skill gap analytics as reports." },
            ].map((f) => (
              <div className="feature-card" key={f.name}>
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-name">{f.name}</div>
                <p className="feature-desc">{f.desc}</p>
                <span className="feature-tag">{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          AGENTS
      ════════════════════════════════ */}
      <section id="agents" className="landing-section">
        <div className="agents-inner">
          <div className="agents-header">
            <p className="section-label">// AI Agent System</p>
            <h2 className="section-title">Two Agents. One Battlefield.</h2>
            <p style={{ color: "var(--dim)", fontSize: "0.9rem", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              MentorAI and GuardianAI work in opposition — creating a live
              adversarial simulation inside every lab session.
            </p>
          </div>
          <div className="agents-grid">
            {/* MENTORAI */}
            <div className="agent-card purple">
              <span className="agent-sigil">🧠</span>
              <div className="agent-name">MENTORAI</div>
              <div className="agent-role">// Cybersecurity Educator</div>
              <ul className="agent-abilities">
                <li>Explains the psychological factors of each attack</li>
                <li>Connects attacks to famous real-world breaches</li>
                <li>Contextual step-by-step guidance on techniques</li>
                <li>Multiple teaching modes from observe to deep-dive</li>
                <li>Generates full post-lesson learning summaries</li>
              </ul>
            </div>
            {/* GUARDIANAI */}
            <div className="agent-card blue-g">
              <span className="agent-sigil">🛡️</span>
              <div className="agent-name">GUARDIANAI</div>
              <div className="agent-role">// Defence Agent</div>
              <ul className="agent-abilities">
                <li>Detects attacks and fires SIEM-style alerts</li>
                <li>Blocks IPs, kills processes, rotates credentials</li>
                <li>4 modes: Rookie → SOC Analyst → Autonomous → PvP</li>
                <li>Generates full incident post-mortem reports</li>
                <li>Scales difficulty to your skill level automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════ */}
      <section id="how" className="landing-section">
        <div className="how-inner">
          <div className="how-header">
            <p className="section-label">// Workflow</p>
            <h2 className="section-title">How TwinShield Works</h2>
          </div>
          <div className="how-steps">
            {[
              { num: "01", title: "Choose Scenario", desc: "Pick an attack scenario and difficulty level from the library" },
              { num: "02", title: "Lab Spins Up", desc: "A Docker sandbox creates your isolated victim twin in seconds" },
              { num: "03", title: "Attack & Observe", desc: "Run real tools in the terminal while watching the victim react live" },
              { num: "04", title: "Get Assessed", desc: "GuardianAI generates your full incident report and skill score" },
            ].map((s) => (
              <div className="how-step" key={s.num}>
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          LOGIN
      ════════════════════════════════ */}
      <section id="login" className="landing-section">
        <div className="login-inner">
          <h2 className="section-title" style={{ textAlign: "center", marginBottom: 40 }}>
            Enter the Lab
          </h2>

          <div className="auth-wrapper">
            {/* ── LOGIN FORM ───────────────────────── */}
            <form
              className={`auth-form ${isLoginMode ? "active" : "inactive-out"}`}
              onSubmit={handleLogin}
            >
              <div className="login-title orbitron-blue">AUTHENTICATE</div>

              <div className="input-group">
                <label>EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="agent@twinshield.net"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && isLoginMode && (
                <div style={{ color: "#ff4444", fontSize: "0.85rem", marginTop: "-10px", marginBottom: "10px", textAlign: "center", fontFamily: "'Share Tech Mono', monospace" }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-login shimmer" disabled={isLoading}>
                <span>{isLoading ? "▶ CONNECTING..." : "▶ INITIALIZE SESSION"}</span>
              </button>

              <div className="divider">
                <span>— or continue with —</span>
              </div>

              <button type="button" className="btn btn-oauth" onClick={handleGoogleLogin}>
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <div className="toggle-text">
                New operator?{" "}
                <button type="button" className="toggle-btn" onClick={() => { setIsLoginMode(false); setError(null); }}>
                  Register Access &rarr;
                </button>
              </div>
            </form>

            {/* ── SIGNUP FORM ──────────────────────── */}
            <form
              className={`auth-form ${!isLoginMode ? "active" : "inactive-in"}`}
              onSubmit={handleSignup}
            >
              <div className="login-title orbitron-green">REGISTER</div>

              <div className="input-group">
                <label>FULL NAME</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="agent@twinshield.net"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="input-group">
                  <label>PASSWORD</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>CONFIRM PASSWORD</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>ROLE</label>
                <select
                  required
                  className="styled-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>Select Designation...</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="ctf">CTF Competitor</option>
                </select>
              </div>

              {error && !isLoginMode && (
                <div style={{ color: "#ff4444", fontSize: "0.85rem", marginTop: "-10px", marginBottom: "10px", textAlign: "center", fontFamily: "'Share Tech Mono', monospace" }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-register shimmer" disabled={isLoading}>
                <span>{isLoading ? "▶ DEPLOYING..." : "▶ CREATE PROFILE"}</span>
              </button>

              <div className="divider">
                <span>— or continue with —</span>
              </div>

              <button type="button" className="btn btn-oauth" onClick={handleGoogleLogin}>
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <div className="toggle-text">
                Already registered?{" "}
                <button type="button" className="toggle-btn" onClick={() => { setIsLoginMode(true); setError(null); }}>
                  Login &rarr;
                </button>
              </div>
            </form>
          </div>

          <style jsx>{`
            .auth-wrapper {
              position: relative;
              width: 100%;
              max-width: 440px;
              margin: 0 auto;
              min-height: 540px;
              display: grid;
              background: rgba(9, 26, 46, 0.85);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(0, 212, 255, 0.2);
              padding: 40px;
              overflow: hidden;
            }
            .auth-wrapper::before {
              content: "";
              position: absolute;
              top: 0; left: 0; width: 100%; height: 3px;
              background: linear-gradient(90deg, #00d4ff, #00ff88);
            }
            .auth-form {
              grid-area: 1 / 1;
              display: flex;
              flex-direction: column;
              gap: 16px;
              transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .auth-form.active {
              opacity: 1;
              transform: translateX(0);
              pointer-events: auto;
              visibility: visible;
            }
            .auth-form.inactive-out {
              opacity: 0;
              transform: translateX(-40px);
              pointer-events: none;
              visibility: hidden;
            }
            .auth-form.inactive-in {
              opacity: 0;
              transform: translateX(40px);
              pointer-events: none;
              visibility: hidden;
            }
            .orbitron-blue { color: #00d4ff; font-family: 'Orbitron', sans-serif; font-size: 1.6rem; letter-spacing: 2px; font-weight: 700; margin-bottom: 6px; text-align: center; }
            .orbitron-green { color: #00ff88; font-family: 'Orbitron', sans-serif; font-size: 1.6rem; letter-spacing: 2px; font-weight: 700; margin-bottom: 6px; text-align: center; }
            
            .input-group { display: flex; flex-direction: column; gap: 6px; }
            .input-group label { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #6b86a0; letter-spacing: 1px; }
            
            .auth-wrapper input, .auth-wrapper .styled-select {
              background: #050f1c;
              border: 1px solid rgba(0, 212, 255, 0.3);
              color: #fff;
              font-family: 'Share Tech Mono', monospace;
              font-size: 0.9rem;
              padding: 12px 14px;
              outline: none;
              width: 100%;
              clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
              transition: all 0.3s ease;
            }
            .auth-wrapper input::placeholder { color: rgba(200, 230, 240, 0.2); }
            .auth-wrapper input:focus, .auth-wrapper .styled-select:focus {
              border-color: #00d4ff;
              box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
              background: rgba(0, 212, 255, 0.05);
            }
            .auth-wrapper .styled-select option { background: #091a2e; color: #fff; }

            .auth-wrapper .btn {
              font-family: 'Orbitron', sans-serif;
              font-weight: 700;
              font-size: 0.85rem;
              letter-spacing: 1px;
              padding: 14px;
              border: none;
              color: #050f1c;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
              transition: transform 0.2s;
              margin-top: 5px;
            }
            .auth-wrapper .btn:active { transform: scale(0.98); }
            .auth-wrapper .btn span { position: relative; z-index: 2; }
            .btn-login { background: linear-gradient(90deg, #00d4ff, #00ff88); }
            .btn-register { background: linear-gradient(90deg, #00ff88, #00d4ff); }
            .btn-oauth {
              background: #ffffff !important;
              color: #3c4043 !important;
              font-family: 'Roboto', 'Exo 2', sans-serif !important;
              font-weight: 500 !important;
              letter-spacing: normal !important;
              border: 1px solid #dadce0 !important;
              border-radius: 4px !important;
              clip-path: none !important;
              box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15) !important;
            }
            .btn-oauth:hover { background: #f8f9fa !important; box-shadow: 0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15) !important; }

            .shimmer::after, .shimmer-white::after {
              content: ""; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
              background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent);
              transform: skewX(-20deg); z-index: 1;
            }
            .shimmer-white::after { background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent); }
            .auth-wrapper .btn:hover::after { animation: sweep 0.6s ease-out; }
            @keyframes sweep { 100% { left: 200%; } }

            .divider { text-align: center; position: relative; margin: 5px 0; }
            .divider span { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #6b86a0; background: #091a2e; padding: 0 10px; position: relative; z-index: 1; }
            .divider::before { content: ""; position: absolute; top: 50%; left: 0; width: 100%; height: 1px; background: rgba(0, 212, 255, 0.2); z-index: 0; }

            .toggle-text { text-align: center; font-size: 0.85rem; color: #6b86a0; margin-top: 10px; }
            .toggle-btn { background: none; border: none; color: #c8e6f0; font-family: 'Exo 2', sans-serif; font-size: 0.85rem; font-weight: 600; cursor: pointer; padding: 0; }
            .toggle-btn:hover { color: #fff; text-decoration: underline; }
          `}</style>
        </div>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer>
        <div className="footer-logo">⬡ TWINSHIELD</div>
        <div className="footer-copy">
          © 2025 TwinShield Lab · All simulations run in isolated sandboxes
        </div>
        <div className="footer-links">
          <a href="#" onClick={(e) => e.preventDefault()}>Docs</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Scenarios</a>
          <a href="#" onClick={(e) => e.preventDefault()}>API</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Contact</a>
        </div>
      </footer>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18" style={{ position: 'relative', zIndex: 2 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}
