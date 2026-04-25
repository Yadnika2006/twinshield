"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useEffect, useMemo, useState } from "react";

interface LeaderboardEntry {
  id?: string;
  user_id?: string;
  name?: string;
  score?: number;
  level?: number;
  rank?: number;
  total_sessions?: number;
}

interface UserStats {
  totalSessions: number;
  totalScore: number;
  level: number;
  xp: number;
  rank: number | null;
  recentSessions: {
    id: string;
    scenario_id: string;
    started_at: string;
    ended_at: string | null;
    grade?: string;
  }[];
}

type ChallengeStatus = "UNSOLVED" | "ATTEMPTED" | "SOLVED";
type ChallengeFilter = "ALL" | "WEB" | "FORENSICS" | "OSINT";
type ChallengeId = "loginbreaker-01" | "phishmaster-01" | "cookiemonster-01" | "xssploit-01" | "mitmbreaker-01";

interface Challenge {
  id: ChallengeId;
  name: string;
  category: string;
  filter: Exclude<ChallengeFilter, "ALL">;
  diff: "Easy" | "Medium" | "Hard";
  pts: number;
  solves: number;
  successRate: number;
  description: string;
  hints: [string, string, string];
  flag: string;
  timerMinutes?: number;
  diffColor: string;
}

interface ChallengeProgress {
  status: ChallengeStatus;
  hintsUnlocked: number;
  startedAt: number | null;
  solvedAt: string | null;
  timeTakenMs: number | null;
  earnedPoints: number | null;
}

type FlagMessage = { type: "success" | "error"; text: string } | null;

const CTF_CHALLENGES: Challenge[] = [
  {
    id: "loginbreaker-01",
    name: "LoginBreaker",
    category: "SQL Injection",
    filter: "WEB",
    diff: "Easy",
    pts: 100,
    solves: 47,
    successRate: 61,
    description:
      "A corporate login portal is vulnerable. The dev left a classic mistake in the query. Find it and authenticate as admin without knowing the password.",
    hints: [
      "Try typing a single quote in the username field",
      "SQL uses OR to chain conditions",
      "Try: ' OR '1'='1 as the username",
    ],
    flag: "FLAG{sql_bypass_admin}",
    diffColor: "#00ff88",
  },
  {
    id: "phishmaster-01",
    name: "PhishMaster",
    category: "Phishing",
    filter: "OSINT",
    diff: "Easy",
    pts: 150,
    solves: 89,
    successRate: 64,
    description:
      "You've received a suspicious email from security@c0rpbank.com. Analyse the headers, sender domain, and link destination to identify all phishing indicators and capture the flag.",
    hints: [
      "Emails have more than just a body",
      "Look at where the email actually came from",
      "Check every header line — flags can hide anywhere",
    ],
    flag: "FLAG{homograph_attack_detected}",
    diffColor: "#00ff88",
  },
  {
    id: "cookiemonster-01",
    name: "CookieMonster",
    category: "Session Hijack",
    filter: "WEB",
    diff: "Medium",
    pts: 200,
    solves: 24,
    successRate: 31,
    description:
      "A session cookie was intercepted on an open WiFi network. Decode it, identify the vulnerability, and use it to hijack the admin session.",
    hints: [
      "The cookie value looks like Base64",
      "Decode it and read what's inside",
      "Change the user value and re-encode it",
    ],
    flag: "FLAG{session_fixation_pwned}",
    timerMinutes: 45,
    diffColor: "#ffcc00",
  },
  {
    id: "xssploit-01",
    name: "XSSploit",
    category: "Cross-Site Scripting",
    filter: "WEB",
    diff: "Medium",
    pts: 200,
    solves: 17,
    successRate: 29,
    description:
      "A comment field on a banking app reflects user input without sanitisation. Craft a payload that steals the admin's session cookie.",
    hints: [
      "The comment field reflects your input",
      "JavaScript can access browser cookies",
      "Try using document.cookie in your script tag",
    ],
    flag: "FLAG{xss_cookie_stolen}",
    timerMinutes: 45,
    diffColor: "#ffcc00",
  },
  {
    id: "mitmbreaker-01",
    name: "MitMBreaker",
    category: "Man-in-the-Middle",
    filter: "FORENSICS",
    diff: "Hard",
    pts: 350,
    solves: 8,
    successRate: 12,
    description:
      "ARP poisoning is active on the network. Analyse the intercepted traffic, identify the attacker's MAC, and extract the credentials from the plaintext HTTP session.",
    hints: [
      "Filter the packets by protocol",
      "HTTP POST requests carry credentials",
      "Click on a packet to expand its full headers",
    ],
    flag: "FLAG{arp_poison_cracked}",
    timerMinutes: 60,
    diffColor: "#ff4444",
  },
];

