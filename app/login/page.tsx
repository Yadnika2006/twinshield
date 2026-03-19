"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added import
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter(); // Added useRouter initialization

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  // ── Matrix Rain Animation ─────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    // Cyberpunk green, matching the landing page Theme
    const color = "rgba(0, 255, 136, 0.2)";

    const draw = () => {
      ctx.fillStyle = "rgba(10, 22, 40, 0.1)"; // Dark trail
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const intervalId = setInterval(draw, 50);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Re-initialize drops array on resize
      const newCols = Math.floor(width / fontSize);
      drops.length = 0;
      drops.push(...Array(newCols).fill(1));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Added submit handlers
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      alert("Invalid credentials");
      return;
    }

    window.location.href = result?.url || "/dashboard";
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const role = String(formData.get("role") || "student");

    if (!name || !email || !password) {
      alert("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const registerResponse = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const registerData = await registerResponse.json().catch(() => ({}));
    if (!registerResponse.ok) {
      alert(registerData?.error || "Registration failed");
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (signInResult?.error) {
      alert("Account created, but login failed. Please login manually.");
      return;
    }

    window.location.href = signInResult?.url || "/dashboard";
  };

  return (
    <div className="wrapper">
      <canvas ref={canvasRef} className="matrix-bg" />
      <div className="grid-overlay" />

      {/* Main Centered Container */}
      <div className="auth-container">
        <div className="auth-card">
          {/* Top Gradient Border */}
          <div className="card-top-border" />

          {/* Form Header (Logo) */}
          <div className="logo-box">
            <Link href="/" className="logo-link">
              <span style={{ fontSize: "1.5rem", marginRight: "8px" }}>⬡</span>
              TWINSHIELD
            </Link>
          </div>

          {/* 
            Mode Toggle Container (Relative)
            We stack both forms on top of each other and fade/slide them
          */}
          <div className="forms-wrapper">

            {/* ── LOGIN FORM ───────────────────────── */}
            <form
              className={`auth-form ${isLoginMode ? "active" : "inactive-out"}`}
              onSubmit={handleLoginSubmit} // Updated onSubmit
            >
              <div className="heading-box">
                <h2 className="orbitron-title login-color">AUTHENTICATE</h2>
                <p className="subheading">Access your lab</p>
              </div>

              <div className="input-group">
                <label>OPERATOR ID</label>
                <input name="email" type="email" placeholder="agent@twinshield.net" required />
              </div>

              <div className="input-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <label>ACCESS KEY</label>
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>
                <input name="password" type="password" placeholder="••••••••" required />
              </div>

              <button type="submit" className="btn btn-login shimmer">
                <span>▶ INITIALIZE SESSION</span>
              </button>

              <div className="divider">
                <span>— or continue with —</span>
              </div>

              <button type="button" className="btn btn-oauth shimmer-white">
                <GoogleIcon />
                <span>GOOGLE</span>
              </button>

              <div className="toggle-text">
                New operator?{" "}
                <button type="button" className="toggle-btn" onClick={() => setIsLoginMode(false)}>
                  Register Access &rarr;
                </button>
              </div>
            </form>

            {/* ── SIGNUP FORM ──────────────────────── */}
            <form
              className={`auth-form ${!isLoginMode ? "active" : "inactive-in"}`}
              onSubmit={handleSignupSubmit} // Updated onSubmit
            >
              <div className="heading-box">
                <h2 className="orbitron-title register-color">REGISTER</h2>
                <p className="subheading">Create your operator profile</p>
              </div>

              <div className="input-group">
                <label>OPERATOR NAME</label>
                <input name="name" type="text" placeholder="John Doe" required />
              </div>

              <div className="input-group">
                <label>OPERATOR ID</label>
                <input name="email" type="email" placeholder="agent@twinshield.net" required />
              </div>

              {/* Grid split for passwords */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="input-group">
                  <label>ACCESS KEY</label>
                  <input name="password" type="password" placeholder="••••••••" required />
                </div>
                <div className="input-group">
                  <label>CONFIRM KEY</label>
                  <input name="confirmPassword" type="password" placeholder="••••••••" required />
                </div>
              </div>

              <div className="input-group">
                <label>ROLE</label>
                <select required className="styled-select" name="role" defaultValue="">
                  <option value="" disabled>Select Designation...</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="ctf">CTF Competitor</option>
                </select>
              </div>

              <button type="submit" className="btn btn-register shimmer">
                <span>▶ CREATE PROFILE</span>
              </button>

              <div className="divider">
                <span>— or continue with —</span>
              </div>

              <button type="button" className="btn btn-oauth shimmer-white">
                <GoogleIcon />
                <span>GOOGLE</span>
              </button>

              <div className="toggle-text">
                Already registered?{" "}
                <button type="button" className="toggle-btn" onClick={() => setIsLoginMode(true)}>
                  Login &rarr;
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

      {/* ── STYLES ────────────────────────────────────────────── */}
      <style jsx global>{`
        /* Core Reset & Fonts */
        :root {
          --bg: #0a1628;
          --panel: #091a2e;
          --border: rgba(0, 212, 255, 0.2);
          --blue: #00d4ff;
          --green: #00ff88;
          --text: #c8e6f0;
          --muted: #6b86a0;
        }

        .wrapper {
          position: relative;
          width: 100vw;
          min-height: 100vh;
          overflow-x: hidden;
          background-color: var(--bg);
          font-family: 'Exo 2', sans-serif;
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .matrix-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.6;
          pointer-events: none;
        }

        .grid-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
          background-size: 30px 30px;
          z-index: 1;
          pointer-events: none;
        }

        .auth-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
        }

        .auth-card {
          background: rgba(9, 26, 46, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          padding: 40px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
        }

        .card-top-border {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, var(--blue), var(--green));
        }

        .logo-box {
          text-align: center;
          margin-bottom: 30px;
        }

        .logo-link {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 1.4rem;
          color: #fff;
          text-decoration: none;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .forms-wrapper {
          position: relative;
          /* Minimum height to prevent card from shrinking too much on toggle */
          min-height: 480px; 
          display: grid;
        }

        /* 
          CSS Grid trick for overlaying forms perfectly. 
          Both forms occupy the same grid area [1, 1] 
        */
        .auth-form {
          grid-area: 1 / 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Form Animation States */
        .auth-form.active {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
          visibility: visible;
        }

        /* When sliding OUT to the left */
        .auth-form.inactive-out {
          opacity: 0;
          transform: translateX(-40px);
          pointer-events: none;
          visibility: hidden;
        }

        /* When sliding OUT to the right */
        .auth-form.inactive-in {
          opacity: 0;
          transform: translateX(40px);
          pointer-events: none;
          visibility: hidden;
        }

        .heading-box {
          margin-bottom: 10px;
        }

        .orbitron-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }

        .login-color { color: var(--blue); }
        .register-color { color: var(--green); }

        .subheading {
          font-family: 'Share Tech Mono', monospace;
          color: var(--muted);
          font-size: 0.9rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-group label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: var(--muted);
          letter-spacing: 1px;
        }

        .forgot-link {
          font-size: 0.75rem;
          color: var(--blue);
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .forgot-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        /* Polygon shape inputs */
        input, .styled-select {
          background: #050f1c;
          border: 1px solid rgba(0, 212, 255, 0.3);
          color: #fff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          padding: 12px 14px;
          outline: none;
          width: 100%;
          /* Cut off top-right and bottom-left corners */
          clip-path: polygon(
            0 8px,
            8px 0,
            100% 0,
            100% calc(100% - 8px),
            calc(100% - 8px) 100%,
            0 100%
          );
          transition: all 0.3s ease;
        }

        input::placeholder {
          color: rgba(200, 230, 240, 0.2);
        }

        input:focus, .styled-select:focus {
          border-color: var(--blue);
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
          background: rgba(0, 212, 255, 0.05);
        }

        /* Firefox specific select styling to look normal */
        .styled-select option {
          background: var(--panel);
          color: #fff;
        }

        /* Buttons */
        .btn {
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
          clip-path: polygon(
            0 10px,
            10px 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%
          );
          transition: transform 0.2s;
        }

        .btn:active {
          transform: scale(0.98);
        }

        .btn span {
          position: relative;
          z-index: 2;
        }

        .btn-login {
          background: linear-gradient(90deg, var(--blue), var(--green));
        }

        .btn-register {
          background: linear-gradient(90deg, var(--green), var(--blue));
        }

        .btn-oauth {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
          /* Undo the clip path border issue by using fake borders, but for simplicity we keep solid background */
          background: rgba(255, 255, 255, 0.03);
          box-shadow: inset 0 0 0 1px var(--border);
        }

        .btn-oauth:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        /* Shimmer Effect on Hover */
        .shimmer::after, .shimmer-white::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: skewX(-20deg);
          z-index: 1;
        }
        
        .shimmer-white::after {
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
        }

        .btn:hover::after {
          animation: sweep 0.6s ease-out;
        }

        @keyframes sweep {
          100% { left: 200%; }
        }

        .divider {
          text-align: center;
          position: relative;
          margin: 10px 0;
        }

        .divider span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: var(--muted);
          background: rgba(9, 26, 46, 0.85); /* hide the line behind text */
          padding: 0 10px;
          position: relative;
          z-index: 1;
        }

        .divider::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--border);
          z-index: 0;
        }

        .toggle-text {
          text-align: center;
          font-size: 0.85rem;
          color: var(--muted);
          margin-top: 10px;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: var(--text);
          font-family: 'Exo 2', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: none;
        }

        .toggle-btn:hover {
          color: #fff;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .auth-card { padding: 30px 20px; }
          .wrapper { padding: 10px; }
        }
      `}</style>
    </div>
  );
}

// Simple inline SVG for Google Icon
function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      style={{ position: 'relative', zIndex: 2 }}
    >
      <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