const INITIAL_COOKIE_VALUE = "eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoidXNlciJ9";

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatTimeTaken(ms: number | null): string {
  if (!ms) return "00:00";
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function safeDecodeBase64(value: string): string | null {
  try {
    return atob(value);
  } catch {
    return null;
  }
}

function safeEncodeBase64(value: string): string | null {
  try {
    return btoa(value);
  } catch {
    return null;
  }
}

export default function CtfPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState<ChallengeFilter>("ALL");
  const [selectedChallengeId, setSelectedChallengeId] = useState<ChallengeId | null>(null);
  const [flagInput, setFlagInput] = useState("");
  const [flagMessage, setFlagMessage] = useState<FlagMessage>(null);
  const [tick, setTick] = useState(Date.now());

  const [challengeProgress, setChallengeProgress] = useState<Record<ChallengeId, ChallengeProgress>>(() => ({
    "loginbreaker-01": { status: "UNSOLVED", hintsUnlocked: 0, startedAt: null, solvedAt: null, timeTakenMs: null, earnedPoints: null },
    "phishmaster-01": { status: "UNSOLVED", hintsUnlocked: 0, startedAt: null, solvedAt: null, timeTakenMs: null, earnedPoints: null },
    "cookiemonster-01": { status: "UNSOLVED", hintsUnlocked: 0, startedAt: null, solvedAt: null, timeTakenMs: null, earnedPoints: null },
    "xssploit-01": { status: "UNSOLVED", hintsUnlocked: 0, startedAt: null, solvedAt: null, timeTakenMs: null, earnedPoints: null },
    "mitmbreaker-01": { status: "UNSOLVED", hintsUnlocked: 0, startedAt: null, solvedAt: null, timeTakenMs: null, earnedPoints: null },
  }));

  const [sqlUsername, setSqlUsername] = useState("");
  const [sqlPassword, setSqlPassword] = useState("");
  const [sqlResult, setSqlResult] = useState<{ type: "success" | "error" | "warning"; text: string } | null>(null);
  const [showSqlSource, setShowSqlSource] = useState(false);

  const [phishView, setPhishView] = useState<"email" | "headers">("email");

  const [cookieTab, setCookieTab] = useState<"cookies" | "decoder">("cookies");
  const [cookieInput, setCookieInput] = useState(INITIAL_COOKIE_VALUE);
  const [decodedCookieText, setDecodedCookieText] = useState('{"user":"guest","role":"user"}');
  const [cookieJson, setCookieJson] = useState('{"user":"guest","role":"user"}');
  const [cookieStatus, setCookieStatus] = useState<string>("");
  const [cookieAdminUnlocked, setCookieAdminUnlocked] = useState(false);

  const [xssInput, setXssInput] = useState("");
  const [xssComments, setXssComments] = useState<string[]>(["Great service! — user123", "Very helpful — jane_doe"]);
  const [xssAlertText, setXssAlertText] = useState<string | null>(null);
  const [xssCookieVisible, setXssCookieVisible] = useState(false);

  const [mitmFilterInput, setMitmFilterInput] = useState("");
  const [mitmFilterApplied, setMitmFilterApplied] = useState("");
  const [selectedPacketNo, setSelectedPacketNo] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [lbRes, statsRes, ctfRes] = await Promise.all([
          fetch("/api/leaderboard"),
          fetch("/api/user/stats"),
          fetch("/api/ctf/progress"),
        ]);
        if (lbRes.ok) {
          const lbData = await lbRes.json();
          setLeaderboard(lbData);
        }
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setUserStats(statsData);
        }
        if (ctfRes.ok) {
          const ctfData = await ctfRes.json();
          // Restore CTF progress from backend
          if (ctfData.progress && Array.isArray(ctfData.progress)) {
            const progress = ctfData.progress;
            setChallengeProgress((prev) => {
              const updated = { ...prev };
              for (const attempt of progress) {
                const challengeId = attempt.challenge_id as keyof typeof updated;
                if (updated[challengeId]) {
                  updated[challengeId] = {
                    ...updated[challengeId],
                    status: attempt.is_correct ? "SOLVED" : "ATTEMPTED",
                    hintsUnlocked: attempt.hints_used || 0,
                    earnedPoints: attempt.points_earned || 0,
                  };
                }
              }
              return updated;
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch CTF data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedChallenge = selectedChallengeId
    ? CTF_CHALLENGES.find((challenge) => challenge.id === selectedChallengeId) || null
    : null;

  const selectedProgress = selectedChallenge ? challengeProgress[selectedChallenge.id] : null;
  const isLastSelectedChallenge =
    selectedChallenge
      ? CTF_CHALLENGES.findIndex((challenge) => challenge.id === selectedChallenge.id) === CTF_CHALLENGES.length - 1
      : false;

  const remainingMs =
    selectedChallenge && selectedChallenge.timerMinutes && selectedProgress?.startedAt
      ? Math.max(0, selectedProgress.startedAt + selectedChallenge.timerMinutes * 60_000 - tick)
      : null;

  const isTimerExpired = Boolean(selectedChallenge?.timerMinutes && remainingMs !== null && remainingMs <= 0);

  useEffect(() => {
    if (!selectedChallenge || !selectedChallenge.timerMinutes) return;
    const intervalId = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, [selectedChallenge]);

  useEffect(() => {
    if (!selectedChallengeId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedChallengeId]);

  const solvedCount = CTF_CHALLENGES.filter((challenge) => challengeProgress[challenge.id].status === "SOLVED").length;
  const progressPct = Math.round((solvedCount / CTF_CHALLENGES.length) * 100);

  const filteredChallenges = activeFilter === "ALL"
    ? CTF_CHALLENGES
    : CTF_CHALLENGES.filter((challenge) => challenge.filter === activeFilter);

  const mitmPackets = useMemo(
    () => [
      { no: 1, time: "0.000", src: "192.168.1.105", dst: "192.168.1.1", protocol: "ARP", info: "Who has 192.168.1.1?" },
      { no: 2, time: "0.001", src: "192.168.1.200", dst: "192.168.1.105", protocol: "ARP", info: "192.168.1.1 is at aa:bb:cc:dd:ee:ff" },
      { no: 3, time: "0.003", src: "192.168.1.105", dst: "93.184.216.34", protocol: "HTTP", info: "POST /login HTTP/1.1" },
      { no: 4, time: "0.004", src: "192.168.1.200", dst: "192.168.1.105", protocol: "ARP", info: "192.168.1.1 is at aa:bb:cc:dd:ee:ff" },
      { no: 5, time: "0.007", src: "192.168.1.105", dst: "93.184.216.34", protocol: "HTTP", info: "GET /dashboard HTTP/1.1" },
      { no: 6, time: "0.009", src: "93.184.216.34", dst: "192.168.1.105", protocol: "HTTP", info: "HTTP/1.1 200 OK" },
    ],
    []
  );

  const visibleMitmPackets = mitmPackets.filter((packet) => {
    if (!mitmFilterApplied.trim()) return true;
    const q = mitmFilterApplied.toLowerCase();
    return (
      packet.protocol.toLowerCase().includes(q) ||
      packet.info.toLowerCase().includes(q) ||
      packet.src.toLowerCase().includes(q) ||
      packet.dst.toLowerCase().includes(q)
    );
  });

  function resetEnvironmentStates() {
    setSqlUsername("");
    setSqlPassword("");
    setSqlResult(null);
    setShowSqlSource(false);

    setPhishView("email");

    setCookieTab("cookies");
    setCookieInput(INITIAL_COOKIE_VALUE);
    setDecodedCookieText('{"user":"guest","role":"user"}');
    setCookieJson('{"user":"guest","role":"user"}');
    setCookieStatus("");
    setCookieAdminUnlocked(false);

    setXssInput("");
    setXssComments(["Great service! — user123", "Very helpful — jane_doe"]);
    setXssAlertText(null);
    setXssCookieVisible(false);

    setMitmFilterInput("");
    setMitmFilterApplied("");
    setSelectedPacketNo(null);
  }

  function closeModal() {
    setSelectedChallengeId(null);
    setFlagInput("");
    setFlagMessage(null);
  }

  function handleLaunchChallenge(challenge: Challenge) {
    setChallengeProgress((prev) => {
      const current = prev[challenge.id];
      const startedAt = current.startedAt ?? Date.now();
      return {
        ...prev,
        [challenge.id]: {
          ...current,
          startedAt,
          status: current.status === "SOLVED" ? "SOLVED" : "ATTEMPTED",
        },
      };
    });

    resetEnvironmentStates();
    setSelectedChallengeId(challenge.id);
    setFlagInput("");
    setFlagMessage(null);
  }

  function handleNextChallenge() {
    if (!selectedChallenge) return;

    const currentIndex = CTF_CHALLENGES.findIndex((challenge) => challenge.id === selectedChallenge.id);
    if (currentIndex === -1) return;

    if (currentIndex === CTF_CHALLENGES.length - 1) {
      closeModal();
      return;
    }

    const nextIndex = currentIndex + 1;
    handleLaunchChallenge(CTF_CHALLENGES[nextIndex]);
  }

  function handleUnlockHint() {
    if (!selectedChallenge) return;
    setChallengeProgress((prev) => {
      const current = prev[selectedChallenge.id];
      if (current.hintsUnlocked >= 3) return prev;
      return {
        ...prev,
        [selectedChallenge.id]: {
          ...current,
          hintsUnlocked: current.hintsUnlocked + 1,
        },
      };
    });
  }

  async function handleSubmitFlag() {
    if (!selectedChallenge) return;
    const entered = flagInput.trim();
    
    try {
      // Submit to backend
      const response = await fetch("/api/ctf/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: selectedChallenge.id,
          flagSubmitted: entered,
          hintsUsed: challengeProgress[selectedChallenge.id].hintsUnlocked,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setFlagMessage({ type: "error", text: result.error || "Submission failed" });
        return;
      }

      if (!result.isCorrect) {
        setFlagMessage({ type: "error", text: "✗ Wrong flag — keep digging" });
        setChallengeProgress((prev) => {
          const current = prev[selectedChallenge.id];
          if (current.status === "SOLVED") return prev;
          return {
            ...prev,
            [selectedChallenge.id]: {
              ...current,
              status: "ATTEMPTED",
              startedAt: current.startedAt ?? Date.now(),
            },
          };
        });
        return;
      }

      // Correct flag!
      setChallengeProgress((prev) => {
        const current = prev[selectedChallenge.id];
        const now = Date.now();
        const startedAt = current.startedAt ?? now;
        const awarded = result.pointsEarned || selectedChallenge.pts;

        setFlagMessage({ type: "success", text: `🏁 Flag Captured! +${awarded} added to backend` });

        return {
          ...prev,
          [selectedChallenge.id]: {
            ...current,
            status: "SOLVED",
            solvedAt: current.solvedAt ?? new Date(now).toISOString(),
            startedAt,
            timeTakenMs: current.timeTakenMs ?? now - startedAt,
            earnedPoints: current.earnedPoints ?? awarded,
          },
        };
      });
    } catch (error) {
      console.error("Error submitting flag:", error);
      setFlagMessage({ type: "error", text: "Network error: could not submit flag" });
    }
  }

  function handleLoginBreakerAttempt() {
    const user = sqlUsername.trim();
    const hasQuote = user.includes("'");
    const hasOr = /\bor\b/i.test(user);
    const hasDash = user.includes("--");

    if (hasQuote && (hasOr || hasDash)) {
      setSqlResult({ type: "success", text: "Welcome, admin. Your session token: FLAG{sql_bypass_admin}" });
      return;
    }

    if (hasQuote && !hasOr && !hasDash) {
      setSqlResult({ type: "warning", text: "Syntax error near '' in SQL statement." });
      return;
    }

    setSqlResult({ type: "error", text: "Invalid credentials. Access denied." });
  }

  function decodeCookiePayload() {
    const decoded = safeDecodeBase64(cookieInput.trim());
    if (!decoded) {
      setCookieStatus("Decode failed: invalid Base64 value");
      return;
    }

    setDecodedCookieText(decoded);
    setCookieJson(decoded);
    setCookieStatus("Decoded successfully");
  }

  function encodeCookiePayload() {
    try {
      const parsed = JSON.parse(cookieJson) as Record<string, unknown>;
      const encoded = safeEncodeBase64(JSON.stringify(parsed));
      if (!encoded) {
        setCookieStatus("Encode failed");
        return;
      }
      setCookieInput(encoded);
      setCookieStatus("Encoded and ready to apply");
    } catch {
      setCookieStatus("JSON format invalid");
    }
  }

  function applyCookiePayload() {
    const decoded = safeDecodeBase64(cookieInput.trim());
    if (!decoded) {
      setCookieStatus("Cannot apply: cookie value is invalid Base64");
      return;
    }

    try {
      const parsed = JSON.parse(decoded) as { user?: string; role?: string };
      const user = String(parsed.user || "").toLowerCase();
      const role = String(parsed.role || "").toLowerCase();
      const isAdmin = user.includes("admin") || role.includes("admin");

      if (isAdmin) {
        setCookieAdminUnlocked(true);
        setCookieStatus("Admin session applied. Dashboard privilege escalated.");
        return;
      }

      setCookieAdminUnlocked(false);
      setCookieStatus("Cookie applied, but still low-privilege session.");
    } catch {
      setCookieStatus("Decoded payload is not valid JSON");
    }
  }

  function postXssComment() {
    const value = xssInput.trim();
    if (!value) return;

    const lowered = value.toLowerCase();
    const hasScript = lowered.includes("<script>");
    const hasCookie = lowered.includes("document.cookie") || lowered.includes("cookie");
    const hasAlert = lowered.includes("alert");

    if (hasScript && hasCookie) {
      setXssAlertText("admin_session=FLAG{xss_cookie_stolen}; path=/");
      setXssCookieVisible(true);
      setXssInput("");
      return;
    }

    if (hasScript && hasAlert) {
      setXssAlertText("XSS works! Now try stealing the cookie...");
      setXssInput("");
      return;
    }

    setXssComments((prev) => [`${value} — guest_user`, ...prev]);
    setXssInput("");
  }

  function renderLoginBreakerEnv() {
    return (
      <div className="env-shell">
        <h4 className="env-title">CorpBank Employee Portal</h4>
        <div className="env-login-grid">
          <label>Username</label>
          <input value={sqlUsername} onChange={(event) => setSqlUsername(event.target.value)} className="env-input" />
          <label>Password</label>
          <input type="password" value={sqlPassword} onChange={(event) => setSqlPassword(event.target.value)} className="env-input" />
          <button className="btn-solid env-btn" onClick={handleLoginBreakerAttempt}>LOGIN</button>
          <button className="env-link-btn" onClick={() => setShowSqlSource((prev) => !prev)}>View Page Source</button>
        </div>

        {sqlResult && <div className={`env-msg ${sqlResult.type}`}>{sqlResult.text}</div>}
        {showSqlSource && (
          <pre className="env-code">
{`<form id="login">
  <!-- SELECT * FROM users WHERE username='{input}' AND password='{pass}' -->
</form>`}
          </pre>
        )}
      </div>
    );
  }

  function renderPhishMasterEnv() {
    return (
      <div className="env-shell">
        <div className="env-tab-row">
          <button className={`env-tab ${phishView === "email" ? "active" : ""}`} onClick={() => setPhishView("email")}>View Email</button>
          <button className={`env-tab ${phishView === "headers" ? "active" : ""}`} onClick={() => setPhishView("headers")}>View Raw Headers</button>
        </div>

        {phishView === "email" ? (
          <div className="email-card">
            <div><b>From:</b> security@c0rpbank.com</div>
            <div><b>Subject:</b> Urgent: Verify your account immediately</div>
            <div><b>Date:</b> Mar 10 2026</div>
            <hr />
            <p>Dear Employee,</p>
            <p>We detected unusual login activity. Verify your account in 10 minutes to avoid suspension.</p>
            <p><a href="#" onClick={(event) => event.preventDefault()}>https://corpbank.com/verify</a></p>
            <p>— CorpBank Security Team</p>
          </div>
        ) : (
          <pre className="env-code scrollable">
{`Received: from mail.c0rpbank.com (suspicious-server-94.ru)
Reply-To: attacker@gmail.com
X-Originating-IP: 185.220.101.45
Message-ID: <phish_001@c0rpbank.com>
X-Flag: FLAG{homograph_attack_detected}
MIME-Version: 1.0`}
          </pre>
        )}
      </div>
    );
  }

  function renderCookieMonsterEnv() {
    return (
      <div className="env-shell">
        <div className="env-tab-row">
          <button className={`env-tab ${cookieTab === "cookies" ? "active" : ""}`} onClick={() => setCookieTab("cookies")}>Cookies</button>
          <button className={`env-tab ${cookieTab === "decoder" ? "active" : ""}`} onClick={() => setCookieTab("decoder")}>Decoder</button>
        </div>

        {cookieTab === "cookies" ? (
          <div className="cookie-table">
            <div><span>Name:</span> session_token</div>
            <div><span>Value:</span> {cookieInput}</div>
            <div><span>Domain:</span> bank.internal</div>
            <div><span>HttpOnly:</span> false</div>
          </div>
        ) : (
          <div className="decoder-pane">
            <label>Cookie (Base64)</label>
            <input className="env-input" value={cookieInput} onChange={(event) => setCookieInput(event.target.value)} />
            <div className="env-btn-row">
              <button className="btn-solid env-btn" onClick={decodeCookiePayload}>DECODE</button>
              <button className="btn-solid env-btn" onClick={encodeCookiePayload}>ENCODE</button>
              <button className="btn-solid env-btn" onClick={applyCookiePayload}>APPLY COOKIE</button>
            </div>
            <label>Decoded Output</label>
            <pre className="env-code">{decodedCookieText}</pre>
            <label>Editable JSON</label>
            <textarea className="env-textarea" value={cookieJson} onChange={(event) => setCookieJson(event.target.value)} />
          </div>
        )}

        {cookieStatus && <div className="env-msg warning">{cookieStatus}</div>}

        {cookieAdminUnlocked && (
          <div className="bank-admin-panel">
            <div className="bank-admin-head">
              <span>CorpBank Internal Dashboard</span>
              <span className="flag-chip">FLAG{`{session_fixation_pwned}`}</span>
            </div>
            <p>Privileged admin session established.</p>
          </div>
        )}
      </div>
    );
  }

  function renderXssploitEnv() {
    return (
      <div className="env-shell">
        <h4 className="env-title">💬 Leave a comment:</h4>
        <div className="env-btn-row">
          <input
            className="env-input"
            value={xssInput}
            onChange={(event) => setXssInput(event.target.value)}
            placeholder="Type your comment or payload"
          />
          <button className="btn-solid env-btn" onClick={postXssComment}>POST COMMENT</button>
        </div>

        <div className="xss-comments">
          {xssComments.map((comment, index) => (
            <div key={`${comment}-${index}`} className="xss-comment">— &quot;{comment}&quot;</div>
          ))}
        </div>

        <button className={`env-link-btn ${!xssCookieVisible ? "disabled" : ""}`} disabled={!xssCookieVisible}>
          🍪 View Page Cookies
        </button>
        {xssCookieVisible && <div className="env-code">admin_session=FLAG{"{"}xss_cookie_stolen{"}"}</div>}

        {xssAlertText && (
          <div className="fake-alert">
            <div className="fake-alert-title">JavaScript Alert:</div>
            <div className="fake-alert-body">{xssAlertText}</div>
            <button className="btn-solid env-btn" onClick={() => setXssAlertText(null)}>OK</button>
          </div>
        )}
      </div>
    );
  }

  function renderMitmEnv() {
    return (
      <div className="env-shell">
        <div className="env-btn-row mitm-filter-row">
          <span>Filter:</span>
          <input className="env-input" value={mitmFilterInput} onChange={(event) => setMitmFilterInput(event.target.value)} />
          <button className="btn-solid env-btn" onClick={() => setMitmFilterApplied(mitmFilterInput)}>APPLY</button>
        </div>

        <div className="packet-table-wrap">
          <table className="packet-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Time</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Protocol</th>
                <th>Info</th>
              </tr>
            </thead>
            <tbody>
              {visibleMitmPackets.map((packet) => (
                <tr
                  key={packet.no}
                  className={selectedPacketNo === packet.no ? "selected" : ""}
                  onClick={() => setSelectedPacketNo(packet.no)}
                >
                  <td>{packet.no}</td>
                  <td>{packet.time}</td>
                  <td>{packet.src}</td>
                  <td>{packet.dst}</td>
                  <td>{packet.protocol}</td>
                  <td>{packet.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedPacketNo !== null && (
          <div className="packet-details">
            {selectedPacketNo === 3 && (
              <pre className="env-code scrollable">
{`▼ Hypertext Transfer Protocol
  POST /login HTTP/1.1
  Host: bank.internal
  Authorization: Basic FLAG{arp_poison_cracked}
  Content-Type: application/x-www-form-urlencoded

  username=admin&password=supersecret123`}
              </pre>
            )}

            {(selectedPacketNo === 2 || selectedPacketNo === 4) && (
              <div className="env-msg error">[SUSPICIOUS: Duplicate ARP reply — possible ARP poisoning]</div>
            )}

            {selectedPacketNo !== 2 && selectedPacketNo !== 3 && selectedPacketNo !== 4 && (
              <div className="env-msg warning">Packet expanded. Inspect protocol and headers for anomalies.</div>
            )}
          </div>
        )}
      </div>
    );
  }

  function renderChallengeEnvironment() {
    if (!selectedChallenge) return null;
    if (selectedChallenge.id === "loginbreaker-01") return renderLoginBreakerEnv();
    if (selectedChallenge.id === "phishmaster-01") return renderPhishMasterEnv();
    if (selectedChallenge.id === "cookiemonster-01") return renderCookieMonsterEnv();
    if (selectedChallenge.id === "xssploit-01") return renderXssploitEnv();
    return renderMitmEnv();
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content ctf-theme">
        <div className="dot-bg" />

        <div className="ctf-container">
          <div className="header-strip">
            <div className="h-left">
              <h1 className="orbitron">◈ CTF ARENA 🏆</h1>
              <span className="subtitle">Capture The Flag — Competitive Mode</span>
            </div>
            <div className="h-stats">
              <div className="stat"><span>FLAGS</span> <b>{`${solvedCount}/5`}</b></div>
              <div className="stat"><span>RANK</span> <b>{loading ? "—" : userStats?.rank ? `#${userStats.rank}` : "—"}</b></div>
              <div className="stat highlight"><span>PTS</span> <b>{loading ? "—" : userStats?.totalScore ?? 0}</b></div>
            </div>
          </div>

          <section className="mt-4">
            <h2 className="section-title">◈ ACTIVE CHALLENGES</h2>
            <div className="filter-tabs">
              {(["ALL", "WEB", "FORENSICS", "OSINT"] as ChallengeFilter[]).map((tab) => (
                <button
                  key={tab}
                  className={`filter-tab ${activeFilter === tab ? "active" : ""}`}
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="chal-grid">
              {filteredChallenges.map((challenge) => {
                const progress = challengeProgress[challenge.id];
                return (
                  <div className="chal-card" key={challenge.id}>
                    <span className={`status-pill ${progress.status.toLowerCase()}`}>{progress.status}</span>
                    <div className="badges">
                      <span className="badge" style={{ color: challenge.diffColor, borderColor: challenge.diffColor }}>{challenge.diff}</span>
                      <span className="badge cat">{challenge.category}</span>
                    </div>
                    <h3 className="orbitron">{challenge.name}</h3>
                    <div className="meta">
                      <span className="pts">{challenge.pts} PTS</span>
                      <span className="solves">{challenge.solves} solves</span>
                    </div>
                    <div className="meta secondary">
                      <span className="success-rate">Success Rate</span>
                      <span className="solves">{challenge.successRate}%</span>
                    </div>
                    <button className="btn-solid" onClick={() => handleLaunchChallenge(challenge)}>▶ LAUNCH CHALLENGE</button>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="grid-2 mt-4">
            <section className="glass-panel">
              <h2 className="section-title">◈ LEADERBOARD</h2>
              {loading ? (
                <div className="lb-loading">Loading leaderboard...</div>
              ) : leaderboard.length === 0 ? (
                <div className="lb-loading">No leaderboard data yet. Complete labs to earn points!</div>
              ) : (
                <table className="lb-table">
                  <thead><tr><th>Rank</th><th>Operator</th><th>Level</th><th>Points</th></tr></thead>
                  <tbody>
                    {leaderboard.slice(0, 10).map((entry, index) => {
                      const rank = entry.rank || index + 1;
                      return (
                        <tr key={entry.id || entry.user_id || index} className={rank === userStats?.rank ? "highlight" : ""}>
                          <td>{rank}</td>
                          <td>{entry.name || `OP_${String(rank).padStart(3, "0")}`}</td>
                          <td>Lv.{entry.level || 1}</td>
                          <td>{entry.score || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>

            <section className="glass-panel">
              <h2 className="section-title">◈ YOUR FLAGS</h2>
              <div className="flags-progress-row">
                <span className="flags-progress-text">{solvedCount} of 5 flags captured</span>
                <span className="flags-progress-pct">{progressPct}%</span>
              </div>
              <div className="flags-progress-track">
                <div className="flags-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>

              <div className="flag-grid">
                {CTF_CHALLENGES.map((challenge) => {
                  const progress = challengeProgress[challenge.id];
                  const isSolved = progress.status === "SOLVED";
                  return (
                    <div className={`flag-card ${isSolved ? "captured" : "locked"}`} key={challenge.id}>
                      <span className="f-icon">{isSolved ? "🏁" : "🔒"}</span>
                      <div className="f-info">
                        <h4>{challenge.name}</h4>
                        {isSolved ? (
                          <>
                            <span>{progress.solvedAt ? new Date(progress.solvedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—"}</span>
                            <span>+{progress.earnedPoints ?? challenge.pts} pts</span>
                            <span>{formatTimeTaken(progress.timeTakenMs)} taken</span>
                          </>
                        ) : (
                          <span>Flag slot locked</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {selectedChallenge && selectedProgress && (
          <div className="ctf-modal-overlay" onClick={closeModal}>
            <div className="ctf-modal" onClick={(event) => event.stopPropagation()}>
              <div className="modal-head">
                <div>
                  <h2 className="orbitron modal-title">{selectedChallenge.name}</h2>
                  <div className="modal-submeta">
                    <span className="badge" style={{ color: selectedChallenge.diffColor, borderColor: selectedChallenge.diffColor }}>{selectedChallenge.diff}</span>
                    <span className="badge cat">{selectedChallenge.category}</span>
                    <span className="badge cat">{selectedChallenge.pts} PTS</span>
                    <span className="badge cat">{selectedChallenge.solves} solves</span>
                  </div>
                </div>

                <div className="modal-right">
                  {selectedChallenge.timerMinutes && remainingMs !== null && (
                    <div className={`timer ${remainingMs <= 5 * 60_000 ? "danger" : ""}`}>
                      ⏱ {formatCountdown(remainingMs)}
                    </div>
                  )}
                  <button className="modal-close" onClick={closeModal}>✕</button>
                </div>
              </div>

              {isTimerExpired && (
                <div className="timer-expired-banner">⏰ Time&apos;s up — 50% points awarded on correct flag</div>
              )}

              <div className="modal-split">
                <div className="modal-left">
                  <section className="modal-panel">
                    <h3 className="section-title">◈ DESCRIPTION</h3>
                    <p className="challenge-description">{selectedChallenge.description}</p>
                  </section>

                  <section className="modal-panel">
                    <h3 className="section-title">◈ HINTS</h3>
                    {selectedProgress.hintsUnlocked < 3 ? (
                      <button className="btn-solid hint-btn" onClick={handleUnlockHint}>
                        🔒 Unlock Hint {selectedProgress.hintsUnlocked + 1} (-25 pts)
                      </button>
                    ) : (
                      <div className="hint-done">All hints unlocked</div>
                    )}
                    <div className="hint-list">
                      {selectedChallenge.hints.slice(0, selectedProgress.hintsUnlocked).map((hint, index) => (
                        <div key={`${selectedChallenge.id}-hint-${index}`} className="hint-item">
                          <span className="hint-index">Hint {index + 1}</span>
                          <p>{hint}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="modal-panel">
                    <h3 className="section-title">◈ FLAG SUBMISSION</h3>
                    <div className="flag-submit-row">
                      <input
                        className="flag-input"
                        placeholder="FLAG{...}"
                        value={flagInput}
                        onChange={(event) => setFlagInput(event.target.value)}
                      />
                      <button className="btn-solid" onClick={handleSubmitFlag}>SUBMIT FLAG</button>
                      <button className="btn-next" onClick={handleNextChallenge}>
                        {isLastSelectedChallenge ? "FINISH" : "NEXT CHALLENGE"}
                      </button>
                    </div>
                    {flagMessage && <div className={`flag-message ${flagMessage.type}`}>{flagMessage.text}</div>}
                  </section>
                </div>

                <div className="modal-right-panel">
                  <h3 className="section-title">◈ SIMULATED ENVIRONMENT</h3>
                  {renderChallengeEnvironment()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        body { background: #0a1628; margin: 0; padding: 0; color: #fff; font-family: 'Exo 2', sans-serif; }
        .orbitron { font-family: 'Orbitron', sans-serif; }
        .layout { display: flex; width: 100vw; height: 100vh; overflow: hidden; }
        .main-content { margin-left: 220px; width: calc(100vw - 220px); height: 100vh; overflow-y: auto; position: relative; }

        .ctf-theme .dot-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background-image: radial-gradient(rgba(255, 68, 68, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .ctf-container { padding: 30px; display: flex; flex-direction: column; gap: 24px; max-width: 1400px; margin: 0 auto; }

        .header-strip { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(255,68,68,0.2), rgba(0,0,0,0.3)); padding: 24px; border-left: 4px solid #ff4444; }
        .h-left h1 { margin: 0 0 8px 0; font-size: 1.8rem; color: #ff4444; text-shadow: 0 0 10px rgba(255,68,68,0.4); }
        .subtitle { font-family: 'Share Tech Mono'; color: #c8e6f0; }

        .h-stats { display: flex; gap: 20px; }
        .stat { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,68,68,0.3); padding: 12px 20px; display: flex; flex-direction: column; align-items: center; border-radius: 4px; }
        .stat span { font-family: 'Share Tech Mono'; font-size: 0.75rem; color: #888; }
        .stat b { font-family: 'Orbitron'; font-size: 1.2rem; color: #fff; margin-top: 4px; }
        .stat.highlight { border-color: #ff4444; background: rgba(255,68,68,0.1); }
        .stat.highlight b { color: #ff4444; text-shadow: 0 0 10px rgba(255,68,68,0.5); }

        .section-title { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #ff4444; margin-top: 0; margin-bottom: 20px; }
        .mt-4 { margin-top: 20px; }
        .grid-2 { display: grid; grid-template-columns: 3fr 2fr; gap: 24px; }

        .filter-tabs { display: flex; gap: 20px; margin-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .filter-tab {
          background: none;
          border: none;
          color: #6b86a0;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          letter-spacing: 0.8px;
          padding: 0 0 10px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }
        .filter-tab.active { color: #00d4ff; border-bottom-color: #00d4ff; }

        .glass-panel { background: #091a2e; border: 1px solid rgba(255, 68, 68, 0.2); padding: 24px; border-radius: 4px; position: relative; }

        .chal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .chal-card { background: #050f1c; border: 1px solid rgba(255,68,68,0.3); padding: 20px; display: flex; flex-direction: column; gap: 12px; transition: transform 0.2s; position: relative; }
        .chal-card:hover { transform: translateY(-3px); border-color: #ff4444; box-shadow: 0 5px 15px rgba(255,68,68,0.1); }
        .status-pill {
          position: absolute;
          top: 14px;
          right: 14px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.66rem;
          padding: 4px 8px;
          border-radius: 10px;
          border: 1px solid;
          letter-spacing: 0.7px;
        }
        .status-pill.unsolved { color: #888; border-color: #666; background: rgba(255,255,255,0.06); }
        .status-pill.attempted { color: #ffb86b; border-color: #ff9c3f; background: rgba(255,156,63,0.12); }
        .status-pill.solved { color: #00ff88; border-color: rgba(0,255,136,0.45); background: rgba(0,255,136,0.12); }
        .badges { display: flex; gap: 8px; }
        .badge { font-family: 'Share Tech Mono'; font-size: 0.7rem; padding: 2px 8px; border: 1px solid; border-radius: 12px; }
        .badge.cat { color: #ccc; border-color: rgba(255,255,255,0.2); }
        .chal-card h3 { margin: 0; font-size: 1.2rem; color: #fff; }
        .meta { display: flex; justify-content: space-between; font-family: 'Share Tech Mono'; font-size: 0.9rem; }
        .meta.secondary { font-size: 0.8rem; color: #8aa1b5; }
        .pts { color: #ff4444; font-weight: bold; }
        .solves { color: #6b86a0; }
        .success-rate { color: #8aa1b5; }
        .btn-solid { margin-top: auto; background: rgba(255,68,68,0.1); border: 1px solid #ff4444; color: #ff4444; font-family: 'Orbitron'; font-weight: bold; padding: 10px; cursor: pointer; transition: all 0.2s; clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%); }
        .btn-solid:hover { background: #ff4444; color: #000; box-shadow: 0 0 15px rgba(255,68,68,0.4); }

        .lb-table { width: 100%; border-collapse: collapse; font-family: 'Share Tech Mono'; font-size: 0.9rem; text-align: left; }
        .lb-table th { color: #ff4444; padding: 12px 10px; border-bottom: 1px solid rgba(255,68,68,0.3); }
        .lb-table td { padding: 12px 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .lb-table tr.highlight { background: rgba(255,68,68,0.1); border-left: 3px solid #ff4444; }
        .lb-table tr.highlight td { color: #ff8888; font-weight: bold; text-shadow: 0 0 5px rgba(255,68,68,0.3); }
        .lb-loading { font-family: 'Share Tech Mono'; font-size: 0.9rem; color: #6b86a0; padding: 20px 0; text-align: center; }

        .flags-progress-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .flags-progress-text, .flags-progress-pct { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #c8e6f0; }
        .flags-progress-track { width: 100%; height: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.35); margin-bottom: 16px; border-radius: 10px; overflow: hidden; }
        .flags-progress-fill { height: 100%; background: linear-gradient(90deg, #ff4444, #ff8888); }
        .flag-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .flag-card { padding: 16px; border: 1px solid; display: flex; align-items: center; gap: 16px; }
        .flag-card.captured { background: rgba(0,255,136,0.05); border-color: rgba(0,255,136,0.3); }
        .f-icon { font-size: 1.5rem; }
        .f-info { display: flex; flex-direction: column; }
        .f-info h4 { margin: 0 0 4px 0; font-family: 'Share Tech Mono'; font-size: 0.9rem; color: #fff; }
        .f-info span { font-family: 'Share Tech Mono'; font-size: 0.75rem; color: #00ff88; }
        .flag-card.locked { background: rgba(0,0,0,0.2); border-color: #333; color: #666; opacity: 0.7; }
        .flag-card.locked .f-info h4, .flag-card.locked .f-info span { color: #6b7681; }

        .ctf-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 12, 20, 0.88);
          backdrop-filter: blur(4px);
          z-index: 2500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .ctf-modal {
          width: min(1280px, 100%);
          max-height: calc(100vh - 48px);
          overflow-y: auto;
          background: #091a2e;
          border: 1px solid rgba(255,68,68,0.35);
          box-shadow: 0 0 30px rgba(255,68,68,0.2);
          border-radius: 6px;
          padding: 24px;
        }

        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 14px;
          margin-bottom: 14px;
        }

        .modal-title { margin: 0 0 12px 0; color: #fff; font-size: 1.4rem; }
        .modal-submeta { display: flex; flex-wrap: wrap; gap: 8px; }
        .modal-right { display: flex; align-items: center; gap: 12px; }

        .timer {
          font-family: 'Share Tech Mono', monospace;
          color: #ffcc00;
          font-size: 0.9rem;
          padding: 6px 10px;
          border: 1px solid rgba(255,204,0,0.4);
          background: rgba(255,204,0,0.08);
          border-radius: 6px;
        }
        .timer.danger {
          color: #ff4444;
          border-color: rgba(255,68,68,0.4);
          background: rgba(255,68,68,0.12);
        }

        .modal-close {
          background: transparent;
          border: 1px solid rgba(255,68,68,0.4);
          color: #ff8888;
          width: 34px;
          height: 34px;
          cursor: pointer;
          font-size: 1.1rem;
          border-radius: 4px;
        }

        .timer-expired-banner {
          font-family: 'Share Tech Mono', monospace;
          border: 1px solid rgba(255,68,68,0.45);
          color: #ff8a8a;
          background: rgba(255,68,68,0.14);
          padding: 10px 12px;
          margin-bottom: 12px;
        }

        .modal-split {
          display: grid;
          grid-template-columns: 40% 60%;
          gap: 16px;
          align-items: start;
        }

        .modal-left, .modal-right-panel {
          display: grid;
          gap: 12px;
        }

        .modal-panel {
          background: #050f1c;
          border: 1px solid rgba(255,68,68,0.22);
          padding: 16px;
          border-radius: 4px;
        }

        .challenge-description { margin: 0; font-family: 'Share Tech Mono', monospace; color: #c8e6f0; line-height: 1.6; font-size: 0.92rem; }

        .hint-btn { margin-top: 0; margin-bottom: 12px; width: 100%; }
        .hint-done { font-family: 'Share Tech Mono', monospace; color: #00ff88; font-size: 0.85rem; margin-bottom: 10px; }
        .hint-list { display: flex; flex-direction: column; gap: 10px; }
        .hint-item { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); padding: 10px 12px; }
        .hint-index { font-family: 'Share Tech Mono', monospace; color: #ffcc00; font-size: 0.75rem; }
        .hint-item p { margin: 6px 0 0 0; color: #d4e3ec; font-size: 0.9rem; }

        .flag-submit-row { display: grid; grid-template-columns: 1fr; gap: 10px; align-items: center; }
        .flag-input {
          background: #050f1c;
          border: 1px solid rgba(255,68,68,0.35);
          color: #fff;
          padding: 11px 12px;
          outline: none;
          font-family: 'Share Tech Mono', monospace;
        }
        .flag-input:focus { border-color: #ff4444; box-shadow: 0 0 0 2px rgba(255,68,68,0.15); }
        .btn-next {
          background: rgba(0,212,255,0.1);
          border: 1px solid #00d4ff;
          color: #00d4ff;
          font-family: 'Orbitron';
          font-weight: bold;
          padding: 10px;
          cursor: pointer;
          transition: all 0.2s;
          clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
        }
        .btn-next:hover { background: #00d4ff; color: #000; box-shadow: 0 0 12px rgba(0,212,255,0.35); }

        .flag-message { margin-top: 12px; font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; padding: 10px; border: 1px solid; }
        .flag-message.success { color: #00ff88; border-color: rgba(0,255,136,0.4); background: rgba(0,255,136,0.08); }
        .flag-message.error { color: #ff8888; border-color: rgba(255,68,68,0.4); background: rgba(255,68,68,0.1); }

        .env-shell {
          background: #050f1c;
          border: 1px solid rgba(255, 68, 68, 0.22);
          border-radius: 4px;
          padding: 14px;
          display: grid;
          gap: 12px;
        }

        .env-title {
          margin: 0;
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          color: #dfefff;
        }

        .env-login-grid,
        .decoder-pane {
          display: grid;
          gap: 8px;
        }

        .env-login-grid label,
        .decoder-pane label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.78rem;
          color: #95aec4;
        }

        .env-input,
        .env-textarea {
          width: 100%;
          background: #071428;
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #fff;
          padding: 9px 10px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.86rem;
          outline: none;
        }

        .env-textarea {
          min-height: 84px;
          resize: vertical;
        }

        .env-btn-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }

        .env-btn {
          margin-top: 0;
          padding: 8px 12px;
          font-size: 0.78rem;
        }

        .env-link-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.25);
          color: #9cc3df;
          padding: 8px 10px;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.78rem;
          width: fit-content;
        }

        .env-link-btn.disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .env-msg {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.84rem;
          padding: 10px;
          border: 1px solid;
          border-radius: 4px;
        }

        .env-msg.success {
          color: #00ff88;
          border-color: rgba(0,255,136,0.45);
          background: rgba(0,255,136,0.1);
        }

        .env-msg.error {
          color: #ff8b8b;
          border-color: rgba(255,68,68,0.45);
          background: rgba(255,68,68,0.12);
        }

        .env-msg.warning {
          color: #ffd98a;
          border-color: rgba(255,204,0,0.45);
          background: rgba(255,204,0,0.12);
        }

        .env-code {
          margin: 0;
          white-space: pre-wrap;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          line-height: 1.55;
          color: #d8ecff;
          background: #020811;
          border: 1px solid rgba(255,255,255,0.14);
          padding: 10px;
        }

        .env-code.scrollable {
          max-height: 220px;
          overflow: auto;
        }

        .env-tab-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .env-tab {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.2);
          color: #91b0c7;
          padding: 8px 10px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.78rem;
          cursor: pointer;
        }

        .env-tab.active {
          color: #00d4ff;
          border-color: rgba(0,212,255,0.5);
          background: rgba(0,212,255,0.1);
        }

        .email-card {
          background: #071225;
          border: 1px solid rgba(255,255,255,0.14);
          padding: 12px;
          display: grid;
          gap: 6px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.82rem;
          color: #d3e8fa;
        }

        .email-card hr { width: 100%; border: none; border-top: 1px solid rgba(255,255,255,0.15); }

        .cookie-table {
          display: grid;
          gap: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.82rem;
        }

        .cookie-table span { color: #9ec2da; margin-right: 8px; }

        .bank-admin-panel {
          border: 1px solid rgba(0,255,136,0.4);
          background: rgba(0,255,136,0.1);
          padding: 12px;
          display: grid;
          gap: 8px;
        }

        .bank-admin-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          font-family: 'Share Tech Mono', monospace;
        }

        .flag-chip {
          color: #00ff88;
          border: 1px solid rgba(0,255,136,0.4);
          background: rgba(0,255,136,0.12);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .xss-comments {
          display: grid;
          gap: 6px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.82rem;
          color: #cedfeb;
          border: 1px solid rgba(255,255,255,0.1);
          background: #071225;
          padding: 10px;
        }

        .fake-alert {
          border: 1px solid rgba(255,204,0,0.5);
          background: rgba(255,204,0,0.1);
          padding: 12px;
          display: grid;
          gap: 8px;
        }

        .fake-alert-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.85rem;
          color: #ffcc00;
        }

        .fake-alert-body {
          font-family: 'Share Tech Mono', monospace;
          color: #ffe8ad;
          word-break: break-all;
        }

        .mitm-filter-row span {
          font-family: 'Share Tech Mono', monospace;
          color: #9ec2da;
          font-size: 0.82rem;
        }

        .packet-table-wrap {
          max-height: 280px;
          overflow: auto;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .packet-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.76rem;
        }

        .packet-table th,
        .packet-table td {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 8px 7px;
          text-align: left;
          white-space: nowrap;
        }

        .packet-table tr { cursor: pointer; }
        .packet-table tr.selected { background: rgba(0,212,255,0.12); }

        .packet-details {
          margin-top: 6px;
        }

        @media (max-width: 1200px) {
          .chal-grid { grid-template-columns: repeat(2, 1fr); }
          .grid-2 { grid-template-columns: 1fr; }
          .modal-split { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .chal-grid { grid-template-columns: 1fr; }
          .h-stats { gap: 10px; }
          .header-strip { flex-direction: column; align-items: flex-start; gap: 14px; }
          .ctf-modal-overlay { padding: 12px; }
          .ctf-modal { padding: 14px; }
        }
      `}</style>
    </div>
  );
}
